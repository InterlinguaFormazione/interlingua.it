import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import {
  DollarSign,
  ShoppingCart,
  Users,
  GraduationCap,
  MessageSquare,
  Mail,
  Star,
  Mic,
  Tag,
  Handshake,
  TrendingUp,
  BarChart3,
  FileText,
  Percent,
  Eye,
  Globe,
  Shield,
  Plus,
  Trash2,
} from "lucide-react";

interface AnalyticsData {
  revenue: {
    total: number;
    thisMonth: number;
    avgOrderValue: number;
    byMonth: Array<{ month: string; revenue: number; orders: number }>;
  };
  orders: {
    total: number;
    thisMonth: number;
    byStatus: Record<string, number>;
    topProducts: Array<{ slug: string; name: string; count: number; revenue: number }>;
    voucherUsage: number;
  };
  speakersCorner: {
    totalSubscribers: number;
    activeSubscribers: number;
    totalSessions: number;
    avgBookingRate: number;
    totalPayments: number;
    totalRevenue: number;
  };
  tests: {
    total: number;
    completed: number;
    completionRate: number;
    byLanguage: Record<string, { total: number; completed: number }>;
    levelDistribution: Record<string, number>;
  };
  engagement: {
    contacts: number;
    recentContacts: Array<{ name: string; email: string; courseInterest: string; date: string }>;
    newsletterTotal: number;
    newsletterActive: number;
    reviews: number;
    reviewsApproved: number;
    reviewsPending: number;
    avgRating: number;
    blogPosts: number;
    blogComments: number;
  };
  vouchers: {
    total: number;
    activeCount: number;
    topVouchers: Array<{ code: string; description: string; usedCount: number; maxUses: number; active: boolean }>;
  };
  conventions: {
    total: number;
    active: number;
    totalRegistrations: number;
  };
  pageViewStats: {
    totalViews: number;
    uniqueVisitors: number;
    topPages: Array<{ path: string; count: number }>;
    viewsByDay: Array<{ day: string; count: number }>;
    topReferrers: Array<{ source: string; count: number }>;
  };
}

function StatCard({ title, value, subtitle, icon: Icon, color = "blue" }: {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: any;
  color?: string;
}) {
  const colorMap: Record<string, string> = {
    blue: "bg-blue-50 text-blue-600",
    green: "bg-green-50 text-green-600",
    purple: "bg-purple-50 text-purple-600",
    orange: "bg-orange-50 text-orange-600",
    red: "bg-red-50 text-red-600",
    cyan: "bg-cyan-50 text-cyan-600",
    pink: "bg-pink-50 text-pink-600",
    yellow: "bg-yellow-50 text-yellow-600",
  };
  return (
    <Card data-testid={`stat-card-${title.toLowerCase().replace(/\s+/g, "-")}`}>
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-muted-foreground">{title}</p>
            <p className="text-2xl font-bold mt-1">{value}</p>
            {subtitle && <p className="text-xs text-muted-foreground mt-1">{subtitle}</p>}
          </div>
          <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${colorMap[color] || colorMap.blue}`}>
            <Icon className="w-5 h-5" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function BarChartSimple({ data, maxVal }: { data: Array<{ label: string; value: number; secondary?: string }>; maxVal: number }) {
  if (maxVal === 0) return <p className="text-sm text-muted-foreground">Nessun dato disponibile</p>;
  return (
    <div className="space-y-2">
      {data.map((item, i) => (
        <div key={i} className="flex items-center gap-3">
          <span className="text-xs text-muted-foreground w-16 text-right shrink-0">{item.label}</span>
          <div className="flex-1 h-6 bg-muted rounded-full overflow-hidden">
            <div
              className="h-full bg-blue-500 rounded-full transition-all duration-500"
              style={{ width: `${Math.max((item.value / maxVal) * 100, 2)}%` }}
            />
          </div>
          <span className="text-xs font-medium w-20 shrink-0">{item.secondary || item.value.toLocaleString("it-IT")}</span>
        </div>
      ))}
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  const variants: Record<string, string> = {
    completed: "bg-green-100 text-green-700",
    pending: "bg-yellow-100 text-yellow-700",
    cancelled: "bg-red-100 text-red-700",
    refunded: "bg-gray-100 text-gray-700",
  };
  const labels: Record<string, string> = {
    completed: "Completato",
    pending: "In attesa",
    cancelled: "Annullato",
    refunded: "Rimborsato",
  };
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${variants[status] || "bg-gray-100 text-gray-700"}`}>
      {labels[status] || status}
    </span>
  );
}

