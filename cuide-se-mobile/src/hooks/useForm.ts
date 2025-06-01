import { useState, useCallback } from 'react';

interface ValidationRule {
  required?: boolean;
  minLength?: number;
  maxLength?: number;
  pattern?: RegExp;
  validate?: (value: any) => boolean | string;
}

interface ValidationRules {
  [key: string]: ValidationRule;
}

interface FormErrors {
  [key: string]: string;
}

interface FormValues {
  [key: string]: any;
}

export const useForm = (initialValues: FormValues = {}, validationRules: ValidationRules = {}) => {
  const [values, setValues] = useState<FormValues>(initialValues);
  const [errors, setErrors] = useState<FormErrors>({});
  const [touched, setTouched] = useState<{ [key: string]: boolean }>({});

  // Atualiza o valor de um campo
  const handleChange = useCallback((name: string, value: any) => {
    setValues(prev => ({ ...prev, [name]: value }));
    setTouched(prev => ({ ...prev, [name]: true }));

    // Valida o campo
    const error = validateField(name, value, validationRules[name]);
    setErrors(prev => ({ ...prev, [name]: error }));
  }, [validationRules]);

  // Marca um campo como tocado
  const handleBlur = useCallback((name: string) => {
    setTouched(prev => ({ ...prev, [name]: true }));

    // Valida o campo
    const error = validateField(name, values[name], validationRules[name]);
    setErrors(prev => ({ ...prev, [name]: error }));
  }, [values, validationRules]);

  // Valida um campo específico
  const validateField = useCallback((name: string, value: any, rules?: ValidationRule): string => {
    if (!rules) return '';

    if (rules.required && !value) {
      return 'Este campo é obrigatório';
    }

    if (rules.minLength && value.length < rules.minLength) {
      return `Este campo deve ter no mínimo ${rules.minLength} caracteres`;
    }

    if (rules.maxLength && value.length > rules.maxLength) {
      return `Este campo deve ter no máximo ${rules.maxLength} caracteres`;
    }

    if (rules.pattern && !rules.pattern.test(value)) {
      return 'Formato inválido';
    }

    if (rules.validate) {
      const result = rules.validate(value);
      if (typeof result === 'string') {
        return result;
      }
      if (!result) {
        return 'Valor inválido';
      }
    }

    return '';
  }, []);

  // Valida todos os campos
  const validateForm = useCallback((): boolean => {
    const newErrors: FormErrors = {};
    let isValid = true;

    Object.keys(validationRules).forEach(name => {
      const error = validateField(name, values[name], validationRules[name]);
      if (error) {
        newErrors[name] = error;
        isValid = false;
      }
    });

    setErrors(newErrors);
    return isValid;
  }, [values, validationRules, validateField]);

  // Reseta o formulário
  const resetForm = useCallback(() => {
    setValues(initialValues);
    setErrors({});
    setTouched({});
  }, [initialValues]);

  // Define os valores do formulário
  const setFormValues = useCallback((newValues: FormValues) => {
    setValues(newValues);
  }, []);

  // Define os erros do formulário
  const setFormErrors = useCallback((newErrors: FormErrors) => {
    setErrors(newErrors);
  }, []);

  // Verifica se o formulário é válido
  const isValid = useCallback((): boolean => {
    return Object.keys(errors).length === 0;
  }, [errors]);

  // Verifica se o formulário foi tocado
  const isTouched = useCallback((name: string): boolean => {
    return touched[name] || false;
  }, [touched]);

  // Verifica se o formulário está sujo (valores diferentes dos iniciais)
  const isDirty = useCallback((): boolean => {
    return JSON.stringify(values) !== JSON.stringify(initialValues);
  }, [values, initialValues]);

  return {
    values,
    errors,
    touched,
    handleChange,
    handleBlur,
    validateForm,
    resetForm,
    setFormValues,
    setFormErrors,
    isValid,
    isTouched,
    isDirty,
  };
}; 