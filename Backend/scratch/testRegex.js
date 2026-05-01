const sanitizedCode = `import java.util.*;
import java.io.*;

class Solution {
    public int[] twoSum(int[] nums, int target) {
        return new int[]{};
    }
}`;

const importRegex = /^\s*import\s+[\w.*]+\s*;\s*/gm;
const imports = [];
let match;
while ((match = importRegex.exec(sanitizedCode)) !== null) {
  imports.push(match[0].trim());
}
const codeWithoutImports = sanitizedCode.replace(importRegex, "");

console.log("Imports:", imports);
console.log("Code:", codeWithoutImports);
