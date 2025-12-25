"use client";

import { forwardRef } from "react";
import { motion } from "framer-motion";
import { Percent } from "lucide-react";
import { type Product } from "@/data/mockData";
import { useDataStore } from "@/context/DataStoreContext";
import { useTheme } from "@/context/ThemeContext";
import ProductCard from "./ProductCard";

interface ProductFeedProps {
    categoryRefs: React.MutableRefObject<Record<string, HTMLDivElement | null>>;
    onProductClick: (product: Product) => void;
    filteredProducts?: Product[];
}

const ProductFeed = forwardRef<HTMLDivElement, ProductFeedProps>(
    ({ categoryRefs, onProductClick, filteredProducts }, ref) => {
        const { products, categories } = useDataStore();
        const { theme } = useTheme();
        const cardGap = theme.cardGap || 16;

        // Get discounted products
        const discountedProducts = products.filter(
            (p) => p.originalPrice && p.originalPrice > p.price
        );

        // If filtered products provided, group them by category
        const getProducts = (categoryId: string): Product[] => {
            if (filteredProducts) {
                return filteredProducts.filter((p) => p.categoryId === categoryId);
            }
            return products.filter((p) => p.categoryId === categoryId);
        };

        // Determine which categories to show
        const categoriesToShow = filteredProducts
            ? categories.filter((cat) =>
                filteredProducts.some((p) => p.categoryId === cat.id)
            )
            : categories;

        return (
            <div ref={ref} className="pb-20" style={{ backgroundColor: theme.primaryColor }}>

                {/* Discounted Products Section - Horizontal Scroll */}
                {!filteredProducts && discountedProducts.length > 0 && (
                    <div className="pt-6 px-5">
                        {/* Main Container Card */}
                        <div
                            className="rounded-2xl overflow-hidden"
                            style={{ backgroundColor: theme.cardColor }}
                        >
                            {/* Section Title */}
                            <div className="p-4 pb-0">
                                <div className="flex items-center gap-2">
                                    <div className="w-8 h-8 rounded-full bg-red-500 flex items-center justify-center">
                                        <Percent className="w-4 h-4 text-white" />
                                    </div>
                                    <div>
                                        <h2 className="text-lg font-bold text-white">İndirimli Ürünler</h2>
                                        <p className="text-xs text-white/40">{discountedProducts.length} ürün</p>
                                    </div>
                                </div>
                            </div>

                            {/* Horizontal Scroll Container */}
                            <div
                                className="flex gap-3 overflow-x-auto p-4 scrollbar-hide"
                                style={{
                                    scrollSnapType: "x mandatory",
                                    WebkitOverflowScrolling: "touch",
                                }}
                            >
                                {discountedProducts.map((product) => {
                                    const discountPercentage = Math.round(
                                        ((product.originalPrice! - product.price) / product.originalPrice!) * 100
                                    );

                                    return (
                                        <div
                                            key={product.id}
                                            onClick={() => onProductClick(product)}
                                            className="shrink-0 cursor-pointer overflow-hidden"
                                            style={{
                                                width: "150px",
                                                scrollSnapAlign: "start",
                                                backgroundColor: "rgba(255,255,255,0.05)",
                                                borderRadius: "12px",
                                            }}
                                        >
                                            {/* Image */}
                                            <div
                                                className="relative w-full h-24 bg-cover bg-center"
                                                style={{ backgroundImage: `url(${product.image})` }}
                                            >
                                                {/* Discount Badge */}
                                                <div className="absolute top-2 right-2 px-1.5 py-0.5 bg-red-500 text-white text-[10px] font-bold rounded">
                                                    %{discountPercentage}
                                                </div>
                                            </div>

                                            {/* Content */}
                                            <div className="p-2">
                                                <h3
                                                    className="font-semibold text-xs mb-1 truncate"
                                                    style={{ color: theme.textColor }}
                                                >
                                                    {product.name}
                                                </h3>
                                                <div className="flex items-center gap-1">
                                                    <span
                                                        className="font-bold text-xs"
                                                        style={{ color: theme.accentColor }}
                                                    >
                                                        {product.price} TL
                                                    </span>
                                                    <span
                                                        className="text-[10px] line-through opacity-50"
                                                        style={{ color: theme.textColor }}
                                                    >
                                                        {product.originalPrice} TL
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    </div>
                )}

                {/* Regular Categories */}
                <div className="px-5">
                    {categoriesToShow.length === 0 ? (
                        <div className="py-16 text-center">
                            <p className="text-white/40">Ürün bulunamadı</p>
                        </div>
                    ) : (
                        categoriesToShow.map((category) => {
                            const categoryProducts = getProducts(category.id);

                            if (categoryProducts.length === 0) return null;

                            return (
                                <div
                                    key={category.id}
                                    ref={(el) => {
                                        categoryRefs.current[category.id] = el;
                                    }}
                                    className="pt-6"
                                >
                                    {/* Category Title */}
                                    <motion.div
                                        initial={{ opacity: 0, x: -20 }}
                                        whileInView={{ opacity: 1, x: 0 }}
                                        viewport={{ once: true }}
                                        transition={{ duration: 0.4 }}
                                        className="mb-4"
                                    >
                                        <h2 className="text-xl font-bold text-white">{category.name}</h2>
                                        <p className="text-sm text-white/40 mt-1">
                                            {categoryProducts.length} ürün
                                        </p>
                                    </motion.div>

                                    {/* Product Grid */}
                                    <div
                                        className="grid grid-cols-1"
                                        style={{ gap: `${cardGap}px` }}
                                    >
                                        {categoryProducts.map((product, index) => (
                                            <ProductCard
                                                key={product.id}
                                                product={product}
                                                index={index}
                                                onClick={() => onProductClick(product)}
                                            />
                                        ))}
                                    </div>
                                </div>
                            );
                        })
                    )}
                </div>
            </div>
        );
    }
);

ProductFeed.displayName = "ProductFeed";

export default ProductFeed;
