import { Transaction, Budget, BudgetRecommendation, FinancialInsight } from '../types';

// Replace with your actual Gemini API key
const GEMINI_API_KEY = 'YOUR_GEMINI_API_KEY';
const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent';

/**
 * Helper function to make API calls to Gemini API
 */
const callGeminiAPI = async (prompt: string) => {
  try {
    const response = await fetch(`${GEMINI_API_URL}?key=${GEMINI_API_KEY}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [
          {
            parts: [
              {
                text: prompt,
              },
            ],
          },
        ],
      }),
    });

    if (!response.ok) {
      throw new Error(`API call failed with status: ${response.status}`);
    }

    const data = await response.json();
    return data.candidates[0].content.parts[0].text;
  } catch (error) {
    console.error('Error calling Gemini API:', error);
    throw error;
  }
};

/**
 * Categorize a transaction using AI
 */
export const categorizeTransaction = async (description: string, amount: number): Promise<string> => {
  const prompt = `
    As a financial assistant, categorize the following transaction into one of these categories:
    - Food & Dining
    - Transportation
    - Shopping
    - Entertainment
    - Housing
    - Utilities
    - Healthcare
    - Personal Care
    - Education
    - Travel
    - Income
    - Investments
    - Other

    Transaction: ${description}
    Amount: $${amount}

    Return only the category name without any additional text.
  `;

  try {
    const category = await callGeminiAPI(prompt);
    return category.trim();
  } catch (error) {
    console.error('Error categorizing transaction:', error);
    return 'Other'; // Default category if AI fails
  }
};

/**
 * Analyze a bank statement to extract transactions
 */
export const analyzeBankStatement = async (statementText: string): Promise<Partial<Transaction>[]> => {
  const prompt = `
    As a financial assistant, extract transactions from the following bank statement text.
    For each transaction, identify:
    1. Date
    2. Description
    3. Amount
    4. Whether it's an expense (true) or income (false)

    Format your response as a valid JSON array of objects with these properties:
    [
      {
        "date": "YYYY-MM-DD",
        "description": "Transaction description",
        "amount": 123.45,
        "isExpense": true/false
      }
    ]

    Bank statement:
    ${statementText}
  `;

  try {
    const jsonResponse = await callGeminiAPI(prompt);
    const transactions = JSON.parse(jsonResponse);
    return transactions;
  } catch (error) {
    console.error('Error analyzing bank statement:', error);
    return [];
  }
};

/**
 * Generate budget recommendations based on transaction history
 */
export const generateBudgetRecommendations = async (
  transactions: Transaction[],
  currentBudgets: Budget[]
): Promise<BudgetRecommendation[]> => {
  // Prepare transaction data for the AI
  const transactionSummary = transactions.map(t => ({
    category: t.category,
    amount: t.amount,
    date: t.date,
    isExpense: t.isExpense
  }));

  const currentBudgetSummary = currentBudgets.map(b => ({
    category: b.category,
    amount: b.amount,
    period: b.period
  }));

  const prompt = `
    As a financial advisor, analyze the following transaction history and current budgets to provide budget recommendations.
    
    Transaction history:
    ${JSON.stringify(transactionSummary)}
    
    Current budgets:
    ${JSON.stringify(currentBudgetSummary)}
    
    Based on the spending patterns, recommend monthly budget amounts for each category.
    For each recommendation, provide:
    1. The category
    2. The recommended monthly budget amount
    3. The current budget amount (if any)
    4. A brief reasoning for the recommendation
    
    Format your response as a valid JSON array of objects with these properties:
    [
      {
        "category": "Category name",
        "recommendedAmount": 123.45,
        "currentAmount": 100.00,
        "period": "monthly",
        "reasoning": "Brief explanation for the recommendation"
      }
    ]
  `;

  try {
    const jsonResponse = await callGeminiAPI(prompt);
    const recommendations = JSON.parse(jsonResponse);
    return recommendations;
  } catch (error) {
    console.error('Error generating budget recommendations:', error);
    return [];
  }
};

/**
 * Detect potentially fraudulent transactions
 */
export const detectFraudulentTransactions = async (
  transactions: Transaction[],
  newTransaction: Transaction
): Promise<{ isFraudulent: boolean; confidence: number; reasoning: string }> => {
  const transactionHistory = transactions.map(t => ({
    category: t.category,
    amount: t.amount,
    date: t.date,
    description: t.description
  }));

  const prompt = `
    As a fraud detection system, analyze the following transaction history and determine if the new transaction is potentially fraudulent.
    
    Transaction history:
    ${JSON.stringify(transactionHistory)}
    
    New transaction:
    ${JSON.stringify({
      category: newTransaction.category,
      amount: newTransaction.amount,
      date: newTransaction.date,
      description: newTransaction.description
    })}
    
    Determine if the new transaction is potentially fraudulent based on:
    1. Unusual transaction amount compared to history
    2. Unusual category compared to spending patterns
    3. Unusual frequency of transactions
    4. Unusual location or merchant (if available)
    
    Format your response as a valid JSON object with these properties:
    {
      "isFraudulent": true/false,
      "confidence": 0.0-1.0,
      "reasoning": "Detailed explanation of why this transaction might be fraudulent or not"
    }
  `;

  try {
    const jsonResponse = await callGeminiAPI(prompt);
    const result = JSON.parse(jsonResponse);
    return result;
  } catch (error) {
    console.error('Error detecting fraudulent transactions:', error);
    return {
      isFraudulent: false,
      confidence: 0,
      reasoning: 'Error analyzing transaction'
    };
  }
};

/**
 * Generate personalized financial insights
 */
export const generateFinancialInsights = async (
  transactions: Transaction[],
  budgets: Budget[]
): Promise<FinancialInsight[]> => {
  const transactionSummary = transactions.map(t => ({
    category: t.category,
    amount: t.amount,
    date: t.date,
    isExpense: t.isExpense
  }));

  const budgetSummary = budgets.map(b => ({
    category: b.category,
    amount: b.amount,
    period: b.period
  }));

  const prompt = `
    As a financial advisor, analyze the following transaction history and budgets to provide personalized financial insights.
    
    Transaction history:
    ${JSON.stringify(transactionSummary)}
    
    Budgets:
    ${JSON.stringify(budgetSummary)}
    
    Generate 3-5 actionable financial insights that could help the user improve their financial health.
    For each insight, provide:
    1. The type (spending, saving, investment, or fraud)
    2. A concise title
    3. A detailed description with specific advice
    
    Format your response as a valid JSON array of objects with these properties:
    [
      {
        "type": "spending/saving/investment/fraud",
        "title": "Concise insight title",
        "description": "Detailed description with specific advice"
      }
    ]
  `;

  try {
    const jsonResponse = await callGeminiAPI(prompt);
    const insights = JSON.parse(jsonResponse);
    
    // Add IDs and timestamps to the insights
    return insights.map((insight: any, index: number) => ({
      id: `insight-${Date.now()}-${index}`,
      userId: transactions[0]?.userId || '',
      type: insight.type,
      title: insight.title,
      description: insight.description,
      createdAt: new Date().toISOString()
    }));
  } catch (error) {
    console.error('Error generating financial insights:', error);
    return [];
  }
};

/**
 * Predict recurring bills and their due dates
 */
export const predictRecurringBills = async (transactions: Transaction[]): Promise<Partial<Bill>[]> => {
  const transactionSummary = transactions.map(t => ({
    description: t.description,
    amount: t.amount,
    date: t.date,
    category: t.category,
    isExpense: t.isExpense
  }));

  const prompt = `
    As a financial assistant, analyze the following transaction history to identify recurring bills and predict their next due dates.
    
    Transaction history:
    ${JSON.stringify(transactionSummary)}
    
    Identify recurring payments (bills) and predict:
    1. The bill name
    2. The typical amount
    3. The category
    4. The predicted next due date
    5. The recurring frequency (monthly, weekly, yearly)
    
    Format your response as a valid JSON array of objects with these properties:
    [
      {
        "name": "Bill name",
        "amount": 123.45,
        "category": "Category",
        "dueDate": "YYYY-MM-DD",
        "isRecurring": true,
        "recurringFrequency": "monthly/weekly/yearly"
      }
    ]
  `;

  try {
    const jsonResponse = await callGeminiAPI(prompt);
    const bills = JSON.parse(jsonResponse);
    return bills;
  } catch (error) {
    console.error('Error predicting recurring bills:', error);
    return [];
  }
};

export default {
  categorizeTransaction,
  analyzeBankStatement,
  generateBudgetRecommendations,
  detectFraudulentTransactions,
  generateFinancialInsights,
  predictRecurringBills
}; 