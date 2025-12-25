"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Save, Palette, Check, Type, Square, Sparkles, Sun, Moon, Radius, TextCursor } from "lucide-react";
import { useTheme } from "@/context/ThemeContext";

// Color presets
const colorPresets = [
    { name: "Koyu Siyah", primary: "#000000", accent: "#ffffff", card: "#171717" },
    { name: "Lacivert", primary: "#1e3a5f", accent: "#60a5fa", card: "#0f2744" },
    { name: "Bordo", primary: "#7f1d1d", accent: "#fbbf24", card: "#5c1515" },
    { name: "Zümrüt", primary: "#064e3b", accent: "#10b981", card: "#053929" },
    { name: "Mor", primary: "#4c1d95", accent: "#a78bfa", card: "#3b1574" },
    { name: "Altın", primary: "#1c1917", accent: "#d4af37", card: "#292524" },
];

// Google Fonts - Comprehensive list
const googleFonts = [
    "Inter", "Poppins", "Roboto", "Open Sans", "Montserrat", "Lato", "Oswald",
    "Raleway", "Nunito", "Playfair Display", "Merriweather", "Ubuntu", "Rubik",
    "Outfit", "Quicksand", "Josefin Sans", "Work Sans", "Mulish", "Karla",
    "Fira Sans", "Barlow", "Bebas Neue", "Comfortaa", "Satisfy", "Pacifico",
    "Archivo", "Manrope", "Sora", "DM Sans", "Space Grotesk", "Plus Jakarta Sans",
    "Cabin", "Exo 2", "Titillium Web", "Prompt", "Heebo", "Asap", "Overpass",
    "Bitter", "Crimson Text", "Libre Baskerville", "Cormorant Garamond",
    "Dancing Script", "Lobster", "Courgette", "Great Vibes", "Sacramento",
    "Permanent Marker", "Righteous", "Fredoka One", "Bangers", "Concert One",
    "Secular One", "Alfa Slab One", "Anton", "Black Ops One", "Bungee",
];

// Button radius options
const buttonRadiusOptions = [
    { name: "Kare", value: "0px" },
    { name: "Hafif", value: "4px" },
    { name: "Normal", value: "8px" },
    { name: "Yuvarlak", value: "12px" },
    { name: "Çok Yuvarlak", value: "20px" },
    { name: "Tam Yuvarlak", value: "9999px" },
];

// Card radius options
const cardRadiusOptions = [
    { name: "Kare", value: "0px" },
    { name: "Hafif", value: "8px" },
    { name: "Normal", value: "12px" },
    { name: "Yuvarlak", value: "16px" },
    { name: "Çok Yuvarlak", value: "24px" },
    { name: "Ekstra", value: "32px" },
];

// Card shadow options
const cardShadowOptions = [
    { name: "Yok", value: "none" },
    { name: "Hafif", value: "0 2px 4px rgba(0,0,0,0.2)" },
    { name: "Normal", value: "0 4px 6px -1px rgba(0,0,0,0.3)" },
    { name: "Güçlü", value: "0 10px 15px -3px rgba(0,0,0,0.4)" },
    { name: "Dramatik", value: "0 20px 25px -5px rgba(0,0,0,0.5)" },
];

// Card border options
const cardBorderOptions = [
    { name: "Yok", value: "none" },
    { name: "İnce", value: "1px solid rgba(255,255,255,0.05)" },
    { name: "Normal", value: "1px solid rgba(255,255,255,0.1)" },
    { name: "Kalın", value: "2px solid rgba(255,255,255,0.15)" },
    { name: "Renkli", value: "2px solid var(--color-accent)" },
];

// Text size options
const textSizeOptions = {
    title: [
        { name: "Küçük", value: "14px" },
        { name: "Normal", value: "16px" },
        { name: "Büyük", value: "18px" },
        { name: "Çok Büyük", value: "20px" },
    ],
    description: [
        { name: "Küçük", value: "12px" },
        { name: "Normal", value: "14px" },
        { name: "Büyük", value: "16px" },
    ],
    price: [
        { name: "Küçük", value: "16px" },
        { name: "Normal", value: "18px" },
        { name: "Büyük", value: "20px" },
        { name: "Çok Büyük", value: "24px" },
    ],
};

