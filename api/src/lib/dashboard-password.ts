/** Kiracı dashboard Pages `ADMIN_PASSWORD` — URL-güvenli, tahmin edilmesi zor */

function bytesToBase64url(bytes: Uint8Array): string {
  let bin = '';
  for (let i = 0; i < bytes.length; i++) bin += String.fromCharCode(bytes[i]!);
  return btoa(bin).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

export function generateDashboardAdminPassword(): string {
  const bytes = new Uint8Array(24);
  crypto.getRandomValues(bytes);
  return bytesToBase64url(bytes);
}
