import { Navigation } from "@/components/navigation";
import { HeroSection } from "@/components/hero-section";
import { CoursesSection } from "@/components/courses-section";
import { FeaturesSection } from "@/components/features-section";
import { TestimonialsSection } from "@/components/testimonials-section";
import { AboutSection } from "@/components/about-section";
import { ContactSection } from "@/components/contact-section";
import { NewsletterSection } from "@/components/newsletter-section";
import { Footer } from "@/components/footer";
import { useSEO } from "@/hooks/use-seo";

export default function Home() {
  useSEO({
    title: "Corsi di Lingue Vicenza e Online | Scuola di Lingue dal 1993 | SkillCraft-Interlingua",
    description: "Scuola di lingue a Vicenza e Thiene dal 1993. Corsi di inglese, tedesco, francese, spagnolo, russo e italiano per stranieri. In presenza e online. Oltre 15.000 studenti formati.",
    canonical: "/",
  });
  return (
    <div className="min-h-screen">
      <Navigation />
      <main>
        <HeroSection />
        <CoursesSection />
        <FeaturesSection />
        <TestimonialsSection />
        <AboutSection />
        <ContactSection />
        <NewsletterSection />
      </main>
      <Footer />
    </div>
  );
}
