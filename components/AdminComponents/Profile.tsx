"use client";

import React, { useState } from "react";
import { Bell, LogOut, Shield, User } from "lucide-react";

import GeneralSettings from "../GeneralSettings";
import SecuritySettings from "../SecuritySettings";
import NotificationSettings from "../NotificationSettings";

interface UserProfile {
  name: string;
  email: string;
  phone: string;
  location: string;
  bio: string;
  avatar: string;
}

export const Profile = () => {
  const [activeTab, setActiveTab] = useState<
    "general" | "security" | "notifications"
  >("general");

  const [isEditing, setIsEditing] = useState(false);

  // Mock user data (later replace with API)
  const [user, setUser] = useState<UserProfile>({
    name: "Jane Doe",
    email: "jane.doe@example.com",
    phone: "+1 (555) 123-4567",
    location: "Iowa, USA",
    bio: "Passionate organic farmer with over 10 years of experience in sustainable agriculture.",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Jane",
  });

  // Reset edit mode when switching tabs
  const handleTabChange = (
    tab: "general" | "security" | "notifications"
  ) => {
    setActiveTab(tab);
    setIsEditing(false);
  };

  const handleSaveProfile = () => {
    // 🔐 later: send `user` to API
    setIsEditing(false);
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Account Settings</h1>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden flex flex-col md:flex-row">
        {/* Sidebar */}
        <aside className="w-full md:w-64 bg-gray-50 border-r border-gray-100 p-2 md:p-4">
          <nav className="flex flex-row md:flex-col gap-1 overflow-x-auto md:overflow-visible">
            <button
              onClick={() => handleTabChange("general")}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors whitespace-nowrap ${
                activeTab === "general"
                  ? "bg-white shadow-sm text-primary-600"
                  : "text-gray-600 hover:bg-gray-100"
              }`}
            >
              <User size={18} />
              General
            </button>

            <button
              onClick={() => handleTabChange("security")}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors whitespace-nowrap ${
                activeTab === "security"
                  ? "bg-white shadow-sm text-primary-600"
                  : "text-gray-600 hover:bg-gray-100"
              }`}
            >
              <Shield size={18} />
              Security
            </button>

            <button
              onClick={() => handleTabChange("notifications")}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors whitespace-nowrap ${
                activeTab === "notifications"
                  ? "bg-white shadow-sm text-primary-600"
                  : "text-gray-600 hover:bg-gray-100"
              }`}
            >
              <Bell size={18} />
              Notifications
            </button>
          </nav>

          <div className="hidden md:block mt-8 pt-8 border-t border-gray-200 px-4">
            <button className="flex items-center gap-3 text-red-600 text-sm font-medium hover:text-red-700">
              <LogOut size={18} />
              Sign Out
            </button>
          </div>
        </aside>

        {/* Content */}
        <section className="flex-1 p-6 md:p-8">
          {activeTab === "general" && (
            <GeneralSettings
              user={user}
              isEditing={isEditing}
              onEdit={() => setIsEditing(true)}
              onCancel={() => setIsEditing(false)}
              onSave={handleSaveProfile}
            />
          )}

          {activeTab === "security" && <SecuritySettings />}

          {activeTab === "notifications" && <NotificationSettings />}
        </section>
      </div>
    </div>
  );
};
