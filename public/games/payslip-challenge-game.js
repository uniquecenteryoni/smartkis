(function () {
  const app = document.getElementById("app");
  if (!app) {
    return;
  }

  const scenario = {
    employee: "אילן",
    job: "עובד בחנות ספרים",
    month: "אפריל 2026",
    hourlyRate: 50,
    regularHours: 43,
    regularPay: 2150,
    overtime125Hours: 8,
    overtime125Rate: 62.5,
    overtime125Pay: 500,
    overtime150Hours: 6,
    overtime150Rate: 75,
    overtime150Pay: 450,
    gross: 3100,
    deductions: 300,
    net: 2800
  };

  const answerKey = {
    regularPay: scenario.regularPay,
    overtime125: scenario.overtime125Pay,
    overtime150: scenario.overtime150Pay,
    gross: scenario.gross,
    net: scenario.net,
    deductions: scenario.deductions
  };

  const state = {
    values: {
      regularPay: "",
      overtime125: "",
      overtime150: "",
      gross: "",
      net: "",
      deductions: ""
    },
    checked: false,
    results: {
      regularPay: false,
      overtime125: false,
      overtime150: false,
      gross: false,
      net: false,
      deductions: false
    }
  };

  function formatMoney(value) {
    return new Intl.NumberFormat("he-IL", { maximumFractionDigits: 0 }).format(value);
  }

  function ensureNumber(value) {
    const n = Number(String(value).replace(/,/g, "").trim());
    return Number.isFinite(n) ? n : NaN;
  }

  function createSessionId() {
    return "payslip-" + Math.random().toString(36).slice(2, 10);
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
    return "https://api.qrserver.com/v1/create-qr-code/?size=320x320&data=" + encodeURIComponent(link);
  }

  function isCorrectField(name) {
    const entered = ensureNumber(state.values[name]);
    if (!Number.isFinite(entered)) {
      return false;
    }
    return Math.abs(entered - answerKey[name]) < 0.5;
  }

  function allCorrect() {
    return Object.keys(state.results).every(function (key) {
      return state.results[key];
    });
  }

  function updateField(name, value) {
    state.values[name] = value;
    state.checked = false;
  }

  function checkAnswers() {
    state.results.gross = isCorrectField("gross");
    state.results.net = isCorrectField("net");
    state.results.overtime = isCorrectField("overtime");
    state.results.deductions = isCorrectField("deductions");
    state.checked = true;
    renderMobile();
  }

  function resetAnswers() {
    state.values = {
      regularPay: "",
      overtime125: "",
      overtime150: "",
      gross: "",
      net: "",
      deductions: ""
    };
    state.checked = false;
    state.results = {
      regularPay: false,
      overtime125: false,
      overtime150: false,
      gross: false,
      net: false,
      deductions: false
    };
    renderMobile();
  }

  function resultBadge(field) {
    if (!state.checked) {
      return "";
    }
    return state.results[field]
      ? "<span class=\"ok\">✓ נכון</span>"
      : "<span class=\"bad\">✗ נסו שוב</span>";
  }

  function row(label, valueHtml, given) {
    return (
      "<div class=\"row\">" +
      "<div class=\"label\">" + label + "</div>" +
      "<div class=\"value\">" +
      (given
        ? "<span class=\"given\">" + valueHtml + "</span>"
        : valueHtml) +
      "</div>" +
      "</div>"
    );
  }

  function renderMobile() {
    app.innerHTML =
      "<div class=\"mobile\">" +
      "<header class=\"hero\">" +
      "<h1>אתגר התלוש</h1>" +
      "<p>קראו את הסיפור ומלאו את השדות החסרים בתלוש.</p>" +
      "</header>" +

      "<section class=\"story card\">" +
      "<h2>הסיפור של " + scenario.employee + "</h2>" +
      "<p>" +
      scenario.employee + " היא " + scenario.job + " בחודש " + scenario.month + ". " +
      "הוא מקבל " + formatMoney(scenario.hourlyRate) + " ש\"ח לשעה, ועבד החודש " +
      scenario.regularHours + " שעות רגילות, " + scenario.overtime125Hours +
      " שעות נוספות של 125% ו-" + scenario.overtime150Hours +
      " שעות נוספות של 150%. בנוסף, אילן שילם " +
      formatMoney(scenario.deductions) + " ש\"ח למס הכנסה." +
      "</p>" +
      "<p class=\"hint\">עליכם להשלים: סכום שעות רגילות, סכום שעות נוספות 125%, סכום שעות נוספות 150%, שכר ברוטו, ניכויי שכר ושכר נטו.</p>" +
      "</section>" +

      "<section class=\"card payslip\">" +
      "<h2>תלוש משכורת מדומה</h2>" +
      row("תעריף לשעה", formatMoney(scenario.hourlyRate) + " ש\"ח", true) +
      row("שעות רגילות", scenario.regularHours + " שעות", true) +
      row(
        "סכום שעות רגילות",
        "<input data-field=\"regularPay\" type=\"number\" value=\"" + state.values.regularPay + "\" placeholder=\"הכניסו סכום\" />" + resultBadge("regularPay"),
        false
      ) +
      row("שעות נוספות 125%", scenario.overtime125Hours + " שעות", true) +
      row(
        "סכום שעות נוספות 125%",
        "<input data-field=\"overtime125\" type=\"number\" value=\"" + state.values.overtime125 + "\" placeholder=\"הכניסו סכום\" />" + resultBadge("overtime125"),
        false
      ) +
      row("שעות נוספות 150%", scenario.overtime150Hours + " שעות", true) +
      row(
        "סכום שעות נוספות 150%",
        "<input data-field=\"overtime150\" type=\"number\" value=\"" + state.values.overtime150 + "\" placeholder=\"הכניסו סכום\" />" + resultBadge("overtime150"),
        false
      ) +
      row(
        "שכר ברוטו",
        "<input data-field=\"gross\" type=\"number\" value=\"" + state.values.gross + "\" placeholder=\"הכניסו סכום\" />" + resultBadge("gross"),
        false
      ) +
      row(
        "ניכויי שכר",
        "<input data-field=\"deductions\" type=\"number\" value=\"" + state.values.deductions + "\" placeholder=\"הכניסו סכום\" />" + resultBadge("deductions"),
        false
      ) +
      row(
        "שכר נטו",
        "<input data-field=\"net\" type=\"number\" value=\"" + state.values.net + "\" placeholder=\"הכניסו סכום\" />" + resultBadge("net"),
        false
      ) +
      "</section>" +

      "<section class=\"actions\">" +
      "<button id=\"checkBtn\" class=\"primary\">בדיקת תשובות</button>" +
      "<button id=\"resetBtn\" class=\"secondary\">איפוס</button>" +
      "</section>" +

      (state.checked && allCorrect()
        ? "<section class=\"success\">מעולה! כל הרובריקות הושלמו נכון ✅</section>"
        : "") +
      "</div>" +

      "<style>" +
      "body{margin:0;background:#0f172a;color:#e2e8f0;font-family:Arial,sans-serif;}" +
      ".mobile{max-width:900px;margin:0 auto;padding:14px;}" +
      ".card{background:#111827;border:1px solid #334155;border-radius:16px;padding:14px;margin-bottom:12px;}" +
      ".hero{background:linear-gradient(135deg,#0ea5e9,#22d3ee);border-radius:16px;padding:14px;margin-bottom:12px;color:#052637;}" +
      ".hero h1{margin:0 0 4px;font-size:30px;}" +
      ".hero p{margin:0;font-size:16px;font-weight:700;}" +
      ".story h2,.payslip h2{margin:0 0 8px;font-size:24px;color:#f8fafc;}" +
      ".story p{margin:0 0 8px;line-height:1.6;color:#dbeafe;font-size:15px;}" +
      ".hint{color:#fef08a;font-weight:700;}" +
      ".row{display:grid;grid-template-columns:1fr 1.2fr;gap:10px;align-items:center;padding:8px 0;border-bottom:1px dashed #334155;}" +
      ".row:last-child{border-bottom:0;}" +
      ".label{font-size:15px;color:#cbd5e1;font-weight:700;}" +
      ".value{display:flex;gap:8px;align-items:center;justify-content:flex-start;flex-wrap:wrap;}" +
      ".given{display:inline-block;background:#1e293b;border:1px solid #334155;border-radius:10px;padding:8px 10px;font-weight:700;}" +
      "input{width:180px;max-width:100%;padding:8px 10px;border-radius:10px;border:1px solid #475569;background:#0b1220;color:#e2e8f0;font-size:15px;}" +
      ".actions{display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-bottom:10px;}" +
      "button{border:0;border-radius:10px;padding:11px 12px;font-weight:700;cursor:pointer;}" +
      ".primary{background:#22c55e;color:#052e16;}" +
      ".primary:hover{background:#4ade80;}" +
      ".secondary{background:#334155;color:#e2e8f0;}" +
      ".secondary:hover{background:#475569;}" +
      ".ok{color:#22c55e;font-weight:700;font-size:13px;}" +
      ".bad{color:#f87171;font-weight:700;font-size:13px;}" +
      ".success{background:#14532d;border:1px solid #22c55e;color:#dcfce7;padding:12px;border-radius:12px;text-align:center;font-weight:800;}" +
      "@media (max-width:640px){.row{grid-template-columns:1fr;}.actions{grid-template-columns:1fr;}}" +
      "</style>";

    app.querySelectorAll("input[data-field]").forEach(function (input) {
      input.addEventListener("input", function (event) {
        const target = event.target;
        const name = target.getAttribute("data-field");
        if (!name) {
          return;
        }
        updateField(name, target.value);
      });
    });

    const checkBtn = document.getElementById("checkBtn");
    if (checkBtn) {
      checkBtn.addEventListener("click", checkAnswers);
    }

    const resetBtn = document.getElementById("resetBtn");
    if (resetBtn) {
      resetBtn.addEventListener("click", resetAnswers);
    }
  }

  function renderDesktop() {
    const link = mobileUrl();
    app.innerHTML =
      "<div class=\"desktop\">" +
      "<header class=\"card\">" +
      "<h1>אתגר התלוש - מסך מדריך</h1>" +
      "<p>סרקו את הברקוד. בטלפון תופיע לתלמידים משימת מילוי תלוש מדומה לפי סיפור קצר.</p>" +
      "</header>" +
      "<section class=\"grid\">" +
      "<div class=\"card qr\">" +
      "<h2>סריקה לנייד</h2>" +
      "<img src=\"" + qrImageUrl(link) + "\" alt=\"QR לפתיחת אתגר התלוש בנייד\" />" +
      "<p class=\"small\">אם אין סריקה: <a href=\"" + link + "\" target=\"_blank\" rel=\"noreferrer\">פתח בנייד</a></p>" +
      "</div>" +
      "<div class=\"card info\">" +
      "<h2>מה מופיע לתלמידים</h2>" +
      "<ul>" +
      "<li>סיפור קצר על אילן שעובד בחנות ספרים</li>" +
      "<li>תלוש משכורת מדומה עם רובריקות חסרות</li>" +
      "<li>מילוי שדות: שעות רגילות, שעות נוספות 125%, שעות נוספות 150%, ברוטו, ניכויים ונטו</li>" +
      "</ul>" +
      "<p class=\"tip\">פתרון המקרה: שעות רגילות 2,150, שעות נוספות 125% = 500, שעות נוספות 150% = 450, ברוטו 3,100, ניכויים 300, נטו 2,800.</p>" +
      "</div>" +
      "</section>" +
      "</div>" +
      "<style>" +
      "body{margin:0;background:linear-gradient(165deg,#0b1220,#111827 50%,#1f2937);color:#e2e8f0;font-family:Arial,sans-serif;}" +
      ".desktop{max-width:1100px;margin:0 auto;padding:18px 14px 30px;}" +
      ".card{background:#111827cc;border:1px solid #334155;border-radius:16px;padding:16px;}" +
      "header h1{margin:0 0 10px;color:#f8fafc;font-size:30px;}" +
      "header p{margin:0;color:#cbd5e1;line-height:1.6;font-size:18px;}" +
      ".grid{display:grid;grid-template-columns:360px 1fr;gap:14px;margin-top:14px;}" +
      ".qr img{width:100%;max-width:320px;display:block;margin:10px auto;border-radius:14px;background:#fff;padding:8px;}" +
      ".small{font-size:13px;color:#94a3b8;}" +
      ".small a{color:#7dd3fc;}" +
      ".info h2,.qr h2{margin-top:0;color:#f8fafc;font-size:24px;}" +
      ".info ul{margin:0;padding-right:18px;display:grid;gap:8px;color:#cbd5e1;font-size:17px;}" +
      ".tip{margin-top:14px;background:#052e16;border:1px solid #22c55e;color:#dcfce7;border-radius:10px;padding:10px;font-weight:700;}" +
      "@media (max-width:920px){.grid{grid-template-columns:1fr;}}" +
      "</style>";
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
