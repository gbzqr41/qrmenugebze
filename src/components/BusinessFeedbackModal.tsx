"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Send, Utensils, Users, Sparkles, Wallet, Zap } from "lucide-react";
import StarRating from "./StarRating";
import { useFeedback } from "@/context/FeedbackContext";

interface BusinessFeedbackModalProps {
    isOpen: boolean;
    onClose: () => void;
    businessName: string;
}

const feedbackCategories = [
    { id: "food", label: "Lezzet", icon: Utensils },
    { id: "service", label: "Hizmet", icon: Users },
    { id: "ambiance", label: "Sunum", icon: Sparkles },
    { id: "price", label: "Fiyat/Performans", icon: Wallet },
    { id: "speed", label: "Hız", icon: Zap },
];

export default function BusinessFeedbackModal({
    isOpen,
    onClose,
    businessName,
}: BusinessFeedbackModalProps) {
    const { addFeedback } = useFeedback();
    const [categoryRatings, setCategoryRatings] = useState<Record<string, number>>({});
    const [comment, setComment] = useState("");
    const [authorName, setAuthorName] = useState("");
    const [lastName, setLastName] = useState("");
    const [phone, setPhone] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSubmitted, setIsSubmitted] = useState(false);

    const handleCategoryRating = (categoryId: string, rating: number) => {
        setCategoryRatings((prev) => ({ ...prev, [categoryId]: rating }));
    };

    // Calculate overall rating from category ratings
    const getOverallRating = () => {
        const ratings = Object.values(categoryRatings).filter(r => r > 0);
        if (ratings.length === 0) return 0;
        return Math.round(ratings.reduce((a, b) => a + b, 0) / ratings.length);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const overallRating = getOverallRating();
        if (overallRating === 0) {
            return;
        }

        setIsSubmitting(true);

        try {
            const fullName = `${authorName.trim()} ${lastName.trim()}`.trim();
            addFeedback({
                author: fullName || "Anonim",
                phone: phone.trim(),
                rating: overallRating,
                categories: {
                    food: categoryRatings.food || 0,
                    service: categoryRatings.service || 0,
                    ambiance: categoryRatings.ambiance || 0,
                },
                comment: comment.trim(),
                wouldRecommend: true,
            });

            setIsSubmitted(true);

            setTimeout(() => {
                setIsSubmitting(false);
                onClose();
                setComment("");
                setAuthorName("");
                setLastName("");
                setPhone("");
                setCategoryRatings({});
                setIsSubmitted(false);
            }, 1500);

        } catch (error) {
            console.error("Error submitting feedback:", error);
            setIsSubmitting(false);
        }
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

    const hasAnyRating = Object.values(categoryRatings).some(r => r > 0);

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

                    {/* Modal - Fullscreen like Filter */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="fixed inset-0 z-50 bg-black flex flex-col"
                    >
                        {/* Header */}
                        <div className="flex items-center justify-between p-4 border-b border-white/10">
                            <h2 className="text-lg font-bold text-white">Değerlendirin</h2>
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
                                            className="text-4xl text-green-400"
                                        >
                                            ✓
                                        </motion.div>
                                    </div>
                                    <h3 className="text-xl font-bold text-white mb-2">Teşekkürler!</h3>
                                    <p className="text-white/60">Değerlendirmeniz gönderildi</p>
                                </div>
                            </motion.div>
                        ) : (
                            <form onSubmit={handleSubmit} className="flex-1 flex flex-col overflow-hidden">
                                <div className="flex-1 overflow-y-auto p-4 space-y-6">

                                    {/* Detailed Ratings - Main Content */}
                                    <div className="space-y-3">
                                        <h3 className="text-sm font-medium text-white/60 uppercase tracking-wider">
                                            Değerlendirme
                                        </h3>
                                        {feedbackCategories.map((category) => {
                                            const Icon = category.icon;
                                            return (
                                                <div key={category.id} className="bg-neutral-900 rounded-xl p-4">
                                                    <div className="text-center">
                                                        <div className="flex items-center justify-center gap-2 mb-3">
                                                            <Icon className="w-5 h-5 text-white/60" />
                                                            <span className="text-white font-medium">{category.label}</span>
                                                        </div>
                                                        <div className="flex justify-center">
                                                            <StarRating
                                                                rating={categoryRatings[category.id] || 0}
                                                                onRatingChange={(r) => handleCategoryRating(category.id, r)}
                                                                size="md"
                                                            />
                                                        </div>
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>

                                    {/* Comment */}
                                    <div>
                                        <h3 className="text-sm font-medium text-white/60 uppercase tracking-wider mb-2">
                                            YORUMUNUZ (OPSİYONEL)
                                        </h3>
                                        <textarea
                                            value={comment}
                                            onChange={(e) => setComment(e.target.value)}
                                            placeholder="Deneyiminizi anlatın..."
                                            rows={4}
                                            className="w-full px-4 py-3 bg-neutral-900 rounded-xl text-white placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-white/20 resize-none"
                                        />
                                    </div>

                                    {/* User Info - At Bottom */}
                                    <div className="space-y-3">
                                        <h3 className="text-sm font-medium text-white/60 uppercase tracking-wider">
                                            İletişim Bilgileri (Opsiyonel)
                                        </h3>
                                        <input
                                            type="text"
                                            value={authorName}
                                            onChange={(e) => setAuthorName(e.target.value)}
                                            placeholder="Ad"
                                            className="w-full px-4 py-3 bg-neutral-900 rounded-xl text-white placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-white/20"
                                        />
                                        <input
                                            type="text"
                                            value={lastName}
                                            onChange={(e) => setLastName(e.target.value)}
                                            placeholder="Soyad"
                                            className="w-full px-4 py-3 bg-neutral-900 rounded-xl text-white placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-white/20"
                                        />
                                        <input
                                            type="tel"
                                            value={phone}
                                            onChange={(e) => setPhone(e.target.value)}
                                            placeholder="Telefon"
                                            className="w-full px-4 py-3 bg-neutral-900 rounded-xl text-white placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-white/20"
                                        />
                                    </div>
                                </div>

                                {/* Submit Button - Fixed at bottom */}
                                <div className="p-4 pb-[10px] border-t border-white/10">
                                    <motion.button
                                        whileTap={{ scale: 0.98 }}
                                        type="submit"
                                        disabled={!hasAnyRating || isSubmitting}
                                        className="w-full flex items-center justify-center gap-2 py-4 bg-white text-black rounded-2xl font-semibold hover:bg-neutral-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        {isSubmitting ? (
                                            <div className="w-5 h-5 border-2 border-black/20 border-t-black rounded-full animate-spin" />
                                        ) : (
                                            <>
                                                <Send className="w-5 h-5" />
                                                Gönder
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
