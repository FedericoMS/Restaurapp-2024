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
    this.user = new Usuario;
  }

  ngOnInit() {
  }

  toRegisterPage() {
    this.router.navigateByUrl('registro');
  }

  
  loginUser() {
   
    if (this.user.email == '' || this.user.password == '') {
      
      this.userService.showToast('Campos vacíos', 'red', 'top', 'error')
  
        }
        else {
          this.userService.login({ email: this.user.email, password: this.user.password })
          .then(() => {
            this.userService.showToast('¡Bienvenido!', 'lightgreen', 'top', 'success', 'black')
            this.router.navigateByUrl('home');
         
          })
          .catch(() => {
          this.userService.showToast('Alguno de los datos es incorrecto', 'red', 'top', 'error')
         
        });


    }
  }

  fastLogin(email: string, pass: string) {
    this.user.email = email;
    this.user.password = pass;
  }

}
