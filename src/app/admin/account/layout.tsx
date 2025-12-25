"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { User, Lock, Crown } from "lucide-react";

const accountTabs = [
    { icon: User, label: "Profil", href: "/admin/account" },
    { icon: Lock, label: "Şifre", href: "/admin/account/password" },
    { icon: Crown, label: "Paket", href: "/admin/account/subscription" },
];

export default function AccountLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const pathname = usePathname();

    return (
        <div className="p-6 lg:p-8">
            {/* Header */}
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-6"
            >
                <h1 className="text-2xl font-bold text-white mb-2">Hesabım</h1>
                <p className="text-white/40">Hesap ayarlarınızı yönetin</p>
            </motion.div>

            {/* Tab Navigation */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.1 }}
                className="mb-8 overflow-x-auto scrollbar-hide"
            >
                <div className="flex gap-2 min-w-max pb-2">
                    {accountTabs.map((tab) => {
                        const isActive = pathname === tab.href;
                        const Icon = tab.icon;

                        return (
                            <Link
                                key={tab.href}
                                href={tab.href}
                                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-medium text-sm transition-all whitespace-nowrap ${isActive
                                    ? "bg-white text-black"
                                    : "bg-neutral-900 text-white/60 hover:text-white hover:bg-neutral-800"
                                    }`}
                            >
                                <Icon className="w-4 h-4" />
                                {tab.label}
                            </Link>
                        );
                    })}
                </div>
            </motion.div>

            {/* Content */}
            <motion.div
                key={pathname}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
            >
                {children}
            </motion.div>
        </div>
    );
}
