"use client";

import { motion } from "framer-motion";
import {
    Package,
    Tag,
    Star,
    TrendingUp,
    Plus,
    QrCode,
    ExternalLink,
    ArrowUpRight,
    Eye,
    Clock,
    Sparkles,
} from "lucide-react";
import Link from "next/link";
import { useDataStore } from "@/context/DataStoreContext";

interface StatCardProps {
    title: string;
    value: string | number;
    icon: typeof Package;
    trend?: { value: number; isPositive: boolean };
    color?: string;
    delay: number;
}

function StatCard({ title, value, icon: Icon, trend, color = "white", delay }: StatCardProps) {
    const colorClasses: Record<string, string> = {
        white: "bg-white/10",
        green: "bg-green-500/20",
        blue: "bg-blue-500/20",
        purple: "bg-purple-500/20",
        orange: "bg-orange-500/20",
    };

    const iconColorClasses: Record<string, string> = {
        white: "text-white",
        green: "text-green-400",
        blue: "text-blue-400",
        purple: "text-purple-400",
        orange: "text-orange-400",
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay }}
            className="bg-neutral-900 rounded-2xl p-5 border border-white/5 hover:border-white/10 transition-all"
        >
            <div className="flex items-start justify-between mb-4">
                <div className={`w-12 h-12 rounded-xl ${colorClasses[color]} flex items-center justify-center`}>
                    <Icon className={`w-6 h-6 ${iconColorClasses[color]}`} />
                </div>
                {trend && (
                    <div
                        className={`flex items-center gap-1 text-sm ${trend.isPositive ? "text-green-400" : "text-red-400"
                            }`}
                    >
                        <ArrowUpRight className="w-4 h-4" />
                        <span>{trend.value}%</span>
                    </div>
                )}
            </div>
            <p className="text-3xl font-bold text-white mb-1">{value}</p>
            <p className="text-sm text-white/40">{title}</p>
        </motion.div>
    );
}

interface QuickActionProps {
    title: string;
    description: string;
    icon: typeof Plus;
    href: string;
    delay: number;
}

function QuickAction({ title, description, icon: Icon, href, delay }: QuickActionProps) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay }}
        >
            <Link
                href={href}
                className="flex items-center gap-4 p-4 bg-neutral-900 rounded-xl border border-white/5 hover:border-white/20 transition-all group"
            >
                <div className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center group-hover:bg-white group-hover:text-black transition-all">
                    <Icon className="w-6 h-6" />
                </div>
                <div className="flex-1">
                    <h3 className="font-medium text-white">{title}</h3>
                    <p className="text-sm text-white/40">{description}</p>
                </div>
                <ExternalLink className="w-5 h-5 text-white/20 group-hover:text-white transition-colors" />
            </Link>
        </motion.div>
    );
}

