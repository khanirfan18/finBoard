import { v4 as uuidv4 } from 'uuid';
import categorize from '../components/utils/categorize.js';

function toDDMMYYYY(date) {
  try {
    const d = new Date(date);
    if (isNaN(d.getTime())) return null;
    const day = String(d.getDate()).padStart(2, '0');
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const year = d.getFullYear();
    return `${day}/${month}/${year}`;
  } catch {
    return null;
  }
}

export function normalizeTransaction(input = {}, opts = {}) {
  const src = input || {};

  const Description = src.Description || src.description || '';

  // Determine Date: prefer existing dd/MM/yyyy, else try ISO-like fields
  let DateVal = src.Date || src.date || null;
  if (!DateVal && src.dateISO) {
    const dd = toDDMMYYYY(src.dateISO);
    if (dd) DateVal = dd;
  }

  // If still no Date, try parsing other common formats
  if (!DateVal && src.createdAt) {
    const dd = toDDMMYYYY(src.createdAt);
    if (dd) DateVal = dd;
  }

  // Amount: coerce to a numeric value (preserve sign)
  let rawAmt = src.Amount ?? src.amount ?? '';
  // Remove commas if any
  if (typeof rawAmt === 'string') rawAmt = rawAmt.replace(/,/g, '');
  const num = Number(rawAmt);
  const Amount = Number.isFinite(num) ? num : 0;

  const cat = (src.category || src.Category) || (Description ? categorize(Description) : 'Other');

  const Currency = src.Currency || src.currency || opts.currency || null;

  const normalized = {
    // preserve original display shape used widely in the app
    Date: DateVal || (src.Date || src.date || ''),
    Description: Description,
    Amount: Amount,
    // provide both forms so readers using either key find it
    category: cat,
    Category: cat,
    Currency,
    id: src.id || uuidv4(),
    createdAt: src.createdAt || src.created_at || new Date().toISOString(),
    updatedAt: src.updatedAt || src.updated_at || new Date().toISOString(),
    source: src.source || opts.source || 'unknown',
  };

  return normalized;
}

export function normalizeTransactions(arr = [], opts = {}) {
  if (!Array.isArray(arr)) return [];
  return arr.map((t) => normalizeTransaction(t, opts));
}

export default normalizeTransaction;
