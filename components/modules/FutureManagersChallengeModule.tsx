import React, { useEffect, useMemo, useState } from 'react';
import ModuleView from '../ModuleView';

interface FutureManagersChallengeModuleProps {
  onBack: () => void;
  title: string;
  onComplete: () => void;
}

const INITIAL_BUDGET = 5000;

type CategoryId = 'food' | 'gaming' | 'style' | 'entertainment' | 'gifts';

interface Category {
  id: CategoryId;
  title: string;
  icon: string;
  color: string;
  isWeekly: boolean;
}

const CATEGORIES: Record<CategoryId, Category> = {
  food: { id: 'food', title: 'אוכל ופינוקים', icon: '🍔', color: '#f97316', isWeekly: true },
  gaming: { id: 'gaming', title: 'מסכים וגיימינג', icon: '🎮', color: '#6366f1', isWeekly: false },
  style: { id: 'style', title: 'בגדים וסטייל', icon: '🛍️', color: '#ec4899', isWeekly: false },
  entertainment: { id: 'entertainment', title: 'יציאות ובילויים', icon: '🎡', color: '#22c55e', isWeekly: true },
  gifts: { id: 'gifts', title: 'מתנות ואירועים', icon: '🎁', color: '#ef4444', isWeekly: false }
};

interface GroupTask {
  desc: string;
  steps: string[];
  res: string;
}

