export interface Residence {
  id: string;
  street: string;
  number: string;
  complement?: string;
  neighborhood: string;
  city: string;
  state: string;
  postal_code?: string;
  latitude?: number;
  longitude?: number;
  reference_point?: string;
  created_at: string;
  updated_at: string;
}

export interface Resident {
  id: string;
  full_name: string;
  birth_date: string;
  cpf?: string;
  sus_card?: string;
  primary_phone?: string;
  secondary_phone?: string;
  residence_id?: string;
  notes?: string;
  created_at: string;
  updated_at: string;
}

export interface HealthInfo {
  id: string;
  resident_id: string;
  preexisting_conditions?: string;
  medications?: string;
  allergies?: string;
  blood_type?: string;
  family_history?: string;
  created_at: string;
  updated_at: string;
}

export interface Visit {
  id: string;
  residence_id: string;
  resident_id?: string;
  visit_date: string;
  reason?: string;
  notes?: string;
  created_at: string;
}