/**
 * Supported currency codes (ISO 4217). Extensible without a schema
 * migration — adding support for a new currency is a one-line change here,
 * not a database change, since `currency` columns are plain strings
 * validated against this allowlist at the application layer.
 */
export const SUPPORTED_CURRENCIES = ["USD", "INR", "EUR", "GBP"] as const;

export type SupportedCurrency = (typeof SUPPORTED_CURRENCIES)[number];
