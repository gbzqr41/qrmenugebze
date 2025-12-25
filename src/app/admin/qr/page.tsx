"use client";

import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { Download, Copy, Check, Palette, RefreshCw } from "lucide-react";
import QRCode from "qrcode";

const colorPresets = [
    { name: "Klasik", fg: "#000000", bg: "#FFFFFF" },
    { name: "Koyu", fg: "#FFFFFF", bg: "#000000" },
    { name: "Mavi", fg: "#1E40AF", bg: "#DBEAFE" },
    { name: "Yeşil", fg: "#166534", bg: "#DCFCE7" },
    { name: "Mor", fg: "#7C3AED", bg: "#EDE9FE" },
    { name: "Turuncu", fg: "#EA580C", bg: "#FED7AA" },
];

export default function QRCodePage() {
    const [qrDataUrl, setQrDataUrl] = useState<string>("");
    const [menuUrl, setMenuUrl] = useState<string>("");
    const [selectedPreset, setSelectedPreset] = useState(0);
    const [copied, setCopied] = useState(false);
    const canvasRef = useRef<HTMLCanvasElement>(null);

    // Get the menu URL
    useEffect(() => {
        if (typeof window !== "undefined") {
            setMenuUrl(window.location.origin);
        }
    }, []);

    // Generate QR Code
    useEffect(() => {
        if (!menuUrl) return;

        const generateQR = async () => {
            try {
                const preset = colorPresets[selectedPreset];
                const dataUrl = await QRCode.toDataURL(menuUrl, {
                    width: 512,
                    margin: 2,
                    color: {
                        dark: preset.fg,
                        light: preset.bg,
                    },
                    errorCorrectionLevel: "H",
                });
                setQrDataUrl(dataUrl);
            } catch (err) {
                console.error("QR generation error:", err);
            }
        };

        generateQR();
    }, [menuUrl, selectedPreset]);

    const handleCopyLink = async () => {
        try {
            await navigator.clipboard.writeText(menuUrl);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch (err) {
            console.error("Copy error:", err);
        }
    };

    const handleDownload = (format: "png" | "svg") => {
        if (!qrDataUrl) return;

        const link = document.createElement("a");
        link.download = `antigravity-qr.${format}`;
        link.href = qrDataUrl;
        link.click();
    };

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
                        style={{ backgroundColor: colorPresets[selectedPreset].bg }}
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
                        <div className="flex items-center gap-2">
                            <div className="flex-1 px-4 py-3 bg-neutral-900 rounded-xl text-white/60 truncate text-sm">
                                {menuUrl}
                            </div>
                            <button
                                onClick={handleCopyLink}
                                className="w-12 h-12 rounded-xl bg-neutral-900 flex items-center justify-center hover:bg-neutral-800 transition-colors"
                            >
                                {copied ? (
                                    <Check className="w-5 h-5 text-green-400" />
                                ) : (
                                    <Copy className="w-5 h-5 text-white" />
                                )}
                            </button>
                        </div>
                    </div>

                    {/* Download Buttons */}
                    <div className="flex gap-3 mt-6">
                        <motion.button
                            whileTap={{ scale: 0.95 }}
                            onClick={() => handleDownload("png")}
                            className="flex items-center gap-2 px-6 py-3 bg-white text-black rounded-xl font-medium hover:bg-neutral-100 transition-colors"
                        >
                            <Download className="w-5 h-5" />
                            PNG İndir
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
                                    onClick={() => setSelectedPreset(index)}
                                    className={`p-4 rounded-xl border-2 transition-all ${selectedPreset === index
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

                    {/* Regenerate Button */}
                    <button
                        onClick={() => setSelectedPreset((prev) => prev)}
                        className="w-full flex items-center justify-center gap-2 px-6 py-4 bg-neutral-900 text-white rounded-xl font-medium hover:bg-neutral-800 transition-colors border border-white/5"
                    >
                        <RefreshCw className="w-5 h-5" />
                        Yeniden Oluştur
                    </button>
                </motion.div>
            </div>

            <canvas ref={canvasRef} className="hidden" />
        </div>
    );
}
