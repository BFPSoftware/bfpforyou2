import React from 'react';

const ThankYouPage: React.FC = () => {
    const goToHomePage = () => {
        window.location.href = '/';
    };

    return (
        <div className="flex flex-col items-center justify-center h-screen">
            <h1 className="text-4xl font-bold mb-4">Thank You for Contacting Us!</h1>
            <p className="text-lg text-gray-600 mb-8">We will get back to you within 3 working days.</p>
            <button className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded" onClick={goToHomePage}>
                Back to Home
            </button>
        </div>
    );
};

export default ThankYouPage;
