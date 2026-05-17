// ============================================================
//  CIPHER TERMINAL — CORE LOGIC (OpenRouter version)
// ============================================================

document.getElementById('sessionId').textContent = generateSessionId();

function generateSessionId() {
  return 'CIP-' + Math.random().toString(36).substring(2, 7).toUpperCase() + '-' + Date.now().toString(36).toUpperCase().slice(-4);
}

var LOADING_STEPS = [
  "Parsing anomaly vectors...",
  "Cross-referencing surveillance archives...",
  "Evaluating temporal inconsistencies...",
  "Triangulating subject network topology...",
  "Scanning for concealed correlations...",
  "Calculating civilian awareness risk...",
  "Decrypting shadow organisation links...",
  "Applying pattern recognition matrix...",
  "Compiling classified intelligence report...",
  "Encrypting transmission for delivery...",
];

async function initiateInvestigation() {
  var a = document.getElementById('subjectA').value.trim();
  var b = document.getElementById('subjectB').value.trim();
  var c = document.getElementById('subjectC').value.trim();

  if (!a || !b || !c) { shakeInputs(); return; }

  setUIState('loading');
  runLoadingSequence();

  try {
    var rawText = await callAPI(a, b, c);
    var parsed  = parseResponse(rawText, a, b, c);
    renderResults(parsed, a, b, c);
    setUIState('results');
  } catch (err) {
    console.error('CIPHER ERROR:', err);
    setUIState('error', err.message || 'Unknown transmission failure.');
  }
}

function resetTerminal() {
  document.getElementById('subjectA').value = '';
  document.getElementById('subjectB').value = '';
  document.getElementById('subjectC').value = '';
  document.getElementById('sessionId').textContent = generateSessionId();
  document.getElementById('resetBtn').style.display  = 'none';
  document.getElementById('initiateBtn').disabled    = false;
  setUIState('idle');
}

function setUIState(state, errorMsg) {
  document.getElementById('idleState').style.display    = 'none';
  document.getElementById('loadingState').style.display = 'none';
  document.getElementById('resultsState').style.display = 'none';
  document.getElementById('errorState').style.display   = 'none';

  var initiateBtn = document.getElementById('initiateBtn');
  var resetBtn    = document.getElementById('resetBtn');
  var badge       = document.querySelector('.panel-badge');

  if (state === 'idle') {
    document.getElementById('idleState').style.display = 'flex';
    initiateBtn.style.display = 'flex';
    initiateBtn.disabled = false;
    resetBtn.style.display = 'none';
    badge.textContent = 'AWAITING SUBJECTS';
    badge.style.color = 'var(--amber)';
    badge.style.borderColor = 'var(--amber)';
  } else if (state === 'loading') {
    document.getElementById('loadingState').style.display = 'flex';
    initiateBtn.disabled = true;
    resetBtn.style.display = 'none';
    badge.textContent = 'ANALYSING';
    badge.style.color = 'var(--glow)';
    badge.style.borderColor = 'var(--glow)';
  } else if (state === 'results') {
    document.getElementById('resultsState').style.display = 'flex';
    initiateBtn.style.display = 'none';
    resetBtn.style.display = 'block';
    badge.textContent = 'REPORT READY';
    badge.style.color = 'var(--glow)';
    badge.style.borderColor = 'var(--glow)';
  } else if (state === 'error') {
    document.getElementById('errorState').style.display = 'flex';
    document.getElementById('errorMsg').textContent = errorMsg || 'Transmission failure.';
    initiateBtn.disabled = false;
    initiateBtn.style.display = 'flex';
    resetBtn.style.display = 'none';
    badge.textContent = 'TRANSMISSION FAILED';
    badge.style.color = 'var(--red-alert)';
    badge.style.borderColor = 'var(--red-alert)';
  }
}

function runLoadingSequence() {
  var container = document.getElementById('loadingSteps');
  var bar       = document.getElementById('loadingBar');
  container.innerHTML = '';
  bar.style.width = '0%';

  var steps = LOADING_STEPS.slice().sort(function() { return Math.random() - 0.5; }).slice(0, 6);
  var i = 0;

  var interval = setInterval(function() {
    if (i >= steps.length) { clearInterval(interval); return; }
    var prev = container.querySelector('.loading-step:last-child');
    if (prev) {
      prev.classList.add('done');
      prev.querySelector('.step-icon').textContent = '✓';
    }
    var step = document.createElement('div');
    step.className = 'loading-step';
    step.style.animationDelay = '0s';
    step.innerHTML = '<span class="step-icon">›</span><span>' + steps[i] + '</span>';
    container.appendChild(step);
    bar.style.width = Math.round(((i + 1) / steps.length) * 85) + '%';
    i++;
  }, 1100);
}

