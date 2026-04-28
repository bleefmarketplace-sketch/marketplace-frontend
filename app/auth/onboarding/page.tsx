"use client";
import React, { useState } from 'react';
import { ShoppingBag, Store, BookOpen, Check, ArrowRight, ArrowLeft, MapPin, Tractor, Book, Phone } from 'lucide-react';
import { Button } from '@/components/Button';
import { Input } from '@/components/Input';
import { useAuth, UserRole } from '@/context/AuthContext';
import { toast } from 'react-toastify';
import { useRouter } from 'next/navigation';
import { PhoneNumberInput } from '@/components/PhoneNumberInput';

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
                <h2 className="text-3xl font-bold text-gray-900">What brings you to here?</h2>
                <p className="text-gray-600 mt-2">Choose the role that best fits your goals. You can always change this later.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div
                    onClick={() => setSelectedRole('buyer')}
                    className={`cursor-pointer border-2 rounded-xl p-6 transition-all hover:-translate-y-1 relative overflow-hidden group ${selectedRole === 'buyer' ? 'border-primary-600 bg-primary-50 ring-1 ring-primary-600' : 'border-gray-100 hover:border-primary-200'
                        }`}
                >
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center mb-4 transition-colors ${selectedRole === 'buyer' ? 'bg-primary-600 text-white' : 'bg-gray-100 text-gray-500 group-hover:bg-primary-100 group-hover:text-primary-600'
                        }`}>
                        <ShoppingBag size={24} />
                    </div>
                    <h3 className="font-bold text-gray-900 text-lg">Buyer</h3>
                    <p className="text-sm text-gray-500 mt-2 leading-relaxed">I want to source high-quality produce, seeds, and equipment directly from farmers.</p>
                </div>

                <div
                    onClick={() => setSelectedRole('seller')}
                    className={`cursor-pointer border-2 rounded-xl p-6 transition-all hover:-translate-y-1 relative overflow-hidden group ${selectedRole === 'seller' ? 'border-primary-600 bg-primary-50 ring-1 ring-primary-600' : 'border-gray-100 hover:border-primary-200'
                        }`}
                >
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center mb-4 transition-colors ${selectedRole === 'seller' ? 'bg-primary-600 text-white' : 'bg-gray-100 text-gray-500 group-hover:bg-primary-100 group-hover:text-primary-600'
                        }`}>
                        <Store size={24} />
                    </div>
                    <h3 className="font-bold text-gray-900 text-lg">Seller</h3>
                    <p className="text-sm text-gray-500 mt-2 leading-relaxed">I want to sell my harvest, livestock, or machinery to a global market.</p>
                </div>

              {/*   <div
                    onClick={() => setSelectedRole('creator')}
                    className={`cursor-pointer border-2 rounded-xl p-6 transition-all hover:-translate-y-1 relative overflow-hidden group ${selectedRole === 'creator' ? 'border-primary-600 bg-primary-50 ring-1 ring-primary-600' : 'border-gray-100 hover:border-primary-200'
                        }`}
                >
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center mb-4 transition-colors ${selectedRole === 'creator' ? 'bg-primary-600 text-white' : 'bg-gray-100 text-gray-500 group-hover:bg-primary-100 group-hover:text-primary-600'
                        }`}>
                        <BookOpen size={24} />
                    </div>
                    <h3 className="font-bold text-gray-900 text-lg">Creator</h3>
                    <p className="text-sm text-gray-500 mt-2 leading-relaxed">I want to share my knowledge, publish courses, and educate the community.</p>
                </div> */}
            </div>
        </div>
    );

    const renderDetailsForm = () => (
        <div className="space-y-6 animate-in fade-in slide-in-from-right-8 duration-500">
            <div className="text-center mb-6">
                <h2 className="text-2xl font-bold text-gray-900">Tell us a bit more</h2>
                <p className="text-gray-600">We need a few details to personalize your {selectedRole} experience.</p>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
                <Input
                    label="Address"
                    placeholder="e.g. 23 Main St, Anytown, Nigeria"
                    value={formData.address}
                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                    icon={<MapPin size={18} />}
                />
                <Input
                    label="Location (City, Country)"
                    placeholder="e.g. Austin, Texas"
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    icon={<MapPin size={18} />}
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
                <div className="space-y-4 pt-4 border-t border-gray-100">
                    <h3 className="font-bold text-gray-900 flex items-center gap-2"><Tractor size={18} /> Farm Details</h3>
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
                <div className="space-y-4 pt-4 border-t border-gray-100">
                    <h3 className="font-bold text-gray-900 flex items-center gap-2"><Book size={18} /> Professional Info</h3>
                    <Input
                        label="Area of Expertise"
                        placeholder="e.g. Hydroponics, Organic Pest Control"
                        value={formData.expertise}
                        onChange={(e) => setFormData({ ...formData, expertise: e.target.value })}
                    />
                </div>
            )}

            {/* Buyer/All Interests */}
            <div className="space-y-3 pt-4 border-t border-gray-100">
                <label className="block text-sm font-medium text-gray-700">What are you interested in? (Select all that apply)</label>
                <div className="flex flex-wrap gap-2">
                    {['Livestock', 'Organic Feed', 'Machinery', 'Seeds', 'Dairy', 'Vegetables', 'Fruits', 'Tools'].map(tag => (
                        <button
                            key={tag}
                            onClick={() => toggleInterest(tag)}
                            className={`px-3 py-1.5 rounded-full text-sm font-medium border transition-colors ${formData.interests.includes(tag)
                                ? 'bg-primary-100 text-primary-700 border-primary-200'
                                : 'bg-white text-gray-600 border-gray-200 hover:border-gray-300'
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
        <div className="text-center space-y-8 animate-in fade-in slide-in-from-right-8 duration-500 py-8">
            <div className="relative inline-block">
                <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto relative z-10">
                    <Check className="text-green-600 w-12 h-12" />
                </div>
                <div className="absolute inset-0 bg-green-200 rounded-full animate-ping opacity-20"></div>
            </div>

            <div>
                <h2 className="text-3xl font-bold text-gray-900">You&apos;re all set!</h2>
                <p className="text-gray-600 mt-2 text-lg max-w-md mx-auto">
                    Your profile is ready. We&apos;ve customized your dashboard for <span className="font-bold text-gray-900">{selectedRole === 'seller' ? formData.farmName || 'your farm' : 'you'}</span>.
                </p>
            </div>

            <div className="bg-gray-50 p-6 rounded-xl border border-gray-100 max-w-sm mx-auto text-left shadow-sm">
                <h4 className="font-bold text-gray-900 mb-4 text-center border-b border-gray-200 pb-2">Your Profile Summary</h4>
                <div className="space-y-3 text-sm">
                    <div className="flex justify-between">
                        <span className="text-gray-500">Role</span>
                        <span className="font-medium capitalize">{selectedRole}</span>
                    </div>
                    <div className="flex justify-between">
                        <span className="text-gray-500">Location</span>
                        <span className="font-medium">{formData.location}</span>
                    </div>
                    {selectedRole === 'seller' && (
                        <div className="flex justify-between">
                            <span className="text-gray-500">Farm Name</span>
                            <span className="font-medium">{formData.farmName}</span>
                        </div>
                    )}
                    <div className="flex justify-between">
                        <span className="text-gray-500">Interests</span>
                        <span className="font-medium">{formData.interests.length} selected</span>
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

    }




    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
            <div className="max-w-3xl w-full bg-white rounded-3xl shadow-xl overflow-hidden flex flex-col min-h-150">
                {/* Header Progress */}
                <div className="bg-white p-6 border-b border-gray-100 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center text-white font-bold">A</div>
                        <span className="font-bold text-gray-900">AgriMarket</span>
                    </div>
                    <div className="flex gap-2">
                        {[1, 2, 3].map(i => (
                            <div key={i} className={`w-2.5 h-2.5 rounded-full transition-colors ${i <= step ? 'bg-primary-600' : 'bg-gray-200'}`}></div>
                        ))}
                    </div>
                </div>

                <div className="flex-1 p-8 md:p-12 flex flex-col justify-center">
                    {step === 1 && renderRoleSelection()}
                    {step === 2 && renderDetailsForm()}
                    {step === 3 && renderConfirmation()}
                </div>

                <div className="p-6 border-t border-gray-100 flex justify-between bg-gray-50">
                    {step === 2 && (
                        <Button variant="ghost" onClick={() => setStep(1)} disabled={isSubmitting}>
                            <ArrowLeft size={18} className="mr-2" /> Back
                        </Button>
                    )}

                    <div className="ml-auto">
                        {step < 3 ? (
                            <Button
                                onClick={handleNext}
                                isLoading={isSubmitting}
                                disabled={isSubmitting}
                            >
                                Continue <ArrowRight size={18} className="ml-2" />
                            </Button>
                        ) : (
                            <Button onClick={handleFinalRedirect}>
                              Go to Login<ArrowRight size={18} className="ml-2" />
                            </Button>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default OnboardingPage;