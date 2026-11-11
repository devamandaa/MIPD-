var T = {
  login: 'MIPD',
  dash: 'Início',
  talh: 'Propriedade e talhão',
  amost: 'Configurar levantamento',
  ponto: 'Coleta por ponto',
  ident: 'Identificação guiada',
  ficha: 'Ficha botânica',
  res: 'Resultados',
  mapa: 'Mapa de ocorrências',
  hist: 'Histórico e relatórios',
  mais: 'Mais',
  manejo: 'Manejo e prevenção',
  rev: 'Revisão técnica',
  agenda: 'Agenda',
  estoque: 'Estoque e custos',
  ia: 'Assistente de IA',
  sync: 'Sincronização',
};
var E = [
  'E1 · plântula (BBCH 10–11)',
  'E2 · 2 a 4 folhas (12–14)',
  'E3 · 4 a 6 folhas (14–21)',
  'E4 · ramificada/touceira (21–29)',
  'E5 · pré-florescimento (30–49)',
  'E6 · florescimento (51–69)',
  'E7 · frutificação (70–89)',
];
var SP = {
  l: [
    [
      'Buva',
      'Conyza spp.',
      'Asteraceae',
      'anual',
      'Roseta basal, caule ereto piloso, folhas lanceoladas',
    ],
    [
      'Caruru',
      'Amaranthus spp.',
      'Amaranthaceae',
      'anual',
      'Folhas alternas, inflorescência em espiga',
    ],
    [
      'Corda-de-viola',
      'Ipomoea spp.',
      'Convolvulaceae',
      'anual',
      'Hábito trepador, folhas cordiformes, flor em funil',
    ],
    [
      'Picão-preto',
      'Bidens spp.',
      'Asteraceae',
      'anual',
      'Folhas compostas, frutos com arista',
    ],
    [
      'Leiteiro',
      'Euphorbia heterophylla',
      'Euphorbiaceae',
      'anual',
      'Látex branco, folhas de forma variável',
    ],
    [
      'Trapoeraba',
      'Commelina benghalensis',
      'Commelinaceae',
      'perene',
      'Classe botânica monocotiledônea, mas agrupada em folha larga na navegação',
    ],
    [
      'Poaia-branca',
      'Richardia brasiliensis',
      'Rubiaceae',
      'anual',
      'Folhas opostas, flores brancas. Grupo a confirmar com Agronomia',
    ],
  ],
  e: [
    [
      'Capim-amargoso',
      'Digitaria insularis',
      'Poaceae',
      'perene',
      'Touceira, lígula membranosa, rizomas',
    ],
    [
      'Capim-pé-de-galinha',
      'Eleusine indica',
      'Poaceae',
      'anual',
      'Inflorescência em dedos, bainha achatada',
    ],
    [
      'Azevém',
      'Lolium multiflorum',
      'Poaceae',
      'anual',
      'Espiga dística, aurículas presentes',
    ],
    [
      'Capim-colonião/mombaça',
      'Megathyrsus maximus',
      'Poaceae',
      'perene',
      'Touceira alta, lígula curta, panícula',
    ],
  ],
};
var H = [],
  cur = 'login',
  N = 5,
  a = 0.25,
  pts = [],
  regs = [],
  isClean = false,
  gm = false,
  gs = 'l',
  mode = 'pick',
  sel = null,
  online = true,
  extra = 2;
