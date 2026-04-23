import { Fragment, useEffect, useMemo, useState } from 'react';
import html2canvas from 'html2canvas';

/* ======================== DATOS DEL MUNDIAL 2026 ======================== */
const GR = [
  { n: 'A', t: [{ id: 'mex', nm: 'México', c: 'mx' }, { id: 'zaf', nm: 'Sudáfrica', c: 'za' }, { id: 'kor', nm: 'Corea del Sur', c: 'kr' }, { id: 'cze', nm: 'República Checa', c: 'cz' }] },
  { n: 'B', t: [{ id: 'can', nm: 'Canadá', c: 'ca' }, { id: 'bih', nm: 'Bosnia y Herz.', c: 'ba' }, { id: 'qat', nm: 'Catar', c: 'qa' }, { id: 'sui', nm: 'Suiza', c: 'ch' }] },
  { n: 'C', t: [{ id: 'bra', nm: 'Brasil', c: 'br' }, { id: 'mar', nm: 'Marruecos', c: 'ma' }, { id: 'hai', nm: 'Haití', c: 'ht' }, { id: 'sco', nm: 'Escocia', c: 'gb-sct' }] },
  { n: 'D', t: [{ id: 'usa', nm: 'EE. UU.', c: 'us' }, { id: 'pry', nm: 'Paraguay', c: 'py' }, { id: 'aus', nm: 'Australia', c: 'au' }, { id: 'tur', nm: 'Turquía', c: 'tr' }] },
  { n: 'E', t: [{ id: 'ger', nm: 'Alemania', c: 'de' }, { id: 'cur', nm: 'Curazao', c: 'cw' }, { id: 'civ', nm: 'Costa de Marfil', c: 'ci' }, { id: 'ecu', nm: 'Ecuador', c: 'ec' }] },
  { n: 'F', t: [{ id: 'ned', nm: 'Países Bajos', c: 'nl' }, { id: 'jpn', nm: 'Japón', c: 'jp' }, { id: 'swe', nm: 'Suecia', c: 'se' }, { id: 'tun', nm: 'Túnez', c: 'tn' }] },
  { n: 'G', t: [{ id: 'bel', nm: 'Bélgica', c: 'be' }, { id: 'egy', nm: 'Egipto', c: 'eg' }, { id: 'irn', nm: 'Irán', c: 'ir' }, { id: 'nzl', nm: 'Nueva Zelanda', c: 'nz' }] },
  { n: 'H', t: [{ id: 'esp', nm: 'España', c: 'es' }, { id: 'cpv', nm: 'Cabo Verde', c: 'cv' }, { id: 'ksa', nm: 'Arabia Saudita', c: 'sa' }, { id: 'uru', nm: 'Uruguay', c: 'uy' }] },
  { n: 'I', t: [{ id: 'fra', nm: 'Francia', c: 'fr' }, { id: 'sen', nm: 'Senegal', c: 'sn' }, { id: 'irq', nm: 'Irak', c: 'iq' }, { id: 'nor', nm: 'Noruega', c: 'no' }] },
  { n: 'J', t: [{ id: 'arg', nm: 'Argentina', c: 'ar' }, { id: 'alg', nm: 'Argelia', c: 'dz' }, { id: 'aut', nm: 'Austria', c: 'at' }, { id: 'jor', nm: 'Jordania', c: 'jo' }] },
  { n: 'K', t: [{ id: 'por', nm: 'Portugal', c: 'pt' }, { id: 'cod', nm: 'RD Congo', c: 'cd' }, { id: 'uzb', nm: 'Uzbekistán', c: 'uz' }, { id: 'col', nm: 'Colombia', c: 'co' }] },
  { n: 'L', t: [{ id: 'eng', nm: 'Inglaterra', c: 'gb-eng' }, { id: 'cro', nm: 'Croacia', c: 'hr' }, { id: 'gha', nm: 'Ghana', c: 'gh' }, { id: 'pan', nm: 'Panamá', c: 'pa' }] }
];

/* Mapa de equipos por ID */
const TM = {};
GR.forEach(g => g.t.forEach(t => { TM[t.id] = { ...t, gr: g.n }; }));

/* Slots de los 16 partidos de Dieciseisavos */
const R32_SLOTS = [
  [{ g: 'A', p: 0 }, { bt: 0 }], [{ g: 'B', p: 0 }, { bt: 1 }], [{ g: 'C', p: 0 }, { bt: 2 }], [{ g: 'D', p: 0 }, { bt: 3 }],
  [{ g: 'E', p: 0 }, { bt: 4 }], [{ g: 'F', p: 0 }, { bt: 5 }], [{ g: 'G', p: 0 }, { bt: 6 }], [{ g: 'H', p: 0 }, { bt: 7 }],
  [{ g: 'I', p: 0 }, { g: 'L', p: 1 }], [{ g: 'J', p: 0 }, { g: 'K', p: 1 }], [{ g: 'K', p: 0 }, { g: 'J', p: 1 }], [{ g: 'L', p: 0 }, { g: 'I', p: 1 }],
  [{ g: 'A', p: 1 }, { g: 'B', p: 1 }], [{ g: 'C', p: 1 }, { g: 'D', p: 1 }], [{ g: 'E', p: 1 }, { g: 'F', p: 1 }], [{ g: 'G', p: 1 }, { g: 'H', p: 1 }]
];

/* Conexiones entre rondas */
const FEED = {
  r16: [[0, 1], [2, 3], [4, 5], [6, 7], [8, 9], [10, 11], [12, 13], [14, 15]],
  qf: [[0, 1], [2, 3], [4, 5], [6, 7]],
  sf: [[0, 1], [2, 3]],
  fi: [[0, 1]]
};
const RORD = ['r32', 'r16', 'qf', 'sf', 'fi'];
const RN = { r32: 'Dieciseisavos', r16: 'Octavos', qf: 'Cuartos', sf: 'Semifinales', fi: 'Final' };
const RS = { r32: '32AVOS', r16: '16AVOS', qf: 'CUARTOS', sf: 'SEMIS', fi: 'FINAL' };

const TEAM_STRENGTH = {
  arg: 96, fra: 95, bra: 93, eng: 92, esp: 92, por: 91, ger: 90, ned: 88, bel: 86, cro: 84,
  uru: 84, col: 83, mar: 82, sui: 81, usa: 80, nor: 80, mex: 79, swe: 78, jpn: 77, sen: 76,
  ecu: 76, tur: 75, aut: 75, can: 74, kor: 73, irn: 73, pry: 71, gha: 70, egy: 70, civ: 69,
  alg: 68, sco: 68, aus: 67, cze: 67, bih: 66, tun: 66, pan: 64, ksa: 63, uzb: 63, qat: 61,
  zaf: 60, irq: 59, jor: 58, cpv: 57, cod: 57, nzl: 56, cur: 55, hai: 53
};

