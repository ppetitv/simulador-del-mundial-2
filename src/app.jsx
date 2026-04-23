import { Fragment, useEffect, useMemo, useState } from 'react';
import html2canvas from 'html2canvas';

/* ======================== DATOS DEL MUNDIAL 2026 ======================== */
const GR = [
  {n:'A',t:[{id:'mex',nm:'México',c:'mx'},{id:'zaf',nm:'Sudáfrica',c:'za'},{id:'kor',nm:'Corea del Sur',c:'kr'},{id:'cze',nm:'República Checa',c:'cz'}]},
  {n:'B',t:[{id:'can',nm:'Canadá',c:'ca'},{id:'bih',nm:'Bosnia y Herz.',c:'ba'},{id:'qat',nm:'Catar',c:'qa'},{id:'sui',nm:'Suiza',c:'ch'}]},
  {n:'C',t:[{id:'bra',nm:'Brasil',c:'br'},{id:'mar',nm:'Marruecos',c:'ma'},{id:'hai',nm:'Haití',c:'ht'},{id:'sco',nm:'Escocia',c:'gb-sct'}]},
  {n:'D',t:[{id:'usa',nm:'EE. UU.',c:'us'},{id:'pry',nm:'Paraguay',c:'py'},{id:'aus',nm:'Australia',c:'au'},{id:'tur',nm:'Turquía',c:'tr'}]},
  {n:'E',t:[{id:'ger',nm:'Alemania',c:'de'},{id:'cur',nm:'Curazao',c:'cw'},{id:'civ',nm:'Costa de Marfil',c:'ci'},{id:'ecu',nm:'Ecuador',c:'ec'}]},
  {n:'F',t:[{id:'ned',nm:'Países Bajos',c:'nl'},{id:'jpn',nm:'Japón',c:'jp'},{id:'swe',nm:'Suecia',c:'se'},{id:'tun',nm:'Túnez',c:'tn'}]},
  {n:'G',t:[{id:'bel',nm:'Bélgica',c:'be'},{id:'egy',nm:'Egipto',c:'eg'},{id:'irn',nm:'Irán',c:'ir'},{id:'nzl',nm:'Nueva Zelanda',c:'nz'}]},
  {n:'H',t:[{id:'esp',nm:'España',c:'es'},{id:'cpv',nm:'Cabo Verde',c:'cv'},{id:'ksa',nm:'Arabia Saudita',c:'sa'},{id:'uru',nm:'Uruguay',c:'uy'}]},
  {n:'I',t:[{id:'fra',nm:'Francia',c:'fr'},{id:'sen',nm:'Senegal',c:'sn'},{id:'irq',nm:'Irak',c:'iq'},{id:'nor',nm:'Noruega',c:'no'}]},
  {n:'J',t:[{id:'arg',nm:'Argentina',c:'ar'},{id:'alg',nm:'Argelia',c:'dz'},{id:'aut',nm:'Austria',c:'at'},{id:'jor',nm:'Jordania',c:'jo'}]},
  {n:'K',t:[{id:'por',nm:'Portugal',c:'pt'},{id:'cod',nm:'RD Congo',c:'cd'},{id:'uzb',nm:'Uzbekistán',c:'uz'},{id:'col',nm:'Colombia',c:'co'}]},
  {n:'L',t:[{id:'eng',nm:'Inglaterra',c:'gb-eng'},{id:'cro',nm:'Croacia',c:'hr'},{id:'gha',nm:'Ghana',c:'gh'},{id:'pan',nm:'Panamá',c:'pa'}]}
];

/* Mapa de equipos por ID */
const TM = {};
GR.forEach(g => g.t.forEach(t => { TM[t.id] = {...t, gr: g.n}; }));

/* Slots de los 16 partidos de Dieciseisavos */
const R32_SLOTS = [
  [{g:'A',p:0},{bt:0}], [{g:'B',p:0},{bt:1}], [{g:'C',p:0},{bt:2}], [{g:'D',p:0},{bt:3}],
  [{g:'E',p:0},{bt:4}], [{g:'F',p:0},{bt:5}], [{g:'G',p:0},{bt:6}], [{g:'H',p:0},{bt:7}],
  [{g:'I',p:0},{g:'L',p:1}], [{g:'J',p:0},{g:'K',p:1}], [{g:'K',p:0},{g:'J',p:1}], [{g:'L',p:0},{g:'I',p:1}],
  [{g:'A',p:1},{g:'B',p:1}], [{g:'C',p:1},{g:'D',p:1}], [{g:'E',p:1},{g:'F',p:1}], [{g:'G',p:1},{g:'H',p:1}]
];

