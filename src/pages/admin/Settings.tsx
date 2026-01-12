import { AdminLayout } from "@/components/admin/AdminLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { getGitHubConfig } from "@/services/github.service";
import { Settings as SettingsIcon, Github, Database, CreditCard } from "lucide-react";

export default function Settings() {
  const githubConfig = getGitHubConfig();

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="font-display text-3xl font-bold text-foreground mb-2">
            Paramètres système
          </h1>
          <p className="text-muted-foreground">
            Configuration et informations sur le système
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          {/* GitHub Configuration */}
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <Github className="w-5 h-5" />
                <CardTitle>Configuration GitHub</CardTitle>
              </div>
              <CardDescription>
                Configuration pour les releases et téléchargements
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {githubConfig ? (
                <>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Propriétaire</span>
                    <Badge variant="outline">{githubConfig.owner}</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Repository</span>
                    <Badge variant="outline">{githubConfig.repo}</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Token</span>
                    <Badge variant={import.meta.env.VITE_GITHUB_TOKEN ? "default" : "secondary"}>
                      {import.meta.env.VITE_GITHUB_TOKEN ? "Configuré" : "Non configuré"}
                    </Badge>
                  </div>
                </>
              ) : (
                <p className="text-sm text-muted-foreground">
                  GitHub n'est pas configuré. Ajoutez VITE_GITHUB_OWNER et VITE_GITHUB_REPO dans
                  les variables d'environnement.
                </p>
              )}
            </CardContent>
          </Card>

          {/* Database Configuration */}
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <Database className="w-5 h-5" />
                <CardTitle>Base de données</CardTitle>
              </div>
              <CardDescription>Configuration Supabase</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">URL Supabase</span>
                <Badge variant="outline" className="font-mono text-xs">
                  {import.meta.env.VITE_SUPABASE_URL
                    ? `${import.meta.env.VITE_SUPABASE_URL.substring(0, 20)}...`
                    : "Non configuré"}
                </Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Clé publique</span>
                <Badge variant={import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY ? "default" : "secondary"}>
                  {import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY ? "Configuré" : "Non configuré"}
                </Badge>
              </div>
            </CardContent>
          </Card>

          {/* Payment Configuration */}
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <CreditCard className="w-5 h-5" />
                <CardTitle>Configuration paiement</CardTitle>
              </div>
              <CardDescription>Configuration Tranzak</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">API URL</span>
                <Badge variant="outline" className="font-mono text-xs">
                  {import.meta.env.VITE_TRANZAK_API_URL
                    ? import.meta.env.VITE_TRANZAK_API_URL.includes("sandbox")
                      ? "Sandbox"
                      : "Production"
                    : "Non configuré"}
                </Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">App ID</span>
                <Badge variant={import.meta.env.VITE_TRANZAK_APP_ID ? "default" : "secondary"}>
                  {import.meta.env.VITE_TRANZAK_APP_ID ? "Configuré" : "Non configuré"}
                </Badge>
              </div>
            </CardContent>
          </Card>

          {/* System Info */}
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <SettingsIcon className="w-5 h-5" />
                <CardTitle>Informations système</CardTitle>
              </div>
              <CardDescription>Version et environnement</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Environnement</span>
                <Badge variant={import.meta.env.MODE === "production" ? "default" : "secondary"}>
                  {import.meta.env.MODE || "development"}
                </Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">URL Application</span>
                <Badge variant="outline" className="font-mono text-xs">
                  {import.meta.env.VITE_APP_URL || window.location.origin}
                </Badge>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Note</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Pour modifier ces paramètres, mettez à jour les variables d'environnement dans votre
              fichier .env (développement) ou dans les paramètres Vercel (production).
            </p>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
}
