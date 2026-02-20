import { GoogleGenAI, Type } from "@google/genai";
import type { BudgetItem } from '../types';

const apiKey = process.env.API_KEY || process.env.GEMINI_API_KEY || '';
const ai = apiKey ? new GoogleGenAI({ apiKey }) : null;

function ensureAI(): GoogleGenAI {
  if (!ai) {
    throw new Error('Gemini API key is not configured. Set GEMINI_API_KEY in your .env file.');
  }
  return ai;
}

export const getBudgetFeedback = async (income: number, expenses: BudgetItem[]): Promise<string> => {
  const expenseDetails = expenses.map(e => `- ${e.category}: ${e.amount} ש"ח`).join('\n');
  const totalExpenses = expenses.reduce((sum, item) => sum + item.amount, 0);

  const prompt = `
    אתה יועץ פיננסי חכם וידידותי המדבר עם נער/ה בן/בת 16 בישראל.
    הם הרכיבו תקציב חודשי. תן להם משוב קצר, מעשי וחיובי על התקציב שלהם.
    התמקד בנקודה אחת או שתיים לשיפור, ושמור על טון מעודד.
    התייחס לפער בין ההכנסות להוצאות.

    פרטי התקציב:
    הכנסה חודשית: ${income} ש"ח
    הוצאות חודשיות:
    ${expenseDetails}
    ---
    סה"כ הוצאות: ${totalExpenses} ש"ח
    ---
    
    התחל את התשובה שלך ב"היי, כל הכבוד על בניית התקציב!".
    כתוב את התשובה בעברית.
  `;

  try {
    const response = await ensureAI().models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
    });
    return response.text;
  } catch (error) {
    console.error("Error getting budget feedback:", error);
    return "אופס, נתקלתי בבעיה. אנא נסה שוב מאוחר יותר.";
  }
};


export const explainSalaryTerm = async (term: string): Promise<string> => {
  const prompt = `
    אתה מומחה למשכורות בישראל, ומסביר מושגים לנער/ה בן/בת 16 שמקבל/ת את תלוש השכר הראשון.
    הסבר את המושג "${term}" בצורה פשוטה, ברורה ובגובה העיניים.
    הסבר מהי מטרתו ולמה הוא מנוכה מהשכר.
    שמור על תשובה קצרה וממוקדת (2-3 משפטים).
    כתוב את התשובה בעברית.
  `;
  
  try {
    const response = await ensureAI().models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
    });
    return response.text;
  } catch (error) {
    console.error("Error explaining salary term:", error);
    return "אופס, נתקלתי בבעיה. אנא נסה שוב מאוחר יותר.";
  }
};

export const askAboutOverdraft = async (question: string): Promise<string> => {
  const prompt = `
    אתה יועץ פיננסי שמסביר לנער/ה בן/בת 16 על מינוס (אוברדראפט) בבנק.
    ענה על השאלה הבאה בצורה פשוטה, ברורה ובגובה העיניים.
    השאלה: "${question}"
    שמור על תשובה קצרה וממוקדת.
    כתוב את התשובה בעברית.
  `;
  
  try {
    const response = await ensureAI().models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
    });
    return response.text;
  } catch (error) {
    console.error("Error asking about overdraft:", error);
    return "אופס, נתקלתי בבעיה. אנא נסה שוב מאוחר יותר.";
  }
};

export const getCostOfLivingInfo = async (item: string): Promise<string> => {
  const prompt = `
    אתה מומחה ליוקר המחיה בישראל עבור צעירים.
    נער/ה בן/בת 16 שואל/ת: "מה העלות החודשית הממוצעת עבור ${item} בישראל?"
    ספק הערכה ריאלית ומנומקת. אם מדובר בטווח, ציין זאת.
    לדוגמה: "עלות ממוצעת של קורס פסיכומטרי היא בין 5,000 ל-10,000 ש"ח". "מנת פלאפל עולה בסביבות 15-25 ש"ח".
    התשובה צריכה להיות קצרה, ישירה ועוזרת.
    כתוב את התשובה בעברית.
  `;
  
  try {
    const response = await ensureAI().models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
    });
    return response.text;
  } catch (error) {
    console.error("Error getting cost of living info:", error);
    return "אופס, נתקלתי בבעיה. אנא נסה שוב מאוחר יותר.";
  }
};

export const getClientSimulationResponse = async (businessIdea: string, chatHistory: {sender: 'client' | 'user', text: string}[]): Promise<{responseText: string; feedbackText: string}> => {
  const historyString = chatHistory.map(msg => `${msg.sender === 'client' ? 'Alex' : 'You'}: ${msg.text}`).join('\n');

  const prompt = `
    You are a potential client named Alex, simulating a conversation for a teenager learning about business.
    The teenager is offering a service: "${businessIdea}".
    Your personality: Friendly, curious, but a bit cautious about spending money. You want to understand the service before committing.
    The last message in the history is from the user. Respond to it naturally as Alex.
    Also, provide short, constructive feedback for the teenager on their last message.
    
    Chat History:
    ${historyString}
  `;

  try {
    const response = await ensureAI().models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
        config: {
            responseMimeType: "application/json",
            responseSchema: {
                type: Type.OBJECT,
                properties: {
                    responseText: {
                        type: Type.STRING,
                        description: "Your natural response as Alex the client, in Hebrew."
                    },
                    feedbackText: {
                        type: Type.STRING,
                        description: "Short, constructive feedback for the teenager on their last message (e.g., 'Great job being clear and polite!' or 'Good start, but maybe ask what I need before giving a price.'), in Hebrew."
                    }
                },
                required: ['responseText', 'feedbackText']
            }
        }
    });
    
    const jsonResponse = JSON.parse(response.text);
    return jsonResponse;

  } catch (error) {
    console.error("Error in client simulation:", error);
    return {
        responseText: "אני לא בטוח שהבנתי, תוכל/י להסביר שוב?",
        feedbackText: "שגיאה: התגובה מהשרת לא הייתה תקינה."
    };
  }
};