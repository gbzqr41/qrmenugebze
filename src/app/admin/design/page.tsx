"use client";

import { useState, useEffect } from "react";
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
} from "lucide-react";
import { useTheme, type ThemeSettings } from "@/context/ThemeContext";

// Tab definitions
const tabs = [
    { id: "general", label: "Genel", icon: Palette },
    { id: "slider", label: "Slider", icon: SlidersHorizontal },
    { id: "category", label: "Filtreleme", icon: Filter },
    { id: "menu", label: "Menü Kartları", icon: Menu },
    { id: "search", label: "Arama", icon: Search },
    { id: "product", label: "Ürün Detayı", icon: ShoppingBag },
    { id: "feedback", label: "Yorumlar", icon: MessageSquare },
    { id: "bottomNav", label: "Alt Menü", icon: Navigation },
    { id: "business", label: "İşletme Profili", icon: LayoutGrid },
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

export default function DesignPage() {
    const { theme, updateTheme, showToast } = useTheme();
    const [activeTab, setActiveTab] = useState("general");
    const [localTheme, setLocalTheme] = useState<ThemeSettings>(theme);
    const [hasChanges, setHasChanges] = useState(false);

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

    // Color input component
    const ColorInput = ({ label, value, onChange }: { label: string; value: string; onChange: (v: string) => void }) => (
        <div>
            <div className="flex items-center justify-between mb-2">
                <label className="text-sm text-white/60">{label}</label>
                {value === "transparent" && (
                    <span className="text-xs text-white/30 italic">Renk Yok</span>
                )}
            </div>
            <div className="flex gap-3">
                <div className="relative">
                    <input
                        type="color"
                        value={value === "transparent" ? "#000000" : value}
                        onChange={(e) => onChange(e.target.value)}
                        className="w-12 h-12 rounded-xl border-2 border-white/10 cursor-pointer bg-transparent p-0"
                    />
                    {value === "transparent" && (
                        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                            <X className="w-5 h-5 text-red-500" />
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
                        onClick={() => onChange("transparent")}
                        className="px-3 py-2 bg-neutral-800 rounded-xl text-white/40 hover:text-white hover:bg-neutral-700 transition-colors"
                        title="Renk Yok (Transparent)"
                    >
                        <X className="w-4 h-4" />
                    </button>
                </div>
            </div>
        </div>
    );

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
    }) => (
        <div>
            <label className="text-sm text-white/60 mb-2 block">{label}</label>
            <div className="flex items-center gap-2">
                <button
                    type="button"
                    onClick={() => onChange(Math.max(min, value - 1))}
                    className="w-10 h-10 rounded-lg bg-neutral-800 text-white hover:bg-neutral-700 flex items-center justify-center text-lg font-bold"
                >
                    −
                </button>
                <input
                    type="number"
                    min={min}
                    max={max}
                    value={value}
                    onChange={(e) => onChange(Math.min(max, Math.max(min, Number(e.target.value) || 0)))}
                    className="flex-1 px-4 py-2.5 bg-neutral-800 rounded-xl text-white text-center font-mono focus:outline-none focus:ring-2 focus:ring-white/20"
                />
                <button
                    type="button"
                    onClick={() => onChange(Math.min(max, value + 1))}
                    className="w-10 h-10 rounded-lg bg-neutral-800 text-white hover:bg-neutral-700 flex items-center justify-center text-lg font-bold"
                >
                    +
                </button>
                <span className="text-white/50 font-mono text-sm w-8">{unit}</span>
            </div>
        </div>
    );

    return (
        <div className="p-6 lg:p-8 max-w-5xl">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
                <div>
                    <h1 className="text-2xl font-bold text-white mb-1">Tasarım</h1>
                    <p className="text-white/50">QR menü görünümünü özelleştirin</p>
                </div>

                <div className="flex items-center gap-3">
                    {hasChanges && (
                        <button
                            onClick={handleReset}
                            className="flex items-center gap-2 px-4 py-2.5 bg-neutral-800 rounded-xl text-white/60 hover:text-white transition-colors"
                        >
                            <RotateCcw className="w-4 h-4" />
                            Geri Al
                        </button>
                    )}
                    <button
                        onClick={handleSave}
                        disabled={!hasChanges}
                        className={`flex items-center gap-2 px-6 py-2.5 rounded-xl font-semibold transition-all ${hasChanges
                            ? "bg-white text-black hover:bg-neutral-100"
                            : "bg-neutral-800 text-white/40 cursor-not-allowed"
                            }`}
                    >
                        <Save className="w-4 h-4" />
                        Kaydet
                    </button>
                </div>
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
                        {/* Color Presets */}
                        <div className="bg-neutral-900 rounded-2xl p-6 border border-white/5">
                            <h2 className="text-lg font-bold text-white mb-4">Renk Şablonları</h2>
                            <div className="grid grid-cols-3 sm:grid-cols-6 gap-3">
                                {colorPresets.map((preset) => (
                                    <button
                                        key={preset.name}
                                        onClick={() => updateLocal({
                                            primaryColor: preset.primary,
                                            accentColor: preset.accent,
                                            cardColor: preset.card,
                                        })}
                                        className="group flex flex-col items-center gap-2 p-3 rounded-xl hover:bg-white/5 transition-colors"
                                    >
                                        <div
                                            className="w-12 h-12 rounded-full border-2 border-white/20"
                                            style={{ background: `linear-gradient(135deg, ${preset.primary} 50%, ${preset.accent} 50%)` }}
                                        />
                                        <span className="text-xs text-white/60 group-hover:text-white">{preset.name}</span>
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Background & Accent Colors */}
                        <div className="bg-neutral-900 rounded-2xl p-6 border border-white/5">
                            <h2 className="text-lg font-bold text-white mb-4">Genel Renkler</h2>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                <ColorInput
                                    label="Arka Plan Rengi"
                                    value={localTheme.primaryColor}
                                    onChange={(v) => updateLocal({ primaryColor: v })}
                                />
                                <ColorInput
                                    label="Vurgu Rengi"
                                    value={localTheme.accentColor}
                                    onChange={(v) => updateLocal({ accentColor: v })}
                                />
                                <ColorInput
                                    label="Metin Rengi"
                                    value={localTheme.textColor}
                                    onChange={(v) => updateLocal({ textColor: v })}
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

                {/* SLIDER TAB */}
                {activeTab === "slider" && (
                    <>
                        <div className="bg-neutral-900 rounded-2xl p-6 border border-white/5">
                            <h2 className="text-lg font-bold text-white mb-4">Slider Boyutları</h2>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                <NumberInput
                                    label="Yükseklik"
                                    value={localTheme.sliderHeight || 300}
                                    onChange={(v) => updateLocal({ sliderHeight: v } as any)}
                                    max={500}
                                />
                                <NumberInput
                                    label="Köşe Yuvarlaklığı"
                                    value={localTheme.sliderRadius || 0}
                                    onChange={(v) => updateLocal({ sliderRadius: v } as any)}
                                    max={50}
                                />
                            </div>
                        </div>

                        <div className="bg-neutral-900 rounded-2xl p-6 border border-white/5">
                            <h2 className="text-lg font-bold text-white mb-4">Slider Boşlukları</h2>
                            <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
                                <NumberInput
                                    label="Üst Boşluk"
                                    value={localTheme.sliderPaddingTop || 0}
                                    onChange={(v) => updateLocal({ sliderPaddingTop: v } as any)}
                                    max={50}
                                />
                                <NumberInput
                                    label="Alt Boşluk"
                                    value={localTheme.sliderPaddingBottom || 0}
                                    onChange={(v) => updateLocal({ sliderPaddingBottom: v } as any)}
                                    max={50}
                                />
                                <NumberInput
                                    label="Sol Boşluk"
                                    value={localTheme.sliderPaddingLeft || 0}
                                    onChange={(v) => updateLocal({ sliderPaddingLeft: v } as any)}
                                    max={50}
                                />
                                <NumberInput
                                    label="Sağ Boşluk"
                                    value={localTheme.sliderPaddingRight || 0}
                                    onChange={(v) => updateLocal({ sliderPaddingRight: v } as any)}
                                    max={50}
                                />
                            </div>
                        </div>
                    </>
                )}

                {/* SEARCH TAB */}
                {activeTab === "search" && (
                    <>
                        <div className="bg-neutral-900 rounded-2xl p-6 border border-white/5 mb-6">
                            <h2 className="text-lg font-bold text-white mb-4">Arama Ekranı Genel</h2>
                            <div className="mb-6">
                                <Toggle
                                    label="Arkaplan Bulanıklığı (Blur)"
                                    checked={localTheme.searchBlur !== false}
                                    onChange={(v) => updateLocal({ searchBlur: v } as any)}
                                />
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                <ColorInput
                                    label="Arka Plan Rengi"
                                    value={localTheme.searchBgColor || localTheme.primaryColor}
                                    onChange={(v) => updateLocal({ searchBgColor: v } as any)}
                                />
                                <ColorInput
                                    label="Arama Kutusu Rengi"
                                    value={localTheme.searchInputBgColor || localTheme.cardColor}
                                    onChange={(v) => updateLocal({ searchInputBgColor: v } as any)}
                                />
                                <ColorInput
                                    label="Yazı Rengi"
                                    value={localTheme.searchTextColor || localTheme.textColor}
                                    onChange={(v) => updateLocal({ searchTextColor: v } as any)}
                                />
                            </div>
                        </div>

                        <div className="bg-neutral-900 rounded-2xl p-6 border border-white/5">
                            <h2 className="text-lg font-bold text-white mb-4">Arama Sonuçları</h2>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                <ColorInput
                                    label="Sonuç Kartı Rengi"
                                    value={localTheme.searchResultBgColor || localTheme.cardColor}
                                    onChange={(v) => updateLocal({ searchResultBgColor: v } as any)}
                                />
                                <ColorInput
                                    label="Sonuç Yazı Rengi"
                                    value={localTheme.searchResultTextColor || localTheme.textColor}
                                    onChange={(v) => updateLocal({ searchResultTextColor: v } as any)}
                                />
                            </div>
                        </div>
                    </>
                )}

                {/* PRODUCT TAB */}
                {activeTab === "product" && (
                    <>
                        <div className="bg-neutral-900 rounded-2xl p-6 border border-white/5 mb-6">
                            <h2 className="text-lg font-bold text-white mb-4">Ürün Detay Renkleri</h2>
                            <div className="mb-6">
                                <Toggle
                                    label="Arkaplan Bulanıklığı (Blur)"
                                    checked={localTheme.productBlur !== false}
                                    onChange={(v) => updateLocal({ productBlur: v } as any)}
                                />
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                <ColorInput
                                    label="Arka Plan (Backdrop)"
                                    value={localTheme.productModalBgColor || "rgba(0,0,0,0.8)"}
                                    onChange={(v) => updateLocal({ productModalBgColor: v } as any)}
                                />
                                <ColorInput
                                    label="Kart Rengi (İçerik)"
                                    value={localTheme.productCardBgColor || localTheme.cardColor}
                                    onChange={(v) => updateLocal({ productCardBgColor: v } as any)}
                                />
                                <ColorInput
                                    label="Yazı Rengi"
                                    value={localTheme.productTextColor || localTheme.textColor}
                                    onChange={(v) => updateLocal({ productTextColor: v } as any)}
                                />
                            </div>
                        </div>

                        <div className="bg-neutral-900 rounded-2xl p-6 border border-white/5">
                            <h2 className="text-lg font-bold text-white mb-4">Kapatma Butonu</h2>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                <ColorInput
                                    label="Buton Arka Planı (Blur)"
                                    value={localTheme.productCloseButtonBgColor || "rgba(0,0,0,0.5)"}
                                    onChange={(v) => updateLocal({ productCloseButtonBgColor: v } as any)}
                                />
                                <ColorInput
                                    label="İkon Rengi"
                                    value={localTheme.productCloseIconColor || "#ffffff"}
                                    onChange={(v) => updateLocal({ productCloseIconColor: v } as any)}
                                />
                            </div>
                        </div>
                    </>
                )}

                {/* FEEDBACK TAB */}
                {activeTab === "feedback" && (
                    <div className="bg-neutral-900 rounded-2xl p-6 border border-white/5">
                        <h2 className="text-lg font-bold text-white mb-4">Yorum Ekranı Renkleri</h2>
                        <div className="mb-6">
                            <Toggle
                                label="Arkaplan Bulanıklığı (Blur)"
                                checked={localTheme.feedbackBlur !== false}
                                onChange={(v) => updateLocal({ feedbackBlur: v } as any)}
                            />
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                            <ColorInput
                                label="Arka Plan (Backdrop)"
                                value={localTheme.feedbackModalBgColor || "rgba(0,0,0,0.8)"}
                                onChange={(v) => updateLocal({ feedbackModalBgColor: v } as any)}
                            />
                            <ColorInput
                                label="Pencere Rengi"
                                value={localTheme.feedbackCardBgColor || localTheme.cardColor}
                                onChange={(v) => updateLocal({ feedbackCardBgColor: v } as any)}
                            />
                            <ColorInput
                                label="Yazı Rengi"
                                value={localTheme.feedbackTextColor || localTheme.textColor}
                                onChange={(v) => updateLocal({ feedbackTextColor: v } as any)}
                            />
                        </div>
                    </div>
                )}

                {/* CATEGORY (Renamed to Filtreleme in UI) TAB */}
                {activeTab === "category" && (
                    <>
                        <div className="bg-neutral-900 rounded-2xl p-6 border border-white/5">
                            <h2 className="text-lg font-bold text-white mb-4">Filtreleme Çubuğu Renkleri</h2>
                            <div className="mb-6">
                                <Toggle
                                    label="Arkaplan Bulanıklığı (Blur)"
                                    checked={localTheme.categoryBlur === true}
                                    onChange={(v) => updateLocal({ categoryBlur: v } as any)}
                                />
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                <ColorInput
                                    label="Arka Plan Rengi"
                                    value={localTheme.categoryBgColor || localTheme.primaryColor}
                                    onChange={(v) => updateLocal({ categoryBgColor: v } as any)}
                                />
                                <ColorInput
                                    label="Aktif Buton Rengi"
                                    value={localTheme.categoryActiveColor || localTheme.buttonColor}
                                    onChange={(v) => updateLocal({ categoryActiveColor: v } as any)}
                                />
                                <ColorInput
                                    label="Pasif Buton Rengi"
                                    value={localTheme.categoryInactiveColor || localTheme.cardColor}
                                    onChange={(v) => updateLocal({ categoryInactiveColor: v } as any)}
                                />
                                <ColorInput
                                    label="Aktif Metin Rengi"
                                    value={localTheme.categoryActiveTextColor || localTheme.buttonTextColor}
                                    onChange={(v) => updateLocal({ categoryActiveTextColor: v } as any)}
                                />
                            </div>
                        </div>

                        <div className="bg-neutral-900 rounded-2xl p-6 border border-white/5">
                            <h2 className="text-lg font-bold text-white mb-4">Buton Stili</h2>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                <NumberInput
                                    label="Buton Köşe Yuvarlaklığı"
                                    value={localTheme.categoryButtonRadius || 12}
                                    onChange={(v) => updateLocal({ categoryButtonRadius: v } as any)}
                                    max={30}
                                />
                                <NumberInput
                                    label="Butonlar Arası Boşluk"
                                    value={localTheme.categoryGap || 12}
                                    onChange={(v) => updateLocal({ categoryGap: v } as any)}
                                    max={30}
                                />
                                <NumberInput
                                    label="Yatay Padding"
                                    value={localTheme.categoryPaddingX || 16}
                                    onChange={(v) => updateLocal({ categoryPaddingX: v } as any)}
                                    max={40}
                                />
                                <NumberInput
                                    label="Dikey Padding"
                                    value={localTheme.categoryPaddingY || 10}
                                    onChange={(v) => updateLocal({ categoryPaddingY: v } as any)}
                                    max={30}
                                />
                            </div>
                        </div>
                    </>
                )}

                {/* MENU CARDS TAB */}
                {activeTab === "menu" && (
                    <>
                        <div className="bg-neutral-900 rounded-2xl p-6 border border-white/5">
                            <h2 className="text-lg font-bold text-white mb-4">Kart Renkleri</h2>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                <ColorInput
                                    label="Kart Arka Plan"
                                    value={localTheme.cardColor}
                                    onChange={(v) => updateLocal({ cardColor: v })}
                                />
                                <ColorInput
                                    label="Kart Border Rengi"
                                    value={localTheme.cardBorderColor || "rgba(255,255,255,0.05)"}
                                    onChange={(v) => updateLocal({ cardBorderColor: v } as any)}
                                />
                            </div>
                        </div>

                        <div className="bg-neutral-900 rounded-2xl p-6 border border-white/5">
                            <h2 className="text-lg font-bold text-white mb-4">Kart Stili</h2>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                <NumberInput
                                    label="Köşe Yuvarlaklığı"
                                    value={parseInt(localTheme.cardRadius) || 16}
                                    onChange={(v) => updateLocal({ cardRadius: `${v}px` })}
                                    max={40}
                                />
                                <NumberInput
                                    label="Border Kalınlığı"
                                    value={localTheme.cardBorderWidth || 1}
                                    onChange={(v) => updateLocal({ cardBorderWidth: v } as any)}
                                    max={5}
                                />
                                <NumberInput
                                    label="Kartlar Arası Boşluk"
                                    value={localTheme.cardGap || 16}
                                    onChange={(v) => updateLocal({ cardGap: v } as any)}
                                    max={40}
                                />
                                <NumberInput
                                    label="Resim Yüksekliği"
                                    value={localTheme.cardImageHeight || 160}
                                    onChange={(v) => updateLocal({ cardImageHeight: v } as any)}
                                    max={300}
                                />
                            </div>
                        </div>

                        <div className="bg-neutral-900 rounded-2xl p-6 border border-white/5">
                            <h2 className="text-lg font-bold text-white mb-4">Fiyat Stili</h2>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                <ColorInput
                                    label="Fiyat Rengi"
                                    value={localTheme.accentColor}
                                    onChange={(v) => updateLocal({ accentColor: v })}
                                />
                                <NumberInput
                                    label="Fiyat Boyutu"
                                    value={parseInt(localTheme.priceSize) || 18}
                                    onChange={(v) => updateLocal({ priceSize: `${v}px` })}
                                    max={30}
                                />
                            </div>
                        </div>
                    </>
                )}

                {/* BOTTOM NAV TAB */}
                {activeTab === "bottomNav" && (
                    <>
                        <div className="bg-neutral-900 rounded-2xl p-6 border border-white/5">
                            <h2 className="text-lg font-bold text-white mb-4">Alt Menü Renkleri</h2>
                            <div className="mb-6">
                                <Toggle
                                    label="Arkaplan Bulanıklığı (Blur)"
                                    checked={localTheme.bottomNavBlur !== false}
                                    onChange={(v) => updateLocal({ bottomNavBlur: v } as any)}
                                />
                            </div>
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
                                <ColorInput
                                    label="Border Rengi"
                                    value={localTheme.bottomNavBorderColor || "rgba(255,255,255,0.1)"}
                                    onChange={(v) => updateLocal({ bottomNavBorderColor: v } as any)}
                                />
                            </div>
                        </div>

                        <div className="bg-neutral-900 rounded-2xl p-6 border border-white/5">
                            <h2 className="text-lg font-bold text-white mb-4">Alt Menü Boyutları</h2>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                <NumberInput
                                    label="İkon Boyutu"
                                    value={localTheme.bottomNavIconSize || 24}
                                    onChange={(v) => updateLocal({ bottomNavIconSize: v } as any)}
                                    max={40}
                                />
                                <NumberInput
                                    label="İkonlar Arası Boşluk"
                                    value={localTheme.bottomNavGap || 0}
                                    onChange={(v) => updateLocal({ bottomNavGap: v } as any)}
                                    max={30}
                                />
                                <NumberInput
                                    label="Dikey Padding"
                                    value={localTheme.bottomNavPaddingY || 12}
                                    onChange={(v) => updateLocal({ bottomNavPaddingY: v } as any)}
                                    max={30}
                                />
                            </div>
                        </div>
                    </>

                )}

                {/* BUSINESS TAB */}
                {activeTab === "business" && (
                    <>
                        <div className="bg-neutral-900 rounded-2xl p-6 border border-white/5">
                            <h2 className="text-lg font-bold text-white mb-4">İşletme Profili Renkleri</h2>
                            <div className="mb-6">
                                <Toggle
                                    label="Arkaplan Bulanıklığı (Blur)"
                                    checked={localTheme.businessBlur !== false}
                                    onChange={(v) => updateLocal({ businessBlur: v } as any)}
                                />
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                <ColorInput
                                    label="Arka Plan (Backdrop)"
                                    value={localTheme.businessModalBgColor || "rgba(0,0,0,0.8)"}
                                    onChange={(v) => updateLocal({ businessModalBgColor: v } as any)}
                                />
                                <ColorInput
                                    label="Kart Rengi"
                                    value={localTheme.businessCardBgColor || "#171717"}
                                    onChange={(v) => updateLocal({ businessCardBgColor: v } as any)}
                                />
                                <ColorInput
                                    label="Yazı Rengi"
                                    value={localTheme.businessTextColor || "#ffffff"}
                                    onChange={(v) => updateLocal({ businessTextColor: v } as any)}
                                />
                            </div>
                        </div>
                    </>
                )}
            </div>

            {/* Live Preview Hint */}
            <div className="mt-8 p-4 rounded-xl bg-neutral-900/50 border border-white/5">
                <p className="text-sm text-white/40 text-center">
                    💡 Değişiklikler anında önizlenir. Kaydet butonuna basarak kalıcı hale getirin.
                </p>
            </div>
        </div >
    );
}
