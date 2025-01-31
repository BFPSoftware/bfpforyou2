const checkCode = async (code: string) => {
    const res = await fetch('/api/kintone/checkCode', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ code: code })
    });
    if (await res.ok) {
        const resp = await res.json();
        console.log('resp', resp);
        console.log('firstt');
        if (resp.setting) return { resp: resp.setting, program: resp.program };
        else return false;
    } else {
        return false;
    }
};
export default checkCode;

// export const testinghello = async () => {
//     const res = await fetch('/api/hello', {
//         method: 'GET',
//         headers: {
//             'Content-Type': 'application/json'
//         }
//     });
//     console.log('res', await res);
//     if (await res.ok) {
//         const resp = await res.json();
//         console.log('resp', resp);
//         return resp;
//     } else {
//         return false;
//     }
// };
