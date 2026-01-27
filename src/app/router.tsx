import { createRouter, createRoute, createRootRoute, Outlet } from '@tanstack/react-router';
import { Header } from '@/app/components/Header';
import { Footer } from '@/app/components/Footer';
import { SEO, createOrganizationSchema, createLocalBusinessSchema } from '@/app/components/SEO';
import { HeroSection } from '@/app/components/HeroSection';
import { FeaturedBannerSection } from '@/app/components/FeaturedBannerSection';
import { ProductSection } from '@/app/components/ProductSection';
import { AboutSection } from '@/app/components/AboutSection';
import { TestimonialsSection } from '@/app/components/TestimonialsSection';
import { AccessSection } from '@/app/components/AccessSection';
import { RicePage } from '@/app/components/pages/RicePage';
import { StrawberryPickingPage } from '@/app/components/pages/StrawberryPickingPage';
import { StrawberriesPage } from '@/app/components/pages/StrawberriesPage';
import { ProductByHandlePage } from '@/app/components/pages/ProductByHandlePage';
import { FaqPage } from '@/app/components/pages/FaqPage';
import { ContactPage } from '@/app/components/pages/ContactPage';

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
      <SEO 
        url="/"
        structuredData={{
          '@context': 'https://schema.org',
          '@graph': [
            createOrganizationSchema(),
            createLocalBusinessSchema(),
          ],
        }}
      />
      <HeroSection />
      <FeaturedBannerSection />
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

// FAQ page route
const faqRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/faq',
  component: FaqPage,
});

// Contact page route
const contactRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/contact',
  component: ContactPage,
});

// Create route tree
const routeTree = rootRoute.addChildren([
  indexRoute,
  riceRoute,
  strawberryPickingRoute,
  strawberriesRoute,
  productDetailRoute,
  faqRoute,
  contactRoute,
]);

// Create router
export const router = createRouter({ routeTree });

// Type declaration for TypeScript
declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router;
  }
}
