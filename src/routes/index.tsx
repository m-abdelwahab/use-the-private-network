import { useMutation } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import * as React from "react";
import { ThemeToggle } from "@/components/misc/theme-toggle";
import { BarChart } from "@/components/ui/bar-chart";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Divider } from "@/components/ui/divider";
import { Icon } from "@/components/ui/icon";
import { Link } from "@/components/ui/link";
import { Text } from "@/components/ui/text";

export const Route = createFileRoute("/")({ component: App });

type LatencyResults = {
  privateTotalRoundTrips: number[];
  publicTotalRoundTrips: number[];
  privateQueryLatencies: number[];
  publicQueryLatencies: number[];
};

type ApiResponse = {
  queryLatency: number;
  apiProcessingTime: number;
};

// Statistical utility functions
function calculateAverage(arr: number[]): number {
  return arr.reduce((sum, val) => sum + val, 0) / arr.length;
}

function calculateMedian(arr: number[]): number {
  const sorted = [...arr].sort((a, b) => a - b);
  const mid = Math.floor(sorted.length / 2);
  return sorted.length % 2 === 0
    ? (sorted[mid - 1] + sorted[mid]) / 2
    : sorted[mid];
}

function calculateP95(arr: number[]): number {
  const sorted = [...arr].sort((a, b) => a - b);
  const index = Math.ceil(sorted.length * 0.95) - 1;
  return sorted[index];
}

async function runLatencyTest(
  onProgress?: (current: number, total: number) => void,
): Promise<LatencyResults> {
  const NUM_QUERIES = 11;

  const privateTotalRoundTrips: number[] = [];
  const publicTotalRoundTrips: number[] = [];
  const privateQueryLatencies: number[] = [];
  const publicQueryLatencies: number[] = [];

  // Run queries to each endpoint in parallel for better performance
  for (let i = 0; i < NUM_QUERIES; i++) {
    onProgress?.(i + 1, NUM_QUERIES);
    await Promise.all([
      // Public request
      (async () => {
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
        publicTotalRoundTrips.push(publicEndTime - publicStartTime);
        publicQueryLatencies.push(publicData.queryLatency);
      })(),
      // Private request
      (async () => {
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
        privateTotalRoundTrips.push(privateEndTime - privateStartTime);
        privateQueryLatencies.push(privateData.queryLatency);
      })(),
    ]);
  }

  // Remove the first request as it's often slower due connection establishment and warmup
  return {
    privateTotalRoundTrips: privateTotalRoundTrips.slice(1),
    publicTotalRoundTrips: publicTotalRoundTrips.slice(1),
    privateQueryLatencies: privateQueryLatencies.slice(1),
    publicQueryLatencies: publicQueryLatencies.slice(1),
  };
}

