"use client";

import { forwardRef, useMemo } from "react";
import { motion } from "framer-motion";
import {
    Salad,
    UtensilsCrossed,
    Pizza,
    Beef,
    Soup,
    Cake,
    Coffee,
    type LucideIcon,
} from "lucide-react";
import { type Product } from "@/data/mockData";
import { useDataStore } from "@/context/DataStoreContext";
import { useTheme } from "@/context/ThemeContext";

import ProductCard from "./ProductCard";

interface ProductFeedProps {
    categoryRefs: React.MutableRefObject<Record<string, HTMLDivElement | null>>;
    onProductClick: (product: Product) => void;
    filteredProducts?: Product[];
}

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
            : categories.filter((cat) => !cat.isFeatured);

        // Featured Categories Sections Logic
        const featuredCategorySections = useMemo(() => {
            // If filtering is enabled, skip featured sections
            if (filteredProducts) return [];

            // Get featured categories
            const featured = categories.filter((c) => c.isFeatured);

            // Create sections mapping loop
            return featured.map(cat => ({
                category: cat,
                products: products.filter(p => p.categoryId === cat.id)
            })).filter(section => section.products.length > 0);
        }, [products, categories, filteredProducts]);

        return (
            <div ref={ref} className="pb-20" style={{ backgroundColor: theme.primaryColor }}>

                {/* Featured Sections (Horizontal Scroll per Featured Category) */}
                {featuredCategorySections.map((section) => (
                    <div key={`featured-section-${section.category.id}`} className="pt-6 px-5 mb-2">
                        <div className="flex items-center gap-2 mb-4">
                            <h2
                                className="text-xl font-bold"
                                style={{ color: theme.featuredTitleColor || "#ffffff" }}
                            >
                                {section.category.name}
                            </h2>
                        </div>

                        {/* Horizontal Scroll Container */}
                        <div
                            className="flex overflow-x-auto pb-8 -mx-5 px-5 scrollbar-hide"
                            style={{ gap: `${cardGap}px` }}
                        >
                            {section.products.map((product, index) => (
                                <div
                                    key={`featured-${product.id}`}
                                    className="shrink-0 w-[200px]" // Fixed width
                                >
                                    <ProductCard
                                        product={product}
                                        index={index}
                                        onClick={() => onProductClick(product)}
                                        hideDescription={true} // Hide description as requested
                                        isFeaturedSection={true}
                                    />
                                </div>
                            ))}
                        </div>
                    </div>
                ))}

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
                                    className="pt-3"
                                >
                                    {/* Category Title */}
                                    <motion.div
                                        initial={{ opacity: 0, x: -20 }}
                                        whileInView={{ opacity: 1, x: 0 }}
                                        viewport={{ once: true }}
                                        transition={{ duration: 0.4 }}
                                        className="mb-4"
                                    >
                                        <h2
                                            className="text-xl font-bold"
                                            style={{ color: theme.categoryTitleColor || "#ffffff" }}
                                        >
                                            {category.name}
                                        </h2>
                                        <p
                                            className="text-sm mt-1"
                                            style={{ color: theme.productCountColor || "rgba(255,255,255,0.4)" }}
                                        >
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
