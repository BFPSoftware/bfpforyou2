declare namespace kintone.types {
    interface FACApplication {
        applicationType: kintone.fieldTypes.RadioButton;
        futureDreams: kintone.fieldTypes.SingleLineText;
        brothers: kintone.fieldTypes.SingleLineText;
        tz: kintone.fieldTypes.SingleLineText;
        favoriteColor: kintone.fieldTypes.SingleLineText;
        familyMembers: kintone.fieldTypes.SingleLineText;
        aboutSchool: kintone.fieldTypes.SingleLineText;
        ref: kintone.fieldTypes.Number;
        profile_aboutMe: kintone.fieldTypes.MultiLineText;
        submitLang: kintone.fieldTypes.DropDown;
        school: kintone.fieldTypes.DropDown;
        aboutMeFromTeacher: kintone.fieldTypes.SingleLineText;
        makesMeSad: kintone.fieldTypes.SingleLineText;
        scholarship: kintone.fieldTypes.SingleLineText;
        elemSchool: kintone.fieldTypes.DropDown;
        lastnameSearch: kintone.fieldTypes.SingleLineText;
        firstName: kintone.fieldTypes.SingleLineText;
        grade: kintone.fieldTypes.DropDown;
        birthday: kintone.fieldTypes.SingleLineText;
        lastName: kintone.fieldTypes.SingleLineText;
        languageAtHome: kintone.fieldTypes.SingleLineText;
        personalLife: kintone.fieldTypes.SingleLineText;
        challengingSubject: kintone.fieldTypes.SingleLineText;
        schoolsituation: kintone.fieldTypes.MultiLineText;
        favoriteFood: kintone.fieldTypes.SingleLineText;
        nickname: kintone.fieldTypes.SingleLineText;
        relationship: kintone.fieldTypes.SingleLineText;
        introduction: kintone.fieldTypes.SingleLineText;
        profile_family: kintone.fieldTypes.MultiLineText;
        submittedBy: kintone.fieldTypes.SingleLineText;
        a: kintone.fieldTypes.SingleLineText;
        ticket: kintone.fieldTypes.SingleLineText;
        favoriteSubject: kintone.fieldTypes.SingleLineText;
        isfrom: kintone.fieldTypes.SingleLineText;
        profile_school: kintone.fieldTypes.MultiLineText;
        sisters: kintone.fieldTypes.SingleLineText;
        familysituation: kintone.fieldTypes.MultiLineText;
        hobbies: kintone.fieldTypes.SingleLineText;
        future: kintone.fieldTypes.SingleLineText;
        returning: kintone.fieldTypes.SingleLineText;
        loveMost: kintone.fieldTypes.SingleLineText;
        originCountry: kintone.fieldTypes.SingleLineText;
        aboutMyTeacher: kintone.fieldTypes.SingleLineText;
        aboutFamily: kintone.fieldTypes.SingleLineText;
        family: kintone.fieldTypes.SingleLineText;
        interests: kintone.fieldTypes.SingleLineText;
        age: kintone.fieldTypes.SingleLineText;
        firstnameSearch: kintone.fieldTypes.SingleLineText;

        Check_box: kintone.fieldTypes.CheckBox;

        photo: kintone.fieldTypes.File;
    }
    interface SavedFACApplication extends FACApplication {
        $id: kintone.fieldTypes.Id;
        $revision: kintone.fieldTypes.Revision;
        Updated_by: kintone.fieldTypes.Modifier;
        Created_by: kintone.fieldTypes.Creator;
        Created_datetime: kintone.fieldTypes.CreatedTime;
        Record_number: kintone.fieldTypes.RecordNumber;
        Updated_datetime: kintone.fieldTypes.UpdatedTime;
    }
}

import { KintoneRecordField } from '@kintone/rest-api-client';

export type REST_FACApplication = {
    applicationType: KintoneRecordField.RadioButton;
    futureDreams: KintoneRecordField.SingleLineText;
    brothers: KintoneRecordField.SingleLineText;
    tz: KintoneRecordField.SingleLineText;
    favoriteColor: KintoneRecordField.SingleLineText;
    familyMembers: KintoneRecordField.SingleLineText;
    aboutSchool: KintoneRecordField.SingleLineText;
    ref: KintoneRecordField.Number;
    profile_aboutMe: KintoneRecordField.MultiLineText;
    submitLang: KintoneRecordField.DropDown;
    school: KintoneRecordField.DropDown;
    aboutMeFromTeacher: KintoneRecordField.SingleLineText;
    makesMeSad: KintoneRecordField.SingleLineText;
    scholarship: KintoneRecordField.SingleLineText;
    elemSchool: KintoneRecordField.DropDown;
    lastnameSearch: KintoneRecordField.SingleLineText;
    firstName: KintoneRecordField.SingleLineText;
    grade: KintoneRecordField.DropDown;
    birthday: KintoneRecordField.SingleLineText;
    lastName: KintoneRecordField.SingleLineText;
    languageAtHome: KintoneRecordField.SingleLineText;
    personalLife: KintoneRecordField.SingleLineText;
    challengingSubject: KintoneRecordField.SingleLineText;
    schoolsituation: KintoneRecordField.MultiLineText;
    favoriteFood: KintoneRecordField.SingleLineText;
    nickname: KintoneRecordField.SingleLineText;
    relationship: KintoneRecordField.SingleLineText;
    introduction: KintoneRecordField.SingleLineText;
    profile_family: KintoneRecordField.MultiLineText;
    submittedBy: KintoneRecordField.SingleLineText;
    a: KintoneRecordField.SingleLineText;
    ticket: KintoneRecordField.SingleLineText;
    favoriteSubject: KintoneRecordField.SingleLineText;
    isfrom: KintoneRecordField.SingleLineText;
    profile_school: KintoneRecordField.MultiLineText;
    sisters: KintoneRecordField.SingleLineText;
    familysituation: KintoneRecordField.MultiLineText;
    hobbies: KintoneRecordField.SingleLineText;
    future: KintoneRecordField.SingleLineText;
    returning: KintoneRecordField.SingleLineText;
    loveMost: KintoneRecordField.SingleLineText;
    originCountry: KintoneRecordField.SingleLineText;
    aboutMyTeacher: KintoneRecordField.SingleLineText;
    aboutFamily: KintoneRecordField.SingleLineText;
    family: KintoneRecordField.SingleLineText;
    interests: KintoneRecordField.SingleLineText;
    age: KintoneRecordField.SingleLineText;
    firstnameSearch: KintoneRecordField.SingleLineText;

    Check_box: KintoneRecordField.CheckBox;

    photo: KintoneRecordField.File;
};
export type REST_SavedFACApplication = REST_FACApplication & {
    $id: KintoneRecordField.Id;
    $revision: KintoneRecordField.Revision;
    Updated_by: KintoneRecordField.Modifier;
    Created_by: KintoneRecordField.Creator;
    Created_datetime: KintoneRecordField.CreatedTime;
    Record_number: KintoneRecordField.RecordNumber;
    Updated_datetime: KintoneRecordField.UpdatedTime;
};
