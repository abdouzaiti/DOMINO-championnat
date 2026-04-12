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
    name: ".......",
    players: [{ id: 'p6-1', name: "....." }, { id: 'p6-2', name: "......" }]
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
  
  // Round 1 (8 teams -> 4 matches) - Quarter Finals (SINGLE MATCH - 100 pts)
  for (let i = 0; i < 4; i++) {
    const winnerScore = 100;
    const loserScore = Math.floor(Math.random() * 40) + 60; // 60-99
    
    const team1Wins = Math.random() > 0.5;
    const score1 = team1Wins ? winnerScore : loserScore;
    const score2 = team1Wins ? loserScore : winnerScore;
    const winnerId = team1Wins ? TEAMS[i * 2].id : TEAMS[i * 2 + 1].id;
    
    matches.push({
      id: `m-${i + 1}`,
      round: 1,
      team1Id: TEAMS[i * 2].id,
      team2Id: TEAMS[i * 2 + 1].id,
      score1: 0,
      score2: 0,
      winnerId,
      status: 'completed',
      isTwoLegged: false,
      nextMatchId: `m-${4 + Math.floor(i / 2) + 1}`,
    });
  }

  // Round 2 (4 teams -> 2 matches) - Semi Finals (SINGLE MATCH - 100 pts)
  for (let i = 0; i < 2; i++) {
    const match1 = matches[i * 2];
    const match2 = matches[i * 2 + 1];
    const team1Id = match1.winnerId;
    const team2Id = match2.winnerId;
    
    const winnerScore = 100;
    const loserScore = Math.floor(Math.random() * 40) + 60;
    
    const team1Wins = Math.random() > 0.5;
    const score1 = team1Wins ? winnerScore : loserScore;
    const score2 = team1Wins ? loserScore : winnerScore;
    const winnerId = score1 > score2 ? team1Id : team2Id;

    matches.push({
      id: `m-${4 + i + 1}`,
      round: 2,
      team1Id,
      team2Id,
      score1: 0,
      score2: 0,
      winnerId,
      status: 'completed',
      isTwoLegged: false,
      nextMatchId: `m-7`,
    });
  }

  // Round 3 (Final) - SINGLE MATCH - 150 pts
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
