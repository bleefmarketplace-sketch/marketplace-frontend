"use client";

import React, {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useRef,
  useState,
} from "react";

import { PendingAction, Product } from "@/components/types";

/* ------------------------------------------------------------------ */
/* Types */
/* ------------------------------------------------------------------ */

interface CartItem {
  product: Product;
  quantity: number;
  image: string;
}

type ActiveTab = "All" | "Best Sellers" | "New Arrivals";

interface BuyerContextValue {
  // Navigation (UI-level only)
  currentView: string;
  setCurrentView: (view: string) => void;

  // Core state
  selectedProduct: Product | null;
  setSelectedProduct: (p: Product | null) => void;

  cart: CartItem[];
  setCart: React.Dispatch<React.SetStateAction<CartItem[]>>;
  wishlist: Product[];
  notification: string | null;

  // Filters
  searchQuery: string;
  selectedCategory: string;
  activeTab: ActiveTab;
  priceRange: { min: string; max: string };

  filteredProducts: Product[];

  // Actions
  addToCart: (product: Product) => void;
  toggleWishlist: (product: Product) => void;
  clearNotification: () => void;

  setSearchQuery: (v: string) => void;
  setSelectedCategory: (v: string) => void;
  setActiveTab: (v: ActiveTab) => void;
  setPriceRange: (v: { min: string; max: string }) => void;

  // Cross-route action handler
  handlePendingAction: (
    action: PendingAction | null,
    navigate: (path: string) => void,
    clear: () => void
  ) => void;
}

/* ------------------------------------------------------------------ */
/* Context */
/* ------------------------------------------------------------------ */

const BuyerContext = createContext<BuyerContextValue | null>(null);

export const useBuyer = () => {
  const ctx = useContext(BuyerContext);
  if (!ctx) {
    throw new Error("useBuyer must be used within BuyerProvider");
  }
  return ctx;
};

/* ------------------------------------------------------------------ */
/* Provider */
/* ------------------------------------------------------------------ */

interface BuyerProviderProps {
  children: React.ReactNode;
  initialView?: string;
}

export const BuyerProvider: React.FC<BuyerProviderProps> = ({
  children,
  initialView = "home",
}) => {
  /* -------------------- State -------------------- */

  const [currentView, setCurrentView] = useState(initialView);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  const [cart, setCart] = useState<CartItem[]>([]);
  const [wishlist, setWishlist] = useState<Product[]>([]);
  const [notification, setNotification] = useState<string | null>(null);

  // Filters
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [activeTab, setActiveTab] = useState<ActiveTab>("All");
  const [priceRange, setPriceRange] = useState({ min: "", max: "" });

  /* -------------------- Actions -------------------- */

  const addToCart = useCallback((product: Product) => {
    setCart((prev) => {
      const existing = prev.find((p) => p.product.id === product.id);
      if (existing) {
        return prev.map((p) =>
          p.product.id === product.id
            ? { ...p, quantity: p.quantity + 1 }
            : p
        );
      }
      return [...prev, {
        product,
        quantity: 1,
        image: product.image || "/placeholder.png",
      },];
    });

    setNotification(`Added ${product.title} to cart`);
  }, []);

  const toggleWishlist = (product: Product) => {
    setWishlist((prev) => {
      const exists = prev.some((p) => p.id === product.id);
      setNotification(
        exists ? "Removed from wishlist" : "Added to wishlist"
      );
      return exists
        ? prev.filter((p) => p.id !== product.id)
        : [...prev, product];
    });
  };

  const clearNotification = () => setNotification(null);

  /* -------------------- Pending Action Handler -------------------- */
  /**
   * Safe to call during render.
   * Will only execute ONCE per action.
   */
  const handledActionRef = useRef<PendingAction | null>(null);


  const handlePendingAction = useCallback(
    (
      action: PendingAction | null,
      navigate: (path: string) => void,
      clear: () => void
    ) => {
      if (!action) return;
      if (handledActionRef.current === action) return;

      handledActionRef.current = action;

      switch (action.type) {
        case "cart":
          if (action.data) {
            addToCart(action.data as Product);
          }
          navigate("/buyer/cart");
          break;

        case "join":
          setNotification(`Successfully joined ${action.data.name}!`);
          navigate("/buyer/community");
          break;

        case "enroll":
          setNotification(`Enrolled in ${action.data.title}`);
          navigate("/buyer/courses");
          break;
      }

      clear();
    },
    [addToCart]
  );


  /* -------------------- Derived Data -------------------- */

  const filteredProducts = useMemo(() => {
    return [];

  }, [

  ]);

  /* -------------------- Context Value -------------------- */

  const value = useMemo(
    () => ({
      currentView,
      setCurrentView,
      selectedProduct,
      setSelectedProduct,
      cart,
      wishlist,
      notification,
      searchQuery,
      selectedCategory,
      activeTab,
      priceRange,
      filteredProducts,
      addToCart,
      toggleWishlist,
      clearNotification,
      setSearchQuery,
      setSelectedCategory,
      setActiveTab,
      setPriceRange,
      handlePendingAction,
      setCart
    }),
    [
      addToCart,
      currentView,
      selectedProduct,
      cart,
      wishlist,
      notification,
      searchQuery,
      selectedCategory,
      activeTab,
      priceRange,
      filteredProducts,
      handlePendingAction,
      setCart
    ]
  );

  return (
    <BuyerContext.Provider value={value}>
      {children}
    </BuyerContext.Provider>
  );
};
