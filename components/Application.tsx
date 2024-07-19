import React from 'react';
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
    return (
        <HoverCard>
            <HoverCardTrigger className="text-center border-1 p-4 rounded shadow font-medium hover:bg-neutral-50 cursor-pointer transition-all duration-300">
                {name}
            </HoverCardTrigger>
            <HoverCardContent>{id}</HoverCardContent>
        </HoverCard>
    );
};

export default Application;
