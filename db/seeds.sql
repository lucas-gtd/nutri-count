-- Seed data for development

-- Sample foods
INSERT INTO foods (name, brand, calories_per_100g, proteins_per_100g, carbs_per_100g, fats_per_100g, fiber_per_100g, source)
VALUES
  ('Poulet grillé', NULL, 165, 31, 0, 3.6, 0, 'custom'),
  ('Riz blanc cuit', NULL, 130, 2.7, 28, 0.3, 0.4, 'custom'),
  ('Brocoli cuit', NULL, 35, 2.4, 7, 0.4, 3.3, 'custom'),
  ('Oeuf entier', NULL, 155, 13, 1.1, 11, 0, 'custom'),
  ('Pain complet', NULL, 247, 13, 41, 3.4, 7, 'custom'),
  ('Banane', NULL, 89, 1.1, 23, 0.3, 2.6, 'custom'),
  ('Yaourt nature', 'Danone', 59, 10, 3.6, 0.7, 0, 'custom'),
  ('Saumon fumé', NULL, 117, 18, 0, 4.3, 0, 'custom'),
  ('Avocat', NULL, 160, 2, 8.5, 14.7, 6.7, 'custom'),
  ('Pâtes cuites', NULL, 131, 5, 25, 1.1, 1.8, 'custom');
