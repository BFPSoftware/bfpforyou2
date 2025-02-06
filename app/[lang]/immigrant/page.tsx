"use client";
import React, { FC, use } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import NewImmigrantForm from "@/features/forms/immigrant/Form";
import { useDictionary } from "@/common/locales/Dictionary-provider";
import HeaderNoSelectLang from "@/components/general/header menu/HeaderNoSelectLang";

type Props = {
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};
const Immigrant: FC<Props> = ({ searchParams }) => {
    // validate ticket
    const router = useRouter();
    const this_searchParams = use(searchParams);
    if (typeof window !== "undefined" && !this_searchParams.ticket) router.push("/");
    const ticket = this_searchParams.ticket;
    if (typeof window !== "undefined" && !ticket) router.push("/");
    return (
        <>
            <HeaderNoSelectLang />
            <div className="flex bg-slate-300 h-auto flex-col items-center justify-evenly p-[10%] md:p-24">
                <NewImmigrantForm ticket={ticket as string} />
            </div>
        </>
    );
};

export default Immigrant;
