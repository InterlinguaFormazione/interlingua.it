import { useEffect } from "react";
import { Switch, Route, useLocation } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeProvider } from "@/components/theme-provider";
import { CookieBanner } from "@/components/cookie-banner";
import { WhatsAppButton } from "@/components/whatsapp-button";
import { MobileCTA } from "@/components/mobile-cta";
import { AIChatWidget } from "@/components/ai-chat-widget";
import Home from "@/pages/home";
import CoursesPage from "@/pages/courses";
import CourseDetailPage from "@/pages/course-detail";
import ChiSiamoPage from "@/pages/chi-siamo";
import BandiECorsiPage from "@/pages/bandi-e-corsi";
import BandoDetailPage from "@/pages/bando-detail";
import SpeakersCornerPage from "@/pages/speakers-corner";
import SpeakersCornerDashboard from "@/pages/speakers-corner-dashboard";
import SpeakersCornerAdmin from "@/pages/speakers-corner-admin";
import SpeakersCornerPurchase from "@/pages/speakers-corner-purchase";
import AdminPage from "@/pages/admin";
import BlogPage from "@/pages/blog";
import BlogPostPage from "@/pages/blog-post";
import CookiePolicyPage from "@/pages/cookie-policy";
import PrivacyPolicyPage from "@/pages/privacy-policy";
import FullImmersionPage from "@/pages/full-immersion";
import FormazioneInPresenzaPage from "@/pages/formazione-in-presenza";
import CorsiELearningPage from "@/pages/corsi-e-learning";
import LanguageCoachingPage from "@/pages/language-coaching";
import NotFound from "@/pages/not-found";

function ScrollToTop() {
  const [location] = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location]);
  return null;
}

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/corsi" component={CoursesPage} />
      <Route path="/corsi/:id" component={CourseDetailPage} />
      <Route path="/chi-siamo" component={ChiSiamoPage} />
      <Route path="/bandi-e-corsi-finanziati" component={BandiECorsiPage} />
      <Route path="/bandi/:id" component={BandoDetailPage} />
      <Route path="/speakers-corner" component={SpeakersCornerPage} />
      <Route path="/speakers-corner/dashboard" component={SpeakersCornerDashboard} />
      <Route path="/speakers-corner/acquista" component={SpeakersCornerPurchase} />
      <Route path="/speakers-corner/admin" component={SpeakersCornerAdmin} />
      <Route path="/full-immersion" component={FullImmersionPage} />
      <Route path="/formazione-in-presenza" component={FormazioneInPresenzaPage} />
      <Route path="/corsi-e-learning" component={CorsiELearningPage} />
      <Route path="/language-coaching" component={LanguageCoachingPage} />
      <Route path="/admin" component={AdminPage} />
      <Route path="/blog" component={BlogPage} />
      <Route path="/blog/:slug" component={BlogPostPage} />
      <Route path="/cookie-policy" component={CookiePolicyPage} />
      <Route path="/privacy-policy" component={PrivacyPolicyPage} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <ThemeProvider defaultTheme="light" storageKey="skillcraft-theme">
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <ScrollToTop />
          <Router />
          <CookieBanner />
          <WhatsAppButton />
          <MobileCTA />
          <AIChatWidget />
          <Toaster />
        </TooltipProvider>
      </QueryClientProvider>
    </ThemeProvider>
  );
}

export default App;
