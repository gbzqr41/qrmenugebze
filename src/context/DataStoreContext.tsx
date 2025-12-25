"use client";

import { createContext, useContext, useState, useCallback, useEffect, ReactNode } from "react";
import {
    products as initialProducts,
    categories as initialCategories,
    business as initialBusiness,
    type Product,
    type Category,
    type Business,
} from "@/data/mockData";

export type { Product, Category, Business };

// LocalStorage keys
const STORAGE_KEYS = {
    PRODUCTS: "qrmenu_products",
    CATEGORIES: "qrmenu_categories",
    BUSINESS: "qrmenu_business",
    TAGS: "qrmenu_tags",
};

// Helper functions for localStorage
function loadFromStorage<T>(key: string, fallback: T): T {
    if (typeof window === "undefined") return fallback;
    try {
        const stored = localStorage.getItem(key);
        if (stored) {
            return JSON.parse(stored);
        }
    } catch (e) {
        console.error("Error loading from localStorage:", e);
    }
    return fallback;
}

function saveToStorage<T>(key: string, data: T): boolean {
    if (typeof window === "undefined") return false;
    try {
        const jsonData = JSON.stringify(data);
        console.log(`[DataStore] Saving to ${key}, data size: ${(jsonData.length / 1024).toFixed(2)}KB`);
        localStorage.setItem(key, jsonData);
        console.log(`[DataStore] Successfully saved to ${key}`);
        return true;
    } catch (e) {
        console.error(`[DataStore] Error saving to ${key}:`, e);
        // Check if it's a quota exceeded error
        if (e instanceof Error && (e.name === "QuotaExceededError" || e.message.includes("quota"))) {
            console.error(`[DataStore] LocalStorage QUOTA EXCEEDED!`);
            alert("⚠️ Depolama alanı dolu!\n\nVideo veya resim dosyaları çok büyük. Lütfen daha küçük dosyalar kullanın veya mevcut medyaları silin.\n\nMax dosya boyutu: Resim 2MB, Video 5MB önerilir.");
        }
        return false;
    }
}

interface DataStoreContextType {
    // Products
    products: Product[];
    addProduct: (product: Omit<Product, "id">) => Product;
    updateProduct: (id: string, updates: Partial<Product>) => void;
    deleteProduct: (id: string) => void;
    getProduct: (id: string) => Product | undefined;
    reorderProducts: (categoryId: string, productIds: string[]) => void;

    // Categories
    categories: Category[];
    addCategory: (category: Omit<Category, "id" | "productCount">) => Category;
    updateCategory: (id: string, updates: Partial<Category>) => void;
    deleteCategory: (id: string) => void;
    getCategory: (id: string) => Category | undefined;
    reorderCategories: (categoryIds: string[]) => void;

    // Business
    business: Business;
    updateBusiness: (updates: Partial<Business & { slogan?: string }>) => void; // Modified to include slogan in updates

    // Stats
    getStats: () => {
        totalProducts: number;
        totalCategories: number;
        featuredProducts: number;
        newProducts: number;
    };

    // Tags
    tags: string[];
    addTag: (tag: string) => void;
    removeTag: (tag: string) => void;

    // Loading state
    isLoading: boolean;

    // Reset to initial data
    resetData: () => void;
}

const DataStoreContext = createContext<DataStoreContextType | null>(null);

