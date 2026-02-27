import { useState } from "react";
import { Navigation } from "@/components/navigation";
import { Footer } from "@/components/footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
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
  Users,
  UserPlus,
  Trash2,
  Pencil,
  ShoppingBag,
} from "lucide-react";

interface ShopOrder {
  id: string;
  productSlug: string;
  productName: string;
  amount: string;
  currency: string;
  paypalOrderId: string;
  status: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string | null;
  createdAt: string | null;
}

function ShopOrdersTab({ token }: { token: string }) {
  const { data: orders = [], isLoading } = useQuery<ShopOrder[]>({
    queryKey: ["/api/admin/shop/orders"],
    queryFn: async () => {
      const res = await fetch("/api/admin/shop/orders", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Failed to fetch orders");
      return res.json();
    },
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle>Ordini Shop</CardTitle>
        <CardDescription>Tutti gli acquisti effettuati online</CardDescription>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="text-center py-8 text-muted-foreground">Caricamento...</div>
        ) : orders.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">Nessun ordine ancora</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 px-2 font-medium">Data</th>
                  <th className="text-left py-3 px-2 font-medium">Corso</th>
                  <th className="text-left py-3 px-2 font-medium">Cliente</th>
                  <th className="text-left py-3 px-2 font-medium">Email</th>
                  <th className="text-right py-3 px-2 font-medium">Importo</th>
                  <th className="text-center py-3 px-2 font-medium">Stato</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order) => (
                  <tr key={order.id} className="border-b last:border-0" data-testid={`row-order-${order.id}`}>
                    <td className="py-3 px-2 text-muted-foreground whitespace-nowrap">
                      {order.createdAt ? new Date(order.createdAt).toLocaleDateString("it-IT") : "-"}
                    </td>
                    <td className="py-3 px-2 font-medium">{order.productName}</td>
                    <td className="py-3 px-2">{order.customerName}</td>
                    <td className="py-3 px-2 text-muted-foreground">{order.customerEmail}</td>
                    <td className="py-3 px-2 text-right font-medium">&euro;{parseFloat(order.amount).toFixed(2)}</td>
                    <td className="py-3 px-2 text-center">
                      <Badge variant={order.status === "completed" ? "default" : "secondary"}>
                        {order.status === "completed" ? "Completato" : order.status}
                      </Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

interface AdminUser {
  id: string;
  username: string;
  name: string;
  email: string;
  role: string;
  active: boolean | null;
  createdAt: string | null;
}

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
  const [token, setToken] = useState<string | null>(() => sessionStorage.getItem("admin_token"));
  const [currentUser, setCurrentUser] = useState<AdminUser | null>(() => {
    const stored = sessionStorage.getItem("admin_user");
    return stored ? JSON.parse(stored) : null;
  });
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [, setLocation] = useLocation();
  const { toast } = useToast();

  const [newUser, setNewUser] = useState({ username: "", password: "", name: "", email: "", role: "staff" });
  const [userDialogOpen, setUserDialogOpen] = useState(false);
  const [editUser, setEditUser] = useState<AdminUser | null>(null);
  const [editUserData, setEditUserData] = useState({ name: "", email: "", role: "", password: "" });
  const [editDialogOpen, setEditDialogOpen] = useState(false);

  const authenticated = !!token;
  const isAdmin = currentUser?.role === "admin";

  const loginMutation = useMutation({
    mutationFn: async (data: { username: string; password: string }) => {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) {
        const body = await res.json();
        throw new Error(body.message || "Errore di accesso");
      }
      return res.json();
    },
    onSuccess: (data) => {
      setToken(data.token);
      setCurrentUser(data.user);
      sessionStorage.setItem("admin_token", data.token);
      sessionStorage.setItem("admin_user", JSON.stringify(data.user));
      setUsername("");
      setPassword("");
    },
    onError: (error: Error) => {
      toast({ title: "Accesso negato", description: error.message, variant: "destructive" });
    },
  });

  const { data: adminUsers = [], isLoading: usersLoading } = useQuery<AdminUser[]>({
    queryKey: ["/api/admin/users"],
    enabled: authenticated && isAdmin,
    queryFn: async () => {
      const res = await adminFetch("/api/admin/users", token!);
      if (res.status === 401) { handleLogout(); throw new Error("Sessione scaduta"); }
      if (!res.ok) throw new Error("Errore nel caricamento");
      return res.json();
    },
  });

  const { data: contacts = [], isLoading: contactsLoading } = useQuery<ContactSubmission[]>({
    queryKey: ["/api/admin/contacts"],
    enabled: authenticated,
    queryFn: async () => {
      const res = await adminFetch("/api/admin/contacts", token!);
      if (res.status === 401) { handleLogout(); throw new Error("Sessione scaduta"); }
      if (!res.ok) throw new Error("Errore nel caricamento");
      return res.json();
    },
  });

  const { data: newsletter = [], isLoading: newsletterLoading } = useQuery<NewsletterSub[]>({
    queryKey: ["/api/admin/newsletter"],
    enabled: authenticated,
    queryFn: async () => {
      const res = await adminFetch("/api/admin/newsletter", token!);
      if (res.status === 401) { handleLogout(); throw new Error("Sessione scaduta"); }
      if (!res.ok) throw new Error("Errore nel caricamento");
      return res.json();
    },
  });

  const { data: blogPosts = [], isLoading: blogLoading } = useQuery<BlogPost[]>({
    queryKey: ["/api/admin/blog"],
    enabled: authenticated,
    queryFn: async () => {
      const res = await adminFetch("/api/admin/blog", token!);
      if (res.status === 401) { handleLogout(); throw new Error("Sessione scaduta"); }
      if (!res.ok) throw new Error("Errore nel caricamento");
      return res.json();
    },
  });

  const createUserMutation = useMutation({
    mutationFn: async (data: typeof newUser) => {
      const res = await adminFetch("/api/admin/users", token!, {
        method: "POST",
        body: JSON.stringify(data),
      });
      if (!res.ok) {
        const body = await res.json();
        throw new Error(body.message || "Errore nella creazione");
      }
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/users"] });
      toast({ title: "Utente creato", description: "Il nuovo utente è stato aggiunto." });
      setNewUser({ username: "", password: "", name: "", email: "", role: "staff" });
      setUserDialogOpen(false);
    },
    onError: (error: Error) => {
      toast({ title: "Errore", description: error.message, variant: "destructive" });
    },
  });

  const toggleUserMutation = useMutation({
    mutationFn: async ({ id, active }: { id: string; active: boolean }) => {
      const res = await adminFetch(`/api/admin/users/${id}`, token!, {
        method: "PATCH",
        body: JSON.stringify({ active }),
      });
      if (!res.ok) throw new Error("Errore nell'aggiornamento");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/users"] });
      toast({ title: "Aggiornato", description: "Stato utente aggiornato." });
    },
  });

  const updateUserMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Record<string, any> }) => {
      const payload: Record<string, any> = {};
      if (data.name) payload.name = data.name;
      if (data.email !== undefined) payload.email = data.email;
      if (data.role) payload.role = data.role;
      if (data.password) payload.password = data.password;
      const res = await adminFetch(`/api/admin/users/${id}`, token!, {
        method: "PATCH",
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        const body = await res.json();
        throw new Error(body.message || "Errore nell'aggiornamento");
      }
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/users"] });
      toast({ title: "Utente aggiornato", description: "Le modifiche sono state salvate." });
      setEditDialogOpen(false);
      setEditUser(null);
    },
    onError: (error: Error) => {
      toast({ title: "Errore", description: error.message, variant: "destructive" });
    },
  });

  const deleteUserMutation = useMutation({
    mutationFn: async (id: string) => {
      const res = await adminFetch(`/api/admin/users/${id}`, token!, { method: "DELETE" });
      if (!res.ok) {
        const body = await res.json();
        throw new Error(body.message || "Errore nell'eliminazione");
      }
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/users"] });
      toast({ title: "Utente eliminato" });
    },
    onError: (error: Error) => {
      toast({ title: "Errore", description: error.message, variant: "destructive" });
    },
  });

  const generateBlogMutation = useMutation({
    mutationFn: async () => {
      const res = await adminFetch("/api/admin/blog/generate", token!, { method: "POST" });
      if (res.status === 401) { handleLogout(); throw new Error("Sessione scaduta"); }
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
    if (!username || !password) {
      toast({ title: "Campi obbligatori", description: "Inserisci username e password.", variant: "destructive" });
      return;
    }
    loginMutation.mutate({ username, password });
  };

  const handleLogout = () => {
    setToken(null);
    setCurrentUser(null);
    sessionStorage.removeItem("admin_token");
    sessionStorage.removeItem("admin_user");
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
                    Inserisci le tue credenziali per accedere.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleLogin} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="admin-username">Username o Email</Label>
                      <Input
                        id="admin-username"
                        type="text"
                        placeholder="Username o email"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        data-testid="input-admin-username"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="admin-password">Password</Label>
                      <div className="relative">
                        <Input
                          id="admin-password"
                          type={showPassword ? "text" : "password"}
                          placeholder="La tua password"
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

  const tabCount = isAdmin ? 4 : 3;

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
                <p className="text-muted-foreground">
                  Benvenuto, {currentUser?.name}
                  <Badge variant="secondary" className="ml-2 text-xs">
                    {currentUser?.role === "admin" ? "Amministratore" : "Staff"}
                  </Badge>
                </p>
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
            <TabsList className={`grid w-full ${isAdmin ? "grid-cols-5" : "grid-cols-4"}`}>
              <TabsTrigger value="contacts" data-testid="tab-contacts">
                <MessageSquare className="w-4 h-4 mr-2" />
                Messaggi
              </TabsTrigger>
              <TabsTrigger value="newsletter" data-testid="tab-newsletter">
                <Mail className="w-4 h-4 mr-2" />
                Newsletter
              </TabsTrigger>
              <TabsTrigger value="orders" data-testid="tab-orders">
                <ShoppingBag className="w-4 h-4 mr-2" />
                Ordini
              </TabsTrigger>
              <TabsTrigger value="blog" data-testid="tab-blog">
                <Newspaper className="w-4 h-4 mr-2" />
                Blog
              </TabsTrigger>
              {isAdmin && (
                <TabsTrigger value="users" data-testid="tab-users">
                  <Users className="w-4 h-4 mr-2" />
                  Utenti
                </TabsTrigger>
              )}
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

            <TabsContent value="orders">
              <ShopOrdersTab token={token} />
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

            {isAdmin && (
              <TabsContent value="users">
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between">
                    <div>
                      <CardTitle>Gestione Utenti</CardTitle>
                      <CardDescription>Crea e gestisci utenti admin e staff</CardDescription>
                    </div>
                    <Dialog open={userDialogOpen} onOpenChange={setUserDialogOpen}>
                      <DialogTrigger asChild>
                        <Button data-testid="button-add-user">
                          <UserPlus className="w-4 h-4 mr-2" />
                          Nuovo Utente
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Crea Nuovo Utente</DialogTitle>
                        </DialogHeader>
                        <form
                          onSubmit={(e) => {
                            e.preventDefault();
                            const pwd = newUser.password;
                            if (pwd.length < 8 || !/[A-Z]/.test(pwd) || !/[a-z]/.test(pwd) || !/[0-9]/.test(pwd) || !/[^A-Za-z0-9]/.test(pwd)) {
                              toast({ title: "Password troppo debole", description: "La password deve avere almeno 8 caratteri, una maiuscola, una minuscola, un numero e un carattere speciale.", variant: "destructive" });
                              return;
                            }
                            createUserMutation.mutate(newUser);
                          }}
                          className="space-y-4"
                        >
                          <div className="space-y-2">
                            <Label htmlFor="new-user-name">Nome e Cognome</Label>
                            <Input
                              id="new-user-name"
                              value={newUser.name}
                              onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
                              required
                              data-testid="input-new-user-name"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="new-user-username">Username</Label>
                            <Input
                              id="new-user-username"
                              value={newUser.username}
                              onChange={(e) => setNewUser({ ...newUser, username: e.target.value })}
                              required
                              data-testid="input-new-user-username"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="new-user-email">Email</Label>
                            <Input
                              id="new-user-email"
                              type="email"
                              value={newUser.email}
                              onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                              data-testid="input-new-user-email"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="new-user-password">Password</Label>
                            <Input
                              id="new-user-password"
                              type="password"
                              value={newUser.password}
                              onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
                              required
                              placeholder="Min. 8 caratteri, maiuscola, numero, speciale"
                              data-testid="input-new-user-password"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="new-user-role">Ruolo</Label>
                            <Select
                              value={newUser.role}
                              onValueChange={(value) => setNewUser({ ...newUser, role: value })}
                            >
                              <SelectTrigger data-testid="select-new-user-role">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="staff">Staff</SelectItem>
                                <SelectItem value="admin">Amministratore</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          <Button
                            type="submit"
                            className="w-full"
                            disabled={createUserMutation.isPending}
                            data-testid="button-create-user"
                          >
                            {createUserMutation.isPending ? "Creazione..." : "Crea Utente"}
                          </Button>
                        </form>
                      </DialogContent>
                    </Dialog>
                  </CardHeader>
                  <CardContent>
                    {usersLoading ? (
                      <div className="space-y-3">
                        {[1, 2, 3].map((i) => (
                          <div key={i} className="h-16 bg-muted rounded animate-pulse" />
                        ))}
                      </div>
                    ) : adminUsers.length === 0 ? (
                      <div className="text-center py-12 text-muted-foreground">
                        <Users className="w-12 h-12 mx-auto mb-4 opacity-50" />
                        <p>Nessun utente trovato.</p>
                      </div>
                    ) : (
                      <div className="space-y-3">
                        {adminUsers.map((user) => (
                          <div
                            key={user.id}
                            className="flex items-center justify-between p-4 rounded-lg border bg-card"
                            data-testid={`row-user-${user.id}`}
                          >
                            <div className="flex items-center gap-4">
                              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                                <span className="text-primary font-semibold text-sm">
                                  {user.name ? user.name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2) : user.username.slice(0, 2).toUpperCase()}
                                </span>
                              </div>
                              <div>
                                <p className="font-medium text-foreground">{user.name || user.username}</p>
                                <p className="text-sm text-muted-foreground">@{user.username}{user.email ? ` · ${user.email}` : ""}</p>
                              </div>
                            </div>
                            <div className="flex items-center gap-4">
                              <Badge variant={user.role === "admin" ? "default" : "secondary"}>
                                {user.role === "admin" ? "Admin" : "Staff"}
                              </Badge>
                              {user.active ? (
                                <Badge variant="secondary" className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                                  Attivo
                                </Badge>
                              ) : (
                                <Badge variant="secondary">Disattivo</Badge>
                              )}
                              <Switch
                                checked={user.active ?? true}
                                onCheckedChange={(checked) => toggleUserMutation.mutate({ id: user.id, active: checked })}
                                disabled={user.id === currentUser?.id}
                                data-testid={`switch-user-${user.id}`}
                              />
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => {
                                  setEditUser(user);
                                  setEditUserData({
                                    name: user.name,
                                    email: user.email || "",
                                    role: user.role,
                                    password: "",
                                  });
                                  setEditDialogOpen(true);
                                }}
                                data-testid={`button-edit-user-${user.id}`}
                              >
                                <Pencil className="w-4 h-4" />
                              </Button>
                              {user.id !== currentUser?.id && (
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => {
                                    if (confirm("Sei sicuro di voler eliminare questo utente?")) {
                                      deleteUserMutation.mutate(user.id);
                                    }
                                  }}
                                  data-testid={`button-delete-user-${user.id}`}
                                >
                                  <Trash2 className="w-4 h-4 text-destructive" />
                                </Button>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>

                <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Modifica Utente — @{editUser?.username}</DialogTitle>
                    </DialogHeader>
                    <form
                      onSubmit={(e) => {
                        e.preventDefault();
                        if (editUserData.password) {
                          const pwd = editUserData.password;
                          if (pwd.length < 8 || !/[A-Z]/.test(pwd) || !/[a-z]/.test(pwd) || !/[0-9]/.test(pwd) || !/[^A-Za-z0-9]/.test(pwd)) {
                            toast({ title: "Password troppo debole", description: "La password deve avere almeno 8 caratteri, una maiuscola, una minuscola, un numero e un carattere speciale.", variant: "destructive" });
                            return;
                          }
                        }
                        if (editUser) {
                          updateUserMutation.mutate({ id: editUser.id, data: editUserData });
                        }
                      }}
                      className="space-y-4"
                    >
                      <div className="space-y-2">
                        <Label htmlFor="edit-user-name">Nome e Cognome</Label>
                        <Input
                          id="edit-user-name"
                          value={editUserData.name}
                          onChange={(e) => setEditUserData({ ...editUserData, name: e.target.value })}
                          required
                          data-testid="input-edit-user-name"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="edit-user-email">Email</Label>
                        <Input
                          id="edit-user-email"
                          type="email"
                          value={editUserData.email}
                          onChange={(e) => setEditUserData({ ...editUserData, email: e.target.value })}
                          data-testid="input-edit-user-email"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="edit-user-role">Ruolo</Label>
                        <Select
                          value={editUserData.role}
                          onValueChange={(value) => setEditUserData({ ...editUserData, role: value })}
                        >
                          <SelectTrigger data-testid="select-edit-user-role">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="staff">Staff</SelectItem>
                            <SelectItem value="admin">Amministratore</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="edit-user-password">Nuova Password (lascia vuoto per non cambiarla)</Label>
                        <Input
                          id="edit-user-password"
                          type="password"
                          value={editUserData.password}
                          onChange={(e) => setEditUserData({ ...editUserData, password: e.target.value })}
                          placeholder="Lascia vuoto per non modificare"
                          data-testid="input-edit-user-password"
                        />
                      </div>
                      <Button
                        type="submit"
                        className="w-full"
                        disabled={updateUserMutation.isPending}
                        data-testid="button-save-user"
                      >
                        {updateUserMutation.isPending ? "Salvataggio..." : "Salva Modifiche"}
                      </Button>
                    </form>
                  </DialogContent>
                </Dialog>
              </TabsContent>
            )}
          </Tabs>
        </div>
      </main>
      <Footer />
    </div>
  );
}
