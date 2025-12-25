"use client";

import { useState, useEffect, useCallback } from "react";
import { useDataStore } from "@/context/DataStoreContext";
import { useTheme } from "@/context/ThemeContext";
import Link from "next/link";

export default function Slider() {
    const { business } = useDataStore();
    const { theme } = useTheme();
    const sliderItems = business.sliderItems || [];
    const [currentIndex, setCurrentIndex] = useState(0);

    const nextSlide = useCallback(() => {
        if (sliderItems.length === 0) return;
        setCurrentIndex((prev) => (prev + 1) % sliderItems.length);
    }, [sliderItems.length]);

    // Auto-play
    useEffect(() => {
        if (sliderItems.length === 0) return;
        const interval = setInterval(nextSlide, 5000);
        return () => clearInterval(interval);
    }, [nextSlide, sliderItems.length]);

    // Theme values
    const height = theme.sliderHeight || 200;
    const radius = theme.sliderRadius || 0;
    const paddingTop = theme.sliderPaddingTop || 0;
    const paddingBottom = theme.sliderPaddingBottom || 0;
    const paddingLeft = theme.sliderPaddingLeft || 0;
    const paddingRight = theme.sliderPaddingRight || 0;

    if (sliderItems.length === 0) {
        return (
            <div
                className="w-full bg-neutral-900 flex items-center justify-center"
                style={{
                    height: `${height}px`,
                    marginTop: paddingTop,
                    marginBottom: paddingBottom,
                    marginLeft: paddingLeft,
                    marginRight: paddingRight,
                    borderRadius: `${radius}px`,
                }}
            >
                <p className="text-white/40">Slider henüz eklenmedi</p>
            </div>
        );
    }

    const currentSlide = sliderItems[currentIndex];

    return (
        <div
            className="relative w-full overflow-hidden bg-neutral-900"
            style={{
                height: `${height}px`,
                marginTop: paddingTop,
                marginBottom: paddingBottom,
                marginLeft: paddingLeft,
                marginRight: paddingRight,
                borderRadius: `${radius}px`,
            }}
        >
            {/* Background Image - Full width */}
            <div
                className="absolute inset-0 bg-cover bg-center"
                style={{ backgroundImage: `url(${currentSlide.image})` }}
            />
            <div className="absolute inset-0 bg-gradient-to-r from-black/50 via-black/20 to-transparent" />

            {/* Content */}
            <div className="relative h-full flex flex-col justify-end px-6 pb-8">
                <h2 className="text-2xl font-bold text-white mb-2">
                    {currentSlide.title}
                </h2>
                {currentSlide.subtitle && (
                    <p className="text-sm text-white/70">
                        {currentSlide.subtitle}
                    </p>
                )}
            </div>

            {/* Click area - goes to linked product/category if set */}
            {currentSlide.link && (
                <Link
                    href={currentSlide.link}
                    className="absolute inset-0 z-10"
                />
            )}

            {/* Dots Navigation */}
            {sliderItems.length > 1 && (
                <div className="absolute bottom-4 right-4 flex items-center gap-2 z-20">
                    {sliderItems.map((_, index) => (
                        <button
                            key={index}
                            onClick={() => setCurrentIndex(index)}
                            className={`h-1.5 rounded-full ${index === currentIndex
                                ? "w-6 bg-white"
                                : "w-1.5 bg-white/40"
                                }`}
                        />
                    ))}
                </div>
            )}
        </div>
    );
}
