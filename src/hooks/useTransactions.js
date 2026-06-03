import { useState } from 'react';

const DEFAULT_STORAGE_KEY = 'transactions';

function readStoredTransactions(storageKey, persist) {
	if (!persist) {
		return { transactions: [], error: null, hasStoredValue: false };
	}

	if (typeof window === 'undefined') {
		return { transactions: [], error: null, hasStoredValue: false };
	}

	try {
		const storedValue = window.localStorage.getItem(storageKey);

		if (storedValue === null) {
			return { transactions: [], error: null, hasStoredValue: false };
		}

		const parsedValue = JSON.parse(storedValue);

		if (!Array.isArray(parsedValue)) {
			throw new Error('Stored transactions must be an array');
		}

		return { transactions: parsedValue, error: null, hasStoredValue: true };
	} catch (error) {
		return {
			transactions: [],
			error: error instanceof Error ? error : new Error('Failed to read stored transactions'),
			hasStoredValue: true,
		};
	}
}

export default function useTransactions(options = {}) {
	const {
		storageKey = DEFAULT_STORAGE_KEY,
		initialTransactions = [],
		persist = true,
	} = options;
	const [state, setState] = useState(() => {
		const baseState = {
			transactions: Array.isArray(initialTransactions) ? initialTransactions : [],
			loading: false,
			error: null,
		};

		const { transactions: storedTransactions, error: readError, hasStoredValue } =
			readStoredTransactions(storageKey, persist);

		if (readError) {
			return {
				...baseState,
				error: readError,
			};
		}

		return {
			...baseState,
			transactions: hasStoredValue ? storedTransactions : initialTransactions,
		};
	});

	const persistTransactions = (nextTransactions) => {
		if (!persist || typeof window === 'undefined') {
			return null;
		}

		try {
			if (nextTransactions.length === 0) {
				window.localStorage.removeItem(storageKey);
			} else {
				window.localStorage.setItem(storageKey, JSON.stringify(nextTransactions));
			}

			return null;
		} catch (persistError) {
			return persistError instanceof Error
				? persistError
				: new Error('Failed to persist transactions');
		}
	};

	const setTransactions = (valueOrUpdater) => {
		setState((currentState) => {
			const nextTransactions =
				typeof valueOrUpdater === 'function'
					? valueOrUpdater(currentState.transactions)
					: valueOrUpdater;

			if (!Array.isArray(nextTransactions)) {
				return {
					...currentState,
					error: new Error('Transactions must be an array'),
				};
			}

			return {
				...currentState,
				transactions: nextTransactions,
				error: persistTransactions(nextTransactions),
			};
		});
	};

	const addTransaction = (transaction) => {
		setTransactions((currentTransactions) => [...currentTransactions, transaction]);
	};

	const updateTransaction = (index, updatedTransaction) => {
		setTransactions((currentTransactions) =>
			currentTransactions.map((transaction, currentIndex) =>
				currentIndex === index ? updatedTransaction : transaction
			)
		);
	};

	const deleteTransaction = (index) => {
		setTransactions((currentTransactions) =>
			currentTransactions.filter((_, currentIndex) => currentIndex !== index)
		);
	};

	const clearTransactions = () => {
		setTransactions([]);
	};

	return {
		transactions: state.transactions,
		setTransactions,
		addTransaction,
		updateTransaction,
		deleteTransaction,
		clearTransactions,
		loading: state.loading,
		error: state.error,
	};
}
