(function () {
  const app = document.getElementById("app");
  if (!app) {
    return;
  }

  const STARTING_BUDGET = 10000;

  const stocks = [
    {
      symbol: "AAPL",
      company: "Apple",
      sector: "טכנולוגיה",
      price: 700,
      note: "ענקית מוצרי צריכה וטכנולוגיה"
    },
    {
      symbol: "MSFT",
      company: "Microsoft",
      sector: "תוכנה וענן",
      price: 560,
      note: "מובילה בשירותי ענן ו-AI"
    },
    {
      symbol: "GOOGL",
      company: "Alphabet",
      sector: "פרסום ודיגיטל",
      price: 620,
      note: "מנוע חיפוש, פרסום וענן"
    },
    {
      symbol: "AMZN",
      company: "Amazon",
      sector: "מסחר וענן",
      price: 510,
      note: "מסחר מקוון ותשתיות ענן"
    },
    {
      symbol: "TSLA",
      company: "Tesla",
      sector: "רכב ואנרגיה",
      price: 760,
      note: "רכב חשמלי ואגירת אנרגיה"
    },
    {
      symbol: "NVDA",
      company: "NVIDIA",
      sector: "שבבים",
      price: 840,
      note: "שבבי AI ומאיצים למרכזי נתונים"
    },
    {
      symbol: "META",
      company: "Meta",
      sector: "מדיה חברתית",
      price: 490,
      note: "פרסום דיגיטלי ופלטפורמות חברתיות"
    },
    {
      symbol: "JPM",
      company: "JPMorgan",
      sector: "בנקאות",
      price: 470,
      note: "בנק גלובלי גדול"
    },
    {
      symbol: "XOM",
      company: "ExxonMobil",
      sector: "אנרגיה",
      price: 420,
      note: "נפט וגז טבעי"
    },
    {
      symbol: "KO",
      company: "Coca-Cola",
      sector: "צריכה",
      price: 250,
      note: "מוצרי צריכה יציבים"
    },
    {
      symbol: "NKE",
      company: "Nike",
      sector: "ביגוד וספורט",
      price: 380,
      note: "ענקית הנעליים והביגוד הספורטיבי"
    },
    {
      symbol: "DIS",
      company: "Disney",
      sector: "בידור",
      price: 320,
      note: "אימפריית הבידור וסרטים"
    },
    {
      symbol: "NFLX",
      company: "Netflix",
      sector: "סטרימינג",
      price: 580,
      note: "פלטפורמת סרטונים וסדרות בעולם"
    },
    {
      symbol: "SNAP",
      company: "Snapchat",
      sector: "מדיה חברתית",
      price: 240,
      note: "אפליקציית תמונות וידאו חברתית"
    },
    {
      symbol: "RBLX",
      company: "Roblox",
      sector: "משחקים",
      price: 180,
      note: "פלטפורמת משחקי ריאליטי וירטואלי"
    },
    {
      symbol: "SPOT",
      company: "Spotify",
      sector: "מוסיקה",
      price: 280,
      note: "שירות סטרימינג מוסיקה עולמי"
    },
    {
      symbol: "INTC",
      company: "Intel",
      sector: "שבבים",
      price: 360,
      note: "יצרנית מעבדים למחשבים ומשחקים"
    },
    {
      symbol: "MCD",
      company: "McDonald's",
      sector: "מזון",
      price: 290,
      note: "רשת מסעדות המבורגר גדולה ברחבי עולם"
    },
    {
      symbol: "SBUX",
      company: "Starbucks",
      sector: "משקאות",
      price: 330,
      note: "רשת קפה בינלאומית ידועה"
    },
    {
      symbol: "PYPL",
      company: "PayPal",
      sector: "תשלומים דיגיטליים",
      price: 290,
      note: "פלטפורמת תשלומים מקוונת"
    }
  ];

  const events = [
    {
      symbol: "AAPL",
      headline: "Apple משיקה סדרת מכשירים עם ביקוש גבוה מהתחזיות",
      impactPct: 9,
      details: "המכירות המוקדמות עקפו את התחזיות בוול סטריט."
    },
    {
      symbol: "MSFT",
      headline: "Microsoft מדווחת על צמיחה חזקה בשירותי Azure",
      impactPct: 7,
      details: "מנוע הצמיחה של הענן ממשיך להתרחב בקצב דו-ספרתי."
    },
    {
      symbol: "GOOGL",
      headline: "רגולטור באירופה פותח בדיקה חדשה נגד Alphabet",
      impactPct: -7,
      details: "חשש לקנס גבוה ולמגבלות פרסום בטווח הבינוני."
    },
    {
      symbol: "AMZN",
      headline: "Amazon משפרת רווחיות לוגיסטית ומקצרת זמני אספקה",
      impactPct: 5,
      details: "עלייה במרווח התפעולי בתחום המסחר המקוון."
    },
    {
      symbol: "TSLA",
      headline: "Tesla מכריזה על הורדת מחירים אגרסיבית במספר שווקים",
      impactPct: -9,
      details: "המשקיעים מודאגים מלחץ על שיעור הרווח הגולמי."
    },
    {
      symbol: "NVDA",
      headline: "ביקוש שיא לשבבי AI של NVIDIA במרכזי נתונים",
      impactPct: 11,
      details: "ספקיות ענן מדווחות על הזמנות חדשות משמעותיות."
    },
    {
      symbol: "META",
      headline: "Meta מגדילה הכנסות מפרסום בפלטפורמות וידאו",
      impactPct: 6,
      details: "המודלים לפרסום ממוקד משפרים את יחס ההמרה למפרסמים."
    },
    {
      symbol: "JPM",
      headline: "JPMorgan מפרישה סכומים גבוהים להפסדי אשראי",
      impactPct: -5,
      details: "עלייה בסיכון אשראי במגזר העסקי הקטן."
    },
    {
      symbol: "XOM",
      headline: "מחירי הנפט יורדים בעקבות צפי לעודף היצע",
      impactPct: -6,
      details: "הלחץ על סקטור האנרגיה מכביד על מניות הנפט."
    },
    {
      symbol: "KO",
      headline: "Coca-Cola סובלת מירידה במכירות בשל מגמת הבריאות",
      impactPct: -4,
      details: "צרכנים צעירים פונים למשקאות בריאים יותר, מה שפוגע בביקוש."
    },
    {
      symbol: "NKE",
      headline: "Nike שיתפה פעולה עם כוכב ספורט צעיר בשיווק חדש",
      impactPct: 8,
      details: "הקמפיין החדש מושך דור צעיר של צרכנים ספורטיביים."
    },
    {
      symbol: "DIS",
      headline: "Disney משיקה סרט קופה משבורים חדש שמעורר התלהבות",
      impactPct: 10,
      details: "חזוי על ידי מנתחים כהיט קופה ישיר הקרוב."
    },
    {
      symbol: "NFLX",
      headline: "Netflix מאבדת מנויים בשווקים מרכזיים לטובת מתחרים",
      impactPct: -7,
      details: "עלייה בתחרות מ-Disney+ ו-Apple TV+ מגדילה את נטישת המנויים."
    },
    {
      symbol: "SPOT",
      headline: "Spotify מדווחת על צמיחה בחיות הכללית שמונעות הערות חיוביות",
      impactPct: 7,
      details: "הרצוויות של אני המוסיקה גבוהות מהתחזיות במגזר הצעירים."
    },
    {
      symbol: "RBLX",
      headline: "Roblox משחקים חדשים אתר זעמי הכנסות בהטבעות תוך-משחק",
      impactPct: 12,
      details: "מעוניינים צעירים במשחקים וירטואליים מעלים הכנסות פי שלוש."
    },
    {
      symbol: "SNAP",
      headline: "Snapchat מדווחת על האטה חדה בצמיחת המשתמשים",
      impactPct: -8,
      details: "מתחרים כמו TikTok ו-Instagram גוזלים נתח שוק מהפלטפורמה."
    },
    {
      symbol: "INTC",
      headline: "Intel מפסידה עסקאות ספק גדולות לטובת AMD ו-NVIDIA",
      impactPct: -6,
      details: "לקוחות מרכזיים עוברים למתחרים בשל ביצועים טובים יותר."
    },
    {
      symbol: "MCD",
      headline: "McDonald's נפגעת מעליית מחירי חומרי הגלם והשכר",
      impactPct: -5,
      details: "עלויות ייצור גבוהות לוחצות על שיעורי הרווח של הרשת."
    },
    {
      symbol: "SBUX",
      headline: "Starbucks מרחיבה קטגוריות משקאות עם אפשרויות בריאות",
      impactPct: 7,
      details: "הגדילו בקטגוריות משקאות נמוכים קלוריות משכנעים צרכנים."
    },
    {
      symbol: "PYPL",
      headline: "PayPal מאבדת נתח שוק ל-Apple Pay וכרטיסי אשראי חכמים",
      impactPct: -7,
      details: "ירידה בהיקף העסקאות בעקבות תחרות גוברת מפלטפורמות תשלום מובנות."
    }
  ];

  const state = {
    allocations: Object.fromEntries(stocks.map((s) => [s.symbol, 0])),
    adjustments: Object.fromEntries(stocks.map((s) => [s.symbol, 0])),
    finished: false,
    eventIndex: 0,
    eventHistory: []
  };

  function formatMoney(value) {
    return new Intl.NumberFormat("he-IL", {
      maximumFractionDigits: 0
    }).format(Math.round(value));
  }

  function formatSignedPercent(value) {
    const rounded = Math.round(value * 10) / 10;
    const prefix = rounded > 0 ? "+" : "";
    return prefix + rounded.toFixed(1) + "%";
  }

  function usedBudget() {
    return stocks.reduce(
      (sum, stock) => sum + stock.price * (state.allocations[stock.symbol] || 0),
      0
    );
  }

  function wasteBudget() {
    return STARTING_BUDGET - usedBudget();
  }

  function currentStockValue(stock) {
    const qty = state.allocations[stock.symbol] || 0;
    const pct = state.adjustments[stock.symbol] || 0;
    const adjustedPrice = stock.price * (1 + pct / 100);
    return qty * adjustedPrice;
  }

  function totalPortfolioValue() {
    return wasteBudget() + stocks.reduce((sum, s) => sum + currentStockValue(s), 0);
  }

  function profitLoss() {
    return totalPortfolioValue() - STARTING_BUDGET;
  }

  function pctProfitLoss() {
    return (profitLoss() / STARTING_BUDGET) * 100;
  }

  function createSessionId() {
    return "portfolio-" + Math.random().toString(36).slice(2, 10);
  }

  function isMobileMode() {
    const params = new URLSearchParams(window.location.search);
    return params.get("mobile") === "1";
  }

  function mobileUrl() {
    const url = new URL(window.location.href);
    url.searchParams.set("mobile", "1");
    if (!url.searchParams.get("session")) {
      url.searchParams.set("session", createSessionId());
    }
    return url.toString();
  }

  function qrImageUrl(link) {
    return (
      "https://api.qrserver.com/v1/create-qr-code/?size=320x320&data=" +
      encodeURIComponent(link)
    );
  }

  function ensureNumber(value) {
    const num = Number(value);
    if (!Number.isFinite(num)) {
      return 0;
    }
    return num;
  }

  function setQty(symbol, nextQty) {
    const qty = Math.max(0, Math.floor(ensureNumber(nextQty)));
    const current = state.allocations[symbol] || 0;
    const stock = stocks.find((s) => s.symbol === symbol);
    if (!stock) {
      return;
    }

    state.allocations[symbol] = qty;
    if (wasteBudget() < 0) {
      state.allocations[symbol] = current;
      return;
    }
    render();
  }

  function setAdjustment(symbol, value) {
    const pct = Math.max(-100, Math.min(300, ensureNumber(value)));
    state.adjustments[symbol] = pct;
    renderTopBar();
    renderStockRows();
  }

  function stepAdjustment(symbol, delta) {
    setAdjustment(symbol, (state.adjustments[symbol] || 0) + delta);
  }

  function purchasedStocks() {
    return stocks.filter((stock) => (state.allocations[stock.symbol] || 0) > 0);
  }

  function nextEvent() {
    if (state.eventIndex >= events.length) {
      state.eventIndex = 0;
      state.eventHistory = [];
    }

    const event = events[state.eventIndex];
    state.eventHistory.unshift(event);
    state.eventIndex += 1;
    renderDesktopEventPanel(event);
  }

  function renderTopBar() {
    const topBar = document.getElementById("portfolioTopBar");
    if (!topBar) {
      return;
    }

    const total = totalPortfolioValue();
    const pnl = profitLoss();
    const pnlPct = pctProfitLoss();
    const pnlClass = pnl >= 0 ? "good" : "bad";

    topBar.innerHTML =
      "<div class=\"bar-item\"><span>שווי תיק</span><strong>" +
      formatMoney(total) +
      " ש\"ח</strong></div>" +
      "<div class=\"bar-item\"><span>רווח/הפסד</span><strong class=\"" +
      pnlClass +
      "\">" +
      (pnl >= 0 ? "+" : "") +
      formatMoney(pnl) +
      " ש\"ח (" +
      formatSignedPercent(pnlPct) +
      ")</strong></div>" +
      "<div class=\"bar-item\"><span>יתרה</span><strong>" +
      formatMoney(wasteBudget()) +
      " ש\"ח</strong></div>";
  }

  function renderStockRows() {
    const container = document.getElementById("stocksContainer");
    if (!container) {
      return;
    }

    const visibleStocks = state.finished ? purchasedStocks() : stocks;

    if (state.finished && visibleStocks.length === 0) {
      container.innerHTML =
        "<div class=\"stock-card empty-state\">" +
        "<p>לא נרכשו מניות עדיין. לחצו על \"ערוך מחדש\" ובחרו מניות לפני סיום.</p>" +
        "</div>";
      return;
    }

    container.innerHTML = visibleStocks
      .map((stock) => {
        const qty = state.allocations[stock.symbol] || 0;
        const pct = state.adjustments[stock.symbol] || 0;
        const baseValue = qty * stock.price;
        const currentValue = currentStockValue(stock);
        const canBuyOneMore = wasteBudget() >= stock.price;
        const pctClass = pct > 0 ? "good" : pct < 0 ? "bad" : "neutral";

        return (
          "<div class=\"stock-card\">" +
          "<div class=\"stock-pill-row\">" +
          (state.finished
            ? "<button class=\"impact-step\" data-impact-step=\"" +
              stock.symbol +
              "\" data-delta=\"-1\" aria-label=\"הורדה באחוז\">-</button>"
            : (qty > 0
                ? "<button class=\"impact-step\" data-sell=\"" +
                  stock.symbol +
                  "\" aria-label=\"בטל קניה אחת של " + stock.symbol + "\">−</button>"
                : "<div class=\"impact-step ghost\"></div>")) +
          "<div class=\"stock-pill-wrapper\" style=\"position:relative;display:flex;align-items:center;justify-content:center;\">" +
          "<button class=\"stock-pill " +
          (!state.finished && !canBuyOneMore ? "disabled" : "") +
          "\" data-buy=\"" +
          stock.symbol +
          "\" " +
          (state.finished ? "disabled" : "") +
          " aria-label=\"קנה מניה אחת של " +
          stock.symbol +
          "\">" +
          "<span class=\"pill-symbol\">" +
          stock.symbol +
          "</span>" +
          "<span class=\"pill-price\">" +
          formatMoney(stock.price) +
          " ש\"ח</span>" +
          "</button>" +
          "<span class=\"stock-info-icon\" data-stock-symbol=\"" + stock.symbol + "\" style=\"position:absolute;right:-12px;top:-12px;background:#0ea5e9;color:white;width:24px;height:24px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-weight:bold;cursor:pointer;font-size:14px;border:2px solid white;box-shadow:0 2px 8px rgba(0,0,0,0.2);\">ℹ</span>" +
          "</div>" +
          (state.finished
            ? "<button class=\"impact-step\" data-impact-step=\"" +
              stock.symbol +
              "\" data-delta=\"1\" aria-label=\"העלאה באחוז\">+</button>"
            : "<div class=\"impact-step ghost\"></div>") +
          "</div>" +
          "<div class=\"stock-meta\">" +
          "<span>כמות: <strong>" + qty + "</strong></span>" +
          "<span>עלות: <strong>" + formatMoney(baseValue) + " ש\"ח</strong></span>" +
          (state.finished
            ? "<span>שינוי: <strong class=\"" + pctClass + "\">" + formatSignedPercent(pct) + "</strong></span>"
            : "") +
          "</div>" +
          (state.finished
            ? "<div class=\"value-line\">שווי מעודכן: <strong>" +
              formatMoney(currentValue) +
              " ש\"ח</strong></div>"
            : "") +
          "</div>"
        );
      })
      .join("");

    container.querySelectorAll("button[data-buy]").forEach((button) => {
      button.addEventListener("click", (event) => {
        const target = event.currentTarget;
        const symbol = target.getAttribute("data-buy");
        if (!symbol || state.finished) {
          return;
        }
        setQty(symbol, (state.allocations[symbol] || 0) + 1);
      });
    });

    container.querySelectorAll("button[data-sell]").forEach((button) => {
      button.addEventListener("click", (event) => {
        const target = event.currentTarget;
        const symbol = target.getAttribute("data-sell");
        if (!symbol || state.finished) {
          return;
        }
        setQty(symbol, (state.allocations[symbol] || 0) - 1);
      });
    });

    container.querySelectorAll("button[data-impact-step]").forEach((button) => {
      button.addEventListener("click", (event) => {
        const target = event.currentTarget;
        const symbol = target.getAttribute("data-impact-step");
        const delta = ensureNumber(target.getAttribute("data-delta"));
        if (!symbol) {
          return;
        }
        stepAdjustment(symbol, delta);
      });
    });

    container.querySelectorAll("span.stock-info-icon").forEach((icon) => {
      icon.addEventListener("click", (event) => {
        event.stopPropagation();
        const symbol = event.currentTarget.getAttribute("data-stock-symbol");
        const stock = stocks.find((s) => s.symbol === symbol);
        if (!stock) {
          return;
        }
        
        const popup = document.createElement("div");
        popup.style.cssText = "position:fixed;top:50%;left:50%;transform:translate(-50%,-50%);background:white;border:2px solid #0ea5e9;border-radius:12px;padding:20px;width:80%;max-width:400px;z-index:1000;box-shadow:0 10px 40px rgba(0,0,0,0.3);";
        popup.innerHTML = 
          "<div style='text-align:right;'>" +
          "<h3 style='margin:0 0 10px 0;color:#0f172a;font-size:24px;'>" + stock.company + " (" + stock.symbol + ")</h3>" +
          "<p style='margin:8px 0;color:#0f766e;font-weight:bold;'>סקטור: " + stock.sector + "</p>" +
          "<p style='margin:8px 0;color:#0f172a;line-height:1.6;'>" + stock.note + "</p>" +
          "<p style='margin:12px 0 0 0;color:#64748b;font-size:14px;'>מחיר: " + formatMoney(stock.price) + " ש\"ח</p>" +
          "<button id='closePopupBtn' style='margin-top:16px;background:#0ea5e9;color:white;border:none;padding:8px 16px;border-radius:6px;cursor:pointer;font-weight:bold;width:100%;'>סגור</button>" +
          "</div>";
        
        document.body.appendChild(popup);
        
        const closeBtn = popup.querySelector("#closePopupBtn");
        closeBtn.addEventListener("click", () => {
          popup.remove();
        });
        
        popup.addEventListener("click", (e) => {
          if (e.target === popup) {
            popup.remove();
          }
        });
      });
    });
  }

  function renderDesktopEventPanel(activeEvent) {
    const eventPanel = document.getElementById("eventPanel");
    const history = document.getElementById("eventHistory");
    if (!eventPanel || !history) {
      return;
    }

    if (activeEvent) {
      const impactClass = activeEvent.impactPct >= 0 ? "good" : "bad";
      eventPanel.innerHTML =
        "<h3>אירוע נוכחי</h3>" +
        "<p class=\"headline\">" + activeEvent.headline + "</p>" +
        "<p class=\"details\">" + activeEvent.details + "</p>" +
        "<p>מניה מושפעת: <strong>" + activeEvent.symbol + "</strong></p>" +
        "<p>שינוי מוצע: <strong class=\"" +
        impactClass +
        "\">" +
        formatSignedPercent(activeEvent.impactPct) +
        "</strong></p>";
    }

    history.innerHTML = state.eventHistory
      .map(
        (event) =>
          "<li><strong>" +
          event.symbol +
          "</strong> - " +
          event.headline +
          " (" +
          formatSignedPercent(event.impactPct) +
          ")</li>"
      )
      .join("");
  }

  function renderMobile() {
    app.innerHTML =
      "<div class=\"mobile-shell\">" +
      "<div id=\"portfolioTopBar\" class=\"top-bar\"></div>" +
      "<main class=\"mobile-main\">" +
      "<section class=\"intro card\">" +
      "<h1>תיק ההשקעות שלי</h1>" +
      "<p>התחל עם 10,000 ש\"ח. לחיצה על עיגול מניה מגדילה את הכמות ב-1, והרכישה נסגרת רק בלחיצה על \"סיימתי\".</p>" +
      "<p class=\"budget\">תקציב פתיחה: <strong>" +
      formatMoney(STARTING_BUDGET) +
      " ש\"ח</strong></p>" +
      "</section>" +
      "<section id=\"stocksContainer\" class=\"stocks\"></section>" +
      "<section class=\"card finish\">" +
      "<button id=\"finishBtn\" class=\"finish-btn\">" +
      (state.finished ? "ערוך מחדש" : "סיימתי") +
      "</button>" +
      "<p>לאחר סיום יוצגו רק המניות שרכשתם, ויופיעו כפתורי + ו-- לעדכון אחוזי שינוי לפי אירועי המדריך.</p>" +
      "</section>" +
      "</main>" +
      "</div>" +
      "<style>" +
      "body{margin:0;background:#0b1220;color:#e2e8f0;font-family:Arial,sans-serif;}" +
      ".top-bar{position:fixed;top:0;right:0;left:0;z-index:20;display:flex;gap:6px;padding:8px;background:#ecfeff;border-bottom:1px solid #a5f3fc;box-shadow:0 6px 20px rgba(8,145,178,0.18);}" +
      ".bar-item{flex:1;min-width:0;background:#ffffff;border:1px solid #bae6fd;border-radius:10px;padding:6px 4px;text-align:center;}" +
      ".bar-item span{display:block;font-size:10px;color:#0f766e;margin-bottom:2px;font-weight:700;}" +
      ".bar-item strong{font-size:12px;color:#0f172a;}" +
      ".good{color:#22c55e!important;}.bad{color:#f87171!important;}" +
      ".neutral{color:#334155!important;}" +
      ".mobile-main{max-width:860px;margin:0 auto;padding:88px 12px 24px;}" +
      ".card{background:#111827;border:1px solid #334155;border-radius:14px;padding:14px;}" +
      ".intro h1{margin:0 0 8px;font-size:24px;color:#f8fafc;}" +
      ".intro p{margin:0 0 8px;line-height:1.55;color:#cbd5e1;}" +
      ".budget strong{color:#fde68a;}" +
      ".stocks{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:10px;margin-top:12px;}" +
      ".stock-card{background:#111827;border:1px solid #334155;border-radius:14px;padding:12px;}" +
      ".empty-state{grid-column:1/-1;text-align:center;color:#cbd5e1;line-height:1.6;}" +
      ".stock-pill-row{display:grid;grid-template-columns:34px 1fr 34px;gap:8px;align-items:center;}" +
      ".stock-pill{width:100%;aspect-ratio:1/1;border-radius:999px;border:2px solid #dbeafe;background:#ffffff;color:#0f172a;display:flex;flex-direction:column;justify-content:center;align-items:center;gap:4px;cursor:pointer;padding:4px 2px;line-height:1.2;}" +
      ".stock-pill.disabled{opacity:0.55;cursor:not-allowed;}" +
      ".pill-symbol{font-size:15px;font-weight:800;color:#0f172a;}" +
      ".pill-price{font-size:11px;font-weight:700;color:#0f766e;}" +
      ".impact-step{width:34px;height:34px;border-radius:999px;border:1px solid #67e8f9;background:#ecfeff;color:#0f766e;font-size:20px;font-weight:800;cursor:pointer;display:flex;align-items:center;justify-content:center;padding:0;}" +
      ".impact-step.ghost{visibility:hidden;}" +
      ".stock-meta{display:flex;justify-content:space-between;gap:8px;margin-top:8px;font-size:11px;color:#94a3b8;flex-wrap:wrap;}" +
      ".stock-meta strong{color:#e2e8f0;}" +
      ".value-line{margin-top:6px;font-size:12px;color:#cbd5e1;}" +
      ".value-line strong{color:#f8fafc;}" +
      ".finish{margin-top:12px;text-align:center;}" +
      ".finish-btn{width:100%;border:0;border-radius:10px;padding:12px;background:#0ea5e9;color:#06283d;font-weight:700;cursor:pointer;}" +
      ".finish-btn:hover{background:#38bdf8;}" +
      "@media (max-width:700px){.mobile-main{padding-top:86px;}.stocks{grid-template-columns:repeat(2,minmax(0,1fr));}.stock-pill-row{grid-template-columns:30px 1fr 30px;gap:6px;}.impact-step{width:30px;height:30px;font-size:18px;}.pill-symbol{font-size:13px;}.pill-price{font-size:10px;}.stock-meta{font-size:10px;}}" +
      "@media (max-width:420px){.top-bar{gap:4px;padding:6px;}.bar-item{padding:5px 3px;}.bar-item span{font-size:9px;}.bar-item strong{font-size:11px;}.stocks{gap:8px;}.stock-card{padding:8px;}}" +
      "</style>";

    renderTopBar();
    renderStockRows();

    const finishBtn = document.getElementById("finishBtn");
    if (finishBtn) {
      finishBtn.addEventListener("click", function () {
        state.finished = !state.finished;
        renderMobile();
      });
    }
  }

  function renderDesktop() {
    const link = mobileUrl();

    app.innerHTML =
      "<div class=\"desktop\">" +
      "<header class=\"card\">" +
      "<h1>תיק ההשקעות שלי - מסך מדריך</h1>" +
      "<p>1) סרקו את הברקוד. 2) בנו תיק ב-10,000 ש\"ח. 3) לחצו \"סיימתי\" בנייד. 4) הקריאו אירועים ולתלמידים להזין אחוז שינוי לכל מניה.</p>" +
      "</header>" +
      "<section class=\"grid\">" +
      "<div class=\"card qr\">" +
      "<h2>סריקה לנייד</h2>" +
      "<img src=\"" +
      qrImageUrl(link) +
      "\" alt=\"QR לפתיחת תיק השקעות בנייד\" />" +
      "<p class=\"small\">אם אין סריקה: <a href=\"" +
      link +
      "\" target=\"_blank\" rel=\"noreferrer\">פתח את הקישור בנייד</a></p>" +
      "</div>" +
      "<div class=\"card events\">" +
      "<div class=\"events-head\">" +
      "<h2>אירועי שוק (10 אירועים)</h2>" +
      "<button id=\"eventBtn\">אירוע</button>" +
      "</div>" +
      "<div id=\"eventPanel\" class=\"event-panel\">" +
      "<h3>מוכנים להתחיל?</h3><p>לחצו על \"אירוע\" כדי להציג אירוע ראשון.</p>" +
      "</div>" +
      "<h3>אירועים שהוצגו</h3>" +
      "<ul id=\"eventHistory\" class=\"history\"></ul>" +
      "</div>" +
      "</section>" +
      "</div>" +
      "<style>" +
      "body{margin:0;background:linear-gradient(165deg,#0b1220,#111827 50%,#1f2937);color:#e2e8f0;font-family:Arial,sans-serif;}" +
      ".desktop{max-width:1100px;margin:0 auto;padding:18px 14px 30px;}" +
      ".card{background:#111827cc;border:1px solid #334155;border-radius:16px;padding:16px;}" +
      "header h1{margin:0 0 10px;color:#f8fafc;font-size:30px;}" +
      "header p{margin:0;color:#cbd5e1;line-height:1.6;}" +
      ".grid{display:grid;grid-template-columns:360px 1fr;gap:14px;margin-top:14px;}" +
      ".qr img{width:100%;max-width:320px;display:block;margin:10px auto;border-radius:14px;background:#fff;padding:8px;}" +
      ".small{font-size:13px;color:#94a3b8;}" +
      ".small a{color:#7dd3fc;}" +
      ".events-head{display:flex;justify-content:space-between;gap:10px;align-items:center;margin-bottom:8px;}" +
      ".events-head h2{margin:0;color:#f8fafc;}" +
      "#eventBtn{border:0;background:#22c55e;color:#052e16;font-weight:700;padding:10px 14px;border-radius:10px;cursor:pointer;}" +
      "#eventBtn:hover{background:#4ade80;}" +
      ".event-panel{background:#0f172a;border:1px solid #334155;border-radius:12px;padding:12px;margin-bottom:10px;}" +
      ".event-panel h3{margin:0 0 8px;color:#f8fafc;}" +
      ".headline{font-weight:700;color:#dbeafe;}" +
      ".details{color:#cbd5e1;}" +
      ".good{color:#22c55e;}.bad{color:#f87171;}" +
      ".history{margin:0;padding-right:18px;display:grid;gap:8px;}" +
      ".history li{line-height:1.5;color:#cbd5e1;}" +
      "@media (max-width:920px){.grid{grid-template-columns:1fr;}}" +
      "</style>";

    const btn = document.getElementById("eventBtn");
    if (btn) {
      btn.addEventListener("click", nextEvent);
    }
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