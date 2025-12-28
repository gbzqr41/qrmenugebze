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

/*
 * KART DEĞERLERİ:
 * - Kart genişliği: %100 (w-full)
 * - Kart minimum yüksekliği: 100px
 * - Sol içerik padding: 12px (p-3)
 * - Resim boyutu: 90x90px
 * - Resim margin: üst 5px, sağ 5px, alt 5px (m-[5px])
 * - Resim border-radius: 8px
 * - İsim font-size: 15px
 * - İsim margin-bottom: 4px
 * - Açıklama font-size: 12px
 * - Açıklama margin-bottom: 8px
 * - Fiyat font-size: 16px
 * - İndirim badge font-size: 10px
 * - Kartlar arası boşluk: ProductFeed'de cardGap (16px)
 */

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
            className="w-full flex cursor-pointer overflow-hidden"
            style={{
                backgroundColor: theme.menuBgColor || theme.cardColor,
                fontFamily: theme.fontFamily,
                borderRadius: `${theme.menuCardRadius || 12}px`,
                boxShadow: theme.cardShadowEnabled !== false
                    ? `0 10px 15px -3px ${theme.cardShadowColor || "rgba(0,0,0,0.3)"}`
                    : "none",
                border: theme.cardBorder,
                minHeight: "100px",
            }}
        >
            {/* Left Content - Name, Description, Price */}
            <div className="flex-1 flex flex-col justify-between" style={{ padding: "12px" }}>
                {/* Name */}
                <div>
                    <h3
                        className="font-semibold"
                        style={{
                            color: theme.menuTitleColor || theme.textColor,
                            fontSize: "15px",
                            marginBottom: "4px",
                        }}
                    >
                        {product.name}
                    </h3>

                    {/* Description - Fixed 2 line height */}
                    <p
                        style={{
                            color: theme.menuDescriptionColor || "rgba(255,255,255,0.5)",
                            fontSize: "12px",
                            marginBottom: "8px",
                            lineHeight: "1.4",
                            height: "33.6px",
                            display: "-webkit-box",
                            WebkitLineClamp: 2,
                            WebkitBoxOrient: "vertical" as const,
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            wordBreak: "break-word",
                        }}
                    >
                        {product.description}
                    </p>
                </div>

                {/* Price and Discount */}
                <div className="flex items-center" style={{ gap: "8px" }}>
                    <span
                        className="font-bold"
                        style={{
                            color: theme.accentColor,
                            fontSize: "16px",
                        }}
                    >
                        {product.price} TL
                    </span>
                    {hasDiscount && (
                        <span
                            className="line-through opacity-40"
                            style={{
                                color: theme.textColor,
                                fontSize: "12px",
                            }}
                        >
                            {product.originalPrice} TL
                        </span>
                    )}
                    {hasDiscount && (
                        <span
                            style={{
                                padding: "2px 6px",
                                backgroundColor: "#ef4444",
                                color: "#ffffff",
                                fontSize: "10px",
                                fontWeight: "bold",
                                borderRadius: "4px",
                            }}
                        >
                            %{discountPercentage}
                        </span>
                    )}
                </div>
            </div>

            {/* Right - Image with 5px margin from top, right, bottom */}
            <div
                className="relative shrink-0 overflow-hidden"
                style={{
                    width: "90px",
                    height: "calc(100% - 10px)",
                    margin: "5px",
                    marginLeft: "0",
                    borderRadius: `${theme.menuImageRadius || 8}px`,
                    boxShadow: theme.imageShadowEnabled
                        ? `0 4px 8px ${theme.imageShadowColor || "rgba(0,0,0,0.3)"}`
                        : "none",
                }}
            >
                {!product.image ? (
                    <div
                        className="absolute inset-0"
                        style={{ backgroundColor: theme.cardColor || '#404040' }}
                    />
                ) : isVideo ? (
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

                {/* Badges */}
                {product.isNew && (
                    <div className="absolute top-1 left-1">
                        <span
                            className="flex items-center gap-0.5"
                            style={{
                                padding: "2px 4px",
                                backgroundColor: theme.buttonColor,
                                color: theme.buttonTextColor,
                                fontSize: "8px",
                                fontWeight: "bold",
                                borderRadius: "4px",
                            }}
                        >
                            <Sparkles style={{ width: "8px", height: "8px" }} />
                            Yeni
                        </span>
                    </div>
                )}
            </div>
        </div>
    );
}
