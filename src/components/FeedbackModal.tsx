"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Star, ArrowRight } from "lucide-react";
import StarRating from "./StarRating";

interface FeedbackModalProps {
    isOpen: boolean;
    onClose: () => void;
    productName?: string;
    productId?: string;
}

interface RatingCategory {
    id: string;
    label: string;
    rating: number;
}

export default function FeedbackModal({
    isOpen,
    onClose,
    productName,
    productId,
}: FeedbackModalProps) {
    const [overallRating, setOverallRating] = useState(0);
    const [comment, setComment] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSubmitted, setIsSubmitted] = useState(false);

    const [ratings, setRatings] = useState<RatingCategory[]>([
        { id: "taste", label: "Lezzet", rating: 0 },
        { id: "service", label: "Hizmet", rating: 0 },
        { id: "speed", label: "Hız", rating: 0 },
        { id: "presentation", label: "Sunum", rating: 0 },
        { id: "value", label: "Fiyat/Performans", rating: 0 },
    ]);

    const updateRating = (id: string, newRating: number) => {
        setRatings(prev => prev.map(r =>
            r.id === id ? { ...r, rating: newRating } : r
        ));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (overallRating === 0) return;

        setIsSubmitting(true);

        // Simulate API call
        await new Promise((resolve) => setTimeout(resolve, 1000));

        console.log("Feedback submitted:", { productId, overallRating, ratings, comment });

        setIsSubmitting(false);
        setIsSubmitted(true);

        // Reset and close after showing success
        setTimeout(() => {
            setOverallRating(0);
            setComment("");
            setRatings(prev => prev.map(r => ({ ...r, rating: 0 })));
            setIsSubmitted(false);
            onClose();
        }, 2000);
    };

    // Prevent body scroll when modal is open
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "unset";
        }
        return () => {
            document.body.style.overflow = "unset";
        };
    }, [isOpen]);

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50"
                    />

                    {/* Modal */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="fixed inset-0 z-50 bg-black flex flex-col"
                    >
                        {/* Header */}
                        <div className="flex items-center justify-between p-4 border-b border-white/10">
                            <div className="flex items-center gap-2">
                                <Star className="w-5 h-5 text-white" />
                                <h2 className="text-lg font-bold text-white">Değerlendirin</h2>
                            </div>
                            <button
                                onClick={onClose}
                                className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors"
                            >
                                <X className="w-5 h-5 text-white" />
                            </button>
                        </div>

                        {/* Content */}
                        {isSubmitted ? (
                            <motion.div
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="flex-1 flex items-center justify-center p-8 text-center"
                            >
                                <div>
                                    <div className="w-20 h-20 rounded-full bg-green-500/20 flex items-center justify-center mx-auto mb-4">
                                        <motion.div
                                            initial={{ scale: 0 }}
                                            animate={{ scale: 1 }}
                                            transition={{ delay: 0.2, type: "spring" }}
                                            className="text-4xl"
                                        >
                                            ✓
                                        </motion.div>
                                    </div>
                                    <h3 className="text-xl font-bold text-white mb-2">Teşekkürler!</h3>
                                    <p className="text-white/60">Değerlendirmeniz gönderildi</p>
                                </div>
                            </motion.div>
                        ) : (
                            <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto">
                                <div className="p-4 space-y-6">

                                    {/* Overall Rating - Genel Deneyim */}
                                    <div className="text-center py-4">
                                        <h3 className="text-white font-semibold mb-3">Genel Deneyim</h3>
                                        <div className="flex justify-center">
                                            <StarRating
                                                rating={overallRating}
                                                onRatingChange={setOverallRating}
                                                size="lg"
                                            />
                                        </div>
                                        {overallRating > 0 && (
                                            <motion.p
                                                initial={{ opacity: 0, y: 10 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                className="mt-2 text-sm text-white/40"
                                            >
                                                {overallRating === 1 && "Çok kötü"}
                                                {overallRating === 2 && "Kötü"}
                                                {overallRating === 3 && "Orta"}
                                                {overallRating === 4 && "İyi"}
                                                {overallRating === 5 && "Mükemmel!"}
                                            </motion.p>
                                        )}
                                    </div>

                                    {/* Detailed Ratings */}
                                    <div className="space-y-4">
                                        <h3 className="text-sm font-medium text-white/60 uppercase tracking-wider">
                                            Detaylı Değerlendirme
                                        </h3>
                                        {ratings.map((category) => (
                                            <div key={category.id} className="bg-neutral-900 rounded-xl p-4">
                                                <div className="text-center mb-3">
                                                    <span className="text-white font-medium">{category.label}</span>
                                                    <div className="flex justify-center mt-2">
                                                        <StarRating
                                                            rating={category.rating}
                                                            onRatingChange={(rating) => updateRating(category.id, rating)}
                                                            size="md"
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>

                                    {/* Comment */}
                                    <div>
                                        <label className="text-sm text-white/60 mb-2 block">
                                            Yorumunuz (opsiyonel)
                                        </label>
                                        <textarea
                                            value={comment}
                                            onChange={(e) => setComment(e.target.value)}
                                            placeholder="Deneyiminizi anlatın..."
                                            rows={4}
                                            className="w-full px-4 py-3 bg-neutral-900 rounded-xl text-white placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-white/20 resize-none"
                                        />
                                    </div>
                                </div>

                                {/* Submit Button - Fixed at bottom */}
                                <div className="p-4 pb-[10px] border-t border-white/10">
                                    <motion.button
                                        whileTap={{ scale: 0.98 }}
                                        type="submit"
                                        disabled={overallRating === 0 || isSubmitting}
                                        className="w-full flex items-center justify-center gap-2 py-4 bg-white text-black rounded-2xl font-semibold hover:bg-neutral-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        {isSubmitting ? (
                                            <div className="w-5 h-5 border-2 border-black/20 border-t-black rounded-full animate-spin" />
                                        ) : (
                                            <>
                                                Gönder
                                                <ArrowRight className="w-5 h-5" />
                                            </>
                                        )}
                                    </motion.button>
                                </div>
                            </form>
                        )}
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}
