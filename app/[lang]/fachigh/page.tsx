"use client";
import React from "react";
import { useRouter, useSearchParams } from "next/navigation";
import HeaderNoSelectLang from "@/components/general/header menu/HeaderNoSelectLang";
import FachighForm from "@/features/forms/fac/high/Form";

const Fachigh: React.FC = () => {
    // validate ticket
    const router = useRouter();
    const searchParams = useSearchParams();
    const ticket = searchParams.get("ticket");
    if (typeof window !== "undefined" && !ticket) router.push("/");
    return (
        <>
            <HeaderNoSelectLang />
            <div className="flex bg-slate-300 h-auto flex-col items-center justify-evenly p-[5%] md:p-[10%] md:p-24">
                <FachighForm ticket={ticket as string} />
            </div>
        </>
    );
};

export default Fachigh;
