import type { QueryClient } from "@tanstack/react-query";
import {
  createRootRouteWithContext,
  HeadContent,
  Outlet,
  Scripts,
} from "@tanstack/react-router";
import { ErrorBoundary } from "@/components/misc/error-boundary";
import { NotFound } from "@/components/misc/not-found";
import { ThemeProvider, useTheme } from "@/lib/theme/theme-provider";
import appCss from "@/styles/global.css?url";

export const Route = createRootRouteWithContext<{
  queryClient: QueryClient;
}>()({
  head: () => ({
    meta: [
      {
        charSet: "utf-8",
      },
      {
        name: "viewport",
        content: "width=device-width, initial-scale=1",
      },
      {
        title: "Use the Private Network",
      },
      {
        name: "description",
        content: `Use the private network when your app queries a database or
            background worker instead of the public internet. It's faster, more secure, and saves you egress/data transfer
            costs.`,
      },
      {
        name: "og:title",
        content: "Use the Private Network",
      },
      {
        name: "og:description",
        content: `Use the private network when your app queries a database or
            background worker instead of the public internet. It's faster, more secure, and saves you egress/data transfer
            costs.`,
      },
      {
        name: "og:image",
        content: "https://use-the-private-network.up.railway.app/og-image.png",
      },
      {
        name: "og:url",
        content: "https://use-the-private-network.up.railway.app",
      },
      {
        name: "twitter:card",
        content: "summary_large_image",
      },
      {
        name: "twitter:title",
        content: "Use the Private Network",
      },
      {
        name: "twitter:description",
        content: `Use the private network when your app queries a database or
            background worker instead of the public internet. It's faster, more secure, and saves you egress/data transfer
            costs.`,
      },
      {
        name: "twitter:image",
        content: "https://use-the-private-network.up.railway.app/og-image.png",
      },
      {
        name: "twitter:url",
        content: "https://use-the-private-network.up.railway.app",
      },
    ],
    links: [
      {
        rel: "stylesheet",
        href: appCss,
      },
      {
        rel: "icon",
        href: "/favicon.svg",
        type: "image/svg+xml",
      },
    ],
  }),
  component: App,
  errorComponent: (props) => {
    const { theme } = useTheme();
    return (
      <RootDocument theme={theme}>
        <ErrorBoundary {...props} />
      </RootDocument>
    );
  },
  notFoundComponent: () => <NotFound />,
});

function App() {
  const { theme } = useTheme();
  return (
    <ThemeProvider>
      <RootDocument theme={theme}>
        <Outlet />
      </RootDocument>
    </ThemeProvider>
  );
}

function RootDocument({
  children,
  theme,
}: {
  children: React.ReactNode;
  theme: string;
}) {
  return (
    <html lang="en" data-theme={theme}>
      <head>
        <HeadContent />
      </head>
      <body className="bg-muted-app text-muted-base">
        {children}
        <Scripts />
      </body>
    </html>
  );
}
