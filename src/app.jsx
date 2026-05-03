import { Fragment, useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
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
  tun: { gf: { t: 1, p: .33 }, ga: { t: 1, p: .33 }, cs: { pj: 3, v: 2 }, pos: { pj: 3, v: '43%' }, cor: { t: 21, p: 7 }, rc: { ya: 5, v: 0 }, yc: { rc: 0, v: 5 } },
  /* --- Equipos añadidos: fuentes recientes (Euro 2024, AFCON 2024, Copa América 2024, Copa Asiática 2024, Nations League 24-25, Eliminatorias 2026) --- */
  col: { gf: { t: 28, p: 1.56 }, ga: { t: 18, p: 1 }, cs: { pj: 18, v: 5 }, pos: { pj: 18, v: '55%' }, cor: { t: 86, p: 4.78 }, ps: { g: 28, v: '3/4' }, rc: { ya: 32, v: 1 }, yc: { rc: 1, v: 32 } },
  tur: { gf: { t: 8, p: 1.6 }, ga: { t: 8, p: 1.6 }, cs: { pj: 5, v: 1 }, pos: { pj: 5, v: '46%' }, cor: { t: 22, p: 4.4 }, rc: { ya: 11, v: 1 }, yc: { rc: 1, v: 11 } },
  aut: { gf: { t: 7, p: 1.75 }, ga: { t: 6, p: 1.5 }, cs: { pj: 4, v: 0 }, pos: { pj: 4, v: '51%' }, cor: { t: 23, p: 5.75 }, rc: { ya: 6, v: 0 }, yc: { rc: 0, v: 6 } },
  swe: { gf: { t: 19, p: 3.17 }, ga: { t: 4, p: .67 }, cs: { pj: 6, v: 3 }, pos: { pj: 6, v: '56%' }, cor: { t: 34, p: 5.67 }, ps: { g: 19, v: '2/2' }, rc: { ya: 8, v: 0 }, yc: { rc: 0, v: 8 } },
  nor: { gf: { t: 19, p: 2.38 }, ga: { t: 10, p: 1.25 }, cs: { pj: 8, v: 3 }, pos: { pj: 8, v: '54%' }, cor: { t: 36, p: 4.5 }, ps: { g: 19, v: '1/1' }, rc: { ya: 10, v: 0 }, yc: { rc: 0, v: 10 } },
  cze: { gf: { t: 3, p: 1 }, ga: { t: 5, p: 1.67 }, cs: { pj: 3, v: 0 }, pos: { pj: 3, v: '47%' }, cor: { t: 14, p: 4.67 }, rc: { ya: 6, v: 2 }, yc: { rc: 2, v: 6 } },
  sco: { gf: { t: 2, p: .67 }, ga: { t: 7, p: 2.33 }, cs: { pj: 3, v: 0 }, pos: { pj: 3, v: '44%' }, cor: { t: 11, p: 3.67 }, rc: { ya: 7, v: 1 }, yc: { rc: 1, v: 7 } },
  bih: { gf: { t: 19, p: 1.9 }, ga: { t: 9, p: .9 }, cs: { pj: 10, v: 4 }, pos: { pj: 10, v: '50%' }, cor: { t: 42, p: 4.2 }, rc: { ya: 28, v: 0 }, yc: { rc: 0, v: 28 } },
  pry: { gf: { t: 5, p: 1 }, ga: { t: 7, p: 1.4 }, cs: { pj: 5, v: 1 }, pos: { pj: 5, v: '44%' }, cor: { t: 18, p: 3.6 }, rc: { ya: 12, v: 0 }, yc: { rc: 0, v: 12 } },
  egy: { gf: { t: 7, p: 1.75 }, ga: { t: 7, p: 1.75 }, cs: { pj: 4, v: 0 }, pos: { pj: 4, v: '52%' }, cor: { t: 24, p: 6 }, rc: { ya: 5, v: 0 }, yc: { rc: 0, v: 5 } },
  civ: { gf: { t: 8, p: 1.14 }, ga: { t: 8, p: 1.14 }, cs: { pj: 7, v: 2 }, pos: { pj: 7, v: '48%' }, cor: { t: 30, p: 4.29 }, rc: { ya: 12, v: 1 }, yc: { rc: 1, v: 12 } },
  alg: { gf: { t: 7, p: 2.33 }, ga: { t: 1, p: .33 }, cs: { pj: 3, v: 2 }, pos: { pj: 3, v: '64%' }, cor: { t: 18, p: 6 }, ps: { g: 7, v: '1/1' }, rc: { ya: 4, v: 0 }, yc: { rc: 0, v: 4 } },
  zaf: { gf: { t: 5, p: .71 }, ga: { t: 3, p: .43 }, cs: { pj: 7, v: 4 }, pos: { pj: 7, v: '46%' }, cor: { t: 22, p: 3.14 }, rc: { ya: 9, v: 0 }, yc: { rc: 0, v: 9 } },
  cpv: { gf: { t: 7, p: 1.75 }, ga: { t: 4, p: 1 }, cs: { pj: 4, v: 1 }, pos: { pj: 4, v: '48%' }, cor: { t: 18, p: 4.5 }, rc: { ya: 6, v: 0 }, yc: { rc: 0, v: 6 } },
  cod: { gf: { t: 6, p: .86 }, ga: { t: 7, p: 1 }, cs: { pj: 7, v: 2 }, pos: { pj: 7, v: '47%' }, cor: { t: 26, p: 3.71 }, rc: { ya: 14, v: 0 }, yc: { rc: 0, v: 14 } },
  jor: { gf: { t: 13, p: 1.86 }, ga: { t: 8, p: 1.14 }, cs: { pj: 7, v: 2 }, pos: { pj: 7, v: '45%' }, cor: { t: 28, p: 4 }, rc: { ya: 11, v: 0 }, yc: { rc: 0, v: 11 } },
  irq: { gf: { t: 10, p: 2.5 }, ga: { t: 7, p: 1.75 }, cs: { pj: 4, v: 0 }, pos: { pj: 4, v: '48%' }, cor: { t: 18, p: 4.5 }, rc: { ya: 8, v: 0 }, yc: { rc: 0, v: 8 } },
  uzb: { gf: { t: 7, p: 1.4 }, ga: { t: 3, p: .6 }, cs: { pj: 5, v: 2 }, pos: { pj: 5, v: '52%' }, cor: { t: 22, p: 4.4 }, rc: { ya: 7, v: 0 }, yc: { rc: 0, v: 7 } },
  pan: { gf: { t: 6, p: 1.5 }, ga: { t: 10, p: 2.5 }, cs: { pj: 4, v: 0 }, pos: { pj: 4, v: '42%' }, cor: { t: 14, p: 3.5 }, rc: { ya: 10, v: 1 }, yc: { rc: 1, v: 10 } },
  nzl: { gf: { t: 8, p: 2 }, ga: { t: 4, p: 1 }, cs: { pj: 4, v: 1 }, pos: { pj: 4, v: '48%' }, cor: { t: 18, p: 4.5 }, rc: { ya: 5, v: 0 }, yc: { rc: 0, v: 5 } },
  hai: { gf: { t: 2, p: .67 }, ga: { t: 4, p: 1.33 }, cs: { pj: 3, v: 0 }, pos: { pj: 3, v: '40%' }, cor: { t: 8, p: 2.67 }, rc: { ya: 6, v: 0 }, yc: { rc: 0, v: 6 } },
  cur: { gf: { t: 6, p: 1.5 }, ga: { t: 4, p: 1 }, cs: { pj: 4, v: 1 }, pos: { pj: 4, v: '50%' }, cor: { t: 16, p: 4 }, rc: { ya: 7, v: 0 }, yc: { rc: 0, v: 7 } }
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
  const common = { viewBox: '0 0 24 24', fill: 'currentColor', preserveAspectRatio: 'xMidYMid meet', 'aria-hidden': 'true' };
  const paths = {
    check: <path d="M9 16.17 4.83 12 3.41 13.41 9 19l12-12-1.41-1.41z" />,
    chevron: <path d="M10 6 8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z" />,
    share: <path d="M18 16.08c-.76 0-1.44.3-1.96.77L8.91 12.7c.06-.23.09-.46.09-.7s-.03-.47-.09-.7l7.05-4.11A2.99 2.99 0 0 0 21 5c0-1.66-1.34-3-3-3s-3 1.34-3 3c0 .24.03.47.09.7L8.04 9.81A2.99 2.99 0 0 0 6 9c-1.66 0-3 1.34-3 3s1.34 3 3 3c.79 0 1.5-.31 2.04-.81l7.12 4.16c-.05.2-.08.41-.08.63 0 1.61 1.31 2.92 2.92 2.92S21 20.61 21 19s-1.31-2.92-2.92-2.92z" />,
    link: <path d="M3.9 12c0-1.71 1.39-3.1 3.1-3.1h4V7H7c-2.76 0-5 2.24-5 5s2.24 5 5 5h4v-1.9H7c-1.71 0-3.1-1.39-3.1-3.1zM8 13h8v-2H8zm9-6h-4v1.9h4c1.71 0 3.1 1.39 3.1 3.1s-1.39 3.1-3.1 3.1h-4V17h4c2.76 0 5-2.24 5-5s-2.24-5-5-5z" />,
    chart: <path d="M5 9.2h3V19H5zm5.5-4.2h3V19h-3zM16 12h3v7h-3z" />,
    info: <path d="M11 17h2v-6h-2zm1-14C6.48 3 2 7.48 2 13s4.48 10 10 10 10-4.48 10-10S17.52 3 12 3zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zM11 7h2v2h-2z" />,
    close: <path d="M19 6.41 17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" />,
    external: <path d="M14 3v2h3.59l-9.83 9.83 1.41 1.41L19 6.41V10h2V3zm5 16H5V5h7V3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2v-7h-2z" />,
    download: <path d="M5 20h14v-2H5zm7-18-5.5 5.5 1.42 1.42L11 5.84V16h2V5.84l3.08 3.08 1.42-1.42z" />,
    trophy: <path d="M18 2H6v3H2v3c0 2.97 2.16 5.43 5 5.91V17H5v2h14v-2h-2v-3.09c2.84-.48 5-2.94 5-5.91V5h-4zm-2 10.82V17H8v-4.18C5.67 12.4 4 10.39 4 8V7h2v3h12V7h2v1c0 2.39-1.67 4.4-4 4.82z" />,
    restart: <path d="M12 5V1L7 6l5 5V7c3.31 0 6 2.69 6 6s-2.69 6-6 6-6-2.69-6-6H4c0 4.42 3.58 8 8 8s8-3.58 8-8-3.58-8-8-8z" />,
    whatsapp: <><path d="M12.04 2C6.49 2 2 6.49 2 12.04c0 1.76.46 3.48 1.32 5L2.25 22l5.08-1.03a10 10 0 0 0 4.71 1.17h.01C17.59 22.14 22 17.65 22 12.1A10 10 0 0 0 12.04 2zm0 18.12h-.01a8.06 8.06 0 0 1-4.1-1.12l-.29-.17-3.01.61.64-2.94-.19-.3A8.03 8.03 0 0 1 3.9 12.04C3.9 7.52 7.54 3.9 12.04 3.9a8.03 8.03 0 0 1 8.06 8.1 8.03 8.03 0 0 1-8.06 8.12z" /><path d="M16.52 14.23c-.25-.13-1.47-.72-1.7-.8-.23-.09-.4-.13-.57.12-.16.24-.65.8-.8.97-.14.16-.29.18-.54.06a6.6 6.6 0 0 1-1.94-1.19 7.35 7.35 0 0 1-1.35-1.68c-.14-.24-.01-.37.1-.5.11-.11.25-.28.37-.42.12-.14.16-.24.24-.4.08-.16.04-.3-.02-.42-.06-.12-.57-1.37-.78-1.88-.2-.49-.41-.42-.57-.43h-.48c-.16 0-.42.06-.64.3-.22.25-.84.82-.84 2 0 1.17.86 2.3.98 2.45.12.16 1.68 2.56 4.07 3.59.57.25 1.02.4 1.37.51.58.18 1.11.15 1.53.09.47-.07 1.47-.6 1.68-1.18.21-.58.21-1.08.15-1.18-.06-.1-.23-.16-.48-.29z" /></>,
    spark: <path d="m12 3-1.9 5.1L5 10l5.1 1.9L12 17l1.9-5.1L19 10l-5.1-1.9zm7 10-1.25 2.75L15 17l2.75 1.25L19 21l1.25-2.75L23 17l-2.75-1.25z" />
  };
  return <svg className={"icon " + className} style={style} {...common}>{paths[name] || paths.check}<title>{label}</title></svg>;
}

