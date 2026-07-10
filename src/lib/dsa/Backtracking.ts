/**
 * BACKTRACKING ALGORITHM
 * 
 * Connection to Application:
 * - Generates custom user quizzes. It finds a subset of questions that sums up
 *   EXACTLY to a target cumulative difficulty level and question limit.
 * 
 * Time Complexity: O(2^N) worst-case (pruned by constraints).
 */
export interface BacktrackQuestion {
  id: number;
  difficulty: number; // 1-10 scale
  subject: string;
}

export function generateCustomQuizSet(
  availableQuestions: BacktrackQuestion[],
  targetTotalDifficulty: number,
  targetCount: number
): BacktrackQuestion[] | null {
  // Sort questions in descending order of difficulty to maximize efficiency of branch-and-bound pruning
  const sortedQuestions = [...availableQuestions].sort((a, b) => b.difficulty - a.difficulty);
  const n = sortedQuestions.length;

  // Precompute prefix sums for O(1) range sum queries
  const prefixSums = new Array(n + 1).fill(0);
  for (let i = 0; i < n; i++) {
    prefixSums[i + 1] = prefixSums[i] + sortedQuestions[i].difficulty;
  }

  const result: BacktrackQuestion[] = [];
  let calls = 0;
  const MAX_CALLS = 10000; // Prevent freezes in extreme or unsatisfiable cases

  function backtrack(
    index: number,
    currentSum: number,
    currentSet: BacktrackQuestion[]
  ): boolean {
    calls++;
    if (calls > MAX_CALLS) {
      return false;
    }

    const remainingCount = targetCount - currentSet.length;

    // Base Case: check if target count is met
    if (remainingCount === 0) {
      if (currentSum === targetTotalDifficulty) {
        result.push(...currentSet);
        return true;
      }
      return false;
    }

    // Prune if we don't have enough remaining questions to reach targetCount
    if (n - index < remainingCount) {
      return false;
    }

    // Prune if the target difficulty cannot be met even if we take the maximum possible remaining difficulties
    const maxPossibleRemainingSum = prefixSums[index + remainingCount] - prefixSums[index];
    if (currentSum + maxPossibleRemainingSum < targetTotalDifficulty) {
      return false;
    }

    // Prune if the target difficulty is exceeded even if we take the minimum possible remaining difficulties
    const minPossibleRemainingSum = prefixSums[n] - prefixSums[n - remainingCount];
    if (currentSum + minPossibleRemainingSum > targetTotalDifficulty) {
      return false;
    }

    // Branch 1: Include current question
    currentSet.push(sortedQuestions[index]);
    if (backtrack(index + 1, currentSum + sortedQuestions[index].difficulty, currentSet)) {
      return true;
    }
    // Backtrack step
    currentSet.pop();

    // Branch 2: Exclude current question
    if (backtrack(index + 1, currentSum, currentSet)) {
      return true;
    }

    return false;
  }

  const success = backtrack(0, 0, []);
  return success ? result : null;
}

