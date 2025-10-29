import type { ErrorComponentProps } from "@tanstack/react-router";
import {
  ErrorComponent,
  Link,
  rootRouteId,
  useMatch,
  useRouter,
} from "@tanstack/react-router";
import { Button } from "@/components/ui/button";

export function ErrorBoundary({ error }: ErrorComponentProps) {
  const router = useRouter();
  const isRoot = useMatch({
    strict: false,
    select: (state) => state.id === rootRouteId,
  });

  console.error("DefaultCatchBoundary Error:", error);

  return (
    <div className="flex min-w-0 flex-1 flex-col items-center justify-center gap-6 p-4">
      <ErrorComponent error={error} />
      <div className="flex flex-wrap items-center gap-2">
        <Button
          type="button"
          onPress={() => {
            router.invalidate();
          }}
        >
          Try Again
        </Button>
        {isRoot ? (
          <Link to="/">
            <Button variant="secondary">Home</Button>
          </Link>
        ) : (
          <Button
            variant="secondary"
            onPress={() => {
              window.history.back();
            }}
          >
            Go Back
          </Button>
        )}
      </div>
    </div>
  );
}