const SOURCE_URL = 'https://www.365scores.com/es/football/league/fifa-world-cup-5930/stats';

const TEAM_STATS = {
  eng: { gf: { t: 13, p: 2.6 }, ga: { t: 4, p: .8 }, cs: { pj: 5, v: 3 }, pos: { pj: 5, v: '63%' }, cor: { t: 25, p: 5 }, ps: { g: 13, v: '1/2' }, pc: { ga: 4, v: '1/1' }, rc: { ya: 1, v: 0 }, yc: { rc: 0, v: 1 } },
  por: { gf: { t: 12, p: 2.4 }, ga: { t: 6, p: 1.2 }, cs: { pj: 5, v: 1 }, pos: { pj: 5, v: '60%' }, cor: { t: 28, p: 5.6 }, ps: { g: 12, v: '2/2' }, rc: { ya: 6, v: 0 }, yc: { rc: 0, v: 6 } },
  fra: { gf: { t: 16, p: 2.29 }, ga: { t: 8, p: 1.14 }, cs: { pj: 7, v: 1 }, pos: { pj: 7, v: '52%' }, cor: { t: 38, p: 5.43 }, ps: { g: 16, v: '2/2' }, pc: { ga: 8, v: '3/4' }, rc: { ya: 8, v: 0 }, yc: { rc: 0, v: 8 } },
  esp: { gf: { t: 9, p: 2.25 }, ga: { t: 3, p: .75 }, cs: { pj: 4, v: 2 }, pos: { pj: 4, v: '77%' }, cor: { t: 22, p: 5.5 }, ps: { g: 9, v: '1/1' }, rc: { ya: 2, v: 0 }, yc: { rc: 0, v: 2 } },
  arg: { gf: { t: 15, p: 2.14 }, ga: { t: 8, p: 1.14 }, cs: { pj: 7, v: 3 }, pos: { pj: 7, v: '57%' }, cor: { t: 39, p: 5.57 }, ps: { g: 15, v: '4/5' }, pc: { ga: 8, v: '2/2' }, rc: { ya: 17, v: 0 }, yc: { rc: 0, v: 17 } },
  ned: { gf: { t: 10, p: 2 }, ga: { t: 4, p: .8 }, cs: { pj: 5, v: 2 }, pos: { pj: 5, v: '53%' }, cor: { t: 19, p: 3.8 }, pc: { ga: 4, v: '1/1' }, rc: { ya: 10, v: 1 }, yc: { rc: 1, v: 10 } },
  ger: { gf: { t: 6, p: 2 }, ga: { t: 5, p: 1.67 }, cs: { pj: 3, v: 0 }, pos: { pj: 3, v: '59%' }, cor: { t: 25, p: 8.33 }, ps: { g: 6, v: '1/1' }, rc: { ya: 3, v: 0 }, yc: { rc: 0, v: 3 } },
  gha: { gf: { t: 5, p: 1.67 }, ga: { t: 7, p: 2.33 }, cs: { pj: 3, v: 0 }, pos: { pj: 3, v: '42%' }, cor: { t: 13, p: 4.33 }, ps: { g: 5, v: '0/1' }, pc: { ga: 7, v: '1/1' }, rc: { ya: 8, v: 0 }, yc: { rc: 0, v: 8 } },
  bra: { gf: { t: 8, p: 1.6 }, ga: { t: 3, p: .6 }, cs: { pj: 5, v: 2 }, pos: { pj: 5, v: '55%' }, cor: { t: 37, p: 7.4 }, ps: { g: 8, v: '1/1' }, rc: { ya: 6, v: 0 }, yc: { rc: 0, v: 6 } },
  ecu: { gf: { t: 4, p: 1.33 }, ga: { t: 3, p: 1 }, cs: { pj: 3, v: 1 }, pos: { pj: 3, v: '53%' }, cor: { t: 11, p: 3.67 }, ps: { g: 4, v: '1/1' }, pc: { ga: 3, v: '1/1' }, rc: { ya: 3, v: 0 }, yc: { rc: 0, v: 3 } },
  irn: { gf: { t: 4, p: 1.33 }, ga: { t: 7, p: 2.33 }, cs: { pj: 3, v: 1 }, pos: { pj: 3, v: '36%' }, cor: { t: 8, p: 2.67 }, ps: { g: 4, v: '1/1' }, rc: { ya: 7, v: 0 }, yc: { rc: 0, v: 7 } },
  kor: { gf: { t: 5, p: 1.25 }, ga: { t: 8, p: 2 }, cs: { pj: 4, v: 1 }, pos: { pj: 4, v: '48%' }, cor: { t: 25, p: 6.25 }, pc: { ga: 8, v: '1/1' }, rc: { ya: 6, v: 0 }, yc: { rc: 0, v: 6 } },
  jpn: { gf: { t: 5, p: 1.25 }, ga: { t: 4, p: 1 }, cs: { pj: 4, v: 0 }, pos: { pj: 4, v: '35%' }, cor: { t: 19, p: 4.75 }, pc: { ga: 4, v: '1/1' }, rc: { ya: 6, v: 0 }, yc: { rc: 0, v: 6 } },
  sen: { gf: { t: 5, p: 1.25 }, ga: { t: 7, p: 1.75 }, cs: { pj: 4, v: 0 }, pos: { pj: 4, v: '45%' }, cor: { t: 22, p: 5.5 }, ps: { g: 5, v: '1/1' }, rc: { ya: 7, v: 0 }, yc: { rc: 0, v: 7 } },
  sui: { gf: { t: 5, p: 1.25 }, ga: { t: 9, p: 2.25 }, cs: { pj: 4, v: 1 }, pos: { pj: 4, v: '49%' }, cor: { t: 20, p: 5 }, rc: { ya: 9, v: 0 }, yc: { rc: 0, v: 9 } },
  cro: { gf: { t: 8, p: 1.14 }, ga: { t: 7, p: 1 }, cs: { pj: 7, v: 2 }, pos: { pj: 7, v: '54%' }, cor: { t: 31, p: 4.43 }, pc: { ga: 7, v: '1/1' }, rc: { ya: 8, v: 0 }, yc: { rc: 0, v: 8 } },
  aus: { gf: { t: 4, p: 1 }, ga: { t: 6, p: 1.5 }, cs: { pj: 4, v: 2 }, pos: { pj: 4, v: '38%' }, cor: { t: 8, p: 2 }, rc: { ya: 7, v: 0 }, yc: { rc: 0, v: 7 } },
  ksa: { gf: { t: 3, p: 1 }, ga: { t: 5, p: 1.67 }, cs: { pj: 3, v: 0 }, pos: { pj: 3, v: '45%' }, cor: { t: 8, p: 2.67 }, ps: { g: 3, v: '0/1' }, pc: { ga: 5, v: '1/1' }, rc: { ya: 14, v: 0 }, yc: { rc: 0, v: 14 } },
  mar: { gf: { t: 6, p: .86 }, ga: { t: 5, p: .71 }, cs: { pj: 7, v: 4 }, pos: { pj: 7, v: '38%' }, cor: { t: 12, p: 1.71 }, rc: { ya: 7, v: 1 }, yc: { rc: 1, v: 7 } },
  usa: { gf: { t: 3, p: .75 }, ga: { t: 4, p: 1 }, cs: { pj: 4, v: 2 }, pos: { pj: 4, v: '53%' }, cor: { t: 22, p: 5.5 }, pc: { ga: 4, v: '1/1' }, rc: { ya: 5, v: 0 }, yc: { rc: 0, v: 5 } },
  can: { gf: { t: 2, p: .67 }, ga: { t: 7, p: 2.33 }, cs: { pj: 3, v: 0 }, pos: { pj: 3, v: '52%' }, cor: { t: 12, p: 4 }, ps: { g: 2, v: '0/1' }, rc: { ya: 8, v: 0 }, yc: { rc: 0, v: 8 } },
  mex: { gf: { t: 2, p: .67 }, ga: { t: 3, p: 1 }, cs: { pj: 3, v: 1 }, pos: { pj: 3, v: '54%' }, cor: { t: 16, p: 5.33 }, pc: { ga: 3, v: '0/1' }, rc: { ya: 7, v: 0 }, yc: { rc: 0, v: 7 } },
  uru: { gf: { t: 2, p: .67 }, ga: { t: 2, p: .67 }, cs: { pj: 3, v: 2 }, pos: { pj: 3, v: '49%' }, cor: { t: 8, p: 2.67 }, pc: { ga: 2, v: '1/2' }, rc: { ya: 8, v: 0 }, yc: { rc: 0, v: 8 } },
  bel: { gf: { t: 1, p: .33 }, ga: { t: 2, p: .67 }, cs: { pj: 3, v: 2 }, pos: { pj: 3, v: '57%' }, cor: { t: 17, p: 5.67 }, pc: { ga: 2, v: '0/1' }, rc: { ya: 5, v: 0 }, yc: { rc: 0, v: 5 } },
  qat: { gf: { t: 1, p: .33 }, ga: { t: 7, p: 2.33 }, cs: { pj: 3, v: 0 }, pos: { pj: 3, v: '43%' }, cor: { t: 9, p: 3 }, pc: { ga: 7, v: '1/1' }, rc: { ya: 7, v: 0 }, yc: { rc: 0, v: 7 } },
  tun: { gf: { t: 1, p: .33 }, ga: { t: 1, p: .33 }, cs: { pj: 3, v: 2 }, pos: { pj: 3, v: '43%' }, cor: { t: 21, p: 7 }, rc: { ya: 5, v: 0 }, yc: { rc: 0, v: 5 } }
};

