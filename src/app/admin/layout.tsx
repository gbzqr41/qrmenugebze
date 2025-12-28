"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { useFeedback } from "@/context/FeedbackContext";
import {
    QrCode,
    Settings,
    Menu,
    X,
    ChevronLeft,
    ChevronRight,
    ArrowRight,
    LogOut,
    User,
    Palette,
    Inbox,
    Search,
} from "lucide-react";

interface NavItem {
    icon: typeof Menu;
    label: string;
    href: string;
}

const navItems: NavItem[] = [
    { icon: Menu, label: "Menü Yönetimi", href: "/admin/menu" },
    { icon: Inbox, label: "Gelen Kutusu", href: "/admin/inbox" },
    { icon: Palette, label: "Tasarım", href: "/admin/design" },
    { icon: QrCode, label: "QR Kod", href: "/admin/qr" },
    { icon: User, label: "Hesabım", href: "/admin/account" },
    { icon: Settings, label: "Ayarlar", href: "/admin/settings" },
];

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
    const pathname = usePathname();
    const router = useRouter();
    const { unreadCount } = useFeedback();

    // Check authentication on mount
    useEffect(() => {
        const isLoggedIn = localStorage.getItem("isAdminLoggedIn") === "true";
        setIsAuthenticated(isLoggedIn);

        if (!isLoggedIn) {
            router.push("/login");
        }
    }, [router]);

    // Handle logout
    const handleLogout = () => {
        localStorage.removeItem("isAdminLoggedIn");
        router.push("/login");
    };

    // Show loading while checking auth
    if (isAuthenticated === null) {
        return (
            <div className="min-h-screen bg-neutral-950 flex items-center justify-center">
                <div className="w-8 h-8 border-2 border-white/20 border-t-white rounded-full animate-spin" />
            </div>
        );
    }

    // Don't render if not authenticated
    if (!isAuthenticated) {
        return null;
    }

    return (
        <div className="min-h-screen bg-neutral-950">
            {/* Mobile Header */}
            <header className="lg:hidden fixed top-0 left-0 right-0 z-40 bg-black border-b border-white/10 px-4 py-3">
                <div className="flex items-center justify-between">
                    <button
                        onClick={() => setIsSidebarOpen(true)}
                        className="w-10 h-10 rounded-lg bg-white/10 flex items-center justify-center"
                    >
                        <Menu className="w-5 h-5 text-white" />
                    </button>
                    <span className="text-lg font-bold text-white">Admin Panel</span>
                    <Link
                        href="/"
                        className="w-10 h-10 rounded-lg bg-white/10 flex items-center justify-center"
                    >
                        <ChevronLeft className="w-5 h-5 text-white" />
                    </Link>
                </div>
            </header>

            {/* Sidebar Overlay */}
            <AnimatePresence>
                {isSidebarOpen && (
                    <>
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setIsSidebarOpen(false)}
                            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 lg:hidden"
                        />
                        <motion.aside
                            initial={{ x: "-100%" }}
                            animate={{ x: 0 }}
                            exit={{ x: "-100%" }}
                            transition={{ type: "spring", damping: 25, stiffness: 200 }}
                            className="fixed top-0 left-0 bottom-0 w-80 bg-neutral-950 z-50 lg:hidden flex flex-col"
                        >
                            <div className="p-6 border-b border-white/10">
                                <span className="text-[26px] font-bold text-white block">GEBZEM</span>
                                <div className="mt-3 relative">
                                    <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-white/40" />
                                    <input
                                        type="text"
                                        placeholder="Ara..."
                                        className="w-full pl-10 pr-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-sm text-white placeholder:text-white/40 outline-none focus:border-white/20 focus:bg-white/10 transition-colors"
                                    />
                                </div>
                                <button
                                    onClick={() => setIsSidebarOpen(false)}
                                    className="absolute top-4 right-4 w-10 h-10 rounded-lg bg-white/5 flex items-center justify-center"
                                >
                                    <X className="w-5 h-5 text-white" />
                                </button>
                            </div>

                            <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
                                {navItems.map((item) => {
                                    const Icon = item.icon;
                                    const isActive = pathname === item.href;
                                    const isInbox = item.label === "Gelen Kutusu";

                                    return (
                                        <Link
                                            key={item.href}
                                            href={item.href}
                                            onClick={() => setIsSidebarOpen(false)}
                                            className={`flex items-center justify-between px-4 py-3 rounded-xl transition-all ${isActive
                                                ? "bg-white/10 text-white"
                                                : "text-white/60 hover:bg-white/10 hover:text-white"
                                                }`}
                                        >
                                            <div className="flex items-center gap-3">
                                                <Icon className={`w-5 h-5 ${isActive ? "text-white" : ""}`} />
                                                <span className="font-medium">{item.label}</span>
                                            </div>
                                            {isInbox && unreadCount > 0 && (
                                                <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold bg-white text-black`}>
                                                    {unreadCount}
                                                </span>
                                            )}
                                        </Link>
                                    );
                                })}
                            </nav>

                            <div className="p-4 mt-auto border-t border-white/10">
                                <a
                                    href="/"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-white/60 hover:bg-white/10 hover:text-white transition-all font-medium"
                                >
                                    <ChevronRight className="w-5 h-5" />
                                    Siteye Git
                                </a>
                                <button
                                    onClick={handleLogout}
                                    className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-red-400 hover:bg-red-500/10 transition-all font-medium"
                                >
                                    Çıkış Yap
                                    <ArrowRight className="w-5 h-5" />
                                </button>
                            </div>
                        </motion.aside>
                    </>
                )}
            </AnimatePresence>

            {/* Sidebar Desktop */}
            <aside className="fixed top-0 left-0 bottom-0 w-72 bg-black border-r border-white/10 hidden lg:flex flex-col">
                <div className="p-6">
                    <span className="text-[26px] font-bold text-white block">GEBZEM</span>
                    <div className="mt-3 relative">
                        <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-white/40" />
                        <input
                            type="text"
                            placeholder="Ara..."
                            className="w-full pl-10 pr-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-sm text-white placeholder:text-white/40 outline-none focus:border-white/20 focus:bg-white/10 transition-colors"
                        />
                    </div>
                </div>

                <div className="border-t border-white/10" />

                <nav className="p-4 space-y-2 overflow-y-auto">
                    {navItems.map((item) => {
                        const Icon = item.icon;
                        const isActive = pathname === item.href;
                        const isInbox = item.label === "Gelen Kutusu";

                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                className={`flex items-center justify-between px-4 py-3.5 rounded-xl transition-all duration-200 group ${isActive
                                    ? "bg-white/10 text-white"
                                    : "text-white/50 hover:bg-white/5 hover:text-white"
                                    }`}
                            >
                                <div className="flex items-center gap-3">
                                    <Icon className={`w-5 h-5 ${isActive ? "text-white" : "text-white/40 group-hover:text-white"}`} />
                                    <span className="font-medium">{item.label}</span>
                                </div>
                                {isInbox && unreadCount > 0 && (
                                    <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold ${isActive ? "bg-white text-black" : "bg-white text-black"}`}>
                                        {unreadCount}
                                    </span>
                                )}
                            </Link>
                        );
                    })}
                </nav>

                <div className="mt-auto p-4 border-t border-white/10">
                    <a
                        href="/"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-white/60 hover:bg-white/10 hover:text-white transition-all font-medium"
                    >
                        <ChevronRight className="w-5 h-5" />
                        Siteye Git
                    </a>
                    <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-red-400 hover:bg-red-500/10 transition-all font-medium"
                    >
                        Çıkış Yap
                        <ArrowRight className="w-5 h-5" />
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="lg:pl-72 pt-16 lg:pt-0 min-h-screen">
                <div className="max-w-[1100px] mx-auto">
                    {children}
                </div>
            </main>
        </div>
    );
}
