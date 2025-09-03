import { ProfilePageTab } from "@/components/profile/ProfilePage";
import { cn } from "@/lib/utils";
import { integralCF } from "@/styles/fonts";

export default function ProfilePage() {
  return (
    <main className="max-w-frame mx-auto px-4 xl:px-0">
      <h2
        className={cn([
          integralCF.className,
          "font-bold text-[32px] md:text-[40px] text-black uppercase mb-5 md:mb-6",
        ])}
      >
        Your Profile
      </h2>
      <ProfilePageTab />
    </main>
  );
}
