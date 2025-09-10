import React, { memo, useEffect, useRef, useState, type Dispatch, type SetStateAction } from 'react';
import { Button } from './ui/button';
import { toast } from 'react-toastify';
import axios from 'axios';
import { API_END_POINT } from '@/utils';

interface AddContentProps {
    setOpenShareModal: Dispatch<SetStateAction<boolean>>;
}

interface ShareLink {
    hash: string;
    message: string;
}

const ShareBrain = ({ setOpenShareModal }: AddContentProps) => {
    const modalRef = useRef<HTMLDivElement>(null);
    const [shareLink, setShareLink] = useState<string | null>(null);
    const [buttonText, setButtonText] = useState('Share');

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
                setOpenShareModal(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [setOpenShareModal]);

    const handleShare = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const res = await axios.post<ShareLink>(
                `${API_END_POINT}/brain/share`,
                { share: true },
                {
                    withCredentials: true,
                    headers: {
                        "Content-type": "application/json",
                        "Accept": "application/json"
                    }
                }
            );

            const link = res.data.hash;
            setShareLink(link);
            toast.success(res.data.message);

            const fullLink = `http://localhost:5173/shareable/${link}`;
            await navigator.clipboard.writeText(fullLink);
            setButtonText('Link Copied!');
            
            // Reset button text after 2 seconds
            setTimeout(() => {
                setButtonText('Share');
            }, 2000);

        } catch (error) {
            console.error(error);
            toast.error("Something went wrong");
        }
    };

    return (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-none">
            <div ref={modalRef} className="relative w-full max-w-md bg-white opacity-95 rounded-xl shadow-lg p-6">
                <div className="flex flex-col gap-5">
                    <p className="text-gray-700 text-base">
                        Share your entire collection of notes, documents, tweets, and videos with others. They'll be able to import your content into their own Second Brain.
                    </p>
                    <Button 
                        className="bg-[#5046E4] hover:bg-[#3b36b0] text-white px-4 py-2 rounded-lg"
                        onClick={handleShare}
                    >
                        {buttonText}
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default memo(ShareBrain);
