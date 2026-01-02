"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Trash2, Edit, Store, ExternalLink, Search, X, Check, Phone, Lock, LogOut, Eye, EyeOff } from "lucide-react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

interface BusinessItem {
    id: string;
    name: string;
    slug: string;
    phone?: string;
    created_at: string;
}

export default function SuperAdminPage() {
    const router = useRouter();
    const [isAuthorized, setIsAuthorized] = useState<boolean | null>(null);
    const [businesses, setBusinesses] = useState<BusinessItem[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingBusiness, setEditingBusiness] = useState<BusinessItem | null>(null);
    const [formData, setFormData] = useState({ name: "", slug: "", phone: "", password: "" });
    const [showPassword, setShowPassword] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

    // Account settings states
    const [isAccountModalOpen, setIsAccountModalOpen] = useState(false);
    const [accountData, setAccountData] = useState({ phone: "", currentPassword: "", newPassword: "" });
    const [isAccountSaving, setIsAccountSaving] = useState(false);
    const [accountError, setAccountError] = useState("");
    const [accountSuccess, setAccountSuccess] = useState(false);

    // Check if super admin
    useEffect(() => {
        const isSuperAdmin = localStorage.getItem("isSuperAdmin") === "true";
        const isLoggedIn = localStorage.getItem("isAdminLoggedIn") === "true";

        if (!isLoggedIn || !isSuperAdmin) {
            router.push("/login");
        } else {
            setIsAuthorized(true);
        }
    }, [router]);

    // Fetch all businesses
    useEffect(() => {
        if (isAuthorized) {
            fetchBusinesses();
        }
    }, [isAuthorized]);

    const fetchBusinesses = async () => {
        setIsLoading(true);
        const { data, error } = await supabase
            .from("businesses")
            .select("id, name, slug, phone, created_at")
            .order("created_at", { ascending: false });

        if (error) {
            console.error("Error fetching businesses:", error);
        } else {
            setBusinesses(data || []);
        }
        setIsLoading(false);
    };

    // Generate slug from name
    const generateSlug = (name: string) => {
        return name
            .toLowerCase()
            .replace(/ğ/g, "g")
            .replace(/ü/g, "u")
            .replace(/ş/g, "s")
            .replace(/ı/g, "i")
            .replace(/ö/g, "o")
            .replace(/ç/g, "c")
            .replace(/[^a-z0-9]+/g, "-")
            .replace(/^-|-$/g, "");
    };

    // Handle name change and auto-generate slug
    const handleNameChange = (name: string) => {
        setFormData({
            ...formData,
            name,
            slug: editingBusiness ? formData.slug : generateSlug(name),
        });
    };

    // Create or update business
    const handleSave = async () => {
        if (!formData.name.trim() || !formData.slug.trim() || isSaving) return;

        // For new business, phone and password are required
        if (!editingBusiness && (!formData.phone.trim() || !formData.password.trim())) {
            alert("Telefon ve şifre zorunludur!");
            return;
        }

        setIsSaving(true);

        try {
            if (editingBusiness) {
                // Update existing - phone and password are optional
                const updateData: Record<string, string> = { name: formData.name, slug: formData.slug };
                if (formData.phone.trim()) updateData.phone = formData.phone;
                if (formData.password.trim()) updateData.password = formData.password;

                const { error } = await supabase
                    .from("businesses")
                    .update(updateData)
                    .eq("id", editingBusiness.id);

                if (error) throw error;
            } else {
                // Create new business with phone and password
                const { error } = await supabase.from("businesses").insert({
                    name: formData.name,
                    slug: formData.slug,
                    phone: formData.phone,
                    password: formData.password,
                    slogan: "Hoş Geldiniz",
                    logo: "",
                    cover_image: "",
                    cuisine_types: [],
                    rating: 5.0,
                    review_count: 0,
                    address: "",
                    email: "",
                    website: "",
                    description: "",
                    social_media: {},
                    working_hours: [
                        { day: "Pazartesi", open: "09:00", close: "22:00", isClosed: false },
                        { day: "Salı", open: "09:00", close: "22:00", isClosed: false },
                        { day: "Çarşamba", open: "09:00", close: "22:00", isClosed: false },
                        { day: "Perşembe", open: "09:00", close: "22:00", isClosed: false },
                        { day: "Cuma", open: "09:00", close: "22:00", isClosed: false },
                        { day: "Cumartesi", open: "09:00", close: "22:00", isClosed: false },
                        { day: "Pazar", open: "09:00", close: "22:00", isClosed: true },
                    ],
                    slider_items: [],
                    gallery: [],
                    theme_settings: {},
                });

                if (error) throw error;
            }

            await fetchBusinesses();
            setIsModalOpen(false);
            setEditingBusiness(null);
            setFormData({ name: "", slug: "", phone: "", password: "" });
        } catch (error) {
            console.error("Save error:", error);
            alert("Kaydetme hatası!");
        }

        setIsSaving(false);
    };

    // Delete business
    const handleDelete = async (id: string) => {
        // First delete related data
        await supabase.from("products").delete().eq("business_id", id);
        await supabase.from("categories").delete().eq("business_id", id);
        await supabase.from("tags").delete().eq("business_id", id);
        await supabase.from("feedbacks").delete().eq("business_id", id);

        const { error } = await supabase.from("businesses").delete().eq("id", id);

        if (error) {
            console.error("Delete error:", error);
            alert("Silme hatası!");
        } else {
            setBusinesses((prev) => prev.filter((b) => b.id !== id));
        }
        setDeleteConfirm(null);
    };

    // Open edit modal
    const openEditModal = (business: BusinessItem) => {
        setEditingBusiness(business);
        setFormData({ name: business.name, slug: business.slug, phone: business.phone || "", password: "" });
        setIsModalOpen(true);
    };

    // Open create modal
    const openCreateModal = () => {
        setEditingBusiness(null);
        setFormData({ name: "", slug: "", phone: "", password: "" });
        setIsModalOpen(true);
    };

    // Logout
    const handleLogout = () => {
        localStorage.removeItem("isAdminLoggedIn");
        localStorage.removeItem("isSuperAdmin");
        localStorage.removeItem("adminPhone");
        router.push("/login");
    };

    // Filter businesses
    const filteredBusinesses = businesses.filter(
        (b) =>
            b.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            b.slug.toLowerCase().includes(searchQuery.toLowerCase()) ||
            (b.phone && b.phone.includes(searchQuery))
    );

    // Show loading while checking auth
    if (isAuthorized === null) {
        return (
            <div className="min-h-screen bg-black flex items-center justify-center">
                <div className="w-8 h-8 border-2 border-white/20 border-t-white rounded-full animate-spin" />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-black text-white">
            {/* Header */}
            <div className="sticky top-0 z-40 bg-black/95 backdrop-blur-sm border-b border-white/10">
                <div className="max-w-6xl mx-auto px-4 py-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
                                <Store className="w-5 h-5 text-white" />
                            </div>
                            <div>
                                <h1 className="text-xl font-bold">Süper Admin</h1>
                                <p className="text-sm text-white/40">İşletme Yönetimi</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-3">
                            <button
                                onClick={openCreateModal}
                                className="flex items-center gap-2 px-4 py-2 bg-white text-black rounded-xl font-medium hover:bg-white/90 transition-colors"
                            >
                                <Plus className="w-4 h-4" />
                                Yeni İşletme
                            </button>
                            <button
                                onClick={handleLogout}
                                className="p-2 hover:bg-white/10 rounded-xl transition-colors"
                                title="Çıkış Yap"
                            >
                                <LogOut className="w-5 h-5 text-white/60" />
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Search */}
            <div className="max-w-6xl mx-auto px-4 py-6">
                <div className="relative">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
                    <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="İşletme, slug veya telefon ara..."
                        className="w-full pl-12 pr-4 py-3 bg-neutral-900 border border-white/10 rounded-xl text-white placeholder:text-white/30 focus:outline-none focus:border-white/30"
                    />
                </div>
            </div>

            {/* Business List */}
            <div className="max-w-6xl mx-auto px-4 pb-20">
                {isLoading ? (
                    <div className="text-center py-20">
                        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-white mx-auto mb-4"></div>
                        <p className="text-white/40">Yükleniyor...</p>
                    </div>
                ) : filteredBusinesses.length === 0 ? (
                    <div className="text-center py-20">
                        <Store className="w-16 h-16 text-white/20 mx-auto mb-4" />
                        <p className="text-white/40 mb-4">
                            {searchQuery ? "Sonuç bulunamadı" : "Henüz işletme yok"}
                        </p>
                        {!searchQuery && (
                            <button
                                onClick={openCreateModal}
                                className="px-6 py-3 bg-white text-black rounded-xl font-medium"
                            >
                                İlk İşletmeyi Oluştur
                            </button>
                        )}
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {filteredBusinesses.map((business) => (
                            <motion.div
                                key={business.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="bg-neutral-900 rounded-2xl p-5 border border-white/5 hover:border-white/10 transition-colors"
                            >
                                <div className="flex items-start justify-between mb-4">
                                    <div className="flex items-center gap-3">
                                        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-xl font-bold">
                                            {business.name.charAt(0).toUpperCase()}
                                        </div>
                                        <div>
                                            <h3 className="font-semibold text-lg">{business.name}</h3>
                                            <p className="text-sm text-white/40">/{business.slug}</p>
                                        </div>
                                    </div>
                                    <div className="relative">
                                        {deleteConfirm === business.id ? (
                                            <div className="flex gap-2">
                                                <button
                                                    onClick={() => handleDelete(business.id)}
                                                    className="p-2 bg-red-500 rounded-lg hover:bg-red-600 transition-colors"
                                                >
                                                    <Check className="w-4 h-4" />
                                                </button>
                                                <button
                                                    onClick={() => setDeleteConfirm(null)}
                                                    className="p-2 bg-white/10 rounded-lg hover:bg-white/20 transition-colors"
                                                >
                                                    <X className="w-4 h-4" />
                                                </button>
                                            </div>
                                        ) : (
                                            <div className="flex gap-1">
                                                <button
                                                    onClick={() => openEditModal(business)}
                                                    className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                                                >
                                                    <Edit className="w-4 h-4 text-white/60" />
                                                </button>
                                                <button
                                                    onClick={() => setDeleteConfirm(business.id)}
                                                    className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                                                >
                                                    <Trash2 className="w-4 h-4 text-red-400" />
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* Phone info */}
                                {business.phone && (
                                    <div className="mb-3 flex items-center gap-2 text-sm text-white/50">
                                        <Phone className="w-4 h-4" />
                                        <span>{business.phone}</span>
                                    </div>
                                )}

                                <div className="flex gap-2">
                                    <button
                                        onClick={() => {
                                            // Set localStorage for admin panel
                                            localStorage.setItem("currentBusinessSlug", business.slug);
                                            localStorage.setItem("currentBusinessId", business.id);
                                            localStorage.setItem("currentBusinessName", business.name);
                                            router.push("/admin/menu");
                                        }}
                                        className="flex-1 flex items-center justify-center gap-2 py-2 bg-white/10 hover:bg-white/20 rounded-xl text-sm font-medium transition-colors"
                                    >
                                        <Edit className="w-4 h-4" />
                                        Yönetim Paneli
                                    </button>
                                    <a
                                        href={`/${business.slug}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="flex-1 flex items-center justify-center gap-2 py-2 bg-white/5 hover:bg-white/10 rounded-xl text-sm transition-colors"
                                    >
                                        <ExternalLink className="w-4 h-4" />
                                        Menüyü Gör
                                    </a>
                                </div>

                                <p className="text-xs text-white/30 mt-3">
                                    Oluşturulma: {new Date(business.created_at).toLocaleDateString("tr-TR")}
                                </p>
                            </motion.div>
                        ))}
                    </div>
                )}
            </div>

            {/* Create/Edit Modal */}
            <AnimatePresence>
                {isModalOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm"
                        onClick={() => !isSaving && setIsModalOpen(false)}
                    >
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            onClick={(e) => e.stopPropagation()}
                            className="bg-neutral-900 rounded-2xl p-6 max-w-md w-full mx-4 border border-white/10 max-h-[90vh] overflow-y-auto"
                        >
                            <div className="flex items-center justify-between mb-6">
                                <h3 className="text-xl font-bold">
                                    {editingBusiness ? "İşletme Düzenle" : "Yeni İşletme"}
                                </h3>
                                <button
                                    onClick={() => setIsModalOpen(false)}
                                    className="p-2 hover:bg-white/10 rounded-full transition-colors"
                                    disabled={isSaving}
                                >
                                    <X className="w-5 h-5 text-white/60" />
                                </button>
                            </div>

                            <div className="space-y-4">
                                {/* Business Name */}
                                <div>
                                    <label className="block text-sm text-white/60 mb-2">İşletme Adı *</label>
                                    <input
                                        type="text"
                                        value={formData.name}
                                        onChange={(e) => handleNameChange(e.target.value)}
                                        placeholder="Örn: Cafe Deluxe"
                                        className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-white/20 focus:outline-none focus:border-white/30"
                                        disabled={isSaving}
                                    />
                                </div>

                                {/* Slug */}
                                <div>
                                    <label className="block text-sm text-white/60 mb-2">URL Slug *</label>
                                    <div className="flex items-center gap-2">
                                        <span className="text-white/40">gbzqr.com/</span>
                                        <input
                                            type="text"
                                            value={formData.slug}
                                            onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                                            placeholder="cafe-deluxe"
                                            className="flex-1 bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-white/20 focus:outline-none focus:border-white/30"
                                            disabled={isSaving}
                                        />
                                    </div>
                                </div>

                                {/* Phone */}
                                <div>
                                    <label className="block text-sm text-white/60 mb-2">
                                        Telefon {!editingBusiness && "*"}
                                    </label>
                                    <div className="relative">
                                        <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
                                        <input
                                            type="tel"
                                            value={formData.phone}
                                            onChange={(e) => setFormData({ ...formData, phone: e.target.value.replace(/\D/g, "") })}
                                            placeholder="5551234567"
                                            className="w-full pl-12 bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-white/20 focus:outline-none focus:border-white/30"
                                            disabled={isSaving}
                                        />
                                    </div>
                                    <p className="text-xs text-white/30 mt-1">Müşteri giriş telefonu</p>
                                </div>

                                {/* Password */}
                                <div>
                                    <label className="block text-sm text-white/60 mb-2">
                                        Şifre {!editingBusiness && "*"}
                                        {editingBusiness && <span className="text-white/30 ml-1">(boş bırakılırsa değişmez)</span>}
                                    </label>
                                    <div className="relative">
                                        <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
                                        <input
                                            type={showPassword ? "text" : "password"}
                                            value={formData.password}
                                            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                            placeholder="••••••••"
                                            className="w-full pl-12 pr-12 bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-white/20 focus:outline-none focus:border-white/30"
                                            disabled={isSaving}
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowPassword(!showPassword)}
                                            className="absolute right-4 top-1/2 -translate-y-1/2 text-white/40 hover:text-white"
                                        >
                                            {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                        </button>
                                    </div>
                                    <p className="text-xs text-white/30 mt-1">Müşteri giriş şifresi</p>
                                </div>
                            </div>

                            <div className="flex justify-end gap-3 mt-8">
                                <button
                                    onClick={() => setIsModalOpen(false)}
                                    className="px-6 py-3 rounded-xl bg-white/5 text-white hover:bg-white/10 transition-colors"
                                    disabled={isSaving}
                                >
                                    İptal
                                </button>
                                <button
                                    onClick={handleSave}
                                    disabled={isSaving || !formData.name.trim() || !formData.slug.trim() || (!editingBusiness && (!formData.phone.trim() || !formData.password.trim()))}
                                    className="px-6 py-3 rounded-xl bg-white text-black font-medium hover:bg-white/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                                >
                                    {isSaving ? (
                                        <>
                                            <div className="w-4 h-4 border-2 border-black/30 border-t-black rounded-full animate-spin" />
                                            Kaydediliyor...
                                        </>
                                    ) : (
                                        <>{editingBusiness ? "Güncelle" : "Oluştur"}</>
                                    )}
                                </button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
