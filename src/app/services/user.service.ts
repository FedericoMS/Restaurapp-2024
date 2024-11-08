import { Injectable } from '@angular/core';
import Swal from 'sweetalert2';
import {
  Auth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  sendEmailVerification,
} from '@angular/fire/auth';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { Router } from '@angular/router';
//import { BarcodeScanner, LensFacing } from '@capacitor-mlkit/barcode-scanning';
import { BehaviorSubject } from 'rxjs';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import Vibration from '@awesome-cordova-library/vibration';
import { FirestoreService } from './firestore.service';
import { lastValueFrom } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  public isLoggedIn: boolean = false;
  private userName: string = '';
  private email: string | null | undefined = '';
  private userSubject: BehaviorSubject<any> = new BehaviorSubject(null);
  public user = this.userSubject.asObservable();
  public uidUser: any;
  private userRole: string = '';
  public nroMesa: number = 0;

  constructor(
    private auth: Auth,
    private authFire: AngularFireAuth,
    private router: Router,
    private afstorage: AngularFireStorage,
    private af: AngularFirestore,
    private fs: FirestoreService
  ) {
    // this.authFire.authState.subscribe((user) => {
    //   this.isLoggedIn = true;
    //   if (user != null && user != undefined) {
    //     let userArray: any = user.email?.split('@');
    //     this.userName = userArray[0];
    //     console.log('Hola, soy el usuario: ' + this.userName);
    //   }
    //   console.log('Hola, soy el usuario con el mail: ' + user?.email);
    //   this.email = user?.email;

    //   // Emitir el usuario a través del BehaviorSubject
    //   this.userSubject.next(user);
    // });
  }

  login({ email, password }: any) {
    return signInWithEmailAndPassword(this.auth, email, password)
      .then((u) => {
        this.isLoggedIn = true;
        this.uidUser = u.user.uid;
      })
      .catch((err) => {
        console.log('Hubo un error: ' + err);
        throw err;
      });
  }

  getUserName() {
    return this.userName;
  }

  setUserName(username: string){
    this.userName = username;
  }

  checkEmail(email: string) {
    const regex =
      /^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;
    if (regex.test(email)) {
      return true;
    } else {
      return false;
    }
  }



  //Creé este método para obtener cualquier campo de un objeto de firebase
  async getProperty(field : string): Promise<any> {
    const userProfileSnapshot: any = await lastValueFrom(
      this.fs.getUserProfile(this.uidUser)
    );
    if (userProfileSnapshot.exists) {
      const userProfileData = userProfileSnapshot.data();
      return userProfileData[field];
    } else {
      return '';
    }
  }

  async getRole(): Promise<string> { // BORRAR
    const userProfileSnapshot: any = await lastValueFrom(
      this.fs.getUserProfile(this.uidUser)
    );
    if (userProfileSnapshot.exists) {
      const userProfileData = userProfileSnapshot.data();
      return userProfileData.rol;
    } else {
      return '';
    }
  }

  async getUserData(): Promise<any> { 
    const userProfileSnapshot: any = await lastValueFrom(
      this.fs.getUserProfile(this.uidUser)
    );
    if (userProfileSnapshot.exists) {
      const userProfileData = userProfileSnapshot.data();
      return userProfileData;
    } else {
      return '';
    }
  }


  async getIsApproved(): Promise<string> {
    const userProfileSnapshot: any = await lastValueFrom(
      this.fs.getUserProfile(this.uidUser)
    );
    // console.log("uid del user: " + this.uidUser);
    if (userProfileSnapshot.exists) {
      const userProfileData = userProfileSnapshot.data();
      //  console.log("Datos del perfil del usuario:", userProfileData); // <-- Añade esto para verificar los datos
      return userProfileData.estadoAprobacion;
    } else {
      return 'rechazado';
    }
  }

  logout() {
    this.auth.signOut();
    this.userName = '';
    this.router.navigateByUrl('login');
    this.isLoggedIn = false;
    this.showToast(
      'Sesión cerrada',
      'lightgreen',
      'center',
      'success',
      'black'
    );
    console.log('Sesión cerrada');
  }

  registerManagedUsers(user: any) {
    return createUserWithEmailAndPassword(this.auth, user.email, user.password);
  }

  createUser(newUser: any) {
    // Guardar la sesión del admin antes de crear un nuevo usuario
    const currentUser = this.auth.currentUser;

    return createUserWithEmailAndPassword(
      this.auth,
      newUser.email,
      newUser.password
    )
      .then((data) => {
        if (data != null) {
          // Guardar el nuevo usuario en Firestore
          this.af
            .collection('usuarios')
            .doc(data.user?.uid)
            .set({
              id: data.user?.uid,
              apellido: newUser.apellido,
              nombre: newUser.nombre,
              dni: newUser.dni,
              rol: newUser.rol,
              email: newUser.email,
              password: newUser.password,
              foto_url: newUser.foto_url,
              estadoAprobacion: newUser.estadoAprobacion,
            })
            .then(() => {
              this.showToast(
                '¡Registro exitoso! Su cuenta queda pendiente de aprobación',
                'lightgreen',
                'center',
                'success',
                'black'
              );
            })
            .catch((error) => {
              // Manejo de errores al guardar en Firestore
              this.showToast(
                'Ocurrió un error al guardar los datos del usuario',
                'red',
                'center',
                'error',
                'white',
                true
              );
            });
        }
      })
      .catch((error) => {
        // Manejo de errores de creación de usuario en Firebase
        if (error.code === 'auth/email-already-in-use') {
          this.showToast(
            'El correo electrónico ya está en uso',
            'red',
            'center',
            'error',
            'white',
            true
          );
        } else if (error.code === 'auth/weak-password') {
          this.showToast(
            'La contraseña debe contener al menos 6 caracteres',
            'red',
            'center',
            'error',
            'white',
            true
          );
        } else {
          this.showToast(
            'Ocurrió un error al registrar el usuario: ' + error.message,
            'red',
            'center',
            'error',
            'white',
            true
          );
        }
      });
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
}
