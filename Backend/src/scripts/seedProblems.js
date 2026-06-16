import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();

import Problem from "../models/Problem.js";

const DB_URL = process.env.DB_URL;

const problems = [
  // ═══════════════════════════════════════════════
  //  EXISTING PROBLEMS (cleaned up & verified)
  // ═══════════════════════════════════════════════
  {
    slug: "two-sum",
    title: "Two Sum",
    difficulty: "Easy",
    category: "Array",
    description: {
      text: "Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target.\n\nYou may assume that each input would have exactly one solution, and you may not use the same element twice.",
      notes: ["You can return the answer in any order."],
    },
    examples: [
      { input: "nums = [2,7,11,15], target = 9", output: "[0,1]", explanation: "Because nums[0] + nums[1] == 9, we return [0, 1]." },
      { input: "nums = [3,2,4], target = 6", output: "[1,2]", explanation: "" },
      { input: "nums = [3,3], target = 6", output: "[0,1]", explanation: "" },
    ],
    constraints: ["2 <= nums.length <= 10^4", "-10^9 <= nums[i] <= 10^9", "Only one valid answer exists."],
    starterCode: {
      javascript: `/**\n * @param {number[]} nums\n * @param {number} target\n * @return {number[]}\n */\nfunction twoSum(nums, target) {\n  // Your solution here\n}`,
      python: `def twoSum(nums, target):\n    # Your solution here\n    pass`,
      java: `class Solution {\n    public int[] twoSum(int[] nums, int target) {\n        // Your solution here\n        return new int[]{};\n    }\n}`,
    },
    testCases: [
      { input: "twoSum([2,7,11,15], 9)", expectedOutput: "[0,1]", isHidden: false },
      { input: "twoSum([3,2,4], 6)", expectedOutput: "[1,2]", isHidden: false },
      { input: "twoSum([3,3], 6)", expectedOutput: "[0,1]", isHidden: true },
      { input: "twoSum([1,2,3,4,5], 9)", expectedOutput: "[3,4]", isHidden: true },
    ],
    functionName: "twoSum",
    tags: ["Array", "Hash Table"],
  },
  {
    slug: "valid-parentheses",
    title: "Valid Parentheses",
    difficulty: "Easy",
    category: "Stack",
    description: {
      text: "Given a string s containing just the characters '(', ')', '{', '}', '[' and ']', determine if the input string is valid.\n\nAn input string is valid if:\n1. Open brackets must be closed by the same type of brackets.\n2. Open brackets must be closed in the correct order.\n3. Every close bracket has a corresponding open bracket of the same type.",
    },
    examples: [
      { input: 's = "()"', output: "true", explanation: "" },
      { input: 's = "()[]{}"', output: "true", explanation: "" },
      { input: 's = "(]"', output: "false", explanation: "" },
    ],
    constraints: ["1 <= s.length <= 10^4", "s consists of parentheses only '()[]{}' ."],
    starterCode: {
      javascript: `/**\n * @param {string} s\n * @return {boolean}\n */\nfunction isValid(s) {\n  // Your solution here\n}`,
      python: `def isValid(s):\n    # Your solution here\n    pass`,
      java: `class Solution {\n    public boolean isValid(String s) {\n        // Your solution here\n        return false;\n    }\n}`,
    },
    testCases: [
      { input: 'isValid("()")', expectedOutput: "true", isHidden: false },
      { input: 'isValid("()[]{}")', expectedOutput: "true", isHidden: false },
      { input: 'isValid("(]")', expectedOutput: "false", isHidden: false },
      { input: 'isValid("{[]}")', expectedOutput: "true", isHidden: true },
    ],
    functionName: "isValid",
    tags: ["String", "Stack"],
  },
  {
    slug: "maximum-subarray",
    title: "Maximum Subarray",
    difficulty: "Medium",
    category: "Dynamic Programming",
    description: {
      text: "Given an integer array nums, find the subarray with the largest sum, and return its sum.",
    },
    examples: [
      { input: "nums = [-2,1,-3,4,-1,2,1,-5,4]", output: "6", explanation: "The subarray [4,-1,2,1] has the largest sum 6." },
      { input: "nums = [1]", output: "1", explanation: "" },
      { input: "nums = [5,4,-1,7,8]", output: "23", explanation: "" },
    ],
    constraints: ["1 <= nums.length <= 10^5", "-10^4 <= nums[i] <= 10^4"],
    starterCode: {
      javascript: `/**\n * @param {number[]} nums\n * @return {number}\n */\nfunction maxSubArray(nums) {\n  // Kadane's algorithm\n}`,
      python: `def maxSubArray(nums):\n    # Kadane's algorithm\n    pass`,
      java: `class Solution {\n    public int maxSubArray(int[] nums) {\n        // Kadane's algorithm\n        return 0;\n    }\n}`,
    },
    testCases: [
      { input: "maxSubArray([-2,1,-3,4,-1,2,1,-5,4])", expectedOutput: "6", isHidden: false },
      { input: "maxSubArray([1])", expectedOutput: "1", isHidden: false },
      { input: "maxSubArray([5,4,-1,7,8])", expectedOutput: "23", isHidden: true },
    ],
    functionName: "maxSubArray",
    tags: ["Array", "Divide and Conquer", "Dynamic Programming"],
  },
  {
    slug: "binary-search",
    title: "Binary Search",
    difficulty: "Easy",
    category: "Binary Search",
    description: {
      text: "Given an array of integers nums which is sorted in ascending order, and an integer target, write a function to search target in nums. If target exists, then return its index. Otherwise, return -1.\n\nYou must write an algorithm with O(log n) runtime complexity.",
    },
    examples: [
      { input: "nums = [-1,0,3,5,9,12], target = 9", output: "4", explanation: "9 exists in nums and its index is 4." },
      { input: "nums = [-1,0,3,5,9,12], target = 2", output: "-1", explanation: "2 does not exist in nums so return -1." },
    ],
    constraints: ["1 <= nums.length <= 10^4", "-10^4 < nums[i], target < 10^4", "All integers in nums are unique.", "nums is sorted in ascending order."],
    starterCode: {
      javascript: `/**\n * @param {number[]} nums\n * @param {number} target\n * @return {number}\n */\nfunction search(nums, target) {\n  // Binary search\n}`,
      python: `def search(nums, target):\n    # Binary search\n    pass`,
      java: `class Solution {\n    public int search(int[] nums, int target) {\n        // Binary search\n        return -1;\n    }\n}`,
    },
    testCases: [
      { input: "search([-1,0,3,5,9,12], 9)", expectedOutput: "4", isHidden: false },
      { input: "search([-1,0,3,5,9,12], 2)", expectedOutput: "-1", isHidden: false },
    ],
    functionName: "search",
    tags: ["Array", "Binary Search"],
  },
  {
    slug: "merge-intervals",
    title: "Merge Intervals",
    difficulty: "Medium",
    category: "Array",
    description: {
      text: "Given an array of intervals where intervals[i] = [starti, endi], merge all overlapping intervals, and return an array of the non-overlapping intervals that cover all the intervals in the input.",
    },
    examples: [
      { input: "intervals = [[1,3],[2,6],[8,10],[15,18]]", output: "[[1,6],[8,10],[15,18]]", explanation: "Since intervals [1,3] and [2,6] overlap, merge them into [1,6]." },
      { input: "intervals = [[1,4],[4,5]]", output: "[[1,5]]", explanation: "Intervals [1,4] and [4,5] are considered overlapping." },
    ],
    constraints: ["1 <= intervals.length <= 10^4", "intervals[i].length == 2", "0 <= starti <= endi <= 10^4"],
    starterCode: {
      javascript: `/**\n * @param {number[][]} intervals\n * @return {number[][]}\n */\nfunction merge(intervals) {\n  // Your solution here\n}`,
      python: `def merge(intervals):\n    # Your solution here\n    pass`,
      java: `class Solution {\n    public int[][] merge(int[][] intervals) {\n        // Your solution here\n        return new int[][]{};\n    }\n}`,
    },
    testCases: [
      { input: "merge([[1,3],[2,6],[8,10],[15,18]])", expectedOutput: "[[1,6],[8,10],[15,18]]", isHidden: false },
      { input: "merge([[1,4],[4,5]])", expectedOutput: "[[1,5]]", isHidden: false },
    ],
    functionName: "merge",
    tags: ["Array", "Sorting"],
  },
  {
    slug: "climbing-stairs",
    title: "Climbing Stairs",
    difficulty: "Easy",
    category: "Dynamic Programming",
    description: {
      text: "You are climbing a staircase. It takes n steps to reach the top.\n\nEach time you can either climb 1 or 2 steps. In how many distinct ways can you climb to the top?",
    },
    examples: [
      { input: "n = 2", output: "2", explanation: "There are two ways to climb to the top: 1. 1 step + 1 step, 2. 2 steps" },
      { input: "n = 3", output: "3", explanation: "There are three ways: 1. 1+1+1, 2. 1+2, 3. 2+1" },
    ],
    constraints: ["1 <= n <= 45"],
    starterCode: {
      javascript: `/**\n * @param {number} n\n * @return {number}\n */\nfunction climbStairs(n) {\n  // Dynamic programming\n}`,
      python: `def climbStairs(n):\n    # Dynamic programming\n    pass`,
      java: `class Solution {\n    public int climbStairs(int n) {\n        // Dynamic programming\n        return 0;\n    }\n}`,
    },
    testCases: [
      { input: "climbStairs(2)", expectedOutput: "2", isHidden: false },
      { input: "climbStairs(3)", expectedOutput: "3", isHidden: false },
      { input: "climbStairs(10)", expectedOutput: "89", isHidden: true },
      { input: "climbStairs(45)", expectedOutput: "1836311903", isHidden: true },
    ],
    functionName: "climbStairs",
    tags: ["Math", "Dynamic Programming", "Memoization"],
  },
  {
    slug: "palindrome-number",
    title: "Palindrome Number",
    difficulty: "Easy",
    category: "Math",
    description: {
      text: "Given an integer x, return true if x is a palindrome, and false otherwise.",
    },
    examples: [
      { input: "x = 121", output: "true", explanation: "121 reads as 121 from left to right and from right to left." },
      { input: "x = -121", output: "false", explanation: "From left to right, it reads -121. It is not a palindrome." },
      { input: "x = 10", output: "false", explanation: "Reads 01 from right to left. Not a palindrome." },
    ],
    constraints: ["-2^31 <= x <= 2^31 - 1"],
    starterCode: {
      javascript: `/**\n * @param {number} x\n * @return {boolean}\n */\nfunction isPalindrome(x) {\n  // Your solution here\n}`,
      python: `def isPalindrome(x):\n    # Your solution here\n    pass`,
      java: `class Solution {\n    public boolean isPalindrome(int x) {\n        // Your solution here\n        return false;\n    }\n}`,
    },
    testCases: [
      { input: "isPalindrome(121)", expectedOutput: "true", isHidden: false },
      { input: "isPalindrome(-121)", expectedOutput: "false", isHidden: false },
      { input: "isPalindrome(10)", expectedOutput: "false", isHidden: true },
    ],
    functionName: "isPalindrome",
    tags: ["Math"],
  },
  {
    slug: "longest-common-prefix",
    title: "Longest Common Prefix",
    difficulty: "Easy",
    category: "String",
    description: {
      text: "Write a function to find the longest common prefix string amongst an array of strings.\n\nIf there is no common prefix, return an empty string \"\".",
    },
    examples: [
      { input: 'strs = ["flower","flow","flight"]', output: '"fl"', explanation: "" },
      { input: 'strs = ["dog","racecar","car"]', output: '""', explanation: "There is no common prefix among the input strings." },
    ],
    constraints: ["1 <= strs.length <= 200", "0 <= strs[i].length <= 200", "strs[i] consists of only lowercase English letters."],
    starterCode: {
      javascript: `/**\n * @param {string[]} strs\n * @return {string}\n */\nfunction longestCommonPrefix(strs) {\n  // Your solution here\n}`,
      python: `def longestCommonPrefix(strs):\n    # Your solution here\n    pass`,
      java: `class Solution {\n    public String longestCommonPrefix(String[] strs) {\n        // Your solution here\n        return "";\n    }\n}`,
    },
    testCases: [
      { input: 'longestCommonPrefix(["flower","flow","flight"])', expectedOutput: '"fl"', isHidden: false },
      { input: 'longestCommonPrefix(["dog","racecar","car"])', expectedOutput: '""', isHidden: false },
    ],
    functionName: "longestCommonPrefix",
    tags: ["String", "Trie"],
  },
  {
    slug: "contains-duplicate",
    title: "Contains Duplicate",
    difficulty: "Easy",
    category: "Array",
    description: {
      text: "Given an integer array nums, return true if any value appears at least twice in the array, and return false if every element is distinct.",
    },
    examples: [
      { input: "nums = [1,2,3,1]", output: "true", explanation: "" },
      { input: "nums = [1,2,3,4]", output: "false", explanation: "" },
    ],
    constraints: ["1 <= nums.length <= 10^5", "-10^9 <= nums[i] <= 10^9"],
    starterCode: {
      javascript: `/**\n * @param {number[]} nums\n * @return {boolean}\n */\nfunction containsDuplicate(nums) {\n  // Your solution here\n}`,
      python: `def containsDuplicate(nums):\n    # Your solution here\n    pass`,
      java: `class Solution {\n    public boolean containsDuplicate(int[] nums) {\n        // Your solution here\n        return false;\n    }\n}`,
    },
    testCases: [
      { input: "containsDuplicate([1,2,3,1])", expectedOutput: "true", isHidden: false },
      { input: "containsDuplicate([1,2,3,4])", expectedOutput: "false", isHidden: false },
      { input: "containsDuplicate([1,1,1,3,3,4,3,2,4,2])", expectedOutput: "true", isHidden: true },
    ],
    functionName: "containsDuplicate",
    tags: ["Array", "Hash Table", "Sorting"],
  },
  {
    slug: "best-time-to-buy-and-sell-stock",
    title: "Best Time to Buy and Sell Stock",
    difficulty: "Easy",
    category: "Array",
    description: {
      text: "You are given an array prices where prices[i] is the price of a given stock on the ith day.\n\nYou want to maximize your profit by choosing a single day to buy one stock and choosing a different day in the future to sell that stock.\n\nReturn the maximum profit you can achieve from this transaction. If you cannot achieve any profit, return 0.",
    },
    examples: [
      { input: "prices = [7,1,5,3,6,4]", output: "5", explanation: "Buy on day 2 (price = 1) and sell on day 5 (price = 6), profit = 6-1 = 5." },
      { input: "prices = [7,6,4,3,1]", output: "0", explanation: "No transactions are done and the max profit = 0." },
    ],
    constraints: ["1 <= prices.length <= 10^5", "0 <= prices[i] <= 10^4"],
    starterCode: {
      javascript: `/**\n * @param {number[]} prices\n * @return {number}\n */\nfunction maxProfit(prices) {\n  // Your solution here\n}`,
      python: `def maxProfit(prices):\n    # Your solution here\n    pass`,
      java: `class Solution {\n    public int maxProfit(int[] prices) {\n        // Your solution here\n        return 0;\n    }\n}`,
    },
    testCases: [
      { input: "maxProfit([7,1,5,3,6,4])", expectedOutput: "5", isHidden: false },
      { input: "maxProfit([7,6,4,3,1])", expectedOutput: "0", isHidden: false },
    ],
    functionName: "maxProfit",
    tags: ["Array", "Dynamic Programming"],
  },
  {
    slug: "product-of-array-except-self",
    title: "Product of Array Except Self",
    difficulty: "Medium",
    category: "Array",
    description: {
      text: "Given an integer array nums, return an array answer such that answer[i] is equal to the product of all the elements of nums except nums[i].\n\nThe product of any prefix or suffix of nums is guaranteed to fit in a 32-bit integer.\n\nYou must write an algorithm that runs in O(n) time and without using the division operation.",
    },
    examples: [
      { input: "nums = [1,2,3,4]", output: "[24,12,8,6]", explanation: "" },
      { input: "nums = [-1,1,0,-3,3]", output: "[0,0,9,0,0]", explanation: "" },
    ],
    constraints: ["2 <= nums.length <= 10^5", "-30 <= nums[i] <= 30"],
    starterCode: {
      javascript: `/**\n * @param {number[]} nums\n * @return {number[]}\n */\nfunction productExceptSelf(nums) {\n  // O(n) without division\n}`,
      python: `def productExceptSelf(nums):\n    # O(n) without division\n    pass`,
      java: `class Solution {\n    public int[] productExceptSelf(int[] nums) {\n        return new int[]{};\n    }\n}`,
    },
    testCases: [
      { input: "productExceptSelf([1,2,3,4])", expectedOutput: "[24,12,8,6]", isHidden: false },
      { input: "productExceptSelf([-1,1,0,-3,3])", expectedOutput: "[0,0,9,0,0]", isHidden: false },
    ],
    functionName: "productExceptSelf",
    tags: ["Array", "Prefix Sum"],
  },
  {
    slug: "3sum",
    title: "3Sum",
    difficulty: "Medium",
    category: "Array",
    description: {
      text: "Given an integer array nums, return all the triplets [nums[i], nums[j], nums[k]] such that i != j, i != k, and j != k, and nums[i] + nums[j] + nums[k] == 0.\n\nNotice that the solution set must not contain duplicate triplets.",
    },
    examples: [
      { input: "nums = [-1,0,1,2,-1,-4]", output: "[[-1,-1,2],[-1,0,1]]", explanation: "" },
      { input: "nums = [0,1,1]", output: "[]", explanation: "" },
      { input: "nums = [0,0,0]", output: "[[0,0,0]]", explanation: "" },
    ],
    constraints: ["3 <= nums.length <= 3000", "-10^5 <= nums[i] <= 10^5"],
    starterCode: {
      javascript: `/**\n * @param {number[]} nums\n * @return {number[][]}\n */\nfunction threeSum(nums) {\n  // Two pointer approach\n}`,
      python: `def threeSum(nums):\n    # Two pointer approach\n    pass`,
      java: `class Solution {\n    public List<List<Integer>> threeSum(int[] nums) {\n        return new ArrayList<>();\n    }\n}`,
    },
    testCases: [
      { input: "threeSum([-1,0,1,2,-1,-4])", expectedOutput: "[[-1,-1,2],[-1,0,1]]", isHidden: false },
      { input: "threeSum([0,0,0])", expectedOutput: "[[0,0,0]]", isHidden: false },
    ],
    functionName: "threeSum",
    tags: ["Array", "Two Pointers", "Sorting"],
  },
  {
    slug: "coin-change",
    title: "Coin Change",
    difficulty: "Medium",
    category: "Dynamic Programming",
    description: {
      text: "You are given an integer array coins representing coins of different denominations and an integer amount representing a total amount of money.\n\nReturn the fewest number of coins that you need to make up that amount. If that amount of money cannot be made up by any combination of the coins, return -1.\n\nYou may assume that you have an infinite number of each kind of coin.",
    },
    examples: [
      { input: "coins = [1,2,5], amount = 11", output: "3", explanation: "11 = 5 + 5 + 1" },
      { input: "coins = [2], amount = 3", output: "-1", explanation: "" },
      { input: "coins = [1], amount = 0", output: "0", explanation: "" },
    ],
    constraints: ["1 <= coins.length <= 12", "1 <= coins[i] <= 2^31 - 1", "0 <= amount <= 10^4"],
    starterCode: {
      javascript: `/**\n * @param {number[]} coins\n * @param {number} amount\n * @return {number}\n */\nfunction coinChange(coins, amount) {\n  // Bottom-up DP\n}`,
      python: `def coinChange(coins, amount):\n    # Bottom-up DP\n    pass`,
      java: `class Solution {\n    public int coinChange(int[] coins, int amount) {\n        return -1;\n    }\n}`,
    },
    testCases: [
      { input: "coinChange([1,2,5], 11)", expectedOutput: "3", isHidden: false },
      { input: "coinChange([2], 3)", expectedOutput: "-1", isHidden: false },
      { input: "coinChange([1], 0)", expectedOutput: "0", isHidden: true },
    ],
    functionName: "coinChange",
    tags: ["Array", "Dynamic Programming", "BFS"],
  },
  {
    slug: "number-of-1-bits",
    title: "Number of 1 Bits",
    difficulty: "Easy",
    category: "Bit Manipulation",
    description: {
      text: "Write a function that takes the binary representation of a positive integer and returns the number of set bits it has (also known as the Hamming weight).",
    },
    examples: [
      { input: "n = 11", output: "3", explanation: "The input binary string 1011 has a total of three set bits." },
      { input: "n = 128", output: "1", explanation: "The input binary string 10000000 has a total of one set bit." },
    ],
    constraints: ["1 <= n <= 2^31 - 1"],
    starterCode: {
      javascript: `/**\n * @param {number} n\n * @return {number}\n */\nfunction hammingWeight(n) {\n  // Bit manipulation\n}`,
      python: `def hammingWeight(n):\n    # Bit manipulation\n    pass`,
      java: `class Solution {\n    public int hammingWeight(int n) {\n        return 0;\n    }\n}`,
    },
    testCases: [
      { input: "hammingWeight(11)", expectedOutput: "3", isHidden: false },
      { input: "hammingWeight(128)", expectedOutput: "1", isHidden: false },
    ],
    functionName: "hammingWeight",
    tags: ["Divide and Conquer", "Bit Manipulation"],
  },
  {
    slug: "house-robber",
    title: "House Robber",
    difficulty: "Medium",
    category: "Dynamic Programming",
    description: {
      text: "You are a professional robber planning to rob houses along a street. Each house has a certain amount of money stashed, the only constraint stopping you from robbing each of them is that adjacent houses have security systems connected and it will automatically contact the police if two adjacent houses were broken into on the same night.\n\nGiven an integer array nums representing the amount of money of each house, return the maximum amount of money you can rob tonight without alerting the police.",
    },
    examples: [
      { input: "nums = [1,2,3,1]", output: "4", explanation: "Rob house 1 (money = 1) and then rob house 3 (money = 3). Total = 1 + 3 = 4." },
      { input: "nums = [2,7,9,3,1]", output: "12", explanation: "Rob house 1 (2), house 3 (9), house 5 (1). Total = 12." },
    ],
    constraints: ["1 <= nums.length <= 100", "0 <= nums[i] <= 400"],
    starterCode: {
      javascript: `/**\n * @param {number[]} nums\n * @return {number}\n */\nfunction rob(nums) {\n  // DP approach\n}`,
      python: `def rob(nums):\n    # DP approach\n    pass`,
      java: `class Solution {\n    public int rob(int[] nums) {\n        return 0;\n    }\n}`,
    },
    testCases: [
      { input: "rob([1,2,3,1])", expectedOutput: "4", isHidden: false },
      { input: "rob([2,7,9,3,1])", expectedOutput: "12", isHidden: false },
      { input: "rob([2,1,1,2])", expectedOutput: "4", isHidden: true },
    ],
    functionName: "rob",
    tags: ["Array", "Dynamic Programming"],
  },
  {
    slug: "longest-substring-without-repeating",
    title: "Longest Substring Without Repeating Characters",
    difficulty: "Medium",
    category: "String",
    description: {
      text: "Given a string s, find the length of the longest substring without repeating characters.",
    },
    examples: [
      { input: 's = "abcabcbb"', output: "3", explanation: 'The answer is "abc", with the length of 3.' },
      { input: 's = "bbbbb"', output: "1", explanation: 'The answer is "b", with the length of 1.' },
      { input: 's = "pwwkew"', output: "3", explanation: 'The answer is "wke", with the length of 3.' },
    ],
    constraints: ["0 <= s.length <= 5 * 10^4", "s consists of English letters, digits, symbols and spaces."],
    starterCode: {
      javascript: `/**\n * @param {string} s\n * @return {number}\n */\nfunction lengthOfLongestSubstring(s) {\n  // Sliding window\n}`,
      python: `def lengthOfLongestSubstring(s):\n    # Sliding window\n    pass`,
      java: `class Solution {\n    public int lengthOfLongestSubstring(String s) {\n        return 0;\n    }\n}`,
    },
    testCases: [
      { input: 'lengthOfLongestSubstring("abcabcbb")', expectedOutput: "3", isHidden: false },
      { input: 'lengthOfLongestSubstring("bbbbb")', expectedOutput: "1", isHidden: false },
      { input: 'lengthOfLongestSubstring("")', expectedOutput: "0", isHidden: true },
    ],
    functionName: "lengthOfLongestSubstring",
    tags: ["Hash Table", "String", "Sliding Window"],
  },
  {
    slug: "find-minimum-in-rotated-sorted-array",
    title: "Find Minimum in Rotated Sorted Array",
    difficulty: "Medium",
    category: "Binary Search",
    description: {
      text: "Suppose an array of length n sorted in ascending order is rotated between 1 and n times. Given the sorted rotated array nums of unique elements, return the minimum element of this array.\n\nYou must write an algorithm that runs in O(log n) time.",
    },
    examples: [
      { input: "nums = [3,4,5,1,2]", output: "1", explanation: "The original array was [1,2,3,4,5] rotated 3 times." },
      { input: "nums = [4,5,6,7,0,1,2]", output: "0", explanation: "" },
    ],
    constraints: ["n == nums.length", "1 <= n <= 5000", "All the integers of nums are unique."],
    starterCode: {
      javascript: `/**\n * @param {number[]} nums\n * @return {number}\n */\nfunction findMin(nums) {\n  // Binary search O(log n)\n}`,
      python: `def findMin(nums):\n    # Binary search\n    pass`,
      java: `class Solution {\n    public int findMin(int[] nums) {\n        return 0;\n    }\n}`,
    },
    testCases: [
      { input: "findMin([3,4,5,1,2])", expectedOutput: "1", isHidden: false },
      { input: "findMin([4,5,6,7,0,1,2])", expectedOutput: "0", isHidden: false },
    ],
    functionName: "findMin",
    tags: ["Array", "Binary Search"],
  },
  {
    slug: "majority-element",
    title: "Majority Element",
    difficulty: "Easy",
    category: "Array",
    description: {
      text: "Given an array nums of size n, return the majority element.\n\nThe majority element is the element that appears more than ⌊n / 2⌋ times. You may assume that the majority element always exists in the array.",
    },
    examples: [
      { input: "nums = [3,2,3]", output: "3", explanation: "" },
      { input: "nums = [2,2,1,1,1,2,2]", output: "2", explanation: "" },
    ],
    constraints: ["n == nums.length", "1 <= n <= 5 * 10^4", "-2^31 <= nums[i] <= 2^31 - 1"],
    starterCode: {
      javascript: `/**\n * @param {number[]} nums\n * @return {number}\n */\nfunction majorityElement(nums) {\n  // Boyer-Moore voting algorithm\n}`,
      python: `def majorityElement(nums):\n    # Boyer-Moore voting algorithm\n    pass`,
      java: `class Solution {\n    public int majorityElement(int[] nums) {\n        return 0;\n    }\n}`,
    },
    testCases: [
      { input: "majorityElement([3,2,3])", expectedOutput: "3", isHidden: false },
      { input: "majorityElement([2,2,1,1,1,2,2])", expectedOutput: "2", isHidden: false },
    ],
    functionName: "majorityElement",
    tags: ["Array", "Hash Table", "Divide and Conquer", "Counting"],
  },
  {
    slug: "word-search",
    title: "Word Search",
    difficulty: "Medium",
    category: "Backtracking",
    description: {
      text: "Given an m x n grid of characters board and a string word, return true if word exists in the grid.\n\nThe word can be constructed from letters of sequentially adjacent cells, where adjacent cells are horizontally or vertically neighboring. The same letter cell may not be used more than once.",
    },
    examples: [
      { input: 'board = [["A","B","C","E"],["S","F","C","S"],["A","D","E","E"]], word = "ABCCED"', output: "true", explanation: "" },
      { input: 'board = [["A","B","C","E"],["S","F","C","S"],["A","D","E","E"]], word = "SEE"', output: "true", explanation: "" },
    ],
    constraints: ["m == board.length", "n = board[i].length", "1 <= m, n <= 6", "1 <= word.length <= 15"],
    starterCode: {
      javascript: `/**\n * @param {character[][]} board\n * @param {string} word\n * @return {boolean}\n */\nfunction exist(board, word) {\n  // DFS + backtracking\n}`,
      python: `def exist(board, word):\n    # DFS + backtracking\n    pass`,
      java: `class Solution {\n    public boolean exist(char[][] board, String word) {\n        return false;\n    }\n}`,
    },
    testCases: [
      { input: 'exist([["A","B","C","E"],["S","F","C","S"],["A","D","E","E"]], "ABCCED")', expectedOutput: "true", isHidden: false },
      { input: 'exist([["A","B","C","E"],["S","F","C","S"],["A","D","E","E"]], "ABCB")', expectedOutput: "false", isHidden: false },
    ],
    functionName: "exist",
    tags: ["Array", "Backtracking", "Matrix"],
  },
  {
    slug: "number-of-islands",
    title: "Number of Islands",
    difficulty: "Medium",
    category: "Graph",
    description: {
      text: "Given an m x n 2D binary grid which represents a map of '1's (land) and '0's (water), return the number of islands.\n\nAn island is surrounded by water and is formed by connecting adjacent lands horizontally or vertically. You may assume all four edges of the grid are all surrounded by water.",
    },
    examples: [
      { input: 'grid = [["1","1","1","1","0"],["1","1","0","1","0"],["1","1","0","0","0"],["0","0","0","0","0"]]', output: "1", explanation: "" },
      { input: 'grid = [["1","1","0","0","0"],["1","1","0","0","0"],["0","0","1","0","0"],["0","0","0","1","1"]]', output: "3", explanation: "" },
    ],
    constraints: ["m == grid.length", "n == grid[i].length", "1 <= m, n <= 300", "grid[i][j] is '0' or '1'."],
    starterCode: {
      javascript: `/**\n * @param {character[][]} grid\n * @return {number}\n */\nfunction numIslands(grid) {\n  // DFS / BFS\n}`,
      python: `def numIslands(grid):\n    # DFS / BFS\n    pass`,
      java: `class Solution {\n    public int numIslands(char[][] grid) {\n        return 0;\n    }\n}`,
    },
    testCases: [
      { input: 'numIslands([["1","1","1","1","0"],["1","1","0","1","0"],["1","1","0","0","0"],["0","0","0","0","0"]])', expectedOutput: "1", isHidden: false },
      { input: 'numIslands([["1","1","0","0","0"],["1","1","0","0","0"],["0","0","1","0","0"],["0","0","0","1","1"]])', expectedOutput: "3", isHidden: false },
    ],
    functionName: "numIslands",
    tags: ["Array", "DFS", "BFS", "Matrix", "Union Find"],
  },
  {
    slug: "single-number",
    title: "Single Number",
    difficulty: "Easy",
    category: "Bit Manipulation",
    description: {
      text: "Given a non-empty array of integers nums, every element appears twice except for one. Find that single one.\n\nYou must implement a solution with a linear runtime complexity and use only constant extra space.",
    },
    examples: [
      { input: "nums = [2,2,1]", output: "1", explanation: "" },
      { input: "nums = [4,1,2,1,2]", output: "4", explanation: "" },
    ],
    constraints: ["1 <= nums.length <= 3 * 10^4", "-3 * 10^4 <= nums[i] <= 3 * 10^4"],
    starterCode: {
      javascript: `/**\n * @param {number[]} nums\n * @return {number}\n */\nfunction singleNumber(nums) {\n  // XOR trick\n}`,
      python: `def singleNumber(nums):\n    # XOR trick\n    pass`,
      java: `class Solution {\n    public int singleNumber(int[] nums) {\n        return 0;\n    }\n}`,
    },
    testCases: [
      { input: "singleNumber([2,2,1])", expectedOutput: "1", isHidden: false },
      { input: "singleNumber([4,1,2,1,2])", expectedOutput: "4", isHidden: false },
    ],
    functionName: "singleNumber",
    tags: ["Array", "Bit Manipulation"],
  },
  {
    slug: "reverse-string",
    title: "Reverse String",
    difficulty: "Easy",
    category: "String",
    description: {
      text: "Write a function that reverses a string. The input string is given as an array of characters s.\n\nYou must do this by modifying the input array in-place with O(1) extra memory.",
    },
    examples: [
      { input: 's = ["h","e","l","l","o"]', output: '["o","l","l","e","h"]', explanation: "" },
      { input: 's = ["H","a","n","n","a","h"]', output: '["h","a","n","n","a","H"]', explanation: "" },
    ],
    constraints: ["1 <= s.length <= 10^5", "s[i] is a printable ascii character."],
    starterCode: {
      javascript: `/**\n * @param {character[]} s\n * @return {void}\n */\nfunction reverseString(s) {\n  // Two pointer in-place\n}`,
      python: `def reverseString(s):\n    # Two pointer in-place\n    pass`,
      java: `class Solution {\n    public void reverseString(char[] s) {\n        // Two pointer in-place\n    }\n}`,
    },
    testCases: [
      { input: 'reverseString(["h","e","l","l","o"])', expectedOutput: '["o","l","l","e","h"]', isHidden: false },
    ],
    functionName: "reverseString",
    tags: ["Two Pointers", "String", "Recursion"],
  },
  {
    slug: "valid-anagram",
    title: "Valid Anagram",
    difficulty: "Easy",
    category: "String",
    description: {
      text: "Given two strings s and t, return true if t is an anagram of s, and false otherwise.\n\nAn Anagram is a word or phrase formed by rearranging the letters of a different word or phrase, typically using all the original letters exactly once.",
    },
    examples: [
      { input: 's = "anagram", t = "nagaram"', output: "true", explanation: "" },
      { input: 's = "rat", t = "car"', output: "false", explanation: "" },
    ],
    constraints: ["1 <= s.length, t.length <= 5 * 10^4", "s and t consist of lowercase English letters."],
    starterCode: {
      javascript: `/**\n * @param {string} s\n * @param {string} t\n * @return {boolean}\n */\nfunction isAnagram(s, t) {\n  // Your solution here\n}`,
      python: `def isAnagram(s, t):\n    # Your solution here\n    pass`,
      java: `class Solution {\n    public boolean isAnagram(String s, String t) {\n        return false;\n    }\n}`,
    },
    testCases: [
      { input: 'isAnagram("anagram", "nagaram")', expectedOutput: "true", isHidden: false },
      { input: 'isAnagram("rat", "car")', expectedOutput: "false", isHidden: false },
    ],
    functionName: "isAnagram",
    tags: ["Hash Table", "String", "Sorting"],
  },
  {
    slug: "fibonacci-number",
    title: "Fibonacci Number",
    difficulty: "Easy",
    category: "Math",
    description: {
      text: "The Fibonacci numbers, commonly denoted F(n) form a sequence, called the Fibonacci sequence, such that each number is the sum of the two preceding ones, starting from 0 and 1.\n\nF(0) = 0, F(1) = 1\nF(n) = F(n - 1) + F(n - 2), for n > 1.\n\nGiven n, calculate F(n).",
    },
    examples: [
      { input: "n = 2", output: "1", explanation: "F(2) = F(1) + F(0) = 1 + 0 = 1." },
      { input: "n = 3", output: "2", explanation: "F(3) = F(2) + F(1) = 1 + 1 = 2." },
      { input: "n = 4", output: "3", explanation: "F(4) = F(3) + F(2) = 2 + 1 = 3." },
    ],
    constraints: ["0 <= n <= 30"],
    starterCode: {
      javascript: `/**\n * @param {number} n\n * @return {number}\n */\nfunction fib(n) {\n  // Memoization or iterative\n}`,
      python: `def fib(n):\n    # Memoization or iterative\n    pass`,
      java: `class Solution {\n    public int fib(int n) {\n        return 0;\n    }\n}`,
    },
    testCases: [
      { input: "fib(2)", expectedOutput: "1", isHidden: false },
      { input: "fib(4)", expectedOutput: "3", isHidden: false },
      { input: "fib(10)", expectedOutput: "55", isHidden: true },
    ],
    functionName: "fib",
    tags: ["Math", "Dynamic Programming", "Recursion", "Memoization"],
  },

  // ═══════════════════════════════════════════════
  //  NEW PROBLEMS — Two Pointers
  // ═══════════════════════════════════════════════
  {
    slug: "move-zeroes",
    title: "Move Zeroes",
    difficulty: "Easy",
    category: "Two Pointers",
    description: {
      text: "Given an integer array nums, move all 0's to the end of it while maintaining the relative order of the non-zero elements.\n\nNote that you must do this in-place without making a copy of the array.",
    },
    examples: [
      { input: "nums = [0,1,0,3,12]", output: "[1,3,12,0,0]", explanation: "" },
      { input: "nums = [0]", output: "[0]", explanation: "" },
    ],
    constraints: ["1 <= nums.length <= 10^4", "-2^31 <= nums[i] <= 2^31 - 1"],
    starterCode: {
      javascript: `/**\n * @param {number[]} nums\n * @return {number[]}\n */\nfunction moveZeroes(nums) {\n  // Two pointer approach — modify in place and return\n}`,
      python: `def moveZeroes(nums):\n    # Two pointer approach — modify in place and return\n    pass`,
      java: `class Solution {\n    public int[] moveZeroes(int[] nums) {\n        // Two pointer approach — modify in place and return\n        return nums;\n    }\n}`,
    },
    testCases: [
      { input: "moveZeroes([0,1,0,3,12])", expectedOutput: "[1,3,12,0,0]", isHidden: false },
      { input: "moveZeroes([0])", expectedOutput: "[0]", isHidden: false },
      { input: "moveZeroes([1,2,3])", expectedOutput: "[1,2,3]", isHidden: true },
    ],
    functionName: "moveZeroes",
    tags: ["Array", "Two Pointers"],
  },
  {
    slug: "remove-duplicates-from-sorted-array",
    title: "Remove Duplicates from Sorted Array",
    difficulty: "Easy",
    category: "Two Pointers",
    description: {
      text: "Given an integer array nums sorted in non-decreasing order, remove the duplicates in-place such that each unique element appears only once. The relative order of the elements should be kept the same.\n\nReturn the number of unique elements in nums (k).",
    },
    examples: [
      { input: "nums = [1,1,2]", output: "2", explanation: "Your function should return k = 2, with the first two elements of nums being 1 and 2 respectively." },
      { input: "nums = [0,0,1,1,1,2,2,3,3,4]", output: "5", explanation: "Your function should return k = 5." },
    ],
    constraints: ["1 <= nums.length <= 3 * 10^4", "-100 <= nums[i] <= 100", "nums is sorted in non-decreasing order."],
    starterCode: {
      javascript: `/**\n * @param {number[]} nums\n * @return {number}\n */\nfunction removeDuplicates(nums) {\n  // Two pointer in-place\n}`,
      python: `def removeDuplicates(nums):\n    # Two pointer in-place\n    pass`,
      java: `class Solution {\n    public int removeDuplicates(int[] nums) {\n        // Two pointer in-place\n        return 0;\n    }\n}`,
    },
    testCases: [
      { input: "removeDuplicates([1,1,2])", expectedOutput: "2", isHidden: false },
      { input: "removeDuplicates([0,0,1,1,1,2,2,3,3,4])", expectedOutput: "5", isHidden: false },
      { input: "removeDuplicates([1])", expectedOutput: "1", isHidden: true },
    ],
    functionName: "removeDuplicates",
    tags: ["Array", "Two Pointers"],
  },
  {
    slug: "sort-colors",
    title: "Sort Colors",
    difficulty: "Medium",
    category: "Two Pointers",
    description: {
      text: "Given an array nums with n objects colored red, white, or blue, sort them in-place so that objects of the same color are adjacent, with the colors in the order red, white, and blue.\n\nWe will use the integers 0, 1, and 2 to represent the color red, white, and blue, respectively.\n\nYou must solve this problem without using the library's sort function.",
    },
    examples: [
      { input: "nums = [2,0,2,1,1,0]", output: "[0,0,1,1,2,2]", explanation: "" },
      { input: "nums = [2,0,1]", output: "[0,1,2]", explanation: "" },
    ],
    constraints: ["n == nums.length", "1 <= n <= 300", "nums[i] is either 0, 1, or 2."],
    starterCode: {
      javascript: `/**\n * @param {number[]} nums\n * @return {number[]}\n */\nfunction sortColors(nums) {\n  // Dutch National Flag algorithm — return sorted array\n}`,
      python: `def sortColors(nums):\n    # Dutch National Flag algorithm — return sorted list\n    pass`,
      java: `class Solution {\n    public int[] sortColors(int[] nums) {\n        // Dutch National Flag algorithm — return sorted array\n        return nums;\n    }\n}`,
    },
    testCases: [
      { input: "sortColors([2,0,2,1,1,0])", expectedOutput: "[0,0,1,1,2,2]", isHidden: false },
      { input: "sortColors([2,0,1])", expectedOutput: "[0,1,2]", isHidden: false },
      { input: "sortColors([0])", expectedOutput: "[0]", isHidden: true },
    ],
    functionName: "sortColors",
    tags: ["Array", "Two Pointers", "Sorting"],
  },
  {
    slug: "squares-of-a-sorted-array",
    title: "Squares of a Sorted Array",
    difficulty: "Easy",
    category: "Two Pointers",
    description: {
      text: "Given an integer array nums sorted in non-decreasing order, return an array of the squares of each number sorted in non-decreasing order.",
    },
    examples: [
      { input: "nums = [-4,-1,0,3,10]", output: "[0,1,9,16,100]", explanation: "" },
      { input: "nums = [-7,-3,2,3,11]", output: "[4,9,9,49,121]", explanation: "" },
    ],
    constraints: ["1 <= nums.length <= 10^4", "-10^4 <= nums[i] <= 10^4", "nums is sorted in non-decreasing order."],
    starterCode: {
      javascript: `/**\n * @param {number[]} nums\n * @return {number[]}\n */\nfunction sortedSquares(nums) {\n  // Two pointer O(n)\n}`,
      python: `def sortedSquares(nums):\n    # Two pointer O(n)\n    pass`,
      java: `class Solution {\n    public int[] sortedSquares(int[] nums) {\n        return new int[]{};\n    }\n}`,
    },
    testCases: [
      { input: "sortedSquares([-4,-1,0,3,10])", expectedOutput: "[0,1,9,16,100]", isHidden: false },
      { input: "sortedSquares([-7,-3,2,3,11])", expectedOutput: "[4,9,9,49,121]", isHidden: false },
      { input: "sortedSquares([1])", expectedOutput: "[1]", isHidden: true },
    ],
    functionName: "sortedSquares",
    tags: ["Array", "Two Pointers", "Sorting"],
  },
  {
    slug: "valid-palindrome-ii",
    title: "Valid Palindrome II",
    difficulty: "Easy",
    category: "Two Pointers",
    description: {
      text: "Given a string s, return true if the s can be palindrome after deleting at most one character from it.",
    },
    examples: [
      { input: 's = "aba"', output: "true", explanation: "" },
      { input: 's = "abca"', output: "true", explanation: 'You could delete the character "c".' },
      { input: 's = "abc"', output: "false", explanation: "" },
    ],
    constraints: ["1 <= s.length <= 10^5", "s consists of lowercase English letters."],
    starterCode: {
      javascript: `/**\n * @param {string} s\n * @return {boolean}\n */\nfunction validPalindrome(s) {\n  // Two pointers with one deletion\n}`,
      python: `def validPalindrome(s):\n    # Two pointers with one deletion\n    pass`,
      java: `class Solution {\n    public boolean validPalindrome(String s) {\n        return false;\n    }\n}`,
    },
    testCases: [
      { input: 'validPalindrome("aba")', expectedOutput: "true", isHidden: false },
      { input: 'validPalindrome("abca")', expectedOutput: "true", isHidden: false },
      { input: 'validPalindrome("abc")', expectedOutput: "false", isHidden: true },
    ],
    functionName: "validPalindrome",
    tags: ["Two Pointers", "String", "Greedy"],
  },

  // ═══════════════════════════════════════════════
  //  NEW PROBLEMS — Sliding Window
  // ═══════════════════════════════════════════════
  {
    slug: "maximum-average-subarray-i",
    title: "Maximum Average Subarray I",
    difficulty: "Easy",
    category: "Sliding Window",
    description: {
      text: "You are given an integer array nums consisting of n elements, and an integer k.\n\nFind a contiguous subarray whose length is equal to k that has the maximum average value and return this value.",
    },
    examples: [
      { input: "nums = [1,12,-5,-6,50,3], k = 4", output: "12.75", explanation: "Maximum average is (12 - 5 - 6 + 50) / 4 = 12.75" },
      { input: "nums = [5], k = 1", output: "5.0", explanation: "" },
    ],
    constraints: ["n == nums.length", "1 <= k <= n <= 10^5", "-10^4 <= nums[i] <= 10^4"],
    starterCode: {
      javascript: `/**\n * @param {number[]} nums\n * @param {number} k\n * @return {number}\n */\nfunction findMaxAverage(nums, k) {\n  // Sliding window\n}`,
      python: `def findMaxAverage(nums, k):\n    # Sliding window\n    pass`,
      java: `class Solution {\n    public double findMaxAverage(int[] nums, int k) {\n        return 0.0;\n    }\n}`,
    },
    testCases: [
      { input: "findMaxAverage([1,12,-5,-6,50,3], 4)", expectedOutput: "12.75", isHidden: false },
      { input: "findMaxAverage([5], 1)", expectedOutput: "5", isHidden: false },
    ],
    functionName: "findMaxAverage",
    tags: ["Array", "Sliding Window"],
  },
  {
    slug: "minimum-size-subarray-sum",
    title: "Minimum Size Subarray Sum",
    difficulty: "Medium",
    category: "Sliding Window",
    description: {
      text: "Given an array of positive integers nums and a positive integer target, return the minimal length of a subarray whose sum is greater than or equal to target. If there is no such subarray, return 0 instead.",
    },
    examples: [
      { input: "target = 7, nums = [2,3,1,2,4,3]", output: "2", explanation: "The subarray [4,3] has the minimal length under the problem constraint." },
      { input: "target = 4, nums = [1,4,4]", output: "1", explanation: "" },
      { input: "target = 11, nums = [1,1,1,1,1,1,1,1]", output: "0", explanation: "" },
    ],
    constraints: ["1 <= target <= 10^9", "1 <= nums.length <= 10^5", "1 <= nums[i] <= 10^4"],
    starterCode: {
      javascript: `/**\n * @param {number} target\n * @param {number[]} nums\n * @return {number}\n */\nfunction minSubArrayLen(target, nums) {\n  // Sliding window\n}`,
      python: `def minSubArrayLen(target, nums):\n    # Sliding window\n    pass`,
      java: `class Solution {\n    public int minSubArrayLen(int target, int[] nums) {\n        return 0;\n    }\n}`,
    },
    testCases: [
      { input: "minSubArrayLen(7, [2,3,1,2,4,3])", expectedOutput: "2", isHidden: false },
      { input: "minSubArrayLen(4, [1,4,4])", expectedOutput: "1", isHidden: false },
      { input: "minSubArrayLen(11, [1,1,1,1,1,1,1,1])", expectedOutput: "0", isHidden: true },
    ],
    functionName: "minSubArrayLen",
    tags: ["Array", "Sliding Window", "Binary Search", "Prefix Sum"],
  },
  {
    slug: "longest-repeating-character-replacement",
    title: "Longest Repeating Character Replacement",
    difficulty: "Medium",
    category: "Sliding Window",
    description: {
      text: "You are given a string s and an integer k. You can choose any character of the string and change it to any other uppercase English character. You can perform this operation at most k times.\n\nReturn the length of the longest substring containing the same letter you can get after performing the above operations.",
    },
    examples: [
      { input: 's = "ABAB", k = 2', output: "4", explanation: 'Replace the two "A"s with two "B"s or vice versa.' },
      { input: 's = "AABABBA", k = 1', output: "4", explanation: 'Replace the one "B" in the middle with "A" and form "AABAA" (length 4).' },
    ],
    constraints: ["1 <= s.length <= 10^5", "s consists of only uppercase English letters.", "0 <= k <= s.length"],
    starterCode: {
      javascript: `/**\n * @param {string} s\n * @param {number} k\n * @return {number}\n */\nfunction characterReplacement(s, k) {\n  // Sliding window\n}`,
      python: `def characterReplacement(s, k):\n    # Sliding window\n    pass`,
      java: `class Solution {\n    public int characterReplacement(String s, int k) {\n        return 0;\n    }\n}`,
    },
    testCases: [
      { input: 'characterReplacement("ABAB", 2)', expectedOutput: "4", isHidden: false },
      { input: 'characterReplacement("AABABBA", 1)', expectedOutput: "4", isHidden: false },
    ],
    functionName: "characterReplacement",
    tags: ["Hash Table", "String", "Sliding Window"],
  },

  // ═══════════════════════════════════════════════
  //  NEW PROBLEMS — Stack & Queue
  // ═══════════════════════════════════════════════
  {
    slug: "daily-temperatures",
    title: "Daily Temperatures",
    difficulty: "Medium",
    category: "Stack",
    description: {
      text: "Given an array of integers temperatures represents the daily temperatures, return an array answer such that answer[i] is the number of days you have to wait after the ith day to get a warmer temperature. If there is no future day for which this is possible, keep answer[i] == 0 instead.",
    },
    examples: [
      { input: "temperatures = [73,74,75,71,69,72,76,73]", output: "[1,1,4,2,1,1,0,0]", explanation: "" },
      { input: "temperatures = [30,40,50,60]", output: "[1,1,1,0]", explanation: "" },
    ],
    constraints: ["1 <= temperatures.length <= 10^5", "30 <= temperatures[i] <= 100"],
    starterCode: {
      javascript: `/**\n * @param {number[]} temperatures\n * @return {number[]}\n */\nfunction dailyTemperatures(temperatures) {\n  // Monotonic stack\n}`,
      python: `def dailyTemperatures(temperatures):\n    # Monotonic stack\n    pass`,
      java: `class Solution {\n    public int[] dailyTemperatures(int[] temperatures) {\n        return new int[]{};\n    }\n}`,
    },
    testCases: [
      { input: "dailyTemperatures([73,74,75,71,69,72,76,73])", expectedOutput: "[1,1,4,2,1,1,0,0]", isHidden: false },
      { input: "dailyTemperatures([30,40,50,60])", expectedOutput: "[1,1,1,0]", isHidden: false },
      { input: "dailyTemperatures([30,60,90])", expectedOutput: "[1,1,0]", isHidden: true },
    ],
    functionName: "dailyTemperatures",
    tags: ["Array", "Stack", "Monotonic Stack"],
  },
  {
    slug: "evaluate-reverse-polish-notation",
    title: "Evaluate Reverse Polish Notation",
    difficulty: "Medium",
    category: "Stack",
    description: {
      text: 'You are given an array of strings tokens that represents an arithmetic expression in a Reverse Polish Notation.\n\nEvaluate the expression. Return an integer that represents the value of the expression.\n\nNote that:\n- The valid operators are "+", "-", "*", and "/".\n- Each operand may be an integer or another expression.\n- The division between two integers always truncates toward zero.',
    },
    examples: [
      { input: 'tokens = ["2","1","+","3","*"]', output: "9", explanation: "((2 + 1) * 3) = 9" },
      { input: 'tokens = ["4","13","5","/","+"]', output: "6", explanation: "(4 + (13 / 5)) = 6" },
    ],
    constraints: ["1 <= tokens.length <= 10^4", 'tokens[i] is either an operator: "+", "-", "*", or "/", or an integer in the range [-200, 200].'],
    starterCode: {
      javascript: `/**\n * @param {string[]} tokens\n * @return {number}\n */\nfunction evalRPN(tokens) {\n  // Stack-based evaluation\n}`,
      python: `def evalRPN(tokens):\n    # Stack-based evaluation\n    pass`,
      java: `class Solution {\n    public int evalRPN(String[] tokens) {\n        return 0;\n    }\n}`,
    },
    testCases: [
      { input: 'evalRPN(["2","1","+","3","*"])', expectedOutput: "9", isHidden: false },
      { input: 'evalRPN(["4","13","5","/","+"])', expectedOutput: "6", isHidden: false },
      { input: 'evalRPN(["10","6","9","3","+","-11","*","/","*","17","+","5","+"])', expectedOutput: "22", isHidden: true },
    ],
    functionName: "evalRPN",
    tags: ["Array", "Math", "Stack"],
  },
  {
    slug: "next-greater-element-i",
    title: "Next Greater Element I",
    difficulty: "Easy",
    category: "Stack",
    description: {
      text: "The next greater element of some element x in an array is the first greater element that is to the right of x in the same array.\n\nYou are given two distinct 0-indexed integer arrays nums1 and nums2, where nums1 is a subset of nums2.\n\nFor each 0 <= i < nums1.length, find the index j such that nums1[i] == nums2[j] and determine the next greater element of nums2[j] in nums2. If there is no next greater element, then the answer for this query is -1.\n\nReturn an array ans of length nums1.length such that ans[i] is the next greater element as described above.",
    },
    examples: [
      { input: "nums1 = [4,1,2], nums2 = [1,3,4,2]", output: "[-1,3,-1]", explanation: "" },
      { input: "nums1 = [2,4], nums2 = [1,2,3,4]", output: "[3,-1]", explanation: "" },
    ],
    constraints: ["1 <= nums1.length <= nums2.length <= 1000", "0 <= nums1[i], nums2[i] <= 10^4", "All integers in nums1 and nums2 are unique."],
    starterCode: {
      javascript: `/**\n * @param {number[]} nums1\n * @param {number[]} nums2\n * @return {number[]}\n */\nfunction nextGreaterElement(nums1, nums2) {\n  // Monotonic stack + hash map\n}`,
      python: `def nextGreaterElement(nums1, nums2):\n    # Monotonic stack + hash map\n    pass`,
      java: `class Solution {\n    public int[] nextGreaterElement(int[] nums1, int[] nums2) {\n        return new int[]{};\n    }\n}`,
    },
    testCases: [
      { input: "nextGreaterElement([4,1,2], [1,3,4,2])", expectedOutput: "[-1,3,-1]", isHidden: false },
      { input: "nextGreaterElement([2,4], [1,2,3,4])", expectedOutput: "[3,-1]", isHidden: false },
    ],
    functionName: "nextGreaterElement",
    tags: ["Array", "Hash Table", "Stack", "Monotonic Stack"],
  },

  // ═══════════════════════════════════════════════
  //  NEW PROBLEMS — Hash Table
  // ═══════════════════════════════════════════════
  {
    slug: "group-anagrams",
    title: "Group Anagrams",
    difficulty: "Medium",
    category: "Hash Table",
    description: {
      text: "Given an array of strings strs, group the anagrams together. You can return the answer in any order.\n\nAn Anagram is a word or phrase formed by rearranging the letters of a different word or phrase, typically using all the original letters exactly once.",
    },
    examples: [
      { input: 'strs = ["eat","tea","tan","ate","nat","bat"]', output: '[["bat"],["nat","tan"],["ate","eat","tea"]]', explanation: "" },
      { input: 'strs = [""]', output: '[[""]]', explanation: "" },
    ],
    constraints: ["1 <= strs.length <= 10^4", "0 <= strs[i].length <= 100", "strs[i] consists of lowercase English letters."],
    starterCode: {
      javascript: `/**\n * @param {string[]} strs\n * @return {string[][]}\n */\nfunction groupAnagrams(strs) {\n  // Hash map with sorted key\n}`,
      python: `def groupAnagrams(strs):\n    # Hash map with sorted key\n    pass`,
      java: `class Solution {\n    public List<List<String>> groupAnagrams(String[] strs) {\n        return new ArrayList<>();\n    }\n}`,
    },
    testCases: [
      { input: 'groupAnagrams([""])', expectedOutput: '[[""]]', isHidden: false },
      { input: 'groupAnagrams(["a"])', expectedOutput: '[["a"]]', isHidden: false },
    ],
    functionName: "groupAnagrams",
    tags: ["Array", "Hash Table", "String", "Sorting"],
  },
  {
    slug: "top-k-frequent-elements",
    title: "Top K Frequent Elements",
    difficulty: "Medium",
    category: "Hash Table",
    description: {
      text: "Given an integer array nums and an integer k, return the k most frequent elements. You may return the answer in any order.",
    },
    examples: [
      { input: "nums = [1,1,1,2,2,3], k = 2", output: "[1,2]", explanation: "" },
      { input: "nums = [1], k = 1", output: "[1]", explanation: "" },
    ],
    constraints: ["1 <= nums.length <= 10^5", "-10^4 <= nums[i] <= 10^4", "k is in the range [1, the number of unique elements in the array]."],
    starterCode: {
      javascript: `/**\n * @param {number[]} nums\n * @param {number} k\n * @return {number[]}\n */\nfunction topKFrequent(nums, k) {\n  // Bucket sort or heap\n}`,
      python: `def topKFrequent(nums, k):\n    # Bucket sort or heap\n    pass`,
      java: `class Solution {\n    public int[] topKFrequent(int[] nums, int k) {\n        return new int[]{};\n    }\n}`,
    },
    testCases: [
      { input: "topKFrequent([1,1,1,2,2,3], 2)", expectedOutput: "[1,2]", isHidden: false },
      { input: "topKFrequent([1], 1)", expectedOutput: "[1]", isHidden: false },
    ],
    functionName: "topKFrequent",
    tags: ["Array", "Hash Table", "Sorting", "Heap"],
  },
  {
    slug: "roman-to-integer",
    title: "Roman to Integer",
    difficulty: "Easy",
    category: "Hash Table",
    description: {
      text: "Roman numerals are represented by seven different symbols: I, V, X, L, C, D and M.\n\nSymbol: I=1, V=5, X=10, L=50, C=100, D=500, M=1000\n\nGiven a roman numeral, convert it to an integer.",
    },
    examples: [
      { input: 's = "III"', output: "3", explanation: "III = 3." },
      { input: 's = "LVIII"', output: "58", explanation: "L = 50, V = 5, III = 3." },
      { input: 's = "MCMXCIV"', output: "1994", explanation: "M = 1000, CM = 900, XC = 90 and IV = 4." },
    ],
    constraints: ["1 <= s.length <= 15", "s contains only the characters ('I', 'V', 'X', 'L', 'C', 'D', 'M')."],
    starterCode: {
      javascript: `/**\n * @param {string} s\n * @return {number}\n */\nfunction romanToInt(s) {\n  // Hash map approach\n}`,
      python: `def romanToInt(s):\n    # Hash map approach\n    pass`,
      java: `class Solution {\n    public int romanToInt(String s) {\n        return 0;\n    }\n}`,
    },
    testCases: [
      { input: 'romanToInt("III")', expectedOutput: "3", isHidden: false },
      { input: 'romanToInt("LVIII")', expectedOutput: "58", isHidden: false },
      { input: 'romanToInt("MCMXCIV")', expectedOutput: "1994", isHidden: true },
    ],
    functionName: "romanToInt",
    tags: ["Hash Table", "Math", "String"],
  },
  {
    slug: "isomorphic-strings",
    title: "Isomorphic Strings",
    difficulty: "Easy",
    category: "Hash Table",
    description: {
      text: "Given two strings s and t, determine if they are isomorphic.\n\nTwo strings s and t are isomorphic if the characters in s can be replaced to get t.\n\nAll occurrences of a character must be replaced with another character while preserving the order of characters. No two characters may map to the same character, but a character may map to itself.",
    },
    examples: [
      { input: 's = "egg", t = "add"', output: "true", explanation: "" },
      { input: 's = "foo", t = "bar"', output: "false", explanation: "" },
      { input: 's = "paper", t = "title"', output: "true", explanation: "" },
    ],
    constraints: ["1 <= s.length <= 5 * 10^4", "t.length == s.length", "s and t consist of any valid ascii character."],
    starterCode: {
      javascript: `/**\n * @param {string} s\n * @param {string} t\n * @return {boolean}\n */\nfunction isIsomorphic(s, t) {\n  // Two hash maps\n}`,
      python: `def isIsomorphic(s, t):\n    # Two hash maps\n    pass`,
      java: `class Solution {\n    public boolean isIsomorphic(String s, String t) {\n        return false;\n    }\n}`,
    },
    testCases: [
      { input: 'isIsomorphic("egg", "add")', expectedOutput: "true", isHidden: false },
      { input: 'isIsomorphic("foo", "bar")', expectedOutput: "false", isHidden: false },
      { input: 'isIsomorphic("paper", "title")', expectedOutput: "true", isHidden: true },
    ],
    functionName: "isIsomorphic",
    tags: ["Hash Table", "String"],
  },
  {
    slug: "happy-number",
    title: "Happy Number",
    difficulty: "Easy",
    category: "Hash Table",
    description: {
      text: "Write an algorithm to determine if a number n is happy.\n\nA happy number is a number defined by the following process:\n- Starting with any positive integer, replace the number by the sum of the squares of its digits.\n- Repeat the process until the number equals 1 (where it will stay), or it loops endlessly in a cycle which does not include 1.\n- Those numbers for which this process ends in 1 are happy.\n\nReturn true if n is a happy number, and false if not.",
    },
    examples: [
      { input: "n = 19", output: "true", explanation: "1² + 9² = 82 → 8² + 2² = 68 → 6² + 8² = 100 → 1² + 0² + 0² = 1" },
      { input: "n = 2", output: "false", explanation: "" },
    ],
    constraints: ["1 <= n <= 2^31 - 1"],
    starterCode: {
      javascript: `/**\n * @param {number} n\n * @return {boolean}\n */\nfunction isHappy(n) {\n  // Hash set or Floyd's cycle detection\n}`,
      python: `def isHappy(n):\n    # Hash set or Floyd's cycle detection\n    pass`,
      java: `class Solution {\n    public boolean isHappy(int n) {\n        return false;\n    }\n}`,
    },
    testCases: [
      { input: "isHappy(19)", expectedOutput: "true", isHidden: false },
      { input: "isHappy(2)", expectedOutput: "false", isHidden: false },
      { input: "isHappy(7)", expectedOutput: "true", isHidden: true },
    ],
    functionName: "isHappy",
    tags: ["Hash Table", "Math", "Two Pointers"],
  },

  // ═══════════════════════════════════════════════
  //  NEW PROBLEMS — Greedy
  // ═══════════════════════════════════════════════
  {
    slug: "jump-game",
    title: "Jump Game",
    difficulty: "Medium",
    category: "Greedy",
    description: {
      text: "You are given an integer array nums. You are initially positioned at the array's first index, and each element in the array represents your maximum jump length at that position.\n\nReturn true if you can reach the last index, or false otherwise.",
    },
    examples: [
      { input: "nums = [2,3,1,1,4]", output: "true", explanation: "Jump 1 step from index 0 to 1, then 3 steps to the last index." },
      { input: "nums = [3,2,1,0,4]", output: "false", explanation: "You will always arrive at index 3 no matter what. Its maximum jump length is 0, which makes it impossible to reach the last index." },
    ],
    constraints: ["1 <= nums.length <= 10^4", "0 <= nums[i] <= 10^5"],
    starterCode: {
      javascript: `/**\n * @param {number[]} nums\n * @return {boolean}\n */\nfunction canJump(nums) {\n  // Greedy — track maximum reachable index\n}`,
      python: `def canJump(nums):\n    # Greedy — track maximum reachable index\n    pass`,
      java: `class Solution {\n    public boolean canJump(int[] nums) {\n        return false;\n    }\n}`,
    },
    testCases: [
      { input: "canJump([2,3,1,1,4])", expectedOutput: "true", isHidden: false },
      { input: "canJump([3,2,1,0,4])", expectedOutput: "false", isHidden: false },
      { input: "canJump([0])", expectedOutput: "true", isHidden: true },
    ],
    functionName: "canJump",
    tags: ["Array", "Dynamic Programming", "Greedy"],
  },
  {
    slug: "gas-station",
    title: "Gas Station",
    difficulty: "Medium",
    category: "Greedy",
    description: {
      text: "There are n gas stations along a circular route, where the amount of gas at the ith station is gas[i].\n\nYou have a car with an unlimited gas tank and it costs cost[i] of gas to travel from the ith station to its next (i + 1)th station. You begin the journey with an empty tank at one of the gas stations.\n\nGiven two integer arrays gas and cost, return the starting gas station's index if you can travel around the circuit once in the clockwise direction, otherwise return -1. If there exists a solution, it is guaranteed to be unique.",
    },
    examples: [
      { input: "gas = [1,2,3,4,5], cost = [3,4,5,1,2]", output: "3", explanation: "" },
      { input: "gas = [2,3,4], cost = [3,4,3]", output: "-1", explanation: "" },
    ],
    constraints: ["n == gas.length == cost.length", "1 <= n <= 10^5", "0 <= gas[i], cost[i] <= 10^4"],
    starterCode: {
      javascript: `/**\n * @param {number[]} gas\n * @param {number[]} cost\n * @return {number}\n */\nfunction canCompleteCircuit(gas, cost) {\n  // Greedy single-pass\n}`,
      python: `def canCompleteCircuit(gas, cost):\n    # Greedy single-pass\n    pass`,
      java: `class Solution {\n    public int canCompleteCircuit(int[] gas, int[] cost) {\n        return -1;\n    }\n}`,
    },
    testCases: [
      { input: "canCompleteCircuit([1,2,3,4,5], [3,4,5,1,2])", expectedOutput: "3", isHidden: false },
      { input: "canCompleteCircuit([2,3,4], [3,4,3])", expectedOutput: "-1", isHidden: false },
    ],
    functionName: "canCompleteCircuit",
    tags: ["Array", "Greedy"],
  },
  {
    slug: "assign-cookies",
    title: "Assign Cookies",
    difficulty: "Easy",
    category: "Greedy",
    description: {
      text: "Assume you are an awesome parent and want to give your children some cookies. But, you should give each child at most one cookie.\n\nEach child i has a greed factor g[i], which is the minimum size of a cookie that the child will be content with; and each cookie j has a size s[j]. If s[j] >= g[i], we can assign the cookie j to the child i, and the child i will be content.\n\nYour goal is to maximize the number of your content children and output the maximum number.",
    },
    examples: [
      { input: "g = [1,2,3], s = [1,1]", output: "1", explanation: "You have 3 children and 2 cookies. The greed factors of 3 children are 1, 2, 3." },
      { input: "g = [1,2], s = [1,2,3]", output: "2", explanation: "" },
    ],
    constraints: ["1 <= g.length <= 3 * 10^4", "0 <= s.length <= 3 * 10^4", "1 <= g[i], s[j] <= 2^31 - 1"],
    starterCode: {
      javascript: `/**\n * @param {number[]} g\n * @param {number[]} s\n * @return {number}\n */\nfunction findContentChildren(g, s) {\n  // Sort + greedy\n}`,
      python: `def findContentChildren(g, s):\n    # Sort + greedy\n    pass`,
      java: `class Solution {\n    public int findContentChildren(int[] g, int[] s) {\n        return 0;\n    }\n}`,
    },
    testCases: [
      { input: "findContentChildren([1,2,3], [1,1])", expectedOutput: "1", isHidden: false },
      { input: "findContentChildren([1,2], [1,2,3])", expectedOutput: "2", isHidden: false },
    ],
    functionName: "findContentChildren",
    tags: ["Array", "Greedy", "Sorting", "Two Pointers"],
  },
  {
    slug: "maximum-units-on-a-truck",
    title: "Maximum Units on a Truck",
    difficulty: "Easy",
    category: "Greedy",
    description: {
      text: "You are assigned to put some amount of boxes onto one truck. You are given a 2D array boxTypes, where boxTypes[i] = [numberOfBoxesi, numberOfUnitsPerBoxi].\n\nThe number of units a box can carry is numberOfUnitsPerBoxi. You are also given an integer truckSize, which is the maximum number of boxes that can be put on the truck.\n\nReturn the maximum total number of units that can be put on the truck.",
    },
    examples: [
      { input: "boxTypes = [[1,3],[2,2],[3,1]], truckSize = 4", output: "8", explanation: "Take all boxes of the first and second types, and one box of the third type." },
      { input: "boxTypes = [[5,10],[2,5],[4,7],[3,9]], truckSize = 10", output: "91", explanation: "" },
    ],
    constraints: ["1 <= boxTypes.length <= 1000", "1 <= numberOfBoxesi, numberOfUnitsPerBoxi <= 1000", "1 <= truckSize <= 10^6"],
    starterCode: {
      javascript: `/**\n * @param {number[][]} boxTypes\n * @param {number} truckSize\n * @return {number}\n */\nfunction maximumUnits(boxTypes, truckSize) {\n  // Greedy — sort by units per box descending\n}`,
      python: `def maximumUnits(boxTypes, truckSize):\n    # Greedy — sort by units per box descending\n    pass`,
      java: `class Solution {\n    public int maximumUnits(int[][] boxTypes, int truckSize) {\n        return 0;\n    }\n}`,
    },
    testCases: [
      { input: "maximumUnits([[1,3],[2,2],[3,1]], 4)", expectedOutput: "8", isHidden: false },
      { input: "maximumUnits([[5,10],[2,5],[4,7],[3,9]], 10)", expectedOutput: "91", isHidden: false },
    ],
    functionName: "maximumUnits",
    tags: ["Array", "Greedy", "Sorting"],
  },

  // ═══════════════════════════════════════════════
  //  NEW PROBLEMS — Math & Number Theory
  // ═══════════════════════════════════════════════
  {
    slug: "power-of-three",
    title: "Power of Three",
    difficulty: "Easy",
    category: "Math",
    description: {
      text: "Given an integer n, return true if it is a power of three. Otherwise, return false.\n\nAn integer n is a power of three, if there exists an integer x such that n == 3^x.",
    },
    examples: [
      { input: "n = 27", output: "true", explanation: "27 = 3^3" },
      { input: "n = 0", output: "false", explanation: "There is no x where 3^x = 0." },
      { input: "n = -1", output: "false", explanation: "" },
    ],
    constraints: ["-2^31 <= n <= 2^31 - 1"],
    starterCode: {
      javascript: `/**\n * @param {number} n\n * @return {boolean}\n */\nfunction isPowerOfThree(n) {\n  // Your solution here\n}`,
      python: `def isPowerOfThree(n):\n    # Your solution here\n    pass`,
      java: `class Solution {\n    public boolean isPowerOfThree(int n) {\n        return false;\n    }\n}`,
    },
    testCases: [
      { input: "isPowerOfThree(27)", expectedOutput: "true", isHidden: false },
      { input: "isPowerOfThree(0)", expectedOutput: "false", isHidden: false },
      { input: "isPowerOfThree(9)", expectedOutput: "true", isHidden: true },
      { input: "isPowerOfThree(45)", expectedOutput: "false", isHidden: true },
    ],
    functionName: "isPowerOfThree",
    tags: ["Math", "Recursion"],
  },
  {
    slug: "count-primes",
    title: "Count Primes",
    difficulty: "Medium",
    category: "Math",
    description: {
      text: "Given an integer n, return the number of prime numbers that are strictly less than n.",
    },
    examples: [
      { input: "n = 10", output: "4", explanation: "There are 4 prime numbers less than 10: 2, 3, 5, 7." },
      { input: "n = 0", output: "0", explanation: "" },
      { input: "n = 1", output: "0", explanation: "" },
    ],
    constraints: ["0 <= n <= 5 * 10^6"],
    starterCode: {
      javascript: `/**\n * @param {number} n\n * @return {number}\n */\nfunction countPrimes(n) {\n  // Sieve of Eratosthenes\n}`,
      python: `def countPrimes(n):\n    # Sieve of Eratosthenes\n    pass`,
      java: `class Solution {\n    public int countPrimes(int n) {\n        return 0;\n    }\n}`,
    },
    testCases: [
      { input: "countPrimes(10)", expectedOutput: "4", isHidden: false },
      { input: "countPrimes(0)", expectedOutput: "0", isHidden: false },
      { input: "countPrimes(1)", expectedOutput: "0", isHidden: true },
    ],
    functionName: "countPrimes",
    tags: ["Array", "Math", "Enumeration"],
  },
  {
    slug: "plus-one",
    title: "Plus One",
    difficulty: "Easy",
    category: "Math",
    description: {
      text: "You are given a large integer represented as an integer array digits, where each digits[i] is the ith digit of the integer. The digits are ordered from most significant to least significant in left-to-right order.\n\nThe large integer does not contain any leading 0's.\n\nIncrement the large integer by one and return the resulting array of digits.",
    },
    examples: [
      { input: "digits = [1,2,3]", output: "[1,2,4]", explanation: "The array represents the integer 123. Incrementing by one gives 123 + 1 = 124." },
      { input: "digits = [9]", output: "[1,0]", explanation: "The array represents the integer 9. Incrementing by one gives 9 + 1 = 10." },
    ],
    constraints: ["1 <= digits.length <= 100", "0 <= digits[i] <= 9"],
    starterCode: {
      javascript: `/**\n * @param {number[]} digits\n * @return {number[]}\n */\nfunction plusOne(digits) {\n  // Handle carry\n}`,
      python: `def plusOne(digits):\n    # Handle carry\n    pass`,
      java: `class Solution {\n    public int[] plusOne(int[] digits) {\n        return new int[]{};\n    }\n}`,
    },
    testCases: [
      { input: "plusOne([1,2,3])", expectedOutput: "[1,2,4]", isHidden: false },
      { input: "plusOne([9])", expectedOutput: "[1,0]", isHidden: false },
      { input: "plusOne([9,9,9])", expectedOutput: "[1,0,0,0]", isHidden: true },
    ],
    functionName: "plusOne",
    tags: ["Array", "Math"],
  },
  {
    slug: "add-binary",
    title: "Add Binary",
    difficulty: "Easy",
    category: "Math",
    description: {
      text: 'Given two binary strings a and b, return their sum as a binary string.',
    },
    examples: [
      { input: 'a = "11", b = "1"', output: '"100"', explanation: "" },
      { input: 'a = "1010", b = "1011"', output: '"10101"', explanation: "" },
    ],
    constraints: ["1 <= a.length, b.length <= 10^4", "a and b consist only of '0' or '1' characters.", "Each string does not contain leading zeros except for the zero itself."],
    starterCode: {
      javascript: `/**\n * @param {string} a\n * @param {string} b\n * @return {string}\n */\nfunction addBinary(a, b) {\n  // Bit by bit addition\n}`,
      python: `def addBinary(a, b):\n    # Bit by bit addition\n    pass`,
      java: `class Solution {\n    public String addBinary(String a, String b) {\n        return "";\n    }\n}`,
    },
    testCases: [
      { input: 'addBinary("11", "1")', expectedOutput: '"100"', isHidden: false },
      { input: 'addBinary("1010", "1011")', expectedOutput: '"10101"', isHidden: false },
    ],
    functionName: "addBinary",
    tags: ["Math", "String", "Bit Manipulation"],
  },
  {
    slug: "sqrtx",
    title: "Sqrt(x)",
    difficulty: "Easy",
    category: "Math",
    description: {
      text: "Given a non-negative integer x, return the square root of x rounded down to the nearest integer. The returned integer should be non-negative as well.\n\nYou must not use any built-in exponent function or operator.",
    },
    examples: [
      { input: "x = 4", output: "2", explanation: "The square root of 4 is 2." },
      { input: "x = 8", output: "2", explanation: "The square root of 8 is 2.82842..., and since we round it down to the nearest integer, 2 is returned." },
    ],
    constraints: ["0 <= x <= 2^31 - 1"],
    starterCode: {
      javascript: `/**\n * @param {number} x\n * @return {number}\n */\nfunction mySqrt(x) {\n  // Binary search\n}`,
      python: `def mySqrt(x):\n    # Binary search\n    pass`,
      java: `class Solution {\n    public int mySqrt(int x) {\n        return 0;\n    }\n}`,
    },
    testCases: [
      { input: "mySqrt(4)", expectedOutput: "2", isHidden: false },
      { input: "mySqrt(8)", expectedOutput: "2", isHidden: false },
      { input: "mySqrt(0)", expectedOutput: "0", isHidden: true },
      { input: "mySqrt(1)", expectedOutput: "1", isHidden: true },
    ],
    functionName: "mySqrt",
    tags: ["Math", "Binary Search"],
  },

  // ═══════════════════════════════════════════════
  //  NEW PROBLEMS — Sorting & Searching
  // ═══════════════════════════════════════════════
  {
    slug: "search-insert-position",
    title: "Search Insert Position",
    difficulty: "Easy",
    category: "Binary Search",
    description: {
      text: "Given a sorted array of distinct integers and a target value, return the index if the target is found. If not, return the index where it would be if it were inserted in order.\n\nYou must write an algorithm with O(log n) runtime complexity.",
    },
    examples: [
      { input: "nums = [1,3,5,6], target = 5", output: "2", explanation: "" },
      { input: "nums = [1,3,5,6], target = 2", output: "1", explanation: "" },
      { input: "nums = [1,3,5,6], target = 7", output: "4", explanation: "" },
    ],
    constraints: ["1 <= nums.length <= 10^4", "-10^4 <= nums[i] <= 10^4", "nums contains distinct values sorted in ascending order."],
    starterCode: {
      javascript: `/**\n * @param {number[]} nums\n * @param {number} target\n * @return {number}\n */\nfunction searchInsert(nums, target) {\n  // Binary search\n}`,
      python: `def searchInsert(nums, target):\n    # Binary search\n    pass`,
      java: `class Solution {\n    public int searchInsert(int[] nums, int target) {\n        return 0;\n    }\n}`,
    },
    testCases: [
      { input: "searchInsert([1,3,5,6], 5)", expectedOutput: "2", isHidden: false },
      { input: "searchInsert([1,3,5,6], 2)", expectedOutput: "1", isHidden: false },
      { input: "searchInsert([1,3,5,6], 7)", expectedOutput: "4", isHidden: true },
    ],
    functionName: "searchInsert",
    tags: ["Array", "Binary Search"],
  },
  {
    slug: "find-peak-element",
    title: "Find Peak Element",
    difficulty: "Medium",
    category: "Binary Search",
    description: {
      text: "A peak element is an element that is strictly greater than its neighbors.\n\nGiven a 0-indexed integer array nums, find a peak element, and return its index. If the array contains multiple peaks, return the index to any of the peaks.\n\nYou may imagine that nums[-1] = nums[n] = -∞. In other words, an element is always considered to be strictly greater than a neighbor that is outside the array.\n\nYou must write an algorithm that runs in O(log n) time.",
    },
    examples: [
      { input: "nums = [1,2,3,1]", output: "2", explanation: "3 is a peak element and your function should return the index number 2." },
      { input: "nums = [1,2,1,3,5,6,4]", output: "5", explanation: "Your function can return either index number 1 where the peak element is 2, or index number 5 where the peak element is 6." },
    ],
    constraints: ["1 <= nums.length <= 1000", "-2^31 <= nums[i] <= 2^31 - 1", "nums[i] != nums[i + 1] for all valid i."],
    starterCode: {
      javascript: `/**\n * @param {number[]} nums\n * @return {number}\n */\nfunction findPeakElement(nums) {\n  // Binary search O(log n)\n}`,
      python: `def findPeakElement(nums):\n    # Binary search O(log n)\n    pass`,
      java: `class Solution {\n    public int findPeakElement(int[] nums) {\n        return 0;\n    }\n}`,
    },
    testCases: [
      { input: "findPeakElement([1,2,3,1])", expectedOutput: "2", isHidden: false },
      { input: "findPeakElement([1])", expectedOutput: "0", isHidden: false },
    ],
    functionName: "findPeakElement",
    tags: ["Array", "Binary Search"],
  },
  {
    slug: "search-a-2d-matrix",
    title: "Search a 2D Matrix",
    difficulty: "Medium",
    category: "Binary Search",
    description: {
      text: "You are given an m x n integer matrix matrix with the following two properties:\n\n- Each row is sorted in non-decreasing order.\n- The first integer of each row is greater than the last integer of the previous row.\n\nGiven an integer target, return true if target is in matrix, or false otherwise.\n\nYou must write a solution in O(log(m * n)) time complexity.",
    },
    examples: [
      { input: "matrix = [[1,3,5,7],[10,11,16,20],[23,30,34,60]], target = 3", output: "true", explanation: "" },
      { input: "matrix = [[1,3,5,7],[10,11,16,20],[23,30,34,60]], target = 13", output: "false", explanation: "" },
    ],
    constraints: ["m == matrix.length", "n == matrix[i].length", "1 <= m, n <= 100", "-10^4 <= matrix[i][j], target <= 10^4"],
    starterCode: {
      javascript: `/**\n * @param {number[][]} matrix\n * @param {number} target\n * @return {boolean}\n */\nfunction searchMatrix(matrix, target) {\n  // Binary search on flattened matrix\n}`,
      python: `def searchMatrix(matrix, target):\n    # Binary search on flattened matrix\n    pass`,
      java: `class Solution {\n    public boolean searchMatrix(int[][] matrix, int target) {\n        return false;\n    }\n}`,
    },
    testCases: [
      { input: "searchMatrix([[1,3,5,7],[10,11,16,20],[23,30,34,60]], 3)", expectedOutput: "true", isHidden: false },
      { input: "searchMatrix([[1,3,5,7],[10,11,16,20],[23,30,34,60]], 13)", expectedOutput: "false", isHidden: false },
    ],
    functionName: "searchMatrix",
    tags: ["Array", "Binary Search", "Matrix"],
  },

  // ═══════════════════════════════════════════════
  //  NEW PROBLEMS — String Manipulation
  // ═══════════════════════════════════════════════
  {
    slug: "string-to-integer-atoi",
    title: "String to Integer (atoi)",
    difficulty: "Medium",
    category: "String",
    description: {
      text: 'Implement the myAtoi(string s) function, which converts a string to a 32-bit signed integer.\n\nThe algorithm:\n1. Read in and ignore any leading whitespace.\n2. Check if the next character is \'-\' or \'+\'. Read this character in if it is either.\n3. Read in next the characters until the next non-digit character or the end of the input is reached. The rest of the string is ignored.\n4. Convert these digits into an integer. If no digits were read, then the integer is 0.\n5. Clamp the integer so that it remains in the range [-2^31, 2^31 - 1].',
    },
    examples: [
      { input: 's = "42"', output: "42", explanation: "" },
      { input: 's = "   -42"', output: "-42", explanation: "Leading whitespace is ignored." },
      { input: 's = "4193 with words"', output: "4193", explanation: "Reading stops at the non-digit character." },
    ],
    constraints: ["0 <= s.length <= 200", "s consists of English letters, digits, ' ', '+', '-', and '.'."],
    starterCode: {
      javascript: `/**\n * @param {string} s\n * @return {number}\n */\nfunction myAtoi(s) {\n  // Parse string to integer with edge cases\n}`,
      python: `def myAtoi(s):\n    # Parse string to integer with edge cases\n    pass`,
      java: `class Solution {\n    public int myAtoi(String s) {\n        return 0;\n    }\n}`,
    },
    testCases: [
      { input: 'myAtoi("42")', expectedOutput: "42", isHidden: false },
      { input: 'myAtoi("   -42")', expectedOutput: "-42", isHidden: false },
      { input: 'myAtoi("4193 with words")', expectedOutput: "4193", isHidden: true },
      { input: 'myAtoi("words and 987")', expectedOutput: "0", isHidden: true },
    ],
    functionName: "myAtoi",
    tags: ["String"],
  },
  {
    slug: "longest-palindromic-substring",
    title: "Longest Palindromic Substring",
    difficulty: "Medium",
    category: "String",
    description: {
      text: "Given a string s, return the longest palindromic substring in s.",
    },
    examples: [
      { input: 's = "babad"', output: '"bab"', explanation: '"aba" is also a valid answer.' },
      { input: 's = "cbbd"', output: '"bb"', explanation: "" },
    ],
    constraints: ["1 <= s.length <= 1000", "s consist of only digits and English letters."],
    starterCode: {
      javascript: `/**\n * @param {string} s\n * @return {string}\n */\nfunction longestPalindrome(s) {\n  // Expand around center\n}`,
      python: `def longestPalindrome(s):\n    # Expand around center\n    pass`,
      java: `class Solution {\n    public String longestPalindrome(String s) {\n        return "";\n    }\n}`,
    },
    testCases: [
      { input: 'longestPalindrome("babad")', expectedOutput: '"bab"', isHidden: false },
      { input: 'longestPalindrome("cbbd")', expectedOutput: '"bb"', isHidden: false },
    ],
    functionName: "longestPalindrome",
    tags: ["String", "Dynamic Programming"],
  },
  {
    slug: "count-and-say",
    title: "Count and Say",
    difficulty: "Medium",
    category: "String",
    description: {
      text: 'The count-and-say sequence is a sequence of digit strings defined by the recursive formula:\n\n- countAndSay(1) = "1"\n- countAndSay(n) is the way you would "say" the digit string from countAndSay(n-1), which is then converted into a different digit string.\n\nFor example, the saying of "3322251" would be "23 32 15 11" → "23321511".',
    },
    examples: [
      { input: "n = 1", output: '"1"', explanation: "This is the base case." },
      { input: "n = 4", output: '"1211"', explanation: 'countAndSay(1) = "1", countAndSay(2) = "11", countAndSay(3) = "21", countAndSay(4) = "1211"' },
    ],
    constraints: ["1 <= n <= 30"],
    starterCode: {
      javascript: `/**\n * @param {number} n\n * @return {string}\n */\nfunction countAndSay(n) {\n  // Iterative simulation\n}`,
      python: `def countAndSay(n):\n    # Iterative simulation\n    pass`,
      java: `class Solution {\n    public String countAndSay(int n) {\n        return "";\n    }\n}`,
    },
    testCases: [
      { input: "countAndSay(1)", expectedOutput: '"1"', isHidden: false },
      { input: "countAndSay(4)", expectedOutput: '"1211"', isHidden: false },
      { input: "countAndSay(5)", expectedOutput: '"111221"', isHidden: true },
    ],
    functionName: "countAndSay",
    tags: ["String"],
  },
  {
    slug: "zigzag-conversion",
    title: "Zigzag Conversion",
    difficulty: "Medium",
    category: "String",
    description: {
      text: 'The string "PAYPALISHIRING" is written in a zigzag pattern on a given number of rows like this:\n\nP   A   H   N\nA P L S I I G\nY   I   R\n\nAnd then read line by line: "PAHNAPLSIIGYIR"\n\nWrite the code that will take a string and make this conversion given a number of rows.',
    },
    examples: [
      { input: 's = "PAYPALISHIRING", numRows = 3', output: '"PAHNAPLSIIGYIR"', explanation: "" },
      { input: 's = "PAYPALISHIRING", numRows = 4', output: '"PINALSIGYAHRPI"', explanation: "" },
      { input: 's = "A", numRows = 1', output: '"A"', explanation: "" },
    ],
    constraints: ["1 <= s.length <= 1000", "s consists of English letters, ',' and '.'.", "1 <= numRows <= 1000"],
    starterCode: {
      javascript: `/**\n * @param {string} s\n * @param {number} numRows\n * @return {string}\n */\nfunction convert(s, numRows) {\n  // Simulate zigzag pattern\n}`,
      python: `def convert(s, numRows):\n    # Simulate zigzag pattern\n    pass`,
      java: `class Solution {\n    public String convert(String s, int numRows) {\n        return "";\n    }\n}`,
    },
    testCases: [
      { input: 'convert("PAYPALISHIRING", 3)', expectedOutput: '"PAHNAPLSIIGYIR"', isHidden: false },
      { input: 'convert("PAYPALISHIRING", 4)', expectedOutput: '"PINALSIGYAHRPI"', isHidden: false },
      { input: 'convert("A", 1)', expectedOutput: '"A"', isHidden: true },
    ],
    functionName: "convert",
    tags: ["String"],
  },

  // ═══════════════════════════════════════════════
  //  NEW PROBLEMS — Matrix / 2D Array
  // ═══════════════════════════════════════════════
  {
    slug: "rotate-image",
    title: "Rotate Image",
    difficulty: "Medium",
    category: "Matrix",
    description: {
      text: "You are given an n x n 2D matrix representing an image, rotate the image by 90 degrees (clockwise).\n\nYou have to rotate the image in-place, which means you have to modify the input 2D matrix directly. DO NOT allocate another 2D matrix and do the rotation.",
    },
    examples: [
      { input: "matrix = [[1,2,3],[4,5,6],[7,8,9]]", output: "[[7,4,1],[8,5,2],[9,6,3]]", explanation: "" },
      { input: "matrix = [[5,1,9,11],[2,4,8,10],[13,3,6,7],[15,14,12,16]]", output: "[[15,13,2,5],[14,3,4,1],[12,6,8,9],[16,7,10,11]]", explanation: "" },
    ],
    constraints: ["n == matrix.length == matrix[i].length", "1 <= n <= 20", "-1000 <= matrix[i][j] <= 1000"],
    starterCode: {
      javascript: `/**\n * @param {number[][]} matrix\n * @return {number[][]}\n */\nfunction rotate(matrix) {\n  // Transpose + reverse rows in-place, return matrix\n}`,
      python: `def rotate(matrix):\n    # Transpose + reverse rows in-place, return matrix\n    pass`,
      java: `class Solution {\n    public int[][] rotate(int[][] matrix) {\n        // Transpose + reverse in-place, return matrix\n        return matrix;\n    }\n}`,
    },
    testCases: [
      { input: "rotate([[1,2,3],[4,5,6],[7,8,9]])", expectedOutput: "[[7,4,1],[8,5,2],[9,6,3]]", isHidden: false },
      { input: "rotate([[5,1,9,11],[2,4,8,10],[13,3,6,7],[15,14,12,16]])", expectedOutput: "[[15,13,2,5],[14,3,4,1],[12,6,8,9],[16,7,10,11]]", isHidden: false },
    ],
    functionName: "rotate",
    tags: ["Array", "Math", "Matrix"],
  },
  {
    slug: "spiral-matrix",
    title: "Spiral Matrix",
    difficulty: "Medium",
    category: "Matrix",
    description: {
      text: "Given an m x n matrix, return all elements of the matrix in spiral order.",
    },
    examples: [
      { input: "matrix = [[1,2,3],[4,5,6],[7,8,9]]", output: "[1,2,3,6,9,8,7,4,5]", explanation: "" },
      { input: "matrix = [[1,2,3,4],[5,6,7,8],[9,10,11,12]]", output: "[1,2,3,4,8,12,11,10,9,5,6,7]", explanation: "" },
    ],
    constraints: ["m == matrix.length", "n == matrix[i].length", "1 <= m, n <= 10", "-100 <= matrix[i][j] <= 100"],
    starterCode: {
      javascript: `/**\n * @param {number[][]} matrix\n * @return {number[]}\n */\nfunction spiralOrder(matrix) {\n  // Layer-by-layer simulation\n}`,
      python: `def spiralOrder(matrix):\n    # Layer-by-layer simulation\n    pass`,
      java: `class Solution {\n    public List<Integer> spiralOrder(int[][] matrix) {\n        return new ArrayList<>();\n    }\n}`,
    },
    testCases: [
      { input: "spiralOrder([[1,2,3],[4,5,6],[7,8,9]])", expectedOutput: "[1,2,3,6,9,8,7,4,5]", isHidden: false },
      { input: "spiralOrder([[1,2,3,4],[5,6,7,8],[9,10,11,12]])", expectedOutput: "[1,2,3,4,8,12,11,10,9,5,6,7]", isHidden: false },
    ],
    functionName: "spiralOrder",
    tags: ["Array", "Matrix", "Simulation"],
  },
  {
    slug: "set-matrix-zeroes",
    title: "Set Matrix Zeroes",
    difficulty: "Medium",
    category: "Matrix",
    description: {
      text: "Given an m x n integer matrix matrix, if an element is 0, set its entire row and column to 0's.\n\nYou must do it in place.",
    },
    examples: [
      { input: "matrix = [[1,1,1],[1,0,1],[1,1,1]]", output: "[[1,0,1],[0,0,0],[1,0,1]]", explanation: "" },
      { input: "matrix = [[0,1,2,0],[3,4,5,2],[1,3,1,5]]", output: "[[0,0,0,0],[0,4,5,0],[0,3,1,0]]", explanation: "" },
    ],
    constraints: ["m == matrix.length", "n == matrix[0].length", "1 <= m, n <= 200", "-2^31 <= matrix[i][j] <= 2^31 - 1"],
    starterCode: {
      javascript: `/**\n * @param {number[][]} matrix\n * @return {number[][]}\n */\nfunction setZeroes(matrix) {\n  // Use first row and column as markers, return matrix\n}`,
      python: `def setZeroes(matrix):\n    # Use first row and column as markers, return matrix\n    pass`,
      java: `class Solution {\n    public int[][] setZeroes(int[][] matrix) {\n        // Use first row/column as markers, return matrix\n        return matrix;\n    }\n}`,
    },
    testCases: [
      { input: "setZeroes([[1,1,1],[1,0,1],[1,1,1]])", expectedOutput: "[[1,0,1],[0,0,0],[1,0,1]]", isHidden: false },
      { input: "setZeroes([[0,1,2,0],[3,4,5,2],[1,3,1,5]])", expectedOutput: "[[0,0,0,0],[0,4,5,0],[0,3,1,0]]", isHidden: false },
    ],
    functionName: "setZeroes",
    tags: ["Array", "Hash Table", "Matrix"],
  },

  // ═══════════════════════════════════════════════
  //  NEW PROBLEMS — Recursion & Backtracking
  // ═══════════════════════════════════════════════
  {
    slug: "generate-parentheses",
    title: "Generate Parentheses",
    difficulty: "Medium",
    category: "Backtracking",
    description: {
      text: "Given n pairs of parentheses, write a function to generate all combinations of well-formed parentheses.",
    },
    examples: [
      { input: "n = 3", output: '["((()))","(()())","(())()","()(())","()()()"]', explanation: "" },
      { input: "n = 1", output: '["()"]', explanation: "" },
    ],
    constraints: ["1 <= n <= 8"],
    starterCode: {
      javascript: `/**\n * @param {number} n\n * @return {string[]}\n */\nfunction generateParenthesis(n) {\n  // Backtracking\n}`,
      python: `def generateParenthesis(n):\n    # Backtracking\n    pass`,
      java: `class Solution {\n    public List<String> generateParenthesis(int n) {\n        return new ArrayList<>();\n    }\n}`,
    },
    testCases: [
      { input: "generateParenthesis(1)", expectedOutput: '["()"]', isHidden: false },
      { input: "generateParenthesis(3)", expectedOutput: '["((()))","(()())","(())()","()(())","()()()"]', isHidden: false },
    ],
    functionName: "generateParenthesis",
    tags: ["String", "Dynamic Programming", "Backtracking"],
  },
  {
    slug: "permutations",
    title: "Permutations",
    difficulty: "Medium",
    category: "Backtracking",
    description: {
      text: "Given an array nums of distinct integers, return all the possible permutations. You can return the answer in any order.",
    },
    examples: [
      { input: "nums = [1,2,3]", output: "[[1,2,3],[1,3,2],[2,1,3],[2,3,1],[3,1,2],[3,2,1]]", explanation: "" },
      { input: "nums = [0,1]", output: "[[0,1],[1,0]]", explanation: "" },
    ],
    constraints: ["1 <= nums.length <= 6", "-10 <= nums[i] <= 10", "All the integers of nums are unique."],
    starterCode: {
      javascript: `/**\n * @param {number[]} nums\n * @return {number[][]}\n */\nfunction permute(nums) {\n  // Backtracking\n}`,
      python: `def permute(nums):\n    # Backtracking\n    pass`,
      java: `class Solution {\n    public List<List<Integer>> permute(int[] nums) {\n        return new ArrayList<>();\n    }\n}`,
    },
    testCases: [
      { input: "permute([0,1])", expectedOutput: "[[0,1],[1,0]]", isHidden: false },
      { input: "permute([1])", expectedOutput: "[[1]]", isHidden: false },
    ],
    functionName: "permute",
    tags: ["Array", "Backtracking"],
  },
  {
    slug: "subsets",
    title: "Subsets",
    difficulty: "Medium",
    category: "Backtracking",
    description: {
      text: "Given an integer array nums of unique elements, return all possible subsets (the power set).\n\nThe solution set must not contain duplicate subsets. Return the solution in any order.",
    },
    examples: [
      { input: "nums = [1,2,3]", output: "[[],[1],[2],[1,2],[3],[1,3],[2,3],[1,2,3]]", explanation: "" },
      { input: "nums = [0]", output: "[[],[0]]", explanation: "" },
    ],
    constraints: ["1 <= nums.length <= 10", "-10 <= nums[i] <= 10", "All the numbers of nums are unique."],
    starterCode: {
      javascript: `/**\n * @param {number[]} nums\n * @return {number[][]}\n */\nfunction subsets(nums) {\n  // Backtracking or iterative\n}`,
      python: `def subsets(nums):\n    # Backtracking or iterative\n    pass`,
      java: `class Solution {\n    public List<List<Integer>> subsets(int[] nums) {\n        return new ArrayList<>();\n    }\n}`,
    },
    testCases: [
      { input: "subsets([0])", expectedOutput: "[[],[0]]", isHidden: false },
      { input: "subsets([1,2])", expectedOutput: "[[],[1],[2],[1,2]]", isHidden: false },
    ],
    functionName: "subsets",
    tags: ["Array", "Backtracking", "Bit Manipulation"],
  },
  {
    slug: "letter-combinations-of-a-phone-number",
    title: "Letter Combinations of a Phone Number",
    difficulty: "Medium",
    category: "Backtracking",
    description: {
      text: "Given a string containing digits from 2-9 inclusive, return all possible letter combinations that the number could represent. Return the answer in any order.\n\nA mapping of digits to letters (just like on the telephone buttons):\n2→abc, 3→def, 4→ghi, 5→jkl, 6→mno, 7→pqrs, 8→tuv, 9→wxyz",
    },
    examples: [
      { input: 'digits = "23"', output: '["ad","ae","af","bd","be","bf","cd","ce","cf"]', explanation: "" },
      { input: 'digits = ""', output: "[]", explanation: "" },
      { input: 'digits = "2"', output: '["a","b","c"]', explanation: "" },
    ],
    constraints: ["0 <= digits.length <= 4", "digits[i] is a digit in the range ['2', '9']."],
    starterCode: {
      javascript: `/**\n * @param {string} digits\n * @return {string[]}\n */\nfunction letterCombinations(digits) {\n  // Backtracking with phone map\n}`,
      python: `def letterCombinations(digits):\n    # Backtracking with phone map\n    pass`,
      java: `class Solution {\n    public List<String> letterCombinations(String digits) {\n        return new ArrayList<>();\n    }\n}`,
    },
    testCases: [
      { input: 'letterCombinations("23")', expectedOutput: '["ad","ae","af","bd","be","bf","cd","ce","cf"]', isHidden: false },
      { input: 'letterCombinations("")', expectedOutput: "[]", isHidden: false },
      { input: 'letterCombinations("2")', expectedOutput: '["a","b","c"]', isHidden: true },
    ],
    functionName: "letterCombinations",
    tags: ["Hash Table", "String", "Backtracking"],
  },

  // ═══════════════════════════════════════════════
  //  NEW PROBLEMS — Dynamic Programming
  // ═══════════════════════════════════════════════
  {
    slug: "unique-paths",
    title: "Unique Paths",
    difficulty: "Medium",
    category: "Dynamic Programming",
    description: {
      text: "There is a robot on an m x n grid. The robot is initially located at the top-left corner (i.e., grid[0][0]). The robot tries to move to the bottom-right corner (i.e., grid[m - 1][n - 1]). The robot can only move either down or right at any point in time.\n\nGiven the two integers m and n, return the number of possible unique paths that the robot can take to reach the bottom-right corner.",
    },
    examples: [
      { input: "m = 3, n = 7", output: "28", explanation: "" },
      { input: "m = 3, n = 2", output: "3", explanation: "Right → Down → Down, Down → Down → Right, Down → Right → Down." },
    ],
    constraints: ["1 <= m, n <= 100"],
    starterCode: {
      javascript: `/**\n * @param {number} m\n * @param {number} n\n * @return {number}\n */\nfunction uniquePaths(m, n) {\n  // DP or combinatorics\n}`,
      python: `def uniquePaths(m, n):\n    # DP or combinatorics\n    pass`,
      java: `class Solution {\n    public int uniquePaths(int m, int n) {\n        return 0;\n    }\n}`,
    },
    testCases: [
      { input: "uniquePaths(3, 7)", expectedOutput: "28", isHidden: false },
      { input: "uniquePaths(3, 2)", expectedOutput: "3", isHidden: false },
      { input: "uniquePaths(1, 1)", expectedOutput: "1", isHidden: true },
    ],
    functionName: "uniquePaths",
    tags: ["Math", "Dynamic Programming", "Combinatorics"],
  },
  {
    slug: "decode-ways",
    title: "Decode Ways",
    difficulty: "Medium",
    category: "Dynamic Programming",
    description: {
      text: "A message containing letters from A-Z can be encoded into numbers using the following mapping:\n\n'A' → \"1\", 'B' → \"2\", ..., 'Z' → \"26\"\n\nGiven a string s containing only digits, return the number of ways to decode it.\n\nThe test cases are generated so that the answer fits in a 32-bit integer.",
    },
    examples: [
      { input: 's = "12"', output: "2", explanation: '"12" could be decoded as "AB" (1 2) or "L" (12).' },
      { input: 's = "226"', output: "3", explanation: '"226" could be decoded as "BZ" (2 26), "VF" (22 6), or "BBF" (2 2 6).' },
      { input: 's = "06"', output: "0", explanation: '"06" cannot be mapped to "F" because of the leading zero.' },
    ],
    constraints: ["1 <= s.length <= 100", "s contains only digits and may contain leading zero(s)."],
    starterCode: {
      javascript: `/**\n * @param {string} s\n * @return {number}\n */\nfunction numDecodings(s) {\n  // DP approach\n}`,
      python: `def numDecodings(s):\n    # DP approach\n    pass`,
      java: `class Solution {\n    public int numDecodings(String s) {\n        return 0;\n    }\n}`,
    },
    testCases: [
      { input: 'numDecodings("12")', expectedOutput: "2", isHidden: false },
      { input: 'numDecodings("226")', expectedOutput: "3", isHidden: false },
      { input: 'numDecodings("06")', expectedOutput: "0", isHidden: true },
    ],
    functionName: "numDecodings",
    tags: ["String", "Dynamic Programming"],
  },
  {
    slug: "word-break",
    title: "Word Break",
    difficulty: "Medium",
    category: "Dynamic Programming",
    description: {
      text: "Given a string s and a dictionary of strings wordDict, return true if s can be segmented into a space-separated sequence of one or more dictionary words.\n\nNote that the same word in the dictionary may be reused multiple times in the segmentation.",
    },
    examples: [
      { input: 's = "leetcode", wordDict = ["leet","code"]', output: "true", explanation: 'Return true because "leetcode" can be segmented as "leet code".' },
      { input: 's = "applepenapple", wordDict = ["apple","pen"]', output: "true", explanation: 'Return true because "applepenapple" can be segmented as "apple pen apple".' },
      { input: 's = "catsandog", wordDict = ["cats","dog","sand","and","cat"]', output: "false", explanation: "" },
    ],
    constraints: ["1 <= s.length <= 300", "1 <= wordDict.length <= 1000", "1 <= wordDict[i].length <= 20"],
    starterCode: {
      javascript: `/**\n * @param {string} s\n * @param {string[]} wordDict\n * @return {boolean}\n */\nfunction wordBreak(s, wordDict) {\n  // DP with hash set\n}`,
      python: `def wordBreak(s, wordDict):\n    # DP with hash set\n    pass`,
      java: `class Solution {\n    public boolean wordBreak(String s, List<String> wordDict) {\n        return false;\n    }\n}`,
    },
    testCases: [
      { input: 'wordBreak("leetcode", ["leet","code"])', expectedOutput: "true", isHidden: false },
      { input: 'wordBreak("applepenapple", ["apple","pen"])', expectedOutput: "true", isHidden: false },
      { input: 'wordBreak("catsandog", ["cats","dog","sand","and","cat"])', expectedOutput: "false", isHidden: true },
    ],
    functionName: "wordBreak",
    tags: ["Array", "Hash Table", "String", "Dynamic Programming"],
  },
  {
    slug: "longest-increasing-subsequence",
    title: "Longest Increasing Subsequence",
    difficulty: "Medium",
    category: "Dynamic Programming",
    description: {
      text: "Given an integer array nums, return the length of the longest strictly increasing subsequence.",
    },
    examples: [
      { input: "nums = [10,9,2,5,3,7,101,18]", output: "4", explanation: "The longest increasing subsequence is [2,3,7,101], therefore the length is 4." },
      { input: "nums = [0,1,0,3,2,3]", output: "4", explanation: "" },
      { input: "nums = [7,7,7,7,7,7,7]", output: "1", explanation: "" },
    ],
    constraints: ["1 <= nums.length <= 2500", "-10^4 <= nums[i] <= 10^4"],
    starterCode: {
      javascript: `/**\n * @param {number[]} nums\n * @return {number}\n */\nfunction lengthOfLIS(nums) {\n  // DP or patience sorting\n}`,
      python: `def lengthOfLIS(nums):\n    # DP or patience sorting\n    pass`,
      java: `class Solution {\n    public int lengthOfLIS(int[] nums) {\n        return 0;\n    }\n}`,
    },
    testCases: [
      { input: "lengthOfLIS([10,9,2,5,3,7,101,18])", expectedOutput: "4", isHidden: false },
      { input: "lengthOfLIS([0,1,0,3,2,3])", expectedOutput: "4", isHidden: false },
      { input: "lengthOfLIS([7,7,7,7,7,7,7])", expectedOutput: "1", isHidden: true },
    ],
    functionName: "lengthOfLIS",
    tags: ["Array", "Binary Search", "Dynamic Programming"],
  },

  // ═══════════════════════════════════════════════
  //  BONUS — Additional Popular Problems
  // ═══════════════════════════════════════════════
  {
    slug: "missing-number",
    title: "Missing Number",
    difficulty: "Easy",
    category: "Math",
    description: {
      text: "Given an array nums containing n distinct numbers in the range [0, n], return the only number in the range that is missing from the array.",
    },
    examples: [
      { input: "nums = [3,0,1]", output: "2", explanation: "n = 3 since there are 3 numbers, so all numbers are in the range [0,3]. 2 is the missing number." },
      { input: "nums = [0,1]", output: "2", explanation: "n = 2 since there are 2 numbers, so all numbers are in the range [0,2]. 2 is the missing number." },
      { input: "nums = [9,6,4,2,3,5,7,0,1]", output: "8", explanation: "" },
    ],
    constraints: ["n == nums.length", "1 <= n <= 10^4", "0 <= nums[i] <= n", "All the numbers of nums are unique."],
    starterCode: {
      javascript: `/**\n * @param {number[]} nums\n * @return {number}\n */\nfunction missingNumber(nums) {\n  // XOR or Gauss formula\n}`,
      python: `def missingNumber(nums):\n    # XOR or Gauss formula\n    pass`,
      java: `class Solution {\n    public int missingNumber(int[] nums) {\n        return 0;\n    }\n}`,
    },
    testCases: [
      { input: "missingNumber([3,0,1])", expectedOutput: "2", isHidden: false },
      { input: "missingNumber([0,1])", expectedOutput: "2", isHidden: false },
      { input: "missingNumber([9,6,4,2,3,5,7,0,1])", expectedOutput: "8", isHidden: true },
    ],
    functionName: "missingNumber",
    tags: ["Array", "Hash Table", "Math", "Bit Manipulation", "Sorting"],
  },
  {
    slug: "intersection-of-two-arrays-ii",
    title: "Intersection of Two Arrays II",
    difficulty: "Easy",
    category: "Hash Table",
    description: {
      text: "Given two integer arrays nums1 and nums2, return an array of their intersection. Each element in the result must appear as many times as it shows in both arrays and you may return the result in any order.",
    },
    examples: [
      { input: "nums1 = [1,2,2,1], nums2 = [2,2]", output: "[2,2]", explanation: "" },
      { input: "nums1 = [4,9,5], nums2 = [9,4,9,8,4]", output: "[4,9]", explanation: "" },
    ],
    constraints: ["1 <= nums1.length, nums2.length <= 1000", "0 <= nums1[i], nums2[i] <= 1000"],
    starterCode: {
      javascript: `/**\n * @param {number[]} nums1\n * @param {number[]} nums2\n * @return {number[]}\n */\nfunction intersect(nums1, nums2) {\n  // Hash map approach\n}`,
      python: `def intersect(nums1, nums2):\n    # Hash map approach\n    pass`,
      java: `class Solution {\n    public int[] intersect(int[] nums1, int[] nums2) {\n        return new int[]{};\n    }\n}`,
    },
    testCases: [
      { input: "intersect([1,2,2,1], [2,2])", expectedOutput: "[2,2]", isHidden: false },
      { input: "intersect([4,9,5], [9,4,9,8,4])", expectedOutput: "[4,9]", isHidden: false },
    ],
    functionName: "intersect",
    tags: ["Array", "Hash Table", "Two Pointers", "Sorting"],
  },
  {
    slug: "container-with-most-water",
    title: "Container With Most Water",
    difficulty: "Medium",
    category: "Two Pointers",
    description: {
      text: "You are given an integer array height of length n. There are n vertical lines drawn such that the two endpoints of the ith line are (i, 0) and (i, height[i]).\n\nFind two lines that together with the x-axis form a container, such that the container contains the most water.\n\nReturn the maximum amount of water a container can store.",
    },
    examples: [
      { input: "height = [1,8,6,2,5,4,8,3,7]", output: "49", explanation: "The max area is between lines at index 1 and 8." },
      { input: "height = [1,1]", output: "1", explanation: "" },
    ],
    constraints: ["n == height.length", "2 <= n <= 10^5", "0 <= height[i] <= 10^4"],
    starterCode: {
      javascript: `/**\n * @param {number[]} height\n * @return {number}\n */\nfunction maxArea(height) {\n  // Two pointers\n}`,
      python: `def maxArea(height):\n    # Two pointers\n    pass`,
      java: `class Solution {\n    public int maxArea(int[] height) {\n        return 0;\n    }\n}`,
    },
    testCases: [
      { input: "maxArea([1,8,6,2,5,4,8,3,7])", expectedOutput: "49", isHidden: false },
      { input: "maxArea([1,1])", expectedOutput: "1", isHidden: false },
    ],
    functionName: "maxArea",
    tags: ["Array", "Two Pointers", "Greedy"],
  },
  {
    slug: "valid-sudoku",
    title: "Valid Sudoku",
    difficulty: "Medium",
    category: "Hash Table",
    description: {
      text: 'Determine if a 9 x 9 Sudoku board is valid. Only the filled cells need to be validated according to the following rules:\n\n1. Each row must contain the digits 1-9 without repetition.\n2. Each column must contain the digits 1-9 without repetition.\n3. Each of the nine 3 x 3 sub-boxes of the grid must contain the digits 1-9 without repetition.\n\nNote: A Sudoku board could be valid but is not necessarily solvable. Only the filled cells need to be validated.',
    },
    examples: [
      {
        input: 'board = [["5","3",".",".","7",".",".",".","."],["6",".",".","1","9","5",".",".","."],[".","9","8",".",".",".",".","6","."],["8",".",".",".","6",".",".",".","3"],["4",".",".","8",".","3",".",".","1"],["7",".",".",".","2",".",".",".","6"],[".","6",".",".",".",".","2","8","."],[".",".",".","4","1","9",".",".","5"],[".",".",".",".","8",".",".","7","9"]]',
        output: "true",
        explanation: "",
      },
    ],
    constraints: ["board.length == 9", "board[i].length == 9", "board[i][j] is a digit 1-9 or '.'."],
    starterCode: {
      javascript: `/**\n * @param {character[][]} board\n * @return {boolean}\n */\nfunction isValidSudoku(board) {\n  // Hash sets for rows, columns, boxes\n}`,
      python: `def isValidSudoku(board):\n    # Hash sets for rows, columns, boxes\n    pass`,
      java: `class Solution {\n    public boolean isValidSudoku(char[][] board) {\n        return false;\n    }\n}`,
    },
    testCases: [
      {
        input: 'isValidSudoku([["5","3",".",".","7",".",".",".","."],["6",".",".","1","9","5",".",".","."],[".","9","8",".",".",".",".","6","."],["8",".",".",".","6",".",".",".","3"],["4",".",".","8",".","3",".",".","1"],["7",".",".",".","2",".",".",".","6"],[".","6",".",".",".",".","2","8","."],[".",".",".","4","1","9",".",".","5"],[".",".",".",".","8",".",".","7","9"]])',
        expectedOutput: "true",
        isHidden: false,
      },
      {
        input: 'isValidSudoku([["8","3",".",".","7",".",".",".","."],["6",".",".","1","9","5",".",".","."],[".","9","8",".",".",".",".","6","."],["8",".",".",".","6",".",".",".","3"],["4",".",".","8",".","3",".",".","1"],["7",".",".",".","2",".",".",".","6"],[".","6",".",".",".",".","2","8","."],[".",".",".","4","1","9",".",".","5"],[".",".",".",".","8",".",".","7","9"]])',
        expectedOutput: "false",
        isHidden: false,
      },
    ],
    functionName: "isValidSudoku",
    tags: ["Array", "Hash Table", "Matrix"],
  },
  {
    slug: "implement-strstr",
    title: "Find the Index of the First Occurrence in a String",
    difficulty: "Easy",
    category: "String",
    description: {
      text: "Given two strings haystack and needle, return the index of the first occurrence of needle in haystack, or -1 if needle is not part of haystack.",
    },
    examples: [
      { input: 'haystack = "sadbutsad", needle = "sad"', output: "0", explanation: '"sad" occurs at index 0 and 6. The first occurrence is at index 0.' },
      { input: 'haystack = "leetcode", needle = "leeto"', output: "-1", explanation: '"leeto" did not occur in "leetcode".' },
    ],
    constraints: ["1 <= haystack.length, needle.length <= 10^4", "haystack and needle consist of only lowercase English characters."],
    starterCode: {
      javascript: `/**\n * @param {string} haystack\n * @param {string} needle\n * @return {number}\n */\nfunction strStr(haystack, needle) {\n  // String matching\n}`,
      python: `def strStr(haystack, needle):\n    # String matching\n    pass`,
      java: `class Solution {\n    public int strStr(String haystack, String needle) {\n        return -1;\n    }\n}`,
    },
    testCases: [
      { input: 'strStr("sadbutsad", "sad")', expectedOutput: "0", isHidden: false },
      { input: 'strStr("leetcode", "leeto")', expectedOutput: "-1", isHidden: false },
      { input: 'strStr("hello", "ll")', expectedOutput: "2", isHidden: true },
    ],
    functionName: "strStr",
    tags: ["Two Pointers", "String", "String Matching"],
  },
  {
    slug: "reverse-integer",
    title: "Reverse Integer",
    difficulty: "Medium",
    category: "Math",
    description: {
      text: "Given a signed 32-bit integer x, return x with its digits reversed. If reversing x causes the value to go outside the signed 32-bit integer range [-2^31, 2^31 - 1], then return 0.\n\nAssume the environment does not allow you to store 64-bit integers (signed or unsigned).",
    },
    examples: [
      { input: "x = 123", output: "321", explanation: "" },
      { input: "x = -123", output: "-321", explanation: "" },
      { input: "x = 120", output: "21", explanation: "" },
    ],
    constraints: ["-2^31 <= x <= 2^31 - 1"],
    starterCode: {
      javascript: `/**\n * @param {number} x\n * @return {number}\n */\nfunction reverse(x) {\n  // Reverse digits with overflow check\n}`,
      python: `def reverse(x):\n    # Reverse digits with overflow check\n    pass`,
      java: `class Solution {\n    public int reverse(int x) {\n        return 0;\n    }\n}`,
    },
    testCases: [
      { input: "reverse(123)", expectedOutput: "321", isHidden: false },
      { input: "reverse(-123)", expectedOutput: "-321", isHidden: false },
      { input: "reverse(120)", expectedOutput: "21", isHidden: true },
      { input: "reverse(0)", expectedOutput: "0", isHidden: true },
    ],
    functionName: "reverse",
    tags: ["Math"],
  },
];

async function seed() {
  try {
    await mongoose.connect(DB_URL);
    console.log("✅ Connected to MongoDB");

    let inserted = 0;
    let skipped = 0;

    for (const p of problems) {
      const exists = await Problem.findOne({ slug: p.slug });
      if (exists) {
        console.log(`⏭️  Skipping (already exists): ${p.slug}`);
        skipped++;
        continue;
      }
      await Problem.create(p);
      console.log(`✅ Seeded: ${p.title}`);
      inserted++;
    }

    console.log(`\n🎉 Done! Inserted: ${inserted}, Skipped: ${skipped}`);
  } catch (err) {
    console.error("❌ Seed failed:", err);
  } finally {
    await mongoose.disconnect();
    process.exit(0);
  }
}

seed();
