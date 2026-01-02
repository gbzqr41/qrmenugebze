"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { DataStoreProvider } from "@/context/DataStoreContext";
import { ThemeProvider } from "@/context/ThemeContext";
import { FeedbackProvider, useFeedback } from "@/context/FeedbackContext";
import GlobalUI from "@/components/GlobalUI";
import {
    QrCode,
    Settings,
    Menu,
    X,
    ChevronRight,
    ArrowRight,
    Palette,
    Inbox,
    LogOut,
    ExternalLink,
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
    { icon: Settings, label: "Ayarlar", href: "/admin/settings" },
];

interface CurrentBusiness {
    id: string;
    name: string;
    slug: string;
}

function AdminLayoutContent({ children }: { children: React.ReactNode }) {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
    const [currentBusiness, setCurrentBusiness] = useState<CurrentBusiness | null>(null);
    const [isSuperAdmin, setIsSuperAdmin] = useState(false);
    const pathname = usePathname();
    const router = useRouter();

    let unreadCount = 0;
    try {
        const feedbackContext = useFeedback();
        unreadCount = feedbackContext?.unreadCount || 0;
    } catch {
        // Context not available
    }

    // Check authentication and load business on mount
    useEffect(() => {
        const isLoggedIn = localStorage.getItem("isAdminLoggedIn") === "true";
        const superAdmin = localStorage.getItem("isSuperAdmin") === "true";

        if (!isLoggedIn) {
            router.push("/login");
            return;
        }

        setIsAuthenticated(true);
        setIsSuperAdmin(superAdmin);

        const loadBusiness = () => {
            const businessSlug = localStorage.getItem("currentBusinessSlug");
            const businessId = localStorage.getItem("currentBusinessId");
            const businessName = localStorage.getItem("currentBusinessName");

            if (businessSlug && businessId && businessName) {
                setCurrentBusiness({
                    id: businessId,
                    slug: businessSlug,
                    name: businessName,
                });
            }
        };

        loadBusiness();

        // Listen for business updates from settings page
        const handleBusinessUpdate = () => loadBusiness();
        window.addEventListener("businessUpdated", handleBusinessUpdate);
        return () => window.removeEventListener("businessUpdated", handleBusinessUpdate);
    }, [router]);

    // Handle logout
    const handleLogout = () => {
        localStorage.removeItem("isAdminLoggedIn");
        localStorage.removeItem("isSuperAdmin");
        localStorage.removeItem("currentBusinessSlug");
        localStorage.removeItem("currentBusinessId");
        localStorage.removeItem("currentBusinessName");
        localStorage.removeItem("adminPhone");
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

    // Show loading while waiting for business to load
    if (!currentBusiness) {
        return (
            <div className="min-h-screen bg-neutral-950 flex items-center justify-center">
                <div className="text-center">
                    <div className="w-8 h-8 border-2 border-white/20 border-t-white rounded-full animate-spin mx-auto mb-4" />
                    <p className="text-white/40 text-sm">İşletme yükleniyor...</p>
                </div>
            </div>
        );
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
                    <span className="text-lg font-bold text-white truncate max-w-[200px]">
                        {currentBusiness.name}
                    </span>
                    <a
                        href={`/${currentBusiness.slug}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-10 h-10 rounded-lg bg-white/10 flex items-center justify-center"
                    >
                        <ExternalLink className="w-5 h-5 text-white" />
                    </a>
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
                                <span className="text-[26px] font-bold text-white block">GBZQR</span>
                                <p className="text-white/40 text-sm mt-1 truncate">{currentBusiness.name}</p>
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
                                                <span className="w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold bg-white text-black">
                                                    {unreadCount}
                                                </span>
                                            )}
                                        </Link>
                                    );
                                })}
                            </nav>

                            <div className="p-4 mt-auto border-t border-white/10">
                                {isSuperAdmin && (
                                    <Link
                                        href="/super-admin"
                                        className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-purple-400 hover:bg-purple-500/10 transition-all font-medium"
                                    >
                                        <ChevronRight className="w-5 h-5" />
                                        Süper Admin
                                    </Link>
                                )}
                                <a
                                    href={`/${currentBusiness.slug}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-white/60 hover:bg-white/10 hover:text-white transition-all font-medium"
                                >
                                    <ExternalLink className="w-5 h-5" />
                                    Menüyü Gör
                                </a>
                                <button
                                    onClick={handleLogout}
                                    className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-red-400 hover:bg-red-500/10 transition-all font-medium"
                                >
                                    <LogOut className="w-5 h-5" />
                                    Çıkış Yap
                                </button>
                            </div>
                        </motion.aside>
                    </>
                )}
            </AnimatePresence>

            {/* Sidebar Desktop */}
            <aside className="fixed top-0 left-0 bottom-0 w-72 bg-black border-r border-white/10 hidden lg:flex flex-col">
                <div className="p-6">
                    <span className="text-[26px] font-bold text-white block">GBZQR</span>
                    <p className="text-white/40 text-sm mt-1 truncate">{currentBusiness.name}</p>
                </div>

                <div className="border-t border-white/10" />

                <nav className="p-4 space-y-2 overflow-y-auto flex-1">
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
                                    <span className="w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold bg-white text-black">
                                        {unreadCount}
                                    </span>
                                )}
                            </Link>
                        );
                    })}
                </nav>

                <div className="mt-auto p-4 border-t border-white/10">
                    {isSuperAdmin && (
                        <Link
                            href="/super-admin"
                            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-purple-400 hover:bg-purple-500/10 transition-all font-medium"
                        >
                            <ChevronRight className="w-5 h-5" />
                            Süper Admin
                        </Link>
                    )}
                    <a
                        href={`/${currentBusiness.slug}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-white/60 hover:bg-white/10 hover:text-white transition-all font-medium"
                    >
                        <ExternalLink className="w-5 h-5" />
                        Menüyü Gör
                    </a>
                    <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-red-400 hover:bg-red-500/10 transition-all font-medium"
                    >
                        <LogOut className="w-5 h-5" />
                        Çıkış Yap
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="lg:pl-72 pt-16 lg:pt-0 min-h-screen">
                <div className="max-w-[1100px] mx-auto">
                    <ThemeProvider>
                        <DataStoreProvider initialSlug={currentBusiness.slug}>
                            <FeedbackProvider slug={currentBusiness.slug}>
                                {children}
                                <GlobalUI />
                            </FeedbackProvider>
                        </DataStoreProvider>
                    </ThemeProvider>
                </div>
            </main>
        </div>
    );
}

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return <AdminLayoutContent>{children}</AdminLayoutContent>;
}
