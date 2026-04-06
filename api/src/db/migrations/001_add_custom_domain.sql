-- Provisioning D1: mevcut veritabanına custom_domain sütunu (yeni kurulumda schema.sql yeterli)
ALTER TABLE sites ADD COLUMN custom_domain TEXT DEFAULT NULL;
