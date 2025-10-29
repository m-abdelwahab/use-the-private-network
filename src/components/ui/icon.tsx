import type { SVGProps } from "react";
import spriteHref from "/icons/sprite.svg?url";
import type { IconName } from "../../assets/icons/types";

export function Icon({
  name,
  ...props
}: SVGProps<SVGSVGElement> & {
  name: IconName;
}) {
  return (
    <svg {...props}>
      <title>{name}</title>
      <use href={`${spriteHref}#${name}`} />
    </svg>
  );
}