export function DataStoreProvider({ children }: { children: ReactNode }) {
    const [isInitialized, setIsInitialized] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [products, setProducts] = useState<Product[]>([]);
    const [categories, setCategories] = useState<Category[]>([]);
    const [business, setBusiness] = useState<Business>(initialBusiness);
    const [tags, setTags] = useState<string[]>([]);

    // Load data from localStorage on mount
    useEffect(() => {
        const storedProducts = loadFromStorage<Product[]>(STORAGE_KEYS.PRODUCTS, initialProducts);
        const storedCategories = loadFromStorage<Category[]>(STORAGE_KEYS.CATEGORIES, initialCategories);
        const storedBusiness = loadFromStorage<Business>(STORAGE_KEYS.BUSINESS, initialBusiness);

        setProducts(storedProducts);
        setCategories(storedCategories);
        setBusiness(storedBusiness);

        // Load tags (if empty, extract from existing products or use defaults)
        const storedTags = loadFromStorage<string[]>(STORAGE_KEYS.TAGS, []);
        if (storedTags.length === 0) {
            // Default tags
            const defaults = ["Yeni", "İndirimli", "Vegan", "Acılı", "Şefin Spesiyali", "Glutensiz", "Popüler", "Çocuk Menüsü", "Organik", "Ev Yapımı", "Hafif"];
            setTags(defaults);
        } else {
            setTags(storedTags);
        }

        setIsInitialized(true);
        setIsLoading(false);
    }, []);

    // Save products to localStorage when changed
    useEffect(() => {
        if (isInitialized) {
            saveToStorage(STORAGE_KEYS.PRODUCTS, products);
        }
    }, [products, isInitialized]);

    // Save categories to localStorage when changed
    useEffect(() => {
        if (isInitialized) {
            saveToStorage(STORAGE_KEYS.CATEGORIES, categories);
        }
    }, [categories, isInitialized]);

    // Save business to localStorage when changed
    useEffect(() => {
        if (isInitialized) {
            saveToStorage(STORAGE_KEYS.BUSINESS, business);
        }
    }, [business, isInitialized]);

    // Save tags to localStorage
    useEffect(() => {
        if (isInitialized) {
            saveToStorage(STORAGE_KEYS.TAGS, tags);
        }
    }, [tags, isInitialized]);

    // Products CRUD
    const addProduct = useCallback((productData: Omit<Product, "id">): Product => {
        console.log("[DataStore] addProduct called with:", JSON.stringify(productData).substring(0, 300) + "...");

        const newId = `p${Date.now()}`;
        const newProduct: Product = {
            ...productData,
            id: newId,
        };

        setProducts(prev => [...prev, newProduct]);
        return newProduct;
    }, []);

    const updateProduct = useCallback((id: string, updates: Partial<Product>) => {
        setProducts(prev => prev.map(p => p.id === id ? { ...p, ...updates } : p));
    }, []);

    const deleteProduct = useCallback((id: string) => {
        console.log("[DataStore] deleteProduct called for id:", id);

        // Find product first to update category count
        setProducts(prevProducts => {
            const productToDelete = prevProducts.find(p => p.id === id);

            if (productToDelete) {
                // Update category product count
                setCategories(prevCategories => prevCategories.map(cat =>
                    cat.id === productToDelete.categoryId
                        ? { ...cat, productCount: Math.max(0, cat.productCount - 1) }
                        : cat
                ));
            }

            // Return filtered products
            return prevProducts.filter(p => p.id !== id);
        });
    }, []);

    const getProduct = useCallback((id: string) => {
        return products.find(p => p.id === id);
    }, [products]);

    const reorderProducts = useCallback((categoryId: string, productIds: string[]) => {
        setProducts(prev => {
            const otherProducts = prev.filter(p => p.categoryId !== categoryId);
            const categoryProducts = prev.filter(p => p.categoryId === categoryId);
            const reordered = productIds.map(id => categoryProducts.find(p => p.id === id)!).filter(Boolean);
            return [...otherProducts, ...reordered];
        });
    }, []);

    // Categories CRUD
    const addCategory = useCallback((categoryData: Omit<Category, "id" | "productCount">): Category => {
        const newId = `cat${Date.now()}`;
        const newCategory: Category = {
            ...categoryData,
            id: newId,
            productCount: 0,
        };
        setCategories(prev => [...prev, newCategory]);
        return newCategory;
    }, []);

    const updateCategory = useCallback((id: string, updates: Partial<Category>) => {
        setCategories(prev => prev.map(c => c.id === id ? { ...c, ...updates } : c));
    }, []);

    const deleteCategory = useCallback((id: string) => {
        setCategories(prev => prev.filter(c => c.id !== id));
        // Soft delete: keep products but they won't show without category
    }, []);

    const getCategory = useCallback((id: string) => {
        return categories.find(c => c.id === id);
    }, [categories]);

    const reorderCategories = useCallback((categoryIds: string[]) => {
        setCategories(prev => {
            return categoryIds.map(id => prev.find(c => c.id === id)!).filter(Boolean);
        });
    }, []);

    // Business Update
    const updateBusiness = useCallback((updates: Partial<Business>) => {
        setBusiness(prev => ({ ...prev, ...updates }));
    }, []);

    // Stats
    const getStats = useCallback(() => {
        return {
            totalProducts: products.length,
            totalCategories: categories.length,
            featuredProducts: products.filter(p => p.isFeatured).length,
            newProducts: products.filter(p => p.isNew).length,
        };
    }, [products, categories]);

    // Tag Management
    const addTag = useCallback((tag: string) => {
        setTags(prev => {
            if (prev.includes(tag)) return prev;
            return [...prev, tag];
        });
    }, []);

    const removeTag = useCallback((tag: string) => {
        setTags(prev => prev.filter(t => t !== tag));
    }, []);

    // Reset Data
    const resetData = useCallback(() => {
        if (confirm("Tüm verileri sıfırlamak istediğinize emin misiniz?")) {
            localStorage.clear();
            window.location.reload();
        }
    }, []);

    return (
        <DataStoreContext.Provider value={{
            products, addProduct, updateProduct, deleteProduct, getProduct, reorderProducts,
            categories, addCategory, updateCategory, deleteCategory, getCategory, reorderCategories,
            business, updateBusiness, getStats, isLoading, resetData,
            // Tags
            tags, addTag, removeTag
        }}>
            {children}
        </DataStoreContext.Provider>
    );
}

export function useDataStore() {
    const context = useContext(DataStoreContext);
    if (!context) {
        throw new Error("useDataStore must be used within a DataStoreProvider");
    }
    return context;
}
