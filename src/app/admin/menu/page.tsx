"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    DndContext,
    closestCenter,
    KeyboardSensor,
    PointerSensor,
    useSensor,
    useSensors,
    DragEndEvent,
} from "@dnd-kit/core";
import {
    arrayMove,
    SortableContext,
    sortableKeyboardCoordinates,
    useSortable,
    verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import {
    Plus,
    ChevronDown,
    ChevronRight,
    GripVertical,
    Pencil,
    Trash2,
    Video,
    X,
    // Food related icons
    UtensilsCrossed,
    Pizza,
    Beef,
    Fish,
    Salad,
    Cake,
    Coffee,
    Wine,
    Beer,
    CupSoda,
    Soup,
    Sandwich,
    Drumstick,
    IceCream,
    Cookie,
    Croissant,
    Egg,
    Apple,
    Carrot,
    Leaf,
    Flame,
    Sparkles,
    type LucideIcon,
} from "lucide-react";
import { useDataStore } from "@/context/DataStoreContext";
import type { Category, Product } from "@/context/DataStoreContext";

// Icon options for categories
const categoryIcons: { id: string; icon: LucideIcon; label: string }[] = [
    { id: "utensils", icon: UtensilsCrossed, label: "Ana Yemek" },
    { id: "pizza", icon: Pizza, label: "Pizza" },
    { id: "beef", icon: Beef, label: "Et" },
    { id: "fish", icon: Fish, label: "Deniz Ürünü" },
    { id: "salad", icon: Salad, label: "Salata" },
    { id: "cake", icon: Cake, label: "Tatlı" },
    { id: "coffee", icon: Coffee, label: "Kahve" },
    { id: "wine", icon: Wine, label: "Şarap" },
    { id: "beer", icon: Beer, label: "Bira" },
    { id: "soda", icon: CupSoda, label: "İçecek" },
    { id: "soup", icon: Soup, label: "Çorba" },
    { id: "sandwich", icon: Sandwich, label: "Sandviç" },
    { id: "drumstick", icon: Drumstick, label: "Tavuk" },
    { id: "icecream", icon: IceCream, label: "Dondurma" },
    { id: "cookie", icon: Cookie, label: "Kurabiye" },
    { id: "croissant", icon: Croissant, label: "Pasta" },
    { id: "egg", icon: Egg, label: "Kahvaltı" },
    { id: "apple", icon: Apple, label: "Meyve" },
    { id: "carrot", icon: Carrot, label: "Sebze" },
    { id: "leaf", icon: Leaf, label: "Vegan" },
    { id: "flame", icon: Flame, label: "Acılı" },
    { id: "sparkles", icon: Sparkles, label: "Özel" },
];

const NO_ICON_ID = "no_icon";


// Get icon component by id
function getIconById(iconId: string): LucideIcon | null {
    if (iconId === NO_ICON_ID) return null;
    const found = categoryIcons.find((i) => i.id === iconId);
    return found?.icon || UtensilsCrossed;
}

// Helper to detect video
function isVideoUrl(url: string): boolean {
    if (!url) return false;
    if (url.startsWith("data:video/")) return true;
    const lowerUrl = url.toLowerCase();
    return lowerUrl.includes(".mp4") || lowerUrl.includes(".webm") || lowerUrl.includes(".mov");
}

// Sortable Category Item
function SortableCategoryItem({
    category,
    products,
    isExpanded,
    onToggle,
    onEdit,
    onDelete,
    onAddProduct,
    onDeleteProduct,
    onEditProduct,
    orderedProducts,
    setOrderedProducts,
}: {
    category: Category;
    products: Product[];
    isExpanded: boolean;
    onToggle: () => void;
    onEdit: () => void;
    onDelete: () => void;
    onAddProduct: () => void;
    onDeleteProduct: (id: string) => void;
    onEditProduct: (id: string) => void;
    orderedProducts: Product[];
    setOrderedProducts: (products: Product[]) => void;
}) {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging,
    } = useSortable({ id: category.id });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0.5 : 1,
        zIndex: isDragging ? 1000 : 1,
    };

    const productSensors = useSensors(
        useSensor(PointerSensor, { activationConstraint: { distance: 8 } }),
        useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
    );

    const IconComponent = getIconById(category.icon);

    const handleProductDragEnd = (event: DragEndEvent) => {
        const { active, over } = event;
        if (over && active.id !== over.id) {
            const oldIndex = orderedProducts.findIndex((p) => p.id === active.id);
            const newIndex = orderedProducts.findIndex((p) => p.id === over.id);
            setOrderedProducts(arrayMove(orderedProducts, oldIndex, newIndex));
        }
    };

    return (
        <div ref={setNodeRef} style={style} className="mb-4">
            <div className="bg-neutral-900 rounded-2xl overflow-hidden border border-white/10 shadow-lg">
                {/* Category Header */}
                <div className="flex items-center gap-4 p-5 bg-gradient-to-r from-neutral-800/80 to-neutral-900">
                    <button
                        {...attributes}
                        {...listeners}
                        className="cursor-grab active:cursor-grabbing p-2 hover:bg-white/10 rounded-lg transition-colors"
                    >
                        <GripVertical className="w-5 h-5 text-white/40" />
                    </button>

                    <button
                        onClick={onToggle}
                        className="flex items-center gap-4 flex-1 text-left"
                    >
                        {IconComponent ? (
                            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-white/10 to-white/5 flex items-center justify-center">
                                <IconComponent className="w-6 h-6 text-white" />
                            </div>
                        ) : (
                            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-white/5 to-transparent flex items-center justify-center border border-white/5">
                                <span className="text-xs text-white/20">No Icon</span>
                            </div>
                        )}

                        <div className="flex-1">
                            <h3 className="text-lg font-semibold text-white">{category.name}</h3>
                            <p className="text-sm text-white/50">{products.length} ürün</p>
                        </div>

                        {isExpanded ? (
                            <ChevronDown className="w-5 h-5 text-white/60" />
                        ) : (
                            <ChevronRight className="w-5 h-5 text-white/60" />
                        )}
                    </button>

                    <div className="flex items-center gap-1">
                        <button
                            onClick={onAddProduct}
                            className="p-2.5 text-green-400 hover:bg-green-500/20 rounded-xl transition-colors"
                            title="Ürün Ekle"
                        >
                            <Plus className="w-5 h-5" />
                        </button>
                        <button
                            onClick={onEdit}
                            className="p-2.5 text-white/60 hover:bg-white/10 rounded-xl transition-colors"
                            title="Düzenle"
                        >
                            <Pencil className="w-4 h-4" />
                        </button>
                        <button
                            onClick={(e) => { e.stopPropagation(); onDelete(); }}
                            className="p-2.5 text-red-400 hover:bg-red-500/20 rounded-xl transition-colors"
                            title="Sil"
                        >
                            <Trash2 className="w-4 h-4" />
                        </button>
                    </div>
                </div>

                {/* Products List */}
                <AnimatePresence>
                    {isExpanded && (
                        <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.2 }}
                            className="overflow-hidden border-t border-white/5"
                        >
                            {products.length > 0 ? (
                                <DndContext
                                    sensors={productSensors}
                                    collisionDetection={closestCenter}
                                    onDragEnd={handleProductDragEnd}
                                >
                                    <SortableContext
                                        items={orderedProducts.map((p) => p.id)}
                                        strategy={verticalListSortingStrategy}
                                    >
                                        <div className="divide-y divide-white/5">
                                            {orderedProducts.map((product) => (
                                                <SortableProductItem
                                                    key={product.id}
                                                    product={product}
                                                    onDelete={() => onDeleteProduct(product.id)}
                                                    onEdit={() => onEditProduct(product.id)}
                                                />
                                            ))}
                                        </div>
                                    </SortableContext>
                                </DndContext>
                            ) : (
                                <div className="p-10 text-center">
                                    <div className="w-14 h-14 rounded-full bg-white/5 flex items-center justify-center mx-auto mb-4">
                                        <Plus className="w-7 h-7 text-white/30" />
                                    </div>
                                    <p className="text-white/40 mb-4">Bu kategoride henüz ürün yok</p>
                                    <button
                                        onClick={onAddProduct}
                                        className="inline-flex items-center gap-2 px-5 py-2.5 bg-white/10 rounded-xl text-white hover:bg-white/20 transition-colors"
                                    >
                                        <Plus className="w-4 h-4" />
                                        İlk Ürünü Ekle
                                    </button>
                                </div>
                            )}
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
}

