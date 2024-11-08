import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  IonContent,
  IonHeader,
  IonTitle,
  IonToolbar,
} from '@ionic/angular/standalone';
import { UserService } from '../services/user.service';
import { Router } from '@angular/router';
import { EstadoAprobacion, Usuario } from '../clases/usuario';
import { PushService } from '../services/push.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  standalone: true,
  imports: [
    IonContent,
    IonHeader,
    IonTitle,
    IonToolbar,
    CommonModule,
    FormsModule,
  ],
})
export class LoginPage implements OnInit {
  user: Usuario;

  constructor(public userService: UserService, private router: Router) {
    this.user = new Usuario(
      '',
      '',
      0,
      '',
      '',
      '',
      EstadoAprobacion.Pendiente,
      '',
      ''
    );
  }

  ngOnInit() {}

  toRegisterPage() {
    this.emptyInputs();
    this.router.navigateByUrl('alta-cliente');
  }

  async loginUser() {
    if (this.user.email === '' || this.user.password === '') {
      this.userService.showToast(
        'Campos vacíos',
        'red',
        'center',
        'error',
        'white',
        true
      );
    } else {
      try {
        await this.userService.login({
          email: this.user.email,
          password: this.user.password,
        });
        const state = await this.userService.getIsApproved();
        console.log('El estado es: ' + state);

        if (state === 'aprobado') {
          this.userService.showToast(
            '¡Bienvenido!',
            'lightgreen',
            'center',
            'success',
            'black'
          );
          this.emptyInputs();
          const dataUser = await this.userService.getUserData();
          this.userService.uidUser = dataUser.id;
          this.userService.setUserName(
            dataUser.nombre + ' ' + dataUser.apellido
          );
          this.userService.nroMesa =
            dataUser.nroMesa == null ? 0 : dataUser.nroMesa;
          console.log(this.userService.nroMesa);
          switch (dataUser.rol) {
            case 'dueño':
              this.router.navigateByUrl('home-duenio-supervisor');
              break;
            case 'supervisor':
              this.router.navigateByUrl('home-duenio-supervisor');
              break;
            case 'mozo':
              this.router.navigateByUrl('home-mozo');
              break;

            case 'cliente':
              this.router.navigateByUrl('ingreso-local');
              break;

            case 'anonimo':
              this.router.navigateByUrl('ingreso-local');
              break;

            case 'metre':
              this.router.navigateByUrl('home-metre');
              break;

            case 'cocinero':
              this.router.navigateByUrl('home-cocinero-bartender');
              break;

            case 'bartender':
              this.router.navigateByUrl('home-cocinero-bartender');
              break;

            default:
              this.router.navigateByUrl('home');
              break;
          }
        } else {
          const message =
            state === 'pendiente'
              ? '¡Acceso denegado! Cuenta pendiente de habilitación'
              : '¡Acceso denegado! Cuenta rechazada';

          this.userService.showToast(
            message,
            'red',
            'center',
            'error',
            'white',
            true
          );
        }
      } catch (error) {
        this.userService.showToast(
          'Alguno de los datos es incorrecto',
          'red',
          'center',
          'error',
          'white',
          true
        );
      }
    }
  }

  fastLogin(email: string, pass: string) {
    this.user.email = email;
    this.user.password = pass;
  }

  emptyInputs() {
    this.user.email = '';
    this.user.password = '';
  }
}
