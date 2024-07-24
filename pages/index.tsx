"use client";
import Login from "@/components/Login";
import Image from "next/image";

export default function Home() {
  return (
    <main
      className={`w-full h-[100vh] flex items-center justify-center bg-background`}
      role="main"
    >
        <div className="flex flex-col items-center justify-center">
          <Image
            width={185}
            height={40}
            src={"/images/logo.svg"}
            alt="Logo of Analytics"
          />
          <Login />
        </div>
    </main>
  );
}