function $(i) {
  return document.getElementById(i);
}
function f(x, d) {
  return x.toLocaleString('pt-BR', {
    minimumFractionDigits: d,
    maximumFractionDigits: d,
  });
}
function go(id, tab) {
  if (!tab && cur !== id) H.push(cur);
  if (tab) H = [];
  show(id);
}
function back() {
  if (H.length) show(H.pop());
}
function toPonto() {
  var i = H.lastIndexOf('ponto');
  H = H.slice(0, i);
  show('ponto');
}
function toast(m) {
  var t = $('toast');
  t.textContent = m;
  t.style.display = 'block';
  clearTimeout(t._h);
  t._h = setTimeout(function () {
    t.style.display = 'none';
  }, 2600);
}
function pend() {
  return extra + pts.length;
}
function upd() {
  $('sy').textContent = online
    ? '● Online'
    : '○ Offline · ' + pend() + ' pend.';
  drawNotif();
}
function show(id) {
  cur = id;
  document.querySelectorAll('.s').forEach(function (s) {
    s.classList.toggle('on', s.id === id);
  });
  $('ttl').textContent = T[id];
  $('back').style.visibility = H.length ? 'visible' : 'hidden';
  $('nav').style.display = id === 'login' ? 'none' : 'flex';
  $('sy').style.display = id === 'login' ? 'none' : '';
  document.querySelectorAll('.nav button').forEach(function (b) {
    b.classList.toggle('on', b.dataset.t === id);
  });
  document.querySelector('main').scrollTop = 0;
  upd();
  if (id === 'dash') drawDash();
  if (id === 'ident') drawSp();
  if (id === 'ponto') drawRegs();
  if (id === 'res') drawRes();
  if (id === 'mapa') drawMap();
  if (id === 'rev') drawRev();
  if (id === 'sync') drawSync();
}
function area() {
  var v = (+$('cl').value || 0) * (+$('lg').value || 0);
  $('ar').textContent =
    'Área calculada: ' + f(v, 0) + ' m² (' + f(v / 10000, 2) + ' ha)';
}
function drawDash() {
  $('dn').textContent = pts.length ? 1 : 0;
  $('dlast').innerHTML = pts.length
    ? '<div class="card row" onclick="go(\'res\')"><div><b>Talhão A</b><div class="mut">' +
      pts.length +
      ' de ' +
      N +
      ' pontos</div></div><span>' +
      (pts.length < N ? 'provisório' : 'concluído') +
      '</span></div>'
    : '<p class="mut">Nenhum levantamento ainda.</p>';
}
function startS() {
  N = Math.max(1, parseInt($('np').value) || 5);
  a = +$('ac').value;
  pts = [];
  regs = [];
  isClean = false;
  go('ponto');
}
function grp(g) {
  gs = g;
  $('g1').classList.toggle('on', g === 'l');
  $('g2').classList.toggle('on', g === 'e');
  drawSp();
}
function drawSp() {
  $('nid').style.display = mode === 'pick' ? 'block' : 'none';
  var q = ($('srch').value || '').toLowerCase(),
    h = '';
  SP[gs].forEach(function (s, i) {
    if (s.join(' ').toLowerCase().indexOf(q) < 0) return;
    h +=
      '<div class="card" onclick="openF(' +
      i +
      ')"><div class="row"><b>' +
      s[0] +
      '</b><span class="mut">ficha ›</span></div><div class="mut"><i>' +
      s[1] +
      '</i> · ' +
      s[4].split(',')[0] +
      '</div></div>';
  });
  $('sp').innerHTML = h || '<p class="mut">Nenhuma espécie encontrada.</p>';
}
function openF(i) {
  sel = i;
  var s = SP[gs][i],
    p = [
      'Planta inteira',
      'Folha/base',
      'Caule/touceira',
      'Flor/inflorescência',
      'Fruto/semente',
    ]
      .map(function (x) {
        return '<div>📷 ' + x + '</div>';
      })
      .join('');
  var h =
    '<h2 style="margin-top:0;font-size:20px">' +
    s[0] +
    '</h2><div class="mut"><i>' +
    s[1] +
    '</i> · ' +
    s[2] +
    ' · ' +
    (gs === 'l' ? 'folha larga' : 'folha estreita') +
    ' · ciclo ' +
    s[3] +
    '</div><h2>Características-chave</h2><div class="card">' +
    s[4] +
    '</div><h2>Imagens (mín. 5 por espécie)</h2><div class="ph">' +
    p +
    '</div><div class="mut" style="margin:6px 0">Autoria, licença e validação agronômica: a registrar. Resistência: apenas informação documental.</div>';
  if (mode === 'pick')
    h +=
      '<label>Estádio da planta</label><select id="est">' +
      E.map(function (e, k) {
        return (
          '<option value="' +
          (k + 1) +
          '"' +
          (k == 2 ? ' selected' : '') +
          '>' +
          e +
          '</option>'
        );
      }).join('') +
      '</select><div class="mut">Confiança da identificação: confirmada pelo usuário.</div><button class="btn" onclick="addReg()">Usar esta espécie</button>';
  $('fh').innerHTML = h;
  go('ficha');
}
function addReg() {
  isClean = false;
  regs.push({ n: SP[gs][sel][0], e: 'E' + $('est').value, q: 1 });
  toPonto();
  toast('Registro adicionado. Informe a contagem.');
}
function addNid() {
  isClean = false;
  regs.push({ n: 'Não identificada', e: '—', q: 1, nid: 1, ph: 0 });
  toPonto();
  toast('Anexe a foto (obrigatória) e a contagem.');
}
function drawRegs() {
  var d = pts.length + 1;
  $('pg').textContent = 'Ponto ' + Math.min(d, N) + ' de ' + N;
  var p = Math.round((pts.length / N) * 100);
  $('pp').textContent = pts.length + ' realizados / ' + N + ' planejados';
  $('pb').style.width = p + '%';
  $('gps').textContent =
    '📍 −23,5612, −46,6558 · precisão ±4 m · origem: ' +
    (gm ? 'manual' : 'GPS') +
    ' · responsável: Técnico Demo · agora';
  $('cb').textContent = (isClean ? '☑' : '☐') + ' Quadro limpo (sem plantas)';
  var h = '';
  regs.forEach(function (r, i) {
    h +=
      '<div class="card"><div class="row"><div><b>' +
      r.n +
      '</b><div class="mut">Estádio ' +
      r.e +
      '</div></div><div class="q"><button onclick="chg(' +
      i +
      ',-1)">−</button><b>' +
      r.q +
      '</b><button onclick="chg(' +
      i +
      ',1)">+</button></div></div>' +
      (r.nid
        ? '<a class="l" onclick="regs[' +
          i +
          '].ph=1;drawRegs()">' +
          (r.ph ? '📷 Foto anexada ✓' : '📷 Anexar foto (obrigatória)') +
          '</a>'
        : '') +
      '</div>';
  });
  $('regs').innerHTML =
    h || '<p class="mut">Nenhuma espécie registrada neste ponto.</p>';
}
function chg(i, d) {
  regs[i].q += d;
  if (regs[i].q < 1) regs.splice(i, 1);
  else if (regs[i].q > 100)
    toast('Contagem anormalmente alta: confirme (limite a validar).');
  drawRegs();
}
function clean() {
  isClean = !isClean;
  if (isClean) regs = [];
  drawRegs();
}
function savePt() {
  if (!regs.length && !isClean) {
    toast('Adicione uma espécie ou marque “quadro limpo”.');
    return;
  }
  for (var i = 0; i < regs.length; i++)
    if (regs[i].nid && !regs[i].ph) {
      toast('Espécie não identificada exige foto.');
      return;
    }
  pts.push({ r: regs, c: isClean });
  regs = [];
  isClean = false;
  if (pts.length >= N) {
    H = ['dash'];
    toast('Levantamento concluído. Índices definitivos liberados.');
    show('res');
  } else {
    toast('Ponto salvo. Pendente de sincronização.');
    drawRegs();
  }
}
function loadTest() {
  a = 0.25;
  N = 20;
  pts = [];
  for (var i = 0; i < 20; i++) {
    var r = [];
    if (i < 12) r.push({ n: 'Buva', e: 'E3', q: 7 });
    if (i < 8) r.push({ n: 'Corda-de-viola', e: 'E2', q: 2 });
    if (i >= 8 && i < 13) r.push({ n: 'Capim-amargoso', e: 'E3', q: 2 });
    pts.push({ r: r, c: !r.length });
  }
  go('res');
}
function calc() {
  var n = pts.length,
    m = {};
  pts.forEach(function (p) {
    var s = {};
    p.r.forEach(function (r) {
      var o = m[r.n] || (m[r.n] = { n: r.n, ni: 0, pi: 0 });
      o.ni += r.q;
      if (!s[r.n]) {
        s[r.n] = 1;
        o.pi++;
      }
    });
  });
  var L = Object.keys(m).map(function (k) {
      return m[k];
    }),
    A = n * a;
  L.forEach(function (s) {
    s.D = s.ni / A;
    s.F = s.pi / n;
    s.Ab = s.ni / s.pi;
  });
  function S(k) {
    return L.reduce(function (t, s) {
      return t + s[k];
    }, 0);
  }
  var sD = S('D'),
    sF = S('F'),
    sA = S('Ab');
  L.forEach(function (s) {
    s.Der = (s.D / sD) * 100;
    s.Frr = (s.F / sF) * 100;
    s.Abr = (s.Ab / sA) * 100;
    s.IVI = s.Der + s.Frr + s.Abr;
    s.IR = s.IVI / 3;
  });
  L.sort(function (x, y) {
    return y.IR - x.IR;
  });
  return { L: L, n: n, A: A };
}
function drawRes() {
  var r = $('rh');
  if (!pts.length) {
    r.innerHTML =
      '<p class="mut">Sem pontos registrados. Inicie uma amostragem ou carregue o caso de teste em Início.</p>';
    return;
  }
  var c = calc(),
    def = pts.length >= N,
    h = def
      ? '<div class="card"><b>✔ Levantamento concluído</b> · índices definitivos</div>'
      : '<div class="warn">Resultados provisórios: ' +
        pts.length +
        ' de ' +
        N +
        ' pontos. Índices não são definitivos.</div>';
  h +=
    '<div class="card"><div class="row"><span>Área total do talhão</span><b>2.500 m² (0,25 ha)</b></div><div class="row"><span>Área amostrada (A = N × a)</span><b>' +
    f(c.A, 2) +
    ' m²</b></div><div class="mut">N = ' +
    c.n +
    ' quadros (inclui limpos) × a = ' +
    f(a, 2) +
    ' m²</div></div>';
  if (!c.L.length) {
    r.innerHTML =
      h + '<p class="mut">Ausência de espécies: índices não aplicáveis.</p>';
    return;
  }
  h +=
    '<h2>Ranking diagnóstico (IR)</h2><div class="wrap"><table><tr><th>Espécie</th><th>Di</th><th>Fi</th><th>Abi</th><th>Frr</th><th>Der</th><th>Abr</th><th>IVI</th><th>IR</th></tr>';
  c.L.forEach(function (s) {
    h +=
      '<tr><td>' +
      s.n +
      '</td><td>' +
      f(s.D, 2) +
      '</td><td>' +
      f(s.F * 100, 0) +
      '%</td><td>' +
      f(s.Ab, 1) +
      '</td><td>' +
      f(s.Frr, 1) +
      '</td><td>' +
      f(s.Der, 1) +
      '</td><td>' +
      f(s.Abr, 1) +
      '</td><td>' +
      f(s.IVI, 1) +
      '</td><td><b>' +
      f(s.IR, 2) +
      '%</b></td></tr>';
  });
  var mx =
      Math.max.apply(
        null,
        c.L.map(function (s) {
          return s.Ab;
        }),
      ) * 1.2 || 1,
    dots = '';
  c.L.forEach(function (s, i) {
    var x = 30 + s.F * 240,
      y = 170 - (s.Ab / mx) * 150;
    dots +=
      '<circle cx="' +
      x +
      '" cy="' +
      y +
      '" r="7" fill="var(--g)"/><text x="' +
      (x + 10) +
      '" y="' +
      (y + 4) +
      '" font-size="10" fill="var(--ink)">' +
      s.n +
      '</text>';
  });
  h +=
    '</table></div><div class="mut">Di plantas/m² · Fi frequência · Abi abundância · rel. = relativos · IVI 0–300 · IR = IVI/3. Ranking diagnóstico, sem prescrição de controle.</div><h2>Frequência × abundância</h2><div class="card"><svg viewBox="0 0 320 200" width="100%" role="img" aria-label="Matriz frequência por abundância"><rect x="30" y="20" width="240" height="150" fill="none" stroke="var(--line)"/><line x1="150" y1="20" x2="150" y2="170" stroke="var(--line)" stroke-dasharray="4 3"/><line x1="30" y1="95" x2="270" y2="95" stroke="var(--line)" stroke-dasharray="4 3"/>' +
    dots +
    '<text x="150" y="190" font-size="10" fill="var(--mut)" text-anchor="middle">Frequência (0–100%)</text><text x="4" y="14" font-size="10" fill="var(--mut)">Abundância</text></svg><div class="mut">Limiares alto/baixo a validar com Agronomia.</div></div>';
  h +=
    '<div class="warn">Densidade (plantas/m²) não é porcentagem de infestação do talhão.</div><button class="btn sec" onclick="toast(\'PDF exportado (simulação)\')">Exportar PDF</button>';
  r.innerHTML = h;
}
function drawMap() {
  var n = pts.length,
    cols = Math.max(1, Math.ceil(Math.sqrt(n))),
    rows = Math.ceil(n / cols) || 1,
    g = '';
  pts.forEach(function (p, i) {
    var rw = Math.floor(i / cols),
      cl = i % cols;
    if (rw % 2) cl = cols - 1 - cl;
    var x = cols > 1 ? 80 + (cl * 160) / (cols - 1) : 160,
      y = rows > 1 ? 50 + (rw * 140) / (rows - 1) : 120,
      t = p.r.reduce(function (s, r) {
        return s + r.q;
      }, 0),
      col = p.c ? 'none' : t < 5 ? '#2e9e44' : t < 10 ? '#e0b000' : '#d32f2f';
    g +=
      '<circle cx="' +
      x +
      '" cy="' +
      y +
      '" r="9" fill="' +
      col +
      '" stroke="' +
      (p.c ? '#2e9e44' : '#fff') +
      '" stroke-width="2"/><text x="' +
      x +
      '" y="' +
      (y + 3) +
      '" font-size="8" text-anchor="middle" fill="#fff">' +
      (i + 1) +
      '</text>';
  });
  $('mp').innerHTML =
    '<rect width="320" height="250" rx="10" fill="var(--g2)"/><rect x="50" y="20" width="220" height="200" fill="none" stroke="var(--g)" stroke-width="3" stroke-dasharray="6 4"/><ellipse cx="110" cy="75" rx="45" ry="28" fill="none" stroke="#d32f2f" stroke-width="2" stroke-dasharray="4 3"/><text x="62" y="36" font-size="10" fill="#b71c1c">Foco recorrente</text><text x="160" y="240" font-size="10" fill="var(--mut)" text-anchor="middle">Talhão A · 50 m × 50 m</text>' +
    g;
}
function drawRev() {
  var h =
    '<div class="card"><b>Não identificada · Ponto 7</b><div class="mut">Foto anexada · aguardando especialista</div><button class="btn sec" onclick="toast(\'Revisão registrada pelo profissional\')">Confirmar espécie</button></div><div class="card"><b>Alerta técnico ativo</b><div class="mut">Ocorrência exige confirmação por profissional (RV08)</div></div>';
  pts.forEach(function (p, i) {
    p.r.forEach(function (r) {
      if (r.nid)
        h +=
          '<div class="card"><b>Não identificada · Ponto ' +
          (i + 1) +
          '</b><div class="mut">Novo registro na fila</div></div>';
    });
  });
  $('rv').innerHTML = h;
}
function drawSync() {
  $('sst').textContent = online ? '● Conectado' : '○ Sem conexão (offline)';
  $('ssd').textContent = pend() + ' registros pendentes · 0 erros';
}
function doSync() {
  if (!online) {
    toast('Sem conexão. Os dados seguem pendentes.');
    return;
  }
  extra = 0;
  pts.forEach(function (p) {
    p.s = 1;
  });
  toast('Sincronizado.');
  pendClear();
}
function pendClear() {
  extra = 0;
  sy0 = pts.length;
  upd();
  show('sync');
}
var sy0 = 0;
pend = function () {
  return extra + pts.length - sy0;
};
show('login');

