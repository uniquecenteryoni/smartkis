import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import Peer from 'peerjs';
import type { DataConnection } from 'peerjs';
import { QRCodeSVG } from 'qrcode.react';
import {
  OTHER_OFFICE_OPTIONS,
  TOTAL_BUDGET,
  budgetItems,
  buildDefaultOtherCutPercents,
  buildEqualAllocations,
  buildInitialAllocations,
  buildReferenceAllocations,
  debtMinimum,
  debtReference,
  formatBillions,
  getOtherAmountFromCutPercents,
  getOtherCutAmountFromPercents,
  getUsedBudget,
  normalizePercent,
  otherReference,
  type AllocationMap,
  type OtherCutPercents,
} from './GovernmentBudgetModule';

type BudgetMeetingActivityProps = {
  onBack: () => void;
};

type HostStateMessage = {
  type: 'HOST_STATE';
  groups: string[];
  live: boolean;
};

type JoinGroupMessage = {
  type: 'JOIN_GROUP';
  groupName: string;
};

type SubmitBudgetMessage = {
  type: 'SUBMIT_BUDGET';
  groupName: string;
  allocations: AllocationMap;
  otherCutPercents: OtherCutPercents;
  similarity: number;
};

type BudgetMeetingMessage = HostStateMessage | JoinGroupMessage | SubmitBudgetMessage;

type GroupSubmission = {
  allocations: AllocationMap;
  otherCutPercents: OtherCutPercents;
  similarity: number;
  submittedAt: number;
};

const buildSessionUrl = (hostPeerId: string) => {
  const base = window.location.origin + window.location.pathname.replace(/\/+$/, '');
  return `${base}?mode=budget-meeting-player&host=${encodeURIComponent(hostPeerId)}`;
};

const calculateSimilarity = (allocations: AllocationMap) => {
  const rows = budgetItems.map((item) => {
    const chosen = allocations[item.id] || 0;
    const gap = Number((chosen - item.reference).toFixed(1));
    return { ...item, chosen, gap };
  });
  const totalShift = Number((rows.filter((row) => row.gap > 0).reduce((sum, row) => sum + row.gap, 0)).toFixed(1));
  return Math.max(0, Math.round(100 - (totalShift / TOTAL_BUDGET) * 100));
};

