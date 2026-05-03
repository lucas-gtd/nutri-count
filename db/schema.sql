-- NutriCount Database Schema
-- PostgreSQL

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users table
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Activity level enum
CREATE TYPE activity_level AS ENUM ('sedentary', 'light', 'moderate', 'active', 'very_active');

-- Goal enum
CREATE TYPE goal AS ENUM ('lose', 'maintain', 'gain');

-- Profiles table
CREATE TABLE profiles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID UNIQUE NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  age INTEGER NOT NULL,
  sex VARCHAR(10) NOT NULL,
  height_cm DECIMAL NOT NULL,
  weight_kg DECIMAL NOT NULL,
  activity_level activity_level NOT NULL,
  goal goal NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Food source enum
CREATE TYPE food_source AS ENUM ('openfoodfacts', 'custom');

-- Foods table
CREATE TABLE foods (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  barcode VARCHAR(255),
  name VARCHAR(255) NOT NULL,
  brand VARCHAR(255),
  calories_per_100g DECIMAL NOT NULL,
  proteins_per_100g DECIMAL NOT NULL,
  carbs_per_100g DECIMAL NOT NULL,
  fats_per_100g DECIMAL NOT NULL,
  fiber_per_100g DECIMAL DEFAULT 0,
  source food_source DEFAULT 'custom'
);

-- Meal type enum
CREATE TYPE meal_type AS ENUM ('breakfast', 'lunch', 'dinner', 'snack');

-- Diary entries table
CREATE TABLE diary_entries (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  food_id UUID NOT NULL REFERENCES foods(id),
  meal_type meal_type NOT NULL,
  quantity_g DECIMAL NOT NULL,
  date DATE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Exercises table
CREATE TABLE exercises (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  calories_burned DECIMAL NOT NULL,
  duration_min INTEGER NOT NULL,
  date DATE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_diary_entries_user_date ON diary_entries(user_id, date);
CREATE INDEX idx_exercises_user_date ON exercises(user_id, date);
CREATE INDEX idx_foods_barcode ON foods(barcode);
CREATE INDEX idx_foods_name ON foods(name);
