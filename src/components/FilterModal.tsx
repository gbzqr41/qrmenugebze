"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Check } from "lucide-react";
import { useDataStore } from "@/context/DataStoreContext";

interface FilterModalProps {
    isOpen: boolean;
    onClose: () => void;
    onApply: (filters: FilterState) => void;
    initialFilters?: FilterState;
}

export interface FilterState {
    categories: string[];
    priceRange: { min: number; max: number };
    tags: string[];
}



const defaultFilters: FilterState = {
    categories: [],
    priceRange: { min: 0, max: 1000 },
    tags: [],
};

export default function FilterModal({
    isOpen,
    onClose,
    onApply,
    initialFilters = defaultFilters,
}: FilterModalProps) {
    const { categories, tags: availableTags } = useDataStore();
    const [filters, setFilters] = useState<FilterState>(initialFilters);

    useEffect(() => {
        setFilters(initialFilters);
    }, [initialFilters]);

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

    const toggleCategory = (categoryId: string) => {
        setFilters((prev) => ({
            ...prev,
            categories: prev.categories.includes(categoryId)
                ? prev.categories.filter((id) => id !== categoryId)
                : [...prev.categories, categoryId],
        }));
    };

    const toggleTag = (tag: string) => {
        setFilters((prev) => ({
            ...prev,
            tags: prev.tags.includes(tag)
                ? prev.tags.filter((t) => t !== tag)
                : [...prev.tags, tag],
        }));
    };

    const handleApply = () => {
        onApply(filters);
        onClose();
    };

    const handleReset = () => {
        setFilters(defaultFilters);
    };

    const hasActiveFilters =
        filters.categories.length > 0 ||
        filters.tags.length > 0 ||
        filters.priceRange.min > 0 ||
        filters.priceRange.max < 1000;

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
                        className="fixed bottom-0 left-0 right-0 z-50 bg-black rounded-t-3xl max-h-[85vh] overflow-hidden"
                    >
                        {/* Header */}
                        <div className="flex items-center justify-between p-4 border-b border-white/10">
                            <h2 className="text-lg font-bold text-white">Filtrele</h2>
                            <div className="flex items-center gap-3">
                                {hasActiveFilters && (
                                    <button
                                        onClick={handleReset}
                                        className="text-sm text-white/60 hover:text-white transition-colors"
                                    >
                                        Sıfırla
                                    </button>
                                )}
                                <button
                                    onClick={onClose}
                                    className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors"
                                >
                                    <X className="w-5 h-5 text-white" />
                                </button>
                            </div>
                        </div>

                        {/* Content */}
                        <div className="overflow-y-auto max-h-[65vh] p-4 pb-20 space-y-6">
                            {/* Categories */}
                            <div>
                                <h3 className="text-sm font-medium text-white/60 uppercase tracking-wider mb-3">
                                    Kategoriler
                                </h3>
                                <div className="flex flex-wrap gap-2">
                                    {categories.map((category) => {
                                        const isSelected = filters.categories.includes(category.id);
                                        return (
                                            <button
                                                key={category.id}
                                                onClick={() => toggleCategory(category.id)}
                                                className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${isSelected
                                                    ? "bg-white text-black"
                                                    : "bg-neutral-900 text-white/70 hover:bg-neutral-800"
                                                    }`}
                                            >
                                                {category.name}
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>

                            {/* Tags */}
                            <div>
                                <h3 className="text-sm font-medium text-white/60 uppercase tracking-wider mb-3">
                                    Etiketler
                                </h3>
                                <div className="space-y-2">
                                    {availableTags.map((tag) => {
                                        const isSelected = filters.tags.includes(tag);
                                        return (
                                            <button
                                                key={tag}
                                                onClick={() => toggleTag(tag)}
                                                className={`w-full flex items-center justify-between p-3 rounded-xl transition-all ${isSelected
                                                    ? "bg-white/10 border border-white/30"
                                                    : "bg-neutral-900 border border-transparent hover:bg-neutral-800"
                                                    }`}
                                            >
                                                <span className="text-white">{tag}</span>
                                                {isSelected && <Check className="w-5 h-5 text-white" />}
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>

                            {/* Price Range */}
                            <div>
                                <h3 className="text-sm font-medium text-white/60 uppercase tracking-wider mb-3">
                                    Fiyat Aralığı
                                </h3>
                                <div className="flex items-center gap-4">
                                    <div className="flex-1">
                                        <label className="text-xs text-white/40 mb-1 block">Min</label>
                                        <input
                                            type="number"
                                            value={filters.priceRange.min}
                                            onChange={(e) =>
                                                setFilters((prev) => ({
                                                    ...prev,
                                                    priceRange: {
                                                        ...prev.priceRange,
                                                        min: Number(e.target.value),
                                                    },
                                                }))
                                            }
                                            className="w-full px-4 py-3 bg-neutral-900 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-white/20"
                                            placeholder="₺0"
                                        />
                                    </div>
                                    <span className="text-white/40 mt-6">-</span>
                                    <div className="flex-1">
                                        <label className="text-xs text-white/40 mb-1 block">Max</label>
                                        <input
                                            type="number"
                                            value={filters.priceRange.max}
                                            onChange={(e) =>
                                                setFilters((prev) => ({
                                                    ...prev,
                                                    priceRange: {
                                                        ...prev.priceRange,
                                                        max: Number(e.target.value),
                                                    },
                                                }))
                                            }
                                            className="w-full px-4 py-3 bg-neutral-900 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-white/20"
                                            placeholder="₺1000"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Apply Button */}
                        <div className="p-4 border-t border-white/10">
                            <motion.button
                                whileTap={{ scale: 0.98 }}
                                onClick={handleApply}
                                className="w-full py-4 bg-white text-black rounded-2xl font-semibold hover:bg-neutral-100 transition-colors"
                            >
                                Uygula
                            </motion.button>
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}
