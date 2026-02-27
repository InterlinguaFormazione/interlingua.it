import { motion } from "framer-motion";
import { Link, useParams } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { ArrowLeft, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Navigation } from "@/components/navigation";
import { Footer } from "@/components/footer";
import DOMPurify from "dompurify";
import type { BlogPost } from "@shared/schema";

const categoryColors: Record<string, string> = {
  "Intelligenza Artificiale": "from-blue-500 to-blue-600",
  "Competenze Digitali": "from-indigo-500 to-indigo-600",
  "Soft Skills": "from-teal-500 to-teal-600",
  "Management": "from-purple-500 to-purple-600",
  "Business": "from-orange-500 to-orange-600",
  "Formazione": "from-green-500 to-green-600",
};

function renderMarkdown(content: string): string {
  const html = content
    .replace(/### (.*)/g, '<h3 class="text-xl font-bold mt-8 mb-3">$1</h3>')
    .replace(/## (.*)/g, '<h2 class="text-2xl font-bold mt-10 mb-4">$1</h2>')
    .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
    .replace(/\*(.*?)\*/g, "<em>$1</em>")
    .replace(/^- (.*)/gm, '<li class="ml-4 list-disc">$1</li>')
    .replace(/^(\d+)\. (.*)/gm, '<li class="ml-4 list-decimal">$1. $2</li>')
    .replace(/\n\n/g, '</p><p class="mb-4 leading-relaxed text-muted-foreground">')
    .replace(/^/, '<p class="mb-4 leading-relaxed text-muted-foreground">')
    .replace(/$/, "</p>");
  return DOMPurify.sanitize(html);
}

export default function BlogPostPage() {
  const params = useParams<{ slug: string }>();

  const { data: post, isLoading } = useQuery<BlogPost>({
    queryKey: [`/api/blog/${params.slug}`],
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <main className="pt-32 pb-16">
          <div className="container mx-auto px-4 max-w-3xl">
            <Skeleton className="h-8 w-32 mb-8" />
            <Skeleton className="h-4 w-24 mb-4" />
            <Skeleton className="h-12 w-full mb-4" />
            <Skeleton className="h-6 w-3/4 mb-8" />
            <Skeleton className="h-96 w-full" />
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (!post) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <main className="pt-32 pb-16">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-3xl font-bold mb-4">Articolo non trovato</h1>
            <p className="text-muted-foreground mb-6">L'articolo che cerchi non esiste o è stato rimosso.</p>
            <Link href="/blog">
              <Button data-testid="button-back-blog">Torna al Blog</Button>
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <main className="pt-32 pb-16">
        <article className="container mx-auto px-4 max-w-3xl">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <Link href="/blog">
              <Button variant="ghost" className="gap-2 mb-8" data-testid="button-back-blog">
                <ArrowLeft className="w-4 h-4" />
                Torna al Blog
              </Button>
            </Link>

            <div className="flex flex-wrap items-center gap-3 mb-4">
              <Badge className={`bg-gradient-to-r ${categoryColors[post.category] || "from-gray-500 to-gray-600"} text-white border-0`}>
                {post.category}
              </Badge>
              <span className="text-sm text-muted-foreground flex items-center gap-1">
                <Calendar className="w-4 h-4" />
                {new Date(post.createdAt!).toLocaleDateString("it-IT", { day: "numeric", month: "long", year: "numeric" })}
              </span>
            </div>

            <h1 className="text-3xl md:text-4xl font-bold mb-4 leading-tight" data-testid="text-blog-post-title">
              {post.title}
            </h1>

            <p className="text-lg text-muted-foreground mb-8 border-l-4 border-primary/30 pl-4">
              {post.excerpt}
            </p>

            <div className="h-px bg-border mb-8" />

            <div 
              className="prose prose-lg dark:prose-invert max-w-none"
              dangerouslySetInnerHTML={{ __html: renderMarkdown(post.content) }} 
              data-testid="blog-post-content"
            />

            <div className="mt-12 pt-8 border-t">
              <div className="bg-gradient-to-br from-primary/10 to-accent/10 rounded-2xl p-8 text-center">
                <h3 className="text-xl font-bold mb-2">Vuoi approfondire questo tema?</h3>
                <p className="text-muted-foreground mb-4">
                  Scopri i nostri corsi di formazione professionale e inizia il tuo percorso di crescita.
                </p>
                <div className="flex flex-wrap gap-3 justify-center">
                  <Link href="/#courses">
                    <Button data-testid="button-explore-courses">Esplora i Corsi</Button>
                  </Link>
                  <Link href="/#contact">
                    <Button variant="outline" data-testid="button-contact-blog">Contattaci</Button>
                  </Link>
                </div>
              </div>
            </div>
          </motion.div>
        </article>
      </main>
      <Footer />
    </div>
  );
}