function simulateGroups() {
  const next = {};
  GR.forEach(g => {
    next[g.n] = [...g.t]
      .map(t => {
        const base = TEAM_STRENGTH[t.id] ?? 60;
        const volatility = 10 + Math.random() * 8;
        return { ...t, score: base + (Math.random() - .5) * volatility };
      })
      .sort((a, b) => b.score - a.score)
      .slice(0, 3)
      .map(t => t.id);
  });
  return next;
}

function flg(c) { return '/flags/' + c + '.svg'; }

function Icon({ name = 'check', label, className = '', style }) {
  const common = { viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', strokeWidth: '1.9', strokeLinecap: 'round', strokeLinejoin: 'round', 'aria-hidden': 'true' };
  const paths = {
    check: <path d="M5 12.5l4.2 4.2L19 7" />,
    chevron: <path d="M9 6l6 6-6 6" />,
    share: <><path d="M8.5 13.5l7-4" /><path d="M8.5 10.5l7 4" /><circle cx="6" cy="12" r="2.5" /><circle cx="18" cy="7.5" r="2.5" /><circle cx="18" cy="16.5" r="2.5" /></>,
    link: <><path d="M10.2 13.8a4 4 0 0 1 0-5.6l1.6-1.6a4 4 0 0 1 5.6 5.6l-.8.8" /><path d="M13.8 10.2a4 4 0 0 1 0 5.6l-1.6 1.6a4 4 0 0 1-5.6-5.6l.8-.8" /></>,
    chart: <><path d="M5 19V5" /><path d="M5 19h14" /><path d="M9 15v-4" /><path d="M13 15V8" /><path d="M17 15v-6" /></>,
    info: <><circle cx="12" cy="12" r="8" /><path d="M12 11v5" /><path d="M12 8h.01" /></>,
    close: <><path d="M6 6l12 12" /><path d="M18 6L6 18" /></>,
    external: <><path d="M14 5h5v5" /><path d="M10 14L19 5" /><path d="M19 14v4a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1V6a1 1 0 0 1 1-1h4" /></>,
    download: <><path d="M12 4v10" /><path d="M8 10l4 4 4-4" /><path d="M5 19h14" /></>,
    trophy: <><path d="M8 4h8v5a4 4 0 0 1-8 0V4z" /><path d="M8 6H5.5A2.5 2.5 0 0 0 8 10" /><path d="M16 6h2.5A2.5 2.5 0 0 1 16 10" /><path d="M12 13v4" /><path d="M8.5 20h7" /></>,
    restart: <><path d="M4 12a8 8 0 1 0 2.35-5.65" /><path d="M4 5v5h5" /></>,
    spark: <><path d="M12 3l1.7 5.1L19 10l-5.3 1.9L12 17l-1.7-5.1L5 10l5.3-1.9L12 3z" /><path d="M19 15l.8 2.2L22 18l-2.2.8L19 21l-.8-2.2L16 18l2.2-.8L19 15z" /></>
  };
  return <svg className={"icon " + className} style={style} {...common}>{paths[name] || paths.check}<title>{label}</title></svg>;
}

function phaseLabel(phase) {
  return { groups: 'Fase de grupos', bestThird: 'Mejores terceros', knockout: 'Eliminatorias', champion: 'Campeón' }[phase] || 'Simulador';
}

/* ======================== APP PRINCIPAL ======================== */
export default function App() {
  const [phase, setPhase] = useState('groups');
  const [gSel, setGSel] = useState({});
  const [btSel, setBtSel] = useState([]);
  const [bracket, setBracket] = useState({ r32: [], r16: [], qf: [], sf: [], fi: [] });
  const [curRound, setCurRound] = useState('r32');
  const [champion, setChampion] = useState(null);
  const [insightTeam, setInsightTeam] = useState(null);
  const [toast, setToast] = useState({ s: false, m: '' });

  const completedGroups = GR.filter(g => (gSel[g.n] || []).length === 3).length;
  const bracketDone = RORD.reduce((acc, r) => acc + (bracket[r] || []).filter(m => m.winner).length, 0);
  const totalProgress = phase === 'champion' ? 100 :
    phase === 'knockout' ? Math.round((36 + bracketDone / 31 * 64)) :
      phase === 'bestThird' ? Math.round(30 + btSel.length / 8 * 6) :
        Math.round(completedGroups / 12 * 30);

  const notify = (m) => { setToast({ s: true, m }); setTimeout(() => setToast({ s: false, m: '' }), 2500); };

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [phase]);

  /* Toggle seleccion en grupo */
  const toggleGroup = (gn, tid) => {
    setGSel(prev => {
      const cur = prev[gn] || [];
      const idx = cur.indexOf(tid);
      if (idx >= 0) return { ...prev, [gn]: cur.filter(x => x !== tid) };
      if (cur.length >= 3) return prev;
      return { ...prev, [gn]: [...cur, tid] };
    });
  };

  const autoFillGroups = () => {
    setGSel(simulateGroups());
    notify('Grupos simulados. Puedes ajustar cualquier selección.');
  };

  /* Equipos terceros */
  const thirdTeams = useMemo(() => {
    return GR.map(g => {
      const sel = gSel[g.n] || [];
      const third = sel.length === 3 ? sel[2] : null;
      return { group: g.n, team: third ? TM[third] : null, tid: third };
    }).filter(x => x.tid);
  }, [gSel]);

  /* Avanzar a mejores terceros */
  const goBestThird = () => {
    const allDone = GR.every(g => (gSel[g.n] || []).length === 3);
    if (!allDone) return;
    setPhase('bestThird');
  };

  /* Toggle mejor tercero */
  const toggleBT = (tid) => {
    setBtSel(prev => {
      if (prev.includes(tid)) return prev.filter(x => x !== tid);
      if (prev.length >= 8) return prev;
      return [...prev, tid];
    });
  };

  /* Avanzar a eliminatorias */
  const goKnockout = () => {
    if (btSel.length !== 8) return;
    const sorted = [...btSel].sort((a, b) => {
      const ga = TM[a].gr, gb = TM[b].gr;
      return GR.findIndex(g => g.n === ga) - GR.findIndex(g => g.n === gb);
    });
    const gs = gSel;
    const r32 = R32_SLOTS.map(([s1, s2]) => {
      let t1 = null, t2 = null;
      if (s1.g !== undefined) t1 = (gs[s1.g] || [])[s1.p] || null;
      else t1 = sorted[s1.bt] || null;
      if (s2.g !== undefined) t2 = (gs[s2.g] || [])[s2.p] || null;
      else t2 = sorted[s2.bt] || null;
      return { team1: t1, team2: t2, winner: null };
    });
    setBracket({
      r32,
      r16: Array.from({ length: 8 }, () => ({ team1: null, team2: null, winner: null })),
      qf: Array.from({ length: 4 }, () => ({ team1: null, team2: null, winner: null })),
      sf: Array.from({ length: 2 }, () => ({ team1: null, team2: null, winner: null })),
      fi: [{ team1: null, team2: null, winner: null }]
    });
    setCurRound('r32');
    setPhase('knockout');
  };

  /* Limpiar resultados en cascada */
  function clearDown(bk, rnd, mi) {
    bk[rnd][mi].winner = null;
    const ri = RORD.indexOf(rnd);
    if (ri < RORD.length - 1) {
      const nr = RORD[ri + 1];
      const fd = FEED[nr];
      const fi = fd.findIndex(f => f.includes(mi));
      if (fi >= 0) {
        const slot = fd[fi].indexOf(mi);
        if (slot === 0) bk[nr][fi].team1 = null;
        else bk[nr][fi].team2 = null;
        clearDown(bk, nr, fi);
      }
    }
  }

  /* Seleccionar ganador en eliminatoria */
  const pickWinner = (rnd, mi, tid) => {
    const nb = JSON.parse(JSON.stringify(bracket));
    nb[rnd][mi].winner = tid;
    const ri = RORD.indexOf(rnd);
    if (ri < RORD.length - 1) {
      const nr = RORD[ri + 1];
      const fd = FEED[nr];
      const fi = fd.findIndex(f => f.includes(mi));
      if (fi >= 0) {
        const slot = fd[fi].indexOf(mi);
        if (slot === 0) nb[nr][fi].team1 = tid;
        else nb[nr][fi].team2 = tid;
        const nm = nb[nr][fi];
        if (nm.winner && nm.winner !== nm.team1 && nm.winner !== nm.team2) {
          clearDown(nb, nr, fi);
        }
      }
    }
    const allDone = nb[rnd].every(m => m.winner);
    if (allDone && rnd !== 'fi') {
      const nri = RORD.indexOf(rnd);
      setCurRound(RORD[nri + 1]);
    }
    if (rnd === 'fi') {
      setChampion(tid);
      setTimeout(() => setPhase('champion'), 600);
    }
    setBracket(nb);
  };

  /* Reiniciar */
  const restart = () => {
    setPhase('groups'); setGSel({}); setBtSel([]);
    setBracket({ r32: [], r16: [], qf: [], sf: [], fi: [] });
    setCurRound('r32'); setChampion(null);
  };

  return (
    <div className="relative z-10 min-h-screen flex flex-col">
      <Header phase={phase} progress={totalProgress} />
      <Stepper phase={phase} />
      <main className="flex-1 pb-8">
        {phase === 'groups' && <GroupPhase gSel={gSel} toggle={toggleGroup} go={goBestThird} simulate={autoFillGroups} openInsight={setInsightTeam} />}
        {phase === 'bestThird' && <BTPhase teams={thirdTeams} sel={btSel} toggle={toggleBT} go={goKnockout} />}
        {phase === 'knockout' && <KOPhase bracket={bracket} cur={curRound} pick={pickWinner} />}
        {phase === 'champion' && <ChampScreen champ={champion} bracket={bracket} restart={restart} notify={notify} />}
      </main>
      {insightTeam && <TeamInsight team={TM[insightTeam]} onClose={() => setInsightTeam(null)} />}
      <ToastC msg={toast.m} show={toast.s} />
    </div>
  );
}

