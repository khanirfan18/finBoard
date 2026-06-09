import assert from 'assert';
import { normalizeTransaction, normalizeTransactions } from '../src/lib/transactionNormalizer.js';

// legacy shape input
const legacy = {
  Date: '01/01/2025',
  Description: 'Swiggy Order',
  Amount: '-450',
  Category: 'Food',
};

const normalized = normalizeTransaction(legacy, { currency: { code: 'INR' }, source: 'test' });

assert.strictEqual(typeof normalized.id, 'string', 'id generated');
assert.strictEqual(normalized.Description, 'Swiggy Order');
assert.strictEqual(normalized.Date, '01/01/2025');
assert.strictEqual(normalized.category, 'Food');
assert.strictEqual(normalized.Category, 'Food');
assert.strictEqual(typeof normalized.Amount, 'number');

// array normalize
const arr = normalizeTransactions([legacy]);
assert.ok(Array.isArray(arr) && arr.length === 1, 'normalizeTransactions returns array');

console.log('All normalize tests passed');
