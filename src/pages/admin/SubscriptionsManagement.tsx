import { useEffect, useState } from "react";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { supabase } from "@/integrations/supabase/client";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Search, Loader2 } from "lucide-react";
import { formatPrice } from "@/config/pricing";

interface Subscription {
  id: string;
  user_id: string;
  status: string;
  plan_name: string | null;
  plan_id: string | null;
  start_date: string | null;
  end_date: string | null;
  amount: number;
  currency: string;
  created_at: string;
  user_email: string | null;
  user_name: string | null;
}

export default function SubscriptionsManagement() {
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
  const [filteredSubscriptions, setFilteredSubscriptions] = useState<Subscription[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const fetchSubscriptions = async () => {
      try {
        setIsLoading(true);
        const { data, error } = await supabase
          .from("subscriptions")
          .select(`
            *,
            profiles:user_id (
              email,
              full_name
            )
          `)
          .order("created_at", { ascending: false });

        if (error) throw error;

        const formatted = (data || []).map((sub: any) => ({
          ...sub,
          user_email: sub.profiles?.email || null,
          user_name: sub.profiles?.full_name || null,
        }));

        setSubscriptions(formatted);
        setFilteredSubscriptions(formatted);
      } catch (error) {
        console.error("Error fetching subscriptions:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchSubscriptions();
  }, []);

  useEffect(() => {
    if (!searchQuery) {
      setFilteredSubscriptions(subscriptions);
      return;
    }

    const query = searchQuery.toLowerCase();
    const filtered = subscriptions.filter(
      (sub) =>
        sub.user_email?.toLowerCase().includes(query) ||
        sub.user_name?.toLowerCase().includes(query) ||
        sub.plan_name?.toLowerCase().includes(query)
    );
    setFilteredSubscriptions(filtered);
  }, [searchQuery, subscriptions]);

  const getStatusBadge = (status: string) => {
    const variants: Record<string, "default" | "secondary" | "destructive" | "outline"> = {
      active: "default",
      pending: "secondary",
      expired: "destructive",
      cancelled: "outline",
    };
    return <Badge variant={variants[status] || "outline"}>{status}</Badge>;
  };

  if (isLoading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-64">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="font-display text-3xl font-bold text-foreground mb-2">
            Gestion des abonnements
          </h1>
          <p className="text-muted-foreground">
            {subscriptions.length} abonnement{subscriptions.length > 1 ? "s" : ""} au total
          </p>
        </div>

        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Rechercher par email, nom ou plan..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>

        <div className="border rounded-lg bg-background">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Utilisateur</TableHead>
                <TableHead>Plan</TableHead>
                <TableHead>Statut</TableHead>
                <TableHead>Montant</TableHead>
                <TableHead>Début</TableHead>
                <TableHead>Fin</TableHead>
                <TableHead>Créé le</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredSubscriptions.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center text-muted-foreground">
                    Aucun abonnement trouvé
                  </TableCell>
                </TableRow>
              ) : (
                filteredSubscriptions.map((sub) => (
                  <TableRow key={sub.id}>
                    <TableCell>
                      <div>
                        <div className="font-medium">{sub.user_email || "—"}</div>
                        {sub.user_name && (
                          <div className="text-sm text-muted-foreground">{sub.user_name}</div>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>{sub.plan_name || "—"}</TableCell>
                    <TableCell>{getStatusBadge(sub.status)}</TableCell>
                    <TableCell>{formatPrice(sub.amount)}</TableCell>
                    <TableCell>
                      {sub.start_date
                        ? new Date(sub.start_date).toLocaleDateString("fr-FR")
                        : "—"}
                    </TableCell>
                    <TableCell>
                      {sub.end_date
                        ? new Date(sub.end_date).toLocaleDateString("fr-FR")
                        : "—"}
                    </TableCell>
                    <TableCell>
                      {new Date(sub.created_at).toLocaleDateString("fr-FR")}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    </AdminLayout>
  );
}
