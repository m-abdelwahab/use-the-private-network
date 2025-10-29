import { useMutation } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { ThemeToggle } from "@/components/misc/theme-toggle";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Divider } from "@/components/ui/divider";
import { Heading } from "@/components/ui/heading";
import { Icon } from "@/components/ui/icon";
import { Link } from "@/components/ui/link";
import { Text } from "@/components/ui/text";

export const Route = createFileRoute("/")({ component: App });

type LatencyResults = {
  privateTotalRoundTrip: number;
  publicTotalRoundTrip: number;
  privateQueryLatency: number; // server↔database round-trip
  publicQueryLatency: number; // server↔database round-trip
};

type ApiResponse = {
  queryLatency: number;
  apiProcessingTime: number;
};

async function runLatencyTest(): Promise<LatencyResults> {
  // Public request
  const publicStartTime = performance.now();
  const publicResponse = await fetch(`/api/compare-latency-public`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
  });
  const publicEndTime = performance.now();
  if (!publicResponse.ok) {
    const errorData = await publicResponse.json();
    throw new Error(errorData.error || "Failed to test public network");
  }
  const publicData = (await publicResponse.json()) as ApiResponse;

  // Private request
  const privateStartTime = performance.now();
  const privateResponse = await fetch(`/api/compare-latency`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
  });
  const privateEndTime = performance.now();
  if (!privateResponse.ok) {
    const errorData = await privateResponse.json();
    throw new Error(errorData.error || "Failed to test private network");
  }
  const privateData = (await privateResponse.json()) as ApiResponse;

  const privateTotalRoundTrip = privateEndTime - privateStartTime;
  const publicTotalRoundTrip = publicEndTime - publicStartTime;

  return {
    privateTotalRoundTrip,
    publicTotalRoundTrip,
    privateQueryLatency: privateData.queryLatency,
    publicQueryLatency: publicData.queryLatency,
  };
}

function App() {
  const mutation = useMutation({
    mutationFn: runLatencyTest,
  });

  return (
    <div className="mx-auto flex min-h-screen max-w-4xl flex-col p-12">
      <div className="flex-1">
        {/* Main Content */}
        <div className="mb-12 space-y-4">
          <h1 className="text-muted-high-contrast mb-2 text-3xl font-medium">
            Use the Private Network
          </h1>
          <Text>
            Use the private network when your app queries a database or
            background worker. It's faster, more secure, and saves you egress
            costs.
          </Text>
          <Text>
            This app is a{" "}
            <a
              href="https://tanstack.com/start/latest"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary-base ring-offset-muted-app rounded-xs underline-offset-4 ring-offset-2 outline-none data-focus-visible:ring-2 data-hovered:underline"
            >
              full-stack TanStack Start
            </a>{" "}
            project with two endpoints querying the same Postgres database. The
            difference is one uses the private network and the other uses the
            public URL over the open internet.
          </Text>
          <Text>
            Both the app and database run in the same US-East (Virginia, USA)
            region on Railway
          </Text>
        </div>
        {/* Run Latency Test Button */}
        <div className="mb-8">
          <Button
            onPress={() => mutation.mutate(undefined)}
            isDisabled={mutation.isPending}
            size="lg"
          >
            {mutation.isPending ? (
              <span className="inline-flex items-center gap-2">
                <Icon name="Spinner" className="size-4 animate-spin" />
                Running Test...
              </span>
            ) : (
              "Run Latency Test"
            )}
          </Button>
        </div>

        {/* Error Card */}
        {mutation.isError && (
          <div className="mb-8">
            <Card className="border-danger">
              <CardHeader>
                <CardTitle className="text-danger-high-contrast">
                  Error
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Text className="text-danger-base">
                  {mutation.error instanceof Error
                    ? mutation.error.message
                    : "Unknown error occurred"}
                </Text>
              </CardContent>
            </Card>
          </div>
        )}
        {mutation.data && <ResultsSection results={mutation.data} />}
      </div>
      {/* Footer */}
      <div>
        <Divider className="mt-12 mb-8" />
        <footer className="flex items-center justify-between gap-2">
          <Text className="text-muted-base">
            Deployed on{" "}
            <Link
              className="text-primary-base data-focus-visible:ring-primary-solid ring-offset-muted-app rounded-xs underline-offset-4 ring-offset-2 outline-none data-focus-visible:ring-2 data-hovered:underline"
              href="https://railway.com?referralCode=thisismahmoud"
            >
              Railway
            </Link>{" "}
          </Text>
          <ThemeToggle />
        </footer>
      </div>
    </div>
  );
}

function ResultsSection({ results }: { results: LatencyResults }) {
  const privateTotal = results.privateTotalRoundTrip;
  const publicTotal = results.publicTotalRoundTrip;
  const winnerIsPrivate = privateTotal <= publicTotal;
  const winnerLabel = winnerIsPrivate
    ? "the private network"
    : "the public network";
  const loserLabel = winnerIsPrivate
    ? "the public network"
    : "the private network";
  const winnerMs = winnerIsPrivate ? privateTotal : publicTotal;
  const loserMs = winnerIsPrivate ? publicTotal : privateTotal;
  const percentFaster = ((loserMs - winnerMs) / loserMs) * 100;

  return (
    <div className="space-y-6">
      <Heading className="text-2xl" level={2}>
        Results
      </Heading>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <ResultCard
          title="Private Network"
          totalLabelClass="text-primary-base"
          totalMs={results.privateTotalRoundTrip}
          queryLatencyMs={results.privateQueryLatency}
        />
        <ResultCard
          title="Public Network"
          totalLabelClass="text-warning-base"
          totalMs={results.publicTotalRoundTrip}
          queryLatencyMs={results.publicQueryLatency}
        />
      </div>
      <div className="space-y-2">
        <Heading level={2}>Performance Summary</Heading>
        <Text>
          For this run, {winnerLabel} is {percentFaster.toFixed(0)}% faster than{" "}
          {loserLabel}.
        </Text>

        <Text>
          Note that Total latency reflects both network and database
          performance. Routing, regional load, and query patterns can affect
          results.
        </Text>

        <Text>
          Main takeaway: Use the private network for better security, no
          egress/data transfer fees and better performance.
        </Text>
      </div>
    </div>
  );
}

function ResultCard({
  title,
  totalLabelClass,
  totalMs,
  queryLatencyMs,
}: {
  title: string;
  totalLabelClass: string;
  totalMs: number;
  queryLatencyMs: number;
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div>
            <Text className="text-muted-base mb-2 text-sm font-medium">
              Total Round-Trip Time
            </Text>
            <div className={`${totalLabelClass} text-3xl font-bold`}>
              {totalMs.toFixed(2)} ms
            </div>
          </div>
          <Divider soft />
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Text className="text-muted-base text-sm">
                Server ↔ Database
              </Text>
              <Text className="text-muted-high-contrast font-semibold">
                {queryLatencyMs.toFixed(2)} ms
              </Text>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