/* ======================== HEADER ======================== */
function Header({ phase, progress }) {
  return (
    <header className="app-header sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <span className="brand-mark">
            <img src="/img/logo_rpp.svg" alt="RPP" />
          </span>
          <div className="header-divider"></div>
          <div>
            <span className="header-title">SIMULADOR</span>
            <span className="header-subtitle">Mundial 2026</span>
          </div>
        </div>
        <div className="header-status">
          <div className="flex items-center gap-2">
            <span>{progress}%</span>
            <span className="header-status-label">Global</span>
          </div>
          <div className="header-meter"><i style={{ width: progress + '%' }}></i></div>
        </div>
      </div>
    </header>
  );
}

/* ======================== STEPPER ======================== */
function Stepper({ phase }) {
  const steps = [{ id: 'groups', l: 'Grupos' }, { id: 'bestThird', l: 'Terceros' }, { id: 'knockout', l: 'Eliminatoria' }, { id: 'champion', l: 'Campeón' }];
  const idx = steps.findIndex(s => s.id === phase);
  return (
    <div className="flex items-center justify-center gap-0 py-3 px-4 overflow-x-auto">
      {steps.map((s, i) => (
        <Fragment key={s.id}>
          <div className={"step-item " + (i < idx ? 'ok ' : '') + (i === idx ? 'act' : '')}>
            <div className="step-dot"></div>
            <span className="hidden sm:inline">{s.l}</span>
          </div>
          {i < steps.length - 1 && <div className={"step-line " + (i < idx ? 'ok' : '')}></div>}
        </Fragment>
      ))}
    </div>
  );
}

