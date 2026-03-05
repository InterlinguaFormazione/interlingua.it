import { useState } from "react";
import { Navigation } from "@/components/navigation";
import { Footer } from "@/components/footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { useQuery, useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { 
  Users, 
  Calendar, 
  Mail, 
  Plus,
  Settings,
  UserPlus,
  CalendarPlus,
  CheckCircle,
  XCircle,
  Pause,
  Play,
  RefreshCw,
  Pencil,
  CreditCard,
} from "lucide-react";

interface AdminSubscriber {
  id: string;
  nome: string;
  cognome: string;
  email: string;
  tipoFatturazione: string | null;
  codiceFiscale: string | null;
  indirizzo: string | null;
  cap: string | null;
  citta: string | null;
  provincia: string | null;
  paese: string | null;
  ragioneSociale: string | null;
  partitaIva: string | null;
  codiceSdi: string | null;
  pec: string | null;
  subscriptionStart: string;
  subscriptionEnd: string;
  active: boolean;
  createdAt: string;
}

interface AdminSession {
  id: string;
  sessionDate: string;
  sessionTime: string;
  topic: string | null;
  maxParticipants: number;
  status: string;
  currentParticipants: number;
}

interface EmailSettings {
  id: string;
  emailsSuspended: boolean;
  suspensionReason: string | null;
  updatedAt: string;
}

interface AdminPayment {
  id: string;
  subscriberId: string;
  paypalOrderId: string;
  amount: string;
  currency: string;
  status: string;
  payerEmail: string | null;
  createdAt: string;
}

