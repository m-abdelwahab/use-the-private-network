import { Button } from "@/components/ui/button";

export function NotFound() {
  return (
    <div className="space-y-2 p-2">
      <p>The page you are looking for does not exist.</p>
      <p className="flex flex-wrap items-center gap-2">
        <Button type="button" onPress={() => window.history.back()}>
          Go back
        </Button>
        <form action="/">
          <Button variant="secondary" type="submit">
            Home
          </Button>
        </form>
      </p>
    </div>
  );
}
