"use client";

import React from "react";
import { createPortal } from "react-dom";
import { FadeLoader } from "react-spinners";

const Spinner = ({ isLoading }: { isLoading: boolean }) => {
    if (!isLoading) return null;

    const overlay = (
        <div
            style={{
                position: "fixed",
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                backgroundColor: "rgba(0, 0, 0, 0.3)",
                zIndex: 9999,
            }}
        >
            <FadeLoader color="white" loading={isLoading} />
        </div>
    );

    if (typeof document === "undefined") return overlay;
    return createPortal(overlay, document.body);
};

export default Spinner;
