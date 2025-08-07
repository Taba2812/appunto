'use client'

import { useRouter } from 'next/navigation'
import { useEffect, useState } from "react";

export default function Publications(){
    const [user, setUser] = useState('');
    const router = useRouter();
    const [error, setError] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');

    useEffect( () => {
        setUser(String(localStorage.getItem("user")));
    }, []);

    return (
        <div >
            <h1 className="user">{user || ''}</h1>
            <div className='flex justify-center pt-[75px]'>
                <h1 className=" font-bold">PUBLICATIONS</h1>
            </div>
            <div className="flex items-start justify-center pt-[45px]">
                <h1 onClick={() => router.push('/publications/owned')}>Published by you</h1>
            </div>
            <div className="flex items-start justify-center pt-[45px]">
                <h1 onClick={() => router.push('/publications/shared')}>Shared with you</h1>
            </div>
            <div className="flex items-start justify-center pt-[45px]">
                <h1 onClick={() => router.push('/publish')}>[+] Upload a new publication</h1>
            </div>
            <div className="flex items-start justify-center pt-[45px]">
                {error && <p className="text-red-500">Error: {errorMessage}</p>}
            </div>
        </div>
    );
}