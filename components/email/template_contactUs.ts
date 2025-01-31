const template_contactUs = (formResponse: { name: string; email: string; message: string }) => {
    return `<div className="font-sans">
            <h2>There is a new message from bfpforyou.com</h2>
            <br />
            <section>
                <div>
                    Name: ${formResponse.name}
                </div>
                <div>
                    Email: ${formResponse.email}
                </div>
                <div>
                    Message: ${formResponse.message}
                </div>
            </section>
        </div>
    `;
};
export default template_contactUs;
