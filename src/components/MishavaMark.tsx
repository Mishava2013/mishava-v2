import Image from "next/image";

export function MishavaMark({ className = "brand-mark" }: { className?: string }) {
  return (
    <Image
      alt=""
      aria-hidden
      className={className}
      height={575}
      src="/mishava-logo-transparent.png"
      width={420}
    />
  );
}
