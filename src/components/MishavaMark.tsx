import Image from "next/image";

export function MishavaMark({ className = "brand-mark" }: { className?: string }) {
  return (
    <Image
      alt=""
      aria-hidden
      className={className}
      height={575}
      src="/mishava-logo-source.png"
      width={420}
    />
  );
}
