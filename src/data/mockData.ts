// Mock Data - Antigravity QR Menu

export interface WorkingHours {
    day: string;
    open: string;
    close: string;
    isClosed: boolean;
}

export interface SliderItem {
    id: string;
    title: string;
    subtitle?: string;
    image: string;
    link?: string;
}

export interface Business {
    id: string;
    name: string;
    slug?: string; // URL slug for public menu (e.g., "mikail-cafe" -> gbzqr.com/mikail-cafe)
    logo: string;
    coverImage: string;
    cuisineTypes: string[];
    rating: number;
    reviewCount: number;
    address: string;
    phone: string;
    email: string;
    website: string;
    description: string;
    socialMedia: {
        instagram?: string;
        facebook?: string;
        twitter?: string;
        youtube?: string;
        tiktok?: string;
        website?: string;
    };
    slogan?: string;
    gallery: string[];
    workingHours: WorkingHours[];
    sliderItems?: SliderItem[];
    welcomeSettings?: {
        logoText: string;
        description: string;
        backgroundImage?: string;
        backgroundVideo?: string;
        showWelcome: boolean;
    };
}

export interface Category {
    id: string;
    name: string;
    icon: string;
    productCount: number;
    isFeatured?: boolean;
}

export interface ProductVariation {
    id: string;
    name: string;
    priceModifier: number;
}

export interface ProductExtra {
    id: string;
    name: string;
    price: number;
}

export interface Product {
    id: string;
    categoryId: string;
    name: string;
    description: string;
    price: number;
    originalPrice?: number;
    image: string;
    gallery?: string[];
    isFeatured: boolean;
    isNew: boolean;
    tags: string[];
    variations?: ProductVariation[];
    extras?: ProductExtra[];
    allergens?: string[];
    preparationTime?: string;
    calories?: number;
}

// İşletme Verileri
export const business: Business = {
    id: "1",
    name: "Antigravity Kitchen",
    slogan: "Lezzetin Yerçekimsiz Hali",
    logo: "/images/logo.png",
    coverImage: "/images/cover.jpg",
    cuisineTypes: ["Fine Dining", "Modern Türk", "Fusion"],
    rating: 4.9,
    reviewCount: 847,
    address: "Bağdat Caddesi No: 123, Kadıköy, İstanbul",
    phone: "+90 216 555 0123",
    email: "info@antigravitykitchen.com",
    website: "www.antigravitykitchen.com",
    description: "Antigravity Kitchen, modern Türk mutfağını dünya lezzetleriyle harmanlayan, premium fine dining deneyimi sunan bir restorandır.",
    socialMedia: {
        instagram: "antigravitykitchen",
        facebook: "antigravitykitchen",
        twitter: "antigravity_k",
        youtube: "antigravitykitchen",
        tiktok: "antigravitykitchen",
    },
    gallery: [
        "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800&h=600&fit=crop",
        "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=800&h=600&fit=crop",
    ],
    workingHours: [
        { day: "Pazartesi", open: "11:00", close: "23:00", isClosed: false },
        { day: "Salı", open: "11:00", close: "23:00", isClosed: false },
        { day: "Çarşamba", open: "11:00", close: "23:00", isClosed: false },
        { day: "Perşembe", open: "11:00", close: "23:00", isClosed: false },
        { day: "Cuma", open: "11:00", close: "00:00", isClosed: false },
        { day: "Cumartesi", open: "10:00", close: "00:00", isClosed: false },
        { day: "Pazar", open: "10:00", close: "22:00", isClosed: false },
    ],
    sliderItems: [
        {
            id: "1",
            title: "Şefin Özel Menüsü",
            subtitle: "Taze malzemeler ve özenle hazırlanan lezzetler ile unutulmaz bir gastronomi deneyimi yaşayın.",
            image: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=800&h=600&fit=crop",
        },
    ],
};

