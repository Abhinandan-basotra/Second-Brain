import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { memo } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '@/components/Navbar';

const Login = () => {
    return (
        <>
            <Navbar/>
            <div className="flex justify-center items-center h-screen bg-gray-100">
                <div className="w-full max-w-md bg-white rounded-lg shadow-md p-8">
                    <h2 className="text-2xl font-semibold mb-6 text-gray-700 text-center">Login</h2>
                    <form className="space-y-4">
                        <div>
                            <Label htmlFor="username" className="mb-1">Username</Label>
                            <Input id="username" type="text" placeholder="Enter username" />
                        </div>
                        <div>
                            <Label htmlFor="password" className="mb-1">Password</Label>
                            <Input id="password" type="password" placeholder="Enter password" />
                        </div>
                        <Button type="submit" className="w-full">
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
