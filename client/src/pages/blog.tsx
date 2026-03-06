import { motion } from "framer-motion";
import { Link } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { useSEO } from "@/hooks/use-seo";
import { Breadcrumb } from "@/components/breadcrumb";
import { ArrowLeft, Calendar, Tag, ChevronRight, BookOpen, Newspaper, ArrowRight, Sparkles } from "lucide-react";
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

const categoryIcons: Record<string, string> = {
  "Intelligenza Artificiale": "AI",
  "Competenze Digitali": "CD",
  "Soft Skills": "SS",
  "Management": "MG",
  "Business": "BZ",
  "Formazione": "FM",
};

function FeaturedPostCard({ post }: { post: BlogPost }) {
  return (
    <Link href={`/blog/${post.slug}`}>
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="group cursor-pointer"
      >
        <Card className="overflow-visible hover-elevate" data-testid={`card-blog-featured-${post.slug}`}>
          <div className="md:flex">
            <div className="md:w-2/5 p-6 flex flex-col justify-center">
              <div className="flex items-center gap-2 mb-3 flex-wrap">
                <Badge className={`bg-gradient-to-r ${categoryColors[post.category] || "from-gray-500 to-gray-600"} text-white border-0 text-xs`}>
                  {post.category}
                </Badge>
                <span className="text-xs text-muted-foreground flex items-center gap-1">
                  <Calendar className="w-3 h-3" />
                  {new Date(post.createdAt!).toLocaleDateString("it-IT", { day: "numeric", month: "long", year: "numeric" })}
                </span>
              </div>
              <CardTitle className="text-2xl md:text-3xl leading-tight mb-3" data-testid={`text-blog-post-title-${post.slug}`}>
                {post.title}
              </CardTitle>
              <CardDescription className="text-base line-clamp-3 mb-4">
                {post.excerpt}
              </CardDescription>
              <Button variant="outline" className="w-fit gap-2" data-testid={`button-read-featured-${post.slug}`}>
                Leggi l'articolo
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </Button>
            </div>
            <div className="md:w-3/5 relative p-6">
              <div className="w-full h-48 md:h-64 rounded-md bg-gradient-to-br from-primary/10 via-accent/10 to-primary/5 dark:from-primary/20 dark:via-accent/15 dark:to-primary/10 flex items-center justify-center">
                <div className="text-center">
                  <div className={`w-16 h-16 rounded-md bg-gradient-to-r ${categoryColors[post.category] || "from-gray-500 to-gray-600"} flex items-center justify-center mx-auto mb-3`}>
                    <Newspaper className="w-8 h-8 text-white" />
                  </div>
                  <span className="text-sm text-muted-foreground font-medium">{post.category}</span>
                </div>
              </div>
            </div>
          </div>
        </Card>
      </motion.div>
    </Link>
  );
}

function BlogPostCard({ post, index }: { post: BlogPost; index: number }) {
  const gradient = categoryColors[post.category] || "from-gray-500 to-gray-600";

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.05, duration: 0.4 }}
    >
      <Link href={`/blog/${post.slug}`}>
        <Card className="h-full hover-elevate cursor-pointer flex flex-col group" data-testid={`card-blog-${post.slug}`}>
          <div className="relative h-40 bg-gradient-to-br from-primary/5 via-accent/5 to-primary/3 dark:from-primary/15 dark:via-accent/10 dark:to-primary/8 rounded-t-md overflow-hidden">
            <div className="absolute inset-0 flex items-center justify-center">
              <div className={`w-12 h-12 rounded-md bg-gradient-to-r ${gradient} flex items-center justify-center`}>
                <span className="text-white font-bold text-sm">
                  {categoryIcons[post.category] || "BG"}
                </span>
              </div>
            </div>
            <div className={`absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r ${gradient}`} />
          </div>
          <CardHeader className="flex-1 pt-4">
            <div className="flex items-center gap-2 mb-2 flex-wrap">
              <Badge className={`bg-gradient-to-r ${gradient} text-white border-0 text-xs`}>
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
              <ChevronRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </Button>
          </CardContent>
        </Card>
      </Link>
    </motion.div>
  );
}

function LoadingSkeleton() {
  return (
    <>
      <Card className="mb-10">
        <div className="md:flex">
          <div className="md:w-2/5 p-6">
            <Skeleton className="h-5 w-28 mb-3" />
            <Skeleton className="h-8 w-full mb-2" />
            <Skeleton className="h-8 w-3/4 mb-3" />
            <Skeleton className="h-5 w-full mb-1" />
            <Skeleton className="h-5 w-2/3 mb-4" />
            <Skeleton className="h-9 w-36" />
          </div>
          <div className="md:w-3/5 p-6">
            <Skeleton className="w-full h-48 md:h-64 rounded-md" />
          </div>
        </div>
      </Card>
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <Card key={i} className="h-full">
            <Skeleton className="h-40 rounded-t-md" />
            <CardHeader className="pt-4">
              <div className="flex items-center gap-2 mb-2 flex-wrap">
                <Skeleton className="h-5 w-24" />
                <Skeleton className="h-4 w-20" />
              </div>
              <Skeleton className="h-6 w-full mb-2" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-3/4" />
            </CardHeader>
            <CardContent className="pt-0">
              <Skeleton className="h-9 w-full" />
            </CardContent>
          </Card>
        ))}
      </div>
    </>
  );
}

