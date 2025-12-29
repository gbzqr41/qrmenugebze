"use client";

import { useState, useEffect } from "react";
import { X, Clock, Flame, AlertTriangle, Heart } from "lucide-react";
import type { Product } from "@/data/mockData";
import { useTheme } from "@/context/ThemeContext";
import { addToFavorites, removeFromFavorites, isFavorite } from "./FavoritesModal";

interface ProductDetailModalProps {
    product: Product | null;
    isOpen: boolean;
    onClose: () => void;
}

export default function ProductDetailModal({
    product,
    isOpen,
    onClose,
}: ProductDetailModalProps) {
    const { theme } = useTheme();
    const [activeImageIndex, setActiveImageIndex] = useState(0);
    const [isFav, setIsFav] = useState(false);

    // Reset state when product changes
    useEffect(() => {
        if (product) {
            setActiveImageIndex(0);
            setIsFav(isFavorite(product.id));
        }
    }, [product]);

    const toggleFavorite = () => {
        if (!product) return;
        if (isFav) {
            removeFromFavorites(product.id);
            setIsFav(false);
        } else {
            addToFavorites(product);
            setIsFav(true);
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

    if (!product || !isOpen) return null;

    const currentMedia = product.gallery?.[activeImageIndex] || product.image;
    const isVideo = currentMedia.startsWith("data:video/") ||
        currentMedia.toLowerCase().includes(".mp4") ||
        currentMedia.toLowerCase().includes(".webm");

    return (
        <>
            {/* Backdrop */}
            <div
                onClick={onClose}
                className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50"
            />

            {/* Modal - Full width edge to edge, no side margins */}
            <div className="fixed inset-0 z-50 overflow-y-auto">
                {/* Product Image/Video - Full width, edge to edge */}
                <div className="relative w-full h-72 overflow-hidden bg-neutral-900">
                    {isVideo ? (
                        <video
                            key={activeImageIndex}
                            src={currentMedia}
                            className="absolute inset-0 w-full h-full object-cover"
                            muted
                            playsInline
                            loop
                            autoPlay
                        />
                    ) : (
                        <div
                            key={activeImageIndex}
                            className="absolute inset-0 bg-cover bg-center"
                            style={{ backgroundImage: `url(${currentMedia})` }}
                        />
                    )}
                    {/* Close Button */}
                    <button
                        onClick={onClose}
                        className="absolute top-4 left-4 z-60 w-10 h-10 rounded-full flex items-center justify-center backdrop-blur-md transition-colors"
                        style={{ backgroundColor: theme.productCloseButtonBgColor || 'rgba(0,0,0,0.5)' }}
                    >
                        <X className="w-6 h-6" style={{ color: theme.productCloseIconColor || '#ffffff' }} />
                    </button>

                    {/* Favorite Button */}
                    <button
                        onClick={toggleFavorite}
                        className="absolute top-4 right-4 z-60 w-10 h-10 rounded-full flex items-center justify-center backdrop-blur-md transition-colors"
                        style={{ backgroundColor: theme.productFavButtonBgColor || theme.productCloseButtonBgColor || 'rgba(0,0,0,0.5)' }}
                    >
                        <Heart
                            className="w-6 h-6"
                            style={{ color: isFav ? '#ef4444' : (theme.productCloseIconColor || '#ffffff') }}
                            fill={isFav ? '#ef4444' : 'none'}
                        />
                    </button>

                    {/* Gallery Thumbnails */}
                    {product.gallery && product.gallery.length > 1 && (
                        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-2 z-10">
                            {product.gallery.map((img, index) => (
                                <button
                                    key={index}
                                    onClick={() => setActiveImageIndex(index)}
                                    className={`w-12 h-12 rounded-full overflow-hidden border-2 ${activeImageIndex === index
                                        ? "border-white scale-110"
                                        : "border-white/30"
                                        }`}
                                >
                                    <div
                                        className="w-full h-full bg-cover bg-center"
                                        style={{ backgroundImage: `url(${img})` }}
                                    />
                                </button>
                            ))}
                        </div>
                    )}
                </div>

                {/* Content - Black div with top radius, full height */}
                <div
                    className="rounded-t-3xl -mt-6 relative z-10 min-h-[calc(100vh-18rem)] px-5 py-6 space-y-5 transition-colors duration-300 overflow-hidden"
                    style={{
                        backgroundColor: theme.productCardBgColor || theme.cardColor,
                        color: theme.productTextColor || theme.textColor
                    }}
                >
                    {/* Title */}
                    <h1
                        className="text-2xl font-bold break-words"
                        style={{ color: theme.productTitleColor || theme.productTextColor || theme.textColor }}
                    >
                        {product.name}
                    </h1>

                    {/* Description */}
                    <p
                        className="leading-relaxed break-words overflow-hidden"
                        style={{ color: theme.productDescriptionColor || 'rgba(255,255,255,0.8)' }}
                    >
                        {product.description}
                    </p>

                    {/* Price */}
                    <span
                        className="text-2xl font-bold block"
                        style={{ color: theme.productPriceColor || theme.accentColor }}
                    >
                        {product.price} TL
                    </span>

                    {/* Tags */}
                    {product.tags && product.tags.length > 0 && (
                        <div className="flex flex-wrap gap-2">
                            {product.tags.map((tag, index) => (
                                <span
                                    key={index}
                                    className="px-3 py-1 text-xs font-medium"
                                    style={{
                                        backgroundColor: theme.productTagBgColor || theme.primaryColor,
                                        color: theme.productTagTextColor || theme.textColor,
                                        borderRadius: `${theme.productTagRadius ?? 9999}px`
                                    }}
                                >
                                    {tag}
                                </span>
                            ))}
                        </div>
                    )}

                    {/* Info Row - Only show when detailsEnabled, with border lines */}
                    {theme.detailsEnabled !== false && (product.preparationTime || product.calories || (product.allergens && product.allergens.length > 0)) && (
                        <div
                            className="flex items-center gap-4 py-4 border-t border-b"
                            style={{ borderColor: 'rgba(255,255,255,0.1)' }}
                        >
                            {product.preparationTime && (
                                <div className="flex items-center gap-2" style={{ color: theme.productInfoIconColor || 'rgba(255,255,255,0.6)' }}>
                                    <Clock className="w-4 h-4" />
                                    <span className="text-sm">{product.preparationTime}</span>
                                </div>
                            )}
                            {product.calories && (
                                <div className="flex items-center gap-2" style={{ color: theme.productInfoIconColor || 'rgba(255,255,255,0.6)' }}>
                                    <Flame className="w-4 h-4" />
                                    <span className="text-sm">{product.calories} kcal</span>
                                </div>
                            )}
                            {product.allergens && product.allergens.length > 0 && (
                                <div className="flex items-center gap-2 text-amber-500/80">
                                    <AlertTriangle className="w-4 h-4" />
                                    <span className="text-sm">{product.allergens.join(", ")}</span>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </>
    );
}
