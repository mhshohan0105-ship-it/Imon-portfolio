(() => {
  'use strict';

  const $ = (s, el = document) => el.querySelector(s);
  const $$ = (s, el = document) => [...el.querySelectorAll(s)];
  const reduceMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- Loader ---------- */
  const hideLoader = () => $('#loader')?.classList.add('done');
  // deferred script runs once the DOM is parsed; don't wait for fonts/images
  setTimeout(hideLoader, 450);

  $('#year').textContent = new Date().getFullYear();

  /* ---------- Theme ---------- */
  const root = document.documentElement;
  $('#themeToggle').addEventListener('click', () => {
    const next = root.dataset.theme === 'light' ? 'dark' : 'light';
    root.dataset.theme = next;
    try { localStorage.setItem('theme', next); } catch (e) {}
    molecules.recolor();
  });

  /* ---------- Nav: scroll state, progress, active link, mobile menu ---------- */
  const nav = $('#nav');
  const progress = $('#progress');
  const links = $$('.nav-links a');
  const sections = links.map(a => $(a.getAttribute('href')));
  let ticking = false;
  const onScroll = () => {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(() => {
      const y = scrollY;
      const max = document.documentElement.scrollHeight - innerHeight;
      nav.classList.toggle('scrolled', y > 30);
      progress.style.transform = `scaleX(${max > 0 ? y / max : 0})`;
      let current = -1;
      sections.forEach((s, i) => { if (s && s.offsetTop - 140 <= y) current = i; });
      links.forEach((a, i) => a.classList.toggle('active', i === current));
      ticking = false;
    });
  };
  addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  const burger = $('#burger');
  const navLinks = $('#navLinks');
  const setMenu = open => {
    navLinks.classList.toggle('open', open);
    burger.setAttribute('aria-expanded', open);
  };
  burger.addEventListener('click', () => setMenu(!navLinks.classList.contains('open')));
  links.forEach(a => a.addEventListener('click', () => setMenu(false)));

  /* ---------- Typed roles ---------- */
  const roles = ['an Analytical Chemist', 'a Method Developer', 'a Mass Spec Enthusiast', 'a Researcher', 'an Educator'];
  const typed = $('#typed');
  if (!reduceMotion) {
    let r = 0, c = roles[0].length, deleting = true;
    const tick = () => {
      const word = roles[r];
      c += deleting ? -1 : 1;
      typed.textContent = word.slice(0, c);
      let delay = deleting ? 45 : 85;
      if (!deleting && c === word.length) { deleting = true; delay = 1800; }
      else if (deleting && c === 0) { deleting = false; r = (r + 1) % roles.length; delay = 300; }
      setTimeout(tick, delay);
    };
    setTimeout(tick, 2200);
  }

  /* ---------- Reveal on scroll + counters ---------- */
  const countUp = el => {
    const target = +el.dataset.count;
    const suffix = el.dataset.suffix || '';
    if (reduceMotion) { el.textContent = target + suffix; return; }
    const start = performance.now();
    const dur = 1400;
    const step = now => {
      const p = Math.min((now - start) / dur, 1);
      el.textContent = Math.round(target * (1 - Math.pow(1 - p, 3))) + suffix;
      if (p < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  };

  const io = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (!e.isIntersecting) return;
      e.target.classList.add('in');
      $$('[data-count]', e.target).forEach(countUp);
      io.unobserve(e.target);
    });
  }, { threshold: 0.15, rootMargin: '0px 0px -40px 0px' });

  // stagger siblings inside grids
  $$('.stats, .metrics, .cards, .pubs, .timeline, .edu').forEach(g =>
    $$('.reveal', g).forEach((el, i) => el.style.setProperty('--d', `${i * 0.09}s`)));
  $$('.reveal').forEach(el => io.observe(el));

  /* ---------- Periodic table of skills ---------- */
  const skills = [
    ['Hp', 'HPLC', 'chrom', 'High performance liquid chromatography'],
    ['Uh', 'UHPLC', 'chrom', 'Agilent 1260 Infinity II, UHPLC-DAD'],
    ['Lm', 'LC-MS/MS', 'chrom', 'Tandem MS for quantifying 18 to 23 cannabinoids'],
    ['Qt', 'ESI-QTOF', 'chrom', 'Agilent 6545 QTOF, high resolution MS'],
    ['Gm', 'GC-MS', 'chrom', 'Gas chromatography mass spectrometry'],
    ['Gv', 'GC-VUV', 'chrom', 'GC with vacuum UV detection (in training)'],
    ['Hi', 'HILIC', 'chrom', 'Hydrophilic interaction chromatography'],
    ['Rp', 'Reversed Phase', 'chrom', 'C18 reversed phase LC'],
    ['Tl', 'TLC', 'chrom', 'Thin layer chromatography'],
    ['Hr', 'HRMS', 'spec', 'High resolution MS, isotopic pattern analysis'],
    ['Ic', 'ICP-MS', 'spec', 'Trace and heavy metal elemental analysis'],
    ['Io', 'ICP-OES', 'spec', 'Optical emission elemental analysis'],
    ['Ft', 'FTIR', 'spec', 'Fourier transform infrared spectroscopy'],
    ['Uv', 'UV-Vis', 'spec', 'UV-Vis spectrophotometry'],
    ['Nm', 'NMR', 'spec', 'Nuclear magnetic resonance'],
    ['Sp', 'Sample Prep', 'lab', 'Ultrasonic extraction, SPE, centrifugation, serial dilution'],
    ['Wc', 'Wet Chem', 'lab', 'Titration, pH, classical wet chemistry'],
    ['St', 'Stability', 'lab', '64 week ICH aligned stability studies'],
    ['Pc', 'PCR', 'lab', 'PCR & restriction enzyme digestion'],
    ['Sd', 'SDS-PAGE', 'lab', 'Protein electrophoresis & affinity chromatography'],
    ['Pp', 'Plasmid Prep', 'lab', 'Plasmid purification, bacterial culture & media'],
    ['Mv', 'Method Valid.', 'qa', 'Accuracy 85.6 to 110%, RSD < 5%'],
    ['Is', 'ISO 17025', 'qa', 'ISO/IEC 17025 compliant method validation'],
    ['Gl', 'GLP', 'qa', 'Good Laboratory Practice'],
    ['Gp', 'cGMP', 'qa', 'USP certified GMP foundations'],
    ['So', 'SOPs', 'qa', 'Authored 1 SOP, enforced 4 others'],
    ['Oo', 'OOS / CAPA', 'qa', 'Deviation investigations, root cause analysis'],
    ['Kz', 'Kaizen', 'qa', '5S, PDCA, continuous improvement'],
    ['Di', 'Data Integrity', 'qa', 'ALCOA minded, audit ready documentation'],
    ['Mh', 'MassHunter', 'soft', 'Agilent MassHunter Qual/Quant'],
    ['Cd', 'ChemDraw', 'soft', 'Chemical structure drawing'],
    ['Ga', 'Gaussian', 'soft', 'Computational chemistry'],
    ['Om', 'OMNIC', 'soft', 'FTIR data software'],
    ['De', 'Delta', 'soft', 'Instrument data software'],
    ['Ms', 'MS Office', 'soft', 'Word, Excel, PowerPoint, Teams'],
  ];
  const groupColor = { chrom: '#2ee6c5', spec: '#5b8cff', lab: '#ffb547', qa: '#ff6b9a', soft: '#a77bff' };
  const ptable = $('#ptable');
  ptable.innerHTML = skills.map(([sym, name, g, tip], i) =>
    `<div class="el" data-group="${g}" style="--c:${groupColor[g]};--d:${(i % 12) * 0.035}s" tabindex="0">
       <span class="num">${i + 1}</span><span class="sym">${sym}</span><span class="name">${name}</span>
       <span class="tip">${tip}</span>
     </div>`).join('');
  const ptObserver = new IntersectionObserver(([e]) => {
    if (!e.isIntersecting) return;
    $$('.el', ptable).forEach(el => el.classList.add('in'));
    ptObserver.disconnect();
  }, { threshold: 0.1 });
  ptObserver.observe(ptable);

  $('#ptFilters').addEventListener('click', e => {
    const btn = e.target.closest('.chip');
    if (!btn) return;
    $$('.chip', e.currentTarget).forEach(c => c.classList.toggle('active', c === btn));
    const g = btn.dataset.group;
    $$('.el', ptable).forEach(el => el.classList.toggle('dim', g !== 'all' && el.dataset.group !== g));
  });

  /* ---------- Chromatogram ---------- */
  const chrom = (() => {
    const svg = $('#chromSvg');
    const trace = $('#trace');
    const box = $('#chromato');
    const tip = $('#peakTip');
    const W = 800, H = 260, BASE = 235;
    // [name, retention (0-12 min), relative height, width, note]
    const peaks = [
      ['CBDV', 1.2, .35, .08, 'Cannabidivarin'],
      ['CBDA', 2.1, .55, .09, 'Cannabidiolic acid'],
      ['CBG', 3.0, .45, .09, 'Cannabigerol'],
      ['CBD', 3.7, .95, .1, 'Cannabidiol, the main target analyte'],
      ['THCV', 4.6, .3, .08, 'Tetrahydrocannabivarin'],
      ['CBN', 5.6, .5, .1, 'Cannabinol, a degradation marker'],
      ['Δ9-THC', 6.6, .8, .09, 'Positional isomer, baseline resolved from Δ8'],
      ['Δ8-THC', 7.05, .62, .09, 'Positional isomer of Δ9-THC'],
      ['9R-HHC', 8.2, .48, .09, 'Hexahydrocannabinol, R epimer'],
      ['9S-HHC', 8.65, .4, .09, 'Hexahydrocannabinol, S epimer'],
      ['CBC', 9.8, .38, .1, 'Cannabichromene'],
      ['THC-O', 10.9, .58, .11, 'Δ8-THC-O-acetate (semi synthetic)'],
    ];
    const x = t => (t / 12) * W;

    // grid
    const grid = $('.grid', svg);
    let g = '';
    for (let i = 1; i < 12; i++) g += `<line x1="${x(i)}" x2="${x(i)}" y1="10" y2="${BASE}"/>`;
    for (let j = 0; j < 4; j++) { const y = 30 + j * 68; g += `<line x1="0" x2="${W}" y1="${y}" y2="${y}"/>`; }
    grid.innerHTML = g;

    // trace = sum of gaussians plus a little noise
    const pts = [];
    for (let px = 0; px <= W; px += 2) {
      const t = (px / W) * 12;
      let y = 0;
      for (const [, rt, h, w] of peaks) y += h * Math.exp(-((t - rt) ** 2) / (2 * w * w));
      y += Math.sin(px * 0.7) * 0.004 + Math.sin(px * 0.13) * 0.006;
      pts.push(`${px},${(BASE - y * 195).toFixed(1)}`);
    }
    trace.setAttribute('d', 'M' + pts.join(' L'));

    // HTML labels + hover targets (kept out of the stretched SVG so text isn't distorted)
    const layer = document.createElement('div');
    layer.className = 'peak-layer';
    layer.innerHTML = peaks.map(([n, rt, h], i) =>
      `<button class="peak-pin" type="button" data-i="${i}" style="left:${(rt / 12) * 100}%;top:${((BASE - h * 195) / H) * 100}%">
         <span>${n}</span></button>`).join('');
    svg.after(layer);

    const showTip = (btn) => {
      const [n, rt, , , note] = peaks[btn.dataset.i];
      tip.innerHTML = `<b>${n}</b>t<sub>R</sub> ≈ ${rt.toFixed(2)} min · ${note}`;
      const br = btn.getBoundingClientRect(), bb = box.getBoundingClientRect();
      const left = Math.min(Math.max(br.left - bb.left + br.width / 2, 120), bb.width - 120);
      tip.style.left = left + 'px';
      tip.style.top = (br.top - bb.top) + 'px';
      tip.classList.add('show');
    };
    layer.addEventListener('pointerover', e => { const b = e.target.closest('.peak-pin'); if (b) showTip(b); });
    layer.addEventListener('focusin', e => { const b = e.target.closest('.peak-pin'); if (b) showTip(b); });
    layer.addEventListener('pointerleave', () => tip.classList.remove('show'));
    layer.addEventListener('focusout', () => tip.classList.remove('show'));

    const pins = $$('.peak-pin', layer);
    const len = trace.getTotalLength();
    let raf;
    const play = () => {
      cancelAnimationFrame(raf);
      pins.forEach(p => p.classList.remove('show'));
      if (reduceMotion) { trace.style.strokeDasharray = 'none'; pins.forEach(p => p.classList.add('show')); return; }
      trace.style.strokeDasharray = len;
      const dur = 3200, start = performance.now();
      const step = now => {
        const p = Math.min((now - start) / dur, 1);
        trace.style.strokeDashoffset = len * (1 - p);
        const tNow = p * 12;
        pins.forEach((pin, i) => { if (peaks[i][1] < tNow) pin.classList.add('show'); });
        if (p < 1) raf = requestAnimationFrame(step);
      };
      raf = requestAnimationFrame(step);
    };
    trace.style.strokeDasharray = len;
    trace.style.strokeDashoffset = len;
    $('#replay').addEventListener('click', play);
    new IntersectionObserver(([e], o) => { if (e.isIntersecting) { play(); o.disconnect(); } }, { threshold: 0.4 }).observe(box);
  })();

  /* ---------- Molecular network background ---------- */
  const molecules = (() => {
    const canvas = $('#molecules');
    const ctx = canvas.getContext('2d');
    const ELEMENTS = [ // symbol, radius, weight
      ['C', 4, 5], ['H', 2.5, 4], ['O', 4.2, 2], ['N', 4, 1],
    ];
    let W, H, dpr, atoms = [], rings = [], palette, running = true;
    const mouse = { x: -9999, y: -9999 };

    const pick = () => {
      const total = ELEMENTS.reduce((s, e) => s + e[2], 0);
      let r = Math.random() * total;
      for (const e of ELEMENTS) { if ((r -= e[2]) < 0) return e; }
      return ELEMENTS[0];
    };

    const recolor = () => {
      const light = root.dataset.theme === 'light';
      palette = {
        C: light ? '#0aa88d' : '#2ee6c5',
        H: light ? '#8aa0c0' : '#7f93b5',
        O: light ? '#e2557c' : '#ff6b9a',
        N: light ? '#3567e6' : '#5b8cff',
        bond: light ? '30,60,120' : '120,170,255',
        ring: light ? 'rgba(10,168,141,.18)' : 'rgba(46,230,197,.13)',
      };
      if (reduceMotion) draw();
    };

    const resize = () => {
      dpr = Math.min(devicePixelRatio || 1, 2);
      W = innerWidth; H = innerHeight;
      canvas.width = W * dpr; canvas.height = H * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      const count = Math.round(Math.min(70, Math.max(26, (W * H) / 24000)));
      atoms = Array.from({ length: count }, () => {
        const [sym, r] = pick();
        return { x: Math.random() * W, y: Math.random() * H, vx: (Math.random() - .5) * .35, vy: (Math.random() - .5) * .35, sym, r };
      });
      rings = Array.from({ length: W < 700 ? 2 : 4 }, () => ({
        x: Math.random() * W, y: Math.random() * H, s: 26 + Math.random() * 30,
        a: Math.random() * Math.PI, va: (Math.random() - .5) * .003, vy: -.08 - Math.random() * .12,
      }));
      if (reduceMotion) draw();
    };

    const hexagon = (x, y, s, a) => {
      ctx.beginPath();
      for (let i = 0; i < 6; i++) {
        const t = a + i * Math.PI / 3;
        ctx[i ? 'lineTo' : 'moveTo'](x + s * Math.cos(t), y + s * Math.sin(t));
      }
      ctx.closePath();
      ctx.stroke();
      // aromatic inner circle
      ctx.beginPath();
      ctx.arc(x, y, s * .55, 0, Math.PI * 2);
      ctx.stroke();
    };

    const LINK = 130;
    const draw = () => {
      ctx.clearRect(0, 0, W, H);

      ctx.strokeStyle = palette.ring;
      ctx.lineWidth = 1.5;
      for (const r of rings) hexagon(r.x, r.y, r.s, r.a);

      // bonds
      for (let i = 0; i < atoms.length; i++) {
        const a = atoms[i];
        for (let j = i + 1; j < atoms.length; j++) {
          const b = atoms[j];
          const dx = a.x - b.x, dy = a.y - b.y;
          const d2 = dx * dx + dy * dy;
          if (d2 > LINK * LINK) continue;
          const alpha = (1 - Math.sqrt(d2) / LINK) * .35;
          ctx.strokeStyle = `rgba(${palette.bond},${alpha})`;
          ctx.lineWidth = 1;
          ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y); ctx.stroke();
          // double bond look for close C–O pairs
          if (d2 < 2500 && (a.sym === 'O' || b.sym === 'O')) {
            const len = Math.sqrt(d2) || 1, ox = -dy / len * 3, oy = dx / len * 3;
            ctx.beginPath(); ctx.moveTo(a.x + ox, a.y + oy); ctx.lineTo(b.x + ox, b.y + oy); ctx.stroke();
          }
        }
        // bond to cursor: the cursor acts as a reactive atom
        const mx = a.x - mouse.x, my = a.y - mouse.y, md = mx * mx + my * my;
        if (md < 180 * 180) {
          ctx.strokeStyle = `rgba(${palette.bond},${(1 - Math.sqrt(md) / 180) * .5})`;
          ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(mouse.x, mouse.y); ctx.stroke();
        }
      }
      // atoms
      for (const a of atoms) {
        ctx.fillStyle = palette[a.sym];
        ctx.globalAlpha = .75;
        ctx.beginPath(); ctx.arc(a.x, a.y, a.r, 0, Math.PI * 2); ctx.fill();
      }
      ctx.globalAlpha = 1;
    };

    const update = () => {
      for (const a of atoms) {
        a.x += a.vx; a.y += a.vy;
        if (a.x < -20) a.x = W + 20; else if (a.x > W + 20) a.x = -20;
        if (a.y < -20) a.y = H + 20; else if (a.y > H + 20) a.y = -20;
        // gentle attraction toward the cursor
        const dx = mouse.x - a.x, dy = mouse.y - a.y, d2 = dx * dx + dy * dy;
        if (d2 < 180 * 180 && d2 > 400) { a.x += dx * .004; a.y += dy * .004; }
      }
      for (const r of rings) {
        r.a += r.va; r.y += r.vy;
        if (r.y < -60) { r.y = H + 60; r.x = Math.random() * W; }
      }
    };

    const loop = () => {
      if (!running) return;
      update(); draw();
      requestAnimationFrame(loop);
    };

    recolor();
    resize();
    let rt;
    addEventListener('resize', () => { clearTimeout(rt); rt = setTimeout(resize, 150); });
    if (!reduceMotion) {
      addEventListener('pointermove', e => { mouse.x = e.clientX; mouse.y = e.clientY; }, { passive: true });
      document.addEventListener('pointerleave', () => { mouse.x = mouse.y = -9999; });
      document.addEventListener('visibilitychange', () => {
        running = !document.hidden;
        if (running) loop();
      });
      loop();
    }
    return { recolor };
  })();
})();
