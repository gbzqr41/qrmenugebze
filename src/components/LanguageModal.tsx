"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Search, Languages } from "lucide-react";

interface LanguageModalProps {
    isOpen: boolean;
    onClose: () => void;
}

const languages = [
    { code: "tr", name: "Türkçe" },
    { code: "en", name: "English" },
    { code: "de", name: "Deutsch" },
    { code: "fr", name: "Français" },
    { code: "es", name: "Español" },
    { code: "it", name: "Italiano" },
    { code: "ru", name: "Русский" },
    { code: "ar", name: "العربية" },
    { code: "zh", name: "中文" },
    { code: "ja", name: "日本語" },
];

export default function LanguageModal({ isOpen, onClose }: LanguageModalProps) {
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedLanguage, setSelectedLanguage] = useState("tr");

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

    const filteredLanguages = languages.filter((lang) =>
        lang.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const handleSelectLanguage = (code: string) => {
        setSelectedLanguage(code);
        onClose();
    };

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

                    {/* Modal - Bottom Sheet 60% height */}
                    <motion.div
                        initial={{ y: "100%" }}
                        animate={{ y: 0 }}
                        exit={{ y: "100%" }}
                        transition={{ type: "spring", damping: 25, stiffness: 300 }}
                        className="fixed bottom-0 left-0 right-0 z-50 bg-black rounded-t-3xl flex flex-col"
                        style={{ height: "60%" }}
                    >
                        {/* Header - Same as FilterModal */}
                        <div className="flex items-center justify-between p-4 border-b border-white/10">
                            <div className="flex items-center gap-2">
                                <Languages className="w-5 h-5 text-white" />
                                <h2 className="text-lg font-bold text-white">Dil Seçin</h2>
                            </div>
                            <button
                                onClick={onClose}
                                className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors"
                            >
                                <X className="w-5 h-5 text-white" />
                            </button>
                        </div>

                        {/* Search */}
                        <div className="p-4">
                            <div className="relative">
                                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
                                <input
                                    type="text"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    placeholder="Dil ara..."
                                    className="w-full pl-12 pr-4 py-3 bg-white/5 rounded-xl text-white placeholder:text-white/40"
                                    style={{ border: "none", outline: "none", boxShadow: "none" }}
                                />
                            </div>
                        </div>

                        {/* Languages List */}
                        <div className="flex-1 overflow-y-auto px-4 pb-4">
                            <div className="space-y-2">
                                {filteredLanguages.map((lang) => (
                                    <button
                                        key={lang.code}
                                        onClick={() => handleSelectLanguage(lang.code)}
                                        className={`w-full flex items-center p-4 rounded-xl transition-colors focus:outline-none ${selectedLanguage === lang.code
                                            ? "bg-white/20"
                                            : "bg-white/5 hover:bg-white/10"
                                            }`}
                                    >
                                        <span className="text-white font-medium">{lang.name}</span>
                                    </button>
                                ))}
                            </div>
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}