function phaseLabel(phase) {
  return { groups: 'Fase de grupos', bestThird: 'Mejores terceros', knockout: 'Eliminatorias', champion: 'Campeón' }[phase] || 'Simulador';
}

const INTERSTITIAL_DEFAULT_DURATION = 10;
const CURRENT_YEAR = 2026;
const ECOSYSTEM_LINKS = {
  varDelSaber: 'https://rpp.pe/el-var-del-saber',
  calculadora: 'https://rpp.pe/calculadora-copa-mundial-futbol-2026',
  rppHome: 'https://rpp.pe',
  landing: 'https://rpp.pe/mundial-2026/simulador-rpp'
};
const TOP_SPONSOR = {
  label: 'Gracias a',
  logo: 'Logo sponsor'
};
const INTERSTITIAL_FLOWS = {
  bestThird: {
    enabled: true,
    eyebrow: 'Espacio publicitario',
    body: 'Después de esta pauta sigues con la definición de los mejores terceros.',
    sponsor: 'Banner de patrocinante',
    format: 'video',
    duration: INTERSTITIAL_DEFAULT_DURATION,
    cta: 'Continuar a mejores terceros'
  },
  knockout: {
    enabled: true,
    eyebrow: 'Espacio publicitario',
    body: 'Después de esta pauta pasas a la fase eliminatoria.',
    sponsor: 'Banner de patrocinante',
    format: 'video',
    duration: INTERSTITIAL_DEFAULT_DURATION,
    cta: 'Continuar a eliminatorias'
  },
  champion: {
    enabled: false,
    eyebrow: 'Espacio publicitario',
    body: 'Después de esta pauta verás el cierre de tu pronóstico.',
    sponsor: 'Banner de patrocinante',
    format: 'box',
    duration: INTERSTITIAL_DEFAULT_DURATION,
    cta: 'Ver a mi campeón'
  }
};

