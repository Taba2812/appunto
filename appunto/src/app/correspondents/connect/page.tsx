'use client'

import { useRouter } from 'next/navigation'
import { useEffect, useState } from "react";

export default function Connect(){
    const [user, setUser] = useState('');
    const [senderId, setSenderId] = useState('');
    const [receiverId, setReceiverId] = useState('');
    const [receiverUsername, setReceiverUsername] = useState('');
    const [error, setError] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const [found, setFound] = useState(false);
    const [foundMessage, setFoundMessage] = useState('');
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    useEffect( () => {
        setUser(String(localStorage.getItem("user")));
        setSenderId(String(localStorage.getItem("userId")))
    }, []);

    const handleSearch = async () => {
        setError(false);
        setErrorMessage('');
        setLoading(true);

        if(user.toUpperCase() === receiverUsername.toUpperCase()){
            setLoading(false);
            setError(true);
            setErrorMessage('You cannot send a request to yourself');
            return;
        }

        const res = await fetch('/api/users/byUsername/' + receiverUsername, {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' },
        });

        let data;
        try {
            data = await res.json();
            setReceiverId(data._id);
        } catch (err) {
            console.error('Error parsing response:', err);
            setLoading(false);
            setError(true);
            setErrorMessage('Something went wrong');
            return;
        }

        setLoading(false);

        if(res.ok){
            setFound(true);
            setFoundMessage('Found user: ' + receiverUsername)
        } else {
            setError(true);
            setErrorMessage(data?.message || 'Registration failed');
        }
    }

    const handleConnect = async () => {
        setError(false);
        setErrorMessage('');
        setLoading(true);

        const res = await fetch('/api/connect/send', {
            method: 'POST',
            body: JSON.stringify({senderId, receiverId}),
            headers: { 'Content-Type': 'application/json' },
        });

        let data;
        try {
            data = await res.json();
        } catch (err) {
            console.error('Error parsing response:', err);
            setLoading(false);
            setError(true);
            setErrorMessage('Something went wrong');
            return;
        }

        setLoading(false);

        if(res.ok){
            alert('You sent an invitation to ' + receiverUsername + '!')
        } else {
            setError(true);
            setErrorMessage(data?.message || 'Registration failed');
        }
    }

    return (
        <div className="notebook-background min-h-screen flex items-start justify-center pt-[0px]">
            <h1 className="user">{user || ''}</h1>
            <div className="notebook-content p-8 rounded-2xl w-full max-w-sm leading-[25px]">
                <h1 className="text-2xl font-bold text-center mb-5">CONNECT</h1>
                <form className="space-y-6">
                    <div>
                        <label htmlFor="receiverId" className="block">
                            Who are you looking for?
                        </label>
                        <input
                            id="receiverId"
                            name="receiverId"
                            type="text"
                            placeholder="Type the username"
                            value={receiverUsername}
                            onChange={e => setReceiverUsername(e.target.value.toUpperCase())}
                            className="w-full h-[25px] leading-[25px] bg-transparent border-none border-b border-red-500 placeholder-gray-500 focus:outline-none"
                        />
                    </div>
                    <button
                        type="button"
                        disabled={!receiverUsername}
                        className="w-full h-[25px] leading-[25px] rounded-lg hover:underline transition duration-300 disabled:opacity-50"
                        onClick={handleSearch}
                    >
                        Search
                    </button>
                    {(error || foundMessage) && (
                        <p>
                            {error && <span className="text-red-600">{errorMessage + '. Please try again.'} </span>}
                            {foundMessage && <span className="text-green-600">{foundMessage}</span>}
                        </p>
                    )}
                </form>
                <button
                    type="button"
                    disabled={!receiverId}
                    className="w-full h-[25px] leading-[25px] rounded-lg hover:underline transition duration-300 disabled:opacity-50 pt-[25px]"
                    onClick={handleConnect}
                >
                    Connect
                </button>
            </div>
        </div>
    );
}