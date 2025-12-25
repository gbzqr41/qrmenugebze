"use client";

import { useFeedback } from "@/context/FeedbackContext";
import BusinessFeedbackModal from "@/components/BusinessFeedbackModal";

export default function GlobalUI() {
    const { isFeedbackModalOpen, closeFeedbackModal } = useFeedback();

    return (
        <BusinessFeedbackModal
            isOpen={isFeedbackModalOpen}
            onClose={closeFeedbackModal}
            businessName="Antigravity Kitchen"
        />
    );
}