/* ======================== APP PRINCIPAL ======================== */
export default function App() {
  const appRef = useRef(null);
  const [phase, setPhase] = useState('groups');
  const [interstitial, setInterstitial] = useState(null);
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
  const allGroupsDone = completedGroups === GR.length;
  const hasKnockout = bracket.r32.length > 0;
  const canNavigateTo = {
    groups: true,
    bestThird: allGroupsDone,
    knockout: hasKnockout,
    champion: !!champion
  };

  const notify = (m) => { setToast({ s: true, m }); setTimeout(() => setToast({ s: false, m: '' }), 2500); };

  const openInterstitial = (nextPhase) => {
    const cfg = INTERSTITIAL_FLOWS[nextPhase];
    if (!cfg || !cfg.enabled) {
      setPhase(nextPhase);
      return;
    }
    setInterstitial({ nextPhase, ...cfg });
  };

  const continueFromInterstitial = () => {
    if (!interstitial) return;
    setPhase(interstitial.nextPhase);
    setInterstitial(null);
  };

  const emptyBracket = () => ({ r32: [], r16: [], qf: [], sf: [], fi: [] });
  const resetKnockoutProgress = () => {
    setBracket(emptyBracket());
    setCurRound('r32');
    setChampion(null);
  };

  useLayoutEffect(() => {
    const scrollTop = () => {
      window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
      document.documentElement.scrollTop = 0;
      document.body.scrollTop = 0;
      appRef.current?.scrollIntoView({ block: 'start', inline: 'nearest' });
    };

    scrollTop();
    const frame = window.requestAnimationFrame(scrollTop);

    return () => window.cancelAnimationFrame(frame);
  }, [phase]);

  /* Toggle seleccion en grupo */
  const toggleGroup = (gn, tid) => {
    resetKnockoutProgress();
    setGSel(prev => {
      const cur = prev[gn] || [];
      const idx = cur.indexOf(tid);
      if (idx >= 0) return { ...prev, [gn]: cur.filter(x => x !== tid) };
      if (cur.length >= 3) return prev;
      return { ...prev, [gn]: [...cur, tid] };
    });
  };

  const autoFillGroups = () => {
    resetKnockoutProgress();
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
    if (!allGroupsDone) return;
    openInterstitial('bestThird');
  };

  /* Toggle mejor tercero */
  const toggleBT = (tid) => {
    resetKnockoutProgress();
    setBtSel(prev => {
      if (prev.includes(tid)) return prev.filter(x => x !== tid);
      if (prev.length >= 8) return prev;
      return [...prev, tid];
    });
  };

  const autoFillBestThirds = () => {
    resetKnockoutProgress();
    const projected = [...thirdTeams]
      .map(({ tid }) => {
        const base = TEAM_STRENGTH[tid] ?? 60;
        const volatility = 6 + Math.random() * 6;
        return { tid, score: base + (Math.random() - .5) * volatility };
      })
      .sort((a, b) => b.score - a.score)
      .slice(0, 8)
      .map(({ tid }) => tid);

    setBtSel(projected);
    notify('Mejores terceros simulados. Puedes ajustar cualquier selección.');
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
    openInterstitial('knockout');
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
      setTimeout(() => openInterstitial('champion'), 600);
    }
    setBracket(nb);
  };

  useEffect(() => {
    const validThirdIds = new Set(thirdTeams.map(({ tid }) => tid));
    setBtSel(prev => prev.filter(tid => validThirdIds.has(tid)));
  }, [thirdTeams]);

  const navigateToPhase = (nextPhase) => {
    if (!canNavigateTo[nextPhase]) return;
    setInterstitial(null);
    setPhase(nextPhase);
  };

  /* Reiniciar */
  const restart = () => {
    setInterstitial(null);
    setPhase('groups'); setGSel({}); setBtSel([]);
    setBracket(emptyBracket());
    setCurRound('r32'); setChampion(null);
  };

  return (
    <div ref={appRef} className="relative z-10 min-h-screen flex flex-col">
      <Header phase={phase} progress={totalProgress} />
      <Stepper phase={phase} canNavigateTo={canNavigateTo} onNavigate={navigateToPhase} />
      {!interstitial && <TopSponsorRibbon sponsor={TOP_SPONSOR} />}
      <main className="flex-1 pb-8">
        {interstitial ? (
          <InterstitialScreen config={interstitial} onContinue={continueFromInterstitial} />
        ) : (
          <>
            {phase === 'groups' && <GroupPhase gSel={gSel} toggle={toggleGroup} go={goBestThird} simulate={autoFillGroups} openInsight={setInsightTeam} />}
            {phase === 'bestThird' && <BTPhase teams={thirdTeams} sel={btSel} toggle={toggleBT} go={goKnockout} simulate={autoFillBestThirds} />}
            {phase === 'knockout' && <KOPhase bracket={bracket} cur={curRound} pick={pickWinner} />}
            {phase === 'champion' && <ChampScreen champ={champion} bracket={bracket} restart={restart} notify={notify} />}
          </>
        )}
      </main>
      {!interstitial && <SiteFooter />}
      {insightTeam && <TeamInsight team={TM[insightTeam]} onClose={() => setInsightTeam(null)} />}
      <ToastC msg={toast.m} show={toast.s} />
    </div>
  );
}

function TopSponsorRibbon({ sponsor }) {
  return (
    <div className="top-sponsor-shell">
      <div className="top-sponsor-card max-w-7xl mx-auto">
        <span className="top-sponsor-label">{sponsor.label}</span>
        <div className="top-sponsor-logo" aria-label={sponsor.logo}>{sponsor.logo}</div>
      </div>
    </div>
  );
}

