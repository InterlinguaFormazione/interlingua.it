import { useState, useEffect, useCallback } from "react";
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
import { SHOP_PRODUCTS } from "@shared/products";
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
  FileText,
  Plus,
  Briefcase,
  GraduationCap,
  ChevronDown,
  ChevronUp,
  Tag,
  ToggleLeft,
  ToggleRight,
  Wand2,
  Star,
  CheckCircle,
  XCircle,
  LayoutDashboard,
  MessagesSquare,
  TrendingUp,
  Euro,
  ClipboardList,
  FileDown,
  StickyNote,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

interface DashboardStats {
  contacts: number;
  newsletter: number;
  blogPosts: number;
  orders: number;
  totalRevenue: string;
  reviews: number;
  pendingReviews: number;
  completedTests: number;
  totalTests: number;
  blogComments: number;
}

function DashboardTab({ token }: { token: string }) {
  const { data: stats, isLoading } = useQuery<DashboardStats>({
    queryKey: ["/api/admin/dashboard"],
    queryFn: async () => {
      const res = await fetch("/api/admin/dashboard", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Failed");
      return res.json();
    },
  });

  if (isLoading || !stats) {
    return (
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
        {[...Array(10)].map((_, i) => (
          <div key={i} className="h-28 bg-muted rounded-xl animate-pulse" />
        ))}
      </div>
    );
  }

  const cards = [
    { label: "Richieste Contatto", value: stats.contacts, icon: MessageSquare, color: "text-blue-600", bg: "bg-blue-50" },
    { label: "Iscritti Newsletter", value: stats.newsletter, icon: Mail, color: "text-indigo-600", bg: "bg-indigo-50" },
    { label: "Ordini Shop", value: stats.orders, icon: ShoppingBag, color: "text-emerald-600", bg: "bg-emerald-50" },
    { label: "Fatturato Totale", value: `\u20AC${parseFloat(stats.totalRevenue).toLocaleString("it-IT", { minimumFractionDigits: 2 })}`, icon: Euro, color: "text-green-600", bg: "bg-green-50" },
    { label: "Test Completati", value: `${stats.completedTests}/${stats.totalTests}`, icon: GraduationCap, color: "text-purple-600", bg: "bg-purple-50" },
    { label: "Articoli Blog", value: stats.blogPosts, icon: Newspaper, color: "text-sky-600", bg: "bg-sky-50" },
    { label: "Commenti Blog", value: stats.blogComments, icon: MessagesSquare, color: "text-cyan-600", bg: "bg-cyan-50" },
    { label: "Recensioni Totali", value: stats.reviews, icon: Star, color: "text-amber-600", bg: "bg-amber-50" },
    { label: "Recensioni in Attesa", value: stats.pendingReviews, icon: ClipboardList, color: stats.pendingReviews > 0 ? "text-red-600" : "text-slate-500", bg: stats.pendingReviews > 0 ? "bg-red-50" : "bg-slate-50" },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-slate-900 mb-1" data-testid="text-dashboard-title">Panoramica</h2>
        <p className="text-sm text-muted-foreground">Riepilogo attività del sito</p>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-4">
        {cards.map((card, i) => {
          const Icon = card.icon;
          return (
            <Card key={i} className="border shadow-sm hover:shadow-md transition-shadow" data-testid={`card-stat-${i}`}>
              <CardContent className="p-4 flex items-start gap-3">
                <div className={`w-10 h-10 rounded-lg ${card.bg} flex items-center justify-center shrink-0`}>
                  <Icon className={`w-5 h-5 ${card.color}`} />
                </div>
                <div className="min-w-0">
                  <p className="text-xs text-muted-foreground truncate">{card.label}</p>
                  <p className={`text-xl font-bold ${card.color} mt-0.5`}>{card.value}</p>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}

interface BlogCommentAdmin {
  id: string;
  blogSlug: string;
  authorName: string;
  content: string;
  isAiReply: boolean | null;
  parentId: string | null;
  approved: boolean | null;
  createdAt: string | null;
}

function BlogCommentsTab({ token }: { token: string }) {
  const { toast } = useToast();
  const [filter, setFilter] = useState<"all" | "user" | "staff">("all");

  const { data: comments = [], isLoading } = useQuery<BlogCommentAdmin[]>({
    queryKey: ["/api/admin/blog-comments"],
    queryFn: async () => {
      const res = await fetch("/api/admin/blog-comments", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Failed");
      return res.json();
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      await fetch(`/api/admin/blog-comments/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/blog-comments"] });
      toast({ title: "Commento eliminato" });
    },
  });

  const filtered = comments.filter(c => {
    if (filter === "user") return !c.isAiReply;
    if (filter === "staff") return c.isAiReply;
    return true;
  });

  const userCount = comments.filter(c => !c.isAiReply).length;
  const staffCount = comments.filter(c => c.isAiReply).length;

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between flex-wrap gap-2">
          <div>
            <CardTitle className="flex items-center gap-2">
              <MessagesSquare className="w-5 h-5" /> Commenti Blog
            </CardTitle>
            <CardDescription>{userCount} commenti utenti, {staffCount} risposte staff</CardDescription>
          </div>
          <div className="flex gap-2">
            <Select value={filter} onValueChange={(v: "all" | "user" | "staff") => setFilter(v)}>
              <SelectTrigger className="w-[160px]" data-testid="select-comment-filter">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tutti ({comments.length})</SelectItem>
                <SelectItem value="user">Solo utenti ({userCount})</SelectItem>
                <SelectItem value="staff">Solo staff ({staffCount})</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="text-center py-8 text-muted-foreground">Caricamento...</div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <MessagesSquare className="w-12 h-12 mx-auto mb-4 opacity-50" />
            <p>Nessun commento</p>
          </div>
        ) : (
          <div className="space-y-3">
            {filtered.map((comment) => (
              <div
                key={comment.id}
                className={`border rounded-lg p-4 ${comment.isAiReply ? "border-blue-200 bg-blue-50/30" : "border-border"} ${comment.parentId ? "ml-6" : ""}`}
                data-testid={`comment-row-${comment.id}`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-grow min-w-0">
                    <div className="flex items-center gap-2 mb-1 flex-wrap">
                      <span className="font-semibold text-sm">{comment.authorName}</span>
                      {comment.isAiReply && (
                        <Badge variant="secondary" className="text-[10px] text-blue-600">Staff AI</Badge>
                      )}
                      {comment.parentId && (
                        <Badge variant="outline" className="text-[10px]">Risposta</Badge>
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground mb-1">
                      Articolo: <span className="font-medium">{comment.blogSlug.replace(/-/g, " ").replace(/^\d{4}\s\d{2}\s\d{2}\s/, "").substring(0, 50)}</span>
                      {" · "}
                      {comment.createdAt ? new Date(comment.createdAt).toLocaleDateString("it-IT") : ""}
                    </p>
                    <p className="text-sm text-muted-foreground">{comment.content}</p>
                  </div>
                  <Button
                    size="icon"
                    variant="ghost"
                    className="h-8 w-8 text-red-500 hover:text-red-700 hover:bg-red-50 shrink-0"
                    onClick={() => {
                      if (confirm("Eliminare questo commento?")) {
                        deleteMutation.mutate(comment.id);
                      }
                    }}
                    disabled={deleteMutation.isPending}
                    title="Elimina"
                    data-testid={`button-delete-comment-${comment.id}`}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

interface ShopOrder {
  id: string;
  productSlug: string;
  productName: string;
  amount: string;
  currency: string;
  paypalOrderId: string;
  status: string;
  customerFirstName: string;
  customerLastName: string;
  customerEmail: string;
  customerPhone: string | null;
  studentFirstName: string | null;
  studentLastName: string | null;
  studentEmail: string | null;
  billingCodiceFiscale: string | null;
  billingIndirizzo: string | null;
  billingCap: string | null;
  billingCitta: string | null;
  billingProvincia: string | null;
  billingPartitaIva: string | null;
  billingCodiceSdi: string | null;
  billingPec: string | null;
  billingPaese: string | null;
  notes: string | null;
  adminNotes: string | null;
  discountCode: string | null;
  discountAmount: string | null;
  createdAt: string | null;
}

const ORDER_STATUSES = [
  { value: "pending", label: "In attesa", color: "bg-yellow-100 text-yellow-800" },
  { value: "completed", label: "Completato", color: "bg-green-100 text-green-800" },
  { value: "cancelled", label: "Annullato", color: "bg-red-100 text-red-800" },
  { value: "refunded", label: "Rimborsato", color: "bg-purple-100 text-purple-800" },
];

const ORDERS_PER_PAGE = 15;

type SortField = "date" | "amount" | "status" | "name";
type SortDir = "asc" | "desc";

function ShopOrdersTab({ token }: { token: string }) {
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [productFilter, setProductFilter] = useState("all");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [sortField, setSortField] = useState<SortField>("date");
  const [sortDir, setSortDir] = useState<SortDir>("desc");
  const [page, setPage] = useState(1);
  const [editingNoteId, setEditingNoteId] = useState<string | null>(null);
  const [noteText, setNoteText] = useState("");
  const { toast } = useToast();

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

  const statusMutation = useMutation({
    mutationFn: async ({ id, status }: { id: string; status: string }) => {
      const res = await fetch(`/api/admin/shop/orders/${id}/status`, {
        method: "PATCH",
        headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      if (!res.ok) throw new Error("Failed");
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/shop/orders"] });
      queryClient.invalidateQueries({ queryKey: ["/api/admin/dashboard"] });
      toast({ title: "Stato aggiornato" });
    },
    onError: () => {
      toast({ title: "Errore nell'aggiornamento", variant: "destructive" });
    },
  });

  const bulkStatusMutation = useMutation({
    mutationFn: async (status: string) => {
      const ids = Array.from(selectedIds);
      for (const id of ids) {
        const res = await fetch(`/api/admin/shop/orders/${id}/status`, {
          method: "PATCH",
          headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
          body: JSON.stringify({ status }),
        });
        if (!res.ok) throw new Error("Failed");
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/shop/orders"] });
      queryClient.invalidateQueries({ queryKey: ["/api/admin/dashboard"] });
      setSelectedIds(new Set());
      toast({ title: "Stato aggiornato per tutti gli ordini selezionati" });
    },
    onError: () => {
      toast({ title: "Errore nell'aggiornamento", variant: "destructive" });
    },
  });

  const notesMutation = useMutation({
    mutationFn: async ({ id, adminNotes }: { id: string; adminNotes: string }) => {
      const res = await fetch(`/api/admin/shop/orders/${id}/notes`, {
        method: "PATCH",
        headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
        body: JSON.stringify({ adminNotes }),
      });
      if (!res.ok) throw new Error("Failed");
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/shop/orders"] });
      setEditingNoteId(null);
      toast({ title: "Note salvate" });
    },
    onError: () => {
      toast({ title: "Errore nel salvataggio", variant: "destructive" });
    },
  });

  const toggleSelect = (id: string) => {
    setSelectedIds(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id); else next.add(id);
      return next;
    });
  };

  const productNames = [...new Set(orders.map(o => o.productName))].sort();

  const filtered = orders.filter(o => {
    if (search) {
      const s = search.toLowerCase();
      const match = `${o.customerFirstName} ${o.customerLastName} ${o.customerEmail} ${o.id} ${o.paypalOrderId}`.toLowerCase().includes(s);
      if (!match) return false;
    }
    if (statusFilter !== "all" && o.status !== statusFilter) return false;
    if (productFilter !== "all" && o.productName !== productFilter) return false;
    if (dateFrom && o.createdAt && new Date(o.createdAt) < new Date(dateFrom)) return false;
    if (dateTo && o.createdAt && new Date(o.createdAt) > new Date(dateTo + "T23:59:59")) return false;
    return true;
  });

  const sorted = [...filtered].sort((a, b) => {
    let cmp = 0;
    if (sortField === "date") {
      cmp = (new Date(a.createdAt || 0).getTime()) - (new Date(b.createdAt || 0).getTime());
    } else if (sortField === "amount") {
      cmp = parseFloat(a.amount) - parseFloat(b.amount);
    } else if (sortField === "status") {
      cmp = a.status.localeCompare(b.status);
    } else if (sortField === "name") {
      cmp = `${a.customerLastName} ${a.customerFirstName}`.localeCompare(`${b.customerLastName} ${b.customerFirstName}`);
    }
    return sortDir === "desc" ? -cmp : cmp;
  });

  const totalPages = Math.max(1, Math.ceil(sorted.length / ORDERS_PER_PAGE));
  const paginated = sorted.slice((page - 1) * ORDERS_PER_PAGE, page * ORDERS_PER_PAGE);

  useEffect(() => { setPage(1); }, [search, statusFilter, productFilter, dateFrom, dateTo]);

  const toggleSort = (field: SortField) => {
    if (sortField === field) setSortDir(d => d === "asc" ? "desc" : "asc");
    else { setSortField(field); setSortDir("desc"); }
  };

  const toggleAllFiltered = () => {
    const filteredIds = paginated.map(o => o.id);
    const allSelected = filteredIds.every(id => selectedIds.has(id));
    if (allSelected) {
      setSelectedIds(prev => { const next = new Set(prev); filteredIds.forEach(id => next.delete(id)); return next; });
    } else {
      setSelectedIds(prev => { const next = new Set(prev); filteredIds.forEach(id => next.add(id)); return next; });
    }
  };

  const filteredRevenue = filtered.filter(o => o.status === "completed").reduce((sum, o) => sum + parseFloat(o.amount), 0);
  const todayStr = new Date().toISOString().slice(0, 10);
  const todayRevenue = orders.filter(o => o.status === "completed" && o.createdAt?.startsWith(todayStr)).reduce((sum, o) => sum + parseFloat(o.amount), 0);
  const weekAgo = new Date(); weekAgo.setDate(weekAgo.getDate() - 7);
  const weekRevenue = orders.filter(o => o.status === "completed" && o.createdAt && new Date(o.createdAt) >= weekAgo).reduce((sum, o) => sum + parseFloat(o.amount), 0);
  const monthStart = new Date(); monthStart.setDate(1); monthStart.setHours(0, 0, 0, 0);
  const monthRevenue = orders.filter(o => o.status === "completed" && o.createdAt && new Date(o.createdAt) >= monthStart).reduce((sum, o) => sum + parseFloat(o.amount), 0);

  const handleExport = () => {
    window.open(`/api/admin/shop/orders/export?token=${token}`, "_blank");
  };

  const SortButton = ({ field, label }: { field: SortField; label: string }) => (
    <button type="button" className="flex items-center gap-1 text-xs font-medium text-muted-foreground hover:text-foreground cursor-pointer" onClick={() => toggleSort(field)}>
      {label}
      {sortField === field && (sortDir === "desc" ? <ChevronDown className="w-3 h-3" /> : <ChevronUp className="w-3 h-3" />)}
    </button>
  );

  const DetailRow = ({ label, value }: { label: string; value: string | null | undefined }) => {
    if (!value) return null;
    return (
      <div className="flex justify-between py-1.5 border-b border-dashed border-gray-100 last:border-0">
        <span className="text-xs text-muted-foreground">{label}</span>
        <span className="text-sm font-medium text-right max-w-[60%] break-words">{value}</span>
      </div>
    );
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between flex-wrap gap-2">
          <div>
            <CardTitle>Ordini Shop</CardTitle>
            <CardDescription>{orders.length} ordini totali · {filtered.length} visualizzati</CardDescription>
          </div>
          <Button variant="outline" size="sm" onClick={handleExport} data-testid="button-export-excel">
            <FileDown className="w-4 h-4 mr-2" /> Esporta Excel
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <div className="p-3 bg-blue-50 rounded-lg text-center">
            <p className="text-xs text-muted-foreground">Oggi</p>
            <p className="text-lg font-bold text-blue-700">&euro;{todayRevenue.toLocaleString("it-IT", { minimumFractionDigits: 2 })}</p>
          </div>
          <div className="p-3 bg-indigo-50 rounded-lg text-center">
            <p className="text-xs text-muted-foreground">Ultimi 7 giorni</p>
            <p className="text-lg font-bold text-indigo-700">&euro;{weekRevenue.toLocaleString("it-IT", { minimumFractionDigits: 2 })}</p>
          </div>
          <div className="p-3 bg-emerald-50 rounded-lg text-center">
            <p className="text-xs text-muted-foreground">Questo mese</p>
            <p className="text-lg font-bold text-emerald-700">&euro;{monthRevenue.toLocaleString("it-IT", { minimumFractionDigits: 2 })}</p>
          </div>
          <div className="p-3 bg-amber-50 rounded-lg text-center">
            <p className="text-xs text-muted-foreground">Filtro attuale</p>
            <p className="text-lg font-bold text-amber-700">&euro;{filteredRevenue.toLocaleString("it-IT", { minimumFractionDigits: 2 })}</p>
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          <div className="flex-1 min-w-[200px]">
            <Input
              placeholder="Cerca per nome, email, ID ordine..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="h-9"
              data-testid="input-order-search"
            />
          </div>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[140px] h-9" data-testid="select-order-status-filter">
              <SelectValue placeholder="Tutti gli stati" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tutti gli stati</SelectItem>
              {ORDER_STATUSES.map(s => (
                <SelectItem key={s.value} value={s.value}>{s.label}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={productFilter} onValueChange={setProductFilter}>
            <SelectTrigger className="w-[180px] h-9" data-testid="select-order-product-filter">
              <SelectValue placeholder="Tutti i prodotti" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tutti i prodotti</SelectItem>
              {productNames.map(p => (
                <SelectItem key={p} value={p}>{p.length > 30 ? p.substring(0, 30) + "..." : p}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Input type="date" value={dateFrom} onChange={e => setDateFrom(e.target.value)} className="w-[140px] h-9" placeholder="Da" data-testid="input-date-from" />
          <Input type="date" value={dateTo} onChange={e => setDateTo(e.target.value)} className="w-[140px] h-9" placeholder="A" data-testid="input-date-to" />
          {(search || statusFilter !== "all" || productFilter !== "all" || dateFrom || dateTo) && (
            <Button variant="ghost" size="sm" className="h-9" onClick={() => { setSearch(""); setStatusFilter("all"); setProductFilter("all"); setDateFrom(""); setDateTo(""); }} data-testid="button-clear-filters">
              Pulisci filtri
            </Button>
          )}
        </div>

        {selectedIds.size > 0 && (
          <div className="flex items-center gap-3 p-3 bg-blue-50 border border-blue-200 rounded-lg flex-wrap" data-testid="bulk-actions-bar">
            <span className="text-sm font-medium text-blue-800">{selectedIds.size} selezionati</span>
            <span className="text-blue-300">|</span>
            <span className="text-xs text-blue-600">Cambia stato:</span>
            {ORDER_STATUSES.map(s => (
              <Button
                key={s.value}
                size="sm"
                variant="outline"
                className={`text-xs h-7 ${s.color} border-0`}
                onClick={() => {
                  if (confirm(`Impostare ${selectedIds.size} ordini come "${s.label}"?`)) {
                    bulkStatusMutation.mutate(s.value);
                  }
                }}
                disabled={bulkStatusMutation.isPending}
                data-testid={`button-bulk-${s.value}`}
              >
                {s.label}
              </Button>
            ))}
            <Button size="sm" variant="ghost" className="text-xs h-7 ml-auto" onClick={() => setSelectedIds(new Set())} data-testid="button-bulk-deselect">
              Deseleziona
            </Button>
          </div>
        )}

        {isLoading ? (
          <div className="text-center py-8 text-muted-foreground">Caricamento...</div>
        ) : sorted.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <ShoppingBag className="w-12 h-12 mx-auto mb-4 opacity-50" />
            <p>{orders.length === 0 ? "Nessun ordine ancora" : "Nessun ordine corrisponde ai filtri"}</p>
          </div>
        ) : (
          <div className="space-y-2">
            <div className="flex items-center gap-3 px-4 py-2 border-b text-xs">
              <input
                type="checkbox"
                checked={paginated.length > 0 && paginated.every(o => selectedIds.has(o.id))}
                onChange={toggleAllFiltered}
                className="w-4 h-4 rounded border-gray-300 accent-blue-600 cursor-pointer"
                data-testid="checkbox-select-all"
              />
              <div className="flex-1 grid grid-cols-2 md:grid-cols-4 gap-2 items-center">
                <SortButton field="date" label="Data / Cliente" />
                <SortButton field="name" label="Prodotto" />
                <SortButton field="amount" label="Importo" />
                <SortButton field="status" label="Stato" />
              </div>
              <div className="w-[130px]" />
            </div>

            {paginated.map((order) => {
              const isExpanded = expandedId === order.id;
              const isSelected = selectedIds.has(order.id);
              return (
                <div key={order.id} className={`border rounded-lg transition-all ${isExpanded ? "ring-1 ring-blue-200 border-blue-300" : isSelected ? "border-blue-200 bg-blue-50/30" : "hover:border-gray-300"}`} data-testid={`row-order-${order.id}`}>
                  <div className="flex items-center gap-3 px-4 py-3">
                    <input
                      type="checkbox"
                      checked={isSelected}
                      onChange={() => toggleSelect(order.id)}
                      className="w-4 h-4 rounded border-gray-300 accent-blue-600 cursor-pointer shrink-0"
                      data-testid={`checkbox-order-${order.id}`}
                    />
                    <button
                      type="button"
                      className="flex-1 text-left grid grid-cols-2 md:grid-cols-4 gap-2 items-center cursor-pointer"
                      onClick={() => setExpandedId(isExpanded ? null : order.id)}
                      data-testid={`button-expand-order-${order.id}`}
                    >
                      <div>
                        <p className="text-xs text-muted-foreground">
                          <span className="font-mono">#{order.id.slice(0, 8)}</span> &middot; {order.createdAt ? new Date(order.createdAt).toLocaleDateString("it-IT") : "-"}
                        </p>
                        <p className="font-medium text-sm">{order.customerFirstName} {order.customerLastName}</p>
                      </div>
                      <div>
                        <p className="text-sm truncate">{order.productName}</p>
                      </div>
                      <div className="text-right md:text-left">
                        <p className="font-semibold">&euro;{parseFloat(order.amount).toFixed(2)}</p>
                      </div>
                      <div className="flex items-center justify-end gap-2">
                        {order.adminNotes && <StickyNote className="w-3.5 h-3.5 text-amber-500" />}
                        {isExpanded ? <ChevronUp className="w-4 h-4 text-muted-foreground" /> : <ChevronDown className="w-4 h-4 text-muted-foreground" />}
                      </div>
                    </button>
                    <Select
                      value={order.status}
                      onValueChange={(newStatus) => statusMutation.mutate({ id: order.id, status: newStatus })}
                    >
                      <SelectTrigger className="w-[130px] h-8 text-xs shrink-0" data-testid={`select-quick-status-${order.id}`}>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {ORDER_STATUSES.map(s => (
                          <SelectItem key={s.value} value={s.value}>
                            <span className={`inline-block px-2 py-0.5 rounded text-xs font-medium ${s.color}`}>
                              {s.label}
                            </span>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {isExpanded && (
                    <div className="px-4 pb-4 border-t bg-slate-50/50">
                      <div className="flex items-center gap-2 pt-3 pb-2 text-xs text-muted-foreground">
                        <span>ID: {order.id}</span>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-2">
                        <div>
                          <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">Cliente</h4>
                          <DetailRow label="Nome" value={`${order.customerFirstName} ${order.customerLastName}`} />
                          <DetailRow label="Email" value={order.customerEmail} />
                          <DetailRow label="Telefono" value={order.customerPhone} />
                        </div>

                        <div>
                          <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">Studente</h4>
                          {order.studentFirstName ? (
                            <>
                              <DetailRow label="Nome" value={`${order.studentFirstName} ${order.studentLastName}`} />
                              <DetailRow label="Email" value={order.studentEmail} />
                            </>
                          ) : (
                            <p className="text-sm text-muted-foreground italic">Stesso del cliente</p>
                          )}
                        </div>

                        <div>
                          <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">Fatturazione</h4>
                          <DetailRow label="Paese" value={order.billingPaese} />
                          <DetailRow label="Indirizzo" value={order.billingIndirizzo} />
                          <DetailRow label="CAP" value={order.billingCap} />
                          <DetailRow label="Città" value={order.billingCitta} />
                          <DetailRow label="Provincia" value={order.billingProvincia} />
                          <DetailRow label="Codice Fiscale" value={order.billingCodiceFiscale} />
                          <DetailRow label="Partita IVA" value={order.billingPartitaIva} />
                          <DetailRow label="Codice SDI" value={order.billingCodiceSdi} />
                          <DetailRow label="PEC" value={order.billingPec} />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-4 pt-4 border-t">
                        <div>
                          <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">Ordine</h4>
                          <DetailRow label="Prodotto" value={order.productName} />
                          <DetailRow label="Importo" value={`€${parseFloat(order.amount).toFixed(2)}`} />
                          <DetailRow label="PayPal ID" value={order.paypalOrderId} />
                          {order.discountCode && (
                            <>
                              <DetailRow label="Codice Sconto" value={order.discountCode} />
                              <DetailRow label="Sconto" value={order.discountAmount ? `€${parseFloat(order.discountAmount).toFixed(2)}` : null} />
                            </>
                          )}
                        </div>

                        <div>
                          <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">Fattura</h4>
                          {order.invoiceNumber ? (
                            <>
                              <DetailRow label="N. Fattura" value={order.invoiceNumber} />
                              <DetailRow label="Data" value={order.invoiceDate ? new Date(order.invoiceDate).toLocaleDateString("it-IT") : "-"} />
                              <DetailRow label="Inviata" value={order.invoiceSent ? "Si" : "No"} />
                              <div className="flex gap-2 mt-2">
                                <Button
                                  size="sm"
                                  variant="outline"
                                  className="h-7 text-xs"
                                  onClick={async () => {
                                    try {
                                      const tkn = localStorage.getItem("admin_token");
                                      const r = await fetch(`/api/admin/orders/${order.id}/invoice`, {
                                        headers: { Authorization: `Bearer ${tkn}` },
                                      });
                                      if (!r.ok) throw new Error("Download failed");
                                      const blob = await r.blob();
                                      const url = URL.createObjectURL(blob);
                                      const a = document.createElement("a");
                                      a.href = url;
                                      a.download = `Fattura_${(order.invoiceNumber || "").replace("/", "_")}.pdf`;
                                      document.body.appendChild(a);
                                      a.click();
                                      document.body.removeChild(a);
                                      URL.revokeObjectURL(url);
                                    } catch {
                                      toast({ title: "Errore", description: "Errore durante il download.", variant: "destructive" });
                                    }
                                  }}
                                  data-testid={`button-download-invoice-${order.id}`}
                                >
                                  <FileDown className="w-3 h-3 mr-1" /> Scarica PDF
                                </Button>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  className="h-7 text-xs"
                                  onClick={async () => {
                                    try {
                                      const tkn = localStorage.getItem("admin_token");
                                      const r = await fetch(`/api/admin/orders/${order.id}/fatturapa`, {
                                        headers: { Authorization: `Bearer ${tkn}` },
                                      });
                                      if (!r.ok) throw new Error("Download failed");
                                      const blob = await r.blob();
                                      const disposition = r.headers.get("Content-Disposition") || "";
                                      const filenameMatch = disposition.match(/filename="?([^";\s]+)"?/);
                                      const downloadName = filenameMatch ? filenameMatch[1] : `IT03828240246_${Date.now()}.xml`;
                                      const url = URL.createObjectURL(blob);
                                      const a = document.createElement("a");
                                      a.href = url;
                                      a.download = downloadName;
                                      document.body.appendChild(a);
                                      a.click();
                                      document.body.removeChild(a);
                                      URL.revokeObjectURL(url);
                                    } catch {
                                      toast({ title: "Errore", description: "Errore durante il download XML.", variant: "destructive" });
                                    }
                                  }}
                                  data-testid={`button-download-fatturapa-${order.id}`}
                                >
                                  <FileDown className="w-3 h-3 mr-1" /> XML SDI
                                </Button>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  className="h-7 text-xs"
                                  onClick={async () => {
                                    try {
                                      const tkn = localStorage.getItem("admin_token");
                                      const r = await fetch(`/api/admin/orders/${order.id}/invoice/resend`, {
                                        method: "POST",
                                        headers: { Authorization: `Bearer ${tkn}` },
                                      });
                                      const d = await r.json();
                                      if (d.success) {
                                        toast({ title: "Fattura reinviata", description: `Inviata a ${order.customerEmail}` });
                                      } else {
                                        toast({ title: "Errore", description: d.message, variant: "destructive" });
                                      }
                                    } catch {
                                      toast({ title: "Errore", description: "Errore durante il reinvio.", variant: "destructive" });
                                    }
                                  }}
                                  data-testid={`button-resend-invoice-${order.id}`}
                                >
                                  <Mail className="w-3 h-3 mr-1" /> Reinvia
                                </Button>
                              </div>
                            </>
                          ) : (
                            <div>
                              <p className="text-sm text-muted-foreground italic mb-2">Nessuna fattura generata</p>
                              <Button
                                size="sm"
                                variant="outline"
                                className="h-7 text-xs"
                                onClick={async () => {
                                  try {
                                    const tkn = localStorage.getItem("admin_token");
                                    const r = await fetch(`/api/admin/orders/${order.id}/invoice/generate`, {
                                      method: "POST",
                                      headers: { Authorization: `Bearer ${tkn}` },
                                    });
                                    const d = await r.json();
                                    if (d.success) {
                                      toast({ title: "Fattura generata", description: `N. ${d.invoiceNumber}` });
                                      queryClient.invalidateQueries({ queryKey: ["/api/admin/orders"] });
                                    } else {
                                      toast({ title: "Errore", description: d.message, variant: "destructive" });
                                    }
                                  } catch {
                                    toast({ title: "Errore", description: "Errore durante la generazione.", variant: "destructive" });
                                  }
                                }}
                                data-testid={`button-generate-invoice-${order.id}`}
                              >
                                <FileText className="w-3 h-3 mr-1" /> Genera Fattura
                              </Button>
                            </div>
                          )}
                        </div>

                        {order.notes && (
                          <div>
                            <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">Note Cliente</h4>
                            <p className="text-sm bg-white border rounded-lg p-3">{order.notes}</p>
                          </div>
                        )}

                        <div>
                          <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">Note Admin</h4>
                          {editingNoteId === order.id ? (
                            <div className="space-y-2">
                              <textarea
                                className="w-full text-sm border rounded-lg p-3 min-h-[80px] resize-y"
                                value={noteText}
                                onChange={e => setNoteText(e.target.value)}
                                placeholder="Aggiungi note interne..."
                                data-testid={`textarea-admin-notes-${order.id}`}
                              />
                              <div className="flex gap-2">
                                <Button size="sm" className="h-7 text-xs" onClick={() => notesMutation.mutate({ id: order.id, adminNotes: noteText })} disabled={notesMutation.isPending} data-testid={`button-save-notes-${order.id}`}>
                                  Salva
                                </Button>
                                <Button size="sm" variant="ghost" className="h-7 text-xs" onClick={() => setEditingNoteId(null)}>
                                  Annulla
                                </Button>
                              </div>
                            </div>
                          ) : (
                            <div>
                              {order.adminNotes ? (
                                <p className="text-sm bg-amber-50 border border-amber-200 rounded-lg p-3 mb-2">{order.adminNotes}</p>
                              ) : (
                                <p className="text-sm text-muted-foreground italic mb-2">Nessuna nota</p>
                              )}
                              <Button size="sm" variant="outline" className="h-7 text-xs" onClick={() => { setEditingNoteId(order.id); setNoteText(order.adminNotes || ""); }} data-testid={`button-edit-notes-${order.id}`}>
                                <Pencil className="w-3 h-3 mr-1" /> {order.adminNotes ? "Modifica" : "Aggiungi nota"}
                              </Button>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}

            {totalPages > 1 && (
              <div className="flex items-center justify-between pt-4 border-t">
                <p className="text-xs text-muted-foreground">
                  Pagina {page} di {totalPages} · {sorted.length} ordini
                </p>
                <div className="flex gap-1">
                  <Button size="sm" variant="outline" className="h-8" disabled={page <= 1} onClick={() => setPage(p => p - 1)} data-testid="button-prev-page">
                    <ChevronLeft className="w-4 h-4" />
                  </Button>
                  {Array.from({ length: Math.min(totalPages, 7) }, (_, i) => {
                    let pageNum: number;
                    if (totalPages <= 7) pageNum = i + 1;
                    else if (page <= 4) pageNum = i + 1;
                    else if (page >= totalPages - 3) pageNum = totalPages - 6 + i;
                    else pageNum = page - 3 + i;
                    return (
                      <Button
                        key={pageNum}
                        size="sm"
                        variant={pageNum === page ? "default" : "outline"}
                        className="h-8 w-8 p-0"
                        onClick={() => setPage(pageNum)}
                        data-testid={`button-page-${pageNum}`}
                      >
                        {pageNum}
                      </Button>
                    );
                  })}
                  <Button size="sm" variant="outline" className="h-8" disabled={page >= totalPages} onClick={() => setPage(p => p + 1)} data-testid="button-next-page">
                    <ChevronRight className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

interface CourseMaterial {
  id: string;
  productSlug: string;
  fileName: string;
  fileUrl: string;
  fileSize: string | null;
  fileType: string | null;
  description: string | null;
  createdAt: string | null;
}

interface BeSession {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  company: string;
  phone: string | null;
  selfAssessedLevel: string;
  currentLevel: string;
  finalLevel: string | null;
  totalQuestions: number | null;
  correctAnswers: number | null;
  writingScore: string | null;
  speakingScore: string | null;
  overallScore: string | null;
  status: string | null;
  startedAt: string | null;
  completedAt: string | null;
  language: string;
  testType: string | null;
}

interface BeSessionDetail {
  session: BeSession;
  responses: Array<{
    id: number;
    questionId: number;
    userAnswer: string;
    isCorrect: boolean;
    timeSpent: number | null;
    thetaBefore: number | null;
    thetaAfter: number | null;
    question?: string;
    correctAnswer?: string;
    skillType?: string;
    level?: string;
  }>;
  sectionResults: Array<{
    sectionName: string;
    sectionIndex: number;
    questionsAttempted: number | null;
    questionsCorrect: number | null;
    accuracyPercentage: number | null;
    cefrLevel: string | null;
    finalTheta: number | null;
  }>;
  writingSpeaking: Array<{
    taskType: string;
    prompt: string;
    response: string;
    aiScore: string | null;
    aiGrammarScore: number | null;
    aiVocabularyScore: number | null;
    aiCoherenceScore: number | null;
    aiTaskCompletionScore: number | null;
    aiFeedback: string | null;
  }>;
}

const LANGUAGE_LABELS: Record<string, string> = {
  english: "Inglese",
  italian: "Italiano",
  german: "Tedesco",
  french: "Francese",
  spanish: "Spagnolo",
};

function MiniFlag({ lang }: { lang: string }) {
  const cls = "w-5 h-3.5 rounded-sm inline-block shrink-0";
  switch (lang) {
    case "english":
      return <svg viewBox="0 0 60 40" className={cls}><rect width="60" height="40" fill="#012169"/><path d="M0,0 L60,40 M60,0 L0,40" stroke="#fff" strokeWidth="6.5"/><path d="M0,0 L60,40 M60,0 L0,40" stroke="#C8102E" strokeWidth="4"/><path d="M30,0 V40 M0,20 H60" stroke="#fff" strokeWidth="10"/><path d="M30,0 V40 M0,20 H60" stroke="#C8102E" strokeWidth="6"/></svg>;
    case "italian":
      return <svg viewBox="0 0 60 40" className={cls}><rect width="20" height="40" fill="#009246"/><rect x="20" width="20" height="40" fill="#fff"/><rect x="40" width="20" height="40" fill="#CE2B37"/></svg>;
    case "german":
      return <svg viewBox="0 0 60 40" className={cls}><rect width="60" height="13.33" fill="#000"/><rect y="13.33" width="60" height="13.33" fill="#DD0000"/><rect y="26.67" width="60" height="13.33" fill="#FFCC00"/></svg>;
    case "french":
      return <svg viewBox="0 0 60 40" className={cls}><rect width="20" height="40" fill="#002395"/><rect x="20" width="20" height="40" fill="#fff"/><rect x="40" width="20" height="40" fill="#ED2939"/></svg>;
    case "spanish":
      return <svg viewBox="0 0 60 40" className={cls}><rect width="60" height="10" fill="#AA151B"/><rect y="10" width="60" height="20" fill="#F1BF00"/><rect y="30" width="60" height="10" fill="#AA151B"/></svg>;
    default:
      return null;
  }
}

function EnglishAdaptiveTab({ token }: { token: string }) {
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [filterCompany, setFilterCompany] = useState("");
  const [filterLevel, setFilterLevel] = useState("");
  const [filterLanguage, setFilterLanguage] = useState("");

  const { data: sessions = [], isLoading } = useQuery<BeSession[]>({
    queryKey: ["/api/admin/all-test-results"],
    queryFn: async () => {
      const res = await fetch("/api/admin/all-test-results", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Failed to fetch test results");
      const data = await res.json();
      return Array.isArray(data) ? data : [];
    },
  });

  const { data: detail } = useQuery<BeSessionDetail>({
    queryKey: ["/api/admin/all-test-results", selectedId],
    queryFn: async () => {
      const res = await fetch(`/api/admin/all-test-results/${selectedId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return res.json();
    },
    enabled: !!selectedId,
  });

  const filtered = sessions.filter(s => {
    if (filterCompany && !s.company?.toLowerCase().includes(filterCompany.toLowerCase())) return false;
    if (filterLevel && filterLevel !== "all" && s.finalLevel !== filterLevel) return false;
    if (filterLanguage && filterLanguage !== "all" && s.language !== filterLanguage) return false;
    return true;
  });

  const levelBadge = (level: string | null) => {
    if (!level) return null;
    const colors: Record<string, string> = {
      A0: "bg-gray-500", A1: "bg-red-500", A2: "bg-orange-500",
      B1: "bg-yellow-500 text-black", B2: "bg-blue-500", C1: "bg-green-600",
    };
    return <span className={`px-2 py-0.5 rounded text-white text-xs font-bold ${colors[level] || "bg-gray-500"}`}>{level}</span>;
  };

  if (selectedId && detail) {
    return (
      <div className="space-y-4">
        <Button variant="outline" onClick={() => setSelectedId(null)} data-testid="button-back-to-list">
          Torna alla lista
        </Button>

        <Card>
          <CardHeader>
            <CardTitle>{detail.session.firstName} {detail.session.lastName}</CardTitle>
            <CardDescription>{detail.session.email}{detail.session.company ? ` - ${detail.session.company}` : ""} — <span className="inline-flex items-center gap-1"><MiniFlag lang={detail.session.language} /> Test {LANGUAGE_LABELS[detail.session.language] || detail.session.language}</span></CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-3 gap-4 text-center">
              <div className="p-3 bg-muted rounded-lg">
                <div className="text-sm text-muted-foreground">Livello Finale</div>
                <div className="text-2xl font-bold mt-1">{levelBadge(detail.session.finalLevel)}</div>
              </div>
              <div className="p-3 bg-muted rounded-lg">
                <div className="text-sm text-muted-foreground">Punteggio MC</div>
                <div className="text-lg font-bold mt-1">{detail.session.correctAnswers}/{detail.session.totalQuestions}</div>
              </div>
              <div className="p-3 bg-muted rounded-lg">
                <div className="text-sm text-muted-foreground">Stato</div>
                <div className="mt-1"><Badge variant={detail.session.status === "completed" ? "default" : "secondary"}>{detail.session.status}</Badge></div>
              </div>
            </div>

            {detail.sectionResults.length > 0 && (
              <div>
                <h4 className="font-semibold mb-2">Risultati per Sezione</h4>
                <table className="w-full text-sm">
                  <thead><tr className="border-b"><th className="text-left py-2">Sezione</th><th className="text-center">Livello</th><th className="text-center">Precisione</th><th className="text-center">Theta</th></tr></thead>
                  <tbody>
                    {detail.sectionResults.map((s, i) => (
                      <tr key={i} className="border-b">
                        <td className="py-2 capitalize">{s.sectionName.replace(/_/g, " ")}</td>
                        <td className="text-center">{levelBadge(s.cefrLevel)}</td>
                        <td className="text-center">{s.accuracyPercentage ?? "-"}%</td>
                        <td className="text-center">{s.finalTheta ?? "-"}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {detail.writingSpeaking.length > 0 && (
              <div>
                <h4 className="font-semibold mb-2">Scrittura / Parlato</h4>
                {detail.writingSpeaking.map((ws, i) => (
                  <div key={i} className="p-4 bg-muted rounded-lg mb-3">
                    <div className="flex justify-between items-center mb-2">
                      <Badge>{ws.taskType}</Badge>
                      {levelBadge(ws.aiScore)}
                    </div>
                    <p className="text-sm text-muted-foreground mb-1"><strong>Prompt:</strong> {ws.prompt}</p>
                    <p className="text-sm mb-2"><strong>Response:</strong> {ws.response.substring(0, 200)}{ws.response.length > 200 ? "..." : ""}</p>
                    {ws.aiGrammarScore !== null && (
                      <div className="grid grid-cols-4 gap-2 text-xs mb-2">
                        <div>Grammar: {ws.aiGrammarScore}</div>
                        <div>Vocabulary: {ws.aiVocabularyScore}</div>
                        <div>Coherence: {ws.aiCoherenceScore}</div>
                        <div>Task: {ws.aiTaskCompletionScore}</div>
                      </div>
                    )}
                    {ws.aiFeedback && <p className="text-sm italic text-muted-foreground">{ws.aiFeedback}</p>}
                  </div>
                ))}
              </div>
            )}

            {detail.responses.length > 0 && (
              <div>
                <h4 className="font-semibold mb-2">Traccia IRT ({detail.responses.length} risposte)</h4>
                <div className="max-h-80 overflow-y-auto">
                  <table className="w-full text-xs">
                    <thead><tr className="border-b bg-muted"><th className="text-left py-1 px-2">#</th><th className="text-left px-2">Abilità</th><th className="text-left px-2">Domanda</th><th className="text-center px-2">Corretto</th><th className="text-center px-2">Theta</th><th className="text-center px-2">Tempo</th></tr></thead>
                    <tbody>
                      {detail.responses.map((r, i) => (
                        <tr key={i} className="border-b">
                          <td className="py-1 px-2">{i + 1}</td>
                          <td className="px-2 capitalize">{r.skillType?.replace(/_/g, " ") ?? ""}</td>
                          <td className="px-2 max-w-[200px] truncate">{r.question?.substring(0, 60)}</td>
                          <td className="text-center px-2">{r.isCorrect ? "Y" : "N"}</td>
                          <td className="text-center px-2">{r.thetaBefore} → {r.thetaAfter}</td>
                          <td className="text-center px-2">{r.timeSpent ? `${r.timeSpent}s` : "-"}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-3">
        <Input
          placeholder="Filtra per azienda..."
          value={filterCompany}
          onChange={e => setFilterCompany(e.target.value)}
          className="max-w-xs"
          data-testid="input-filter-company"
        />
        <Select value={filterLanguage} onValueChange={setFilterLanguage}>
          <SelectTrigger className="w-[160px]" data-testid="select-filter-language">
            <SelectValue placeholder="Tutte le lingue" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tutte le lingue</SelectItem>
            <SelectItem value="english">Inglese</SelectItem>
            <SelectItem value="italian">Italiano</SelectItem>
            <SelectItem value="german">Tedesco</SelectItem>
            <SelectItem value="french">Francese</SelectItem>
            <SelectItem value="spanish">Spagnolo</SelectItem>
          </SelectContent>
        </Select>
        <Select value={filterLevel} onValueChange={setFilterLevel}>
          <SelectTrigger className="w-[140px]" data-testid="select-filter-level">
            <SelectValue placeholder="Tutti i livelli" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tutti i livelli</SelectItem>
            <SelectItem value="A0">A0</SelectItem>
            <SelectItem value="A1">A1</SelectItem>
            <SelectItem value="A2">A2</SelectItem>
            <SelectItem value="B1">B1</SelectItem>
            <SelectItem value="B2">B2</SelectItem>
            <SelectItem value="C1">C1</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {isLoading ? (
        <div className="space-y-3">{[1, 2, 3].map(i => <div key={i} className="h-16 bg-muted rounded animate-pulse" />)}</div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-12 text-muted-foreground">
          <Briefcase className="w-12 h-12 mx-auto mb-4 opacity-50" />
          <p>Nessun risultato test ancora.</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm" data-testid="table-results">
            <thead>
              <tr className="border-b">
                <th className="text-left py-3 px-2">Candidato</th>
                <th className="text-left px-2">Lingua</th>
                <th className="text-left px-2">Azienda</th>
                <th className="text-center px-2">Livello</th>
                <th className="text-center px-2">MC</th>
                <th className="text-center px-2">Scrittura</th>
                <th className="text-center px-2">Parlato</th>
                <th className="text-center px-2">Stato</th>
                <th className="text-center px-2">Data</th>
                <th className="text-right px-2"></th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(s => (
                <tr key={s.id} className="border-b hover:bg-muted/50" data-testid={`row-result-${s.id}`}>
                  <td className="py-2 px-2">
                    <div className="font-medium">{s.firstName} {s.lastName}</div>
                    <div className="text-xs text-muted-foreground">{s.email}</div>
                  </td>
                  <td className="px-2 text-sm"><span className="flex items-center gap-1.5"><MiniFlag lang={s.language} />{LANGUAGE_LABELS[s.language] || s.language}</span></td>
                  <td className="px-2">{s.company}</td>
                  <td className="text-center px-2">{levelBadge(s.finalLevel)}</td>
                  <td className="text-center px-2">{s.correctAnswers}/{s.totalQuestions}</td>
                  <td className="text-center px-2">{s.writingScore ? levelBadge(s.writingScore) : "-"}</td>
                  <td className="text-center px-2">{s.speakingScore ? levelBadge(s.speakingScore) : "-"}</td>
                  <td className="text-center px-2"><Badge variant={s.status === "completed" ? "default" : "secondary"}>{s.status}</Badge></td>
                  <td className="text-center px-2 text-xs">{s.completedAt ? new Date(s.completedAt).toLocaleDateString("it-IT") : s.startedAt ? new Date(s.startedAt).toLocaleDateString("it-IT") : "-"}</td>
                  <td className="text-right px-2">
                    <Button variant="ghost" size="sm" onClick={() => setSelectedId(s.id)} data-testid={`button-view-${s.id}`}>
                      <Eye className="w-4 h-4" />
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

function CourseMaterialsTab({ token }: { token: string }) {
  const [showForm, setShowForm] = useState(false);
  const [newSlug, setNewSlug] = useState("");
  const [newFileName, setNewFileName] = useState("");
  const [newFileUrl, setNewFileUrl] = useState("");
  const [newFileSize, setNewFileSize] = useState("");
  const [newDescription, setNewDescription] = useState("");

  const { data: materials = [], isLoading } = useQuery<CourseMaterial[]>({
    queryKey: ["/api/admin/shop/materials"],
    queryFn: async () => {
      const res = await fetch("/api/admin/shop/materials", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Failed");
      return res.json();
    },
  });

  const addMutation = useMutation({
    mutationFn: async (data: Record<string, string | null>) => {
      const res = await fetch("/api/admin/shop/materials", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify(data),
      });
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/shop/materials"] });
      setShowForm(false);
      setNewSlug("");
      setNewFileName("");
      setNewFileUrl("");
      setNewFileSize("");
      setNewDescription("");
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      await fetch(`/api/admin/shop/materials/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/shop/materials"] });
    },
  });

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSlug || !newFileName || !newFileUrl) return;
    addMutation.mutate({
      productSlug: newSlug,
      fileName: newFileName,
      fileUrl: newFileUrl,
      fileSize: newFileSize || null,
      fileType: null,
      description: newDescription || null,
    });
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Materiali Didattici</CardTitle>
          <CardDescription>File scaricabili per i corsi acquistati</CardDescription>
        </div>
        <Button onClick={() => setShowForm(!showForm)} size="sm">
          {showForm ? "Chiudi" : <><Plus className="w-4 h-4 mr-2" /> Aggiungi</>}
        </Button>
      </CardHeader>
      <CardContent className="space-y-6">
        {showForm && (
          <form onSubmit={handleAdd} className="p-4 border rounded-lg bg-muted/30 space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Product Slug (es. camclass-selflearning)</Label>
                <Input value={newSlug} onChange={e => setNewSlug(e.target.value)} required />
              </div>
              <div className="space-y-2">
                <Label>File Name</Label>
                <Input value={newFileName} onChange={e => setNewFileName(e.target.value)} required />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>File URL</Label>
                <Input value={newFileUrl} onChange={e => setNewFileUrl(e.target.value)} required />
              </div>
              <div className="space-y-2">
                <Label>File Size (es. 2.4 MB)</Label>
                <Input value={newFileSize} onChange={e => setNewFileSize(e.target.value)} />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Description</Label>
              <Input value={newDescription} onChange={e => setNewDescription(e.target.value)} />
            </div>
            <Button type="submit" disabled={addMutation.isPending} className="w-full">
              {addMutation.isPending ? "Salvataggio..." : "Salva Materiale"}
            </Button>
          </form>
        )}

        {isLoading ? (
          <div className="text-center py-8 text-muted-foreground">Caricamento...</div>
        ) : materials.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">Nessun materiale ancora</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 px-2 font-medium">Slug</th>
                  <th className="text-left py-3 px-2 font-medium">Nome File</th>
                  <th className="text-left py-3 px-2 font-medium">Size</th>
                  <th className="text-right py-3 px-2 font-medium">Azioni</th>
                </tr>
              </thead>
              <tbody>
                {materials.map((m) => (
                  <tr key={m.id} className="border-b last:border-0" data-testid={`row-material-${m.id}`}>
                    <td className="py-3 px-2 font-mono text-xs">{m.productSlug}</td>
                    <td className="py-3 px-2 font-medium">{m.fileName}</td>
                    <td className="py-3 px-2 text-muted-foreground">{m.fileSize || "-"}</td>
                    <td className="py-3 px-2 text-right">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          if (confirm("Eliminare questo materiale?")) {
                            deleteMutation.mutate(m.id);
                          }
                        }}
                        disabled={deleteMutation.isPending}
                        className="text-destructive hover:text-destructive hover:bg-destructive/10"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
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

function ContactsTab({ token }: { token: string }) {
  const { data: contacts = [], isLoading } = useQuery<any[]>({
    queryKey: ["/api/admin/contacts"],
    queryFn: async () => {
      const res = await fetch("/api/admin/contacts", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Failed to fetch contacts");
      const data = await res.json();
      return Array.isArray(data) ? data : [];
    },
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle>Richieste di Contatto</CardTitle>
        <CardDescription>Messaggi ricevuti dal modulo di contatto</CardDescription>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="text-center py-8">Caricamento...</div>
        ) : contacts.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">Nessun messaggio ricevuto</div>
        ) : (
          <div className="space-y-4">
            {contacts.map((c) => (
              <div key={c.id} className="p-4 border rounded-lg bg-muted/30" data-testid={`contact-card-${c.id}`}>
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h3 className="font-bold">{c.name}</h3>
                    <p className="text-sm text-muted-foreground">{c.email} | {c.phone || "No phone"}</p>
                  </div>
                  <Badge variant="outline">{c.courseInterest || "Generale"}</Badge>
                </div>
                <p className="text-sm mt-3 border-t pt-3">{c.message}</p>
                <p className="text-[10px] text-muted-foreground mt-2">Ricevuto: {new Date(c.createdAt).toLocaleString("it-IT")}</p>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

function NewsletterTab({ token }: { token: string }) {
  const { data: subs = [], isLoading } = useQuery<any[]>({
    queryKey: ["/api/admin/newsletter"],
    queryFn: async () => {
      const res = await fetch("/api/admin/newsletter", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Failed to fetch newsletter");
      const data = await res.json();
      return Array.isArray(data) ? data : [];
    },
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle>Iscritti Newsletter</CardTitle>
        <CardDescription>Utenti che desiderano ricevere aggiornamenti</CardDescription>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="text-center py-8">Caricamento...</div>
        ) : subs.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">Nessun iscritto</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 px-2 font-medium">Email</th>
                  <th className="text-right py-3 px-2 font-medium">Data Iscrizione</th>
                </tr>
              </thead>
              <tbody>
                {subs.map((s) => (
                  <tr key={s.id} className="border-b last:border-0" data-testid={`newsletter-row-${s.id}`}>
                    <td className="py-3 px-2">{s.email}</td>
                    <td className="py-3 px-2 text-right text-muted-foreground text-xs">
                      {new Date(s.createdAt).toLocaleDateString("it-IT")}
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

function BlogTab({ token }: { token: string }) {
  const { data: posts = [], isLoading } = useQuery<any[]>({
    queryKey: ["/api/admin/blog"],
    queryFn: async () => {
      const res = await fetch("/api/admin/blog", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Failed to fetch blog");
      const data = await res.json();
      return Array.isArray(data) ? data : [];
    },
  });

  const generateMutation = useMutation({
    mutationFn: async () => {
      const res = await fetch("/api/admin/blog/generate", {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
      });
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/blog"] });
    },
  });

  const seedCommentsMutation = useMutation({
    mutationFn: async () => {
      const res = await fetch("/api/admin/blog/seed-comments", {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
      });
      return res.json();
    },
  });

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between flex-wrap gap-2">
        <div>
          <CardTitle>Gestione Blog</CardTitle>
          <CardDescription>Articoli generati dall'AI</CardDescription>
        </div>
        <div className="flex gap-2">
          <Button 
            onClick={() => seedCommentsMutation.mutate()} 
            disabled={seedCommentsMutation.isPending}
            size="sm"
            variant="outline"
            data-testid="button-seed-comments"
          >
            {seedCommentsMutation.isPending ? "Generando commenti..." : "Genera Commenti Seed"}
          </Button>
          <Button 
            onClick={() => generateMutation.mutate()} 
            disabled={generateMutation.isPending}
            size="sm"
          >
            {generateMutation.isPending ? "Generando..." : "Genera Nuovo Post"}
          </Button>
        </div>
      </CardHeader>
      {seedCommentsMutation.isSuccess && (
        <div className="px-6 pb-2">
          <p className="text-sm text-green-600">{(seedCommentsMutation.data as any)?.message || "Commenti generati!"}</p>
        </div>
      )}
      <CardContent>
        {isLoading ? (
          <div className="text-center py-8">Caricamento...</div>
        ) : posts.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">Nessun post generato</div>
        ) : (
          <div className="space-y-4">
            {posts.map((p) => (
              <div key={p.id} className="p-4 border rounded-lg bg-muted/30 flex justify-between items-center" data-testid={`blog-post-${p.id}`}>
                <div>
                  <h3 className="font-bold">{p.title}</h3>
                  <p className="text-xs text-muted-foreground">Slug: {p.slug}</p>
                </div>
                <Badge variant={p.published ? "default" : "secondary"}>
                  {p.published ? "Pubblicato" : "Bozza"}
                </Badge>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

function UsersTab({ token, currentUserId }: { token: string; currentUserId: string }) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<any>(null);
  const [formData, setFormData] = useState({
    username: "",
    password: "",
    name: "",
    email: "",
    role: "staff",
  });
  const { toast } = useToast();

  const { data: users = [], isLoading } = useQuery<any[]>({
    queryKey: ["/api/admin/users"],
    queryFn: async () => {
      const res = await fetch("/api/admin/users", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Failed to fetch users");
      const data = await res.json();
      return Array.isArray(data) ? data : [];
    },
  });

  const mutation = useMutation({
    mutationFn: async (data: any) => {
      const method = editingUser ? "PATCH" : "POST";
      const url = editingUser ? `/api/admin/users/${editingUser.id}` : "/api/admin/users";
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify(data),
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.message || "Errore durante il salvataggio");
      }
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/users"] });
      setIsDialogOpen(false);
      setEditingUser(null);
      setFormData({ username: "", password: "", name: "", email: "", role: "staff" });
      toast({ title: "Successo", description: "Utente salvato correttamente" });
    },
    onError: (error: any) => {
      toast({ title: "Errore", description: error.message, variant: "destructive" });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const res = await fetch(`/api/admin/users/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Errore durante l'eliminazione");
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/users"] });
      toast({ title: "Successo", description: "Utente eliminato correttamente" });
    },
  });

  const handleEdit = (user: any) => {
    setEditingUser(user);
    setFormData({
      username: user.username,
      password: "",
      name: user.name,
      email: user.email || "",
      role: user.role,
    });
    setIsDialogOpen(true);
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Gestione Utenti</CardTitle>
          <CardDescription>Amministratori e staff del pannello</CardDescription>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={(open) => {
          setIsDialogOpen(open);
          if (!open) {
            setEditingUser(null);
            setFormData({ username: "", password: "", name: "", email: "", role: "staff" });
          }
        }}>
          <DialogTrigger asChild>
            <Button size="sm"><UserPlus className="w-4 h-4 mr-2" /> Nuovo Utente</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{editingUser ? "Modifica Utente" : "Crea Nuovo Utente"}</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label>Nome Completo</Label>
                <Input 
                  value={formData.name} 
                  onChange={e => setFormData({ ...formData, name: e.target.value })} 
                  placeholder="es. Mario Rossi"
                  data-testid="input-user-name"
                />
              </div>
              <div className="space-y-2">
                <Label>Username</Label>
                <Input 
                  value={formData.username} 
                  onChange={e => setFormData({ ...formData, username: e.target.value })} 
                  disabled={!!editingUser}
                  placeholder="username"
                  data-testid="input-user-username"
                />
              </div>
              <div className="space-y-2">
                <Label>Email</Label>
                <Input 
                  value={formData.email} 
                  onChange={e => setFormData({ ...formData, email: e.target.value })} 
                  type="email"
                  placeholder="email@esempio.it"
                  data-testid="input-user-email"
                />
              </div>
              <div className="space-y-2">
                <Label>{editingUser ? "Nuova Password (lascia vuoto per non cambiare)" : "Password"}</Label>
                <Input 
                  value={formData.password} 
                  onChange={e => setFormData({ ...formData, password: e.target.value })} 
                  type="password"
                  data-testid="input-user-password"
                />
              </div>
              <div className="space-y-2">
                <Label>Ruolo</Label>
                <Select value={formData.role} onValueChange={val => setFormData({ ...formData, role: val })}>
                  <SelectTrigger data-testid="select-user-role">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="staff">Staff</SelectItem>
                    <SelectItem value="admin">Admin</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Button 
                className="w-full mt-4" 
                onClick={() => mutation.mutate(formData)}
                disabled={mutation.isPending}
                data-testid="button-save-user"
              >
                {mutation.isPending ? "Salvataggio..." : "Salva"}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="text-center py-8">Caricamento...</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 px-2">Nome</th>
                  <th className="text-left py-3 px-2">Username</th>
                  <th className="text-left py-3 px-2">Ruolo</th>
                  <th className="text-left py-3 px-2">Stato</th>
                  <th className="text-right py-3 px-2">Azioni</th>
                </tr>
              </thead>
              <tbody>
                {users.map((u) => (
                  <tr key={u.id} className="border-b last:border-0" data-testid={`user-row-${u.id}`}>
                    <td className="py-3 px-2 font-medium">{u.name}</td>
                    <td className="py-3 px-2 text-muted-foreground">{u.username}</td>
                    <td className="py-3 px-2">
                      <Badge variant={u.role === "admin" ? "default" : "outline"}>
                        {u.role === "admin" ? "Admin" : "Staff"}
                      </Badge>
                    </td>
                    <td className="py-3 px-2">
                      <Badge variant={u.active ? "success" : "secondary"}>
                        {u.active ? "Attivo" : "Inattivo"}
                      </Badge>
                    </td>
                    <td className="py-3 px-2 text-right space-x-2">
                      <Button variant="ghost" size="sm" onClick={() => handleEdit(u)} data-testid={`button-edit-user-${u.id}`}>
                        <Pencil className="w-4 h-4" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={() => {
                          if (confirm("Sei sicuro di voler eliminare questo utente?")) {
                            deleteMutation.mutate(u.id);
                          }
                        }}
                        disabled={deleteMutation.isPending || u.id === currentUserId}
                        className="text-destructive hover:text-destructive hover:bg-destructive/10"
                        data-testid={`button-delete-user-${u.id}`}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
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

interface DiscountVoucher {
  id: string;
  code: string;
  description: string | null;
  discountType: string;
  discountValue: string;
  minOrderAmount: string | null;
  maxUses: number | null;
  usedCount: number;
  validFrom: string | null;
  validUntil: string | null;
  productSlugs: string | null;
  active: boolean | null;
  createdAt: string | null;
}

function VouchersTab({ token }: { token: string }) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingVoucher, setEditingVoucher] = useState<DiscountVoucher | null>(null);
  const [formData, setFormData] = useState({
    code: "",
    description: "",
    discountType: "percentage",
    discountValue: "",
    minOrderAmount: "",
    maxUses: "",
    validFrom: "",
    validUntil: "",
    productSlugs: "",
    firstTimeBuyerOnly: false,
    autoApply: false,
    requiresNewsletterSub: false,
    active: true,
  });
  const { toast } = useToast();

  const { data: vouchers = [], isLoading } = useQuery<DiscountVoucher[]>({
    queryKey: ["/api/admin/vouchers"],
    queryFn: async () => {
      const res = await fetch("/api/admin/vouchers", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Failed to fetch vouchers");
      return res.json();
    },
  });

  const saveMutation = useMutation({
    mutationFn: async (data: Record<string, unknown>) => {
      const method = editingVoucher ? "PATCH" : "POST";
      const url = editingVoucher
        ? `/api/admin/vouchers/${editingVoucher.id}`
        : "/api/admin/vouchers";
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify(data),
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.message || "Errore durante il salvataggio");
      }
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/vouchers"] });
      closeDialog();
      toast({ title: "Successo", description: editingVoucher ? "Voucher aggiornato" : "Voucher creato" });
    },
    onError: (error: any) => {
      toast({ title: "Errore", description: error.message, variant: "destructive" });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const res = await fetch(`/api/admin/vouchers/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Errore durante l'eliminazione");
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/vouchers"] });
      toast({ title: "Successo", description: "Voucher eliminato" });
    },
  });

  const toggleMutation = useMutation({
    mutationFn: async ({ id, active }: { id: string; active: boolean }) => {
      const res = await fetch(`/api/admin/vouchers/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ active }),
      });
      if (!res.ok) throw new Error("Errore");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/vouchers"] });
    },
  });

  const closeDialog = () => {
    setIsDialogOpen(false);
    setEditingVoucher(null);
    setFormData({
      code: "",
      description: "",
      discountType: "percentage",
      discountValue: "",
      minOrderAmount: "",
      maxUses: "",
      validFrom: "",
      validUntil: "",
      productSlugs: "",
      firstTimeBuyerOnly: false,
      autoApply: false,
      requiresNewsletterSub: false,
      active: true,
    });
  };

  const handleEdit = (v: DiscountVoucher) => {
    setEditingVoucher(v);
    setFormData({
      code: v.code,
      description: v.description || "",
      discountType: v.discountType,
      discountValue: v.discountValue,
      minOrderAmount: v.minOrderAmount || "",
      maxUses: v.maxUses !== null ? String(v.maxUses) : "",
      validFrom: v.validFrom ? v.validFrom.slice(0, 16) : "",
      validUntil: v.validUntil ? v.validUntil.slice(0, 16) : "",
      productSlugs: v.productSlugs || "",
      firstTimeBuyerOnly: v.firstTimeBuyerOnly || false,
      autoApply: v.autoApply || false,
      requiresNewsletterSub: v.requiresNewsletterSub || false,
      active: v.active !== false,
    });
    setIsDialogOpen(true);
  };

  const handleSubmit = () => {
    if (!formData.code || !formData.discountValue) {
      toast({ title: "Errore", description: "Codice e valore sconto sono obbligatori", variant: "destructive" });
      return;
    }
    const payload: Record<string, unknown> = {
      code: formData.code.toUpperCase().trim(),
      description: formData.description || null,
      discountType: formData.discountType,
      discountValue: formData.discountValue,
      minOrderAmount: formData.minOrderAmount || null,
      maxUses: formData.maxUses ? parseInt(formData.maxUses, 10) : null,
      validFrom: formData.validFrom || null,
      validUntil: formData.validUntil || null,
      productSlugs: formData.productSlugs || null,
      firstTimeBuyerOnly: formData.firstTimeBuyerOnly,
      autoApply: formData.autoApply,
      requiresNewsletterSub: formData.requiresNewsletterSub,
      active: formData.active,
    };
    saveMutation.mutate(payload);
  };

  const isExpired = (v: DiscountVoucher) => {
    if (!v.validUntil) return false;
    return new Date(v.validUntil) < new Date();
  };

  const isExhausted = (v: DiscountVoucher) => {
    if (v.maxUses === null) return false;
    return v.usedCount >= v.maxUses;
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between gap-2">
        <div>
          <CardTitle>Voucher Sconto</CardTitle>
          <CardDescription>Gestione codici sconto per lo shop</CardDescription>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={(open) => {
          if (!open) closeDialog();
          else setIsDialogOpen(true);
        }}>
          <DialogTrigger asChild>
            <Button size="sm" data-testid="button-new-voucher">
              <Plus className="w-4 h-4 mr-2" /> Nuovo Voucher
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{editingVoucher ? "Modifica Voucher" : "Crea Nuovo Voucher"}</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Codice</Label>
                  <div className="flex gap-2">
                    <Input
                      value={formData.code}
                      onChange={e => setFormData({ ...formData, code: e.target.value.toUpperCase() })}
                      placeholder="es. SCONTO10"
                      data-testid="input-voucher-code"
                    />
                    <Button
                      type="button"
                      variant="outline"
                      size="icon"
                      title="Genera codice casuale"
                      onClick={() => {
                        const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
                        let code = "";
                        for (let i = 0; i < 8; i++) code += chars[Math.floor(Math.random() * chars.length)];
                        setFormData({ ...formData, code });
                      }}
                      data-testid="button-generate-voucher-code"
                    >
                      <Wand2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Tipo Sconto</Label>
                  <Select value={formData.discountType} onValueChange={val => setFormData({ ...formData, discountType: val })}>
                    <SelectTrigger data-testid="select-voucher-type">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="percentage">Percentuale (%)</SelectItem>
                      <SelectItem value="fixed">Fisso (&euro;)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Valore Sconto</Label>
                  <Input
                    value={formData.discountValue}
                    onChange={e => setFormData({ ...formData, discountValue: e.target.value })}
                    placeholder={formData.discountType === "percentage" ? "es. 10" : "es. 25.00"}
                    data-testid="input-voucher-value"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Importo Minimo Ordine</Label>
                  <Input
                    value={formData.minOrderAmount}
                    onChange={e => setFormData({ ...formData, minOrderAmount: e.target.value })}
                    placeholder="es. 50.00 (opzionale)"
                    data-testid="input-voucher-min-amount"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Descrizione (nota interna)</Label>
                <Input
                  value={formData.description}
                  onChange={e => setFormData({ ...formData, description: e.target.value })}
                  placeholder="es. Promozione estate 2025"
                  data-testid="input-voucher-description"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Max Utilizzi</Label>
                  <Input
                    type="number"
                    value={formData.maxUses}
                    onChange={e => setFormData({ ...formData, maxUses: e.target.value })}
                    placeholder="Illimitati"
                    data-testid="input-voucher-max-uses"
                  />
                </div>
                <div className="space-y-2 flex items-end gap-2 pb-1">
                  <div className="flex flex-col gap-2">
                    <div className="flex items-center gap-2">
                      <Switch
                        checked={formData.active}
                        onCheckedChange={val => setFormData({ ...formData, active: val })}
                        data-testid="switch-voucher-active"
                      />
                      <Label className="mb-0">Attivo</Label>
                    </div>
                    <div className="flex items-center gap-2">
                      <Switch
                        checked={formData.firstTimeBuyerOnly}
                        onCheckedChange={val => setFormData({ ...formData, firstTimeBuyerOnly: val })}
                        data-testid="switch-voucher-first-time"
                      />
                      <Label className="mb-0">Solo primo acquisto</Label>
                    </div>
                    <div className="flex items-center gap-2">
                      <Switch
                        checked={formData.autoApply}
                        onCheckedChange={val => setFormData({ ...formData, autoApply: val })}
                        data-testid="switch-voucher-auto-apply"
                      />
                      <Label className="mb-0">Applica automaticamente</Label>
                    </div>
                    <div className="flex items-center gap-2">
                      <Switch
                        checked={formData.requiresNewsletterSub}
                        onCheckedChange={val => setFormData({ ...formData, requiresNewsletterSub: val })}
                        data-testid="switch-voucher-newsletter"
                      />
                      <Label className="mb-0">Solo iscritti newsletter</Label>
                    </div>
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Valido Da</Label>
                  <Input
                    type="datetime-local"
                    value={formData.validFrom}
                    onChange={e => setFormData({ ...formData, validFrom: e.target.value })}
                    data-testid="input-voucher-valid-from"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Valido Fino A</Label>
                  <Input
                    type="datetime-local"
                    value={formData.validUntil}
                    onChange={e => setFormData({ ...formData, validUntil: e.target.value })}
                    data-testid="input-voucher-valid-until"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Prodotti applicabili (vuoto = tutti i prodotti)</Label>
                <Select value="__trigger__" onValueChange={(slug) => {
                  if (slug === "__clear__") {
                    setFormData({ ...formData, productSlugs: "" });
                    return;
                  }
                  const current = formData.productSlugs ? formData.productSlugs.split(",").map(s => s.trim()).filter(Boolean) : [];
                  if (current.includes(slug)) {
                    setFormData({ ...formData, productSlugs: current.filter(s => s !== slug).join(",") });
                  } else {
                    setFormData({ ...formData, productSlugs: [...current, slug].join(",") });
                  }
                }}>
                  <SelectTrigger data-testid="select-voucher-products">
                    <span className="truncate text-left">
                      {formData.productSlugs
                        ? formData.productSlugs.split(",").map(s => s.trim()).filter(Boolean).map(s => SHOP_PRODUCTS.find(p => p.slug === s)?.name || s).join(", ")
                        : "Tutti i prodotti"}
                    </span>
                  </SelectTrigger>
                  <SelectContent className="max-h-[300px]">
                    <SelectItem value="__clear__" className="text-muted-foreground italic">
                      Tutti i prodotti (nessun filtro)
                    </SelectItem>
                    {SHOP_PRODUCTS.map(product => {
                      const selected = formData.productSlugs ? formData.productSlugs.split(",").map(s => s.trim()).includes(product.slug) : false;
                      return (
                        <SelectItem key={product.slug} value={product.slug}>
                          <span className="flex items-center gap-2">
                            <span className={`w-3.5 h-3.5 rounded border flex items-center justify-center text-[10px] ${selected ? "bg-primary border-primary text-primary-foreground" : "border-muted-foreground"}`}>
                              {selected ? "✓" : ""}
                            </span>
                            <span className="truncate">{product.name}</span>
                          </span>
                        </SelectItem>
                      );
                    })}
                  </SelectContent>
                </Select>
                {formData.productSlugs && (
                  <div className="flex flex-wrap gap-1 mt-1">
                    {formData.productSlugs.split(",").map(s => s.trim()).filter(Boolean).map(slug => (
                      <Badge key={slug} variant="secondary" className="text-xs cursor-pointer" onClick={() => {
                        const current = formData.productSlugs.split(",").map(s => s.trim()).filter(Boolean);
                        setFormData({ ...formData, productSlugs: current.filter(s => s !== slug).join(",") });
                      }}>
                        {SHOP_PRODUCTS.find(p => p.slug === slug)?.name || slug}
                        <span className="ml-1">&times;</span>
                      </Badge>
                    ))}
                  </div>
                )}
              </div>
              <Button
                className="w-full mt-4"
                onClick={handleSubmit}
                disabled={saveMutation.isPending}
                data-testid="button-save-voucher"
              >
                {saveMutation.isPending ? "Salvataggio..." : "Salva"}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="text-center py-8 text-muted-foreground">Caricamento...</div>
        ) : vouchers.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <Tag className="w-12 h-12 mx-auto mb-4 opacity-50" />
            <p>Nessun voucher creato</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm" data-testid="table-vouchers">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 px-2 font-medium">Codice</th>
                  <th className="text-left py-3 px-2 font-medium">Descrizione</th>
                  <th className="text-center py-3 px-2 font-medium">Tipo</th>
                  <th className="text-center py-3 px-2 font-medium">Valore</th>
                  <th className="text-center py-3 px-2 font-medium">Utilizzi</th>
                  <th className="text-center py-3 px-2 font-medium">Scadenza</th>
                  <th className="text-center py-3 px-2 font-medium">Stato</th>
                  <th className="text-right py-3 px-2 font-medium">Azioni</th>
                </tr>
              </thead>
              <tbody>
                {vouchers.map((v) => (
                  <tr key={v.id} className="border-b last:border-0" data-testid={`row-voucher-${v.id}`}>
                    <td className="py-3 px-2 font-mono font-bold">{v.code}</td>
                    <td className="py-3 px-2 text-muted-foreground text-xs max-w-[150px] truncate">{v.description || "-"}</td>
                    <td className="py-3 px-2 text-center">
                      <Badge variant="outline" className="text-xs">
                        {v.discountType === "percentage" ? "%" : "EUR"}
                      </Badge>
                    </td>
                    <td className="py-3 px-2 text-center font-medium">
                      {v.discountType === "percentage" ? `${v.discountValue}%` : `${parseFloat(v.discountValue).toFixed(2)}`}
                    </td>
                    <td className="py-3 px-2 text-center">
                      {v.usedCount}{v.maxUses !== null ? `/${v.maxUses}` : ""}
                    </td>
                    <td className="py-3 px-2 text-center text-xs text-muted-foreground">
                      {v.validUntil ? new Date(v.validUntil).toLocaleDateString("it-IT") : "-"}
                    </td>
                    <td className="py-3 px-2 text-center">
                      {!v.active ? (
                        <Badge variant="secondary">Inattivo</Badge>
                      ) : isExpired(v) ? (
                        <Badge variant="destructive">Scaduto</Badge>
                      ) : isExhausted(v) ? (
                        <Badge variant="secondary">Esaurito</Badge>
                      ) : (
                        <Badge variant="default">Attivo</Badge>
                      )}
                      {v.firstTimeBuyerOnly && (
                        <Badge variant="outline" className="ml-1">1° acquisto</Badge>
                      )}
                      {v.autoApply && (
                        <Badge variant="outline" className="ml-1 border-blue-400 text-blue-600">Auto</Badge>
                      )}
                      {v.requiresNewsletterSub && (
                        <Badge variant="outline" className="ml-1 border-green-400 text-green-600">Newsletter</Badge>
                      )}
                    </td>
                    <td className="py-3 px-2 text-right whitespace-nowrap">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => toggleMutation.mutate({ id: v.id, active: !v.active })}
                        disabled={toggleMutation.isPending}
                        data-testid={`button-toggle-voucher-${v.id}`}
                      >
                        {v.active ? <ToggleRight className="w-4 h-4 text-green-600" /> : <ToggleLeft className="w-4 h-4 text-muted-foreground" />}
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleEdit(v)}
                        data-testid={`button-edit-voucher-${v.id}`}
                      >
                        <Pencil className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => {
                          if (confirm("Sei sicuro di voler eliminare questo voucher?")) {
                            deleteMutation.mutate(v.id);
                          }
                        }}
                        disabled={deleteMutation.isPending}
                        className="text-destructive"
                        data-testid={`button-delete-voucher-${v.id}`}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
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

function ReviewsTab({ token }: { token: string }) {
  const { toast } = useToast();
  const { data: reviews = [], isLoading } = useQuery<any[]>({
    queryKey: ["/api/admin/reviews"],
    queryFn: async () => {
      const res = await fetch("/api/admin/reviews", {
        headers: { Authorization: `Bearer ${token}` },
      });
      return res.json();
    },
  });

  const approveMutation = useMutation({
    mutationFn: async ({ id, approved }: { id: string; approved: boolean }) => {
      const res = await fetch(`/api/admin/reviews/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ approved }),
      });
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/reviews"] });
      toast({ title: "Stato aggiornato" });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      await fetch(`/api/admin/reviews/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/reviews"] });
      toast({ title: "Recensione eliminata" });
    },
  });

  const pendingCount = reviews.filter((r: any) => !r.approved).length;

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Star className="w-5 h-5" /> Recensioni Prodotti
            </CardTitle>
            <CardDescription>
              {reviews.length} recensioni totali{pendingCount > 0 && ` — ${pendingCount} in attesa di approvazione`}
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="text-center py-8 text-muted-foreground">Caricamento...</div>
        ) : reviews.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">Nessuna recensione</div>
        ) : (
          <div className="space-y-3">
            {reviews.map((review: any) => {
              const product = SHOP_PRODUCTS.find(p => p.slug === review.productSlug);
              return (
                <div key={review.id} className={`border rounded-lg p-4 ${!review.approved ? "border-amber-300 bg-amber-50/50" : "border-border"}`}>
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-grow min-w-0">
                      <div className="flex items-center gap-2 mb-1 flex-wrap">
                        <span className="font-semibold text-sm">{review.authorName}</span>
                        <span className="text-xs text-muted-foreground">({review.authorEmail})</span>
                        <div className="flex items-center gap-0.5">
                          {[1, 2, 3, 4, 5].map((s: number) => (
                            <Star key={s} className={`w-3 h-3 ${s <= review.rating ? "fill-amber-400 text-amber-400" : "text-muted-foreground/20"}`} />
                          ))}
                        </div>
                        {review.verified && (
                          <Badge variant="secondary" className="text-[10px]">Verificato</Badge>
                        )}
                        {!review.approved && (
                          <Badge variant="outline" className="text-[10px] border-amber-400 text-amber-600">In attesa</Badge>
                        )}
                        {review.approved && (
                          <Badge variant="secondary" className="text-[10px] text-emerald-600">Approvata</Badge>
                        )}
                      </div>
                      <div className="text-xs text-muted-foreground mb-1">
                        Prodotto: <span className="font-medium">{product?.name || review.productSlug}</span>
                        {" · "}
                        {new Date(review.createdAt).toLocaleDateString("it-IT")}
                      </div>
                      {review.title && <p className="text-sm font-medium mb-0.5">{review.title}</p>}
                      <p className="text-sm text-muted-foreground">{review.comment}</p>
                    </div>
                    <div className="flex items-center gap-1 shrink-0">
                      {!review.approved ? (
                        <Button
                          size="icon"
                          variant="ghost"
                          className="h-8 w-8 text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50"
                          onClick={() => approveMutation.mutate({ id: review.id, approved: true })}
                          title="Approva"
                        >
                          <CheckCircle className="w-4 h-4" />
                        </Button>
                      ) : (
                        <Button
                          size="icon"
                          variant="ghost"
                          className="h-8 w-8 text-amber-600 hover:text-amber-700 hover:bg-amber-50"
                          onClick={() => approveMutation.mutate({ id: review.id, approved: false })}
                          title="Nascondi"
                        >
                          <XCircle className="w-4 h-4" />
                        </Button>
                      )}
                      <Button
                        size="icon"
                        variant="ghost"
                        className="h-8 w-8 text-red-500 hover:text-red-700 hover:bg-red-50"
                        onClick={() => {
                          if (confirm("Eliminare questa recensione?")) {
                            deleteMutation.mutate(review.id);
                          }
                        }}
                        title="Elimina"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

const adminTabs = [
  { value: "contacts", label: "Contatti", icon: MessageSquare },
  { value: "newsletter", label: "Newsletter", icon: Mail },
  { value: "blog", label: "Blog", icon: Newspaper },
  { value: "blog-comments", label: "Commenti Blog", icon: MessagesSquare },
  { value: "shop-orders", label: "Ordini Shop", icon: ShoppingBag },
  { value: "materials", label: "Materiali", icon: FileText },
  { value: "english-test", label: "Test Lingue", icon: GraduationCap },
  { value: "vouchers", label: "Voucher", icon: Tag },
  { value: "reviews", label: "Recensioni", icon: Star },
  { value: "users", label: "Utenti", icon: Users, adminOnly: true },
] as const;

export default function AdminPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [token, setToken] = useState<string | null>(localStorage.getItem("admin_token"));
  const [user, setUser] = useState<any>(JSON.parse(localStorage.getItem("admin_user") || "null"));
  const [showPassword, setShowPassword] = useState(false);
  const [activeTab, setActiveTab] = useState("contacts");
  const { toast } = useToast();
  const [, setLocation] = useLocation();

  const loginMutation = useMutation({
    mutationFn: async () => {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });
      if (!res.ok) throw new Error("Credenziali non valide");
      return res.json();
    },
    onSuccess: (data) => {
      setToken(data.token);
      setUser(data.user);
      localStorage.setItem("admin_token", data.token);
      localStorage.setItem("admin_user", JSON.stringify(data.user));
    },
    onError: () => {
      toast({
        title: "Errore di accesso",
        description: "Username o password non validi",
        variant: "destructive",
      });
    },
  });

  const handleLogout = useCallback(() => {
    setToken(null);
    setUser(null);
    localStorage.removeItem("admin_token");
    localStorage.removeItem("admin_user");
  }, []);

  useEffect(() => {
    if (!token) return;
    fetch("/api/admin/dashboard", {
      headers: { Authorization: `Bearer ${token}` },
    }).then(res => {
      if (res.status === 401) handleLogout();
    }).catch(() => {});
  }, [token, handleLogout]);

  if (!token) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
        <Card className="w-full max-w-md shadow-xl border-slate-200">
          <CardHeader className="text-center">
            <div className="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-blue-200">
              <Shield className="w-8 h-8 text-white" />
            </div>
            <CardTitle className="text-2xl font-bold">Admin Panel</CardTitle>
            <CardDescription>Accedi per gestire il sito Interlingua/SkillCraft</CardDescription>
          </CardHeader>
          <CardContent>
            <form 
              onSubmit={(e) => { e.preventDefault(); loginMutation.mutate(); }}
              className="space-y-4"
            >
              <div className="space-y-2">
                <Label htmlFor="username">Username o Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
                  <Input 
                    id="username" 
                    value={username} 
                    onChange={(e) => setUsername(e.target.value)} 
                    className="pl-10" 
                    placeholder="admin"
                    data-testid="input-username"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
                  <Input 
                    id="password" 
                    type={showPassword ? "text" : "password"} 
                    value={password} 
                    onChange={(e) => setPassword(e.target.value)} 
                    className="pl-10 pr-10" 
                    placeholder="••••••••"
                    data-testid="input-password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-3 text-slate-400 hover:text-slate-600 transition-colors"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>
              <Button 
                type="submit" 
                className="w-full bg-blue-600 hover:bg-blue-700 h-11" 
                disabled={loginMutation.isPending}
                data-testid="button-login"
              >
                {loginMutation.isPending ? (
                  <RefreshCw className="w-4 h-4 animate-spin mr-2" />
                ) : null}
                Accedi
              </Button>
              <Button
                type="button"
                variant="ghost"
                className="w-full text-slate-500 text-sm"
                onClick={() => setLocation("/")}
              >
                Torna al sito
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="bg-white border-b sticky top-0 z-30 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <Shield className="w-4 h-4 text-white" />
            </div>
            <span className="font-bold text-slate-900">Admin Area</span>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-right hidden sm:block">
              <p className="text-sm font-medium leading-none">{user?.name}</p>
              <p className="text-xs text-slate-500 mt-1">{user?.role?.toUpperCase()}</p>
            </div>
            <Button variant="outline" size="sm" onClick={handleLogout} data-testid="button-logout">
              Esci
            </Button>
          </div>
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-4 py-8 space-y-8">
        <DashboardTab token={token!} />

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <div className="hidden md:block">
            <TabsList className="bg-transparent h-auto p-0 grid grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3">
              {adminTabs.filter(t => !('adminOnly' in t && t.adminOnly) || user?.role === "admin").map(t => {
                const Icon = t.icon;
                const isActive = activeTab === t.value;
                return (
                  <TabsTrigger
                    key={t.value}
                    value={t.value}
                    className={`flex flex-col items-center gap-2 rounded-xl border p-4 shadow-sm transition-all hover:shadow-md cursor-pointer h-auto ${
                      isActive
                        ? "bg-blue-50 border-blue-300 text-blue-700 shadow-md ring-1 ring-blue-200"
                        : "bg-white border-gray-200 text-gray-600 hover:border-gray-300"
                    }`}
                    data-testid={`tab-${t.value}`}
                  >
                    <Icon className={`w-6 h-6 ${isActive ? "text-blue-600" : "text-gray-400"}`} />
                    <span className="text-sm font-medium">{t.label}</span>
                  </TabsTrigger>
                );
              })}
            </TabsList>
          </div>

          <div className="md:hidden">
            <Select value={activeTab} onValueChange={setActiveTab}>
              <SelectTrigger className="bg-white border shadow-sm h-12" data-testid="select-mobile-tab">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {adminTabs.filter(t => !('adminOnly' in t && t.adminOnly) || user?.role === "admin").map(t => {
                  const Icon = t.icon;
                  return (
                    <SelectItem key={t.value} value={t.value}>
                      <span className="flex items-center gap-2">
                        <Icon className="w-4 h-4" /> {t.label}
                      </span>
                    </SelectItem>
                  );
                })}
              </SelectContent>
            </Select>
          </div>

          <TabsContent value="contacts">
            <ContactsTab token={token} />
          </TabsContent>
          <TabsContent value="newsletter">
            <NewsletterTab token={token} />
          </TabsContent>
          <TabsContent value="blog">
            <BlogTab token={token} />
          </TabsContent>
          <TabsContent value="blog-comments">
            <BlogCommentsTab token={token} />
          </TabsContent>
          <TabsContent value="shop-orders">
            <ShopOrdersTab token={token} />
          </TabsContent>
          <TabsContent value="materials">
            <CourseMaterialsTab token={token} />
          </TabsContent>
          <TabsContent value="english-test">
            <Card>
              <CardHeader>
                <CardTitle>Risultati Test Lingue</CardTitle>
                <CardDescription>Test adattivi completati — tutte le lingue</CardDescription>
              </CardHeader>
              <CardContent>
                <EnglishAdaptiveTab token={token} />
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="vouchers">
            <VouchersTab token={token} />
          </TabsContent>
          <TabsContent value="reviews">
            <ReviewsTab token={token} />
          </TabsContent>
          {user?.role === "admin" && (
            <TabsContent value="users">
              <UsersTab token={token} currentUserId={user.id} />
            </TabsContent>
          )}
        </Tabs>
      </main>
      <Footer />
    </div>
  );
}
