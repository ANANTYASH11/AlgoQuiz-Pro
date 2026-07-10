/**
 * DYNAMIC PROGRAMMING (DP) - K-Knapsack Adaptive recommendation
 * 
 * Connection to Application:
 * - Adapts difficulty parameters dynamically. Given a student's current skill weight capacity
 *   and a list of available topic pools with metadata (difficulty weight, educational value),
 *   it selects the set of questions that maximizes learning value under a difficulty budget.
 * 
 * Time Complexity: O(N * W) where N is number of questions and W is max difficulty weight.
 */
interface AdaptiveTopicItem {
  id: string;
  name: string;
  weight: number; // difficulty rating (1-10)
  value: number;  // XP or education rating
}

export function recommendAdaptiveTopics(
  topics: AdaptiveTopicItem[],
  maxWeightLimit: number
): AdaptiveTopicItem[] {
  const n = topics.length;
  if (n === 0 || maxWeightLimit <= 0) return [];

  // DP Table setup
  const dp: number[][] = Array.from({ length: n + 1 }, () => new Array(maxWeightLimit + 1).fill(0));

  for (let i = 1; i <= n; i++) {
    const topic = topics[i - 1];
    for (let w = 1; w <= maxWeightLimit; w++) {
      if (topic.weight <= w) {
        dp[i][w] = Math.max(
          topic.value + dp[i - 1][w - topic.weight],
          dp[i - 1][w]
        );
      } else {
        dp[i][w] = dp[i - 1][w];
      }
    }
  }

  // Backtracking through DP table to find chosen items
  const selected: AdaptiveTopicItem[] = [];
  let w = maxWeightLimit;
  for (let i = n; i > 0; i--) {
    if (dp[i][w] !== dp[i - 1][w]) {
      const item = topics[i - 1];
      selected.push(item);
      w -= item.weight;
    }
  }

  return selected.reverse();
}
