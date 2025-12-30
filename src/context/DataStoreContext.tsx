"use client";

import { createContext, useContext, useState, useCallback, useEffect, ReactNode } from "react";
import { supabase, type DbBusiness, type DbCategory, type DbProduct, type DbTag } from "@/lib/supabase";
import {
    type Product,
    type Category,
    type Business,
} from "@/data/mockData";

export type { Product, Category, Business };

// Helper: Convert DB category to app category
function dbCategoryToCategory(db: DbCategory, productCount: number): Category {
    return {
        id: db.id,
        name: db.name,
        icon: db.icon,
        productCount,
        isFeatured: db.is_featured,
    };
}

// Helper: Convert app category to DB format
function categoryToDbCategory(cat: Omit<Category, "id" | "productCount">, businessId: string, sortOrder: number): Omit<DbCategory, "id" | "created_at"> {
    return {
        business_id: businessId,
        name: cat.name,
        icon: cat.icon || "UtensilsCrossed",
        is_featured: cat.isFeatured || false,
        sort_order: sortOrder,
    };
}

// Helper: Convert DB product to app product
function dbProductToProduct(db: DbProduct): Product {
    return {
        id: db.id,
        categoryId: db.category_id,
        name: db.name,
        description: db.description || "",
        price: db.price,
        originalPrice: db.original_price,
        image: db.image || "",
        gallery: db.gallery,
        isFeatured: db.is_featured,
        isNew: db.is_new,
        tags: db.tags,
        variations: db.variations,
        extras: db.extras,
        allergens: db.allergens,
        preparationTime: db.preparation_time,
        calories: db.calories,
    };
}

// Helper: Convert app product to DB format
function productToDbProduct(prod: Omit<Product, "id">, businessId: string, sortOrder: number): Omit<DbProduct, "id" | "created_at"> {
    return {
        business_id: businessId,
        category_id: prod.categoryId,
        name: prod.name,
        description: prod.description,
        price: prod.price,
        original_price: prod.originalPrice,
        image: prod.image,
        gallery: prod.gallery || [],
        is_featured: prod.isFeatured,
        is_new: prod.isNew,
        tags: prod.tags,
        variations: prod.variations || [],
        extras: prod.extras || [],
        allergens: prod.allergens || [],
        preparation_time: prod.preparationTime,
        calories: prod.calories,
        sort_order: sortOrder,
    };
}

// Helper: Convert DB business to app business
function dbBusinessToBusiness(db: DbBusiness): Business {
    return {
        id: db.id,
        name: db.name,
        slug: db.slug,
        slogan: db.slogan,
        logo: db.logo || "",
        coverImage: db.cover_image || "",
        cuisineTypes: db.cuisine_types,
        rating: db.rating,
        reviewCount: db.review_count,
        address: db.address || "",
        phone: db.phone || "",
        email: db.email || "",
        website: db.website || "",
        description: db.description || "",
        socialMedia: db.social_media,
        gallery: db.gallery,
        workingHours: db.working_hours,
        sliderItems: db.slider_items,
    };
}

interface DataStoreContextType {
    // Products
    products: Product[];
    addProduct: (product: Omit<Product, "id">) => Promise<Product>;
    updateProduct: (id: string, updates: Partial<Product>) => Promise<void>;
    deleteProduct: (id: string) => Promise<void>;
    getProduct: (id: string) => Product | undefined;
    reorderProducts: (categoryId: string, productIds: string[]) => Promise<void>;

    // Categories
    categories: Category[];
    addCategory: (category: Omit<Category, "id" | "productCount">) => Promise<Category>;
    updateCategory: (id: string, updates: Partial<Category>) => Promise<void>;
    deleteCategory: (id: string) => Promise<void>;
    getCategory: (id: string) => Category | undefined;
    reorderCategories: (categoryIds: string[]) => Promise<void>;

    // Business
    business: Business;
    updateBusiness: (updates: Partial<Business & { slogan?: string }>) => Promise<void>;

