import assert from 'assert';
import { shouldShowFinny, isFinnyAuthorized } from '../src/lib/finnyGating.js';

// visibility boundary
assert.strictEqual(shouldShowFinny(5), false, 'hidden at exactly 5 transactions');
assert.strictEqual(shouldShowFinny(6), true, 'visible at 6 transactions');
assert.strictEqual(shouldShowFinny(0), false, 'hidden at 0 transactions');
assert.strictEqual(shouldShowFinny(undefined), false, 'hidden when transactions is undefined');

// auth gating
assert.strictEqual(isFinnyAuthorized(null), false, 'unauthenticated when user is null');
assert.strictEqual(isFinnyAuthorized({ id: 'abc' }), true, 'authenticated when user object present');

console.log('All Finny gating tests passed');