'use client'

import { useRouter } from 'next/navigation'
import { useEffect, useState } from "react";

type Publication = {
    id: string;
    title: string;
    content: string[];
};

export default function PublicationsOwned(){
    const router = useRouter();

    const [user, setUser] = useState('');
    const [error, setError] = useState(false);
    const [loading, setLoading] = useState(true);
    const [errorMessage, setErrorMessage] = useState('');
    const [publications, setPublications] = useState<Publication[]>([]);

    useEffect( () => {
        setUser(String(localStorage.getItem("user")));
    }, []);

    useEffect( () => {
        const fetchPublications = async () => {
            try {
                const res = await fetch('/api/publications');
                if(!res.ok){
                    throw new Error('Failed to fetch correspondents')
                }

                const data = await res.json();
                setPublications(data || []);
                setLoading(false);

            } catch(error: any) {
                setError(true);
                setErrorMessage(error.message);
            }
        };

        fetchPublications();
    }, []);

    const handlePublication = (id: string) => {
        router.push(`/publications/${id}`);
    }

    return (
        <div >
            <h1 className="user">{user || ''}</h1>
            <div className='flex justify-center pt-[75px]'>
                <h1 className=" font-bold">YOUR PUBLICATIONS</h1>
            </div>
            <div className="flex items-start justify-center">
                {loading && <p className="text-gray-500 pt-[20px]">Loading publications...</p>}
                {error && <p className="text-red-500 pt-[20px]">Error: {errorMessage}</p>}
                {!loading && !error && publications.length === 0 && (
                    <p className="pt-[20px]">You have no publications yet.</p>
                )}
                <ul className="space-y-5 pt-[20px]">
                    {publications.map((publication) => (
                        <li key={publication.id}>
                            <h1 onClick={() => handlePublication(publication.id)}>
                                [-] {publication.title || 'Unnamed Correspondent'}
                            </h1>
                        </li>
                    ))}
                </ul>
            </div>
            <div className="flex items-start justify-center pt-[45px]">
                {error && <p className="text-red-500">Error: {errorMessage}</p>}
            </div>
        </div>
    );
}