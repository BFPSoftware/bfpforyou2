import { KintonePassword, KintoneUserName } from "@/common/env";
const { KintoneRestAPIClient } = require("@kintone/rest-api-client");

export const client = new KintoneRestAPIClient({
    baseUrl: "https://bfp.kintone.com",
    auth: {
        username: KintoneUserName,
        password: KintonePassword,
    },
});
