'use client'

import { useRouter, useParams } from 'next/navigation'
import { useEffect, useState } from "react";
import './publicationsId.css'

type Publication = {
    id: string;
    title: string;
    content: string[];
};

export default function Publication(){
    const router = useRouter();

    const [user, setUser] = useState('');
    const [error, setError] = useState(false);
    const [loading, setLoading] = useState(true);
    const [errorMessage, setErrorMessage] = useState('');
    const [publication, setPublication] = useState<Publication>();

    const params = useParams();
    const publicationId = params.id;

    useEffect( () => {
        setUser(String(localStorage.getItem("user")));
    }, []);

    useEffect( () => {
        const loadPublication = async () => {
            try {
                const res = await fetch('/api/publications/' + publicationId);
                if(!res.ok){
                    throw new Error('Failed to fetch correspondents')
                }

                const data = await res.json();
                setPublication(data);
                setLoading(false);

            } catch(error: any) {
                setError(true);
                setErrorMessage(error.message);
            }
        }

        if(publicationId){
            loadPublication();
        }
    }, []);

    return (
        <div >
            <h1 className="user">{user || ''}</h1>
            <div className='flex justify-center pt-[75px]'>
                <h1 className=" font-bold">{publication?.title}</h1>
            </div>
            <div className="flex items-start justify-center">
                {loading && <p className="text-gray-500 pt-[20px]">Loading publication...</p>}
                {error && <p className="text-red-500">Error: {errorMessage}</p>}
                {publication?.content && (
                    <div className='text space-y-[20px]'>
                        {publication.content.map( (paragraph, index) => (
                            <p key={index}>{paragraph}</p>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}