async function callAPI(a, b, c) {
  var prompt = buildPrompt(a, b, c);

  var response = await fetch(CONFIG.API_URL, {
    method: 'POST',
    headers: {
      'Authorization': 'Bearer ' + CONFIG.API_KEY,
      'Content-Type': 'application/json',
      'HTTP-Referer': window.location.href,
      'X-Title': 'CIPHER Terminal',
    },
    body: JSON.stringify({
      model: CONFIG.MODEL,
      max_tokens: CONFIG.MAX_TOKENS,
      messages: [{ role: 'user', content: prompt }],
    }),
  });

  if (response.status === 429) throw new Error('Rate limit reached. Wait a moment and retry.');
  if (!response.ok) {
    var errText = await response.text();
    throw new Error('API error ' + response.status + ': ' + errText.slice(0, 200));
  }

  var data = await response.json();

  if (data.choices && data.choices[0] && data.choices[0].message && data.choices[0].message.content) {
    return data.choices[0].message.content;
  }

  throw new Error('Unexpected response from model. Raw: ' + JSON.stringify(data).slice(0, 200));
}

function buildPrompt(a, b, c) {
  return 'You are a highly classified intelligence analysis system. Generate a fictional, absurd but dead-serious conspiracy theory connecting these three subjects: "' + a + '", "' + b + '", and "' + c + '".\n\nRespond ONLY in this exact format, nothing else before or after:\n\nOPERATION_TITLE: [Dramatic codename starting with "Operation"]\nEXECUTIVE_SUMMARY: [2-3 sentences connecting all three subjects in formal intelligence language]\nTHREAT_CLASSIFICATION: [ONE of: ULTRAVIOLET / CRITICAL / SEVERE / HIGH / MODERATE]\nCONFIDENCE_SCORE: [number between 67 and 99]\nTIMELINE:\n- [YEAR]: [suspicious event]\n- [YEAR]: [suspicious event]\n- [YEAR]: [suspicious event]\n- [YEAR]: [suspicious event]\nEVIDENCE_POINTS:\n- [absurd formal evidence]\n- [absurd formal evidence]\n- [absurd formal evidence]\n- [absurd formal evidence]\nCONTAINMENT_ACTION: [ridiculous but formal recommendation]\nFINAL_VERDICT: [grave formal conclusion about global implications]';
}

function parseResponse(text, a, b, c) {
  function get(key) {
    var regex = new RegExp(key + ':\\s*([\\s\\S]+?)(?=\\n[A-Z_]+:|$)');
    var match = text.match(regex);
    return match ? match[1].trim() : null;
  }
  function getList(key) {
    var regex = new RegExp(key + ':\\s*\\n((?:\\s*-\\s*.+\\n?)+)', 'i');
    var match = text.match(regex);
    if (!match) return [];
    return match[1].split('\n')
      .map(function(l) { return l.replace(/^\s*-\s*/, '').trim(); })
      .filter(function(l) { return l.length > 5; });
  }

  var title       = get('OPERATION_TITLE')       || generateFallbackTitle(a, b, c);
  var summary     = get('EXECUTIVE_SUMMARY')     || 'Deep-state analysis confirms anomalous convergence between ' + a + ', ' + b + ', and ' + c + '. Pattern exceeds coincidence thresholds by factor 7.3.';
  var threat      = get('THREAT_CLASSIFICATION') || 'SEVERE';
  var confRaw     = get('CONFIDENCE_SCORE')      || '81';
  var confidence  = confRaw.replace(/[^0-9]/g, '').slice(0, 3) || '81';
  var timeline    = getList('TIMELINE').length        ? getList('TIMELINE')        : generateFallbackTimeline(a, b, c);
  var evidence    = getList('EVIDENCE_POINTS').length ? getList('EVIDENCE_POINTS') : generateFallbackEvidence(a, b, c);
  var containment = get('CONTAINMENT_ACTION')    || 'Immediate surveillance of all known ' + a + ' entities is advised.';
  var verdict     = get('FINAL_VERDICT')         || 'The convergence of ' + a + ', ' + b + ', and ' + c + ' represents a systemic threat to global stability.';

  return { title: title, summary: summary, threat: threat, confidence: confidence, timeline: timeline, evidence: evidence, containment: containment, verdict: verdict };
}