/* Conexiones entre rondas */
const FEED = {
  r16:[[0,1],[2,3],[4,5],[6,7],[8,9],[10,11],[12,13],[14,15]],
  qf:[[0,1],[2,3],[4,5],[6,7]],
  sf:[[0,1],[2,3]],
  fi:[[0,1]]
};
const RORD=['r32','r16','qf','sf','fi'];
const RN={r32:'Dieciseisavos',r16:'Octavos',qf:'Cuartos',sf:'Semifinales',fi:'Final'};
const RS={r32:'32AVOS',r16:'16AVOS',qf:'CUARTOS',sf:'SEMIS',fi:'FINAL'};

const TEAM_STRENGTH = {
  arg:94,fra:93,bra:92,esp:91,eng:90,por:89,ned:88,ger:87,bel:86,cro:85,
  uru:84,col:83,mar:82,usa:81,sui:80,jpn:79,mex:78,sen:77,ecu:76,den:75,
  aut:75,kor:74,irn:73,aus:72,tur:72,swe:71,can:70,civ:70,pry:69,
  nor:69,alg:68,tun:67,egy:67,gha:66,qat:64,ksa:64,pan:63,sco:63,cz:62,
  cze:62,uzb:61,zaf:60,irq:59,jor:58,cpv:57,cur:56,
  cod:56,bih:55,nzl:54,hai:52
};

function simulateGroups(){
  const next={};
  GR.forEach(g=>{
    next[g.n]=[...g.t]
      .map(t=>{
        const base=TEAM_STRENGTH[t.id] ?? 60;
        const volatility=10+Math.random()*8;
        return {...t,score:base+(Math.random()-.5)*volatility};
      })
      .sort((a,b)=>b.score-a.score)
      .slice(0,3)
      .map(t=>t.id);
  });
  return next;
}

function flg(c){return '/flags/'+c+'.svg';}

function Icon({name='check',label,className='',style}){
  const common={viewBox:'0 0 24 24',fill:'none',stroke:'currentColor',strokeWidth:'1.9',strokeLinecap:'round',strokeLinejoin:'round','aria-hidden':'true'};
  const paths={
    check:<path d="M5 12.5l4.2 4.2L19 7"/>,
    chevron:<path d="M9 6l6 6-6 6"/>,
    share:<><path d="M8.5 13.5l7-4"/><path d="M8.5 10.5l7 4"/><circle cx="6" cy="12" r="2.5"/><circle cx="18" cy="7.5" r="2.5"/><circle cx="18" cy="16.5" r="2.5"/></>,
    link:<><path d="M10.2 13.8a4 4 0 0 1 0-5.6l1.6-1.6a4 4 0 0 1 5.6 5.6l-.8.8"/><path d="M13.8 10.2a4 4 0 0 1 0 5.6l-1.6 1.6a4 4 0 0 1-5.6-5.6l.8-.8"/></>,
    download:<><path d="M12 4v10"/><path d="M8 10l4 4 4-4"/><path d="M5 19h14"/></>,
    trophy:<><path d="M8 4h8v5a4 4 0 0 1-8 0V4z"/><path d="M8 6H5.5A2.5 2.5 0 0 0 8 10"/><path d="M16 6h2.5A2.5 2.5 0 0 1 16 10"/><path d="M12 13v4"/><path d="M8.5 20h7"/></>,
    restart:<><path d="M4 12a8 8 0 1 0 2.35-5.65"/><path d="M4 5v5h5"/></>,
    spark:<><path d="M12 3l1.7 5.1L19 10l-5.3 1.9L12 17l-1.7-5.1L5 10l5.3-1.9L12 3z"/><path d="M19 15l.8 2.2L22 18l-2.2.8L19 21l-.8-2.2L16 18l2.2-.8L19 15z"/></>
  };
  return <svg className={"icon "+className} style={style} {...common}>{paths[name] || paths.check}<title>{label}</title></svg>;
}

function phaseLabel(phase){
  return {groups:'Fase de grupos',bestThird:'Mejores terceros',knockout:'Eliminatorias',champion:'Campeón'}[phase] || 'Simulador';
}