/* ======================== FASE DE GRUPOS ======================== */
function GroupPhase({ gSel, toggle, go, simulate, openInsight }) {
  const allDone = GR.every(g => (gSel[g.n] || []).length === 3);
  const completeCount = GR.filter(g => (gSel[g.n] || []).length === 3).length;
  const groupProgress = Math.round(completeCount / 12 * 100);
  return (
    <div className="phase-wrap">
      <div className="flow-hero a-up">
        <h1 className="font-display text-3xl sm:text-5xl font-bold tracking-wide">Simulador del Mundial 2026</h1>
        <p className="phase-lead">Crea tu ruta al título, define clasificados y comparte tu campeón.</p>
      </div>
      <div className="phase-bar a-up">
        <div>
          <div className="eyebrow">Pronóstico inicial</div>
          <h2 className="font-display text-lg sm:text-xl font-bold tracking-wide">FASE DE GRUPOS</h2>
        </div>
        <p>Ordena los 3 clasificados de cada grupo.</p>
        <div className="phase-tools">
          <div className="phase-progress">
            <div className="phase-progress-bar"><i style={{ width: groupProgress + '%' }}></i></div>
            <span>{completeCount}/12 grupos cerrados</span>
          </div>
          <button className="btn-s icon-btn" onClick={simulate} title="Auto-completa con una proyección balanceada; luego puedes editar cualquier grupo.">
            <Icon name="spark" label="Auto-simular grupos" /> Auto-simular grupos
          </button>
        </div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 px-4 max-w-7xl mx-auto">
        {GR.map((g, gi) => (
          <GCard key={g.n} group={g} sel={gSel[g.n] || []} toggle={toggle} delay={gi} openInsight={openInsight} />
        ))}
      </div>
      <div className="sticky-action text-center mt-8 pb-4 a-up">
        <button className="btn-p" disabled={!allDone} onClick={go}>Continuar a mejores terceros</button>
      </div>
    </div>
  );
}

function GCard({ group, sel, toggle, delay, openInsight }) {
  const cnt = sel.length;
  const ok = cnt === 3;
  return (
    <div className={"g-card a-up" + (ok ? ' complete' : '')} style={{ animationDelay: delay * 40 + 'ms' }}>
      <div className="g-card-top">
        <span className="g-title">GRUPO {group.n}</span>
        <span className={"g-pill " + (ok ? 'done' : '')}>
          {ok ? 'Cerrado' : cnt + '/3'}
        </span>
      </div>
      <div className="g-rankline" style={{ '--rank': (cnt / 3 * 100) + '%' }}></div>
      <div className="p-2 flex flex-col gap-1">
        {group.t.map(tm => {
          const pi = sel.indexOf(tm.id);
          const cls = pi >= 0 ? ' s' + (pi + 1) : '';
          return (
            <button key={tm.id} type="button" className={"team-row" + cls} onClick={() => toggle(group.n, tm.id)}>
              <div className="pos-b">{pi >= 0 ? (pi + 1) : ''}</div>
              <img className="flag-img" src={flg(tm.c, 160)} alt={tm.nm} onError={e => { e.target.style.opacity = '0.2' }} />
              <span className="font-medium text-sm flex-1">{tm.nm}</span>
              <button className="stats-btn" type="button" aria-label={`Ver datos de ${tm.nm}`}
                onClick={e => { e.stopPropagation(); openInsight(tm.id); }}>
                <Icon name="info" label={'Datos de ' + tm.nm} />
                <span>Datos</span>
              </button>
            </button>
          );
        })}
      </div>
    </div>
  );
}

/* ======================== MEJORES TERCEROS ======================== */
function BTPhase({ teams, sel, toggle, go }) {
  const cnt = sel.length;
  const remaining = 8 - cnt;
  return (
    <div className="max-w-4xl mx-auto px-4">
      <div className="phase-hero text-center mb-6 a-up">
        <div className="eyebrow">Últimos boletos</div>
        <h2 className="font-display text-2xl sm:text-3xl font-bold tracking-wide">MEJORES TERCEROS</h2>
        <p className="text-gray-500 text-sm mt-1">{remaining > 0 ? remaining + ' cupos siguen abiertos.' : 'La frontera está definida.'}</p>
        <div className="mt-3 flex items-center justify-center gap-2">
          <div className="h-2 flex-1 max-w-xs rounded-full bg-[#1C1C2E] overflow-hidden">
            <div className="h-full rounded-full transition-all duration-300" style={{ background: '#A3E635', width: (cnt / 8 * 100) + '%' }}></div>
          </div>
          <span className={"text-sm font-semibold " + (cnt === 8 ? "text-[#A3E635]" : "text-gray-500")}>{cnt}/8</span>
        </div>
      </div>
      <div className="survival-grid grid grid-cols-1 sm:grid-cols-2 gap-3">
        {teams.map(({ team, tid, group }) => {
          if (!team) return null;
          const isSel = sel.includes(tid);
          return (
            <button key={tid} type="button" className={"third-c" + (isSel ? ' sel' : '')} onClick={() => toggle(tid)}>
              <img className="flag-img" src={flg(team.c, 160)} alt={team.nm} onError={e => { e.target.style.opacity = '0.2' }} />
              <div className="flex-1">
                <div className="font-medium text-sm">{team.nm}</div>
                <div className="text-xs text-gray-500">3° Grupo {group}</div>
              </div>
              {isSel && (
                <div className="select-mark">
                  <Icon name="check" label="Seleccionado" />
                </div>
              )}
            </button>
          );
        })}
      </div>
      <div className="text-center mt-8 pb-4">
        <button className="btn-p" disabled={cnt !== 8} onClick={go}>Continuar a eliminatorias</button>
      </div>
    </div>
  );
}

/* ======================== ELIMINATORIAS ======================== */
function KOPhase({ bracket, cur, pick }) {
  return (
    <div className="ko-shell">
      <div className="phase-hero text-center mb-4 a-up">
        <div className="eyebrow">Ruta al título</div>
        <h2 className="font-display text-2xl sm:text-3xl font-bold tracking-wide">FASE ELIMINATORIA</h2>
        <p className="text-gray-500 text-sm mt-1">Selecciona el ganador de cada partido</p>
      </div>
      <div className="bk-m"><KOMobile bracket={bracket} cur={cur} pick={pick} /></div>
      <div className="bk-d"><KODesktop bracket={bracket} cur={cur} pick={pick} /></div>
    </div>
  );
}

