import { useState } from 'react';

import handleCreateApplication from '@/lib/application';

const CreateNewApplication = () => {
    const [name, setName] = useState<string>('');

    const handleSubmit = (e: any) => {
        e.preventDefault();

        handleCreateApplication(name);
    };

    return (
        <form onSubmit={handleSubmit}>
            <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
            />

            <button>Create new Application</button>
        </form>
    );
};

export default CreateNewApplication;
