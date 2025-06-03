import PersonalLandingPage from "@/app/components/PersonalLandingPage";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Home - Dane Willacker",
  description: "Homepage for Dane Willacker, showcasing AI and XR development projects.",
};

export default function Home() {
  return (
    <div className="container mx-auto gap-16 sm:px-20 font-[family-name:var(--font-geist-sans)]">
      <main className="flex flex-col gap-[32px] row-start-2 items-center sm:items-start">
        <PersonalLandingPage />
      </main>
    </div>
  );
}