// Sortable Product Item
function SortableProductItem({
    product,
    onDelete,
    onEdit,
}: {
    product: Product;
    onDelete: () => void;
    onEdit: () => void;
}) {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging,
    } = useSortable({ id: product.id });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0.5 : 1,
    };

    return (
        <div
            ref={setNodeRef}
            style={style}
            className="flex items-center gap-4 p-4 pl-6 hover:bg-white/5 transition-colors"
        >
            <button
                {...attributes}
                {...listeners}
                className="cursor-grab active:cursor-grabbing p-1.5 hover:bg-white/10 rounded-lg"
            >
                <GripVertical className="w-4 h-4 text-white/30" />
            </button>

            {/* Product Image */}
            <div className="w-14 h-14 rounded-xl overflow-hidden bg-neutral-800 flex-shrink-0">
                {isVideoUrl(product.image) ? (
                    <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-red-500/20 to-red-600/20">
                        <Video className="w-6 h-6 text-red-400" />
                    </div>
                ) : (
                    <img
                        src={product.image}
                        alt={product.name}
                        className="w-full h-full object-cover"
                    />
                )}
            </div>

            <div className="flex-1 min-w-0 cursor-pointer" onClick={onEdit}>
                <h4 className="text-white font-medium truncate">{product.name}</h4>
                <p className="text-sm text-white/40 truncate">{product.description}</p>
            </div>

            <div className="text-right">
                <span className="text-lg font-bold text-white">{product.price} TL</span>
                {product.originalPrice && product.originalPrice > product.price && (
                    <p className="text-sm text-white/40 line-through">{product.originalPrice} TL</p>
                )}
            </div>

            <button
                onClick={onEdit}
                className="p-2 text-white/60 hover:bg-white/10 rounded-xl transition-colors"
                title="Düzenle"
            >
                <Pencil className="w-4 h-4" />
            </button>

            <button
                onClick={(e) => { e.stopPropagation(); onDelete(); }}
                className="p-2 text-red-400 hover:bg-red-500/20 rounded-xl transition-colors"
                title="Ürünü Sil"
            >
                <Trash2 className="w-4 h-4" />
            </button>
        </div>
    );
}

