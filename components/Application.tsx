import React from "react";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card"


interface ApplicationProps {
  name:string
}

const Application = ({name}:ApplicationProps) => {
  return (
    <HoverCard>
      <HoverCardTrigger className="text-center border-1 p-4 rounded shadow font-medium hover:bg-neutral-50 cursor-pointer transition-all duration-300">{name}</HoverCardTrigger>
      <HoverCardContent>
        Lorem ipsum dolor sit amet consectetur, adipisicing elit. Asperiores corrupti fugit omnis nemo quaerat? Eaque vero nemo repudiandae magnam nulla est distinctio obcaecati tempora facilis voluptatum quo, deleniti dolore voluptas.
      </HoverCardContent>
    </HoverCard>
  )
}

export default Application;