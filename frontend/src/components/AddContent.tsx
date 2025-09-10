import { Label } from '@radix-ui/react-label';
import React, { memo, type Dispatch, type SetStateAction } from 'react';
import { Input } from './ui/input';
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from './ui/button';
import { MoveLeft, Save } from 'lucide-react';
import { toast } from 'react-toastify';
import { API_END_POINT } from '@/utils';
import axios from 'axios';

interface AddContentProps {
    setOpenAddContent: Dispatch<SetStateAction<boolean>>;
    setContent: React.Dispatch<React.SetStateAction<{id: string, title: string; type: string; link: string; tags: string; }>>;
    content: { id: string, title: string; type: string; link: string; tags: string; };
}

interface AddContentResponse {
  message: string;
}

const AddContent = ({ setOpenAddContent, setContent, content }: AddContentProps) => {

    const handleBackgroundClick = () => {
        setOpenAddContent(false);
    };

    const handleContentClick = (e: React.MouseEvent) => {
        e.stopPropagation();
    };

    const handleAddContent = async (e: React.FormEvent) => {
        e.preventDefault()
        try {
            const res = await axios.post<AddContentResponse>(`${API_END_POINT}/content`, content, {
                withCredentials: true,
                headers: {
                    "Content-type": "application/json",
                    "Accept": "application/json"
                }
            })
            toast.success(res.data.message)
        } catch (error: any) {
            toast.error(error?.response?.data?.message)
        }finally{
            setOpenAddContent(false)
        }
    }

    return (
        <div
            className="fixed inset-0 bg-white bg-opacity-30 backdrop-blur-sm flex items-center justify-center z-40"
            onClick={handleBackgroundClick}
        >
            <div
                className="bg-white p-6 rounded-lg shadow-lg w-96"
                onClick={handleContentClick}
            >
                <h2 className="text-xl font-bold mb-4">Add Content</h2>
                <div className='flex-col'>
                    <div className="grid w-full max-w-sm items-center gap-1 mb-2">
                        <Label htmlFor="title">Title</Label>
                        <Input 
                        type="text" 
                        id="title" 
                        placeholder="Title" 
                        value={content.title}
                        onChange={(e) => setContent({...content, title: e.target.value})}
                        />
                    </div>
                    <div className="grid w-full max-w-sm items-center gap-1 mb-2">
                        <Label htmlFor="title">Type</Label>
                        <Select value={content.type} onValueChange={(value: string) => setContent({...content, type: value})}>
                            <SelectTrigger className="w-[180px]">
                                <SelectValue placeholder="Select Type" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectGroup>
                                    <SelectItem value="image">Image</SelectItem>
                                    <SelectItem value="video">Video</SelectItem>
                                    <SelectItem value="article">Article</SelectItem>
                                    <SelectItem value="audio">Audio</SelectItem>
                                </SelectGroup>
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="grid w-full max-w-sm items-center gap-1 mb-2">
                        <Label htmlFor="link">Link</Label>
                        <Input 
                        type="link" 
                        id="link" 
                        placeholder="Link" 
                        value={content.link}
                        onChange={(e) => setContent({...content, link: e.target.value})}
                        />
                    </div>
                    <div className="grid w-full max-w-sm items-center gap-1 mb-2">
                        <Label htmlFor="tags">Tags</Label>
                        <Input 
                        type="tags" 
                        id="tags" 
                        placeholder="Tags" 
                        value={content.tags}
                        onChange={(e) => setContent({...content, tags: e.target.value})}
                        />
                    </div>
                </div>
                <div className="flex mt-7 justify-between">
                    <Button 
                    className="bg-[#5046E4] hover:bg-[#3b36b0] text-white px-4 py-2 rounded-lg flex items-center gap-2"
                    onClick={handleAddContent}
                    >
                        <Save/>
                        <span>Submit</span>
                    </Button>
                    <Button
                        className="bg-[#b7c2e6] hover:bg-[#a09ed9] text-[#5046E4] px-4 py-2 rounded-lg flex items-center gap-2"
                        onClick={() => setOpenAddContent(false)}
                    >
                        <MoveLeft/>
                        <span>Cancel</span>
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default memo(AddContent);