function EmptyState() {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
      className="text-center py-20"
    >
      <div className="relative mx-auto w-24 h-24 mb-6">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-accent/20 rounded-full animate-pulse-glow" />
        <div className="relative w-full h-full flex items-center justify-center bg-muted rounded-full">
          <BookOpen className="w-10 h-10 text-muted-foreground" />
        </div>
      </div>
      <h2 className="text-2xl font-bold mb-3">Il blog è in arrivo!</h2>
      <p className="text-muted-foreground mb-8 max-w-md mx-auto">
        Stiamo preparando i primi articoli. Torna presto per scoprire contenuti su AI,
        competenze digitali e formazione professionale.
      </p>
      <Link href="/">
        <Button data-testid="button-back-home-blog" className="gap-2">
          <ArrowLeft className="w-4 h-4" />
          Torna alla Home
        </Button>
      </Link>
    </motion.div>
  );
}

export default function BlogPage() {
  useSEO({
    title: "Blog | Consigli e Risorse per Imparare le Lingue | SkillCraft-Interlingua",
    description: "Blog di SkillCraft-Interlingua: articoli, consigli e risorse per imparare inglese, tedesco, francese, spagnolo e italiano. Approfondimenti linguistici dal 1993.",
    canonical: "/blog",
  });
  const { data: posts, isLoading } = useQuery<BlogPost[]>({
    queryKey: ["/api/blog"],
  });

  const featuredPost = posts && posts.length > 0 ? posts[0] : null;
  const remainingPosts = posts && posts.length > 1 ? posts.slice(1) : [];
  const categories = posts
    ? Array.from(new Set(posts.map((p) => p.category)))
    : [];

  return (
    <div className="min-h-screen bg-background">
      <Breadcrumb items={[{ label: "Blog", href: "/blog" }]} schemaOnly />
      <Navigation />

      <section className="relative pt-32 pb-16 overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-20 left-1/4 w-72 h-72 bg-primary/8 dark:bg-primary/15 rounded-full blur-3xl" />
          <div className="absolute top-40 right-1/4 w-96 h-96 bg-accent/6 dark:bg-accent/12 rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-background to-transparent" />
        </div>

        <div className="container mx-auto px-4 relative">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center mb-12"
          >
            <Badge variant="outline" className="mb-4">
              <Newspaper className="w-4 h-4 mr-2" />
              Blog & Risorse
            </Badge>
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-5 tracking-tight" data-testid="text-blog-title">
              Approfondimenti e{" "}
              <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                Tendenze
              </span>
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              Articoli su AI, competenze digitali, soft skills e formazione professionale.
              Nuovi contenuti ogni giorno per restare aggiornati.
            </p>
          </motion.div>

          {!isLoading && categories.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.4 }}
              className="flex items-center justify-center gap-2 mb-12 flex-wrap"
              data-testid="blog-categories"
            >
              {categories.map((cat) => (
                <Badge
                  key={cat}
                  variant="secondary"
                  className="text-xs"
                  data-testid={`badge-category-${cat.toLowerCase().replace(/\s+/g, "-")}`}
                >
                  <Tag className="w-3 h-3 mr-1" />
                  {cat}
                </Badge>
              ))}
            </motion.div>
          )}
        </div>
      </section>

      <main className="pb-20">
        <div className="container mx-auto px-4">
          {isLoading ? (
            <LoadingSkeleton />
          ) : posts && posts.length > 0 ? (
            <>
              {featuredPost && <FeaturedPostCard post={featuredPost} />}

              {remainingPosts.length > 0 && (
                <div className="mt-12">
                  <motion.div
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    className="flex items-center gap-3 mb-8"
                  >
                    <Sparkles className="w-5 h-5 text-accent" />
                    <h2 className="text-2xl font-bold">Tutti gli Articoli</h2>
                    <div className="flex-1 h-px bg-border" />
                    <span className="text-sm text-muted-foreground">{posts.length} articoli</span>
                  </motion.div>
                  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {remainingPosts.map((post, index) => (
                      <BlogPostCard key={post.id} post={post} index={index} />
                    ))}
                  </div>
                </div>
              )}
            </>
          ) : (
            <EmptyState />
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
