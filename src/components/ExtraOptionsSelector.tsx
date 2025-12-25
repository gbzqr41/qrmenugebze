"use client";

import { motion } from "framer-motion";
import { Check, Plus } from "lucide-react";
import type { ProductExtra } from "@/data/mockData";

interface ExtraOptionsSelectorProps {
    extras: ProductExtra[];
    selectedExtras: string[];
    onExtrasChange: (extraIds: string[]) => void;
}

export default function ExtraOptionsSelector({
    extras,
    selectedExtras,
    onExtrasChange,
}: ExtraOptionsSelectorProps) {
    const toggleExtra = (extraId: string) => {
        if (selectedExtras.includes(extraId)) {
            onExtrasChange(selectedExtras.filter((id) => id !== extraId));
        } else {
            onExtrasChange([...selectedExtras, extraId]);
        }
    };

    return (
        <div className="space-y-3">
            <h3 className="text-sm font-medium text-white/60 uppercase tracking-wider">
                Ekstra Malzemeler
            </h3>
            <div className="space-y-2">
                {extras.map((extra) => {
                    const isSelected = selectedExtras.includes(extra.id);

                    return (
                        <motion.button
                            key={extra.id}
                            whileTap={{ scale: 0.98 }}
                            onClick={() => toggleExtra(extra.id)}
                            className={`w-full flex items-center justify-between p-4 rounded-xl transition-all ${isSelected
                                    ? "bg-white/10 border border-white/30"
                                    : "bg-neutral-900 border border-transparent hover:bg-neutral-800"
                                }`}
                        >
                            <div className="flex items-center gap-3">
                                <motion.div
                                    animate={{
                                        backgroundColor: isSelected ? "#fff" : "transparent",
                                        borderColor: isSelected ? "#fff" : "rgba(255,255,255,0.3)",
                                    }}
                                    className="w-6 h-6 rounded-lg border-2 flex items-center justify-center"
                                >
                                    {isSelected ? (
                                        <Check className="w-4 h-4 text-black" />
                                    ) : (
                                        <Plus className="w-4 h-4 text-white/40" />
                                    )}
                                </motion.div>
                                <span className="font-medium text-white">{extra.name}</span>
                            </div>

                            <span className={`font-semibold ${isSelected ? "text-white" : "text-white/60"}`}>
                                +₺{extra.price}
                            </span>
                        </motion.button>
                    );
                })}
            </div>
        </div>
    );
}
