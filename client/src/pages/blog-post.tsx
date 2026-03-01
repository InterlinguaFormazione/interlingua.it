import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link, useParams } from "wouter";
import { useQuery, useMutation } from "@tanstack/react-query";
import { ArrowLeft, Calendar, MessageCircle, Send, Loader2, User, Reply } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Navigation } from "@/components/navigation";
import { Footer } from "@/components/footer";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import DOMPurify from "dompurify";
import type { BlogPost, BlogComment } from "@shared/schema";

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

function BlogCommentSection({ slug }: { slug: string }) {
  const [authorName, setAuthorName] = useState("");
  const [content, setContent] = useState("");
  const { toast } = useToast();

  const { data: comments = [], isLoading } = useQuery<BlogComment[]>({
    queryKey: ["/api/blog", slug, "comments"],
    queryFn: async () => {
      const res = await apiRequest("GET", `/api/blog/${slug}/comments`);
      return res.json();
    },
    refetchInterval: 10000,
  });

  const mutation = useMutation({
    mutationFn: async (data: { authorName: string; content: string }) => {
      const res = await apiRequest("POST", `/api/blog/${slug}/comments`, data);
      return res.json();
    },
    onSuccess: () => {
      setAuthorName("");
      setContent("");
      toast({ title: "Commento pubblicato!", description: "La tua opinione è stata aggiunta. Una risposta dal nostro team arriverà a breve." });
      queryClient.invalidateQueries({ queryKey: ["/api/blog", slug, "comments"] });
    },
    onError: () => {
      toast({ title: "Errore", description: "Non è stato possibile pubblicare il commento. Riprova.", variant: "destructive" });
    },
  });

  const topLevel = comments.filter(c => !c.parentId);
  const replies = comments.filter(c => c.parentId);
  const getReplies = (parentId: string) => replies.filter(r => r.parentId === parentId);

  return (
    <div className="mt-12 pt-8 border-t">
      <h3 className="text-xl font-bold mb-6 flex items-center gap-2" data-testid="text-comments-title">
        <MessageCircle className="w-5 h-5" />
        Commenti {topLevel.length > 0 && `(${comments.length})`}
      </h3>

      <div className="bg-muted/30 rounded-xl p-5 md:p-6 mb-8 border border-border/50">
        <h4 className="font-semibold mb-4">Lascia un commento</h4>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            if (!authorName.trim() || !content.trim()) return;
            mutation.mutate({ authorName: authorName.trim(), content: content.trim() });
          }}
          className="space-y-3"
        >
          <Input
            placeholder="Il tuo nome"
            value={authorName}
            onChange={(e) => setAuthorName(e.target.value)}
            maxLength={100}
            data-testid="input-comment-name"
          />
          <Textarea
            placeholder="Scrivi il tuo commento..."
            value={content}
            onChange={(e) => setContent(e.target.value)}
            rows={3}
            maxLength={2000}
            data-testid="input-comment-content"
          />
          <Button
            type="submit"
            disabled={mutation.isPending || !authorName.trim() || !content.trim()}
            data-testid="button-submit-comment"
          >
            {mutation.isPending ? (
              <><Loader2 className="w-4 h-4 mr-2 animate-spin" />Invio in corso...</>
            ) : (
              <><Send className="w-4 h-4 mr-2" />Pubblica commento</>
            )}
          </Button>
        </form>
      </div>

      {isLoading ? (
        <div className="space-y-4">
          {[1, 2].map(i => (
            <div key={i} className="flex gap-3">
              <Skeleton className="w-10 h-10 rounded-full flex-shrink-0" />
              <div className="flex-1 space-y-2">
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-12 w-full" />
              </div>
            </div>
          ))}
        </div>
      ) : topLevel.length === 0 ? (
        <p className="text-muted-foreground text-center py-8" data-testid="text-no-comments">
          Nessun commento ancora. Sii il primo a commentare!
        </p>
      ) : (
        <div className="space-y-5">
          <AnimatePresence>
            {topLevel.map((comment) => (
              <motion.div
                key={comment.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-3"
              >
                <CommentCard comment={comment} />
                {getReplies(comment.id).map((reply) => (
                  <div key={reply.id} className="ml-8 md:ml-12">
                    <CommentCard comment={reply} isReply />
                  </div>
                ))}
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
}

function CommentCard({ comment, isReply }: { comment: BlogComment; isReply?: boolean }) {
  const initials = comment.authorName
    .split(" ")
    .map(n => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  return (
    <div
      className={`flex gap-3 ${isReply ? "bg-primary/5 rounded-xl p-4 border border-primary/10" : ""}`}
      data-testid={`comment-${comment.id}`}
    >
      <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 text-sm font-bold ${
        comment.isAiReply
          ? "bg-gradient-to-br from-primary to-primary/70 text-primary-foreground"
          : "bg-muted text-muted-foreground"
      }`}>
        {comment.isAiReply ? <User className="w-4 h-4" /> : initials}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1 flex-wrap">
          <span className={`font-semibold text-sm ${comment.isAiReply ? "text-primary" : "text-foreground"}`}>
            {comment.authorName}
          </span>
          {comment.isAiReply && (
            <Badge variant="secondary" className="text-xs px-2 py-0">
              <Reply className="w-3 h-3 mr-1" />
              Staff
            </Badge>
          )}
          <span className="text-xs text-muted-foreground">
            {comment.createdAt && new Date(comment.createdAt).toLocaleDateString("it-IT", {
              day: "numeric",
              month: "short",
              year: "numeric",
              hour: "2-digit",
              minute: "2-digit",
            })}
          </span>
        </div>
        <p className="text-sm text-foreground/80 leading-relaxed whitespace-pre-wrap">{comment.content}</p>
      </div>
    </div>
  );
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
              className="prose sm:prose-lg dark:prose-invert max-w-none"
              dangerouslySetInnerHTML={{ __html: renderMarkdown(post.content) }} 
              data-testid="blog-post-content"
            />

            <BlogCommentSection slug={post.slug} />

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
