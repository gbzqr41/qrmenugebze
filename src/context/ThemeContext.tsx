"use client";

import { createContext, useContext, useState, useEffect, ReactNode, useCallback } from "react";

export interface ThemeSettings {
    // Colors
    primaryColor: string;
    accentColor: string;
    cardColor: string;
    textColor: string;
    buttonColor: string;
    buttonTextColor: string;

    // Font
    fontFamily: string;

    // Button Styles
    buttonRadius: string;
    buttonShadow: string;

    // Card Styles
    cardRadius: string;
    cardShadow: string;
    cardBorder: string;
    cardBorderColor?: string;
    cardBorderWidth?: number;
    cardGap?: number;
    cardImageHeight?: number;
    cardShadowEnabled?: boolean;
    cardShadowColor?: string;
    cardShadowX?: number;
    cardShadowY?: number;
    cardShadowBlur?: number;
    cardShadowSpread?: number;
    imageShadowEnabled?: boolean;
    imageShadowColor?: string;
    imageShadowX?: number;
    imageShadowY?: number;
    imageShadowBlur?: number;
    imageShadowSpread?: number;

    // Typography
    titleSize: string;
    descriptionSize: string;
    priceSize: string;

    // Mode
    darkMode: boolean;

    // Slider
    sliderHeight?: number;
    sliderRadius?: number;
    sliderPaddingTop?: number;
    sliderPaddingBottom?: number;
    sliderPaddingLeft?: number;
    sliderPaddingRight?: number;
    sliderTitleColor?: string;
    sliderSubtitleColor?: string;
    sliderEnabled?: boolean;

    // Visibility toggles
    detailsEnabled?: boolean;
    feedbackEnabled?: boolean;

    // Header (Üst Menü)
    headerBgColor?: string;
    headerTitleColor?: string;
    headerStarColor?: string;
    headerStarBgColor?: string;
    headerRatingEnabled?: boolean;

    // Category Bar
    categoryBgColor?: string;
    categoryActiveColor?: string;
    categoryInactiveColor?: string;
    categoryActiveTextColor?: string;
    categoryInactiveTextColor?: string;
    categoryIconColor?: string;
    categoryButtonRadius?: number;
    categoryGap?: number;
    categoryPaddingX?: number;
    categoryPaddingY?: number;

    // Bottom Nav
    bottomNavBgColor?: string;
    bottomNavActiveColor?: string;
    bottomNavInactiveColor?: string;
    bottomNavBorderColor?: string;
    bottomNavIconSize?: number;
    bottomNavGap?: number;
    bottomNavPaddingY?: number;

    // Content Area
    categoryTitleColor?: string;
    productCountColor?: string;
    menuBgColor?: string;
    menuTitleColor?: string;
    menuDescriptionColor?: string;
    menuImageRadius?: number;
    menuCardRadius?: number;

    // Featured Section (Öne Çıkan)
    featuredTitleColor?: string;
    featuredNameColor?: string;
    featuredPriceColor?: string;
    featuredCardBgColor?: string;
    featuredCardRadius?: number;
    featuredMenuRadius?: number;
    featuredImageRadius?: number;

    // Search Modal
    searchBgColor?: string;
    searchInputBgColor?: string;
    searchTextColor?: string;
    searchResultBgColor?: string;
    searchResultTextColor?: string;

    // Product Detail Modal (Menü Detay)
    productModalBgColor?: string; // Backdrop/Container
    productCardBgColor?: string; // The text area
    productTextColor?: string;
    productCloseButtonBgColor?: string;
    productCloseIconColor?: string;
    productFavButtonBgColor?: string; // Favorite button bg (right)
    productTitleColor?: string;
    productDescriptionColor?: string;
    productPriceColor?: string;
    productInfoIconColor?: string; // Calorie, time icons
    productDividerColor?: string;
    productTagBgColor?: string;
    productTagTextColor?: string;
    productTagRadius?: number;

    // Feedback Modal
    feedbackModalBgColor?: string;
    feedbackCardBgColor?: string;
    feedbackTextColor?: string;
    feedbackBlur?: boolean;

    // Business Info Modal
    businessModalBgColor?: string;
    businessCardBgColor?: string;
    businessTextColor?: string;
    businessBlur?: boolean;

    // Other Blurs
    searchBlur?: boolean;
    productBlur?: boolean;
    bottomNavBlur?: boolean;
    categoryBlur?: boolean;
}

