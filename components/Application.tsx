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
        router.push(`/application/${id}`);
    };

    const handleDeleteApplication = async () => {
        try {
            const response = await fetch(`/api/deleteApplication?ApplicationId=${id}`, {
                method: 'DELETE',
            });
            
            const result = await response.json();
            
            if (response.ok) {
                console.log(result.message);
                router.push('/');
            } else {
                console.error('Error deleting application:', result.error);
            }
        } catch (error) {
            console.error('Error deleting application:', error);
        }
    };

    return (
        <HoverCard>
            <HoverCardTrigger onClick={handleCardClick} className="text-center border-1 p-4 rounded shadow font-medium hover:bg-neutral-50 cursor-pointer transition-all duration-300">
                {name}
            </HoverCardTrigger>
            <HoverCardContent className='flex flex-col items-center justify-between'>
                <span>{id}</span>
                <div className='flex items-center justify-between'>
                    <button onClick={handleDeleteApplication}><HiOutlineTrash /></button>
                </div>
            </HoverCardContent>
        </HoverCard>
    );
};

export default Application;