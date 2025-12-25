"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { Lock, Mail, Eye, EyeOff, ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function LoginPage() {
    const router = useRouter();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setIsLoading(true);

        // Demo login - gerçek uygulamada API çağrısı yapılır
        await new Promise((resolve) => setTimeout(resolve, 1000));

        // Demo credentials
        if (email === "admin@antigravity.com" && password === "admin123") {
            // Başarılı giriş - gerçek uygulamada session/token kaydedilir
            localStorage.setItem("isAdminLoggedIn", "true");
            router.push("/admin");
        } else {
            setError("E-posta veya şifre hatalı");
            setIsLoading(false);
        }
    };

    return (
        <main className="min-h-screen bg-black flex items-center justify-center p-6">
            {/* Back Button */}
            <Link
                href="/"
                className="absolute top-6 left-6 w-12 h-12 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors"
            >
                <ArrowLeft className="w-5 h-5 text-white" />
            </Link>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="w-full max-w-md"
            >
                {/* Logo */}
                <motion.div
                    initial={{ scale: 0.8 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.1 }}
                    className="flex flex-col items-center mb-8"
                >
                    <div className="w-20 h-20 rounded-2xl bg-white flex items-center justify-center mb-4 shadow-2xl">
                        <span className="text-3xl font-bold text-black">AG</span>
                    </div>
                    <h1 className="text-2xl font-bold text-white">Admin Girişi</h1>
                    <p className="text-white/40 mt-2">Yönetim paneline erişin</p>
                </motion.div>

                {/* Login Form */}
                <motion.form
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.2 }}
                    onSubmit={handleSubmit}
                    className="space-y-4"
                >
                    {/* Email */}
                    <div>
                        <label className="text-sm text-white/60 mb-2 block">E-posta</label>
                        <div className="relative">
                            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="admin@antigravity.com"
                                required
                                className="w-full pl-12 pr-4 py-4 bg-neutral-900 rounded-xl text-white placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-white/20 border border-white/5"
                            />
                        </div>
                    </div>

                    {/* Password */}
                    <div>
                        <label className="text-sm text-white/60 mb-2 block">Şifre</label>
                        <div className="relative">
                            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
                            <input
                                type={showPassword ? "text" : "password"}
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="••••••••"
                                required
                                className="w-full pl-12 pr-12 py-4 bg-neutral-900 rounded-xl text-white placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-white/20 border border-white/5"
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-4 top-1/2 -translate-y-1/2 text-white/40 hover:text-white transition-colors"
                            >
                                {showPassword ? (
                                    <EyeOff className="w-5 h-5" />
                                ) : (
                                    <Eye className="w-5 h-5" />
                                )}
                            </button>
                        </div>
                    </div>

                    {/* Error Message */}
                    {error && (
                        <motion.p
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="text-red-400 text-sm text-center"
                        >
                            {error}
                        </motion.p>
                    )}

                    {/* Submit Button */}
                    <motion.button
                        whileTap={{ scale: 0.98 }}
                        type="submit"
                        disabled={isLoading}
                        className="w-full py-4 bg-white text-black rounded-xl font-semibold hover:bg-neutral-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    >
                        {isLoading ? (
                            <div className="w-5 h-5 border-2 border-black/20 border-t-black rounded-full animate-spin" />
                        ) : (
                            "Giriş Yap"
                        )}
                    </motion.button>
                </motion.form>

                {/* Demo Credentials */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.3 }}
                    className="mt-8 p-4 bg-neutral-900 rounded-xl border border-white/5"
                >
                    <p className="text-sm text-white/40 text-center mb-2">Demo Giriş Bilgileri</p>
                    <div className="text-center text-sm text-white/60">
                        <p>E-posta: <span className="text-white">admin@antigravity.com</span></p>
                        <p>Şifre: <span className="text-white">admin123</span></p>
                    </div>
                </motion.div>
            </motion.div>
        </main>
    );
}
