// JavaScript do site. Funcionalidades originais preservadas.
// ===== CONFIGURAÇÃO PROVISÓRIA: troque pelo número real (formato 55 + DDD + número) =====
const WA="5599757299";
const wa=t=>`https://wa.me/${WA}?text=${encodeURIComponent(t)}`;
const brl=n=>n.toLocaleString("pt-BR",{style:"currency",currency:"BRL",maximumFractionDigits:0});
const km=n=>n.toLocaleString("pt-BR")+" km";
// [marca, modelo, versão, ano, km, câmbio, combustível, cor, preço, categoria, destaque, hex]
// ===== INVENTÁRIO PROVISÓRIO DE VEÍCULOS =====
const V=[
["Toyota","Hilux","SRV 3.0 4x4 Diesel",2012,168000,"Automático","Diesel","Prata",142900,"Camionete",1,"#a6abb3"],
["Chevrolet","S10","LTZ 2.8 4x4",2016,98000,"Automático","Diesel","Branca",129900,"Camionete",0,"#e8e9ec"],
["Ford","Ranger","XLS 3.2 4x4",2015,112000,"Automático","Diesel","Prata",118500,"Camionete",0,"#9ea3ab"],
["Fiat","Strada","Working 1.4",2018,74000,"Manual","Flex","Prata",62900,"Camionete",0,"#b3b7bd"],
["Chevrolet","S10","Advantage 2.4",2011,183000,"Manual","Flex","Prata",74900,"Camionete",0,"#8f949c"],
["Toyota","Hilux SW4","SRX 3.0 4x4",2014,130000,"Automático","Diesel","Preta",139900,"SUV",0,"#2a2c31"],
["Jeep","Compass","Longitude 2.0",2018,71000,"Automático","Flex","Cinza",119900,"SUV",1,"#5b6068"],
["Honda","Civic","EXL 2.0",2016,89000,"Automático","Flex","Preta",89900,"Sedã",0,"#33353a"],
["Volkswagen","Gol","Highline 1.6",2017,61000,"Manual","Flex","Branca",49900,"Hatch",0,"#e3e4e7"]
].map((a,i)=>({id:i,mk:a[0],md:a[1],ver:a[2],yr:a[3],km:a[4],gb:a[5],fu:a[6],cor:a[7],pr:a[8],cat:a[9],hot:a[10],hex:a[11]}));

function art(c,pick){
  const body=pick?"M20 140V118Q20 110 30 108L118 100L146 62Q150 58 156 58H214Q220 58 224 63L244 100H378Q384 100 384 108V140Z":"M24 140V114Q24 106 34 104L96 96L132 62Q138 56 148 56H250Q262 56 270 64L300 96L360 104Q378 106 378 118V140Z";
  const glass=pick?"M128 98L150 68H212L230 98Z":"M108 96L136 66H196V96ZM204 66H250L280 96H204Z";
  const w=pick?[95,310]:[100,300];
  return `<svg class="car" viewBox="0 0 400 200" aria-hidden="true"><ellipse cx="200" cy="168" rx="175" ry="9" fill="#000" opacity=".55"/><path d="${body}" fill="${c}"/><path d="${body}" fill="url(#sh)"/><path d="${glass}" fill="#10131a" opacity=".92"/>${w.map(x=>`<circle cx="${x}" cy="142" r="27" fill="#0b0c0e"/><circle cx="${x}" cy="142" r="15" fill="#868b94"/><circle cx="${x}" cy="142" r="5" fill="#0b0c0e"/>`).join("")}<ellipse cx="${pick?27:30}" cy="116" rx="7" ry="4" fill="#fff4d2"/></svg>`;
}
document.getElementById("hs").innerHTML =
  '<img src="assets/hero.jpg" alt="Igor Esteves Camionetes" class="hero-photo">';

const $=s=>document.querySelector(s);
const norm=s=>s.normalize("NFD").replace(/[\u0300-\u036f]/g,"").toLowerCase();
const msg=v=>`Olá! Tenho interesse no ${v.mk} ${v.md} ${v.ver} ${v.yr} (${brl(v.pr)}) que vi no site. Ainda está disponível?`;
document.querySelectorAll("a.wa").forEach(a=>a.href=wa("Olá! Vim pelo site e gostaria de falar com um consultor."));
$("#fm").innerHTML='<option value="">Todas as marcas</option>'+[...new Set(V.map(v=>v.mk))].sort().map(m=>`<option>${m}</option>`).join("");
let cat="";
const cats=["","Camionete","SUV","Sedã","Hatch"];
$("#cats").innerHTML=cats.map(c=>`<button type="button" class="chip" data-c="${c}" aria-pressed="${c===""}">${c||"Todos"}</button>`).join("");
$("#cats").addEventListener("click",e=>{const b=e.target.closest(".chip");if(!b)return;cat=b.dataset.c;document.querySelectorAll(".chip").forEach(x=>x.setAttribute("aria-pressed",x===b));render()});

