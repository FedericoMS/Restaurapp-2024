import { Injectable } from '@angular/core';
import { Barcode, BarcodeScanner } from '@capacitor-mlkit/barcode-scanning';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
import { Alert } from '../clases/alert';
import { Persona } from '../clases/persona';
import Vibration from '@awesome-cordova-library/vibration';
import Swal from 'sweetalert2';
import { Pedido } from '../clases/pedido';

@Injectable({
  providedIn: 'root',
})
export class UtilService {
  mostrarSpinner = false;
  pedido?: Pedido;
  encuesta_realizada = false;
  constructor() { }

  estadoPedido() {
    if (this.pedido) {
      switch (this.pedido.estado) {
        case 'rechazado':
          Alert.comun('Su pedido fue rechazado');
          break;

        case 'pendiente de confirmación':
          Alert.comun('Su pedido está pendiente de confirmación');
          break;

        case 'en preparación':
          Alert.comun('Su pedido está en preparación');
          break;

        case 'preparado':
          Alert.comun('Su pedido está preparado');
          break;

        case 'en entrega':
          Alert.comun('Su pedido está por ser entregado');
          break;

        case 'recibido':
          Alert.comun('Usted ya ha recibido su pedido');
          break;

        case 'cuenta pedida':
          Alert.comun('La cuenta ha sido solicitada al mozo');
          break;

        case 'cuenta enviada':
          Alert.comun('La cuenta ya le ha sido entregada a usted');
          break;

        case 'pagado':
          Alert.comun('Su pedido ha sido pagado');
          break;

        case 'finalizado':
          Alert.comun('Su pedido está finalizado. Muchas gracias por su compra.');
          break;

        default:
          Alert.comun('No hay pedido');
          break;

      }
    }
    else {
      Alert.comun('No hay pedido');
    }
    return this.pedido ? true : false;
  }

  async scan(): Promise<string> {
    try {
      await BarcodeScanner.installGoogleBarcodeScannerModule();
    } catch (error) {
      console.log(error);
    }
    const granted = await this.requestPermissions();
    if (!granted) {
      Alert.error(
        'Permisos denegado',
        'Conceda los permisos para poder escanear'
      );
      return '';
    }

    const barcode = await BarcodeScanner.scan();
    return barcode.barcodes[0].rawValue;
  }

  async requestPermissions(): Promise<boolean> {
    const { camera } = await BarcodeScanner.requestPermissions();
    return camera === 'granted' || camera === 'limited';
  }

  async scan_dni() {
    const result = await this.scan();
    console.log(result);
    if (result !== '') {
      console.log('Resultado del escaneo:', result);
      const content = result.split('@').map((part: any) => part.trim()); // Removemos espacios innecesarios
      console.log('Contenido de content: ' + content);
      let apellidos = '';
      let nombres = '';
      let dni = '';

      // Tratamos de capturar los apellidos, nombres y dni en distintos formatos
      if (isNaN(parseInt(content[0]))) {
        // FORMATO DE MI DNI
        if (content[4] && content[5]) {
          apellidos = content[4].charAt(0) + content[4].slice(1).toLowerCase();
          nombres = content[5]
            .split(' ')
            .map(
              (n: string) =>
                n.charAt(0).toUpperCase() + n.slice(1).toLowerCase()
            )
            .join(' ');
        }

        // Tratamos de encontrar el DNI: asumiendo que el DNI es siempre numérico y tiene longitud típica de 7-8 caracteres
        const dniMatch = content.find((part) => /^\d{7,8}$/.test(part));
        if (dniMatch) {
          dni = dniMatch;
        } else {
          dni = content[4]; // Intento de obtener un campo de fallback (posición 4 en caso estándar)
        }
      } else {
        // FORMATO DE DNI NUEVO
        if (content[1] && content[2]) {
          apellidos = content[1].charAt(0) + content[1].slice(1).toLowerCase();
          nombres = content[2]
            .split(' ')
            .map(
              (n: string) =>
                n.charAt(0).toUpperCase() + n.slice(1).toLowerCase()
            )
            .join(' ');
        }
        // Tratamos de encontrar el DNI: asumiendo que el DNI es siempre numérico y tiene longitud típica de 7-8 caracteres
        const dniMatch = content.find((part) => /^\d{7,8}$/.test(part));
        if (dniMatch) {
          dni = dniMatch;
        } else {
          dni = content[4]; // Intento de obtener un campo de fallback (posición 4 en caso estándar)
        }
      }

      // Si logramos capturar los datos necesarios, devuelvo una persona
      if (apellidos && nombres && dni) {
        return new Persona(nombres, apellidos, parseInt(dni), '', '');
      }
    }

    return null;
  }

  async takePicture() {
    return await Camera.getPhoto({
      quality: 90,
      allowEditing: false,
      resultType: CameraResultType.DataUrl,
      source: CameraSource.Camera,
    });
  }

  async takePicturePrompt() {
    return await Camera.getPhoto({
      quality: 90,
      allowEditing: false,
      resultType: CameraResultType.DataUrl,
      source: CameraSource.Prompt,
      promptLabelHeader: 'Selecciona una opción',
      promptLabelPicture: 'Tomar una foto',
      promptLabelPhoto: 'Elegir de la galería',
    });
  }

  async sacar_foto() {
    return (await this.takePicture()).dataUrl;
  }

  showToast(
    title: string,
    backgroundColor: string = 'lightgreen',
    position:
      | 'top-right'
      | 'top-left'
      | 'bottom-right'
      | 'bottom-left'
      | 'center'
      | 'top'
      | 'bottom',
    icon: 'success' | 'error' | 'warning' | 'info' | 'question' = 'success',
    textColor: string = 'white',
    vibration: boolean = false
  ) {
    const Toast = Swal.mixin({
      toast: true,
      position: position,
      iconColor: 'white',
      customClass: {
        popup: 'colored-toast',
      },
      showConfirmButton: false,
      timer: 2000,
      timerProgressBar: true,
      background: backgroundColor,
      color: textColor,
    });

    Toast.fire({
      title: title,
      icon: icon,
    });
    if (vibration) {
      Vibration.vibrate(1000);
    }
  }

  showSpinner() {
    this.mostrarSpinner = true;
  }

  hideSpinner() {
    this.mostrarSpinner = false;
  }

  msjError(
    msj: string,
    position:
      | 'top-right'
      | 'top-left'
      | 'bottom-right'
      | 'bottom-left'
      | 'center'
      | 'top'
      | 'bottom' = 'center'
  ) {
    this.showToast(msj, 'red', position, 'error', 'white', true);
  }

  msjExito(
    msj: string = 'Se cargó exitosamente',
    position:
      | 'top-right'
      | 'top-left'
      | 'bottom-right'
      | 'bottom-left'
      | 'center'
      | 'top'
      | 'bottom' = 'center'
  ) {
    this.showToast(msj, 'lightgreen', position);
  }
}
