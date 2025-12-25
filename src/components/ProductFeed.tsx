"use client";

import { forwardRef } from "react";
import { motion } from "framer-motion";
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
            <div ref={ref} className="px-5 pb-20" style={{ backgroundColor: theme.primaryColor }}>
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
                                    className="grid grid-cols-2"
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
        );
    }
);

ProductFeed.displayName = "ProductFeed";

export default ProductFeed;
