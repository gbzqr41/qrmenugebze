"use client";

import { motion } from "framer-motion";
import { business } from "@/data/mockData";

export default function Header() {
    return (
        <motion.header
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="relative w-full bg-black text-white pt-4 pb-2 px-5"
        >
            <div className="flex items-center gap-4">
                {/* Logo */}
                <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: 0.1, duration: 0.5 }}
                    className="w-14 h-14 rounded-xl bg-white flex items-center justify-center shadow-lg overflow-hidden flex-shrink-0"
                >
                    <span className="text-xl font-bold text-black">AG</span>
                </motion.div>

                {/* Name & Info */}
                <div className="flex-1 min-w-0">
                    <motion.h1
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.2, duration: 0.5 }}
                        className="text-lg font-bold truncate"
                    >
                        {business.name}
                    </motion.h1>
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.3, duration: 0.5 }}
                        className="flex items-center gap-2 text-white/60"
                    >
                        <span className="text-sm truncate">
                            {business.cuisineTypes.slice(0, 2).join(" • ")}
                        </span>
                    </motion.div>
                </div>
            </div>
        </motion.header>
    );
}
