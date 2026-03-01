import { useState, useEffect } from "react";
import { Navigation } from "@/components/navigation";
import { Footer } from "@/components/footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { useQuery } from "@tanstack/react-query";
import { useLocation } from "wouter";
import {
  BookOpen,
  Download,
  FileText,
  LogOut,
  ShoppingBag,
  User,
  Calendar,
  Loader2,
  Lock,
  ChevronDown,
  ChevronUp,
  Settings,
  Save,
  Phone,
  Mail,
  Eye,
  EyeOff,
} from "lucide-react";

interface CustomerInfo {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  codiceFiscale?: string;
  indirizzo?: string;
  cap?: string;
  citta?: string;
  provincia?: string;
}

interface Order {
  id: string;
  productSlug: string;
  productName: string;
  amount: string;
  status: string;
  createdAt: string | null;
}

interface Material {
  id: string;
  productSlug: string;
  fileName: string;
  fileUrl: string;
  fileSize: string | null;
  fileType: string | null;
  description: string | null;
}

export default function ShopDashboard() {
  const { toast } = useToast();
  const [, setLocation] = useLocation();
  const [token, setToken] = useState<string | null>(null);
  const [customer, setCustomer] = useState<CustomerInfo | null>(null);
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [loginLoading, setLoginLoading] = useState(false);
  const [expandedCourse, setExpandedCourse] = useState<string | null>(null);
  const [profileFirstName, setProfileFirstName] = useState("");
  const [profileLastName, setProfileLastName] = useState("");
  const [profilePhone, setProfilePhone] = useState("");
  const [profileCF, setProfileCF] = useState("");
  const [profileIndirizzo, setProfileIndirizzo] = useState("");
  const [profileCap, setProfileCap] = useState("");
  const [profileCitta, setProfileCitta] = useState("");
  const [profileProvincia, setProfileProvincia] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [profileLoading, setProfileLoading] = useState(false);
  const [passwordLoading, setPasswordLoading] = useState(false);

  useEffect(() => {
    const savedToken = localStorage.getItem("shop_customer_token");
    if (savedToken) {
      setToken(savedToken);
      fetchMe(savedToken);
    }
  }, []);

  const fetchMe = async (t: string) => {
    try {
      const res = await fetch("/api/shop/me", {
        headers: { Authorization: `Bearer ${t}` },
      });
      if (res.ok) {
        const data = await res.json();
        setCustomer(data);
        setProfileFirstName(data.firstName || "");
        setProfileLastName(data.lastName || "");
        setProfilePhone(data.phone || "");
        setProfileCF(data.codiceFiscale || "");
        setProfileIndirizzo(data.indirizzo || "");
        setProfileCap(data.cap || "");
        setProfileCitta(data.citta || "");
        setProfileProvincia(data.provincia || "");
      } else {
        localStorage.removeItem("shop_customer_token");
        setToken(null);
      }
    } catch {
      localStorage.removeItem("shop_customer_token");
      setToken(null);
    }
  };

  const handleProfileUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setProfileLoading(true);
    try {
      const res = await fetch("/api/shop/profile", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ firstName: profileFirstName, lastName: profileLastName, phone: profilePhone, codiceFiscale: profileCF, indirizzo: profileIndirizzo, cap: profileCap, citta: profileCitta, provincia: profileProvincia }),
      });
      const data = await res.json();
      if (data.success) {
        setCustomer(data.customer);
        toast({ title: "Profilo aggiornato", description: "I tuoi dati sono stati salvati." });
      } else {
        toast({ title: "Errore", description: data.message, variant: "destructive" });
      }
    } catch {
      toast({ title: "Errore", description: "Errore di connessione.", variant: "destructive" });
    } finally {
      setProfileLoading(false);
    }
  };

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      toast({ title: "Errore", description: "Le password non coincidono.", variant: "destructive" });
      return;
    }
    setPasswordLoading(true);
    try {
      const res = await fetch("/api/shop/profile", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ currentPassword, newPassword }),
      });
      const data = await res.json();
      if (data.success) {
        setCurrentPassword("");
        setNewPassword("");
        setConfirmPassword("");
        toast({ title: "Password aggiornata", description: "La tua password è stata cambiata con successo." });
      } else {
        toast({ title: "Errore", description: data.message, variant: "destructive" });
      }
    } catch {
      toast({ title: "Errore", description: "Errore di connessione.", variant: "destructive" });
    } finally {
      setPasswordLoading(false);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginLoading(true);
    try {
      const res = await fetch("/api/shop/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: loginEmail, password: loginPassword }),
      });
      const data = await res.json();
      if (data.success) {
        localStorage.setItem("shop_customer_token", data.token);
        setToken(data.token);
        setCustomer(data.customer);
      } else {
        toast({ title: "Errore", description: data.message, variant: "destructive" });
      }
    } catch {
      toast({ title: "Errore", description: "Errore di connessione.", variant: "destructive" });
    } finally {
      setLoginLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("shop_customer_token");
    setToken(null);
    setCustomer(null);
  };

  const { data: orders = [], isLoading: ordersLoading } = useQuery<Order[]>({
    queryKey: ["/api/shop/my-orders"],
    queryFn: async () => {
      const res = await fetch("/api/shop/my-orders", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Failed");
      return res.json();
    },
    enabled: !!token && !!customer,
  });

  const uniqueCourses = orders.reduce<Order[]>((acc, order) => {
    if (order.status === "completed" && !acc.find((o) => o.productSlug === order.productSlug)) {
      acc.push(order);
    }
    return acc;
  }, []);

  if (!token || !customer) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navigation />
        <main className="flex-grow pt-32 pb-16">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-md">
            <div className="text-center mb-8">
              <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                <User className="w-8 h-8 text-primary" />
              </div>
              <h1 className="text-2xl font-bold" data-testid="text-login-title">Area Clienti</h1>
              <p className="text-muted-foreground mt-2">
                Accedi per vedere i tuoi corsi acquistati e scaricare i materiali
              </p>
            </div>

            <Card>
              <CardContent className="p-6">
                <form onSubmit={handleLogin} className="space-y-4">
                  <div>
                    <Label htmlFor="login-email">Email</Label>
                    <Input
                      id="login-email"
                      type="email"
                      value={loginEmail}
                      onChange={(e) => setLoginEmail(e.target.value)}
                      className="mt-1"
                      data-testid="input-login-email"
                    />
                  </div>
                  <div>
                    <Label htmlFor="login-password">Password</Label>
                    <Input
                      id="login-password"
                      type="password"
                      value={loginPassword}
                      onChange={(e) => setLoginPassword(e.target.value)}
                      className="mt-1"
                      data-testid="input-login-password"
                    />
                  </div>
                  <Button type="submit" className="w-full" disabled={loginLoading} data-testid="button-login">
                    {loginLoading ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Accesso...
                      </>
                    ) : (
                      <>
                        <Lock className="w-4 h-4 mr-2" />
                        Accedi
                      </>
                    )}
                  </Button>
                </form>
                <p className="text-xs text-muted-foreground text-center mt-4">
                  L'account viene creato automaticamente al momento dell'acquisto di un corso.
                </p>
              </CardContent>
            </Card>

            <div className="text-center mt-6">
              <Button variant="outline" onClick={() => setLocation("/shop")} data-testid="button-go-shop">
                <ShoppingBag className="w-4 h-4 mr-2" />
                Vai allo Shop
              </Button>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />
      <main className="flex-grow pt-32 pb-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
            <div>
              <h1 className="text-2xl font-bold" data-testid="text-dashboard-title">
                Ciao, {customer.firstName}!
              </h1>
              <p className="text-muted-foreground">{customer.email}</p>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={() => setLocation("/shop")} data-testid="button-browse-shop">
                <ShoppingBag className="w-4 h-4 mr-1" />
                Shop
              </Button>
              <Button variant="ghost" size="sm" onClick={handleLogout} data-testid="button-logout">
                <LogOut className="w-4 h-4 mr-1" />
                Esci
              </Button>
            </div>
          </div>

          <div className="grid gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BookOpen className="w-5 h-5 text-primary" />
                  I Miei Corsi
                </CardTitle>
                <CardDescription>I corsi che hai acquistato</CardDescription>
              </CardHeader>
              <CardContent>
                {ordersLoading ? (
                  <div className="flex items-center justify-center py-8">
                    <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
                  </div>
                ) : uniqueCourses.length === 0 ? (
                  <div className="text-center py-8">
                    <ShoppingBag className="w-12 h-12 text-muted-foreground/30 mx-auto mb-3" />
                    <p className="text-muted-foreground mb-4">Non hai ancora acquistato nessun corso.</p>
                    <Button onClick={() => setLocation("/shop")} data-testid="button-first-purchase">
                      Esplora i Corsi
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {uniqueCourses.map((course) => (
                      <CourseCard
                        key={course.productSlug}
                        course={course}
                        token={token}
                        expanded={expandedCourse === course.productSlug}
                        onToggle={() =>
                          setExpandedCourse(
                            expandedCourse === course.productSlug ? null : course.productSlug
                          )
                        }
                      />
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="w-5 h-5 text-primary" />
                  Storico Ordini
                </CardTitle>
                <CardDescription>Tutti i tuoi acquisti</CardDescription>
              </CardHeader>
              <CardContent>
                {ordersLoading ? (
                  <div className="flex items-center justify-center py-8">
                    <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
                  </div>
                ) : orders.length === 0 ? (
                  <p className="text-center text-muted-foreground py-4">Nessun ordine</p>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b">
                          <th className="text-left py-2 px-2 font-medium">Data</th>
                          <th className="text-left py-2 px-2 font-medium">Corso</th>
                          <th className="text-right py-2 px-2 font-medium">Importo</th>
                          <th className="text-center py-2 px-2 font-medium">Stato</th>
                        </tr>
                      </thead>
                      <tbody>
                        {orders.map((order) => (
                          <tr key={order.id} className="border-b last:border-0" data-testid={`row-my-order-${order.id}`}>
                            <td className="py-2 px-2 text-muted-foreground whitespace-nowrap">
                              {order.createdAt
                                ? new Date(order.createdAt).toLocaleDateString("it-IT")
                                : "-"}
                            </td>
                            <td className="py-2 px-2 font-medium">{order.productName}</td>
                            <td className="py-2 px-2 text-right">&euro;{parseFloat(order.amount).toFixed(2)}</td>
                            <td className="py-2 px-2 text-center">
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
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Settings className="w-5 h-5 text-primary" />
                  Il Mio Profilo
                </CardTitle>
                <CardDescription>Gestisci i tuoi dati personali</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleProfileUpdate} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="profile-firstname">Nome</Label>
                      <Input
                        id="profile-firstname"
                        value={profileFirstName}
                        onChange={(e) => setProfileFirstName(e.target.value)}
                        className="mt-1"
                        data-testid="input-profile-firstname"
                      />
                    </div>
                    <div>
                      <Label htmlFor="profile-lastname">Cognome</Label>
                      <Input
                        id="profile-lastname"
                        value={profileLastName}
                        onChange={(e) => setProfileLastName(e.target.value)}
                        className="mt-1"
                        data-testid="input-profile-lastname"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="profile-phone">Telefono</Label>
                      <div className="relative mt-1">
                        <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                        <Input
                          id="profile-phone"
                          value={profilePhone}
                          onChange={(e) => setProfilePhone(e.target.value)}
                          className="pl-9"
                          data-testid="input-profile-phone"
                        />
                      </div>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="profile-email">Email</Label>
                      <div className="relative mt-1">
                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                        <Input
                          id="profile-email"
                          value={customer.email}
                          disabled
                          className="pl-9 opacity-60"
                          data-testid="input-profile-email"
                        />
                      </div>
                      <p className="text-xs text-muted-foreground mt-1">L'email non può essere modificata</p>
                    </div>
                    <div>
                      <Label htmlFor="profile-cf">Codice Fiscale</Label>
                      <Input
                        id="profile-cf"
                        value={profileCF}
                        onChange={(e) => setProfileCF(e.target.value.toUpperCase())}
                        placeholder="RSSMRA85M01H501Z"
                        maxLength={16}
                        className="mt-1 uppercase"
                        data-testid="input-profile-cf"
                      />
                    </div>
                  </div>

                  <div className="border-t pt-4 mt-2">
                    <p className="text-sm font-medium mb-3">Indirizzo di Fatturazione</p>
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="profile-indirizzo">Indirizzo</Label>
                        <Input
                          id="profile-indirizzo"
                          value={profileIndirizzo}
                          onChange={(e) => setProfileIndirizzo(e.target.value)}
                          placeholder="Via Roma, 1"
                          className="mt-1"
                          data-testid="input-profile-indirizzo"
                        />
                      </div>
                      <div className="grid grid-cols-3 gap-4">
                        <div>
                          <Label htmlFor="profile-cap">CAP</Label>
                          <Input
                            id="profile-cap"
                            value={profileCap}
                            onChange={(e) => setProfileCap(e.target.value)}
                            placeholder="36100"
                            maxLength={5}
                            className="mt-1"
                            data-testid="input-profile-cap"
                          />
                        </div>
                        <div>
                          <Label htmlFor="profile-citta">Città</Label>
                          <Input
                            id="profile-citta"
                            value={profileCitta}
                            onChange={(e) => setProfileCitta(e.target.value)}
                            placeholder="Vicenza"
                            className="mt-1"
                            data-testid="input-profile-citta"
                          />
                        </div>
                        <div>
                          <Label htmlFor="profile-provincia">Provincia</Label>
                          <Input
                            id="profile-provincia"
                            value={profileProvincia}
                            onChange={(e) => setProfileProvincia(e.target.value.toUpperCase())}
                            placeholder="VI"
                            maxLength={2}
                            className="mt-1 uppercase"
                            data-testid="input-profile-provincia"
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  <Button type="submit" disabled={profileLoading} data-testid="button-save-profile">
                    {profileLoading ? (
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    ) : (
                      <Save className="w-4 h-4 mr-2" />
                    )}
                    Salva Modifiche
                  </Button>
                </form>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Lock className="w-5 h-5 text-primary" />
                  Cambia Password
                </CardTitle>
                <CardDescription>Aggiorna la tua password di accesso</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handlePasswordChange} className="space-y-4">
                  <div>
                    <Label htmlFor="current-password">Password Attuale</Label>
                    <div className="relative mt-1">
                      <Input
                        id="current-password"
                        type={showCurrentPassword ? "text" : "password"}
                        value={currentPassword}
                        onChange={(e) => setCurrentPassword(e.target.value)}
                        data-testid="input-current-password"
                      />
                      <button
                        type="button"
                        onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                        data-testid="button-toggle-current-password"
                      >
                        {showCurrentPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="new-password">Nuova Password</Label>
                      <div className="relative mt-1">
                        <Input
                          id="new-password"
                          type={showNewPassword ? "text" : "password"}
                          value={newPassword}
                          onChange={(e) => setNewPassword(e.target.value)}
                          data-testid="input-new-password"
                        />
                        <button
                          type="button"
                          onClick={() => setShowNewPassword(!showNewPassword)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                          data-testid="button-toggle-new-password"
                        >
                          {showNewPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                      </div>
                    </div>
                    <div>
                      <Label htmlFor="confirm-password">Conferma Nuova Password</Label>
                      <Input
                        id="confirm-password"
                        type="password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        className="mt-1"
                        data-testid="input-confirm-password"
                      />
                    </div>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    La password deve avere almeno 8 caratteri, una maiuscola, una minuscola, un numero e un carattere speciale.
                  </p>
                  <Button
                    type="submit"
                    variant="outline"
                    disabled={passwordLoading || !currentPassword || !newPassword || !confirmPassword}
                    data-testid="button-change-password"
                  >
                    {passwordLoading ? (
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    ) : (
                      <Lock className="w-4 h-4 mr-2" />
                    )}
                    Cambia Password
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

function CourseCard({
  course,
  token,
  expanded,
  onToggle,
}: {
  course: Order;
  token: string;
  expanded: boolean;
  onToggle: () => void;
}) {
  const { data: materials = [], isLoading } = useQuery<Material[]>({
    queryKey: ["/api/shop/materials", course.productSlug],
    queryFn: async () => {
      const res = await fetch(`/api/shop/materials/${course.productSlug}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) return [];
      return res.json();
    },
    enabled: expanded,
  });

  return (
    <div className="border rounded-lg overflow-hidden" data-testid={`card-course-${course.productSlug}`}>
      <button
        className="w-full flex items-center justify-between p-4 text-left hover:bg-muted/50 transition-colors"
        onClick={onToggle}
        data-testid={`button-toggle-${course.productSlug}`}
      >
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-primary/10">
            <BookOpen className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h3 className="font-semibold">{course.productName}</h3>
            <p className="text-xs text-muted-foreground flex items-center gap-1">
              <Calendar className="w-3 h-3" />
              Acquistato il{" "}
              {course.createdAt
                ? new Date(course.createdAt).toLocaleDateString("it-IT")
                : "-"}
            </p>
          </div>
        </div>
        {expanded ? (
          <ChevronUp className="w-5 h-5 text-muted-foreground" />
        ) : (
          <ChevronDown className="w-5 h-5 text-muted-foreground" />
        )}
      </button>

      {expanded && (
        <div className="border-t p-4 bg-muted/20">
          <h4 className="text-sm font-medium mb-3 flex items-center gap-2">
            <Download className="w-4 h-4" />
            Materiali del Corso
          </h4>
          {isLoading ? (
            <div className="flex items-center gap-2 text-sm text-muted-foreground py-2">
              <Loader2 className="w-4 h-4 animate-spin" />
              Caricamento materiali...
            </div>
          ) : materials.length === 0 ? (
            <p className="text-sm text-muted-foreground py-2">
              Nessun materiale disponibile al momento. I materiali verranno caricati dal docente.
            </p>
          ) : (
            <div className="space-y-2">
              {materials.map((material) => (
                <a
                  key={material.id}
                  href={material.fileUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 p-3 rounded-lg border bg-background hover:bg-muted/50 transition-colors"
                  data-testid={`link-material-${material.id}`}
                >
                  <FileText className="w-5 h-5 text-primary shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm truncate">{material.fileName}</p>
                    {material.description && (
                      <p className="text-xs text-muted-foreground truncate">
                        {material.description}
                      </p>
                    )}
                  </div>
                  {material.fileSize && (
                    <span className="text-xs text-muted-foreground whitespace-nowrap">
                      {material.fileSize}
                    </span>
                  )}
                  <Download className="w-4 h-4 text-muted-foreground shrink-0" />
                </a>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
