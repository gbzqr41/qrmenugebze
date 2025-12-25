"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { ArrowLeft, Save, Plus, Trash2 } from "lucide-react";
import { type Product, type ProductVariation, type ProductExtra } from "@/data/mockData";
import { useDataStore } from "@/context/DataStoreContext";
import MediaUpload from "@/components/MediaUpload";
import { Tag, X } from "lucide-react";

export default function EditProductPage() {
    const router = useRouter();
    const params = useParams();
    const productId = params.id as string;
    const { categories, getProduct, updateProduct, deleteProduct, tags: availableTags } = useDataStore();


    const [isLoading, setIsLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [product, setProduct] = useState<Product | null>(null);

    // Form state
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [categoryId, setCategoryId] = useState("");
    const [price, setPrice] = useState("");
    const [originalPrice, setOriginalPrice] = useState("");
    const [mediaFiles, setMediaFiles] = useState<string[]>([]);
    const [preparationTime, setPreparationTime] = useState("");
    const [calories, setCalories] = useState("");
    const [allergens, setAllergens] = useState("");
    const [selectedTags, setSelectedTags] = useState<string[]>([]);
    const [isFeatured, setIsFeatured] = useState(false);
    const [isNew, setIsNew] = useState(false);
    const [variations, setVariations] = useState<ProductVariation[]>([]);
    const [extras, setExtras] = useState<ProductExtra[]>([]);

    // Load product data
    useEffect(() => {
        const foundProduct = getProduct(productId);
        if (foundProduct) {
            setProduct(foundProduct);
            setName(foundProduct.name);
            setDescription(foundProduct.description);
            setCategoryId(foundProduct.categoryId);
            setPrice(foundProduct.price.toString());
            setOriginalPrice(foundProduct.originalPrice?.toString() || "");

            // Combine main image and gallery into mediaFiles
            const allMedia = [foundProduct.image];
            if (foundProduct.gallery) {
                allMedia.push(...foundProduct.gallery);
            }
            setMediaFiles(allMedia);

            setPreparationTime(foundProduct.preparationTime || "");
            setCalories(foundProduct.calories?.toString() || "");
            setAllergens(foundProduct.allergens?.join(", ") || "");
            setSelectedTags(foundProduct.tags || []);
            setIsFeatured(foundProduct.isFeatured);
            setIsNew(foundProduct.isNew);
            setVariations(foundProduct.variations || []);
            setExtras(foundProduct.extras || []);
        }
        setIsLoading(false);
    }, [productId, getProduct]);

    // Variations management
    const addVariation = () => {
        const newId = `var-${Date.now()}`;
        setVariations([...variations, { id: newId, name: "", priceModifier: 0 }]);
    };

    const updateVariationField = (index: number, field: keyof ProductVariation, value: string | number) => {
        const updated = [...variations];
        if (field === "priceModifier") {
            updated[index][field] = Number(value);
        } else {
            updated[index][field] = value as string;
        }
        setVariations(updated);
    };

    const removeVariation = (index: number) => {
        setVariations(variations.filter((_, i) => i !== index));
    };

    // Extras management
    const addExtra = () => {
        const newId = `ext-${Date.now()}`;
        setExtras([...extras, { id: newId, name: "", price: 0 }]);
    };

    const updateExtraField = (index: number, field: keyof ProductExtra, value: string | number) => {
        const updated = [...extras];
        if (field === "price") {
            updated[index][field] = Number(value);
        } else {
            updated[index][field] = value as string;
        }
        setExtras(updated);
    };

    const removeExtra = (index: number) => {
        setExtras(extras.filter((_, i) => i !== index));
    };

    const handleSave = () => {
        if (!name.trim() || !price) return;

        setIsSubmitting(true);

        // Get main image and gallery from mediaFiles
        const mainImage = mediaFiles[0] || "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=800&h=600&fit=crop";
        const gallery = mediaFiles.slice(1);

        // Update product in store
        updateProduct(productId, {
            name,
            description,
            categoryId,
            price: Number(price),
            originalPrice: originalPrice ? Number(originalPrice) : undefined,
            image: mainImage,
            gallery: gallery.length > 0 ? gallery : undefined,
            preparationTime: preparationTime || undefined,
            calories: calories ? Number(calories) : undefined,
            allergens: allergens ? allergens.split(",").map((a) => a.trim()) : undefined,
            tags: selectedTags,
            isFeatured,
            isNew,
            variations: variations.filter((v) => v.name.trim()),
            extras: extras.filter((e) => e.name.trim()),
        });

        router.push("/admin/menu");
    };

    const handleDelete = () => {
        // Direct deletion without confirm - user requested this
        console.log("Deleting product:", productId);
        deleteProduct(productId);
        router.push("/admin/menu");
    };

    const goBack = () => {
        router.push("/admin/menu");
    };

    if (isLoading) {
        return (
            <div className="min-h-screen bg-neutral-950 flex items-center justify-center">
                <div className="w-8 h-8 border-2 border-white/20 border-t-white rounded-full animate-spin" />
            </div>
        );
    }

    if (!product) {
        return (
            <div className="min-h-screen bg-neutral-950 flex items-center justify-center">
                <div className="text-center">
                    <p className="text-white/60 mb-4">Ürün bulunamadı</p>
                    <button onClick={goBack} className="text-white underline">
                        Menü Yönetimine dön
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-neutral-950 p-6 lg:p-8">
            {/* Header with icons */}
            <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-4">
                    <button
                        onClick={goBack}
                        className="w-10 h-10 rounded-lg bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors"
                    >
                        <ArrowLeft className="w-5 h-5 text-white" />
                    </button>
                    <div>
                        <h1 className="text-2xl font-bold text-white">Ürünü Düzenle</h1>
                        <p className="text-white/40 text-sm">{product.name}</p>
                    </div>
                </div>

                {/* Action icons on the right */}
                <div className="flex items-center gap-2">
                    <button
                        onClick={handleSave}
                        disabled={!name.trim() || !price || isSubmitting}
                        className="w-10 h-10 rounded-lg bg-white flex items-center justify-center hover:bg-neutral-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        title="Kaydet"
                    >
                        {isSubmitting ? (
                            <div className="w-5 h-5 border-2 border-black/20 border-t-black rounded-full animate-spin" />
                        ) : (
                            <Save className="w-5 h-5 text-black" />
                        )}
                    </button>
                    <button
                        onClick={handleDelete}
                        className="w-10 h-10 rounded-lg bg-red-500/10 flex items-center justify-center hover:bg-red-500/20 transition-colors"
                        title="Sil"
                    >
                        <Trash2 className="w-5 h-5 text-red-400" />
                    </button>
                </div>
            </div>

            {/* Form */}
            <div className="max-w-4xl space-y-6">
                {/* Basic Info */}
                <div className="bg-neutral-900 rounded-2xl p-6">
                    <h2 className="text-lg font-bold text-white mb-4">Temel Bilgiler</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="md:col-span-2">
                            <label className="text-sm text-white/60 mb-2 block">Ürün Adı *</label>
                            <input
                                type="text"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                className="w-full px-4 py-3 bg-neutral-800 rounded-xl text-white placeholder:text-white/30 focus:outline-none"
                            />
                        </div>

                        <div className="md:col-span-2">
                            <label className="text-sm text-white/60 mb-2 block">Açıklama</label>
                            <textarea
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                rows={3}
                                className="w-full px-4 py-3 bg-neutral-800 rounded-xl text-white placeholder:text-white/30 focus:outline-none resize-none"
                            />
                        </div>

                        <div>
                            <label className="text-sm text-white/60 mb-2 block">Kategori *</label>
                            <select
                                value={categoryId}
                                onChange={(e) => setCategoryId(e.target.value)}
                                className="w-full px-4 py-3 bg-neutral-800 rounded-xl text-white focus:outline-none"
                            >
                                {categories.map((cat) => (
                                    <option key={cat.id} value={cat.id}>
                                        {cat.name}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label className="text-sm text-white/60 mb-2 block">Fiyat (TL) *</label>
                            <input
                                type="number"
                                value={price}
                                onChange={(e) => setPrice(e.target.value)}
                                min="0"
                                step="0.01"
                                className="w-full px-4 py-3 bg-neutral-800 rounded-xl text-white placeholder:text-white/30 focus:outline-none"
                            />
                        </div>

                        <div>
                            <label className="text-sm text-white/60 mb-2 block">Eski Fiyat (TL)</label>
                            <input
                                type="number"
                                value={originalPrice}
                                onChange={(e) => setOriginalPrice(e.target.value)}
                                min="0"
                                step="0.01"
                                className="w-full px-4 py-3 bg-neutral-800 rounded-xl text-white placeholder:text-white/30 focus:outline-none"
                            />
                        </div>
                    </div>
                </div>

                {/* Media Upload */}
                <div className="bg-neutral-900 rounded-2xl p-6">
                    <h2 className="text-lg font-bold text-white mb-4">Görseller & Videolar</h2>
                    <MediaUpload
                        value={mediaFiles}
                        onChange={setMediaFiles}
                        maxFiles={10}
                        acceptVideo={true}
                        label="Ürün görselleri ve videoları (ilk görsel ana görsel olarak kullanılır)"
                    />
                </div>

                {/* Details */}
                <div className="bg-neutral-900 rounded-2xl p-6">
                    <h2 className="text-lg font-bold text-white mb-4">Detaylar</h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                            <label className="text-sm text-white/60 mb-2 block">Hazırlık Süresi</label>
                            <input
                                type="text"
                                value={preparationTime}
                                onChange={(e) => setPreparationTime(e.target.value)}
                                placeholder="Örn: 15-20 dk"
                                className="w-full px-4 py-3 bg-neutral-800 rounded-xl text-white placeholder:text-white/30 focus:outline-none"
                            />
                        </div>

                        <div>
                            <label className="text-sm text-white/60 mb-2 block">Kalori (kcal)</label>
                            <input
                                type="number"
                                value={calories}
                                onChange={(e) => setCalories(e.target.value)}
                                min="0"
                                className="w-full px-4 py-3 bg-neutral-800 rounded-xl text-white placeholder:text-white/30 focus:outline-none"
                            />
                        </div>

                        <div>
                            <label className="text-sm text-white/60 mb-2 block">Alerjenler</label>
                            <input
                                type="text"
                                value={allergens}
                                onChange={(e) => setAllergens(e.target.value)}
                                placeholder="Örn: Süt, Gluten"
                                className="w-full px-4 py-3 bg-neutral-800 rounded-xl text-white placeholder:text-white/30 focus:outline-none"
                            />
                        </div>
                    </div>

                    {/* Tags Selection */}
                    <div className="mt-6">
                        <label className="text-sm text-white/60 mb-3 block flex items-center gap-2">
                            <Tag className="w-4 h-4" />
                            Etiketler
                        </label>
                        <div className="flex flex-wrap gap-2">
                            {availableTags.map((tag) => {
                                const isSelected = selectedTags.includes(tag);
                                return (
                                    <button
                                        key={tag}
                                        type="button"
                                        onClick={() => {
                                            if (isSelected) {
                                                setSelectedTags(prev => prev.filter(t => t !== tag));
                                            } else {
                                                setSelectedTags(prev => [...prev, tag]);
                                            }
                                        }}
                                        className={`px-3 py-1.5 rounded-lg text-sm transition-all border ${isSelected
                                            ? "bg-white text-black border-white"
                                            : "bg-neutral-800 text-white/60 border-white/10 hover:border-white/30"
                                            }`}
                                    >
                                        {tag}
                                    </button>
                                );
                            })}
                            {availableTags.length === 0 && (
                                <p className="text-white/30 text-sm italic">
                                    Henüz etiket oluşturulmamış. Ayarlar sayfasından etiket ekleyebilirsiniz.
                                </p>
                            )}
                        </div>
                    </div>

                    {/* Flags */}
                    <div className="flex gap-4 mt-4">
                        <label className="flex items-center gap-2 cursor-pointer">
                            <input
                                type="checkbox"
                                checked={isFeatured}
                                onChange={(e) => setIsFeatured(e.target.checked)}
                                className="w-5 h-5 rounded bg-neutral-800 border-white/20"
                            />
                            <span className="text-white/80">Öne Çıkan</span>
                        </label>
                        <label className="flex items-center gap-2 cursor-pointer">
                            <input
                                type="checkbox"
                                checked={isNew}
                                onChange={(e) => setIsNew(e.target.checked)}
                                className="w-5 h-5 rounded bg-neutral-800 border-white/20"
                            />
                            <span className="text-white/80">Yeni Ürün</span>
                        </label>
                    </div>
                </div>

                {/* Variations */}
                <div className="bg-neutral-900 rounded-2xl p-6">
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-lg font-bold text-white">Varyasyonlar</h2>
                        <button
                            type="button"
                            onClick={addVariation}
                            className="flex items-center gap-2 px-3 py-2 bg-white/10 text-white rounded-lg hover:bg-white/20 transition-colors text-sm"
                        >
                            <Plus className="w-4 h-4" />
                            Ekle
                        </button>
                    </div>

                    {variations.length === 0 ? (
                        <p className="text-white/40 text-sm">Henüz varyasyon eklenmedi</p>
                    ) : (
                        <div className="space-y-3">
                            {variations.map((variation, index) => (
                                <div key={variation.id} className="flex gap-3 items-center">
                                    <input
                                        type="text"
                                        value={variation.name}
                                        onChange={(e) => updateVariationField(index, "name", e.target.value)}
                                        placeholder="Varyasyon adı"
                                        className="flex-1 px-4 py-3 bg-neutral-800 rounded-xl text-white placeholder:text-white/30 focus:outline-none"
                                    />
                                    <input
                                        type="number"
                                        value={variation.priceModifier}
                                        onChange={(e) => updateVariationField(index, "priceModifier", e.target.value)}
                                        placeholder="Fiyat farkı"
                                        className="w-32 px-4 py-3 bg-neutral-800 rounded-xl text-white placeholder:text-white/30 focus:outline-none"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => removeVariation(index)}
                                        className="w-10 h-10 rounded-lg bg-red-500/10 text-red-400 flex items-center justify-center hover:bg-red-500/20 transition-colors"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Extras */}
                <div className="bg-neutral-900 rounded-2xl p-6">
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-lg font-bold text-white">Ekstra Seçenekler</h2>
                        <button
                            type="button"
                            onClick={addExtra}
                            className="flex items-center gap-2 px-3 py-2 bg-white/10 text-white rounded-lg hover:bg-white/20 transition-colors text-sm"
                        >
                            <Plus className="w-4 h-4" />
                            Ekle
                        </button>
                    </div>

                    {extras.length === 0 ? (
                        <p className="text-white/40 text-sm">Henüz ekstra seçenek eklenmedi</p>
                    ) : (
                        <div className="space-y-3">
                            {extras.map((extra, index) => (
                                <div key={extra.id} className="flex gap-3 items-center">
                                    <input
                                        type="text"
                                        value={extra.name}
                                        onChange={(e) => updateExtraField(index, "name", e.target.value)}
                                        placeholder="Ekstra adı"
                                        className="flex-1 px-4 py-3 bg-neutral-800 rounded-xl text-white placeholder:text-white/30 focus:outline-none"
                                    />
                                    <input
                                        type="number"
                                        value={extra.price}
                                        onChange={(e) => updateExtraField(index, "price", e.target.value)}
                                        placeholder="Fiyat"
                                        min="0"
                                        className="w-32 px-4 py-3 bg-neutral-800 rounded-xl text-white placeholder:text-white/30 focus:outline-none"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => removeExtra(index)}
                                        className="w-10 h-10 rounded-lg bg-red-500/10 text-red-400 flex items-center justify-center hover:bg-red-500/20 transition-colors"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