export default function MenuManagementPage() {
    const { categories, products, addCategory, updateCategory, deleteCategory, addProduct, deleteProduct, reorderCategories, reorderProducts, isLoading } = useDataStore();
    const [expandedCategories, setExpandedCategories] = useState<string[]>([]);
    const [orderedCategories, setOrderedCategories] = useState<Category[]>([]);
    const [productsByCategory, setProductsByCategory] = useState<Record<string, Product[]>>({});

    const [categoryModal, setCategoryModal] = useState<{ open: boolean; category?: Category }>({ open: false });
    const [productModal, setProductModal] = useState<{ open: boolean; categoryId: string; categoryName: string }>({
        open: false,
        categoryId: "",
        categoryName: ""
    });

    // Modal states
    const [modalName, setModalName] = useState("");
    const [modalIcon, setModalIcon] = useState("utensils");
    const [modalPrice, setModalPrice] = useState("");
    const [modalDescription, setModalDescription] = useState("");
    const [isSaving, setIsSaving] = useState(false);

    // Sync categories
    useEffect(() => {
        setOrderedCategories(categories);
    }, [categories]);

    // Sync products by category
    useEffect(() => {
        const grouped: Record<string, Product[]> = {};
        categories.forEach((cat) => {
            grouped[cat.id] = products.filter((p) => p.categoryId === cat.id);
        });
        setProductsByCategory(grouped);
    }, [categories, products]);

    // Reset modal when opening
    useEffect(() => {
        if (categoryModal.open) {
            setModalName(categoryModal.category?.name || "");
            setModalIcon(categoryModal.category?.icon || "utensils");
        }
    }, [categoryModal]);

    useEffect(() => {
        if (productModal.open) {
            setModalName("");
            setModalPrice("");
            setModalDescription("");
        }
    }, [productModal]);

    // Drag sensors
    const sensors = useSensors(
        useSensor(PointerSensor, { activationConstraint: { distance: 8 } }),
        useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
    );

    const handleCategoryDragEnd = (event: DragEndEvent) => {
        const { active, over } = event;
        if (over && active.id !== over.id) {
            const oldIndex = orderedCategories.findIndex((c) => c.id === active.id);
            const newIndex = orderedCategories.findIndex((c) => c.id === over.id);
            const newOrder = arrayMove(orderedCategories, oldIndex, newIndex);
            setOrderedCategories(newOrder);
            // Save the new order to localStorage
            reorderCategories(newOrder.map(c => c.id));
        }
    };

    // Loading state
    if (isLoading) {
        return (
            <div className="p-6 lg:p-8 max-w-5xl">
                <div className="flex items-center justify-center min-h-[400px]">
                    <div className="text-center">
                        <div className="w-16 h-16 border-4 border-white/20 border-t-white rounded-full animate-spin mx-auto mb-4" />
                        <p className="text-white/60">Yükleniyor...</p>
                    </div>
                </div>
            </div>
        );
    }

    const toggleCategory = (categoryId: string) => {
        setExpandedCategories((prev) =>
            prev.includes(categoryId)
                ? prev.filter((id) => id !== categoryId)
                : [...prev, categoryId]
        );
    };

    const handleSaveCategory = () => {
        if (!modalName.trim() || isSaving) return;
        setIsSaving(true);
        setCategoryModal({ open: false }); // Close modal immediately

        if (categoryModal.category) {
            updateCategory(categoryModal.category.id, { name: modalName.trim(), icon: modalIcon });
        } else {
            addCategory({ name: modalName.trim(), icon: modalIcon });
        }
        setIsSaving(false);
    };

    const handleDeleteCategory = (categoryId: string) => {
        // Direct deletion without confirm - user requested this
        console.log("Deleting category:", categoryId);
        deleteCategory(categoryId);
    };

    const handleSaveProduct = () => {
        if (!modalName.trim() || !modalPrice || isSaving) return;
        setIsSaving(true);
        setProductModal({ open: false, categoryId: "", categoryName: "" }); // Close modal immediately

        addProduct({
            categoryId: productModal.categoryId,
            name: modalName.trim(),
            description: modalDescription.trim() || "Lezzetli ürün",
            price: Number(modalPrice),
            image: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400&h=300&fit=crop",
            tags: [],
            isFeatured: false,
            isNew: true,
        });
        setIsSaving(false);
    };

    const handleDeleteProduct = (productId: string) => {
        // Direct deletion without confirm - user requested this
        console.log("Deleting product:", productId);
        deleteProduct(productId);
    };

    const handleEditProduct = (productId: string) => {
        window.location.href = `/admin/products/${productId}`;
    };

    return (
        <div className="p-6 lg:p-8 max-w-5xl">
            {/* Header */}
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8"
            >
                <div>
                    <h1 className="text-2xl font-bold text-white mb-1">Menü Yönetimi</h1>
                    <p className="text-white/50">Kategorileri ve ürünleri sürükleyerek sıralayın</p>
                </div>

                <button
                    onClick={() => setCategoryModal({ open: true })}
                    className="flex items-center gap-2 px-6 py-3 bg-white text-black rounded-xl font-semibold hover:bg-neutral-100 transition-colors shadow-lg"
                >
                    <Plus className="w-5 h-5" />
                    Yeni Kategori
                </button>
            </motion.div>

            {/* Stats */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.1 }}
                className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8"
            >
                <div className="bg-gradient-to-br from-blue-500/20 to-blue-600/10 rounded-2xl p-5 border border-blue-500/20">
                    <p className="text-3xl font-bold text-white">{categories.length}</p>
                    <p className="text-sm text-white/60">Kategori</p>
                </div>
                <div className="bg-gradient-to-br from-green-500/20 to-green-600/10 rounded-2xl p-5 border border-green-500/20">
                    <p className="text-3xl font-bold text-white">{products.length}</p>
                    <p className="text-sm text-white/60">Ürün</p>
                </div>
                <div className="bg-gradient-to-br from-purple-500/20 to-purple-600/10 rounded-2xl p-5 border border-purple-500/20">
                    <p className="text-3xl font-bold text-white">{products.filter(p => p.isNew).length}</p>
                    <p className="text-sm text-white/60">Yeni Ürün</p>
                </div>
                <div className="bg-gradient-to-br from-amber-500/20 to-amber-600/10 rounded-2xl p-5 border border-amber-500/20">
                    <p className="text-3xl font-bold text-white">{products.filter(p => p.isFeatured).length}</p>
                    <p className="text-sm text-white/60">Öne Çıkan</p>
                </div>
            </motion.div>

            {/* Categories List with Drag & Drop */}
            <DndContext
                sensors={sensors}
                collisionDetection={closestCenter}
                onDragEnd={handleCategoryDragEnd}
            >
                <SortableContext
                    items={orderedCategories.map((c) => c.id)}
                    strategy={verticalListSortingStrategy}
                >
                    {orderedCategories.map((category) => (
                        <SortableCategoryItem
                            key={category.id}
                            category={category}
                            products={productsByCategory[category.id] || []}
                            isExpanded={expandedCategories.includes(category.id)}
                            onToggle={() => toggleCategory(category.id)}
                            onEdit={() => setCategoryModal({ open: true, category })}
                            onDelete={() => handleDeleteCategory(category.id)}
                            onAddProduct={() => setProductModal({
                                open: true,
                                categoryId: category.id,
                                categoryName: category.name
                            })}
                            onDeleteProduct={handleDeleteProduct}
                            onEditProduct={handleEditProduct}
                            orderedProducts={productsByCategory[category.id] || []}
                            setOrderedProducts={(newProducts) => {
                                setProductsByCategory((prev) => ({
                                    ...prev,
                                    [category.id]: newProducts,
                                }));
                            }}
                        />
                    ))}
                </SortableContext>
            </DndContext>

            {/* Empty State */}
            {orderedCategories.length === 0 && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-center py-20"
                >
                    <div className="w-20 h-20 rounded-full bg-gradient-to-br from-white/10 to-white/5 flex items-center justify-center mx-auto mb-6">
                        <UtensilsCrossed className="w-10 h-10 text-white/40" />
                    </div>
                    <h3 className="text-xl font-semibold text-white mb-2">Henüz kategori yok</h3>
                    <p className="text-white/40 mb-8">İlk kategorinizi ekleyerek menünüzü oluşturun</p>
                    <button
                        onClick={() => setCategoryModal({ open: true })}
                        className="inline-flex items-center gap-2 px-8 py-4 bg-white text-black rounded-xl font-semibold hover:bg-neutral-100 shadow-lg"
                    >
                        <Plus className="w-5 h-5" />
                        Kategori Ekle
                    </button>
                </motion.div>
            )}

            {/* Category Modal */}
            <AnimatePresence>
                {categoryModal.open && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="absolute inset-0 bg-black/80 backdrop-blur-sm"
                            onClick={() => setCategoryModal({ open: false })}
                        />
                        <motion.div
                            initial={{ scale: 0.95, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.95, opacity: 0 }}
                            className="relative bg-neutral-900 rounded-2xl p-6 w-full max-w-lg border border-white/10"
                        >
                            <div className="flex items-center justify-between mb-6">
                                <h2 className="text-xl font-bold text-white">
                                    {categoryModal.category ? "Kategoriyi Düzenle" : "Yeni Kategori"}
                                </h2>
                                <button
                                    onClick={() => setCategoryModal({ open: false })}
                                    className="p-2 text-white/60 hover:bg-white/10 rounded-lg"
                                >
                                    <X className="w-5 h-5" />
                                </button>
                            </div>

                            <div className="space-y-5">
                                <div>
                                    <label className="text-sm text-white/60 mb-3 block">İkon Seçin</label>
                                    <div className="grid grid-cols-6 sm:grid-cols-8 gap-2">
                                        <button
                                            type="button"
                                            onClick={() => setModalIcon(NO_ICON_ID)}
                                            className={`w-12 h-12 rounded-xl flex items-center justify-center transition-all ${modalIcon === NO_ICON_ID
                                                ? "bg-white text-black shadow-lg scale-110"
                                                : "bg-neutral-800 text-white/60 hover:bg-neutral-700 hover:text-white"
                                                }`}
                                            title="İkon Yok"
                                        >
                                            <X className="w-5 h-5" />
                                        </button>
                                        {categoryIcons.map((item) => {
                                            const Icon = item.icon;
                                            return (
                                                <button
                                                    key={item.id}
                                                    type="button"
                                                    onClick={() => setModalIcon(item.id)}
                                                    className={`w-12 h-12 rounded-xl flex items-center justify-center transition-all ${modalIcon === item.id
                                                        ? "bg-white text-black shadow-lg scale-110"
                                                        : "bg-neutral-800 text-white/60 hover:bg-neutral-700 hover:text-white"
                                                        }`}
                                                    title={item.label}
                                                >
                                                    <Icon className="w-5 h-5" />
                                                </button>
                                            );
                                        })}
                                    </div>
                                </div>

                                <div>
                                    <label className="text-sm text-white/60 mb-2 block">Kategori Adı</label>
                                    <input
                                        type="text"
                                        value={modalName}
                                        onChange={(e) => setModalName(e.target.value)}
                                        placeholder="örn: Ana Yemekler"
                                        className="w-full px-4 py-3.5 bg-neutral-800 rounded-xl text-white placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-white/20 text-lg"
                                        autoFocus
                                    />
                                </div>

                                <div className="flex gap-3 pt-4">
                                    <button
                                        type="button"
                                        onClick={() => setCategoryModal({ open: false })}
                                        className="flex-1 px-4 py-3.5 bg-white/10 text-white rounded-xl hover:bg-white/20 font-medium"
                                    >
                                        İptal
                                    </button>
                                    <button
                                        type="button"
                                        onClick={handleSaveCategory}
                                        disabled={isSaving}
                                        className="flex-1 px-4 py-3.5 bg-white text-black rounded-xl font-semibold hover:bg-neutral-100 disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        {isSaving ? "Kaydediliyor..." : (categoryModal.category ? "Kaydet" : "Ekle")}
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            {/* Product Modal */}
            <AnimatePresence>
                {productModal.open && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="absolute inset-0 bg-black/80 backdrop-blur-sm"
                            onClick={() => setProductModal({ open: false, categoryId: "", categoryName: "" })}
                        />
                        <motion.div
                            initial={{ scale: 0.95, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.95, opacity: 0 }}
                            className="relative bg-neutral-900 rounded-2xl p-6 w-full max-w-md border border-white/10"
                        >
                            <div className="flex items-center justify-between mb-2">
                                <h2 className="text-xl font-bold text-white">Hızlı Ürün Ekle</h2>
                                <button
                                    onClick={() => setProductModal({ open: false, categoryId: "", categoryName: "" })}
                                    className="p-2 text-white/60 hover:bg-white/10 rounded-lg"
                                >
                                    <X className="w-5 h-5" />
                                </button>
                            </div>
                            <p className="text-white/50 mb-6">{productModal.categoryName} kategorisine</p>

                            <div className="space-y-4">
                                <div>
                                    <label className="text-sm text-white/60 mb-2 block">Ürün Adı *</label>
                                    <input
                                        type="text"
                                        value={modalName}
                                        onChange={(e) => setModalName(e.target.value)}
                                        placeholder="örn: Izgara Köfte"
                                        className="w-full px-4 py-3 bg-neutral-800 rounded-xl text-white placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-white/20"
                                        autoFocus
                                    />
                                </div>

                                <div>
                                    <label className="text-sm text-white/60 mb-2 block">Fiyat (₺) *</label>
                                    <input
                                        type="number"
                                        value={modalPrice}
                                        onChange={(e) => setModalPrice(e.target.value)}
                                        placeholder="0"
                                        min="0"
                                        step="0.01"
                                        className="w-full px-4 py-3 bg-neutral-800 rounded-xl text-white placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-white/20"
                                    />
                                </div>

                                <div>
                                    <label className="text-sm text-white/60 mb-2 block">Açıklama</label>
                                    <textarea
                                        value={modalDescription}
                                        onChange={(e) => setModalDescription(e.target.value)}
                                        placeholder="Ürün açıklaması..."
                                        rows={2}
                                        className="w-full px-4 py-3 bg-neutral-800 rounded-xl text-white placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-white/20 resize-none"
                                    />
                                </div>

                                <div className="flex gap-3 pt-4">
                                    <button
                                        type="button"
                                        onClick={() => setProductModal({ open: false, categoryId: "", categoryName: "" })}
                                        className="flex-1 px-4 py-3 bg-white/10 text-white rounded-xl hover:bg-white/20 font-medium"
                                    >
                                        İptal
                                    </button>
                                    <button
                                        type="button"
                                        onClick={handleSaveProduct}
                                        disabled={isSaving}
                                        className="flex-1 px-4 py-3 bg-white text-black rounded-xl font-semibold hover:bg-neutral-100 disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        {isSaving ? "Ekleniyor..." : "Ekle"}
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
}
