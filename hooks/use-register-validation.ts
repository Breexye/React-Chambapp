import { useState } from 'react';

export const useFormValidation = () => {
  const [errors, setErrors] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    jobTitle: '',
    jobDescription: '',
    curp: '',
    ine: '',
  });

  const validate = (data: {
    name: string;
    email: string;
    phone: string;
    password: string;
    role: 'cliente' | 'trabajador';
    jobTitle?: string;
    jobDescription?: string;
    curp?: string;
    ine?: string;
  }) => {
    let isValid = true;
    let newErrors = {
      name: '',
      email: '',
      phone: '',
      password: '',
      jobTitle: '',
      jobDescription: '',
      curp: '',
      ine: '',
    };

    // 1. Validaciones comunes
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

    // 2. Validaciones exclusivas si el rol es TRABAJADOR
    if (data.role === 'trabajador') {
      if (!data.jobTitle || !data.jobTitle.trim()) {
        newErrors.jobTitle = "Selecciona una especialidad de la lista";
        isValid = false;
      }

      if (!data.jobDescription || data.jobDescription.trim().length < 15) {
        newErrors.jobDescription = "Describe tu especialidad (mínimo 15 caracteres)";
        isValid = false;
      }

      if (!data.curp || data.curp.trim().length !== 18) {
        newErrors.curp = "El CURP debe tener exactamente 18 caracteres";
        isValid = false;
      }

      if (!data.ine || !data.ine.trim()) {
        newErrors.ine = "El número de INE o clave de elector es obligatorio";
        isValid = false;
      }
    }

    setErrors(newErrors);
    return isValid;
  };

  return { errors, validate };
};