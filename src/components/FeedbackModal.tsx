"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Send, MessageSquare } from "lucide-react";
import StarRating from "./StarRating";

interface FeedbackModalProps {
    isOpen: boolean;
    onClose: () => void;
    productName?: string;
    productId?: string;
}

export default function FeedbackModal({
    isOpen,
    onClose,
    productName,
    productId,
}: FeedbackModalProps) {
    const [rating, setRating] = useState(0);
    const [comment, setComment] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSubmitted, setIsSubmitted] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (rating === 0) return;

        setIsSubmitting(true);

        // Simulate API call
        await new Promise((resolve) => setTimeout(resolve, 1000));

        console.log("Feedback submitted:", { productId, rating, comment });

        setIsSubmitting(false);
        setIsSubmitted(true);

        // Reset and close after showing success
        setTimeout(() => {
            setRating(0);
            setComment("");
            setIsSubmitted(false);
            onClose();
        }, 2000);
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
                        className="fixed bottom-0 left-0 right-0 z-50 bg-neutral-900 rounded-t-3xl max-h-[90vh] overflow-hidden"
                    >
                        {/* Header */}
                        <div className="flex items-center justify-between p-4 border-b border-white/10">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center">
                                    <MessageSquare className="w-5 h-5 text-white" />
                                </div>
                                <div>
                                    <h2 className="text-lg font-bold text-white">Değerlendirin</h2>
                                    {productName && (
                                        <p className="text-sm text-white/40">{productName}</p>
                                    )}
                                </div>
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
                                className="p-8 text-center"
                            >
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
                            </motion.div>
                        ) : (
                            <form onSubmit={handleSubmit} className="p-6 space-y-6">
                                {/* Star Rating */}
                                <div className="text-center">
                                    <p className="text-white/60 mb-4">Deneyiminizi puanlayın</p>
                                    <div className="flex justify-center">
                                        <StarRating
                                            rating={rating}
                                            onRatingChange={setRating}
                                            size="lg"
                                        />
                                    </div>
                                    {rating > 0 && (
                                        <motion.p
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            className="mt-2 text-sm text-white/40"
                                        >
                                            {rating === 1 && "Çok kötü"}
                                            {rating === 2 && "Kötü"}
                                            {rating === 3 && "Orta"}
                                            {rating === 4 && "İyi"}
                                            {rating === 5 && "Mükemmel!"}
                                        </motion.p>
                                    )}
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
                                        className="w-full px-4 py-3 bg-neutral-800 rounded-xl text-white placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-white/20 resize-none"
                                    />
                                </div>

                                {/* Submit Button */}
                                <motion.button
                                    whileTap={{ scale: 0.98 }}
                                    type="submit"
                                    disabled={rating === 0 || isSubmitting}
                                    className="w-full flex items-center justify-center gap-2 py-4 bg-white text-black rounded-xl font-semibold hover:bg-neutral-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
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
                            </form>
                        )}
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}
