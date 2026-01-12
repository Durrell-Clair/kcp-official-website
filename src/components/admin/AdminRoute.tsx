import { ReactNode, useEffect } from "react";
import { Navigate } from "react-router-dom";
import { useAdmin } from "@/hooks/useAdmin";
import { useAuth } from "@/contexts/AuthContext";
import { Loader2, AlertCircle } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

interface AdminRouteProps {
  children: ReactNode;
}

/**
 * Composant de protection des routes admin
 * Redirige vers /dashboard si l'utilisateur n'est pas admin
 */
export function AdminRoute({ children }: AdminRouteProps) {
  const { user } = useAuth();
  const { isAdmin, isSuperAdmin, isLoading, error, adminProfile, refetch } = useAdmin();

  // Log de débogage en mode développement
  useEffect(() => {
    if (import.meta.env.DEV) {
      console.log('[AdminRoute] État:', {
        user: user?.id,
        isAdmin,
        isSuperAdmin,
        isLoading,
        error: error?.message,
        adminProfile,
      });
    }
  }, [user, isAdmin, isSuperAdmin, isLoading, error, adminProfile]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-muted/30">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin text-primary mx-auto mb-4" />
          <p className="text-muted-foreground">Vérification des permissions...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-muted/30 p-4">
        <Card className="max-w-md w-full">
          <CardHeader>
            <div className="flex items-center gap-2">
              <AlertCircle className="w-5 h-5 text-destructive" />
              <CardTitle>Erreur de vérification</CardTitle>
            </div>
            <CardDescription>
              Une erreur est survenue lors de la vérification de vos permissions.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground">
              {error.message}
            </p>
            {import.meta.env.DEV && (
              <div className="text-xs text-muted-foreground bg-muted p-3 rounded-lg">
                <strong>Debug:</strong> {error.message}
                {adminProfile && (
                  <pre className="mt-2 text-xs overflow-auto">
                    {JSON.stringify(adminProfile, null, 2)}
                  </pre>
                )}
              </div>
            )}
            <div className="flex gap-2">
              <Button variant="outline" onClick={() => refetch()}>
                Réessayer
              </Button>
              <Button variant="ghost" asChild>
                <Link to="/dashboard">Retour au tableau de bord</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-muted/30 p-4">
        <Card className="max-w-md w-full">
          <CardHeader>
            <div className="flex items-center gap-2">
              <AlertCircle className="w-5 h-5 text-destructive" />
              <CardTitle>Accès refusé</CardTitle>
            </div>
            <CardDescription>
              Vous n'avez pas les permissions nécessaires pour accéder à cette page.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Cette section est réservée aux administrateurs. Si vous pensez que c'est une erreur,
              contactez un administrateur système.
            </p>
            {import.meta.env.DEV && (
              <div className="text-xs text-muted-foreground bg-muted p-3 rounded-lg">
                <strong>Debug:</strong>
                <ul className="mt-2 space-y-1">
                  <li>User ID: {user.id}</li>
                  <li>Email: {user.email}</li>
                  <li>isAdmin: {String(isAdmin)}</li>
                  <li>isSuperAdmin: {String(isSuperAdmin)}</li>
                  {adminProfile && (
                    <li>
                      Profile: {JSON.stringify({
                        is_admin: adminProfile.is_admin,
                        is_super_admin: adminProfile.is_super_admin,
                      })}
                    </li>
                  )}
                </ul>
              </div>
            )}
            <Button variant="outline" className="w-full" asChild>
              <Link to="/dashboard">Retour au tableau de bord</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return <>{children}</>;
}
