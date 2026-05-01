const axios = require('axios');

const code = `import java.util.*;

class Solution {
    public static int[] twoSum(int[] nums, int target) {
        return new int[]{0, 1};
    }
    
    public static void main(String[] args) {
        System.out.println(Arrays.toString(twoSum(new int[]{2, 7, 11, 15}, 9)));
    }
}`;

axios.post('http://localhost:20000/api/v2/execute', {
  language: 'java',
  version: '15.0.2',
  files: [{ name: 'Main.java', content: code }]
}).then(r => console.log(JSON.stringify(r.data, null, 2)))
  .catch(e => console.error(e.response?.data || e.message));
