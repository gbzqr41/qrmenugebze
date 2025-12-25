"use client";

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Star, Trash2, Check, Mail, MailOpen, MessageSquare, TrendingUp, Users, Calendar, ArrowUpRight, Search, ChevronDown, ChevronUp, ThumbsUp } from "lucide-react";
import { useFeedback } from "@/context/FeedbackContext";

export default function InboxPage() {
    const { feedbacks, markAsRead, deleteFeedback } = useFeedback();
    const [searchTerm, setSearchTerm] = useState("");
    const [expandedIds, setExpandedIds] = useState<string[]>([]);

    const filteredFeedbacks = useMemo(() => {
        return feedbacks.filter(f =>
            f.author.toLowerCase().includes(searchTerm.toLowerCase()) ||
            f.comment.toLowerCase().includes(searchTerm.toLowerCase())
        );
    }, [feedbacks, searchTerm]);

    const handleDelete = (id: string, e: React.MouseEvent) => {
        e.stopPropagation();
        if (confirm("Bu yorumu silmek istediğinize emin misiniz?")) {
            deleteFeedback(id);
        }
    };

    const toggleExpand = (id: string) => {
        setExpandedIds(prev =>
            prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
        );
        markAsRead(id);
    };

    const formatDate = (dateStr: string) => {
        return new Date(dateStr).toLocaleDateString("tr-TR", {
            day: 'numeric',
            month: 'long',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    return (
        <div className="p-6 lg:p-8 min-h-screen pb-20">
            {/* Header */}
            <div className="mb-8">
                <h1 className="text-2xl font-bold text-white mb-2">Gelen Kutusu</h1>
                <p className="text-white/50">Müşteri geri bildirimleri</p>
            </div>

            {/* Table Search */}
            <div className="flex items-center gap-3 mb-4 bg-neutral-900 border border-white/5 rounded-xl px-4 py-3 max-w-md">
                <Search className="w-5 h-5 text-white/40" />
                <input
                    type="text"
                    placeholder="İsim veya yorum ara..."
                    className="bg-transparent text-white placeholder:text-white/30 focus:outline-none w-full"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>

            {/* Feedback Table */}
            {feedbacks.length === 0 ? (
                <div className="text-center py-20 bg-neutral-900/50 rounded-2xl border border-white/5 border-dashed">
                    <MessageSquare className="w-12 h-12 text-white/20 mx-auto mb-3" />
                    <p className="text-white/40">Henüz hiç yorum yapılmamış.</p>
                </div>
            ) : (
                <div className="bg-neutral-900 border border-white/5 rounded-2xl overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="border-b border-white/10 bg-white/5">
                                    <th className="p-4 text-sm font-medium text-white/50 w-64">Müşteri</th>
                                    <th className="p-4 text-sm font-medium text-white/50 w-32">Puan</th>
                                    <th className="p-4 text-sm font-medium text-white/50">Yorum</th>
                                    <th className="p-4 text-sm font-medium text-white/50 w-48">Tarih</th>
                                    <th className="p-4 text-sm font-medium text-white/50 w-24">İşlem</th>
                                </tr>
                            </thead>
                            <tbody>
                                <AnimatePresence initial={false}>
                                    {filteredFeedbacks.map((feedback) => (
                                        <motion.tr
                                            key={feedback.id}
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            exit={{ opacity: 0 }}
                                            onClick={() => toggleExpand(feedback.id)}
                                            className={`border-b border-white/5 cursor-pointer transition-colors ${!feedback.isRead ? 'bg-blue-500/5 hover:bg-blue-500/10' : 'hover:bg-white/5'
                                                }`}
                                        >
                                            {/* Customer */}
                                            <td className="p-4 align-top">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-white/20 to-white/5 flex items-center justify-center shrink-0">
                                                        <span className="font-medium text-white">
                                                            {feedback.author.charAt(0).toUpperCase()}
                                                        </span>
                                                    </div>
                                                    <div>
                                                        <p className={`font-medium ${!feedback.isRead ? 'text-white' : 'text-white/70'}`}>
                                                            {feedback.author}
                                                        </p>
                                                        {feedback.phone && (
                                                            <p className="text-xs text-white/40">{feedback.phone}</p>
                                                        )}
                                                    </div>
                                                </div>
                                            </td>

                                            {/* Rating */}
                                            <td className="p-4 align-top">
                                                <div className="flex items-center gap-1">
                                                    <Star className="w-4 h-4 fill-yellow-500 text-yellow-500" />
                                                    <span className="text-white font-medium">{feedback.rating}</span>
                                                </div>
                                            </td>

                                            {/* Comment */}
                                            <td className="p-4 align-top">
                                                <p className="text-white/80 line-clamp-2">
                                                    {feedback.comment || <span className="text-white/20 italic">Yorum yok</span>}
                                                </p>
                                                {/* Expanded Details */}
                                                <AnimatePresence>
                                                    {expandedIds.includes(feedback.id) && (
                                                        <motion.div
                                                            initial={{ height: 0, opacity: 0 }}
                                                            animate={{ height: "auto", opacity: 1 }}
                                                            exit={{ height: 0, opacity: 0 }}
                                                            className="overflow-hidden"
                                                        >
                                                            <div className="pt-4 mt-2 border-t border-white/5">
                                                                <p className="text-white/80 whitespace-pre-wrap mb-4">
                                                                    {feedback.comment}
                                                                </p>

                                                                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                                                                    <div className="bg-black/30 p-2 rounded-lg text-center">
                                                                        <span className="block text-xs text-white/40 mb-1">Yemek</span>
                                                                        <span className="text-white font-medium">{feedback.categories.food}</span>
                                                                    </div>
                                                                    <div className="bg-black/30 p-2 rounded-lg text-center">
                                                                        <span className="block text-xs text-white/40 mb-1">Servis</span>
                                                                        <span className="text-white font-medium">{feedback.categories.service}</span>
                                                                    </div>
                                                                    <div className="bg-black/30 p-2 rounded-lg text-center">
                                                                        <span className="block text-xs text-white/40 mb-1">Ambiyans</span>
                                                                        <span className="text-white font-medium">{feedback.categories.ambiance}</span>
                                                                    </div>
                                                                    <div className="bg-black/30 p-2 rounded-lg text-center flex items-center justify-center gap-2">
                                                                        <span className="text-xs text-white/40">Tavsiye?</span>
                                                                        {feedback.wouldRecommend ? (
                                                                            <ThumbsUp className="w-4 h-4 text-green-500" />
                                                                        ) : (
                                                                            <ThumbsUp className="w-4 h-4 text-red-500 rotate-180" />
                                                                        )}
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </motion.div>
                                                    )}
                                                </AnimatePresence>
                                            </td>

                                            {/* Date */}
                                            <td className="p-4 align-top">
                                                <span className="text-sm text-white/40">
                                                    {formatDate(feedback.createdAt)}
                                                </span>
                                            </td>

                                            {/* Actions */}
                                            <td className="p-4 align-top">
                                                <div className="flex gap-2">
                                                    <button
                                                        onClick={(e) => handleDelete(feedback.id, e)}
                                                        className="p-2 text-white/40 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
                                                        title="Sil"
                                                    >
                                                        <Trash2 className="w-4 h-4" />
                                                    </button>
                                                    <button
                                                        className="p-2 text-white/40 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
                                                        title="Detay"
                                                    >
                                                        {expandedIds.includes(feedback.id) ? (
                                                            <ChevronUp className="w-4 h-4" />
                                                        ) : (
                                                            <ChevronDown className="w-4 h-4" />
                                                        )}
                                                    </button>
                                                </div>
                                            </td>
                                        </motion.tr>
                                    ))}
                                </AnimatePresence>
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </div>
    );
}
