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
    Check,
    Image,
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
import type { SliderItem } from "@/data/mockData";

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
    onDeleteProduct: (id: string, name: string) => void;
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
                            <ChevronDown className="w-5 h-5 text-white/60 mr-3" />
                        ) : (
                            <ChevronRight className="w-5 h-5 text-white/60 mr-3" />
                        )}
                    </button>

                    <div className="flex items-center gap-1">
                        <button
                            onClick={onAddProduct}
                            className="flex items-center gap-1 px-2 py-1.5 text-green-400 hover:bg-green-500/20 rounded-xl transition-colors text-sm"
                            title="Ürün Ekle"
                        >
                            <Plus className="w-4 h-4" />
                            <span>Ekle</span>
                        </button>
                        <button
                            onClick={onEdit}
                            className="flex items-center gap-1 px-2 py-1.5 text-white/60 hover:bg-white/10 rounded-xl transition-colors text-sm"
                            title="Düzenle"
                        >
                            <Pencil className="w-4 h-4" />
                            <span>Düzenle</span>
                        </button>
                        <button
                            onClick={(e) => { e.stopPropagation(); onDelete(); }}
                            className="flex items-center gap-1 px-2 py-1.5 text-red-400 hover:bg-red-500/20 rounded-xl transition-colors text-sm"
                            title="Sil"
                        >
                            <Trash2 className="w-4 h-4" />
                            <span>Sil</span>
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
                                                    onDelete={() => onDeleteProduct(product.id, product.name)}
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
                {!product.image ? (
                    <div className="w-full h-full bg-neutral-700" />
                ) : isVideoUrl(product.image) ? (
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
                className="flex items-center gap-1 px-2 py-1.5 text-white/60 hover:bg-white/10 rounded-xl transition-colors text-sm"
                title="Düzenle"
            >
                <Pencil className="w-4 h-4" />
                <span>Düzenle</span>
            </button>

            <button
                onClick={(e) => { e.stopPropagation(); onDelete(); }}
                className="flex items-center gap-1 px-2 py-1.5 text-red-400 hover:bg-red-500/20 rounded-xl transition-colors text-sm"
                title="Ürünü Sil"
            >
                <Trash2 className="w-4 h-4" />
                <span>Sil</span>
            </button>
        </div>
    );
}

