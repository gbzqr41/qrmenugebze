"use client";

import { motion } from "framer-motion";
import {
    Plus,
    Pencil,
    Trash2,
    GripVertical,
    Salad,
    UtensilsCrossed,
    Pizza,
    Beef,
    Soup,
    Cake,
    Coffee,
    type LucideIcon,
} from "lucide-react";
import Link from "next/link";
import { useDataStore } from "@/context/DataStoreContext";

// İkon mapping
const iconMap: Record<string, LucideIcon> = {
    Salad,
    UtensilsCrossed,
    Pizza,
    Beef,
    Soup,
    Cake,
    Coffee,
};

export default function CategoriesPage() {
    const { categories, deleteCategory } = useDataStore();

    const handleDelete = (id: string) => {
        if (confirm("Bu kategoriyi silmek istediğinize emin misiniz? Bu kategorideki tüm ürünler de silinecek!")) {
            deleteCategory(id);
        }
    };

    return (
        <div className="p-6 lg:p-8">
            {/* Header */}
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center justify-between mb-8"
            >
                <div>
                    <h1 className="text-2xl font-bold text-white mb-2">Kategoriler</h1>
                    <p className="text-white/40">{categories.length} kategori</p>
                </div>
                <Link href="/admin/categories/new">
                    <motion.button
                        whileTap={{ scale: 0.95 }}
                        className="flex items-center gap-2 px-4 py-3 bg-white text-black rounded-xl font-medium hover:bg-neutral-100 transition-colors"
                    >
                        <Plus className="w-5 h-5" />
                        <span className="hidden sm:inline">Yeni Kategori</span>
                    </motion.button>
                </Link>
            </motion.div>

            {/* Category List */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.1 }}
                className="bg-neutral-900 rounded-2xl border border-white/5 overflow-hidden"
            >
                {categories.map((category, index) => {
                    const Icon = iconMap[category.icon] || UtensilsCrossed;

                    return (
                        <motion.div
                            key={category.id}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.05 }}
                            className={`flex items-center gap-4 p-4 ${index !== categories.length - 1 ? "border-b border-white/5" : ""
                                }`}
                        >
                            {/* Drag Handle */}
                            <button className="p-2 text-white/30 hover:text-white/60 transition-colors cursor-grab">
                                <GripVertical className="w-5 h-5" />
                            </button>

                            {/* Icon */}
                            <div className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center">
                                <Icon className="w-6 h-6 text-white" />
                            </div>

                            {/* Info */}
                            <div className="flex-1 min-w-0">
                                <h3 className="font-medium text-white">{category.name}</h3>
                                <p className="text-sm text-white/40">
                                    {category.productCount} ürün
                                </p>
                            </div>

                            {/* Actions */}
                            <div className="flex items-center gap-2">
                                <button
                                    onClick={() => handleDelete(category.id)}
                                    className="w-10 h-10 rounded-lg bg-white/5 flex items-center justify-center hover:bg-white/10 transition-colors"
                                >
                                    <Pencil className="w-4 h-4 text-white/60" />
                                </button>
                                <button
                                    onClick={() => handleDelete(category.id)}
                                    className="w-10 h-10 rounded-lg bg-white/5 flex items-center justify-center hover:bg-red-500/20 transition-colors group"
                                >
                                    <Trash2 className="w-4 h-4 text-white/60 group-hover:text-red-400" />
                                </button>
                            </div>
                        </motion.div>
                    );
                })}
            </motion.div>

            {/* Empty State */}
            {categories.length === 0 && (
                <div className="text-center py-16">
                    <div className="w-20 h-20 rounded-full bg-white/5 flex items-center justify-center mx-auto mb-4">
                        <Salad className="w-10 h-10 text-white/20" />
                    </div>
                    <h3 className="text-lg font-medium text-white mb-2">Henüz kategori yok</h3>
                    <p className="text-white/40 mb-6">İlk kategorinizi ekleyerek başlayın</p>
                    <Link
                        href="/admin/categories/new"
                        className="px-6 py-3 bg-white text-black rounded-xl font-medium hover:bg-neutral-100 transition-colors"
                    >
                        Kategori Ekle
                    </Link>
                </div>
            )}

            {/* Info Card */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="mt-6 p-4 bg-neutral-900 rounded-xl border border-white/5"
            >
                <p className="text-sm text-white/40">
                    💡 <strong className="text-white/60">İpucu:</strong> Kategorileri sürükleyerek sıralayabilirsiniz.
                    Sıralama menüde gösterildiği şekilde uygulanır.
                </p>
            </motion.div>
        </div>
    );
}
