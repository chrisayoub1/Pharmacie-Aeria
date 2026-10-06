import { Instagram, Facebook } from "lucide-react";

const SOCIALS = [
  {
    name: "Instagram",
    href: "https://www.instagram.com/pharmacie_aeria/",
    label: "@pharmacie_aeria",
  },
  {
    name: "TikTok",
    href: "https://www.tiktok.com/@pharmacieaeria",
    label: "@pharmacieaeria",
  },
  {
    name: "Facebook",
    href: "https://www.facebook.com/profile.php?id=100089663596760",
    label: "Pharmacie Aeria",
  },
];

function TikTokIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
      className={className}
    >
      <path d="M12.53.02C13.84 0 15.14.01 16.44 0c.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.08-5.86 3.03-1.94-.04-3.84-.92-5.14-2.39C1.62 17.99.64 15.97.7 13.91c.07-2.09 1.22-4.12 2.9-5.35 1.67-1.24 3.85-1.7 5.87-1.14.03 1.48-.06 2.96-.06 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.29 1.77-.24.85-.05 1.8.51 2.51.7.93 2.03 1.35 3.13.9.88-.34 1.55-1.17 1.63-2.11.09-1.38.04-2.77.06-4.15V.02z" />
    </svg>
  );
}

function Icon({ name, className }: { name: string; className?: string }) {
  if (name === "Instagram") return <Instagram className={className} />;
  if (name === "Facebook") return <Facebook className={className} />;
  return <TikTokIcon className={className} />;
}

export function SocialLinks({ className = "" }: { className?: string }) {
  return (
    <div className={"flex items-center gap-3 " + className}>
      {SOCIALS.map((s) => (
        <a
          key={s.name}
          href={s.href}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={s.name}
          title={s.label}
          className="flex h-10 w-10 items-center justify-center rounded-full ring-1 ring-current/25 bg-current/10 text-current transition-all hover:scale-105"
        >
          <Icon name={s.name} className="h-4.5 w-4.5" />
        </a>
      ))}
    </div>
  );
}
