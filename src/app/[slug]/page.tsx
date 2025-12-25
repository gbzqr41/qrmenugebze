"use client";

import { useRef, useState, useEffect, useCallback, useMemo } from "react";
import { useParams, notFound } from "next/navigation";
import Slider from "@/components/Slider";
import CategoryBar from "@/components/CategoryBar";
import ProductFeed from "@/components/ProductFeed";
import ProductDetailModal from "@/components/ProductDetailModal";
import BottomNav from "@/components/BottomNav";
import SearchModal from "@/components/SearchModal";
import FilterModal, { type FilterState } from "@/components/FilterModal";
import BusinessInfoModal from "@/components/BusinessInfoModal";
import { type Product } from "@/data/mockData";
import { useDataStore } from "@/context/DataStoreContext";
import { useTheme } from "@/context/ThemeContext";
import { useFeedback } from "@/context/FeedbackContext";

export default function BusinessMenuPage() {
    const params = useParams();
    const slug = params.slug as string;

    const { products, categories, business } = useDataStore();
    const { theme } = useTheme();
    const { openFeedbackModal } = useFeedback();
    const [activeCategory, setActiveCategory] = useState(categories[0]?.id || "1");
    const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isSearchOpen, setIsSearchOpen] = useState(false);
    const [isFilterOpen, setIsFilterOpen] = useState(false);
    const [isBusinessInfoOpen, setIsBusinessInfoOpen] = useState(false);
    const [filters, setFilters] = useState<FilterState>({
        categories: [],
        priceRange: { min: 0, max: 1000 },
        tags: [],
    });

    const categoryRefs = useRef<Record<string, HTMLDivElement | null>>({});
    const feedRef = useRef<HTMLDivElement>(null);
    const isScrollingRef = useRef(false);

    // Check if the slug matches the business slug
    // For now, we'll accept any slug since we're using localStorage
    // In production, this would verify against the database
    const businessSlug = business?.slug || "";

    // If business has a slug set and it doesn't match, show 404
    // For now, we allow any slug to work for testing
    useEffect(() => {
        console.log("Business slug:", businessSlug, "URL slug:", slug);
    }, [businessSlug, slug]);

    // Filtered products
    const filteredProducts = useMemo(() => {
        let result = products;

        // Filter by categories
        if (filters.categories.length > 0) {
            result = result.filter((p) => filters.categories.includes(p.categoryId));
        }

        // Filter by price range
        result = result.filter(
            (p) => p.price >= filters.priceRange.min && p.price <= filters.priceRange.max
        );

        // Filter by tags
        if (filters.tags.length > 0) {
            result = result.filter((p) => {
                // Check for special tags
                if (filters.tags.includes("Yeni") && p.isNew) return true;
                if (filters.tags.includes("İndirimli") && p.originalPrice) return true;
                // Check product tags
                return p.tags.some((tag) => filters.tags.includes(tag));
            });
        }

        return result;
    }, [products, filters]);

    // Check if filters are active
    const hasActiveFilters =
        filters.categories.length > 0 ||
        filters.tags.length > 0 ||
        filters.priceRange.min > 0 ||
        filters.priceRange.max < 1000;

    // Ürün tıklama - modal açma
    const handleProductClick = useCallback((product: Product) => {
        setSelectedProduct(product);
        setIsModalOpen(true);
    }, []);

    // Modal kapatma
    const handleModalClose = useCallback(() => {
        setIsModalOpen(false);
        setTimeout(() => {
            setSelectedProduct(null);
        }, 300);
    }, []);

    // Search'den ürün seçme
    const handleSearchProductSelect = useCallback((product: Product) => {
        setSelectedProduct(product);
        setIsModalOpen(true);
    }, []);

    // Filter apply
    const handleFilterApply = useCallback((newFilters: FilterState) => {
        setFilters(newFilters);
    }, []);

    // Kategori tıklama - ilgili bölüme scroll
    const handleCategoryClick = useCallback((categoryId: string) => {
        setActiveCategory(categoryId);
        const element = categoryRefs.current[categoryId];
        if (element) {
            isScrollingRef.current = true;
            const yOffset = -70;
            const y = element.getBoundingClientRect().top + window.pageYOffset + yOffset;
            window.scrollTo({ top: y, behavior: "smooth" });

            setTimeout(() => {
                isScrollingRef.current = false;
            }, 1000);
        }
    }, []);

    // Scroll pozisyonuna göre aktif kategoriyi güncelle
    useEffect(() => {
        const handleScroll = () => {
            if (isScrollingRef.current) return;

            const scrollPosition = window.scrollY + 100;

            for (const category of categories) {
                const element = categoryRefs.current[category.id];
                if (element) {
                    const { offsetTop, offsetHeight } = element;
                    if (scrollPosition >= offsetTop && scrollPosition < offsetTop + offsetHeight) {
                        setActiveCategory(category.id);
                        break;
                    }
                }
            }
        };

        window.addEventListener("scroll", handleScroll, { passive: true });
        return () => window.removeEventListener("scroll", handleScroll);
    }, [categories]);

    return (
        <main className="min-h-screen pb-24" style={{ backgroundColor: theme.primaryColor }}>
            {/* Slider Section */}
            <Slider />

            {/* Category Navigation */}
            <CategoryBar
                activeCategory={activeCategory}
                onCategoryClick={handleCategoryClick}
            />

            {/* Active Filters Indicator */}
            {hasActiveFilters && (
                <div className="px-5 py-2 bg-neutral-900">
                    <div className="flex items-center justify-between">
                        <span className="text-sm text-white/60">
                            {filteredProducts.length} ürün bulundu
                        </span>
                        <button
                            onClick={() =>
                                setFilters({
                                    categories: [],
                                    priceRange: { min: 0, max: 1000 },
                                    tags: [],
                                })
                            }
                            className="text-sm text-white/60 hover:text-white transition-colors"
                        >
                            Filtreleri Temizle
                        </button>
                    </div>
                </div>
            )}

            {/* Product Feed */}
            <ProductFeed
                ref={feedRef}
                categoryRefs={categoryRefs}
                onProductClick={handleProductClick}
                filteredProducts={hasActiveFilters ? filteredProducts : undefined}
            />

            {/* Bottom Navigation */}
            <BottomNav
                onSearchClick={() => {
                    setIsSearchOpen(true);
                    setIsBusinessInfoOpen(false);
                    setIsFilterOpen(false);
                }}
                onFilterClick={() => {
                    setIsFilterOpen(true);
                    setIsBusinessInfoOpen(false);
                    setIsSearchOpen(false);
                }}
                onFeedbackClick={() => {
                    openFeedbackModal();
                    setIsBusinessInfoOpen(false);
                }}
                onBusinessClick={() => {
                    setIsBusinessInfoOpen(true);
                    setIsSearchOpen(false);
                    setIsFilterOpen(false);
                }}
            />

            {/* Product Detail Modal */}
            <ProductDetailModal
                product={selectedProduct}
                isOpen={isModalOpen}
                onClose={handleModalClose}
            />

            {/* Search Modal */}
            <SearchModal
                isOpen={isSearchOpen}
                onClose={() => setIsSearchOpen(false)}
                onProductSelect={handleSearchProductSelect}
            />

            {/* Filter Modal */}
            <FilterModal
                isOpen={isFilterOpen}
                onClose={() => setIsFilterOpen(false)}
                onApply={handleFilterApply}
                initialFilters={filters}
            />

            {/* Business Info Modal */}
            <BusinessInfoModal
                isOpen={isBusinessInfoOpen}
                onClose={() => setIsBusinessInfoOpen(false)}
            />
        </main>
    );
}