export function SpeakersCornerTabContent() {
  const { toast } = useToast();
  const [newSubscriber, setNewSubscriber] = useState({
    nome: "",
    cognome: "",
    email: "",
    password: "",
    subscriptionStart: new Date().toISOString().split('T')[0],
    subscriptionEnd: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
  });
  const [newSession, setNewSession] = useState({
    sessionDate: "",
    sessionTime: "18:30",
    topic: "",
    maxParticipants: 12,
  });
  const [suspensionReason, setSuspensionReason] = useState("");
  const [subscriberDialogOpen, setSubscriberDialogOpen] = useState(false);
  const [sessionDialogOpen, setSessionDialogOpen] = useState(false);
  const [editSubscriber, setEditSubscriber] = useState<AdminSubscriber | null>(null);
  const [editSubData, setEditSubData] = useState({ nome: "", cognome: "", email: "", password: "", subscriptionStart: "", subscriptionEnd: "", tipoFatturazione: "", codiceFiscale: "", indirizzo: "", cap: "", citta: "", provincia: "", paese: "", ragioneSociale: "", partitaIva: "", codiceSdi: "", pec: "" });
  const [editSubDialogOpen, setEditSubDialogOpen] = useState(false);

  const { data: subscribers = [], isLoading: subscribersLoading } = useQuery<AdminSubscriber[]>({
    queryKey: ["/api/admin/speakers-corner/subscribers"],
  });

  const { data: sessions = [], isLoading: sessionsLoading } = useQuery<AdminSession[]>({
    queryKey: ["/api/admin/speakers-corner/sessions"],
  });

  const { data: emailSettings } = useQuery<EmailSettings>({
    queryKey: ["/api/admin/speakers-corner/email-settings"],
  });

  const { data: payments = [], isLoading: paymentsLoading } = useQuery<AdminPayment[]>({
    queryKey: ["/api/admin/speakers-corner/payments"],
  });

  const createSubscriberMutation = useMutation({
    mutationFn: async (data: typeof newSubscriber) => {
      const res = await apiRequest("POST", "/api/admin/speakers-corner/subscribers", data);
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/speakers-corner/subscribers"] });
      toast({ title: "Iscritto creato", description: "Il nuovo iscritto è stato aggiunto." });
      setNewSubscriber({
        nome: "",
        cognome: "",
        email: "",
        password: "",
        subscriptionStart: new Date().toISOString().split('T')[0],
        subscriptionEnd: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      });
      setSubscriberDialogOpen(false);
    },
    onError: (error: Error) => {
      toast({
        title: "Errore",
        description: error.message.includes("400") ? "Email già registrata" : "Errore nella creazione",
        variant: "destructive",
      });
    },
  });

  const toggleSubscriberMutation = useMutation({
    mutationFn: async ({ id, active }: { id: string; active: boolean }) => {
      const res = await apiRequest("PATCH", `/api/admin/speakers-corner/subscribers/${id}`, { active });
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/speakers-corner/subscribers"] });
      toast({ title: "Aggiornato", description: "Stato iscritto aggiornato." });
    },
  });

  const updateSubscriberMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Record<string, any> }) => {
      const payload: Record<string, any> = {};
      if (data.nome) payload.nome = data.nome;
      if (data.cognome) payload.cognome = data.cognome;
      if (data.email) payload.email = data.email;
      if (data.password) payload.password = data.password;
      if (data.subscriptionStart) payload.subscriptionStart = data.subscriptionStart;
      if (data.subscriptionEnd) payload.subscriptionEnd = data.subscriptionEnd;
      payload.tipoFatturazione = data.tipoFatturazione || "";
      payload.codiceFiscale = data.codiceFiscale || "";
      payload.indirizzo = data.indirizzo || "";
      payload.cap = data.cap || "";
      payload.citta = data.citta || "";
      payload.provincia = data.provincia || "";
      payload.paese = data.paese || "";
      payload.ragioneSociale = data.ragioneSociale || "";
      payload.partitaIva = data.partitaIva || "";
      payload.codiceSdi = data.codiceSdi || "";
      payload.pec = data.pec || "";
      const res = await apiRequest("PATCH", `/api/admin/speakers-corner/subscribers/${id}`, payload);
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/speakers-corner/subscribers"] });
      toast({ title: "Iscritto aggiornato", description: "Le modifiche sono state salvate." });
      setEditSubDialogOpen(false);
      setEditSubscriber(null);
    },
    onError: () => {
      toast({ title: "Errore", description: "Errore nell'aggiornamento.", variant: "destructive" });
    },
  });

  const createSessionMutation = useMutation({
    mutationFn: async (data: typeof newSession) => {
      const res = await apiRequest("POST", "/api/admin/speakers-corner/sessions", {
        ...data,
        topic: data.topic || null,
      });
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/speakers-corner/sessions"] });
      toast({ title: "Sessione creata", description: "La nuova sessione è stata aggiunta." });
      setNewSession({ sessionDate: "", sessionTime: "18:30", topic: "", maxParticipants: 12 });
      setSessionDialogOpen(false);
    },
    onError: () => {
      toast({ title: "Errore", description: "Errore nella creazione della sessione.", variant: "destructive" });
    },
  });

  const generateSessionsMutation = useMutation({
    mutationFn: async () => {
      const res = await apiRequest("POST", "/api/admin/speakers-corner/generate-sessions", { weeks: 8 });
      return res.json();
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/speakers-corner/sessions"] });
      toast({ title: "Sessioni generate", description: `${data.created} nuove sessioni create per le prossime 8 settimane.` });
    },
    onError: () => {
      toast({ title: "Errore", description: "Errore nella generazione delle sessioni.", variant: "destructive" });
    },
  });

  const updateSessionMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: any }) => {
      const res = await apiRequest("PATCH", `/api/admin/speakers-corner/sessions/${id}`, data);
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/speakers-corner/sessions"] });
      toast({ title: "Sessione aggiornata" });
    },
  });

  const updateEmailSettingsMutation = useMutation({
    mutationFn: async (data: { emailsSuspended: boolean; suspensionReason?: string }) => {
      const res = await apiRequest("PATCH", "/api/admin/speakers-corner/email-settings", data);
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/speakers-corner/email-settings"] });
      toast({ title: "Impostazioni aggiornate" });
    },
  });

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr + "T00:00:00");
    return date.toLocaleDateString("it-IT", {
      weekday: "short",
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  const activeSubscribers = subscribers.filter(s => s.active);

  return (
    <div className="space-y-6">
          <div className="grid md:grid-cols-4 gap-4">
            <Card data-testid="card-stat-subscribers">
              <CardContent className="pt-6">
                <div className="flex items-center gap-3">
                  <Users className="w-5 h-5 text-primary" />
                  <div>
                    <p className="text-2xl font-bold">{activeSubscribers.length}</p>
                    <p className="text-sm text-muted-foreground">Iscritti attivi</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card data-testid="card-stat-total">
              <CardContent className="pt-6">
                <div className="flex items-center gap-3">
                  <Users className="w-5 h-5 text-muted-foreground" />
                  <div>
                    <p className="text-2xl font-bold">{subscribers.length}</p>
                    <p className="text-sm text-muted-foreground">Iscritti totali</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card data-testid="card-stat-sessions">
              <CardContent className="pt-6">
                <div className="flex items-center gap-3">
                  <Calendar className="w-5 h-5 text-primary" />
                  <div>
                    <p className="text-2xl font-bold">{sessions.filter(s => s.status === "active").length}</p>
                    <p className="text-sm text-muted-foreground">Sessioni attive</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card data-testid="card-stat-email">
              <CardContent className="pt-6">
                <div className="flex items-center gap-3">
                  <Mail className="w-5 h-5 text-primary" />
                  <div>
                    <p className="text-2xl font-bold">
                      {emailSettings?.emailsSuspended ? (
                        <span className="text-destructive">Sospese</span>
                      ) : (
                        <span className="text-green-600">Attive</span>
                      )}
                    </p>
                    <p className="text-sm text-muted-foreground">Email inviti</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <Tabs defaultValue="subscribers" className="space-y-6">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="subscribers" data-testid="tab-subscribers">
                <Users className="w-4 h-4 mr-2" />
                Iscritti
              </TabsTrigger>
              <TabsTrigger value="sessions" data-testid="tab-sessions">
                <Calendar className="w-4 h-4 mr-2" />
                Sessioni
              </TabsTrigger>
              <TabsTrigger value="email" data-testid="tab-email">
                <Mail className="w-4 h-4 mr-2" />
                Email
              </TabsTrigger>
              <TabsTrigger value="payments" data-testid="tab-payments">
                <CreditCard className="w-4 h-4 mr-2" />
                Pagamenti
              </TabsTrigger>
            </TabsList>

            <TabsContent value="subscribers">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <div>
                    <CardTitle>Gestione Iscritti</CardTitle>
                    <CardDescription>Aggiungi e gestisci gli iscritti al servizio Speaker's Corner</CardDescription>
                  </div>
                  <Dialog open={subscriberDialogOpen} onOpenChange={setSubscriberDialogOpen}>
                    <DialogTrigger asChild>
                      <Button data-testid="button-add-subscriber">
                        <UserPlus className="w-4 h-4 mr-2" />
                        Nuovo Iscritto
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Aggiungi Nuovo Iscritto</DialogTitle>
                      </DialogHeader>
                      <form
                        onSubmit={(e) => {
                          e.preventDefault();
                          const pwd = newSubscriber.password;
                          if (pwd.length < 8 || !/[A-Z]/.test(pwd) || !/[a-z]/.test(pwd) || !/[0-9]/.test(pwd) || !/[^A-Za-z0-9]/.test(pwd)) {
                            toast({ title: "Password troppo debole", description: "La password deve avere almeno 8 caratteri, una maiuscola, una minuscola, un numero e un carattere speciale.", variant: "destructive" });
                            return;
                          }
                          createSubscriberMutation.mutate(newSubscriber);
                        }}
                        className="space-y-4"
                      >
                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="sub-nome">Nome</Label>
                            <Input
                              id="sub-nome"
                              value={newSubscriber.nome}
                              onChange={(e) => setNewSubscriber({ ...newSubscriber, nome: e.target.value })}
                              required
                              data-testid="input-sub-nome"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="sub-cognome">Cognome</Label>
                            <Input
                              id="sub-cognome"
                              value={newSubscriber.cognome}
                              onChange={(e) => setNewSubscriber({ ...newSubscriber, cognome: e.target.value })}
                              required
                              data-testid="input-sub-cognome"
                            />
                          </div>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="sub-email">Email</Label>
                          <Input
                            id="sub-email"
                            type="email"
                            value={newSubscriber.email}
                            onChange={(e) => setNewSubscriber({ ...newSubscriber, email: e.target.value })}
                            required
                            data-testid="input-sub-email"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="sub-password">Password</Label>
                          <Input
                            id="sub-password"
                            type="text"
                            value={newSubscriber.password}
                            onChange={(e) => setNewSubscriber({ ...newSubscriber, password: e.target.value })}
                            required
                            placeholder="Min. 8 caratteri, maiuscola, numero, speciale"
                            data-testid="input-sub-password"
                          />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="sub-start">Inizio Abbonamento</Label>
                            <Input
                              id="sub-start"
                              type="date"
                              value={newSubscriber.subscriptionStart}
                              onChange={(e) => setNewSubscriber({ ...newSubscriber, subscriptionStart: e.target.value })}
                              required
                              data-testid="input-sub-start"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="sub-end">Fine Abbonamento</Label>
                            <Input
                              id="sub-end"
                              type="date"
                              value={newSubscriber.subscriptionEnd}
                              onChange={(e) => setNewSubscriber({ ...newSubscriber, subscriptionEnd: e.target.value })}
                              required
                              data-testid="input-sub-end"
                            />
                          </div>
                        </div>
                        <Button
                          type="submit"
                          className="w-full"
                          disabled={createSubscriberMutation.isPending}
                          data-testid="button-create-subscriber"
                        >
                          {createSubscriberMutation.isPending ? "Creazione..." : "Crea Iscritto"}
                        </Button>
                      </form>
                    </DialogContent>
                  </Dialog>
                </CardHeader>
                <CardContent>
                  {subscribersLoading ? (
                    <div className="space-y-3">
                      {[1, 2, 3].map((i) => (
                        <div key={i} className="h-16 bg-muted rounded animate-pulse" />
                      ))}
                    </div>
                  ) : subscribers.length === 0 ? (
                    <div className="text-center py-12 text-muted-foreground">
                      <Users className="w-12 h-12 mx-auto mb-4 opacity-50" />
                      <p>Nessun iscritto ancora. Aggiungi il primo iscritto.</p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {subscribers.map((sub) => {
                        const isExpired = new Date(sub.subscriptionEnd) < new Date();
                        return (
                          <div
                            key={sub.id}
                            className="flex items-center justify-between p-4 rounded-lg border bg-card"
                            data-testid={`row-subscriber-${sub.id}`}
                          >
                            <div className="flex items-center gap-4">
                              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                                <span className="text-primary font-semibold text-sm">
                                  {(sub.nome[0] + sub.cognome[0]).toUpperCase()}
                                </span>
                              </div>
                              <div>
                                <p className="font-medium text-foreground">{sub.nome} {sub.cognome}</p>
                                <p className="text-sm text-muted-foreground">{sub.email}</p>
                              </div>
                            </div>
                            <div className="flex items-center gap-4">
                              <div className="text-right text-sm hidden sm:block">
                                <p className="text-muted-foreground">
                                  {formatDate(sub.subscriptionStart)} — {formatDate(sub.subscriptionEnd)}
                                </p>
                              </div>
                              {isExpired ? (
                                <Badge variant="destructive">Scaduto</Badge>
                              ) : sub.active ? (
                                <Badge variant="secondary" className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                                  Attivo
                                </Badge>
                              ) : (
                                <Badge variant="secondary">Disattivo</Badge>
                              )}
                              <Switch
                                checked={sub.active}
                                onCheckedChange={(checked) => toggleSubscriberMutation.mutate({ id: sub.id, active: checked })}
                                data-testid={`switch-subscriber-${sub.id}`}
                              />
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => {
                                  setEditSubscriber(sub);
                                  setEditSubData({
                                    nome: sub.nome,
                                    cognome: sub.cognome,
                                    email: sub.email,
                                    password: "",
                                    subscriptionStart: sub.subscriptionStart,
                                    subscriptionEnd: sub.subscriptionEnd,
                                    tipoFatturazione: sub.tipoFatturazione || "",
                                    codiceFiscale: sub.codiceFiscale || "",
                                    indirizzo: sub.indirizzo || "",
                                    cap: sub.cap || "",
                                    citta: sub.citta || "",
                                    provincia: sub.provincia || "",
                                    paese: sub.paese || "",
                                    ragioneSociale: sub.ragioneSociale || "",
                                    partitaIva: sub.partitaIva || "",
                                    codiceSdi: sub.codiceSdi || "",
                                    pec: sub.pec || "",
                                  });
                                  setEditSubDialogOpen(true);
                                }}
                                data-testid={`button-edit-subscriber-${sub.id}`}
                              >
                                <Pencil className="w-4 h-4" />
                              </Button>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </CardContent>
              </Card>

              <Dialog open={editSubDialogOpen} onOpenChange={setEditSubDialogOpen}>
                <DialogContent className="max-h-[85vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle>Modifica Iscritto — {editSubscriber?.nome} {editSubscriber?.cognome}</DialogTitle>
                  </DialogHeader>
                  <form
                    onSubmit={(e) => {
                      e.preventDefault();
                      if (editSubData.password) {
                        const pwd = editSubData.password;
                        if (pwd.length < 8 || !/[A-Z]/.test(pwd) || !/[a-z]/.test(pwd) || !/[0-9]/.test(pwd) || !/[^A-Za-z0-9]/.test(pwd)) {
                          toast({ title: "Password troppo debole", description: "La password deve avere almeno 8 caratteri, una maiuscola, una minuscola, un numero e un carattere speciale.", variant: "destructive" });
                          return;
                        }
                      }
                      if (editSubscriber) {
                        updateSubscriberMutation.mutate({ id: editSubscriber.id, data: editSubData });
                      }
                    }}
                    className="space-y-4"
                  >
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="edit-sub-nome">Nome</Label>
                        <Input
                          id="edit-sub-nome"
                          value={editSubData.nome}
                          onChange={(e) => setEditSubData({ ...editSubData, nome: e.target.value })}
                          required
                          data-testid="input-edit-sub-nome"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="edit-sub-cognome">Cognome</Label>
                        <Input
                          id="edit-sub-cognome"
                          value={editSubData.cognome}
                          onChange={(e) => setEditSubData({ ...editSubData, cognome: e.target.value })}
                          required
                          data-testid="input-edit-sub-cognome"
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="edit-sub-email">Email</Label>
                      <Input
                        id="edit-sub-email"
                        type="email"
                        value={editSubData.email}
                        onChange={(e) => setEditSubData({ ...editSubData, email: e.target.value })}
                        required
                        data-testid="input-edit-sub-email"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="edit-sub-password">Nuova Password (lascia vuoto per non cambiarla)</Label>
                      <Input
                        id="edit-sub-password"
                        type="password"
                        value={editSubData.password}
                        onChange={(e) => setEditSubData({ ...editSubData, password: e.target.value })}
                        placeholder="Lascia vuoto per non modificare"
                        data-testid="input-edit-sub-password"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="edit-sub-start">Inizio Abbonamento</Label>
                        <Input
                          id="edit-sub-start"
                          type="date"
                          value={editSubData.subscriptionStart}
                          onChange={(e) => setEditSubData({ ...editSubData, subscriptionStart: e.target.value })}
                          required
                          data-testid="input-edit-sub-start"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="edit-sub-end">Fine Abbonamento</Label>
                        <Input
                          id="edit-sub-end"
                          type="date"
                          value={editSubData.subscriptionEnd}
                          onChange={(e) => setEditSubData({ ...editSubData, subscriptionEnd: e.target.value })}
                          required
                          data-testid="input-edit-sub-end"
                        />
                      </div>
                    </div>
                    <Button
                      type="submit"
                      className="w-full"
                      disabled={updateSubscriberMutation.isPending}
                      data-testid="button-save-subscriber"
                    >
                      {updateSubscriberMutation.isPending ? "Salvataggio..." : "Salva Modifiche"}
                    </Button>
                  </form>
                </DialogContent>
              </Dialog>
            </TabsContent>

            <TabsContent value="sessions">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <div>
                    <CardTitle>Gestione Sessioni</CardTitle>
                    <CardDescription>Crea e gestisci le sessioni settimanali del venerdì</CardDescription>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      onClick={() => generateSessionsMutation.mutate()}
                      disabled={generateSessionsMutation.isPending}
                      data-testid="button-generate-sessions"
                    >
                      <RefreshCw className="w-4 h-4 mr-2" />
                      {generateSessionsMutation.isPending ? "Generazione..." : "Genera 8 Settimane"}
                    </Button>
                    <Dialog open={sessionDialogOpen} onOpenChange={setSessionDialogOpen}>
                      <DialogTrigger asChild>
                        <Button data-testid="button-add-session">
                          <CalendarPlus className="w-4 h-4 mr-2" />
                          Nuova Sessione
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Crea Nuova Sessione</DialogTitle>
                        </DialogHeader>
                        <form
                          onSubmit={(e) => {
                            e.preventDefault();
                            createSessionMutation.mutate(newSession);
                          }}
                          className="space-y-4"
                        >
                          <div className="space-y-2">
                            <Label htmlFor="sess-date">Data</Label>
                            <Input
                              id="sess-date"
                              type="date"
                              value={newSession.sessionDate}
                              onChange={(e) => setNewSession({ ...newSession, sessionDate: e.target.value })}
                              required
                              data-testid="input-sess-date"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="sess-time">Orario</Label>
                            <Input
                              id="sess-time"
                              type="time"
                              value={newSession.sessionTime}
                              onChange={(e) => setNewSession({ ...newSession, sessionTime: e.target.value })}
                              data-testid="input-sess-time"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="sess-topic">Tema (opzionale)</Label>
                            <Input
                              id="sess-topic"
                              value={newSession.topic}
                              onChange={(e) => setNewSession({ ...newSession, topic: e.target.value })}
                              placeholder="es. Travel experiences"
                              data-testid="input-sess-topic"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="sess-max">Posti disponibili</Label>
                            <Input
                              id="sess-max"
                              type="number"
                              min={1}
                              value={newSession.maxParticipants}
                              onChange={(e) => setNewSession({ ...newSession, maxParticipants: parseInt(e.target.value) || 12 })}
                              data-testid="input-sess-max"
                            />
                          </div>
                          <Button
                            type="submit"
                            className="w-full"
                            disabled={createSessionMutation.isPending}
                            data-testid="button-create-session"
                          >
                            {createSessionMutation.isPending ? "Creazione..." : "Crea Sessione"}
                          </Button>
                        </form>
                      </DialogContent>
                    </Dialog>
                  </div>
                </CardHeader>
                <CardContent>
                  {sessionsLoading ? (
                    <div className="space-y-3">
                      {[1, 2, 3].map((i) => (
                        <div key={i} className="h-16 bg-muted rounded animate-pulse" />
                      ))}
                    </div>
                  ) : sessions.length === 0 ? (
                    <div className="text-center py-12 text-muted-foreground">
                      <Calendar className="w-12 h-12 mx-auto mb-4 opacity-50" />
                      <p>Nessuna sessione creata. Usa "Genera 8 Settimane" per creare automaticamente le sessioni.</p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {sessions.map((session) => {
                        const isPast = new Date(session.sessionDate) < new Date();
                        return (
                          <div
                            key={session.id}
                            className={`flex items-center justify-between p-4 rounded-lg border bg-card ${isPast ? "opacity-60" : ""}`}
                            data-testid={`row-session-${session.id}`}
                          >
                            <div className="flex items-center gap-4">
                              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                                <Calendar className="w-5 h-5 text-primary" />
                              </div>
                              <div>
                                <p className="font-medium text-foreground">
                                  {formatDate(session.sessionDate)} — {session.sessionTime}
                                </p>
                                <p className="text-sm text-muted-foreground">
                                  {session.topic || "Nessun tema definito"}
                                  {" • "}
                                  {session.currentParticipants}/{session.maxParticipants} prenotati
                                </p>
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              {session.status === "active" ? (
                                <>
                                  <Badge variant="secondary" className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                                    Attiva
                                  </Badge>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => updateSessionMutation.mutate({ id: session.id, data: { status: "cancelled" } })}
                                    data-testid={`button-cancel-session-${session.id}`}
                                  >
                                    <XCircle className="w-4 h-4" />
                                  </Button>
                                </>
                              ) : (
                                <>
                                  <Badge variant="destructive">Cancellata</Badge>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => updateSessionMutation.mutate({ id: session.id, data: { status: "active" } })}
                                    data-testid={`button-activate-session-${session.id}`}
                                  >
                                    <CheckCircle className="w-4 h-4" />
                                  </Button>
                                </>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="email">
              <Card>
                <CardHeader>
                  <CardTitle>Impostazioni Email</CardTitle>
                  <CardDescription>
                    Gestisci le notifiche email settimanali inviate ogni martedì agli abbonati attivi
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="flex items-center justify-between p-4 rounded-lg border">
                    <div className="flex items-center gap-4">
                      {emailSettings?.emailsSuspended ? (
                        <div className="w-10 h-10 rounded-lg bg-destructive/10 flex items-center justify-center">
                          <Pause className="w-5 h-5 text-destructive" />
                        </div>
                      ) : (
                        <div className="w-10 h-10 rounded-lg bg-green-100 dark:bg-green-900 flex items-center justify-center">
                          <Play className="w-5 h-5 text-green-600 dark:text-green-400" />
                        </div>
                      )}
                      <div>
                        <p className="font-medium text-foreground">
                          {emailSettings?.emailsSuspended ? "Email sospese" : "Email attive"}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {emailSettings?.emailsSuspended 
                            ? `Motivo: ${emailSettings.suspensionReason || "Non specificato"}`
                            : "Gli inviti vengono inviati ogni martedì"}
                        </p>
                      </div>
                    </div>
                    <Switch
                      checked={!emailSettings?.emailsSuspended}
                      onCheckedChange={(checked) => {
                        if (!checked) {
                          updateEmailSettingsMutation.mutate({
                            emailsSuspended: true,
                            suspensionReason: suspensionReason || "Pausa festiva",
                          });
                        } else {
                          updateEmailSettingsMutation.mutate({
                            emailsSuspended: false,
                          });
                          setSuspensionReason("");
                        }
                      }}
                      data-testid="switch-email-active"
                    />
                  </div>

                  {!emailSettings?.emailsSuspended && (
                    <div className="p-4 rounded-lg border space-y-3">
                      <Label htmlFor="suspension-reason">Motivo della sospensione (per quando sospendi)</Label>
                      <Input
                        id="suspension-reason"
                        value={suspensionReason}
                        onChange={(e) => setSuspensionReason(e.target.value)}
                        placeholder="es. Chiusura natalizia, Pausa estiva..."
                        data-testid="input-suspension-reason"
                      />
                      <p className="text-xs text-muted-foreground">
                        Inserisci un motivo prima di sospendere le email (opzionale).
                      </p>
                    </div>
                  )}

                  <Card className="bg-muted/50">
                    <CardContent className="pt-6">
                      <h4 className="font-semibold text-foreground mb-3">Come funzionano le email</h4>
                      <ul className="space-y-2 text-sm text-muted-foreground">
                        <li className="flex items-start gap-2">
                          <CheckCircle className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
                          <span>Ogni martedì, il sistema invia un'email a tutti gli iscritti attivi</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <CheckCircle className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
                          <span>L'email contiene l'invito alla sessione del venerdì con link per prenotarsi</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <CheckCircle className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
                          <span>La sospensione blocca l'invio durante festività o pause</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <CheckCircle className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
                          <span>Gli iscritti con abbonamento scaduto non ricevono email</span>
                        </li>
                      </ul>
                    </CardContent>
                  </Card>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="payments">
              <Card>
                <CardHeader>
                  <div>
                    <CardTitle>Storico Pagamenti</CardTitle>
                    <CardDescription>Pagamenti ricevuti tramite PayPal per gli abbonamenti Speaker's Corner</CardDescription>
                  </div>
                </CardHeader>
                <CardContent>
                  {paymentsLoading ? (
                    <div className="space-y-3">
                      {[1, 2, 3].map((i) => (
                        <div key={i} className="h-16 bg-muted rounded animate-pulse" />
                      ))}
                    </div>
                  ) : payments.length === 0 ? (
                    <div className="text-center py-12 text-muted-foreground">
                      <CreditCard className="w-12 h-12 mx-auto mb-4 opacity-50" />
                      <p>Nessun pagamento registrato</p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {payments.map((payment) => (
                        <div
                          key={payment.id}
                          className="flex items-center justify-between p-4 rounded-lg border bg-card"
                          data-testid={`row-payment-${payment.id}`}
                        >
                          <div className="flex items-center gap-4">
                            <div className="w-10 h-10 rounded-full bg-green-100 dark:bg-green-900 flex items-center justify-center">
                              <CreditCard className="w-5 h-5 text-green-600" />
                            </div>
                            <div>
                              <p className="font-medium text-foreground">{payment.payerEmail || "N/A"}</p>
                              <p className="text-sm text-muted-foreground">
                                Ordine: {payment.paypalOrderId}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center gap-4">
                            <div className="text-right">
                              <p className="font-semibold text-foreground">€{payment.amount}</p>
                              <p className="text-sm text-muted-foreground">
                                {new Date(payment.createdAt).toLocaleDateString("it-IT")}
                              </p>
                            </div>
                            <Badge
                              variant={payment.status === "completed" ? "secondary" : "destructive"}
                              className={payment.status === "completed" ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200" : ""}
                            >
                              {payment.status === "completed" ? "Completato" : payment.status}
                            </Badge>
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
  );
}

export default function SpeakersCornerAdmin() {
  return (
    <div className="min-h-screen">
      <Navigation />
      <main className="pt-28 pb-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3 mb-8">
            <Settings className="w-8 h-8 text-primary" />
            <div>
              <h1 className="text-3xl font-bold text-foreground" data-testid="text-admin-title">
                Admin — Speaker's Corner
              </h1>
              <p className="text-muted-foreground">Gestione iscritti, sessioni e notifiche email</p>
            </div>
          </div>
          <SpeakersCornerTabContent />
        </div>
      </main>
      <Footer />
    </div>
  );
}
