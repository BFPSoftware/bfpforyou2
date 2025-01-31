import { ContactType } from '@/components/application forms/New Immigrant/schema/contact';
import template_immigrant from '@/components/email/template_immigrant';

const sendConfirmationEmail = async (formResponse: ContactType, t: any) => {
    const body = template_immigrant(formResponse, t);
    const res = await fetch('/api/resend/sendEmail', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ body: body, to: formResponse.email })
    });
    if (await res.ok) {
        return true;
    } else {
        alert('Something went wrong, please try again. If the problem persists, please contact us.');
        return false;
    }
};
export default sendConfirmationEmail;
