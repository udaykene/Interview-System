import { buildTestRunner } from './src/controllers/executeController.js';
import fs from 'fs';
import { execSync } from 'child_process';

const code = `class Solution {
    public int[] twoSum(int[] nums, int target) {
        java.util.HashMap<Integer, Integer> map = new java.util.HashMap<>();
        for (int i = 0; i < nums.length; i++) {
            int complement = target - nums[i];
            if (map.containsKey(complement)) {
                return new int[] { map.get(complement), i };
            }
            map.put(nums[i], i);
        }
        return new int[] {}; // fallback (won't happen as per problem)
    }
}`;

const testCases = [
  { functionCall: "twoSum([2,7,11,15], 9)", expectedOutput: "[0,1]", isHidden: false },
  { functionCall: "twoSum([3,2,4], 6)", expectedOutput: "[1,2]", isHidden: false },
  { functionCall: "twoSum([3,3], 6)", expectedOutput: "[0,1]", isHidden: true },
];

const generatedCode = buildTestRunner("java", code, testCases, "twoSum");

fs.writeFileSync('./scratch/Main.java', generatedCode);

try {
  execSync('cd scratch && javac Main.java', { encoding: 'utf8' });
  console.log('Compiled successfully!');
  const output = execSync('cd scratch && java Main', { encoding: 'utf8' });
  console.log('Output:\n', output);
} catch (e) {
  console.log('Error output:\n', e.stdout || e.stderr || e.message);
}