/* ======================== APP PRINCIPAL ======================== */
export default function App(){
  const[phase,setPhase]=useState('groups');
  const[gSel,setGSel]=useState({});
  const[btSel,setBtSel]=useState([]);
  const[bracket,setBracket]=useState({r32:[],r16:[],qf:[],sf:[],fi:[]});
  const[curRound,setCurRound]=useState('r32');
  const[champion,setChampion]=useState(null);
  const[toast,setToast]=useState({s:false,m:''});

  const completedGroups=GR.filter(g=>(gSel[g.n]||[]).length===3).length;
  const bracketDone=RORD.reduce((acc,r)=>acc+(bracket[r]||[]).filter(m=>m.winner).length,0);
  const totalProgress=phase==='champion'?100:
    phase==='knockout'?Math.round((36+bracketDone/31*64)):
    phase==='bestThird'?Math.round(30+btSel.length/8*6):
    Math.round(completedGroups/12*30);

  const notify=(m)=>{setToast({s:true,m});setTimeout(()=>setToast({s:false,m:''}),2500);};

  /* Toggle seleccion en grupo */
  const toggleGroup=(gn,tid)=>{
    setGSel(prev=>{
      const cur=prev[gn]||[];
      const idx=cur.indexOf(tid);
      if(idx>=0) return{...prev,[gn]:cur.filter(x=>x!==tid)};
      if(cur.length>=3) return prev;
      return{...prev,[gn]:[...cur,tid]};
    });
  };

  const autoFillGroups=()=>{
    setGSel(simulateGroups());
    notify('Grupos simulados. Puedes ajustar cualquier selección.');
  };

  /* Equipos terceros */
  const thirdTeams=useMemo(()=>{
    return GR.map(g=>{
      const sel=gSel[g.n]||[];
      const third=sel.length===3?sel[2]:null;
      return{group:g.n,team:third?TM[third]:null,tid:third};
    }).filter(x=>x.tid);
  },[gSel]);

  /* Avanzar a mejores terceros */
  const goBestThird=()=>{
    const allDone=GR.every(g=>(gSel[g.n]||[]).length===3);
    if(!allDone) return;
    setPhase('bestThird');
  };

  /* Toggle mejor tercero */
  const toggleBT=(tid)=>{
    setBtSel(prev=>{
      if(prev.includes(tid)) return prev.filter(x=>x!==tid);
      if(prev.length>=8) return prev;
      return[...prev,tid];
    });
  };

  /* Avanzar a eliminatorias */
  const goKnockout=()=>{
    if(btSel.length!==8) return;
    const sorted=[...btSel].sort((a,b)=>{
      const ga=TM[a].gr,gb=TM[b].gr;
      return GR.findIndex(g=>g.n===ga)-GR.findIndex(g=>g.n===gb);
    });
    const gs=gSel;
    const r32=R32_SLOTS.map(([s1,s2])=>{
      let t1=null,t2=null;
      if(s1.g!==undefined) t1=(gs[s1.g]||[])[s1.p]||null;
      else t1=sorted[s1.bt]||null;
      if(s2.g!==undefined) t2=(gs[s2.g]||[])[s2.p]||null;
      else t2=sorted[s2.bt]||null;
      return{team1:t1,team2:t2,winner:null};
    });
    setBracket({
      r32,
      r16:Array.from({length:8},()=>({team1:null,team2:null,winner:null})),
      qf:Array.from({length:4},()=>({team1:null,team2:null,winner:null})),
      sf:Array.from({length:2},()=>({team1:null,team2:null,winner:null})),
      fi:[{team1:null,team2:null,winner:null}]
    });
    setCurRound('r32');
    setPhase('knockout');
  };

  /* Limpiar resultados en cascada */
  function clearDown(bk,rnd,mi){
    bk[rnd][mi].winner=null;
    const ri=RORD.indexOf(rnd);
    if(ri<RORD.length-1){
      const nr=RORD[ri+1];
      const fd=FEED[nr];
      const fi=fd.findIndex(f=>f.includes(mi));
      if(fi>=0){
        const slot=fd[fi].indexOf(mi);
        if(slot===0) bk[nr][fi].team1=null;
        else bk[nr][fi].team2=null;
        clearDown(bk,nr,fi);
      }
    }
  }

  /* Seleccionar ganador en eliminatoria */
  const pickWinner=(rnd,mi,tid)=>{
    const nb=JSON.parse(JSON.stringify(bracket));
    nb[rnd][mi].winner=tid;
    const ri=RORD.indexOf(rnd);
    if(ri<RORD.length-1){
      const nr=RORD[ri+1];
      const fd=FEED[nr];
      const fi=fd.findIndex(f=>f.includes(mi));
      if(fi>=0){
        const slot=fd[fi].indexOf(mi);
        if(slot===0) nb[nr][fi].team1=tid;
        else nb[nr][fi].team2=tid;
        const nm=nb[nr][fi];
        if(nm.winner&&nm.winner!==nm.team1&&nm.winner!==nm.team2){
          clearDown(nb,nr,fi);
        }
      }
    }
    const allDone=nb[rnd].every(m=>m.winner);
    if(allDone&&rnd!=='fi'){
      const nri=RORD.indexOf(rnd);
      setCurRound(RORD[nri+1]);
    }
    if(rnd==='fi'){
      setChampion(tid);
      setTimeout(()=>setPhase('champion'),600);
    }
    setBracket(nb);
  };

  /* Reiniciar */
  const restart=()=>{
    setPhase('groups');setGSel({});setBtSel([]);
    setBracket({r32:[],r16:[],qf:[],sf:[],fi:[]});
    setCurRound('r32');setChampion(null);
  };

  return (
    <div className="relative z-10 min-h-screen flex flex-col">
      <Header phase={phase} progress={totalProgress}/>
      <Stepper phase={phase}/>
      <main className="flex-1 pb-8">
        {phase==='groups'&&<GroupPhase gSel={gSel} toggle={toggleGroup} go={goBestThird} simulate={autoFillGroups}/>}
        {phase==='bestThird'&&<BTPhase teams={thirdTeams} sel={btSel} toggle={toggleBT} go={goKnockout}/>}
        {phase==='knockout'&&<KOPhase bracket={bracket} cur={curRound} pick={pickWinner}/>}
        {phase==='champion'&&<ChampScreen champ={champion} bracket={bracket} restart={restart} notify={notify}/>}
      </main>
      <ToastC msg={toast.m} show={toast.s}/>
    </div>
  );
}

