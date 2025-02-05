const checkCode = async (code: string) => {
    const res = await fetch("/api/kintone/checkCode", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ code: code }),
    });
    if (await res.ok) {
        const resp = await res.json();
        if (resp.setting) return { resp: resp.setting, program: resp.program };
        else return false;
    } else {
        return false;
    }
};
export default checkCode;
