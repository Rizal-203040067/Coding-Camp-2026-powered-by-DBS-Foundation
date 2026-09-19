import { describe, it, expect } from "bun:test";
import sum from "./index.js";

describe("Calculator", () => {
  it("should add correctly", () => {
    // Arrange
    const operandA = 1;
    const operandB = 2;

    // Action
    const actualValueFirst = sum(operandA, operandB);

    // Assert
    const expectedValueFirst = 3;
    expect(actualValueFirst).toBe(expectedValueFirst);
  });

  it("should throw value 0 if string passed on numA parameter", () => {
    // Arrange
    const operandA = "1";
    const operandB = 2;

    // Action
    const actualValueSecond = sum(operandA, operandB);

    // Assert
    const expectedValueSecond = 0;
    expect(actualValueSecond).toBe(expectedValueSecond);
  });

  it("should throw value 0 if string passed on numB parameter", () => {
    // Arrange
    const operandA = 1;
    const operandB = "2";

    // Action
    const actualValueThird = sum(operandA, operandB);

    // Assert
    const expectedValueThird = 0;
    expect(actualValueThird).toBe(expectedValueThird);
  });

  it("should throw value 0 if value less than 0 on numA parameter", () => {
    // Arrange
    const operandA = -1;
    const operandB = 2;

    // Action
    const actualValueFourth = sum(operandA, operandB);

    // Assert
    const expectedValueFourth = 0;
    expect(actualValueFourth).toBe(expectedValueFourth);
  });

  it("should throw value 0 if value less than 0 on numB parameter", () => {
    // Arrange
    const operandA = 1;
    const operandB = -2;

    // Action
    const actualValueFifth = sum(operandA, operandB);

    // Assert
    const expectedValueFifth = 0;
    expect(actualValueFifth).toBe(expectedValueFifth);
  });
});
