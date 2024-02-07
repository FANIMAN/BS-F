import React, { useState, FormEvent, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const LoginPage: React.FC = () => {
    const navigate = useNavigate();
    const [responseMessage, setResponseMessage] = useState<{ message: string; isError: boolean } | null>(null);

    // const handleLogin = async (e: FormEvent<HTMLFormElement>) => {
    //     e.preventDefault();
    //     const formData = new FormData(e.currentTarget);
    //     const email = formData.get('email') as string;
    //     const password = formData.get('password') as string;

    //     try {
    //         const response = await fetch('http://localhost:4000/login', {
    //             method: 'POST',
    //             headers: {
    //                 'Content-Type': 'application/json',
    //             },
    //             body: JSON.stringify({ email, password }),
    //         });

    //         const responseData = await response.json();
    //         setResponseMessage({ message: responseData.message, isError: !response.ok });

    //         if (response.ok) {
    //             navigate('/home');
    //         } else {
    //             console.error('Login failed');
    //         }
    //     } catch (error) {
    //         console.error('Error logging in:', error);
    //     }
    // };

    const handleLogin = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        const email = formData.get('email') as string;
        const password = formData.get('password') as string;

        try {
            const response = await fetch('http://localhost:4000/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, password }),
            });

            if (response.ok) {
                const responseData = await response.json();
                // Store user information and token in local storage
                localStorage.setItem('loggedInUser', JSON.stringify(responseData.user));
                localStorage.setItem('token', responseData.token);
                navigate('/home');
            } else {
                const responseData = await response.json();
                setResponseMessage({ message: responseData.message, isError: true });
                console.error('Login failed');
            }
        } catch (error) {
            console.error('Error logging in:', error);
        }
    };

    useEffect(() => {
        let timer: NodeJS.Timeout;
        if (responseMessage) {
            timer = setTimeout(() => {
                setResponseMessage(null);
            }, 5000);
        }

        return () => clearTimeout(timer);
    }, [responseMessage]);

    return (
        <div className="flex flex-col items-center justify-center h-screen">
            <Link to="/" className="absolute top-4 left-4 text-blue-500 hover:text-blue-600">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
            </Link>

            <h2 className="text-2xl font-bold mb-4">Login</h2>
            <form onSubmit={handleLogin} className="w-full max-w-sm">
                <label htmlFor="email" className="block mb-2">Email:</label>
                <input type="email" id="email" name="email" required className="w-full mb-4 px-4 py-2 border rounded" placeholder='email' />
                {/* Add name="email" attribute to match FormData key */}

                <label htmlFor="password" className="block mb-2">Password:</label>
                <input type="password" id="password" name="password" required className="w-full mb-4 px-4 py-2 border rounded" placeholder='password' />
                {/* Add name="password" attribute to match FormData key */}

                <button type="submit" className="w-full bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded">Login</button>
            </form>


            {responseMessage && (
                <div className={`absolute bottom-4 p-4 rounded-md shadow-md ${responseMessage.isError ? 'bg-red-200 text-red-800' : 'bg-white text-black'}`}>
                    {responseMessage.message}
                </div>
            )}
        </div>
    );
};

export default LoginPage;
