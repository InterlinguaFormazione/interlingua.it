import { useState, useEffect } from "react";
import { Navigation } from "@/components/navigation";
import { Footer } from "@/components/footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { useQuery, useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useLocation } from "wouter";
import { 
  Mic, 
  Calendar, 
  Clock, 
  Users, 
  LogOut,
  CalendarCheck,
  CalendarX,
  User,
  CheckCircle,
  AlertCircle
} from "lucide-react";

interface Subscriber {
  id: string;
  name: string;
  email: string;
  subscriptionStart: string;
  subscriptionEnd: string;
  active: boolean;
}

interface Session {
  id: string;
  sessionDate: string;
  sessionTime: string;
  topic: string | null;
  maxParticipants: number;
  status: string;
  currentParticipants: number;
}

interface Booking {
  id: string;
  subscriberId: string;
  sessionId: string;
  bookedAt: string;
  session?: Session;
}

export default function SpeakersCornerDashboard() {
  const [subscriber, setSubscriber] = useState<Subscriber | null>(null);
  const [, setLocation] = useLocation();
  const { toast } = useToast();

  useEffect(() => {
    const stored = localStorage.getItem("sc_subscriber");
    if (!stored) {
      setLocation("/speakers-corner");
      return;
    }
    try {
      setSubscriber(JSON.parse(stored));
    } catch {
      localStorage.removeItem("sc_subscriber");
      setLocation("/speakers-corner");
    }
  }, [setLocation]);

  const { data: sessions = [], isLoading: sessionsLoading } = useQuery<Session[]>({
    queryKey: ["/api/speakers-corner/sessions"],
    enabled: !!subscriber,
  });

  const { data: myBookings = [], isLoading: bookingsLoading } = useQuery<Booking[]>({
    queryKey: ["/api/speakers-corner/my-bookings", subscriber?.id],
    enabled: !!subscriber,
  });

  const bookMutation = useMutation({
    mutationFn: async (sessionId: string) => {
      const res = await apiRequest("POST", "/api/speakers-corner/book", {
        subscriberId: subscriber?.id,
        sessionId,
      });
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/speakers-corner/sessions"] });
      queryClient.invalidateQueries({ queryKey: ["/api/speakers-corner/my-bookings", subscriber?.id] });
      toast({
        title: "Prenotazione confermata!",
        description: "Ti aspettiamo venerdì alle 18:30.",
      });
    },
    onError: (error: Error) => {
      const msg = error.message;
      toast({
        title: "Errore",
        description: msg.includes("già prenotato") 
          ? "Sei già prenotato per questa sessione"
          : msg.includes("completo")
          ? "La sessione è al completo"
          : "Si è verificato un errore. Riprova.",
        variant: "destructive",
      });
    },
  });

  const cancelMutation = useMutation({
    mutationFn: async (bookingId: string) => {
      const res = await apiRequest("DELETE", `/api/speakers-corner/book/${bookingId}?subscriberId=${subscriber?.id}`);
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/speakers-corner/sessions"] });
      queryClient.invalidateQueries({ queryKey: ["/api/speakers-corner/my-bookings", subscriber?.id] });
      toast({
        title: "Prenotazione cancellata",
        description: "Il tuo posto è stato liberato.",
      });
    },
    onError: () => {
      toast({
        title: "Errore",
        description: "Impossibile cancellare la prenotazione.",
        variant: "destructive",
      });
    },
  });

  const handleLogout = () => {
    localStorage.removeItem("sc_subscriber");
    setLocation("/speakers-corner");
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr + "T00:00:00");
    return date.toLocaleDateString("it-IT", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const isBookedForSession = (sessionId: string) => {
    return myBookings.some((b) => b.sessionId === sessionId);
  };

  const getBookingForSession = (sessionId: string) => {
    return myBookings.find((b) => b.sessionId === sessionId);
  };

  if (!subscriber) return null;

  const daysLeft = Math.ceil(
    (new Date(subscriber.subscriptionEnd).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)
  );

  return (
    <div className="min-h-screen">
      <Navigation />
      <main className="pt-28 pb-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-8">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <Mic className="w-8 h-8 text-primary" />
                <h1 className="text-3xl font-bold text-foreground" data-testid="text-dashboard-title">
                  Speaker's Corner
                </h1>
              </div>
              <p className="text-muted-foreground" data-testid="text-dashboard-welcome">
                Benvenuto/a, <span className="font-medium text-foreground">{subscriber.name}</span>
              </p>
            </div>
            <Button variant="outline" onClick={handleLogout} data-testid="button-sc-logout">
              <LogOut className="w-4 h-4 mr-2" />
              Esci
            </Button>
          </div>

          <div className="grid md:grid-cols-3 gap-6 mb-8">
            <Card data-testid="card-subscription-info">
              <CardContent className="pt-6">
                <div className="flex items-center gap-3 mb-3">
                  <User className="w-5 h-5 text-primary" />
                  <h3 className="font-semibold">Il tuo abbonamento</h3>
                </div>
                <div className="space-y-2 text-sm">
                  <p className="text-muted-foreground">
                    Valido dal <span className="text-foreground">{formatDate(subscriber.subscriptionStart)}</span>
                  </p>
                  <p className="text-muted-foreground">
                    al <span className="text-foreground">{formatDate(subscriber.subscriptionEnd)}</span>
                  </p>
                  <div className="pt-2">
                    {daysLeft > 30 ? (
                      <Badge variant="secondary" className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                        <CheckCircle className="w-3 h-3 mr-1" />
                        Attivo
                      </Badge>
                    ) : daysLeft > 0 ? (
                      <Badge variant="secondary" className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200">
                        <AlertCircle className="w-3 h-3 mr-1" />
                        Scade tra {daysLeft} giorni
                      </Badge>
                    ) : (
                      <Badge variant="destructive">
                        Scaduto
                      </Badge>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card data-testid="card-next-session">
              <CardContent className="pt-6">
                <div className="flex items-center gap-3 mb-3">
                  <Calendar className="w-5 h-5 text-primary" />
                  <h3 className="font-semibold">Prossima Sessione</h3>
                </div>
                {sessions.length > 0 ? (
                  <div className="space-y-2 text-sm">
                    <p className="text-foreground font-medium">{formatDate(sessions[0].sessionDate)}</p>
                    <p className="text-muted-foreground">Ore {sessions[0].sessionTime}</p>
                    {sessions[0].topic && (
                      <p className="text-muted-foreground">
                        Tema: <span className="text-foreground">{sessions[0].topic}</span>
                      </p>
                    )}
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground">Nessuna sessione in programma</p>
                )}
              </CardContent>
            </Card>

            <Card data-testid="card-bookings-count">
              <CardContent className="pt-6">
                <div className="flex items-center gap-3 mb-3">
                  <CalendarCheck className="w-5 h-5 text-primary" />
                  <h3 className="font-semibold">Le tue prenotazioni</h3>
                </div>
                <p className="text-3xl font-bold text-primary">
                  {myBookings.filter(b => b.session && new Date(b.session.sessionDate) >= new Date()).length}
                </p>
                <p className="text-sm text-muted-foreground">sessioni prenotate</p>
              </CardContent>
            </Card>
          </div>

          <div className="mb-8">
            <h2 className="text-2xl font-bold text-foreground mb-6" data-testid="text-sessions-title">
              Sessioni Disponibili
            </h2>
            {sessionsLoading ? (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                {[1, 2, 3].map((i) => (
                  <Card key={i} className="animate-pulse">
                    <CardContent className="pt-6">
                      <div className="h-4 bg-muted rounded w-3/4 mb-3" />
                      <div className="h-3 bg-muted rounded w-1/2 mb-2" />
                      <div className="h-3 bg-muted rounded w-1/3" />
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : sessions.length === 0 ? (
              <Card>
                <CardContent className="py-12 text-center">
                  <Calendar className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">Nessuna sessione disponibile al momento.</p>
                  <p className="text-sm text-muted-foreground mt-2">
                    Le nuove sessioni vengono pubblicate ogni settimana.
                  </p>
                </CardContent>
              </Card>
            ) : (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                {sessions.map((session) => {
                  const booked = isBookedForSession(session.id);
                  const booking = getBookingForSession(session.id);
                  const isFull = session.currentParticipants >= (session.maxParticipants || 12);

                  return (
                    <Card 
                      key={session.id} 
                      className={booked ? "border-primary/50 bg-primary/5" : ""}
                      data-testid={`card-session-${session.id}`}
                    >
                      <CardContent className="pt-6">
                        <div className="flex items-start justify-between mb-3">
                          <div>
                            <p className="font-semibold text-foreground">
                              {formatDate(session.sessionDate)}
                            </p>
                            <p className="text-sm text-muted-foreground flex items-center gap-1">
                              <Clock className="w-3 h-3" />
                              Ore {session.sessionTime}
                            </p>
                          </div>
                          {booked && (
                            <Badge variant="default" className="bg-primary">
                              <CheckCircle className="w-3 h-3 mr-1" />
                              Prenotato
                            </Badge>
                          )}
                        </div>

                        {session.topic && (
                          <p className="text-sm text-muted-foreground mb-3">
                            <span className="font-medium text-foreground">Tema:</span> {session.topic}
                          </p>
                        )}

                        <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
                          <Users className="w-4 h-4" />
                          <span>
                            {session.currentParticipants}/{session.maxParticipants || 12} posti occupati
                          </span>
                        </div>

                        {booked ? (
                          <Button
                            variant="outline"
                            className="w-full"
                            onClick={() => booking && cancelMutation.mutate(booking.id)}
                            disabled={cancelMutation.isPending}
                            data-testid={`button-cancel-${session.id}`}
                          >
                            <CalendarX className="w-4 h-4 mr-2" />
                            {cancelMutation.isPending ? "Cancellazione..." : "Cancella Prenotazione"}
                          </Button>
                        ) : (
                          <Button
                            className="w-full"
                            onClick={() => bookMutation.mutate(session.id)}
                            disabled={isFull || bookMutation.isPending}
                            data-testid={`button-book-${session.id}`}
                          >
                            {isFull ? (
                              <>Sessione completa</>
                            ) : bookMutation.isPending ? (
                              "Prenotazione..."
                            ) : (
                              <>
                                <CalendarCheck className="w-4 h-4 mr-2" />
                                Prenota
                              </>
                            )}
                          </Button>
                        )}
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            )}
          </div>

          {!bookingsLoading && myBookings.length > 0 && (
            <div>
              <h2 className="text-2xl font-bold text-foreground mb-6" data-testid="text-my-bookings-title">
                Le Mie Prenotazioni
              </h2>
              <div className="space-y-3">
                {myBookings
                  .filter((b) => b.session)
                  .sort((a, b) => new Date(a.session!.sessionDate).getTime() - new Date(b.session!.sessionDate).getTime())
                  .map((booking) => {
                    const isPast = new Date(booking.session!.sessionDate) < new Date();
                    return (
                      <Card 
                        key={booking.id} 
                        className={isPast ? "opacity-60" : ""}
                        data-testid={`card-booking-${booking.id}`}
                      >
                        <CardContent className="py-4">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-4">
                              <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                                <Calendar className="w-5 h-5 text-primary" />
                              </div>
                              <div>
                                <p className="font-medium text-foreground">
                                  {formatDate(booking.session!.sessionDate)}
                                </p>
                                <p className="text-sm text-muted-foreground">
                                  Ore {booking.session!.sessionTime}
                                  {booking.session!.topic && ` • ${booking.session!.topic}`}
                                </p>
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              {isPast ? (
                                <Badge variant="secondary">Completata</Badge>
                              ) : (
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => cancelMutation.mutate(booking.id)}
                                  disabled={cancelMutation.isPending}
                                  data-testid={`button-cancel-booking-${booking.id}`}
                                >
                                  <CalendarX className="w-4 h-4 mr-1" />
                                  Cancella
                                </Button>
                              )}
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    );
                  })}
              </div>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}
