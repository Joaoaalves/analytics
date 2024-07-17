import { Rubik } from "next/font/google";

const font = Rubik({ subsets: ["latin"] });

export default function Home() {
  return (
    <main
      className={`${font.className}`}
    >
    </main>
  );
}