function App() {
  const [progress, setProgress] = React.useState<{
    current: number;
    total: number;
  } | null>(null);

  const mutation = useMutation({
    mutationFn: () =>
      runLatencyTest((current, total) => {
        setProgress({ current, total });
      }),
    onSettled: () => {
      setProgress(null);
    },
  });

  return (
    <div className="mx-auto flex min-h-screen max-w-4xl flex-col p-12">
      <div className="flex-1 space-y-12">
        {/* Main Content */}
        <div>
          <h1 className="text-muted-high-contrast mb-2 text-3xl font-semibold">
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
            project with two endpoints querying the same Postgres database
            running a <code>SELECT 1</code> query 10 times. The difference is
            one uses the private network and the other uses the public URL over
            the open internet. Both the app and database run in the same US-East
            (Virginia, USA) region on Railway
          </Text>
        </div>
        {/* Run Latency Test Button */}
        <div>
          <Button
            onPress={() => mutation.mutate()}
            isDisabled={mutation.isPending}
            size="lg"
          >
            {mutation.isPending ? (
              <span className="inline-flex items-center gap-2">
                <Icon name="Spinner" className="size-4 animate-spin" />
                {progress
                  ? `Running Test (${progress.current}/${progress.total})...`
                  : "Running Test..."}
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
      <footer className="mt-12 mb-8 flex items-center justify-between gap-2">
        <Text>
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
  );
}

function ResultsSection({ results }: { results: LatencyResults }) {
  return (
    <div className="space-y-4">
      <h2 className="text-muted-high-contrast text-2xl font-semibold">
        Results
      </h2>
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <ResultCard
          title="Private Network"
          totalRoundTrips={results.privateTotalRoundTrips}
          queryLatencies={results.privateQueryLatencies}
          comparisonTotalRoundTrips={results.publicTotalRoundTrips}
          comparisonQueryLatencies={results.publicQueryLatencies}
          color="var(--color-primary-base)"
        />
        <ResultCard
          title="Public Network"
          totalRoundTrips={results.publicTotalRoundTrips}
          queryLatencies={results.publicQueryLatencies}
          comparisonTotalRoundTrips={results.privateTotalRoundTrips}
          comparisonQueryLatencies={results.privateQueryLatencies}
          color="var(--color-warning-base)"
        />
      </div>
    </div>
  );
}

function ResultCard({
  title,
  totalRoundTrips,
  queryLatencies,
  comparisonTotalRoundTrips,
  comparisonQueryLatencies,
  color,
}: {
  title: string;
  totalRoundTrips: number[];
  queryLatencies: number[];
  comparisonTotalRoundTrips: number[];
  comparisonQueryLatencies: number[];
  color: string;
}) {
  // Calculate stats for Server ↔ Database (query latencies)
  const avgQuery = calculateAverage(queryLatencies);
  const medianQuery = calculateMedian(queryLatencies);
  const p95Query = calculateP95(queryLatencies);

  // Calculate stats for Round-Trip Time
  const avgTotal = calculateAverage(totalRoundTrips);
  const medianTotal = calculateMedian(totalRoundTrips);
  const p95Total = calculateP95(totalRoundTrips);

  // Calculate comparison stats
  const comparisonAvgQuery = calculateAverage(comparisonQueryLatencies);
  const comparisonMedianQuery = calculateMedian(comparisonQueryLatencies);
  const comparisonP95Query = calculateP95(comparisonQueryLatencies);
  const comparisonAvgTotal = calculateAverage(comparisonTotalRoundTrips);
  const comparisonMedianTotal = calculateMedian(comparisonTotalRoundTrips);
  const comparisonP95Total = calculateP95(comparisonTotalRoundTrips);

  // Calculate percentage differences
  const calculatePercentDiff = (mine: number, theirs: number) => {
    return ((theirs - mine) / theirs) * 100;
  };

  // Helper to render metric with optional percentage
  const renderMetric = (mine: number, theirs: number) => {
    const isWinner = mine < theirs;
    const percentDiff = calculatePercentDiff(mine, theirs);

    return (
      <Text className="font-mono text-sm">
        {isWinner && (
          <span className="mr-1 text-green-600">
            (+{Math.abs(percentDiff).toFixed(1)}%)
          </span>
        )}
        {mine.toFixed(2)}ms
      </Text>
    );
  };

  // Prepare data for the bar chart
  const chartData = totalRoundTrips.map((total, index) => ({
    query: `${index + 1}`,
    latency: Number(total.toFixed(2)),
  }));

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-muted-high-contrast">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* Server ↔ Database Section */}
          <div>
            <Text className="text-muted-high-contrast mb-3 text-sm font-medium">
              Server ↔ Database
            </Text>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Text className="text-sm">Average</Text>
                {renderMetric(avgQuery, comparisonAvgQuery)}
              </div>
              <div className="flex items-center justify-between">
                <Text className="text-sm">Median</Text>
                {renderMetric(medianQuery, comparisonMedianQuery)}
              </div>
              <div className="flex items-center justify-between">
                <Text className="text-sm">p95</Text>
                {renderMetric(p95Query, comparisonP95Query)}
              </div>
            </div>
          </div>

          <Divider soft />

          {/* Round-Trip Time Section */}
          <div>
            <Text className="text-muted-high-contrast mb-3 text-sm font-medium">
              Round-Trip Time
            </Text>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Text className="text-sm">Average</Text>
                {renderMetric(avgTotal, comparisonAvgTotal)}
              </div>
              <div className="flex items-center justify-between">
                <Text className="text-sm">Median</Text>
                {renderMetric(medianTotal, comparisonMedianTotal)}
              </div>
              <div className="flex items-center justify-between">
                <Text className="text-sm">p95</Text>
                {renderMetric(p95Total, comparisonP95Total)}
              </div>
            </div>
          </div>

          <Divider soft />

          {/* Chart Section */}
          <div className="space-y-2">
            <Text className="text-muted-high-contrast text-sm font-medium">
              Round Trip Time Distribution (ms)
            </Text>
            <BarChart
              data={chartData}
              dataKey="query"
              config={{
                latency: {
                  label: "Latency (ms)",
                  color,
                },
              }}
              valueFormatter={(value) => `${value}`}
              legend={false}
              className="h-56"
              barCategoryGap={1}
              barGap={1}
              xAxisProps={{
                dataKey: "query",
                type: "category",
                tick: { transform: "translate(0, 6)" },
              }}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
