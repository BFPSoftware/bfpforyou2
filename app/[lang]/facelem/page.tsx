"use client";
import React, { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import HeaderNoSelectLang from "@/components/general/header menu/HeaderNoSelectLang";
import FacelemForm from "@/features/forms/fac/elem/Form";
import Spinner from "@/components/spinner/Spinner";

const Facelem = () => {
    const router = useRouter();
    const searchParams = useSearchParams();
    const ticket = searchParams.get("ticket");

    useEffect(() => {
        if (!ticket) router.replace("/");
    }, [ticket, router]);

    if (!ticket) {
        return (
            <>
                <HeaderNoSelectLang />
                <Spinner isLoading />
            </>
        );
    }

    return (
        <>
            <HeaderNoSelectLang />
            <div className="flex bg-slate-300 h-auto flex-col items-center justify-evenly p-[5%] md:p-24">
                <FacelemForm ticket={ticket} />
            </div>
        </>
    );
};

export default Facelem;