/* Componente de partido */
function MatchView({ match, onPick, interactive }) {
  const t1 = match.team1 ? TM[match.team1] : null;
  const t2 = match.team2 ? TM[match.team2] : null;
  const w = match.winner;
  return (
    <div className={"m-card" + (w ? ' decided' : '') + (!interactive ? ' locked' : '')}>
      <button type="button" className={"m-tm" + (!t1 ? ' empty' : (w === match.team1 ? ' w' : (w ? ' l' : '')))}
        onClick={t1 && interactive ? () => onPick(match.team1) : undefined}
        disabled={!t1 || !interactive}
        aria-label={t1 ? `Seleccionar ${t1.nm} como ganador` : undefined}>
        {t1 ? (
          <>
            <img className="flag-img" src={flg(t1.c, 160)} alt={t1.nm} onError={e => { e.target.style.opacity = '0.2' }} />
            <span className="font-medium text-sm flex-1">{t1.nm}</span>
            {w === match.team1 && <Icon name="chevron" label="Ganador" className="winner-icon" />}
          </>
        ) : <span className="text-xs text-gray-600">Por definir</span>}
      </button>
      <div className="border-t border-[#1C1C2E]"></div>
      <button type="button" className={"m-tm" + (!t2 ? ' empty' : (w === match.team2 ? ' w' : (w ? ' l' : '')))}
        onClick={t2 && interactive ? () => onPick(match.team2) : undefined}
        disabled={!t2 || !interactive}
        aria-label={t2 ? `Seleccionar ${t2.nm} como ganador` : undefined}>
        {t2 ? (
          <>
            <img className="flag-img" src={flg(t2.c, 160)} alt={t2.nm} onError={e => { e.target.style.opacity = '0.2' }} />
            <span className="font-medium text-sm flex-1">{t2.nm}</span>
            {w === match.team2 && <Icon name="chevron" label="Ganador" className="winner-icon" />}
          </>
        ) : <span className="text-xs text-gray-600">Por definir</span>}
      </button>
    </div>
  );
}

/* Bracket Mobile */
function KOMobile({ bracket, cur, pick }) {
  const [tab, setTab] = useState(cur);
  useEffect(() => { setTab(cur); }, [cur]);

  const matches = bracket[tab] || [];
  const ri = RORD.indexOf(tab);
  const prevDone = ri === 0 || (bracket[RORD[ri - 1]] && bracket[RORD[ri - 1]].every(m => m.winner));
  const interactive = tab === cur && prevDone;

  return (
    <div className="px-4 py-2">
      <div className="flex gap-2 overflow-x-auto pb-3 mb-4">
        {RORD.map(r => {
          const ms = bracket[r] || [];
          const done = ms.length > 0 && ms.every(m => m.winner);
          const locked = RORD.indexOf(r) > RORD.indexOf(cur);
          return (
            <button key={r}
              className={"r-tab" + (tab === r ? ' act' : '') + (done ? ' done' : '') + (locked ? ' lock' : '')}
              onClick={!locked ? () => setTab(r) : undefined}
              disabled={locked}>{RS[r]}</button>
          );
        })}
      </div>
      <div className="flex flex-col gap-3">
        {matches.map((m, mi) => (
          <div key={tab + mi} className="a-up" style={{ animationDelay: mi * 40 + 'ms' }}>
            <div className="match-label">PARTIDO {mi + 1}</div>
            <MatchView match={m} onPick={tid => pick(tab, mi, tid)} interactive={interactive} />
          </div>
        ))}
      </div>
    </div>
  );
}

/* Bracket Desktop */
function KODesktop({ bracket, cur, pick }) {
  return (
    <div className="ko-desktop overflow-x-auto px-4 py-4">
      <div className="ko-lanes flex items-stretch gap-0 min-w-max">
        {RORD.map((rnd, ri) => {
          const ms = bracket[rnd] || [];
          const prevDone = ri === 0 || (bracket[RORD[ri - 1]] && bracket[RORD[ri - 1]].every(m => m.winner));
          const interactive = rnd === cur && prevDone;
          const done = ms.length > 0 && ms.every(m => m.winner);
          return (
            <Fragment key={rnd}>
              <div className={"ko-round flex flex-col " + (done ? 'round-done' : '') + (rnd === cur ? ' round-active' : '')} style={{ minWidth: '214px' }}>
                <div className="round-title">{RS[rnd]}</div>
                <div className="flex flex-col justify-around flex-1 gap-3 px-1">
                  {ms.map((m, mi) => (
                    <div key={mi}>
                      <MatchView match={m} onPick={tid => pick(rnd, mi, tid)} interactive={interactive} />
                    </div>
                  ))}
                </div>
              </div>
              {ri < RORD.length - 1 && (
                <div className="ko-connector flex flex-col items-center justify-around" style={{ width: '48px' }}>
                  <div style={{ height: '28px' }}></div>
                  {FEED[RORD[ri + 1]].map((_, fi) => (
                    <div key={fi} className="flex-1 flex items-center justify-center">
                      <div className="connector-line"></div>
                    </div>
                  ))}
                </div>
              )}
            </Fragment>
          );
        })}
      </div>
    </div>
  );
}

