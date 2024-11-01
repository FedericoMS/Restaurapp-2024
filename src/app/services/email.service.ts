import { Injectable } from '@angular/core';
import emailjs, { EmailJSResponseStatus, init } from 'emailjs-com';


@Injectable({
  providedIn: 'root'
})
export class EmailService {

  constructor() { }

  sendPendingApproval(user: any) {
    const templateParams = {
      to_name: user.nombre,
      message:
        'Tu cuenta está pendiente de aprobación. Por favor, espera a que la misma sea aprobada.',
      logoUrl: 'https://firebasestorage.googleapis.com/v0/b/pps-sp-2024.appspot.com/o/logomail.png?alt=media&token=46f0795a-d21c-480d-924b-26cd62828301',  
      from_name: 'Restaurapp',
      email_cliente: user.email,
    };

    emailjs
      .send('service_mflse7n', 'template_kz5b0ur', templateParams, 'ABg909m6sP8WTAk2f')
      .then((res) => {
        console.log('correo enviado.', res.status, res.text);
      })
      .catch((error) => {
        console.log('Error al enviar el correo.', error.message);
      });
  }

  sendApprovedAccount(user: any) {
    const templateParams = {
      to_name: user.nombre,
      message:
        '¡Tu cuenta ha sido aprobada! Ya puedes ingresar a la aplicación.',
      logoUrl: 'https://firebasestorage.googleapis.com/v0/b/pps-sp-2024.appspot.com/o/logomail.png?alt=media&token=46f0795a-d21c-480d-924b-26cd62828301',  
      from_name: 'Restaurapp',
      email_cliente: user.email,
    };

    emailjs
      .send('service_mflse7n', 'template_kz5b0ur', templateParams, 'ABg909m6sP8WTAk2f')
      .then((res) => {
        console.log('correo enviado.', res.status, res.text);
      })
      .catch((error) => {
        console.log('Error al enviar el correo.', error.message);
      });
  }

  sendDisabledAccount(user: any) {
    const templateParams = {
      to_name: user.nombre,
      message:
        'Tu cuenta ha sido deshabilitada. Comuníquese con nosotros para conocer los motivos.',
      logoUrl: 'https://firebasestorage.googleapis.com/v0/b/pps-sp-2024.appspot.com/o/logomail.png?alt=media&token=46f0795a-d21c-480d-924b-26cd62828301',  
      from_name: 'Restaurapp',
      email_cliente: user.email,
    };

    emailjs
      .send('service_mflse7n', 'template_kz5b0ur', templateParams, 'ABg909m6sP8WTAk2f')
      .then((res) => {
        console.log('correo enviado.', res.status, res.text);
      })
      .catch((error) => {
        console.log('Error al enviar el correo.', error.message);
      });
  }


}

