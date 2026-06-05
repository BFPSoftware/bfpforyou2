type FacKintoneRecord = Record<string, { value: unknown }>;

const fieldValue = (record: FacKintoneRecord, field: string): string => {
    const value = record[field]?.value;
    return typeof value === "string" ? value : "";
};

/** Build profile_* fields from translated elementary responses (copy app only). */
export const buildElementaryProfileFields = (record: FacKintoneRecord): void => {
    const whoDoYouLiveWith = fieldValue(record, "whoDoYouLiveWith");
    const languageAtHome = fieldValue(record, "languageAtHome");
    const aboutFamily = fieldValue(record, "aboutFamily");

    const favoriteSubject = fieldValue(record, "favoriteSubject");
    const challengingSubject = fieldValue(record, "challengingSubject");
    const aboutMeFromTeacher = fieldValue(record, "aboutMeFromTeacher");

    const favoriteColor = fieldValue(record, "favoriteColor");
    const favoriteFood = fieldValue(record, "favoriteFood");
    const hobbies = fieldValue(record, "hobbies");
    const makesMeSad = fieldValue(record, "makesMeSad");
    const loveMost = fieldValue(record, "loveMost");
    const futureDreams = fieldValue(record, "futureDreams");

    record.profile_family = {
        value: [
            `I live with my ${whoDoYouLiveWith}`,
            `We speak ${languageAtHome} at home`,
            `What I love about my family is that ${aboutFamily}`,
        ].join("\n"),
    };

    record.profile_school = {
        value: [
            `My favorite subject in school is ${favoriteSubject}.`,
            `I struggle with ${challengingSubject}.`,
            `My teacher says that ${aboutMeFromTeacher}`,
        ].join("\n"),
    };

    record.profile_aboutMe = {
        value: [
            `My favorite color is ${favoriteColor}.`,
            `My favorite food is ${favoriteFood},`,
            `I love to ${hobbies}.`,
            `The thing that makes me the saddest is ${makesMeSad}.`,
            `What I love the most in the world is ${loveMost}.`,
            `When I grow up I want to become ${futureDreams}.`,
        ].join("\n"),
    };
};

export const isElementaryApplication = (record: FacKintoneRecord): boolean =>
    record.applicationType?.value === "Elementary";
