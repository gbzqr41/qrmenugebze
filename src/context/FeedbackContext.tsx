"use client";

import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from "react";

// Feedback type
export interface Feedback {
    id: string;
    author: string;
    phone?: string;
    rating: number;
    categories: { food: number; service: number; ambiance: number };
    comment: string;
    wouldRecommend: boolean;
    createdAt: string;
    isRead: boolean;
}

interface FeedbackContextType {
    feedbacks: Feedback[];
    addFeedback: (feedback: Omit<Feedback, "id" | "createdAt" | "isRead">) => void;
    markAsRead: (id: string) => void;
    deleteFeedback: (id: string) => void;
    unreadCount: number;
    isFeedbackModalOpen: boolean;
    openFeedbackModal: () => void;
    closeFeedbackModal: () => void;
}

const STORAGE_KEY = "qrmenu_feedbacks";

const FeedbackContext = createContext<FeedbackContextType | undefined>(undefined);

export function FeedbackProvider({ children }: { children: ReactNode }) {
    const [feedbacks, setFeedbacks] = useState<Feedback[]>([]);
    const [isLoaded, setIsLoaded] = useState(false);
    const [isFeedbackModalOpen, setIsFeedbackModalOpen] = useState(false);

    // Load from localStorage
    useEffect(() => {
        try {
            const stored = localStorage.getItem(STORAGE_KEY);
            if (stored) {
                setFeedbacks(JSON.parse(stored));
            }
        } catch (e) {
            console.error("Failed to load feedbacks", e);
        }
        setIsLoaded(true);
    }, []);

    // Save to localStorage
    useEffect(() => {
        if (isLoaded) {
            try {
                localStorage.setItem(STORAGE_KEY, JSON.stringify(feedbacks));
            } catch (e) {
                console.error("Failed to save feedbacks", e);
            }
        }
    }, [feedbacks, isLoaded]);

    const addFeedback = useCallback((data: Omit<Feedback, "id" | "createdAt" | "isRead">) => {
        console.log("[FeedbackContext] addFeedback called with data:", data);
        const newFeedback: Feedback = {
            ...data,
            id: `fb-${Date.now()}`,
            createdAt: new Date().toISOString(),
            isRead: false,
        };
        setFeedbacks(prev => {
            const updated = [newFeedback, ...prev];
            console.log("[FeedbackContext] New feedback count:", updated.length);
            return updated;
        });
    }, []);

    const markAsRead = useCallback((id: string) => {
        setFeedbacks(prev => prev.map(f => f.id === id ? { ...f, isRead: true } : f));
    }, []);

    const deleteFeedback = useCallback((id: string) => {
        setFeedbacks(prev => prev.filter(f => f.id !== id));
    }, []);

    const unreadCount = feedbacks.filter(f => !f.isRead).length;

    const openFeedbackModal = useCallback(() => setIsFeedbackModalOpen(true), []);
    const closeFeedbackModal = useCallback(() => setIsFeedbackModalOpen(false), []);

    return (
        <FeedbackContext.Provider value={{
            feedbacks,
            addFeedback,
            markAsRead,
            deleteFeedback,
            unreadCount,
            isFeedbackModalOpen,
            openFeedbackModal,
            closeFeedbackModal
        }}>
            {children}
        </FeedbackContext.Provider>
    );
}

export function useFeedback() {
    const context = useContext(FeedbackContext);
    if (!context) {
        throw new Error("useFeedback must be used within a FeedbackProvider");
    }
    return context;
}
