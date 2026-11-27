/**
 * Pure, reusable educational calculator functions for Waves Forex.
 * All conversion rates and contract assumptions must be supplied explicitly.
 * These helpers do not provide trade signals or personalized advice.
 */
function positive(value: number, label: string): void {
  if (!Number.isFinite(value) || value <= 0) throw new RangeError(`${label} must be greater than zero.`);
}
function nonNegative(value: number, label: string): void {
  if (!Number.isFinite(value) || value < 0) throw new RangeError(`${label} cannot be negative.`);
}

export type PipConvention = { pipSize: number; unitsPerStandardLot: number };
export const COMMON_PIP_CONVENTIONS = {
  standard: { pipSize: 0.0001, unitsPerStandardLot: 100_000 },
  jpyQuoted: { pipSize: 0.01, unitsPerStandardLot: 100_000 },
} satisfies Record<string, PipConvention>;

export function priceDistanceToPips(distance: number, pipSize: number): number {
  nonNegative(distance, "Price distance"); positive(pipSize, "Pip size"); return distance / pipSize;
}
export function pipValueInQuoteCurrency(units: number, pipSize: number): number {
  positive(units, "Units"); positive(pipSize, "Pip size"); return units * pipSize;
}
/** Rate means 1 quote-currency unit equals conversionRate account-currency units. */
export function convertQuoteToAccountCurrency(amount: number, conversionRate: number): number {
  nonNegative(amount, "Amount"); positive(conversionRate, "Conversion rate"); return amount * conversionRate;
}
export function riskAmount(balance: number, riskPercent: number): number {
  positive(balance, "Balance"); nonNegative(riskPercent, "Risk percentage");
  if (riskPercent > 100) throw new RangeError("Risk percentage cannot exceed 100.");
  return balance * riskPercent / 100;
}
export function positionUnitsFromRisk(riskBudget: number, stopPips: number, pipValuePerUnitInAccountCurrency: number): number {
  positive(riskBudget, "Risk budget"); positive(stopPips, "Stop distance");
  positive(pipValuePerUnitInAccountCurrency, "Pip value per unit");
  return riskBudget / (stopPips * pipValuePerUnitInAccountCurrency);
}
export function unitsToLots(units: number, unitsPerLot: number): number {
  positive(units, "Units"); positive(unitsPerLot, "Units per lot"); return units / unitsPerLot;
}
export function lotsToUnits(lots: number, unitsPerLot: number): number {
  positive(lots, "Lots"); positive(unitsPerLot, "Units per lot"); return lots * unitsPerLot;
}
export function requiredMargin(notionalAccountCurrency: number, leverage: number): number {
  positive(notionalAccountCurrency, "Notional value"); positive(leverage, "Leverage");
  return notionalAccountCurrency / leverage;
}
export function effectiveLeverage(notionalAccountCurrency: number, equity: number): number {
  positive(notionalAccountCurrency, "Notional value"); positive(equity, "Equity");
  return notionalAccountCurrency / equity;
}
export function rewardToRiskRatio(rewardDistance: number, riskDistance: number): number {
  positive(rewardDistance, "Reward distance"); positive(riskDistance, "Risk distance");
  return rewardDistance / riskDistance;
}
export function grossProfitLossInQuoteCurrency(units: number, entry: number, exit: number, direction: "long" | "short"): number {
  positive(units, "Units"); positive(entry, "Entry price"); positive(exit, "Exit price");
  return direction === "long" ? units * (exit - entry) : units * (entry - exit);
}
export function netProfitLoss(grossAccountCurrency: number, spread: number, commission: number, swap = 0): number {
  if (![grossAccountCurrency, spread, commission, swap].every(Number.isFinite)) throw new RangeError("All P/L values must be finite.");
  nonNegative(spread, "Spread cost"); nonNegative(commission, "Commission"); nonNegative(swap, "Swap");
  return grossAccountCurrency - spread - commission - swap;
}
export function riskPercentage(potentialLoss: number, balance: number): number {
  nonNegative(potentialLoss, "Potential loss"); positive(balance, "Balance");
  return potentialLoss / balance * 100;
}
