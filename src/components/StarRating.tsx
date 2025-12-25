"use client";

import { useState } from "react";
import { motion } from "framer-motion";
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
    const [hoverRating, setHoverRating] = useState(0);

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

    const displayRating = hoverRating || rating;

    return (
        <div className="flex items-center gap-1">
            {[1, 2, 3, 4, 5].map((star) => (
                <motion.button
                    key={star}
                    type="button"
                    whileHover={!readonly ? { scale: 1.1 } : {}}
                    whileTap={!readonly ? { scale: 0.9 } : {}}
                    onClick={() => handleClick(star)}
                    onMouseEnter={() => !readonly && setHoverRating(star)}
                    onMouseLeave={() => !readonly && setHoverRating(0)}
                    disabled={readonly}
                    className={`${readonly ? "cursor-default" : "cursor-pointer"} focus:outline-none`}
                >
                    <Star
                        className={`${sizeClasses[size]} transition-colors ${star <= displayRating
                                ? "fill-yellow-400 text-yellow-400"
                                : "text-white/20"
                            }`}
                    />
                </motion.button>
            ))}
            {showValue && (
                <span className="ml-2 text-white font-medium">{rating.toFixed(1)}</span>
            )}
        </div>
    );
}
