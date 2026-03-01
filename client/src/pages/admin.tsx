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
} from "lucide-react";

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
                  <th className="text-left py-3 px-2 font-medium">Studente</th>
                  <th className="text-left py-3 px-2 font-medium">Email Cliente</th>
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
                    <td className="py-3 px-2">{order.customerFirstName} {order.customerLastName}</td>
                    <td className="py-3 px-2 text-muted-foreground">
                      {order.studentFirstName ? (
                        <span>{order.studentFirstName} {order.studentLastName}{order.studentEmail ? ` (${order.studentEmail})` : ""}</span>
                      ) : (
                        <span className="text-xs italic">stesso</span>
                      )}
                    </td>
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

function EnglishAdaptiveTab({ token }: { token: string }) {
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [filterCompany, setFilterCompany] = useState("");
  const [filterLevel, setFilterLevel] = useState("");

  const { data: sessions = [], isLoading } = useQuery<BeSession[]>({
    queryKey: ["/api/admin/english-test-results"],
    queryFn: async () => {
      const res = await fetch("/api/admin/english-test-results", {
        headers: { Authorization: `Bearer ${token}` },
      });
      return res.json();
    },
  });

  const { data: detail } = useQuery<BeSessionDetail>({
    queryKey: ["/api/admin/english-test-results", selectedId],
    queryFn: async () => {
      const res = await fetch(`/api/admin/english-test-results/${selectedId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return res.json();
    },
    enabled: !!selectedId,
  });

  const filtered = sessions.filter(s => {
    if (filterCompany && !s.company.toLowerCase().includes(filterCompany.toLowerCase())) return false;
    if (filterLevel && filterLevel !== "all" && s.finalLevel !== filterLevel) return false;
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
          Back to list
        </Button>

        <Card>
          <CardHeader>
            <CardTitle>{detail.session.firstName} {detail.session.lastName}</CardTitle>
            <CardDescription>{detail.session.email}{detail.session.company ? ` - ${detail.session.company}` : ""}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-3 gap-4 text-center">
              <div className="p-3 bg-muted rounded-lg">
                <div className="text-sm text-muted-foreground">Final Level</div>
                <div className="text-2xl font-bold mt-1">{levelBadge(detail.session.finalLevel)}</div>
              </div>
              <div className="p-3 bg-muted rounded-lg">
                <div className="text-sm text-muted-foreground">MC Score</div>
                <div className="text-lg font-bold mt-1">{detail.session.correctAnswers}/{detail.session.totalQuestions}</div>
              </div>
              <div className="p-3 bg-muted rounded-lg">
                <div className="text-sm text-muted-foreground">Status</div>
                <div className="mt-1"><Badge variant={detail.session.status === "completed" ? "default" : "secondary"}>{detail.session.status}</Badge></div>
              </div>
            </div>

            {detail.sectionResults.length > 0 && (
              <div>
                <h4 className="font-semibold mb-2">Section Results</h4>
                <table className="w-full text-sm">
                  <thead><tr className="border-b"><th className="text-left py-2">Section</th><th className="text-center">Level</th><th className="text-center">Accuracy</th><th className="text-center">Theta</th></tr></thead>
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
                <h4 className="font-semibold mb-2">Writing / Speaking</h4>
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
                <h4 className="font-semibold mb-2">IRT Audit Trail ({detail.responses.length} responses)</h4>
                <div className="max-h-80 overflow-y-auto">
                  <table className="w-full text-xs">
                    <thead><tr className="border-b bg-muted"><th className="text-left py-1 px-2">#</th><th className="text-left px-2">Skill</th><th className="text-left px-2">Question</th><th className="text-center px-2">Correct</th><th className="text-center px-2">Theta</th><th className="text-center px-2">Time</th></tr></thead>
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
      <div className="flex gap-3">
        <Input
          placeholder="Filter by company..."
          value={filterCompany}
          onChange={e => setFilterCompany(e.target.value)}
          className="max-w-xs"
          data-testid="input-filter-company"
        />
        <Select value={filterLevel} onValueChange={setFilterLevel}>
          <SelectTrigger className="w-[140px]" data-testid="select-filter-level">
            <SelectValue placeholder="All levels" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All levels</SelectItem>
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
          <p>No English test results yet.</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm" data-testid="table-results">
            <thead>
              <tr className="border-b">
                <th className="text-left py-3 px-2">Candidate</th>
                <th className="text-left px-2">Company</th>
                <th className="text-center px-2">Level</th>
                <th className="text-center px-2">MC</th>
                <th className="text-center px-2">Writing</th>
                <th className="text-center px-2">Speaking</th>
                <th className="text-center px-2">Status</th>
                <th className="text-center px-2">Date</th>
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
      return res.json();
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
      return res.json();
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
      return res.json();
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

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Blog Management</CardTitle>
          <CardDescription>Gestione post generati dall'AI</CardDescription>
        </div>
        <Button 
          onClick={() => generateMutation.mutate()} 
          disabled={generateMutation.isPending}
          size="sm"
        >
          {generateMutation.isPending ? "Generando..." : "Genera Nuovo Post"}
        </Button>
      </CardHeader>
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
      return res.json();
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
                  <div className="flex items-center gap-2">
                    <Switch
                      checked={formData.active}
                      onCheckedChange={val => setFormData({ ...formData, active: val })}
                      data-testid="switch-voucher-active"
                    />
                    <Label className="mb-0">Attivo</Label>
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

export default function AdminPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [token, setToken] = useState<string | null>(localStorage.getItem("admin_token"));
  const [user, setUser] = useState<any>(JSON.parse(localStorage.getItem("admin_user") || "null"));
  const [showPassword, setShowPassword] = useState(false);
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

  const handleLogout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem("admin_token");
    localStorage.removeItem("admin_user");
  };

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

      <main className="max-w-7xl mx-auto px-4 py-8">
        <Tabs defaultValue="contacts" className="space-y-6">
          <div className="overflow-x-auto pb-2 -mx-4 px-4 sm:mx-0 sm:px-0">
            <TabsList className="bg-white border shadow-sm h-auto p-1 flex w-max sm:w-full">
              <TabsTrigger value="contacts" className="data-[state=active]:bg-blue-50 data-[state=active]:text-blue-700 py-2 px-4 flex items-center gap-2">
                <MessageSquare className="w-4 h-4" /> Contacts
              </TabsTrigger>
              <TabsTrigger value="newsletter" className="data-[state=active]:bg-blue-50 data-[state=active]:text-blue-700 py-2 px-4 flex items-center gap-2">
                <Mail className="w-4 h-4" /> Newsletter
              </TabsTrigger>
              <TabsTrigger value="blog" className="data-[state=active]:bg-blue-50 data-[state=active]:text-blue-700 py-2 px-4 flex items-center gap-2">
                <Newspaper className="w-4 h-4" /> Blog
              </TabsTrigger>
              <TabsTrigger value="shop-orders" className="data-[state=active]:bg-blue-50 data-[state=active]:text-blue-700 py-2 px-4 flex items-center gap-2">
                <ShoppingBag className="w-4 h-4" /> Shop Orders
              </TabsTrigger>
              <TabsTrigger value="materials" className="data-[state=active]:bg-blue-50 data-[state=active]:text-blue-700 py-2 px-4 flex items-center gap-2">
                <FileText className="w-4 h-4" /> Materials
              </TabsTrigger>
              <TabsTrigger value="english-test" className="data-[state=active]:bg-blue-50 data-[state=active]:text-blue-700 py-2 px-4 flex items-center gap-2">
                <GraduationCap className="w-4 h-4" /> English Test
              </TabsTrigger>
              <TabsTrigger value="vouchers" className="data-[state=active]:bg-blue-50 data-[state=active]:text-blue-700 py-2 px-4 flex items-center gap-2" data-testid="tab-vouchers">
                <Tag className="w-4 h-4" /> Vouchers
              </TabsTrigger>
              {user?.role === "admin" && (
                <TabsTrigger value="users" className="data-[state=active]:bg-blue-50 data-[state=active]:text-blue-700 py-2 px-4 flex items-center gap-2">
                  <Users className="w-4 h-4" /> Users
                </TabsTrigger>
              )}
            </TabsList>
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
          <TabsContent value="shop-orders">
            <ShopOrdersTab token={token} />
          </TabsContent>
          <TabsContent value="materials">
            <CourseMaterialsTab token={token} />
          </TabsContent>
          <TabsContent value="english-test">
            <Card>
              <CardHeader>
                <CardTitle>English Adaptive Test Results</CardTitle>
                <CardDescription>Adaptive test results</CardDescription>
              </CardHeader>
              <CardContent>
                <EnglishAdaptiveTab token={token} />
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="vouchers">
            <VouchersTab token={token} />
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
