import PersonalLandingPage from "@/app/components/PersonalLandingPage";

export default function Home() {
  return (
    <div className="container mx-auto gap-16 sm:px-20 font-[family-name:var(--font-geist-sans)]">
      <main className="flex flex-col gap-[32px] row-start-2 items-center sm:items-start">
        <PersonalLandingPage />
      </main>
    </div>
  );
}