const defaultTheme: ThemeSettings = {
    primaryColor: "#000000",
    accentColor: "#ffffff",
    cardColor: "#171717",
    textColor: "#ffffff",
    buttonColor: "#ffffff",
    buttonTextColor: "#000000",
    fontFamily: "Inter",
    buttonRadius: "12px",
    buttonShadow: "0 4px 6px -1px rgba(255,255,255,0.1)",
    cardRadius: "16px",
    cardShadow: "0 10px 15px -3px rgba(0,0,0,0.3)",
    cardBorder: "1px solid rgba(255,255,255,0.05)",
    cardBorderColor: "rgba(255,255,255,0.05)",
    cardBorderWidth: 1,
    cardGap: 16,
    cardImageHeight: 160,
    cardShadowEnabled: true,
    cardShadowColor: "rgba(0,0,0,0.3)",
    cardShadowX: 0,
    cardShadowY: 4,
    cardShadowBlur: 15,
    cardShadowSpread: 0,
    imageShadowEnabled: false,
    imageShadowColor: "rgba(0,0,0,0.3)",
    imageShadowX: 0,
    imageShadowY: 4,
    imageShadowBlur: 10,
    imageShadowSpread: 0,
    titleSize: "16px",
    descriptionSize: "14px",
    priceSize: "18px",
    darkMode: true,
    // Slider defaults
    sliderHeight: 200,
    sliderRadius: 0,
    sliderPaddingTop: 0,
    sliderPaddingBottom: 0,
    sliderPaddingLeft: 0,
    sliderPaddingRight: 0,
    // Header defaults
    headerBgColor: "rgba(0,0,0,0.95)",
    headerTitleColor: "#ffffff",
    headerStarColor: "#ffffff",
    headerStarBgColor: "rgba(255,255,255,0.1)",
    headerRatingEnabled: true,
    // Category defaults
    categoryBgColor: "#000000",
    categoryActiveColor: "#ffffff",
    categoryInactiveColor: "#171717",
    categoryActiveTextColor: "#000000",
    categoryInactiveTextColor: "#ffffff",
    categoryIconColor: "#ffffff",
    categoryButtonRadius: 12,
    categoryGap: 12,
    categoryPaddingX: 16,
    categoryPaddingY: 10,
    // Bottom Nav defaults
    bottomNavBgColor: "rgba(0,0,0,0.95)",
    bottomNavActiveColor: "#ffffff",
    bottomNavInactiveColor: "rgba(255,255,255,0.5)",
    bottomNavBorderColor: "rgba(255,255,255,0.1)",
    bottomNavIconSize: 24,
    bottomNavGap: 0,
    bottomNavPaddingY: 12,
    // Content Area defaults
    categoryTitleColor: "#ffffff",
    productCountColor: "rgba(255,255,255,0.4)",
    menuBgColor: "#171717",
    menuTitleColor: "#ffffff",
    menuDescriptionColor: "rgba(255,255,255,0.5)",
    menuImageRadius: 8,
    // Search defaults
    searchBgColor: "#000000",
    searchInputBgColor: "#171717",
    searchTextColor: "#ffffff",
    searchResultBgColor: "#171717",
    searchResultTextColor: "#ffffff",
    // Product Detail defaults
    productModalBgColor: "rgba(0,0,0,0.8)",
    productCardBgColor: "#171717",
    productTextColor: "#ffffff",
    productCloseButtonBgColor: "rgba(0,0,0,0.5)",
    productCloseIconColor: "#ffffff",
    // Feedback defaults
    feedbackEnabled: true,
    feedbackModalBgColor: "#171717",
    feedbackCardBgColor: "#171717",
    feedbackTextColor: "#ffffff",
    feedbackBlur: true,
    // Business Info defaults
    businessModalBgColor: "rgba(0,0,0,0.8)",
    businessCardBgColor: "#171717",
    businessTextColor: "#ffffff",
    businessBlur: true,
    // Other Blur defaults
    searchBlur: true,
    productBlur: true,
    bottomNavBlur: true,
    categoryBlur: false,
};

interface ToastMessage {
    id: number;
    message: string;
    type: "success" | "info" | "warning";
}

