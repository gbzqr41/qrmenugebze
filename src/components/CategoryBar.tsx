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
    const scrollRef = useRef<HTMLDivElement>(null);
    const [isSticky, setIsSticky] = useState(false);

    // Theme values
    const bgColor = theme.categoryBgColor || theme.primaryColor;
    const activeColor = theme.categoryActiveColor || theme.buttonColor;
    const inactiveColor = theme.categoryInactiveColor || theme.cardColor;
    const activeTextColor = theme.categoryActiveTextColor || theme.buttonTextColor;
    const buttonRadius = theme.categoryButtonRadius || 12;
    const gap = theme.categoryGap || 12;
    const paddingX = theme.categoryPaddingX || 16;
    const paddingY = theme.categoryPaddingY || 10;

    // Sticky pozisyon kontrolü
    useEffect(() => {
        const handleScroll = () => {
            if (scrollRef.current) {
                const rect = scrollRef.current.getBoundingClientRect();
                setIsSticky(rect.top <= 0);
            }
        };

        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    // Aktif kategoriyi görünür alana scroll et
    useEffect(() => {
        const activeBtn = document.getElementById(`category-${activeCategory}`);
        if (activeBtn && scrollRef.current) {
            const container = scrollRef.current;
            const scrollLeft = activeBtn.offsetLeft - container.offsetWidth / 2 + activeBtn.offsetWidth / 2;
            container.scrollTo({ left: scrollLeft, behavior: "smooth" });
        }
    }, [activeCategory]);

    return (
        <div
            ref={scrollRef}
            className={`sticky top-0 z-50 ${isSticky ? "shadow-lg shadow-black/50" : ""}`}
            style={{ backgroundColor: bgColor }}
        >
            <div
                className="flex items-center px-5 py-4 overflow-x-auto scrollbar-hide"
                style={{ gap: `${gap}px` }}
            >
                {categories.map((category) => {
                    const Icon = iconMap[category.icon] || UtensilsCrossed;
                    const isActive = activeCategory === category.id;

                    return (
                        <button
                            id={`category-${category.id}`}
                            key={category.id}
                            onClick={() => onCategoryClick(category.id)}
                            className="flex items-center gap-2 whitespace-nowrap"
                            style={{
                                backgroundColor: isActive ? activeColor : inactiveColor,
                                color: isActive ? activeTextColor : theme.textColor,
                                opacity: isActive ? 1 : 0.7,
                                fontFamily: theme.fontFamily,
                                borderRadius: `${buttonRadius}px`,
                                padding: `${paddingY}px ${paddingX}px`,
                            }}
                        >
                            <Icon className="w-4 h-4" />
                            <span className="text-sm font-medium">{category.name}</span>
                        </button>
                    );
                })}
            </div>
        </div>
    );
}
