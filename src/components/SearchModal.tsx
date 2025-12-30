"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Search as SearchIcon } from "lucide-react";
import { type Product } from "@/data/mockData";
import { useDataStore } from "@/context/DataStoreContext";
import { useTheme } from "@/context/ThemeContext";

interface SearchModalProps {
    isOpen: boolean;
    onClose: () => void;
    onProductSelect: (product: Product) => void;
}

export default function SearchModal({
    isOpen,
    onClose,
    onProductSelect,
}: SearchModalProps) {
    const { products } = useDataStore();
    const { theme } = useTheme();
    const [query, setQuery] = useState("");
    const [results, setResults] = useState<Product[]>([]);
    const inputRef = useRef<HTMLInputElement>(null);

    // Focus input when modal opens
    useEffect(() => {
        if (isOpen && inputRef.current) {
            setTimeout(() => inputRef.current?.focus(), 100);
        }
    }, [isOpen]);

    // Search products
    useEffect(() => {
        if (query.trim() === "") {
            setResults([]);
            return;
        }

        const searchQuery = query.toLowerCase();
        const filtered = products.filter(
            (product) =>
                product.name.toLowerCase().includes(searchQuery) ||
                product.description.toLowerCase().includes(searchQuery) ||
                product.tags.some((tag) => tag.toLowerCase().includes(searchQuery))
        );
        setResults(filtered);
    }, [query, products]);

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

    const handleProductClick = (product: Product) => {
        onProductSelect(product);
        setQuery("");
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

                    {/* Modal - Full height */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="fixed inset-0 z-50 flex flex-col bg-black"
                    >
                        {/* Header */}
                        <div className="flex items-center justify-between p-4 border-b border-white/10">
                            <div className="flex items-center gap-2">
                                <SearchIcon className="w-5 h-5 text-white" />
                                <h2 className="text-lg font-bold text-white">Ara</h2>
                            </div>
                            <button
                                onClick={onClose}
                                className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors"
                            >
                                <X className="w-5 h-5 text-white" />
                            </button>
                        </div>

                        {/* Search Input */}
                        <div className="p-4">
                            <div className="relative">
                                <SearchIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
                                <input
                                    ref={inputRef}
                                    type="text"
                                    value={query}
                                    onChange={(e) => setQuery(e.target.value)}
                                    placeholder="Ürün ara..."
                                    className="w-full pl-12 pr-12 py-4 bg-neutral-900 rounded-xl text-white placeholder:text-white/40 transition-colors duration-300"
                                    style={{
                                        border: 'none',
                                        outline: 'none',
                                        boxShadow: 'none',
                                    }}
                                />
                                {query && (
                                    <button
                                        onClick={() => setQuery("")}
                                        className="absolute right-4 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors"
                                    >
                                        <X className="w-3 h-3 text-white" />
                                    </button>
                                )}
                            </div>
                        </div>

                        {/* Results - Full remaining height, scrollable */}
                        <div className="flex-1 overflow-y-auto p-4 pb-24">
                            {query.trim() === "" ? (
                                <div className="text-center py-8 opacity-40">
                                    <SearchIcon className="w-12 h-12 mx-auto mb-3 opacity-50" />
                                    <p>Ürün aramak için yazın</p>
                                </div>
                            ) : results.length === 0 ? (
                                <div className="text-center py-8 opacity-40">
                                    <p>&quot;{query}&quot; için sonuç bulunamadı</p>
                                </div>
                            ) : (
                                <div className="space-y-3">
                                    {results.map((product) => (
                                        <button
                                            key={product.id}
                                            onClick={() => handleProductClick(product)}
                                            className="w-full flex items-center gap-4 p-3 rounded-xl transition-colors text-left"
                                            style={{
                                                backgroundColor: theme.searchResultBgColor || theme.cardColor,
                                                color: theme.searchResultTextColor || theme.textColor
                                            }}
                                        >
                                            <div
                                                className="w-16 h-16 rounded-lg bg-cover bg-center flex-shrink-0"
                                                style={{ backgroundImage: `url(${product.image})` }}
                                            />
                                            <div className="flex-1 min-w-0">
                                                <h3 className="font-medium truncate" style={{ color: theme.searchResultTextColor || theme.textColor }}>
                                                    {product.name}
                                                </h3>
                                                <p className="text-sm truncate opacity-50">
                                                    {product.description}
                                                </p>
                                                <p className="text-sm font-semibold mt-1" style={{ color: theme.accentColor }}>
                                                    {product.price} TL
                                                </p>
                                            </div>
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}
