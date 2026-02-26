import { useState } from "react";
import { Navigation } from "@/components/navigation";
import { Footer } from "@/components/footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { useQuery, useMutation } from "@tanstack/react-query";
import { queryClient } from "@/lib/queryClient";
import { useLocation } from "wouter";
import {
  Shield,
  Mail,
  MessageSquare,
  Newspaper,
  Mic,
  ArrowRight,
  RefreshCw,
  Eye,
  EyeOff,
  Lock,
} from "lucide-react";

interface ContactSubmission {
  id: number;
  name: string;
  email: string;
  phone: string | null;
  company: string | null;
  message: string;
  interest: string | null;
  createdAt: string | null;
}

interface NewsletterSub {
  id: number;
  email: string;
  createdAt: string | null;
}

interface BlogPost {
  id: number;
  title: string;
  slug: string;
  excerpt: string;
  publishedAt: string | null;
}

function adminFetch(url: string, token: string, options?: RequestInit) {
  return fetch(url, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
      ...(options?.headers || {}),
    },
  });
}

export default function AdminPage() {
  const [token, setToken] = useState<string | null>(() => {
    return sessionStorage.getItem("admin_token");
  });
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [, setLocation] = useLocation();
  const { toast } = useToast();

  const authenticated = !!token;

  const loginMutation = useMutation({
    mutationFn: async (pwd: string) => {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password: pwd }),
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.message || "Errore di accesso");
      }
      return res.json();
    },
    onSuccess: (data) => {
      setToken(data.token);
      sessionStorage.setItem("admin_token", data.token);
      setPassword("");
    },
    onError: (error: Error) => {
      toast({
        title: "Accesso negato",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const { data: contacts = [], isLoading: contactsLoading } = useQuery<ContactSubmission[]>({
    queryKey: ["/api/admin/contacts"],
    enabled: authenticated,
    queryFn: async () => {
      const res = await adminFetch("/api/admin/contacts", token!);
      if (res.status === 401) {
        handleLogout();
        throw new Error("Sessione scaduta");
      }
      if (!res.ok) throw new Error("Errore nel caricamento");
      return res.json();
    },
  });

  const { data: newsletter = [], isLoading: newsletterLoading } = useQuery<NewsletterSub[]>({
    queryKey: ["/api/admin/newsletter"],
    enabled: authenticated,
    queryFn: async () => {
      const res = await adminFetch("/api/admin/newsletter", token!);
      if (res.status === 401) {
        handleLogout();
        throw new Error("Sessione scaduta");
      }
      if (!res.ok) throw new Error("Errore nel caricamento");
      return res.json();
    },
  });

  const { data: blogPosts = [], isLoading: blogLoading } = useQuery<BlogPost[]>({
    queryKey: ["/api/admin/blog"],
    enabled: authenticated,
    queryFn: async () => {
      const res = await adminFetch("/api/admin/blog", token!);
      if (res.status === 401) {
        handleLogout();
        throw new Error("Sessione scaduta");
      }
      if (!res.ok) throw new Error("Errore nel caricamento");
      return res.json();
    },
  });

  const generateBlogMutation = useMutation({
    mutationFn: async () => {
      const res = await adminFetch("/api/admin/blog/generate", token!, {
        method: "POST",
      });
      if (res.status === 401) {
        handleLogout();
        throw new Error("Sessione scaduta");
      }
      if (!res.ok) throw new Error("Errore nella generazione");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/blog"] });
      toast({ title: "Articolo generato", description: "Un nuovo articolo del blog è stato creato." });
    },
    onError: () => {
      toast({ title: "Errore", description: "Errore nella generazione dell'articolo.", variant: "destructive" });
    },
  });

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!password) {
      toast({ title: "Campo obbligatorio", description: "Inserisci la password.", variant: "destructive" });
      return;
    }
    loginMutation.mutate(password);
  };

  const handleLogout = () => {
    setToken(null);
    sessionStorage.removeItem("admin_token");
  };

  const formatDate = (dateStr: string | null) => {
    if (!dateStr) return "—";
    const date = new Date(dateStr);
    return date.toLocaleDateString("it-IT", {
      day: "numeric",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (!authenticated) {
    return (
      <div className="min-h-screen">
        <Navigation />
        <main className="pt-28 pb-20">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-md mx-auto">
              <Card data-testid="card-admin-login">
                <CardHeader className="text-center">
                  <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Shield className="w-8 h-8 text-primary" />
                  </div>
                  <CardTitle>Pannello Amministrazione</CardTitle>
                  <CardDescription>
                    Inserisci la password per accedere al pannello di amministrazione.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleLogin} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="admin-password">Password</Label>
                      <div className="relative">
                        <Input
                          id="admin-password"
                          type={showPassword ? "text" : "password"}
                          placeholder="Password amministratore"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          data-testid="input-admin-password"
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                          data-testid="button-toggle-password"
                        >
                          {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                      </div>
                    </div>
                    <Button
                      type="submit"
                      className="w-full"
                      disabled={loginMutation.isPending}
                      data-testid="button-admin-login"
                    >
                      <Lock className="w-4 h-4 mr-2" />
                      {loginMutation.isPending ? "Accesso in corso..." : "Accedi"}
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <Navigation />
      <main className="pt-28 pb-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
              <Shield className="w-8 h-8 text-primary" />
              <div>
                <h1 className="text-3xl font-bold text-foreground" data-testid="text-admin-title">
                  Pannello Amministrazione
                </h1>
                <p className="text-muted-foreground">Gestione contatti, newsletter, blog e servizi</p>
              </div>
            </div>
            <Button
              variant="outline"
              onClick={handleLogout}
              data-testid="button-admin-logout"
            >
              Esci
            </Button>
          </div>

          <div className="grid md:grid-cols-4 gap-4 mb-8">
            <Card data-testid="card-stat-contacts">
              <CardContent className="pt-6">
                <div className="flex items-center gap-3">
                  <MessageSquare className="w-5 h-5 text-primary" />
                  <div>
                    <p className="text-2xl font-bold">{contacts.length}</p>
                    <p className="text-sm text-muted-foreground">Messaggi ricevuti</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card data-testid="card-stat-newsletter">
              <CardContent className="pt-6">
                <div className="flex items-center gap-3">
                  <Mail className="w-5 h-5 text-primary" />
                  <div>
                    <p className="text-2xl font-bold">{newsletter.length}</p>
                    <p className="text-sm text-muted-foreground">Iscritti newsletter</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card data-testid="card-stat-blog">
              <CardContent className="pt-6">
                <div className="flex items-center gap-3">
                  <Newspaper className="w-5 h-5 text-primary" />
                  <div>
                    <p className="text-2xl font-bold">{blogPosts.length}</p>
                    <p className="text-sm text-muted-foreground">Articoli blog</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card
              className="cursor-pointer hover:border-primary/50 transition-colors"
              onClick={() => setLocation("/speakers-corner/admin")}
              data-testid="card-link-sc-admin"
            >
              <CardContent className="pt-6">
                <div className="flex items-center gap-3">
                  <Mic className="w-5 h-5 text-primary" />
                  <div>
                    <p className="text-sm font-semibold text-foreground">Speaker's Corner</p>
                    <p className="text-sm text-muted-foreground">Gestisci iscritti e sessioni</p>
                  </div>
                  <ArrowRight className="w-4 h-4 text-muted-foreground ml-auto" />
                </div>
              </CardContent>
            </Card>
          </div>

          <Tabs defaultValue="contacts" className="space-y-6">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="contacts" data-testid="tab-contacts">
                <MessageSquare className="w-4 h-4 mr-2" />
                Messaggi
              </TabsTrigger>
              <TabsTrigger value="newsletter" data-testid="tab-newsletter">
                <Mail className="w-4 h-4 mr-2" />
                Newsletter
              </TabsTrigger>
              <TabsTrigger value="blog" data-testid="tab-blog">
                <Newspaper className="w-4 h-4 mr-2" />
                Blog
              </TabsTrigger>
            </TabsList>

            <TabsContent value="contacts">
              <Card>
                <CardHeader>
                  <CardTitle>Messaggi dal Modulo Contatti</CardTitle>
                  <CardDescription>Tutti i messaggi ricevuti dal form di contatto del sito</CardDescription>
                </CardHeader>
                <CardContent>
                  {contactsLoading ? (
                    <div className="space-y-3">
                      {[1, 2, 3].map((i) => (
                        <div key={i} className="h-20 bg-muted rounded animate-pulse" />
                      ))}
                    </div>
                  ) : contacts.length === 0 ? (
                    <div className="text-center py-12 text-muted-foreground">
                      <MessageSquare className="w-12 h-12 mx-auto mb-4 opacity-50" />
                      <p>Nessun messaggio ricevuto.</p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {[...contacts].reverse().map((contact) => (
                        <div
                          key={contact.id}
                          className="p-4 rounded-lg border bg-card"
                          data-testid={`row-contact-${contact.id}`}
                        >
                          <div className="flex items-start justify-between mb-2">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                                <span className="text-primary font-semibold text-sm">
                                  {contact.name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2)}
                                </span>
                              </div>
                              <div>
                                <p className="font-medium text-foreground">{contact.name}</p>
                                <p className="text-sm text-muted-foreground">{contact.email}</p>
                              </div>
                            </div>
                            <div className="text-right">
                              <p className="text-xs text-muted-foreground">{formatDate(contact.createdAt)}</p>
                              {contact.interest && (
                                <Badge variant="secondary" className="mt-1 text-xs">
                                  {contact.interest}
                                </Badge>
                              )}
                            </div>
                          </div>
                          {contact.phone && (
                            <p className="text-sm text-muted-foreground mb-1">
                              Tel: <a href={`tel:${contact.phone}`} className="text-primary hover:underline">{contact.phone}</a>
                            </p>
                          )}
                          {contact.company && (
                            <p className="text-sm text-muted-foreground mb-1">
                              Azienda: {contact.company}
                            </p>
                          )}
                          <p className="text-sm text-foreground mt-2 bg-muted/50 p-3 rounded-md">
                            {contact.message}
                          </p>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="newsletter">
              <Card>
                <CardHeader>
                  <CardTitle>Iscritti alla Newsletter</CardTitle>
                  <CardDescription>Elenco di tutti gli iscritti alla newsletter</CardDescription>
                </CardHeader>
                <CardContent>
                  {newsletterLoading ? (
                    <div className="space-y-3">
                      {[1, 2, 3].map((i) => (
                        <div key={i} className="h-12 bg-muted rounded animate-pulse" />
                      ))}
                    </div>
                  ) : newsletter.length === 0 ? (
                    <div className="text-center py-12 text-muted-foreground">
                      <Mail className="w-12 h-12 mx-auto mb-4 opacity-50" />
                      <p>Nessun iscritto alla newsletter.</p>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      {[...newsletter].reverse().map((sub) => (
                        <div
                          key={sub.id}
                          className="flex items-center justify-between p-3 rounded-lg border bg-card"
                          data-testid={`row-newsletter-${sub.id}`}
                        >
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                              <Mail className="w-4 h-4 text-primary" />
                            </div>
                            <p className="font-medium text-foreground">{sub.email}</p>
                          </div>
                          <p className="text-xs text-muted-foreground">{formatDate(sub.createdAt)}</p>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="blog">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <div>
                    <CardTitle>Gestione Blog</CardTitle>
                    <CardDescription>Articoli pubblicati e generazione automatica</CardDescription>
                  </div>
                  <Button
                    onClick={() => generateBlogMutation.mutate()}
                    disabled={generateBlogMutation.isPending}
                    data-testid="button-generate-blog"
                  >
                    <RefreshCw className={`w-4 h-4 mr-2 ${generateBlogMutation.isPending ? "animate-spin" : ""}`} />
                    {generateBlogMutation.isPending ? "Generazione..." : "Genera Articolo"}
                  </Button>
                </CardHeader>
                <CardContent>
                  {blogLoading ? (
                    <div className="space-y-3">
                      {[1, 2, 3].map((i) => (
                        <div key={i} className="h-16 bg-muted rounded animate-pulse" />
                      ))}
                    </div>
                  ) : blogPosts.length === 0 ? (
                    <div className="text-center py-12 text-muted-foreground">
                      <Newspaper className="w-12 h-12 mx-auto mb-4 opacity-50" />
                      <p>Nessun articolo pubblicato. Genera il primo articolo.</p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {[...blogPosts].reverse().map((post) => (
                        <div
                          key={post.id}
                          className="flex items-center justify-between p-4 rounded-lg border bg-card"
                          data-testid={`row-blog-${post.id}`}
                        >
                          <div className="flex-1 mr-4">
                            <p className="font-medium text-foreground">{post.title}</p>
                            <p className="text-sm text-muted-foreground line-clamp-1">{post.excerpt}</p>
                          </div>
                          <div className="flex items-center gap-3">
                            <p className="text-xs text-muted-foreground whitespace-nowrap">
                              {formatDate(post.publishedAt)}
                            </p>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => setLocation(`/blog/${post.slug}`)}
                              data-testid={`button-view-blog-${post.id}`}
                            >
                              <Eye className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </main>
      <Footer />
    </div>
  );
}
