export interface Player {
  id: string;
  name: string;
}

export interface Team {
  id: string;
  name: string;
  players: [Player, Player];
  logo?: string;
}

export interface Match {
  id: string;
  round: number; // 1: Quarter-finals, 2: Semi-finals, 3: Final
  team1Id?: string;
  team2Id?: string;
  score1?: number; // Total score or Leg 1 score
  score2?: number; // Total score or Leg 1 score
  score1Leg2?: number; // For Aller-Retour
  score2Leg2?: number; // For Aller-Retour
  winnerId?: string;
  status: 'pending' | 'in-progress' | 'completed';
  nextMatchId?: string;
  isTwoLegged?: boolean;
  note?: string;
}

export interface Championship {
  id: string;
  name: string;
  teams: Team[];
  matches: Match[];
}
