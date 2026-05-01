const axios = require('axios');

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

axios.post('http://localhost:3000/execute/submit', {
  language: 'java',
  code: code,
  problemSlug: 'two-sum'
}).then(res => {
  console.log(JSON.stringify(res.data, null, 2));
}).catch(err => {
  console.error(err.response?.data || err.message);
});