function InterstitialScreen({ config, onContinue }) {
  const duration = config.duration ?? INTERSTITIAL_DEFAULT_DURATION;
  const [remaining, setRemaining] = useState(duration);

  useEffect(() => {
    setRemaining(duration);
  }, [duration, config.nextPhase]);

  useEffect(() => {
    if (remaining <= 0) {
      onContinue();
      return undefined;
    }
    const timer = window.setTimeout(() => setRemaining(prev => prev - 1), 1000);
    return () => window.clearTimeout(timer);
  }, [remaining, onContinue]);

  return (
    <section className="interstitial-wrap px-4 py-8">
      <div className="interstitial-card a-up">
        <div className="interstitial-copy">
          <div className="interstitial-eyebrow">{config.eyebrow}</div>
          <div className={"interstitial-ad-slot " + (config.format === 'box' ? 'is-box' : 'is-video')} aria-label={config.sponsor}>
            <div className="interstitial-ad-surface">
              <div className="interstitial-ad-logo">{config.sponsor}</div>
            </div>
          </div>
          <p className="interstitial-body">{config.body}</p>
        </div>
        <div className="interstitial-actions">
          <button className="btn-p" type="button" onClick={onContinue}>{config.cta}</button>
          <p className="interstitial-countdown">Avanza automáticamente en {remaining}s</p>
        </div>
      </div>
    </section>
  );
}

function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="site-footer-grid max-w-7xl mx-auto px-4">
        <div>
          <div className="site-footer-title">Más herramientas</div>
          <div className="site-footer-links">
            <a href={ECOSYSTEM_LINKS.varDelSaber} target="_blank" rel="noreferrer">El Var del Saber</a>
            <a href={ECOSYSTEM_LINKS.calculadora} target="_blank" rel="noreferrer">Calculadora RPP Deportes</a>
          </div>
        </div>
        <div>
          <div className="site-footer-title">Cobertura RPP</div>
          <div className="site-footer-links">
            <a href={ECOSYSTEM_LINKS.rppHome} target="_blank" rel="noreferrer">Ir a RPP.pe</a>
            <a href={ECOSYSTEM_LINKS.landing} target="_blank" rel="noreferrer">Ver landing del especial</a>
          </div>
        </div>
        <div>
          <div className="site-footer-title">Legal</div>
          <div className="site-footer-copy">© {CURRENT_YEAR} GRPP</div>
          <div className="site-footer-copy">Todos los derechos reservados</div>
        </div>
      </div>
    </footer>
  );
}