const GROUP_TASKS: Record<number, Record<CategoryId, GroupTask>> = {
  1: {
    food: { desc: 'ערב פיצה משפחתי', steps: ['בחרו פיצרייה מוכרת.', 'מצאו מחיר ל-2 מגשי משפחתית.', 'הוסיפו שתייה ומשלוח.'], res: 'חפשו "מבצעי משלוחים" באתרי פיצה.' },
    gaming: { desc: 'משחק AAA חדש', steps: ['בחרו משחק שיצא השנה.', 'מצאו מחיר עותק פיזי בחנות.', 'בדקו אם יש הנחת מועדון.'], res: 'חפשו שם משחק + מחיר.' },
    style: { desc: 'נעלי ספורט למותג', steps: ['מצאו דגם Nike Air Force 1.', 'חפשו מחיר בחנות אונליין.', 'ודאו שהמחיר מקורי.'], res: 'חפשו "נעלי נייקי מחיר".' },
    entertainment: { desc: 'קולנוע זוגי', steps: ['מחיר ל-2 כרטיסים.', 'הוסיפו פופקורן ושתייה.', 'בדקו הנחות 1+1.'], res: 'אתר סינמה סיטי או יס פלאנט.' },
    gifts: { desc: 'מתנה לחבר טוב', steps: ['בחרו אוזניות גיימינג או בובה.', 'מצאו מחיר לדגם ספציפי.', 'הוסיפו 15 ש"ח עטיפה.'], res: 'חפשו "אוזניות גיימינג מחיר".' }
  },
  2: {
    food: { desc: 'ארוחת המבורגרים', steps: ['מצאו מחיר ל-4 ארוחות קומבו.', 'בדקו ברשת מקדונלדס.', 'חפשו "ארוחה משפחתית".'], res: 'חפשו "מקדונלדס תפריט".' },
    gaming: { desc: 'מנויי סטרימינג', steps: ['מחיר חודשי לנטפליקס.', 'מחיר חודשי לספוטיפיי.', 'חברו את המחירים.'], res: 'חפשו "מחיר נטפליקס ישראל".' },
    style: { desc: 'חליפת טרנינג', steps: ['חפשו מכנסיים + קפוצון.', 'בחרו רשת (קסטרו/פוקס).', 'חברו את המחירים.'], res: 'חפשו "חליפת טרנינג" באתרי אופנה.' },
    entertainment: { desc: 'תחרות באולינג', steps: ['מחיר ל-2 משחקים לאדם.', 'הכפילו ב-4 חברים.', 'הוסיפו השכרת נעליים.'], res: 'חפשו "באולינג מחירים".' },
    gifts: { desc: 'יום הולדת להורים', steps: ['זר פרחים או שוקולד יוקרתי.', 'מצאו מחיר למארז הכי יפה.', 'הוסיפו מחיר משלוח.'], res: 'חפשו "משלוח פרחים מחיר".' }
  },
  3: {
    food: { desc: 'מסיבת ממתקים', steps: ['חפשו 10 שקיות חטיפים.', 'הוסיפו 4 בקבוקי שתייה.', 'חשבו עלות שבועית.'], res: 'אתר "שופרסל Online".' },
    gaming: { desc: 'מטבעות וירטואליים', steps: ['בחרו פורטנייט או רובלוקס.', 'חפשו חבילת מטבעות.', 'המרו לשקלים (3.7 לדולר).'], res: 'חפשו "Fortnite V-Bucks price".' },
    style: { desc: 'עיצוב החדר', steps: ['בחרו פס לד וכרית נוי.', 'מצאו מחיר באיקאה.', 'חברו את המחירים.'], res: 'חפשו "אקססוריז לחדר".' },
    entertainment: { desc: 'פארק טרמפולינות', steps: ['מחיר לשעה קפיצה.', 'הוסיפו גרביים מונעות החלקה.', 'מחיר לאדם אחד.'], res: 'חפשו "איי גאמפ מחירים".' },
    gifts: { desc: 'מתנה למורה', steps: ['בחרו עציץ או ספר.', 'מצאו מחיר בחנות.', 'הוסיפו כרטיס ברכה.'], res: 'חפשו "סטימצקי" או "משתלה".' }
  },
  4: {
    food: { desc: 'גלידה משפחתית', steps: ['מחיר ל-1 ק"ג גלידה.', 'הוסיפו 4 גביעים.', 'הוסיפו רטבים בתשלום.'], res: 'חפשו "גולדה מחיר קילו".' },
    gaming: { desc: 'ציוד למחשב', steps: ['עכבר גיימינג או מקלדת.', 'חפשו דגם מותג בינוני.', 'מצאו מחיר בחנות.'], res: 'חפשו "עכבר גיימינג מחיר".' },
    style: { desc: 'חולצת כדורגל', steps: ['בחרו קבוצה אהובה.', 'חפשו חולצה רשמית 2024.', 'בדקו בחנות ספורט.'], res: 'חפשו "חולצת כדורגל רשמית מחיר".' },
    entertainment: { desc: 'חדר בריחה', steps: ['חדר שמתאים לילדים.', 'מחיר לאדם בקבוצה של 5.', 'שימו לב: המחיר יורד כשיש יותר אנשים.'], res: 'חפשו "חדר בריחה מחירים".' },
    gifts: { desc: 'מתנה לאח/אחות', steps: ['ערכת לגו או משחק קופסה.', 'מצאו מחיר בחנות צעצועים.', 'ודאו שזה דגם פופולרי.'], res: 'חפשו "ערכת לגו מחיר".' }
  }
};

const RANDOM_EVENTS = [
  { text: 'איבדתם את הרב-קו! עלות חדש: 100 ₪.', cost: 100 },
  { text: 'סבא וסבתא הביאו דמי כיס: 200 ₪ בונוס!', cost: -200 },
  { text: 'קניתם ממתקים בטעות ב-150 ₪.', cost: 150 },
  { text: 'עזרתם לשכנה וקיבלתם 50 ₪.', cost: -50 }
];

interface Group {
  id: number;
  name: string;
  salary: number;
  expenses: Partial<Record<CategoryId, number>>;
  balance: number;
}

const allCategoryIds: CategoryId[] = ['food', 'gaming', 'style', 'entertainment', 'gifts'];