interface ThemeContextType {
    theme: ThemeSettings;
    updateTheme: (settings: Partial<ThemeSettings>) => void;
    applyPreset: (presetName: string) => void;
    forceUpdate: number;
    toasts: ToastMessage[];
    showToast: (message: string, type?: "success" | "info" | "warning") => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

const colorPresets: Record<string, Partial<ThemeSettings>> = {
    "Koyu Siyah": {
        primaryColor: "#000000", accentColor: "#ffffff", cardColor: "#171717",
        searchBgColor: "#000000", searchInputBgColor: "#171717", searchTextColor: "#ffffff", searchResultBgColor: "#171717", searchResultTextColor: "#ffffff",
        productModalBgColor: "#000000", productCardBgColor: "#171717", productTextColor: "#ffffff", productCloseButtonBgColor: "rgba(0,0,0,0.5)", productCloseIconColor: "#ffffff",
        feedbackModalBgColor: "#171717", feedbackCardBgColor: "#171717", feedbackTextColor: "#ffffff",
        businessModalBgColor: "#000000", businessCardBgColor: "#171717", businessTextColor: "#ffffff"
    },
    "Lacivert": {
        primaryColor: "#1e3a5f", accentColor: "#60a5fa", cardColor: "#0f2744",
        searchBgColor: "#1e3a5f", searchInputBgColor: "#0f2744", searchTextColor: "#ffffff", searchResultBgColor: "#0f2744", searchResultTextColor: "#ffffff",
        productModalBgColor: "#1e3a5f", productCardBgColor: "#0f2744", productTextColor: "#ffffff", productCloseButtonBgColor: "rgba(0,0,0,0.5)", productCloseIconColor: "#ffffff",
        feedbackModalBgColor: "#0f2744", feedbackCardBgColor: "#0f2744", feedbackTextColor: "#ffffff",
        businessModalBgColor: "#1e3a5f", businessCardBgColor: "#0f2744", businessTextColor: "#ffffff"
    },
    "Bordo": {
        primaryColor: "#7f1d1d", accentColor: "#fbbf24", cardColor: "#5c1515",
        searchBgColor: "#7f1d1d", searchInputBgColor: "#5c1515", searchTextColor: "#ffffff", searchResultBgColor: "#5c1515", searchResultTextColor: "#ffffff",
        productModalBgColor: "#7f1d1d", productCardBgColor: "#5c1515", productTextColor: "#ffffff", productCloseButtonBgColor: "rgba(0,0,0,0.5)", productCloseIconColor: "#ffffff",
        feedbackModalBgColor: "#5c1515", feedbackCardBgColor: "#5c1515", feedbackTextColor: "#ffffff"
    },
    "Zümrüt": {
        primaryColor: "#064e3b", accentColor: "#10b981", cardColor: "#053929",
        searchBgColor: "#064e3b", searchInputBgColor: "#053929", searchTextColor: "#ffffff", searchResultBgColor: "#053929", searchResultTextColor: "#ffffff",
        productModalBgColor: "#064e3b", productCardBgColor: "#053929", productTextColor: "#ffffff", productCloseButtonBgColor: "rgba(0,0,0,0.5)", productCloseIconColor: "#ffffff",
        feedbackModalBgColor: "#053929", feedbackCardBgColor: "#053929", feedbackTextColor: "#ffffff"
    },
    "Mor": {
        primaryColor: "#4c1d95", accentColor: "#a78bfa", cardColor: "#3b1574",
        searchBgColor: "#4c1d95", searchInputBgColor: "#3b1574", searchTextColor: "#ffffff", searchResultBgColor: "#3b1574", searchResultTextColor: "#ffffff",
        productModalBgColor: "#4c1d95", productCardBgColor: "#3b1574", productTextColor: "#ffffff", productCloseButtonBgColor: "rgba(0,0,0,0.5)", productCloseIconColor: "#ffffff",
        feedbackModalBgColor: "#3b1574", feedbackCardBgColor: "#3b1574", feedbackTextColor: "#ffffff"
    },
    "Altın": {
        primaryColor: "#1c1917", accentColor: "#d4af37", cardColor: "#292524",
        searchBgColor: "#1c1917", searchInputBgColor: "#292524", searchTextColor: "#ffffff", searchResultBgColor: "#292524", searchResultTextColor: "#ffffff",
        productModalBgColor: "#1c1917", productCardBgColor: "#292524", productTextColor: "#ffffff", productCloseButtonBgColor: "rgba(0,0,0,0.5)", productCloseIconColor: "#ffffff",
        feedbackModalBgColor: "#292524", feedbackCardBgColor: "#292524", feedbackTextColor: "#ffffff"
    },
};

// Preset fonts that are already loaded in globals.css
const preloadedFonts = [
    "Inter", "Poppins", "Roboto", "Open Sans", "Montserrat",
    "Playfair Display", "Lato", "Outfit", "Nunito", "Raleway",
    "Quicksand", "Josefin Sans"
];

// Dynamically load Google Font if not preloaded
function loadGoogleFont(fontFamily: string) {
    if (preloadedFonts.includes(fontFamily)) return;

    const linkId = `google-font-${fontFamily.replace(/\s+/g, "-")}`;
    if (document.getElementById(linkId)) return;

    const link = document.createElement("link");
    link.id = linkId;
    link.rel = "stylesheet";
    link.href = `https://fonts.googleapis.com/css2?family=${encodeURIComponent(fontFamily)}:wght@400;500;600;700&display=swap`;
    document.head.appendChild(link);
}

// Apply theme to DOM
function applyThemeToDom(theme: ThemeSettings) {
    const root = document.documentElement;
    const isAdminPage = window.location.pathname.startsWith("/admin");

    // Load custom font if needed (for customer pages)
    if (!isAdminPage) {
        loadGoogleFont(theme.fontFamily);
    }

    // Colors - apply everywhere
    root.style.setProperty("--color-primary", theme.primaryColor);
    root.style.setProperty("--color-accent", theme.accentColor);
    root.style.setProperty("--color-card", theme.cardColor);
    root.style.setProperty("--color-text", theme.textColor);
    root.style.setProperty("--color-button", theme.buttonColor);
    root.style.setProperty("--color-button-text", theme.buttonTextColor);

    // Font - only for customer site, admin stays with Google Sans
    const fontToApply = isAdminPage ? "Google Sans" : theme.fontFamily;
    root.style.setProperty("--font-family", fontToApply);

    // Button styles
    root.style.setProperty("--button-radius", theme.buttonRadius);
    root.style.setProperty("--button-shadow", theme.buttonShadow);

    // Card styles
    root.style.setProperty("--card-radius", theme.cardRadius);
    root.style.setProperty("--card-shadow", theme.cardShadow);
    root.style.setProperty("--card-border", theme.cardBorder);

    // Typography
    root.style.setProperty("--title-size", theme.titleSize);
    root.style.setProperty("--description-size", theme.descriptionSize);
    root.style.setProperty("--price-size", theme.priceSize);

    // Apply to body - colors everywhere, font only for customer
    document.body.style.backgroundColor = theme.primaryColor;
    document.body.style.color = theme.textColor;
    document.body.style.fontFamily = isAdminPage
        ? "'Google Sans', -apple-system, BlinkMacSystemFont, sans-serif"
        : `${theme.fontFamily}, sans-serif`;

    // Save to localStorage
    localStorage.setItem("themeSettings", JSON.stringify(theme));
}

export function ThemeProvider({ children }: { children: ReactNode }) {
    const [theme, setTheme] = useState<ThemeSettings>(defaultTheme);
    const [isLoaded, setIsLoaded] = useState(false);
    const [forceUpdate, setForceUpdate] = useState(0);
    const [toasts, setToasts] = useState<ToastMessage[]>([]);

    // Load theme from localStorage on mount
    useEffect(() => {
        const savedTheme = localStorage.getItem("themeSettings");
        if (savedTheme) {
            try {
                const parsed = JSON.parse(savedTheme);
                const newTheme = { ...defaultTheme, ...parsed };
                setTheme(newTheme);
                applyThemeToDom(newTheme);
            } catch (e) {
                console.error("Failed to parse theme settings:", e);
            }
        }
        setIsLoaded(true);
    }, []);

    // Apply CSS variables when theme changes
    useEffect(() => {
        if (!isLoaded) return;
        applyThemeToDom(theme);
    }, [theme, isLoaded]);

    const showToast = useCallback((message: string, type: "success" | "info" | "warning" = "success") => {
        const id = Date.now();
        setToasts(prev => [...prev, { id, message, type }]);
        setTimeout(() => {
            setToasts(prev => prev.filter(t => t.id !== id));
        }, 3000);
    }, []);

    const updateTheme = useCallback((settings: Partial<ThemeSettings>) => {
        setTheme(prev => {
            const newTheme = { ...prev, ...settings };
            applyThemeToDom(newTheme);
            return newTheme;
        });
        setForceUpdate(prev => prev + 1);
    }, []);

    const applyPreset = useCallback((presetName: string) => {
        const preset = colorPresets[presetName];
        if (preset) {
            updateTheme(preset);
        }
    }, [updateTheme]);

    return (
        <ThemeContext.Provider value={{ theme, updateTheme, applyPreset, forceUpdate, toasts, showToast }}>
            {children}
            {/* Toast Container */}
            <div className="fixed bottom-24 left-4 z-[9999] flex flex-col gap-2">
                {toasts.map(toast => (
                    <div
                        key={toast.id}
                        className={`px-4 py-3 rounded-xl shadow-lg animate-slide-in flex items-center gap-2 ${toast.type === "success" ? "bg-green-500 text-white" :
                            toast.type === "warning" ? "bg-yellow-500 text-black" :
                                "bg-blue-500 text-white"
                            }`}
                        style={{
                            animation: "slideIn 0.3s ease-out"
                        }}
                    >
                        <span className="text-sm font-medium">{toast.message}</span>
                    </div>
                ))}
            </div>
            <style jsx global>{`
                @keyframes slideIn {
                    from {
                        opacity: 0;
                        transform: translateX(-20px);
                    }
                    to {
                        opacity: 1;
                        transform: translateX(0);
                    }
                }
            `}</style>
        </ThemeContext.Provider>
    );
}

export function useTheme() {
    const context = useContext(ThemeContext);
    if (!context) {
        throw new Error("useTheme must be used within a ThemeProvider");
    }
    return context;
}
