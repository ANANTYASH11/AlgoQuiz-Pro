/**
 * SLIDING WINDOW ALGORITHM
 * 
 * Connection to Application:
 * - Analyzes a student's recent performance. It uses a sliding window of size K
 *   over their chronological quiz scores to compute the moving average accuracy
 *   and detect when their score trajectory changes.
 * 
 * Time Complexity: O(N)
 */
export function getMovingAccuracy(
  scores: number[], // percentage values (0 - 100)
  windowSize: number
): number[] {
  if (scores.length === 0 || windowSize <= 0) return [];
  if (scores.length < windowSize) {
    const sum = scores.reduce((a, b) => a + b, 0);
    return [Math.round((sum / scores.length) * 10) / 10];
  }

  const averages: number[] = [];
  let currentWindowSum = 0;

  // Initial sum of the first window
  for (let i = 0; i < windowSize; i++) {
    currentWindowSum += scores[i];
  }
  averages.push(Math.round((currentWindowSum / windowSize) * 10) / 10);

  // Slide the window
  for (let i = windowSize; i < scores.length; i++) {
    currentWindowSum = currentWindowSum - scores[i - windowSize] + scores[i];
    averages.push(Math.round((currentWindowSum / windowSize) * 10) / 10);
  }

  return averages;
}