/* ======================== PANTALLA CAMPEÓN ======================== */
function ChampScreen({ champ, bracket, restart, notify }) {
  const [showCelebration, setShowCelebration] = useState(true);
  const team = TM[champ];

  useEffect(() => { const t = setTimeout(() => setShowCelebration(false), 4200); return () => clearTimeout(t); }, []);

  /* Timeline: camino del campeón */
  const timeline = useMemo(() => {
    const path = [];
    RORD.forEach(rnd => {
      (bracket[rnd] || []).forEach(m => {
        if (m.winner === champ) {
          const opp = m.team1 === champ ? m.team2 : m.team1;
          path.push({ round: RN[rnd], short: RS[rnd], opponent: opp, isFinal: rnd === 'fi' });
        }
      });
    });
    return path.reverse();
  }, [champ, bracket]);

  /* Celebración */
  const sparks = useMemo(() => {
    const pcs = []; const cols = ['#F5C542', '#A3E635', '#fff7d6'];
    for (let i = 0; i < 34; i++) pcs.push({
      x: 46 + (Math.random() - .5) * 68, y: 22 + Math.random() * 42, d: Math.random() * 1.2,
      dur: 2.4 + Math.random() * 1.8, c: cols[~~(Math.random() * cols.length)], sz: 2 + Math.random() * 4
    });
    return pcs;
  }, []);

  const copyURL = () => {
    navigator.clipboard.writeText(window.location.href).then(() => notify('URL copiada al portapapeles')).catch(() => notify('No se pudo copiar'));
  };
  const shareNative = async () => {
    const text = 'Mi campeón del Mundial 2026: ' + team.nm + ' - Simula tu pronóstico en RPP';
    if (!navigator.share) {
      copyURL();
      return;
    }
    try {
      await navigator.share({ title: 'Mundial 2026 - Simulador RPP', text, url: window.location.href });
    } catch (e) {
      notify('No se pudo compartir');
    }
  };

  /* Convert an SVG url to a PNG data-url that html2canvas can render */
  const svgToPng = (svgUrl, w, h) => new Promise((resolve) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      const c = document.createElement('canvas');
      c.width = w * 2; c.height = h * 2;
      const ctx = c.getContext('2d');
      ctx.drawImage(img, 0, 0, c.width, c.height);
      resolve(c.toDataURL('image/png'));
    };
    img.onerror = () => resolve('');
    img.src = svgUrl;
  });

  const downloadImg = async () => {
    const card = document.getElementById('share-card');
    notify('Generando imagen...');

    /* Pre-convert all SVG flags to PNG data URLs */
    const flagCodes = [team.c, ...timeline.map(t => { const o = TM[t.opponent]; return o ? o.c : 'xx'; })];
    const uniqueCodes = [...new Set(flagCodes)];
    const pngMap = {};
    await Promise.all(uniqueCodes.map(async (code) => {
      pngMap[code] = await svgToPng(flg(code), 80, 60);
    }));
    const logoPng = await svgToPng('/img/logo_rpp_original.svg', 44, 44);

    const F = 'font-family:Plus Jakarta Sans Variable,Plus Jakarta Sans,Arial,sans-serif;';

    const tlRows = timeline.map(t => {
      const opp = TM[t.opponent];
      const oppCode = opp ? opp.c : 'xx';
      const oppPng = pngMap[oppCode] || '';
      return '<div style="display:flex;align-items:center;gap:12px;margin-bottom:14px">' +
        '<div style="width:85px;' + F + 'font-weight:800;color:#A3E635;font-size:12px;text-transform:uppercase;letter-spacing:1px;line-height:22px;">' + t.short + '</div>' +
        '<div style="color:rgba(163,230,53,.82);' + F + 'font-size:11px;font-weight:800;letter-spacing:1px;line-height:22px;text-transform:uppercase;white-space:nowrap;">SUPERÓ A</div>' +
        '<div style="display:flex;align-items:center;gap:10px;flex:1">' +
        (oppPng ? '<img src="' + oppPng + '" width="28" height="21" style="width:28px;height:21px;border-radius:3px;object-fit:cover;display:block;transform:translateY(5px);" />' : '') +
        '<span style="color:#f4f4f7;' + F + 'font-weight:700;font-size:15px;line-height:22px;">' + (opp ? opp.nm : '?') + '</span></div></div>';
    }).join('');

    const champPng = pngMap[team.c] || '';

    card.style.left = '0';
    card.innerHTML =
      '<div style="position:absolute;inset:0;background:radial-gradient(ellipse at 50% 0%,rgba(245,197,66,.18) 0%,transparent 44%),radial-gradient(ellipse at 20% 70%,rgba(163,230,53,.12) 0%,transparent 48%),linear-gradient(180deg,#0b0b10,#050507)"></div>' +
      '<div style="position:relative;z-index:1">' +
      '<div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:34px">' +
      (logoPng ? '<img src="' + logoPng + '" style="height:45px;width:auto;display:block;" />' : '') +
      '<div style="' + F + 'font-weight:800;font-size:12px;color:#666;letter-spacing:2px;">MUNDIAL 2026</div></div>' +
      '<div style="' + F + 'font-size:32px;line-height:1.08;font-weight:800;color:#f4f4f7;letter-spacing:.2px;margin-bottom:8px">Mi campeón del Mundial 2026 es</div>' +
      '<div style="height:18px"></div>' +
      '<div style="display:flex;align-items:center;gap:20px;padding:24px;background:rgba(245,197,66,.09);border:1.5px solid rgba(245,197,66,.28);border-radius:10px;margin-bottom:32px">' +
      (champPng ? '<img src="' + champPng + '" width="80" height="60" style="width:80px;height:60px;border-radius:6px;object-fit:cover;display:block;" />' : '') +
      '<div style="flex:1"><div style="font-size:11px;color:#84CC16;' + F + 'font-weight:800;letter-spacing:2px;text-transform:uppercase;margin-bottom:6px;line-height:1;">CAMPEÓN</div>' +
      '<div style="' + F + 'font-size:36px;line-height:1;font-weight:800;color:#f0f0f5">' + team.nm.toUpperCase() + '</div></div>' +
      '<div style="position:relative;width:56px;height:56px;border-radius:50%;display:block;background:rgba(245,197,66,.14);color:#F5C542;font-size:26px;font-weight:900;' + F + 'text-align:center;"><span style="position:absolute;left:50%;top:calc(50% - 11px);transform:translate(-50%,-50%);white-space:nowrap;line-height:1">#1</span></div></div>' +
      '<div style="' + F + 'font-weight:800;font-size:13px;color:#A3E635;letter-spacing:2px;text-transform:uppercase;margin-bottom:16px;line-height:1;">RUTA AL TROFEO</div>' +
      tlRows +
      '<div style="padding-top:16px;border-top:1px solid #1C1C2E;margin-top:24px">' +
      '<div style="' + F + 'font-weight:800;font-size:16px;color:#A3E635;line-height:1.2;margin-bottom:8px">Haz el tuyo con el Simulador de RPP</div>' +
      '<div style="' + F + 'font-weight:700;font-size:12px;color:#6b7080;line-height:1.2">rpp.pe/mundial-2026/simulador-rpp</div></div></div>';

    /* Wait for PNG data-url images to paint in the DOM */
    await new Promise(r => setTimeout(r, 300));

    try {
      const canvas = await html2canvas(card, { backgroundColor: '#060609', scale: 2, useCORS: true, allowTaint: true });
      const link = document.createElement('a');
      link.download = 'mi-campeon-mundial-2026.png';
      link.href = canvas.toDataURL('image/png');
      link.click();
      notify('Imagen descargada exitosamente');
    } catch (e) { notify('Error al generar la imagen'); }
    card.style.left = '-9999px';
  };

  return (
    <div className="champ-stage min-h-screen flex flex-col items-center pt-6 pb-12 px-4">
      {showCelebration && <div className="champ-burst" aria-hidden="true"></div>}
      {showCelebration && sparks.map((p, i) => (
        <div key={i} className="champ-spark" style={{
          left: p.x + '%', top: p.y + '%', animationDelay: p.d + 's', animationDuration: p.dur + 's',
          backgroundColor: p.c, width: p.sz + 'px', height: p.sz + 'px'
        }}></div>
      ))}
      <div className="a-up text-center mb-8">
        <div className="eyebrow">Mundial 2026</div>
        <h1 className="font-display text-3xl sm:text-4xl font-bold tracking-wide">TU CAMPEÓN</h1>
      </div>
      <div className="champ-card a-up pulse-glow" style={{ animationDelay: '.3s' }}>
        <div className="champ-trophy a-crown"><Icon name="trophy" label="Trofeo" /></div>
        <img className="mx-auto mb-4 rounded-lg" style={{ width: '80px', height: '56px', objectFit: 'cover' }}
          src={flg(team.c, 160)} alt={team.nm} onError={e => { e.target.style.opacity = '0.2' }} />
        <div className="champ-kicker">CAMPEÓN</div>
        <h2 className="font-display text-4xl sm:text-5xl font-bold">{team.nm.toUpperCase()}</h2>
      </div>
      <div className="a-up max-w-md w-full mt-8" style={{ animationDelay: '.5s' }}>
        <div className="font-display text-xs tracking-[3px] text-center mb-4" style={{ color: 'rgba(163,230,53,.7)' }}>CAMINO AL TÍTULO</div>
        <div className="flex flex-col gap-2.5">
          {timeline.map((t, i) => {
            const opp = TM[t.opponent];
            return (
              <div key={i} className="champ-path-row flex items-center gap-3 a-slide" style={{ animationDelay: (.6 + i * .08) + 's' }}>
                <div className="font-display text-xs tracking-wider w-20 shrink-0" style={{ color: 'rgba(163,230,53,.7)' }}>{t.short}</div>
                <div className="text-[10px] font-bold font-display tracking-wider shrink-0" style={{ color: 'rgba(163,230,53,.78)' }}>SUPERÓ A</div>
                <div className="flex-1 flex items-center gap-2">
                  {opp ? (
                    <>
                      <img style={{ width: '22px', height: '15px', objectFit: 'cover', borderRadius: '2px' }} src={flg(opp.c, 80)} alt={opp.nm} onError={e => { e.target.style.opacity = '0.2' }} />
                      <span className="text-sm">{opp.nm}</span>
                    </>
                  ) : <span className="text-sm text-gray-500">?</span>}
                </div>
              </div>
            );
          })}
        </div>
      </div>
      <div className="a-up mt-10 max-w-md w-full" style={{ animationDelay: '1s' }}>
        <div className="font-display text-xs tracking-[3px] text-gray-600 mb-4 text-center">COMPARTIR</div>
        <div className="flex items-center justify-center gap-4">
          <button className="share-btn" onClick={shareNative} title="Compartir"><Icon name="share" label="Compartir" /></button>
          <button className="share-btn" onClick={copyURL} title="Copiar URL"><Icon name="link" label="Copiar URL" /></button>
          <button className="share-btn" onClick={downloadImg} title="Descargar imagen"><Icon name="download" label="Descargar imagen" /></button>
        </div>
      </div>
      <div className="a-up mt-8" style={{ animationDelay: '1.2s' }}>
        <button className="btn-s icon-btn" onClick={restart}><Icon name="restart" label="Nuevo pronóstico" /> Hacer un nuevo pronóstico</button>
      </div>
    </div>
  );
}

