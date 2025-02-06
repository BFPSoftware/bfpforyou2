import { FC, useEffect, useState } from "react";
import { useWatch, Control, useFieldArray, UseFormRegisterReturn, UseFormWatch, UseFormRegister, FieldErrors } from "react-hook-form";

// import { Accordion, AccordionItem, AccordionButton, AccordionPanel, AccordionIcon, IconButton } from '@chakra-ui/react';
// import { DeleteIcon } from '@chakra-ui/icons';

import { Input, Radio } from "../../components/FormComponents";
import { Birthday } from "../../components/Birthday";
import { Gender, YesNo } from "@/common/enums";

import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { ImmigrantType } from "../schema/immigrantSchema";
import { Dictionary } from "@/common/locales/Dictionary-provider";
import Delete from "@/components/icons/Delete";
type ChildrenProps = {
    errors: any; // TODO: fix type
    register: UseFormRegister<ImmigrantType>;
    control: Control<ImmigrantType>;
    useWatch: any; // TODO: fix type
    t: Dictionary;
};
const Children: FC<ChildrenProps> = ({ errors, register, control, useWatch, t }) => {
    const [openItem, setOpenItem] = useState<string>("item-0");
    const useChildren = useWatch({ control, name: "children" });
    const { fields, append, remove } = useFieldArray({
        name: "children.childTable",
        control,
    });

    useEffect(() => {
        const errorItem = errors?.findIndex((error: any) => error && Object.keys(error).length > 0);
        if (errorItem > -1) {
            // TODO: review this. if there's any error on child table, open the first item
            setOpenItem(`item-${errorItem}`);
        }
    }, [errors]);

    const childNameLabel = (index: number): string => {
        const child = useChildren.childTable[index];
        const bday = `${child?.childBirthday.day == "default" ? "" : child?.childBirthday.day} ${child?.childBirthday.month == "default" ? "" : child?.childBirthday.month} ${child?.childBirthday.year == "default" ? "" : child?.childBirthday.year}`;
        const label = child?.childFirstName + " " + (child?.childGender == "2" ? "M" : child?.childGender == "1" ? "F" : "") + " " + bday;
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

    return (
        <div className="max-w-4xl">
            <label className="font-bold">Children</label>
            <Accordion type="single" collapsible value={openItem} onValueChange={setOpenItem}>
                {/* <AccordionItem value="item-1">
                    <AccordionTrigger>Is it accessible?</AccordionTrigger>
                    <AccordionContent>Yes. It adheres to the WAI-ARIA design pattern.</AccordionContent>
                </AccordionItem> */}
                {fields.map((field, index) => {
                    if (fields.length == 0) appendRow();
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
                                            <Input label={t.children.childFirstName} register={register(`children.childTable.${index}.childFirstName`)} error={(errors?.[index]?.childFirstName as any) || undefined} />
                                            <Input label={t.children.childLastName} register={register(`children.childTable.${index}.childLastName`)} error={errors?.[index]?.childLastName || undefined} />
                                        </div>
                                        <div className="flex flex-wrap mb-6">
                                            <Radio label={t.children.childGender} register={register(`children.childTable.${index}.childGender`)} options={Gender(t)} error={errors?.[index]?.childGender || undefined} />
                                            <Birthday label={t.children.childBirthday} register_day={register(`children.childTable.${index}.childBirthday.day`)} register_month={register(`children.childTable.${index}.childBirthday.month`)} register_year={register(`children.childTable.${index}.childBirthday.year`)} error={errors?.[index]?.childBirthday || undefined} />
                                            <Radio label={t.children.childAccompanied} register={register(`children.childTable.${index}.childAccompanied`)} options={YesNo(t)} error={errors?.[index]?.childAccompanied || undefined} />
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