export default function ThemeSettingsPage() {
    const { theme, updateTheme, showToast } = useTheme();

    const [selectedTheme, setSelectedTheme] = useState(0);
    const [selectedFont, setSelectedFont] = useState(theme.fontFamily || "Inter");
    const [showCustom, setShowCustom] = useState(false);
    const [customButtonRadius, setCustomButtonRadius] = useState("");
    const [customCardRadius, setCustomCardRadius] = useState("");

    const [customColors, setCustomColors] = useState({
        primary: theme.primaryColor,
        accent: theme.accentColor,
        card: theme.cardColor,
        text: theme.textColor,
        button: theme.buttonColor,
        buttonText: theme.buttonTextColor,
    });

    const [buttonRadius, setButtonRadius] = useState(theme.buttonRadius);
    const [cardRadius, setCardRadius] = useState(theme.cardRadius);
    const [cardShadow, setCardShadow] = useState(theme.cardShadow);
    const [cardBorder, setCardBorder] = useState(theme.cardBorder);
    const [titleSize, setTitleSize] = useState(theme.titleSize);
    const [descriptionSize, setDescriptionSize] = useState(theme.descriptionSize);
    const [priceSize, setPriceSize] = useState(theme.priceSize);

    // Sync with theme context on load
    useEffect(() => {
        setCustomColors({
            primary: theme.primaryColor,
            accent: theme.accentColor,
            card: theme.cardColor,
            text: theme.textColor,
            button: theme.buttonColor,
            buttonText: theme.buttonTextColor,
        });

        // Find matching preset
        const presetIndex = colorPresets.findIndex(p => p.primary === theme.primaryColor);
        if (presetIndex >= 0) {
            setSelectedTheme(presetIndex);
        } else {
            setShowCustom(true);
        }

        // Find matching font
        setSelectedFont(theme.fontFamily || "Inter");

        setButtonRadius(theme.buttonRadius);
        setCardRadius(theme.cardRadius);
        setCardShadow(theme.cardShadow);
        setCardBorder(theme.cardBorder);
        setTitleSize(theme.titleSize);
        setDescriptionSize(theme.descriptionSize);
        setPriceSize(theme.priceSize);
    }, [theme]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        const selectedPreset = colorPresets[selectedTheme];

        const changes: string[] = [];

        // Check what changed
        if (showCustom) {
            if (customColors.primary !== theme.primaryColor) changes.push("Arka plan rengi");
            if (customColors.card !== theme.cardColor) changes.push("Kart rengi");
            if (customColors.accent !== theme.accentColor) changes.push("Vurgu rengi");
        } else {
            if (selectedPreset.primary !== theme.primaryColor) changes.push("Renk teması");
        }
        if (selectedFont !== theme.fontFamily) changes.push("Yazı tipi");
        if (buttonRadius !== theme.buttonRadius) changes.push("Buton köşeleri");
        if (cardRadius !== theme.cardRadius) changes.push("Kart köşeleri");
        if (cardShadow !== theme.cardShadow) changes.push("Kart gölgesi");
        if (cardBorder !== theme.cardBorder) changes.push("Kart kenarlık");
        if (titleSize !== theme.titleSize) changes.push("Başlık boyutu");
        if (descriptionSize !== theme.descriptionSize) changes.push("Açıklama boyutu");
        if (priceSize !== theme.priceSize) changes.push("Fiyat boyutu");

        updateTheme({
            primaryColor: showCustom ? customColors.primary : selectedPreset.primary,
            accentColor: showCustom ? customColors.accent : selectedPreset.accent,
            cardColor: showCustom ? customColors.card : selectedPreset.card,
            textColor: showCustom ? customColors.text : "#ffffff",
            buttonColor: showCustom ? customColors.button : selectedPreset.accent,
            buttonTextColor: showCustom ? customColors.buttonText : selectedPreset.primary,
            fontFamily: selectedFont,
            buttonRadius,
            buttonShadow: "0 4px 6px -1px rgba(255,255,255,0.1)",
            cardRadius,
            cardShadow,
            cardBorder,
            titleSize,
            descriptionSize,
            priceSize,
            darkMode: theme.darkMode,
        });

        // Show toast with changes
        if (changes.length > 0) {
            showToast(`✓ ${changes.slice(0, 3).join(", ")} güncellendi!`, "success");
            alert(`✓ ${changes.slice(0, 3).join(", ")} güncellendi!`);
        } else {
            showToast("✓ Tema kaydedildi!", "success");
            alert("✓ Tema kaydedildi!");
        }
    };

    const toggleDarkMode = () => {
        updateTheme({ darkMode: !theme.darkMode });
        showToast(theme.darkMode ? "☀️ Açık mod aktif" : "🌙 Koyu mod aktif", "info");
    };

    return (
        <form onSubmit={handleSubmit} className="max-w-4xl space-y-6 pb-20">
            {/* Dark/Light Mode Toggle */}
            <div className="bg-neutral-900 rounded-2xl p-6 border border-white/5">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        {theme.darkMode ? <Moon className="w-5 h-5 text-purple-400" /> : <Sun className="w-5 h-5 text-yellow-400" />}
                        <div>
                            <h2 className="text-lg font-bold text-white">Tema Modu</h2>
                            <p className="text-sm text-white/40">{theme.darkMode ? "Koyu mod aktif" : "Açık mod aktif"}</p>
                        </div>
                    </div>
                    <button
                        type="button"
                        onClick={toggleDarkMode}
                        className={`relative w-14 h-8 rounded-full transition-colors ${theme.darkMode ? "bg-purple-600" : "bg-yellow-500"}`}
                    >
                        <div className={`absolute top-1 w-6 h-6 bg-white rounded-full transition-transform ${theme.darkMode ? "left-7" : "left-1"}`} />
                    </button>
                </div>
            </div>

            {/* Color Theme */}
            <div className="bg-neutral-900 rounded-2xl p-6 border border-white/5">
                <div className="flex items-center gap-2 mb-4">
                    <Palette className="w-5 h-5 text-white" />
                    <h2 className="text-lg font-bold text-white">Renk Teması</h2>
                </div>

                <div className="grid grid-cols-3 md:grid-cols-6 gap-3 mb-6">
                    {colorPresets.map((preset, index) => (
                        <button
                            key={index}
                            type="button"
                            onClick={() => {
                                setSelectedTheme(index);
                                setShowCustom(false);
                            }}
                            className={`relative p-3 rounded-xl border-2 transition-all ${selectedTheme === index && !showCustom
                                ? "border-white"
                                : "border-white/10 hover:border-white/30"
                                }`}
                        >
                            <div
                                className="w-full h-10 rounded-lg mb-2 flex items-center justify-center gap-1"
                                style={{ backgroundColor: preset.primary }}
                            >
                                <div className="w-4 h-4 rounded-full" style={{ backgroundColor: preset.accent }} />
                                <div className="w-4 h-4 rounded" style={{ backgroundColor: preset.card }} />
                            </div>
                            <p className="text-white text-xs text-center">{preset.name}</p>
                            {selectedTheme === index && !showCustom && (
                                <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full flex items-center justify-center">
                                    <Check className="w-2.5 h-2.5 text-white" />
                                </div>
                            )}
                        </button>
                    ))}
                </div>

                {/* Custom Colors Toggle */}
                <button
                    type="button"
                    onClick={() => setShowCustom(!showCustom)}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${showCustom ? "bg-white text-black" : "bg-white/10 text-white hover:bg-white/20"}`}
                >
                    <Sparkles className="w-4 h-4" />
                    Özel Renkler
                </button>

                {showCustom && (
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-4">
                        {[
                            { label: "Arka Plan", key: "primary" },
                            { label: "Kart Rengi", key: "card" },
                            { label: "Vurgu Rengi", key: "accent" },
                            { label: "Yazı Rengi", key: "text" },
                            { label: "Buton Rengi", key: "button" },
                            { label: "Buton Yazı", key: "buttonText" },
                        ].map(item => (
                            <div key={item.key}>
                                <label className="text-sm text-white/60 mb-2 block">{item.label}</label>
                                <div className="flex gap-2">
                                    <input
                                        type="color"
                                        value={customColors[item.key as keyof typeof customColors]}
                                        onChange={(e) => setCustomColors({ ...customColors, [item.key]: e.target.value })}
                                        className="w-10 h-10 rounded-lg cursor-pointer border-0"
                                    />
                                    <input
                                        type="text"
                                        value={customColors[item.key as keyof typeof customColors]}
                                        onChange={(e) => setCustomColors({ ...customColors, [item.key]: e.target.value })}
                                        className="flex-1 px-3 py-2 bg-neutral-800 rounded-lg text-white text-sm"
                                    />
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Font Selection */}
            <div className="bg-neutral-900 rounded-2xl p-6 border border-white/5">
                <div className="flex items-center gap-2 mb-4">
                    <Type className="w-5 h-5 text-white" />
                    <h2 className="text-lg font-bold text-white">Yazı Tipi (Google Fonts)</h2>
                </div>

                <div className="space-y-4">
                    {/* Font Select Dropdown */}
                    <select
                        value={selectedFont}
                        onChange={(e) => setSelectedFont(e.target.value)}
                        className="w-full px-4 py-3 bg-neutral-800 border border-white/10 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-white/20 cursor-pointer"
                        style={{ fontFamily: selectedFont }}
                    >
                        {googleFonts.map((font) => (
                            <option key={font} value={font} style={{ fontFamily: font }}>
                                {font}
                            </option>
                        ))}
                    </select>

                    {/* Font Preview */}
                    <div className="p-4 bg-neutral-800 rounded-xl">
                        <p className="text-sm text-white/40 mb-2">Önizleme:</p>
                        <p className="text-2xl text-white" style={{ fontFamily: selectedFont }}>
                            Antigravity Kitchen
                        </p>
                        <p className="text-base text-white/60 mt-1" style={{ fontFamily: selectedFont }}>
                            Lezzetli yemekler, unutulmaz anlar.
                        </p>
                    </div>
                </div>
            </div>

            {/* Button Radius */}
            <div className="bg-neutral-900 rounded-2xl p-6 border border-white/5">
                <div className="flex items-center gap-2 mb-4">
                    <Radius className="w-5 h-5 text-white" />
                    <h2 className="text-lg font-bold text-white">Buton Köşeleri</h2>
                </div>

                <div className="grid grid-cols-3 md:grid-cols-6 gap-3">
                    {buttonRadiusOptions.map((option, index) => (
                        <button
                            key={index}
                            type="button"
                            onClick={() => {
                                setButtonRadius(option.value);
                                setCustomButtonRadius("");
                            }}
                            className={`relative p-3 rounded-xl border-2 transition-all ${buttonRadius === option.value && !customButtonRadius
                                ? "border-white"
                                : "border-white/10 hover:border-white/30"
                                }`}
                        >
                            <div
                                className="w-full h-8 bg-white text-black flex items-center justify-center text-xs font-medium"
                                style={{ borderRadius: option.value }}
                            >
                                Buton
                            </div>
                            <p className="text-xs text-white/40 text-center mt-2">{option.name}</p>
                            {buttonRadius === option.value && !customButtonRadius && (
                                <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full flex items-center justify-center">
                                    <Check className="w-2.5 h-2.5 text-white" />
                                </div>
                            )}
                        </button>
                    ))}
                </div>

                {/* Custom Button Radius Input */}
                <div className="mt-4 p-4 bg-neutral-800 rounded-xl">
                    <label className="text-sm text-white/60 mb-2 block">Özel Buton Radius (px değeri yaz)</label>
                    <div className="flex gap-3 items-center">
                        <input
                            type="text"
                            value={customButtonRadius}
                            onChange={(e) => {
                                setCustomButtonRadius(e.target.value);
                                if (e.target.value) {
                                    setButtonRadius(e.target.value.includes("px") ? e.target.value : e.target.value + "px");
                                }
                            }}
                            placeholder="örn: 15, 25, 50..."
                            className="w-32 px-4 py-3 bg-neutral-700 rounded-xl text-white placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-white/20"
                        />
                        <span className="text-white/40">px</span>
                        {customButtonRadius && (
                            <div
                                className="px-4 py-2 bg-white text-black text-sm font-medium"
                                style={{ borderRadius: customButtonRadius.includes("px") ? customButtonRadius : customButtonRadius + "px" }}
                            >
                                Önizleme
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Card Style */}
            <div className="bg-neutral-900 rounded-2xl p-6 border border-white/5">
                <div className="flex items-center gap-2 mb-4">
                    <Square className="w-5 h-5 text-white" />
                    <h2 className="text-lg font-bold text-white">Kart Stili</h2>
                </div>

                {/* Card Radius */}
                <div className="mb-6">
                    <p className="text-sm text-white/60 mb-3">Köşe Yuvarlaklığı</p>
                    <div className="grid grid-cols-3 md:grid-cols-6 gap-3">
                        {cardRadiusOptions.map((option, index) => (
                            <button
                                key={index}
                                type="button"
                                onClick={() => setCardRadius(option.value)}
                                className={`relative p-3 rounded-xl border-2 transition-all ${cardRadius === option.value
                                    ? "border-white"
                                    : "border-white/10 hover:border-white/30"
                                    }`}
                            >
                                <div
                                    className="w-full h-10 bg-neutral-700"
                                    style={{ borderRadius: option.value }}
                                />
                                <p className="text-xs text-white/40 text-center mt-2">{option.name}</p>
                                {cardRadius === option.value && (
                                    <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full flex items-center justify-center">
                                        <Check className="w-2.5 h-2.5 text-white" />
                                    </div>
                                )}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Card Shadow */}
                <div className="mb-6">
                    <p className="text-sm text-white/60 mb-3">Gölge</p>
                    <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                        {cardShadowOptions.map((option, index) => (
                            <button
                                key={index}
                                type="button"
                                onClick={() => setCardShadow(option.value)}
                                className={`relative p-3 rounded-xl border-2 transition-all ${cardShadow === option.value
                                    ? "border-white"
                                    : "border-white/10 hover:border-white/30"
                                    }`}
                            >
                                <div
                                    className="w-full h-10 bg-neutral-700 rounded-lg"
                                    style={{ boxShadow: option.value }}
                                />
                                <p className="text-xs text-white/40 text-center mt-2">{option.name}</p>
                                {cardShadow === option.value && (
                                    <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full flex items-center justify-center">
                                        <Check className="w-2.5 h-2.5 text-white" />
                                    </div>
                                )}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Card Border */}
                <div>
                    <p className="text-sm text-white/60 mb-3">Kenarlık</p>
                    <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                        {cardBorderOptions.map((option, index) => (
                            <button
                                key={index}
                                type="button"
                                onClick={() => setCardBorder(option.value)}
                                className={`relative p-3 rounded-xl border-2 transition-all ${cardBorder === option.value
                                    ? "border-white"
                                    : "border-white/10 hover:border-white/30"
                                    }`}
                            >
                                <div
                                    className="w-full h-10 bg-neutral-800 rounded-lg"
                                    style={{ border: option.value }}
                                />
                                <p className="text-xs text-white/40 text-center mt-2">{option.name}</p>
                                {cardBorder === option.value && (
                                    <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full flex items-center justify-center">
                                        <Check className="w-2.5 h-2.5 text-white" />
                                    </div>
                                )}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* Typography */}
            <div className="bg-neutral-900 rounded-2xl p-6 border border-white/5">
                <div className="flex items-center gap-2 mb-4">
                    <TextCursor className="w-5 h-5 text-white" />
                    <h2 className="text-lg font-bold text-white">Yazı Boyutları</h2>
                </div>

                {/* Title Size */}
                <div className="mb-6">
                    <p className="text-sm text-white/60 mb-3">Ürün Başlığı</p>
                    <div className="flex gap-3">
                        {textSizeOptions.title.map((option, index) => (
                            <button
                                key={index}
                                type="button"
                                onClick={() => setTitleSize(option.value)}
                                className={`flex-1 p-3 rounded-xl border-2 transition-all ${titleSize === option.value
                                    ? "border-white"
                                    : "border-white/10 hover:border-white/30"
                                    }`}
                            >
                                <p className="text-white font-semibold" style={{ fontSize: option.value }}>Başlık</p>
                                <p className="text-xs text-white/40 mt-1">{option.name}</p>
                            </button>
                        ))}
                    </div>
                </div>

                {/* Description Size */}
                <div className="mb-6">
                    <p className="text-sm text-white/60 mb-3">Ürün Açıklaması</p>
                    <div className="flex gap-3">
                        {textSizeOptions.description.map((option, index) => (
                            <button
                                key={index}
                                type="button"
                                onClick={() => setDescriptionSize(option.value)}
                                className={`flex-1 p-3 rounded-xl border-2 transition-all ${descriptionSize === option.value
                                    ? "border-white"
                                    : "border-white/10 hover:border-white/30"
                                    }`}
                            >
                                <p className="text-white/60" style={{ fontSize: option.value }}>Açıklama metni...</p>
                                <p className="text-xs text-white/40 mt-1">{option.name}</p>
                            </button>
                        ))}
                    </div>
                </div>

                {/* Price Size */}
                <div>
                    <p className="text-sm text-white/60 mb-3">Fiyat</p>
                    <div className="flex gap-3">
                        {textSizeOptions.price.map((option, index) => (
                            <button
                                key={index}
                                type="button"
                                onClick={() => setPriceSize(option.value)}
                                className={`flex-1 p-3 rounded-xl border-2 transition-all ${priceSize === option.value
                                    ? "border-white"
                                    : "border-white/10 hover:border-white/30"
                                    }`}
                            >
                                <p className="text-white font-bold" style={{ fontSize: option.value }}>₺99</p>
                                <p className="text-xs text-white/40 mt-1">{option.name}</p>
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* Live Preview */}
            <div className="bg-neutral-900 rounded-2xl p-6 border border-white/5">
                <h2 className="text-lg font-bold text-white mb-4">Canlı Önizleme</h2>
                <div
                    className="p-6 rounded-2xl transition-all"
                    style={{ backgroundColor: showCustom ? customColors.primary : colorPresets[selectedTheme].primary }}
                >
                    <div
                        className="p-4 transition-all"
                        style={{
                            backgroundColor: showCustom ? customColors.card : colorPresets[selectedTheme].card,
                            borderRadius: cardRadius,
                            boxShadow: cardShadow,
                            border: cardBorder,
                            fontFamily: selectedFont,
                        }}
                    >
                        <h3
                            className="font-semibold mb-1"
                            style={{
                                color: showCustom ? customColors.text : "#ffffff",
                                fontSize: titleSize,
                            }}
                        >
                            Örnek Ürün Başlığı
                        </h3>
                        <p
                            className="opacity-60 mb-3"
                            style={{
                                color: showCustom ? customColors.text : "#ffffff",
                                fontSize: descriptionSize,
                            }}
                        >
                            Bu bir örnek açıklama metnidir.
                        </p>
                        <div className="flex items-center justify-between">
                            <span
                                className="font-bold"
                                style={{
                                    color: showCustom ? customColors.accent : colorPresets[selectedTheme].accent,
                                    fontSize: priceSize,
                                }}
                            >
                                ₺149
                            </span>
                            <button
                                type="button"
                                className="px-4 py-2 font-medium transition-all"
                                style={{
                                    backgroundColor: showCustom ? customColors.button : colorPresets[selectedTheme].accent,
                                    color: showCustom ? customColors.buttonText : colorPresets[selectedTheme].primary,
                                    borderRadius: buttonRadius,
                                }}
                            >
                                Sepete Ekle
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Submit */}
            <motion.button
                whileTap={{ scale: 0.98 }}
                type="submit"
                className="w-full flex items-center justify-center gap-2 py-4 bg-white text-black rounded-xl font-semibold hover:bg-neutral-100 transition-colors"
            >
                <Save className="w-5 h-5" />
                Kaydet ve Uygula
            </motion.button>
        </form>
    );
}
