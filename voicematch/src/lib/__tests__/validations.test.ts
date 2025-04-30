/// <reference types="jest" />
import { validateField, VALIDATION_RULES } from "../validations";

describe("validateField", () => {
  describe("string validation", () => {
    it("should validate string length correctly", () => {
      const rules = { min: 2, max: 5 };

      expect(validateField("Test field", "", rules)).toBe(
        "Test field must be at least 2 characters long"
      );

      expect(validateField("Test field", "a", rules)).toBe(
        "Test field must be at least 2 characters long"
      );

      expect(validateField("Test field", "abc", rules)).toBeNull();

      expect(validateField("Test field", "abcdef", rules)).toBe(
        "Test field must be no more than 5 characters long"
      );
    });

    it("should handle undefined/null values", () => {
      expect(validateField("Test field", undefined, {})).toBe(
        "Test field is required"
      );

      expect(validateField("Test field", null, {})).toBe(
        "Test field is required"
      );
    });
  });

  describe("number validation", () => {
    it("should validate number ranges correctly", () => {
      const rules = { min: 1, max: 100 };

      expect(validateField("Test field", 0, rules)).toBe(
        "Test field must be at least 1"
      );

      expect(validateField("Test field", 50, rules)).toBeNull();

      expect(validateField("Test field", 101, rules)).toBe(
        "Test field must be no more than 100"
      );
    });
  });

  describe("array validation", () => {
    it("should validate array length correctly", () => {
      const rules = { min: 1, max: 3 };

      expect(validateField("Test field", [], rules)).toBe(
        "Test field must have at least 1 item(s)"
      );

      expect(validateField("Test field", [1, 2], rules)).toBeNull();

      expect(validateField("Test field", [1, 2, 3, 4], rules)).toBe(
        "Test field must have no more than 3 item(s)"
      );
    });
  });
});

describe("VALIDATION_RULES", () => {
  it("should have correct validation rules for name", () => {
    expect(VALIDATION_RULES.name).toEqual({
      min: 2,
      max: 100,
    });
  });

  it("should have correct validation rules for description", () => {
    expect(VALIDATION_RULES.description).toEqual({
      min: 10,
      max: 1000,
    });
  });

  it("should have correct validation rules for title", () => {
    expect(VALIDATION_RULES.title).toEqual({
      min: 5,
      max: 200,
    });
  });

  it("should have correct validation rules for budget", () => {
    expect(VALIDATION_RULES.budget).toEqual({
      min: 1,
    });
  });

  it("should have correct validation rules for categories", () => {
    expect(VALIDATION_RULES.categories).toEqual({
      min: 1,
      max: 5,
    });
  });
});