const LANG_LABELS: Record<string, string> = {
  english: "Inglese",
  italian: "Italiano",
  french: "Francese",
  german: "Tedesco",
  spanish: "Spagnolo",
};

const LEVEL_ORDER = ["Pre-A1", "A1", "A2", "B1", "B2", "C1", "C2"];

export function AnalyticsTabContent({ token }: { token: string }) {
  const { data, isLoading, isError } = useQuery<AnalyticsData>({
    queryKey: ["/api/admin/analytics"],
    queryFn: async () => {
      const res = await fetch("/api/admin/analytics", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Errore nel caricamento analytics");
      return res.json();
    },
  });

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <Card key={i}>
              <CardContent className="p-4">
                <div className="animate-pulse space-y-2">
                  <div className="h-3 bg-muted rounded w-20" />
                  <div className="h-7 bg-muted rounded w-16" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <Card>
        <CardContent className="p-8 text-center">
          <p className="text-destructive font-medium">Errore nel caricamento delle statistiche</p>
          <p className="text-sm text-muted-foreground mt-2">Prova a ricaricare la pagina o effettua nuovamente l'accesso.</p>
        </CardContent>
      </Card>
    );
  }

  if (!data) return null;

  const maxMonthlyRevenue = Math.max(...(data.revenue.byMonth.map(m => m.revenue)), 1);
  const maxProductRevenue = data.orders.topProducts.length > 0 ? Math.max(...data.orders.topProducts.map(p => p.revenue)) : 1;
  const maxTestLang = Math.max(...Object.values(data.tests.byLanguage).map(v => v.total), 1);
  const sortedLevels = LEVEL_ORDER.filter(l => data.tests.levelDistribution[l] !== undefined);
  const otherLevels = Object.keys(data.tests.levelDistribution).filter(l => !LEVEL_ORDER.includes(l));
  const allLevels = [...sortedLevels, ...otherLevels];
  const maxLevelCount = Math.max(...Object.values(data.tests.levelDistribution), 1);

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4" data-testid="analytics-overview-cards">
        <StatCard
          title="Fatturato Totale"
          value={`€${data.revenue.total.toLocaleString("it-IT", { minimumFractionDigits: 2 })}`}
          subtitle={`Questo mese: €${data.revenue.thisMonth.toLocaleString("it-IT", { minimumFractionDigits: 2 })}`}
          icon={DollarSign}
          color="green"
        />
        <StatCard
          title="Ordini Totali"
          value={data.orders.total}
          subtitle={`Questo mese: ${data.orders.thisMonth}`}
          icon={ShoppingCart}
          color="blue"
        />
        <StatCard
          title="SC Attivi"
          value={data.speakersCorner.activeSubscribers}
          subtitle={`${data.speakersCorner.totalSubscribers} totali`}
          icon={Mic}
          color="purple"
        />
        <StatCard
          title="Test Completati"
          value={data.tests.completed}
          subtitle={`${data.tests.completionRate}% completamento`}
          icon={GraduationCap}
          color="orange"
        />
        <StatCard
          title="Contatti"
          value={data.engagement.contacts}
          icon={MessageSquare}
          color="cyan"
        />
        <StatCard
          title="Newsletter"
          value={data.engagement.newsletterActive}
          subtitle={`${data.engagement.newsletterTotal} totali`}
          icon={Mail}
          color="pink"
        />
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <Card data-testid="card-revenue-chart">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-green-600" />
              Fatturato Mensile
            </CardTitle>
            <CardDescription>Ultimi 12 mesi — ordini completati</CardDescription>
          </CardHeader>
          <CardContent>
            {data.revenue.byMonth.length === 0 ? (
              <p className="text-sm text-muted-foreground">Nessun ordine completato</p>
            ) : (
              <BarChartSimple
                data={data.revenue.byMonth.map(m => ({
                  label: m.month.slice(5),
                  value: m.revenue,
                  secondary: `€${m.revenue.toLocaleString("it-IT", { minimumFractionDigits: 0 })} (${m.orders})`,
                }))}
                maxVal={maxMonthlyRevenue}
              />
            )}
            <div className="mt-4 pt-4 border-t flex justify-between text-sm">
              <span className="text-muted-foreground">Ordine medio</span>
              <span className="font-medium">€{data.revenue.avgOrderValue.toLocaleString("it-IT", { minimumFractionDigits: 2 })}</span>
            </div>
          </CardContent>
        </Card>

        <Card data-testid="card-top-products">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-blue-600" />
              Prodotti Più Venduti
            </CardTitle>
            <CardDescription>Top 10 per fatturato</CardDescription>
          </CardHeader>
          <CardContent>
            {data.orders.topProducts.length === 0 ? (
              <p className="text-sm text-muted-foreground">Nessuna vendita</p>
            ) : (
              <div className="space-y-3">
                {data.orders.topProducts.map((p, i) => (
                  <div key={p.slug} className="flex items-center gap-3" data-testid={`row-top-product-${i}`}>
                    <span className="text-xs font-bold text-muted-foreground w-5">{i + 1}</span>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">{p.name}</p>
                      <p className="text-xs text-muted-foreground">{p.count} vendite</p>
                    </div>
                    <span className="text-sm font-semibold text-green-600">€{p.revenue.toLocaleString("it-IT", { minimumFractionDigits: 0 })}</span>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <Card data-testid="card-order-status">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ShoppingCart className="w-5 h-5 text-blue-600" />
              Ordini per Stato
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {Object.entries(data.orders.byStatus).map(([status, count]) => (
                <div key={status} className="flex items-center justify-between">
                  <StatusBadge status={status} />
                  <span className="text-sm font-semibold">{count}</span>
                </div>
              ))}
            </div>
            <div className="mt-4 pt-4 border-t flex justify-between text-sm">
              <span className="text-muted-foreground flex items-center gap-1">
                <Tag className="w-3 h-3" /> Ordini con voucher
              </span>
              <span className="font-medium">{data.orders.voucherUsage}</span>
            </div>
          </CardContent>
        </Card>

        <Card data-testid="card-speakers-corner">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Mic className="w-5 h-5 text-purple-600" />
              Speaker's Corner
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Iscritti attivi</span>
                <span className="font-semibold">{data.speakersCorner.activeSubscribers}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Iscritti totali</span>
                <span className="font-semibold">{data.speakersCorner.totalSubscribers}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Sessioni totali</span>
                <span className="font-semibold">{data.speakersCorner.totalSessions}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Tasso prenotazione medio</span>
                <span className="font-semibold">{data.speakersCorner.avgBookingRate}%</span>
              </div>
              <div className="mt-3 pt-3 border-t flex justify-between text-sm">
                <span className="text-muted-foreground">Fatturato SC</span>
                <span className="font-semibold text-green-600">€{data.speakersCorner.totalRevenue.toLocaleString("it-IT", { minimumFractionDigits: 2 })}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Pagamenti completati</span>
                <span className="font-semibold">{data.speakersCorner.totalPayments}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card data-testid="card-engagement">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Star className="w-5 h-5 text-yellow-600" />
              Engagement
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Recensioni</span>
                <div className="flex items-center gap-2">
                  <span className="font-semibold">{data.engagement.reviewsApproved}</span>
                  {data.engagement.reviewsPending > 0 && (
                    <Badge variant="secondary" className="text-xs">{data.engagement.reviewsPending} in attesa</Badge>
                  )}
                </div>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Valutazione media</span>
                <span className="font-semibold flex items-center gap-1">
                  {data.engagement.avgRating > 0 ? (
                    <>
                      <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                      {data.engagement.avgRating}/5
                    </>
                  ) : "—"}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Articoli blog</span>
                <span className="font-semibold">{data.engagement.blogPosts}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Commenti blog</span>
                <span className="font-semibold">{data.engagement.blogComments}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <Card data-testid="card-tests-language">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <GraduationCap className="w-5 h-5 text-orange-600" />
              Test per Lingua
            </CardTitle>
            <CardDescription>
              {data.tests.total} totali — {data.tests.completionRate}% completati
            </CardDescription>
          </CardHeader>
          <CardContent>
            {Object.keys(data.tests.byLanguage).length === 0 ? (
              <p className="text-sm text-muted-foreground">Nessun test effettuato</p>
            ) : (
              <BarChartSimple
                data={Object.entries(data.tests.byLanguage)
                  .sort((a, b) => b[1].total - a[1].total)
                  .map(([lang, counts]) => ({
                    label: LANG_LABELS[lang] || lang,
                    value: counts.total,
                    secondary: `${counts.completed}/${counts.total} completati`,
                  }))}
                maxVal={maxTestLang}
              />
            )}
          </CardContent>
        </Card>

        <Card data-testid="card-tests-levels">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Percent className="w-5 h-5 text-orange-600" />
              Distribuzione Livelli
            </CardTitle>
            <CardDescription>Livelli finali dei test completati</CardDescription>
          </CardHeader>
          <CardContent>
            {allLevels.length === 0 ? (
              <p className="text-sm text-muted-foreground">Nessun test completato</p>
            ) : (
              <BarChartSimple
                data={allLevels.map(level => ({
                  label: level,
                  value: data.tests.levelDistribution[level],
                }))}
                maxVal={maxLevelCount}
              />
            )}
          </CardContent>
        </Card>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <Card data-testid="card-voucher-stats">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Tag className="w-5 h-5 text-green-600" />
              Voucher Più Utilizzati
            </CardTitle>
            <CardDescription>
              {data.vouchers.activeCount} attivi su {data.vouchers.total} totali
            </CardDescription>
          </CardHeader>
          <CardContent>
            {data.vouchers.topVouchers.length === 0 ? (
              <p className="text-sm text-muted-foreground">Nessun voucher creato</p>
            ) : (
              <div className="space-y-3">
                {data.vouchers.topVouchers.map((v, i) => (
                  <div key={i} className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2 min-w-0">
                      <code className="text-xs bg-muted px-1.5 py-0.5 rounded font-mono">{v.code}</code>
                      {!v.active && <Badge variant="secondary" className="text-xs">Disattivo</Badge>}
                    </div>
                    <span className="text-sm font-medium shrink-0">
                      {v.usedCount}{v.maxUses ? `/${v.maxUses}` : ""} utilizzi
                    </span>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <Card data-testid="card-conventions">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Handshake className="w-5 h-5 text-cyan-600" />
              Convenzioni
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Convenzioni attive</span>
                <span className="font-semibold">{data.conventions.active}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Convenzioni totali</span>
                <span className="font-semibold">{data.conventions.total}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Registrazioni totali</span>
                <span className="font-semibold">{data.conventions.totalRegistrations}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {data.engagement.recentContacts.length > 0 && (
        <Card data-testid="card-recent-contacts">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="w-5 h-5 text-cyan-600" />
              Ultimi Contatti
            </CardTitle>
            <CardDescription>Le 5 richieste più recenti</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {data.engagement.recentContacts.map((c, i) => (
                <div key={i} className="flex items-center justify-between gap-4 py-2 border-b last:border-0" data-testid={`row-recent-contact-${i}`}>
                  <div className="min-w-0">
                    <p className="text-sm font-medium truncate">{c.name}</p>
                    <p className="text-xs text-muted-foreground truncate">{c.email}</p>
                  </div>
                  {c.courseInterest && (
                    <Badge variant="outline" className="shrink-0 text-xs">{c.courseInterest}</Badge>
                  )}
                  <span className="text-xs text-muted-foreground shrink-0">
                    {c.date ? new Date(c.date).toLocaleDateString("it-IT") : "—"}
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      <Card data-testid="card-page-views">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Eye className="w-5 h-5 text-blue-600" />
            Visite al Sito
          </CardTitle>
          <CardDescription>
            Ultimi 30 giorni — {data.pageViewStats.totalViews} visite, {data.pageViewStats.uniqueVisitors} visitatori unici
          </CardDescription>
        </CardHeader>
        <CardContent>
          {data.pageViewStats.viewsByDay.length === 0 ? (
            <p className="text-sm text-muted-foreground">Nessuna visita registrata ancora</p>
          ) : (
            <BarChartSimple
              data={data.pageViewStats.viewsByDay.map(d => ({
                label: d.day.slice(5),
                value: d.count,
              }))}
              maxVal={Math.max(...data.pageViewStats.viewsByDay.map(d => d.count), 1)}
            />
          )}
        </CardContent>
      </Card>

      <div className="grid lg:grid-cols-3 gap-6">
        <Card data-testid="card-top-referrers">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-green-600" />
              Provenienza Visitatori
            </CardTitle>
            <CardDescription>Da dove arrivano i visitatori</CardDescription>
          </CardHeader>
          <CardContent>
            {data.pageViewStats.topReferrers.length === 0 ? (
              <p className="text-sm text-muted-foreground">Nessun dato disponibile ancora</p>
            ) : (
              <div className="space-y-2 max-h-80 overflow-y-auto">
                {data.pageViewStats.topReferrers.map((r, i) => {
                  const isSearch = /google|bing|yahoo|duckduckgo|baidu|yandex/.test(r.source);
                  const isSocial = /facebook|instagram|linkedin|twitter|tiktok|youtube|whatsapp|t\.co/.test(r.source);
                  const isDirect = r.source === "Diretto / Bookmark";
                  const tagColor = isSearch ? "bg-blue-100 text-blue-700" : isSocial ? "bg-pink-100 text-pink-700" : isDirect ? "bg-gray-100 text-gray-700" : "bg-green-100 text-green-700";
                  const tagLabel = isSearch ? "Ricerca" : isSocial ? "Social" : isDirect ? "Diretto" : "Referral";
                  return (
                    <div key={i} className="flex items-center justify-between gap-2 py-1.5 border-b last:border-0" data-testid={`row-referrer-${i}`}>
                      <div className="flex items-center gap-2 min-w-0 flex-1">
                        <span className={`text-[10px] font-medium px-1.5 py-0.5 rounded ${tagColor} shrink-0`}>{tagLabel}</span>
                        <span className="text-sm truncate">{r.source}</span>
                      </div>
                      <Badge variant="secondary" className="shrink-0">{r.count}</Badge>
                    </div>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>

        <Card data-testid="card-top-pages" className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Globe className="w-5 h-5 text-blue-600" />
              Pagine Più Visitate
            </CardTitle>
            <CardDescription>Top 20 — ultimi 30 giorni</CardDescription>
          </CardHeader>
          <CardContent>
            {data.pageViewStats.topPages.length === 0 ? (
              <p className="text-sm text-muted-foreground">Nessuna visita registrata ancora</p>
            ) : (
              <div className="space-y-2 max-h-80 overflow-y-auto">
                {data.pageViewStats.topPages.map((p, i) => (
                  <div key={i} className="flex items-center justify-between gap-2 py-1">
                    <span className="text-sm truncate flex-1 font-mono text-muted-foreground">{p.path}</span>
                    <Badge variant="secondary" className="shrink-0">{p.count}</Badge>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <ExcludedIpsSection token={token} />
    </div>
  );
}

function ExcludedIpsSection({ token }: { token: string }) {
  const { toast } = useToast();
  const [newIp, setNewIp] = useState("");
  const [newLabel, setNewLabel] = useState("");

  const { data: excludedIps = [] } = useQuery<Array<{ id: number; ipAddress: string; label: string | null; createdAt: string }>>({
    queryKey: ["/api/admin/excluded-ips"],
    queryFn: async () => {
      const res = await fetch("/api/admin/excluded-ips", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Errore");
      return res.json();
    },
  });

  const { data: myIpData } = useQuery<{ ip: string }>({
    queryKey: ["/api/admin/my-ip"],
    queryFn: async () => {
      const res = await fetch("/api/admin/my-ip", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Errore");
      return res.json();
    },
  });

  const addIpMutation = useMutation({
    mutationFn: async ({ ipAddress, label }: { ipAddress: string; label: string }) => {
      const res = await fetch("/api/admin/excluded-ips", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ ipAddress, label }),
      });
      if (!res.ok) throw new Error("Errore");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/excluded-ips"] });
      queryClient.invalidateQueries({ queryKey: ["/api/admin/analytics"] });
      setNewIp("");
      setNewLabel("");
      toast({ title: "IP aggiunto", description: "L'indirizzo IP è stato escluso dalle statistiche." });
    },
  });

  const removeIpMutation = useMutation({
    mutationFn: async (id: number) => {
      const res = await fetch(`/api/admin/excluded-ips/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Errore");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/excluded-ips"] });
      queryClient.invalidateQueries({ queryKey: ["/api/admin/analytics"] });
      toast({ title: "IP rimosso", description: "L'indirizzo IP non è più escluso." });
    },
  });

  return (
    <Card data-testid="card-excluded-ips">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Shield className="w-5 h-5 text-red-600" />
          IP Esclusi dalle Statistiche
        </CardTitle>
        <CardDescription>
          Le visite e attività da questi indirizzi IP non vengono conteggiate nelle statistiche.
          {myIpData?.ip && (
            <span className="block mt-1">
              Il tuo IP attuale: <code className="bg-muted px-1.5 py-0.5 rounded text-xs font-mono">{myIpData.ip}</code>
            </span>
          )}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col sm:flex-row gap-2 mb-4">
          <Input
            placeholder="Indirizzo IP (es. 192.168.1.1)"
            value={newIp}
            onChange={(e) => setNewIp(e.target.value)}
            className="flex-1"
            data-testid="input-new-excluded-ip"
          />
          <Input
            placeholder="Etichetta (es. Ufficio)"
            value={newLabel}
            onChange={(e) => setNewLabel(e.target.value)}
            className="flex-1"
            data-testid="input-new-excluded-label"
          />
          <Button
            onClick={() => {
              if (!newIp.trim()) return;
              addIpMutation.mutate({ ipAddress: newIp.trim(), label: newLabel.trim() });
            }}
            disabled={!newIp.trim() || addIpMutation.isPending}
            data-testid="button-add-excluded-ip"
          >
            <Plus className="w-4 h-4 mr-1" />
            Aggiungi
          </Button>
        </div>

        {myIpData?.ip && !excludedIps.some(e => e.ipAddress === myIpData.ip) && (
          <Button
            variant="outline"
            size="sm"
            className="mb-4"
            onClick={() => addIpMutation.mutate({ ipAddress: myIpData.ip, label: "Il mio IP" })}
            disabled={addIpMutation.isPending}
            data-testid="button-add-my-ip"
          >
            <Shield className="w-3 h-3 mr-1" />
            Escludi il mio IP attuale ({myIpData.ip})
          </Button>
        )}

        {excludedIps.length === 0 ? (
          <p className="text-sm text-muted-foreground">Nessun IP escluso. Aggiungi il tuo IP aziendale per filtrare le tue visite.</p>
        ) : (
          <div className="space-y-2">
            {excludedIps.map((ip) => (
              <div key={ip.id} className="flex items-center justify-between gap-2 py-2 border-b last:border-0" data-testid={`row-excluded-ip-${ip.id}`}>
                <div className="flex items-center gap-3">
                  <code className="text-sm font-mono bg-muted px-2 py-0.5 rounded">{ip.ipAddress}</code>
                  {ip.label && <span className="text-sm text-muted-foreground">{ip.label}</span>}
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-destructive hover:text-destructive hover:bg-destructive/10"
                  onClick={() => removeIpMutation.mutate(ip.id)}
                  disabled={removeIpMutation.isPending}
                  data-testid={`button-remove-ip-${ip.id}`}
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
