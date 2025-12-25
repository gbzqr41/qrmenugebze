"use client";

import { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, MapPin, Phone, Instagram, Globe } from "lucide-react";
import { useDataStore } from "@/context/DataStoreContext";

interface BusinessInfoModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export default function BusinessInfoModal({ isOpen, onClose }: BusinessInfoModalProps) {
    const { business } = useDataStore();

    // Prevent body scroll when modal is open
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "unset";
        }
        return () => {
            document.body.style.overflow = "unset";
        };
    }, [isOpen]);

    const gallery = business.gallery || [];
    const coverImage = gallery[0] || business.coverImage;

    // Helper to get icon for social media
    const getSocialIcon = (key: string) => {
        switch (key) {
            case "instagram": return <Instagram className="w-5 h-5" />;
            case "facebook": return <span className="w-5 h-5 font-bold">f</span>;
            case "twitter": return <span className="w-5 h-5 font-bold">X</span>;
            case "website": return <Globe className="w-5 h-5" />;
            default: return <Globe className="w-5 h-5" />;
        }
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50"
                    />

                    {/* Modal - Fullscreen */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="fixed inset-0 z-50 bg-black flex flex-col overflow-y-auto"
                    >
                        {/* Image - Single image only */}
                        <div className="relative w-full h-[300px] bg-neutral-800 shrink-0">
                            {coverImage ? (
                                <div
                                    className="w-full h-full bg-cover bg-center"
                                    style={{ backgroundImage: `url(${coverImage})` }}
                                />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center bg-neutral-800">
                                    <span className="text-white/20">Görsel Yok</span>
                                </div>
                            )}

                            {/* Close Button - Left side */}
                            <button
                                onClick={onClose}
                                className="absolute top-4 left-4 w-10 h-10 rounded-full bg-black/50 backdrop-blur-md flex items-center justify-center hover:bg-black/70 transition-colors"
                            >
                                <X className="w-5 h-5 text-white" />
                            </button>
                        </div>

                        {/* Scrollable Content */}
                        <div className="px-6 py-6 space-y-6">

                            {/* Description - Left aligned */}
                            {business.description && (
                                <div>
                                    <p className="text-white/80 leading-relaxed text-sm text-left">
                                        {business.description}
                                    </p>
                                </div>
                            )}

                            <div className="h-px bg-white/10" />

                            {/* Contact Info */}
                            <div className="space-y-4">
                                <h3 className="text-sm font-medium text-white/60 uppercase tracking-wider">
                                    İletişim Bilgileri
                                </h3>
                                {business.address && (
                                    <div className="flex items-start gap-4">
                                        <MapPin className="w-5 h-5 text-white/60 shrink-0 mt-0.5" />
                                        <span className="text-sm text-white">{business.address}</span>
                                    </div>
                                )}
                                {business.phone && (
                                    <div className="flex items-center gap-4">
                                        <Phone className="w-5 h-5 text-white/60 shrink-0" />
                                        <a href={`tel:${business.phone}`} className="text-sm text-white hover:underline">{business.phone}</a>
                                    </div>
                                )}
                                {business.website && (
                                    <div className="flex items-center gap-4">
                                        <Globe className="w-5 h-5 text-white/60 shrink-0" />
                                        <a href={`https://${business.website}`} target="_blank" rel="noopener noreferrer" className="text-sm text-white hover:underline">{business.website}</a>
                                    </div>
                                )}
                            </div>

                            <div className="h-px bg-white/10" />

                            {/* Working Hours */}
                            {business.workingHours && business.workingHours.length > 0 && (
                                <div>
                                    <h3 className="text-sm font-medium text-white/60 uppercase tracking-wider mb-4">
                                        Çalışma Saatleri
                                    </h3>
                                    <div className="space-y-3">
                                        {business.workingHours.map((hour, idx) => (
                                            <div key={idx} className="flex items-center justify-between text-sm">
                                                <span className="text-white/70">{hour.day}</span>
                                                <span className="text-white font-medium">
                                                    {hour.isClosed ? (
                                                        <span className="text-white/50">Kapalı</span>
                                                    ) : (
                                                        `${hour.open} - ${hour.close}`
                                                    )}
                                                </span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            <div className="h-px bg-white/10" />

                            {/* Social Media Icons */}
                            {business.socialMedia && (
                                <div className="flex justify-center gap-4">
                                    {Object.entries(business.socialMedia).map(([key, url]) => (
                                        <a
                                            key={key}
                                            href={url}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-white/10 transition-colors text-white"
                                        >
                                            {getSocialIcon(key)}
                                        </a>
                                    ))}
                                </div>
                            )}
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}
