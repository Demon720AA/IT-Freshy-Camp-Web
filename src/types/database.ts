export type Role = 'FRESHMAN' | 'SENIOR' | 'ADMIN';

export interface Profile {
  id: string;
  student_id: string;
  full_name: string;
  role: Role;
  total_tokens: number;
}

export interface Scan {
  id: string;
  freshman_id: string;
  senior_id: string;
  created_at: string;
}

export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: Profile;
        Insert: Omit<Profile, 'id'>;
        Update: Partial<Omit<Profile, 'id'>>;
      };
      scans: {
        Row: Scan;
        Insert: Omit<Scan, 'id' | 'created_at'>;
        Update: Partial<Omit<Scan, 'id' | 'created_at'>>;
      };
    };
  };
};
