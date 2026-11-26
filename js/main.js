/* Odontoarte Rio — interações da landing */
(() => {
  'use strict';

  const WA_NUMBER = '5521988343607';
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const $ = (s, el = document) => el.querySelector(s);
  const $$ = (s, el = document) => Array.from(el.querySelectorAll(s));

  /* ---------- Header: vidro mais sólido depois do topo + menu mobile + scroll-spy ---------- */
  const hdr = $('#hdr');
  const burger = $('#hburger');
  const onScroll = () => {
    hdr.classList.toggle('is-on', window.scrollY > 40);
    if (window.scrollY < 300) $$('.hpill a[href^="#"], .mnav a[href^="#"]').forEach(a => a.classList.remove('is-current'));
  };
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });

  const setMenu = open => {
    hdr.classList.toggle('menu-open', open);
    burger.setAttribute('aria-expanded', String(open));
    burger.setAttribute('aria-label', open ? 'Fechar menu' : 'Abrir menu');
    $('path', burger).setAttribute('d', open ? 'M6 6l12 12M18 6 6 18' : 'M4 7h16M4 12h16M4 17h16');
    document.body.style.overflow = open ? 'hidden' : '';
  };
  burger.addEventListener('click', () => setMenu(!hdr.classList.contains('menu-open')));
  $$('#menu-mobile a').forEach(a => a.addEventListener('click', () => setMenu(false)));
  document.addEventListener('keydown', e => { if (e.key === 'Escape') setMenu(false); });
  window.addEventListener('resize', () => { if (window.innerWidth >= 980) setMenu(false); });

  const navLinks = $$('.hpill a[href^="#"], .mnav a[href^="#"]:not(.mnav__cta)');
  if ('IntersectionObserver' in window) {
    const spy = new IntersectionObserver(entries => {
      entries.forEach(e => {
        if (!e.isIntersecting) return;
        navLinks.forEach(a => a.classList.toggle('is-current', a.getAttribute('href') === '#' + e.target.id));
      });
    }, { rootMargin: '-45% 0px -50% 0px' });
    ['clinica', 'tratamentos', 'equipe', 'resultados', 'duvidas'].forEach(id => { const el = document.getElementById(id); if (el) spy.observe(el); });
  }

  /* ---------- Revelação ao rolar ---------- */
  if ('IntersectionObserver' in window && !reduce) {
    document.documentElement.classList.add('js-reveal');
    const io = new IntersectionObserver(entries => entries.forEach(e => {
      if (e.isIntersecting) { e.target.classList.add('is-in'); io.unobserve(e.target); }
    }), { rootMargin: '0px 0px -8% 0px' });
    $$('[data-reveal]').forEach(el => io.observe(el));
  }

  /* ---------- Formulário -> WhatsApp ---------- */
  if (document.getElementById('lead')) {
  const form = $('#lead');
  const gform = $('#agendar');
  const fields = {
    name: { el: $('#f-name'), err: $('#e-name'), check: v => v.trim().length >= 2 || 'Informe seu nome.' },
    phone: { el: $('#f-phone'), err: $('#e-phone'), check: v => v.replace(/\D/g, '').length >= 10 || 'Informe DDD + número.' },
    type: { el: $('#f-type'), err: $('#e-type'), check: v => !!v || 'Escolha uma opção.' }
  };
  const phoneEl = fields.phone.el;
  phoneEl.addEventListener('input', () => {
    const d = phoneEl.value.replace(/\D/g, '').slice(0, 11);
    let out = d;
    if (d.length > 2) out = `(${d.slice(0, 2)}) ${d.slice(2)}`;
    if (d.length > 7) out = `(${d.slice(0, 2)}) ${d.slice(2, d.length - 4)}-${d.slice(-4)}`;
    phoneEl.value = out;
  });
  const validate = key => {
    const f = fields[key];
    const r = f.check(f.el.value);
    const msg = r === true ? '' : r;
    f.err.textContent = msg;
    f.el.closest('.gfield').classList.toggle('is-bad', !!msg);
    f.el.setAttribute('aria-invalid', msg ? 'true' : 'false');
    return !msg;
  };
  Object.keys(fields).forEach(k => {
    const ev = fields[k].el.tagName === 'SELECT' ? 'change' : 'blur';
    fields[k].el.addEventListener(ev, () => validate(k));
  });
  form.addEventListener('submit', e => {
    e.preventDefault();
    const ok = Object.keys(fields).map(validate).every(Boolean);
    if (!ok) { const bad = Object.values(fields).find(f => f.el.getAttribute('aria-invalid') === 'true'); bad && bad.el.focus(); return; }
    const plan = (form.querySelector('input[name="plan"]:checked') || {}).value || 'Não';
    const msg = [
      'Olá, vim do site e gostaria de mais informações!',
      '',
      `Nome: ${fields.name.el.value.trim()}`,
      `Telefone: ${phoneEl.value}`,
      `Tratamento: ${fields.type.el.value}`,
      `Possui plano odontológico: ${plan}`
    ].join('\n');
    const href = `https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(msg)}`;
    $('#ok-wa').href = href;
    $('#ok-msg').textContent = `Obrigado, ${fields.name.el.value.trim().split(' ')[0]}! Abrimos o WhatsApp com a sua mensagem pronta. É só tocar em enviar.`;
    gform.classList.add('is-sent');
    window.open(href, '_blank', 'noopener');
  });
  $('#ok-reset').addEventListener('click', () => { form.reset(); gform.classList.remove('is-sent'); fields.name.el.focus(); });

  /* no celular o botão flutuante some enquanto o formulário está na tela */
  if ('IntersectionObserver' in window) {
    new IntersectionObserver(([e]) => document.body.classList.toggle('form-in-view', e.isIntersecting), { threshold: 0.25 }).observe(gform);
  }
  }

  /* ---------- Antes e depois ---------- */
  if (document.getElementById('ba')) {
  const CASES = [
    [1, 'Clareamento, gengivoplastia e resinas anteriores'],
    [2, 'Clareamento, gengivoplastia e resinas fotopolimerizáveis anteriores'],
    [3, 'Clareamento'],
    [4, 'Clareamento'],
    [5, 'Gengivoplastia e facetas diretas em resina composta'],
    [6, 'Ortodontia e facetas de resina em paciente idosa periodontalmente comprometida'],
    [8, 'Reanatomização e coroa no dente 21'],
    [7, 'Ortodontia e resinas anteriores'],
    [9, 'Reanatomização de dentes anteriores'],
    [10, 'Protocolo de implante']
  ];
  const ba = $('#ba');
  const range = $('#ba-range');
  const imgA = $('#ba-before');
  const imgD = $('#ba-after');
  const thumbs = $('#res-thumbs');
  let cur = 0;
  const setPos = v => ba.style.setProperty('--pos', v + '%');
  range.addEventListener('input', () => setPos(range.value));

  CASES.forEach(([n, cap], i) => {
    const b = document.createElement('button');
    b.type = 'button';
    b.setAttribute('role', 'tab');
    b.setAttribute('aria-label', `Caso ${i + 1}: ${cap}`);
    b.innerHTML = `<img src="assets/img/${n}-Depois.jpg" alt="" loading="lazy" width="700" height="343">`;
    b.addEventListener('click', () => show(i));
    thumbs.appendChild(b);
  });
  const show = i => {
    cur = (i + CASES.length) % CASES.length;
    const [n, cap] = CASES[cur];
    imgA.src = `assets/img/${n}-Antes.jpg`;
    imgD.src = `assets/img/${n}-Depois.jpg`;
    imgA.alt = `Antes: ${cap}`;
    imgD.alt = `Depois: ${cap}`;
    $('#res-cap').textContent = cap;
    $('#res-n').textContent = `Caso ${String(cur + 1).padStart(2, '0')} de ${CASES.length}`;
    $$('button', thumbs).forEach((b, j) => b.setAttribute('aria-selected', String(j === cur)));
    const active = thumbs.children[cur];
    if (active) thumbs.scrollTo({ left: active.offsetLeft - thumbs.clientWidth / 2 + active.clientWidth / 2, behavior: reduce ? 'auto' : 'smooth' });
    range.value = 50; setPos(50);
  };
  $('#res-prev').addEventListener('click', () => show(cur - 1));
  $('#res-next').addEventListener('click', () => show(cur + 1));
  show(0);
  // pré-carrega os demais casos depois que a página assentar
  window.addEventListener('load', () => setTimeout(() => CASES.forEach(([n]) => { new Image().src = `assets/img/${n}-Antes.jpg`; }), 1500));

  /* dica de arraste: a divisória balança uma vez quando o slider entra na tela */
  if (!reduce && 'IntersectionObserver' in window) {
    const hint = new IntersectionObserver(([e]) => {
      if (!e.isIntersecting) return;
      hint.disconnect();
      const t0 = performance.now();
      const step = t => {
        const p = Math.min(1, (t - t0) / 1400);
        setPos(50 + Math.sin(p * Math.PI * 2) * 18 * (1 - p));
        if (p < 1) requestAnimationFrame(step); else setPos(range.value);
      };
      requestAnimationFrame(step);
    }, { threshold: 0.6 });
    hint.observe(ba);
  }
  }

  /* ---------- Depoimentos ---------- */
  if (document.getElementById('depo')) {
  const qs = $$('.depo__q'), avs = $$('.depo__av'), who = $$('.depo__a');
  let dCur = 0, dTimer;
  const pick = i => {
    dCur = i;
    [qs, who].forEach(list => list.forEach((el, j) => el.classList.toggle('is-on', j === i)));
    avs.forEach((b, j) => { b.classList.toggle('is-on', j === i); b.setAttribute('aria-selected', String(j === i)); });
  };
  const auto = () => { clearInterval(dTimer); if (!reduce) dTimer = setInterval(() => pick((dCur + 1) % qs.length), 7000); };
  avs.forEach((b, i) => b.addEventListener('click', () => { pick(i); auto(); }));
  $('#depo').addEventListener('mouseenter', () => clearInterval(dTimer));
  $('#depo').addEventListener('mouseleave', auto);
  auto();
  }

  /* ---------- FAQ ---------- */
  const FAQ = [
    ['Como faço para agendar uma consulta?', 'Pelo formulário no topo da página (que abre o WhatsApp com sua mensagem pronta), pelos telefones (21) 98834-3607 e (21) 2240-3543 ou pelo agendamento online da Doctoralia.'],
    ['Onde fica a clínica?', 'Na Av. Rio Branco, 156, sala 1001, no Centro do Rio de Janeiro.'],
    ['Qual é o horário de atendimento?', 'De segunda a sexta-feira, das 9h às 18h.'],
    ['Vocês atendem plano odontológico?', 'Informe no formulário se você possui plano odontológico. Nossa equipe confirma as condições de atendimento quando entrar em contato.'],
    ['Quais especialidades a Odontoarte oferece?', 'Periodontia, implantodontia, prótese, dentística (clareamento, facetas e resinas), endodontia, ortodontia e odontologia do sono.'],
    ['O que é a odontologia do sono?', 'É a área que trata o ronco e a apneia do sono com aparelhos intraorais personalizados. Se você ronca ou acorda cansado mesmo depois de dormir, vale fazer uma avaliação.'],
    ['Quanto tempo dura um tratamento?', 'Depende de cada caso. A duração e as etapas são definidas na avaliação, junto com o seu plano de tratamento.']
  ];
  const faq = $('#faq');
  if (faq && !faq.children.length) {
  FAQ.forEach(([q, a], i) => {
    const item = document.createElement('div');
    item.className = 'faq__item';
    item.innerHTML = `<h3><button type="button" class="faq__btn" id="fq-b${i}" aria-expanded="${i === 0}" aria-controls="fq-p${i}"><span></span><span class="faq__ic" aria-hidden="true">+</span></button></h3><div class="faq__p" id="fq-p${i}" role="region" aria-labelledby="fq-b${i}" ${i === 0 ? '' : 'hidden'}><p></p></div>`;
    item.querySelector('.faq__btn span').textContent = q;
    item.querySelector('.faq__p p').textContent = a;
    faq.appendChild(item);
  });
  }
  if (faq) {
  faq.addEventListener('click', e => {
    const btn = e.target.closest('.faq__btn');
    if (!btn) return;
    const open = btn.getAttribute('aria-expanded') !== 'true';
    $$('.faq__btn', faq).forEach(b => { b.setAttribute('aria-expanded', 'false'); document.getElementById(b.getAttribute('aria-controls')).hidden = true; });
    btn.setAttribute('aria-expanded', String(open));
    document.getElementById(btn.getAttribute('aria-controls')).hidden = !open;
  });
  }

  /* ---------- Contadores ---------- */
  const counters = $$('[data-count]');
  if (!reduce && 'IntersectionObserver' in window) {
    const cio = new IntersectionObserver(entries => entries.forEach(e => {
      if (!e.isIntersecting) return;
      cio.unobserve(e.target);
      const el = e.target, to = +el.dataset.count, pre = el.dataset.prefix || '';
      const t0 = performance.now(), dur = 1600;
      const tick = t => {
        const p = Math.min(1, (t - t0) / dur), k = 1 - Math.pow(1 - p, 3);
        el.textContent = pre + Math.round(to * k);
        if (p < 1) requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
    }), { threshold: 0.6 });
    counters.forEach(c => { c.textContent = (c.dataset.prefix || '') + '0'; cio.observe(c); });
  }

  /* ---------- Título da faixa "digitado" ---------- */
  const tw = $('.bnr__t');
  if (tw && !reduce && 'IntersectionObserver' in window) {
    tw.setAttribute('aria-label', tw.textContent.replace(/\s+/g, ' ').trim());
    const walker = document.createTreeWalker(tw, NodeFilter.SHOW_TEXT);
    const nodes = [];
    while (walker.nextNode()) if (walker.currentNode.nodeValue.trim()) nodes.push(walker.currentNode);
    const chars = [];
    nodes.forEach(node => {
      const frag = document.createDocumentFragment();
      Array.from(node.nodeValue.replace(/\s+/g, ' ')).forEach(ch => {
        const s = document.createElement('span');
        s.className = 'tw-c'; s.setAttribute('aria-hidden', 'true'); s.textContent = ch;
        frag.appendChild(s); chars.push(s);
      });
      node.parentNode.replaceChild(frag, node);
    });
    const caret = document.createElement('span');
    caret.className = 'tw-caret'; caret.setAttribute('aria-hidden', 'true');
    // começa colado na primeira letra (não numa linha solta abaixo do título)
    chars[0].before(caret);
    tw.classList.add('tw-on');
    const twio = new IntersectionObserver(([e]) => {
      if (!e.isIntersecting) return;
      twio.disconnect();
      caret.classList.add('is-typing');
      let i = 0;
      const next = () => {
        if (i >= chars.length) { caret.classList.remove('is-typing'); setTimeout(() => caret.classList.add('is-done'), 1600); return; }
        const c = chars[i++];
        c.classList.add('is-in');
        c.after(caret);
        // pausa maior na virada de linha, como quem digita
        const lineEnd = c.parentElement !== (chars[i] && chars[i].parentElement) && c.closest('.bnr__ln') !== (chars[i] && chars[i].closest('.bnr__ln'));
        setTimeout(next, lineEnd ? 380 : 42 + Math.random() * 40);
      };
      setTimeout(next, 250);
    }, { threshold: 0.5 });
    twio.observe(tw);
  }

  /* ---------- Cartões empilhados da clínica: escala via GSAP (telas largas) ---------- */
  const initStack = (tries = 0) => {
    const cards = $$('.stack__card');
    if (cards.length < 2) return;
    if (!window.gsap || !window.ScrollTrigger) { if (tries < 40) setTimeout(() => initStack(tries + 1), 100); return; }
    gsap.registerPlugin(ScrollTrigger);
    gsap.matchMedia().add('(min-width: 900px) and (prefers-reduced-motion: no-preference)', () => {
      cards.forEach((card, i) => {
        for (let j = i + 1; j < cards.length; j++) {
          gsap.fromTo(card, { scale: 1 - 0.04 * (j - i - 1) }, {
            scale: 1 - 0.04 * (j - i), ease: 'none', immediateRender: false,
            scrollTrigger: { trigger: cards[j], scrub: true, start: 'top bottom-=60', end: 'top ' + (92 + j * 22) }
          });
        }
      });
    });
  };
  initStack();

  /* ---------- Antes e depois nos cards de resultados ---------- */
  $$('.ba--sm input').forEach(r => {
    const set = () => r.parentElement.style.setProperty('--pos', r.value + '%');
    r.addEventListener('input', set); set();
  });

  /* ---------- Resultados: carrossel 3D (central nítido, vizinhos desfocados) ---------- */
  const car = document.getElementById("rcar");
  if (car) {
    const cards = Array.from(car.querySelectorAll(".rcard"));
    const total = cards.length;
    const cap = document.getElementById("rcar-cap");
    let cur = 0, timer = null, stopped = reduce;
    const render = () => {
      cards.forEach((c, i) => {
        let pos = (i - cur + total) % total;
        if (pos > Math.floor(total / 2)) pos -= total;
        const center = pos === 0, adj = Math.abs(pos) === 1;
        c.style.transform = "translateX(" + pos * 45 + "%) scale(" + (center ? 1 : adj ? 0.85 : 0.7) + ") rotateY(" + pos * -10 + "deg)";
        c.style.zIndex = center ? 10 : adj ? 5 : 1;
        c.style.opacity = center ? 1 : adj ? 0.4 : 0;
        c.style.filter = center ? "blur(0px)" : "blur(4px)";
        c.style.visibility = Math.abs(pos) > 1 ? "hidden" : "visible";
        c.classList.toggle("is-active", center);
        c.setAttribute("aria-hidden", center ? "false" : "true");
        c.querySelector("input").tabIndex = center ? 0 : -1;
      });
      const fc = cards[cur].querySelector("figcaption");
      cap.textContent = fc ? fc.textContent : "";
    };
    const go = i => { cur = (i + total) % total; render(); };
    const stop = () => { stopped = true; clearInterval(timer); };   // parou de vez ao interagir
    const play = () => { clearInterval(timer); if (!stopped) timer = setInterval(() => go(cur + 1), 4000); };
    document.getElementById("rcar-prev").addEventListener("click", () => { stop(); go(cur - 1); });
    document.getElementById("rcar-next").addEventListener("click", () => { stop(); go(cur + 1); });
    car.addEventListener("keydown", e => {
      if (e.key === "ArrowRight" && e.target === car) { e.preventDefault(); stop(); go(cur + 1); }
      if (e.key === "ArrowLeft" && e.target === car) { e.preventDefault(); stop(); go(cur - 1); }
    });
    // tocar num vizinho traz ele para o centro; mexer no antes/depois para o autoplay
    cards.forEach((c, i) => {
      c.addEventListener("click", e => { if (i !== cur) { e.preventDefault(); stop(); go(i); } });
      c.querySelector("input").addEventListener("pointerdown", stop);
      c.querySelector("input").addEventListener("input", stop);
    });
    // deslizar o dedo fora da linha do antes/depois (ex.: nas laterais) também troca
    let sx = null;
    car.addEventListener("touchstart", e => { if (!e.target.closest(".rcard.is-active .ba")) sx = e.touches[0].clientX; }, { passive: true });
    car.addEventListener("touchend", e => {
      if (sx === null) return; const d = e.changedTouches[0].clientX - sx; sx = null;
      if (Math.abs(d) > 40) { stop(); go(cur + (d < 0 ? 1 : -1)); }
    });
    // autoplay só com a seção visível e sem o mouse em cima
    car.addEventListener("mouseenter", () => clearInterval(timer));
    car.addEventListener("mouseleave", play);
    if ("IntersectionObserver" in window) new IntersectionObserver(([e]) => e.isIntersecting ? play() : clearInterval(timer), { threshold: .4 }).observe(car);
    render();
  }

  /* ---------- Parallax da foto de fundo em "Desde 2002" ---------- */
  const pBg = $('.bnr__bg');
  if (pBg && !reduce) {
    const sec = pBg.parentElement;
    let ticking = false;
    const move = () => {
      ticking = false;
      const r = sec.getBoundingClientRect(), vh = window.innerHeight;
      if (r.bottom < 0 || r.top > vh) return;
      // -1 quando a seção entra por baixo, +1 quando sai por cima
      const p = (vh / 2 - (r.top + r.height / 2)) / (vh / 2 + r.height / 2);
      pBg.style.transform = 'translate3d(0,' + (p * r.height * 0.16).toFixed(1) + 'px,0)';
    };
    const req = () => { if (!ticking) { ticking = true; requestAnimationFrame(move); } };
    window.addEventListener('scroll', req, { passive: true });
    window.addEventListener('resize', req);
    move();
  }

  const y = $('#year'); if (y) y.textContent = new Date().getFullYear();
})();
