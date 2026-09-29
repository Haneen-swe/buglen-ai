import type { AnalysisResult } from "./types";

export interface Sample {
  language: string;
  code: string;
  result: AnalysisResult;
}

export const SAMPLES: Record<string, Sample> = {
  python: {
    language: "python",
    code: `def calculate_average(numbers)
    total = sum(numbers)
    return total / len(numbers)
`,
    result: {
      summary: "1 high-severity syntax error and 1 potential runtime issue found.",
      language: "python",
      issues: [
        {
          title: "Missing colon in function declaration",
          severity: "HIGH",
          line: 1,
          description: "The function declaration is missing a colon at the end.",
          cause: "Python requires a colon after a function declaration.",
          suggestion: "Add a colon at the end of the def line.",
          fixedCode: `def calculate_average(numbers):
    total = sum(numbers)
    return total / len(numbers)`,
        },
        {
          title: "Possible division by zero",
          severity: "MEDIUM",
          line: 3,
          description: "If an empty list is passed, len(numbers) is 0 and the division raises ZeroDivisionError.",
          cause: "The function never checks whether the list is empty.",
          suggestion: "Return early (or raise a clear error) when the list is empty.",
          fixedCode: `def calculate_average(numbers):
    if not numbers:
        return 0
    total = sum(numbers)
    return total / len(numbers)`,
        },
      ],
      improvements: [
        "Add a docstring describing the parameters and the return value.",
        "Add type hints, for example numbers: list[float] -> float.",
      ],
    },
  },
  javascript: {
    language: "javascript",
    code: `function calculateTotal(price, tax) {
    return price + taxe;
}
`,
    result: {
      summary: "1 high-severity reference error found.",
      language: "javascript",
      issues: [
        {
          title: "Undefined variable 'taxe'",
          severity: "HIGH",
          line: 2,
          description: "The identifier 'taxe' is not defined anywhere, so this line throws a ReferenceError when the function runs.",
          cause: "The parameter is named 'tax' but the return statement uses 'taxe', which looks like a typo.",
          suggestion: "Use the parameter name 'tax' in the return statement.",
          fixedCode: `function calculateTotal(price, tax) {
    return price + tax;
}`,
        },
      ],
      improvements: [
        "Validate that price and tax are numbers before adding them.",
        "Consider a more descriptive name such as calculateTotalWithTax.",
      ],
    },
  },
  typescript: {
    language: "typescript",
    code: `function greet(name: string): number {
    return "Hello, " + name;
}
`,
    result: {
      summary: "1 high-severity type error found.",
      language: "typescript",
      issues: [
        {
          title: "Return type does not match returned value",
          severity: "HIGH",
          line: 1,
          description: "The function is declared to return a number but returns a string.",
          cause: "The return type annotation is number, while string concatenation always produces a string.",
          suggestion: "Change the return type annotation to string.",
          fixedCode: `function greet(name: string): string {
    return "Hello, " + name;
}`,
        },
      ],
      improvements: ["Consider a template literal: `Hello, ${name}`."],
    },
  },
  java: {
    language: "java",
    code: `public class Main {
    public static void main(String[] args) {
        int number = "10";
        System.out.println(number);
    }
}
`,
    result: {
      summary: "1 high-severity type mismatch found.",
      language: "java",
      issues: [
        {
          title: "Incompatible types: String cannot be converted to int",
          severity: "HIGH",
          line: 3,
          description: "A String literal is assigned to a variable declared as int, which does not compile.",
          cause: "Java is statically typed, so a text value cannot be stored in an int variable without conversion.",
          suggestion: "Assign an int literal, or parse the string with Integer.parseInt(\"10\").",
          fixedCode: `public class Main {
    public static void main(String[] args) {
        int number = 10;
        System.out.println(number);
    }
}`,
        },
      ],
      improvements: [
        "If the value comes from user input, wrap Integer.parseInt in a try/catch for NumberFormatException.",
      ],
    },
  },
  cpp: {
    language: "cpp",
    code: `#include <iostream>

int main() {
    int values[3] = {1, 2, 3};
    for (int i = 0; i <= 3; i++) {
        std::cout << values[i] << std::endl;
    }
    return 0;
}
`,
    result: {
      summary: "1 critical out-of-bounds access found.",
      language: "cpp",
      issues: [
        {
          title: "Out-of-bounds array access",
          severity: "CRITICAL",
          line: 5,
          description: "The loop runs while i <= 3, so the last iteration reads values[3], which is past the end of the array.",
          cause: "Array indexes run from 0 to size - 1; using <= with the array size goes one step too far.",
          suggestion: "Use i < 3 (or a range-based for loop) to stay inside the array.",
          fixedCode: `#include <iostream>

int main() {
    int values[3] = {1, 2, 3};
    for (int i = 0; i < 3; i++) {
        std::cout << values[i] << std::endl;
    }
    return 0;
}`,
        },
      ],
      improvements: ["Prefer std::array or std::vector with a range-based for loop."],
    },
  },
  csharp: {
    language: "csharp",
    code: `using System;

class Program
{
    static void Main()
    {
        string name = null;
        Console.WriteLine(name.Length);
    }
}
`,
    result: {
      summary: "1 high-severity null reference found.",
      language: "csharp",
      issues: [
        {
          title: "Null reference on 'name.Length'",
          severity: "HIGH",
          line: 8,
          description: "The variable 'name' is null, so accessing .Length throws a NullReferenceException.",
          cause: "The string is assigned null and then dereferenced without a check.",
          suggestion: "Initialise the string, or guard with a null check or the null-conditional operator.",
          fixedCode: `using System;

class Program
{
    static void Main()
    {
        string? name = null;
        Console.WriteLine(name?.Length ?? 0);
    }
}`,
        },
      ],
      improvements: ["Enable nullable reference types so the compiler warns about this pattern."],
    },
  },
};

export function getSample(language: string): Sample {
  return SAMPLES[language] ?? SAMPLES.python;
}

/** Look up a predefined demo analysis for code that matches a sample exactly. */
export function findDemoResult(code: string, language: string): AnalysisResult | null {
  const sample = SAMPLES[language];
  if (sample && sample.code.trim() === code.trim()) return sample.result;
  return null;
}
