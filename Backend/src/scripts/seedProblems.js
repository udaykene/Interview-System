import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();

import Problem from "../models/Problem.js";

const DB_URL = process.env.DB_URL;

const problems = [
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
    constraints: ["1 <= s.length <= 10^4", "s consists of parentheses only '()[]{}'."],
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
    slug: "reverse-linked-list",
    title: "Reverse Linked List",
    difficulty: "Easy",
    category: "Linked List",
    description: {
      text: "Given the head of a singly linked list, reverse the list, and return the reversed list.",
    },
    examples: [
      { input: "head = [1,2,3,4,5]", output: "[5,4,3,2,1]", explanation: "" },
      { input: "head = [1,2]", output: "[2,1]", explanation: "" },
    ],
    constraints: ["The number of nodes in the list is in range [0, 5000]", "-5000 <= Node.val <= 5000"],
    starterCode: {
      javascript: `/**\n * @param {ListNode} head\n * @return {ListNode}\n */\nfunction reverseList(head) {\n  // Your solution here\n}`,
      python: `def reverseList(head):\n    # Your solution here\n    pass`,
      java: `class Solution {\n    public ListNode reverseList(ListNode head) {\n        // Your solution here\n        return null;\n    }\n}`,
    },
    testCases: [
      { input: "reverseList([1,2,3,4,5])", expectedOutput: "[5,4,3,2,1]", isHidden: false },
    ],
    functionName: "reverseList",
    tags: ["Linked List", "Recursion"],
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
    slug: "min-stack",
    title: "Min Stack",
    difficulty: "Medium",
    category: "Stack",
    description: {
      text: 'Design a stack that supports push, pop, top, and retrieving the minimum element in constant time.\n\nImplement the MinStack class:\n- MinStack() initializes the stack object.\n- void push(int val) pushes the element val onto the stack.\n- void pop() removes the element on the top of the stack.\n- int top() gets the top element of the stack.\n- int getMin() retrieves the minimum element in the stack.\n\nYou must implement a solution with O(1) time complexity for each function.',
    },
    examples: [
      { input: 'MinStack minStack = new MinStack(); minStack.push(-2); minStack.push(0); minStack.push(-3); minStack.getMin(); → -3; minStack.pop(); minStack.top(); → 0; minStack.getMin(); → -2', output: "[null,null,null,null,-3,null,0,-2]", explanation: "" },
    ],
    constraints: ["-2^31 <= val <= 2^31 - 1", "Methods pop, top and getMin operations will always be called on non-empty stacks.", "At most 3 * 10^4 calls will be made to push, pop, top, and getMin."],
    starterCode: {
      javascript: `class MinStack {\n  constructor() {\n    // Initialize your data structure\n  }\n  push(val) {\n    // Push val\n  }\n  pop() {\n    // Pop top\n  }\n  top() {\n    // Return top\n  }\n  getMin() {\n    // Return minimum in O(1)\n  }\n}`,
      python: `class MinStack:\n    def __init__(self):\n        pass\n    def push(self, val):\n        pass\n    def pop(self):\n        pass\n    def top(self):\n        pass\n    def getMin(self):\n        pass`,
      java: `class MinStack {\n    public MinStack() {}\n    public void push(int val) {}\n    public void pop() {}\n    public int top() { return 0; }\n    public int getMin() { return 0; }\n}`,
    },
    testCases: [],
    functionName: "MinStack",
    tags: ["Stack", "Design"],
  },
  {
    slug: "number-of-islands",
    title: "Number of Islands",
    difficulty: "Medium",
    category: "Graph",
    description: {
      text: 'Given an m x n 2D binary grid which represents a map of \'1\'s (land) and \'0\'s (water), return the number of islands.\n\nAn island is surrounded by water and is formed by connecting adjacent lands horizontally or vertically. You may assume all four edges of the grid are all surrounded by water.',
    },
    examples: [
      { input: 'grid = [["1","1","1","1","0"],["1","1","0","1","0"],["1","1","0","0","0"],["0","0","0","0","0"]]', output: "1", explanation: "" },
      { input: 'grid = [["1","1","0","0","0"],["1","1","0","0","0"],["0","0","1","0","0"],["0","0","0","1","1"]]', output: "3", explanation: "" },
    ],
    constraints: ["m == grid.length", "n == grid[i].length", "1 <= m, n <= 300", 'grid[i][j] is \'0\' or \'1\'.'],
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
    constraints: ["1 <= nums.length <= 3 * 10^4", "-3 * 10^4 <= nums[i] <= 3 * 10^4", "Each element in the array appears twice except for one element which appears only once."],
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
    slug: "first-bad-version",
    title: "First Bad Version",
    difficulty: "Easy",
    category: "Binary Search",
    description: {
      text: "You are a product manager and currently leading a team to develop a new product. Unfortunately, the latest version of your product fails the quality check. Since each version is developed based on the previous version, all the versions after a bad version are also bad.\n\nSuppose you have n versions [1, 2, ..., n] and you want to find out the first bad one, which causes all the following ones to be bad.\n\nYou are given an API bool isBadVersion(version) which returns whether version is bad. Implement a function to find the first bad version. You should minimize the number of calls to the API.",
    },
    examples: [
      { input: "n = 5, bad = 4", output: "4", explanation: "call isBadVersion(3) -> false, call isBadVersion(5) -> true, call isBadVersion(4) -> true. So, 4 is the first bad version." },
    ],
    constraints: ["1 <= bad <= n <= 2^31 - 1"],
    starterCode: {
      javascript: `/**\n * @param {function} isBadVersion()\n * @return {function}\n */\nvar solution = function(isBadVersion) {\n  /**\n   * @param {integer} n Total versions\n   * @return {integer} The first bad version\n   */\n  return function(n) {\n    // Binary search\n  };\n};`,
      python: `class Solution:\n    def firstBadVersion(self, n):\n        # Binary search\n        pass`,
      java: `public class Solution extends VersionControl {\n    public int firstBadVersion(int n) {\n        return 1;\n    }\n}`,
    },
    testCases: [],
    functionName: "firstBadVersion",
    tags: ["Binary Search", "Interactive"],
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
