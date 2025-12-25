"use client";

import { useState } from "react";
import {
    Navigation,
    Phone,
    Mail,
    Globe,
    Clock,
    Instagram,
    Facebook,
    Twitter,
    Youtube,
    ChevronRight,
    ArrowLeft,
} from "lucide-react";
import Link from "next/link";
import { useDataStore } from "@/context/DataStoreContext";
import { useTheme } from "@/context/ThemeContext";
import BottomNav from "@/components/BottomNav";
import GallerySlider from "@/components/GallerySlider";


export default function ProfilePage() {
    const { business } = useDataStore();
    const { theme } = useTheme();
    const [isGalleryOpen, setIsGalleryOpen] = useState(false);
    const [galleryStartIndex, setGalleryStartIndex] = useState(0);


    const openGallery = (index: number) => {
        setGalleryStartIndex(index);
        setIsGalleryOpen(true);
    };

    // Bugünün günü
    const today = new Date().toLocaleDateString("tr-TR", { weekday: "long" });
    const todayCapitalized = today.charAt(0).toUpperCase() + today.slice(1);

    return (
        <main className="min-h-screen pb-24" style={{ backgroundColor: theme.primaryColor }}>
            {/* Cover Image */}
            <div className="relative h-64 overflow-hidden">
                <div
                    className="absolute inset-0 bg-cover bg-center"
                    style={{
                        backgroundImage: `url(https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800&h=400&fit=crop)`,
                    }}
                />
                <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-black" />

                {/* Back Button */}
                <Link
                    href="/"
                    className="absolute top-4 left-4 z-10 w-10 h-10 rounded-full bg-black/50 backdrop-blur-md flex items-center justify-center"
                >
                    <ArrowLeft className="w-5 h-5 text-white" />
                </Link>
            </div>

            {/* Profile Content */}
            <div className="relative px-5 -mt-20">
                {/* Logo */}
                <div className="w-28 h-28 rounded-2xl bg-white flex items-center justify-center shadow-2xl mb-4 overflow-hidden border-4 border-black">
                    <span className="text-4xl font-bold text-black">AG</span>
                </div>

                {/* Name */}
                <div>
                    <h1 className="text-2xl font-bold text-white mb-4">{business.name}</h1>
                </div>

                {/* Cuisine Types */}
                <div className="flex flex-wrap gap-2 mb-6">
                    {business.cuisineTypes.map((cuisine, index) => (
                        <span
                            key={index}
                            className="px-4 py-2 text-sm font-medium bg-white/10 text-white rounded-full border border-white/20"
                        >
                            {cuisine}
                        </span>
                    ))}
                </div>

                {/* Description */}
                <p className="text-white/70 leading-relaxed mb-8">
                    {business.description}
                </p>

                {/* Gallery Section */}
                <div className="mb-8">
                    <h2 className="text-lg font-bold text-white mb-4">Galeri</h2>
                    <div className="flex gap-3 overflow-x-auto scrollbar-hide pb-2">
                        {business.gallery.map((image, index) => (
                            <button
                                key={index}
                                onClick={() => openGallery(index)}
                                className="relative flex-shrink-0 w-32 h-32 rounded-xl overflow-hidden"
                            >
                                <div
                                    className="absolute inset-0 bg-cover bg-center"
                                    style={{ backgroundImage: `url(${image})` }}
                                />
                                <div className="absolute inset-0 bg-black/20" />
                            </button>
                        ))}
                    </div>
                </div>

                {/* Working Hours */}
                <div className="mb-8">
                    <h2 className="text-lg font-bold mb-4 flex items-center gap-2" style={{ color: theme.textColor }}>
                        <Clock className="w-5 h-5" />
                        Çalışma Saatleri
                    </h2>
                    <div className="rounded-2xl p-4 space-y-3" style={{ backgroundColor: theme.cardColor }}>
                        {business.workingHours.map((hours, index) => {
                            const isToday = hours.day === todayCapitalized;
                            return (
                                <div
                                    key={index}
                                    className={`flex items-center justify-between py-2`}
                                    style={{ color: isToday ? theme.textColor : theme.textColor, opacity: isToday ? 1 : 0.6 }}
                                >
                                    <span className={`font-medium`}>
                                        {hours.day}
                                        {isToday && (
                                            <span
                                                className="ml-2 px-2 py-0.5 text-xs rounded-full"
                                                style={{ backgroundColor: theme.accentColor, color: theme.primaryColor }}
                                            >
                                                Bugün
                                            </span>
                                        )}
                                    </span>
                                    <span>
                                        {hours.isClosed ? "Kapalı" : `${hours.open} - ${hours.close}`}
                                    </span>
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* Contact Info */}
                <div className="mb-8">
                    <h2 className="text-lg font-bold mb-4" style={{ color: theme.textColor }}>İletişim</h2>
                    <div className="space-y-3">
                        {/* Address - Navigation icon */}
                        <a
                            href={`https://maps.google.com/?q=${encodeURIComponent(business.address)}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-4 p-4 rounded-xl"
                            style={{ backgroundColor: theme.cardColor, color: theme.textColor }}
                        >
                            <div className="w-10 h-10 rounded-full flex items-center justify-center" style={{ backgroundColor: 'rgba(255,255,255,0.1)' }}>
                                <Navigation className="w-5 h-5" />
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="text-xs opacity-40 mb-1">Adres</p>
                                <p className="truncate">{business.address}</p>
                            </div>
                            <ChevronRight className="w-5 h-5 opacity-40" />
                        </a>

                        {/* Phone */}
                        <a
                            href={`tel:${business.phone}`}
                            className="flex items-center gap-4 p-4 rounded-xl"
                            style={{ backgroundColor: theme.cardColor, color: theme.textColor }}
                        >
                            <div className="w-10 h-10 rounded-full flex items-center justify-center" style={{ backgroundColor: 'rgba(255,255,255,0.1)' }}>
                                <Phone className="w-5 h-5" />
                            </div>
                            <div className="flex-1">
                                <p className="text-xs opacity-40 mb-1">Telefon</p>
                                <p>{business.phone}</p>
                            </div>
                            <ChevronRight className="w-5 h-5 opacity-40" />
                        </a>

                        {/* Email */}
                        <a
                            href={`mailto:${business.email}`}
                            className="flex items-center gap-4 p-4 rounded-xl"
                            style={{ backgroundColor: theme.cardColor, color: theme.textColor }}
                        >
                            <div className="w-10 h-10 rounded-full flex items-center justify-center" style={{ backgroundColor: 'rgba(255,255,255,0.1)' }}>
                                <Mail className="w-5 h-5" />
                            </div>
                            <div className="flex-1">
                                <p className="text-xs opacity-40 mb-1">E-posta</p>
                                <p>{business.email}</p>
                            </div>
                            <ChevronRight className="w-5 h-5 opacity-40" />
                        </a>

                        {/* Website */}
                        <a
                            href={`https://${business.website}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-4 p-4 rounded-xl"
                            style={{ backgroundColor: theme.cardColor, color: theme.textColor }}
                        >
                            <div className="w-10 h-10 rounded-full flex items-center justify-center" style={{ backgroundColor: 'rgba(255,255,255,0.1)' }}>
                                <Globe className="w-5 h-5" />
                            </div>
                            <div className="flex-1">
                                <p className="text-xs opacity-40 mb-1">Website</p>
                                <p>{business.website}</p>
                            </div>
                            <ChevronRight className="w-5 h-5 opacity-40" />
                        </a>
                    </div>
                </div>

                {/* Social Media - Circular icons */}
                <div className="mb-8">
                    <h2 className="text-lg font-bold mb-4" style={{ color: theme.textColor }}>Sosyal Medya</h2>
                    <div className="flex gap-4">
                        {business.socialMedia.instagram && (
                            <a
                                href={`https://instagram.com/${business.socialMedia.instagram}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="w-14 h-14 rounded-full flex items-center justify-center"
                                style={{ backgroundColor: theme.cardColor, color: theme.textColor }}
                            >
                                <Instagram className="w-6 h-6" />
                            </a>
                        )}
                        {business.socialMedia.facebook && (
                            <a
                                href={`https://facebook.com/${business.socialMedia.facebook}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="w-14 h-14 rounded-full flex items-center justify-center"
                                style={{ backgroundColor: theme.cardColor, color: theme.textColor }}
                            >
                                <Facebook className="w-6 h-6" />
                            </a>
                        )}
                        {business.socialMedia.twitter && (
                            <a
                                href={`https://twitter.com/${business.socialMedia.twitter}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="w-14 h-14 rounded-full flex items-center justify-center"
                                style={{ backgroundColor: theme.cardColor, color: theme.textColor }}
                            >
                                <Twitter className="w-6 h-6" />
                            </a>
                        )}
                        {business.socialMedia.youtube && (
                            <a
                                href={`https://youtube.com/@${business.socialMedia.youtube}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="w-14 h-14 rounded-full flex items-center justify-center"
                                style={{ backgroundColor: theme.cardColor, color: theme.textColor }}
                            >
                                <Youtube className="w-6 h-6" />
                            </a>
                        )}
                        {business.socialMedia.tiktok && (
                            <a
                                href={`https://tiktok.com/@${business.socialMedia.tiktok}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="w-14 h-14 rounded-full flex items-center justify-center"
                                style={{ backgroundColor: theme.cardColor, color: theme.textColor }}
                            >
                                <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
                                    <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-5.2 1.74 2.89 2.89 0 012.31-4.64 2.93 2.93 0 01.88.13V9.4a6.84 6.84 0 00-1-.05A6.33 6.33 0 005 20.1a6.34 6.34 0 0010.86-4.43v-7a8.16 8.16 0 004.77 1.52v-3.4a4.85 4.85 0 01-1-.1z" />
                                </svg>
                            </a>
                        )}
                    </div>
                </div>
            </div>

            {/* Bottom Navigation */}
            <BottomNav />

            {/* Gallery Slider Modal */}
            <GallerySlider
                images={business.gallery}
                isOpen={isGalleryOpen}
                initialIndex={galleryStartIndex}
                onClose={() => setIsGalleryOpen(false)}
            />

        </main>
    );
}
