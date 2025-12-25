"use client";

import { motion } from "framer-motion";
import { Minus, Plus } from "lucide-react";

interface QuantitySelectorProps {
    quantity: number;
    onQuantityChange: (quantity: number) => void;
    min?: number;
    max?: number;
}

export default function QuantitySelector({
    quantity,
    onQuantityChange,
    min = 1,
    max = 10,
}: QuantitySelectorProps) {
    const decrease = () => {
        if (quantity > min) {
            onQuantityChange(quantity - 1);
        }
    };

    const increase = () => {
        if (quantity < max) {
            onQuantityChange(quantity + 1);
        }
    };

    return (
        <div className="flex items-center gap-4">
            <motion.button
                whileTap={{ scale: 0.9 }}
                onClick={decrease}
                disabled={quantity <= min}
                className={`w-12 h-12 rounded-full flex items-center justify-center transition-all ${quantity <= min
                        ? "bg-neutral-800 text-neutral-600 cursor-not-allowed"
                        : "bg-neutral-800 text-white hover:bg-neutral-700"
                    }`}
            >
                <Minus className="w-5 h-5" />
            </motion.button>

            <motion.span
                key={quantity}
                initial={{ scale: 1.2 }}
                animate={{ scale: 1 }}
                className="text-2xl font-bold text-white w-8 text-center"
            >
                {quantity}
            </motion.span>

            <motion.button
                whileTap={{ scale: 0.9 }}
                onClick={increase}
                disabled={quantity >= max}
                className={`w-12 h-12 rounded-full flex items-center justify-center transition-all ${quantity >= max
                        ? "bg-neutral-800 text-neutral-600 cursor-not-allowed"
                        : "bg-white text-black hover:bg-neutral-200"
                    }`}
            >
                <Plus className="w-5 h-5" />
            </motion.button>
        </div>
    );
}
