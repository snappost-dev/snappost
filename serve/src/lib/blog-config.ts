import { queryD1 } from "./d1";

export type D1ApiEnv = {
  CF_ACCOUNT_ID: string;
  CF_API_TOKEN: string;
};

type ConfigRow = {
  key: string;
  value: string;
};

export async function loadBlogConfig(
  databaseId: string,
  env: D1ApiEnv
): Promise<Record<string, string>> {
  const rows = await queryD1<ConfigRow>("SELECT key, value FROM config", [], databaseId, env);
  return Object.fromEntries(rows.map((row) => [row.key, row.value]));
}

export function localBlogConfig(): Record<string, string> {
  return {
    site_title: "Snappost Local",
    site_description: "Local preview mode",
    site_lang: "en",
    author_name: "Snappost",
    author_bio: "Local mode",
    theme_color: "#7c3aed",
    site_theme_light: "light",
    site_theme_dark: "dark"
  };
}
