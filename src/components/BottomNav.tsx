"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { Home, Search, Filter, Info } from "lucide-react";
import { useTheme } from "@/context/ThemeContext";

interface NavItem {
    icon: typeof Home;
    label: string;
    href?: string;
    action?: "search" | "filter" | "feedback" | "business";
}

interface BottomNavProps {
    onSearchClick?: () => void;
    onFilterClick?: () => void;
    onFeedbackClick?: () => void;
    onBusinessClick?: () => void;
}

export default function BottomNav({ onSearchClick, onFilterClick, onFeedbackClick, onBusinessClick }: BottomNavProps) {
    const pathname = usePathname();
    const { theme } = useTheme();

    // Extract slug from pathname (e.g., /test-cafe/profile -> test-cafe)
    const pathParts = pathname.split("/").filter(Boolean);
    const slug = pathParts[0] || "";
    const baseHref = slug ? `/${slug}` : "/";

    const navItems: NavItem[] = [
        { icon: Home, label: "Anasayfa", href: baseHref },
        { icon: Search, label: "Ara", action: "search" },
        { icon: Filter, label: "Filtre", action: "filter" },
        { icon: Info, label: "Profil", action: "business" },
    ];

    // Theme values
    const bgColor = theme.bottomNavBgColor || "rgba(0,0,0,0.95)";
    const activeColor = theme.bottomNavActiveColor || "#ffffff";
    const inactiveColor = theme.bottomNavInactiveColor || "rgba(255,255,255,0.5)";
    const borderColor = theme.bottomNavBorderColor || "rgba(255,255,255,0.1)";
    const iconSize = theme.bottomNavIconSize || 24;
    const gap = theme.bottomNavGap || 0;
    const paddingY = theme.bottomNavPaddingY || 12;

    const handleClick = (item: NavItem) => {
        if (item.action === "search" && onSearchClick) {
            onSearchClick();
        } else if (item.action === "filter" && onFilterClick) {
            onFilterClick();
        } else if (item.action === "feedback" && onFeedbackClick) {
            onFeedbackClick();
        } else if (item.action === "business" && onBusinessClick) {
            onBusinessClick();
        }
    };

    return (
        <nav
            className="fixed bottom-0 left-0 right-0 z-[60] backdrop-blur-lg"
            style={{
                backgroundColor: bgColor,
                borderTop: `1px solid ${borderColor}`,
            }}
        >
            <div
                className="flex items-center justify-around px-4 max-w-lg mx-auto"
                style={{
                    paddingTop: `${paddingY}px`,
                    paddingBottom: `${paddingY}px`,
                    gap: `${gap}px`,
                }}
            >
                {navItems.map((item) => {
                    const Icon = item.icon;
                    const isActive = item.href ? pathname === item.href : false;

                    const content = (
                        <div
                            className="flex flex-col items-center gap-1 px-4 py-2 rounded-xl"
                            style={{ color: isActive ? activeColor : inactiveColor }}
                        >
                            <div className="relative">
                                <Icon style={{ width: iconSize, height: iconSize }} />
                                {isActive && (
                                    <div
                                        className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full"
                                        style={{ backgroundColor: activeColor }}
                                    />
                                )}
                            </div>
                            <span className="text-[10px] font-medium">{item.label}</span>
                        </div>
                    );

                    if (item.href) {
                        return (
                            <Link key={item.label} href={item.href}>
                                {content}
                            </Link>
                        );
                    }

                    return (
                        <button
                            key={item.label}
                            onClick={() => handleClick(item)}
                            className="focus:outline-none"
                        >
                            {content}
                        </button>
                    );
                })}
            </div>

            {/* Safe area padding for iOS */}
            <div className="h-safe-area-inset-bottom" style={{ backgroundColor: bgColor }} />
        </nav>
    );
}
