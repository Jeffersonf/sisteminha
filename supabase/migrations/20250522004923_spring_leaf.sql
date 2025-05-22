/*
  # Initial Schema for Health Agent Management System

  1. New Tables
    - `residences`
      - Basic information about each residence
      - Includes geolocation data
    - `residents`
      - Personal information about residents
      - Links to residence
    - `health_info`
      - Health-related information for each resident
    - `visits`
      - Record of visits made by health agents
  
  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users
*/

-- Create residences table
CREATE TABLE IF NOT EXISTS residences (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  street VARCHAR(255) NOT NULL,
  number VARCHAR(20),
  complement VARCHAR(100),
  neighborhood VARCHAR(100) NOT NULL,
  city VARCHAR(100) NOT NULL,
  state VARCHAR(2) NOT NULL,
  postal_code VARCHAR(9),
  latitude DECIMAL(10, 8),
  longitude DECIMAL(11, 8),
  reference_point TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Create residents table
CREATE TABLE IF NOT EXISTS residents (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  full_name VARCHAR(255) NOT NULL,
  birth_date DATE NOT NULL,
  cpf VARCHAR(14) UNIQUE,
  sus_card VARCHAR(20),
  primary_phone VARCHAR(20),
  secondary_phone VARCHAR(20),
  residence_id uuid REFERENCES residences(id) ON DELETE SET NULL,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Create health information table
CREATE TABLE IF NOT EXISTS health_info (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  resident_id uuid REFERENCES residents(id) ON DELETE CASCADE,
  preexisting_conditions TEXT,
  medications TEXT,
  allergies TEXT,
  blood_type VARCHAR(3),
  family_history TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Create visits table
CREATE TABLE IF NOT EXISTS visits (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  residence_id uuid REFERENCES residences(id) ON DELETE CASCADE NOT NULL,
  resident_id uuid REFERENCES residents(id) ON DELETE SET NULL,
  visit_date TIMESTAMPTZ NOT NULL,
  reason TEXT,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE residences ENABLE ROW LEVEL SECURITY;
ALTER TABLE residents ENABLE ROW LEVEL SECURITY;
ALTER TABLE health_info ENABLE ROW LEVEL SECURITY;
ALTER TABLE visits ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Enable read access for authenticated users" ON residences
  FOR SELECT TO authenticated USING (true);

CREATE POLICY "Enable insert access for authenticated users" ON residences
  FOR INSERT TO authenticated WITH CHECK (true);

CREATE POLICY "Enable update access for authenticated users" ON residences
  FOR UPDATE TO authenticated USING (true);

CREATE POLICY "Enable delete access for authenticated users" ON residences
  FOR DELETE TO authenticated USING (true);

-- Repeat for other tables
CREATE POLICY "Enable read access for authenticated users" ON residents
  FOR SELECT TO authenticated USING (true);

CREATE POLICY "Enable insert access for authenticated users" ON residents
  FOR INSERT TO authenticated WITH CHECK (true);

CREATE POLICY "Enable update access for authenticated users" ON residents
  FOR UPDATE TO authenticated USING (true);

CREATE POLICY "Enable delete access for authenticated users" ON residents
  FOR DELETE TO authenticated USING (true);

CREATE POLICY "Enable read access for authenticated users" ON health_info
  FOR SELECT TO authenticated USING (true);

CREATE POLICY "Enable insert access for authenticated users" ON health_info
  FOR INSERT TO authenticated WITH CHECK (true);

CREATE POLICY "Enable update access for authenticated users" ON health_info
  FOR UPDATE TO authenticated USING (true);

CREATE POLICY "Enable delete access for authenticated users" ON health_info
  FOR DELETE TO authenticated USING (true);

CREATE POLICY "Enable read access for authenticated users" ON visits
  FOR SELECT TO authenticated USING (true);

CREATE POLICY "Enable insert access for authenticated users" ON visits
  FOR INSERT TO authenticated WITH CHECK (true);

CREATE POLICY "Enable update access for authenticated users" ON visits
  FOR UPDATE TO authenticated USING (true);

CREATE POLICY "Enable delete access for authenticated users" ON visits
  FOR DELETE TO authenticated USING (true);