function applyTheme(t) {
  document.documentElement.setAttribute('data-theme', t);
}
function toggleTheme() {
  var t =
    document.documentElement.getAttribute('data-theme') === 'dark'
      ? 'light'
      : 'dark';
  applyTheme(t);
  try {
    localStorage.setItem('mipd-theme', t);
  } catch (e) {}
}
(function () {
  var t = null;
  try {
    t = localStorage.getItem('mipd-theme');
  } catch (e) {}
  if (!t) {
    t =
      window.matchMedia &&
      window.matchMedia('(prefers-color-scheme: dark)').matches
        ? 'dark'
        : 'light';
  }
  applyTheme(t);
})();

function toggleMenu(open) {
  var nav = $('nav');
  if (typeof open !== 'boolean') open = !nav.classList.contains('open');
  nav.classList.toggle('open', open);
  $('scrim').classList.toggle('open', open);
}
document.querySelectorAll('.nav button').forEach(function (b) {
  b.addEventListener('click', function () {
    toggleMenu(false);
  });
});

function drawNotif() {
  var n = pend(),
    items = [];
  if (n > 0) items.push(n + ' registros pendentes de sincronização');
  items.push('1 espécie aguardando revisão técnica');
  items.push(
    'Alertas de localização: sem pontos fora do talhão ou muito próximos (limites a validar)',
  );
  $('badge').textContent = items.length;
  $('notif').innerHTML =
    '<b>Pendências</b>' +
    items
      .map(function (t) {
        return '<div>' + t + '</div>';
      })
      .join('');
}
function toggleNotif(open) {
  var el = $('notif');
  if (typeof open !== 'boolean') open = !el.classList.contains('open');
  el.classList.toggle('open', open);
}
document.addEventListener('click', function (e) {
  if (!e.target.closest('#bell') && !e.target.closest('#notif'))
    toggleNotif(false);
});
