import Signup from "@/components/Signup";
import Image from "next/image";
import { Toaster } from "sonner";

export default function Home() {
    return (
        <main
            className={`w-full h-[100vh] flex items-center justify-center bg-background`}
        >
            <div className="flex flex-col items-center justify-center">
                <Image
                    width={185}
                    height={40}
                    src={"/images/logo.svg"}
                    alt="Logo of Analytics"
                    className="mb-12"
                />
                <Signup />
            </div>
            <Toaster />
        </main>
    );
}