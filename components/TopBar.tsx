import Image from "next/image"

export default function TopBar(){
  return (
    <div className="h-20 w-screen bg-primary flex items-center px-32 border-b-4 border-neutral-800">
        <Image className="drop-shadow-[0px_2px_6px_rgba(255,255,255,1)] group-hover:scale-110 transition-all duration-300" src={'/images/logo.svg'} width={56} height={32} alt="App logo"/>
    </div>
  )
}