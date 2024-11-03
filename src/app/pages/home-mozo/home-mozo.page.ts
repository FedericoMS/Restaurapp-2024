import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar } from '@ionic/angular/standalone';
import { SpinnerComponent } from 'src/app/components/spinner/spinner.component';
import { UserService } from 'src/app/services/user.service';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { FirestoreService } from 'src/app/services/firestore.service';

@Component({
  selector: 'app-home-mozo',
  templateUrl: './home-mozo.page.html',
  styleUrls: ['./home-mozo.page.scss'],
  standalone: true,
  imports: [IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule]
})
export class HomeMozoPage implements OnInit {

  isLoading : boolean = false;
  listaPedidos : any;
  userAuth: any = this.angularFireAuth.authState;
  

  constructor(public userService: UserService, private angularFireAuth: AngularFireAuth, private firestoreService: FirestoreService) {
    setTimeout(() => {
      this.isLoading = true;      
    }, 1100);
    this.userAuth = this.angularFireAuth.authState.subscribe(async (user) => {
      this.userAuth = user;
      console.log(user);
    });
    this.firestoreService.getPedidos().subscribe((pedidos: any) => {
      this.listaPedidos = pedidos;
      // Verificar si hay algún cliente con estadoAprobacion == 'pendiente'
     /* if (!this.userList.some((user: any) => user.estadoAprobacion === 'pendiente' && user.rol === 'cliente')) {
        this.isEmpty = true;
        console.log(this.isEmpty);
      }*/
    });


  }

  ngOnInit() {
  }

}
