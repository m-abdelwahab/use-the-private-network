import { Button } from "@/components/ui/button";
import { Icon } from "@/components/ui/icon";
import { useTheme } from "@/lib/theme/theme-provider";

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();

  return (
    <div className="border-muted bg-muted-app-subtle inline-flex items-center gap-0.5 rounded-full border p-0.5">
      <Button
        variant="ghost"
        size="icon"
        onPress={() => setTheme("system")}
        aria-label="System theme"
        className={`h-6 w-6 rounded-full ${
          theme === "system"
            ? "bg-muted-element-active text-muted-high-contrast"
            : "text-muted-base hover:bg-muted-element hover:text-muted-high-contrast"
        }`}
      >
        <Icon name="Monitor" className="h-3.5 w-3.5" />
      </Button>
      <Button
        variant="ghost"
        size="icon"
        onPress={() => setTheme("light")}
        aria-label="Light theme"
        className={`h-6 w-6 rounded-full ${
          theme === "light"
            ? "bg-muted-element-active text-muted-high-contrast"
            : "text-muted-base hover:bg-muted-element hover:text-muted-high-contrast"
        }`}
      >
        <Icon name="Sun" className="h-3.5 w-3.5" />
      </Button>
      <Button
        variant="ghost"
        size="icon"
        onPress={() => setTheme("dark")}
        aria-label="Dark theme"
        className={`h-6 w-6 rounded-full ${
          theme === "dark"
            ? "bg-muted-element-active text-muted-high-contrast"
            : "text-muted-base hover:bg-muted-element hover:text-muted-high-contrast"
        }`}
      >
        <Icon name="Moon" className="h-3.5 w-3.5" />
      </Button>
    </div>
  );
}
