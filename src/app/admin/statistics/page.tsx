"use client";

import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import {
    TrendingUp,
    TrendingDown,
    Eye,
    QrCode,
    ShoppingBag,
    Users,
    Clock,
    Calendar,
    BarChart3,
    PieChart,
    ArrowUpRight,
    ArrowDownRight,
    Sparkles,
} from "lucide-react";
import { useDataStore } from "@/context/DataStoreContext";

// Mock analytics data generator
function generateMockData() {
    const today = new Date();
    const dailyViews: number[] = [];
    const dailyScans: number[] = [];
    const dailyLabels: string[] = [];

    for (let i = 29; i >= 0; i--) {
        const date = new Date(today);
        date.setDate(date.getDate() - i);
        dailyLabels.push(date.toLocaleDateString("tr-TR", { day: "2-digit", month: "short" }));
        dailyViews.push(Math.floor(Math.random() * 500) + 100);
        dailyScans.push(Math.floor(Math.random() * 200) + 50);
    }

    return { dailyViews, dailyScans, dailyLabels };
}

// Simple Bar Chart Component
function BarChart({ data, labels, color, height = 200 }: {
    data: number[];
    labels: string[];
    color: string;
    height?: number;
}) {
    const max = Math.max(...data);
    const displayData = data.slice(-14); // Last 14 days
    const displayLabels = labels.slice(-14);

    return (
        <div className="w-full" style={{ height }}>
            <div className="flex items-end justify-between gap-1 h-full">
                {displayData.map((value, index) => (
                    <div key={index} className="flex-1 flex flex-col items-center gap-1">
                        <motion.div
                            initial={{ height: 0 }}
                            animate={{ height: `${(value / max) * 100}%` }}
                            transition={{ delay: index * 0.03, duration: 0.5 }}
                            className={`w-full rounded-t-sm ${color} min-h-[4px]`}
                            title={`${displayLabels[index]}: ${value}`}
                        />
                    </div>
                ))}
            </div>
            <div className="flex justify-between mt-2 text-[10px] text-white/40">
                <span>{displayLabels[0]}</span>
                <span>{displayLabels[displayLabels.length - 1]}</span>
            </div>
        </div>
    );
}

// Stat Card Component
function StatCard({
    title,
    value,
    change,
    changeType,
    icon: Icon,
    color
}: {
    title: string;
    value: string | number;
    change: number;
    changeType: "increase" | "decrease";
    icon: React.ElementType;
    color: string;
}) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-neutral-900 rounded-2xl p-6 border border-white/5"
        >
            <div className="flex items-start justify-between mb-4">
                <div className={`w-12 h-12 rounded-xl ${color} flex items-center justify-center`}>
                    <Icon className="w-6 h-6 text-white" />
                </div>
                <div className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${changeType === "increase"
                        ? "bg-green-500/20 text-green-400"
                        : "bg-red-500/20 text-red-400"
                    }`}>
                    {changeType === "increase" ? (
                        <ArrowUpRight className="w-3 h-3" />
                    ) : (
                        <ArrowDownRight className="w-3 h-3" />
                    )}
                    {Math.abs(change)}%
                </div>
            </div>
            <p className="text-3xl font-bold text-white mb-1">{value}</p>
            <p className="text-sm text-white/40">{title}</p>
        </motion.div>
    );
}

// Progress Bar Component
function ProgressBar({ label, value, max, color }: {
    label: string;
    value: number;
    max: number;
    color: string;
}) {
    const percentage = (value / max) * 100;
    return (
        <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
                <span className="text-white/80">{label}</span>
                <span className="text-white/40">{value}</span>
            </div>
            <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${percentage}%` }}
                    transition={{ duration: 0.8 }}
                    className={`h-full ${color} rounded-full`}
                />
            </div>
        </div>
    );
}

