interface Registrant {
  id: number; 
  fullName: string;
  gender: string; 
  plan: string; 
  extraItems: string[]; // contains label ?
  total: number;
}
export type { Registrant };

