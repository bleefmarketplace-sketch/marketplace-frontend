"use client";
import React, { useState } from "react";

import { MapPin, Camera, User, Mail, Phone } from "lucide-react";
import { Input } from "./Input";
import { Button } from "./Button";
import Image from "next/image";

interface UserProfile {
  name: string;
  email: string;
  phone: string;
  location: string;
  bio: string;
  avatar: string;
}

interface GeneralSettingsProps {
    user: UserProfile;
    isEditing: boolean;
    onEdit: () => void;
    onCancel: () => void;
    onSave: () => void;
}

const GeneralSettings: React.FC<GeneralSettingsProps> = ({
    isEditing,
    onEdit,
    onCancel,
    onSave,
}) => {
    const [user, setUser] = useState({
        name: 'Jane Doe',
        email: 'jane.doe@example.com',
        phone: '+1 (555) 123-4567',
        location: 'Iowa, USA',
        bio: 'Passionate organic farmer with over 10 years of experience in sustainable agriculture.',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Jane'
    });


    return (
        <div className="space-y-6 animate-in fade-in duration-300">
            <div className="flex items-start gap-6 flex-col md:flex-row">
                {/* Avatar */}
                <div className="relative group mx-auto md:mx-0">
                    <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-white shadow-lg">
                        <Image
                        unoptimized
                            width={128}
                            height={128}
                            src={user.avatar}
                            alt="Profile"
                            className="w-full h-full object-cover bg-gray-100"
                        />
                    </div>

                    {isEditing && (
                        <button
                            type="button"
                            className="absolute bottom-0 right-0 p-2 bg-primary-600 text-white rounded-full shadow-md hover:bg-primary-700 transition-colors"
                        >
                            <Camera size={18} />
                        </button>
                    )}
                </div>

                {/* Profile fields */}
                <div className="flex-1 space-y-4 w-full">
                    <div className="grid md:grid-cols-2 gap-4">
                        <Input
                            label="Full Name"
                            defaultValue={user.name}
                            icon={<User size={18} />}
                            disabled={!isEditing}
                        />
                        <Input
                            label="Email Address"
                            defaultValue={user.email}
                            icon={<Mail size={18} />}
                            disabled={!isEditing}
                        />
                        <Input
                            label="Phone Number"
                            defaultValue={user.phone}
                            icon={<Phone size={18} />}
                            disabled={!isEditing}
                        />
                        <Input
                            label="Location"
                            defaultValue={user.location}
                            icon={<MapPin size={18} />}
                            disabled={!isEditing}
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Bio
                        </label>
                        <textarea
                            className="w-full rounded-lg border border-gray-300 p-3 text-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500 disabled:bg-gray-50 disabled:text-gray-500"
                            rows={4}
                            defaultValue={user.bio}
                            disabled={!isEditing}
                        />
                    </div>
                </div>
            </div>

            {/* Actions */}
            <div className="flex justify-end pt-4 border-t border-gray-100">
                {isEditing ? (
                    <div className="flex gap-3">
                        <Button variant="ghost" onClick={onCancel}>
                            Cancel
                        </Button>
                        <Button onClick={onSave}>Save Changes</Button>
                    </div>
                ) : (
                    <Button onClick={onEdit}>Edit Profile</Button>
                )}
            </div>
        </div>
    );
};

export default GeneralSettings;
