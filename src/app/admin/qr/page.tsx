"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Download, Copy, Check, Palette, ChevronRight, X } from "lucide-react";
import QRCode from "qrcode";
import { useDataStore } from "@/context/DataStoreContext";

const colorPresets = [
    { name: "Klasik", fg: "#000000", bg: "#FFFFFF" },
    { name: "Koyu", fg: "#FFFFFF", bg: "#000000" },
    { name: "Mavi", fg: "#1E40AF", bg: "#DBEAFE" },
    { name: "Yeşil", fg: "#166534", bg: "#DCFCE7" },
    { name: "Mor", fg: "#7C3AED", bg: "#EDE9FE" },
    { name: "Turuncu", fg: "#EA580C", bg: "#FED7AA" },
];

export default function QRCodePage() {
    const { business } = useDataStore();
    const [qrDataUrl, setQrDataUrl] = useState<string>("");
    const [menuUrl, setMenuUrl] = useState<string>("");
    const [selectedPreset, setSelectedPreset] = useState(0);
    const [copied, setCopied] = useState(false);
    const [showColorModal, setShowColorModal] = useState(false);
    const [customFg, setCustomFg] = useState("#000000");
    const [customBg, setCustomBg] = useState("#FFFFFF");
    const [useCustomColors, setUseCustomColors] = useState(false);
    const canvasRef = useRef<HTMLCanvasElement>(null);

    // Get the menu URL with business slug from DataStore (always up to date)
    useEffect(() => {
        if (typeof window !== "undefined" && business?.slug) {
            // Use gbzqr.com in production, localhost in dev
            const baseUrl = window.location.hostname === "localhost"
                ? window.location.origin
                : "https://gbzqr.com";
            setMenuUrl(`${baseUrl}/${business.slug}`);
        }
    }, [business?.slug]);

    // Generate QR Code
    useEffect(() => {
        if (!menuUrl) return;

        const generateQR = async () => {
            try {
                const fg = useCustomColors ? customFg : colorPresets[selectedPreset].fg;
                const bg = useCustomColors ? customBg : colorPresets[selectedPreset].bg;
                const dataUrl = await QRCode.toDataURL(menuUrl, {
                    width: 512,
                    margin: 2,
                    color: {
                        dark: fg,
                        light: bg,
                    },
                    errorCorrectionLevel: "H",
                });
                setQrDataUrl(dataUrl);
            } catch (err) {
                console.error("QR generation error:", err);
            }
        };

        generateQR();
    }, [menuUrl, selectedPreset, customFg, customBg, useCustomColors]);

    const handleCopyLink = async () => {
        try {
            await navigator.clipboard.writeText(menuUrl);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch (err) {
            console.error("Copy error:", err);
        }
    };

    const handleDownload = () => {
        if (!qrDataUrl) return;

        const link = document.createElement("a");
        const safeName = (business?.name || "menu").toLowerCase().replace(/[^a-z0-9]+/g, "-");
        link.download = `${safeName}-qr.png`;
        link.href = qrDataUrl;
        link.click();
    };

    const handleApplyCustomColors = () => {
        setUseCustomColors(true);
        setShowColorModal(false);
    };

    const handleSelectPreset = (index: number) => {
        setSelectedPreset(index);
        setUseCustomColors(false);
    };

    const currentBg = useCustomColors ? customBg : colorPresets[selectedPreset].bg;

    return (
        <div className="p-6 lg:p-8">
            {/* Header */}
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-8"
            >
                <h1 className="text-2xl font-bold text-white mb-2">QR Kod Üretici</h1>
                <p className="text-white/40">Menünüz için QR kod oluşturun ve indirin</p>
            </motion.div>

            <div className="grid lg:grid-cols-2 gap-8">
                {/* QR Preview */}
                <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 }}
                    className="flex flex-col items-center"
                >
                    <div
                        className="w-72 h-72 rounded-3xl flex items-center justify-center p-6 shadow-2xl"
                        style={{ backgroundColor: currentBg }}
                    >
                        {qrDataUrl ? (
                            <img
                                src={qrDataUrl}
                                alt="QR Code"
                                className="w-full h-full object-contain"
                            />
                        ) : (
                            <div className="w-full h-full bg-neutral-800 animate-pulse rounded-2xl" />
                        )}
                    </div>

                    {/* Menu URL */}
                    <div className="mt-6 w-full max-w-sm">
                        <label className="text-sm text-white/40 mb-2 block">Menü Linki</label>
                        <div className="px-4 py-3 bg-neutral-900 rounded-xl text-white/60 truncate text-sm text-center">
                            {menuUrl}
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-3 mt-4 w-full max-w-sm">
                        <button
                            onClick={handleCopyLink}
                            className="flex-1 flex flex-col items-center gap-2 px-6 py-5 bg-neutral-900 rounded-xl hover:bg-neutral-800 transition-colors"
                        >
                            {copied ? (
                                <Check className="w-5 h-5 text-green-400" />
                            ) : (
                                <Copy className="w-5 h-5 text-white" />
                            )}
                            <span className="text-xs text-white/60">{copied ? "Kopyalandı" : "Kopyala"}</span>
                        </button>
                        <button
                            onClick={() => setShowColorModal(true)}
                            className="flex-1 flex flex-col items-center gap-2 px-6 py-5 bg-neutral-900 rounded-xl hover:bg-neutral-800 transition-colors"
                        >
                            <Palette className="w-5 h-5 text-white" />
                            <span className="text-xs text-white/60">Ayarlar</span>
                        </button>
                        <a
                            href={menuUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex-1 flex flex-col items-center gap-2 px-6 py-5 bg-neutral-900 rounded-xl hover:bg-neutral-800 transition-colors"
                        >
                            <ChevronRight className="w-5 h-5 text-white" />
                            <span className="text-xs text-white/60">Siteye Git</span>
                        </a>
                    </div>

                    {/* Download Button */}
                    <div className="flex gap-3 mt-6">
                        <motion.button
                            whileTap={{ scale: 0.95 }}
                            onClick={handleDownload}
                            className="flex items-center gap-2 px-8 py-3 bg-white text-black rounded-xl font-medium hover:bg-neutral-100 transition-colors"
                        >
                            <Download className="w-5 h-5" />
                            İndir
                        </motion.button>
                    </div>
                </motion.div>

                {/* Customization Options */}
                <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2 }}
                    className="space-y-6"
                >
                    {/* Color Presets */}
                    <div className="bg-neutral-900 rounded-2xl p-6 border border-white/5">
                        <div className="flex items-center gap-2 mb-4">
                            <Palette className="w-5 h-5 text-white" />
                            <h2 className="text-lg font-bold text-white">Renk Şeması</h2>
                        </div>
                        <div className="grid grid-cols-3 gap-3">
                            {colorPresets.map((preset, index) => (
                                <button
                                    key={preset.name}
                                    onClick={() => handleSelectPreset(index)}
                                    className={`p-4 rounded-xl border-2 transition-all ${!useCustomColors && selectedPreset === index
                                        ? "border-white"
                                        : "border-transparent hover:border-white/20"
                                        }`}
                                    style={{ backgroundColor: preset.bg }}
                                >
                                    <div
                                        className="w-8 h-8 rounded-lg mx-auto mb-2"
                                        style={{ backgroundColor: preset.fg }}
                                    />
                                    <p
                                        className="text-xs font-medium text-center"
                                        style={{ color: preset.fg }}
                                    >
                                        {preset.name}
                                    </p>
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Tips */}
                    <div className="bg-neutral-900 rounded-2xl p-6 border border-white/5">
                        <h2 className="text-lg font-bold text-white mb-4">Kullanım İpuçları</h2>
                        <ul className="space-y-3 text-sm text-white/60">
                            <li className="flex items-start gap-2">
                                <span className="w-1.5 h-1.5 rounded-full bg-white/40 mt-1.5 flex-shrink-0" />
                                QR kodunu masa kartlarına, menülere veya vitrine yerleştirin
                            </li>
                            <li className="flex items-start gap-2">
                                <span className="w-1.5 h-1.5 rounded-full bg-white/40 mt-1.5 flex-shrink-0" />
                                Minimum 3cm x 3cm boyutunda basılması önerilir
                            </li>
                            <li className="flex items-start gap-2">
                                <span className="w-1.5 h-1.5 rounded-full bg-white/40 mt-1.5 flex-shrink-0" />
                                Yüksek kontrastlı renk şemaları daha kolay taranır
                            </li>
                            <li className="flex items-start gap-2">
                                <span className="w-1.5 h-1.5 rounded-full bg-white/40 mt-1.5 flex-shrink-0" />
                                Wi-Fi bağlantısı olmadan da çalışır (4G/5G ile)
                            </li>
                        </ul>
                    </div>
                </motion.div>
            </div>

            <canvas ref={canvasRef} className="hidden" />

            {/* Color Settings Modal */}
            <AnimatePresence>
                {showColorModal && (
                    <>
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setShowColorModal(false)}
                            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50"
                        />
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-sm bg-neutral-900 rounded-2xl p-6 z-50 border border-white/10"
                        >
                            <div className="flex items-center justify-between mb-6">
                                <h2 className="text-lg font-bold text-white">QR Renk Ayarları</h2>
                                <button
                                    onClick={() => setShowColorModal(false)}
                                    className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                                >
                                    <X className="w-5 h-5 text-white" />
                                </button>
                            </div>

                            <div className="space-y-5">
                                {/* Foreground Color */}
                                <div>
                                    <label className="text-sm text-white/60 mb-2 block">İç Renk (QR Kodu)</label>
                                    <div className="flex items-center gap-3">
                                        <input
                                            type="color"
                                            value={customFg}
                                            onChange={(e) => setCustomFg(e.target.value)}
                                            className="w-12 h-12 rounded-xl cursor-pointer border-0 bg-transparent"
                                        />
                                        <input
                                            type="text"
                                            value={customFg}
                                            onChange={(e) => setCustomFg(e.target.value)}
                                            className="flex-1 px-4 py-3 bg-neutral-800 rounded-xl text-white uppercase"
                                        />
                                    </div>
                                </div>

                                {/* Background Color */}
                                <div>
                                    <label className="text-sm text-white/60 mb-2 block">Dış Renk (Arkaplan)</label>
                                    <div className="flex items-center gap-3">
                                        <input
                                            type="color"
                                            value={customBg}
                                            onChange={(e) => setCustomBg(e.target.value)}
                                            className="w-12 h-12 rounded-xl cursor-pointer border-0 bg-transparent"
                                        />
                                        <input
                                            type="text"
                                            value={customBg}
                                            onChange={(e) => setCustomBg(e.target.value)}
                                            className="flex-1 px-4 py-3 bg-neutral-800 rounded-xl text-white uppercase"
                                        />
                                    </div>
                                </div>

                                {/* Apply Button */}
                                <button
                                    onClick={handleApplyCustomColors}
                                    className="w-full py-3 bg-white text-black rounded-xl font-medium hover:bg-neutral-100 transition-colors"
                                >
                                    Uygula
                                </button>
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </div>
    );
}
