import { FieldError, useFormContext, UseFormRegisterReturn, UseFormWatch } from "react-hook-form";
import { FacelemFormType, FacelemType } from "../fac/schema/facelemSchema";
import { FachighFormType, FachighType } from "../fac/schema/fachighSchema";

type InputProps = {
    label: string;
    register: UseFormRegisterReturn;
    placeholder?: string;
    error: FieldError | undefined;
    required?: boolean;
};
type SelectProps = {
    label: string;
    register: UseFormRegisterReturn;
    options: { [key: number]: string };
    error: FieldError | undefined;
    required?: boolean;
};
type BirthdayProps = {
    label: string;
    error: FieldError | undefined;
    register: UseFormRegisterReturn[];
    required?: boolean;
};
type RadioProps = {
    label: string;
    register: UseFormRegisterReturn;
    options: { [key: number]: string };
    error: FieldError | undefined;
    required?: boolean;
};
export const Input = (props: InputProps) => {
    return (
        <label className="flex flex-col space-y-1 w-80 me-5 grow md:max-w-sm">
            <div className="font-semibold mb-1">
                {props.label}
                {props.required && <span className="text-red-500">*</span>}
            </div>
            <input type="text" {...props.register} className={"text-gray-800 mt-4 rounded-md border py-2 px-3 focus:outline focus:outline-sky-500 focus:ring-4 focus:ring-sky-500/30" + (props.error ? " border-red-500" : " border-inherit")} placeholder={props.placeholder || props.label} />
            {props.error && <div className="text-red-500 pl-1 pt-1 text-xs">{props.error.message}</div>}
        </label>
    );
};
type TextareaProps = {
    label: string;
    register: UseFormRegisterReturn<any>;
    placeholder?: string;
    error: FieldError | undefined;
    required?: boolean;
    minLength?: number;
    watch: any; // using any to avoid type error
};
export const Textarea = (props: TextareaProps) => {
    const textValue = props.watch(props.register.name); // using any to avoid type error
    const minLength = props.minLength || 100;
    return (
        <label className="flex flex-col space-y-1 w-auto me-5 grow md:max-w-xl">
            <div className="font-semibold mb-1">
                {props.label}
                {props.required && <span className="text-red-500">*</span>}
            </div>
            <textarea rows={5} {...props.register} minLength={minLength} className={"text-gray-800 mt-4 rounded-md border py-2 px-3 focus:outline focus:outline-sky-500 focus:ring-4 focus:ring-sky-500/30" + (props.error ? " border-red-500" : " border-inherit")} placeholder={props.placeholder || props.label} />
            {typeof textValue == "string" && textValue.length > 0 && textValue.length < minLength && (
                <div className="text-red-500 pl-1 pt-1 text-xs">
                    {textValue.length}/{minLength}
                </div>
            )}
            {props.error && <div className="text-red-500 pl-1 pt-1 text-xs">{props.error.message}</div>}
        </label>
    );
};
export const Select = (props: SelectProps) => {
    return (
        <label className="flex flex-col space-y-1 w-80 me-5 grow md:max-w-sm">
            <div className="font-semibold mb-1">
                {props.label}
                {props.required && <span className="text-red-500">*</span>}
            </div>
            <select {...props.register} className={"text-gray-800 mt-4 rounded-md border py-2 px-3" + (props.error ? " border-red-500" : "")} defaultValue="">
                <option disabled={true} hidden={true} value="" key="default">
                    --Select--
                </option>
                {Object.entries(props.options).map(([key, value]) => (
                    <option value={key} key={key}>
                        {value}
                    </option>
                ))}
            </select>
            {props.error && <div className="text-red-500 pl-1 pt-1 text-xs">{props.error.message}</div>}
        </label>
    );
};
export const Birthday = (props: BirthdayProps) => {
    const days = () => {
        let arr = [];
        for (let i = 1; i <= 31; i++) {
            arr.push(i);
        }
        return arr.map((day) => (
            <option value={day} key={day}>
                {day}
            </option>
        ));
    };
    const months = () => {
        const monthlist = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
        return monthlist.map((month) => (
            <option value={month} key={month}>
                {month}
            </option>
        ));
    };
    const years = () => {
        let arr = [];
        for (let i = 2023; i > 1920; i--) {
            arr.push(i);
        }
        return arr.map((year) => (
            <option value={year} key={year}>
                {year}
            </option>
        ));
    };
    return (
        <label className="flex flex-col space-y-1 w-80 me-5 grow md:max-w-sm">
            <div className="font-semibold mb-1">
                {props.label}
                {props.required && <span className="text-red-500">*</span>}
            </div>
            <div className="row flex">
                <select {...props.register[0]} className="text-gray-800 mt-4 rounded-md border py-2 px-3">
                    {days()}
                </select>
                {props.error && <div className="text-red-500 pl-1 pt-1 text-xs">{props.error.message}</div>}
                <select {...props.register[1]} className="text-gray-800 mt-4 rounded-md border py-2 px-3">
                    {months()}
                </select>
                {props.error && <div className="text-red-500 pl-1 pt-1 text-xs">{props.error.message}</div>}
                <select {...props.register[2]} className="text-gray-800 mt-4 rounded-md border py-2 px-3">
                    {years()}
                </select>
                {props.error && <div className="text-red-500 pl-1 pt-1 text-xs">{props.error.message}</div>}
            </div>
        </label>
    );
};
export const Radio = (props: RadioProps) => {
    return (
        <label className="flex flex-col space-y-1 w-10 me-5 grow md:max-w-sm">
            <div className="font-semibold mb-1">
                {props.label}
                {props.required && <span className="text-red-500">*</span>}
            </div>
            <div>
                {Object.entries(props.options).map(([key, value]) => {
                    return (
                        <div key={key}>
                            <label>
                                <input className="mx-2" type="radio" value={key} {...props.register} />
                                {value}
                            </label>
                        </div>
                    );
                })}
            </div>

            {props.error && <div className="text-red-500 pl-1 pt-1 text-xs">{props.error.message as string}</div>}
        </label>
    );
};
export const Date = (props: InputProps) => {
    return (
        <label className="flex flex-col space-y-1 w-80 me-5 grow md:max-w-sm">
            <div className="font-semibold mb-1">
                {props.label}
                {props.required && <span className="text-red-500">*</span>}
            </div>
            <input type="date" {...props.register} className={"text-gray-800 mt-4 rounded-md border py-2 px-3 focus:outline focus:outline-sky-500 focus:ring-4 focus:ring-sky-500/30" + (props.error ? " border-red-500" : " border-inherit")} placeholder={props.placeholder || props.label} />
            {props.error && <div className="text-red-500 pl-1 pt-1 text-xs">{props.error.message}</div>}
        </label>
    );
};
