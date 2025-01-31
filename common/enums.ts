import { TFunction } from 'i18next';

type Translation = TFunction<'translation', undefined>;

export const Language = (t: Translation) => ({
    1: t('nativeLanguage.options.1'),
    2: t('nativeLanguage.options.2'),
    3: t('nativeLanguage.options.3'),
    4: t('nativeLanguage.options.4'),
    5: t('nativeLanguage.options.5'),
    6: t('nativeLanguage.options.6'),
    7: t('nativeLanguage.options.7')
});

export const IDType = (t: Translation) => ({
    0: t('idType.options.0'),
    1: t('idType.options.1')
});

export const MaritalStatus = (t: Translation) => ({
    0: t('maritalStatus.options.0'),
    1: t('maritalStatus.options.1'),
    2: t('maritalStatus.options.2'),
    3: t('maritalStatus.options.3')
});

export const Gender = (t: Translation) => ({
    1: t('gender.options.1'),
    2: t('gender.options.2')
});

export const whereHeardOfUs = (t: Translation) => ({
    0: t('whereHeardOfUs.options.0'),
    1: t('whereHeardOfUs.options.1'),
    2: t('whereHeardOfUs.options.2'),
    3: t('whereHeardOfUs.options.3')
});

// not enum but for the sake of consistency
export const YesNo = (t: Translation) => ({
    Yes: t('select.Yes'),
    No: t('select.No')
});