const FutureManagersChallengeModule: React.FC<FutureManagersChallengeModuleProps> = ({ onBack, title, onComplete }) => {
  const [groups, setGroups] = useState<Group[]>([
    { id: 1, name: 'צוות אלפא', salary: INITIAL_BUDGET, expenses: {}, balance: INITIAL_BUDGET },
    { id: 2, name: 'צוות גלקסיה', salary: INITIAL_BUDGET, expenses: {}, balance: INITIAL_BUDGET },
    { id: 3, name: 'צוות פניקס', salary: INITIAL_BUDGET, expenses: {}, balance: INITIAL_BUDGET },
    { id: 4, name: 'צוות דרקון', salary: INITIAL_BUDGET, expenses: {}, balance: INITIAL_BUDGET }
  ]);
  const [activeCategoryId, setActiveCategoryId] = useState<CategoryId | null>(null);
  const [selectedGroup, setSelectedGroup] = useState<Group | null>(null);
  const [inputValue, setInputValue] = useState('');
  const [eventMessage, setEventMessage] = useState('');
  const [isCompleted, setIsCompleted] = useState(false);

  const calculateTotalExpenses = (group: Group) => Object.values(group.expenses).reduce((sum, value) => sum + (value ?? 0), 0);

  const closeModal = () => {
    setActiveCategoryId(null);
    setSelectedGroup(null);
    setInputValue('');
  };

  const updateBudget = (groupId: number, catId: CategoryId, amount: string) => {
    const numericAmount = Number(amount);
    if (Number.isNaN(numericAmount) || numericAmount < 0) {
      return;
    }

    const isWeekly = CATEGORIES[catId].isWeekly;
    const finalAmount = isWeekly ? numericAmount * 4 : numericAmount;

    setGroups(prev => prev.map(group => {
      if (group.id !== groupId) {
        return group;
      }
      const newExpenses = { ...group.expenses, [catId]: finalAmount };
      const totalExpenses = Object.values(newExpenses).reduce((sum, value) => sum + (value ?? 0), 0);
      return {
        ...group,
        expenses: newExpenses,
        balance: group.salary - totalExpenses
      };
    }));

    closeModal();
  };

  const triggerEvent = (groupId: number) => {
    const event = RANDOM_EVENTS[Math.floor(Math.random() * RANDOM_EVENTS.length)];
    const groupName = groups.find(group => group.id === groupId)?.name ?? '';
    setEventMessage(`${groupName}: ${event.text}`);

    setGroups(prev => prev.map(group => {
      if (group.id !== groupId) {
        return group;
      }
      return { ...group, balance: group.balance - event.cost };
    }));

    setTimeout(() => setEventMessage(''), 6000);
  };

  const hasCompletedAnyGroup = useMemo(
    () => groups.some(group => allCategoryIds.every(categoryId => typeof group.expenses[categoryId] === 'number')),
    [groups]
  );

  useEffect(() => {
    if (hasCompletedAnyGroup && !isCompleted) {
      onComplete();
      setIsCompleted(true);
    }
  }, [hasCompletedAnyGroup, isCompleted, onComplete]);

  return (
    <ModuleView title={title} onBack={onBack}>
      <div className="min-h-screen bg-slate-100 p-4 md:p-8 font-sans text-slate-800" dir="rtl">
        <div className="max-w-7xl mx-auto mb-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6 bg-white p-6 rounded-[2.5rem] shadow-sm border-b-4 border-indigo-200">
            <div className="flex items-center gap-4">
              <div className="bg-indigo-600 p-4 rounded-3xl text-white text-3xl">💼</div>
              <div className="text-right">
                <h1 className="text-3xl md:text-4xl font-black text-indigo-900">מנהלי העתיד: אתגר ה-5,000</h1>
                <p className="text-indigo-500 font-bold">לוח בקרה מרכזי לניהול כיתתי</p>
              </div>
            </div>

            <div className="flex-1 max-w-2xl bg-slate-900 text-white p-4 rounded-[2rem] shadow-xl flex items-center gap-4 border-r-8 border-indigo-500">
              <span className="text-indigo-400 shrink-0 text-2xl">✅</span>
              <p className="text-sm md:text-base leading-snug">
                <span className="font-bold text-indigo-300">איך מנצחים?</span> מסיימים 5 משימות חקר, מוכיחים למורה את המחיר האמיתי, ומנסים להישאר עם היתרה הגבוהה ביותר.
              </p>
            </div>
          </div>
        </div>

        {eventMessage && (
          <div className="fixed top-10 left-1/2 -translate-x-1/2 z-[110] bg-yellow-400 border-4 border-yellow-600 p-4 rounded-2xl shadow-2xl animate-bounce">
            <div className="flex items-center gap-3 text-yellow-950 font-black">
              <span className="text-2xl">⚠️</span>
              {eventMessage}
            </div>
          </div>
        )}

        <div className="max-w-7xl mx-auto overflow-x-auto">
          <table className="w-full bg-white rounded-[3rem] shadow-2xl overflow-hidden border-collapse">
            <thead>
              <tr className="bg-indigo-700 text-white">
                <th className="p-6 text-right text-xl font-black border-l border-indigo-600 w-1/6 italic opacity-70">
                  קטגוריה \ צוות
                </th>
                {groups.map(group => (
                  <th key={group.id} className="p-6 text-center border-l border-indigo-600 w-1/5">
                    <div className="flex flex-col items-center gap-2">
                      <div className="flex items-center gap-2 text-2xl font-black">👥 {group.name}</div>
                      <button
                        onClick={() => triggerEvent(group.id)}
                        className="bg-white/20 hover:bg-white/40 px-4 py-1.5 rounded-xl text-xs font-bold transition-all"
                      >
                        בלת"ם! 🎲
                      </button>
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              <tr className="bg-slate-50 border-b border-slate-200">
                <td className="p-6 font-black text-slate-500">📉 יתרה נוכחית</td>
                {groups.map(group => (
                  <td key={group.id} className="p-6 text-center">
                    <div className={`text-3xl font-black ${group.balance < 0 ? 'text-red-500' : 'text-indigo-600'}`}>
                      ₪{group.balance.toLocaleString()}
                    </div>
                  </td>
                ))}
              </tr>

              {allCategoryIds.map(categoryId => {
                const category = CATEGORIES[categoryId];
                return (
                  <tr key={category.id} className="border-b border-slate-100 hover:bg-slate-50 transition-colors">
                    <td className="p-6">
                      <div className="flex items-center gap-3">
                        <div className="p-2.5 rounded-xl text-white shadow-sm text-lg" style={{ backgroundColor: category.color }}>
                          {category.icon}
                        </div>
                        <div>
                          <div className="font-black text-lg text-slate-800">{category.title}</div>
                          <div className="text-[10px] text-slate-400 font-bold uppercase">{category.isWeekly ? 'שבועי x 4' : 'חודשי'}</div>
                        </div>
                      </div>
                    </td>
                    {groups.map(group => (
                      <td key={group.id} className="p-6">
                        <div className="flex justify-center">
                          <button
                            onClick={() => {
                              setActiveCategoryId(category.id);
                              setSelectedGroup(group);
                            }}
                            className={`group relative flex flex-col items-center justify-center min-w-[120px] p-4 rounded-3xl border-4 transition-all ${
                              typeof group.expenses[category.id] === 'number'
                                ? 'bg-slate-900 border-slate-900 text-white shadow-lg'
                                : 'bg-white border-slate-100 text-slate-300 hover:border-indigo-300 hover:text-indigo-600'
                            }`}
                          >
                            {typeof group.expenses[category.id] === 'number' ? (
                              <div className="text-xl font-black">₪{group.expenses[category.id]?.toLocaleString()}</div>
                            ) : (
                              <div className="flex flex-col items-center gap-1">
                                <span className="text-lg">🔎</span>
                                <span className="text-[10px] font-bold">לחץ להזנה</span>
                              </div>
                            )}
                          </button>
                        </div>
                      </td>
                    ))}
                  </tr>
                );
              })}

              <tr className="bg-indigo-50 font-black border-t-4 border-indigo-200">
                <td className="p-6 text-indigo-900 text-lg">🧮 סה"כ הוצאות חודשיות</td>
                {groups.map(group => (
                  <td key={group.id} className="p-6 text-center">
                    <div className="text-2xl text-slate-700 bg-white inline-block px-6 py-2 rounded-2xl shadow-inner border border-indigo-100">
                      ₪{calculateTotalExpenses(group).toLocaleString()}
                    </div>
                  </td>
                ))}
              </tr>
            </tbody>
          </table>
        </div>

        {activeCategoryId && selectedGroup && (
          <div className="fixed inset-0 bg-indigo-950/95 backdrop-blur-xl flex items-center justify-center p-4 z-[100] cursor-pointer" onClick={closeModal}>
            <div className="bg-white rounded-[4rem] max-w-2xl w-full shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200 cursor-default" onClick={(event) => event.stopPropagation()}>
              <div className="p-8 text-white relative" style={{ backgroundColor: CATEGORIES[activeCategoryId].color }}>
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-6">
                    <div className="bg-white/20 p-4 rounded-[1.5rem] shadow-inner text-3xl">{CATEGORIES[activeCategoryId].icon}</div>
                    <div>
                      <h2 className="text-2xl md:text-3xl font-black">{CATEGORIES[activeCategoryId].title}</h2>
                      <p className="opacity-90 font-bold text-lg mt-1">משימת {selectedGroup.name}</p>
                    </div>
                  </div>
                  <button onClick={closeModal} className="bg-black/10 hover:bg-black/20 p-2 rounded-full transition-all text-2xl">
                    ✕
                  </button>
                </div>
              </div>

              <div className="p-10 space-y-8">
                <section className="bg-indigo-50 p-6 rounded-[2.5rem] border-2 border-indigo-100">
                  <h3 className="text-xl font-black text-indigo-900 mb-4 underline decoration-indigo-200 underline-offset-4">
                    {GROUP_TASKS[selectedGroup.id][activeCategoryId].desc}
                  </h3>

                  <div className="space-y-4 mb-6">
                    {GROUP_TASKS[selectedGroup.id][activeCategoryId].steps.map((step, index) => (
                      <div key={step} className="flex gap-3 items-center">
                        <div className="bg-indigo-600 text-white w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 font-bold text-xs">
                          {index + 1}
                        </div>
                        <p className="text-slate-700 font-medium">{step}</p>
                      </div>
                    ))}
                  </div>

                  <div className="bg-white p-3 rounded-xl border border-dashed border-indigo-300 text-sm italic font-bold text-indigo-800">
                    🔎 {GROUP_TASKS[selectedGroup.id][activeCategoryId].res}
                  </div>
                </section>

                <div className="pt-4 border-t-2 border-slate-100 text-center">
                  <label className="text-xs font-black text-slate-400 uppercase tracking-widest block mb-4">
                    {CATEGORIES[activeCategoryId].isWeekly ? 'הזינו סכום שבועי (יוכפל פי 4)' : 'הזינו סכום חודשי'}
                  </label>
                  <div className="flex gap-3 max-w-md mx-auto">
                    <input
                      type="number"
                      min={0}
                      value={inputValue}
                      onChange={event => setInputValue(event.target.value)}
                      placeholder="₪ סכום..."
                      className="flex-1 bg-slate-100 border-4 border-slate-100 focus:border-indigo-500 rounded-3xl p-4 text-3xl font-black text-center outline-none"
                      autoFocus
                    />
                    <button
                      onClick={() => updateBudget(selectedGroup.id, activeCategoryId, inputValue)}
                      disabled={!inputValue}
                      className="bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-300 text-white font-black text-xl px-10 rounded-3xl transition-all shadow-xl"
                    >
                      אישור
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="max-w-7xl mx-auto mt-6 flex justify-center gap-8 text-xs font-bold text-slate-400 italic">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-slate-900 rounded-sm"></div> סעיף הושלם
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-white border border-slate-200 rounded-sm"></div> מחכה למחקר
          </div>
          {hasCompletedAnyGroup && (
            <div className="flex items-center gap-2 text-green-600 not-italic">
              <span>🏁</span>
              הושלמה יחידה לצוות אחד — כל הכבוד!
            </div>
          )}
        </div>
      </div>
    </ModuleView>
  );
};

export default FutureManagersChallengeModule;