/* ======================== HEADER ======================== */
function Header({phase,progress}){
  return (
    <header className="app-header sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <span className="brand-mark">RPP</span>
          <div className="header-divider"></div>
          <div>
            <span className="header-title">MUNDIAL 2026</span>
            <span className="header-subtitle">{phaseLabel(phase)}</span>
          </div>
        </div>
        <div className="header-status">
          <span>{progress}%</span>
          <div className="header-meter"><i style={{width:progress+'%'}}></i></div>
        </div>
      </div>
    </header>
  );
}

/* ======================== STEPPER ======================== */
function Stepper({phase}){
  const steps=[{id:'groups',l:'Grupos'},{id:'bestThird',l:'Terceros'},{id:'knockout',l:'Eliminatoria'},{id:'champion',l:'Campeón'}];
  const idx=steps.findIndex(s=>s.id===phase);
  return (
    <div className="flex items-center justify-center gap-0 py-3 px-4 overflow-x-auto">
      {steps.map((s,i)=>(
        <Fragment key={s.id}>
          <div className={"step-item "+(i<idx?'ok ':'')+(i===idx?'act':'')}>
            <div className="step-dot"></div>
            <span className="hidden sm:inline">{s.l}</span>
          </div>
          {i<steps.length-1&&<div className={"step-line "+(i<idx?'ok':'')}></div>}
        </Fragment>
      ))}
    </div>
  );
}

/* ======================== FASE DE GRUPOS ======================== */
function GroupPhase({gSel,toggle,go,simulate}){
  const allDone=GR.every(g=>(gSel[g.n]||[]).length===3);
  const completeCount=GR.filter(g=>(gSel[g.n]||[]).length===3).length;
  const groupProgress=Math.round(completeCount/12*100);
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
            <div className="phase-progress-bar"><i style={{width:groupProgress+'%'}}></i></div>
            <span>{completeCount}/12 grupos cerrados</span>
          </div>
          <button className="btn-s icon-btn" onClick={simulate} title="Autocompleta con una proyección balanceada; luego puedes editar cualquier grupo.">
            <Icon name="spark" label="Simular grupos"/> Simular grupos
          </button>
        </div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 px-4 max-w-7xl mx-auto">
        {GR.map((g,gi)=>(
          <GCard key={g.n} group={g} sel={gSel[g.n]||[]} toggle={toggle} delay={gi}/>
        ))}
      </div>
      <div className="sticky-action text-center mt-8 pb-4 a-up">
        <button className="btn-p" disabled={!allDone} onClick={go}>Continuar a mejores terceros</button>
      </div>
    </div>
  );
}

