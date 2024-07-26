import { useState, useEffect } from "react"
import { LuChevronLeft, LuChevronRight } from "react-icons/lu"

interface ApplicationsDetailsProps {
    apps: number,
    errors: number,
    pageviews: number 
}

type DetailsType = "apps" | "pageviews" | "errors"

const Details = ({ label, number, type }: { label: string, number: number, type: DetailsType }) => (
    <div className="flex flex-col items-center h-full">
        <h3 className="text-3xl font-bold text-white">{label}</h3>
        <p className={`text-[100px] font-bold mt-auto`} style={{
            color: ['apps', 'pageviews'].includes(type) ? "green" : "red",
            filter: ['apps', 'pageviews'].includes(type) ? "drop-shadow(0px 0px 8px rgba(0,255,0,0.4))" : "drop-shadow(0px 0px 8px rgba(255,0,0,0.4))"
        }}>{number}</p>
    </div>
)

export default function ApplicationsDetails({ apps, errors, pageviews }: ApplicationsDetailsProps) {
    const [detailsType, setDetailsType] = useState<DetailsType>("apps")

    const detailsConfig = {
        apps: { label: "Total Applications", number: apps },
        errors: { label: "Total Errors", number: errors },
        pageviews: { label: "Total Pageviews", number: pageviews }
    }

    const handlePrevious = () => {
        setDetailsType(prev => {
            switch (prev) {
                case "apps": return "errors"
                case "errors": return "pageviews"
                case "pageviews": return "apps"
            }
        })
    }

    const handleNext = () => {
        setDetailsType(prev => {
            switch (prev) {
                case "apps": return "pageviews"
                case "pageviews": return "errors"
                case "errors": return "apps"
            }
        })
    }

    useEffect(() => {
        const interval = setInterval(handleNext, 5000)
        return () => clearInterval(interval)
    }, [])

    const currentDetails = detailsConfig[detailsType]

    return (
        <div className='flex flex-col bg-primary rounded-lg h-80 p-8 gap-y-8 relative'>
            <div className="flex items-start justify-between absolute gap-x-8 left-0 px-4 top-1/2 -translate-y-1/2 w-full">
                <button className="p-1 bg-black/30 hover:bg-black transition-all duration-300 rounded-full" onClick={handlePrevious}>
                    <LuChevronLeft className="text-white text-3xl"/>
                </button>
                <button className="p-1 bg-black/30 hover:bg-black transition-all duration-300 rounded-full" onClick={handleNext}>
                    <LuChevronRight className="text-white text-3xl"/>
                </button>
            </div>
            <Details label={currentDetails.label} number={currentDetails.number} type={detailsType}/>
        </div>
    )
}
