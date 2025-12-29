"use client";

import React, { useState, useEffect } from "react";
import {
    Save,
    Palette,
    SlidersHorizontal,
    LayoutGrid,
    Menu,
    Navigation,
    RotateCcw,
    Search,
    ShoppingBag,
    MessageSquare,
    Filter,
    X,
    Trash2,
} from "lucide-react";
import { useTheme, type ThemeSettings } from "@/context/ThemeContext";

// Tab definitions
const tabs = [
    { id: "general", label: "Genel", icon: Palette },
    { id: "menu", label: "Menü", icon: Menu },
];

// Font options
const fontOptions = [
    "Inter", "Poppins", "Roboto", "Open Sans", "Montserrat",
    "Playfair Display", "Lato", "Outfit", "Nunito", "Raleway",
    "Quicksand", "Josefin Sans"
];

// Color presets
const colorPresets = [
    { name: "Koyu Siyah", primary: "#000000", accent: "#ffffff", card: "#171717" },
    { name: "Lacivert", primary: "#1e3a5f", accent: "#60a5fa", card: "#0f2744" },
    { name: "Bordo", primary: "#7f1d1d", accent: "#fbbf24", card: "#5c1515" },
    { name: "Zümrüt", primary: "#064e3b", accent: "#10b981", card: "#053929" },
    { name: "Mor", primary: "#4c1d95", accent: "#a78bfa", card: "#3b1574" },
    { name: "Altın", primary: "#1c1917", accent: "#d4af37", card: "#292524" },
];
// Color input component - defined outside to prevent re-render
const ColorInput = ({ label, value, onChange }: { label: string; value: string; onChange: (v: string) => void }) => (
    <div>
        <div className="flex items-center justify-between mb-2">
            <label className="text-sm text-white/60">{label}</label>
            {value === "transparent" && (
                <span className="text-xs text-white/30 italic">Renk Yok</span>
            )}
        </div>
        <div className="flex gap-3">
            <div
                className="relative w-10 h-10 rounded-full overflow-hidden cursor-pointer flex-shrink-0"
                style={{ backgroundColor: value === "transparent" ? "#000" : value }}
            >
                <input
                    type="color"
                    value={value === "transparent" ? "#000000" : value}
                    onInput={(e) => onChange((e.target as HTMLInputElement).value)}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                />
                {value === "transparent" && (
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                        <Trash2 className="w-5 h-5 text-red-500" />
                    </div>
                )}
            </div>

            <div className="flex-1 flex gap-2">
                <input
                    type="text"
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    className="flex-1 px-4 py-3 bg-neutral-800 rounded-xl text-white font-mono text-sm focus:outline-none focus:ring-2 focus:ring-white/20"
                />
                <button
                    type="button"
                    onClick={() => onChange("transparent")}
                    className="px-3 py-2 bg-neutral-800 rounded-xl text-white/40 hover:text-red-500 hover:bg-neutral-700 transition-colors"
                    title="Rengi Sil"
                >
                    <Trash2 className="w-4 h-4" />
                </button>
            </div>
        </div>
    </div>
);

