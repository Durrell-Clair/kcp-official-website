import { useEffect, useState } from "react";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { getAdminStats, type AdminStats } from "@/services/admin.service";
import { Users, CreditCard, DollarSign, Clock, TrendingUp, Loader2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatPrice } from "@/config/pricing";

export default function AdminDashboard() {
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setIsLoading(true);
        const data = await getAdminStats();
        setStats(data);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Erreur lors du chargement des statistiques");
      } finally {
        setIsLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (isLoading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-64">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      </AdminLayout>
    );
  }

  if (error) {
    return (
      <AdminLayout>
        <div className="text-center py-8">
          <p className="text-destructive">{error}</p>
        </div>
      </AdminLayout>
    );
  }

  if (!stats) {
    return null;
  }

  const statCards = [
    {
      title: "Utilisateurs totaux",
      value: stats.totalUsers.toLocaleString(),
      icon: Users,
      description: `${stats.recentUsers} nouveaux (30 derniers jours)`,
      trend: stats.recentUsers > 0 ? "up" : "neutral",
    },
    {
      title: "Abonnements actifs",
      value: stats.activeSubscriptions.toLocaleString(),
      icon: CreditCard,
      description: "En cours",
      trend: "neutral",
    },
    {
      title: "Revenus totaux",
      value: formatPrice(stats.totalRevenue),
      icon: DollarSign,
      description: "Tous les paiements",
      trend: "neutral",
    },
    {
      title: "Paiements en attente",
      value: stats.pendingPayments.toLocaleString(),
      icon: Clock,
      description: "En attente de confirmation",
      trend: stats.pendingPayments > 0 ? "warning" : "neutral",
    },
  ];

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="font-display text-3xl font-bold text-foreground mb-2">
            Tableau de bord
          </h1>
          <p className="text-muted-foreground">
            Vue d'ensemble de votre plateforme KAMER CASH PME
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {statCards.map((card, index) => {
            const Icon = card.icon;
            return (
              <Card key={index}>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    {card.title}
                  </CardTitle>
                  <Icon className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{card.value}</div>
                  <div className="flex items-center gap-2 mt-1">
                    <p className="text-xs text-muted-foreground">{card.description}</p>
                    {card.trend === "up" && (
                      <TrendingUp className="h-3 w-3 text-primary" />
                    )}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Additional sections can be added here */}
        <div className="grid gap-4 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Activité récente</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Les fonctionnalités d'activité récente seront ajoutées prochainement.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Actions rapides</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Accédez rapidement aux sections principales depuis le menu de navigation.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </AdminLayout>
  );
}
