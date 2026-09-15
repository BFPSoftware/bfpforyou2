"use client";

import { useCallback, useEffect, useState } from "react";
import { AdminProgram, ReviewStatus } from "./reviewTypes";
import {
    bulkMarkSeen,
    loadLocalReviews,
    LocalReviewMap,
    markSeen,
    upsertLocalReview,
} from "./localReviewStorage";

export function useLocalReviews(program: AdminProgram, adminId: string) {
    const [reviews, setReviews] = useState<LocalReviewMap>({});

    useEffect(() => {
        if (!adminId) {
            setReviews({});
            return;
        }
        setReviews(loadLocalReviews(program, adminId));
    }, [program, adminId]);

    const markRecordSeen = useCallback(
        (recordId: string) => {
            if (!adminId || !recordId) return;
            setReviews(markSeen(program, adminId, recordId));
        },
        [program, adminId]
    );

    const saveReview = useCallback(
        (recordId: string, status: ReviewStatus, notes: string) => {
            if (!adminId || !recordId) return;
            setReviews(
                upsertLocalReview(program, adminId, recordId, {
                    seen: true,
                    status,
                    notes,
                })
            );
        },
        [program, adminId]
    );

    const markManySeen = useCallback(
        (recordIds: string[]) => {
            if (!adminId || recordIds.length === 0) return;
            setReviews(bulkMarkSeen(program, adminId, recordIds));
        },
        [program, adminId]
    );

    return { reviews, markRecordSeen, saveReview, markManySeen };
}
