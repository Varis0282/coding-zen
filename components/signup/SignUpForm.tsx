import { message } from 'antd';
import React, { useState } from 'react';

const SignupForm = () => {

    const [loading, setLoading] = useState(false);

    const handleFormSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const form = e.currentTarget;
        const formData = new FormData(form);
        const name = formData.get('name') as string;
        const email = formData.get('email') as string;
        const password = formData.get('password') as string;

        setLoading(true);
        const response = await fetch('/api/mongo/addUser', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                name,
                email,
                password,
            }),
        })
        const data = await response.json();
        if (data.success) {
            message.success('User added successfully');
            setLoading(false);
            window.location.href = '/login';
        } else {
            message.error('Failed to add user');
            setLoading(false);
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100 w-2/3">
            <form
                onSubmit={handleFormSubmit}
                className="w-full max-w-sm bg-white shadow-md rounded px-8 py-8"
            >
                <h1 className="text-2xl text-center font-semibold mb-4">Signup</h1>
                {/* Name Field */}
                <div className="relative my-4">
                    <input
                        type="text"
                        id="name"
                        name="name"
                        placeholder=" "
                        required
                        className="block px-2.5 pb-2.5 pt-4 w-full text-sm text-gray-900 bg-transparent rounded-lg border border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                    />
                    <label
                        htmlFor="name"
                        className="absolute text-sm text-gray-500 duration-300 transform -translate-y-4 scale-75 top-2 z-10 origin-[0] bg-white px-2 peer-focus:px-2 peer-focus:text-blue-600 peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto start-1"
                    >
                        Name
                    </label>
                </div>
                {/* Email Field */}
                <div className="relative my-4">
                    <input
                        type="email"
                        id="email"
                        name="email"
                        placeholder=" "
                        required
                        className="block px-2.5 pb-2.5 pt-4 w-full text-sm text-gray-900 bg-transparent rounded-lg border border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                    />
                    <label
                        htmlFor="email"
                        className="absolute text-sm text-gray-500 duration-300 transform -translate-y-4 scale-75 top-2 z-10 origin-[0] bg-white px-2 peer-focus:px-2 peer-focus:text-blue-600 peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto start-1"
                    >
                        Email
                    </label>
                </div>
                {/* Password Field */}
                <div className="relative my-4">
                    <input
                        type="password"
                        id="password"
                        name="password"
                        placeholder=" "
                        required
                        className="block px-2.5 pb-2.5 pt-4 w-full text-sm text-gray-900 bg-transparent rounded-lg border border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                    />
                    <label
                        htmlFor="password"
                        className="absolute text-sm text-gray-500 duration-300 transform -translate-y-4 scale-75 top-2 z-10 origin-[0] bg-white px-2 peer-focus:px-2 peer-focus:text-blue-600 peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto start-1"
                    >
                        Password
                    </label>
                </div>
                {/* Submit Button */}
                <button
                    type="submit"
                    disabled={loading}
                    className={`flex justify-center w-full py-2 px-4 rounded transition-colors ${loading
                        ? 'bg-gray-400 text-gray-200 cursor-not-allowed'
                        : 'bg-blue-600 text-white hover:bg-blue-700'
                        }`}
                >
                    Signup
                    {loading && (
                        <div className="ms-3 inline w-6 h-6 border-2 border-solid border-t-transparent rounded-full border-gray-600 animate-spin"></div>
                    )}
                </button>

                <p className="text-center mt-4">
                    Already have an account?{' '}
                    <a href="/login" className="text-blue-600">
                        Login
                    </a>
                </p>
            </form>
        </div>
    );
};

export default SignupForm;
