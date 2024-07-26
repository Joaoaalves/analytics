import { IEvent } from "@/types/aws";

export function sortEventsByTimestamp(events:IEvent[]){
    events.sort((a, b) => {
        const dateA = new Date(a.Timestamp).getTime();
        const dateB = new Date(b.Timestamp).getTime();
        return dateB - dateA;
    });
}