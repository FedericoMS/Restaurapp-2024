import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonCard, IonCardHeader, IonCardTitle, IonCardSubtitle } from '@ionic/angular/standalone';
import { UserService } from 'src/app/services/user.service';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { FirestoreService } from 'src/app/services/firestore.service';

@Component({
  selector: 'app-home-duenio-supervisor',
  templateUrl: './home-duenio-supervisor.page.html',
  styleUrls: ['./home-duenio-supervisor.page.scss'],
  standalone: true,
  imports: [IonCardSubtitle, IonCardTitle, IonCardHeader, IonCard, IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule]
})
export class HomeDuenioSupervisorPage implements OnInit {

  user: any = null;
  userAuth: any = this.angularFireAuth.authState;
  isDuenio = false;
  isSupervisor = false;
  userList: any[] = [];
  rol: any = '';

  constructor(private userService: UserService, private angularFireAuth: AngularFireAuth, private firestoreService: FirestoreService) {
    this.userAuth = this.angularFireAuth.authState.subscribe(async (user) => {
      if (user != null && user != undefined) {
        try {
          this.rol = this.userService.getRole()
          if (this.rol) {
            console.log('El rol del usuario es:', this.rol);
            if (this.rol === 'dueño') {
              this.isDuenio = true;
            } else {
              if (this.rol === 'supervisor') {
                this.isSupervisor = true;
              }
            }
          } else {
            console.log('El usuario no tiene el campo "rol" definido.');
          }
        } catch (error) {
          console.error('Error al obtener el perfil del usuario:', error);
        }
      }

      this.userAuth = user;
    });
    this.firestoreService.getUsuarios().subscribe((users: any) => {
      this.userList = users;
      // this.userList.sort(this.orderByLastName);
    });


  }

  ngOnInit() {
  }

}
