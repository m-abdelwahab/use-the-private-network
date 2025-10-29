import { createFileRoute } from "@tanstack/react-router";
import { dbPrivate } from "@/lib/db";

export const Route = createFileRoute("/api/compare-latency")({
  server: {
    handlers: {
      POST: async () => {
        try {
          // Warmup query (not included in results)
          await dbPrivate`SELECT 1`;

          // Start API processing timer after warmup
          const apiStartTime = performance.now();

          // Measure private database query
          const queryStart = performance.now();
          await dbPrivate`SELECT 1`;
          const queryEnd = performance.now();
          const queryLatency = queryEnd - queryStart;

          const apiEndTime = performance.now();
          const apiProcessingTime = apiEndTime - apiStartTime;

          const headers = new Headers({
            "Content-Type": "application/json",
            "Cache-Control": "no-store",
          });
          headers.append(
            "Server-Timing",
            `db;dur=${queryLatency.toFixed(2)}, api;dur=${apiProcessingTime.toFixed(2)}`,
          );

          return new Response(
            JSON.stringify({
              queryLatency,
              apiProcessingTime,
            }),
            {
              headers,
            },
          );
        } catch (error) {
          return new Response(
            JSON.stringify({
              error:
                error instanceof Error
                  ? error.message
                  : "Unknown error occurred",
            }),
            {
              status: 500,
              headers: {
                "Content-Type": "application/json",
                "Cache-Control": "no-store",
              },
            },
          );
        }
      },
    },
  },
});
