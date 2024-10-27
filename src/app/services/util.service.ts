import { Injectable } from '@angular/core';
import { Barcode, BarcodeScanner } from '@capacitor-mlkit/barcode-scanning';
import { Alert } from '../clases/alert';
import { Persona } from '../clases/persona';
@Injectable({
  providedIn: 'root',
})
export class UtilService {
  constructor() {}

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

  async get_result_scan() {
    const result = await this.scan();

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
}
