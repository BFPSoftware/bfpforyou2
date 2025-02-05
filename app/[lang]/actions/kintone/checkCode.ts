"use server"; // don't forget to add this!

import { z } from "zod";
import { actionClient } from "@/lib/safe-action";
import { BeneficiaryApplicationFormAppID, BfpforyouMasterAPPID } from "@/common/env";
import logError from "@/common/logError";
import { isProgramIncluded, programs } from "@/types/program";
import client from "@/hooks/useKintone";

// This schema is used to validate input from client.
const schema = z.object({
    code: z.string().min(3).max(10),
});

export const checkCode = actionClient.schema(schema).action(async ({ parsedInput: { code } }) => {
    try {
        const query1 = `status in ("Active")`;
        const settings = await client.record.getAllRecords({
            app: BfpforyouMasterAPPID as string,
            condition: query1,
        });
        const query2 = `ticket="${code}"`;
        const records = await client.record.getAllRecords({
            app: BeneficiaryApplicationFormAppID as string,
            condition: query2,
        });
        const countUsedCode = (code: string) => {
            return records.filter((record) => record["ticket"].value === code).length;
        };
        const setting = settings.find((setting) => {
            if (setting["expiry"].value && new Date(setting["expiry"].value as string) < new Date()) {
                return false;
            }
            if (setting["maxValue"].value) {
                if (countUsedCode(code) > 0) return false;
                if (parseInt(setting["maxValue"].value as string) < parseInt(code)) return false;
                if (parseInt(setting["code"].value as string) > parseInt(code)) return false;
            }
            // else if here, when maxValue is not set
            else if (setting["code"].value != code) return false;
            if (setting["limit"].value && countUsedCode(code) > parseInt(setting["limit"].value as string)) return false;
            return true;
        });

        if (!setting) {
            return { failure: "No setting found for this code" };
        } else if (!setting["program"].value || typeof setting["program"].value !== "string") {
            return { failure: "No program found for this code" };
        } else {
            if (isProgramIncluded(setting["program"].value)) {
                return {
                    success: setting["program"].value,
                };
            } else throw new Error(`Program ${setting["program"].value} not included in programs`);
        }
    } catch (e) {
        logError(e, { code }, "checkCode");
        return { failure: "Server error" };
    }
});
