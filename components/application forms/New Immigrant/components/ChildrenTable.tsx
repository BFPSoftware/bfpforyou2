import { useState } from 'react';
import { useFieldArray } from 'react-hook-form';

import { Accordion, AccordionItem, AccordionButton, AccordionPanel, AccordionIcon, IconButton } from '@chakra-ui/react';
import { DeleteIcon } from '@chakra-ui/icons';

import { Input, Radio } from './FormComponents';
import { Birthday } from './Birthday';
import { Gender, YesNo } from '@/common/enums';

export default function Children(props: any) {
    const register = props.register;
    const control = props.control;
    const useWatch = props.useWatch;
    const errors = props.errors;
    const useChildren = useWatch({ control, name: 'children' });
    const t = props.t;
    const { fields, append, remove } = useFieldArray({
        name: 'children.childTable',
        control
    });
    const childNameLabel = (index: number): string => {
        const child = useChildren.childTable[index];
        const bday = `${child?.childBirthday.day == 'default' ? '' : child?.childBirthday.day} ${
            child?.childBirthday.month == 'default' ? '' : child?.childBirthday.month
        } ${child?.childBirthday.year == 'default' ? '' : child?.childBirthday.year}`;
        const label = child?.childFirstName + ' ' + (child?.childGender == 'Male' ? 'M' : child?.childGender == 'Female' ? 'F' : '') + ' ' + bday;
        return label;
    };
    const appendRow = () => {
        append({
            childFirstName: '',
            childLastName: '',
            childGender: 'd',
            childBirthday: '',
            childAccompanied: 'd'
        });
    };

    const [accordionIndex, setAccordionIndex] = useState(0);
    return (
        <div className="max-w-4xl">
            <label className="font-bold">Children</label>
            <Accordion allowToggle index={accordionIndex} onChange={(e: number) => setAccordionIndex(e)}>
                {fields.map((field, index) => {
                    if (fields.length == 0) appendRow();
                    return (
                        <AccordionItem key={field.id}>
                            <div className="flex">
                                <AccordionButton>
                                    <label className="text-xl my-2">{childNameLabel(index)}</label>
                                    <AccordionIcon />
                                </AccordionButton>
                                <IconButton
                                    isRound={true}
                                    aria-label="delete row"
                                    size="sm"
                                    className="ml-auto mr-1 my-auto"
                                    icon={<DeleteIcon color="red" />}
                                    onClick={() => remove(index)}
                                />
                            </div>
                            <AccordionPanel pb={4}>
                                <div key={field.id}>
                                    <section className={'ml-1'} key={field.id}>
                                        <div className="flex flex-wrap mb-6">
                                            <Input
                                                label={t('children.childFirstName')}
                                                register={register(`children.childTable.${index}.childFirstName`)}
                                                error={errors.children?.childTable?.[index]?.childFirstName || undefined}
                                            />
                                            <Input
                                                label={t('children.childLastName')}
                                                register={register(`children.childTable.${index}.childLastName`)}
                                                error={errors.children?.childTable?.[index]?.childLastName || undefined}
                                            />
                                        </div>
                                        <div className="flex flex-wrap mb-6">
                                            <Radio
                                                label={t('children.childGender')}
                                                register={register(`children.childTable.${index}.childGender`)}
                                                options={Gender(t)}
                                                error={errors.children?.childTable?.[index]?.childGender || undefined}
                                            />
                                            <Birthday
                                                label={t('children.childBirthday')}
                                                register_day={register(`children.childTable.${index}.childBirthday.day`)}
                                                register_month={register(`children.childTable.${index}.childBirthday.month`)}
                                                register_year={register(`children.childTable.${index}.childBirthday.year`)}
                                                error={errors.children?.childTable?.[index]?.childBirthday || undefined}
                                            />
                                            <Radio
                                                label={t('children.childAccompanied')}
                                                register={register(`children.childTable.${index}.childAccompanied`)}
                                                options={YesNo(t)}
                                                error={errors.children?.childTable?.[index]?.childAccompanied || undefined}
                                            />
                                        </div>
                                    </section>
                                </div>
                            </AccordionPanel>
                        </AccordionItem>
                    );
                })}
            </Accordion>
            <button
                type="button"
                onClick={() => {
                    appendRow(), setAccordionIndex(fields.length);
                }}
                className="btn-theme"
            >
                Add Child
            </button>
        </div>
    );
}
