import { MIN_TRANSACTIONS_TO_SHOW } from './finnyConstants.js';

export function shouldShowFinny(transactionCount) {
  return (transactionCount || 0) > MIN_TRANSACTIONS_TO_SHOW;
}

export function isFinnyAuthorized(user) {
  return Boolean(user);
}