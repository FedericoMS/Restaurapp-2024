import { inject, Injectable } from '@angular/core';
import {
  ActionPerformed,
  PushNotifications,
  PushNotificationSchema,
  Token,
} from '@capacitor/push-notifications';
import { Platform } from '@ionic/angular';
import { LocalNotifications } from '@capacitor/local-notifications';
import { HttpClient } from '@angular/common/http';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Usuario } from '../clases/usuario';
import { AppState, App } from '@capacitor/app';

@Injectable({
  providedIn: 'root',
})
export class PushService {
  private user?: Usuario;
  private token: string = '';

  constructor(
    private platform: Platform,
    private http: HttpClient,
    public afs: AngularFirestore
  ) {
    this.initialize();
  }

  async initialize(): Promise<void> {
    // Previamente, se verifica que se esté utilizando un dispositivo móvil y que el usuario no tenga un token previo
    const result = await PushNotifications.requestPermissions();
    if (result.receive === 'granted') {
      await PushNotifications.register();
    }
    this.addListeners();
  }

  getUser(uidUser: string): void {
    this.afs
      .collection('usuarios')
      .doc(uidUser)
      .get()
      .subscribe((usuario) => {
        this.user = usuario.data() as Usuario;
        //Guardo el token en el usuario
        if (this.user) {
          this.user.token = this.token;
          this.afs
            .collection('usuarios')
            .doc(this.user.id)
            .update({ ...this.user });
        }
      });
  }

  //Esto sucede cuando el registro de las notificaciones push finaliza sin errores
  private async addListeners(): Promise<void> {
    await PushNotifications.addListener(
      'registration',
      async (token: Token) => {
        console.log('Registration token: ', token.value);
        this.token = token.value;
      }
    );
    //Pasa esto cuando el registro de las notificaciones push finaliza con errores
    await PushNotifications.addListener('registrationError', (e) => {
      console.error('Registration error: ', e.error);
    });
    //Esto ocurre cuando el dispositivo móvil recibe una notificación push
    await PushNotifications.addListener(
      'pushNotificationReceived',
      async (notification: PushNotificationSchema) => {
        //Este evento solo se activa cuando tenemos la app en primer plano
        console.log('Push notification received: ', notification);
        console.log('data: ', notification.data);
        //Detecta el estado de la app
        const appState = await App.getState();
        //Esto se hace en el caso de que querramos que nos aparezca la notificación en la task bar del celular ya que por defecto las push en primer plano no lo hacen, de no ser necesario esto se puede sacar.
        if (appState.isActive) {
          // La app está en primer plano
          LocalNotifications.schedule({
            notifications: [
              {
                title: notification.title || '',
                body: notification.body || '',
                id: new Date().getTime(),
                extra: {
                  data: notification.data,
                },
              },
            ],
          });
        } else {
          // La app está en segundo plano, no se necesita programar la notificación local
          console.log(
            'App en segundo plano, solo se muestra la notificación push'
          );
        }
      }
    );
    //Cuando se realiza una accion sobre la notificación push sucede lo siguiente
    await PushNotifications.addListener(
      'pushNotificationActionPerformed',
      (notification: ActionPerformed) => {
        //Este evento sólo se activa cuando tenemos la app en segundo plano y presionamos sobre la notificación
        console.log(
          'Push notification action performed',
          notification.actionId,
          notification.notification
        );
      }
    );
    //Cuando se realiza una acción sobre la notificación local:
    await LocalNotifications.addListener(
      'localNotificationActionPerformed',
      (notificationAction) => {
        console.log('action local notification', notificationAction);
      }
    );
  }

  private send_notification(title: string, msj: string, token: string) {
    const url =
      'https://mi-servidor-notificaciones-1086868851593.us-central1.run.app/notify';

    this.http
      .post(url, {
        title: title,
        body: msj,
        token: token,
      })
      .forEach((res) => {
        console.log(res);
      });
  }

  send_push_notification(title: string, msj: string, rol: string) {
    this.afs
      .collection('usuarios')
      .get()
      .subscribe((snapshot) => {
        snapshot.forEach((item) => {
          const user = item.data() as Usuario;
          if (user.rol === rol && user.token !== '') {
            this.send_notification(title, msj, user.token);
            console.log('push notification: ', title, ' : ', msj);
          }
        });
      });
  }
}
