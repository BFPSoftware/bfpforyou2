import { UseFormRegisterReturn } from 'react-hook-form';
type props = {
    label: string;
    error: any | undefined;
    register_day: UseFormRegisterReturn;
    register_month: UseFormRegisterReturn;
    register_year: UseFormRegisterReturn;
};
export const Birthday = ({ label, error, register_day, register_month, register_year }: props): JSX.Element => {
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
        const monthlist = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
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
            <div className="font-semibold mb-1">{label}</div>
            <div className="row flex">
                <div className="flex flex-col">
                    <select
                        {...register_day}
                        className={'text-gray-800 rounded-md border py-2 px-3' + (error?.day ? ' border-red-500' : '')}
                        defaultValue="default"
                    >
                        <option value="default" key="default" disabled={true} hidden={true}>
                            dd
                        </option>
                        {days()}
                    </select>
                    {error?.day && <div className="text-red-500 pl-1 pt-1 text-xs">{error?.day.message}</div>}
                </div>
                <div className="flex flex-col">
                    <select
                        {...register_month}
                        className={'text-gray-800 rounded-md border py-2 px-3' + (error?.month ? ' border-red-500' : '')}
                        defaultValue="default"
                    >
                        <option value="default" key="default" disabled={true} hidden={true}>
                            mm
                        </option>
                        {months()}
                    </select>
                    {error?.month && <div className="text-red-500 pl-1 pt-1 text-xs">{error?.month.message}</div>}
                </div>
                <div className="flex flex-col">
                    <select
                        {...register_year}
                        className={'text-gray-800 rounded-md border py-2 px-3' + (error ? ' border-red-500' : '')}
                        defaultValue="default"
                    >
                        <option value="default" key="default" disabled={true} hidden={true}>
                            yyyy
                        </option>
                        {years()}
                    </select>
                    {error?.year && <div className="text-red-500 pl-1 pt-1 text-xs">{error?.year.message}</div>}
                </div>
            </div>
        </label>
    );
};
