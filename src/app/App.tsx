import { useState, useEffect } from "react";
import { CartProvider } from "@/app/contexts/CartContext";
import { Header } from "@/app/components/Header";
import { HeroSection } from "@/app/components/HeroSection";
import { ProductSection } from "@/app/components/ProductSection";
import { AboutSection } from "@/app/components/AboutSection";
import { TestimonialsSection } from "@/app/components/TestimonialsSection";
import { AccessSection } from "@/app/components/AccessSection";
import { Footer } from "@/app/components/Footer";

// Modern Pages
import { RicePage } from "@/app/components/pages/RicePage";
import { StrawberryPickingPage } from "@/app/components/pages/StrawberryPickingPage";
import { MochiPage } from "@/app/components/pages/MochiPage";
import { MisoPage } from "@/app/components/pages/MisoPage";
import { StrawberriesPage } from "@/app/components/pages/StrawberriesPage";

// Japanese Traditional Design (和風デザイン)
import { HeaderJP } from "@/app/components/japanese/HeaderJP";
import { HeroSectionJP } from "@/app/components/japanese/HeroSectionJP";
import { ProductSectionJP } from "@/app/components/japanese/ProductSectionJP";
import { AboutSectionJP } from "@/app/components/japanese/AboutSectionJP";
import { TestimonialsSectionJP } from "@/app/components/japanese/TestimonialsSectionJP";
import { AccessSectionJP } from "@/app/components/japanese/AccessSectionJP";
import { FooterJP } from "@/app/components/japanese/FooterJP";

// Japanese Pages
import { RicePageJP } from "@/app/components/pages/japanese/RicePageJP";
import { StrawberryPickingPageJP } from "@/app/components/pages/japanese/StrawberryPickingPageJP";
import { MochiPageJP } from "@/app/components/pages/japanese/MochiPageJP";
import { MisoPageJP } from "@/app/components/pages/japanese/MisoPageJP";
import { StrawberriesPageJP } from "@/app/components/pages/japanese/StrawberriesPageJP";

export default function App() {
  // デザインを切り替えるには、下記の designType を変更してください
  // "modern": モダンデザイン（鮮やか・ダイナミック）
  // "japanese": 和風デザイン（伝統的・上品）
  const designType: "modern" | "japanese" = "modern";

  // シンプルなルーティング
  const [currentPage, setCurrentPage] =
    useState<string>("home");

  useEffect(() => {
    // URLのハッシュをチェックしてページを切り替え
    const handleHashChange = () => {
      const hash = window.location.hash.slice(1); // #を削除
      if (hash) {
        setCurrentPage(hash);
        // ページ遷移時にトップへスクロール
        window.scrollTo(0, 0);
      } else {
        setCurrentPage("home");
      }
    };

    handleHashChange();
    window.addEventListener("hashchange", handleHashChange);
    return () =>
      window.removeEventListener(
        "hashchange",
        handleHashChange,
      );
  }, []);

  // ページコンテンツをレンダリング
  const renderPage = () => {
    // Japanese デザインの場合
    if (designType === "japanese") {
      // 専用ページの場合
      if (currentPage === "rice") {
        return (
          <>
            <HeaderJP />
            <RicePageJP />
            <FooterJP />
          </>
        );
      }
      if (currentPage === "strawberry-picking") {
        return (
          <>
            <HeaderJP />
            <StrawberryPickingPageJP />
            <FooterJP />
          </>
        );
      }
      if (currentPage === "mochi") {
        return (
          <>
            <HeaderJP />
            <MochiPageJP />
            <FooterJP />
          </>
        );
      }
      if (currentPage === "miso") {
        return (
          <>
            <HeaderJP />
            <MisoPageJP />
            <FooterJP />
          </>
        );
      }
      if (currentPage === "strawberries") {
        return (
          <>
            <HeaderJP />
            <StrawberriesPageJP />
            <FooterJP />
          </>
        );
      }

      // ホームページ
      return (
        <>
          <HeaderJP />
          <main>
            <HeroSectionJP />
            <ProductSectionJP />
            <AboutSectionJP />
            <TestimonialsSectionJP />
            <AccessSectionJP />
          </main>
          <FooterJP />
        </>
      );
    }

    // Modern デザインの場合（デフォルト）
    // 専用ページの場合
    if (currentPage === "rice") {
      return (
        <>
          <Header />
          <RicePage />
          <Footer />
        </>
      );
    }
    if (currentPage === "strawberry-picking") {
      return (
        <>
          <Header />
          <StrawberryPickingPage />
          <Footer />
        </>
      );
    }
    if (currentPage === "mochi") {
      return (
        <>
          <Header />
          <MochiPage />
          <Footer />
        </>
      );
    }
    if (currentPage === "miso") {
      return (
        <>
          <Header />
          <MisoPage />
          <Footer />
        </>
      );
    }
    if (currentPage === "strawberries") {
      return (
        <>
          <Header />
          <StrawberriesPage />
          <Footer />
        </>
      );
    }

    // ホームページ
    return (
      <>
        <Header />
        <main>
          <HeroSection />
          <ProductSection />
          <AboutSection />
          <TestimonialsSection />
          <AccessSection />
        </main>
        <Footer />
      </>
    );
  };

  return (
    <CartProvider>
      <div className="min-h-screen">{renderPage()}</div>
    </CartProvider>
  );
}