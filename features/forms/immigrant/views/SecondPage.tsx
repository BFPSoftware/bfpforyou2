'use client';

import { Input, Select, Radio } from '../components/FormComponents';
import Children from '../components/ChildrenTable';
import { Birthday } from '../components/Birthday';
import { TFunction } from 'i18next';
import { Dispatch, SetStateAction, FC } from 'react';
import { FieldErrors, UseFormRegister, UseFormTrigger } from 'react-hook-form';
import { ContactType } from '../schema/contact';
import { IDType, MaritalStatus, YesNo } from '@/common/enums';

type SecondPageProps = {
    setPage: Dispatch<SetStateAction<number>>;
    errors: FieldErrors<ContactType>;
    register: UseFormRegister<ContactType>;
    control: any;
    useWatch: any;
    trigger: UseFormTrigger<ContactType>;
    t: TFunction<'translation', undefined>;
};
const SecondPage: FC<SecondPageProps> = ({ setPage, errors, register, control, useWatch, trigger, t }) => {
    const fields: (keyof ContactType)[] = ['spouse', 'children'];
    const validate = async () => {
        const isValids = await trigger(fields);
        console.log('isValid SecondPage: ' + isValids);
        if (isValids) return true;
        else return false;
    };

    const isMarried = useWatch({ control, name: 'spouse.maritalStatus' });
    const hasChild = useWatch({ control, name: 'children.childStatus' });

    return (
        <>
            <div className="text-2xl font-bold my-10">
                <label>{t('sectionTitle.familyInformation')}</label>
            </div>
            <div className="flex flex-wrap mb-6">
                <Select
                    label={t('maritalStatus.title')}
                    options={MaritalStatus(t)}
                    register={register('spouse.maritalStatus')}
                    error={errors.spouse?.maritalStatus || undefined}
                />
                <div className={'flex flex-wrap md:mb-6 ' + (isMarried == '0' || 'hidden')}>
                    <Input
                        label={t('spouse.spouseFirstName')}
                        register={register('spouse.spouseFirstName')}
                        error={errors.spouse?.spouseFirstName || undefined}
                    />
                    <Input
                        label={t('spouse.spouseFamilyName')}
                        register={register('spouse.spouseFamilyName')}
                        error={errors.spouse?.spouseFamilyName || undefined}
                    />
                </div>
            </div>
            <div className={'flex flex-wrap mb-6 ' + (isMarried == '0' || 'hidden')}>
                <Select
                    label={t('spouse.spouseIDType')}
                    options={IDType(t)}
                    register={register('spouse.spouseIDType')}
                    error={errors.spouse?.spouseIDType || undefined}
                />
                <Input
                    label={t('spouse.spouseIDNumber')}
                    register={register('spouse.spouseIDNumber')}
                    error={errors.spouse?.spouseIDNumber || undefined}
                />
                <Birthday
                    label={t('spouse.spouseBirthday')}
                    register_day={register('spouse.spouseBirthday.day')}
                    register_month={register('spouse.spouseBirthday.month')}
                    register_year={register('spouse.spouseBirthday.year')}
                    error={errors.spouse?.spouseBirthday || undefined}
                />
            </div>
            <div className="flex flex-wrap mb-6">
                <Radio
                    label={t('children.title')}
                    options={YesNo(t)}
                    register={register('children.childStatus')}
                    error={errors.children?.childStatus || undefined}
                />
            </div>
            <div>{hasChild == 'Yes' && <Children register={register} useWatch={useWatch} control={control} errors={errors} t={t} />}</div>

            <div className="flex flex-col mt-5">
                <button type="button" className="btn-gray" onClick={() => setPage(0)}>
                    {t('button.back')}
                </button>
                <button
                    className="btn-theme"
                    onClick={async () => {
                        if (await validate()) setPage(2);
                    }}
                >
                    {t('button.next')}
                </button>
            </div>
        </>
    );
};
export default SecondPage;
