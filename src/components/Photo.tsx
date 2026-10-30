import Image from "next/image";

export function Photo({
  src,
  alt,
  sizes,
  priority,
  className,
}: {
  src: string;
  alt: string;
  sizes?: string;
  priority?: boolean;
  className?: string;
}) {
  const classes = `absolute inset-0 h-full w-full object-cover ${className ?? ""}`;
  if (src.endsWith(".svg")) {
    return <img src={src} alt={alt} className={classes} />;
  }
  return <Image src={src} alt={alt} fill sizes={sizes ?? "(min-width: 1024px) 33vw, 100vw"} priority={priority} className={classes} />;
}
