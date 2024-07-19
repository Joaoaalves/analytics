import axios from 'axios';

export default async function handleCreateApplication(name: string) {
    try {
        const res = await axios.post('/api/application', {
            data: { name }
        });
        const applicationID = res.data.ApplicationId;
        return applicationID;
    } catch (error) {
        console.log(
            `An error ocurred while creating new application: ${error}`
        );
        return { message: 'An Error Ocurred!' };
    }
}