// Kategori Verileri - Sadece 2 kategori
export const categories: Category[] = [
    { id: "1", name: "Ana Yemekler", icon: "UtensilsCrossed", productCount: 1 },
    { id: "2", name: "İçecekler", icon: "Coffee", productCount: 1 },
];

// Ürün Verileri - Sadece 2 ürün
export const products: Product[] = [
    {
        id: "p1",
        categoryId: "1",
        name: "Signature Burger",
        description: "200gr dana köfte, aged cheddar, truffle mayo. Patates kızartması ile servis edilir.",
        price: 275,
        originalPrice: 350,
        image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=800&h=600&fit=crop",
        isFeatured: true,
        isNew: true,
        tags: ["Bestseller"],
        variations: [
            { id: "single", name: "Tek Köfte", priceModifier: 0 },
            { id: "double", name: "Çift Köfte", priceModifier: 75 },
        ],
        extras: [
            { id: "bacon", name: "Ekstra Bacon", price: 25 },
            { id: "cheese", name: "Ekstra Peynir", price: 15 },
        ],
        allergens: ["Gluten", "Süt"],
        preparationTime: "15-20 dk",
        calories: 890,
    },
    {
        id: "p2",
        categoryId: "2",
        name: "Taze Limonata",
        description: "Ev yapımı limonata, taze nane ve zencefil ile.",
        price: 55,
        image: "https://images.unsplash.com/photo-1621263764928-df1444c5e859?w=800&h=600&fit=crop",
        isFeatured: false,
        isNew: false,
        tags: ["Refreshing"],
        variations: [
            { id: "small", name: "Small (250ml)", priceModifier: 0 },
            { id: "large", name: "Large (500ml)", priceModifier: 25 },
        ],
        allergens: [],
        preparationTime: "3-5 dk",
        calories: 85,
    },
    {
        id: "p3",
        categoryId: "1",
        name: "Steak Klasik",
        description: "300gr dana bonfile, patates püresi ve mevsim sebzeleri ile",
        price: 320,
        originalPrice: 420,
        image: "https://images.unsplash.com/photo-1600891964092-4316c288032e?w=800&h=600&fit=crop",
        isFeatured: true,
        isNew: false,
        tags: ["Premium"],
        allergens: [],
        preparationTime: "25-30 dk",
        calories: 650,
    },
    {
        id: "p4",
        categoryId: "2",
        name: "Mango Smoothie",
        description: "Taze mango, muz ve portakal suyu ile hazırlanır",
        price: 65,
        originalPrice: 85,
        image: "https://images.unsplash.com/photo-1623065422902-30a2d299bbe4?w=800&h=600&fit=crop",
        isFeatured: false,
        isNew: true,
        tags: ["Vegan"],
        allergens: [],
        preparationTime: "5 dk",
        calories: 180,
    },
    {
        id: "p5",
        categoryId: "1",
        name: "Caesar Salad",
        description: "Izgara tavuk, romaine marul, parmesan ve caesar sos",
        price: 145,
        originalPrice: 185,
        image: "https://images.unsplash.com/photo-1546793665-c74683f339c1?w=800&h=600&fit=crop",
        isFeatured: false,
        isNew: false,
        tags: ["Healthy"],
        allergens: ["Süt", "Gluten"],
        preparationTime: "10-15 dk",
        calories: 380,
    },
];

// Slider Verileri
export const sliderItems: SliderItem[] = [
    {
        id: "s1",
        title: "Signature Burger",
        subtitle: "En sevilen lezzetimizi deneyin",
        image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=800&h=400&fit=crop",
        link: "#",
    },
];

// Yardımcı fonksiyonlar
export function getProductsByCategory(categoryId: string): Product[] {
    return products.filter((product) => product.categoryId === categoryId);
}

export function getFeaturedProducts(): Product[] {
    return products.filter((product) => product.isFeatured);
}

export function getDiscountedProducts(): Product[] {
    return products.filter((product) => product.originalPrice && product.originalPrice > product.price);
}

export function getProductById(id: string): Product | undefined {
    return products.find((product) => product.id === id);
}
