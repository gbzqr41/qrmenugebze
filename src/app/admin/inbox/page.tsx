"use client";

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Star, Trash2, Check, Mail, MailOpen, MessageSquare, TrendingUp, Users, Calendar, ArrowUpRight, Search, ChevronDown, ChevronUp, ThumbsUp } from "lucide-react";
import { useFeedback } from "@/context/FeedbackContext";

export default function InboxPage() {
    const { feedbacks, markAsRead, deleteFeedback, deleteAllFeedbacks } = useFeedback();
    const [searchTerm, setSearchTerm] = useState("");
    const [expandedIds, setExpandedIds] = useState<string[]>([]);

    const filteredFeedbacks = useMemo(() => {
        return feedbacks.filter(f =>
            f.author.toLowerCase().includes(searchTerm.toLowerCase()) ||
            f.comment.toLowerCase().includes(searchTerm.toLowerCase())
        );
    }, [feedbacks, searchTerm]);

    // Delete modal state
    const [deleteModal, setDeleteModal] = useState<{ open: boolean; type: 'single' | 'all'; id: string; name: string }>({
        open: false, type: 'single', id: '', name: ''
    });

    const handleDelete = (id: string, e: React.MouseEvent) => {
        e.stopPropagation();
        setDeleteModal({ open: true, type: 'single', id, name: 'Bu yorum' });
    };

    const confirmDelete = () => {
        if (deleteModal.type === 'single') {
            deleteFeedback(deleteModal.id);
        } else if (deleteModal.type === 'all') {
            deleteAllFeedbacks();
        }
        setDeleteModal({ open: false, type: 'single', id: '', name: '' });
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
            {/* Delete Confirmation Modal */}
            <AnimatePresence>
                {deleteModal.open && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm"
                        onClick={() => setDeleteModal({ open: false, type: 'single', id: '', name: '' })}
                    >
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            onClick={(e) => e.stopPropagation()}
                            className="bg-neutral-900 rounded-2xl p-6 max-w-md w-full mx-4 border border-white/10"
                        >
                            <div className="flex items-center gap-3 mb-4">
                                <div className="w-12 h-12 rounded-full bg-red-500/20 flex items-center justify-center">
                                    <Trash2 className="w-6 h-6 text-red-400" />
                                </div>
                                <div>
                                    <h3 className="text-lg font-bold text-white">Silmek istediğine emin misin?</h3>
                                    <p className="text-white/50 text-sm">
                                        {deleteModal.type === 'all'
                                            ? "Tüm geri bildirimler silinecek."
                                            : "Bu yorum kalıcı olarak silinecek."}
                                    </p>
                                </div>
                            </div>
                            <p className="text-white/60 mb-6">
                                {deleteModal.type === 'all'
                                    ? "Gelen kutusundaki BÜTÜN mesajları silmek üzeresin. Bu işlem geri alınamaz."
                                    : "Bu mesajı silmek üzeresin. Bu işlem geri alınamaz."}
                            </p>
                            <div className="flex gap-3">
                                <button
                                    onClick={() => setDeleteModal({ open: false, type: 'single', id: '', name: '' })}
                                    className="flex-1 px-4 py-3 rounded-xl bg-white/10 text-white font-medium hover:bg-white/20 transition-colors"
                                >
                                    İptal
                                </button>
                                <button
                                    onClick={confirmDelete}
                                    className="flex-1 px-4 py-3 rounded-xl bg-red-500 text-white font-medium hover:bg-red-600 transition-colors"
                                >
                                    Sil
                                </button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Header */}
            <div className="mb-8 flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-white mb-2">Gelen Kutusu</h1>
                    <p className="text-white/50">Müşteri geri bildirimleri</p>
                </div>
                {feedbacks.length > 0 && (
                    <button
                        onClick={() => setDeleteModal({ open: true, type: 'all', id: '', name: '' })}
                        className="px-4 py-2 bg-red-500/10 text-red-500 hover:bg-red-500/20 rounded-lg transition-colors flex items-center gap-2 font-medium"
                    >
                        <Trash2 className="w-4 h-4" />
                        <span>Tümünü Sil</span>
                    </button>
                )}
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
                                                <div>
                                                    <p className={`font-medium ${!feedback.isRead ? 'text-white' : 'text-white/70'}`}>
                                                        {feedback.author}
                                                    </p>
                                                    {feedback.phone && (
                                                        <p className="text-xs text-white/40">{feedback.phone}</p>
                                                    )}
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
