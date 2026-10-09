/* Edward S. Vidal | BSIT portfolio: main script.
   Features: dark/light theme, typing title, scroll effects, network background, skill filter,
   contact form, subnet calculator, certificate gallery, interview and checklist helpers,
   3D globe, card tilt and the 3D skills cube. Needs Bootstrap loaded first.
   Written with AI assistance; see the AI usage log on the website. */
document.getElementById('yr').textContent = new Date().getFullYear();

var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

// Dark / light theme (remembered)
var root = document.documentElement, tb = document.getElementById('themeBtn');
function setTheme(t){
  root.setAttribute('data-theme', t);
  tb.textContent = t === 'dark' ? 'Light' : 'Dark';
  try { localStorage.setItem('theme', t); } catch(e) {}
}
var saved = null;
try { saved = localStorage.getItem('theme'); } catch(e) {}
setTheme(saved || 'dark');
tb.addEventListener('click', function(){ setTheme(root.getAttribute('data-theme') === 'dark' ? 'light' : 'dark'); });

// Typing effect in hero
var roles = ['Network configuration', 'SQL and data analysis', 'Technical troubleshooting', 'Help desk support'];
var ty = document.getElementById('typing'), ri = 0, ci = 0, del = false;
function type(){
  var w = roles[ri];
  if(!del && ci === w.length){ del = true; return setTimeout(type, 1400); }
  ci += del ? -1 : 1;
  if(del && ci < 1){ del = false; ri = (ri + 1) % roles.length; w = roles[ri]; ci = 1; }  // never show an empty title
  ty.textContent = w.slice(0, ci);
  setTimeout(type, del ? 35 : 75);
}
if(reduce){ ty.textContent = roles.join(' · '); } else { type(); }

// Scroll progress bar, navbar shadow, back-to-top
var bar = document.getElementById('bar'), topBtn = document.getElementById('top'), nav = document.querySelector('.navbar');
window.addEventListener('scroll', function(){
  var h = document.documentElement.scrollHeight - innerHeight;
  bar.style.width = (h > 0 ? scrollY / h * 100 : 0) + '%';
  nav.classList.toggle('scrolled', scrollY > 20);
  topBtn.classList.toggle('show', scrollY > 500);
}, {passive:true});
topBtn.addEventListener('click', function(){ scrollTo({top:0, behavior: reduce ? 'auto' : 'smooth'}); });

// Highlight current section in the menu
var links = document.querySelectorAll('.navbar .nav-link');
var secObs = new IntersectionObserver(function(es){
  es.forEach(function(e){
    if(e.isIntersecting){
      links.forEach(function(l){ l.classList.toggle('active', l.getAttribute('href') === '#' + e.target.id); });
    }
  });
}, {rootMargin:'-45% 0px -50% 0px'});
document.querySelectorAll('section').forEach(function(s){ secObs.observe(s); });

// Skill level meters
var pct = {Beginner:40, Intermediate:70, Advanced:90};
document.querySelectorAll('#skillTable .lvl').forEach(function(td){
  var m = document.createElement('div'); m.className = 'meter';
  m.innerHTML = '<i data-w="' + (pct[td.textContent.trim()] || 40) + '"></i>';
  td.appendChild(m);
});

