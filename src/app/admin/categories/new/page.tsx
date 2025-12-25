"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { ArrowLeft, Save, Utensils, Coffee, Pizza, Salad, IceCream, Wine, Soup, Cake, Fish, Beef } from "lucide-react";
import Link from "next/link";
import { useDataStore } from "@/context/DataStoreContext";

const iconOptions = [
    { id: "Utensils", icon: Utensils, label: "Çatal Bıçak" },
    { id: "Coffee", icon: Coffee, label: "Kahve" },
    { id: "Pizza", icon: Pizza, label: "Pizza" },
    { id: "Salad", icon: Salad, label: "Salata" },
    { id: "IceCream", icon: IceCream, label: "Dondurma" },
    { id: "Wine", icon: Wine, label: "İçecek" },
    { id: "Soup", icon: Soup, label: "Çorba" },
    { id: "Cake", icon: Cake, label: "Pasta" },
    { id: "Fish", icon: Fish, label: "Balık" },
    { id: "Beef", icon: Beef, label: "Et" },
];

export default function NewCategoryPage() {
    const router = useRouter();
    const { addCategory } = useDataStore();
    const [name, setName] = useState("");
    const [selectedIcon, setSelectedIcon] = useState("Utensils");
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!name.trim()) return;

        setIsSubmitting(true);

        // Add category to store
        addCategory({ name: name.trim(), icon: selectedIcon });

        // Redirect back to categories
        router.push("/admin/categories");
    };

    return (
        <div className="min-h-screen bg-neutral-950 p-6 lg:p-8">
            {/* Header */}
            <div className="flex items-center gap-4 mb-8">
                <Link
                    href="/admin/categories"
                    className="w-10 h-10 rounded-lg bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors"
                >
                    <ArrowLeft className="w-5 h-5 text-white" />
                </Link>
                <div>
                    <h1 className="text-2xl font-bold text-white">Yeni Kategori</h1>
                    <p className="text-white/40 text-sm">Menüye yeni kategori ekleyin</p>
                </div>
            </div>

            {/* Form */}
            <motion.form
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                onSubmit={handleSubmit}
                className="max-w-2xl space-y-6"
            >
                {/* Category Name */}
                <div className="bg-neutral-900 rounded-2xl p-6">
                    <h2 className="text-lg font-bold text-white mb-4">Kategori Bilgileri</h2>

                    <div className="space-y-4">
                        <div>
                            <label className="text-sm text-white/60 mb-2 block">Kategori Adı *</label>
                            <input
                                type="text"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                placeholder="Örn: Ana Yemekler"
                                required
                                className="w-full px-4 py-3 bg-neutral-800 rounded-xl text-white placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-white/20"
                            />
                        </div>
                    </div>
                </div>

                {/* Icon Selection */}
                <div className="bg-neutral-900 rounded-2xl p-6">
                    <h2 className="text-lg font-bold text-white mb-4">İkon Seçimi</h2>

                    <div className="grid grid-cols-5 gap-3">
                        {iconOptions.map((option) => {
                            const Icon = option.icon;
                            const isSelected = selectedIcon === option.id;

                            return (
                                <button
                                    key={option.id}
                                    type="button"
                                    onClick={() => setSelectedIcon(option.id)}
                                    className={`flex flex-col items-center gap-2 p-4 rounded-xl transition-all ${isSelected
                                        ? "bg-white text-black"
                                        : "bg-neutral-800 text-white/60 hover:bg-neutral-700"
                                        }`}
                                >
                                    <Icon className="w-6 h-6" />
                                    <span className="text-xs">{option.label}</span>
                                </button>
                            );
                        })}
                    </div>
                </div>

                {/* Actions */}
                <div className="flex gap-4">
                    <Link
                        href="/admin/categories"
                        className="flex-1 py-4 text-center bg-neutral-800 text-white rounded-xl font-semibold hover:bg-neutral-700 transition-colors"
                    >
                        İptal
                    </Link>
                    <motion.button
                        whileTap={{ scale: 0.98 }}
                        type="submit"
                        disabled={!name.trim() || isSubmitting}
                        className="flex-1 flex items-center justify-center gap-2 py-4 bg-white text-black rounded-xl font-semibold hover:bg-neutral-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {isSubmitting ? (
                            <div className="w-5 h-5 border-2 border-black/20 border-t-black rounded-full animate-spin" />
                        ) : (
                            <>
                                <Save className="w-5 h-5" />
                                Kaydet
                            </>
                        )}
                    </motion.button>
                </div>
            </motion.form>
        </div>
    );
}
