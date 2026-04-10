-- Aynı kullanıcıda site_name tekil olsun (çift provision / CF ad çakışması önlemi)
CREATE UNIQUE INDEX IF NOT EXISTS idx_sites_user_id_site_name ON sites(user_id, site_name);
