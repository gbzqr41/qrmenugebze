"use client";

import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import {
    Plus,
    Search,
    Filter,
    Pencil,
    Trash2,
    Star,
    Package,
    Video,
} from "lucide-react";
import Link from "next/link";
import { useDataStore } from "@/context/DataStoreContext";

// Helper to detect if URL is video
function isVideoUrl(url: string): boolean {
    if (url.startsWith("data:video/")) return true;
    const lowerUrl = url.toLowerCase();
    return lowerUrl.includes(".mp4") || lowerUrl.includes(".webm") || lowerUrl.includes(".mov");
}

export default function ProductsPage() {
    const { products, categories, deleteProduct, getCategory } = useDataStore();
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

    // Filtered products
    const filteredProducts = useMemo(() => {
        let result = products;

        if (searchQuery) {
            const query = searchQuery.toLowerCase();
            result = result.filter(
                (p) =>
                    p.name.toLowerCase().includes(query) ||
                    p.description.toLowerCase().includes(query)
            );
        }

        if (selectedCategory) {
            result = result.filter((p) => p.categoryId === selectedCategory);
        }

        return result;
    }, [products, searchQuery, selectedCategory]);

    const handleDelete = (id: string) => {
        if (confirm("Bu ürünü silmek istediğinize emin misiniz?")) {
            deleteProduct(id);
        }
    };

    const getCategoryName = (categoryId: string) => {
        return getCategory(categoryId)?.name || "";
    };

    return (
        <div className="p-6 lg:p-8">
            {/* Header */}
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6"
            >
                <div>
                    <h1 className="text-2xl font-bold text-white mb-2">Ürünler</h1>
                    <p className="text-white/40">{filteredProducts.length} ürün</p>
                </div>
                <Link href="/admin/products/new">
                    <motion.button
                        whileTap={{ scale: 0.95 }}
                        className="flex items-center gap-2 px-4 py-3 bg-white text-black rounded-xl font-medium hover:bg-neutral-100 transition-colors"
                    >
                        <Plus className="w-5 h-5" />
                        Yeni Ürün
                    </motion.button>
                </Link>
            </motion.div>

            {/* Filters */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.1 }}
                className="flex flex-col sm:flex-row gap-3 mb-6"
            >
                {/* Search */}
                <div className="relative flex-1">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
                    <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Ürün ara..."
                        className="w-full pl-12 pr-4 py-3 bg-neutral-900 rounded-xl text-white placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-white/20 border border-white/5"
                    />
                </div>

                {/* Category Filter */}
                <div className="relative">
                    <select
                        value={selectedCategory || ""}
                        onChange={(e) => setSelectedCategory(e.target.value || null)}
                        className="appearance-none w-full sm:w-48 px-4 py-3 bg-neutral-900 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-white/20 border border-white/5 cursor-pointer"
                    >
                        <option value="">Tüm Kategoriler</option>
                        {categories.map((cat) => (
                            <option key={cat.id} value={cat.id}>
                                {cat.name}
                            </option>
                        ))}
                    </select>
                    <Filter className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40 pointer-events-none" />
                </div>
            </motion.div>

            {/* Product List */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="bg-neutral-900 rounded-2xl border border-white/5 overflow-hidden"
            >
                {/* Table Header */}
                <div className="hidden lg:grid grid-cols-12 gap-4 p-4 border-b border-white/10 text-sm font-medium text-white/40">
                    <div className="col-span-5">Ürün</div>
                    <div className="col-span-2">Kategori</div>
                    <div className="col-span-2">Fiyat</div>
                    <div className="col-span-2">Durum</div>
                    <div className="col-span-1"></div>
                </div>

                {/* Product Rows */}
                {filteredProducts.map((product, index) => (
                    <motion.div
                        key={product.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.03 }}
                        className={`grid grid-cols-1 lg:grid-cols-12 gap-4 p-4 items-center ${index !== filteredProducts.length - 1 ? "border-b border-white/5" : ""
                            }`}
                    >
                        {/* Product Info */}
                        <div className="lg:col-span-5 flex items-center gap-4">
                            {/* Media Preview - Support both image and video */}
                            <div className="w-14 h-14 rounded-xl overflow-hidden flex-shrink-0 bg-neutral-800 relative">
                                {isVideoUrl(product.image) ? (
                                    <>
                                        <video
                                            src={product.image}
                                            className="w-full h-full object-cover"
                                            muted
                                            playsInline
                                            loop
                                        />
                                        <div className="absolute bottom-0 right-0 bg-black/60 rounded-tl px-1">
                                            <Video className="w-3 h-3 text-white" />
                                        </div>
                                    </>
                                ) : (
                                    <img
                                        src={product.image}
                                        alt={product.name}
                                        className="w-full h-full object-cover"
                                    />
                                )}
                            </div>
                            <div className="min-w-0">
                                <h3 className="font-medium text-white truncate">{product.name}</h3>
                                <p className="text-sm text-white/40 truncate">{product.description}</p>
                            </div>
                        </div>

                        {/* Category - Mobile */}
                        <div className="lg:hidden flex items-center justify-between">
                            <span className="text-sm text-white/40">{getCategoryName(product.categoryId)}</span>
                            <span className="font-semibold text-white">₺{product.price}</span>
                        </div>

                        {/* Category - Desktop */}
                        <div className="hidden lg:block lg:col-span-2">
                            <span className="px-3 py-1 bg-white/5 rounded-full text-sm text-white/60">
                                {getCategoryName(product.categoryId)}
                            </span>
                        </div>

                        {/* Price - Desktop */}
                        <div className="hidden lg:block lg:col-span-2">
                            <p className="font-semibold text-white">₺{product.price}</p>
                            {product.originalPrice && (
                                <p className="text-sm text-white/40 line-through">
                                    ₺{product.originalPrice}
                                </p>
                            )}
                        </div>

                        {/* Status - Desktop */}
                        <div className="hidden lg:flex lg:col-span-2 items-center gap-2">
                            {product.isFeatured && (
                                <span className="flex items-center gap-1 px-2 py-1 bg-amber-500/20 text-amber-400 rounded-full text-xs">
                                    <Star className="w-3 h-3" />
                                    Öne Çıkan
                                </span>
                            )}
                            {product.isNew && (
                                <span className="px-2 py-1 bg-green-500/20 text-green-400 rounded-full text-xs">
                                    Yeni
                                </span>
                            )}
                        </div>

                        {/* Actions */}
                        <div className="lg:col-span-1 flex items-center justify-end gap-2">
                            <Link
                                href={`/admin/products/${product.id}`}
                                className="w-10 h-10 rounded-lg bg-white/5 flex items-center justify-center hover:bg-white/10 transition-colors"
                            >
                                <Pencil className="w-4 h-4 text-white/60" />
                            </Link>
                            <button
                                onClick={() => handleDelete(product.id)}
                                className="w-10 h-10 rounded-lg bg-white/5 flex items-center justify-center hover:bg-red-500/20 transition-colors group"
                            >
                                <Trash2 className="w-4 h-4 text-white/60 group-hover:text-red-400" />
                            </button>
                        </div>
                    </motion.div>
                ))}

                {/* Empty State */}
                {filteredProducts.length === 0 && (
                    <div className="text-center py-16">
                        <div className="w-20 h-20 rounded-full bg-white/5 flex items-center justify-center mx-auto mb-4">
                            <Package className="w-10 h-10 text-white/20" />
                        </div>
                        <h3 className="text-lg font-medium text-white mb-2">Ürün bulunamadı</h3>
                        <p className="text-white/40 mb-6">
                            {searchQuery || selectedCategory
                                ? "Arama kriterlerinize uygun ürün yok"
                                : "İlk ürününüzü ekleyerek başlayın"}
                        </p>
                        {!searchQuery && !selectedCategory && (
                            <Link href="/admin/products/new">
                                <button className="px-6 py-3 bg-white text-black rounded-xl font-medium hover:bg-neutral-100 transition-colors">
                                    Ürün Ekle
                                </button>
                            </Link>
                        )}
                    </div>
                )}
            </motion.div>
        </div>
    );
}
