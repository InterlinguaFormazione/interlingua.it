import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeProvider } from "@/components/theme-provider";
import Home from "@/pages/home";
import CoursesPage from "@/pages/courses";
import CourseDetailPage from "@/pages/course-detail";
import ChiSiamoPage from "@/pages/chi-siamo";
import BandiECorsiPage from "@/pages/bandi-e-corsi";
import BandoDetailPage from "@/pages/bando-detail";
import NotFound from "@/pages/not-found";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/corsi" component={CoursesPage} />
      <Route path="/corsi/:id" component={CourseDetailPage} />
      <Route path="/chi-siamo" component={ChiSiamoPage} />
      <Route path="/bandi-e-corsi-finanziati" component={BandiECorsiPage} />
      <Route path="/bandi/:id" component={BandoDetailPage} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <ThemeProvider defaultTheme="light" storageKey="skillcraft-theme">
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <Router />
          <Toaster />
        </TooltipProvider>
      </QueryClientProvider>
    </ThemeProvider>
  );
}

export default App;