function GCard({group,sel,toggle,delay}){
  const cnt=sel.length;
  const ok=cnt===3;
  return (
    <div className={"g-card a-up"+(ok?' complete':'')} style={{animationDelay:delay*40+'ms'}}>
      <div className="g-card-top">
        <span className="g-title">GRUPO {group.n}</span>
        <span className={"g-pill "+(ok?'done':'')}>
          {ok?'Cerrado':cnt+'/3'}
        </span>
      </div>
      <div className="g-rankline" style={{'--rank':(cnt/3*100)+'%'}}></div>
      <div className="p-2 flex flex-col gap-1">
        {group.t.map(tm=>{
          const pi=sel.indexOf(tm.id);
          const cls=pi>=0?' s'+(pi+1):'';
          return (
            <div key={tm.id} className={"team-row"+cls} onClick={()=>toggle(group.n,tm.id)} role="button" tabIndex="0">
              <div className="pos-b">{pi>=0?(pi+1):''}</div>
              <img className="flag-img" src={flg(tm.c,160)} alt={tm.nm} onError={e=>{e.target.style.opacity='0.2'}}/>
              <span className="font-medium text-sm flex-1">{tm.nm}</span>
              {pi>=0&&(
                <span className="text-xs font-semibold px-1.5 py-0.5 rounded-full" style={{
                  background:['rgba(163,230,53,.12)','rgba(132,204,22,.12)','rgba(101,163,13,.12)'][pi],
                  color:['#A3E635','#84CC16','#65a30d'][pi]
                }}>{['1°','2°','3°'][pi]}</span>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* ======================== MEJORES TERCEROS ======================== */
function BTPhase({teams,sel,toggle,go}){
  const cnt=sel.length;
  const remaining=8-cnt;
  return (
    <div className="max-w-4xl mx-auto px-4">
      <div className="phase-hero text-center mb-6 a-up">
        <div className="eyebrow">Últimos boletos</div>
        <h2 className="font-display text-2xl sm:text-3xl font-bold tracking-wide">MEJORES TERCEROS</h2>
        <p className="text-gray-500 text-sm mt-1">{remaining>0?remaining+' cupos siguen abiertos.':'La frontera está definida.'}</p>
        <div className="mt-3 flex items-center justify-center gap-2">
          <div className="h-2 flex-1 max-w-xs rounded-full bg-[#1C1C2E] overflow-hidden">
            <div className="h-full rounded-full transition-all duration-300" style={{background:'#A3E635',width:(cnt/8*100)+'%'}}></div>
          </div>
          <span className={"text-sm font-semibold "+(cnt===8?"text-[#A3E635]":"text-gray-500")}>{cnt}/8</span>
        </div>
      </div>
      <div className="survival-grid grid grid-cols-1 sm:grid-cols-2 gap-3">
        {teams.map(({team,tid,group})=>{
          if(!team) return null;
          const isSel=sel.includes(tid);
          return (
            <div key={tid} className={"third-c"+(isSel?' sel':'')} onClick={()=>toggle(tid)} role="button" tabIndex="0">
              <img className="flag-img" src={flg(team.c,160)} alt={team.nm} onError={e=>{e.target.style.opacity='0.2'}}/>
              <div className="flex-1">
                <div className="font-medium text-sm">{team.nm}</div>
                <div className="text-xs text-gray-500">3° Grupo {group}</div>
              </div>
              {isSel&&(
                <div className="select-mark">
                  <Icon name="check" label="Seleccionado"/>
                </div>
              )}
            </div>
          );
        })}
      </div>
      <div className="text-center mt-8 pb-4">
        <button className="btn-p" disabled={cnt!==8} onClick={go}>Continuar a eliminatorias</button>
      </div>
    </div>
  );
}

/* ======================== ELIMINATORIAS ======================== */
function KOPhase({bracket,cur,pick}){
  return (
    <div className="ko-shell">
      <div className="phase-hero text-center mb-4 a-up">
        <div className="eyebrow">Ruta al título</div>
        <h2 className="font-display text-2xl sm:text-3xl font-bold tracking-wide">TORNEO ELIMINATORIO</h2>
        <p className="text-gray-500 text-sm mt-1">Selecciona el ganador de cada partido</p>
      </div>
      <div className="bk-m"><KOMobile bracket={bracket} cur={cur} pick={pick}/></div>
      <div className="bk-d"><KODesktop bracket={bracket} cur={cur} pick={pick}/></div>
    </div>
  );
}

/* Componente de partido */
function MatchView({match,onPick,interactive}){
  const t1=match.team1?TM[match.team1]:null;
  const t2=match.team2?TM[match.team2]:null;
  const w=match.winner;
  return (
    <div className={"m-card"+(w?' decided':'')+(!interactive?' locked':'')}>
      <div className={"m-tm"+(!t1?' empty':(w===match.team1?' w':(w?' l':'')))}
           onClick={t1&&interactive?()=>onPick(match.team1):undefined}>
        {t1?(
          <>
            <img className="flag-img" src={flg(t1.c,160)} alt={t1.nm} onError={e=>{e.target.style.opacity='0.2'}}/>
            <span className="font-medium text-sm flex-1">{t1.nm}</span>
            {w===match.team1&&<Icon name="chevron" label="Ganador" className="winner-icon"/>}
          </>
        ):<span className="text-xs text-gray-600">Por definir</span>}
      </div>
      <div className="border-t border-[#1C1C2E]"></div>
      <div className={"m-tm"+(!t2?' empty':(w===match.team2?' w':(w?' l':'')))}
           onClick={t2&&interactive?()=>onPick(match.team2):undefined}>
        {t2?(
          <>
            <img className="flag-img" src={flg(t2.c,160)} alt={t2.nm} onError={e=>{e.target.style.opacity='0.2'}}/>
            <span className="font-medium text-sm flex-1">{t2.nm}</span>
            {w===match.team2&&<Icon name="chevron" label="Ganador" className="winner-icon"/>}
          </>
        ):<span className="text-xs text-gray-600">Por definir</span>}
      </div>
    </div>
  );
}

/* Bracket Mobile */
function KOMobile({bracket,cur,pick}){
  const[tab,setTab]=useState(cur);
  useEffect(()=>{setTab(cur);},[cur]);

  const matches=bracket[tab]||[];
  const ri=RORD.indexOf(tab);
  const prevDone=ri===0||(bracket[RORD[ri-1]]&&bracket[RORD[ri-1]].every(m=>m.winner));
  const interactive=tab===cur&&prevDone;

  return (
    <div className="px-4 py-2">
      <div className="flex gap-2 overflow-x-auto pb-3 mb-4">
        {RORD.map(r=>{
          const ms=bracket[r]||[];
          const done=ms.length>0&&ms.every(m=>m.winner);
          const locked=RORD.indexOf(r)>RORD.indexOf(cur);
          return (
            <button key={r}
              className={"r-tab"+(tab===r?' act':'')+(done?' done':'')+(locked?' lock':'')}
              onClick={!locked?()=>setTab(r):undefined}
              disabled={locked}>{RS[r]}</button>
          );
        })}
      </div>
      <div className="flex flex-col gap-3">
        {matches.map((m,mi)=>(
          <div key={tab+mi} className="a-up" style={{animationDelay:mi*40+'ms'}}>
            <div className="match-label">PARTIDO {mi+1}</div>
            <MatchView match={m} onPick={tid=>pick(tab,mi,tid)} interactive={interactive}/>
          </div>
        ))}
      </div>
    </div>
  );
}

/* Bracket Desktop */
function KODesktop({bracket,cur,pick}){
  return (
    <div className="ko-desktop overflow-x-auto px-4 py-4">
      <div className="ko-lanes flex items-stretch gap-0 min-w-max">
        {RORD.map((rnd,ri)=>{
          const ms=bracket[rnd]||[];
          const prevDone=ri===0||(bracket[RORD[ri-1]]&&bracket[RORD[ri-1]].every(m=>m.winner));
          const interactive=rnd===cur&&prevDone;
          const done=ms.length>0&&ms.every(m=>m.winner);
          return (
            <Fragment key={rnd}>
              <div className={"ko-round flex flex-col "+(done?'round-done':'')+(rnd===cur?' round-active':'')} style={{minWidth:'214px'}}>
                <div className="round-title">{RS[rnd]}</div>
                <div className="flex flex-col justify-around flex-1 gap-3 px-1">
                  {ms.map((m,mi)=>(
                    <div key={mi}>
                      <MatchView match={m} onPick={tid=>pick(rnd,mi,tid)} interactive={interactive}/>
                    </div>
                  ))}
                </div>
              </div>
              {ri<RORD.length-1&&(
                <div className="ko-connector flex flex-col items-center justify-around" style={{width:'48px'}}>
                  <div style={{height:'28px'}}></div>
                  {FEED[RORD[ri+1]].map((_,fi)=>(
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
function ChampScreen({champ,bracket,restart,notify}){
  const[showCelebration,setShowCelebration]=useState(true);
  const team=TM[champ];

  useEffect(()=>{const t=setTimeout(()=>setShowCelebration(false),4200);return()=>clearTimeout(t);},[]);

  /* Timeline: camino del campeón */
  const timeline=useMemo(()=>{
    const path=[];
    RORD.forEach(rnd=>{
      (bracket[rnd]||[]).forEach(m=>{
        if(m.winner===champ){
          const opp=m.team1===champ?m.team2:m.team1;
          path.push({round:RN[rnd],short:RS[rnd],opponent:opp,isFinal:rnd==='fi'});
        }
      });
    });
    return path.reverse();
  },[champ,bracket]);

  /* Celebración */
  const sparks=useMemo(()=>{
    const pcs=[];const cols=['#F5C542','#A3E635','#fff7d6'];
    for(let i=0;i<34;i++) pcs.push({
      x:46+(Math.random()-.5)*68,y:22+Math.random()*42,d:Math.random()*1.2,
      dur:2.4+Math.random()*1.8,c:cols[~~(Math.random()*cols.length)],sz:2+Math.random()*4
    });
    return pcs;
  },[]);

  const copyURL=()=>{
    navigator.clipboard.writeText(window.location.href).then(()=>notify('URL copiada al portapapeles')).catch(()=>notify('No se pudo copiar'));
  };
  const shareNative=async()=>{
    const text='Mi campeón del Mundial 2026: '+team.nm+' - Simula tu pronóstico en RPP';
    if(!navigator.share){
      copyURL();
      return;
    }
    try{
      await navigator.share({title:'Mundial 2026 - Simulador RPP',text,url:window.location.href});
    }catch(e){
      notify('No se pudo compartir');
    }
  };

  const downloadImg=async()=>{
    const card=document.getElementById('share-card');
    card.style.left='0';
    const tlRows=timeline.map(t=>{
      const opp=TM[t.opponent];
      return '<div style="display:flex;align-items:center;gap:12px;font-size:14px;margin-bottom:10px">'+
        '<div style="width:90px;font-family:Plus Jakarta Sans Variable,Plus Jakarta Sans,Arial,sans-serif;font-weight:800;color:#A3E635;font-size:12px;text-transform:uppercase;letter-spacing:1px">'+t.short+'</div>'+
        '<div style="color:#777">vs</div>'+
        '<div style="display:flex;align-items:center;gap:8px">'+
        '<img src="'+flg(opp?opp.c:'xx',80)+'" style="width:26px;height:18px;border-radius:3px;object-fit:cover" />'+
        '<span style="color:#ccc">'+(opp?opp.nm:'?')+'</span></div>'+
        '<div style="background:#A3E635;color:#060609;padding:2px 8px;border-radius:4px;font-size:10px;font-weight:800;font-family:Plus Jakarta Sans Variable,Plus Jakarta Sans,Arial,sans-serif;letter-spacing:1px;margin-left:auto">ELIMINADO</div></div>';
    }).join('');
    card.innerHTML=
      '<div style="position:absolute;inset:0;background:radial-gradient(ellipse at 50% 0%,rgba(245,197,66,.18) 0%,transparent 44%),radial-gradient(ellipse at 20% 70%,rgba(163,230,53,.12) 0%,transparent 48%),linear-gradient(180deg,#0b0b10,#050507)"></div>'+
      '<div style="position:relative;z-index:1">'+
      '<div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:34px">'+
      '<div style="font-family:Plus Jakarta Sans Variable,Plus Jakarta Sans,Arial,sans-serif;font-weight:800;font-size:22px;color:#A3E635;letter-spacing:2px">RPP</div>'+
      '<div style="font-family:Plus Jakarta Sans Variable,Plus Jakarta Sans,Arial,sans-serif;font-weight:800;font-size:12px;color:#666;letter-spacing:2px">MUNDIAL 2026</div></div>'+
      '<div style="font-family:Plus Jakarta Sans Variable,Plus Jakarta Sans,Arial,sans-serif;font-size:38px;line-height:1;font-weight:800;color:#f4f4f7;text-transform:uppercase;letter-spacing:2px;margin-bottom:8px">Tu Campeón</div>'+
      '<div style="font-size:14px;color:#8b8b98;margin-bottom:30px">Pronóstico creado en el simulador RPP</div>'+
      '<div style="display:flex;align-items:center;gap:18px;padding:24px;background:rgba(245,197,66,.09);border:1.5px solid rgba(245,197,66,.28);border-radius:10px;margin-bottom:28px">'+
      '<img src="'+flg(team.c,160)+'" style="width:72px;height:50px;border-radius:6px;object-fit:cover" />'+
      '<div><div style="font-size:11px;color:#84CC16;font-family:Plus Jakarta Sans Variable,Plus Jakarta Sans,Arial,sans-serif;font-weight:800;letter-spacing:2px;text-transform:uppercase">CAMPEÓN</div>'+
      '<div style="font-family:Plus Jakarta Sans Variable,Plus Jakarta Sans,Arial,sans-serif;font-size:36px;line-height:1.05;font-weight:800;color:#f0f0f5">'+team.nm.toUpperCase()+'</div></div>'+
      '<div style="margin-left:auto;width:54px;height:54px;border-radius:50%;display:flex;align-items:center;justify-content:center;background:rgba(245,197,66,.14);color:#F5C542;font-size:30px">#1</div></div>'+
      '<div style="font-family:Plus Jakarta Sans Variable,Plus Jakarta Sans,Arial,sans-serif;font-weight:800;font-size:13px;color:#A3E635;letter-spacing:2px;text-transform:uppercase;margin-bottom:14px">CAMINO AL TÍTULO</div>'+
      tlRows+
      '<div style="display:flex;align-items:center;justify-content:space-between;padding-top:16px;border-top:1px solid #1C1C2E;margin-top:20px">'+
      '<div style="font-family:Plus Jakarta Sans Variable,Plus Jakarta Sans,Arial,sans-serif;font-weight:800;font-size:18px;color:#A3E635;letter-spacing:2px">SIMULADOR</div>'+
      '<div style="font-family:Plus Jakarta Sans Variable,Plus Jakarta Sans,Arial,sans-serif;font-weight:800;font-size:12px;color:#444;letter-spacing:2px">LISTO PARA COMPARTIR</div></div></div>';
    try{
      const canvas=await html2canvas(card,{backgroundColor:'#060609',scale:2,useCORS:true,allowTaint:true});
      const link=document.createElement('a');
      link.download='mi-campeon-mundial-2026.png';
      link.href=canvas.toDataURL('image/png');
      link.click();
      notify('Imagen descargada exitosamente');
    }catch(e){notify('Error al generar la imagen');}
    card.style.left='-9999px';
  };

  return (
    <div className="champ-stage min-h-screen flex flex-col items-center pt-6 pb-12 px-4">
      {showCelebration&&<div className="champ-burst" aria-hidden="true"></div>}
      {showCelebration&&sparks.map((p,i)=>(
        <div key={i} className="champ-spark" style={{
          left:p.x+'%',top:p.y+'%',animationDelay:p.d+'s',animationDuration:p.dur+'s',
          backgroundColor:p.c,width:p.sz+'px',height:p.sz+'px'
        }}></div>
      ))}
      <div className="a-up text-center mb-8">
        <div className="eyebrow">Mundial 2026</div>
        <h1 className="font-display text-3xl sm:text-4xl font-bold tracking-wide">TU CAMPEÓN</h1>
      </div>
      <div className="champ-card a-up pulse-glow" style={{animationDelay:'.3s'}}>
        <div className="champ-trophy a-crown"><Icon name="trophy" label="Trofeo"/></div>
        <img className="mx-auto mb-4 rounded-lg" style={{width:'80px',height:'56px',objectFit:'cover'}}
             src={flg(team.c,160)} alt={team.nm} onError={e=>{e.target.style.opacity='0.2'}}/>
        <div className="champ-kicker">CAMPEÓN</div>
        <h2 className="font-display text-4xl sm:text-5xl font-bold">{team.nm.toUpperCase()}</h2>
      </div>
      <div className="a-up max-w-md w-full mt-8" style={{animationDelay:'.5s'}}>
        <div className="font-display text-xs tracking-[3px] text-center mb-4" style={{color:'rgba(163,230,53,.7)'}}>CAMINO AL TÍTULO</div>
        <div className="flex flex-col gap-2.5">
          {timeline.map((t,i)=>{
            const opp=TM[t.opponent];
            return (
              <div key={i} className="champ-path-row flex items-center gap-3 a-slide" style={{animationDelay:(.6+i*.08)+'s'}}>
                <div className="font-display text-xs tracking-wider w-20 shrink-0" style={{color:'rgba(163,230,53,.7)'}}>{t.short}</div>
                <div className="flex-1 flex items-center gap-2">
                  <span className="text-gray-500 text-xs">vs</span>
                  {opp?(
                    <>
                      <img style={{width:'22px',height:'15px',objectFit:'cover',borderRadius:'2px'}} src={flg(opp.c,80)} alt={opp.nm} onError={e=>{e.target.style.opacity='0.2'}}/>
                      <span className="text-sm">{opp.nm}</span>
                    </>
                  ):<span className="text-sm text-gray-500">?</span>}
                </div>
                <div className="text-[10px] font-bold font-display px-2 py-0.5 rounded tracking-wider" style={{background:'rgba(163,230,53,.15)',color:'#A3E635'}}>ELIMINADO</div>
              </div>
            );
          })}
        </div>
      </div>
      <div className="a-up mt-10 max-w-md w-full" style={{animationDelay:'1s'}}>
        <div className="font-display text-xs tracking-[3px] text-gray-600 mb-4 text-center">COMPARTIR</div>
        <div className="flex items-center justify-center gap-4">
          <button className="share-btn" onClick={shareNative} title="Compartir"><Icon name="share" label="Compartir"/></button>
          <button className="share-btn" onClick={copyURL} title="Copiar URL"><Icon name="link" label="Copiar URL"/></button>
          <button className="share-btn" onClick={downloadImg} title="Descargar imagen"><Icon name="download" label="Descargar imagen"/></button>
        </div>
      </div>
      <div className="a-up mt-8" style={{animationDelay:'1.2s'}}>
        <button className="btn-s icon-btn" onClick={restart}><Icon name="restart" label="Nuevo pronóstico"/> Hacer un nuevo pronóstico</button>
      </div>
    </div>
  );
}

/* ======================== TOAST ======================== */
function ToastC({msg,show}){
  return <div className={"toast-c"+(show?' show':'')}>{msg}</div>;
}
