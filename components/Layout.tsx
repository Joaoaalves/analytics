import Sidepanel from "./SidePanel";
import {Rubik} from "next/font/google"
import TopBar from "./TopBar";

const font = Rubik({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700', '800', '900'],
  style: 'normal'
})

export default function Layout({children} : {children:React.ReactNode}){
  return(
    <>
    <TopBar />
    <main className={`${font.className} grid grid-cols-[320px_1fr] w-screen h-[calc(100vh-80px)]`}>
      <Sidepanel />
      {children}
    </main>
    </>
  )
}