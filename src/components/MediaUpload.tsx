"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    X,
    Image as ImageIcon,
    Video,
    Plus,
    Trash2,
    Check,
    AlertCircle,
} from "lucide-react";

interface MediaUploadProps {
    value: string[];
    onChange: (urls: string[]) => void;
    maxFiles?: number;
    acceptVideo?: boolean;
    label?: string;
}

// Helper function to detect media type from URL or data URL
function detectMediaType(url: string): "image" | "video" {
    if (url.startsWith("data:video/")) return "video";
    if (url.startsWith("data:image/")) return "image";
    const lowerUrl = url.toLowerCase();
    if (lowerUrl.includes(".mp4") || lowerUrl.includes(".webm") || lowerUrl.includes(".mov") || lowerUrl.includes(".avi")) {
        return "video";
    }
    return "image";
}

// Generate a stable hash for a URL
function hashUrl(url: string): string {
    let hash = 0;
    for (let i = 0; i < Math.min(url.length, 100); i++) {
        const char = url.charCodeAt(i);
        hash = ((hash << 5) - hash) + char;
        hash = hash & hash;
    }
    return `media-${hash}`;
}

export default function MediaUpload({
    value = [],
    onChange,
    maxFiles = 10,
    acceptVideo = true,
    label = "Medya Yükle",
}: MediaUploadProps) {
    const [isDragging, setIsDragging] = useState(false);
    const [isUploading, setIsUploading] = useState(false);
    const [uploadProgress, setUploadProgress] = useState(0);
    const [error, setError] = useState<string | null>(null);
    const [successMessage, setSuccessMessage] = useState<string | null>(null);
    // Local state to track uploaded media before parent sync
    const [localMedia, setLocalMedia] = useState<string[]>(value);
    const fileInputRef = useRef<HTMLInputElement>(null);

    // Sync local state with prop value
    useEffect(() => {
        console.log("[MediaUpload] value prop changed, length:", value.length);
        setLocalMedia(value);
    }, [value]);

    // Log when local media changes
    useEffect(() => {
        console.log("[MediaUpload] localMedia updated, length:", localMedia.length);
    }, [localMedia]);

    // Clear success message after 3 seconds
    useEffect(() => {
        if (successMessage) {
            const timer = setTimeout(() => setSuccessMessage(null), 3000);
            return () => clearTimeout(timer);
        }
    }, [successMessage]);

    const handleDragOver = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(true);
    }, []);

    const handleDragLeave = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(false);
    }, []);

    const fileToDataUrl = (file: File): Promise<string> => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = () => {
                const result = reader.result as string;
                console.log(`[MediaUpload] File converted: ${file.name}, size: ${(result.length / 1024).toFixed(2)}KB`);
                resolve(result);
            };
            reader.onerror = (err) => {
                console.error(`[MediaUpload] FileReader error:`, err);
                reject(err);
            };
            reader.readAsDataURL(file);
        });
    };

    const processFiles = useCallback(async (files: FileList | File[]) => {
        console.log(`[MediaUpload] Processing ${files.length} files...`);
        setError(null);
        setSuccessMessage(null);
        const validFiles: File[] = [];
        const fileArray = Array.from(files);

        for (const file of fileArray) {
            console.log(`[MediaUpload] Checking: ${file.name}, type: ${file.type}, size: ${(file.size / 1024 / 1024).toFixed(2)}MB`);

            const isImage = file.type.startsWith("image/");
            const isVideo = file.type.startsWith("video/");

            if (!isImage && !isVideo) {
                setError(`"${file.name}" desteklenmeyen format`);
                continue;
            }

            if (isVideo && !acceptVideo) {
                setError(`Video desteklenmiyor`);
                continue;
            }

            const maxSize = isVideo ? 5 * 1024 * 1024 : 2 * 1024 * 1024;
            if (file.size > maxSize) {
                setError(`"${file.name}" çok büyük (max: ${isVideo ? "5MB" : "2MB"})`);
                continue;
            }

            validFiles.push(file);
        }

        if (validFiles.length === 0) return;

        if (localMedia.length + validFiles.length > maxFiles) {
            setError(`Max ${maxFiles} dosya`);
            return;
        }

        setIsUploading(true);
        setUploadProgress(0);

        try {
            const newUrls: string[] = [];

            for (let i = 0; i < validFiles.length; i++) {
                const file = validFiles[i];
                const dataUrl = await fileToDataUrl(file);
                newUrls.push(dataUrl);
                setUploadProgress(((i + 1) / validFiles.length) * 100);
            }

            // Update local state immediately for preview
            const updatedMedia = [...localMedia, ...newUrls];
            console.log("[MediaUpload] Setting localMedia with", updatedMedia.length, "items");
            setLocalMedia(updatedMedia);

            // Notify parent
            console.log("[MediaUpload] Calling onChange with", updatedMedia.length, "items");
            onChange(updatedMedia);

            setSuccessMessage(`${validFiles.length} dosya yüklendi!`);
        } catch (err) {
            console.error(`[MediaUpload] Error:`, err);
            setError("Yükleme hatası");
        } finally {
            setIsUploading(false);
            setUploadProgress(0);
        }
    }, [localMedia, onChange, maxFiles, acceptVideo]);

    const handleDrop = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(false);
        if (e.dataTransfer.files?.length > 0) {
            processFiles(e.dataTransfer.files);
        }
    }, [processFiles]);

    const handleFileSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files?.length > 0) {
            processFiles(e.target.files);
            e.target.value = "";
        }
    }, [processFiles]);

    const handleRemove = useCallback((index: number) => {
        const newUrls = localMedia.filter((_, i) => i !== index);
        setLocalMedia(newUrls);
        onChange(newUrls);
    }, [localMedia, onChange]);

    const handleMakeMain = useCallback((index: number) => {
        if (index === 0) return;
        const newUrls = [...localMedia];
        const [removed] = newUrls.splice(index, 1);
        newUrls.unshift(removed);
        setLocalMedia(newUrls);
        onChange(newUrls);
    }, [localMedia, onChange]);

    const acceptedTypes = acceptVideo ? "image/*,video/*" : "image/*";

    // Create stable media objects for rendering
    const mediaItems = localMedia.map((url, index) => ({
        id: hashUrl(url) + "-" + index,
        url,
        type: detectMediaType(url),
    }));

    console.log("[MediaUpload] Rendering with", mediaItems.length, "items");

    return (
        <div className="space-y-4">
            <label className="block text-sm font-medium text-white/60">{label}</label>

            {/* Upload Area */}
            <div
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                onClick={() => !isUploading && fileInputRef.current?.click()}
                className={`relative border-2 border-dashed rounded-2xl p-8 text-center transition-all cursor-pointer ${isDragging ? "border-white bg-white/10" : "border-white/20 hover:border-white/40"
                    } ${localMedia.length >= maxFiles ? "opacity-50 pointer-events-none" : ""}`}
            >
                <input
                    ref={fileInputRef}
                    type="file"
                    accept={acceptedTypes}
                    multiple
                    onChange={handleFileSelect}
                    className="hidden"
                    onClick={(e) => e.stopPropagation()}
                />

                {isUploading ? (
                    <div className="space-y-4">
                        <div className="w-12 h-12 mx-auto rounded-full border-2 border-white/20 border-t-white animate-spin" />
                        <p className="text-white">Yükleniyor... %{Math.round(uploadProgress)}</p>
                        <div className="w-full max-w-xs mx-auto h-2 bg-white/10 rounded-full overflow-hidden">
                            <div
                                className="h-full bg-gradient-to-r from-green-500 to-emerald-500 transition-all"
                                style={{ width: `${uploadProgress}%` }}
                            />
                        </div>
                    </div>
                ) : (
                    <>
                        <div className="flex items-center justify-center gap-4 mb-4">
                            <div className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center">
                                <ImageIcon className="w-6 h-6 text-white/60" />
                            </div>
                            {acceptVideo && (
                                <div className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center">
                                    <Video className="w-6 h-6 text-white/60" />
                                </div>
                            )}
                        </div>
                        <p className="text-white mb-2">Dosya sürükleyin veya tıklayın</p>
                        <p className="text-white/40 text-sm">
                            {acceptVideo ? "PNG, JPG, MP4, WEBM" : "PNG, JPG"} • Max {acceptVideo ? "5MB video" : "2MB"}
                        </p>
                        <p className="text-white/30 text-xs mt-1">
                            {localMedia.length}/{maxFiles} dosya
                        </p>
                    </>
                )}
            </div>

            {/* Messages */}
            {successMessage && (
                <div className="flex items-center gap-2 p-3 bg-green-500/20 border border-green-500/30 rounded-xl">
                    <Check className="w-5 h-5 text-green-400" />
                    <span className="text-green-400 text-sm">{successMessage}</span>
                </div>
            )}

            {error && (
                <div className="flex items-center gap-2 p-3 bg-red-500/20 border border-red-500/30 rounded-xl">
                    <AlertCircle className="w-5 h-5 text-red-400" />
                    <span className="text-red-400 text-sm">{error}</span>
                    <button onClick={() => setError(null)} className="ml-auto text-red-400">
                        <X className="w-4 h-4" />
                    </button>
                </div>
            )}

            {/* Media Grid - Shows when we have items */}
            {mediaItems.length > 0 && (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                    {mediaItems.map((media, index) => (
                        <div
                            key={media.id}
                            className="relative aspect-square bg-neutral-800 rounded-xl overflow-hidden group"
                        >
                            {media.type === "image" ? (
                                <img
                                    src={media.url}
                                    alt={`Media ${index + 1}`}
                                    className="w-full h-full object-cover"
                                />
                            ) : (
                                <video
                                    key={media.id + "-video"}
                                    src={media.url}
                                    className="w-full h-full object-cover bg-black"
                                    muted
                                    playsInline
                                    loop
                                    autoPlay
                                    controls={false}
                                    onLoadedData={() => console.log("[MediaUpload] Video loaded:", media.id)}
                                    onError={(e) => console.error("[MediaUpload] Video error:", e)}
                                />
                            )}

                            {/* Overlay */}
                            <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                                <button
                                    type="button"
                                    onClick={(e) => { e.stopPropagation(); handleRemove(index); }}
                                    className="w-10 h-10 rounded-full bg-red-500 flex items-center justify-center hover:bg-red-600"
                                >
                                    <Trash2 className="w-5 h-5 text-white" />
                                </button>
                                {index > 0 && (
                                    <button
                                        type="button"
                                        onClick={(e) => { e.stopPropagation(); handleMakeMain(index); }}
                                        className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center hover:bg-white/30"
                                        title="Ana görsel yap"
                                    >
                                        <Check className="w-5 h-5 text-white" />
                                    </button>
                                )}
                            </div>

                            {/* Video Badge */}
                            {media.type === "video" && (
                                <div className="absolute top-2 left-2 px-2 py-1 bg-red-500/80 rounded-lg flex items-center gap-1">
                                    <Video className="w-3 h-3 text-white" />
                                    <span className="text-xs text-white font-medium">Video</span>
                                </div>
                            )}

                            {/* Main Badge */}
                            {index === 0 && (
                                <div className="absolute bottom-2 left-2 px-2 py-1 bg-green-500/80 rounded-lg">
                                    <span className="text-xs text-white font-medium">Ana</span>
                                </div>
                            )}
                        </div>
                    ))}

                    {/* Add More */}
                    {localMedia.length < maxFiles && (
                        <button
                            type="button"
                            onClick={() => fileInputRef.current?.click()}
                            className="aspect-square bg-neutral-800 rounded-xl border-2 border-dashed border-white/20 hover:border-white/40 flex flex-col items-center justify-center gap-2"
                        >
                            <Plus className="w-8 h-8 text-white/40" />
                            <span className="text-sm text-white/40">Ekle</span>
                        </button>
                    )}
                </div>
            )}
        </div>
    );
}
