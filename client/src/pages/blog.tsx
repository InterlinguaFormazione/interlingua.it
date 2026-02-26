import { motion } from "framer-motion";
import { Link } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { ArrowLeft, Calendar, Tag, ChevronRight, BookOpen, Newspaper } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Navigation } from "@/components/navigation";
import { Footer } from "@/components/footer";
import type { BlogPost } from "@shared/schema";

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[àáâãäå]/g, "a")
    .replace(/[èéêë]/g, "e")
    .replace(/[ìíîï]/g, "i")
    .replace(/[òóôõö]/g, "o")
    .replace(/[ùúûü]/g, "u")
    .replace(/['']/g, "")
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/--+/g, "-")
    .trim();
}

const categoryColors: Record<string, string> = {
  "Intelligenza Artificiale": "from-blue-500 to-blue-600",
  "Competenze Digitali": "from-indigo-500 to-indigo-600",
  "Soft Skills": "from-teal-500 to-teal-600",
  "Management": "from-purple-500 to-purple-600",
  "Business": "from-orange-500 to-orange-600",
  "Formazione": "from-green-500 to-green-600",
};

export default function BlogPage() {
  const { data: posts, isLoading } = useQuery<BlogPost[]>({
    queryKey: ["/api/blog"],
  });

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <main className="pt-32 pb-16">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-16"
          >
            <Badge variant="outline" className="mb-4">
              <Newspaper className="w-4 h-4 mr-2" />
              Blog & Risorse
            </Badge>
            <h1 className="text-4xl md:text-5xl font-bold mb-4" data-testid="text-blog-title">
              Approfondimenti e{" "}
              <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                Tendenze
              </span>
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Articoli su AI, competenze digitali, soft skills e formazione professionale. 
              Nuovi contenuti ogni giorno per restare aggiornati.
            </p>
          </motion.div>

          {isLoading ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <Card key={i} className="h-full">
                  <CardHeader>
                    <Skeleton className="h-4 w-20 mb-2" />
                    <Skeleton className="h-6 w-full mb-2" />
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-3/4" />
                  </CardHeader>
                  <CardContent>
                    <Skeleton className="h-10 w-full" />
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : posts && posts.length > 0 ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {posts.map((post, index) => (
                <motion.div
                  key={post.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.05 }}
                >
                  <Link href={`/blog/${post.slug}`}>
                    <Card className="h-full hover-elevate cursor-pointer flex flex-col" data-testid={`card-blog-${post.slug}`}>
                      <CardHeader className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <Badge className={`bg-gradient-to-r ${categoryColors[post.category] || "from-gray-500 to-gray-600"} text-white border-0 text-xs`}>
                            {post.category}
                          </Badge>
                          <span className="text-xs text-muted-foreground flex items-center gap-1">
                            <Calendar className="w-3 h-3" />
                            {new Date(post.createdAt!).toLocaleDateString("it-IT", { day: "numeric", month: "long", year: "numeric" })}
                          </span>
                        </div>
                        <CardTitle className="text-lg leading-snug" data-testid={`text-blog-post-title-${post.slug}`}>
                          {post.title}
                        </CardTitle>
                        <CardDescription className="line-clamp-3 mt-2">
                          {post.excerpt}
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="pt-0">
                        <Button variant="outline" className="w-full gap-2" data-testid={`button-read-${post.slug}`}>
                          Leggi l'articolo
                          <ChevronRight className="w-4 h-4" />
                        </Button>
                      </CardContent>
                    </Card>
                  </Link>
                </motion.div>
              ))}
            </div>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-16"
            >
              <BookOpen className="w-16 h-16 text-muted-foreground/30 mx-auto mb-4" />
              <h2 className="text-xl font-semibold mb-2">Il blog è in arrivo!</h2>
              <p className="text-muted-foreground mb-6">
                Stiamo preparando i primi articoli. Torna presto per scoprire contenuti su AI, 
                competenze digitali e formazione professionale.
              </p>
              <Link href="/">
                <Button data-testid="button-back-home-blog">Torna alla Home</Button>
              </Link>
            </motion.div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}
