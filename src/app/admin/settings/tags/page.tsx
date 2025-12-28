"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Plus, Trash2, Tag } from "lucide-react";
import { useDataStore } from "@/context/DataStoreContext";

export default function TagsSettingsPage() {
    const { tags, addTag, removeTag } = useDataStore();
    const [tagInput, setTagInput] = useState("");
    const [isSaved, setIsSaved] = useState(false);

    const handleAddTag = () => {
        if (!tagInput.trim()) return;
        addTag(tagInput.trim());
        setTagInput("");
        setIsSaved(true);
        setTimeout(() => setIsSaved(false), 2000);
    };

    const handleRemoveTag = (tag: string) => {
        removeTag(tag);
        setIsSaved(true);
        setTimeout(() => setIsSaved(false), 2000);
    };

    return (
        <div className="max-w-2xl space-y-6">
            <div className="bg-neutral-900 rounded-2xl p-6 border border-white/5 space-y-5">
                <h2 className="text-lg font-bold text-white mb-2">Etiketler</h2>
                <p className="text-sm text-white/40 mb-4">Ürünlere atayabileceğiniz etiketleri buradan yönetin</p>

                <div className="flex gap-2 mb-4">
                    <input
                        type="text"
                        value={tagInput}
                        onChange={(e) => setTagInput(e.target.value)}
                        onKeyDown={(e) => {
                            if (e.key === "Enter") {
                                e.preventDefault();
                                handleAddTag();
                            }
                        }}
                        placeholder="Yeni etiket adı yazın..."
                        className="flex-1 px-4 py-3 bg-neutral-800 rounded-xl text-white placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-white/20"
                    />
                    <button
                        type="button"
                        onClick={handleAddTag}
                        className="px-4 py-3 bg-white/10 rounded-xl text-white hover:bg-white/20 transition-colors"
                    >
                        <Plus className="w-5 h-5" />
                    </button>
                </div>

                {tags.length > 0 ? (
                    <div className="flex flex-wrap gap-2">
                        {tags.map((tag) => (
                            <div
                                key={tag}
                                className="flex items-center gap-2 px-3 py-2 bg-neutral-800 rounded-lg"
                            >
                                <Tag className="w-4 h-4 text-white/60" />
                                <span className="text-white">{tag}</span>
                                <button
                                    type="button"
                                    onClick={() => handleRemoveTag(tag)}
                                    className="text-red-400 hover:text-red-300 transition-colors"
                                >
                                    <Trash2 className="w-4 h-4" />
                                </button>
                            </div>
                        ))}
                    </div>
                ) : (
                    <p className="text-white/30 text-sm italic">Henüz etiket eklenmemiş</p>
                )}
            </div>

            {isSaved && (
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 20 }}
                    className="fixed bottom-8 right-[50px] z-50 flex items-center gap-2 px-4 py-3 rounded-xl bg-green-500 text-white font-medium shadow-lg"
                >
                    Kaydedildi
                </motion.div>
            )}
        </div>
    );
}
