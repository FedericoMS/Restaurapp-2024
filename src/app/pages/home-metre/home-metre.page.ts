import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonFab, IonFabButton, IonFabList, IonIcon } from '@ionic/angular/standalone';
import { UserService } from 'src/app/services/user.service';
import { FirestoreService } from 'src/app/services/firestore.service';
import { arrowBackCircleOutline } from 'ionicons/icons';
import { addIcons } from 'ionicons';

@Component({
  selector: 'app-home-metre',
  templateUrl: './home-metre.page.html',
  styleUrls: ['./home-metre.page.scss'],
  standalone: true,
  imports: [IonIcon, IonFabList, IonFabButton, IonFab, IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule]
})
export class HomeMetrePage implements OnInit {
  listUsersWaiting! : Array<any>;
  listTables! : Array<any>;
  customer : any;
  constructor(public userService: UserService, private firestore : FirestoreService) { 
    this.listUsersWaiting = [];
    // this.customer = 'Lautaro Garcia';
    this.listTables = [];
    this.customer = null;
  }

  ngOnInit() {
    addIcons({ arrowBackCircleOutline});


    this.firestore.getCollection('lista_de_espera').valueChanges()
    .subscribe((response)=>{
      this.listUsersWaiting = response;
    })

    this.firestore.getCollection('mesas').valueChanges()
    .subscribe((response)=>{
      this.listTables = response.sort((a : any, b : any) => a.numero - b.numero);
    })


  }


  setTable(user : any){
    this.customer = user;
  }


  goBack(){
    this.customer = null;
  }


}
