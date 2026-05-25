"use client";
import React, { useState } from 'react';
import { ShoppingBag, Store, BookOpen, Check, ArrowRight, ArrowLeft, MapPin, Tractor, Book, Phone } from 'lucide-react';
import { Button } from '@/components/Button';
import { Input } from '@/components/Input';
import { useAuth, UserRole } from '@/context/AuthContext';
import { toast } from 'react-toastify';
import { useRouter } from 'next/navigation';
import { PhoneNumberInput } from '@/components/PhoneNumberInput';
import Image from 'next/image';

const OnboardingPage = () => {
    const { user, completeOnboarding, isLoading: authLoading } = useAuth();
    const router = useRouter();
    const [step, setStep] = useState(1);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [selectedRole, setSelectedRole] = useState<UserRole | null>(null);
    

    const [formData, setFormData] = useState({
        address: '',
        location: '',
        phone: '',
        farmName: '',
        farmSize: '',
        interests: [] as string[],
        expertise: ''
    });

    // --- Internal Validation ---
    const validateStep2 = () => {
        if (!formData.address.trim()) return "Address is required";
        if (!formData.location.trim()) return "Location is required";

        if (!formData.phone || !formData.phone.startsWith('+')) {
  return "Please enter a valid international phone number";
}
 

        if (selectedRole === 'seller') {
            if (!formData.farmName.trim()) return "Farm name is required";
            if (!formData.farmSize || Number(formData.farmSize) <= 0) return "Please enter a valid farm size";
        }
        if (selectedRole === 'creator' && !formData.expertise.trim()) {
            return "Please specify your area of expertise";
        }
        return null;
    };

    const handleNext = async () => {
        if (step === 1) {
            if (!selectedRole) return toast.error("Please select a role to continue");
            setStep(2);
            return;
        }

        if (step === 2) {
            const error = validateStep2();
            if (error) return toast.error(error);

         
            setIsSubmitting(true);
            const payload = {
                address: formData.address,
                location: formData.location,
                phoneNumber: formData.phone,
                role: selectedRole!,
                farmName: selectedRole === 'seller' ? formData.farmName : undefined,
                farmSize: selectedRole === 'seller' ? formData.farmSize : undefined,
                areaOfInterest: formData.interests,
                areaOfExpertise: selectedRole === 'creator' ? [formData.expertise] : undefined,
            };

            const success = await completeOnboarding(payload);
            setIsSubmitting(false);
            if (success) setStep(3);
        }
    };

    const handleFinalRedirect = () => {
        router.push(`/dashboard/${user?.role}`);
    };

    const renderRoleSelection = () => (
        <div className="space-y-6 animate-in fade-in slide-in-from-right-8 duration-500">
            <div className="text-center mb-8">
                <h2 className="text-lg font-black text-zinc-950 uppercase tracking-tight mb-1.5">What brings you here?</h2>
                <p className="text-zinc-500 font-sans text-xs">Choose the role that best fits your goals. You can always change this later.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div
                    onClick={() => setSelectedRole('buyer')}
                    className={`cursor-pointer border rounded-none p-6 transition-colors hover:bg-zinc-50 relative group ${selectedRole === 'buyer' ? 'border-green-700 bg-green-50/50' : 'border-zinc-200 bg-white'
                        }`}
                >
                    <div className={`w-12 h-12 border rounded-none flex items-center justify-center mb-4 transition-colors ${selectedRole === 'buyer' ? 'border-green-700 bg-green-50 text-green-700' : 'border-zinc-200 bg-white text-zinc-500 group-hover:border-zinc-300 group-hover:bg-zinc-50 group-hover:text-zinc-950'
                        }`}>
                        <ShoppingBag size={20} />
                    </div>
                    <h3 className="font-mono text-xs uppercase font-bold tracking-widest text-zinc-950">Buyer</h3>
                    <p className="text-xs text-zinc-500 font-sans mt-2 leading-relaxed">I want to source high-quality produce, seeds, and equipment directly from farmers.</p>
                </div>

                <div
                    onClick={() => setSelectedRole('seller')}
                    className={`cursor-pointer border rounded-none p-6 transition-colors hover:bg-zinc-50 relative group ${selectedRole === 'seller' ? 'border-green-700 bg-green-50/50' : 'border-zinc-200 bg-white'
                        }`}
                >
                    <div className={`w-12 h-12 border rounded-none flex items-center justify-center mb-4 transition-colors ${selectedRole === 'seller' ? 'border-green-700 bg-green-50 text-green-700' : 'border-zinc-200 bg-white text-zinc-500 group-hover:border-zinc-300 group-hover:bg-zinc-50 group-hover:text-zinc-950'
                        }`}>
                        <Store size={20} />
                    </div>
                    <h3 className="font-mono text-xs uppercase font-bold tracking-widest text-zinc-950">Seller</h3>
                    <p className="text-xs text-zinc-500 font-sans mt-2 leading-relaxed">I want to sell my harvest, livestock, or machinery to a global market.</p>
                </div>

                <div
                    onClick={() => setSelectedRole('creator')}
                    className={`cursor-pointer border rounded-none p-6 transition-colors hover:bg-zinc-50 relative group ${selectedRole === 'creator' ? 'border-green-700 bg-green-50/50' : 'border-zinc-200 bg-white'
                        }`}
                >
                    <div className={`w-12 h-12 border rounded-none flex items-center justify-center mb-4 transition-colors ${selectedRole === 'creator' ? 'border-green-700 bg-green-50 text-green-700' : 'border-zinc-200 bg-white text-zinc-500 group-hover:border-zinc-300 group-hover:bg-zinc-50 group-hover:text-zinc-950'
                        }`}>
                        <BookOpen size={20} />
                    </div>
                    <h3 className="font-mono text-xs uppercase font-bold tracking-widest text-zinc-950">Creator</h3>
                    <p className="text-xs text-zinc-500 font-sans mt-2 leading-relaxed">I want to share my knowledge, publish courses, and educate the community.</p>
                </div>
            </div>
        </div>
    );

    const renderDetailsForm = () => (
        <div className="space-y-6 animate-in fade-in slide-in-from-right-8 duration-500">
            <div className="text-center mb-6">
                <h2 className="text-lg font-black text-zinc-950 uppercase tracking-tight mb-1.5">Tell us a bit more</h2>
                <p className="text-zinc-500 font-sans text-xs">We need a few details to personalize your <span className="font-mono text-green-700 uppercase font-bold">{selectedRole}</span> experience.</p>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
                <Input
                    label="Address"
                    placeholder="e.g. 23 Main St, Anytown, Nigeria"
                    value={formData.address}
                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                    icon={<MapPin size={16} className="text-zinc-400" />}
                />
                <Input
                    label="Location (City, Country)"
                    placeholder="e.g. Austin, Texas"
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    icon={<MapPin size={16} className="text-zinc-400" />}
                />
                <PhoneNumberInput
                    label="Phone Number"
                    value={formData.phone}
                    onChange={(value) =>
                        setFormData({ ...formData, phone: value })
                    }
                />
            </div>

            {/* Seller Specifics */}
            {selectedRole === 'seller' && (
                <div className="space-y-4 pt-4 border-t border-zinc-200">
                    <h3 className="font-mono text-xs uppercase font-bold tracking-widest text-zinc-950 flex items-center gap-2">
                        <Tractor size={14} className="text-green-700" /> Farm Details
                    </h3>
                    <div className="grid md:grid-cols-2 gap-4">
                        <Input
                            label="Business Name"
                            placeholder="e.g. Green Valley Acres"
                            value={formData.farmName}
                            onChange={(e) => setFormData({ ...formData, farmName: e.target.value })}
                        />
                        <Input
                            label="Business Size"
                            placeholder="e.g. 50"
                            type="number"
                            value={formData.farmSize}
                            onChange={(e) => setFormData({ ...formData, farmSize: e.target.value })}
                        />
                    </div>
                </div>
            )}

            {/* Creator Specifics */}
            {selectedRole === 'creator' && (
                <div className="space-y-4 pt-4 border-t border-zinc-200">
                    <h3 className="font-mono text-xs uppercase font-bold tracking-widest text-zinc-950 flex items-center gap-2">
                        <Book size={14} className="text-green-700" /> Professional Info
                    </h3>
                    <Input
                        label="Area of Expertise"
                        placeholder="e.g. Hydroponics, Organic Pest Control"
                        value={formData.expertise}
                        onChange={(e) => setFormData({ ...formData, expertise: e.target.value })}
                    />
                </div>
            )}

            {/* Buyer/All Interests */}
            <div className="space-y-3 pt-4 border-t border-zinc-200">
                <label className="block text-xs font-mono font-bold text-zinc-500 uppercase tracking-widest mb-1.5 ml-1">
                    What are you interested in? (Select all that apply)
                </label>
                <div className="flex flex-wrap gap-2">
                    {['Livestock', 'Organic Feed', 'Machinery', 'Seeds', 'Dairy', 'Vegetables', 'Fruits', 'Tools'].map(tag => (
                        <button
                            key={tag}
                            onClick={() => toggleInterest(tag)}
                            className={`px-3 py-1.5 rounded-none text-xs font-mono font-bold uppercase tracking-wider border transition-colors cursor-pointer ${formData.interests.includes(tag)
                                ? 'bg-green-50 text-green-700 border-green-700'
                                : 'bg-white text-zinc-500 border-zinc-200 hover:border-zinc-300 hover:bg-zinc-50'
                                }`}
                        >
                            {tag}
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );

    const renderConfirmation = () => (
        <div className="text-center space-y-6 animate-in fade-in slide-in-from-right-8 duration-500 py-6 font-mono text-xs">
            <div className="relative inline-block">
                <div className="w-16 h-16 border border-green-700 bg-green-50 flex items-center justify-center mx-auto relative z-10 rounded-none">
                    <Check className="text-green-700 w-8 h-8" />
                </div>
            </div>

            <div>
                <h2 className="text-lg font-black text-zinc-950 uppercase tracking-tight mb-1.5">You&apos;re all set!</h2>
                <p className="text-zinc-500 font-sans text-xs max-w-md mx-auto">
                    Your profile is ready. We&apos;ve customized your dashboard for <span className="font-mono text-zinc-950 font-bold uppercase tracking-wider">{selectedRole === 'seller' ? formData.farmName || 'your farm' : 'you'}</span>.
                </p>
            </div>

            <div className="bg-zinc-50 p-6 border border-zinc-200 max-w-sm mx-auto text-left rounded-none shadow-none">
                <h4 className="font-mono text-xs font-bold text-zinc-950 uppercase tracking-widest mb-4 text-center border-b border-zinc-200 pb-2">Profile Summary</h4>
                <div className="space-y-3 text-xs">
                    <div className="flex justify-between">
                        <span className="text-zinc-500 uppercase tracking-wider font-bold text-[10px]">Role</span>
                        <span className="font-bold text-zinc-950 uppercase">{selectedRole}</span>
                    </div>
                    <div className="flex justify-between">
                        <span className="text-zinc-500 uppercase tracking-wider font-bold text-[10px]">Location</span>
                        <span className="font-bold text-zinc-950 uppercase">{formData.location}</span>
                    </div>
                    {selectedRole === 'seller' && (
                        <div className="flex justify-between">
                            <span className="text-zinc-500 uppercase tracking-wider font-bold text-[10px]">Farm Name</span>
                            <span className="font-bold text-zinc-950 uppercase">{formData.farmName}</span>
                        </div>
                    )}
                    <div className="flex justify-between">
                        <span className="text-zinc-500 uppercase tracking-wider font-bold text-[10px]">Interests</span>
                        <span className="font-bold text-zinc-950 uppercase">{formData.interests.length} selected</span>
                    </div>
                </div>
            </div>
        </div>
    );

    const toggleInterest = (interest: string) => {
        setFormData(prev => ({
            ...prev,
            interests: prev.interests.includes(interest)
                ? prev.interests.filter(i => i !== interest)
                : [...prev.interests, interest]
        }));
    };

    return (
        <div className="py-16 w-full flex items-center justify-center bg-zinc-50 text-zinc-900 font-mono text-xs antialiased px-4">
            <div className="max-w-4xl w-full bg-white border border-zinc-200 rounded-none shadow-none flex flex-col min-h-150">
                {/* Header Progress */}
                <div className="bg-white p-6 border-b border-zinc-200 flex items-center justify-between font-mono text-xs uppercase font-bold tracking-widest text-zinc-900">
                    <div className="flex items-center gap-2">
                        <span>ONBOARDING STEP</span>
                        <span className="text-green-700 bg-green-50 px-2 py-0.5 border border-green-700/30">0{step} / 03</span>
                    </div>
                    <div className="flex items-center gap-3">
                        {[1, 2, 3].map(i => (
                            <span 
                                key={i} 
                                className={`transition-colors ${
                                    i === step 
                                        ? 'text-green-700 font-black' 
                                        : i < step 
                                            ? 'text-zinc-500 line-through' 
                                            : 'text-zinc-350'
                                }`}
                            >
                                [0{i}]
                            </span>
                        ))}
                    </div>
                </div>

                <div className="flex-1 p-8 md:p-12 flex flex-col justify-center">
                    {step === 1 && renderRoleSelection()}
                    {step === 2 && renderDetailsForm()}
                    {step === 3 && renderConfirmation()}
                </div>

                <div className="p-6 border-t border-zinc-200 flex justify-between bg-zinc-50/50 rounded-none">
                    {step === 2 && (
                        <Button variant="ghost" onClick={() => setStep(1)} disabled={isSubmitting} className="rounded-none font-mono uppercase font-bold text-xs tracking-wider">
                            <ArrowLeft size={14} className="mr-1.5" /> Back
                        </Button>
                    )}

                    <div className="ml-auto">
                        {step < 3 ? (
                            <Button
                                onClick={handleNext}
                                isLoading={isSubmitting}
                                disabled={isSubmitting}
                                className="rounded-none font-mono uppercase font-bold text-xs tracking-wider"
                            >
                                Continue <ArrowRight size={14} className="ml-1.5" />
                            </Button>
                        ) : (
                            <Button onClick={handleFinalRedirect} className="rounded-none font-mono uppercase font-bold text-xs tracking-wider bg-green-700 text-white hover:bg-green-800">
                               Go to Dashboard <ArrowRight size={14} className="ml-1.5" />
                            </Button>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default OnboardingPage;