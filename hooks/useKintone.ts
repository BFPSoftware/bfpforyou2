import * as c from "@/lib/kintone-rest-api.js";

// work around for the esm module not being able to import the cjs module
// https://github.com/kintone/js-sdk/issues/2563
const client = c.client;
export default client;