    // Stats
    getStats: () => {
        totalProducts: number;
        totalCategories: number;
        featuredProducts: number;
        newProducts: number;
    };

    // Tags
    tags: string[];
    addTag: (tag: string) => Promise<void>;
    removeTag: (tag: string) => Promise<void>;

    // Clear all data
    clearAllMenuData: () => Promise<void>;

    // Loading state
    isLoading: boolean;

    // Business ID
    businessId: string | null;

    // Business not found
    businessNotFound: boolean;

    // Refresh data
    refreshData: () => Promise<void>;

    // Set business by slug
    setBusinessSlug: (slug: string) => void;
}

const DataStoreContext = createContext<DataStoreContextType | null>(null);

// Default empty business
const emptyBusiness: Business = {
    id: "",
    name: "",
    slug: "",
    slogan: "",
    logo: "",
    coverImage: "",
    cuisineTypes: [],
    rating: 5,
    reviewCount: 0,
    address: "",
    phone: "",
    email: "",
    website: "",
    description: "",
    socialMedia: {},
    gallery: [],
    workingHours: [],
    sliderItems: [],
};

export function DataStoreProvider({ children, initialSlug }: { children: ReactNode; initialSlug?: string }) {
    const [isLoading, setIsLoading] = useState(true);
    const [businessNotFound, setBusinessNotFound] = useState(false);
    const [businessSlug, setBusinessSlug] = useState<string>(initialSlug || "");
    const [businessId, setBusinessId] = useState<string | null>(null);
    const [products, setProducts] = useState<Product[]>([]);
    const [categories, setCategories] = useState<Category[]>([]);
    const [business, setBusiness] = useState<Business>(emptyBusiness);
    const [tags, setTags] = useState<string[]>([]);

    // Fetch data for specific business slug
    const fetchData = useCallback(async () => {
        if (!businessSlug) {
            setIsLoading(false);
            return;
        }

        setIsLoading(true);
        setBusinessNotFound(false);

        try {
            // 1. Get business by slug
            const { data: businessData, error: businessError } = await supabase
                .from("businesses")
                .select("*")
                .eq("slug", businessSlug)
                .single();

            if (businessError || !businessData) {
                console.log("Business not found for slug:", businessSlug);
                setBusinessNotFound(true);
                setIsLoading(false);
                return;
            }

            setBusinessId(businessData.id);
            setBusiness(dbBusinessToBusiness(businessData as DbBusiness));

            // 2. Fetch categories
            const { data: categoriesData } = await supabase
                .from("categories")
                .select("*")
                .eq("business_id", businessData.id)
                .order("sort_order");

            // 3. Fetch products
            const { data: productsData } = await supabase
                .from("products")
                .select("*")
                .eq("business_id", businessData.id)
                .order("sort_order");

            // 4. Fetch tags
            const { data: tagsData } = await supabase
                .from("tags")
                .select("*")
                .eq("business_id", businessData.id);

            // Calculate product counts per category
            const productCounts = new Map<string, number>();
            (productsData || []).forEach((p: DbProduct) => {
                productCounts.set(p.category_id, (productCounts.get(p.category_id) || 0) + 1);
            });

            setCategories((categoriesData || []).map((c: DbCategory) =>
                dbCategoryToCategory(c, productCounts.get(c.id) || 0)
            ));
            setProducts((productsData || []).map(dbProductToProduct));
            setTags((tagsData || []).map((t: DbTag) => t.name));

        } catch (error) {
            console.error("Supabase fetch error:", error);
            setBusinessNotFound(true);
        }

        setIsLoading(false);
    }, [businessSlug]);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    // Products CRUD
    const addProduct = useCallback(async (productData: Omit<Product, "id">): Promise<Product> => {
        if (!businessId) throw new Error("No business ID");

        const { data, error } = await supabase
            .from("products")
            .insert(productToDbProduct(productData, businessId, products.length))
            .select()
            .single();

        if (error) throw error;

        const newProduct = dbProductToProduct(data);
        setProducts(prev => [...prev, newProduct]);
        return newProduct;
    }, [businessId, products.length]);

    const updateProduct = useCallback(async (id: string, updates: Partial<Product>) => {
        const dbUpdates: Record<string, unknown> = {};
        if (updates.name !== undefined) dbUpdates.name = updates.name;
        if (updates.description !== undefined) dbUpdates.description = updates.description;
        if (updates.price !== undefined) dbUpdates.price = updates.price;
        if (updates.originalPrice !== undefined) dbUpdates.original_price = updates.originalPrice;
        if (updates.image !== undefined) dbUpdates.image = updates.image;
        if (updates.gallery !== undefined) dbUpdates.gallery = updates.gallery;
        if (updates.isFeatured !== undefined) dbUpdates.is_featured = updates.isFeatured;
        if (updates.isNew !== undefined) dbUpdates.is_new = updates.isNew;
        if (updates.tags !== undefined) dbUpdates.tags = updates.tags;
        if (updates.categoryId !== undefined) dbUpdates.category_id = updates.categoryId;
        if (updates.variations !== undefined) dbUpdates.variations = updates.variations;
        if (updates.extras !== undefined) dbUpdates.extras = updates.extras;
        if (updates.allergens !== undefined) dbUpdates.allergens = updates.allergens;
        if (updates.preparationTime !== undefined) dbUpdates.preparation_time = updates.preparationTime;
        if (updates.calories !== undefined) dbUpdates.calories = updates.calories;

        const { error } = await supabase
            .from("products")
            .update(dbUpdates)
            .eq("id", id);

        if (error) throw error;

        setProducts(prev => prev.map(p => p.id === id ? { ...p, ...updates } : p));
    }, []);

    const deleteProduct = useCallback(async (id: string) => {
        const { error } = await supabase
            .from("products")
            .delete()
            .eq("id", id);

        if (error) throw error;

        setProducts(prev => prev.filter(p => p.id !== id));
    }, []);

    const getProduct = useCallback((id: string) => {
        return products.find(p => p.id === id);
    }, [products]);

    const reorderProducts = useCallback(async (categoryId: string, productIds: string[]) => {
        for (let i = 0; i < productIds.length; i++) {
            await supabase
                .from("products")
                .update({ sort_order: i })
                .eq("id", productIds[i]);
        }

        setProducts(prev => {
            const otherProducts = prev.filter(p => p.categoryId !== categoryId);
            const categoryProducts = prev.filter(p => p.categoryId === categoryId);
            const reordered = productIds.map(id => categoryProducts.find(p => p.id === id)!).filter(Boolean);
            return [...otherProducts, ...reordered];
        });
    }, []);

    // Categories CRUD
    const addCategory = useCallback(async (categoryData: Omit<Category, "id" | "productCount">): Promise<Category> => {
        if (!businessId) throw new Error("No business ID");

        const { data, error } = await supabase
            .from("categories")
            .insert(categoryToDbCategory(categoryData, businessId, categories.length))
            .select()
            .single();

        if (error) throw error;

        const newCategory = dbCategoryToCategory(data, 0);
        setCategories(prev => [...prev, newCategory]);
        return newCategory;
    }, [businessId, categories.length]);

    const updateCategory = useCallback(async (id: string, updates: Partial<Category>) => {
        const dbUpdates: Record<string, unknown> = {};
        if (updates.name !== undefined) dbUpdates.name = updates.name;
        if (updates.icon !== undefined) dbUpdates.icon = updates.icon;
        if (updates.isFeatured !== undefined) dbUpdates.is_featured = updates.isFeatured;

        const { error } = await supabase
            .from("categories")
            .update(dbUpdates)
            .eq("id", id);

        if (error) throw error;

        setCategories(prev => prev.map(c => c.id === id ? { ...c, ...updates } : c));
    }, []);

    const deleteCategory = useCallback(async (id: string) => {
        const { error } = await supabase
            .from("categories")
            .delete()
            .eq("id", id);

        if (error) throw error;

        setCategories(prev => prev.filter(c => c.id !== id));
    }, []);

    const getCategory = useCallback((id: string) => {
        return categories.find(c => c.id === id);
    }, [categories]);

    const reorderCategories = useCallback(async (categoryIds: string[]) => {
        for (let i = 0; i < categoryIds.length; i++) {
            await supabase
                .from("categories")
                .update({ sort_order: i })
                .eq("id", categoryIds[i]);
        }

        setCategories(prev => {
            return categoryIds.map(id => prev.find(c => c.id === id)!).filter(Boolean);
        });
    }, []);

    // Business Update
    const updateBusiness = useCallback(async (updates: Partial<Business>) => {
        if (!businessId) return;

        const dbUpdates: Record<string, unknown> = {};
        if (updates.name !== undefined) dbUpdates.name = updates.name;
        if (updates.slug !== undefined) dbUpdates.slug = updates.slug;
        if (updates.slogan !== undefined) dbUpdates.slogan = updates.slogan;
        if (updates.logo !== undefined) dbUpdates.logo = updates.logo;
        if (updates.coverImage !== undefined) dbUpdates.cover_image = updates.coverImage;
        if (updates.cuisineTypes !== undefined) dbUpdates.cuisine_types = updates.cuisineTypes;
        if (updates.rating !== undefined) dbUpdates.rating = updates.rating;
        if (updates.reviewCount !== undefined) dbUpdates.review_count = updates.reviewCount;
        if (updates.address !== undefined) dbUpdates.address = updates.address;
        if (updates.phone !== undefined) dbUpdates.phone = updates.phone;
        if (updates.email !== undefined) dbUpdates.email = updates.email;
        if (updates.website !== undefined) dbUpdates.website = updates.website;
        if (updates.description !== undefined) dbUpdates.description = updates.description;
        if (updates.socialMedia !== undefined) dbUpdates.social_media = updates.socialMedia;
        if (updates.gallery !== undefined) dbUpdates.gallery = updates.gallery;
        if (updates.workingHours !== undefined) dbUpdates.working_hours = updates.workingHours;
        if (updates.sliderItems !== undefined) dbUpdates.slider_items = updates.sliderItems;

        const { error } = await supabase
            .from("businesses")
            .update(dbUpdates)
            .eq("id", businessId);

        if (error) throw error;

        // Update localStorage if name or slug changed (keeps session in sync)
        if (typeof window !== "undefined") {
            if (updates.name !== undefined) {
                localStorage.setItem("currentBusinessName", updates.name);
            }
            if (updates.slug !== undefined) {
                localStorage.setItem("currentBusinessSlug", updates.slug);
                setBusinessSlug(updates.slug);
            }
        }

        setBusiness(prev => ({ ...prev, ...updates }));
    }, [businessId]);

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
    const addTag = useCallback(async (tag: string) => {
        if (!businessId || tags.includes(tag)) return;

        const { error } = await supabase
            .from("tags")
            .insert({ business_id: businessId, name: tag });

        if (error) throw error;

        setTags(prev => [...prev, tag]);
    }, [businessId, tags]);

    const removeTag = useCallback(async (tag: string) => {
        if (!businessId) return;

        const { error } = await supabase
            .from("tags")
            .delete()
            .eq("business_id", businessId)
            .eq("name", tag);

        if (error) throw error;

        setTags(prev => prev.filter(t => t !== tag));
    }, [businessId]);

    // Clear all menu data
    const clearAllMenuData = useCallback(async () => {
        if (!businessId) return;

        await supabase.from("products").delete().eq("business_id", businessId);
        await supabase.from("categories").delete().eq("business_id", businessId);

        setProducts([]);
        setCategories([]);
    }, [businessId]);

    return (
        <DataStoreContext.Provider value={{
            products, addProduct, updateProduct, deleteProduct, getProduct, reorderProducts,
            categories, addCategory, updateCategory, deleteCategory, getCategory, reorderCategories,
            business, updateBusiness, getStats, isLoading, businessId, businessNotFound,
            tags, addTag, removeTag,
            clearAllMenuData,
            refreshData: fetchData,
            setBusinessSlug: setBusinessSlug,
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
