'use client';
import React from 'react';
import NewImmigrantForm from '@/components/application forms/New Immigrant/Form';
import { useRouter } from 'next/router';

const Immigrant: React.FC = () => {
    // validate ticket
    const router = useRouter();
    const query = router.query;
    const ticket = query?.ticket;
    console.log('query', query);
    if (typeof window !== 'undefined' && !ticket) router.push('/');
    return (
        <>
            <NewImmigrantForm ticket={ticket as string} />
        </>
    );
};

export default Immigrant;
