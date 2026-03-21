import {   Star } from "lucide-react";

const ReviewItem = ({ review }: { review: any }) => (
    <div className="py-6 border-b border-gray-100 last:border-0">
        <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center font-bold text-emerald-700">
                {review.isAnonymous ? "A" : (review.user?.firstName?.charAt(0) || "U")}
            </div>
            <div>
                <p className="text-sm font-bold text-gray-900">
                    {review.isAnonymous ? "Anonymous Farmer" : `${review.user?.firstName || 'Verified'} Buyer`}
                </p>
                <div className="flex items-center gap-2">
                    <div className="flex text-amber-400">
                        {[...Array(5)].map((_, i) => (
                            <Star key={i} size={12} fill={i < review.rating ? "currentColor" : "none"} />
                        ))}
                    </div>
                    <span className="text-[10px] text-gray-400 font-medium">
                        {new Date(review.createdAt).toLocaleDateString()}
                    </span>
                </div>
            </div>
        </div>
        <p className="text-gray-600 text-sm leading-relaxed">{review.comment}</p>
        
    </div>
);


export default ReviewItem;