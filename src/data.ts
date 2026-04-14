import { Team, Match } from './types';

// =============================================================================
// MODIFIEZ LES ÉQUIPES ET LES JOUEURS ICI
// =============================================================================
export const TEAMS: Team[] = [
  {
    id: 'team-1',
    name: "ZA3TA & REDO",
    players: [{ id: 'p1-1', name: "ZA3TA" }, { id: 'p1-2', name: "REDO" }]
  },
  {
    id: 'team-2',
    name: "HOUSSAM & MAROUANE",
    players: [{ id: 'p2-1', name: "HOUSSAM" }, { id: 'p2-2', name: "MAROUANE" }]
  },
  {
    id: 'team-3',
    name: "DJALIL & ABDENNOUR",
    players: [{ id: 'p3-1', name: "DJALIL" }, { id: 'p3-2', name: "ABDENNOUR" }]
  },
  {
    id: 'team-4',
    name: "ZIDOURI & ISLAM",
    players: [{ id: 'p4-1', name: "ZIDOURI" }, { id: 'p4-2', name: "ISLAM" }]
  },
  {
    id: 'team-5',
    name: "ACHREF & BAKI",
    players: [{ id: 'p5-1', name: "BAKI" }, { id: 'p5-2', name: "ACHREF" }]
  },
  {
    id: 'team-6',
    name: "SIDAHMED & SALIM",
    players: [{ id: 'p6-1', name: "SIDAHMED" }, { id: 'p6-2', name: "SALIM" }]
  },
  {
    id: 'team-7',
    name: "ABDELLAH & NASRO",
    players: [{ id: 'p7-1', name: "ABDELLAH" }, { id: 'p7-2', name: "NASRO" }]
  },
  {
    id: 'team-8',
    name: "AHMED & YASSER",
    players: [{ id: 'p8-1', name: "AHMED" }, { id: 'p8-2', name: "YASSER" }]
  }
];
// =============================================================================

// Initialize matches for an 8-team single elimination bracket
// Round 1: 4 matches (1-4) - Quarter Finals (SINGLE MATCH - 100 pts)
// Round 2: 2 matches (5-6) - Semi Finals (SINGLE MATCH - 100 pts)
// Round 3: 1 match (7) - Final (SINGLE MATCH - 150 pts)

const generateMatches = (): Match[] => {
  const matches: Match[] = [];
  
  // Round 1 scores provided by user
  const round1Scores = [
    { s1: 69, s2: 25, status: 'completed' as const },   // Match 1: Team 1 vs 2
    { s1: 145, s2: 23, status: 'completed' as const }, // Match 2: Team 3 vs 4
    { s1: 104, s2: 58, status: 'completed' as const }, // Match 3: Team 5 vs 6
    { s1: 8, s2: 102, status: 'completed' as const }   // Match 4: Team 7 vs 8
  ];

  for (let i = 0; i < 4; i++) {
    const { s1, s2, status } = round1Scores[i];
    const winnerId = status === 'completed' ? (s1 > s2 ? TEAMS[i * 2].id : TEAMS[i * 2 + 1].id) : undefined;
    
    matches.push({
      id: `m-${i + 1}`,
      round: 1,
      team1Id: TEAMS[i * 2].id,
      team2Id: TEAMS[i * 2 + 1].id,
      score1: s1,
      score2: s2,
      winnerId,
      status,
      isTwoLegged: false,
      nextMatchId: `m-${4 + Math.floor(i / 2) + 1}`,
    });
  }

  // Round 2 (4 teams -> 2 matches) - Semi Finals
  for (let i = 0; i < 2; i++) {
    const match1 = matches[i * 2];
    const match2 = matches[i * 2 + 1];
    
    matches.push({
      id: `m-${4 + i + 1}`,
      round: 2,
      team1Id: match1.winnerId,
      team2Id: match2.winnerId,
      score1: 0,
      score2: 0,
      status: 'in-progress',
      isTwoLegged: false,
      nextMatchId: `m-7`,
    });
  }

  // Round 3 (Final)
  const semi1 = matches[4];
  const semi2 = matches[5];
  
  matches.push({
    id: `m-7`,
    round: 3,
    team1Id: semi1.winnerId,
    team2Id: semi2.winnerId,
    status: 'in-progress',
    score1: 0,
    score2: 0,
    isTwoLegged: false,
  });

  return matches;
};

export const INITIAL_MATCHES = generateMatches();