function render(){
  const q=norm($("#q").value.trim()),m=$("#fm").value,p=$("#fp").value,y=+$("#fy").value||0;
  const [lo,hi]=p?p.split("-").map(Number):[0,Infinity];
  const r=V.filter(v=>(!q||norm(`${v.mk} ${v.md} ${v.ver}`).includes(q))&&(!m||v.mk===m)&&v.pr>=lo&&v.pr<hi&&v.yr>=y&&(!cat||v.cat===cat));
  $("#cnt").textContent=r.length===1?"1 veículo encontrado":`${r.length} veículos encontrados`;
  $("#grid").innerHTML=r.length?r.map((v,i)=>`<article class="card" style="--i:${i}">
    <button class="ph" data-id="${v.id}" aria-label="Ver detalhes: ${v.mk} ${v.md} ${v.yr}">${v.hot?'<span class="tag">Destaque</span>':""}${art(v.hex,v.cat==="Camionete")}</button>
    <div class="cb"><h3>${v.mk} ${v.md}</h3><span class="v">${v.ver}</span>
    <div class="sp"><span>${v.yr}</span><span>${km(v.km)}</span><span>${v.gb}</span></div>
    <span class="pr">${brl(v.pr)}</span>
    <div class="ca"><button class="btn" data-id="${v.id}" type="button">Ver detalhes</button><a class="btn p" target="_blank" rel="noopener" href="${wa(msg(v))}">WhatsApp</a></div></div></article>`).join("")
    :`<div class="empty"><p>Nenhum veículo com esses filtros.</p><button class="lk" type="button" onclick="clearAll()">Limpar filtros</button></div>`;
}
function clearAll(){$("#q").value="";$("#fm").value="";$("#fp").value="";$("#fy").value="";cat="";document.querySelectorAll(".chip").forEach(x=>x.setAttribute("aria-pressed",x.dataset.c===""));render()}
["#q","#fm","#fp","#fy"].forEach(s=>$(s).addEventListener("input",render));
$("#clr").addEventListener("click",clearAll);
render();

/* modal */
const dlg=$("#dlg");let opener=null;
function open(id,el){
  const v=V[id],pick=v.cat==="Camionete";opener=el;
  $("#main").dataset.v=0;$("#main").innerHTML=art(v.hex,pick);
  $("#th").innerHTML=["Lado esquerdo","Lado direito","Detalhe"].map((t,i)=>`<button type="button" data-v="${i}" aria-pressed="${i===0}">${t}</button>`).join("");
  $("#di").innerHTML=`<h2 id="dt">${v.mk} ${v.md}</h2><span class="v" style="color:var(--mut)">${v.ver}</span><span class="pr">${brl(v.pr)}</span>
  <dl class="sl">${[["Ano",v.yr],["Quilometragem",km(v.km)],["Câmbio",v.gb],["Combustível",v.fu],["Cor",v.cor],["Categoria",v.cat]].map(s=>`<div><dt>${s[0]}</dt><dd>${s[1]}</dd></div>`).join("")}</dl>
  <p>${v.md} ${v.ver} ${v.yr}, ${v.fu.toLowerCase()}, cor ${v.cor.toLowerCase()}. Texto de exemplo da prévia: descreva aqui o estado, as revisões, os opcionais e as condições de financiamento. As fotos reais substituem as ilustrações.</p>
  <a class="btn p" style="width:100%" target="_blank" rel="noopener" href="${wa(msg(v))}">Consultar no WhatsApp</a>`;
  document.body.style.overflow="hidden";dlg.showModal();
}
$("#th").addEventListener("click",e=>{const b=e.target.closest("button");if(!b)return;$("#main").dataset.v=b.dataset.v;$("#th").querySelectorAll("button").forEach(x=>x.setAttribute("aria-pressed",x===b))});
$("#grid").addEventListener("click",e=>{const b=e.target.closest("button[data-id]");if(b)open(+b.dataset.id,b)});
const shut=()=>dlg.close();
$("#x").onclick=$("#back").onclick=shut;
dlg.addEventListener("click",e=>{if(e.target===dlg)shut()});
dlg.addEventListener("close",()=>{document.body.style.overflow="";opener&&opener.focus()});

// ===== CABEÇALHO, MENU E ANIMAÇÃO DE SCROLL DO HERO =====
const hd=$("#hd"),hero=$("#hero"),nv=$("#nv"),mt=$("#mt");
mt.onclick=()=>{const o=nv.classList.toggle("open");mt.setAttribute("aria-expanded",o)};
nv.addEventListener("click",e=>{if(e.target.closest("a"))nv.classList.remove("open")});
const rm=matchMedia("(prefers-reduced-motion: reduce)");let tk=0;
function up(){tk=0;hd.classList.toggle("sc",scrollY>40);if(rm.matches)return;hero.style.setProperty("--p",Math.min(1,scrollY/(innerHeight*.95)).toFixed(3))}
addEventListener("scroll",()=>{if(!tk)tk=requestAnimationFrame(up)},{passive:true});up();
