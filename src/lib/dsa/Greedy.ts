/**
 * GREEDY ALGORITHM
 * 
 * Connection to Application:
 * - Solves the Optimal Hint Allocation problem. Given a student's budget of coins,
 *   and a set of hints with different cost-to-relevance ratios, it selects the hints
 *   greedily to give the most helpful hints first.
 * 
 * Time Complexity: O(N log N) due to sorting.
 */
export interface HintItem {
  id: string;
  name: string;
  cost: number;
  relevance: number; // 1 to 10 score
}

export function getOptimalHints(
  hints: HintItem[],
  coinBudget: number
): HintItem[] {
  // Sort hints by relevance/cost ratio in descending order
  const sortedHints = [...hints].sort((a, b) => {
    const ratioA = a.relevance / a.cost;
    const ratioB = b.relevance / b.cost;
    return ratioB - ratioA;
  });

  const selected: HintItem[] = [];
  let remainingBudget = coinBudget;

  for (const hint of sortedHints) {
    if (remainingBudget >= hint.cost) {
      selected.push(hint);
      remainingBudget -= hint.cost;
    }
  }

  return selected;
}
