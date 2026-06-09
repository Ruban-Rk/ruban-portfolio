import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import CustomCursor from "../components/CustomCursor";
import { CursorProvider } from "../hooks/use-cursor";
import { ThemeProvider } from "../hooks/use-theme";
import { AdminProvider, useAdmin } from "../hooks/use-admin";
import { AdminPanel, AdminLoginModal } from "../components/AdminPanel";
import {
  Outlet,
  Link,
  createRootRouteWithContext,
  useRouter,
  HeadContent,
  Scripts,
} from "@tanstack/react-router";
import { useEffect, useState, type ReactNode } from "react";
import { IntroAnimation } from "../components/IntroAnimation";
import { logVisit } from "../hooks/use-logs";

import appCss from "../styles.css?url";
import { reportLovableError } from "../lib/lovable-error-reporting";

function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-7xl font-bold text-foreground">404</h1>
        <h2 className="mt-4 text-xl font-semibold text-foreground">Page not found</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <div className="mt-6">
          <Link
            to="/"
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Go home
          </Link>
        </div>
      </div>
    </div>
  );
}

function ErrorComponent({ error, reset }: { error: Error; reset: () => void }) {
  console.error(error);
  const router = useRouter();
  useEffect(() => {
    reportLovableError(error, { boundary: "tanstack_root_error_component" });
  }, [error]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-xl font-semibold tracking-tight text-foreground">
          This page didn't load
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Something went wrong on our end. You can try refreshing or head back home.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-2">
          <button
            onClick={() => {
              router.invalidate();
              reset();
            }}
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Try again
          </button>
          <a
            href="/"
            className="inline-flex items-center justify-center rounded-md border border-input bg-background px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-accent"
          >
            Go home
          </a>
        </div>
      </div>
    </div>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { name: "author", content: "Ruban Kumar R" },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
    links: [
      { rel: "stylesheet", href: appCss },
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Poppins:wght@500;600;700;800&family=Caveat:wght@600;700&display=swap",
      },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <HeadContent />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  var savedTheme = localStorage.getItem('theme');
                  if (savedTheme === 'light') {
                    document.documentElement.classList.remove('dark');
                  } else {
                    document.documentElement.classList.add('dark');
                  }
                } catch (e) {}
              })();
            `,
          }}
        />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function AdminOverlays() {
  const { isAdmin, showLoginModal } = useAdmin();
  return (
    <>
      {showLoginModal && <AdminLoginModal />}
      {isAdmin && <AdminPanel />}
    </>
  );
}

function IntroManager() {
  const { portfolioData } = useAdmin();
  const [showIntroSession, setShowIntroSession] = useState(() => {
    if (typeof window !== "undefined") {
      return !sessionStorage.getItem("intro_played");
    }
    return false;
  });

  const introConfig = portfolioData?.introConfig || {
    enabled: true,
    greetingText: "Hey, there I'm",
    greetingColor: "#ffffff",
    nameText: "RUBAN",
    nameColor: "#ef4444",
    taglines: [],
  };

  if (showIntroSession && introConfig.enabled) {
    return (
      <IntroAnimation
        config={introConfig}
        heroImageUrl={portfolioData?.hero?.imageUrl}
        onComplete={() => {
          sessionStorage.setItem("intro_played", "1");
          setShowIntroSession(false);
        }}
      />
    );
  }
  return null;
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();

  useEffect(() => {
    logVisit();
  }, []);

  return (
    <ThemeProvider>
      <CursorProvider>
        <AdminProvider>
          <IntroManager />
          <CustomCursor />
          <QueryClientProvider client={queryClient}>
            <Outlet />
          </QueryClientProvider>
          <AdminOverlays />
        </AdminProvider>
      </CursorProvider>
    </ThemeProvider>
  );
}
