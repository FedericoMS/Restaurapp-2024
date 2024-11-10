import { Injectable } from '@angular/core';
import {
  ActionPerformed,
  PushNotifications,
  PushNotificationSchema,
  Token,
} from '@capacitor/push-notifications';
import { Platform } from '@ionic/angular';
import { Firestore, doc, docData, updateDoc } from '@angular/fire/firestore';
import { LocalNotifications } from '@capacitor/local-notifications';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';
import { FirestoreService } from './firestore.service';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { UserService } from './user.service';
import { Usuario } from '../clases/usuario';

@Injectable({
  providedIn: 'root',
})
export class PushService {
  private user?: Usuario;

  constructor(
    private firestoreService: FirestoreService,
    private platform: Platform,
    public userService: UserService,
    private http: HttpClient,
    public afs: AngularFirestore
  ) {}

  async initialize(): Promise<void> {
    this.addListeners();
    // Previamente, se verifica que se esté utilizando un dispositivo móvil y que el usuario no tenga un token previo
    if (this.platform.is('capacitor') && this.user && this.user.token === '') {
      const result = await PushNotifications.requestPermissions();
      if (result.receive === 'granted') {
        await PushNotifications.register();
      }
    }
  }

  getUser(): void {
    this.afs
      .collection('usuarios')
      .doc(this.userService.uidUser)
      .valueChanges()
      .subscribe((usuario) => {
        this.user = usuario as Usuario;
      });
    setTimeout(() => {
      this.initialize();
    }, 2000);
  }

  //Esto sucede cuando el registro de las notificaciones push finaliza sin errores
  private async addListeners(): Promise<void> {
    await PushNotifications.addListener(
      'registration',
      async (token: Token) => {
        console.log('Registration token: ', token.value);
        //Guardo el token en el usuario
        if (this.user) {
          this.user.token = token.value;
          this.firestoreService.updateDatabase('usuarios', this.user);
        }
      }
    );
    //Pasa esto cuando el registro de las notificaciones push finaliza con errores
    await PushNotifications.addListener('registrationError', (e) => {
      console.error('Registration error: ', e.error);
    });
    //Esto ocurre cuando el dispositivo móvil recibe una notificación push
    await PushNotifications.addListener(
      'pushNotificationReceived',
      (notification: PushNotificationSchema) => {
        //Este evento solo se activa cuando tenemos la app en primer plano
        console.log('Push notification received: ', notification);
        console.log('data: ', notification.data);
        //Esto se hace en el caso de que querramos que nos aparezca la notificación en la task bar del celular ya que por defecto las push en primer plano no lo hacen, de no ser necesario esto se puede sacar.
        LocalNotifications.schedule({
          notifications: [
            {
              title: notification.title || '',
              body: notification.body || '',
              id: new Date().getMilliseconds(),
              extra: {
                data: notification.data,
              },
            },
          ],
        });
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

  enviar_notifiacion(title: string, msj: string, token: string) {
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
  /*
    //RESOLVER lo de fcmUrl
   sendPushNotification(req : any): Observable<any> {
     console.log('push notification');
     return this.http.post<Observable<any>>(environment.fcmUrl, req, {
       headers: {
         // eslint-disable-next-line @typescript-eslint/naming-convention
         Authorization: `key=${environment.fcmServerKey}`,
         // eslint-disable-next-line @typescript-eslint/naming-convention
         'Content-Type': 'application/json',
       },
     });
   }*/
}
