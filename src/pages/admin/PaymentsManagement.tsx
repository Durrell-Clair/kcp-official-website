import { useEffect, useState } from "react";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { supabase } from "@/integrations/supabase/client";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Search, Loader2 } from "lucide-react";
import { formatPrice } from "@/config/pricing";

interface Payment {
  id: string;
  user_id: string;
  plan_id: string | null;
  amount: number;
  currency: string;
  status: string;
  payment_method: string | null;
  tranzak_request_id: string | null;
  tranzak_transaction_id: string | null;
  created_at: string;
  completed_at: string | null;
  user_email: string | null;
  plan_name: string | null;
}

export default function PaymentsManagement() {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [filteredPayments, setFilteredPayments] = useState<Payment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const fetchPayments = async () => {
      try {
        setIsLoading(true);
        const { data, error } = await supabase
          .from("payments")
          .select(`
            *,
            profiles:user_id (
              email
            ),
            plans:plan_id (
              name,
              display_name
            )
          `)
          .order("created_at", { ascending: false })
          .limit(1000);

        if (error) throw error;

        const formatted = (data || []).map((payment: any) => ({
          ...payment,
          user_email: payment.profiles?.email || null,
          plan_name: payment.plans?.display_name || payment.plans?.name || null,
        }));

        setPayments(formatted);
        setFilteredPayments(formatted);
      } catch (error) {
        console.error("Error fetching payments:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPayments();
  }, []);

  useEffect(() => {
    if (!searchQuery) {
      setFilteredPayments(payments);
      return;
    }

    const query = searchQuery.toLowerCase();
    const filtered = payments.filter(
      (payment) =>
        payment.user_email?.toLowerCase().includes(query) ||
        payment.tranzak_request_id?.toLowerCase().includes(query) ||
        payment.tranzak_transaction_id?.toLowerCase().includes(query) ||
        payment.plan_name?.toLowerCase().includes(query)
    );
    setFilteredPayments(filtered);
  }, [searchQuery, payments]);

  const getStatusBadge = (status: string) => {
    const variants: Record<string, "default" | "secondary" | "destructive" | "outline"> = {
      completed: "default",
      pending: "secondary",
      failed: "destructive",
      cancelled: "outline",
    };
    return <Badge variant={variants[status] || "outline"}>{status}</Badge>;
  };

  const totalRevenue = payments
    .filter((p) => p.status === "completed")
    .reduce((sum, p) => sum + p.amount, 0);

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
        <div className="flex items-center justify-between">
          <div>
            <h1 className="font-display text-3xl font-bold text-foreground mb-2">
              Gestion des paiements
            </h1>
            <p className="text-muted-foreground">
              {payments.length} paiement{payments.length > 1 ? "s" : ""} • Revenus totaux: {formatPrice(totalRevenue)}
            </p>
          </div>
        </div>

        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Rechercher par email, ID transaction ou plan..."
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
                <TableHead>Montant</TableHead>
                <TableHead>Statut</TableHead>
                <TableHead>Méthode</TableHead>
                <TableHead>Transaction ID</TableHead>
                <TableHead>Date</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredPayments.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center text-muted-foreground">
                    Aucun paiement trouvé
                  </TableCell>
                </TableRow>
              ) : (
                filteredPayments.map((payment) => (
                  <TableRow key={payment.id}>
                    <TableCell className="font-medium">{payment.user_email || "—"}</TableCell>
                    <TableCell>{payment.plan_name || "—"}</TableCell>
                    <TableCell>{formatPrice(payment.amount)}</TableCell>
                    <TableCell>{getStatusBadge(payment.status)}</TableCell>
                    <TableCell>{payment.payment_method || "—"}</TableCell>
                    <TableCell className="font-mono text-xs">
                      {payment.tranzak_transaction_id || payment.tranzak_request_id || "—"}
                    </TableCell>
                    <TableCell>
                      {payment.completed_at
                        ? new Date(payment.completed_at).toLocaleDateString("fr-FR")
                        : new Date(payment.created_at).toLocaleDateString("fr-FR")}
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
