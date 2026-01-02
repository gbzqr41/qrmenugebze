"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Heart, Trash2 } from "lucide-react";
import type { Product } from "@/data/mockData";
import { useTheme } from "@/context/ThemeContext";

interface FavoritesModalProps {
    isOpen: boolean;
    onClose: () => void;
    onProductClick: (product: Product) => void;
}

const getFavoritesKey = (slug: string) => `qrmenu_favorites_${slug}`;

interface FavoritesModalProps {
    isOpen: boolean;
    onClose: () => void;
    onProductClick: (product: Product) => void;
    slug: string;
}

export default function FavoritesModal({
    isOpen,
    onClose,
    onProductClick,
    slug,
}: FavoritesModalProps) {
    const { theme } = useTheme();
    const [favorites, setFavorites] = useState<Product[]>([]);

    // Load favorites from localStorage
    useEffect(() => {
        if (isOpen && slug) {
            try {
                const stored = localStorage.getItem(getFavoritesKey(slug));
                if (stored) {
                    setFavorites(JSON.parse(stored));
                } else {
                    setFavorites([]);
                }
            } catch (e) {
                console.error("Failed to load favorites", e);
                setFavorites([]);
            }
        }
    }, [isOpen, slug]);

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

    const removeFavorite = (productId: string) => {
        const updated = favorites.filter(f => f.id !== productId);
        setFavorites(updated);
        localStorage.setItem(getFavoritesKey(slug), JSON.stringify(updated));
    };

    const handleProductClick = (product: Product) => {
        onProductClick(product);
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
                            <div className="flex items-center gap-2">
                                <Heart className="w-5 h-5 text-white" />
                                <h2 className="text-lg font-bold text-white">Favoriler</h2>
                            </div>
                            <button
                                onClick={onClose}
                                className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors"
                            >
                                <X className="w-5 h-5 text-white" />
                            </button>
                        </div>

                        {/* Content */}
                        <div className="flex-1 overflow-y-auto p-4">
                            {favorites.length === 0 ? (
                                <div className="flex flex-col items-center justify-center h-full text-center">
                                    <Heart className="w-16 h-16 text-white/20 mb-4" />
                                    <h3 className="text-white font-semibold mb-2">Favori yok</h3>
                                    <p className="text-white/50 text-sm">
                                        Beğendiğiniz ürünleri favorilere ekleyin
                                    </p>
                                </div>
                            ) : (
                                <div className="space-y-4">
                                    {favorites.map((product) => (
                                        <div
                                            key={product.id}
                                            className="flex cursor-pointer overflow-hidden"
                                            style={{
                                                backgroundColor: theme.cardColor,
                                                borderRadius: "12px",
                                            }}
                                        >
                                            {/* Left Content */}
                                            <div
                                                className="flex-1 flex flex-col justify-between"
                                                style={{ padding: "12px" }}
                                                onClick={() => handleProductClick(product)}
                                            >
                                                <div>
                                                    <h3
                                                        className="font-semibold"
                                                        style={{
                                                            color: theme.textColor,
                                                            fontSize: "15px",
                                                            marginBottom: "4px",
                                                        }}
                                                    >
                                                        {product.name}
                                                    </h3>
                                                    <p
                                                        className="opacity-50 overflow-hidden"
                                                        style={{
                                                            color: theme.textColor,
                                                            fontSize: "12px",
                                                            lineHeight: "1.4",
                                                            height: "33.6px",
                                                            display: "-webkit-box",
                                                            WebkitLineClamp: 2,
                                                            WebkitBoxOrient: "vertical" as const,
                                                        }}
                                                    >
                                                        {product.description}
                                                    </p>
                                                </div>
                                                <div className="flex items-center gap-2 mt-2">
                                                    <span
                                                        className="font-bold"
                                                        style={{
                                                            color: theme.accentColor,
                                                            fontSize: "16px",
                                                        }}
                                                    >
                                                        {product.price} TL
                                                    </span>
                                                </div>
                                            </div>

                                            {/* Right - Image */}
                                            <div
                                                className="relative shrink-0 overflow-hidden"
                                                style={{
                                                    width: "90px",
                                                    height: "calc(100% - 10px)",
                                                    margin: "5px",
                                                    marginLeft: "0",
                                                    borderRadius: "8px",
                                                }}
                                                onClick={() => handleProductClick(product)}
                                            >
                                                <div
                                                    className="absolute inset-0 bg-cover bg-center"
                                                    style={{ backgroundImage: `url(${product.image})` }}
                                                />
                                            </div>

                                            {/* Delete Button */}
                                            <button
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    removeFavorite(product.id);
                                                }}
                                                className="flex items-center justify-center px-3 hover:bg-red-500/20 transition-colors"
                                            >
                                                <Trash2 className="w-5 h-5 text-red-400" />
                                            </button>
                                        </div>
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

// Helper function to add product to favorites (export for use in ProductDetailModal)
export function addToFavorites(product: Product, slug: string) {
    if (!slug) return false;
    try {
        const key = getFavoritesKey(slug);
        const stored = localStorage.getItem(key);
        const favorites: Product[] = stored ? JSON.parse(stored) : [];

        // Check if already exists
        if (!favorites.find(f => f.id === product.id)) {
            favorites.push(product);
            localStorage.setItem(key, JSON.stringify(favorites));
            return true;
        }
        return false;
    } catch (e) {
        console.error("Failed to add favorite", e);
        return false;
    }
}

export function removeFromFavorites(productId: string, slug: string) {
    if (!slug) return false;
    try {
        const key = getFavoritesKey(slug);
        const stored = localStorage.getItem(key);
        const favorites: Product[] = stored ? JSON.parse(stored) : [];
        const updated = favorites.filter(f => f.id !== productId);
        localStorage.setItem(key, JSON.stringify(updated));
        return true;
    } catch (e) {
        console.error("Failed to remove favorite", e);
        return false;
    }
}

export function isFavorite(productId: string, slug: string): boolean {
    if (!slug) return false;
    try {
        const key = getFavoritesKey(slug);
        const stored = localStorage.getItem(key);
        const favorites: Product[] = stored ? JSON.parse(stored) : [];
        return favorites.some(f => f.id === productId);
    } catch (e) {
        return false;
    }
}
