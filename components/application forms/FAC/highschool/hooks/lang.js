import i18n from 'i18next';

export const langReducer = (state, action) => {
    switch (action) {
        case 'lang_en':
            i18n.changeLanguage('en');
            return { ...state, language: 'en' };
        case 'lang_he':
            i18n.changeLanguage('he');
            return { ...state, language: 'he' };
        case 'lang_ru':
            i18n.changeLanguage('ru');
            return { ...state, language: 'ru' };
        case 'lang_es':
            i18n.changeLanguage('es');
            return { ...state, language: 'es' };
        case 'lang_fr':
            i18n.changeLanguage('fr');
            return { ...state, language: 'fr' };
        default:
            return state;
    }
};
