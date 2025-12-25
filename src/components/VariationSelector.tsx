"use client";

import { motion } from "framer-motion";
import { Check } from "lucide-react";
import type { ProductVariation } from "@/data/mockData";

interface VariationSelectorProps {
    variations: ProductVariation[];
    selectedVariation: string | null;
    onVariationChange: (variationId: string) => void;
    basePrice: number;
}

export default function VariationSelector({
    variations,
    selectedVariation,
    onVariationChange,
    basePrice,
}: VariationSelectorProps) {
    return (
        <div className="space-y-3">
            <h3 className="text-sm font-medium text-white/60 uppercase tracking-wider">
                Boyut Seçin
            </h3>
            <div className="space-y-2">
                {variations.map((variation) => {
                    const isSelected = selectedVariation === variation.id;
                    const finalPrice = basePrice + variation.priceModifier;

                    return (
                        <motion.button
                            key={variation.id}
                            whileTap={{ scale: 0.98 }}
                            onClick={() => onVariationChange(variation.id)}
                            className={`w-full flex items-center justify-between p-4 rounded-xl transition-all ${isSelected
                                    ? "bg-white text-black"
                                    : "bg-neutral-900 text-white hover:bg-neutral-800"
                                }`}
                        >
                            <div className="flex items-center gap-3">
                                <div
                                    className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all ${isSelected
                                            ? "border-black bg-black"
                                            : "border-white/30"
                                        }`}
                                >
                                    {isSelected && <Check className="w-3 h-3 text-white" />}
                                </div>
                                <span className="font-medium">{variation.name}</span>
                            </div>

                            <div className="flex items-center gap-2">
                                {variation.priceModifier !== 0 && (
                                    <span
                                        className={`text-sm ${isSelected ? "text-black/60" : "text-white/40"
                                            }`}
                                    >
                                        {variation.priceModifier > 0 ? "+" : ""}
                                        ₺{variation.priceModifier}
                                    </span>
                                )}
                                <span className="font-semibold">₺{finalPrice}</span>
                            </div>
                        </motion.button>
                    );
                })}
            </div>
        </div>
    );
}
