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
        await this.userService.login({ email: this.user.email, password: this.user.password });
        
        const state = await this.userService.getIsApproved();
        console.log("El estado es: " + state);
        if (state == 'aprobado') {
          this.userService.showToast('¡Bienvenido!', 'lightgreen', 'center', 'success', 'black');
          const rol = await this.userService.getRole();
          if (rol === 'dueño' || rol === 'supervisor') {
            this.router.navigateByUrl('home-duenio-supervisor');
          } else {
            this.router.navigateByUrl('home');
          }
        } else {
          if(state == 'pendiente')
          {
            this.userService.showToast('¡Acceso denegado! Cuenta pendiente de habilitación', 'red', 'center', 'error', 'white', true);
            
          }
          else
          {
            this.userService.showToast('¡Acceso denegado! Cuenta rechazada', 'red', 'center', 'error', 'white', true);

          }
 
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
}