export default function AdminDashboard() {
    const { products, categories, getStats } = useDataStore();
    const stats = getStats();

    // Kategori bazlı ürün sayıları
    const categoryStats = categories.map(cat => ({
        ...cat,
        productCount: products.filter(p => p.categoryId === cat.id).length
    })).sort((a, b) => b.productCount - a.productCount);

    // En yüksek fiyatlı ürünler (premium)
    const premiumProducts = [...products].sort((a, b) => b.price - a.price).slice(0, 3);

    // Ortalama fiyat
    const avgPrice = products.length > 0
        ? Math.round(products.reduce((sum, p) => sum + p.price, 0) / products.length)
        : 0;

    return (
        <div className="p-6 lg:p-8">
            {/* Header */}
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-8"
            >
                <h1 className="text-2xl font-bold text-white mb-2">Dashboard</h1>
                <p className="text-white/40">Antigravity Kitchen yönetim paneli</p>
            </motion.div>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                <StatCard
                    title="Toplam Ürün"
                    value={stats.totalProducts}
                    icon={Package}
                    color="blue"
                    trend={{ value: 12, isPositive: true }}
                    delay={0.1}
                />
                <StatCard
                    title="Kategori"
                    value={stats.totalCategories}
                    icon={Tag}
                    color="purple"
                    delay={0.15}
                />
                <StatCard
                    title="Öne Çıkan"
                    value={stats.featuredProducts}
                    icon={Star}
                    color="orange"
                    delay={0.2}
                />
                <StatCard
                    title="Yeni Ürünler"
                    value={stats.newProducts}
                    icon={Sparkles}
                    color="green"
                    delay={0.25}
                />
            </div>

            {/* Secondary Stats */}
            <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-2xl p-5 border border-white/10"
                >
                    <div className="flex items-center gap-3 mb-3">
                        <TrendingUp className="w-5 h-5 text-blue-400" />
                        <span className="text-sm text-white/60">Ortalama Fiyat</span>
                    </div>
                    <p className="text-2xl font-bold text-white">₺{avgPrice}</p>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.35 }}
                    className="bg-gradient-to-br from-green-500/20 to-teal-500/20 rounded-2xl p-5 border border-white/10"
                >
                    <div className="flex items-center gap-3 mb-3">
                        <Eye className="w-5 h-5 text-green-400" />
                        <span className="text-sm text-white/60">Bugünkü Görüntüleme</span>
                    </div>
                    <p className="text-2xl font-bold text-white">1,247</p>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    className="col-span-2 lg:col-span-1 bg-gradient-to-br from-orange-500/20 to-red-500/20 rounded-2xl p-5 border border-white/10"
                >
                    <div className="flex items-center gap-3 mb-3">
                        <Clock className="w-5 h-5 text-orange-400" />
                        <span className="text-sm text-white/60">Bu Hafta Eklenen</span>
                    </div>
                    <p className="text-2xl font-bold text-white">{stats.newProducts} ürün</p>
                </motion.div>
            </div>

            {/* Category Distribution */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.45 }}
                className="mb-8"
            >
                <h2 className="text-lg font-bold text-white mb-4">Kategori Dağılımı</h2>
                <div className="bg-neutral-900 rounded-2xl p-5 border border-white/5">
                    <div className="space-y-4">
                        {categoryStats.map((cat, index) => {
                            const percentage = products.length > 0
                                ? Math.round((cat.productCount / products.length) * 100)
                                : 0;
                            return (
                                <div key={cat.id}>
                                    <div className="flex items-center justify-between mb-2">
                                        <span className="text-white font-medium">{cat.name}</span>
                                        <span className="text-white/40 text-sm">{cat.productCount} ürün</span>
                                    </div>
                                    <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                                        <motion.div
                                            initial={{ width: 0 }}
                                            animate={{ width: `${percentage}%` }}
                                            transition={{ delay: 0.5 + index * 0.1, duration: 0.5 }}
                                            className="h-full bg-gradient-to-r from-blue-500 to-purple-500 rounded-full"
                                        />
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </motion.div>

            <div className="grid lg:grid-cols-2 gap-8">
                {/* Quick Actions */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.5 }}
                >
                    <h2 className="text-lg font-bold text-white mb-4">Hızlı Aksiyonlar</h2>
                    <div className="grid gap-3">
                        <QuickAction
                            title="Yeni Ürün Ekle"
                            description="Menüye yeni ürün ekleyin"
                            icon={Plus}
                            href="/admin/products/new"
                            delay={0.55}
                        />
                        <QuickAction
                            title="QR Kod Oluştur"
                            description="Menü QR kodunu indirin"
                            icon={QrCode}
                            href="/admin/qr"
                            delay={0.6}
                        />
                        <QuickAction
                            title="Menüyü Önizle"
                            description="Müşteri görünümünü kontrol edin"
                            icon={ExternalLink}
                            href="/"
                            delay={0.65}
                        />
                    </div>
                </motion.div>

                {/* Premium Products */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.6 }}
                >
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-lg font-bold text-white">Premium Ürünler</h2>
                        <Link
                            href="/admin/products"
                            className="text-sm text-white/40 hover:text-white transition-colors"
                        >
                            Tümünü Gör
                        </Link>
                    </div>
                    <div className="bg-neutral-900 rounded-2xl border border-white/5 overflow-hidden">
                        {premiumProducts.map((product, index) => (
                            <Link
                                key={product.id}
                                href={`/admin/products/${product.id}`}
                                className={`flex items-center gap-4 p-4 hover:bg-white/5 transition-colors ${index !== premiumProducts.length - 1 ? "border-b border-white/5" : ""
                                    }`}
                            >
                                <div className="relative">
                                    <div
                                        className="w-14 h-14 rounded-xl bg-cover bg-center flex-shrink-0"
                                        style={{ backgroundImage: `url(${product.image})` }}
                                    />
                                    <div className="absolute -top-1 -right-1 w-5 h-5 bg-orange-500 rounded-full flex items-center justify-center">
                                        <span className="text-xs text-white font-bold">{index + 1}</span>
                                    </div>
                                </div>
                                <div className="flex-1 min-w-0">
                                    <h3 className="font-medium text-white truncate">{product.name}</h3>
                                    <p className="text-sm text-white/40">
                                        {categories.find((c) => c.id === product.categoryId)?.name}
                                    </p>
                                </div>
                                <div className="text-right">
                                    <p className="font-bold text-white">₺{product.price}</p>
                                    {product.isFeatured && (
                                        <span className="text-xs text-orange-400">Öne Çıkan</span>
                                    )}
                                </div>
                            </Link>
                        ))}
                    </div>
                </motion.div>
            </div>

            {/* Recent Products */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.7 }}
                className="mt-8"
            >
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-lg font-bold text-white">Son Eklenen Ürünler</h2>
                    <Link
                        href="/admin/products"
                        className="text-sm text-white/40 hover:text-white transition-colors"
                    >
                        Tümünü Gör
                    </Link>
                </div>
                <div className="bg-neutral-900 rounded-2xl border border-white/5 overflow-hidden">
                    {products.slice(-5).reverse().map((product, index) => (
                        <Link
                            key={product.id}
                            href={`/admin/products/${product.id}`}
                            className={`flex items-center gap-4 p-4 hover:bg-white/5 transition-colors ${index !== Math.min(4, products.length - 1) ? "border-b border-white/5" : ""
                                }`}
                        >
                            <div
                                className="w-12 h-12 rounded-lg bg-cover bg-center flex-shrink-0"
                                style={{ backgroundImage: `url(${product.image})` }}
                            />
                            <div className="flex-1 min-w-0">
                                <h3 className="font-medium text-white truncate">{product.name}</h3>
                                <p className="text-sm text-white/40">
                                    {categories.find((c) => c.id === product.categoryId)?.name}
                                </p>
                            </div>
                            <div className="text-right">
                                <p className="font-semibold text-white">₺{product.price}</p>
                                {product.isNew && (
                                    <span className="text-xs text-green-400">Yeni</span>
                                )}
                            </div>
                        </Link>
                    ))}
                </div>
            </motion.div>
        </div>
    );
}
