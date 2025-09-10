import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import React, { memo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import { toast } from 'react-toastify';
import { API_END_POINT } from '@/utils';
import axios from 'axios';
import { useSetRecoilState } from 'recoil';
import { authSlice } from '@/store/atoms/auth';

const Login = () => {
    interface LoginInput {
        username: string,
        password: string
    }
    interface LoginRes {
        message: string,
        token: string
    }
    const [input, setInput] = useState<LoginInput>({ username: "", password: "" })
    const setAuth = useSetRecoilState(authSlice);
    const navigate = useNavigate();

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const res = await axios.post<LoginRes>(`${API_END_POINT}/login`, input, {
                headers: {
                    "Content-type": "application/json",
                    'Accept': 'application/json'
                },
                withCredentials: true
            });
            toast(res.data.message)
            setAuth({ username: input.username })
            navigate('/home')
        } catch (error: any) {
            console.log(error);
            toast.error(error.response.data.message)
        }
    }
    
    return (
        <>
            <Navbar />
            <div className="flex justify-center items-center h-screen bg-gray-100">
                <div className="w-full max-w-md bg-white rounded-lg shadow-md p-8">
                    <h2 className="text-2xl font-semibold mb-6 text-gray-700 text-center">Login</h2>
                    <form className="space-y-4">
                        <div>
                            <Label htmlFor="username" className="mb-1">Username</Label>
                            <Input
                                id="username"
                                type="text"
                                placeholder="Enter username"
                                value={input.username}
                                onChange={(e) => setInput({ ...input, username: e.target.value })}
                            />
                        </div>
                        <div>
                            <Label htmlFor="password" className="mb-1">Password</Label>
                            <Input
                                id="password"
                                type="password"
                                value={input.password}
                                onChange={(e) => setInput({ ...input, password: e.target.value })}
                                placeholder="Enter password" />
                        </div>
                        <Button
                            type="submit"
                            className="w-full"
                            onClick={handleLogin}
                        >
                            Login
                        </Button>
                    </form>
                    <p className="text-center text-gray-500 mt-4">
                        Don't have an account?{' '}
                        <Link to="/signup" className="text-gray-700 hover:underline">
                            Sign Up
                        </Link>
                    </p>
                </div>
            </div>
        </>
    );
};

export default memo(Login);
