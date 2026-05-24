"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback } from "react";
import { setCookie, getCookie, deleteCookie } from "cookies-next";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { toast } from "react-toastify";
import { decrypt, encrypt } from "@/secure/__enc";

// --- Types ---
export type UserRole = "buyer" | "seller" | "creator" | "admin";

export interface User {
  id: string;
  role: UserRole;
  email: string;
  business_name?: string;
  isOnboarded: boolean;
  isVerified: boolean;
  fullName?: string;
  phoneNumber: string;
  location: string;
  farmName: string;
  farmSize: string;
  address: string;
  areaOfInterest: string[];
  areaOfExpertise: string[];
  userAvatar?: string;
  isTwoFactorEnabled: boolean;
  lifetimeSalesVolume: number;
  hasCreatedStore: boolean;
  hasCreatedCreatorProfile: boolean;
}

interface OnboardingData {
  address: string;
  location: string;
  phoneNumber: string;
  role: UserRole;
  farmName?: string;
  farmSize?: string;
  areaOfInterest?: string[];
  areaOfExpertise?: string[];
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  verify2FA: (userId: string, code: string, rememberMe: boolean) => Promise<void>;
  signIn: (email: string, password: string, rememberMe: boolean) => Promise<any>;
  logout: (returnToCurrent?: boolean) => void;
  completeOnboarding: (data: OnboardingData) => Promise<boolean>;
  refreshUserData: () => Promise<void>;
  updateUser: (userData: User) => void;
  switchRole: (role: UserRole) => Promise<boolean>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const COOKIE_USER_KEY = "_user_";
export const COOKIE_TOKEN_KEY = "_tkn_";
export const COOKIE_REFRESH_KEY = "_ref_"

// Helper: Get Cookie Options
export const getCookieOptions = (days = 1) => ({
  secure: process.env.NODE_ENV === "production",
  sameSite: "strict" as const,
  path: "/",
  maxAge: days * 24 * 60 * 60,
});

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // Helper: Persistence
  const updateLocalUser = (userData: User) => {
    setUser(userData);
    setCookie(COOKIE_USER_KEY, JSON.stringify(userData), { path: "/", maxAge: 7 * 24 * 60 * 60 });
  };
  const logout = useCallback(async (returnToCurrent = false) => {

    deleteCookie(COOKIE_USER_KEY);
    deleteCookie(COOKIE_TOKEN_KEY);
    deleteCookie(COOKIE_REFRESH_KEY);
    setUser(null);
    setToken(null);
    // Notify other tabs
    window.localStorage.setItem("logout_event", Date.now().toString());
    await fetch(`/api/auth/logout`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      },

    });
    if (returnToCurrent && pathname !== "/auth/login") {
      router.push(`/auth/login?redirect=${encodeURIComponent(pathname)}`);
    } else {
      router.push("/auth/login");
    }
  }, [pathname, token, router]);

  const refreshUserData = useCallback(async () => {
    try {
      const response = await fetch("/api/users/me"); // Call your proxy route
      const result = await response.json();

      if (response.ok && result.success) {
        updateLocalUser(result.data); // Update state + cookies with fresh data
      } else if (response.status === 401) { 
        logout(true);
      }
    } catch (error) {
      console.log(error)
    }
  }, [ logout]);



  // --- HYBRID STEP 1: INSTANT RESTORATION ---
  const loadUserFromCookies = useCallback(() => {
    setIsLoading(true);
    const storedUser = getCookie(COOKIE_USER_KEY);
    const storedToken = getCookie(COOKIE_TOKEN_KEY);

    if (storedUser && storedToken) {
      try {
        const decryptedToken = decrypt(storedToken as string);
        const parsedUser = JSON.parse(storedUser as string);

        setUser(parsedUser); // UI updates instantly from cookie
        setToken(decryptedToken);

        // After UI is ready, sync with server in background
        refreshUserData();
      } catch (e) {
        logout(true);
      }
    }
    setIsLoading(false);
  }, [refreshUserData]);

  useEffect(() => {
    loadUserFromCookies();

    // Listen for storage changes (cross-tab logout and session/role alignment)
    const syncSession = (e: StorageEvent) => {
      if (e.key === "logout_event") {
        logout();
      } else if (e.key === "login_event") {
        const storedUser = getCookie(COOKIE_USER_KEY);
        const storedToken = getCookie(COOKIE_TOKEN_KEY);

        if (storedUser && storedToken) {
          try {
            const decryptedToken = decrypt(storedToken as string);
            const parsedUser = JSON.parse(storedUser as string);

            setUser(parsedUser);
            setToken(decryptedToken);

            toast.info(`Session updated: Switched to ${parsedUser.role} account.`);
            router.push(`/dashboard/${parsedUser.role.toLowerCase()}`);
          } catch (err) {
            logout(true);
          }
        }
      }
    };
    window.addEventListener("storage", syncSession);
    return () => window.removeEventListener("storage", syncSession);
  }, [loadUserFromCookies, router, logout]);

  const signIn = async (email: string, password: string, rememberMe: boolean): Promise<any> => {
   
    setIsLoading(true);
    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Login failed");

      if (data.mfaRequired) {
        setIsLoading(true)
        return data
      }

      const { user: userData } = data;

      


      // Security Check: Verification
      if (!userData.isEmailVerified) {
        toast.warning("Please verify your email address.");

        await fetch("/api/auth/resend-verification-email", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, password }),
        });

        return;
      }
      handleLoginSuccess(data, rememberMe);

       return data;
    } catch (err: any) {
      toast.error(err.message || "An error occurred");
         return null;
    } finally {
      setIsLoading(false);
    }
  };

  const handleLoginSuccess = (data: any, rememberMe: boolean) => {
     
    const { user: userData, token: rawToken, refreshToken: refreshToken
    } = data;
    const options = getCookieOptions(rememberMe ? 30 : 1);

    setCookie(COOKIE_USER_KEY, JSON.stringify(userData), options);
    setCookie(COOKIE_TOKEN_KEY, encrypt(rawToken), options);
    if (refreshToken) setCookie(COOKIE_REFRESH_KEY, encrypt(refreshToken), options);

    setUser(userData);
    setToken(rawToken);

    // Notify other tabs of the fresh login session
    window.localStorage.setItem("login_event", Date.now().toString());

    console.log(userData)

    if (!userData.isOnboarded) {
      router.push(`/auth/onboarding?u=${userData.id}`);
    } else {
      const rawRedirect = searchParams.get("redirect");
      let redirectUrl = `/dashboard/${userData.role.toLowerCase()}`;
      
      if (rawRedirect && rawRedirect.startsWith("/") && !rawRedirect.includes("://")) {
        redirectUrl = decodeURIComponent(rawRedirect);
      }
      
      router.push(redirectUrl);
    }
  };

  const verify2FA = async (userId: string, code: string, rememberMe: boolean) => {
    setIsLoading(true);
    try {
      const response = await fetch("/api/auth/2FA/authenticate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, code }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Invalid Code");

      handleLoginSuccess(data, rememberMe);
    } catch (err: any) {
      throw err; // Let the Modal handle the error display
    } finally {
      setIsLoading(false);
    }
  };

  const completeOnboarding = async (
    formData: OnboardingData
  ): Promise<boolean> => {
    

    try {
      const response = await fetch(`/api/auth/onboard`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw {
          status: response.status,
          code: data.code,
          message: data.message,
        };
      }

      const updatedUser = {
        ...user,
        ...data.user,
        isOnboarded: true,
      };

      setCookie(COOKIE_USER_KEY, JSON.stringify(updatedUser), getCookieOptions(7));
      setUser(updatedUser);

      toast.success("Profile completed successfully!");
      return true;
    } catch (err: any) {

      switch (err.status) {
        case 401:
          toast.error("Session expired. Please login again.");
          router.replace("/auth/login");
          break;

        case 404:
          toast.error("Account not found. Please register.");
          router.replace("/auth/register");
          break;

        case 409:
          toast.info("You’ve already completed onboarding.");
          router.replace(`/dashboard/${user?.role}`);
          break;

        case 403:
          toast.error("Your account has been suspended.");
          router.replace("/support");
          break;

        default:
          toast.error(err.message || "Failed to save profile");
      }

      return false;
    }
  };

  const switchRole = async (targetRole: UserRole): Promise<boolean> => {
    setIsLoading(true);
    try {
      const response = await fetch("/api/auth/switch-role", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ role: targetRole }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to switch role");
      }

      const { user: userData, token: rawToken, refreshToken: rawRefreshToken } = data;
      const options = getCookieOptions(7);

      setCookie(COOKIE_USER_KEY, JSON.stringify(userData), options);
      setCookie(COOKIE_TOKEN_KEY, encrypt(rawToken), options);
      if (rawRefreshToken) setCookie(COOKIE_REFRESH_KEY, encrypt(rawRefreshToken), options);

      setUser(userData);
      setToken(rawToken);

      // Notify other tabs of role switch
      window.localStorage.setItem("login_event", Date.now().toString());

      toast.success(`Successfully switched to ${targetRole} view!`);
      router.push(`/dashboard/${targetRole.toLowerCase()}`);
      return true;
    } catch (err: any) {
      toast.error(err.message || "Failed to switch role");
      return false;
    } finally {
      setIsLoading(false);
    }
  };



  return (
    <AuthContext.Provider value={{
      user,
      token,
      isAuthenticated: !!token,
      isLoading,
      signIn,
      verify2FA,
      logout: (val) => logout(val),
      completeOnboarding,
      refreshUserData,
      updateUser: updateLocalUser,
      switchRole
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within an AuthProvider");
  return context;
};