export default function StatisticsPage() {
    const { products, categories } = useDataStore();
    const [dateRange, setDateRange] = useState<"daily" | "weekly" | "monthly">("daily");

    // Generate mock data
    const analyticsData = useMemo(() => generateMockData(), []);

    // Calculate stats
    const totalViews = analyticsData.dailyViews.reduce((a, b) => a + b, 0);
    const totalScans = analyticsData.dailyScans.reduce((a, b) => a + b, 0);
    const avgDailyViews = Math.round(totalViews / 30);
    const avgDailyScans = Math.round(totalScans / 30);

    // Mock popular products
    const popularProducts = products.slice(0, 5).map((product, index) => ({
        ...product,
        views: Math.floor(Math.random() * 500) + (5 - index) * 100,
    })).sort((a, b) => b.views - a.views);

    // Category distribution
    const categoryStats = categories.map(cat => ({
        name: cat.name,
        count: products.filter(p => p.categoryId === cat.id).length,
    }));

    // Peak hours mock data
    const peakHours = [
        { hour: "12:00", value: 85 },
        { hour: "13:00", value: 92 },
        { hour: "19:00", value: 78 },
        { hour: "20:00", value: 95 },
        { hour: "21:00", value: 88 },
    ];

    return (
        <div className="p-6 lg:p-8 space-y-8">
            {/* Header */}
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex flex-col sm:flex-row sm:items-center justify-between gap-4"
            >
                <div>
                    <h1 className="text-2xl font-bold text-white mb-2">İstatistikler</h1>
                    <p className="text-white/40">Gerçek zamanlı analitik ve performans metrikleri</p>
                </div>

                {/* Date Range Filter */}
                <div className="flex items-center gap-2 bg-neutral-900 rounded-xl p-1">
                    {[
                        { key: "daily", label: "Günlük" },
                        { key: "weekly", label: "Haftalık" },
                        { key: "monthly", label: "Aylık" },
                    ].map((range) => (
                        <button
                            key={range.key}
                            onClick={() => setDateRange(range.key as typeof dateRange)}
                            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${dateRange === range.key
                                    ? "bg-white text-black"
                                    : "text-white/60 hover:text-white"
                                }`}
                        >
                            {range.label}
                        </button>
                    ))}
                </div>
            </motion.div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <StatCard
                    title="Toplam Görüntüleme"
                    value={totalViews.toLocaleString("tr-TR")}
                    change={12}
                    changeType="increase"
                    icon={Eye}
                    color="bg-blue-500"
                />
                <StatCard
                    title="QR Kod Okutma"
                    value={totalScans.toLocaleString("tr-TR")}
                    change={8}
                    changeType="increase"
                    icon={QrCode}
                    color="bg-purple-500"
                />
                <StatCard
                    title="Ortalama Günlük Ziyaret"
                    value={avgDailyViews}
                    change={5}
                    changeType="increase"
                    icon={Users}
                    color="bg-green-500"
                />
                <StatCard
                    title="Aktif Ürün"
                    value={products.length}
                    change={products.length > 0 ? 0 : -100}
                    changeType={products.length > 0 ? "increase" : "decrease"}
                    icon={ShoppingBag}
                    color="bg-amber-500"
                />
            </div>

            {/* Charts Row */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Views Chart */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="bg-neutral-900 rounded-2xl p-6 border border-white/5"
                >
                    <div className="flex items-center justify-between mb-6">
                        <div>
                            <h3 className="text-lg font-semibold text-white">Sayfa Görüntüleme</h3>
                            <p className="text-sm text-white/40">Son 14 gün</p>
                        </div>
                        <div className="flex items-center gap-2 text-green-400">
                            <TrendingUp className="w-5 h-5" />
                            <span className="font-medium">+12%</span>
                        </div>
                    </div>
                    <BarChart
                        data={analyticsData.dailyViews}
                        labels={analyticsData.dailyLabels}
                        color="bg-gradient-to-t from-blue-600 to-blue-400"
                        height={180}
                    />
                </motion.div>

                {/* QR Scans Chart */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="bg-neutral-900 rounded-2xl p-6 border border-white/5"
                >
                    <div className="flex items-center justify-between mb-6">
                        <div>
                            <h3 className="text-lg font-semibold text-white">QR Kod Okutma</h3>
                            <p className="text-sm text-white/40">Son 14 gün</p>
                        </div>
                        <div className="flex items-center gap-2 text-green-400">
                            <TrendingUp className="w-5 h-5" />
                            <span className="font-medium">+8%</span>
                        </div>
                    </div>
                    <BarChart
                        data={analyticsData.dailyScans}
                        labels={analyticsData.dailyLabels}
                        color="bg-gradient-to-t from-purple-600 to-purple-400"
                        height={180}
                    />
                </motion.div>
            </div>

            {/* Popular Products & Category Distribution */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Popular Products */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    className="bg-neutral-900 rounded-2xl p-6 border border-white/5"
                >
                    <div className="flex items-center gap-2 mb-6">
                        <Sparkles className="w-5 h-5 text-amber-400" />
                        <h3 className="text-lg font-semibold text-white">En Popüler Ürünler</h3>
                    </div>
                    <div className="space-y-4">
                        {popularProducts.length > 0 ? (
                            popularProducts.map((product, index) => (
                                <div key={product.id} className="flex items-center gap-4">
                                    <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${index === 0 ? "bg-amber-500 text-black" :
                                            index === 1 ? "bg-gray-400 text-black" :
                                                index === 2 ? "bg-amber-700 text-white" :
                                                    "bg-white/10 text-white/60"
                                        }`}>
                                        {index + 1}
                                    </span>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-white font-medium truncate">{product.name}</p>
                                        <p className="text-sm text-white/40">{product.views} görüntüleme</p>
                                    </div>
                                    <span className="text-white/60 text-sm">₺{product.price}</span>
                                </div>
                            ))
                        ) : (
                            <p className="text-white/40 text-center py-8">Henüz ürün eklenmemiş</p>
                        )}
                    </div>
                </motion.div>

                {/* Category Distribution */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                    className="bg-neutral-900 rounded-2xl p-6 border border-white/5"
                >
                    <div className="flex items-center gap-2 mb-6">
                        <PieChart className="w-5 h-5 text-blue-400" />
                        <h3 className="text-lg font-semibold text-white">Kategori Dağılımı</h3>
                    </div>
                    <div className="space-y-4">
                        {categoryStats.length > 0 ? (
                            categoryStats.map((cat, index) => {
                                const colors = [
                                    "bg-blue-500",
                                    "bg-purple-500",
                                    "bg-green-500",
                                    "bg-amber-500",
                                    "bg-red-500",
                                    "bg-pink-500",
                                ];
                                return (
                                    <ProgressBar
                                        key={cat.name}
                                        label={cat.name}
                                        value={cat.count}
                                        max={Math.max(...categoryStats.map(c => c.count), 1)}
                                        color={colors[index % colors.length]}
                                    />
                                );
                            })
                        ) : (
                            <p className="text-white/40 text-center py-8">Henüz kategori eklenmemiş</p>
                        )}
                    </div>
                </motion.div>
            </div>

            {/* Peak Hours & Additional Stats */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Peak Hours */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6 }}
                    className="bg-neutral-900 rounded-2xl p-6 border border-white/5"
                >
                    <div className="flex items-center gap-2 mb-6">
                        <Clock className="w-5 h-5 text-green-400" />
                        <h3 className="text-lg font-semibold text-white">Yoğun Saatler</h3>
                    </div>
                    <div className="space-y-3">
                        {peakHours.map((hour, index) => (
                            <div key={index} className="flex items-center justify-between">
                                <span className="text-white/60">{hour.hour}</span>
                                <div className="flex items-center gap-2">
                                    <div className="w-24 h-2 bg-white/10 rounded-full overflow-hidden">
                                        <div
                                            className="h-full bg-green-500 rounded-full"
                                            style={{ width: `${hour.value}%` }}
                                        />
                                    </div>
                                    <span className="text-white/40 text-sm w-8">{hour.value}%</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </motion.div>

                {/* Quick Stats */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.7 }}
                    className="bg-neutral-900 rounded-2xl p-6 border border-white/5"
                >
                    <div className="flex items-center gap-2 mb-6">
                        <BarChart3 className="w-5 h-5 text-purple-400" />
                        <h3 className="text-lg font-semibold text-white">Hızlı İstatistikler</h3>
                    </div>
                    <div className="space-y-4">
                        <div className="flex items-center justify-between p-3 bg-white/5 rounded-xl">
                            <span className="text-white/60">Ortalama Oturum Süresi</span>
                            <span className="text-white font-medium">2m 34s</span>
                        </div>
                        <div className="flex items-center justify-between p-3 bg-white/5 rounded-xl">
                            <span className="text-white/60">Sayfa/Oturum</span>
                            <span className="text-white font-medium">4.2</span>
                        </div>
                        <div className="flex items-center justify-between p-3 bg-white/5 rounded-xl">
                            <span className="text-white/60">Hemen Çıkma Oranı</span>
                            <span className="text-white font-medium">32%</span>
                        </div>
                        <div className="flex items-center justify-between p-3 bg-white/5 rounded-xl">
                            <span className="text-white/60">Geri Dönen Ziyaretçi</span>
                            <span className="text-white font-medium">45%</span>
                        </div>
                    </div>
                </motion.div>

                {/* Device Stats */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.8 }}
                    className="bg-neutral-900 rounded-2xl p-6 border border-white/5"
                >
                    <div className="flex items-center gap-2 mb-6">
                        <Calendar className="w-5 h-5 text-amber-400" />
                        <h3 className="text-lg font-semibold text-white">Cihaz Dağılımı</h3>
                    </div>
                    <div className="space-y-4">
                        <ProgressBar label="Mobil" value={72} max={100} color="bg-blue-500" />
                        <ProgressBar label="Tablet" value={18} max={100} color="bg-purple-500" />
                        <ProgressBar label="Masaüstü" value={10} max={100} color="bg-green-500" />
                    </div>
                    <div className="mt-6 pt-4 border-t border-white/10">
                        <p className="text-xs text-white/40 text-center">
                            Ziyaretçilerin %72&apos;si mobil cihaz kullanıyor
                        </p>
                    </div>
                </motion.div>
            </div>
        </div>
    );
}