export default function DesignPage() {
    const { theme, updateTheme, showToast } = useTheme();
    const [activeTab, setActiveTab] = useState(() => {
        if (typeof window !== "undefined") {
            return localStorage.getItem("designActiveTab") || "general";
        }
        return "general";
    });
    const [localTheme, setLocalTheme] = useState<ThemeSettings>(theme);
    const [hasChanges, setHasChanges] = useState(false);

    // Persist activeTab to localStorage
    useEffect(() => {
        localStorage.setItem("designActiveTab", activeTab);
    }, [activeTab]);

    // Sync with theme context
    useEffect(() => {
        setLocalTheme(theme);
    }, [theme]);

    // Track changes
    useEffect(() => {
        const changed = JSON.stringify(localTheme) !== JSON.stringify(theme);
        setHasChanges(changed);
    }, [localTheme, theme]);

    const updateLocal = (updates: Partial<ThemeSettings>) => {
        setLocalTheme(prev => ({ ...prev, ...updates }));
    };

    const handleSave = () => {
        updateTheme(localTheme);
        showToast("✓ Tasarım ayarları kaydedildi!", "success");
        setHasChanges(false);
    };

    const handleReset = () => {
        setLocalTheme(theme);
        setHasChanges(false);
    };


    // Switch / Toggle Component
    const Toggle = ({ label, checked, onChange }: { label: string; checked: boolean; onChange: (v: boolean) => void }) => (
        <div className="flex items-center justify-between p-4 bg-neutral-900 rounded-xl border border-white/5">
            <span className="text-white/80 font-medium">{label}</span>
            <button
                onClick={() => onChange(!checked)}
                className={`w-12 h-6 rounded-full transition-colors relative ${checked ? "bg-green-500" : "bg-neutral-700"}`}
            >
                <div className={`w-4 h-4 bg-white rounded-full absolute top-1 transition-all ${checked ? "left-7" : "left-1"}`} />
            </button>
        </div>
    );

    // Number input with unit
    const NumberInput = ({ label, value, onChange, unit = "px", min = 0, max = 500 }: {
        label: string; value: number; onChange: (v: number) => void; unit?: string; min?: number; max?: number
    }) => {
        const [inputValue, setInputValue] = React.useState(String(value));

        // Sync inputValue when value prop changes (from parent)
        React.useEffect(() => {
            setInputValue(String(value));
        }, [value]);

        const handleBlur = () => {
            const num = parseInt(inputValue, 10);
            if (isNaN(num) || inputValue === "") {
                onChange(min);
                setInputValue(String(min));
            } else {
                const clamped = Math.min(max, Math.max(min, num));
                onChange(clamped);
                setInputValue(String(clamped));
            }
        };

        return (
            <div className="min-w-0">
                <label className="text-sm text-white/60 mb-2 block">{label}</label>
                <div className="flex items-center gap-2">
                    <input
                        type="text"
                        inputMode="numeric"
                        pattern="[0-9]*"
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value.replace(/\D/g, ""))}
                        onBlur={handleBlur}
                        className="w-full min-w-0 px-3 py-2.5 bg-neutral-800 rounded-xl text-white text-center font-mono focus:outline-none focus:ring-2 focus:ring-white/20"
                    />
                    <span className="text-white/50 font-mono text-sm shrink-0">{unit}</span>
                </div>
            </div>
        );
    };

    return (
        <div className="p-6 lg:p-8">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
                <div>
                    <h1 className="text-2xl font-bold text-white mb-1">Tasarım</h1>
                    <p className="text-white/50">QR menü görünümünü özelleştirin</p>
                </div>

            </div>

            {/* Fixed Save Buttons */}
            <div className="fixed bottom-8 right-[50px] z-50 flex items-center gap-3">
                {hasChanges && (
                    <button
                        onClick={handleReset}
                        className="flex items-center gap-2 px-[15px] py-[10px] bg-neutral-800 rounded-xl text-white/60 hover:text-white transition-colors shadow-lg"
                    >
                        <RotateCcw className="w-4 h-4" />
                        Geri Al
                    </button>
                )}
                <button
                    onClick={handleSave}
                    disabled={!hasChanges}
                    className={`flex items-center gap-2 px-[15px] py-[10px] rounded-xl font-semibold shadow-lg transition-all ${hasChanges
                        ? "bg-white text-black hover:bg-neutral-100"
                        : "bg-neutral-800 text-white/40 cursor-not-allowed"
                        }`}
                >
                    <Save className="w-4 h-4" />
                    Kaydet
                </button>
            </div>

            {/* Tabs */}
            <div className="flex gap-2 mb-8 overflow-x-auto scrollbar-hide pb-2">
                {tabs.map((tab) => {
                    const Icon = tab.icon;
                    const isActive = activeTab === tab.id;
                    return (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-medium text-sm whitespace-nowrap transition-all ${isActive
                                ? "bg-white text-black"
                                : "bg-neutral-900 text-white/60 hover:text-white hover:bg-neutral-800"
                                }`}
                        >
                            <Icon className="w-4 h-4" />
                            {tab.label}
                        </button>
                    );
                })}
            </div>

            {/* Tab Content */}
            <div className="space-y-6">
                {/* GENEL TAB */}
                {activeTab === "general" && (
                    <>
                        {/* Aç/Kapat (Visibility) Section */}
                        <div className="bg-neutral-900 rounded-2xl p-6 border border-white/5">
                            <h2 className="text-lg font-bold text-white mb-4">Aç / Kapat</h2>
                            <p className="text-white/40 text-sm mb-4">Menü sayfasında hangi bölümlerin görüneceğini ayarlayın</p>
                            <div className="space-y-3">
                                <Toggle
                                    label="Üst Menü (Header)"
                                    checked={localTheme.headerRatingEnabled !== false}
                                    onChange={(v) => updateLocal({ headerRatingEnabled: v } as any)}
                                />
                                <Toggle
                                    label="Slider"
                                    checked={localTheme.sliderEnabled !== false}
                                    onChange={(v) => updateLocal({ sliderEnabled: v } as any)}
                                />
                                <Toggle
                                    label="Detaylar (Ürün detay modalı)"
                                    checked={localTheme.detailsEnabled !== false}
                                    onChange={(v) => updateLocal({ detailsEnabled: v } as any)}
                                />
                                <Toggle
                                    label="Değerlendirme"
                                    checked={localTheme.feedbackEnabled !== false}
                                    onChange={(v) => updateLocal({ feedbackEnabled: v })}
                                />
                            </div>
                        </div>

                        {/* Ana Arka Plan Section */}
                        <div className="bg-neutral-900 rounded-2xl p-6 border border-white/5">
                            <h2 className="text-lg font-bold text-white mb-4">Ana Arka Plan</h2>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                <ColorInput
                                    label="Sayfa Arka Plan Rengi"
                                    value={localTheme.primaryColor || "#000000"}
                                    onChange={(v) => updateLocal({ primaryColor: v })}
                                />
                            </div>
                        </div>

                        {/* Üst Menü (Header) Section */}
                        <div className="bg-neutral-900 rounded-2xl p-6 border border-white/5">
                            <h2 className="text-lg font-bold text-white mb-4">Üst Menü</h2>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                <ColorInput
                                    label="Arka Plan Rengi"
                                    value={localTheme.headerBgColor || "rgba(0,0,0,0.95)"}
                                    onChange={(v) => updateLocal({ headerBgColor: v } as any)}
                                />
                                <ColorInput
                                    label="Başlık / Şirket İsmi Rengi"
                                    value={localTheme.headerTitleColor || "#ffffff"}
                                    onChange={(v) => updateLocal({ headerTitleColor: v } as any)}
                                />
                                <ColorInput
                                    label="Yıldız İkon Rengi"
                                    value={localTheme.headerStarColor || "#ffffff"}
                                    onChange={(v) => updateLocal({ headerStarColor: v } as any)}
                                />
                                <ColorInput
                                    label="Yıldız Arka Plan Rengi"
                                    value={localTheme.headerStarBgColor || "rgba(255,255,255,0.1)"}
                                    onChange={(v) => updateLocal({ headerStarBgColor: v } as any)}
                                />
                            </div>
                            {/* Rating Toggle */}
                            <div className="mt-4">
                                <Toggle
                                    label="Değerlendirme Butonu"
                                    checked={localTheme.headerRatingEnabled !== false}
                                    onChange={(v) => updateLocal({ headerRatingEnabled: v } as any)}
                                />
                                <p className="text-white/30 text-xs mt-2">Üst menüdeki yıldız değerlendirme butonunu göster/gizle</p>
                            </div>
                        </div>

                        {/* Slider Section */}
                        <div className="bg-neutral-900 rounded-2xl p-6 border border-white/5">
                            <h2 className="text-lg font-bold text-white mb-4">Slider</h2>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                <ColorInput
                                    label="Başlık Rengi"
                                    value={localTheme.sliderTitleColor || "#ffffff"}
                                    onChange={(v) => updateLocal({ sliderTitleColor: v } as any)}
                                />
                                <ColorInput
                                    label="Açıklama Rengi"
                                    value={localTheme.sliderSubtitleColor || "rgba(255,255,255,0.7)"}
                                    onChange={(v) => updateLocal({ sliderSubtitleColor: v } as any)}
                                />
                            </div>
                        </div>

                        {/* Kategoriler Section */}
                        <div className="bg-neutral-900 rounded-2xl p-6 border border-white/5">
                            <h2 className="text-lg font-bold text-white mb-4">Kategoriler</h2>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                <ColorInput
                                    label="Arka Plan Rengi"
                                    value={localTheme.categoryBgColor || localTheme.primaryColor}
                                    onChange={(v) => updateLocal({ categoryBgColor: v } as any)}
                                />
                                <ColorInput
                                    label="Aktif Kategori Arka Plan"
                                    value={localTheme.categoryActiveColor || localTheme.buttonColor}
                                    onChange={(v) => updateLocal({ categoryActiveColor: v } as any)}
                                />
                                <ColorInput
                                    label="Pasif Kategori Arka Plan"
                                    value={localTheme.categoryInactiveColor || localTheme.cardColor}
                                    onChange={(v) => updateLocal({ categoryInactiveColor: v } as any)}
                                />
                                <ColorInput
                                    label="Aktif Kategori Yazı Rengi"
                                    value={localTheme.categoryActiveTextColor || localTheme.buttonTextColor}
                                    onChange={(v) => updateLocal({ categoryActiveTextColor: v } as any)}
                                />
                                <ColorInput
                                    label="Pasif Kategori Yazı Rengi"
                                    value={localTheme.categoryInactiveTextColor || "#ffffff"}
                                    onChange={(v) => updateLocal({ categoryInactiveTextColor: v } as any)}
                                />
                                <ColorInput
                                    label="Kategori İkon Rengi"
                                    value={localTheme.categoryIconColor || "#ffffff"}
                                    onChange={(v) => updateLocal({ categoryIconColor: v } as any)}
                                />
                                <NumberInput
                                    label="Kategori Köşe Yuvarlaklığı"
                                    value={localTheme.categoryButtonRadius || 12}
                                    onChange={(v) => updateLocal({ categoryButtonRadius: v } as any)}
                                    max={30}
                                />
                            </div>
                        </div>

                        {/* Alt Menü Section */}
                        <div className="bg-neutral-900 rounded-2xl p-6 border border-white/5">
                            <h2 className="text-lg font-bold text-white mb-4">Alt Menü</h2>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                <ColorInput
                                    label="Arka Plan Rengi"
                                    value={localTheme.bottomNavBgColor || "rgba(0,0,0,0.95)"}
                                    onChange={(v) => updateLocal({ bottomNavBgColor: v } as any)}
                                />
                                <ColorInput
                                    label="Aktif İkon Rengi"
                                    value={localTheme.bottomNavActiveColor || "#ffffff"}
                                    onChange={(v) => updateLocal({ bottomNavActiveColor: v } as any)}
                                />
                                <ColorInput
                                    label="Pasif İkon Rengi"
                                    value={localTheme.bottomNavInactiveColor || "rgba(255,255,255,0.5)"}
                                    onChange={(v) => updateLocal({ bottomNavInactiveColor: v } as any)}
                                />
                            </div>
                        </div>

                        {/* Typography */}
                        <div className="bg-neutral-900 rounded-2xl p-6 border border-white/5">
                            <h2 className="text-lg font-bold text-white mb-4">Yazı Tipi</h2>
                            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                                {fontOptions.map((font) => (
                                    <button
                                        key={font}
                                        onClick={() => updateLocal({ fontFamily: font })}
                                        className={`p-4 rounded-xl border-2 transition-all ${localTheme.fontFamily === font
                                            ? "border-white bg-white/10"
                                            : "border-white/10 hover:border-white/30"
                                            }`}
                                        style={{ fontFamily: font }}
                                    >
                                        <span className="text-white text-lg">Aa</span>
                                        <p className="text-xs text-white/50 mt-1">{font}</p>
                                    </button>
                                ))}
                            </div>
                        </div>
                    </>
                )}

                {/* MENÜ TAB */}
                {activeTab === "menu" && (
                    <>
                        {/* Öne Çıkan Section */}
                        <div className="bg-neutral-900 rounded-2xl p-6 border border-white/5">
                            <h2 className="text-lg font-bold text-white mb-4">Öne Çıkan</h2>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                <ColorInput
                                    label="Başlık Rengi"
                                    value={localTheme.featuredTitleColor || "#ffffff"}
                                    onChange={(v) => updateLocal({ featuredTitleColor: v } as any)}
                                />
                                <ColorInput
                                    label="Menü Adı Rengi"
                                    value={localTheme.featuredNameColor || localTheme.textColor}
                                    onChange={(v) => updateLocal({ featuredNameColor: v } as any)}
                                />
                                <ColorInput
                                    label="Fiyat Rengi"
                                    value={localTheme.featuredPriceColor || localTheme.accentColor}
                                    onChange={(v) => updateLocal({ featuredPriceColor: v } as any)}
                                />
                                <ColorInput
                                    label="Kart Arka Plan"
                                    value={localTheme.featuredCardBgColor || localTheme.cardColor}
                                    onChange={(v) => updateLocal({ featuredCardBgColor: v } as any)}
                                />
                                <NumberInput
                                    label="Kart Köşe Yuvarlaklığı"
                                    value={localTheme.featuredCardRadius || 16}
                                    onChange={(v) => updateLocal({ featuredCardRadius: v } as any)}
                                    max={30}
                                />
                                <NumberInput
                                    label="Menü Köşe Yuvarlaklığı"
                                    value={localTheme.featuredMenuRadius || 12}
                                    onChange={(v) => updateLocal({ featuredMenuRadius: v } as any)}
                                    max={30}
                                />
                                <NumberInput
                                    label="Resim Köşe Yuvarlaklığı"
                                    value={localTheme.featuredImageRadius || 8}
                                    onChange={(v) => updateLocal({ featuredImageRadius: v } as any)}
                                    max={30}
                                />
                            </div>
                        </div>

                        {/* Kategori Section */}
                        <div className="bg-neutral-900 rounded-2xl p-6 border border-white/5">
                            <h2 className="text-lg font-bold text-white mb-4">Kategori</h2>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                <ColorInput
                                    label="Kategori Başlık Rengi"
                                    value={localTheme.categoryTitleColor || "#ffffff"}
                                    onChange={(v) => updateLocal({ categoryTitleColor: v } as any)}
                                />
                                <ColorInput
                                    label="Ürün Adet Rengi"
                                    value={localTheme.productCountColor || "rgba(255,255,255,0.4)"}
                                    onChange={(v) => updateLocal({ productCountColor: v } as any)}
                                />
                            </div>
                        </div>

                        {/* Menü Kart Section */}
                        <div className="bg-neutral-900 rounded-2xl p-6 border border-white/5">
                            <h2 className="text-lg font-bold text-white mb-4">Menü Kart</h2>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                <ColorInput
                                    label="Kart Arka Plan"
                                    value={localTheme.menuBgColor || localTheme.cardColor}
                                    onChange={(v) => updateLocal({ menuBgColor: v } as any)}
                                />
                                <ColorInput
                                    label="Başlık Rengi"
                                    value={localTheme.menuTitleColor || "#ffffff"}
                                    onChange={(v) => updateLocal({ menuTitleColor: v } as any)}
                                />
                                <ColorInput
                                    label="Açıklama Rengi"
                                    value={localTheme.menuDescriptionColor || "rgba(255,255,255,0.5)"}
                                    onChange={(v) => updateLocal({ menuDescriptionColor: v } as any)}
                                />
                                <NumberInput
                                    label="Kart Köşe Yuvarlaklığı"
                                    value={localTheme.menuCardRadius || 12}
                                    onChange={(v) => updateLocal({ menuCardRadius: v } as any)}
                                    max={30}
                                />
                                <NumberInput
                                    label="Resim Köşe Yuvarlaklığı"
                                    value={localTheme.menuImageRadius || 8}
                                    onChange={(v) => updateLocal({ menuImageRadius: v } as any)}
                                    max={30}
                                />
                            </div>

                            {/* Gölge Ayarları */}
                            <h3 className="text-md font-semibold text-white/80 mt-6 mb-4">Gölge Ayarları</h3>
                            <div className="space-y-4">
                                <Toggle
                                    label="Kart Gölgesi"
                                    checked={localTheme.cardShadowEnabled !== false}
                                    onChange={(v) => updateLocal({ cardShadowEnabled: v } as any)}
                                />
                                {localTheme.cardShadowEnabled !== false && (
                                    <>
                                        <ColorInput
                                            label="Kart Gölge Rengi"
                                            value={localTheme.cardShadowColor || "rgba(0,0,0,0.3)"}
                                            onChange={(v) => updateLocal({ cardShadowColor: v } as any)}
                                        />
                                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                                            <NumberInput
                                                label="X (Yatay)"
                                                value={localTheme.cardShadowX ?? 0}
                                                onChange={(v) => updateLocal({ cardShadowX: v } as any)}
                                                min={-50}
                                                max={50}
                                            />
                                            <NumberInput
                                                label="Y (Dikey)"
                                                value={localTheme.cardShadowY ?? 4}
                                                onChange={(v) => updateLocal({ cardShadowY: v } as any)}
                                                min={-50}
                                                max={50}
                                            />
                                            <NumberInput
                                                label="Blur"
                                                value={localTheme.cardShadowBlur ?? 15}
                                                onChange={(v) => updateLocal({ cardShadowBlur: v } as any)}
                                                min={0}
                                                max={100}
                                            />
                                            <NumberInput
                                                label="Spread"
                                                value={localTheme.cardShadowSpread ?? 0}
                                                onChange={(v) => updateLocal({ cardShadowSpread: v } as any)}
                                                min={-50}
                                                max={50}
                                            />
                                        </div>
                                    </>
                                )}
                                <Toggle
                                    label="Resim Gölgesi"
                                    checked={localTheme.imageShadowEnabled === true}
                                    onChange={(v) => updateLocal({ imageShadowEnabled: v } as any)}
                                />
                                {localTheme.imageShadowEnabled && (
                                    <>
                                        <ColorInput
                                            label="Resim Gölge Rengi"
                                            value={localTheme.imageShadowColor || "rgba(0,0,0,0.3)"}
                                            onChange={(v) => updateLocal({ imageShadowColor: v } as any)}
                                        />
                                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                                            <NumberInput
                                                label="X (Yatay)"
                                                value={localTheme.imageShadowX ?? 0}
                                                onChange={(v) => updateLocal({ imageShadowX: v } as any)}
                                                min={-50}
                                                max={50}
                                            />
                                            <NumberInput
                                                label="Y (Dikey)"
                                                value={localTheme.imageShadowY ?? 4}
                                                onChange={(v) => updateLocal({ imageShadowY: v } as any)}
                                                min={-50}
                                                max={50}
                                            />
                                            <NumberInput
                                                label="Blur"
                                                value={localTheme.imageShadowBlur ?? 10}
                                                onChange={(v) => updateLocal({ imageShadowBlur: v } as any)}
                                                min={0}
                                                max={100}
                                            />
                                            <NumberInput
                                                label="Spread"
                                                value={localTheme.imageShadowSpread ?? 0}
                                                onChange={(v) => updateLocal({ imageShadowSpread: v } as any)}
                                                min={-50}
                                                max={50}
                                            />
                                        </div>
                                    </>
                                )}
                            </div>
                        </div>

                        {/* Menü Detay Section */}
                        <div className="bg-neutral-900 rounded-2xl p-6 border border-white/5">
                            <h2 className="text-lg font-bold text-white mb-4">Menü Detay</h2>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                <ColorInput
                                    label="Sol İkon Arka Plan (Kapat)"
                                    value={localTheme.productCloseButtonBgColor || "rgba(0,0,0,0.5)"}
                                    onChange={(v) => updateLocal({ productCloseButtonBgColor: v } as any)}
                                />
                                <ColorInput
                                    label="Sağ İkon Arka Plan (Favori)"
                                    value={localTheme.productFavButtonBgColor || "rgba(0,0,0,0.5)"}
                                    onChange={(v) => updateLocal({ productFavButtonBgColor: v } as any)}
                                />
                                <ColorInput
                                    label="Arka Plan Rengi"
                                    value={localTheme.productCardBgColor || localTheme.cardColor}
                                    onChange={(v) => updateLocal({ productCardBgColor: v } as any)}
                                />
                                <ColorInput
                                    label="Başlık Rengi"
                                    value={localTheme.productTitleColor || "#ffffff"}
                                    onChange={(v) => updateLocal({ productTitleColor: v } as any)}
                                />
                                <ColorInput
                                    label="Açıklama Rengi"
                                    value={localTheme.productDescriptionColor || "rgba(255,255,255,0.8)"}
                                    onChange={(v) => updateLocal({ productDescriptionColor: v } as any)}
                                />
                                <ColorInput
                                    label="Fiyat Rengi"
                                    value={localTheme.productPriceColor || localTheme.accentColor}
                                    onChange={(v) => updateLocal({ productPriceColor: v } as any)}
                                />
                                <ColorInput
                                    label="Bilgi İkonları Rengi"
                                    value={localTheme.productInfoIconColor || "rgba(255,255,255,0.6)"}
                                    onChange={(v) => updateLocal({ productInfoIconColor: v } as any)}
                                />
                                <ColorInput
                                    label="Ayraç Çizgisi Rengi"
                                    value={localTheme.productDividerColor || "rgba(255,255,255,0.1)"}
                                    onChange={(v) => updateLocal({ productDividerColor: v } as any)}
                                />
                                <ColorInput
                                    label="Etiket Arka Plan"
                                    value={localTheme.productTagBgColor || localTheme.primaryColor}
                                    onChange={(v) => updateLocal({ productTagBgColor: v } as any)}
                                />
                                <ColorInput
                                    label="Etiket Yazı Rengi"
                                    value={localTheme.productTagTextColor || "#ffffff"}
                                    onChange={(v) => updateLocal({ productTagTextColor: v } as any)}
                                />
                                <NumberInput
                                    label="Etiket Köşe Yuvarlaklığı"
                                    value={localTheme.productTagRadius || 9999}
                                    onChange={(v) => updateLocal({ productTagRadius: v } as any)}
                                    max={50}
                                />
                            </div>
                        </div>
                    </>
                )}
            </div>

        </div >
    );
}
