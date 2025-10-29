import type { HeadingProps as ReactAriaHeadingProps } from "react-aria-components";
import { Heading as ReactAriaHeading } from "react-aria-components";
import { cn } from "@/lib/utils/cn";

const Heading = ({
  children,
  className,
  level,
  ...props
}: ReactAriaHeadingProps) => {
  return (
    <ReactAriaHeading
      level={level}
      {...props}
      className={cn(
        "text-muted-high-contrast text-balance",
        level === 1 && "text-2xl/8 font-semibold sm:text-xl/8",
        level === 2 && "text-base/7 font-semibold sm:text-sm/6",
        className,
      )}
    >
      {children}
    </ReactAriaHeading>
  );
};

export { Heading };
