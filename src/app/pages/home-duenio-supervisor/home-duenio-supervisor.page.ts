import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar } from '@ionic/angular/standalone';
import { UserService } from 'src/app/services/user.service';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { lastValueFrom } from 'rxjs';
import { FirestoreService } from 'src/app/services/firestore.service';

@Component({
  selector: 'app-home-duenio-supervisor',
  templateUrl: './home-duenio-supervisor.page.html',
  styleUrls: ['./home-duenio-supervisor.page.scss'],
  standalone: true,
  imports: [IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule]
})
export class HomeDuenioSupervisorPage implements OnInit {

  user: any = null;
  userAuth: any = this.angularFireAuth.authState;
  isDuenio = false;
  isSupervisor = false;
  usersList: any[] = [];

  constructor(private userService : UserService, private angularFireAuth: AngularFireAuth, private firestoreService : FirestoreService) {
    this.userAuth = this.angularFireAuth.authState.subscribe(async (user) => {
      if (user != null && user != undefined) {
        try {
          const userProfileSnapshot: any = await lastValueFrom(this.firestoreService.getUserProfile(user.uid));
          if (userProfileSnapshot.exists) {
            const userProfileData = userProfileSnapshot.data();
            console.log('Datos del perfil del usuario:', userProfileData);
            if (userProfileData && userProfileData.rol) {
              console.log('El rol del usuario es:', userProfileData.rol);
              if (userProfileData.rol === 'dueño') {
                this.isDuenio = true;
              } else {
                if(userProfileData.rol === 'supervisor')
                {
                  this.isSupervisor = true;
                }
              }
            } else {
              console.log('El usuario no tiene el campo "rol" definido.');
            }
          } else {
            console.log('No se encontró el perfil del usuario con el UID:', user.uid);
          }
        } catch (error) {
          console.error('Error al obtener el perfil del usuario:', error);
        }
      }

      this.userAuth = user;
    });
    if(this.isDuenio || this.isSupervisor)
    {
      this.firestoreService.getUsuarios().subscribe((users : any) => {
        this.usersList = users;
        // this.usersList.sort(this.orderByLastName);
      });      
    }

   }

  ngOnInit() {
  }

}