// Background: drifting network nodes that link up and react to the mouse
(function(){
  var cv = document.getElementById('bg'), cx = cv.getContext('2d');
  var W, H, nodes = [], mouse = {x:-999, y:-999}, pk = [];
  function size(){
    var d = devicePixelRatio || 1;
    W = innerWidth; H = innerHeight;
    cv.width = W * d; cv.height = H * d;
    cx.setTransform(d, 0, 0, d, 0, 0);
    var n = Math.min(80, Math.floor(W * H / 18000));
    nodes = [];
    for(var i = 0; i < n; i++) nodes.push({x:Math.random()*W, y:Math.random()*H, vx:(Math.random()-.5)*.35, vy:(Math.random()-.5)*.35});
  }
  function frame(){
    var dark = root.getAttribute('data-theme') === 'dark';
    var rgb = dark ? '255,140,50' : '242,98,0';
    cx.clearRect(0, 0, W, H);
    nodes.forEach(function(a){
      a.x += a.vx; a.y += a.vy;
      if(a.x < 0 || a.x > W) a.vx *= -1;
      if(a.y < 0 || a.y > H) a.vy *= -1;
    });
    for(var i = 0; i < nodes.length; i++){
      var a = nodes[i];
      cx.fillStyle = 'rgba(' + rgb + ',.45)';
      cx.beginPath(); cx.arc(a.x, a.y, 2.2, 0, 6.3); cx.fill();
      for(var j = i + 1; j < nodes.length; j++){
        var b = nodes[j], dx = a.x - b.x, dy = a.y - b.y, d = Math.sqrt(dx*dx + dy*dy);
        if(d < 140){
          cx.strokeStyle = 'rgba(' + rgb + ',' + (.22 * (1 - d/140)) + ')';
          cx.beginPath(); cx.moveTo(a.x, a.y); cx.lineTo(b.x, b.y); cx.stroke();
          if(!reduce && pk.length < 6 && Math.random() < .0004) pk.push({a:a, b:b, t:0});
        }
      }
      var mx = a.x - mouse.x, my = a.y - mouse.y, md = Math.sqrt(mx*mx + my*my);
      if(md < 170){
        cx.strokeStyle = 'rgba(232,163,61,' + (.5 * (1 - md/170)) + ')';
        cx.beginPath(); cx.moveTo(a.x, a.y); cx.lineTo(mouse.x, mouse.y); cx.stroke();
      }
    }
    // amber "data packets" travelling between linked nodes
    pk = pk.filter(function(p){ return p.t < 1; });
    pk.forEach(function(p){
      p.t += .02;
      cx.fillStyle = 'rgba(232,163,61,.9)';
      cx.beginPath(); cx.arc(p.a.x + (p.b.x - p.a.x) * p.t, p.a.y + (p.b.y - p.a.y) * p.t, 3, 0, 6.3); cx.fill();
    });
    if(!reduce) requestAnimationFrame(frame);
  }
  addEventListener('resize', function(){ size(); if(reduce) frame(); });
  addEventListener('mousemove', function(e){ mouse.x = e.clientX; mouse.y = e.clientY; }, {passive:true});
  size(); frame();
})();

// Subnet calculator
(function(){
  var ip = document.getElementById('sip'), pf = document.getElementById('spf'),
      pv = document.getElementById('spv'), er = document.getElementById('serr'), out = document.getElementById('sres');
  function toN(t){
    var p = t.trim().split('.'); if(p.length !== 4) return null;
    var n = 0;
    for(var i = 0; i < 4; i++){ if(!/^\d{1,3}$/.test(p[i]) || +p[i] > 255) return null; n = n * 256 + +p[i]; }
    return n;
  }
  function toS(n){ return [n >>> 24, (n >>> 16) & 255, (n >>> 8) & 255, n & 255].join('.'); }
  function run(){
    var p = +pf.value; pv.textContent = '/' + p;
    var n = toN(ip.value);
    if(n === null){ er.textContent = 'Enter a valid IPv4 address, for example 192.168.1.10.'; out.innerHTML = ''; return; }
    er.textContent = '';
    var mask = p === 0 ? 0 : (0xFFFFFFFF << (32 - p)) >>> 0;
    var net = (n & mask) >>> 0, wild = (~mask) >>> 0, bc = (net | wild) >>> 0;
    var hosts = p >= 31 ? (p === 31 ? 2 : 1) : Math.pow(2, 32 - p) - 2;
    var first = p >= 31 ? net : net + 1, last = p >= 31 ? bc : bc - 1;
    var o = [n >>> 24, (n >>> 16) & 255];
    var priv = o[0] === 10 || (o[0] === 172 && o[1] >= 16 && o[1] <= 31) || (o[0] === 192 && o[1] === 168);
    var rows = [['Subnet mask', toS(mask)], ['Wildcard mask', toS(wild)], ['Network address', toS(net)],
      ['Broadcast address', toS(bc)], ['First usable host', toS(first)], ['Last usable host', toS(last)],
      ['Usable hosts', hosts.toLocaleString()], ['Address type', priv ? 'Private (RFC 1918)' : 'Public or special-use']];
    out.innerHTML = rows.map(function(r){ return '<tr><td>' + r[0] + '</td><td>' + r[1] + '</td></tr>'; }).join('');
  }
  ip.addEventListener('input', run); pf.addEventListener('input', run); run();
})();

