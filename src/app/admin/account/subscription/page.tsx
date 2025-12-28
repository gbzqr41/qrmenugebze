"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
    Crown,
    Package,
    Check,
    Image as ImageIcon,
    QrCode,
    Users,
    Shield,
    Zap,
} from "lucide-react";

interface AdminInfo {
    name: string;
    email: string;
    password: string;
    package: "starter" | "professional" | "enterprise";
    createdAt: string;
}

const packageInfo = {
    starter: {
        name: "Starter",
        price: "₺299/ay",
        color: "from-gray-500 to-gray-600",
        icon: Package,
        features: [
            "50 ürün limiti",
            "5 kategori",
            "Temel QR kod",
            "Email desteği",
        ],
    },
    professional: {
        name: "Professional",
        price: "₺599/ay",
        color: "from-blue-500 to-purple-600",
        icon: Crown,
        features: [
            "Sınırsız ürün",
            "Sınırsız kategori",
            "Özelleştirilebilir QR kod",
            "Öncelikli destek",
            "Analitik raporları",
            "Galeri & video desteği",
        ],
    },
    enterprise: {
        name: "Enterprise",
        price: "₺1299/ay",
        color: "from-orange-500 to-red-600",
        icon: Zap,
        features: [
            "Tüm Professional özellikler",
            "Çoklu şube desteği",
            "API erişimi",
            "Özel entegrasyonlar",
            "7/24 destek",
            "Beyaz etiket seçeneği",
        ],
    },
};

export default function SubscriptionPage() {
    const [adminInfo, setAdminInfo] = useState<AdminInfo>({
        name: "Admin",
        email: "admin@antigravity.com",
        password: "demo123",
        package: "professional",
        createdAt: "2024-01-15",
    });

    // Load admin info from localStorage
    useEffect(() => {
        const savedInfo = localStorage.getItem("adminInfo");
        if (savedInfo) {
            setAdminInfo(JSON.parse(savedInfo));
        }
    }, []);

    const currentPackage = packageInfo[adminInfo.package];
    const PackageIcon = currentPackage.icon;

    return (
        <div className="max-w-xl space-y-6">
            {/* Current Package */}
            <div className={`bg-gradient-to-br ${currentPackage.color} rounded-2xl p-6 relative overflow-hidden`}>
                <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-3xl" />
                <div className="relative z-10">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center">
                            <PackageIcon className="w-6 h-6 text-white" />
                        </div>
                        <div>
                            <p className="text-white/80 text-sm">Mevcut Paket</p>
                            <h3 className="text-2xl font-bold text-white">{currentPackage.name}</h3>
                        </div>
                    </div>
                    <p className="text-3xl font-bold text-white mb-4">{currentPackage.price}</p>
                    <p className="text-white/60 text-sm">
                        Üyelik başlangıcı: {new Date(adminInfo.createdAt).toLocaleDateString("tr-TR")}
                    </p>
                </div>
            </div>

            {/* Package Features */}
            <div className="bg-neutral-900 rounded-2xl border border-white/5 p-6">
                <h3 className="text-lg font-bold text-white mb-4">Paket Özellikleri</h3>
                <ul className="space-y-3">
                    {currentPackage.features.map((feature, index) => (
                        <li key={index} className="flex items-center gap-3">
                            <div className="w-5 h-5 rounded-full bg-green-500/20 flex items-center justify-center">
                                <Check className="w-3 h-3 text-green-400" />
                            </div>
                            <span className="text-white/80">{feature}</span>
                        </li>
                    ))}
                </ul>
            </div>

            {/* Quick Stats */}
            <div className="bg-neutral-900 rounded-2xl border border-white/5 p-6">
                <h3 className="text-lg font-bold text-white mb-4">Hesap Özeti</h3>
                <div className="grid grid-cols-2 gap-4">
                    <div className="bg-neutral-800 rounded-xl p-4">
                        <ImageIcon className="w-5 h-5 text-blue-400 mb-2" />
                        <p className="text-2xl font-bold text-white">∞</p>
                        <p className="text-sm text-white/40">Resim Limiti</p>
                    </div>
                    <div className="bg-neutral-800 rounded-xl p-4">
                        <QrCode className="w-5 h-5 text-purple-400 mb-2" />
                        <p className="text-2xl font-bold text-white">∞</p>
                        <p className="text-sm text-white/40">QR Kod</p>
                    </div>
                    <div className="bg-neutral-800 rounded-xl p-4">
                        <Users className="w-5 h-5 text-green-400 mb-2" />
                        <p className="text-2xl font-bold text-white">5</p>
                        <p className="text-sm text-white/40">Kullanıcı</p>
                    </div>
                    <div className="bg-neutral-800 rounded-xl p-4">
                        <Shield className="w-5 h-5 text-orange-400 mb-2" />
                        <p className="text-2xl font-bold text-white">SSL</p>
                        <p className="text-sm text-white/40">Güvenlik</p>
                    </div>
                </div>
            </div>
        </div>
    );
}
