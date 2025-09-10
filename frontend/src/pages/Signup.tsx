import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import React, { memo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import { toast } from 'react-toastify';
import axios from 'axios';
import { API_END_POINT } from '@/utils';

const Signup = () => {
    interface SignRes{
        message: string
    }
    const [input, setInput] = useState({username:  "", password: ""});
    const navigate = useNavigate();
    const handleSignup = async (e: React.FormEvent) => {
        e.preventDefault()
        try {
            const res = await axios.post<SignRes>(`${API_END_POINT}/signup`, input, {
                headers: {
                    "Content-type": "application/json"
                }
            })
            toast.success(res.data.message)
            navigate('/login')
        } catch (error: any) {
            toast.error(error.response.data.message)
        }
    }
    return (
        <>
            <Navbar />
            <div className="flex justify-center items-center h-screen bg-gray-100">
                <div className="w-full max-w-md bg-white rounded-lg shadow-md p-8">
                    <h2 className="text-2xl font-semibold mb-6 text-gray-700 text-center">Sign Up</h2>
                    <form className="space-y-4">
                        <div>
                            <Label htmlFor="username" className='mb-1'>Username</Label>
                            <Input 
                            id="username" 
                            type="text" 
                            placeholder="Enter username" 
                            value={input.username}
                            onChange={(e) => setInput({...input, username: e.target.value})}
                            />
                        </div>
                        <div>
                            <Label htmlFor="password" className='mb-1'>Password</Label>
                            <Input 
                            id="password" 
                            type="password" 
                            placeholder="Enter password" 
                            value={input.password}
                            onChange={(e) => setInput({...input, password: e.target.value})}
                            />
                        </div>
                        <Button 
                        type="submit" 
                        className="w-full"
                        onClick={handleSignup}
                        >
                            Sign Up
                        </Button>
                    </form>
                    <p className="text-center text-gray-500 mt-4">
                        Already have an account?{' '}
                        <Link to="/login" className="text-gray-700 hover:underline">
                            Login
                        </Link>
                    </p>
                </div>
            </div>
        </>
    );
};

export default memo(Signup);
