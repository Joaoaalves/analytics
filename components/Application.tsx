import React from 'react';
import { useRouter } from 'next/router';
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
    const router = useRouter()

    const handleCardClick = () => {
        router.push(`/application/${id}`)
    }

    return (
        <HoverCard>
            <HoverCardTrigger onClick={handleCardClick} className="text-center border-1 p-4 rounded shadow font-medium hover:bg-neutral-50 cursor-pointer transition-all duration-300">
                {name}
            </HoverCardTrigger>
            <HoverCardContent>{id}</HoverCardContent>
        </HoverCard>
    );
};

export default Application;
