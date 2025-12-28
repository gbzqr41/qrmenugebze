"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import { Lock, Phone, Eye, EyeOff, ArrowRight } from "lucide-react";
import Link from "next/link";

type ViewMode = "login" | "forgot" | "otp" | "newPassword" | "register";

export default function LoginPage() {
    const router = useRouter();
    const [viewMode, setViewMode] = useState<ViewMode>("login");
    const [phone, setPhone] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    // Forgot password states
    const [forgotPhone, setForgotPhone] = useState("");
    const [otp, setOtp] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [showNewPassword, setShowNewPassword] = useState(false);

    // Valid credentials
    const VALID_PHONE = "5551111111";
    const VALID_PASSWORD = "80148014a";
    const VALID_OTP = "111111";

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setIsLoading(true);

        await new Promise((resolve) => setTimeout(resolve, 1000));

        if (phone === VALID_PHONE && password === VALID_PASSWORD) {
            localStorage.setItem("isAdminLoggedIn", "true");
            router.push("/admin");
        } else {
            setError("Telefon veya şifre hatalı");
            setIsLoading(false);
        }
    };

    const handleForgotSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setIsLoading(true);

        await new Promise((resolve) => setTimeout(resolve, 800));

        if (forgotPhone === VALID_PHONE) {
            setViewMode("otp");
        } else {
            setError("Bu telefon numarası kayıtlı değil");
        }
        setIsLoading(false);
    };

    const handleOtpSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setIsLoading(true);

        await new Promise((resolve) => setTimeout(resolve, 800));

        if (otp === VALID_OTP) {
            setViewMode("newPassword");
        } else {
            setError("Doğrulama kodu hatalı");
        }
        setIsLoading(false);
    };

    const handleNewPasswordSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");

        if (newPassword.length < 8) {
            setError("Şifre en az 8 karakter olmalı");
            return;
        }

        if (!/[a-zA-Z]/.test(newPassword)) {
            setError("Şifre en az bir harf içermeli");
            return;
        }

        if (newPassword !== confirmPassword) {
            setError("Şifreler eşleşmiyor");
            return;
        }

        setIsLoading(true);
        await new Promise((resolve) => setTimeout(resolve, 800));

        // Reset successful
        setViewMode("login");
        setForgotPhone("");
        setOtp("");
        setNewPassword("");
        setConfirmPassword("");
        setIsLoading(false);
    };

    const getStepNumber = () => {
        switch (viewMode) {
            case "forgot": return 1;
            case "otp": return 2;
            case "newPassword": return 3;
            default: return 0;
        }
    };

    const resetToLogin = () => {
        setViewMode("login");
        setError("");
        setForgotPhone("");
        setOtp("");
        setNewPassword("");
        setConfirmPassword("");
    };

    return (
        <main className="min-h-screen bg-black flex items-center justify-center p-6">
            {/* Logo */}
            <Link
                href="/"
                className="absolute top-6 left-6 text-[22px] font-bold text-white hover:opacity-80 transition-opacity"
            >
                GEBZEM
            </Link>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="w-full max-w-md"
            >
                <AnimatePresence mode="wait">
                    {/* LOGIN VIEW */}
                    {viewMode === "login" && (
                        <motion.div
                            key="login"
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: 20 }}
                        >
                            <div className="text-center mb-8">
                                <h1 className="text-2xl font-bold text-white">Giriş Yap</h1>
                                <p className="text-white/40 mt-2">Yönetim paneline erişin</p>
                            </div>

                            <form onSubmit={handleLogin} className="space-y-4">
                                {/* Phone */}
                                <div>
                                    <label className="text-sm text-white/60 mb-2 block">Telefon</label>
                                    <div className="relative">
                                        <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
                                        <input
                                            type="tel"
                                            value={phone}
                                            onChange={(e) => setPhone(e.target.value.replace(/\D/g, ""))}
                                            placeholder="555 XXX XX XX"
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
                                            {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                        </button>
                                    </div>
                                </div>

                                {/* Error */}
                                {error && (
                                    <motion.p
                                        initial={{ opacity: 0, y: -10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        className="text-red-400 text-sm text-center"
                                    >
                                        {error}
                                    </motion.p>
                                )}

                                {/* Submit */}
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
                            </form>

                            {/* Links */}
                            <div className="mt-6 flex flex-col gap-3">
                                <button
                                    onClick={() => { setViewMode("forgot"); setError(""); }}
                                    className="text-sm text-white/60 hover:text-white transition-colors"
                                >
                                    Şifremi Unuttum
                                </button>
                                <button
                                    onClick={() => { setViewMode("register"); setError(""); }}
                                    className="text-sm text-white/60 hover:text-white transition-colors"
                                >
                                    Kayıt Ol
                                </button>
                            </div>
                        </motion.div>
                    )}

                    {/* FORGOT PASSWORD VIEW */}
                    {viewMode === "forgot" && (
                        <motion.div
                            key="forgot"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                        >
                            <div className="text-center mb-8">
                                <h1 className="text-2xl font-bold text-white">Şifremi Unuttum</h1>
                                <p className="text-white/40 mt-2">Kayıtlı telefon numaranızı girin</p>
                            </div>

                            <form onSubmit={handleForgotSubmit} className="space-y-4">
                                <div>
                                    <label className="text-sm text-white/60 mb-2 block">Telefon</label>
                                    <div className="relative">
                                        <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
                                        <input
                                            type="tel"
                                            value={forgotPhone}
                                            onChange={(e) => setForgotPhone(e.target.value.replace(/\D/g, ""))}
                                            placeholder="555 XXX XX XX"
                                            required
                                            className="w-full pl-12 pr-4 py-4 bg-neutral-900 rounded-xl text-white placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-white/20 border border-white/5"
                                        />
                                    </div>
                                </div>

                                {error && (
                                    <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-red-400 text-sm text-center">
                                        {error}
                                    </motion.p>
                                )}

                                <motion.button
                                    whileTap={{ scale: 0.98 }}
                                    type="submit"
                                    disabled={isLoading}
                                    className="w-full py-4 bg-white text-black rounded-xl font-semibold hover:bg-neutral-100 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                                >
                                    {isLoading ? (
                                        <div className="w-5 h-5 border-2 border-black/20 border-t-black rounded-full animate-spin" />
                                    ) : (
                                        <>
                                            Devam Et
                                            <ArrowRight className="w-4 h-4" />
                                        </>
                                    )}
                                </motion.button>
                            </form>

                            <button onClick={resetToLogin} className="mt-6 text-sm text-white/60 hover:text-white transition-colors w-full text-center">
                                Giriş sayfasına dön
                            </button>

                            {/* Step Indicator */}
                            <div className="mt-8 flex items-center justify-center gap-2">
                                {[1, 2, 3].map((step) => (
                                    <div
                                        key={step}
                                        className={`w-8 h-1 rounded-full transition-colors ${getStepNumber() >= step ? "bg-white" : "bg-white/20"}`}
                                    />
                                ))}
                            </div>
                            <p className="text-center text-xs text-white/40 mt-2">Adım 1/3 - Telefon Doğrulama</p>
                        </motion.div>
                    )}

                    {/* OTP VIEW */}
                    {viewMode === "otp" && (
                        <motion.div
                            key="otp"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                        >
                            <div className="text-center mb-8">
                                <h1 className="text-2xl font-bold text-white">Doğrulama Kodu</h1>
                                <p className="text-white/40 mt-2">6 haneli kodu girin</p>
                            </div>

                            <form onSubmit={handleOtpSubmit} className="space-y-4">
                                <div>
                                    <label className="text-sm text-white/60 mb-2 block">Doğrulama Kodu</label>
                                    <input
                                        type="text"
                                        value={otp}
                                        onChange={(e) => setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))}
                                        placeholder="000000"
                                        required
                                        maxLength={6}
                                        className="w-full px-4 py-4 bg-neutral-900 rounded-xl text-white text-center text-2xl tracking-[0.5em] placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-white/20 border border-white/5"
                                    />
                                </div>

                                {error && (
                                    <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-red-400 text-sm text-center">
                                        {error}
                                    </motion.p>
                                )}

                                <motion.button
                                    whileTap={{ scale: 0.98 }}
                                    type="submit"
                                    disabled={isLoading || otp.length !== 6}
                                    className="w-full py-4 bg-white text-black rounded-xl font-semibold hover:bg-neutral-100 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                                >
                                    {isLoading ? (
                                        <div className="w-5 h-5 border-2 border-black/20 border-t-black rounded-full animate-spin" />
                                    ) : (
                                        <>
                                            Doğrula
                                            <ArrowRight className="w-4 h-4" />
                                        </>
                                    )}
                                </motion.button>
                            </form>

                            <button onClick={resetToLogin} className="mt-6 text-sm text-white/60 hover:text-white transition-colors w-full text-center">
                                Giriş sayfasına dön
                            </button>

                            {/* Step Indicator */}
                            <div className="mt-8 flex items-center justify-center gap-2">
                                {[1, 2, 3].map((step) => (
                                    <div
                                        key={step}
                                        className={`w-8 h-1 rounded-full transition-colors ${getStepNumber() >= step ? "bg-white" : "bg-white/20"}`}
                                    />
                                ))}
                            </div>
                            <p className="text-center text-xs text-white/40 mt-2">Adım 2/3 - Kod Doğrulama</p>
                        </motion.div>
                    )}

                    {/* NEW PASSWORD VIEW */}
                    {viewMode === "newPassword" && (
                        <motion.div
                            key="newPassword"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                        >
                            <div className="text-center mb-8">
                                <h1 className="text-2xl font-bold text-white">Yeni Şifre</h1>
                                <p className="text-white/40 mt-2">En az 8 karakter ve 1 harf içermeli</p>
                            </div>

                            <form onSubmit={handleNewPasswordSubmit} className="space-y-4">
                                <div>
                                    <label className="text-sm text-white/60 mb-2 block">Yeni Şifre</label>
                                    <div className="relative">
                                        <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
                                        <input
                                            type={showNewPassword ? "text" : "password"}
                                            value={newPassword}
                                            onChange={(e) => setNewPassword(e.target.value)}
                                            placeholder="••••••••"
                                            required
                                            className="w-full pl-12 pr-12 py-4 bg-neutral-900 rounded-xl text-white placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-white/20 border border-white/5"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowNewPassword(!showNewPassword)}
                                            className="absolute right-4 top-1/2 -translate-y-1/2 text-white/40 hover:text-white transition-colors"
                                        >
                                            {showNewPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                        </button>
                                    </div>
                                </div>

                                <div>
                                    <label className="text-sm text-white/60 mb-2 block">Şifre Tekrar</label>
                                    <div className="relative">
                                        <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
                                        <input
                                            type="password"
                                            value={confirmPassword}
                                            onChange={(e) => setConfirmPassword(e.target.value)}
                                            placeholder="••••••••"
                                            required
                                            className="w-full pl-12 pr-4 py-4 bg-neutral-900 rounded-xl text-white placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-white/20 border border-white/5"
                                        />
                                    </div>
                                </div>

                                {error && (
                                    <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-red-400 text-sm text-center">
                                        {error}
                                    </motion.p>
                                )}

                                <motion.button
                                    whileTap={{ scale: 0.98 }}
                                    type="submit"
                                    disabled={isLoading}
                                    className="w-full py-4 bg-white text-black rounded-xl font-semibold hover:bg-neutral-100 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                                >
                                    {isLoading ? (
                                        <div className="w-5 h-5 border-2 border-black/20 border-t-black rounded-full animate-spin" />
                                    ) : (
                                        "Şifreyi Güncelle"
                                    )}
                                </motion.button>
                            </form>

                            {/* Step Indicator */}
                            <div className="mt-8 flex items-center justify-center gap-2">
                                {[1, 2, 3].map((step) => (
                                    <div
                                        key={step}
                                        className={`w-8 h-1 rounded-full transition-colors ${getStepNumber() >= step ? "bg-white" : "bg-white/20"}`}
                                    />
                                ))}
                            </div>
                            <p className="text-center text-xs text-white/40 mt-2">Adım 3/3 - Şifre Yenileme</p>
                        </motion.div>
                    )}

                    {/* REGISTER VIEW */}
                    {viewMode === "register" && (
                        <motion.div
                            key="register"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                        >
                            <div className="text-center mb-8">
                                <h1 className="text-2xl font-bold text-white">Kayıt Ol</h1>
                                <p className="text-white/40 mt-2">Yeni hesap oluşturun</p>
                            </div>

                            <div className="p-6 bg-neutral-900 rounded-xl border border-white/5 text-center">
                                <p className="text-white/60">Kayıt sistemi yakında aktif olacak.</p>
                            </div>

                            <button onClick={resetToLogin} className="mt-6 text-sm text-white/60 hover:text-white transition-colors w-full text-center">
                                Giriş sayfasına dön
                            </button>
                        </motion.div>
                    )}
                </AnimatePresence>
            </motion.div>
        </main>
    );
}
