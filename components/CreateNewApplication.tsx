import { useState } from 'react';

import handleCreateApplication from '@/lib/application';
import { Input } from './ui/input';
import Button from './Button';

import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
  } from "@/components/ui/dialog"

import { useRouter } from 'next/router';
  
const CreateNewApplication = () => {
    const [name, setName] = useState<string>('');
    const router = useRouter()

    const handleSubmit = async (e: any) => {
        e.preventDefault();

        await handleCreateApplication(name);

        router.push('/dashboard')
    };

    return (
        <Dialog>
            <DialogTrigger className='col-span-3 max-h-12 row-start-4 p-3 px-12 bg-neutral-800 text-white font-semibold rounded-lg hover:bg-neutral-200 hover:text-black cursor-pointer transition-all duration-300'>Create New App</DialogTrigger>
            <DialogContent className='bg-primary/20 border-neutral-500 text-white'>
                <DialogHeader>
                <DialogTitle>Create New App</DialogTitle>
                <DialogDescription className='text-neutral-300'>
                    You're about to create a new app for tracking all info.
                </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit} className='flex flex-col items-center justify-center gap-y-8 p-2'>
                <Input
                    type={'text'}
                    className={`!bg-transparent border-neutral-800  focus-visible:ring-offset-0 text-sm text-dark-gray`}
                    onChange={e => setName(e.target.value)}
                    value={name}
                    placeholder={'Application name...'}
                />

                <Button text={"Create new Application"} />

                </form>
            </DialogContent>
        </Dialog>

    );
};

export default CreateNewApplication;
