import { sum } from "./index.js";
import { it, describe, expect } from "bun:test";

describe("Calculator", () => {
  it("should return the sum of two numbers", () => {
    // Arrange
    const operandA = 1;
    const operandB = 2;

    // Action
    const actualValue = sum(operandA, operandB);

    // Assert
    const expectedValue = 3;
    expect(actualValue).toBe(expectedValue);
  });
});
