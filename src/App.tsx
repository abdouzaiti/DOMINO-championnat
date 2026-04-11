import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Trophy, 
  Users, 
  LayoutGrid, 
  Search,
  Calendar,
  Info,
  ZoomIn,
  ZoomOut,
  Maximize,
  RotateCw,
  X as CloseIcon
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { TEAMS, INITIAL_MATCHES } from './data';
import { Team, Match } from './types';
import { cn } from '@/lib/utils';
import Silk from '@/components/Silk';

// --- Components ---

const DominoIcon = ({ className }: { className?: string }) => (
  <svg 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round" 
    className={cn("w-6 h-6", className)}
  >
    <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
    <line x1="12" y1="3" x2="12" y2="21" />
    <circle cx="7.5" cy="7.5" r="1" fill="currentColor" />
    <circle cx="7.5" cy="16.5" r="1" fill="currentColor" />
    <circle cx="16.5" cy="12" r="1" fill="currentColor" />
  </svg>
);

interface MatchCardProps {
  match: Match;
  teams: Team[];
}

const MatchCard = ({ match, teams }: MatchCardProps) => {
  const team1 = teams.find(t => t.id === match.team1Id);
  const team2 = teams.find(t => t.id === match.team2Id);

  return (
    <Card className="overflow-hidden bg-black/60 border border-white/10 hover:border-neon-green/40 transition-all duration-300 rounded-xl group w-full shadow-2xl">
      <CardContent className="p-4">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <div className="w-1.5 h-1.5 rounded-full bg-neon-green shadow-[0_0_8px_rgba(57,255,20,0.6)]" />
            <span className="text-[10px] font-bold text-white/40 uppercase tracking-widest">Match {match.id}</span>
          </div>
          {match.round === 3 && (
            <Badge className="bg-neon-accent/10 text-neon-accent border-neon-accent/20 text-[10px] uppercase font-black">Final</Badge>
          )}
        </div>
        
        <div className="space-y-3">
          {[team1, team2].map((team, idx) => {
            const score = idx === 0 ? match.score1 : match.score2;
            const otherScore = idx === 0 ? match.score2 : match.score1;
            const isWinner = score > otherScore;

            return (
              <div key={idx} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Avatar className="w-8 h-8 md:w-10 md:h-10 border border-white/10 bg-white/5">
                    <AvatarImage src={team?.logo} />
                    <AvatarFallback className="text-[10px] text-white/40">{team?.name[0]}</AvatarFallback>
                  </Avatar>
                  <span className={cn(
                    "text-sm md:text-base font-bold uppercase tracking-tight transition-colors",
                    isWinner ? "text-white" : "text-white/40"
                  )}>
                    {team?.name || 'TBD'}
                  </span>
                </div>
                <span className={cn(
                  "text-lg md:text-2xl font-black tabular-nums",
                  isWinner ? "text-neon-green" : "text-white/20"
                )}>
                  {score ?? '--'}
                </span>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};

interface BracketColumnProps {
  title: string;
  matches: Match[];
  teams: Team[];
  side?: 'left' | 'right' | 'center';
}

const BracketColumn = ({ title, matches, teams, side = 'center' }: BracketColumnProps) => (
  <div className="flex flex-col gap-12 min-w-[280px] md:min-w-[320px] flex-1 relative">
    {title && (
      <div className="text-center mb-8">
        <h4 className="text-[10px] font-black text-white/20 uppercase tracking-[0.5em]">{title}</h4>
      </div>
    )}
    <div className="flex flex-col justify-around h-full gap-16 relative">
      {matches.map((match, idx) => (
        <div key={match.id} className="relative">
          <MatchCard match={match} teams={teams} />
          
          {/* Connector Lines */}
          {side === 'left' && matches.length === 2 && (
            <div className="absolute -right-8 top-1/2 w-8 h-px bg-white/10 hidden lg:block">
              <div className={cn(
                "absolute right-0 w-px bg-white/10",
                idx === 0 ? "top-0 h-[calc(100%+64px)]" : "bottom-0 h-[calc(100%+64px)]"
              )} />
              {idx === 0 && <div className="absolute right-0 top-[calc(100%+64px)] w-8 h-px bg-white/10" />}
            </div>
          )}

          {side === 'right' && matches.length === 2 && (
            <div className="absolute -left-8 top-1/2 w-8 h-px bg-white/10 hidden lg:block">
              <div className={cn(
                "absolute left-0 w-px bg-white/10",
                idx === 0 ? "top-0 h-[calc(100%+64px)]" : "bottom-0 h-[calc(100%+64px)]"
              )} />
              {idx === 0 && <div className="absolute left-0 top-[calc(100%+64px)] w-8 h-px bg-white/10" />}
            </div>
          )}

          {side === 'left' && matches.length === 1 && (
            <div className="absolute -right-8 top-1/2 w-8 h-px bg-white/10 hidden lg:block" />
          )}
          {side === 'right' && matches.length === 1 && (
            <div className="absolute -left-8 top-1/2 w-8 h-px bg-white/10 hidden lg:block" />
          )}
        </div>
      ))}
    </div>
  </div>
);

// --- Main App ---

export default function App() {
  const [activeTab, setActiveTab] = useState('home');
  const [searchQuery, setSearchQuery] = useState('');
  const [zoom, setZoom] = useState(0.7);
  const [scrollPos, setScrollPos] = useState({ x: 0, y: 0 });
  const [showRotatePrompt, setShowRotatePrompt] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const target = e.currentTarget;
    setScrollPos({ x: target.scrollLeft, y: target.scrollTop });
  };

  const resetView = () => {
    const width = window.innerWidth;
    const height = window.innerHeight;
    const isLandscape = width > height;
    const isMobile = width < 768;
    
    let targetZoom = 0.7;
    let targetX = 35;

    if (isMobile) {
      if (isLandscape) {
        // Phone Rotate
        targetZoom = 0.45;
        targetX = 375;
        setShowRotatePrompt(false);
      } else {
        // Normal Phone
        targetZoom = 0.9;
        targetX = 9;
        setShowRotatePrompt(true);
      }
    } else {
      // Computer
      targetZoom = 0.7;
      targetX = 35;
    }
    
    setZoom(targetZoom);
    
    // Reset main window scroll
    window.scrollTo({ top: 0, behavior: 'smooth' });
    
    // Apply scroll position after a short delay to ensure DOM is ready
    setTimeout(() => {
      if (scrollRef.current) {
        scrollRef.current.scrollTo({ left: targetX, top: 0, behavior: 'smooth' });
      }
    }, 150);
  };

  useEffect(() => {
    resetView();
    window.addEventListener('resize', resetView);
    window.addEventListener('orientationchange', resetView);
    return () => {
      window.removeEventListener('resize', resetView);
      window.removeEventListener('orientationchange', resetView);
    };
  }, [activeTab]); // Re-run when tab changes to ensure scroll is applied to bracket

  const filteredTeams = TEAMS.filter(team => 
    team.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    team.players.some(p => p.name.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const round1Matches = INITIAL_MATCHES.filter(m => m.round === 1);
  const round2Matches = INITIAL_MATCHES.filter(m => m.round === 2);
  const round3Matches = INITIAL_MATCHES.filter(m => m.round === 3);

  const leftQuarts = round1Matches.slice(0, 2);
  const rightQuarts = round1Matches.slice(2, 4);
  const leftSemi = round2Matches.slice(0, 1);
  const rightSemi = round2Matches.slice(1, 2);

  return (
    <div className={cn(
      "min-h-screen text-white font-sans selection:bg-neon-green selection:text-white overflow-x-hidden transition-colors duration-500",
      activeTab === 'bracket' ? "bg-[#0a2a1a]" : "bg-[#020a06]"
    )}>
      {/* Background Silk Effect - Only on Home */}
      {activeTab === 'home' && (
        <div className="fixed inset-0 z-0 pointer-events-none opacity-40">
          <Silk
            speed={6.9}
            scale={0.9}
            color="#048140"
            noiseIntensity={0}
            rotation={0}
          />
        </div>
      )}

      {/* Background Glows - Only on Home */}
      {activeTab === 'home' && (
        <div className="fixed inset-0 pointer-events-none overflow-hidden">
          <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-neon-green/10 blur-[120px] rounded-full" />
          <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-neon-light/10 blur-[120px] rounded-full" />
          <div className="absolute top-[40%] right-[20%] w-[30%] h-[30%] bg-neon-accent/5 blur-[100px] rounded-full" />
        </div>
      )}

      {/* Header - Hidden on Home and Bracket Page */}
      <AnimatePresence>
        {activeTab !== 'home' && activeTab !== 'bracket' && (
          <motion.header 
            initial={{ y: -100 }}
            animate={{ y: 0 }}
            exit={{ y: -100 }}
            className="sticky top-0 z-50 w-full border-b border-white/10 bg-[#020a06]/80 backdrop-blur-xl"
          >
            <div className="container mx-auto px-4 h-16 md:h-20 flex items-center justify-between">
              <div className="flex items-center gap-3 md:gap-4">
                <div 
                  className="bg-gradient-to-br from-neon-green to-neon-light p-2 rounded-lg md:rounded-xl shadow-[0_0_20px_rgba(4,129,64,0.4)] cursor-pointer"
                  onClick={() => setActiveTab('home')}
                >
                  <DominoIcon className="w-5 h-5 md:w-6 md:h-6 text-white" />
                </div>
                <div>
                  <h1 className="text-lg md:text-2xl font-black tracking-tighter italic bg-gradient-to-r from-neon-green via-white to-neon-light bg-clip-text text-transparent">
                    DOMINO CHAMP
                  </h1>
                  <div className="flex items-center gap-2">
                    <span className="h-1 w-1 md:h-1.5 md:w-1.5 rounded-full bg-neon-green animate-pulse" />
                    <p className="text-[8px] md:text-[10px] uppercase tracking-[0.2em] md:tracking-[0.3em] font-bold text-white/70">Elite Series 2026</p>
                  </div>
                </div>
              </div>
              
              <div className="hidden lg:flex items-center gap-8">
                <div className="flex flex-col items-end">
                  <span className="text-[10px] uppercase tracking-widest text-white/60 font-bold">Local Time</span>
                  <div className="flex items-center gap-2 text-sm font-mono text-neon-green">
                    <Calendar className="w-4 h-4" />
                    <span>10.04.2026</span>
                  </div>
                </div>
                <div className="h-8 w-px bg-white/10" />
                <div className="flex flex-col items-end">
                  <span className="text-[10px] uppercase tracking-widest text-white/60 font-bold">Main Venue</span>
                  <div className="flex items-center gap-2 text-sm font-bold text-neon-light">
                    <Trophy className="w-4 h-4" />
                    <span>NEON ARENA</span>
                  </div>
                </div>
              </div>

              {/* Mobile Menu Trigger (Simple tab switcher for mobile header if needed, but we have the bottom tabs or top tabs) */}
              <div className="lg:hidden">
                <button 
                  onClick={() => setActiveTab('home')}
                  className="p-2 bg-white/5 rounded-lg border border-white/10"
                >
                  <LayoutGrid className="w-5 h-5 text-white/70" />
                </button>
              </div>
            </div>
          </motion.header>
        )}
      </AnimatePresence>

      <main className={cn(
        "relative z-10",
        activeTab === 'bracket' || activeTab === 'home' ? "w-full" : "container mx-auto px-4",
        activeTab === 'home' || activeTab === 'bracket' ? "py-0" : "py-8 md:py-12"
      )}>
        <Tabs value={activeTab} onValueChange={setActiveTab} className={cn("space-y-8 md:space-y-12", (activeTab === 'home' || activeTab === 'bracket') && "space-y-0")}>
          {activeTab !== 'home' && activeTab !== 'bracket' && (
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div className="flex flex-wrap items-center gap-4">
                <ScrollArea className="w-full md:w-auto">
                  <TabsList className="glass p-1 h-12 md:h-14 rounded-xl md:rounded-2xl border-white/10 flex w-max md:w-auto">
                    <TabsTrigger 
                      value="bracket" 
                      className="px-4 md:px-8 h-9 md:h-11 rounded-lg md:rounded-xl data-active:bg-neon-green data-active:text-white data-active:shadow-[0_0_20px_rgba(4,129,64,0.3)] transition-all duration-300 text-xs md:text-sm"
                    >
                      <Trophy className="w-3.5 h-3.5 md:w-4 md:h-4 mr-2" />
                      Tableau
                    </TabsTrigger>
                    <TabsTrigger 
                      value="teams" 
                      className="px-4 md:px-8 h-9 md:h-11 rounded-lg md:rounded-xl data-active:bg-neon-green data-active:text-white data-active:shadow-[0_0_20px_rgba(4,129,64,0.3)] transition-all duration-300 text-xs md:text-sm"
                    >
                      <Users className="w-3.5 h-3.5 md:w-4 md:h-4 mr-2" />
                      Équipes
                    </TabsTrigger>
                  </TabsList>
                </ScrollArea>

                {/* Zoom Controls */}
                <div className="flex items-center gap-1 glass p-1 rounded-xl border-white/10">
                  <button 
                    onClick={() => setZoom(prev => Math.max(0.5, prev - 0.1))}
                    className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                    title="Zoom Out"
                  >
                    <ZoomOut className="w-4 h-4 text-white/70" />
                  </button>
                  <div className="px-2 min-w-[3.5rem] text-center">
                    <span className="text-[10px] font-mono font-bold text-neon-green">
                      {Math.round(zoom * 100)}%
                    </span>
                  </div>
                  <button 
                    onClick={() => setZoom(prev => Math.min(1.5, prev + 0.1))}
                    className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                    title="Zoom In"
                  >
                    <ZoomIn className="w-4 h-4 text-white/70" />
                  </button>
                  <Separator orientation="vertical" className="h-4 bg-white/10 mx-1" />
                  <button 
                    onClick={() => setZoom(1)}
                    className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                    title="Reset Zoom"
                  >
                    <Maximize className="w-4 h-4 text-white/70" />
                  </button>
                </div>
              </div>

              {activeTab === 'teams' && (
                <div className="relative w-full md:w-80 group">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30 group-focus-within:text-neon-green transition-colors" />
                  <input 
                    type="text" 
                    placeholder="Search team or player..." 
                    className="w-full pl-12 pr-6 py-3 bg-white/5 border border-white/10 rounded-xl md:rounded-2xl text-sm focus:outline-none focus:border-neon-green/50 focus:bg-white/10 transition-all backdrop-blur-sm"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
              )}
            </div>
          )}

          <AnimatePresence mode="wait">
            <TabsContent key="home" value="home" className="mt-0 outline-none">
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="flex flex-col items-center text-center py-12 md:py-20 max-w-4xl mx-auto min-h-[80vh] justify-center"
              >
                <motion.div
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ duration: 0.8, ease: "easeOut" }}
                  className="mb-8 md:mb-12 relative"
                >
                  <div className="absolute inset-0 bg-neon-green/20 blur-[60px] md:blur-[100px] rounded-full" />
                  <DominoIcon className="w-32 h-32 md:w-48 md:h-48 text-neon-green relative z-10 drop-shadow-[0_0_30px_rgba(4,129,64,0.5)]" />
                </motion.div>

                <h2 className="text-4xl md:text-8xl font-black italic tracking-tighter mb-6 md:mb-8 bg-gradient-to-b from-white via-white to-white/20 bg-clip-text text-transparent leading-[1.1]">
                  DOMINO CHAMPIONSHIP
                </h2>
                
                <p className="text-lg md:text-2xl text-white/80 font-medium mb-10 md:mb-12 max-w-2xl leading-relaxed px-4">
                  Welcome.<br />
                  Check the latest results and follow the competition.
                </p>

                <div className="flex flex-col sm:flex-row justify-center gap-4 md:gap-6 w-full px-6 sm:px-0">
                  <button 
                    onClick={() => setActiveTab('bracket')}
                    className="w-full sm:w-auto px-10 py-4 md:py-5 bg-neon-green text-white font-black uppercase tracking-widest rounded-xl md:rounded-2xl shadow-[0_0_30px_rgba(4,129,64,0.4)] hover:scale-105 hover:shadow-[0_0_50px_rgba(4,129,64,0.6)] transition-all duration-300 text-sm md:text-base"
                  >
                    View Bracket
                  </button>
                  <button 
                    onClick={() => setActiveTab('teams')}
                    className="w-full sm:w-auto px-10 py-4 md:py-5 bg-white/5 border border-white/10 text-white font-black uppercase tracking-widest rounded-xl md:rounded-2xl hover:bg-white/10 transition-all duration-300 text-sm md:text-base"
                  >
                    Meet the Teams
                  </button>
                </div>

              </motion.div>
            </TabsContent>

            <TabsContent key="bracket" value="bracket" className="mt-0 outline-none w-full">
              <div className="bg-[#062c1a] min-h-screen relative overflow-hidden">
                <div className="absolute inset-0 opacity-[0.05] pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]" />
                
                <div className="relative z-10 h-full flex flex-col">
                  <div className="text-center w-full py-6 md:py-20">
                    <h2 className="text-3xl md:text-8xl font-black uppercase tracking-tighter text-white drop-shadow-2xl">PHASE FINALE</h2>
                    <div className="h-1 w-24 md:w-32 bg-neon-green mx-auto mt-4 md:mt-6 rounded-full" />
                  </div>

                  <div 
                    ref={scrollRef}
                    onScroll={handleScroll}
                    className="flex-1 overflow-auto pb-20"
                  >
                    <div 
                      className="min-w-[1400px] mx-auto flex items-center justify-center transition-transform duration-500"
                      style={{ transform: `scale(${zoom})`, transformOrigin: 'top center' }}
                    >
                      <div className="grid grid-cols-5 gap-8 items-center w-full">
                        {/* Column 1: Quarts A */}
                        <div className="flex justify-center">
                          <BracketColumn title="QUARTS (A)" matches={leftQuarts} teams={TEAMS} side="left" />
                        </div>

                        {/* Column 2: Demi A */}
                        <div className="flex justify-center">
                          <BracketColumn title="DEMI-FINALE" matches={leftSemi} teams={TEAMS} side="left" />
                        </div>

                        {/* Column 3: Grand Final */}
                        <div className="flex flex-col items-center justify-center px-8">
                          <div className="mb-12 text-center">
                            <Trophy className="w-16 h-16 text-neon-accent mx-auto mb-4 drop-shadow-[0_0_30px_rgba(163,255,0,0.4)]" />
                            <h3 className="text-xl md:text-3xl font-black italic tracking-tighter text-neon-accent uppercase">LA FINALE</h3>
                          </div>
                          <div className="w-full max-w-[450px]">
                            <MatchCard match={round3Matches[0]} teams={TEAMS} />
                          </div>
                        </div>

                        {/* Column 4: Demi B */}
                        <div className="flex justify-center">
                          <BracketColumn title="DEMI-FINALE" matches={rightSemi} teams={TEAMS} side="right" />
                        </div>

                        {/* Column 5: Quarts B */}
                        <div className="flex justify-center">
                          <BracketColumn title="QUARTS (B)" matches={rightQuarts} teams={TEAMS} side="right" />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent key="teams" value="teams" className="mt-0 outline-none">
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 md:gap-4"
              >
                {filteredTeams.map((team, idx) => (
                  <motion.div
                    key={team.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.02 }}
                  >
                    <Card className="group relative overflow-hidden glass border-white/10 hover:border-neon-green/50 transition-all duration-500 rounded-xl">
                      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-neon-green to-neon-light opacity-0 group-hover:opacity-100 transition-opacity" />
                      
                      <CardHeader className="p-3 relative">
                        <div className="flex justify-between items-start">
                          <Badge className="bg-white/10 text-white/70 border-none font-mono text-[8px] px-1.5 py-0">
                            RANK #{idx + 1}
                          </Badge>
                          <div className="p-1.5 bg-white/5 rounded-lg group-hover:bg-neon-green group-hover:text-white transition-all duration-300">
                            <Users className="w-3 h-3" />
                          </div>
                        </div>
                        <CardTitle className="text-base font-bold mt-2 tracking-tight text-white group-hover:text-neon-green transition-colors">
                          {team.name}
                        </CardTitle>
                        <CardDescription className="text-white/30 font-mono text-[8px] uppercase tracking-widest">
                          Pro Duo Team
                        </CardDescription>
                      </CardHeader>
                      
                      <CardContent className="p-3 pt-0 relative">
                        <div className="space-y-1.5">
                          {team.players.map((player, pIdx) => (
                            <div key={player.id} className="flex items-center gap-2 p-1.5 rounded-lg bg-white/5 border border-white/5 group-hover:border-white/10 transition-all">
                              <Avatar className="h-7 w-7 border border-white/20">
                                <AvatarFallback className="bg-white/10 text-white text-[9px] font-bold">
                                  {player.name.charAt(0)}
                                </AvatarFallback>
                              </Avatar>
                              <div className="flex flex-col">
                                <span className="text-[11px] font-bold tracking-tight text-white leading-tight">{player.name}</span>
                                <span className="text-[7px] text-white/30 uppercase tracking-[0.1em] font-black leading-none">
                                  P{pIdx + 1}
                                </span>
                              </div>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                      
                      {/* Decorative background number */}
                      <span className="absolute -bottom-2 -right-1 text-6xl font-black text-white/[0.02] italic pointer-events-none">
                        {idx + 1}
                      </span>
                    </Card>
                  </motion.div>
                ))}
              </motion.div>
            </TabsContent>
          </AnimatePresence>
        </Tabs>
      </main>

      {/* Rotation Prompt for Mobile Portrait */}
      <AnimatePresence>
        {showRotatePrompt && activeTab === 'bracket' && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 30 }}
            className="fixed bottom-20 left-1/2 -translate-x-1/2 z-[60] w-[85%] max-w-[220px]"
          >
            <div className="bg-neon-green/90 backdrop-blur-xl p-2 rounded-xl border border-white/20 shadow-[0_0_20px_rgba(4,129,64,0.4)] flex items-center gap-2">
              <button 
                onClick={async () => {
                  try {
                    if (document.documentElement.requestFullscreen) {
                      await document.documentElement.requestFullscreen();
                      if (window.screen.orientation && (window.screen.orientation as any).lock) {
                        await (window.screen.orientation as any).lock('landscape');
                      }
                    }
                  } catch (err) {
                    console.warn("Orientation lock failed:", err);
                    setShowRotatePrompt(false);
                  }
                }}
                className="flex flex-1 items-center gap-2.5 text-left"
              >
                <div className="bg-white/20 p-1.5 rounded-lg animate-bounce shrink-0">
                  <RotateCw className="w-3.5 h-3.5 text-white" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-white font-black text-[9px] uppercase tracking-wider leading-tight truncate">
                    Rotate phone
                  </p>
                  <p className="text-white/80 text-[7px] font-medium uppercase tracking-tight truncate">
                    Click for best view
                  </p>
                </div>
              </button>
              <button 
                onClick={() => setShowRotatePrompt(false)}
                className="p-1 hover:bg-white/10 rounded-lg transition-colors shrink-0"
              >
                <CloseIcon className="w-3 h-3 text-white/50" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Global Zoom Controls */}
      <AnimatePresence>
        {activeTab !== 'home' && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            className="fixed bottom-6 right-6 z-50 flex flex-col gap-1.5 items-center"
          >
            <div className="mb-0.5 px-2 py-0.5 bg-white/5 backdrop-blur-md rounded-full border border-white/5 shadow-xl">
              <span className="text-[9px] font-bold text-white/40 font-mono tracking-tighter">
                {Math.round(zoom * 100)}%
              </span>
            </div>
            <button 
              onClick={() => setZoom(prev => Math.min(prev + 0.05, 1.5))}
              className="p-2 bg-white/5 backdrop-blur-md hover:bg-white/10 rounded-full border border-white/5 transition-all shadow-lg group"
              title="Zoom In"
            >
              <ZoomIn className="w-4 h-4 text-white/60 group-hover:text-white transition-colors" />
            </button>
            <button 
              onClick={() => setZoom(prev => Math.max(prev - 0.05, 0.25))}
              className="p-2 bg-white/5 backdrop-blur-md hover:bg-white/10 rounded-full border border-white/5 transition-all shadow-lg group"
              title="Zoom Out"
            >
              <ZoomOut className="w-4 h-4 text-white/60 group-hover:text-white transition-colors" />
            </button>
            <button 
              onClick={resetView}
              className="p-2 bg-white/5 backdrop-blur-md hover:bg-white/10 rounded-full border border-white/5 transition-all shadow-lg group"
              title="Reset View"
            >
              <Maximize className="w-4 h-4 text-white/60 group-hover:text-white transition-colors" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Footer - Hidden on Bracket */}
      {activeTab !== 'bracket' && (
        <footer className="mt-32 border-t border-white/10 bg-[#020a06]/90 backdrop-blur-xl py-16">
          <div className="container mx-auto px-4 text-center">
            <div className="text-[10px] font-mono text-white/20 uppercase tracking-widest">
              © 2026 NEON DOMINO FEDERATION // ALL RIGHTS RESERVED
            </div>
          </div>
        </footer>
      )}

      {/* Navigation Floating Button (When in full screen) */}
      <AnimatePresence>
        {(activeTab === 'home' || activeTab === 'bracket') && (
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            className="fixed top-8 right-8 z-50 flex flex-col gap-4"
          >
            <button 
              onClick={() => setActiveTab(activeTab === 'home' ? 'bracket' : 'home')}
              className="w-12 h-12 glass border-white/10 text-white rounded-xl flex items-center justify-center hover:bg-white/10 transition-all shadow-xl"
              title={activeTab === 'home' ? "View Bracket" : "Back to Home"}
            >
              {activeTab === 'home' ? <Trophy className="w-5 h-5" /> : <LayoutGrid className="w-5 h-5" />}
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Info Floating Button - Hidden on Bracket */}
      {activeTab !== 'bracket' && (
        <div className="fixed bottom-8 right-8 z-50">
          <button 
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="w-14 h-14 bg-neon-green text-white rounded-2xl shadow-[0_0_30px_rgba(4,129,64,0.3)] flex items-center justify-center hover:scale-110 hover:rotate-6 transition-all duration-300 group"
          >
            <Trophy className="w-6 h-6 group-hover:scale-110 transition-transform" />
          </button>
        </div>
      )}
    </div>
  );
}
