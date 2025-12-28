"use client";

import { useRef, useEffect, useState } from "react";
import {
    Salad,
    UtensilsCrossed,
    Pizza,
    Beef,
    Soup,
    Cake,
    Coffee,
    type LucideIcon,
} from "lucide-react";
import { useDataStore } from "@/context/DataStoreContext";
import { useTheme } from "@/context/ThemeContext";

// İkon mapping
const iconMap: Record<string, LucideIcon> = {
    Salad,
    UtensilsCrossed,
    Pizza,
    Beef,
    Soup,
    Cake,
    Coffee,
};

interface CategoryBarProps {
    activeCategory: string;
    onCategoryClick: (categoryId: string) => void;
}

export default function CategoryBar({ activeCategory, onCategoryClick }: CategoryBarProps) {
    const { categories } = useDataStore();
    const { theme } = useTheme();
    const containerRef = useRef<HTMLDivElement>(null);
    const scrollRef = useRef<HTMLDivElement>(null);
    const [isSticky, setIsSticky] = useState(false);

    // Theme values
    const bgColor = theme.categoryBgColor || theme.primaryColor;
    const activeColor = theme.categoryActiveColor || theme.buttonColor;
    const inactiveColor = theme.categoryInactiveColor || theme.cardColor;
    const activeTextColor = theme.categoryActiveTextColor || theme.buttonTextColor;
    const inactiveTextColor = theme.categoryInactiveTextColor || "#ffffff";
    const iconColor = theme.categoryIconColor || "#ffffff";
    const buttonRadius = theme.categoryButtonRadius || 12;
    const gap = theme.categoryGap || 12;
    const paddingX = theme.categoryPaddingX || 16;
    const paddingY = theme.categoryPaddingY || 10;

    // Sticky pozisyon kontrolü
    useEffect(() => {
        const handleScroll = () => {
            if (containerRef.current) {
                const rect = containerRef.current.getBoundingClientRect();
                setIsSticky(rect.top <= 60);
            }
        };

        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    // Aktif kategoriyi görünür alana scroll et ve ortala
    useEffect(() => {
        const activeBtn = document.getElementById(`category-${activeCategory}`);
        if (activeBtn && scrollRef.current) {
            const container = scrollRef.current;
            const containerWidth = container.offsetWidth;
            const btnOffsetLeft = activeBtn.offsetLeft;
            const btnWidth = activeBtn.offsetWidth;

            // Butonu ortalamak için scroll pozisyonu
            const scrollLeft = btnOffsetLeft - (containerWidth / 2) + (btnWidth / 2);
            container.scrollTo({ left: scrollLeft, behavior: "smooth" });
        }
    }, [activeCategory]);

    return (
        <div
            ref={containerRef}
            className={`sticky top-[60px] z-50 ${isSticky ? "shadow-lg shadow-black/50" : ""}`}
            style={{ backgroundColor: bgColor }}
        >
            <div
                ref={scrollRef}
                className="flex items-center px-5 py-4 overflow-x-auto scrollbar-hide"
                style={{ gap: `${gap}px` }}
            >
                {categories
                    .filter((category) => !category.isFeatured)
                    .map((category) => {
                        const Icon = iconMap[category.icon] || UtensilsCrossed;
                        const isActive = activeCategory === category.id;
                        const textColor = isActive ? activeTextColor : inactiveTextColor;

                        return (
                            <button
                                id={`category-${category.id}`}
                                key={category.id}
                                onClick={() => onCategoryClick(category.id)}
                                className="flex items-center gap-2 whitespace-nowrap transition-all duration-300"
                                style={{
                                    backgroundColor: isActive ? activeColor : inactiveColor,
                                    color: textColor,
                                    opacity: isActive ? 1 : 0.7,
                                    fontFamily: theme.fontFamily,
                                    borderRadius: `${buttonRadius}px`,
                                    padding: `${paddingY}px ${paddingX}px`,
                                }}
                            >
                                <Icon className="w-4 h-4" style={{ color: isActive ? textColor : iconColor }} />
                                <span className="text-sm font-medium">{category.name}</span>
                            </button>
                        );
                    })}
            </div>
        </div>
    );
}
