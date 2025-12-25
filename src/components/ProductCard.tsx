"use client";

import { Sparkles } from "lucide-react";
import type { Product } from "@/data/mockData";
import { useTheme } from "@/context/ThemeContext";

interface ProductCardProps {
    product: Product;
    index: number;
    onClick: () => void;
}

// Helper to detect if URL is video
function isVideoUrl(url: string): boolean {
    if (url.startsWith("data:video/")) return true;
    const lowerUrl = url.toLowerCase();
    return lowerUrl.includes(".mp4") || lowerUrl.includes(".webm") || lowerUrl.includes(".mov");
}

export default function ProductCard({ product, onClick }: ProductCardProps) {
    const { theme } = useTheme();
    const hasDiscount = product.originalPrice && product.originalPrice > product.price;
    const discountPercentage = hasDiscount
        ? Math.round(((product.originalPrice! - product.price) / product.originalPrice!) * 100)
        : 0;

    const isVideo = isVideoUrl(product.image);

    return (
        <div
            onClick={onClick}
            className="relative overflow-hidden cursor-pointer"
            style={{
                backgroundColor: theme.cardColor,
                fontFamily: theme.fontFamily,
                borderRadius: theme.cardRadius,
                boxShadow: theme.cardShadow,
                border: theme.cardBorder,
            }}
        >
            {/* Image/Video Container */}
            <div
                className="relative overflow-hidden"
                style={{
                    backgroundColor: theme.cardColor,
                    height: `${theme.cardImageHeight || 160}px`,
                }}
            >
                {isVideo ? (
                    <video
                        src={product.image}
                        className="absolute inset-0 w-full h-full object-cover"
                        muted
                        playsInline
                        loop
                        autoPlay
                    />
                ) : (
                    <div
                        className="absolute inset-0 bg-cover bg-center"
                        style={{ backgroundImage: `url(${product.image})` }}
                    />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent" />

                {/* Badges */}
                <div className="absolute top-3 left-3 flex flex-wrap gap-2">
                    {product.isNew && (
                        <span
                            className="px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider flex items-center gap-1"
                            style={{
                                backgroundColor: theme.buttonColor,
                                color: theme.buttonTextColor,
                                borderRadius: theme.buttonRadius,
                            }}
                        >
                            <Sparkles className="w-3 h-3" />
                            Yeni
                        </span>
                    )}
                    {hasDiscount && (
                        <span
                            className="px-2.5 py-1 bg-red-500 text-white text-[10px] font-bold uppercase tracking-wider"
                            style={{ borderRadius: theme.buttonRadius }}
                        >
                            %{discountPercentage}
                        </span>
                    )}
                    {product.tags.includes("Chef's Special") && (
                        <span
                            className="px-2.5 py-1 bg-amber-500 text-black text-[10px] font-bold uppercase tracking-wider"
                            style={{ borderRadius: theme.buttonRadius }}
                        >
                            Chef&apos;s Special
                        </span>
                    )}
                </div>
            </div>

            {/* Content */}
            <div className="p-4">
                <h3
                    className="font-semibold mb-1 truncate"
                    style={{
                        color: theme.textColor,
                        fontSize: theme.titleSize,
                    }}
                >
                    {product.name}
                </h3>
                <p
                    className="mb-3 line-clamp-2 min-h-[40px] opacity-50"
                    style={{
                        color: theme.textColor,
                        fontSize: theme.descriptionSize,
                    }}
                >
                    {product.description}
                </p>

                {/* Price - TL on right */}
                <div className="flex items-center gap-2">
                    <span
                        className="font-bold"
                        style={{
                            color: theme.accentColor,
                            fontSize: theme.priceSize,
                        }}
                    >
                        {product.price} TL
                    </span>
                    {hasDiscount && (
                        <span
                            className="line-through opacity-40"
                            style={{
                                color: theme.textColor,
                                fontSize: theme.descriptionSize,
                            }}
                        >
                            {product.originalPrice} TL
                        </span>
                    )}
                </div>
            </div>
        </div>
    );
}
