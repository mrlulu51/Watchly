import { Poppins } from "next/font/google";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { LoginButton } from "@/components/auth/LoginButton";

const font = Poppins({
  subsets: ["latin"],
  weight: ["600"],
});

export default function Home() {
  return (
    <main className="flex h-full flex-col items-center justify-center bg-slate-100">
      <div className="space-y-6 text-center">
        <h1
          className={cn(
            "text-6xl font-semibold text-slate-900 drop-shadow-md",
            font.className
          )}
        >
          Watchly
        </h1>
        <p className="text-slate-900 text-lg">
          A simple app to rate and manage audiovisual content
        </p>
        <div>
          <LoginButton>
            <Button size={"lg"}>Sign in</Button>
          </LoginButton>
        </div>
      </div>
    </main>
  );
}
