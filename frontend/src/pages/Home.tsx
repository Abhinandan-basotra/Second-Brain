import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarGroup,
    SidebarGroupContent,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarProvider,
} from '@/components/ui/sidebar';
import { authSlice } from '@/store/atoms/auth';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
    Brain,
    Twitter,
    Video,
    Book,
    Tag,
    User2,
    Link,
    ChevronUp,
    Share,
    Plus,
    File,
    Trash,
    NotebookPen,
    Youtube,
    Search,
    Filter,
} from 'lucide-react';
import { memo, useEffect, useState, type JSX } from 'react';
import { useRecoilValue, useSetRecoilState } from 'recoil';
import { Button } from '@/components/ui/button';
import { Link as AnotherLink, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import axios from 'axios';
import { API_END_POINT } from '@/utils';
import AddContent from '@/components/AddContent';
import { getIconType } from '@/utils/getIconType';
import ShareBrain from '@/components/ShareBrain';

interface ProfileResponse {
    user: {
        username: string;
    };
}

interface ContentResponse {
    content: { _id: string, title: string; type: string; link: string; tags: string, createdAt: string }[];
}

interface APIResponse {
    message: string;
}

const HomePage = () => {
    const user = useRecoilValue(authSlice);
    const setAuth = useSetRecoilState(authSlice);
    const [openAddContent, setOpenAddContent] = useState(false);
    const navigate = useNavigate();
    const [openShareModal, setOpenShareModal] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedFilter, setSelectedFilter] = useState('all');

    const [allContent, setAllContent] = useState<
        { _id: string, title: string; type: string; link: string; tags: string[]; createdAt: string }[]
    >([]);

    const [content, setContent] = useState({
        id: '',
        title: '',
        type: '',
        link: '',
        tags: '',
    });

    const items = [
        {
            title: 'All Content',
            url: '#',
            icon: Brain,
            filter: 'all'
        },
        {
            title: 'Tweets',
            url: '#',
            icon: Twitter,
            filter: 'twitter'
        },
        {
            title: 'Videos',
            url: '#',
            icon: Video,
            filter: 'video'
        },
        {
            title: 'Documents',
            url: '#',
            icon: Book,
            filter: 'document'
        },
        {
            title: 'Links',
            url: '#',
            icon: Link,
            filter: 'link'
        },
    ];

    // Map icon types to header icons
    const iconMap: Record<string, JSX.Element> = {
        Youtube: <Youtube className="text-red-500" size={20} />,
        Twitter: <Twitter className="text-blue-400" size={20} />,
        Notion: <NotebookPen className="text-gray-800" size={20} />,
        Default: <File className="text-gray-500" size={20} />,
    };

    const getContent = async () => {
        try {
            const res = await axios.get<ContentResponse>(
                `${API_END_POINT}/content`,
                {
                    withCredentials: true,
                    headers: {
                        'Content-type': 'application/json',
                        Accept: 'application/json',
                    },
                }
            );

            setAllContent(
                res.data.content.map((item) => ({
                    ...item,
                    tags: Array.isArray(item.tags)
                        ? item.tags
                        : item.tags.split(',').map((tag) => tag.trim()),
                }))
            );
        } catch (error: any) {
            toast.error(
                error.response?.data?.message || 'Failed to fetch content'
            );
        }
    };

    useEffect(() => {
        getContent()
    }, [user])

    useEffect(() => {
        if (!user) return;
        const getProfile = async () => {
            setAuth(null);
            try {
                const res = await axios.get<ProfileResponse>(
                    `${API_END_POINT}/getProfile`,
                    {
                        withCredentials: true,
                        headers: {
                            Accept: 'application/json',
                        },
                    }
                );
                setAuth({ username: res.data.user.username });
            } catch (error: any) {
                toast.error(error.response.data.message);
            }
        };
        getProfile();
    }, []);

    const handleDelete = async (contentId: string) => {
        try {
            const res = await axios.post<APIResponse>(`${API_END_POINT}/delete`, { contentId }, {
                withCredentials: true,
                headers: {
                    "Content-type": "application/json",
                    "Accept": "application/json"
                }
            })
            toast.success(res.data.message)
        } catch (error: any) {
            console.log(error);
            toast.error(error.data.response.message);
        }
        getContent()
    }

    const handleLogout = async () => {
        try {
            const res = await axios.get<APIResponse>(
                `${API_END_POINT}/logOut`,
                {
                    withCredentials: true,
                }
            );
            toast.success(res.data.message);
            setAuth(null);
        } catch (error: any) {
            toast.error(error.response.data.message);
        } finally {
            navigate('/login');
        }
    };

    function formatDate(createdAt: string): string {
        const date = new Date(createdAt);
        const day = String(date.getDate()).padStart(2, "0");
        const month = String(date.getMonth() + 1).padStart(2, "0");
        const year = date.getFullYear();
        return `${day}/${month}/${year}`;
    }

    // Filter content based on search and selected filter
    const filteredContent = allContent.filter(item => {
        const matchesSearch = item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            item.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
        
        if (selectedFilter === 'all') return matchesSearch;
        
        const itemType = getIconType(item.link).toLowerCase();
        return matchesSearch && (
            (selectedFilter === 'twitter' && itemType === 'twitter') ||
            (selectedFilter === 'video' && itemType === 'youtube') ||
            (selectedFilter === 'document' && itemType === 'notion') ||
            (selectedFilter === 'link' && itemType === 'default')
        );
    });

    return (
        <div className="flex h-screen bg-gradient-to-br from-slate-50 to-blue-50 relative">
            {/* Blur overlay when modal is open */}
            {(openAddContent || openShareModal) && (
                <div className="absolute inset-0 bg-black bg-opacity-20 backdrop-blur-sm z-40" />
            )}
            
            {/* Modals */}
            {openAddContent && (
                <div className="relative z-50">
                    <AddContent
                        setOpenAddContent={setOpenAddContent}
                        setContent={setContent}
                        content={content}
                    />
                </div>
            )}
            {openShareModal && (
                <div className="relative z-50">
                    <ShareBrain setOpenShareModal={setOpenShareModal} />
                </div>
            )}

            {/* Sidebar */}
            <section className={`w-80 transition-all duration-300 ${(openAddContent || openShareModal) ? 'blur-sm' : ''}`}>
                <SidebarProvider>
                    <Sidebar className="border-r border-slate-200 bg-white/80 backdrop-blur-sm">
                        <SidebarHeader className="p-6">
                            <div className="flex items-center space-x-3">
                                <div className="p-2 bg-gradient-to-r from-purple-500 to-blue-500 rounded-xl">
                                    <Brain className="h-6 w-6 text-white" />
                                </div>
                                <div>
                                    <h1 className="text-xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                                        Second Brain
                                    </h1>
                                    <p className="text-xs text-slate-500">Knowledge Management</p>
                                </div>
                            </div>
                        </SidebarHeader>
                        
                        <SidebarContent className="px-4">
                            <SidebarGroup>
                                <SidebarGroupContent>
                                    <SidebarMenu className="space-y-2">
                                        {items.map((item) => (
                                            <SidebarMenuItem key={item.title}>
                                                <SidebarMenuButton
                                                    className={`text-base py-3 px-4 rounded-xl transition-all duration-200 ${
                                                        selectedFilter === item.filter
                                                            ? 'bg-gradient-to-r from-purple-500 to-blue-500 text-white shadow-lg'
                                                            : 'hover:bg-slate-100 text-slate-700 hover:text-slate-900'
                                                    }`}
                                                    onClick={() => setSelectedFilter(item.filter)}
                                                >
                                                    <item.icon className="mr-3" size={18} />
                                                    <span className="font-medium">{item.title}</span>
                                                </SidebarMenuButton>
                                            </SidebarMenuItem>
                                        ))}
                                    </SidebarMenu>
                                </SidebarGroupContent>
                            </SidebarGroup>
                        </SidebarContent>

                        {user && user.username && (
                            <SidebarFooter className="p-4">
                                <SidebarMenu>
                                    <SidebarMenuItem>
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <button className="w-full">
                                                    <SidebarMenuButton className="w-full py-3 px-4 rounded-xl bg-slate-100 hover:bg-slate-200 transition-colors">
                                                        <div className="flex items-center space-x-3">
                                                            <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full flex items-center justify-center">
                                                                <User2 size={16} className="text-white" />
                                                            </div>
                                                            <div className="flex-1 text-left">
                                                                <p className="font-medium text-slate-800">{user.username}</p>
                                                                <p className="text-xs text-slate-500">Premium User</p>
                                                            </div>
                                                            <ChevronUp className="text-slate-400" size={16} />
                                                        </div>
                                                    </SidebarMenuButton>
                                                </button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent
                                                side="top"
                                                className="w-[280px] ml-4 mb-2 rounded-xl shadow-xl border-0 bg-white/90 backdrop-blur-sm"
                                            >
                                                <DropdownMenuItem
                                                    onClick={handleLogout}
                                                    className="py-3 px-4 text-red-600 hover:bg-red-50 rounded-lg m-2"
                                                >
                                                    <span className="font-medium">Sign out</span>
                                                </DropdownMenuItem>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </SidebarMenuItem>
                                </SidebarMenu>
                            </SidebarFooter>
                        )}
                    </Sidebar>
                </SidebarProvider>
            </section>

            {/* Main Content */}
            <main className={`flex-1 min-w-0 h-screen overflow-auto transition-all duration-300 ${(openAddContent || openShareModal) ? 'blur-sm' : ''}`}>
                <div className="p-8 space-y-8">
                    {/* Header */}
                    <div className="flex flex-col lg:flex-row lg:justify-between lg:items-center gap-6">
                        <div>
                            <h1 className="text-4xl font-bold text-slate-800 mb-2">
                                Your Knowledge Hub
                            </h1>
                            <p className="text-slate-600">
                                {allContent.length} items • {filteredContent.length} showing
                            </p>
                        </div>
                        
                        {!user || !user.username ? (
                            <div className="flex items-center space-x-4">
                                <AnotherLink to="/login">
                                    <Button
                                        variant="ghost"
                                        className="text-slate-700 hover:bg-slate-100 px-6 py-2 rounded-xl"
                                    >
                                        Login
                                    </Button>
                                </AnotherLink>
                                <AnotherLink to="/signup">
                                    <Button className="bg-gradient-to-r from-purple-500 to-blue-500 text-white hover:from-purple-600 hover:to-blue-600 px-6 py-2 rounded-xl shadow-lg">
                                        Get Started
                                    </Button>
                                </AnotherLink>
                            </div>
                        ) : (
                            <div className="flex gap-3">
                                <Button 
                                    className="bg-slate-100 hover:bg-slate-200 text-slate-700 px-6 py-2 rounded-xl flex items-center gap-3 shadow-sm border border-slate-200"
                                    onClick={() => setOpenShareModal(true)}
                                >
                                    <Share size={18} />
                                    <span className="font-medium">Share Brain</span>
                                </Button>
                                <Button
                                    className="bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 text-white px-6 py-2 rounded-xl flex items-center gap-3 shadow-lg"
                                    onClick={() => setOpenAddContent(true)}
                                >
                                    <Plus size={18} />
                                    <span className="font-medium">Add Content</span>
                                </Button>
                            </div>
                        )}
                    </div>

                    {/* Search and Filter Bar */}
                    {user && user.username && (
                        <div className="flex flex-col sm:flex-row gap-4 items-center">
                            <div className="relative flex-1">
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" size={18} />
                                <input
                                    type="text"
                                    placeholder="Search your content..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 bg-white/80 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                                />
                            </div>
                            <div className="flex items-center gap-2 text-sm text-slate-600 bg-white/80 backdrop-blur-sm rounded-xl px-4 py-3 border border-slate-200">
                                <Filter size={16} />
                                <span>Filter: {items.find(item => item.filter === selectedFilter)?.title}</span>
                            </div>
                        </div>
                    )}

                    {/* Content Grid */}
                    {filteredContent.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-20">
                            <div className="p-6 bg-white/50 rounded-full mb-6">
                                <Brain className="h-12 w-12 text-slate-400" />
                            </div>
                            <h3 className="text-xl font-semibold text-slate-600 mb-2">
                                {allContent.length === 0 ? 'No content yet' : 'No matching content found'}
                            </h3>
                            <p className="text-slate-500 text-center max-w-md">
                                {allContent.length === 0 
                                    ? 'Start building your second brain by adding your first piece of content.'
                                    : 'Try adjusting your search or filter criteria.'
                                }
                            </p>
                            {allContent.length === 0 && user && user.username && (
                                <Button
                                    className="mt-6 bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 text-white px-6 py-2 rounded-xl shadow-lg"
                                    onClick={() => setOpenAddContent(true)}
                                >
                                    <Plus className="mr-2" size={18} />
                                    Add Your First Content
                                </Button>
                            )}
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                            {filteredContent.map((item) => {
                                const iconType = getIconType(item.link);
                                return (
                                    <div 
                                        key={item._id} 
                                        className="group bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-sm hover:shadow-xl border border-slate-200/50 transition-all duration-300 hover:scale-105 hover:bg-white"
                                    >
                                        {/* Card Header */}
                                        <div className="flex justify-between items-start mb-4">
                                            <div className="flex items-center gap-3 flex-1 min-w-0">
                                                <div className="p-2 bg-slate-50 rounded-lg group-hover:bg-slate-100 transition-colors">
                                                    {iconMap[iconType] || iconMap.Default}
                                                </div>
                                                <div className="min-w-0 flex-1">
                                                    <h3 className="font-semibold text-slate-800 truncate group-hover:text-purple-600 transition-colors">
                                                        {item.title}
                                                    </h3>
                                                    <p className="text-xs text-slate-500">
                                                        {formatDate(item.createdAt)}
                                                    </p>
                                                </div>
                                            </div>
                                            
                                            <div className="flex gap-2 ml-2">
                                                <button className="p-2 rounded-lg hover:bg-blue-50 text-slate-400 hover:text-blue-500 transition-all opacity-0 group-hover:opacity-100">
                                                    <Share size={16} />
                                                </button>
                                                <button 
                                                    onClick={() => handleDelete(item._id)}
                                                    className="p-2 rounded-lg hover:bg-red-50 text-slate-400 hover:text-red-500 transition-all opacity-0 group-hover:opacity-100"
                                                >
                                                    <Trash size={16} />
                                                </button>
                                            </div>
                                        </div>

                                        {/* Link Preview */}
                                        <div className="mb-4">
                                            <a 
                                                href={item.link} 
                                                target="_blank" 
                                                rel="noopener noreferrer" 
                                                className="text-blue-600 hover:text-blue-700 text-sm break-all hover:underline transition-colors"
                                            >
                                                {item.link.length > 50 ? `${item.link.substring(0, 50)}...` : item.link}
                                            </a>
                                        </div>

                                        {/* Tags */}
                                        {item.tags && item.tags.length > 0 && (
                                            <div className="flex flex-wrap gap-1">
                                                {item.tags.slice(0, 3).map((tag, index) => (
                                                    <span 
                                                        key={index}
                                                        className="px-2 py-1 bg-purple-50 text-purple-600 text-xs rounded-lg font-medium"
                                                    >
                                                        #{tag}
                                                    </span>
                                                ))}
                                                {item.tags.length > 3 && (
                                                    <span className="px-2 py-1 bg-slate-100 text-slate-500 text-xs rounded-lg">
                                                        +{item.tags.length - 3} more
                                                    </span>
                                                )}
                                            </div>
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
};

export default memo(HomePage);