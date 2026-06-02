import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  Link,
  createRootRouteWithContext,
  useRouter,
  HeadContent,
  Scripts,
} from "@tanstack/react-router";

import appCss from "../styles.css?url";
import { Layout } from "@/components/Layout";
import { Onboarding } from "@/components/Onboarding";
import { Toaster } from "@/components/ui/sonner";
import { useAuth, PUBLIC_ROUTES } from "@/lib/auth";
import { useEffect, useState } from "react";
import { useRouterState, useNavigate } from "@tanstack/react-router";
import { isInitialAnalysisDone } from "@/lib/initial-analysis";

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
      { title: "HairBloom — Your hair. Your ritual." },
      { name: "description", content: "Rituel capillaire personnalisé : diagnostic IA, recettes DIY, shop, plan 30 jours." },
      { name: "theme-color", content: "#C9956A" },
      { property: "og:title", content: "HairBloom — Your hair. Your ritual." },
      { property: "og:description", content: "Rituel capillaire personnalisé : diagnostic IA, recettes DIY, shop, plan 30 jours." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
      { name: "twitter:title", content: "HairBloom — Your hair. Your ritual." },
      { name: "twitter:description", content: "Rituel capillaire personnalisé : diagnostic IA, recettes DIY, shop, plan 30 jours." },
      { property: "og:image", content: "https://pub-bb2e103a32db4e198524a2e9ed8f35b4.r2.dev/f68183cb-6ffd-4127-9197-ba52c9172e14/id-preview-4380c37b--90db3a2d-a25b-44bf-9f94-fb0f3e239c4d.lovable.app-1780120391164.png" },
      { name: "twitter:image", content: "https://pub-bb2e103a32db4e198524a2e9ed8f35b4.r2.dev/f68183cb-6ffd-4127-9197-ba52c9172e14/id-preview-4380c37b--90db3a2d-a25b-44bf-9f94-fb0f3e239c4d.lovable.app-1780120391164.png" },
    ],
    links: [
      {
        rel: "stylesheet",
        href: appCss,
      },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();

  return (
    <QueryClientProvider client={queryClient}>
      <AuthGate />
      <Toaster position="top-center" />
    </QueryClientProvider>
  );
}

function AuthGate() {
  const { isAuthenticated, ready } = useAuth();
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const navigate = useNavigate();
  const isPublic = PUBLIC_ROUTES.includes(pathname);
  const ANALYSIS_ALLOWED = ["/analyse-initiale", "/photo", "/quiz", "/resultats"];

  const [analysisDone, setAnalysisDone] = useState<boolean>(() => isInitialAnalysisDone());
  useEffect(() => {
    const sync = () => setAnalysisDone(isInitialAnalysisDone());
    sync();
    window.addEventListener("hairbloom:initial-analysis", sync);
    window.addEventListener("storage", sync);
    return () => {
      window.removeEventListener("hairbloom:initial-analysis", sync);
      window.removeEventListener("storage", sync);
    };
  }, []);

  useEffect(() => {
    if (!ready) return;
    if (!isAuthenticated) {
      if (!isPublic) navigate({ to: "/login", replace: true });
      return;
    }
    // Authenticated
    if (!analysisDone) {
      if (!ANALYSIS_ALLOWED.includes(pathname)) {
        navigate({ to: "/analyse-initiale", replace: true });
      }
      return;
    }
    // Authenticated + analysis done
    if (isPublic || pathname === "/analyse-initiale") {
      navigate({ to: "/", replace: true });
    }
  }, [ready, isAuthenticated, isPublic, pathname, navigate, analysisDone]);

  if (!ready) return null;

  if (isPublic) return <Outlet />;
  if (!isAuthenticated) return null;

  return (
    <>
      <Layout>
        <Outlet />
      </Layout>
      <Onboarding />
    </>
  );
}