// Copy email with confirmation toast
(function(){
  var b = document.getElementById('copyMail'), t = document.getElementById('toast');
  function say(m){ t.textContent = m; t.classList.add('show'); setTimeout(function(){ t.classList.remove('show'); }, 2200); }
  b.addEventListener('click', function(){
    var addr = b.previousElementSibling.textContent;
    if(navigator.clipboard){
      navigator.clipboard.writeText(addr).then(function(){ say('Email copied'); }, function(){ say('Copy failed. Select the email and copy it manually.'); });
    } else { say('Copy is not available here. Select the email and copy it manually.'); }
  });
})();

// Certificate gallery: viewer, replace, delete, add (changes are saved in this browser)
(function(){
  var grid = document.getElementById('gallery'), addCard = document.getElementById('certAddCard'),
      inp = document.getElementById('certIn'), rep = document.getElementById('certRep'), restore = document.getElementById('certRestore'),
      msg = document.getElementById('certMsg'), mi = document.getElementById('certImg'), mt = document.getElementById('certTitle'),
      mc = document.getElementById('certCount'), prev = document.getElementById('certPrev'), next = document.getElementById('certNext'),
      modalEl = document.getElementById('certModal'), modal = new bootstrap.Modal(modalEl), cur = 0, target = null;
  var KEY = 'certState', st = {removed:[], images:{}, added:[]};
  try { var raw = localStorage.getItem(KEY); if(raw) st = JSON.parse(raw); } catch(e) {}
  st.removed = st.removed || []; st.images = st.images || {}; st.added = st.added || [];
  var IR = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 4V1L8 5l4 4V6c3.31 0 6 2.69 6 6 0 1.01-.25 1.97-.7 2.8l1.46 1.46C19.54 15.03 20 13.57 20 12c0-4.42-3.58-8-8-8zm0 14c-3.31 0-6-2.69-6-6 0-1.01.25-1.97.7-2.8L5.24 7.74C4.46 8.97 4 10.43 4 12c0 4.42 3.58 8 8 8v3l4-4-4-4v3z"/></svg>';
  var ID = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M9 3h6l1 2h4v2H4V5h4l1-2zM6 9h12l-1 12H7L6 9z"/></svg>';
  function note(t, err){ msg.className = 'small mb-4 ' + (err ? 'text-danger' : 'text-muted'); msg.textContent = t; }
  function save(){
    try { localStorage.setItem(KEY, JSON.stringify(st)); return true; }
    catch(e) { note('This browser could not store the change, so it will be lost when you reload.', true); return false; }
  }
  function actions(f){
    var d = document.createElement('div'); d.className = 'cert-actions';
    d.innerHTML = '<button type="button" class="cert-act" data-act="replace" aria-label="Replace certificate image" title="Replace image">' + IR + '</button>' +
                  '<button type="button" class="cert-act" data-act="delete" aria-label="Delete certificate" title="Delete">' + ID + '</button>';
    f.appendChild(d);
  }
  function build(id, title, src){
    var f = document.createElement('figure'); f.className = 'cert'; f.dataset.id = id; f.dataset.title = title;
    var b = document.createElement('button'); b.type = 'button'; b.className = 'cert-btn'; b.setAttribute('aria-label', 'View ' + title);
    var im = document.createElement('img'); im.src = src; im.alt = title; b.appendChild(im);
    var c = document.createElement('figcaption'); c.textContent = title;
    f.appendChild(b); f.appendChild(c); actions(f); return f;
  }
  function syncRestore(){ restore.hidden = !st.removed.length; }
  function ok(file){
    if(!/^image\//.test(file.type)){ note(file.name + ' is not an image. Use JPG, PNG or WebP.', true); return false; }
    if(file.size > 8 * 1024 * 1024){ note(file.name + ' is over 8 MB. Choose a smaller image.', true); return false; }
    return true;
  }
  function shrink(file, cb){
    var r = new FileReader();
    r.onload = function(){
      var im = new Image();
      im.onload = function(){
        var k = Math.min(1, 1600 / Math.max(im.width, im.height)), c = document.createElement('canvas');
        c.width = Math.round(im.width * k); c.height = Math.round(im.height * k);
        c.getContext('2d').drawImage(im, 0, 0, c.width, c.height);
        cb(c.toDataURL('image/jpeg', .85));
      };
      im.onerror = function(){ note('That file could not be read as an image.', true); };
      im.src = r.result;
    };
    r.readAsDataURL(file);
  }
  function items(){ return Array.prototype.slice.call(grid.querySelectorAll('.cert:not(.missing):not(.add-cert):not([hidden])')); }
  function show(i){
    var it = items(); if(!it.length) return;
    cur = (i + it.length) % it.length;
    var f = it[cur];
    mi.src = f.querySelector('img').src; mi.alt = f.dataset.title; mt.textContent = f.dataset.title;
    mc.textContent = (cur + 1) + ' of ' + it.length;
    prev.style.visibility = next.style.visibility = it.length > 1 ? 'visible' : 'hidden';
  }

  // Start-up: add buttons to the built-in card, apply saved changes, rebuild added cards
  grid.querySelectorAll('.cert[data-static]').forEach(function(f){
    actions(f);
    if(st.removed.indexOf(f.dataset.id) > -1) f.hidden = true;
    if(st.images[f.dataset.id]){ f.classList.remove('missing'); f.querySelector('img').src = st.images[f.dataset.id]; }
  });
  st.added.forEach(function(a){ grid.insertBefore(build(a.id, a.title, a.data), addCard); });
  syncRestore();

  function del(btn, f){
    if(!btn.classList.contains('confirm')){
      btn.dataset.h = btn.innerHTML; btn.classList.add('confirm'); btn.textContent = 'Click again to delete';
      clearTimeout(btn._t);
      btn._t = setTimeout(function(){ btn.classList.remove('confirm'); btn.innerHTML = btn.dataset.h; }, 3000);
      return;
    }
    clearTimeout(btn._t);
    if(f.hasAttribute('data-static')){ st.removed.push(f.dataset.id); f.hidden = true; }
    else { st.added = st.added.filter(function(a){ return a.id !== f.dataset.id; }); f.remove(); }
    syncRestore();
    if(save()) note('Certificate deleted in this browser. To remove it for visitors, delete the image file and its block in index.html on GitHub.');
  }

  grid.addEventListener('click', function(e){
    var a = e.target.closest('.cert-act');
    if(a){
      var f = a.closest('.cert');
      if(a.dataset.act === 'replace'){ target = f; rep.click(); } else { del(a, f); }
      return;
    }
    var b = e.target.closest('.cert-btn'); if(!b) return;
    var c = b.closest('.cert');
    if(c.classList.contains('add-cert')){ inp.click(); return; }
    if(c.classList.contains('missing')) return;
    show(items().indexOf(c)); modal.show();
  });
  rep.addEventListener('change', function(){
    var file = rep.files[0], f = target; rep.value = '';
    if(!file || !f || !ok(file)) return;
    shrink(file, function(url){
      f.classList.remove('missing'); f.querySelector('img').src = url;
      if(f.hasAttribute('data-static')) st.images[f.dataset.id] = url;
      else st.added.forEach(function(a){ if(a.id === f.dataset.id) a.data = url; });
      if(save()) note('Certificate replaced in this browser. To show it to everyone, save the new image over the old file in your folder.');
    });
  });
  inp.addEventListener('change', function(){
    Array.prototype.forEach.call(inp.files, function(file){
      if(!ok(file)) return;
      shrink(file, function(url){
        var name = file.name.replace(/\.[^.]+$/, ''), id = 'c' + Date.now() + Math.floor(Math.random() * 1000);
        st.added.push({id:id, title:name, data:url});
        grid.insertBefore(build(id, name, url), addCard);
        if(save()) note('Certificate added in this browser. To publish it, save the image in your folder and copy the Webinar block in index.html.');
      });
    });
    inp.value = '';
  });
  restore.addEventListener('click', function(){
    st.removed = [];
    grid.querySelectorAll('.cert[data-static]').forEach(function(f){ f.hidden = false; });
    syncRestore();
    if(save()) note('Deleted certificates restored.');
  });
  prev.addEventListener('click', function(){ show(cur - 1); });
  next.addEventListener('click', function(){ show(cur + 1); });
  modalEl.addEventListener('keydown', function(e){
    if(e.key === 'ArrowLeft') show(cur - 1);
    if(e.key === 'ArrowRight') show(cur + 1);
  });
})();

// Resume card: show the headshot from the hero photo
(function(){
  var p = document.getElementById('pic'), r = document.getElementById('rpic');
  if(p && r) r.src = p.src;
})();

// Checklist progress
(function(){
  var all = document.querySelectorAll('#checklist .chk'), done = document.querySelectorAll('#checklist .chk.done');
  document.getElementById('ckCount').textContent = done.length + ' of ' + all.length + ' complete';
  document.getElementById('ckBar').style.width = Math.round(done.length / all.length * 100) + '%';
})();

// 3D network globe behind the hero photo
(function(){
  var ring = document.querySelector('.hero .ring'); if(!ring) return;
  var cv = document.createElement('canvas'); cv.className = 'globe'; cv.setAttribute('aria-hidden', 'true');
  ring.insertBefore(cv, ring.firstChild);
  var cx = cv.getContext('2d'), S = 0, R = 0, N = 84, pts = [], ay = 0, ax = .35, tx = .35, mxo = 0, live = true, t = 0;
  for(var i = 0; i < N; i++){ var y = 1 - 2 * (i + .5) / N, r = Math.sqrt(1 - y * y), th = i * 2.39996323; pts.push([Math.cos(th) * r, y, Math.sin(th) * r]); }
  function size(){ var d = devicePixelRatio || 1; S = cv.clientWidth || 400; cv.width = cv.height = S * d; cx.setTransform(d, 0, 0, d, 0, 0); R = S * .3; }
  function rot(p){
    var x = p[0] * Math.cos(ay) + p[2] * Math.sin(ay), z = -p[0] * Math.sin(ay) + p[2] * Math.cos(ay);
    var y = p[1] * Math.cos(ax) - z * Math.sin(ax); z = p[1] * Math.sin(ax) + z * Math.cos(ax);
    return [x, y, z];
  }
  function proj(q){ var f = 1.6 / (1.6 - .5 * q[2]); return {x: S / 2 + q[0] * R * f, y: S / 2 + q[1] * R * f, d: (q[2] + 1) / 2}; }
  function circle(fn, a){
    cx.beginPath();
    for(var k = 0; k <= 64; k++){ var u = k / 64 * 6.2832, p = proj(rot(fn(u))); k ? cx.lineTo(p.x, p.y) : cx.moveTo(p.x, p.y); }
    cx.strokeStyle = 'rgba(255,138,31,' + a + ')'; cx.lineWidth = 1; cx.stroke();
  }
  function draw(){
    cx.clearRect(0, 0, S, S);
    circle(function(u){ return [Math.cos(u), 0, Math.sin(u)]; }, .28);
    circle(function(u){ return [Math.cos(u), Math.sin(u), 0]; }, .16);
    circle(function(u){ return [0, Math.cos(u), Math.sin(u)]; }, .16);
    var P = pts.map(function(p){ return proj(rot(p)); });
    for(var i = 0; i < N; i++){
      for(var j = i + 1; j < N; j++){
        var a = pts[i], b = pts[j], dx = a[0] - b[0], dy = a[1] - b[1], dz = a[2] - b[2];
        if(dx * dx + dy * dy + dz * dz < .42){
          var dd = (P[i].d + P[j].d) / 2;
          cx.strokeStyle = 'rgba(255,138,31,' + (.08 + .4 * dd) + ')'; cx.lineWidth = .8;
          cx.beginPath(); cx.moveTo(P[i].x, P[i].y); cx.lineTo(P[j].x, P[j].y); cx.stroke();
        }
      }
    }
    for(i = 0; i < N; i++){
      cx.fillStyle = 'rgba(255,' + (150 + Math.round(P[i].d * 70)) + ',70,' + (.35 + .6 * P[i].d) + ')';
      cx.beginPath(); cx.arc(P[i].x, P[i].y, 1.2 + 2 * P[i].d, 0, 6.2832); cx.fill();
    }
    var pp = proj(rot([Math.cos(t), 0, Math.sin(t)]));
    cx.fillStyle = '#ffd08a'; cx.shadowColor = '#ff7200'; cx.shadowBlur = 14;
    cx.beginPath(); cx.arc(pp.x, pp.y, 3.6, 0, 6.2832); cx.fill(); cx.shadowBlur = 0;
  }
  function loop(){
    if(live){ ay += .0035 + mxo * .01; ax += (tx - ax) * .05; t += .03; draw(); }
    requestAnimationFrame(loop);
  }
  size(); draw();
  addEventListener('resize', function(){ size(); if(reduce) draw(); });
  if(reduce) return;
  addEventListener('mousemove', function(e){ mxo = e.clientX / innerWidth - .5; tx = .35 + (e.clientY / innerHeight - .5) * .5; }, {passive:true});
  new IntersectionObserver(function(es){ live = es[0].isIntersecting; }).observe(ring);
  loop();
})();

// 3D tilt on cards, hero photo parallax, magnetic Hire me button (mouse devices only)
(function(){
  if(reduce || !matchMedia('(hover:hover)').matches) return;
  document.querySelectorAll('.panel,.cert:not(.add-cert)').forEach(function(el){
    if(el.querySelector('pre,table')) return;
    el.classList.add('tiltable');
    el.addEventListener('mousemove', function(e){
      var r = el.getBoundingClientRect(), x = (e.clientX - r.left) / r.width, y = (e.clientY - r.top) / r.height;
      el.classList.add('tilting');
      el.style.transform = 'perspective(800px) rotateX(' + ((.5 - y) * 8) + 'deg) rotateY(' + ((x - .5) * 10) + 'deg) translateY(-6px)';
      el.style.setProperty('--mx', x * 100 + '%'); el.style.setProperty('--my', y * 100 + '%');
    });
    el.addEventListener('mouseleave', function(){ el.classList.remove('tilting'); el.style.transform = ''; });
  });
  var hero = document.querySelector('.hero'), ring = hero && hero.querySelector('.ring');
  if(hero){
    hero.addEventListener('mousemove', function(e){
      var r = hero.getBoundingClientRect(), x = (e.clientX - r.left) / r.width, y = (e.clientY - r.top) / r.height;
      hero.style.setProperty('--sx', x * 100 + '%'); hero.style.setProperty('--sy', y * 100 + '%');
      if(ring) ring.style.transform = 'perspective(900px) rotateY(' + ((x - .5) * 14) + 'deg) rotateX(' + ((.5 - y) * 10) + 'deg)';
    });
    hero.addEventListener('mouseleave', function(){ if(ring) ring.style.transform = ''; });
  }
  var h = document.querySelector('.hire');
  if(h){
    h.addEventListener('mousemove', function(e){
      var r = h.getBoundingClientRect();
      h.style.transform = 'translate(' + ((e.clientX - r.left - r.width / 2) * .25) + 'px,' + ((e.clientY - r.top - r.height / 2) * .35) + 'px)';
    });
    h.addEventListener('mouseleave', function(){ h.style.transform = ''; });
  }
})();

// 3D skills cube: auto-spins, drag to rotate
(function(){
  var sc = document.querySelector('.cube-scene'), cu = document.querySelector('.cube'); if(!sc || !cu) return;
  var rx = -20, ry = 30, drag = false, lx = 0, ly = 0, live = true;
  function apply(){ cu.style.transform = 'rotateX(' + rx + 'deg) rotateY(' + ry + 'deg)'; }
  sc.addEventListener('pointerdown', function(e){ drag = true; lx = e.clientX; ly = e.clientY; try { sc.setPointerCapture(e.pointerId); } catch(x) {} });
  sc.addEventListener('pointermove', function(e){
    if(!drag) return;
    ry += (e.clientX - lx) * .6; rx -= (e.clientY - ly) * .6; lx = e.clientX; ly = e.clientY; apply();
  });
  function end(){ drag = false; }
  sc.addEventListener('pointerup', end); sc.addEventListener('pointercancel', end);
  new IntersectionObserver(function(es){ live = es[0].isIntersecting; }).observe(sc);
  (function loop(){ if(live && !drag && !reduce){ ry += .35; apply(); } requestAnimationFrame(loop); })();
  apply();
})();

// Project 2 dashboard preview (sample numbers only)
(function(){
  var cat = [['Network',38],['Hardware',27],['Software',24],['Account',19],['Printer',12]],
      res = [['Hardware',8.6],['Network',5.2],['Software',4.1],['Printer',3.4],['Account',1.8]],
      day = [['Mon',29],['Tue',24],['Wed',21],['Thu',19],['Fri',17],['Sat',6],['Sun',4]];
  var total = cat.reduce(function(a, c){ return a + c[1]; }, 0);
  var hrs = cat.reduce(function(a, c){ var r = res.filter(function(x){ return x[0] === c[0]; })[0][1]; return a + r * c[1]; }, 0) / total;
  var kp = [[total, 'Total tickets'], [Math.round(cat[0][1] / total * 100) + '%', 'Top category: ' + cat[0][0]], [hrs.toFixed(1) + ' h', 'Average resolution'], [day[0][0], 'Busiest weekday']];
  document.getElementById('kpis').innerHTML = kp.map(function(k){ return '<div class="col-6 col-lg-3"><div class="panel kpi"><div class="n">' + k[0] + '</div><small>' + k[1] + '</small></div></div>'; }).join('');
  function draw(id, data, unit){
    var max = Math.max.apply(null, data.map(function(d){ return d[1]; }));
    document.getElementById(id).innerHTML = data.map(function(d){
      return '<div class="b"><span>' + d[0] + '</span><span class="t"><i data-w="' + Math.round(d[1] / max * 100) + '"></i></span><span class="v">' + d[1] + unit + '</span></div>';
    }).join('');
  }
  draw('bCat', cat, ''); draw('bRes', res, ' h'); draw('bDay', day, '');
  function fill(){
    var all = document.querySelectorAll('#p2-dash .bars i');
    all.forEach(function(i){ i.style.width = '0'; });
    setTimeout(function(){ all.forEach(function(i){ i.style.width = i.dataset.w + '%'; }); }, 60);
  }
  var tab = document.querySelector('[data-bs-target="#p2-dash"]');
  if(tab) tab.addEventListener('shown.bs.tab', fill);
})();

// Counters
function count(el){
  var to = +el.dataset.count, n = 0;
  if(reduce){ el.textContent = to; return; }
  var t = setInterval(function(){ n++; el.textContent = n; if(n >= to) clearInterval(t); }, 260);
}

// Reveal on scroll, plus triggers for meters and counters
document.querySelectorAll('.panel, h2, .lead-sub, .accordion, .table-responsive').forEach(function(el){ el.classList.add('rv'); });
var revObs = new IntersectionObserver(function(es){
  es.forEach(function(e){
    if(!e.isIntersecting) return;
    e.target.classList.add('in');
    e.target.querySelectorAll('.meter i').forEach(function(i){ i.style.width = i.dataset.w + '%'; });
    revObs.unobserve(e.target);
  });
}, {threshold:.15});
document.querySelectorAll('.rv').forEach(function(el){ revObs.observe(el); });

var cntObs = new IntersectionObserver(function(es){
  es.forEach(function(e){ if(e.isIntersecting){ count(e.target); cntObs.unobserve(e.target); } });
}, {threshold:.6});
document.querySelectorAll('[data-count]').forEach(function(el){ cntObs.observe(el); });

// Skill filter
document.querySelectorAll('.filter .btn').forEach(function(b){
  b.addEventListener('click', function(){
    document.querySelectorAll('.filter .btn').forEach(function(x){x.classList.remove('on')});
    b.classList.add('on');
    var f = b.dataset.f;
    document.querySelectorAll('#skillTable tbody tr').forEach(function(r){
      r.style.display = (f === 'all' || r.dataset.c === f) ? '' : 'none';
    });
  });
});

// Contact form (validation, then opens email app)
document.getElementById('send').addEventListener('click', function(){
  var n = document.getElementById('cn').value.trim();
  var m = document.getElementById('cm').value.trim();
  var e = document.getElementById('err');
  if(!n || !m){ e.textContent = 'Enter your name and a message before sending.'; return; }
  e.textContent = '';
  location.href = 'mailto:edwardsajovidal@gmail.com?subject=' +
    encodeURIComponent('Portfolio message from ' + n) + '&body=' + encodeURIComponent(m);
});
