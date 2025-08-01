'use client'

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function ChangePassword(){
    const [user, setUser] = useState('');
    const [username, setUsername] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmNewPassword, setConfirmNewPassword] = useState('');
    const [oldPassword, setOldPassword] = useState('');
    const [error, setError] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const handleChangePassword = async () => {
        setError(false);
        setErrorMessage('');
        setLoading(true);

        if(newPassword != confirmNewPassword){
            setLoading(false);
            setError(true);
            setErrorMessage('The two fields do not coincide. Try again');
        }

        if(newPassword.length < 8){
            setLoading(false);
            setError(true);
            setErrorMessage('Passcode should be at least 8 characters long');
            return;
        }

        const res = await fetch('/api/auth/changePassword', {
            method: 'POST',
            body: JSON.stringify({username, oldPassword, newPassword, confirmNewPassword}),
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
            alert("Password changed successfully! You will be required to login again")
            router.push('/login');
        } else {
            setError(true);
            setErrorMessage(data?.message || 'Registration failed');
        }
    }

    useEffect( () => {
        setUser(String(localStorage.getItem("user")));
        setUsername(String(localStorage.getItem("user")));
    }, []);

    return (
        <div >
            <h1 className="user">{user || ''}</h1>
                    <div className="notebook-background min-h-screen flex items-start justify-center pt-[0px]">
            <div className="notebook-content p-8 rounded-2xl w-full max-w-sm leading-[25px]">
                <h2 className="text-2xl font-bold text-center mb-5">Change Password</h2>
                <form className="space-y-6">
                    <div>
                        <label htmlFor="oldPassword" className="block">
                            Old Passcode
                        </label>
                        <input
                            id="oldPassword"
                            name="oldPassword"
                            type="password"
                            placeholder="Insert your current passcode"
                            value={oldPassword}
                            onChange={e => setOldPassword(e.target.value)}
                            className="w-full h-[25px] leading-[25px] bg-transparent border-none border-b border-red-500 placeholder-gray-500 focus:outline-none"
                        />
                    </div>
                    <div>
                        <label htmlFor="newPassword" className="block">
                            Passcode
                        </label>
                        <input
                            id="newPassword"
                            name="newPassword"
                            type="password"
                            placeholder="Insert the new password"
                            value={newPassword}
                            onChange={e => setNewPassword(e.target.value)}
                            className="w-full h-[25px] leading-[25px] bg-transparent border-none border-b border-red-500 placeholder-gray-500 focus:outline-none"
                        />
                    </div>
                    <div>
                        <label htmlFor="confirmNewPassword" className="block">
                            Confirm Passcode
                        </label>
                        <input
                            id="confirmNewPassword"
                            name="confirmNewPassword"
                            type="password"
                            placeholder="To make sure it is right"
                            value={confirmNewPassword}
                            onChange={e => setConfirmNewPassword(e.target.value)}
                            className="w-full h-[25px] leading-[25px] bg-transparent border-none border-b border-red-500 placeholder-gray-500 focus:outline-none"
                        />
                    </div>
                    <button
                        type="button"
                        disabled={!oldPassword || !newPassword || !confirmNewPassword}
                        className="w-full h-[25px] leading-[25px] rounded-lg hover:underline transition duration-300 disabled:opacity-50"
                        onClick={handleChangePassword}
                    >
                        Confirm
                    </button>
                    {error && <p className="text-red-600">{errorMessage}</p>}
                </form>
            </div>
        </div>
        </div>
    );
}