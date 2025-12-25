"use client";

import { Star } from "lucide-react";

interface StarRatingProps {
    rating: number;
    onRatingChange?: (rating: number) => void;
    size?: "sm" | "md" | "lg";
    readonly?: boolean;
    showValue?: boolean;
}

export default function StarRating({
    rating,
    onRatingChange,
    size = "md",
    readonly = false,
    showValue = false,
}: StarRatingProps) {
    const sizeClasses = {
        sm: "w-4 h-4",
        md: "w-6 h-6",
        lg: "w-8 h-8",
    };

    const handleClick = (value: number) => {
        if (!readonly && onRatingChange) {
            onRatingChange(value);
        }
    };

    return (
        <div className="flex items-center gap-1">
            {[1, 2, 3, 4, 5].map((star) => (
                <button
                    key={star}
                    type="button"
                    onClick={() => handleClick(star)}
                    disabled={readonly}
                    className={`${readonly ? "cursor-default" : "cursor-pointer"} focus:outline-none`}
                >
                    <Star
                        className={`${sizeClasses[size]} ${star <= rating
                            ? "fill-white text-white"
                            : "text-white/30"
                            }`}
                    />
                </button>
            ))}
            {showValue && (
                <span className="ml-2 text-white font-medium">{rating.toFixed(1)}</span>
            )}
        </div>
    );
}
