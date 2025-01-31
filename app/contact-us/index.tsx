'use client';
import template_contactUs from '@/components/email/template_contactUs';
import { Dispatch, FC, SetStateAction, useState } from 'react';

type InputProps = { val: string; label: string; register: Dispatch<SetStateAction<string>>; placeholder?: string };
const Input: FC<InputProps> = ({ val, label, register, placeholder }) => {
    return (
        <label className="flex flex-col my-2 w-80 me-5 md:max-w-sm">
            <div className="font-semibold mb-1">{label}</div>
            <input
                type="text"
                value={val}
                onChange={(e) => register(e.currentTarget.value)}
                className={'text-gray-800 rounded-md border py-2 px-3 focus:outline focus:outline-sky-500 focus:ring-4 focus:ring-sky-500/30'}
                placeholder={placeholder || label}
            />
        </label>
    );
};

const Contact = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');
    const handleSubmit = () => {
        sendMessage(name, email, message);
    };
    return (
        <>
            <div className="relative flex flex-col items-center justify-center min-h-[90vh]">
                <span className="text-3xl font-bold">Contact Us</span>
                <Input val={name} label="Name" register={setName} />
                <Input val={email} label="Email" register={setEmail} />
                <label className="flex flex-col my-2 w-80 me-5 md:max-w-sm">
                    <div className="font-semibold mb-1">Message</div>
                    <textarea
                        rows={5}
                        value={message}
                        onChange={(e) => setMessage(e.currentTarget.value)}
                        className={'text-gray-800 rounded-md border py-2 px-3 focus:outline focus:outline-sky-500 focus:ring-4 focus:ring-sky-500/30'}
                        placeholder="Message"
                    />
                </label>
                <button className="btn-theme" onClick={handleSubmit}>
                    Send Message
                </button>
            </div>
        </>
    );
};

export default Contact;

const sendMessage = async (name: string, email: string, message: string) => {
    const body = template_contactUs({ name, email, message });
    const res = await fetch('/api/resend/sendContactUs', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ body: body })
    });
    if (res.ok) {
        location.href = '/contact-us/success';
    }
};