export default function MenuManagementPage() {
    const { categories, products, addCategory, updateCategory, deleteCategory, addProduct, deleteProduct, reorderCategories, reorderProducts, isLoading, clearAllMenuData, business, updateBusiness } = useDataStore();
    const [expandedCategories, setExpandedCategories] = useState<string[]>([]);
    const [orderedCategories, setOrderedCategories] = useState<Category[]>([]);
    const [productsByCategory, setProductsByCategory] = useState<Record<string, Product[]>>({});

    const [categoryModal, setCategoryModal] = useState<{ open: boolean; category?: Category }>({ open: false });
    const [productModal, setProductModal] = useState<{ open: boolean; categoryId: string; categoryName: string }>({
        open: false,
        categoryId: "",
        categoryName: ""
    });

    // Slider modal state
    const [sliderModal, setSliderModal] = useState<{ open: boolean; slider?: SliderItem }>({ open: false });
    const [sliderItems, setSliderItems] = useState<SliderItem[]>([]);
    const [sliderTitle, setSliderTitle] = useState("");
    const [sliderSubtitle, setSliderSubtitle] = useState("");
    const [sliderImage, setSliderImage] = useState("");
    const sliderFileRef = useState<HTMLInputElement | null>(null);

    // Modal states
    const [modalName, setModalName] = useState("");
    const [modalIcon, setModalIcon] = useState("utensils");
    const [modalIsFeatured, setModalIsFeatured] = useState(false);
    const [modalPrice, setModalPrice] = useState("");
    const [modalDescription, setModalDescription] = useState("");
    const [isSaving, setIsSaving] = useState(false);

    // Toast notification state
    const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

    // Delete confirmation modal state
    const [deleteModal, setDeleteModal] = useState<{ open: boolean; type: 'category' | 'product' | 'slider'; id: string; name: string }>({
        open: false, type: 'category', id: '', name: ''
    });

    const showToast = (message: string, type: 'success' | 'error' = 'success') => {
        setToast({ message, type });
        setTimeout(() => setToast(null), 3000);
    };

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
            setModalIcon(categoryModal.category?.icon || NO_ICON_ID);
            setModalIsFeatured(categoryModal.category?.isFeatured || false);
        } else {
            // Reset saving state when modal closes
            setIsSaving(false);
        }
    }, [categoryModal]);

    useEffect(() => {
        if (productModal.open) {
            setModalName("");
            setModalPrice("");
            setModalDescription("");
        } else {
            // Reset saving state when modal closes
            setIsSaving(false);
        }
    }, [productModal]);

    // Slider sync with business
    useEffect(() => {
        setSliderItems(business.sliderItems || []);
    }, [business.sliderItems]);

    // Slider modal reset
    useEffect(() => {
        if (sliderModal.open) {
            if (sliderModal.slider) {
                setSliderTitle(sliderModal.slider.title);
                setSliderSubtitle(sliderModal.slider.subtitle || "");
                setSliderImage(sliderModal.slider.image);
            } else {
                setSliderTitle("");
                setSliderSubtitle("");
                setSliderImage("");
            }
        } else {
            setIsSaving(false);
        }
    }, [sliderModal]);

    // Slider handlers
    const handleSliderImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        if (file.size > 2 * 1024 * 1024) {
            showToast("Resim boyutu 2MB'dan küçük olmalıdır", 'error');
            return;
        }
        const reader = new FileReader();
        reader.onload = (event) => {
            setSliderImage(event.target?.result as string);
        };
        reader.readAsDataURL(file);
    };

    const handleSaveSlider = () => {
        if (!sliderTitle.trim() || !sliderImage || isSaving) return;
        setIsSaving(true);

        try {
            const newSlider: SliderItem = {
                id: sliderModal.slider?.id || `slider_${Date.now()}`,
                title: sliderTitle.trim(),
                subtitle: sliderSubtitle.trim() || undefined,
                image: sliderImage,
                link: "",
            };

            let updatedSliders: SliderItem[];
            if (sliderModal.slider) {
                updatedSliders = sliderItems.map(s => s.id === sliderModal.slider!.id ? newSlider : s);
                showToast("Slider güncellendi");
            } else {
                updatedSliders = [...sliderItems, newSlider];
                showToast("Slider eklendi");
            }
            updateBusiness({ sliderItems: updatedSliders });
            setSliderModal({ open: false });
        } catch (error) {
            console.error(error);
            showToast("Slider kaydedilirken hata oluştu", "error");
        } finally {
            setIsSaving(false);
        }
    };

    const handleDeleteSlider = (id: string) => {
        const updatedSliders = sliderItems.filter(s => s.id !== id);
        updateBusiness({ sliderItems: updatedSliders });
        showToast("Slider silindi");
        setDeleteModal({ open: false, type: 'category', id: '', name: '' });
    };

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
            <div className="p-6 lg:p-8">
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

        try {
            if (categoryModal.category) {
                updateCategory(categoryModal.category.id, { name: modalName.trim(), icon: modalIcon, isFeatured: modalIsFeatured });
                showToast("Kategori güncellendi");
            } else {
                addCategory({ name: modalName.trim(), icon: modalIcon, isFeatured: modalIsFeatured });
                showToast("Kategori eklendi");
            }
            setCategoryModal({ open: false });
        } catch (error) {
            console.error(error);
            showToast("Kategori kaydedilirken hata oluştu", "error");
        } finally {
            setIsSaving(false);
        }
    };

    const handleDeleteCategory = (categoryId: string, categoryName: string) => {
        setDeleteModal({ open: true, type: 'category', id: categoryId, name: categoryName });
    };

    const handleSaveProduct = () => {
        if (!modalName.trim() || !modalPrice || isSaving) return;
        setIsSaving(true);

        try {
            addProduct({
                categoryId: productModal.categoryId,
                name: modalName.trim(),
                description: modalDescription.trim() || "Lezzetli ürün",
                price: Number(modalPrice),
                image: "",
                tags: [],
                isFeatured: false,
                isNew: false,
            });
            showToast("Ürün eklendi");
            setProductModal({ open: false, categoryId: "", categoryName: "" });
        } catch (error) {
            console.error(error);
            showToast("Ürün eklenirken hata oluştu", "error");
        } finally {
            setIsSaving(false);
        }
    };

    const handleDeleteProduct = (productId: string, productName: string) => {
        setDeleteModal({ open: true, type: 'product', id: productId, name: productName });
    };

    const confirmDelete = () => {
        if (deleteModal.type === 'category') {
            deleteCategory(deleteModal.id);
            showToast("Kategori silindi");
        } else if (deleteModal.type === 'product') {
            deleteProduct(deleteModal.id);
            showToast("Ürün silindi");
        } else if (deleteModal.type === 'slider') {
            handleDeleteSlider(deleteModal.id);
            return; // handleDeleteSlider already closes modal
        }
        setDeleteModal({ open: false, type: 'category', id: '', name: '' });
    };

    const handleEditProduct = (productId: string) => {
        window.location.href = `/admin/products/${productId}`;
    };

    return (
        <div className="p-6 lg:p-8">
            {/* Toast Notification */}
            <AnimatePresence>
                {toast && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 20 }}
                        className="fixed bottom-8 right-[50px] z-50 flex items-center gap-2 px-4 py-3 rounded-xl bg-white text-black font-medium shadow-lg"
                    >
                        <Check className="w-5 h-5 text-black" />
                        {toast.message}
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Delete Confirmation Modal */}
            <AnimatePresence>
                {deleteModal.open && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm"
                        onClick={() => setDeleteModal({ open: false, type: 'category', id: '', name: '' })}
                    >
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            onClick={(e) => e.stopPropagation()}
                            className="bg-neutral-900 rounded-2xl p-6 max-w-md w-full mx-4 border border-white/10"
                        >
                            <div className="flex items-center gap-3 mb-4">
                                <div className="w-12 h-12 rounded-full bg-red-500/20 flex items-center justify-center">
                                    <Trash2 className="w-6 h-6 text-red-400" />
                                </div>
                                <div>
                                    <h3 className="text-lg font-bold text-white">Silmek istediğine emin misin?</h3>
                                    <p className="text-white/50 text-sm">{deleteModal.name}</p>
                                </div>
                            </div>
                            <p className="text-white/60 mb-6">
                                Bu {deleteModal.type === 'category' ? 'kategoriyi' : 'ürünü'} silmek üzeresin. Bu işlem geri alınamaz.
                            </p>
                            <div className="flex gap-3">
                                <button
                                    onClick={() => setDeleteModal({ open: false, type: 'category', id: '', name: '' })}
                                    className="flex-1 px-4 py-3 rounded-xl bg-white/10 text-white font-medium hover:bg-white/20 transition-colors"
                                >
                                    İptal
                                </button>
                                <button
                                    onClick={confirmDelete}
                                    className="flex-1 px-4 py-3 rounded-xl bg-red-500 text-white font-medium hover:bg-red-600 transition-colors"
                                >
                                    Sil
                                </button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

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
                <div className="flex gap-2">
                    <button
                        onClick={() => {
                            if (categories.length === 0 && products.length === 0) {
                                alert("Silinecek kategori veya ürün yok.");
                                return;
                            }
                            if (window.confirm("⚠️ DİKKAT!\n\nTüm kategoriler ve ürünler silinecektir.\n\nBu işlem geri alınamaz. Devam etmek istiyor musunuz?")) {
                                clearAllMenuData();
                            }
                        }}
                        className="flex items-center gap-2 px-4 py-3 bg-red-500/20 text-red-400 border border-red-500/30 rounded-xl font-semibold hover:bg-red-500/30 transition-colors"
                    >
                        <Trash2 className="w-5 h-5" />
                        Hepsini Sil
                    </button>
                    <button
                        onClick={() => window.location.href = '/admin/slider'}
                        className="flex items-center gap-2 px-4 py-3 bg-neutral-800 text-white border border-white/10 rounded-xl font-semibold hover:bg-neutral-700 transition-colors"
                    >
                        <Plus className="w-5 h-5" />
                        Slider
                    </button>
                    <button
                        onClick={() => setCategoryModal({ open: true })}
                        className="flex items-center gap-2 px-6 py-3 bg-white text-black rounded-xl font-semibold hover:bg-neutral-100 transition-colors shadow-lg"
                    >
                        <Plus className="w-5 h-5" />
                        Yeni Kategori
                    </button>
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
                            onDelete={() => handleDeleteCategory(category.id, category.name)}
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

                                {/* Featured Toggle */}
                                <div className="flex items-center gap-3 py-2">
                                    <label className="flex items-center gap-3 cursor-pointer">
                                        <input
                                            type="checkbox"
                                            checked={modalIsFeatured}
                                            onChange={(e) => setModalIsFeatured(e.target.checked)}
                                            className="w-5 h-5 rounded bg-neutral-800 border-white/20 text-white focus:ring-white/20"
                                        />
                                        <span className="text-white">Öne Çıkar (Üst bölümde göster)</span>
                                    </label>
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

            {/* Slider Modal */}
            <AnimatePresence>
                {sliderModal.open && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="absolute inset-0 bg-black/80 backdrop-blur-sm"
                            onClick={() => setSliderModal({ open: false })}
                        />
                        <motion.div
                            initial={{ scale: 0.95, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.95, opacity: 0 }}
                            className="relative bg-neutral-900 rounded-2xl p-6 w-full max-w-md border border-white/10"
                        >
                            <div className="flex items-center justify-between mb-6">
                                <h2 className="text-xl font-bold text-white">
                                    {sliderModal.slider ? "Slider Düzenle" : "Yeni Slider"}
                                </h2>
                                <button
                                    onClick={() => setSliderModal({ open: false })}
                                    className="p-2 text-white/60 hover:bg-white/10 rounded-lg"
                                >
                                    <X className="w-5 h-5" />
                                </button>
                            </div>

                            <div className="space-y-4">
                                <div>
                                    <label className="text-sm text-white/60 mb-2 block">Başlık *</label>
                                    <input
                                        type="text"
                                        value={sliderTitle}
                                        onChange={(e) => setSliderTitle(e.target.value)}
                                        placeholder="Slider başlığı"
                                        className="w-full px-4 py-3 bg-neutral-800 rounded-xl text-white placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-white/20"
                                        autoFocus
                                    />
                                </div>

                                <div>
                                    <label className="text-sm text-white/60 mb-2 block">Açıklama</label>
                                    <input
                                        type="text"
                                        value={sliderSubtitle}
                                        onChange={(e) => setSliderSubtitle(e.target.value)}
                                        placeholder="Alt başlık (opsiyonel)"
                                        className="w-full px-4 py-3 bg-neutral-800 rounded-xl text-white placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-white/20"
                                    />
                                </div>

                                <div>
                                    <label className="text-sm text-white/60 mb-2 block">Görsel *</label>
                                    <input
                                        type="file"
                                        accept="image/*,video/*"
                                        onChange={handleSliderImageUpload}
                                        className="hidden"
                                        id="slider-image-upload"
                                    />
                                    {sliderImage ? (
                                        <div className="relative h-32 rounded-xl overflow-hidden">
                                            <img src={sliderImage} alt="Preview" className="w-full h-full object-cover" />
                                            <button
                                                type="button"
                                                onClick={() => setSliderImage("")}
                                                className="absolute top-2 right-2 p-1.5 bg-red-500 rounded-lg text-white"
                                            >
                                                <X className="w-4 h-4" />
                                            </button>
                                        </div>
                                    ) : (
                                        <label
                                            htmlFor="slider-image-upload"
                                            className="flex flex-col items-center justify-center h-32 bg-neutral-800 rounded-xl border-2 border-dashed border-white/20 cursor-pointer hover:border-white/40"
                                        >
                                            <Image className="w-8 h-8 text-white/40 mb-2" />
                                            <span className="text-sm text-white/40">Resim yükle (max 2MB)</span>
                                        </label>
                                    )}
                                </div>

                                <div className="flex gap-3 pt-4">
                                    <button
                                        type="button"
                                        onClick={() => setSliderModal({ open: false })}
                                        className="flex-1 px-4 py-3 bg-white/10 text-white rounded-xl hover:bg-white/20 font-medium"
                                    >
                                        İptal
                                    </button>
                                    <button
                                        type="button"
                                        onClick={handleSaveSlider}
                                        disabled={isSaving || !sliderTitle.trim() || !sliderImage}
                                        className="flex-1 px-4 py-3 bg-white text-black rounded-xl font-semibold hover:bg-neutral-100 disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        {isSaving ? "Kaydediliyor..." : (sliderModal.slider ? "Kaydet" : "Ekle")}
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

