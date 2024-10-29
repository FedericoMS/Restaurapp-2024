import { AbstractControl, ValidatorFn } from '@angular/forms';

export function cuilValidator(): ValidatorFn {
  return (control: AbstractControl): { [key: string]: any } | null => {
    const value = control.value;
    const cuilRegex = /^\d{2}-\d{8}-\d{1}$/; // Expresión regular para validar el formato XX-XXXXXXXX-X

    // Verifica el formato
    const valid = cuilRegex.test(value);
    return valid ? null : { invalidCuil: { value } }; // Devuelve un objeto si no es válido
  };
}