function teamProfile(score) {
  if (score >= 92) return 'Favorito al título';
  if (score >= 86) return 'Candidato fuerte';
  if (score >= 78) return 'Competitivo';
  if (score >= 68) return 'Outsider';
  return 'Sorpresa';
}

function TeamInsight({ team, onClose }) {
  const score = TEAM_STRENGTH[team.id] ?? 60;
  const stats = TEAM_STATS[team.id];
  const statRows = stats ? [
    { label: 'Goles por partido', value: stats.gf.p, meta: 'Total de goles: ' + stats.gf.t },
    { label: 'Goles recibidos por partido', value: stats.ga.p, meta: 'Total recibidos: ' + stats.ga.t },
    { label: 'Porterías a cero', value: stats.cs.v, meta: 'Partidos jugados: ' + stats.cs.pj },
    { label: 'Posesión del balón', value: stats.pos.v, meta: 'Partidos jugados: ' + stats.pos.pj },
    { label: 'Corners por partido', value: stats.cor.p, meta: 'Corners totales: ' + stats.cor.t },
    stats.ps ? { label: 'Penaltis convertidos', value: stats.ps.v, meta: 'Total de goles: ' + stats.ps.g } : null,
    stats.pc ? { label: 'Penaltis cometidos', value: stats.pc.v, meta: 'Total recibidos: ' + stats.pc.ga } : null,
    { label: 'Tarjetas rojas', value: stats.rc.v, meta: 'Tarjetas amarillas: ' + stats.rc.ya },
    { label: 'Tarjetas amarillas', value: stats.yc.v, meta: 'Tarjetas rojas: ' + stats.yc.rc }
  ].filter(Boolean) : [];

  return (
    <div className="insight-overlay" role="dialog" aria-modal="true" aria-label={'Estadísticas de ' + team.nm} onClick={onClose}>
      <div className="insight-panel" onClick={e => e.stopPropagation()}>
        <div className="insight-top">
          <div className="sheet-handle" aria-hidden="true"></div>
          <button className="insight-close" type="button" onClick={onClose} aria-label="Cerrar">
            <Icon name="close" label="Cerrar" />
          </button>
          <div className="insight-head">
            <img className="insight-flag" src={flg(team.c)} alt={team.nm} onError={e => { e.target.style.opacity = '0.2' }} />
            <div>
              <div className="eyebrow">Ficha del equipo</div>
              <h3>{team.nm}</h3>
              <p>Grupo {team.gr} · {teamProfile(score)}</p>
            </div>
          </div>
        </div>

        <div className="insight-score">
          <div>
            <span>Índice del simulador</span>
            <strong>{score}</strong>
          </div>
          <p>Resumen comparativo del rendimiento reciente por equipo, basado en métricas de ataque, defensa, posesión y disciplina.</p>
        </div>

        <div className="insight-section">
          <h4>Estadísticas de equipo</h4>
          {stats ? (
            <div className="stats-grid">
              {statRows.map(row => (
                <div className="stat-card" key={row.label}>
                  <span>{row.label}</span>
                  <strong>{row.value}</strong>
                  <small>{row.meta}</small>
                </div>
              ))}
            </div>
          ) : (
            <p className="insight-muted">No hay estadísticas de equipo disponibles para esta selección por el momento.</p>
          )}
        </div>

        {stats && (
          <a className="source-link" href={SOURCE_URL} target="_blank" rel="noreferrer">
            Ver fuente en 365Scores <Icon name="external" label="Abrir fuente" />
          </a>
        )}
      </div>
    </div>
  );
}

/* ======================== TOAST ======================== */
function ToastC({ msg, show }) {
  return <div className={"toast-c" + (show ? ' show' : '')}>{msg}</div>;
}
