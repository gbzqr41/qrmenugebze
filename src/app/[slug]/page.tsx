"use client";

import { useRef, useState, useEffect, useCallback, useMemo } from "react";
import { Star } from "lucide-react";
import { useParams } from "next/navigation";
import Slider from "@/components/Slider";
import CategoryBar from "@/components/CategoryBar";
import ProductFeed from "@/components/ProductFeed";
import ProductDetailModal from "@/components/ProductDetailModal";
import BottomNav from "@/components/BottomNav";
import SearchModal from "@/components/SearchModal";
import FilterModal, { type FilterState } from "@/components/FilterModal";
import BusinessInfoModal from "@/components/BusinessInfoModal";
import FavoritesModal from "@/components/FavoritesModal";

import { type Product } from "@/data/mockData";
import { useDataStore } from "@/context/DataStoreContext";
import { useTheme } from "@/context/ThemeContext";
import { useFeedback } from "@/context/FeedbackContext";

export default function BusinessMenuPage() {
    const params = useParams();
    const slug = params.slug as string;

    const { products, categories, business, isLoading, businessNotFound } = useDataStore();
    const { theme } = useTheme();
    const { openFeedbackModal, isFeedbackModalOpen } = useFeedback();

    const [activeCategory, setActiveCategory] = useState("");
    const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isSearchOpen, setIsSearchOpen] = useState(false);
    const [isFilterOpen, setIsFilterOpen] = useState(false);
    const [isBusinessInfoOpen, setIsBusinessInfoOpen] = useState(false);
    const [isFavoritesOpen, setIsFavoritesOpen] = useState(false);

    const [filters, setFilters] = useState<FilterState>({
        categories: [],
        priceRange: { min: 0, max: 1000 },
        tags: [],
    });

    const categoryRefs = useRef<Record<string, HTMLDivElement | null>>({});
    const feedRef = useRef<HTMLDivElement>(null);
    const isScrollingRef = useRef(false);

    // ALL HOOKS MUST BE BEFORE ANY CONDITIONAL RETURNS

    // Update active category when categories load
    useEffect(() => {
        if (categories.length > 0 && !activeCategory) {
            setActiveCategory(categories[0].id);
        }
    }, [categories, activeCategory]);

    // Filtered products
    const filteredProducts = useMemo(() => {
        let result = products;

        if (filters.categories.length > 0) {
            result = result.filter((p) => filters.categories.includes(p.categoryId));
        }

        result = result.filter(
            (p) => p.price >= filters.priceRange.min && p.price <= filters.priceRange.max
        );

        if (filters.tags.length > 0) {
            result = result.filter((p) => {
                if (filters.tags.includes("Yeni") && p.isNew) return true;
                if (filters.tags.includes("İndirimli") && p.originalPrice) return true;
                return p.tags.some((tag) => filters.tags.includes(tag));
            });
        }

        return result;
    }, [products, filters]);

    // Check if filters are active
    const hasActiveFilters = useMemo(() =>
        filters.categories.length > 0 ||
        filters.tags.length > 0 ||
        filters.priceRange.min > 0 ||
        filters.priceRange.max < 1000
        , [filters]);

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
            const yOffset = -130;
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

            const scrollPosition = window.scrollY + 140;

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

    // CONDITIONAL RETURNS AFTER ALL HOOKS

    // Loading state
    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-black">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-white mx-auto mb-4"></div>
                    <p className="text-white/60">Menü yükleniyor...</p>
                </div>
            </div>
        );
    }

    // 404 state
    if (businessNotFound) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-black">
                <div className="text-center">
                    <h1 className="text-6xl font-bold text-white mb-4">404</h1>
                    <p className="text-white/60 mb-6">İşletme bulunamadı</p>
                    <p className="text-white/40 text-sm mb-8">"{slug}" adında bir işletme mevcut değil.</p>
                    <a
                        href="/login"
                        className="px-6 py-3 bg-white text-black rounded-xl font-medium hover:bg-white/90 transition-colors"
                    >
                        Ana Sayfaya Dön
                    </a>
                </div>
            </div>
        );
    }

    return (
        <>
            <main className="min-h-screen pb-[20px]" style={{ backgroundColor: theme.primaryColor }}>
                {/* Header */}
                <div
                    className="h-[60px] flex items-center justify-between px-4 sticky top-0 z-40"
                    style={{ backgroundColor: theme.headerBgColor || "rgba(0,0,0,0.95)" }}
                >
                    <span
                        className="font-bold text-lg"
                        style={{ color: theme.headerTitleColor || "#ffffff" }}
                    >
                        {business?.name || "QR Menü"}
                    </span>

                    {/* Right side buttons */}
                    <div className="flex items-center gap-[10px]">
                        {theme.feedbackEnabled !== false && (
                            <button
                                onClick={() => openFeedbackModal()}
                                className="w-[42px] h-[42px] rounded-full flex items-center justify-center hover:opacity-80 transition-opacity"
                                style={{ backgroundColor: theme.headerStarBgColor || "rgba(255,255,255,0.1)" }}
                            >
                                <Star
                                    className="w-5 h-5"
                                    style={{ color: theme.headerStarColor || "#ffffff" }}
                                />
                            </button>
                        )}
                    </div>
                </div>

                {/* Slider Section */}
                {theme.sliderEnabled !== false && <Slider />}

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
                {!isFilterOpen && !isSearchOpen && !isBusinessInfoOpen && !isFeedbackModalOpen && !isFavoritesOpen && (
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
                        onFavoritesClick={() => {
                            setIsFavoritesOpen(true);
                            setIsSearchOpen(false);
                            setIsFilterOpen(false);
                            setIsBusinessInfoOpen(false);
                        }}
                        onBusinessClick={() => {
                            setIsBusinessInfoOpen(true);
                            setIsSearchOpen(false);
                            setIsFilterOpen(false);
                        }}
                    />
                )}

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

                {/* Favorites Modal */}
                <FavoritesModal
                    isOpen={isFavoritesOpen}
                    onClose={() => setIsFavoritesOpen(false)}
                    onProductClick={(product) => {
                        setSelectedProduct(product);
                        setIsModalOpen(true);
                    }}
                />
            </main>
        </>
    );
}
