'use client'

import { ObjectId } from 'mongodb';
import { useRouter } from 'next/navigation'
import { useEffect, useState, ChangeEvent } from "react";

type Publication = {
    id: string;
    title: string;
    content: string[];
    publisher: ObjectId;
};

export default function Publish(){
    const router = useRouter();
    const [user, setUser] = useState('');
    const [error, setError] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const [loading, setLoading] = useState(false);
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');

    useEffect( () => {
        setUser(String(localStorage.getItem("user")));
    }, []);

    const handlePublish = async () => {
        setError(false);
        setErrorMessage('');
        setLoading(true);

        const res = await fetch('/api/publications', {
            method: 'POST',
            body: JSON.stringify({title, content}),
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
            alert("Your text was published successfully!")
            router.push('/publications/');
        } else {
            setError(true);
            setErrorMessage(data?.message || 'Publication failed');
        }
    }

    return (
        <div className="notebook-background min-h-screen flex items-start justify-center pt-[0px]">
            <h1 className="user">{user || ''}</h1>
            <div className="notebook-content p-8 rounded-2xl w-full max-w-sm leading-[25px]">
                <h2 className="font-bold text-center">UPLOAD A NEW PUBLICATION</h2>
                <form className="space-y-6 pt-[25px]">
                    <div>
                        <label htmlFor="title" className="block">
                            Title
                        </label>
                        <input
                            id="title"
                            name="title"
                            type="text"
                            placeholder="Enter the title"
                            value={title}
                            onChange={e => setTitle(e.target.value)}
                            className="w-full h-[25px] leading-[25px] bg-transparent border-none border-b border-red-500 placeholder-gray-500 focus:outline-none"
                        />
                    </div>
                    <div>
                        <label htmlFor="content" className="block">
                            Passcode
                        </label>
                        <input
                            id="content"
                            name="content"
                            type="text"
                            placeholder="Content"
                            value={content}
                            onChange={e => setContent(e.target.value)}
                            className="w-full h-[25px] leading-[25px] bg-transparent border-none border-b border-red-500 placeholder-gray-500 focus:outline-none"
                        />
                    </div>
                    <button
                        type="button"
                        disabled={!title || !content}
                        className="w-full h-[25px] leading-[25px] rounded-lg hover:underline transition duration-300 disabled:opacity-50"
                        onClick={handlePublish}
                    >
                        Publish
                    </button>
                    {error && <p style={{ color: 'red' }}>Invalid credentials</p>}
                </form>
            </div>
        </div>
    );
}