import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonCard, IonCardHeader, IonCardTitle, IonCardSubtitle, IonButton } from '@ionic/angular/standalone';
import { UserService } from 'src/app/services/user.service';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { FirestoreService } from 'src/app/services/firestore.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-home-duenio-supervisor',
  templateUrl: './home-duenio-supervisor.page.html',
  styleUrls: ['./home-duenio-supervisor.page.scss'],
  standalone: true,
  imports: [IonButton, IonCardSubtitle, IonCardTitle, IonCardHeader, IonCard, IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule]
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

  /*
  MODIFICAR TENIENDO EN CUENTA QUE SE AGREGA UN estadoAprobacion como un enum que contiene strings 'aprobado', 'rechazado' y 'pendiente'*/

  approveUser(user : any) {
    let modUser : any = user;
    Swal.fire({
      title: "¿Estás seguro de que quieres aprobar a este cliente?",
      showCancelButton: true,
      confirmButtonText: "Aprobar",
      cancelButtonText: `Cancelar`,
      heightAuto: false
    }).then((result) => {
      if (result.isConfirmed) {
        modUser.estadoAprobacion = modUser.estadoAprobacion.Aprobado;     
        console.log(modUser);   
        this.firestoreService.updateUser(modUser)
        Swal.fire({
          title: "¡Cliente aprobado!",
          confirmButtonText: "Continuar",
          heightAuto: false
        })
      }
    });
  }

  rejectUser(user : any) {
    let modUser : any = user;
    Swal.fire({
      title: "¿Estás seguro de que quieres rechazar a este cliente?",
      showCancelButton: true,
      confirmButtonText: "Rechazar",
      cancelButtonText: `Cancelar`,
      heightAuto: false
    }).then((result) => {
      if (result.isConfirmed) {
        modUser.estadoAprobacion = modUser.estadoAprobacion.Rechazado;     
        console.log(modUser);   
        this.firestoreService.updateUser(modUser)
        Swal.fire({
          title: "Cliente rechazado",
          confirmButtonText: "Continuar",
          heightAuto: false
        })
      }
    });
  }
    

}
