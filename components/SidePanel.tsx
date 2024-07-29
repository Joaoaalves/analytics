import Image from "next/image";
import React from "react"
import {default as NextLink} from "next/link";

import { LuLayoutDashboard, LuCode2, LuClock2, LuLogOut } from "react-icons/lu";

interface ILink {
  href: string,
  label: string,
  icon: React.ReactNode
}

const links : ILink[] = [
  {
    href: '/dashboard',
    label: 'Dashboard',
    icon: <LuLayoutDashboard />
  },
  {
    href: '/dashboard/pagespeed',
    label: 'Pagespeed',
    icon: <LuClock2 />
  },
  {
    href: '/dashboard/errors',
    label: 'Errors',
    icon: <LuCode2 />
  },
]

function Link({href, icon, label} : ILink){
  return (
      <NextLink href={href} className="flex pl-12 py-3 items-center gap-x-4 text-white text-xl hover:bg-black w-full transition-all duration-300">
      {icon}
      {label}
    </NextLink>
  )
}

export default function Sidepanel(){
  return (
    <aside className="p-8 bg-primary text-white grid grid-cols-1 grid-rows-[1fr_80px] place-items-center border-r-4 border-neutral-800">

      <nav className="w-full">
        <ul>
          {links && links.map((link) => (
            <li>
              <Link href={link.href} icon={link.icon} label={link.label} />
            </li>
          ))}
        </ul>
      </nav>

      <div className="border-t w-full border-neutral-700">
          <Link href="/logout" icon={<LuLogOut />} label={'Sign Out'} />
      </div>
  </aside>)
}