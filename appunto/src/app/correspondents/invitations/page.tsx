'use client'

import { useRouter } from 'next/navigation';
import { useEffect, useState } from "react";
import './invitations.css';

export default function Invitations(){
    const [user, setUser] = useState('');
    const [exchanges, setExchanges] = useState([]);
    const [exchangeId, setExchangeId] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const router = useRouter();

    useEffect( () => {
        setUser(String(localStorage.getItem("user")));
    }, []);

    useEffect( () => {
        async function fetchExchanges(){
            try {
                const res = await fetch('/api/connect/exchanges');
                if(!res.ok){
                    throw new Error(`Failed to fetch: ${res.statusText}`)
                }

                const data = await res.json();
                setExchanges(data);
                setLoading(false);

            } catch(error) {
                console.error("Error fetching exchanges:", error);
            }
        }

        fetchExchanges();

    }, []);

    const handleReturn = async () => {
        setError(false);
        setErrorMessage('');
        setLoading(true);

        const res = await fetch('/api/connect/return', {
            method: 'POST',
            body: JSON.stringify({exchangeId}),
            headers: { 'Content-Type': 'application/json' },
        });

        let data;
        try {
            data = await res.json();
        } catch (err) {
            console.error('Error parsing response:', err);
            setLoading(false);
            setError(true);
            setErrorMessage('Something went wrong. Please try again.');
            return;
        }

        setLoading(false);

        if(res.ok){
            alert("You are now correspondents!")
        } else {
            setError(true);
            setErrorMessage(data?.message || 'Registration failed');
        }
    }

    return (
        <div>
            <h1 className="user">{user || ''}</h1>
            <h1 className="flex items-start justify-center pt-[75px]">INVITATIONS FROM:</h1>
            {exchanges.length === 0 ? (
                loading? (
                    <p className='flex items-start justify-center pt-[20px]'>Let's see...</p>
                ) : <p className='flex items-start justify-center pt-[20px]'>It's empty.</p>     
            ) : (
                <ul className="flex flex-col items-center space-y-6 pt-[20px]">
                    {exchanges.map((exchange: any) => (
                        <li key={exchange._id} className="flex items-center space-x-4">
                            <span>{exchange.senderUsername || 'Unknown sender'}</span>
                            <h1
                                className="return"
                                onClick={() => {
                                    setExchangeId(exchange._id as string);
                                    handleReturn();
                                }}
                            >
                                Return
                            </h1>
                            <h1
                                className="discard"
                                onClick={() => {
                                    setExchangeId(exchange._id as string);
                                    alert(exchangeId);
                                }}
                            >
                                Discard
                            </h1>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );

}