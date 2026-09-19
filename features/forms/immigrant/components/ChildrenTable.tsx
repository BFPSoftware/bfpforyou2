import { FC, useEffect, useState } from "react";
import { useWatch, Control, useFieldArray, UseFormRegister, FieldErrors } from "react-hook-form";

import { Input, Select } from "../../components/FormComponents";
import { Birthday } from "../../components/Birthday";
import { Gender, YesNo } from "@/common/enums";

import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { ImmigrantType } from "../schema/immigrantSchema";
import { Dictionary } from "@/common/locales/Dictionary-provider";
import Delete from "@/components/icons/Delete";

type ChildTableErrors = NonNullable<NonNullable<FieldErrors<ImmigrantType>["children"]>["childTable"]>;

type ChildrenProps = {
    errors: ChildTableErrors | undefined;
    register: UseFormRegister<ImmigrantType>;
    control: Control<ImmigrantType>;
    /** Passed from parent so the form stays on one RHF instance; typed as the RHF hook. */
    useWatch: typeof useWatch;
    t: Dictionary;
};

const Children: FC<ChildrenProps> = ({ errors, register, control, useWatch: watchFields, t }) => {
    const [openItem, setOpenItem] = useState<string>("item-0");
    const useChildren = watchFields({ control, name: "children" });
    const { fields, append, remove } = useFieldArray({
        name: "children.childTable",
        control,
    });

    useEffect(() => {
        if (!Array.isArray(errors)) return;
        const errorItem = errors.findIndex((error) => error && Object.keys(error).length > 0);
        if (errorItem > -1) {
            setOpenItem(`item-${errorItem}`);
        }
    }, [errors]);

    const childNameLabel = (index: number): string => {
        const child = useChildren.childTable[index];
        const bdayParts = child?.childBirthday;
        const bday = `${bdayParts?.day == "default" || !bdayParts?.day ? "" : bdayParts.day} ${bdayParts?.month == "default" || !bdayParts?.month ? "" : bdayParts.month} ${bdayParts?.year == "default" || !bdayParts?.year ? "" : bdayParts.year}`;
        const label = (child?.childFirstName ?? "") + " " + (child?.childGender == "2" ? "M" : child?.childGender == "1" ? "F" : "") + " " + bday;
        return label;
    };
    const appendRow = () => {
        append({
            childFirstName: "",
            childLastName: "",
            childGender: "",
            childBirthday: { month: "default", day: "default", year: "default" },
            childAccompanied: "",
        });
        setOpenItem(`item-${fields.length}`); // Open the newly added item
    };

    useEffect(() => {
        if (fields.length === 0) {
            appendRow();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps -- seed one row once
    }, [fields.length]);

    return (
        <div className="max-w-4xl">
            <label className="font-bold">Children</label>
            <Accordion type="single" collapsible value={openItem} onValueChange={setOpenItem}>
                {fields.map((field, index) => {
                    const rowErrors = Array.isArray(errors) ? errors[index] : undefined;
                    return (
                        <AccordionItem key={field.id} value={`item-${index}`}>
                            <div className="flex items-center">
                                <>
                                    <AccordionTrigger>
                                        <label className="text-xl m-2 min-w-40">{childNameLabel(index)}</label>
                                    </AccordionTrigger>
                                    <div className="px-4 hover:text-red-500 hover:scale-110 cursor-pointer" onClick={() => remove(index)}>
                                        <Delete />
                                    </div>
                                </>
                            </div>
                            <AccordionContent className="pb-4">
                                <div key={field.id}>
                                    <section className={"ml-1"} key={field.id}>
                                        <div className="flex flex-wrap mb-6">
                                            <Input label={t.children.childFirstName} register={register(`children.childTable.${index}.childFirstName`)} error={rowErrors?.childFirstName || undefined} />
                                            <Input label={t.children.childLastName} register={register(`children.childTable.${index}.childLastName`)} error={rowErrors?.childLastName || undefined} />
                                        </div>
                                        <div className="flex flex-wrap mb-6">
                                            <Select label={t.children.childGender} register={register(`children.childTable.${index}.childGender`)} options={Gender(t)} error={rowErrors?.childGender || undefined} />
                                            <Birthday label={t.children.childBirthday} register_day={register(`children.childTable.${index}.childBirthday.day`)} register_month={register(`children.childTable.${index}.childBirthday.month`)} register_year={register(`children.childTable.${index}.childBirthday.year`)} error={rowErrors?.childBirthday || undefined} />
                                            <Select label={t.children.childAccompanied} register={register(`children.childTable.${index}.childAccompanied`)} options={YesNo(t)} error={rowErrors?.childAccompanied || undefined} />
                                        </div>
                                    </section>
                                </div>
                            </AccordionContent>
                        </AccordionItem>
                    );
                })}
            </Accordion>
            <button type="button" onClick={() => appendRow()} className="btn-theme">
                Add Child
            </button>
        </div>
    );
};
export default Children;
