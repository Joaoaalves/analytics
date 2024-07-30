import Signup from "@/components/Signup";
import Image from "next/image";
import { Toaster } from "sonner";

export default function Home() {
    return (
        <main
            className={`w-full h-[100vh] flex items-center justify-center bg-black`}
        >
            <div className="flex flex-col items-center justify-center">
                <Image
                    width={150}
                    height={100}
                    src={"/images/logo.svg"}
                    alt="Logo of Analytics"
                    className="drop-shadow-[0px_0px_6px_rgba(255,255,255,1)]"
                />
                <Signup />
            </div>
            <Toaster />
        </main>
    );
}