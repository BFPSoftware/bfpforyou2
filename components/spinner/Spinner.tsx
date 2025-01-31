import React from 'react';
import { FadeLoader } from 'react-spinners';

const Spinner = ({ isLoading }: { isLoading: boolean }) => {
    return (
        <div
            style={{
                position: 'fixed',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                backgroundColor: 'rgba(0, 0, 0, 0.3)'
            }}
        >
            <FadeLoader color="white" loading={isLoading} />
        </div>
    );
};
export default Spinner;
