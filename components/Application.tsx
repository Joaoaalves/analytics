import React from 'react';
import { useRouter } from 'next/router';
import { HiOutlineTrash } from "react-icons/hi2";
import nookies from 'nookies';

import {
    HoverCard,
    HoverCardContent,
    HoverCardTrigger
} from '@/components/ui/hover-card';

interface ApplicationProps {
    name: string;
    id: string;
}

const Application = ({ name, id }: ApplicationProps) => {
    const router = useRouter();

    const handleCardClick = () => {
        router.push(`/dashboard/application/${id}`);
    };

    const handleDeleteApplication = async () => {
        try {
            const response = await fetch(`/api/deleteApplication?ApplicationId=${id}`, {
                method: 'DELETE',
            });
            
            const result = await response.json();
            
            if (response.ok) {
                console.log(result.message);
                router.push('/dashboard');
            } else {
                console.error('Error deleting application:', result.error);
            }
        } catch (error) {
            console.error('Error deleting application:', error);
        }
    };

    return (
        <HoverCard>
            <HoverCardTrigger onClick={handleCardClick} className="flex items-center justify-center text-white border border-white/20 p-4 rounded shadow font-bold hover:bg-neutral-200 hover:text-black cursor-pointer transition-all duration-300">
                {name}
            </HoverCardTrigger>
            <HoverCardContent className='flex flex-col items-start justify-between bg-neutral-900 border-none shadow-white/5 text-white w-full'>
                <span>App Name: {name}</span>
                <span>App Id: <b>{id}</b></span>
                <div className='flex items-center justify-center mt-8 w-full'>
                    <button onClick={handleDeleteApplication} className='bg-red-700 py-1 px-6 rounded hover:bg-red-900 transition-all duration-300'><HiOutlineTrash className='text-2xl'/></button>
                </div>
            </HoverCardContent>
        </HoverCard>
    );
};

export default Application;