/* ======================== HEADER ======================== */
function Header({ phase, progress }) {
  return (
    <header className="app-header sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <span className="brand-mark">
            <img src="/img/logo_rpp_original.svg" alt="RPP" />
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
function Stepper({ phase, canNavigateTo, onNavigate }) {
  const steps = [{ id: 'groups', l: 'Grupos' }, { id: 'bestThird', l: 'Terceros' }, { id: 'knockout', l: 'Eliminatoria' }, { id: 'champion', l: 'Campeón' }];
  const idx = steps.findIndex(s => s.id === phase);
  return (
    <div className="stepper-shell flex items-center justify-center gap-0 py-3 px-4 overflow-x-auto">
      {steps.map((s, i) => (
        <Fragment key={s.id}>
          <button
            type="button"
            className={"step-item " + (i < idx ? 'ok ' : '') + (i === idx ? 'act ' : '') + (canNavigateTo[s.id] ? 'step-link' : 'step-lock')}
            onClick={() => onNavigate(s.id)}
            disabled={!canNavigateTo[s.id]}
            aria-current={i === idx ? 'step' : undefined}
            aria-label={canNavigateTo[s.id] ? `Ir a ${s.l}` : `${s.l} aún no disponible`}
          >
            <div className="step-dot"></div>
            <span className="hidden sm:inline">{s.l}</span>
          </button>
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
  const pendingGroups = 12 - completeCount;
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
      <div className="group-guidance a-up">
        {completeCount === 0
          ? 'Elige 3 clasificados por grupo para comenzar tu pronóstico.'
          : pendingGroups > 0
          ? `Te faltan ${pendingGroups} ${pendingGroups === 1 ? 'grupo por cerrar' : 'grupos por cerrar'}. Completa 3 clasificados por grupo para avanzar.`
          : 'Todos los grupos están listos. Ya puedes pasar a mejores terceros.'}
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
  const missing = 3 - cnt;
  return (
    <div className={"g-card a-up" + (ok ? ' complete' : '')} style={{ animationDelay: delay * 40 + 'ms' }}>
      <div className="g-card-top">
        <span className="g-title">GRUPO {group.n}</span>
        <span className={"g-pill " + (ok ? 'done' : '')}>
          {ok ? <Icon name="check" label={`Grupo ${group.n} completo`} className="g-pill-check" /> : cnt + '/3'}
        </span>
      </div>
      <div className="g-rankline" style={{ '--rank': (cnt / 3 * 100) + '%' }}></div>
      <div className="p-2 flex flex-col gap-1">
        {group.t.map(tm => {
          const pi = sel.indexOf(tm.id);
          const cls = pi >= 0 ? ' s' + (pi + 1) : '';
          return (
            <button key={tm.id} type="button" className={"team-row" + cls} onClick={() => toggle(group.n, tm.id)} title={tm.nm} aria-label={`Seleccionar ${tm.nm} en el Grupo ${group.n}`}>
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
      {!ok && (
        <div className="group-card-prompt">
          {missing === 1 ? 'Te falta 1 selección' : `Te faltan ${missing} selecciones`}
        </div>
      )}
    </div>
  );
}

/* ======================== MEJORES TERCEROS ======================== */
function BTPhase({ teams, sel, toggle, go, simulate }) {
  const cnt = sel.length;
  const remaining = 8 - cnt;
  return (
    <div className="max-w-4xl mx-auto px-4">
      <div className="phase-hero text-center mb-6 a-up">
        <div className="eyebrow">Últimos boletos</div>
        <h2 className="font-display text-2xl sm:text-3xl font-bold tracking-wide">MEJORES TERCEROS</h2>
        <p className="text-gray-500 text-sm mt-1">{remaining > 0 ? remaining + ' cupos siguen abiertos.' : 'La frontera está definida.'}</p>
        <div className="mt-3 flex items-center justify-center gap-2">
          <div className="h-2 flex-1 max-w-xs rounded-full overflow-hidden" style={{ background: 'rgba(13,116,200,.08)' }}>
            <div className="h-full rounded-full transition-all duration-300" style={{ background: '#12c86f', width: (cnt / 8 * 100) + '%' }}></div>
          </div>
          <span className={"text-sm font-semibold " + (cnt === 8 ? "text-[#12c86f]" : "text-gray-500")}>{cnt}/8</span>
        </div>
        <div className="mt-4 flex items-center justify-center">
          <button className="btn-s icon-btn" onClick={simulate} title="Completa automáticamente una proyección de los mejores terceros; luego puedes editar cualquier selección.">
            <Icon name="spark" label="Auto-simular terceros" /> Auto-simular terceros
          </button>
        </div>
      </div>
      <div className="group-guidance a-up">
        {cnt === 0
          ? 'Elige 8 mejores terceros para completar el cuadro eliminatorio.'
          : remaining > 0
          ? `Te faltan ${remaining} ${remaining === 1 ? 'mejor tercero por definir' : 'mejores terceros por definir'}.`
          : 'Los mejores terceros están listos. Ya puedes pasar a eliminatorias.'}
      </div>
      <div className="survival-grid grid grid-cols-1 sm:grid-cols-2 gap-3">
        {teams.map(({ team, tid, group }) => {
          if (!team) return null;
          const isSel = sel.includes(tid);
          return (
            <button key={tid} type="button" className={"third-c" + (isSel ? ' sel' : '')} onClick={() => toggle(tid)} title={team.nm} aria-label={`Seleccionar a ${team.nm} como mejor tercero del Grupo ${group}`}>
              <img className="flag-img" src={flg(team.c, 160)} alt={team.nm} onError={e => { e.target.style.opacity = '0.2' }} />
              <div className="third-c-body flex-1">
                <div className="third-c-name">{team.nm}</div>
                <div className="third-c-meta">3° Grupo {group}</div>
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
      <div className="sticky-action text-center mt-8 pb-4 a-up">
        <button className="btn-p" disabled={cnt !== 8} onClick={go}>Continuar a eliminatorias</button>
      </div>
    </div>
  );
}

/* ======================== ELIMINATORIAS ======================== */
function KOPhase({ bracket, cur, pick }) {
  const openMatches = (bracket[cur] || []).filter(m => !m.winner).length;
  return (
    <div className="ko-shell">
      <div className="phase-hero text-center mb-4 a-up">
        <div className="eyebrow">Ruta al título</div>
        <h2 className="font-display text-2xl sm:text-3xl font-bold tracking-wide">FASE ELIMINATORIA</h2>
        <p className="text-gray-500 text-sm mt-1">Selecciona el ganador de cada partido</p>
        <div className="ko-guidance">
          {openMatches > 0
            ? `Completa ${openMatches} ${openMatches === 1 ? 'partido pendiente' : 'partidos pendientes'} de ${RN[cur]} para desbloquear la siguiente ronda.`
            : `Ronda completada. Avanza a ${RN[RORD[Math.min(RORD.indexOf(cur) + 1, RORD.length - 1)]]}.`}
        </div>
      </div>
      <div className="bk-m"><KOMobile bracket={bracket} cur={cur} pick={pick} /></div>
      <div className="bk-d justify-center w-full"><KODesktop bracket={bracket} cur={cur} pick={pick} /></div>
    </div>
  );
}

/* Componente de partido */
function MatchView({ match, onPick, interactive }) {
  const t1 = match.team1 ? TM[match.team1] : null;
  const t2 = match.team2 ? TM[match.team2] : null;
  const w = match.winner;
  const needsPick = interactive && !w && t1 && t2;
  return (
    <div className={"m-card" + (w ? ' decided' : '') + (!interactive ? ' locked' : '') + (needsPick ? ' needs-pick' : '')}>
      <button type="button" className={"m-tm" + (!t1 ? ' empty' : (w === match.team1 ? ' w' : (w ? ' l' : '')))}
        onClick={t1 && interactive ? () => onPick(match.team1) : undefined}
        disabled={!t1 || !interactive}
        aria-label={t1 ? `Seleccionar ${t1.nm} como ganador` : undefined}
        title={t1 ? t1.nm : undefined}>
        {t1 ? (
          <>
            <img className="flag-img" src={flg(t1.c, 160)} alt={t1.nm} onError={e => { e.target.style.opacity = '0.2' }} />
            <span className="font-medium text-sm flex-1">{t1.nm}</span>
            {w === match.team1 && <Icon name="chevron" label="Ganador" className="winner-icon" />}
          </>
        ) : <span className="match-empty-label">Por definir</span>}
      </button>
      <div className="border-t" style={{ borderColor: 'rgba(16,24,40,.08)' }}></div>
      <button type="button" className={"m-tm" + (!t2 ? ' empty' : (w === match.team2 ? ' w' : (w ? ' l' : '')))}
        onClick={t2 && interactive ? () => onPick(match.team2) : undefined}
        disabled={!t2 || !interactive}
        aria-label={t2 ? `Seleccionar ${t2.nm} como ganador` : undefined}
        title={t2 ? t2.nm : undefined}>
        {t2 ? (
          <>
            <img className="flag-img" src={flg(t2.c, 160)} alt={t2.nm} onError={e => { e.target.style.opacity = '0.2' }} />
            <span className="font-medium text-sm flex-1">{t2.nm}</span>
            {w === match.team2 && <Icon name="chevron" label="Ganador" className="winner-icon" />}
          </>
        ) : <span className="match-empty-label">Por definir</span>}
      </button>
      {needsPick && (
        <div className="match-prompt">
          <span className="prompt-mobile">Elige un ganador para continuar</span>
          <span className="prompt-desktop">Elige ganador</span>
        </div>
      )}
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
function getRoundDesktopState(bracket, cur, rnd) {
  const ri = RORD.indexOf(rnd);
  const ms = bracket[rnd] || [];
  const prevDone = ri === 0 || (bracket[RORD[ri - 1]] && bracket[RORD[ri - 1]].every(m => m.winner));
  return {
    matches: ms,
    interactive: rnd === cur && prevDone,
    done: ms.length > 0 && ms.every(m => m.winner),
    active: rnd === cur
  };
}

function KODesktopRound({ title, matches, interactive, done, active, side, rnd, startIndex = 0, onPick, registerShell }) {
  const pairs = [];
  for (let i = 0; i < matches.length; i += 2) pairs.push(matches.slice(i, i + 2));
  return (
    <div className={"ko-round-col " + side + (done ? ' round-done' : '') + (active ? ' round-active' : '')}>
      <div className="round-title">{title}</div>
      <div className="ko-round-stack">
        {pairs.map((pair, pi) => (
          <div key={rnd + '-pair-' + (startIndex + pi * 2)} className={"ko-pair " + side + (pair.length === 1 ? ' single' : '')}>
            {pair.map((m, mi) => {
              const idx = startIndex + pi * 2 + mi;
              return (
                <div key={rnd + idx} className={"ko-match-shell " + side} ref={registerShell(rnd + '-' + idx)}>
                  <MatchView match={m} onPick={tid => onPick(rnd, idx, tid)} interactive={interactive} />
                </div>
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
}

function KODesktop({ bracket, cur, pick }) {
  const leftR32 = getRoundDesktopState(bracket, cur, 'r32');
  const leftR16 = getRoundDesktopState(bracket, cur, 'r16');
  const leftQF = getRoundDesktopState(bracket, cur, 'qf');
  const leftSF = getRoundDesktopState(bracket, cur, 'sf');
  const fi = getRoundDesktopState(bracket, cur, 'fi');
  const stageRef = useRef(null);
  const shellRefs = useRef({});
  const [connectorPaths, setConnectorPaths] = useState({ left: [], right: [] });

  const registerShell = (key) => (el) => {
    if (el) shellRefs.current[key] = el;
    else delete shellRefs.current[key];
  };

  useLayoutEffect(() => {
    let raf = 0;

    const computePaths = () => {
      const stage = stageRef.current;
      if (!stage) return;
      const stageRect = stage.getBoundingClientRect();
      const paths = { left: [], right: [] };

      // Helper: get the .m-card inside a shell for accurate visual bounds
      const getCardRect = (shellEl) => {
        const card = shellEl.querySelector('.m-card');
        return card ? card.getBoundingClientRect() : shellEl.getBoundingClientRect();
      };

      ['r16', 'qf', 'sf', 'fi'].forEach((round) => {
        const prevRound = RORD[RORD.indexOf(round) - 1];
        (FEED[round] || []).forEach((sources, targetIndex) => {
          const targetEl = shellRefs.current[round + '-' + targetIndex];
          if (!targetEl) return;
          const targetRect = getCardRect(targetEl);
          const ty = targetRect.top - stageRect.top + targetRect.height / 2;

          sources.forEach((sourceIndex) => {
            const sourceEl = shellRefs.current[prevRound + '-' + sourceIndex];
            if (!sourceEl) return;
            const sourceRect = getCardRect(sourceEl);
            const sy = sourceRect.top - stageRect.top + sourceRect.height / 2;
            const sourceIsLeft = sourceRect.left < targetRect.left;
            const sx = sourceIsLeft
              ? sourceRect.right - stageRect.left
              : sourceRect.left - stageRect.left;
            const tx = sourceIsLeft
              ? targetRect.left - stageRect.left
              : targetRect.right - stageRect.left;
            const mx = (sx + tx) / 2;
            const side = sourceIsLeft ? 'left' : 'right';
            paths[side].push(`M ${sx} ${sy} H ${mx} V ${ty} H ${tx}`);
          });
        });
      });

      setConnectorPaths(paths);
    };

    const schedule = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(computePaths);
    };

    schedule();
    const resizeObserver = new ResizeObserver(schedule);
    if (stageRef.current) resizeObserver.observe(stageRef.current);
    window.addEventListener('resize', schedule);

    return () => {
      cancelAnimationFrame(raf);
      resizeObserver.disconnect();
      window.removeEventListener('resize', schedule);
    };
  }, [bracket, cur]);

  return (
    <div className="ko-desktop overflow-x-auto px-4 py-4">
      <div className="ko-stage-wrap" ref={stageRef}>
        <svg className="ko-connector-layer left" aria-hidden="true">
          {connectorPaths.left.map((d, i) => (
            <g key={i}>
              <path d={d} className="ko-connector-glow" />
              <path d={d} className="ko-connector-core" />
            </g>
          ))}
        </svg>
        <svg className="ko-connector-layer right" aria-hidden="true">
          {connectorPaths.right.map((d, i) => (
            <g key={i}>
              <path d={d} className="ko-connector-glow" />
              <path d={d} className="ko-connector-core" />
            </g>
          ))}
        </svg>
        <div className="ko-stage-grid">
          <KODesktopRound title={RS.r32} matches={leftR32.matches.slice(0, 8)} interactive={leftR32.interactive} done={leftR32.done} active={leftR32.active} side="left outer" rnd="r32" startIndex={0} onPick={pick} registerShell={registerShell} />
          <KODesktopRound title={RS.r16} matches={leftR16.matches.slice(0, 4)} interactive={leftR16.interactive} done={leftR16.done} active={leftR16.active} side="left" rnd="r16" startIndex={0} onPick={pick} registerShell={registerShell} />
          <KODesktopRound title={RS.qf} matches={leftQF.matches.slice(0, 2)} interactive={leftQF.interactive} done={leftQF.done} active={leftQF.active} side="left" rnd="qf" startIndex={0} onPick={pick} registerShell={registerShell} />
          <KODesktopRound title={RS.sf} matches={leftSF.matches.slice(0, 1)} interactive={leftSF.interactive} done={leftSF.done} active={leftSF.active} side="left inner" rnd="sf" startIndex={0} onPick={pick} registerShell={registerShell} />

          <div className={"ko-final-col" + (fi.done ? ' round-done' : '') + (fi.active ? ' round-active' : '')}>
            <div className="round-title final">FINAL</div>
            <div className="ko-final-wrap">
              <div className="ko-match-shell final" ref={registerShell('fi-0')}>
                <MatchView match={fi.matches[0] || { team1: null, team2: null, winner: null }} onPick={tid => pick('fi', 0, tid)} interactive={fi.interactive} />
              </div>
            </div>
          </div>

          <KODesktopRound title={RS.sf} matches={leftSF.matches.slice(1, 2)} interactive={leftSF.interactive} done={leftSF.done} active={leftSF.active} side="right inner" rnd="sf" startIndex={1} onPick={pick} registerShell={registerShell} />
          <KODesktopRound title={RS.qf} matches={leftQF.matches.slice(2, 4)} interactive={leftQF.interactive} done={leftQF.done} active={leftQF.active} side="right" rnd="qf" startIndex={2} onPick={pick} registerShell={registerShell} />
          <KODesktopRound title={RS.r16} matches={leftR16.matches.slice(4, 8)} interactive={leftR16.interactive} done={leftR16.done} active={leftR16.active} side="right" rnd="r16" startIndex={4} onPick={pick} registerShell={registerShell} />
          <KODesktopRound title={RS.r32} matches={leftR32.matches.slice(8, 16)} interactive={leftR32.interactive} done={leftR32.done} active={leftR32.active} side="right outer" rnd="r32" startIndex={8} onPick={pick} registerShell={registerShell} />
        </div>
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
    const pcs = []; const cols = ['#f7c600', '#12c86f', '#fff7d6'];
    for (let i = 0; i < 34; i++) pcs.push({
      x: 46 + (Math.random() - .5) * 68, y: 22 + Math.random() * 42, d: Math.random() * 1.2,
      dur: 2.4 + Math.random() * 1.8, c: cols[~~(Math.random() * cols.length)], sz: 2 + Math.random() * 4
    });
    return pcs;
  }, []);

  const copyURL = () => {
    navigator.clipboard.writeText(window.location.href).then(() => notify('Enlace copiado')).catch(() => notify('No se pudo copiar'));
  };
  const shareWhatsApp = () => {
    const text = 'Mi campeón del Mundial 2026 es ' + team.nm + '. Arma tu pronóstico en el Simulador Mundial 2026 de RPP.';
    const url = 'https://wa.me/?text=' + encodeURIComponent(text + ' ' + window.location.href);
    window.open(url, '_blank', 'noopener,noreferrer');
  };
  const shareNative = async () => {
    const text = 'Mi campeón del Mundial 2026 es ' + team.nm + '. Arma tu pronóstico en el Simulador Mundial 2026 de RPP.';
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
    notify('Generando tu imagen...');

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
      return '<div style="display:flex;align-items:center;gap:12px;padding:10px 14px;background:rgba(255,255,255,.92);border:1px solid rgba(13,116,200,.1);border-radius:18px;box-shadow:0 10px 20px rgba(13,116,200,.05);margin-bottom:8px;">' +
        '<div style="width:72px;flex:0 0 72px;"><div style="' + F + 'font-weight:800;color:#12c86f;font-size:10px;text-transform:uppercase;letter-spacing:1.8px;line-height:1;margin-bottom:5px;">' + t.short + '</div>' +
        '<div style="' + F + 'font-weight:700;color:#61748f;font-size:9px;letter-spacing:1.1px;text-transform:uppercase;line-height:1.1;">' + t.round + '</div></div>' +
        '<div style="width:1px;height:32px;background:linear-gradient(180deg,rgba(18,200,111,.12),rgba(18,200,111,.62),rgba(13,116,200,.18));flex:0 0 1px;"></div>' +
        '<div style="flex:1;display:flex;align-items:center;gap:10px;min-width:0;">' +
        (oppPng ? '<img src="' + oppPng + '" width="32" height="24" style="width:32px;height:24px;border-radius:5px;object-fit:cover;display:block;box-shadow:0 4px 12px rgba(15,23,42,.08);" />' : '') +
        '<div style="flex:1;min-width:0"><div style="' + F + 'font-weight:700;font-size:14px;line-height:1.15;color:#0f172a;">' + (opp ? opp.nm : '?') + '</div>' +
        '<div style="' + F + 'font-weight:800;font-size:10px;line-height:1.2;color:#0d74c8;letter-spacing:1.4px;text-transform:uppercase;margin-top:4px;">Superó a este rival</div></div></div></div>';
    }).join('');

    const champPng = pngMap[team.c] || '';

    card.style.left = '0';
    card.innerHTML =
      '<div style="position:absolute;inset:0;background:radial-gradient(circle at 50% 0%,rgba(255,255,255,.84),transparent 26%),radial-gradient(circle at 50% 10%,rgba(247,198,0,.18),transparent 28%),radial-gradient(circle at 12% 18%,rgba(18,200,111,.18),transparent 28%),radial-gradient(circle at 88% 12%,rgba(13,116,200,.18),transparent 28%),linear-gradient(180deg,rgba(255,255,255,.2) 0%,rgba(255,255,255,.58) 38%,rgba(255,255,255,.94) 68%,#f8fbff 100%) top/100% 18rem no-repeat,linear-gradient(118deg,rgba(18,200,111,.98) 0%,rgba(5,170,152,.92) 46%,rgba(13,116,200,.98) 100%) top/100% 18rem no-repeat,linear-gradient(180deg,#f4fbff 0%,#ffffff 42%,#f4faff 100%);"></div>' +
      '<div style="position:absolute;left:50%;top:56px;transform:translateX(-50%);width:520px;height:210px;border-radius:50%;background:radial-gradient(circle,rgba(255,255,255,.88) 0%,rgba(255,255,255,.2) 42%,transparent 76%);filter:blur(10px);"></div>' +
      '<div style="position:relative;z-index:1;height:100%;display:flex;flex-direction:column;">' +
      '<div style="display:flex;align-items:flex-start;justify-content:space-between;margin-bottom:14px;">' +
      (logoPng ? '<img src="' + logoPng + '" style="height:42px;width:auto;display:block;" />' : '') +
      '<div style="text-align:right;padding:10px 14px 12px;border-radius:18px;background:rgba(8,37,63,.18);backdrop-filter:blur(4px);">' +
      '<div style="' + F + 'font-weight:800;font-size:10px;color:#ffffff;letter-spacing:2px;text-transform:uppercase;line-height:1.4;">Simulador Mundial 2026 de RPP</div></div></div>' +
      '<div style="margin-bottom:14px;max-width:420px;"><div style="' + F + 'font-size:28px;line-height:1.02;font-weight:900;color:#ffffff;letter-spacing:.2px;margin-bottom:8px;text-shadow:0 3px 18px rgba(8,37,63,.18);">Mi campeón del Mundial 2026 es</div>' +
      '<div style="' + F + 'font-size:14px;line-height:1.38;font-weight:700;color:#0f3553;max-width:360px;">Comparte tu cierre de torneo con una pieza vertical pensada para historias.</div></div>' +
      '<div style="position:relative;overflow:hidden;padding:20px 24px 14px;border-radius:28px;background:linear-gradient(180deg,rgba(255,255,255,.96) 0%,rgba(255,255,255,.92) 100%);border:1.5px solid rgba(247,198,0,.26);box-shadow:0 26px 65px rgba(13,116,200,.14),0 10px 28px rgba(15,23,42,.07);margin-bottom:14px;">' +
      '<div style="position:absolute;left:50%;top:-18px;transform:translateX(-50%);width:300px;height:180px;border-radius:50%;background:radial-gradient(circle,rgba(247,198,0,.34) 0%,rgba(247,198,0,.12) 40%,transparent 74%);"></div>' +
      '<div style="position:relative;z-index:1;display:flex;flex-direction:column;align-items:center;text-align:center;">' +
      '<div style="' + F + 'font-weight:800;font-size:10px;color:#12c86f;letter-spacing:2.6px;text-transform:uppercase;margin-bottom:10px;">Campeón del Mundial 2026</div>' +
      '<div style="position:relative;width:112px;height:112px;margin:0 auto 10px;border-radius:50%;padding:9px;background:linear-gradient(180deg,rgba(255,255,255,.99),rgba(255,250,231,.98));border:1.5px solid rgba(247,198,0,.34);box-shadow:0 14px 30px rgba(247,198,0,.16),0 8px 20px rgba(13,116,200,.07);">' +
      '<div style="position:absolute;inset:-8px;border-radius:50%;background:radial-gradient(circle,rgba(247,198,0,.24) 0%,transparent 70%);"></div>' +
      (champPng ? '<img src="' + champPng + '" width="94" height="94" style="position:relative;z-index:1;width:94px;height:94px;border-radius:50%;object-fit:cover;display:block;box-shadow:0 8px 18px rgba(15,23,42,.12);" />' : '') +
      '</div>' +
      '<div style="' + F + 'max-width:100%;font-size:34px;line-height:1;font-weight:900;color:#0f172a;letter-spacing:.4px;text-transform:uppercase;margin:0;word-break:break-word;">' + team.nm.toUpperCase() + '</div></div>' +
      '<div style="flex:1;padding:18px 20px 12px;border-radius:26px;background:linear-gradient(180deg,rgba(255,255,255,.92),rgba(247,251,255,.98));border:1px solid rgba(13,116,200,.1);box-shadow:0 18px 42px rgba(13,116,200,.08);display:flex;flex-direction:column;">' +
      '<div style="display:flex;align-items:flex-start;justify-content:space-between;gap:16px;margin-bottom:12px;"><div><div style="' + F + 'font-weight:800;font-size:11px;color:#12c86f;letter-spacing:2.2px;text-transform:uppercase;margin-bottom:6px;">Camino al título</div>' +
      '<div style="' + F + 'font-weight:800;font-size:14px;color:#4f6278;line-height:1.28;max-width:320px;">Así quedó definida la ruta del campeón en tu simulación.</div></div></div>' +
      '<div style="flex:1;">' + tlRows + '</div>' +
      '<div style="padding-top:12px;border-top:1px solid rgba(16,24,40,.08);margin-top:0;display:flex;align-items:center;justify-content:space-between;gap:14px;">' +
      '<div><div style="' + F + 'font-weight:800;font-size:15px;color:#0d74c8;line-height:1.15;margin-bottom:5px">Haz tu pronóstico en el Simulador de RPP</div>' +
      '<div style="' + F + 'font-weight:700;font-size:11px;color:#6b7080;line-height:1.2">rpp.pe/mundial-2026/simulador-rpp</div></div>' +
      '<div style="padding:10px 14px;border-radius:999px;background:linear-gradient(180deg,#0d74c8,#0b62ab);color:#ffffff;' + F + 'font-weight:800;font-size:10px;letter-spacing:1.5px;text-transform:uppercase;white-space:nowrap;box-shadow:0 10px 22px rgba(13,116,200,.18);">Comparte tu campeón</div></div></div></div>';

    /* Wait for PNG data-url images to paint in the DOM */
    await new Promise(r => setTimeout(r, 300));

    try {
      const canvas = await html2canvas(card, { backgroundColor: '#ffffff', scale: 2, useCORS: true, allowTaint: true });
      const link = document.createElement('a');
      link.download = 'mi-campeon-mundial-2026.png';
      link.href = canvas.toDataURL('image/png');
      link.click();
      notify('¡Imagen lista para compartir!');
    } catch (e) { notify('Error al generar la imagen'); }
    card.style.left = '-9999px';
  };

  return (
    <div className="champ-stage min-h-screen flex flex-col items-center pt-3 pb-8 px-4">
      <div className="champ-stage-lights" aria-hidden="true"></div>
      {showCelebration && <div className="champ-burst" aria-hidden="true"></div>}
      {showCelebration && sparks.map((p, i) => (
        <div key={i} className="champ-spark" style={{
          left: p.x + '%', top: p.y + '%', animationDelay: p.d + 's', animationDuration: p.dur + 's',
          backgroundColor: p.c, width: p.sz + 'px', height: p.sz + 'px'
        }}></div>
      ))}
      <div className="champ-hero a-up text-center mb-3">
        <h1 className="font-display text-2xl sm:text-3xl font-bold champ-hero-statement">Así termina tu Mundial</h1>
      </div>
      <div className="champ-card a-up pulse-glow max-w-2xl w-full" style={{ animationDelay: '.3s' }}>
        <div className="champ-spotlight" aria-hidden="true"></div>
        <div className="champ-corner-icon" aria-hidden="true">
          <Icon name="trophy" label="Copa decorativa" />
        </div>
        <div className="champ-card-inner champ-card-row">
          <div className="champ-flag-frame">
            <img className="champ-flag-image"
              src={flg(team.c, 160)} alt={team.nm} onError={e => { e.target.style.opacity = '0.2' }} />
          </div>
          <div className="champ-card-text">
            <div className="champ-kicker">TU CAMPEÓN DEL MUNDIAL 2026</div>
            <div className="champ-name-wrap">
              <h2 className="font-display text-xl sm:text-2xl font-bold">{team.nm.toUpperCase()}</h2>
            </div>
          </div>
        </div>
      </div>
      <div className="champ-timeline-shell a-up max-w-2xl w-full mt-3" style={{ animationDelay: '.5s' }}>
        <div className="champ-timeline-head">
          <div className="champ-timeline-title font-display text-center">La ruta del campeón</div>
        </div>
        <div className="flex flex-col gap-1.5">
          {timeline.map((t, i) => {
            const opp = TM[t.opponent];
            return (
              <div key={i} className="champ-path-row flex items-center gap-3 a-slide" style={{ animationDelay: (.6 + i * .08) + 's' }}>
                <div className="champ-path-round">{t.short}</div>
                <div className="champ-path-vs">{t.isFinal ? 'SE IMPUSO EN LA FINAL A' : 'DEJÓ EN EL CAMINO A'}</div>
                <div className="flex-1 flex items-center gap-2">
                  {opp ? (
                    <>
                      <img style={{ width: '24px', height: '16px', objectFit: 'cover', borderRadius: '3px' }} src={flg(opp.c, 80)} alt={opp.nm} onError={e => { e.target.style.opacity = '0.2' }} />
                      <span className="champ-path-opp">{opp.nm}</span>
                    </>
                  ) : <span className="text-sm text-gray-500">?</span>}
                </div>
              </div>
            );
          })}
        </div>
      </div>
      <div className="champ-actions-shell a-up mt-4 max-w-md w-full" style={{ animationDelay: '1s' }}>
        <div className="champ-share-lead">Compártelo con tu grupo y compara pronósticos.</div>
        <div className="champ-share-primary">
          <button className="btn-p champ-wa-btn" onClick={shareWhatsApp} title="Compartir por WhatsApp">
            <Icon name="whatsapp" label="Compartir por WhatsApp" /> Compartir por WhatsApp
          </button>
        </div>
        <div className="flex items-center justify-center gap-4">
          <button className="share-btn" onClick={shareNative} title="Compartir"><Icon name="share" label="Compartir" /></button>
          <button className="share-btn" onClick={copyURL} title="Copiar enlace"><Icon name="link" label="Copiar enlace" /></button>
          <button className="share-btn" onClick={downloadImg} title="Descargar imagen"><Icon name="download" label="Descargar imagen" /></button>
        </div>
      </div>
      <div className="a-up mt-4" style={{ animationDelay: '1.2s' }}>
        <button className="btn-s icon-btn" onClick={restart}><Icon name="restart" label="Haz otro pronóstico" /> Haz otro pronóstico</button>
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

      </div>
    </div>
  );
}

/* ======================== TOAST ======================== */
function ToastC({ msg, show }) {
  return <div className={"toast-c" + (show ? ' show' : '')}>{msg}</div>;
}
