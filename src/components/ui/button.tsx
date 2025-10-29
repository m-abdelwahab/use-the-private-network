import {
  Button as AriaButton,
  type ButtonProps as AriaButtonProps,
  composeRenderProps,
} from "react-aria-components";

import { cn } from "@/lib/utils/cn";

const buttonVariants = {
  base: [
    "inline-flex items-center justify-center whitespace-nowrap rounded-lg text-sm ring-offset-muted-app transition-colors",
    /* Disabled */
    "data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
    /* Focus Visible */
    "data-[focus-visible]:outline-none data-[focus-visible]:ring-2 data-[focus-visible]:ring-primary data-[focus-visible]:ring-offset-2",
    /* Resets */
    "focus-visible:outline-none outline-none",
  ].join(" "),
  variants: {
    variant: {
      default:
        "bg-primary-solid text-white data-[hovered]:bg-primary-solid-hover",
      destructive:
        "bg-danger text-muted-high-contrast data-[hovered]:bg-danger-hover",
      outline:
        "border border-muted bg-muted-app data-[hovered]:bg-primary data-[hovered]:text-muted-high-contrast",
      secondary:
        "bg-primary-element text-muted-high-contrast data-[hovered]:bg-primary-element-hover",
      ghost:
        "data-[hovered]:bg-muted-element data-[hovered]:text-muted-high-contrast",
      link: "text-primary-base underline-offset-4 data-[hovered]:underline",
    },
    size: {
      default: "h-10 px-4 py-2",
      sm: "h-9 rounded-lg px-3",
      lg: "h-11 rounded-lg px-8",
      icon: "size-10",
    },
  },
  defaultVariants: {
    variant: "default" as const,
    size: "default" as const,
  },
} as const;

type ButtonVariant = keyof typeof buttonVariants.variants.variant;
type ButtonSize = keyof typeof buttonVariants.variants.size;

type ButtonProps = AriaButtonProps & {
  variant?: ButtonVariant;
  size?: ButtonSize;
};

const getButtonClasses = ({
  variant = buttonVariants.defaultVariants.variant,
  size = buttonVariants.defaultVariants.size,
  className,
}: {
  variant?: ButtonVariant;
  size?: ButtonSize;
  className?: string;
}) => {
  return cn(
    buttonVariants.base,
    buttonVariants.variants.variant[variant],
    buttonVariants.variants.size[size],
    className,
  );
};

const Button = ({ className, variant, size, ...props }: ButtonProps) => {
  return (
    <AriaButton
      className={composeRenderProps(className, (className) =>
        getButtonClasses({
          variant,
          size,
          className,
        }),
      )}
      {...props}
    />
  );
};

export { Button, buttonVariants, getButtonClasses };
export type { ButtonProps, ButtonVariant, ButtonSize };
