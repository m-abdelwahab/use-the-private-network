import { cn } from "@/lib/utils/cn";

export function Divider({
  soft = false,
  className,
  ...props
}: { soft?: boolean } & React.ComponentPropsWithoutRef<"hr">) {
  return (
    <hr
      {...props}
      className={cn(
        className,
        "w-full border-t",
        soft ? "border-muted/30" : "border-muted/50",
      )}
    />
  );
}
