import { buildTestRunner } from './src/controllers/executeController.js';
import axios from 'axios';

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
        return new int[] {};
    }
}`;

const testCases = [
  { functionCall: "twoSum([2,7,11,15], 9)", expectedOutput: "[0,1]", isHidden: false },
  { functionCall: "twoSum([3,2,4], 6)", expectedOutput: "[1,2]", isHidden: false },
];

const testRunner = buildTestRunner("java", code, testCases, "twoSum");

axios.post('http://localhost:20000/api/v2/execute', {
  language: 'java',
  version: '15.0.2',
  files: [{ name: 'Main.java', content: testRunner }]
}).then(res => {
  console.log('Compile:', res.data.compile);
  console.log('Run:', res.data.run);
}).catch(err => {
  console.error('API Error:', err.message);
});