const BudgetMeetingActivity: React.FC<BudgetMeetingActivityProps> = ({ onBack }) => {
  const [phase, setPhase] = useState<'setup' | 'live'>('setup');
  const [groupInput, setGroupInput] = useState('');
  const [groups, setGroups] = useState<string[]>(['קבוצה א', 'קבוצה ב']);
  const [hostPeerId, setHostPeerId] = useState<string | null>(null);
  const [peerError, setPeerError] = useState<string | null>(null);
  const [submissions, setSubmissions] = useState<Record<string, GroupSubmission>>({});
  const [joinedCounts, setJoinedCounts] = useState<Record<string, number>>({});

  const peerRef = useRef<Peer | null>(null);
  const connsRef = useRef<Map<string, DataConnection>>(new Map());
  const joinedGroupsRef = useRef<Map<string, string>>(new Map());
  const groupsRef = useRef<string[]>(groups);
  const phaseRef = useRef<'setup' | 'live'>(phase);

  useEffect(() => {
    groupsRef.current = groups;
  }, [groups]);

  useEffect(() => {
    phaseRef.current = phase;
  }, [phase]);

  const refreshJoinedCounts = useCallback(() => {
    const counts = groups.reduce<Record<string, number>>((acc, groupName) => {
      acc[groupName] = 0;
      return acc;
    }, {});
    joinedGroupsRef.current.forEach((groupName) => {
      if (counts[groupName] !== undefined) counts[groupName] += 1;
    });
    setJoinedCounts(counts);
  }, [groups]);

  const broadcastState = useCallback(() => {
    const msg: HostStateMessage = { type: 'HOST_STATE', groups, live: phase === 'live' };
    connsRef.current.forEach((conn) => {
      if (conn.open) conn.send(msg);
    });
  }, [groups, phase]);

  const sendCurrentState = useCallback((conn: DataConnection) => {
    const msg: HostStateMessage = {
      type: 'HOST_STATE',
      groups: groupsRef.current,
      live: phaseRef.current === 'live',
    };
    if (conn.open) conn.send(msg);
  }, []);

  useEffect(() => {
    const peer = new Peer();
    peerRef.current = peer;
    peer.on('open', (id) => setHostPeerId(id));
    peer.on('error', (error) => setPeerError(String(error)));
    peer.on('connection', (conn) => {
      connsRef.current.set(conn.peer, conn);

      conn.on('open', () => {
        sendCurrentState(conn);
      });

      conn.on('data', (raw) => {
        const msg = raw as BudgetMeetingMessage;
        if (msg.type === 'JOIN_GROUP') {
          if (!groupsRef.current.includes(msg.groupName)) {
            sendCurrentState(conn);
            return;
          }
          joinedGroupsRef.current.set(conn.peer, msg.groupName);
          refreshJoinedCounts();
          sendCurrentState(conn);
          return;
        }
        if (msg.type === 'SUBMIT_BUDGET') {
          setSubmissions((prev) => ({
            ...prev,
            [msg.groupName]: {
              allocations: msg.allocations,
              otherCutPercents: msg.otherCutPercents,
              similarity: msg.similarity,
              submittedAt: Date.now(),
            },
          }));
        }
      });

      const handleDisconnect = () => {
        connsRef.current.delete(conn.peer);
        joinedGroupsRef.current.delete(conn.peer);
        refreshJoinedCounts();
      };

      conn.on('close', handleDisconnect);
      conn.on('error', handleDisconnect);
    });

    return () => {
      peer.destroy();
    };
  }, [refreshJoinedCounts, sendCurrentState]);

  useEffect(() => {
    broadcastState();
    refreshJoinedCounts();
  }, [broadcastState, refreshJoinedCounts]);

  const sessionUrl = hostPeerId ? buildSessionUrl(hostPeerId) : '';

  const addGroup = () => {
    const next = groupInput.trim();
    if (!next || groups.includes(next)) return;
    setGroups((prev) => [...prev, next]);
    setGroupInput('');
  };

  const removeGroup = (groupName: string) => {
    setGroups((prev) => prev.filter((group) => group !== groupName));
    setSubmissions((prev) => {
      const next = { ...prev };
      delete next[groupName];
      return next;
    });
  };

  return (
    <div className="bg-white/90 rounded-3xl border border-white/70 shadow-xl p-5 space-y-6" dir="rtl">
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <div>
          <p className="text-brand-dark-blue/70">פעילויות ומשחקים</p>
          <h3 className="text-3xl font-bold text-brand-dark-blue">ישיבת תקציב</h3>
          <p className="text-brand-dark-blue/60">העבירו עם הקבוצות את תקציב המדינה של 2026, קבלו הגשות בזמן אמת והשוו בין הקבוצות.</p>
        </div>
        <button onClick={onBack} className="px-4 py-2 rounded-full bg-gray-200 text-brand-dark-blue font-bold hover:bg-gray-300">חזרה לחלון המשחקים</button>
      </div>

      <div className="rounded-3xl bg-gradient-to-r from-fuchsia-50 to-pink-100 border-2 border-pink-200 p-6 space-y-3">
        <h4 className="text-2xl font-bold text-brand-magenta">משימת הכיתה</h4>
        <p className="text-lg text-brand-dark-blue/80 leading-relaxed">
          על כל קבוצה להצליח להעביר את תקציב המדינה לשנת 2026: לחלק בדיוק {formatBillions(TOTAL_BUDGET)} בין המשרדים,
          לקבל החלטות על קיצוצים והגדלות, ולהגיש את התקציב מהמכשיר הסלולרי.
        </p>
      </div>

      {phase === 'setup' ? (
        <div className="grid grid-cols-1 lg:grid-cols-[1.2fr_0.8fr] gap-6">
          <div className="rounded-3xl border border-gray-200 bg-slate-50 p-6 space-y-4">
            <h4 className="text-2xl font-bold text-brand-dark-blue">הגדירו קבוצות</h4>
            <div className="flex gap-3 flex-wrap">
              <input
                value={groupInput}
                onChange={(e) => setGroupInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    addGroup();
                  }
                }}
                placeholder="למשל: קבוצה ירוקה"
                className="flex-1 min-w-[14rem] rounded-2xl border-2 border-gray-200 px-4 py-3 text-lg font-bold text-brand-dark-blue"
              />
              <button onClick={addGroup} className="px-5 py-3 rounded-full bg-brand-teal text-white font-bold hover:bg-teal-500">הוסיפו קבוצה</button>
            </div>
            <div className="flex flex-wrap gap-3">
              {groups.map((groupName) => (
                <div key={groupName} className="flex items-center gap-2 rounded-full bg-white border border-gray-200 px-4 py-2 shadow-sm">
                  <span className="font-bold text-brand-dark-blue">{groupName}</span>
                  <button onClick={() => removeGroup(groupName)} className="text-rose-600 font-bold">×</button>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-3xl border border-gray-200 bg-white p-6 space-y-4">
            <h4 className="text-2xl font-bold text-brand-dark-blue">התחלת פעילות</h4>
            <p className="text-brand-dark-blue/70 leading-relaxed">
              לאחר שתגדירו את שמות הקבוצות, עברו למסך החי. שם יוצג הברקוד, וכל קבוצה תוכל להצטרף אליו ולהגיש תקציב.
            </p>
            {peerError ? <div className="rounded-2xl bg-rose-50 border border-rose-200 p-4 text-rose-700">{peerError}</div> : null}
            <button
              onClick={() => setPhase('live')}
              disabled={groups.length === 0 || !hostPeerId}
              className="w-full py-4 rounded-2xl bg-brand-magenta text-white font-bold text-xl disabled:opacity-50 disabled:cursor-not-allowed"
            >
              פתחו את ישיבת התקציב
            </button>
          </div>
        </div>
      ) : (
        <div className="space-y-6">
          <div className="grid grid-cols-1 xl:grid-cols-[0.9fr_1.1fr] gap-6">
            <div className="rounded-3xl border border-indigo-200 bg-indigo-50 p-6 space-y-4">
              <h4 className="text-2xl font-bold text-indigo-800">סריקת הצטרפות</h4>
              <div className="bg-white rounded-3xl p-4 shadow-md inline-block">
                {sessionUrl ? <QRCodeSVG value={sessionUrl} size={220} /> : null}
              </div>
              <p className="text-indigo-900/80 leading-relaxed">
                כל קבוצה סורקת את הברקוד, בוחרת את שם הקבוצה שלה, ומגישה תקציב מהמכשיר שלה.
              </p>
              <div className="rounded-2xl bg-indigo-100 px-4 py-3 text-sm font-mono text-indigo-700 break-all">{sessionUrl || 'מכין קישור...'}</div>
            </div>

            <div className="rounded-3xl border border-gray-200 bg-white p-6 space-y-4">
              <div className="flex items-center justify-between gap-3 flex-wrap">
                <h4 className="text-2xl font-bold text-brand-dark-blue">סטטוס קבוצות</h4>
                <button onClick={() => setPhase('setup')} className="px-4 py-2 rounded-full bg-gray-200 text-brand-dark-blue font-bold hover:bg-gray-300">עריכת קבוצות</button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {groups.map((groupName) => {
                  const submission = submissions[groupName];
                  return (
                    <div key={groupName} className="rounded-2xl border border-gray-200 bg-slate-50 p-4 space-y-2">
                      <div className="flex items-center justify-between gap-2">
                        <div className="font-bold text-brand-dark-blue text-lg">{groupName}</div>
                        <span className={`px-3 py-1 rounded-full text-sm font-bold ${submission ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'}`}>
                          {submission ? 'הגישו תקציב' : 'ממתינים להגשה'}
                        </span>
                      </div>
                      <div className="text-brand-dark-blue/70">מחוברים: {joinedCounts[groupName] || 0}</div>
                      {submission ? (
                        <div className="text-brand-dark-blue/70">
                          התאמה: {submission.similarity}% | הוגש ב-{new Date(submission.submittedAt).toLocaleTimeString('he-IL', { hour: '2-digit', minute: '2-digit' })}
                        </div>
                      ) : null}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          <div className="rounded-3xl bg-white border border-white/70 shadow-lg p-6 overflow-x-auto">
            <h4 className="text-2xl font-bold text-brand-dark-blue mb-4">טבלת תקציבי הקבוצות</h4>
            <table className="w-full min-w-[980px] text-right">
              <thead>
                <tr className="bg-slate-100 text-brand-dark-blue">
                  <th className="p-3 font-bold">משרד / סעיף</th>
                  {groups.map((groupName) => (
                    <th key={groupName} className="p-3 font-bold">{groupName}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {budgetItems.map((item) => (
                  <tr key={item.id} className="border-t border-gray-100 bg-white">
                    <td className="p-3 font-semibold text-brand-dark-blue">{item.title}</td>
                    {groups.map((groupName) => {
                      const value = submissions[groupName]?.allocations[item.id];
                      return (
                        <td key={`${groupName}-${item.id}`} className="p-3 text-brand-dark-blue">
                          {typeof value === 'number' ? formatBillions(value) : '—'}
                        </td>
                      );
                    })}
                  </tr>
                ))}
                <tr className="border-t-2 border-brand-teal bg-teal-50">
                  <td className="p-3 font-bold text-brand-dark-blue">אחוז התאמה לתקציב האמיתי</td>
                  {groups.map((groupName) => (
                    <td key={`${groupName}-similarity`} className="p-3 font-bold text-brand-dark-blue">
                      {submissions[groupName] ? `${submissions[groupName].similarity}%` : '—'}
                    </td>
                  ))}
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default BudgetMeetingActivity;

export const BudgetMeetingPlayerView: React.FC = () => {
  const params = new URLSearchParams(window.location.search);
  const hostPeerId = params.get('host');

  const [status, setStatus] = useState<'connecting' | 'choose-group' | 'editing' | 'submitted' | 'error'>('connecting');
  const [groups, setGroups] = useState<string[]>([]);
  const [joinedGroup, setJoinedGroup] = useState<string | null>(null);
  const [allocations, setAllocations] = useState<AllocationMap>(() => buildInitialAllocations());
  const [otherCutPercents, setOtherCutPercents] = useState<OtherCutPercents>(() => buildDefaultOtherCutPercents());
  const [itemAdjustPercents, setItemAdjustPercents] = useState<Record<string, number>>({});
  const [isOtherModalOpen, setIsOtherModalOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const connRef = useRef<DataConnection | null>(null);
  const peerRef = useRef<Peer | null>(null);
  const joinedGroupRef = useRef<string | null>(null);

  useEffect(() => {
    joinedGroupRef.current = joinedGroup;
  }, [joinedGroup]);

  const usedBudget = useMemo(() => getUsedBudget(allocations), [allocations]);
  const remainingBudget = useMemo(() => Number((TOTAL_BUDGET - usedBudget).toFixed(1)), [usedBudget]);
  const selectedOtherCutAmount = useMemo(
    () => Number(getOtherCutAmountFromPercents(otherCutPercents).toFixed(3)),
    [otherCutPercents],
  );

  useEffect(() => {
    if (!hostPeerId) {
      setStatus('error');
      setErrorMessage('קישור לא תקין – סרקו מחדש את הברקוד.');
      return;
    }

    const peer = new Peer();
    peerRef.current = peer;
    peer.on('open', () => {
      const conn = peer.connect(hostPeerId, { reliable: true });
      connRef.current = conn;
      conn.on('open', () => setStatus('choose-group'));
      conn.on('data', (raw) => {
        const msg = raw as BudgetMeetingMessage;
        if (msg.type === 'HOST_STATE') {
          setGroups(msg.groups);
          if (joinedGroupRef.current && msg.live) {
            setStatus((prev) => (prev === 'submitted' ? prev : 'editing'));
          }
        }
      });
      conn.on('close', () => {
        setStatus('error');
        setErrorMessage('החיבור למחשב המארח נסגר.');
      });
      conn.on('error', (error) => {
        setStatus('error');
        setErrorMessage(String(error));
      });
    });
    peer.on('error', (error) => {
      setStatus('error');
      setErrorMessage(String(error));
    });

    return () => {
      peer.destroy();
    };
  }, [hostPeerId]);

  const send = useCallback((msg: BudgetMeetingMessage) => {
    if (connRef.current?.open) connRef.current.send(msg);
  }, []);

  const joinGroup = (groupName: string) => {
    setJoinedGroup(groupName);
    send({ type: 'JOIN_GROUP', groupName });
    setStatus('editing');
  };

  const setAllocation = (id: string, value: number) => {
    if (id === 'other') return;
    const safeValue = Number.isFinite(value) ? Math.max(0, value) : 0;
    const cappedDebt = id === 'debt' ? Math.max(debtMinimum, safeValue) : safeValue;
    if (id === 'debt' && safeValue < debtReference) {
      window.alert('שימו לב: הקטנת סכום החזר החוב השנה תגדיל את הנטל בשנים הבאות.');
    }
    setAllocations((prev) => ({ ...prev, [id]: Number(cappedDebt.toFixed(1)) }));
  };

  const clearAllocation = (id: string) => {
    if (id === 'other') return;
    setAllocations((prev) => {
      const next = { ...prev };
      delete next[id];
      return next;
    });
  };

  const setOtherCutPercent = (cutId: string, percent: number) => {
    setOtherCutPercents((prev) => {
      const next = { ...prev, [cutId]: normalizePercent(percent) };
      setAllocations((prevAllocations) => ({ ...prevAllocations, other: getOtherAmountFromCutPercents(next) }));
      return next;
    });
  };

  const setItemAdjustPercent = (id: string, value: number) => {
    setItemAdjustPercents((prev) => ({ ...prev, [id]: normalizePercent(value) }));
  };

  const applyItemPercentChange = (id: string, mode: 'cut' | 'add') => {
    const current = allocations[id] ?? 0;
    const percent = normalizePercent(itemAdjustPercents[id] ?? 0);
    const delta = current * (percent / 100);
    const nextValue = mode === 'cut' ? Math.max(0, current - delta) : current + delta;
    setAllocation(id, Number(nextValue.toFixed(1)));
  };

  const loadEqual = () => {
    const equal = buildEqualAllocations();
    equal.debt = Math.max(debtMinimum, Number((equal.debt || debtReference).toFixed(1)));
    equal.other = otherReference;
    setOtherCutPercents(buildDefaultOtherCutPercents());
    setAllocations(equal);
  };

  const reset = () => {
    setOtherCutPercents(buildDefaultOtherCutPercents());
    setAllocations(buildInitialAllocations());
  };

  const submitBudget = () => {
    if (!joinedGroup || remainingBudget !== 0) return;
    const normalizedAllocations = { ...allocations, other: getOtherAmountFromCutPercents(otherCutPercents) };
    send({
      type: 'SUBMIT_BUDGET',
      groupName: joinedGroup,
      allocations: normalizedAllocations,
      otherCutPercents,
      similarity: calculateSimilarity(normalizedAllocations),
    });
    setStatus('submitted');
  };

  if (status === 'connecting') {
    return <div className="min-h-screen bg-slate-900 text-white flex items-center justify-center text-2xl font-bold" dir="rtl">מתחברים לפעילות...</div>;
  }

  if (status === 'error') {
    return (
      <div className="min-h-screen bg-slate-900 text-white flex flex-col items-center justify-center gap-4 p-6" dir="rtl">
        <div className="text-6xl">❌</div>
        <div className="text-2xl font-bold text-center">לא הצלחנו להתחבר</div>
        <div className="text-center text-slate-300">{errorMessage}</div>
      </div>
    );
  }

  if (status === 'choose-group') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-fuchsia-50 to-indigo-50 p-6 space-y-6" dir="rtl">
        <div className="rounded-3xl bg-gradient-to-l from-brand-magenta to-indigo-600 text-white p-5 shadow-xl">
          <h1 className="text-3xl font-black mb-2">ישיבת תקציב</h1>
          <p className="text-lg text-white/90">בחרו את הקבוצה שלכם כדי להתחיל לבנות תקציב.</p>
        </div>
        <div className="grid grid-cols-1 gap-3">
          {groups.map((groupName) => (
            <button
              key={groupName}
              onClick={() => joinGroup(groupName)}
              className="rounded-3xl bg-white shadow-md p-5 text-right text-2xl font-bold text-brand-dark-blue hover:-translate-y-1 transition"
            >
              {groupName}
            </button>
          ))}
        </div>
      </div>
    );
  }

  if (status === 'submitted') {
    const similarity = calculateSimilarity({ ...allocations, other: getOtherAmountFromCutPercents(otherCutPercents) });
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-50 p-6 space-y-4" dir="rtl">
        <div className="rounded-3xl bg-gradient-to-r from-emerald-500 to-teal-500 text-white p-6 shadow-xl">
          <h2 className="text-3xl font-black mb-2">התקציב הוגש</h2>
          <p className="text-lg text-white/90">הקבוצה {joinedGroup} שלחה את התקציב למסך המחשב.</p>
        </div>
        <div className="rounded-2xl bg-white shadow p-5 text-center space-y-2">
          <div className="text-brand-dark-blue/70">אחוז התאמה לתקציב האמיתי</div>
          <div className="text-5xl font-black text-brand-dark-blue">{similarity}%</div>
        </div>
        <button onClick={() => setStatus('editing')} className="w-full py-4 rounded-3xl bg-brand-teal text-white font-bold text-xl">
          ערכו והגישו מחדש
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-fuchsia-50 to-indigo-50 p-4 pt-24 space-y-4" dir="rtl">
      <div className="fixed top-0 left-0 right-0 z-40 p-3">
        <div className={`mx-auto max-w-3xl rounded-2xl p-4 shadow-lg flex justify-between items-center gap-3 backdrop-blur transition-colors ${remainingBudget === 0 ? 'bg-emerald-500 text-white' : remainingBudget > 0 ? 'bg-amber-400 text-amber-900' : 'bg-rose-500 text-white'}`}>
          <span className="font-bold text-lg">{joinedGroup}</span>
          <span className="font-black text-2xl">{formatBillions(remainingBudget)}</span>
        </div>
      </div>

      <div className="rounded-3xl bg-gradient-to-l from-brand-magenta to-indigo-600 text-white p-5 shadow-xl">
        <h1 className="text-3xl font-black mb-1">ישיבת תקציב קבוצתית</h1>
        <p className="text-lg text-white/90">חלקו את תקציב המדינה והגישו אותו למדריך.</p>
      </div>

      <div className="grid grid-cols-2 gap-2">
        <button onClick={loadEqual} className="py-3 rounded-2xl bg-cyan-100 text-cyan-800 font-bold text-sm">חלוקה שווה</button>
        <button onClick={reset} className="py-3 rounded-2xl bg-gray-200 text-brand-dark-blue font-bold text-sm">אפס הכול</button>
      </div>

      <div className="space-y-3">
        {budgetItems.map((item) => {
          const isOther = item.id === 'other';
          const isDebt = item.id === 'debt';
          return (
            <div key={item.id} className="rounded-3xl bg-white shadow-md p-4 space-y-2">
              <div className="flex items-center justify-between gap-2">
                <h3 className="font-bold text-brand-dark-blue text-xl leading-tight">{item.title}</h3>
                <span className={`text-xs px-2 py-1 rounded-full font-bold ${item.type === 'ministry' ? 'bg-cyan-100 text-cyan-700' : 'bg-indigo-100 text-indigo-700'}`}>
                  {item.type === 'ministry' ? 'משרד' : 'סעיף רוחב'}
                </span>
              </div>
              <p className="text-sm text-brand-dark-blue/65 leading-relaxed">{item.purpose}</p>
              <div className="flex items-center gap-3">
                <button
                  disabled={isOther}
                  onClick={() => setAllocation(item.id, Math.max(0, Number(((allocations[item.id] || 0) - 0.5).toFixed(1))))}
                  className="w-12 h-12 rounded-full bg-rose-100 text-rose-700 font-black text-2xl flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
                >−</button>
                <input
                  type="number"
                  min={0}
                  step={0.5}
                  value={isOther ? (allocations[item.id] ?? otherReference) : (allocations[item.id] ?? '')}
                  onChange={(e) => {
                    if (isOther) return;
                    const raw = e.target.value;
                    if (raw === '') {
                      clearAllocation(item.id);
                      return;
                    }
                    setAllocation(item.id, Number(raw));
                  }}
                  disabled={isOther}
                  className={`flex-1 rounded-2xl border-2 px-4 py-3 text-xl font-bold text-center focus:outline-none focus:ring-2 ${isOther ? 'border-indigo-200 bg-indigo-50 text-indigo-800 cursor-not-allowed focus:ring-indigo-300' : 'border-gray-200 text-brand-dark-blue focus:ring-brand-teal'}`}
                />
                <button
                  disabled={isOther}
                  onClick={() => setAllocation(item.id, Number(((allocations[item.id] || 0) + 0.5).toFixed(1)))}
                  className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-700 font-black text-2xl flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
                >+</button>
              </div>
              {isDebt ? <p className="text-sm text-amber-700">ניתן להקטין החזר חוב עד {formatBillions(debtMinimum)} בלבד.</p> : null}
              {!isOther ? (
                <div className="rounded-2xl border border-cyan-100 bg-cyan-50/70 p-3">
                  <div className="flex items-center gap-2 overflow-x-auto whitespace-nowrap">
                    <label className="text-sm text-brand-dark-blue/70 shrink-0">שינוי %</label>
                    <div className="flex items-center gap-2 shrink-0">
                      <input
                        type="number"
                        min={0}
                        max={100}
                        step={1}
                        value={itemAdjustPercents[item.id] ?? 0}
                        onChange={(e) => setItemAdjustPercent(item.id, Number(e.target.value))}
                        className="w-20 rounded-xl border border-gray-300 px-3 py-2 font-bold text-brand-dark-blue"
                      />
                      <span className="text-brand-dark-blue/70">%</span>
                    </div>
                    <button onClick={() => applyItemPercentChange(item.id, 'cut')} className="px-3 py-1.5 rounded-full bg-rose-100 text-rose-700 text-sm font-bold hover:bg-rose-200 shrink-0">קצץ</button>
                    <button onClick={() => applyItemPercentChange(item.id, 'add')} className="px-3 py-1.5 rounded-full bg-emerald-100 text-emerald-700 text-sm font-bold hover:bg-emerald-200 shrink-0">הגדל</button>
                  </div>
                </div>
              ) : (
                <div className="space-y-2">
                  <button onClick={() => setIsOtherModalOpen(true)} className="w-full py-3 rounded-2xl bg-indigo-100 text-indigo-800 font-bold">בחרו אחוזי קיצוץ למשרדים האחרים</button>
                  <p className="text-sm text-indigo-800/80">סך הקיצוץ שנבחר: {formatBillions(selectedOtherCutAmount)}</p>
                </div>
              )}
            </div>
          );
        })}
      </div>

      <button
        onClick={submitBudget}
        disabled={remainingBudget !== 0}
        className="w-full py-4 rounded-3xl bg-brand-magenta text-white font-bold text-xl disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {remainingBudget === 0 ? 'הגש תקציב' : `נותרו ${formatBillions(remainingBudget)}`}
      </button>

      {isOtherModalOpen ? (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4" dir="rtl">
          <div className="w-full max-w-2xl rounded-3xl bg-white shadow-2xl p-6 space-y-4 max-h-[85vh] overflow-y-auto">
            <div className="flex items-center justify-between gap-3">
              <h4 className="text-2xl font-bold text-brand-dark-blue">בחירת קיצוץ מתוך "משרדים אחרים"</h4>
              <button onClick={() => setIsOtherModalOpen(false)} className="px-3 py-1 rounded-full bg-gray-100 hover:bg-gray-200">סגור</button>
            </div>
            <p className="text-brand-dark-blue/80">הגדירו לכל משרד את אחוז הקיצוץ הרצוי (0%-100%).</p>
            <div className="space-y-2">
              {OTHER_OFFICE_OPTIONS.map((option) => (
                <div key={option.id} className="rounded-2xl border border-gray-200 p-3 bg-slate-50 space-y-2">
                  <div className="flex items-center justify-between gap-3">
                    <span className="font-semibold text-brand-dark-blue">{option.title}</span>
                    <span className="font-bold text-brand-dark-blue/80">{formatBillions(option.amount)}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <label className="text-sm text-brand-dark-blue/70">אחוז קיצוץ</label>
                    <input
                      type="number"
                      min={0}
                      max={100}
                      step={1}
                      value={otherCutPercents[option.id] ?? 0}
                      onChange={(e) => setOtherCutPercent(option.id, Number(e.target.value))}
                      className="w-24 rounded-xl border border-gray-300 px-3 py-2 font-bold text-brand-dark-blue"
                    />
                    <span className="text-brand-dark-blue/70">%</span>
                  </div>
                  <div className="text-sm text-indigo-800 font-semibold">
                    קיצוץ בפועל: {formatBillions(Number((option.amount * ((otherCutPercents[option.id] || 0) / 100)).toFixed(3)))}
                  </div>
                </div>
              ))}
            </div>
            <div className="rounded-2xl bg-indigo-50 border border-indigo-100 p-4 text-indigo-900 font-semibold">
              תקציב "משרדים אחרים" לאחר הקיצוץ: {formatBillions(allocations.other ?? otherReference)}
            </div>
            <div className="flex justify-end">
              <button onClick={() => setIsOtherModalOpen(false)} className="px-5 py-2 rounded-full bg-brand-teal text-white font-bold hover:bg-teal-500">סיום</button>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
};