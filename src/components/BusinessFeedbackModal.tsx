"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ArrowRight, Star, ThumbsUp } from "lucide-react";
import StarRating from "./StarRating";
import { useFeedback } from "@/context/FeedbackContext";
import { useTheme } from "@/context/ThemeContext";

interface BusinessFeedbackModalProps {
    isOpen: boolean;
    onClose: () => void;
    businessName: string;
}

const feedbackCategories = [
    { id: "food", label: "Yemek Kalitesi", emoji: "🍽️" },
    { id: "service", label: "Hizmet", emoji: "👨‍🍳" },
    { id: "ambiance", label: "Ambiyans", emoji: "✨" },
    { id: "price", label: "Fiyat/Kalite", emoji: "💰" },
    { id: "speed", label: "Hız", emoji: "⚡" },
];

export default function BusinessFeedbackModal({
    isOpen,
    onClose,
    businessName,
}: BusinessFeedbackModalProps) {
    const { addFeedback } = useFeedback();
    const { theme } = useTheme();
    const [overallRating, setOverallRating] = useState(0);
    const [categoryRatings, setCategoryRatings] = useState<Record<string, number>>({});
    const [comment, setComment] = useState("");
    const [authorName, setAuthorName] = useState("");
    const [phone, setPhone] = useState("");
    const [wouldRecommend, setWouldRecommend] = useState<boolean | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSubmitted, setIsSubmitted] = useState(false);

    const handleCategoryRating = (categoryId: string, rating: number) => {
        setCategoryRatings((prev) => ({ ...prev, [categoryId]: rating }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // Rating is the only mandatory field
        if (overallRating === 0) {
            alert("Lütfen bir puan verin");
            return;
        }

        setIsSubmitting(true);

        try {
            // Save to FeedbackContext
            addFeedback({
                author: authorName.trim() || "İsimsiz",
                phone: phone.trim(),
                rating: overallRating,
                categories: {
                    food: categoryRatings.food || 0,
                    service: categoryRatings.service || 0,
                    ambiance: categoryRatings.ambiance || 0,
                },
                comment: comment.trim(),
                wouldRecommend: wouldRecommend ?? true,
            });

            console.log("Feedback submitted successfully");
            setIsSubmitted(true);

            // Close after a delay to show success
            setTimeout(() => {
                setIsSubmitting(false);
                onClose();
                // Reset form
                setOverallRating(0);
                setAuthorName("");
                setPhone("");
                setComment("");
                setCategoryRatings({});
                setWouldRecommend(null);
                setIsSubmitted(false);
            }, 1500);

        } catch (error) {
            console.error("Error submitting feedback:", error);
            setIsSubmitting(false);
            alert("Yorum gönderilirken bir hata oluştu.");
        }
    };

    // Prevent body scroll when modal is open
    if (typeof window !== "undefined") {
        if (isOpen) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "unset";
        }
    }

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
                        initial={{ y: "100%" }}
                        animate={{ y: 0 }}
                        exit={{ y: "100%" }}
                        transition={{ type: "spring", damping: 30, stiffness: 300 }}
                        className="fixed bottom-0 left-0 right-0 z-50 rounded-t-3xl max-h-[95vh] overflow-hidden transition-colors duration-300"
                        style={{ backgroundColor: theme.feedbackCardBgColor || theme.cardColor, color: theme.feedbackTextColor || theme.textColor }}
                    >
                        {/* Header */}
                        <div className="flex items-center justify-between p-4 border-b sticky top-0 z-10" style={{ backgroundColor: theme.feedbackCardBgColor || theme.cardColor, borderColor: theme.cardBorderColor || 'rgba(255,255,255,0.1)' }}>
                            <div>
                                <h2 className="text-lg font-bold" style={{ color: theme.feedbackTextColor || theme.textColor }}>İşletmeyi Değerlendir</h2>
                                <p className="text-sm opacity-50">{businessName}</p>
                            </div>
                            <button
                                onClick={onClose}
                                className="w-10 h-10 rounded-full flex items-center justify-center transition-colors"
                                style={{ backgroundColor: 'rgba(255,255,255,0.1)' }}
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        {/* Content */}
                        <div className="overflow-y-auto max-h-[calc(95vh-80px)]">
                            {isSubmitted ? (
                                <motion.div
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    className="p-8 text-center"
                                >
                                    <div className="w-24 h-24 rounded-full bg-gradient-to-br from-yellow-400 to-orange-500 flex items-center justify-center mx-auto mb-4">
                                        <motion.div
                                            initial={{ scale: 0, rotate: -180 }}
                                            animate={{ scale: 1, rotate: 0 }}
                                            transition={{ delay: 0.2, type: "spring" }}
                                        >
                                            <Star className="w-12 h-12 text-white fill-white" />
                                        </motion.div>
                                    </div>
                                    <h3 className="text-2xl font-bold mb-2">Teşekkür Ederiz!</h3>
                                    <p className="opacity-60">Değerli görüşleriniz için teşekkürler</p>
                                </motion.div>
                            ) : (
                                <form onSubmit={handleSubmit} className="p-6 space-y-8">
                                    {/* Overall Rating */}
                                    <div className="text-center">
                                        <p className="font-medium mb-4">Genel Deneyiminiz</p>
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
                                                className="mt-3 text-lg font-medium text-yellow-400"
                                            >
                                                {overallRating === 1 && "Çok kötüydü 😞"}
                                                {overallRating === 2 && "Beklentimi karşılamadı 😕"}
                                                {overallRating === 3 && "Fena değildi 🙂"}
                                                {overallRating === 4 && "Çok iyiydi! 😊"}
                                                {overallRating === 5 && "Mükemmeldi! 🤩"}
                                            </motion.p>
                                        )}
                                    </div>

                                    {/* Author Name & Phone */}
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <label className="font-medium mb-2 block">
                                                Ad Soyad
                                            </label>
                                            <input
                                                type="text"
                                                value={authorName}
                                                onChange={(e) => setAuthorName(e.target.value)}
                                                placeholder="İsteğe bağlı"
                                                className="w-full px-4 py-3 rounded-xl placeholder:opacity-30 focus:outline-none"
                                                style={{ backgroundColor: theme.primaryColor, color: theme.feedbackTextColor || theme.textColor }}
                                            />
                                        </div>
                                        <div>
                                            <label className="font-medium mb-2 block">
                                                Telefon
                                            </label>
                                            <input
                                                type="tel"
                                                value={phone}
                                                onChange={(e) => setPhone(e.target.value)}
                                                placeholder="İsteğe bağlı"
                                                className="w-full px-4 py-3 rounded-xl placeholder:opacity-30 focus:outline-none"
                                                style={{ backgroundColor: theme.primaryColor, color: theme.feedbackTextColor || theme.textColor }}
                                            />
                                        </div>
                                    </div>

                                    {/* Category Ratings */}
                                    <div>
                                        <p className="font-medium mb-4">Detaylı Değerlendirme</p>
                                        <div className="space-y-4">
                                            {feedbackCategories.map((category) => (
                                                <div
                                                    key={category.id}
                                                    className="flex items-center justify-between p-3 rounded-xl"
                                                    style={{ backgroundColor: theme.primaryColor }}
                                                >
                                                    <div className="flex items-center gap-3">
                                                        <span className="text-2xl">{category.emoji}</span>
                                                        <span className="opacity-80">{category.label}</span>
                                                    </div>
                                                    <StarRating
                                                        rating={categoryRatings[category.id] || 0}
                                                        onRatingChange={(r) => handleCategoryRating(category.id, r)}
                                                        size="sm"
                                                    />
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Would Recommend */}
                                    <div>
                                        <p className="font-medium mb-4">Tavsiye eder misiniz?</p>
                                        <div className="flex gap-3">
                                            <button
                                                type="button"
                                                onClick={() => setWouldRecommend(true)}
                                                className={`flex-1 flex items-center justify-center gap-2 py-4 rounded-xl font-medium transition-all ${wouldRecommend === true
                                                    ? "bg-green-500 text-white"
                                                    : ""
                                                    }`}
                                                style={wouldRecommend !== true ? { backgroundColor: theme.primaryColor, color: theme.feedbackTextColor || theme.textColor } : {}}
                                            >
                                                <ThumbsUp className="w-5 h-5" />
                                                Evet
                                            </button>
                                            <button
                                                type="button"
                                                onClick={() => setWouldRecommend(false)}
                                                className={`flex-1 flex items-center justify-center gap-2 py-4 rounded-xl font-medium transition-all ${wouldRecommend === false
                                                    ? "bg-red-500 text-white"
                                                    : ""
                                                    }`}
                                                style={wouldRecommend !== false ? { backgroundColor: theme.primaryColor, color: theme.feedbackTextColor || theme.textColor } : {}}
                                            >
                                                <ThumbsUp className="w-5 h-5 rotate-180" />
                                                Hayır
                                            </button>
                                        </div>
                                    </div>

                                    {/* Comment */}
                                    <div>
                                        <label className="font-medium mb-2 block">
                                            Yorumunuz
                                        </label>
                                        <textarea
                                            value={comment}
                                            onChange={(e) => setComment(e.target.value)}
                                            placeholder="Deneyiminizi paylaşın... (İsteğe bağlı)"
                                            rows={4}
                                            className="w-full px-4 py-3 rounded-xl placeholder:opacity-30 focus:outline-none resize-none"
                                            style={{ backgroundColor: theme.primaryColor, color: theme.feedbackTextColor || theme.textColor }}
                                        />
                                    </div>

                                    {/* Submit Button */}
                                    <motion.button
                                        whileTap={{ scale: 0.98 }}
                                        type="submit"
                                        disabled={overallRating === 0 || isSubmitting}
                                        className="w-full flex items-center justify-center gap-2 py-4 rounded-xl font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                        style={{
                                            backgroundColor: theme.buttonColor,
                                            color: theme.buttonTextColor,
                                            borderRadius: theme.buttonRadius
                                        }}
                                    >
                                        {isSubmitting ? (
                                            <div className="w-5 h-5 border-2 border-t-transparent rounded-full animate-spin" style={{ borderColor: theme.buttonTextColor }} />
                                        ) : (
                                            <>
                                                <ArrowRight className="w-5 h-5" />
                                                Gönder
                                            </>
                                        )}
                                    </motion.button>
                                </form>
                            )}
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}
