import { useEffect, useState } from "react";
import { AdminLayout } from "@/components/admin/AdminLayout";
import {
  getFormattedReleases,
  getGitHubConfig,
  formatFileSize,
  type ReleaseInfo,
} from "@/services/github.service";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Download, Loader2, ExternalLink, AlertCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function DownloadsManagement() {
  const [releases, setReleases] = useState<ReleaseInfo[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    const fetchReleases = async () => {
      try {
        setIsLoading(true);
        setError(null);

        const config = getGitHubConfig();
        if (!config) {
          setError(
            "Configuration GitHub manquante. Veuillez configurer VITE_GITHUB_OWNER et VITE_GITHUB_REPO dans les variables d'environnement."
          );
          return;
        }

        const data = await getFormattedReleases(config.owner, config.repo);
        setReleases(data);
      } catch (err) {
        const errorMessage =
          err instanceof Error
            ? err.message
            : "Erreur lors du chargement des releases";
        setError(errorMessage);
        toast({
          title: "Erreur",
          description: errorMessage,
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchReleases();
  }, [toast]);

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
        <div className="space-y-6">
          <div>
            <h1 className="font-display text-3xl font-bold text-foreground mb-2">
              Gestion des téléchargements
            </h1>
          </div>
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <AlertCircle className="w-5 h-5 text-destructive" />
                <CardTitle>Erreur de configuration</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">{error}</p>
              <p className="text-sm text-muted-foreground mt-4">
                Pour configurer GitHub Releases, ajoutez ces variables dans votre fichier .env :
              </p>
              <pre className="mt-2 p-4 bg-muted rounded-lg text-sm">
                {`VITE_GITHUB_OWNER=votre-username
VITE_GITHUB_REPO=votre-repo
VITE_GITHUB_TOKEN=votre-token (optionnel)`}
              </pre>
            </CardContent>
          </Card>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="font-display text-3xl font-bold text-foreground mb-2">
            Gestion des téléchargements
          </h1>
          <p className="text-muted-foreground">
            {releases.length} version{releases.length > 1 ? "s" : ""} disponible
            {releases.length > 1 ? "s" : ""}
          </p>
        </div>

        {releases.length === 0 ? (
          <Card>
            <CardContent className="py-8 text-center">
              <p className="text-muted-foreground">
                Aucune release disponible pour le moment.
              </p>
              <p className="text-sm text-muted-foreground mt-2">
                Créez une release sur GitHub pour qu'elle apparaisse ici.
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4">
            {releases.map((release) => (
              <Card key={release.version}>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <CardTitle>{release.name}</CardTitle>
                        {release.isPrerelease && (
                          <Badge variant="secondary">Pré-release</Badge>
                        )}
                      </div>
                      <CardDescription>
                        Version {release.version} • Publié le{" "}
                        {new Date(release.publishedAt).toLocaleDateString("fr-FR")}
                      </CardDescription>
                    </div>
                    <Badge variant="outline">
                      {release.totalDownloads.toLocaleString()} téléchargement
                      {release.totalDownloads > 1 ? "s" : ""}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  {release.description && (
                    <p className="text-sm text-muted-foreground mb-4 whitespace-pre-line">
                      {release.description}
                    </p>
                  )}

                  <div className="grid gap-3 md:grid-cols-2">
                    {release.windowsFile && (
                      <div className="flex items-center justify-between p-3 border rounded-lg">
                        <div>
                          <div className="font-medium">Windows</div>
                          <div className="text-sm text-muted-foreground">
                            {release.windowsFile.name} •{" "}
                            {formatFileSize(release.windowsFile.size)}
                          </div>
                          <div className="text-xs text-muted-foreground mt-1">
                            {release.windowsFile.download_count.toLocaleString()}{" "}
                            téléchargement
                            {release.windowsFile.download_count > 1 ? "s" : ""}
                          </div>
                        </div>
                        <Button
                          variant="outline"
                          size="sm"
                          asChild
                        >
                          <a
                            href={release.windowsFile.browser_download_url}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            <Download className="w-4 h-4 mr-2" />
                            Télécharger
                          </a>
                        </Button>
                      </div>
                    )}

                    {release.linuxFile && (
                      <div className="flex items-center justify-between p-3 border rounded-lg">
                        <div>
                          <div className="font-medium">Linux</div>
                          <div className="text-sm text-muted-foreground">
                            {release.linuxFile.name} •{" "}
                            {formatFileSize(release.linuxFile.size)}
                          </div>
                          <div className="text-xs text-muted-foreground mt-1">
                            {release.linuxFile.download_count.toLocaleString()}{" "}
                            téléchargement
                            {release.linuxFile.download_count > 1 ? "s" : ""}
                          </div>
                        </div>
                        <Button
                          variant="outline"
                          size="sm"
                          asChild
                        >
                          <a
                            href={release.linuxFile.browser_download_url}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            <Download className="w-4 h-4 mr-2" />
                            Télécharger
                          </a>
                        </Button>
                      </div>
                    )}

                    {!release.windowsFile && !release.linuxFile && (
                      <div className="col-span-2 text-center py-4 text-muted-foreground">
                        Aucun fichier téléchargeable pour cette version
                      </div>
                    )}
                  </div>

                  <div className="mt-4 pt-4 border-t">
                    <Button variant="ghost" size="sm" asChild>
                      <a
                        href={`https://github.com/${getGitHubConfig()?.owner}/${getGitHubConfig()?.repo}/releases/tag/${release.version}`}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <ExternalLink className="w-4 h-4 mr-2" />
                        Voir sur GitHub
                      </a>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
