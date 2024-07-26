import React from 'react';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"

import { Button } from '@/components/ui/button';

interface ActionDetailsProps {
    details: Object;
}

const ActionDetails: React.FC<ActionDetailsProps> = ({ details }) => {
    return (
        <Dialog>
            <DialogTrigger className='bg-primary' asChild>
                <Button variant="outline">See Details</Button>
            </DialogTrigger>
            <DialogContent className="bg-primary text-white border-neutral-600">
                <DialogTitle>Event Details</DialogTitle>
                <DialogDescription>
                    {details && Object.entries(details).map(([key, value]) => (
                        <div className='grid grid-cols-2 text-white'>
                            <span className="font-bold">{key}</span>
                            <span>{value}</span>
                        </div>
                    )) }
                </DialogDescription>
            </DialogContent>
        </Dialog>
    );
};

export default ActionDetails;
