"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { ArrowRight, Star, Languages } from "lucide-react";
import { useDataStore } from "@/context/DataStoreContext";

interface WelcomePageProps {
    onEnter: () => void;
}

export default function WelcomePage({ onEnter }: WelcomePageProps) {
    const { business } = useDataStore();
    const [selectedLang, setSelectedLang] = useState("Türkçe");

    const welcomeSettings = business?.welcomeSettings || {
        logoText: "RESITAL",
        description: "Lezzetin en saf hali ile tanışın. Premium gastronomi deneyimi için hoş geldiniz.",
        showWelcome: true,
    };

    if (!welcomeSettings.showWelcome) {
        return null;
    }

    const bgStyle = welcomeSettings.backgroundVideo
        ? {}
        : welcomeSettings.backgroundImage
            ? { backgroundImage: `url(${welcomeSettings.backgroundImage})`, backgroundSize: "cover", backgroundPosition: "center" }
            : { backgroundColor: "#000000" };

    return (
        <motion.div
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex flex-col"
            style={bgStyle}
        >
            {/* Background Video */}
            {welcomeSettings.backgroundVideo && (
                <video
                    autoPlay
                    loop
                    muted
                    playsInline
                    className="absolute inset-0 w-full h-full object-cover"
                >
                    <source src={welcomeSettings.backgroundVideo} type="video/mp4" />
                </video>
            )}

            {/* Overlay */}
            <div className="absolute inset-0 bg-black/60" />

            {/* Content Container */}
            <div
                className="relative z-10 flex flex-col items-center justify-between h-full"
                style={{ paddingTop: "30px", paddingBottom: "20px" }}
            >
                {/* Logo Section */}
                <div className="flex-1 flex flex-col items-center justify-center">
                    {/* Logo Box */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.2 }}
                        className="flex items-center justify-center bg-black rounded-[10px] px-5 py-4"
                    >
                        <span className="text-[18px] font-semibold text-white">
                            {welcomeSettings.logoText}
                        </span>
                    </motion.div>

                    {/* Description */}
                    <motion.p
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4 }}
                        className="mt-6 text-white/60 text-center text-sm max-w-xs px-4"
                    >
                        {welcomeSettings.description}
                    </motion.p>
                </div>

                {/* Action Cards */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6 }}
                    className="flex gap-4 px-6"
                    style={{ marginBottom: "0px" }}
                >
                    {/* Menüye Git */}
                    <button
                        onClick={onEnter}
                        className="flex-1 flex flex-col items-center gap-2 p-[15px] rounded-2xl backdrop-blur-md bg-white/10 hover:bg-white/20 transition-all"
                    >
                        <ArrowRight className="w-6 h-6 text-white" />
                        <span className="text-xs text-white font-medium">Menüye Git</span>
                    </button>

                    {/* Değerlendir */}
                    <button
                        className="flex-1 flex flex-col items-center gap-2 p-[15px] rounded-2xl backdrop-blur-md bg-white/10 hover:bg-white/20 transition-all"
                    >
                        <Star className="w-6 h-6 text-white" />
                        <span className="text-xs text-white font-medium">Değerlendir</span>
                    </button>

                    {/* Dil */}
                    <button
                        onClick={() => setSelectedLang(selectedLang === "Türkçe" ? "English" : "Türkçe")}
                        className="flex-1 flex flex-col items-center gap-2 p-[15px] rounded-2xl backdrop-blur-md bg-white/10 hover:bg-white/20 transition-all"
                    >
                        <Languages className="w-6 h-6 text-white" />
                        <span className="text-xs text-white font-medium">{selectedLang}</span>
                    </button>
                </motion.div>
            </div>
        </motion.div>
    );
}
