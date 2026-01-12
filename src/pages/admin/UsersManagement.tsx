import { useEffect, useState } from "react";
import { AdminLayout } from "@/components/admin/AdminLayout";
import {
  getAllUsers,
  updateUserAdminStatus,
  type UserWithSubscription,
} from "@/services/admin.service";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Search, Shield, ShieldOff, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useAdmin } from "@/hooks/useAdmin";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

export default function UsersManagement() {
  const [users, setUsers] = useState<UserWithSubscription[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<UserWithSubscription[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedUser, setSelectedUser] = useState<UserWithSubscription | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { toast } = useToast();
  const { isSuperAdmin } = useAdmin();

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setIsLoading(true);
        const data = await getAllUsers();
        setUsers(data);
        setFilteredUsers(data);
      } catch (error) {
        toast({
          title: "Erreur",
          description: error instanceof Error ? error.message : "Erreur lors du chargement des utilisateurs",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchUsers();
  }, [toast]);

  useEffect(() => {
    if (!searchQuery) {
      setFilteredUsers(users);
      return;
    }

    const query = searchQuery.toLowerCase();
    const filtered = users.filter(
      (user) =>
        user.email?.toLowerCase().includes(query) ||
        user.full_name?.toLowerCase().includes(query)
    );
    setFilteredUsers(filtered);
  }, [searchQuery, users]);

  const handleToggleAdmin = async (user: UserWithSubscription) => {
    if (!isSuperAdmin) {
      toast({
        title: "Permission refusée",
        description: "Seul un super administrateur peut modifier les permissions admin",
        variant: "destructive",
      });
      return;
    }

    setSelectedUser(user);
    setIsDialogOpen(true);
  };

  const confirmToggleAdmin = async () => {
    if (!selectedUser) return;

    try {
      const newIsAdmin = !selectedUser.is_admin;
      await updateUserAdminStatus(selectedUser.user_id, newIsAdmin, false);

      // Update local state
      setUsers((prev) =>
        prev.map((u) =>
          u.user_id === selectedUser.user_id
            ? { ...u, is_admin: newIsAdmin }
            : u
        )
      );
      setFilteredUsers((prev) =>
        prev.map((u) =>
          u.user_id === selectedUser.user_id
            ? { ...u, is_admin: newIsAdmin }
            : u
        )
      );

      toast({
        title: "Succès",
        description: `L'utilisateur est maintenant ${newIsAdmin ? "admin" : "utilisateur normal"}`,
      });

      setIsDialogOpen(false);
      setSelectedUser(null);
    } catch (error) {
      toast({
        title: "Erreur",
        description: error instanceof Error ? error.message : "Erreur lors de la mise à jour",
        variant: "destructive",
      });
    }
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
        <div className="flex items-center justify-between">
          <div>
            <h1 className="font-display text-3xl font-bold text-foreground mb-2">
              Gestion des utilisateurs
            </h1>
            <p className="text-muted-foreground">
              {users.length} utilisateur{users.length > 1 ? "s" : ""} au total
            </p>
          </div>
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Rechercher par email ou nom..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>

        {/* Table */}
        <div className="border rounded-lg bg-background">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Email</TableHead>
                <TableHead>Nom</TableHead>
                <TableHead>Statut</TableHead>
                <TableHead>Abonnement</TableHead>
                <TableHead>Paiements</TableHead>
                <TableHead>Inscription</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredUsers.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center text-muted-foreground">
                    Aucun utilisateur trouvé
                  </TableCell>
                </TableRow>
              ) : (
                filteredUsers.map((user) => (
                  <TableRow key={user.user_id}>
                    <TableCell className="font-medium">{user.email}</TableCell>
                    <TableCell>{user.full_name || "—"}</TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        {user.is_super_admin && (
                          <Badge variant="default">Super Admin</Badge>
                        )}
                        {user.is_admin && !user.is_super_admin && (
                          <Badge variant="secondary">Admin</Badge>
                        )}
                        {!user.is_admin && !user.is_super_admin && (
                          <Badge variant="outline">Utilisateur</Badge>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      {user.subscription ? (
                        <Badge
                          variant={
                            user.subscription.status === "active"
                              ? "default"
                              : "secondary"
                          }
                        >
                          {user.subscription.plan_name || user.subscription.status}
                        </Badge>
                      ) : (
                        <span className="text-muted-foreground">—</span>
                      )}
                    </TableCell>
                    <TableCell>{user.payment_count || 0}</TableCell>
                    <TableCell>
                      {new Date(user.created_at).toLocaleDateString("fr-FR")}
                    </TableCell>
                    <TableCell className="text-right">
                      {isSuperAdmin && !user.is_super_admin && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleToggleAdmin(user)}
                        >
                          {user.is_admin ? (
                            <>
                              <ShieldOff className="w-4 h-4 mr-2" />
                              Retirer admin
                            </>
                          ) : (
                            <>
                              <Shield className="w-4 h-4 mr-2" />
                              Promouvoir admin
                            </>
                          )}
                        </Button>
                      )}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>

        {/* Confirmation Dialog */}
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Confirmer la modification</DialogTitle>
              <DialogDescription>
                {selectedUser && (
                  <>
                    Êtes-vous sûr de vouloir{" "}
                    {selectedUser.is_admin
                      ? "retirer les droits admin"
                      : "promouvoir en admin"}{" "}
                    à {selectedUser.email} ?
                  </>
                )}
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                Annuler
              </Button>
              <Button onClick={confirmToggleAdmin}>Confirmer</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </AdminLayout>
  );
}
