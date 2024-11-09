import Swal, { SweetAlertOptions } from 'sweetalert2';

export class Alert {
  private static base: SweetAlertOptions = {
    heightAuto: false,
    backdrop: true, // Esta opción asegura que el fondo sea oscuro
    allowOutsideClick: false, // Impide cerrar al hacer clic fuera del modal
    confirmButtonText: 'Aceptar',
    showConfirmButton: true,
    background: '#310a6b',
    color: '#f5f2ff',
    // customClass: {
    //   confirmButton: 'btn-ok',
    //   title: 'alert-title',
    // },
  };

  static success(titulo: string, texto: string) {
    const alert = Swal.fire(Alert.base);
    Swal.update({
      icon: 'success',
      title: titulo,
      text: texto,
    });

    return alert;
  }

  static error(titulo: string, texto: string) {
    const alert = Swal.fire(Alert.base);
    Swal.update({
      icon: 'error',
      title: titulo,
      text: texto,
    });

    return alert;
  }

  static comun(titulo = '', texto = '') {
    return Swal.fire({
      title: titulo,
      text: texto,
      showCancelButton: false,
      confirmButtonText: 'Aceptar',
      heightAuto: false,
      allowOutsideClick: false, // Impide cerrar al hacer clic fuera del modal
    });
  }
}
