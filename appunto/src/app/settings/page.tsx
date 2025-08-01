'use client'

import { useRouter } from 'next/navigation'
import { useEffect, useState } from "react";

export default function Settings(){
    const [username, setUsername] = useState('');
    const router = useRouter();

    useEffect( () => {
        setUsername(String(localStorage.getItem("user")));
    }, []);

    return (
        <div >
            <h1 className="user">{username || ''}</h1>
            <h1 className="flex items-start justify-center pt-[75px]">SETTINGS</h1>
            <h1 className="flex items-start justify-center pt-[45px]" onClick={() => router.push('/settings/changePassword')}>
                Change Password
            </h1>
        </div>
    );
}