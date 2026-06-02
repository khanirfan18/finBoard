import React from "react"
import normalizeTransaction, {
    normalizeTransactions,
} from "../lib/transactionNormalizer"

export const DataContext = React.createContext()

export const CURRENCIES = [
    { code: "INR", symbol: "₹", name: "Indian Rupee" },
    { code: "USD", symbol: "$", name: "US Dollar" },
    { code: "EUR", symbol: "€", name: "Euro" },
    { code: "GBP", symbol: "£", name: "British Pound" },
    { code: "JPY", symbol: "¥", name: "Japanese Yen" },
    { code: "AED", symbol: "د.إ", name: "UAE Dirham" },
]

function readLocalStorageJSON(key, fallback) {
    try {
        const storedValue = localStorage.getItem(key)
        if (!storedValue) return fallback

        return JSON.parse(storedValue)
    } catch {
        return fallback
    }
}

export function AppContext({ children }) {
    const [transactions, setTransactions] = React.useState(() =>
        readLocalStorageJSON("transactions", [])
    )
    const [currency, setCurrency] = React.useState(() =>
        readLocalStorageJSON("currency", CURRENCIES[0])
    )
    const [converting, setConverting] = React.useState(false)
    const [currencySymbols, setCurrencySymbols] = React.useState({})

    React.useEffect(() => {
        fetch("https://open.er-api.com/v6/latest/USD")
            .then(res => {
                if (!res.ok) throw new Error(`API Error: ${res.status}`)
                return res.json()
            })
            .then(data => {
                if (!data?.rates)
                    throw new Error("Invalid API response structure")
                const symbols = {}
                Object.keys(data.rates).forEach(code => {
                    try {
                        const formatted = new Intl.NumberFormat("en", {
                            style: "currency",
                            currency: code,
                            minimumFractionDigits: 0,
                        }).format(0)
                        symbols[code] = formatted
                            .replace(/[\d,.\s]/g, "")
                            .trim()
                    } catch {
                        symbols[code] = code
                    }
                })
                setCurrencySymbols(symbols)
            })
            .catch(err =>
                console.error("Failed to load currency symbols:", err)
            )
    }, [])

    // Normalize any stored transactions on mount so the app uses a consistent schema
    React.useEffect(() => {
        try {
            const stored = readLocalStorageJSON("transactions", [])
            if (Array.isArray(stored) && stored.length > 0) {
                const normalized = normalizeTransactions(stored, { currency })
                // Only write back if normalization changed (basic length check suffices here)
                if (JSON.stringify(normalized) !== JSON.stringify(stored)) {
                    setTransactions(normalized)
                    localStorage.setItem(
                        "transactions",
                        JSON.stringify(normalized)
                    )
                }
            }
        } catch (e) {
            // ignore normalization failures
            console.error("Normalization failed", e)
        }
        // run once on mount
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    const updateCurrency = async selectedCurrency => {
        if (selectedCurrency.code === currency.code) return

        const confirmed = window.confirm(
            `Convert all transactions from ${currency.code} to ${selectedCurrency.code}?`
        )
        if (!confirmed) return

        setConverting(true)

        try {
            const res = await fetch(
                `https://open.er-api.com/v6/latest/${currency.code}`
            )
            const data = await res.json()
            const rate = data.rates[selectedCurrency.code]

            if (!rate) throw new Error("Rate not found")

            const enrichedCurrency = {
                ...selectedCurrency,
                symbol:
                    currencySymbols[selectedCurrency.code] ||
                    selectedCurrency.symbol,
            }

            const convertedTransactions = transactions.map(t => {
                const amt = (Number(t.Amount) * rate).toFixed(2)
                // normalize each transaction after applying conversion
                return normalizeTransaction(
                    { ...t, Amount: amt },
                    {
                        currency: enrichedCurrency,
                        source: t.source || "conversion",
                    }
                )
            })

            setTransactions(convertedTransactions)
            localStorage.setItem(
                "transactions",
                JSON.stringify(convertedTransactions)
            )
            setCurrency(enrichedCurrency)
            localStorage.setItem("currency", JSON.stringify(enrichedCurrency))
        } catch (err) {
            alert(
                "Failed to fetch exchange rate. Check your internet and try again."
            )
            console.error(err)
        } finally {
            setConverting(false)
        }
    }

    const deleteTransaction = index => {
        const updated = transactions.filter((_, i) => i !== index)
        setTransactions(updated)
        localStorage.setItem("transactions", JSON.stringify(updated))
    }

    const addTransaction = newTransaction => {
        const normalized = normalizeTransaction(newTransaction, {
            currency,
            source: "manual",
        })
        const updated = [...(transactions || []), normalized]
        setTransactions(updated)
        localStorage.setItem("transactions", JSON.stringify(updated))
    }

    const updateTransaction = (index, updatedTransaction) => {
        const normalized = normalizeTransaction(updatedTransaction, {
            currency,
            source: "edit",
        })
        const updated = transactions.map((t, i) =>
            i === index ? normalized : t
        )
        setTransactions(updated)
        localStorage.setItem("transactions", JSON.stringify(updated))
    }

    return (
        <DataContext.Provider
            value={{
                transactions,
                setTransactions,
                currency,
                updateCurrency,
                deleteTransaction,
                addTransaction,
                updateTransaction,
                converting,
            }}
        >
            {converting && (
                <div className="theme-overlay">
                    <div className="theme-overlay-card">
                        Converting transactions... please wait
                    </div>
                </div>
            )}
            {children}
        </DataContext.Provider>
    )
}
