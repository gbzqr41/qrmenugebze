"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, MapPin, Phone, Instagram, Globe, Mail, ChevronLeft, ChevronRight } from "lucide-react";
import { useDataStore } from "@/context/DataStoreContext";

interface BusinessInfoModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export default function BusinessInfoModal({ isOpen, onClose }: BusinessInfoModalProps) {
    const { business } = useDataStore();
    const [galleryOpen, setGalleryOpen] = useState(false);
    const [galleryIndex, setGalleryIndex] = useState(0);

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

    // Social media icons - Instagram, YouTube, Twitter/X, TikTok
    const socialIcons: { key: string; icon: React.ReactNode; url?: string }[] = [
        {
            key: "instagram",
            icon: <Instagram className="w-5 h-5" />,
            url: business.socialMedia?.instagram
        },
        {
            key: "youtube",
            icon: (
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                </svg>
            ),
            url: business.socialMedia?.youtube
        },
        {
            key: "twitter",
            icon: (
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                </svg>
            ),
            url: business.socialMedia?.twitter
        },
        {
            key: "tiktok",
            icon: (
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z" />
                </svg>
            ),
            url: business.socialMedia?.tiktok
        },
    ];

    const activeSocials = socialIcons.filter(s => s.url);

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
                                    style={{
                                        backgroundImage: `url(${coverImage})`,
                                        borderBottomLeftRadius: "15px",
                                        borderBottomRightRadius: "15px"
                                    }}
                                />
                            ) : (
                                <div
                                    className="w-full h-full flex items-center justify-center bg-neutral-800"
                                    style={{ borderBottomLeftRadius: "15px", borderBottomRightRadius: "15px" }}
                                >
                                    <span className="text-white/20">Görsel Yok</span>
                                </div>
                            )}

                            {/* Close Button - Left side with blur */}
                            <button
                                onClick={onClose}
                                className="absolute top-4 left-4 w-10 h-10 rounded-full backdrop-blur-xl flex items-center justify-center hover:bg-white/20 transition-colors"
                                style={{ backgroundColor: "rgba(255,255,255,0.1)" }}
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
                                    <a
                                        href={`https://maps.google.com/?q=${encodeURIComponent(business.address)}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="flex items-start gap-4 hover:opacity-80 transition-opacity"
                                    >
                                        <MapPin className="w-5 h-5 text-white/60 shrink-0 mt-0.5" />
                                        <span className="text-sm text-white hover:underline">{business.address}</span>
                                    </a>
                                )}
                                {business.phone && (
                                    <a
                                        href={`https://wa.me/${business.phone.replace(/\D/g, '')}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="flex items-center gap-4 hover:opacity-80 transition-opacity"
                                    >
                                        <Phone className="w-5 h-5 text-white/60 shrink-0" />
                                        <span className="text-sm text-white hover:underline">{business.phone}</span>
                                    </a>
                                )}
                                {business.email && (
                                    <a
                                        href={`mailto:${business.email}`}
                                        className="flex items-center gap-4 hover:opacity-80 transition-opacity"
                                    >
                                        <Mail className="w-5 h-5 text-white/60 shrink-0" />
                                        <span className="text-sm text-white hover:underline">{business.email}</span>
                                    </a>
                                )}
                                {business.website && (
                                    <a
                                        href={`https://${business.website}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="flex items-center gap-4 hover:opacity-80 transition-opacity"
                                    >
                                        <Globe className="w-5 h-5 text-white/60 shrink-0" />
                                        <span className="text-sm text-white hover:underline">{business.website}</span>
                                    </a>
                                )}
                            </div>

                            <div className="h-px bg-white/10" />

                            {/* Gallery Section */}
                            {gallery.length > 1 && (
                                <>
                                    <div>
                                        <h3 className="text-sm font-medium text-white/60 uppercase tracking-wider mb-4">
                                            Galeri
                                        </h3>
                                        <div className="grid grid-cols-3 gap-2">
                                            {gallery.slice(0).map((img, idx) => (
                                                <div
                                                    key={idx}
                                                    onClick={() => { setGalleryIndex(idx); setGalleryOpen(true); }}
                                                    className="aspect-square rounded-xl bg-cover bg-center cursor-pointer hover:opacity-80 transition-opacity"
                                                    style={{ backgroundImage: `url(${img})` }}
                                                />
                                            ))}
                                        </div>
                                    </div>
                                    <div className="h-px bg-white/10" />
                                </>
                            )}

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

                            {/* Social Media Icons - Centered circles */}
                            {activeSocials.length > 0 && (
                                <div className="flex justify-center gap-4">
                                    {activeSocials.map((social) => (
                                        <a
                                            key={social.key}
                                            href={social.url}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors text-white"
                                        >
                                            {social.icon}
                                        </a>
                                    ))}
                                </div>
                            )}
                        </div>
                    </motion.div>
                </>
            )}

            {/* Gallery Slider Modal */}
            {galleryOpen && gallery.length > 0 && (
                <div className="fixed inset-0 z-[100] bg-black flex items-center justify-center">
                    {/* Close Button */}
                    <button
                        onClick={() => setGalleryOpen(false)}
                        className="absolute top-4 left-4 w-10 h-10 rounded-full backdrop-blur-xl flex items-center justify-center hover:bg-white/20 transition-colors z-10"
                        style={{ backgroundColor: "rgba(255,255,255,0.1)" }}
                    >
                        <X className="w-5 h-5 text-white" />
                    </button>

                    {/* Image Counter */}
                    <div className="absolute top-4 right-4 text-white/60 text-sm">
                        {galleryIndex + 1} / {gallery.length}
                    </div>

                    {/* Main Image */}
                    <div
                        className="w-full h-full bg-contain bg-center bg-no-repeat"
                        style={{ backgroundImage: `url(${gallery[galleryIndex]})` }}
                    />

                    {/* Navigation Arrows */}
                    {gallery.length > 1 && (
                        <>
                            <button
                                onClick={() => setGalleryIndex((prev) => (prev - 1 + gallery.length) % gallery.length)}
                                className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/10 backdrop-blur-xl flex items-center justify-center hover:bg-white/20 transition-colors"
                            >
                                <ChevronLeft className="w-6 h-6 text-white" />
                            </button>
                            <button
                                onClick={() => setGalleryIndex((prev) => (prev + 1) % gallery.length)}
                                className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/10 backdrop-blur-xl flex items-center justify-center hover:bg-white/20 transition-colors"
                            >
                                <ChevronRight className="w-6 h-6 text-white" />
                            </button>
                        </>
                    )}
                </div>
            )}
        </AnimatePresence>
    );
}

