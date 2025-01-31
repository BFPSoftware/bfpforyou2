'use client';

import { Select, Date } from '../components/FormComponents';
import { Dispatch, FC, SetStateAction } from 'react';
import { FieldErrors, UseFormRegister } from 'react-hook-form';
import { ContactType } from '../schema/elementary';
import { TFunction } from 'i18next';
import { whereHeardOfUs } from '@/common/enums';

type ThirdPageProps = {
    setPage: Dispatch<SetStateAction<number>>;
    errors: FieldErrors<ContactType>;
    register: UseFormRegister<ContactType>;
    t: TFunction<'translation', undefined>;
};
const ThirdPage: FC<ThirdPageProps> = ({ setPage, errors, register, t }) => {
    return (
        <>
            <div className="text-2xl font-bold my-10">
                <label>{t('sectionTitle.questionnarie')}</label>
            </div>
            <div className="mb-6">
                <Date label={t('aliyahDate')} register={register('aliyahDate')} error={errors.aliyahDate || undefined} />
                <label>{t('aliyahContent')}</label>
            </div>
            <div className="flex flex-wrap mb-6">
                <Select
                    label={t('whereHeardOfUs.title')}
                    options={whereHeardOfUs(t)}
                    register={register('whereHeardOfUs')}
                    error={errors.whereHeardOfUs || undefined}
                />
            </div>

            <div className="flex flex-col mt-5">
                <button type="button" className="btn-gray" onClick={() => setPage(1)}>
                    {t('button.back')}
                </button>
                <button className="btn-theme" type="submit">
                    {t('button.submit')}
                </button>
            </div>
        </>
    );
};
export default ThirdPage;
