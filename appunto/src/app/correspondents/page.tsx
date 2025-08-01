'use client'

import { useRouter } from 'next/navigation'
import { useEffect, useState } from "react";
import { core } from 'zod';

type Correspondent = {
    id: string;
    username: string;
};

export default function Correspondents(){
    const [user, setUser] = useState('');
    const router = useRouter();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const [correspondents, setCorrespondents] = useState<Correspondent[]>([]);

    useEffect( () => {
        setUser(String(localStorage.getItem("user")));
    }, []);

    useEffect( () => {
        const fetchCorrespondents = async () => {
            try {
                const res = await fetch('/api/correspondents');
                if(!res.ok){
                    throw new Error('Failed to fetch correspondents')
                }

                const data = await res.json();
                setCorrespondents(data || []);
                setLoading(false);

            } catch(error: any) {
                setError(true);
                setErrorMessage(error.message);
            }
        };

        fetchCorrespondents();
    }, []);

    return (
        <div >
            <h1 className="user">{user || ''}</h1>
            <div className="flex justify-between pt-[75px] px-20">
                <h1 onClick={() => router.push('/correspondents/connect')}>
                [+] Connect with someone
                </h1>
                <h1 onClick={() => router.push('/correspondents/invitations')}>
                    [...] Invitations received
                </h1>
            </div>
            <div className='flex justify-center pt-[20px]'>
                <h1 className=" font-bold">CORRESPONDENTS</h1>
            </div>
            <div className="flex items-start justify-center">
                {loading && <p className="text-gray-500">Loading correspondents...</p>}
                {error && <p className="text-red-500">Error: {errorMessage}</p>}
                {!loading && !error && correspondents.length === 0 && (
                    <p>No correspondents yet.</p>
                )}
                <ul className="space-y-5 pt-[20px]">
                    {correspondents.map((correspondent) => (
                        <li key={correspondent.id}>
                            <h1>[-] {correspondent.username || 'Unnamed Correspondent'}</h1>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
}