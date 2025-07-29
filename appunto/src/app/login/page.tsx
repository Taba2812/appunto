export default function Login() {
    return (
        <div className="notebook-background min-h-screen flex items-start justify-center pt-[0px]">
            <div className="notebook-content p-8 rounded-2xl w-full max-w-sm leading-[25px]">
                <h2 className="text-2xl font-bold text-center mb-5">Enter</h2>
                <form className="space-y-5">
                    <div>
                        <label htmlFor="username" className="block">
                            Pseudonym
                        </label>
                        <input
                            id="username"
                            name="username"
                            type="text"
                            placeholder="Who are you?"
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
                            placeholder="Prove it."
                            className="w-full h-[25px] leading-[25px] bg-transparent border-none border-b border-red-500 placeholder-gray-500 focus:outline-none"
                        />
                    </div>
                    <button
                        type="button"
                        className="w-full h-[25px] leading-[25px] rounded-lg hover:underline transition duration-300"
                    >
                        Log In
                    </button>
                </form>
                <div className="mt-5 text-center">
                    <p className="text-sm text-gray-600">First time?</p>
                    <button
                        type="button"
                        className="mt-5 hover:underline font-medium"
                    >
                        Register
                    </button>
                </div>
            </div>
        </div>
    );
}
