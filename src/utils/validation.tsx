// src/utils/validation.ts
export interface ValidationRule {
  required?: boolean;
  minLength?: number;
  maxLength?: number;
  pattern?: RegExp;
  custom?: (value: string) => boolean;
  message: string;
}

export interface ValidationRules {
  [key: string]: ValidationRule[];
}

export interface ValidationErrors {
  [key: string]: string;
}

export class FormValidator {
  static validate(data: { [key: string]: string }, rules: ValidationRules): ValidationErrors {
    const errors: ValidationErrors = {};

    Object.keys(rules).forEach(field => {
      const value = data[field] || '';
      const fieldRules = rules[field];

      for (const rule of fieldRules) {
        if (rule.required && !value.trim()) {
          errors[field] = rule.message;
          break;
        }

        if (rule.minLength && value.length < rule.minLength) {
          errors[field] = rule.message;
          break;
        }

        if (rule.maxLength && value.length > rule.maxLength) {
          errors[field] = rule.message;
          break;
        }

        if (rule.pattern && !rule.pattern.test(value)) {
          errors[field] = rule.message;
          break;
        }

        if (rule.custom && !rule.custom(value)) {
          errors[field] = rule.message;
          break;
        }
      }
    });

    return errors;
  }

  static isValid(errors: ValidationErrors): boolean {
    return Object.keys(errors).length === 0;
  }
}

// Reglas comunes
export const commonRules = {
  email: [
    { required: true, message: 'El email es requerido' },
    { 
      pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, 
      message: 'El email no es válido' 
    }
  ],
  password: [
    { required: true, message: 'La contraseña es requerida' },
    { minLength: 6, message: 'La contraseña debe tener al menos 6 caracteres' }
  ],
  phone: [
    { required: true, message: 'El teléfono es requerido' },
    { 
      pattern: /^\d{10}$/, 
      message: 'El teléfono debe tener 10 dígitos' 
    }
  ],
  name: [
    { required: true, message: 'El nombre es requerido' },
    { minLength: 2, message: 'El nombre debe tener al menos 2 caracteres' }
  ]
};

// 5. UTILS Y HELPERS
// src/utils/helpers.ts
export class Utils {
  static formatCurrency(amount: number): string {
    return new Intl.NumberFormat('es-MX', {
      style: 'currency',
      currency: 'MXN',
    }).format(amount);
  }

  static formatDate(date: Date | string): string {
    const d = typeof date === 'string' ? new Date(date) : date;
    return new Intl.DateTimeFormat('es-MX', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    }).format(d);
  }

  static formatTime(date: Date | string): string {
    const d = typeof date === 'string' ? new Date(date) : date;
    return new Intl.DateTimeFormat('es-MX', {
      hour: '2-digit',
      minute: '2-digit',
    }).format(d);
  }

  static capitalizeFirst(str: string): string {
    return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
  }

  static truncateText(text: string, maxLength: number): string {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength).trim() + '...';
  }

  static generateId(): string {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
  }

  static debounce<T extends (...args: any[]) => any>(
    func: T,
    wait: number
  ): (...args: Parameters<T>) => void {
    let timeout: NodeJS.Timeout;
    return (...args: Parameters<T>) => {
      clearTimeout(timeout);
      timeout = setTimeout(() => func(...args), wait);
    };
  }

  static isValidEmail(email: string): boolean {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }

  static isValidPhone(phone: string): boolean {
    return /^\d{10}$/.test(phone.replace(/\D/g, ''));
  }
}