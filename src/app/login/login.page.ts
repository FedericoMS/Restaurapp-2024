import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar } from '@ionic/angular/standalone';
import { UserService } from '../services/user.service';
import { Router } from '@angular/router';
import { Usuario } from '../clases/usuario';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  standalone: true,
  imports: [IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule]
})
export class LoginPage implements OnInit {

  user: Usuario;

  constructor(public userService: UserService, private router: Router) {
    this.user = new Usuario('','',0,'','','','','');
  }

  ngOnInit() {
  }

  toRegisterPage() {
    this.router.navigateByUrl('registro');
  }


  async loginUser() {
    if (this.user.email === '' || this.user.password === '') {
      this.userService.showToast('Campos vacíos', 'red', 'center', 'error', 'white', true);
    } else {
      try {
        await this.userService.login({ email: this.user.email, password: this.user.password });
        this.userService.showToast('¡Bienvenido!', 'lightgreen', 'center', 'success', 'black');

        const rol = await this.userService.getRole();
        if (rol == 'dueño' || rol == 'supervisor') {
          this.router.navigateByUrl('home-duenio-supervisor');
        }
        else {
          this.router.navigateByUrl('home');
        }
      } catch (error) {
        this.userService.showToast('Alguno de los datos es incorrecto', 'red', 'center', 'error', 'white', true);
      }
    }
  }


  fastLogin(email: string, pass: string) {
    this.user.email = email;
    this.user.password = pass;
  }

}
