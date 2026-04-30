(function () {
  const app = document.getElementById("app");
  if (!app) return;

  const catalog = [
    { id: "water", name: "מים", icon: "💧", utility: "survival", scarcity: 3 },
    { id: "food", name: "אוכל", icon: "🍞", utility: "survival", scarcity: 3 },
    { id: "blanket", name: "שמיכה", icon: "🛏️", utility: "comfort", scarcity: 2 },
    { id: "med", name: "ערכת עזרה", icon: "🧰", utility: "health", scarcity: 2 },
    { id: "battery", name: "סוללה", icon: "🔋", utility: "tools", scarcity: 2 },
    { id: "lamp", name: "פנס", icon: "🔦", utility: "tools", scarcity: 1 },
    { id: "rope", name: "חבל", icon: "🪢", utility: "tools", scarcity: 1 },
    { id: "soap", name: "סבון", icon: "🧼", utility: "hygiene", scarcity: 1 },
    { id: "book", name: "ספר", icon: "📘", utility: "morale", scarcity: 1 },
    { id: "jacket", name: "מעיל", icon: "🧥", utility: "comfort", scarcity: 2 }
  ];

  const missions = [
    {
      title: "מחנה לילה",
      needIds: ["water", "food", "blanket", "lamp"],
      optionalIds: ["battery"],
      text: "הקבוצה שלכם צריכה לשרוד לילה מחוץ לכיתה."
    },
    {
      title: "טיול חירום",
      needIds: ["water", "food", "med", "jacket"],
      optionalIds: ["rope"],
      text: "אתם יוצאים למסלול והציוד מוגבל."
    },
    {
      title: "כיתה בלי חשמל",
      needIds: ["lamp", "battery", "water", "food"],
      optionalIds: ["book"],
      text: "נשארתם בכיתה בלי חשמל עד סוף היום."
    }
  ];

  const state = {
    teamName: "",
    mission: null,
    inventory: [],
    completedTrades: 0,
    lessonAnswer: "",
    scarcityAnswer: ""
  };

  function randInt(max) {
    return Math.floor(Math.random() * max);
  }

  function pickRandom(arr, count) {
    const copy = arr.slice();
    const out = [];
    while (copy.length && out.length < count) {
      out.push(copy.splice(randInt(copy.length), 1)[0]);
    }
    return out;
  }

  function encodeParams(url) {
    return "https://api.qrserver.com/v1/create-qr-code/?size=360x360&data=" + encodeURIComponent(url);
  }

  function isMobileMode() {
    const p = new URLSearchParams(window.location.search);
    return p.get("mobile") === "1";
  }

  function mobileUrl() {
    const u = new URL(window.location.href);
    u.searchParams.set("mobile", "1");
    if (!u.searchParams.get("session")) {
      u.searchParams.set("session", Math.random().toString(36).slice(2, 10));
    }
    return u.toString();
  }

  function calcProgress() {
    if (!state.mission) return { have: 0, total: 0, missing: [] };
    const needSet = new Set(state.mission.needIds);
    const invSet = new Set(state.inventory.map(function (i) { return i.id; }));
    const missing = state.mission.needIds.filter(function (id) { return !invSet.has(id); });
    let have = 0;
    needSet.forEach(function (id) {
      if (invSet.has(id)) have += 1;
    });
    return { have: have, total: state.mission.needIds.length, missing: missing };
  }

  function itemById(id) {
    return catalog.find(function (x) { return x.id === id; });
  }

  function startGame(teamName) {
    state.teamName = teamName.trim() || "קבוצה";
    state.mission = missions[randInt(missions.length)];
    const mustHave = pickRandom(state.mission.needIds, 2).map(itemById).filter(Boolean);
    const randomOthers = pickRandom(catalog.filter(function (x) {
      return !mustHave.some(function (m) { return m.id === x.id; });
    }), 4);
    state.inventory = mustHave.concat(randomOthers).slice(0, 6);
    state.completedTrades = 0;
    state.lessonAnswer = "";
    state.scarcityAnswer = "";
    renderMobile();
  }

  function markTrade(giveId, receiveId) {
    if (!giveId || !receiveId || giveId === receiveId) {
      return;
    }
    const giveIndex = state.inventory.findIndex(function (i) { return i.id === giveId; });
    if (giveIndex === -1) return;
    const receiveItem = itemById(receiveId);
    if (!receiveItem) return;

    state.inventory.splice(giveIndex, 1, receiveItem);
    state.completedTrades += 1;
    renderMobile();
  }

  function inventoryOptions() {
    return state.inventory.map(function (item) {
      return '<option value="' + item.id + '">' + item.icon + ' ' + item.name + '</option>';
    }).join("");
  }

  function catalogOptions() {
    return catalog.map(function (item) {
      return '<option value="' + item.id + '">' + item.icon + ' ' + item.name + '</option>';
    }).join("");
  }

  function renderMobileStart() {
    app.innerHTML =
      '<div class="mobile">' +
      '<header class="hero">' +
      '<h1>פעילות סחר חליפין</h1>' +
      '<p>סחרו עם קבוצות אחרות כדי להשיג מה שאתם באמת צריכים.</p>' +
      '</header>' +
      '<section class="card">' +
      '<h2>מה המטרה?</h2>' +
      '<ul>' +
      '<li>לכל קבוצה יש משימה שונה וצרכים שונים.</li>' +
      '<li>יש לכם 6 פריטים התחלתיים, אבל לא כולם מתאימים למשימה.</li>' +
      '<li>בצעו החלפות עם קבוצות אחרות עד שתשלימו את כל הצרכים.</li>' +
      '</ul>' +
      '<label class="label">שם קבוצה</label>' +
      '<input id="teamName" type="text" placeholder="למשל: קבוצה 3" />' +
      '<button id="startBtn" class="primary">התחל פעילות</button>' +
      '</section>' +
      '</div>' +
      styles();

    var btn = document.getElementById("startBtn");
    if (btn) {
      btn.addEventListener("click", function () {
        var input = document.getElementById("teamName");
        startGame(input ? input.value : "");
      });
    }
  }

  function renderMobile() {
    if (!state.mission) {
      renderMobileStart();
      return;
    }

    const progress = calcProgress();
    const missingBadges = progress.missing.map(function (id) {
      var item = itemById(id);
      return '<span class="missing">' + (item ? item.icon + ' ' + item.name : id) + '</span>';
    }).join(" ");

    const done = progress.have === progress.total;

    app.innerHTML =
      '<div class="mobile">' +
      '<header class="hero">' +
      '<h1>' + state.teamName + '</h1>' +
      '<p>' + state.mission.title + ' - ' + state.mission.text + '</p>' +
      '</header>' +

      '<section class="card">' +
      '<h2>הצרכים שלכם</h2>' +
      '<p class="progress">השלמה: ' + progress.have + '/' + progress.total + '</p>' +
      '<div class="chips">' +
      state.mission.needIds.map(function (id) {
        var item = itemById(id);
        var has = state.inventory.some(function (i) { return i.id === id; });
        return '<span class="chip ' + (has ? 'ok' : 'need') + '">' + (item ? item.icon + ' ' + item.name : id) + '</span>';
      }).join(" ") +
      '</div>' +
      (progress.missing.length ? '<p class="hint">חסר לכם כרגע: ' + missingBadges + '</p>' : '<p class="hint good">מצוין! השלמתם את כל הצרכים.</p>') +
      '</section>' +

      '<section class="card">' +
      '<h2>המלאי שלכם</h2>' +
      '<div class="chips">' +
      state.inventory.map(function (item) {
        return '<span class="chip inv">' + item.icon + ' ' + item.name + '</span>';
      }).join(" ") +
      '</div>' +
      '</section>' +

      '<section class="card">' +
      '<h2>ביצוע החלפה</h2>' +
      '<p class="hint">דברו עם קבוצה אחרת: מה הם צריכים ומה הם מציעים בתמורה.</p>' +
      '<div class="trade-grid">' +
      '<label>נותנים:</label><select id="giveSelect">' + inventoryOptions() + '</select>' +
      '<label>מקבלים:</label><select id="receiveSelect">' + catalogOptions() + '</select>' +
      '</div>' +
      '<button id="tradeBtn" class="primary">אשרו החלפה</button>' +
      '<p class="small">מספר החלפות שביצעתם: ' + state.completedTrades + '</p>' +
      '</section>' +

      '<section class="card">' +
      '<h2>רפלקציה על ערך וצורך</h2>' +
      '<label class="label">איזה פריט נראה "שווה" בהתחלה אבל לא באמת עזר למשימה שלכם?</label>' +
      '<textarea id="lessonAnswer" placeholder="כתבו כאן...">' + state.lessonAnswer + '</textarea>' +
      '<label class="label">איך מחסור בפריט מסוים (למשל מים/אוכל) שינה את ערך העסקאות?</label>' +
      '<textarea id="scarcityAnswer" placeholder="כתבו כאן...">' + state.scarcityAnswer + '</textarea>' +
      '</section>' +

      (done ? '<section class="success">סיימתם את המשימה! עכשיו השוו עם קבוצה אחרת: מי ביצע פחות החלפות ולמה?</section>' : '') +
      '<button id="restartBtn" class="secondary">התחל מחדש</button>' +
      '</div>' +
      styles();

    var tradeBtn = document.getElementById("tradeBtn");
    if (tradeBtn) {
      tradeBtn.addEventListener("click", function () {
        var give = document.getElementById("giveSelect");
        var receive = document.getElementById("receiveSelect");
        markTrade(give ? give.value : "", receive ? receive.value : "");
      });
    }

    var restartBtn = document.getElementById("restartBtn");
    if (restartBtn) {
      restartBtn.addEventListener("click", function () {
        state.mission = null;
        renderMobileStart();
      });
    }

    var lessonInput = document.getElementById("lessonAnswer");
    if (lessonInput) {
      lessonInput.addEventListener("input", function (e) {
        state.lessonAnswer = e.target.value;
      });
    }

    var scarcityInput = document.getElementById("scarcityAnswer");
    if (scarcityInput) {
      scarcityInput.addEventListener("input", function (e) {
        state.scarcityAnswer = e.target.value;
      });
    }
  }

  function renderDesktop() {
    var link = mobileUrl();
    app.innerHTML =
      '<div class="desktop">' +
      '<header class="card heroDesk">' +
      '<h1>פעילות סחר חליפין - מסך מדריך</h1>' +
      '<p>התלמידים סורקים QR ונכנסים מהטלפון למשימת סחר קבוצתית.</p>' +
      '</header>' +
      '<section class="grid">' +
      '<div class="card qr">' +
      '<h2>סריקה לנייד</h2>' +
      '<img src="' + encodeParams(link) + '" alt="QR לפתיחת פעילות סחר חליפין" />' +
      '<p class="small">אם אין סריקה: <a href="' + link + '" target="_blank" rel="noreferrer">פתחו קישור ישיר</a></p>' +
      '</div>' +
      '<div class="card info">' +
      '<h2>מה הילדים ילמדו?</h2>' +
      '<ul>' +
      '<li>ערך הוא יחסי לצורך: פריט "שווה" פחות אם הוא לא פותר את הבעיה.</li>' +
      '<li>מחסור משנה ערך: פריטים נדירים הופכים חשובים יותר במשא ומתן.</li>' +
      '<li>סחר יעיל דורש בירור צרכים של הצד השני, לא רק "מחיר".</li>' +
      '</ul>' +
      '<p class="tip">הנחיה למורה: חלקו את הכיתה לקבוצות, הגדירו 7-10 דקות לסבב סחר, וסכמו מי השלים משימה בהכי מעט החלפות.</p>' +
      '</div>' +
      '</section>' +
      '</div>' +
      styles();
  }

  function styles() {
    return (
      '<style>' +
      'body{margin:0;background:linear-gradient(160deg,#0f172a,#111827 55%,#1f2937);color:#e2e8f0;font-family:Arial,sans-serif;}' +
      '.desktop,.mobile{max-width:1080px;margin:0 auto;padding:16px;}' +
      '.card{background:#111827cc;border:1px solid #334155;border-radius:16px;padding:14px;margin-bottom:12px;}' +
      '.hero,.heroDesk{background:linear-gradient(130deg,#22d3ee,#34d399);color:#052637;}' +
      '.hero h1,.heroDesk h1{margin:0 0 6px;font-size:30px;}' +
      '.hero p,.heroDesk p{margin:0;font-weight:700;}' +
      'h2{margin:0 0 8px;font-size:22px;color:#f8fafc;}' +
      '.grid{display:grid;grid-template-columns:360px 1fr;gap:14px;}' +
      '.qr img{width:100%;max-width:320px;display:block;margin:8px auto;background:#fff;border-radius:12px;padding:8px;}' +
      '.info ul{margin:0;padding-right:20px;display:grid;gap:8px;font-size:16px;color:#cbd5e1;}' +
      '.tip{margin-top:12px;background:#052e16;border:1px solid #22c55e;color:#dcfce7;border-radius:10px;padding:10px;font-weight:700;}' +
      '.chips{display:flex;flex-wrap:wrap;gap:8px;}' +
      '.chip{border-radius:999px;padding:6px 12px;font-weight:700;font-size:14px;border:1px solid transparent;}' +
      '.chip.inv{background:#1e293b;color:#dbeafe;border-color:#334155;}' +
      '.chip.ok{background:#14532d;color:#dcfce7;border-color:#16a34a;}' +
      '.chip.need{background:#3f1d1d;color:#fecaca;border-color:#f87171;}' +
      '.hint{margin:10px 0 0;color:#cbd5e1;}' +
      '.hint.good{color:#86efac;font-weight:700;}' +
      '.missing{display:inline-flex;align-items:center;gap:4px;background:#3f1d1d;border:1px solid #f87171;border-radius:999px;padding:3px 10px;margin-inline:2px;color:#fecaca;}' +
      '.progress{font-weight:800;color:#f8fafc;}' +
      '.trade-grid{display:grid;grid-template-columns:120px 1fr;gap:8px;align-items:center;}' +
      'label{font-weight:700;color:#cbd5e1;}' +
      '.label{display:block;margin:8px 0 6px;}' +
      'select,input,textarea{width:100%;border-radius:10px;border:1px solid #475569;background:#0b1220;color:#e2e8f0;padding:10px;font-size:15px;}' +
      'textarea{min-height:74px;resize:vertical;}' +
      'button{border:0;border-radius:10px;padding:11px 14px;font-weight:800;cursor:pointer;}' +
      '.primary{background:#22c55e;color:#052e16;margin-top:10px;}' +
      '.primary:hover{background:#4ade80;}' +
      '.secondary{background:#334155;color:#e2e8f0;}' +
      '.secondary:hover{background:#475569;}' +
      '.small{font-size:13px;color:#94a3b8;}' +
      '.small a{color:#7dd3fc;}' +
      '.success{background:#14532d;border:1px solid #22c55e;color:#dcfce7;padding:12px;border-radius:12px;text-align:center;font-weight:800;margin-bottom:10px;}' +
      '@media (max-width:920px){.grid{grid-template-columns:1fr;}}' +
      '@media (max-width:640px){.trade-grid{grid-template-columns:1fr;}}' +
      '</style>'
    );
  }

  function render() {
    if (isMobileMode()) {
      renderMobile();
      return;
    }
    renderDesktop();
  }

  render();
})();
