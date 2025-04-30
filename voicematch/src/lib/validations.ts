// Validation rules type
interface ValidationRule {
  min?: number;
  max?: number;
}

interface ValidationRules {
  name: ValidationRule;
  description: ValidationRule;
  title: ValidationRule;
  budget: ValidationRule;
  categories: ValidationRule;
}

export const VALIDATION_RULES: ValidationRules = {
  name: {
    min: 2,
    max: 100,
  },
  description: {
    min: 10,
    max: 1000,
  },
  title: {
    min: 5,
    max: 200,
  },
  budget: {
    min: 1,
  },
  categories: {
    min: 1,
    max: 5,
  },
};

// Validation helper functions
export function validateField(
  field: string,
  value: unknown,
  rules: ValidationRule
): string | null {
  if (value === undefined || value === null) {
    return `${field} is required`;
  }

  if (typeof value === "string") {
    if (rules.min && value.length < rules.min) {
      return `${field} must be at least ${rules.min} characters long`;
    }
    if (rules.max && value.length > rules.max) {
      return `${field} must be no more than ${rules.max} characters long`;
    }
  }

  if (typeof value === "number") {
    if (rules.min && value < rules.min) {
      return `${field} must be at least ${rules.min}`;
    }
    if (rules.max && value > rules.max) {
      return `${field} must be no more than ${rules.max}`;
    }
  }

  if (Array.isArray(value)) {
    if (rules.min && value.length < rules.min) {
      return `${field} must have at least ${rules.min} item(s)`;
    }
    if (rules.max && value.length > rules.max) {
      return `${field} must have no more than ${rules.max} item(s)`;
    }
  }

  return null;
}
