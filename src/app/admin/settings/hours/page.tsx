"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Save, Clock, Plus, Trash2 } from "lucide-react";
import { useDataStore } from "@/context/DataStoreContext";

interface WorkingHour {
    day: string;
    open: string;
    close: string;
    isClosed: boolean;
}

interface SpecialHour {
    date: string;
    label: string;
    open: string;
    close: string;
    isClosed: boolean;
}

const defaultWorkingHours: WorkingHour[] = [
    { day: "Pazartesi", open: "09:00", close: "22:00", isClosed: false },
    { day: "Salı", open: "09:00", close: "22:00", isClosed: false },
    { day: "Çarşamba", open: "09:00", close: "22:00", isClosed: false },
    { day: "Perşembe", open: "09:00", close: "22:00", isClosed: false },
    { day: "Cuma", open: "09:00", close: "23:00", isClosed: false },
    { day: "Cumartesi", open: "10:00", close: "23:00", isClosed: false },
    { day: "Pazar", open: "10:00", close: "21:00", isClosed: false },
];

export default function HoursSettingsPage() {
    const { business, updateBusiness } = useDataStore();

    const [workingHours, setWorkingHours] = useState<WorkingHour[]>(defaultWorkingHours);
    const [specialHours, setSpecialHours] = useState<SpecialHour[]>([]);
    const [isSaved, setIsSaved] = useState(false);

    // Load from business on mount
    useEffect(() => {
        if (business.workingHours && business.workingHours.length > 0) {
            setWorkingHours(business.workingHours);
        }
    }, [business.workingHours]);

    const updateWorkingHour = (
        index: number,
        field: keyof WorkingHour,
        value: string | boolean
    ) => {
        setWorkingHours((prev) =>
            prev.map((wh, i) => (i === index ? { ...wh, [field]: value } : wh))
        );
    };

    const addSpecialHour = () => {
        setSpecialHours([
            ...specialHours,
            { date: "", label: "", open: "09:00", close: "22:00", isClosed: false },
        ]);
    };

    const removeSpecialHour = (index: number) => {
        setSpecialHours(specialHours.filter((_, i) => i !== index));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // Save to DataStore (which saves to localStorage)
        updateBusiness({ workingHours });
        setIsSaved(true);
        setTimeout(() => setIsSaved(false), 2000);
        alert("✓ Çalışma saatleri kaydedildi!");
    };

    return (
        <form onSubmit={handleSubmit} className="max-w-2xl space-y-6">
            {/* Regular Hours */}
            <div className="bg-neutral-900 rounded-2xl p-6 border border-white/5 space-y-4">
                <div className="flex items-center gap-2 mb-2">
                    <Clock className="w-5 h-5 text-white" />
                    <h2 className="text-lg font-bold text-white">Haftalık Çalışma Saatleri</h2>
                </div>

                <div className="space-y-3">
                    {workingHours.map((wh, index) => (
                        <div
                            key={wh.day}
                            className="flex items-center gap-4 p-4 bg-neutral-800 rounded-xl"
                        >
                            <span className="w-24 text-white font-medium">{wh.day}</span>

                            <label className="flex items-center gap-2 cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={wh.isClosed}
                                    onChange={(e) => updateWorkingHour(index, "isClosed", e.target.checked)}
                                    className="w-4 h-4 rounded bg-neutral-700 border-white/20 accent-white"
                                />
                                <span className="text-sm text-white/60">Kapalı</span>
                            </label>

                            {!wh.isClosed && (
                                <div className="flex items-center gap-2 ml-auto">
                                    <input
                                        type="time"
                                        value={wh.open}
                                        onChange={(e) => updateWorkingHour(index, "open", e.target.value)}
                                        className="px-3 py-2 bg-neutral-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-white/20"
                                    />
                                    <span className="text-white/40">-</span>
                                    <input
                                        type="time"
                                        value={wh.close}
                                        onChange={(e) => updateWorkingHour(index, "close", e.target.value)}
                                        className="px-3 py-2 bg-neutral-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-white/20"
                                    />
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </div>

            {/* Special Hours */}
            <div className="bg-neutral-900 rounded-2xl p-6 border border-white/5 space-y-4">
                <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                        <Clock className="w-5 h-5 text-amber-400" />
                        <h2 className="text-lg font-bold text-white">Özel Günler</h2>
                    </div>
                    <button
                        type="button"
                        onClick={addSpecialHour}
                        className="flex items-center gap-2 px-3 py-2 bg-white/10 rounded-lg text-white/80 text-sm hover:bg-white/20"
                    >
                        <Plus className="w-4 h-4" />
                        Ekle
                    </button>
                </div>

                <p className="text-sm text-white/40 mb-4">
                    Tatil günleri, özel etkinlikler için farklı saatler belirleyin
                </p>

                <div className="space-y-3">
                    {specialHours.map((sh, index) => (
                        <div
                            key={index}
                            className="flex items-center gap-3 p-4 bg-neutral-800 rounded-xl"
                        >
                            <input
                                type="date"
                                value={sh.date}
                                onChange={(e) => {
                                    const updated = [...specialHours];
                                    updated[index].date = e.target.value;
                                    setSpecialHours(updated);
                                }}
                                className="px-3 py-2 bg-neutral-700 rounded-lg text-white focus:outline-none"
                            />
                            <input
                                type="text"
                                value={sh.label}
                                onChange={(e) => {
                                    const updated = [...specialHours];
                                    updated[index].label = e.target.value;
                                    setSpecialHours(updated);
                                }}
                                placeholder="Etiket (örn: Yılbaşı)"
                                className="flex-1 px-3 py-2 bg-neutral-700 rounded-lg text-white placeholder:text-white/30 focus:outline-none"
                            />
                            <label className="flex items-center gap-2">
                                <input
                                    type="checkbox"
                                    checked={sh.isClosed}
                                    onChange={(e) => {
                                        const updated = [...specialHours];
                                        updated[index].isClosed = e.target.checked;
                                        setSpecialHours(updated);
                                    }}
                                    className="w-4 h-4 accent-white"
                                />
                                <span className="text-sm text-white/60">Kapalı</span>
                            </label>
                            <button
                                type="button"
                                onClick={() => removeSpecialHour(index)}
                                className="p-2 text-red-400 hover:bg-red-500/20 rounded-lg"
                            >
                                <Trash2 className="w-4 h-4" />
                            </button>
                        </div>
                    ))}
                </div>
            </div>

            {/* Submit */}
            <motion.button
                whileTap={{ scale: 0.98 }}
                type="submit"
                className={`w-full flex items-center justify-center gap-2 py-4 rounded-xl font-semibold transition-colors ${isSaved
                    ? "bg-green-500 text-white"
                    : "bg-white text-black hover:bg-neutral-100"
                    }`}
            >
                <Save className="w-5 h-5" />
                {isSaved ? "✓ Kaydedildi" : "Kaydet"}
            </motion.button>
        </form>
    );
}