function generateFallbackTitle(a, b, c) {
  return 'Operation ' + a.charAt(0).toUpperCase() + a.slice(1).toLowerCase() + ' ' + b.charAt(0).toUpperCase() + b.slice(1).toLowerCase() + ' Protocol';
}
function generateFallbackTimeline(a, b, c) {
  var y = new Date().getFullYear();
  return [
    (y-12) + ': First documented interaction between ' + a + ' and ' + b + ' operatives.',
    (y-7)  + ': Anomalous ' + c + ' activity recorded across 47 jurisdictions.',
    (y-3)  + ': Internal memo referencing all three subjects leaked to a single analyst.',
    (y-1)  + ': Pattern recognition flags convergence as non-coincidental.',
  ];
}
function generateFallbackEvidence(a, b, c) {
  return [
    'Satellite imagery confirms ' + a + ' presence within 200m of every major ' + b + ' facility.',
    'Linguistic analysis of ' + c + '-related documents reveals embedded coordination signals.',
    'Financial forensics link ' + a + ' procurement cycles to ' + b + ' operational windows.',
    'Declassified SIGINT references ' + c + ' in 94% of ' + a + '-' + b + ' crossover events.',
  ];
}

function renderResults(data, a, b, c) {
  document.getElementById('opTitle').textContent          = data.title;
  document.getElementById('threatLevel').textContent      = 'THREAT: ' + data.threat;
  document.getElementById('confidenceScore').textContent  = 'CONFIDENCE: ' + data.confidence + '%';
  document.getElementById('caseNumber').textContent       = 'CASE: ' + generateSessionId();

  setTimeout(function() { document.getElementById('opTitle').classList.add('glitch-text'); }, 100);

  drawEvidenceBoard(a, b, c);

  var container = document.getElementById('reportSections');
  container.innerHTML = '';

  var sections = [
    { icon: '◈', title: 'EXECUTIVE SUMMARY',          delay: 0,   html: '<p>' + data.summary + '</p>' },
    { icon: '◉', title: 'THREAT TIMELINE',            delay: 100, html: data.timeline.map(function(item) {
        var ci = item.indexOf(':');
        if (ci > 0 && ci < 25) return '<div class="timeline-item"><span class="timeline-date">' + item.slice(0,ci).trim() + '</span><span>' + item.slice(ci+1).trim() + '</span></div>';
        return '<div class="timeline-item"><span class="timeline-date">UNDATED</span><span>' + item + '</span></div>';
      }).join('') },
    { icon: '◆', title: 'KEY EVIDENCE POINTS',        delay: 200, html: data.evidence.map(function(e) { return '<div class="evidence-item"><span class="evidence-bullet">▸</span><span>' + e + '</span></div>'; }).join('') },
    { icon: '⊕', title: 'CONTAINMENT DIRECTIVE',      delay: 300, html: '<p>' + data.containment + '</p>' },
    { icon: '★', title: 'FINAL INTELLIGENCE VERDICT', delay: 400, html: '<div class="verdict-box">' + data.verdict + '</div>' },
  ];

  sections.forEach(function(s) {
    var el = document.createElement('div');
    el.className = 'report-section';
    el.style.animationDelay = s.delay + 'ms';
    el.innerHTML = '<div class="section-head"><span class="section-icon">' + s.icon + '</span><span class="section-title">' + s.title + '</span></div><div class="section-body">' + s.html + '</div>';
    container.appendChild(el);
  });

  document.getElementById('loadingBar').style.width = '100%';
}

