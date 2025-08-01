'use client'

import { useRouter } from 'next/navigation'
import { useState } from 'react'

export default function Register() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [email, setEmail] = useState('');
    const [error, setError] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const handleRegister = async () => {
        setError(false);
        setErrorMessage('');
        setLoading(true);

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            setLoading(false);
            setError(true);
            setErrorMessage('Please enter a valid email address.');
            return;
        }

        if(password.length < 8){
            setLoading(false);
            setError(true);
            setErrorMessage('Passcode should be at least 8 characters long');
            return;
        }

        const res = await fetch('/api/auth/register', {
            method: 'POST',
            body: JSON.stringify({username, password, confirmPassword, email}),
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
            alert("Registration successful! You will be redirected to login")
            router.push('/login');
        } else {
            setError(true);
            setErrorMessage(data?.message || 'Registration failed');
        }
    }

    return (
        <div className="notebook-background min-h-screen flex items-start justify-center pt-[0px]">
            <div className="notebook-content p-8 rounded-2xl w-full max-w-sm leading-[25px]">
                <h2 className="text-2xl font-bold text-center mb-5">Register</h2>
                <form className="space-y-6">
                    <div>
                        <label htmlFor="username" className="block">
                            Pseudonym
                        </label>
                        <input
                            id="username"
                            name="username"
                            type="text"
                            placeholder="What shall we call you?"
                            value={username}
                            onChange={e => setUsername(e.target.value.toUpperCase())}
                            className="w-full h-[25px] leading-[25px] bg-transparent border-none border-b border-red-500 placeholder-gray-500 focus:outline-none"
                        />
                    </div>
                    <div>
                        <label htmlFor="email" className="block">
                            Email
                        </label>
                        <input
                            id="email"
                            name="email"
                            type="text"
                            placeholder="Where can I reach you?"
                            value={email}
                            onChange={e => setEmail(e.target.value)}
                            className="w-full h-[25px] leading-[25px] bg-transparent border-none border-b border-red-500 placeholder-gray-500 focus:outline-none"
                        />
                    </div>
                    <div>
                        <label htmlFor="password" className="block">
                            Passcode
                        </label>
                        <input
                            id="password"
                            name="password"
                            type="password"
                            placeholder="To prove your identity"
                            value={password}
                            onChange={e => setPassword(e.target.value)}
                            className="w-full h-[25px] leading-[25px] bg-transparent border-none border-b border-red-500 placeholder-gray-500 focus:outline-none"
                        />
                    </div>
                    <div>
                        <label htmlFor="confirmPassword" className="block">
                            Confirm Passcode
                        </label>
                        <input
                            id="confirmPassword"
                            name="confirmPassword"
                            type="password"
                            placeholder="To make sure it is right"
                            value={confirmPassword}
                            onChange={e => setConfirmPassword(e.target.value)}
                            className="w-full h-[25px] leading-[25px] bg-transparent border-none border-b border-red-500 placeholder-gray-500 focus:outline-none"
                        />
                    </div>
                    <button
                        type="button"
                        disabled={!username || !password || !confirmPassword || !email}
                        className="w-full h-[25px] leading-[25px] rounded-lg hover:underline transition duration-300 disabled:opacity-50"
                        onClick={handleRegister}
                    >
                        Register
                    </button>
                    {error && <p className="text-red-600">{errorMessage}</p>}
                </form>
            </div>
        </div>
    );
}
