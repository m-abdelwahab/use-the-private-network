import type { TextProps as ReactAriaTextProps } from "react-aria-components";
import { Text as ReactAriaText } from "react-aria-components";
import { cn } from "@/lib/utils/cn";

const Text = ({
  children,
  className,
  elementType = "p",
  ...props
}: ReactAriaTextProps) => {
  return (
    <ReactAriaText
      {...props}
      elementType={elementType}
      className={cn("text-base/6 sm:text-sm/6", className)}
    >
      {children}
    </ReactAriaText>
  );
};

export { Text };
