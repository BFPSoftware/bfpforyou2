export interface BeneficiaryApplicationForm {
    birthday: kintone.fieldTypes.SingleLineText;
    lastName: kintone.fieldTypes.SingleLineText;
    spouseID: kintone.fieldTypes.SingleLineText;
    gender: kintone.fieldTypes.DropDown;
    Phone_Number: kintone.fieldTypes.SingleLineText;
    language: kintone.fieldTypes.DropDown;
    IDType: kintone.fieldTypes.DropDown;
    aliyahDate: kintone.fieldTypes.SingleLineText;
    countryCode: kintone.fieldTypes.SingleLineText;
    originCity: kintone.fieldTypes.SingleLineText;
    email: kintone.fieldTypes.SingleLineText;
    addressCity: kintone.fieldTypes.SingleLineText;
    IDNumber: kintone.fieldTypes.SingleLineText;
    addressZip: kintone.fieldTypes.SingleLineText;
    spouseIDType: kintone.fieldTypes.DropDown;
    ticket: kintone.fieldTypes.SingleLineText;
    address2: kintone.fieldTypes.SingleLineText;
    address1: kintone.fieldTypes.SingleLineText;
    fullName: kintone.fieldTypes.SingleLineText;
    spouseFirstName: kintone.fieldTypes.SingleLineText;
    formLang: kintone.fieldTypes.DropDown;
    spouseLastName: kintone.fieldTypes.SingleLineText;
    firstName: kintone.fieldTypes.SingleLineText;
    MaritalStatus: kintone.fieldTypes.DropDown;
    whereHeardOfUs: kintone.fieldTypes.DropDown;
    originCountry: kintone.fieldTypes.SingleLineText;
    Spouse_Birthday: kintone.fieldTypes.SingleLineText;
    spouseName: kintone.fieldTypes.SingleLineText;
    status: kintone.fieldTypes.DropDown;

    Photo: kintone.fieldTypes.File;
    Attachment3: kintone.fieldTypes.File;
    Attachment2: kintone.fieldTypes.File;
    Attachment1: kintone.fieldTypes.File;
    children: {
        type: 'SUBTABLE';
        value: Array<{
            id: string;
            value: {
                childDoB: kintone.fieldTypes.SingleLineText;
                accompaniedInIsrael: kintone.fieldTypes.DropDown;
                childLastName: kintone.fieldTypes.SingleLineText;
                childFirstName: kintone.fieldTypes.SingleLineText;
                childGender: kintone.fieldTypes.DropDown;
            };
        }>;
    };
}
export interface SavedBeneficiaryApplicationForm extends BeneficiaryApplicationForm {
    $id: kintone.fieldTypes.Id;
    $revision: kintone.fieldTypes.Revision;
    Updated_by: kintone.fieldTypes.Modifier;
    Created_by: kintone.fieldTypes.Creator;
    Created_datetime: kintone.fieldTypes.CreatedTime;
    Record_number: kintone.fieldTypes.RecordNumber;
    Updated_datetime: kintone.fieldTypes.UpdatedTime;
}

import { KintoneRecordField } from '@kintone/rest-api-client';

export type REST_BeneficiaryApplicationForm = {
    birthday: KintoneRecordField.SingleLineText;
    lastName: KintoneRecordField.SingleLineText;
    spouseID: KintoneRecordField.SingleLineText;
    gender: KintoneRecordField.DropDown;
    Phone_Number: KintoneRecordField.SingleLineText;
    language: KintoneRecordField.DropDown;
    IDType: KintoneRecordField.DropDown;
    aliyahDate: KintoneRecordField.SingleLineText;
    countryCode: KintoneRecordField.SingleLineText;
    originCity: KintoneRecordField.SingleLineText;
    email: KintoneRecordField.SingleLineText;
    addressCity: KintoneRecordField.SingleLineText;
    IDNumber: KintoneRecordField.SingleLineText;
    addressZip: KintoneRecordField.SingleLineText;
    spouseIDType: KintoneRecordField.DropDown;
    ticket: KintoneRecordField.SingleLineText;
    address2: KintoneRecordField.SingleLineText;
    address1: KintoneRecordField.SingleLineText;
    fullName: KintoneRecordField.SingleLineText;
    spouseFirstName: KintoneRecordField.SingleLineText;
    formLang: KintoneRecordField.DropDown;
    spouseLastName: KintoneRecordField.SingleLineText;
    firstName: KintoneRecordField.SingleLineText;
    MaritalStatus: KintoneRecordField.DropDown;
    whereHeardOfUs: KintoneRecordField.DropDown;
    originCountry: KintoneRecordField.SingleLineText;
    Spouse_Birthday: KintoneRecordField.SingleLineText;
    spouseName: KintoneRecordField.SingleLineText;
    status: KintoneRecordField.DropDown;

    Photo: KintoneRecordField.File;
    Attachment3: KintoneRecordField.File;
    Attachment2: KintoneRecordField.File;
    Attachment1: KintoneRecordField.File;
    children: {
        type: 'SUBTABLE';
        value: Array<{
            id: string;
            value: {
                childDoB: KintoneRecordField.SingleLineText;
                accompaniedInIsrael: KintoneRecordField.DropDown;
                childLastName: KintoneRecordField.SingleLineText;
                childFirstName: KintoneRecordField.SingleLineText;
                childGender: KintoneRecordField.DropDown;
            };
        }>;
    };
};
export type REST_SavedBeneficiaryApplicationForm = BeneficiaryApplicationForm & {
    $id: KintoneRecordField.Id;
    $revision: KintoneRecordField.Revision;
    Updated_by: KintoneRecordField.Modifier;
    Created_by: KintoneRecordField.Creator;
    Created_datetime: KintoneRecordField.CreatedTime;
    Record_number: KintoneRecordField.RecordNumber;
    Updated_datetime: KintoneRecordField.UpdatedTime;
};
