import {
  Link as AriaLink,
  type LinkProps as AriaLinkProps,
  composeRenderProps,
} from "react-aria-components";
import { cn } from "@/lib/utils/cn";

const Link = ({ className, ...props }: AriaLinkProps) => {
  return (
    <AriaLink
      className={composeRenderProps(className, (className) =>
        cn(
          "text-primary-base data-focus-visible:ring-primary-solid ring-offset-muted-app rounded-xs underline-offset-4 ring-offset-2 outline-none data-focus-visible:ring-2 data-hovered:underline",
          className,
        ),
      )}
      {...props}
    />
  );
};

export { Link };
