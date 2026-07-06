import { useState } from 'react';

export const useFormValidation = () => {
  const [errors, setErrors] = useState({ name: '', email: '', phone: '', password: '' });

  const validate = (data: { name: string; email: string; phone: string; password: string }) => {
    let isValid = true;
    let newErrors = { name: '', email: '', phone: '', password: '' };

    if (!/^[A-Za-zÁÉÍÓÚáéíóúñÑ\s]+$/.test(data.name)) {
      newErrors.name = "Solo letras y espacios";
      isValid = false;
    }
    if (!/^\S+@\S+\.\S+$/.test(data.email)) {
      newErrors.email = "Correo electrónico inválido";
      isValid = false;
    }
    if (!/^[0-9]{10}$/.test(data.phone)) {
      newErrors.phone = "El teléfono debe tener 10 dígitos";
      isValid = false;
    }
    if (data.password.length < 8 || /\s/.test(data.password)) {
      newErrors.password = "Mínimo 8 caracteres sin espacios";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  return { errors, validate };
};