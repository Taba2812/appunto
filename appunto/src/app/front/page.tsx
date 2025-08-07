'use client'

import { useRouter } from 'next/navigation'
import { useState, useEffect } from 'react'
import './front.css'

export default function Front() {
    const [error, setError] = useState(false);
    const [userId, setUserId] = useState('');
    const [user, setUser] = useState('');
    const router = useRouter();

    useEffect( () => {
        async function fetchUser(){
            try {
                const res = await fetch('/api/user');
                if(!res.ok) throw new Error('Not authenticated');
                const data = await res.json();
                setUser(data.username);
                setUserId(data._id);
                localStorage.setItem("userId", data._id);
                localStorage.setItem("user", data.username);
            } catch(error) {
            }
        }
        fetchUser();
    }, []);

    const handleLogout = async () => {
        const res = await fetch('/api/auth/logout', {
            method: 'POST',
        });
        
        const data = await res.text();
        alert("Log out was successful");

        if (res.ok) {
            router.push('/login');
        } else {
            setError(true);
        }
    };

    return (
        <div>
            <div>
                <div className="logout">
                    <h1 onClick={handleLogout}>Exit</h1>
                    {error && <p style={{ color: 'red' }}>Something went wrong</p>}
                </div>
                <div className='user'>
                    <h1>Hello, {user || ''}</h1>
                </div>
            </div>
            <div className='flex items-start justify-center pt-[125px]'>
                <h1 onClick={() => router.push('/publications')}>Publications</h1>
            </div>
            <div className='flex items-start justify-center pt-[45px]'>
                <h1>Circles</h1>
            </div>
            <div className='flex items-start justify-center pt-[45px]'>
                <h1 onClick={() => router.push('/correspondents')}>Correspondents</h1>
            </div>
            <div className="flex items-start justify-center pt-[45px]">
                <h1 onClick={() => router.push('/settings')}>Settings</h1>
            </div>
        </div>
        
    );
}
