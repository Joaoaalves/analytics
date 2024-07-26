import {IEvent} from "@/types/aws"
import ActionDetails from "./ActionDetails"
import { ScrollArea } from "@/components/ui/scroll-area"


interface LastErrorsProps{
  errors: IEvent[]
}

interface ErrorProps{
  type: string,
  timestamp: Date,
  details: object
}

function Error({ type, timestamp, details} : ErrorProps){
  const formatDate = (timestamp : Date) => {
      const ts: Date = new Date(timestamp);
      return `${ts.getDate()}/${ts.getMonth() + 1}/${ts.getFullYear()} - ${ts.getHours().toLocaleString('pt-BR', {minimumIntegerDigits: 2})}:${ts.getMinutes().toLocaleString('pt-BR', {minimumIntegerDigits: 2})}`;
  }

  return (
    <div className="text-white items-center grid grid-cols-3 gap-x-8 mb-4">
      <span className="text-red-600">{type}</span>
      <span>{formatDate(timestamp)}</span>
      <ActionDetails details={details}/>
    </div>
  )
}

export default function LastErrors({errors} : LastErrorsProps){
  return (
    <ScrollArea className="row-span-1 h-96 bg-primary py-4 px-8 rounded-lg">
      <div className="font-bold text-lg text-white grid grid-cols-3 gap-x-8 mb-4">
        <span>Error Type</span>
        <span>Date</span>
        <span>Details</span>
      </div>
      {errors.map(error => (
        <Error type={error.EventType} timestamp={error.Timestamp} details={error.Details} key={error.EventId} />
      ))}
    </ScrollArea>
  )
}