function drawEvidenceBoard(a, b, c) {
  var canvas = document.getElementById('evidenceBoard');
  var ctx    = canvas.getContext('2d');
  var W = canvas.parentElement.offsetWidth - 28;
  var H = Math.max(180, Math.round(W * 0.38));
  canvas.width = W; canvas.height = H;

  ctx.fillStyle = '#080b0f';
  ctx.fillRect(0, 0, W, H);
  ctx.strokeStyle = 'rgba(0,255,136,0.05)';
  ctx.lineWidth = 1;
  for (var x = 0; x < W; x += 30) { ctx.beginPath(); ctx.moveTo(x,0); ctx.lineTo(x,H); ctx.stroke(); }
  for (var y = 0; y < H; y += 30) { ctx.beginPath(); ctx.moveTo(0,y); ctx.lineTo(W,y); ctx.stroke(); }

  var subjects = [a.toUpperCase(), b.toUpperCase(), c.toUpperCase()];
  var cx = W/2, cy = H/2, r = Math.min(W,H)*0.32;
  var nodes = [{ x:cx, y:cy-r*0.9 }, { x:cx-r*0.85, y:cy+r*0.55 }, { x:cx+r*0.85, y:cy+r*0.55 }];
  var colours = ['#00ff88','#00e5ff','#ffb300'];
  var nr = Math.max(28, Math.min(38, W*0.055));

  for (var i = 0; i < 3; i++) {
    for (var j = i+1; j < 3; j++) {
      ctx.setLineDash([5,6]); ctx.strokeStyle='rgba(0,255,136,0.2)'; ctx.lineWidth=1.5;
      ctx.beginPath(); ctx.moveTo(nodes[i].x,nodes[i].y); ctx.lineTo(nodes[j].x,nodes[j].y); ctx.stroke();
      ctx.setLineDash([]);
      var mx=(nodes[i].x+nodes[j].x)/2, my=(nodes[i].y+nodes[j].y)/2;
      ctx.fillStyle='rgba(0,255,136,0.5)'; ctx.beginPath(); ctx.arc(mx,my,3,0,Math.PI*2); ctx.fill();
      ctx.fillStyle='rgba(0,229,255,0.55)'; ctx.font=Math.max(8,nr*0.28)+"px 'Share Tech Mono',monospace"; ctx.textAlign='center';
      ctx.fillText('LINKED',mx,my-7);
    }
  }

  nodes.forEach(function(pos, i) {
    ctx.shadowColor=colours[i]; ctx.shadowBlur=16;
    ctx.beginPath(); ctx.arc(pos.x,pos.y,nr,0,Math.PI*2); ctx.fillStyle='#0d1219'; ctx.fill();
    ctx.strokeStyle=colours[i]; ctx.lineWidth=2; ctx.stroke();
    ctx.beginPath(); ctx.arc(pos.x,pos.y,nr*0.55,0,Math.PI*2); ctx.fillStyle=colours[i]+'22'; ctx.fill();
    ctx.shadowBlur=0;
    var fs=Math.max(9,Math.min(13,nr*0.38));
    ctx.font='bold '+fs+"px 'Orbitron',monospace"; ctx.textAlign='center';
    var tw=ctx.measureText(subjects[i]).width, ly=pos.y+nr+16;
    ctx.fillStyle='rgba(8,11,15,0.85)'; ctx.fillRect(pos.x-tw/2-5,ly-fs,tw+10,fs+6);
    ctx.fillStyle=colours[i]; ctx.fillText(subjects[i],pos.x,ly);
    ctx.font=Math.max(8,nr*0.3)+"px 'Share Tech Mono',monospace";
    ctx.fillStyle=colours[i]+'bb'; ctx.fillText(['α','β','γ'][i],pos.x,pos.y+4);
  });

  ctx.font='bold '+Math.max(7,W*0.012)+"px 'Orbitron',monospace"; ctx.textAlign='center';
  ctx.fillStyle='rgba(0,255,136,0.25)'; ctx.fillText('CLASSIFIED NEXUS',cx,cy+8);
}

function shakeInputs() {
  ['subjectA','subjectB','subjectC'].forEach(function(id) {
    var el = document.getElementById(id);
    if (!el.value.trim()) {
      el.style.borderColor='var(--red-alert)'; el.style.boxShadow='0 0 10px rgba(255,59,59,0.35)';
      setTimeout(function() { el.style.borderColor=''; el.style.boxShadow=''; }, 1800);
    }
  });
}

document.addEventListener('keydown', function(e) {
  if (e.key === 'Enter') {
    var btn = document.getElementById('initiateBtn');
    if (btn && !btn.disabled && btn.style.display !== 'none') initiateInvestigation();
  }
});

var resizeTimer;
window.addEventListener('resize', function() {
  clearTimeout(resizeTimer);
  resizeTimer = setTimeout(function() {
    var a=document.getElementById('subjectA').value.trim();
    var b=document.getElementById('subjectB').value.trim();
    var c=document.getElementById('subjectC').value.trim();
    if (a && b && c && document.getElementById('resultsState').style.display !== 'none') drawEvidenceBoard(a,b,c);
  }, 200);
});