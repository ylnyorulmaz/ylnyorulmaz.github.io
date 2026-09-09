/* ── Article page: listen (Web Speech API), table of contents, sharing ── */

/* ── Listen: read the article aloud ── */
(() => {
  const panel = document.getElementById('listen');
  const body  = document.getElementById('article-body');
  if (!panel || !body) return;

  const synth = window.speechSynthesis;
  if (!synth || typeof SpeechSynthesisUtterance === 'undefined') return;

  const playBtn   = document.getElementById('listen-play');
  const stopBtn   = document.getElementById('listen-stop');
  const rateInput = document.getElementById('listen-rate');
  const bar       = document.getElementById('listen-bar');
  const status    = document.getElementById('listen-status');

  // Readable blocks, in document order. Anything inside .no-speech is skipped.
  const blocks = Array.from(body.querySelectorAll('h2, h3, p, li'))
    .filter((el) => !el.closest('.no-speech') && el.textContent.trim().length > 1);
  if (!blocks.length) return;

  // Split each block into short chunks: some engines truncate long utterances,
  // and short chunks give a usable progress read-out.
  const chunks = [];
  blocks.forEach((el, blockIndex) => {
    const text = el.textContent.replace(/\[\d+\]/g, ' ').replace(/\s+/g, ' ').trim();
    const sentences = text.match(/[^.!?…]+[.!?…]*\s*/g) || [text];
    let buffer = '';
    sentences.forEach((sentence) => {
      if ((buffer + sentence).length > 220 && buffer) {
        chunks.push({ text: buffer.trim(), blockIndex });
        buffer = '';
      }
      buffer += sentence;
    });
    if (buffer.trim()) chunks.push({ text: buffer.trim(), blockIndex });
  });

  const lang = document.documentElement.lang || 'en';
  let index = 0;         // chunk currently being spoken
  let playing = false;
  let stopped = true;    // true when nothing is queued (idle or finished)
  let token = 0;         // bumped on every cancel, so stale utterances stay quiet
  let voice = null;

  const pickVoice = () => {
    const voices = synth.getVoices();
    if (!voices.length) return;
    const matches = voices.filter((v) => v.lang && v.lang.toLowerCase().startsWith(lang.slice(0, 2)));
    voice = matches.find((v) => v.localService) || matches[0] || null;
  };
  pickVoice();
  if (typeof synth.onvoiceschanged !== 'undefined') synth.addEventListener('voiceschanged', pickVoice);

  const highlight = (blockIndex) => {
    blocks.forEach((el, i) => el.classList.toggle('speaking', i === blockIndex));
    const el = blocks[blockIndex];
    if (!el) return;
    const box = el.getBoundingClientRect();
    if (box.top < 80 || box.bottom > window.innerHeight - 40) {
      const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      el.scrollIntoView({ block: 'center', behavior: reduce ? 'auto' : 'smooth' });
    }
  };

  const clearHighlight = () => blocks.forEach((el) => el.classList.remove('speaking'));

  const setProgress = () => {
    const pct = stopped ? 0 : Math.round((index / chunks.length) * 100);
    bar.style.width = pct + '%';
  };

  const setStatus = (message) => { status.textContent = message; };

  const setButtons = () => {
    playBtn.textContent = playing ? '❚❚ Pause' : (stopped ? '▶ Listen' : '▶ Resume');
    playBtn.setAttribute('aria-label', playing ? 'Pause reading' : 'Read this article aloud');
    stopBtn.disabled = stopped;
  };

  // If no voice ever starts, say so instead of leaving a silent "reading" state.
  let watchdog = null;
  const armWatchdog = () => {
    clearTimeout(watchdog);
    watchdog = setTimeout(() => {
      if (!stopped && !synth.speaking) finish('No speech voice is available in this browser.');
    }, 3000);
  };

  const speak = () => {
    if (index >= chunks.length) {
      finish('Finished reading.');
      return;
    }
    const chunk = chunks[index];
    const mine = token;
    const utterance = new SpeechSynthesisUtterance(chunk.text);
    utterance.lang = lang;
    utterance.rate = parseFloat(rateInput.value) || 1;
    if (voice) utterance.voice = voice;

    utterance.onstart = () => {
      clearTimeout(watchdog);
      if (mine === token) highlight(chunk.blockIndex);
    };
    utterance.onend = () => {
      if (mine !== token || stopped) return;
      index += 1;
      setProgress();
      speak();
    };
    utterance.onerror = (e) => {
      if (mine !== token || stopped || e.error === 'interrupted' || e.error === 'canceled') return;
      finish('Speech stopped: ' + (e.error || 'unknown error') + '.');
    };

    synth.speak(utterance);
  };

  function finish(message) {
    stopped = true;
    playing = false;
    token += 1;
    clearTimeout(watchdog);
    synth.cancel();
    index = 0;
    clearHighlight();
    setProgress();
    setButtons();
    setStatus(message);
  }

  playBtn.addEventListener('click', () => {
    if (playing) {
      synth.pause();
      playing = false;
      setButtons();
      setStatus('Paused — ' + (chunks.length - index) + ' passages left.');
      return;
    }
    if (!stopped && synth.paused) {   // resume where we left off
      synth.resume();
      playing = true;
      setButtons();
      setStatus('Reading aloud with your browser voice.');
      return;
    }
    token += 1;
    synth.cancel();                   // fresh start
    stopped = false;
    playing = true;
    index = 0;
    setProgress();
    setButtons();
    setStatus('Reading aloud with your browser voice.');
    armWatchdog();
    speak();
  });

  stopBtn.addEventListener('click', () => finish('Stopped.'));

  rateInput.addEventListener('change', () => {
    if (stopped) return;
    // Restart the current passage at the new speed.
    const resumeAt = index;
    token += 1;
    synth.cancel();
    index = resumeAt;
    if (playing) speak();
  });

  // Chrome pauses long-running synthesis after ~15s of speech; a nudge keeps it alive.
  setInterval(() => {
    if (playing && synth.speaking && !synth.paused) {
      synth.pause();
      synth.resume();
    }
  }, 10000);

  // Never leave a voice talking after the page goes away.
  window.addEventListener('pagehide', () => synth.cancel());
  window.addEventListener('beforeunload', () => synth.cancel());

  panel.hidden = false;
  setButtons();
  setProgress();
  setStatus('About ' + chunks.length + ' passages. Uses your browser’s built-in voice.');
})();

