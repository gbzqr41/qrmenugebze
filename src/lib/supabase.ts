import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Database Types
export interface DbBusiness {
    id: string;
    created_at: string;
    name: string;
    slug: string;
    slogan?: string;
    logo?: string;
    cover_image?: string;
    cuisine_types: string[];
    rating: number;
    review_count: number;
    address?: string;
    phone?: string;
    email?: string;
    website?: string;
    description?: string;
    social_media: {
        instagram?: string;
        facebook?: string;
        twitter?: string;
        youtube?: string;
        tiktok?: string;
        website?: string;
    };
    working_hours: Array<{
        day: string;
        open: string;
        close: string;
        isClosed: boolean;
    }>;
    slider_items: Array<{
        id: string;
        title: string;
        subtitle?: string;
        image: string;
        link?: string;
    }>;
    gallery: string[];
    theme_settings: Record<string, unknown>;
}

export interface DbCategory {
    id: string;
    created_at: string;
    business_id: string;
    name: string;
    icon: string;
    is_featured: boolean;
    sort_order: number;
}

export interface DbProduct {
    id: string;
    created_at: string;
    category_id: string;
    business_id: string;
    name: string;
    description?: string;
    price: number;
    original_price?: number;
    image?: string;
    gallery: string[];
    is_featured: boolean;
    is_new: boolean;
    tags: string[];
    variations: Array<{ id: string; name: string; priceModifier: number }>;
    extras: Array<{ id: string; name: string; price: number }>;
    allergens: string[];
    preparation_time?: string;
    calories?: number;
    sort_order: number;
}

export interface DbTag {
    id: string;
    business_id: string;
    name: string;
}

export interface DbFeedback {
    id: string;
    created_at: string;
    business_id: string;
    rating: number;
    comment?: string;
    is_read: boolean;
}
