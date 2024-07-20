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
    const formattedDetails = JSON.stringify(details, null, 2);

    return (
        <Dialog>
            <DialogTrigger className='ms-auto' asChild>
                <Button variant="outline">See Details</Button>
            </DialogTrigger>
            <DialogContent>
                <DialogTitle>Event Details</DialogTitle>
                <DialogDescription>
                    <pre className="whitespace-pre-wrap">{formattedDetails}</pre>
                </DialogDescription>
            </DialogContent>
        </Dialog>
    );
};

export default ActionDetails;