/* ── Table of contents: highlight the section in view ── */
(() => {
  const links = document.querySelectorAll('.article-toc a[href^="#"]');
  if (!links.length || !('IntersectionObserver' in window)) return;

  const targets = Array.from(links)
    .map((a) => document.getElementById(a.getAttribute('href').slice(1)))
    .filter(Boolean);

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      links.forEach((a) => a.classList.toggle('active', a.getAttribute('href') === '#' + entry.target.id));
    });
  }, { rootMargin: '-96px 0px -65% 0px' });

  targets.forEach((t) => observer.observe(t));
})();

/* ── Share: social links, WhatsApp, Slack, copy ── */
(() => {
  const share = document.getElementById('share');
  if (!share) return;

  const note = document.getElementById('share-note');
  const canonical = document.querySelector('link[rel="canonical"]');
  const url = canonical ? canonical.href : window.location.href.split('#')[0];
  const title = (document.querySelector('meta[property="og:title"]') || {}).content || document.title;
  const summary = (document.querySelector('meta[name="description"]') || {}).content || '';
  const message = title + ' — ' + url;

  const u = encodeURIComponent(url);
  const t = encodeURIComponent(title);
  const m = encodeURIComponent(message);

  // Refresh the static hrefs so the buttons follow the page they are actually on.
  const targets = {
    x:        'https://x.com/intent/post?text=' + t + '&url=' + u,
    linkedin: 'https://www.linkedin.com/sharing/share-offsite/?url=' + u,
    bluesky:  'https://bsky.app/intent/compose?text=' + m,
    facebook: 'https://www.facebook.com/sharer/sharer.php?u=' + u,
    whatsapp: 'https://wa.me/?text=' + m,
    email:    'mailto:?subject=' + t + '&body=' + encodeURIComponent(summary + '\n\n' + url)
  };
  Object.keys(targets).forEach((key) => {
    const link = share.querySelector('[data-share="' + key + '"]');
    if (link) link.href = targets[key];
  });

  const say = (text) => {
    if (!note) return;
    note.textContent = text;
    clearTimeout(say.timer);
    say.timer = setTimeout(() => { note.textContent = ''; }, 6000);
  };

  const copy = (text) => {
    if (navigator.clipboard && window.isSecureContext) return navigator.clipboard.writeText(text);
    return new Promise((resolve, reject) => {
      const field = document.createElement('textarea');
      field.value = text;
      field.setAttribute('readonly', '');
      field.style.position = 'fixed';
      field.style.left = '-9999px';
      document.body.appendChild(field);
      field.select();
      const ok = document.execCommand && document.execCommand('copy');
      document.body.removeChild(field);
      ok ? resolve() : reject(new Error('copy failed'));
    });
  };

  // Slack has no share URL, so put the link on the clipboard and open Slack to paste it.
  const slackBtn = share.querySelector('[data-share="slack"]');
  if (slackBtn) {
    slackBtn.addEventListener('click', () => {
      copy(message)
        .then(() => say('Copied. Opening Slack — paste it into any channel or DM.'))
        .catch(() => say('Copy the link above, then paste it into Slack.'));
      window.open('https://app.slack.com/client', '_blank', 'noopener');
    });
  }

  const copyBtn = share.querySelector('[data-share="copy"]');
  if (copyBtn) {
    copyBtn.addEventListener('click', () => {
      copy(url).then(() => say('Link copied to your clipboard.')).catch(() => say('Press Ctrl/Cmd + C to copy the address bar.'));
    });
  }

  // Phones and tablets get the real share sheet.
  const nativeBtn = share.querySelector('[data-share="native"]');
  if (nativeBtn && navigator.share) {
    nativeBtn.hidden = false;
    nativeBtn.addEventListener('click', () => {
      navigator.share({ title: title, text: summary, url: url }).catch(() => {});
    });
  }
})();
