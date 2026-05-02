(function () {
  var INITIAL_BUDGET = 5000;

  var GROUP_NAMES = {
    1: 'צוות אלפא',
    2: 'צוות גלקסיה',
    3: 'צוות פניקס',
    4: 'צוות דרקון'
  };

  var GROUP_COLORS = { 1: '#6366f1', 2: '#0ea5e9', 3: '#22c55e', 4: '#f97316' };

  var CATEGORIES = {
    food:          { title: 'אוכל ופינוקים',      icon: '🍔', color: '#f97316', isWeekly: true  },
    gaming:        { title: 'מסכים וגיימינג',      icon: '🎮', color: '#6366f1', isWeekly: false },
    style:         { title: 'בגדים וסטייל',         icon: '🛍️', color: '#ec4899', isWeekly: false },
    entertainment: { title: 'יציאות ובילויים',      icon: '🎡', color: '#22c55e', isWeekly: true  },
    gifts:         { title: 'מתנות ואירועים',       icon: '🎁', color: '#ef4444', isWeekly: false }
  };

  var CATEGORY_ORDER = ['food', 'gaming', 'style', 'entertainment', 'gifts'];

  var GROUP_TASKS = {
    1: {
      food:          { desc: 'ערב פיצה משפחתי',      steps: ['בחרו פיצרייה מוכרת.', 'מצאו מחיר ל-2 מגשי משפחתית.', 'הוסיפו שתייה ומשלוח.'],             res: 'חפשו "מבצעי משלוחים" באתרי פיצה.' },
      gaming:        { desc: 'משחק AAA חדש',           steps: ['בחרו משחק שיצא השנה.', 'מצאו מחיר עותק פיזי בחנות.', 'בדקו אם יש הנחת מועדון.'],         res: 'חפשו שם משחק + מחיר.' },
      style:         { desc: 'נעלי ספורט למותג',       steps: ['מצאו דגם Nike Air Force 1.', 'חפשו מחיר בחנות אונליין.', 'ודאו שהמחיר מקורי.'],           res: 'חפשו "נעלי נייקי מחיר".' },
      entertainment: { desc: 'קולנוע זוגי',            steps: ['מחיר ל-2 כרטיסים.', 'הוסיפו פופקורן ושתייה.', 'בדקו הנחות 1+1.'],                       res: 'אתר סינמה סיטי או יס פלאנט.' },
      gifts:         { desc: 'מתנה לחבר טוב',          steps: ['בחרו אוזניות גיימינג או בובה.', 'מצאו מחיר לדגם ספציפי.', 'הוסיפו 15 ש"ח עטיפה.'],    res: 'חפשו "אוזניות גיימינג מחיר".' }
    },
    2: {
      food:          { desc: 'ארוחת המבורגרים',        steps: ['מצאו מחיר ל-4 ארוחות קומבו.', 'בדקו ברשת מקדונלדס.', 'חפשו "ארוחה משפחתית".'],        res: 'חפשו "מקדונלדס תפריט".' },
      gaming:        { desc: 'מנויי סטרימינג',          steps: ['מחיר חודשי לנטפליקס.', 'מחיר חודשי לספוטיפיי.', 'חברו את המחירים.'],                  res: 'חפשו "מחיר נטפליקס ישראל".' },
      style:         { desc: 'חליפת טרנינג',            steps: ['חפשו מכנסיים + קפוצון.', 'בחרו רשת (קסטרו/פוקס).', 'חברו את המחירים.'],               res: 'חפשו "חליפת טרנינג" באתרי אופנה.' },
      entertainment: { desc: 'תחרות באולינג',           steps: ['מחיר ל-2 משחקים לאדם.', 'הכפילו ב-4 חברים.', 'הוסיפו השכרת נעליים.'],                 res: 'חפשו "באולינג מחירים".' },
      gifts:         { desc: 'יום הולדת להורים',        steps: ['זר פרחים או שוקולד יוקרתי.', 'מצאו מחיר למארז הכי יפה.', 'הוסיפו מחיר משלוח.'],      res: 'חפשו "משלוח פרחים מחיר".' }
    },
    3: {
      food:          { desc: 'מסיבת ממתקים',           steps: ['חפשו 10 שקיות חטיפים.', 'הוסיפו 4 בקבוקי שתייה.', 'חשבו עלות שבועית.'],               res: 'אתר "שופרסל Online".' },
      gaming:        { desc: 'מטבעות וירטואליים',       steps: ['בחרו פורטנייט או רובלוקס.', 'חפשו חבילת מטבעות.', 'המרו לשקלים (3.7 לדולר).'],       res: 'חפשו "Fortnite V-Bucks price".' },
      style:         { desc: 'עיצוב החדר',              steps: ['בחרו פס לד וכרית נוי.', 'מצאו מחיר באיקאה.', 'חברו את המחירים.'],                     res: 'חפשו "אקססוריז לחדר".' },
      entertainment: { desc: 'פארק טרמפולינות',         steps: ['מחיר לשעה קפיצה.', 'הוסיפו גרביים מונעות החלקה.', 'מחיר לאדם אחד.'],                  res: 'חפשו "איי גאמפ מחירים".' },
      gifts:         { desc: 'מתנה למורה',              steps: ['בחרו עציץ או ספר.', 'מצאו מחיר בחנות.', 'הוסיפו כרטיס ברכה.'],                       res: 'חפשו "סטימצקי" או "משתלה".' }
    },
    4: {
      food:          { desc: 'גלידה משפחתית',          steps: ['מחיר ל-1 ק"ג גלידה.', 'הוסיפו 4 גביעים.', 'הוסיפו רטבים בתשלום.'],                   res: 'חפשו "גולדה מחיר קילו".' },
      gaming:        { desc: 'ציוד למחשב',              steps: ['עכבר גיימינג או מקלדת.', 'חפשו דגם מותג בינוני.', 'מצאו מחיר בחנות.'],               res: 'חפשו "עכבר גיימינג מחיר".' },
      style:         { desc: 'חולצת כדורגל',            steps: ['בחרו קבוצה אהובה.', 'חפשו חולצה רשמית 2024.', 'בדקו בחנות ספורט.'],                  res: 'חפשו "חולצת כדורגל רשמית מחיר".' },
      entertainment: { desc: 'חדר בריחה',               steps: ['חדר שמתאים לילדים.', 'מחיר לאדם בקבוצה של 5.', 'שימו לב: המחיר יורד כשיש יותר אנשים.'], res: 'חפשו "חדר בריחה מחירים".' },
      gifts:         { desc: 'מתנה לאח/אחות',           steps: ['ערכת לגו או משחק קופסה.', 'מצאו מחיר בחנות צעצועים.', 'ודאו שזה דגם פופולרי.'],      res: 'חפשו "ערכת לגו מחיר".' }
    }
  };

  /* ─── helpers ─── */
  function formatMoney(val) {
    return '₪' + Math.round(val).toLocaleString('he-IL');
  }

  function getParams() {
    return new URLSearchParams(window.location.search);
  }

  function getGroupId() {
    var g = parseInt(getParams().get('group') || '0');
    return g >= 1 && g <= 4 ? g : 0;
  }

  /* ─── storage ─── */
  function loadExpenses(groupId) {
    try {
      return JSON.parse(localStorage.getItem('fmc_group_' + groupId) || '{}');
    } catch (e) {
      return {};
    }
  }

  function saveExpenses(groupId, expenses) {
    localStorage.setItem('fmc_group_' + groupId, JSON.stringify(expenses));
  }

  function getTotal(expenses) {
    return CATEGORY_ORDER.reduce(function (sum, id) { return sum + (expenses[id] || 0); }, 0);
  }

  /* ─── mobile page for a specific group ─── */
  function buildMobilePage(groupId) {
    var app = document.getElementById('app');
    var groupName = GROUP_NAMES[groupId];
    var accentColor = GROUP_COLORS[groupId];
    var tasks = GROUP_TASKS[groupId];
    var expenses = loadExpenses(groupId);

    function rerender() {
      expenses = loadExpenses(groupId);
      var total = getTotal(expenses);
      var balance = INITIAL_BUDGET - total;

      var balanceEl = document.getElementById('mb-balance');
      var totalEl = document.getElementById('mb-total');
      if (balanceEl) {
        balanceEl.textContent = formatMoney(balance);
        balanceEl.style.color = balance < 0 ? '#fca5a5' : '#86efac';
      }
      if (totalEl) totalEl.textContent = formatMoney(total);

      CATEGORY_ORDER.forEach(function (catId) {
        var chip = document.getElementById('chip-' + catId);
        var card = document.getElementById('card-' + catId);
        var val = expenses[catId];
        if (chip) {
          if (typeof val === 'number') {
            chip.textContent = formatMoney(val);
            chip.className = 'amount-chip done';
          } else {
            chip.textContent = '—';
            chip.className = 'amount-chip empty';
          }
        }
        if (card) {
          card.style.borderColor = typeof val === 'number' ? accentColor : '#e2e8f0';
        }
      });
    }

    var cardsHtml = CATEGORY_ORDER.map(function (catId) {
      var cat = CATEGORIES[catId];
      var task = tasks[catId];
      var stepsHtml = task.steps.map(function (step, i) {
        return '<div class="step"><div class="step-num" style="background:' + cat.color + '">' + (i + 1) + '</div><div class="step-text">' + step + '</div></div>';
      }).join('');

      return (
        '<div class="cat-card" id="card-' + catId + '">' +
          '<div class="cat-header" style="background:' + cat.color + '">' +
            '<div class="cat-left">' +
              '<span class="cat-icon">' + cat.icon + '</span>' +
              '<div>' +
                '<div class="cat-title">' + cat.title + '</div>' +
                '<div class="cat-badge">' + (cat.isWeekly ? 'שבועי × 4' : 'חודשי') + '</div>' +
              '</div>' +
            '</div>' +
            '<div class="amount-chip empty" id="chip-' + catId + '">—</div>' +
          '</div>' +
          '<div class="cat-body">' +
            '<div class="task-title">' + task.desc + '</div>' +
            '<div class="steps">' + stepsHtml + '</div>' +
            '<div class="hint">🔎 ' + task.res + '</div>' +
            '<div class="input-label">' + (cat.isWeekly ? 'הזינו סכום שבועי (יוכפל ×4):' : 'הזינו סכום חודשי:') + '</div>' +
            '<div class="input-row">' +
              '<input type="number" id="inp-' + catId + '" min="0" placeholder="₪ סכום..." inputmode="decimal" />' +
              '<button class="ok-btn" style="background:' + cat.color + '" onclick="submitCat(\'' + catId + '\')">✓ אישור</button>' +
            '</div>' +
          '</div>' +
        '</div>'
      );
    }).join('');

    app.innerHTML =
      '<div class="mobile-shell">' +
        '<div class="topbar" style="background:' + accentColor + '">' +
          '<div class="group-name">👥 ' + groupName + '</div>' +
          '<div class="topbar-stats">' +
            '<div class="topbar-stat"><div class="ts-label">יתרה</div><div class="ts-val" id="mb-balance" style="color:#86efac">' + formatMoney(INITIAL_BUDGET) + '</div></div>' +
            '<div class="topbar-stat"><div class="ts-label">הוצאות</div><div class="ts-val" id="mb-total">₪0</div></div>' +
          '</div>' +
        '</div>' +
        '<div class="cards-list">' + cardsHtml + '</div>' +
        '<div class="footer-note">תקציב פתיחה: ₪5,000 · הנתונים נשמרים במכשיר</div>' +
      '</div>' +
      '<style>' +
        '*{box-sizing:border-box;}' +
        'body{margin:0;background:#f1f5f9;font-family:Arial,sans-serif;direction:rtl;}' +
        '.mobile-shell{max-width:600px;margin:0 auto;padding-bottom:32px;}' +
        '.topbar{position:sticky;top:0;z-index:20;color:white;padding:12px 16px;display:flex;justify-content:space-between;align-items:center;box-shadow:0 3px 14px rgba(0,0,0,0.25);}' +
        '.group-name{font-size:19px;font-weight:900;}' +
        '.topbar-stats{display:flex;gap:14px;}' +
        '.topbar-stat{text-align:center;}' +
        '.ts-label{font-size:10px;opacity:0.75;font-weight:700;text-transform:uppercase;}' +
        '.ts-val{font-size:18px;font-weight:900;}' +
        '.cards-list{padding:12px;display:flex;flex-direction:column;gap:14px;}' +
        '.cat-card{background:white;border-radius:20px;overflow:hidden;box-shadow:0 2px 10px rgba(0,0,0,0.08);border:2px solid #e2e8f0;transition:border-color .3s;}' +
        '.cat-header{padding:14px 16px;display:flex;justify-content:space-between;align-items:center;color:white;}' +
        '.cat-left{display:flex;align-items:center;gap:10px;}' +
        '.cat-icon{font-size:28px;}' +
        '.cat-title{font-size:16px;font-weight:900;}' +
        '.cat-badge{font-size:11px;background:rgba(255,255,255,0.3);padding:2px 8px;border-radius:20px;font-weight:700;margin-top:2px;display:inline-block;}' +
        '.amount-chip{font-size:15px;font-weight:900;padding:5px 12px;border-radius:20px;}' +
        '.amount-chip.empty{background:rgba(255,255,255,0.2);color:white;}' +
        '.amount-chip.done{background:white;color:#1e293b;}' +
        '.cat-body{padding:16px;}' +
        '.task-title{font-size:15px;font-weight:800;color:#1e293b;margin-bottom:12px;}' +
        '.steps{display:flex;flex-direction:column;gap:8px;margin-bottom:12px;}' +
        '.step{display:flex;align-items:flex-start;gap:10px;}' +
        '.step-num{width:22px;height:22px;border-radius:50%;color:white;display:flex;align-items:center;justify-content:center;font-size:11px;font-weight:900;flex-shrink:0;margin-top:1px;}' +
        '.step-text{color:#475569;font-size:14px;line-height:1.55;}' +
        '.hint{background:#f0fdf4;border:1px dashed #86efac;border-radius:10px;padding:10px 12px;font-size:13px;color:#166534;font-weight:700;margin-bottom:14px;}' +
        '.input-label{font-size:12px;font-weight:700;color:#64748b;margin-bottom:6px;}' +
        '.input-row{display:flex;gap:8px;}' +
        '.input-row input{flex:1;padding:10px 12px;border:2px solid #e2e8f0;border-radius:12px;font-size:20px;font-weight:800;text-align:center;outline:none;color:#1e293b;}' +
        '.input-row input:focus{border-color:#6366f1;}' +
        '.ok-btn{border:none;border-radius:12px;padding:10px 18px;font-size:16px;font-weight:900;color:white;cursor:pointer;white-space:nowrap;}' +
        '.ok-btn:active{opacity:0.85;}' +
        '.footer-note{text-align:center;font-size:11px;color:#94a3b8;padding:10px;}' +
        '.done-overlay{position:fixed;inset:0;display:flex;flex-direction:column;align-items:center;justify-content:center;z-index:100;color:white;text-align:center;padding:24px;}' +
        '.done-card{background:rgba(255,255,255,0.15);border:2px solid rgba(255,255,255,0.3);border-radius:20px;padding:20px 28px;margin:12px 0;font-size:22px;font-weight:900;}' +
        '.done-close{background:white;border:none;padding:12px 32px;border-radius:12px;font-size:16px;font-weight:900;cursor:pointer;margin-top:10px;}' +
      '</style>';

    // Pre-fill inputs from localStorage
    CATEGORY_ORDER.forEach(function (catId) {
      var cat = CATEGORIES[catId];
      var inp = document.getElementById('inp-' + catId);
      var val = expenses[catId];
      if (inp && typeof val === 'number') {
        inp.value = cat.isWeekly ? val / 4 : val;
      }
    });

    rerender();

    window.submitCat = function (catId) {
      var inp = document.getElementById('inp-' + catId);
      if (!inp) return;
      var raw = parseFloat(inp.value);
      if (isNaN(raw) || raw < 0) return;
      var cat = CATEGORIES[catId];
      var fresh = loadExpenses(groupId);
      fresh[catId] = cat.isWeekly ? Math.round(raw * 4) : Math.round(raw);
      saveExpenses(groupId, fresh);
      rerender();

      // scroll to next unanswered
      var freshExp = loadExpenses(groupId);
      var nextId = CATEGORY_ORDER.find(function (id) { return typeof freshExp[id] !== 'number'; });
      if (nextId) {
        var nextCard = document.getElementById('card-' + nextId);
        if (nextCard) nextCard.scrollIntoView({ behavior: 'smooth', block: 'start' });
      } else {
        showAllDone(accentColor);
      }
    };
  }

  function showAllDone(color) {
    var exp = loadExpenses(getGroupId());
    var total = getTotal(exp);
    var balance = INITIAL_BUDGET - total;
    var overlay = document.createElement('div');
    overlay.className = 'done-overlay';
    overlay.style.background = color;
    overlay.innerHTML =
      '<div style="font-size:60px;margin-bottom:8px;">🏆</div>' +
      '<div style="font-size:26px;font-weight:900;margin-bottom:6px;">כל הכבוד!</div>' +
      '<div style="font-size:15px;opacity:0.9;margin-bottom:16px;">השלמתם את כל 5 המשימות!</div>' +
      '<div class="done-card">יתרה סופית: ' + formatMoney(balance) + '</div>' +
      '<button class="done-close" onclick="this.parentElement.remove()">חזרה לטופס</button>';
    document.body.appendChild(overlay);
  }

  /* ─── entry point ─── */
  var groupId = getGroupId();

  if (groupId === 0) {
    // No group param — show a group selector page
    document.getElementById('app').innerHTML =
      '<div style="min-height:100vh;display:flex;flex-direction:column;align-items:center;justify-content:center;padding:24px;gap:16px;">' +
        '<div style="font-size:48px;">💼</div>' +
        '<h1 style="margin:0;color:#1e1b4b;font-size:26px;font-weight:900;text-align:center;">מנהלי העתיד — אתגר ה-5,000</h1>' +
        '<p style="margin:0;color:#64748b;text-align:center;">בחרו את הצוות שלכם:</p>' +
        '<div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;width:100%;max-width:340px;">' +
          [1, 2, 3, 4].map(function (g) {
            return '<a href="?group=' + g + '" style="display:flex;flex-direction:column;align-items:center;justify-content:center;gap:6px;padding:20px;background:white;border:3px solid ' + GROUP_COLORS[g] + ';border-radius:18px;text-decoration:none;color:' + GROUP_COLORS[g] + ';font-weight:900;font-size:16px;box-shadow:0 2px 8px rgba(0,0,0,0.08);">' +
              '<span style="font-size:28px;">👥</span>' + GROUP_NAMES[g] + '</a>';
          }).join('') +
        '</div>' +
      '</div>' +
      '<style>body{margin:0;background:#f1f5f9;font-family:Arial,sans-serif;direction:rtl;}</style>';
    return;
  }

  buildMobilePage(groupId);
})();
