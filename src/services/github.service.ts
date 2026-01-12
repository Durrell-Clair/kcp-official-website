/**
 * Service pour interagir avec l'API GitHub Releases
 * Permet de récupérer les informations sur les releases et les fichiers téléchargeables
 */

export interface GitHubRelease {
  id: number;
  tag_name: string;
  name: string;
  body: string;
  published_at: string;
  assets: GitHubAsset[];
  draft: boolean;
  prerelease: boolean;
}

export interface GitHubAsset {
  id: number;
  name: string;
  browser_download_url: string;
  size: number;
  download_count: number;
  content_type: string;
  created_at: string;
}

export interface ReleaseInfo {
  version: string;
  name: string;
  description: string;
  publishedAt: string;
  windowsFile: GitHubAsset | null;
  linuxFile: GitHubAsset | null;
  totalDownloads: number;
  isDraft: boolean;
  isPrerelease: boolean;
}

/**
 * Récupère les releases depuis GitHub
 * @param owner - Propriétaire du repo (ex: "username" ou "org")
 * @param repo - Nom du repository
 * @returns Liste des releases
 */
export async function getGitHubReleases(
  owner: string,
  repo: string
): Promise<GitHubRelease[]> {
  const token = import.meta.env.VITE_GITHUB_TOKEN;
  const headers: HeadersInit = {
    Accept: "application/vnd.github.v3+json",
  };

  // Ajouter le token si disponible (pour éviter les limites de rate)
  if (token) {
    headers.Authorization = `token ${token}`;
  }

  const response = await fetch(
    `https://api.github.com/repos/${owner}/${repo}/releases`,
    { headers }
  );

  if (!response.ok) {
    throw new Error(
      `Failed to fetch releases: ${response.status} ${response.statusText}`
    );
  }

  return response.json();
}

/**
 * Récupère les informations formatées sur les releases
 * @param owner - Propriétaire du repo
 * @param repo - Nom du repository
 * @returns Liste des releases formatées
 */
export async function getFormattedReleases(
  owner: string,
  repo: string
): Promise<ReleaseInfo[]> {
  const releases = await getGitHubReleases(owner, repo);

  return releases
    .filter((release) => !release.draft) // Exclure les drafts
    .map((release) => {
      const windowsFile = release.assets.find((asset: GitHubAsset) =>
        asset.name.match(/\.(exe|msi)$/i)
      ) || null;

      const linuxFile = release.assets.find(
        (asset: GitHubAsset) =>
          asset.name.match(/\.(AppImage|deb|rpm|tar\.gz)$/i) ||
          asset.name.includes("linux")
      ) || null;

      const totalDownloads = release.assets.reduce(
        (sum: number, asset: GitHubAsset) => sum + asset.download_count,
        0
      );

      return {
        version: release.tag_name,
        name: release.name || release.tag_name,
        description: release.body,
        publishedAt: release.published_at,
        windowsFile,
        linuxFile,
        totalDownloads,
        isDraft: release.draft,
        isPrerelease: release.prerelease,
      };
    })
    .sort((a, b) => {
      // Trier par date de publication (plus récent en premier)
      return (
        new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
      );
    });
}

/**
 * Formate la taille d'un fichier en format lisible
 */
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return "0 Bytes";
  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return Math.round(bytes / Math.pow(k, i) * 100) / 100 + " " + sizes[i];
}

/**
 * Récupère la configuration GitHub depuis les variables d'environnement
 */
export function getGitHubConfig(): { owner: string; repo: string } | null {
  const owner = import.meta.env.VITE_GITHUB_OWNER;
  const repo = import.meta.env.VITE_GITHUB_REPO;

  if (!owner || !repo) {
    return null;
  }

  return { owner, repo };
}
