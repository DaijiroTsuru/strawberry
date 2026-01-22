import { createRouter, createRoute, createRootRoute, Outlet } from '@tanstack/react-router';
import { Header } from '@/app/components/Header';
import { Footer } from '@/app/components/Footer';
import { HeroSection } from '@/app/components/HeroSection';
import { ProductSection } from '@/app/components/ProductSection';
import { AboutSection } from '@/app/components/AboutSection';
import { TestimonialsSection } from '@/app/components/TestimonialsSection';
import { AccessSection } from '@/app/components/AccessSection';
import { RicePage } from '@/app/components/pages/RicePage';
import { StrawberryPickingPage } from '@/app/components/pages/StrawberryPickingPage';
import { MochiPage } from '@/app/components/pages/MochiPage';
import { MisoPage } from '@/app/components/pages/MisoPage';
import { StrawberriesPage } from '@/app/components/pages/StrawberriesPage';
import { ProductByHandlePage } from '@/app/components/pages/ProductByHandlePage';

// Root route
const rootRoute = createRootRoute({
  component: () => (
    <>
      <Header />
      <Outlet />
      <Footer />
    </>
  ),
});

// Home route
const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/',
  component: () => (
    <main>
      <HeroSection />
      <ProductSection />
      <AboutSection />
      <TestimonialsSection />
      <AccessSection />
    </main>
  ),
});

// Rice page route
const riceRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/rice',
  component: RicePage,
});

// Strawberry picking page route
const strawberryPickingRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/strawberry-picking',
  component: StrawberryPickingPage,
});

// Mochi page route
const mochiRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/mochi',
  component: MochiPage,
});

// Miso page route
const misoRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/miso',
  component: MisoPage,
});

// Strawberries page route
const strawberriesRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/strawberries',
  component: StrawberriesPage,
});

// Product detail page route
const productDetailRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/product/$handle',
  component: ProductByHandlePage,
});

// Create route tree
const routeTree = rootRoute.addChildren([
  indexRoute,
  riceRoute,
  strawberryPickingRoute,
  mochiRoute,
  misoRoute,
  strawberriesRoute,
  productDetailRoute,
]);

// Create router
export const router = createRouter({ routeTree });

// Type declaration for TypeScript
declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router;
  }
}
