import { memo } from 'react';
import { Brain } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

const Navbar = () => {
    return (
        <nav className="flex justify-between items-center px-6 py-4 bg-white shadow-sm">
            {/* Logo */}
            <div className="flex items-center space-x-2">
                <Brain className="h-6 w-6 text-gray-700" />
                <span className="text-xl font-bold text-gray-800">Second Brain</span>
            </div>

            {/* Navigation Links */}
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
        </nav>
    );
};

export default memo(Navbar);
