import { memo } from 'react';
import { Brain } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { useRecoilValue } from 'recoil';
import { authSlice } from '@/store/atoms/auth';
import { Avatar, AvatarFallback, AvatarImage } from '@radix-ui/react-avatar';

const Navbar = () => {
    const user = useRecoilValue(authSlice);
    return (
        <nav className="flex justify-between items-center px-6 py-4 bg-white shadow-sm">
            {/* Logo */}
            <div className="flex items-center space-x-2">
                <Brain className="h-6 w-6 text-gray-700" />
                <span className="text-xl font-bold text-gray-800">Second Brain</span>
            </div>

            {
                (user && user.username) ?
                    <div className='flex flex-row flex-wrap items-center gap-2'>
                    <Avatar>
                        <AvatarImage src="https://github.com/shadcn.png" className='rounded-2xl w-8'/>
                        <AvatarFallback>{user.username}</AvatarFallback>
                    </Avatar>
                    </div>
                    :

                    <div className="flex items-center space-x-4">
                        <Link to="/login">
                            <Button variant="ghost" className="text-gray-700 hover:bg-gray-100">
                                Login
                            </Button>
                        </Link>
                        <Link to="/signup">
                            <Button className="bg-gray-700 text-white hover:bg-gray-800">
                                Signup
                            </Button>
                        </Link>
                    </div>
            }
        </nav>
    );
};

export default memo(Navbar);
