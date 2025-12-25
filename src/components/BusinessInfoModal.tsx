"use client";

import { useState, useEffect } from "react";
import { X, MapPin, Phone, Instagram, Globe, Clock } from "lucide-react";
import { useDataStore } from "@/context/DataStoreContext";
import { useTheme } from "@/context/ThemeContext";

interface BusinessInfoModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export default function BusinessInfoModal({ isOpen, onClose }: BusinessInfoModalProps) {
    const { business } = useDataStore();
    const { theme } = useTheme();
    const [activeImageIndex, setActiveImageIndex] = useState(0);

    // Prevent body scroll when modal is open
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = "hidden";
            setActiveImageIndex(0); // Reset gallery index
        } else {
            document.body.style.overflow = "unset";
        }
        return () => {
            document.body.style.overflow = "unset";
        };
    }, [isOpen]);

    if (!isOpen) return null;

    const gallery = business.gallery || [];
    const hasGallery = gallery.length > 0;

    // Theme values
    const modalBg = theme.businessModalBgColor || "rgba(0,0,0,0.9)";
    const cardBg = theme.businessCardBgColor || "#171717";
    const textColor = theme.businessTextColor || "#ffffff";
    const isBlurred = theme.businessBlur !== false; // Default true

    // Helper to get icon for social media
    const getSocialIcon = (key: string) => {
        switch (key) {
            case "instagram": return <Instagram className="w-5 h-5" />;
            case "facebook": return <span className="w-5 h-5 font-bold">f</span>; // Basic fallback or import Facebook
            case "twitter": return <span className="w-5 h-5 font-bold">X</span>;
            case "website": return <Globe className="w-5 h-5" />;
            default: return <Globe className="w-5 h-5" />;
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center sm:p-4">
            {/* Backdrop */}
            <div
                onClick={onClose}
                className="absolute inset-0 bg-black/80 backdrop-blur-sm transition-opacity"
            />

            {/* Modal Content */}
            <div
                className={`
                    relative w-full max-w-lg bg-neutral-900 
                    rounded-t-3xl sm:rounded-3xl overflow-hidden shadow-2xl
                    max-h-[90vh] flex flex-col
                    ${isBlurred ? "backdrop-blur-xl" : ""}
                `}
                style={{ backgroundColor: cardBg }}
            >
                {/* Close Button */}
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 z-10 w-10 h-10 rounded-full bg-black/20 flex items-center justify-center hover:bg-black/30 transition-colors backdrop-blur-sm"
                >
                    <X className="w-5 h-5" style={{ color: textColor }} />
                </button>

                {/* Gallery/Header Image */}
                <div className="relative w-full aspect-video bg-neutral-800 shrink-0">
                    {hasGallery ? (
                        <>
                            <div
                                className="w-full h-full bg-cover bg-center transition-all duration-500"
                                style={{ backgroundImage: `url(${gallery[activeImageIndex]})` }}
                            />
                            {/* Dots */}
                            {gallery.length > 1 && (
                                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-10">
                                    {gallery.map((_, idx) => (
                                        <button
                                            key={idx}
                                            onClick={() => setActiveImageIndex(idx)}
                                            className={`w-2 h-2 rounded-full transition-all ${activeImageIndex === idx ? "bg-white w-4" : "bg-white/40"
                                                }`}
                                        />
                                    ))}
                                </div>
                            )}
                        </>
                    ) : (
                        <div className="w-full h-full flex items-center justify-center bg-neutral-800">
                            <span className="text-white/20">Görsel Yok</span>
                        </div>
                    )}

                    {/* Gradient Overlay */}
                    <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-black/90 via-black/50 to-transparent" />

                    {/* Business Name & Logo Overlay */}
                    <div className="absolute -bottom-6 left-6 right-6 flex items-end gap-4">
                        {/* Logo */}
                        <div className="w-20 h-20 rounded-2xl bg-neutral-900 border-4 border-neutral-900 shadow-xl overflow-hidden shrink-0">
                            {business.logo ? (
                                <img src={business.logo} alt={business.name} className="w-full h-full object-cover" />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center bg-neutral-800 text-2xl font-bold text-white">
                                    {business.name.charAt(0)}
                                </div>
                            )}
                        </div>

                        {/* Name & Slogan */}
                        <div className="pb-8 flex-1">
                            <h2 className="text-2xl font-bold text-white mb-1 shadow-black/50 drop-shadow-md">{business.name || "İşletme Adı"}</h2>
                            <p className="text-white/80 text-sm shadow-black/50 drop-shadow-md line-clamp-1">{business.slogan || "Hoş geldiniz"}</p>
                        </div>
                    </div>
                </div>

                {/* Scrollable Content */}
                <div className="flex-1 overflow-y-auto pt-10 px-6 pb-32 space-y-8">

                    {/* Social Media Icons */}
                    {business.socialMedia && (
                        <div className="flex justify-center gap-4">
                            {Object.entries(business.socialMedia).map(([key, url]) => (
                                <a
                                    key={key}
                                    href={url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-white/10 transition-colors"
                                    style={{ color: textColor }}
                                >
                                    {getSocialIcon(key)}
                                </a>
                            ))}
                        </div>
                    )}

                    {/* Description */}
                    {business.description && (
                        <div className="text-center">
                            <p className="opacity-80 leading-relaxed text-sm" style={{ color: textColor }}>
                                {business.description}
                            </p>
                        </div>
                    )}

                    <div className="h-px bg-white/10" />

                    {/* Contact Info (Stacked) */}
                    <div className="space-y-4">
                        <h3 className="text-sm font-bold opacity-50 uppercase tracking-wider mb-2" style={{ color: textColor }}>
                            İletişim Bilgileri
                        </h3>
                        {business.address && (
                            <div className="flex items-start gap-4">
                                <MapPin className="w-5 h-5 opacity-60 shrink-0 mt-0.5" style={{ color: textColor }} />
                                <span className="text-sm font-medium" style={{ color: textColor }}>{business.address}</span>
                            </div>
                        )}
                        {business.phone && (
                            <div className="flex items-center gap-4">
                                <Phone className="w-5 h-5 opacity-60 shrink-0" style={{ color: textColor }} />
                                <a href={`tel:${business.phone}`} className="text-sm font-medium hover:underline" style={{ color: textColor }}>{business.phone}</a>
                            </div>
                        )}
                        {business.website && (
                            <div className="flex items-center gap-4">
                                <Globe className="w-5 h-5 opacity-60 shrink-0" style={{ color: textColor }} />
                                <a href={`https://${business.website}`} target="_blank" rel="noopener noreferrer" className="text-sm font-medium hover:underline" style={{ color: textColor }}>{business.website}</a>
                            </div>
                        )}
                    </div>

                    <div className="h-px bg-white/10" />

                    {/* Working Hours (Detailed List) */}
                    {business.workingHours && business.workingHours.length > 0 && (
                        <div>
                            <h3 className="text-sm font-bold opacity-50 uppercase tracking-wider mb-4" style={{ color: textColor }}>
                                Çalışma Saatleri
                            </h3>
                            <div className="space-y-3">
                                {business.workingHours.map((hour, idx) => (
                                    <div key={idx} className="flex items-center justify-between text-sm">
                                        <span className="opacity-70" style={{ color: textColor }}>{hour.day}</span>
                                        <span className="font-medium" style={{ color: textColor }}>
                                            {hour.isClosed ? (
                                                <span className="opacity-50">Kapalı</span>
                                            ) : (
                                                `${hour.open} - ${hour.close}`
                                            )}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
