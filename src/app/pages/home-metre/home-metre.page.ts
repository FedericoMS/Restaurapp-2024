import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonFab, IonFabButton, IonFabList, IonIcon } from '@ionic/angular/standalone';
import { UserService } from 'src/app/services/user.service';
import { FirestoreService } from 'src/app/services/firestore.service';
import { arrowBackCircleOutline } from 'ionicons/icons';
import { addIcons } from 'ionicons';
import Swal from 'sweetalert2';
import { SpinnerComponent } from 'src/app/components/spinner/spinner.component';

@Component({
  selector: 'app-home-metre',
  templateUrl: './home-metre.page.html',
  styleUrls: ['./home-metre.page.scss'],
  standalone: true,
  imports: [IonIcon, IonFabList, IonFabButton, IonFab, IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule,SpinnerComponent]
})
export class HomeMetrePage implements OnInit {
  listUsersWaiting : Array<any>;
  listTables : Array<any>;
  customer : any;
  idUserWaiting : string;
  isLoading! : boolean;

  constructor(public userService: UserService, private firestore : FirestoreService) { 
    this.listUsersWaiting = [];
    this.customer = {};
    this.listTables = [];
    this.customer = null;
    this.idUserWaiting = '';
  }

  ngOnInit() {
    addIcons({ arrowBackCircleOutline});

    this.isLoading = true;
    this.firestore.getCollection('lista_de_espera').valueChanges()
    .subscribe((response)=>{
      this.listUsersWaiting = response;
      this.isLoading = false;
    })

    this.firestore.getCollection('mesas').valueChanges()
    .subscribe((response)=>{
      this.listTables = response.sort((a : any, b : any) => a.numero - b.numero);
    })


  }


  setTable(user : any, idUserWaiting : string){
    this.customer = user;
    this.idUserWaiting = idUserWaiting
  }

  saveTable(table : any){
    if(this.customer.cliente !== '' && this.customer.id_cliente !== '' && this.idUserWaiting !== ''){

      Swal.fire({
        title: "¿Estás seguro de que quieres aprobar a este cliente?",
        showCancelButton: true,
        confirmButtonText: "Aprobar",
        cancelButtonText: `Cancelar`,
        heightAuto: false
      }).then((result) => {
        if (result.isConfirmed) {
          table.nombreCliente = this.customer.cliente;
          table.idCliente = this.customer.id_cliente;
          table.estado = 'ocupada';
          
          this.firestore.updateDatabase('mesas',table);
          this.firestore.removeObjectDatabase('lista_de_espera',this.idUserWaiting);
          this.emptyValues();
          this.userService.showToast(
            'Se asigno la mesa' + table.numero + ' al usuario ' + table.nombreCliente,
            'lightgreen',
            'center',
            'success',
            'black'
          );
        }
      });
    }
  }



  goBack(){
    this.emptyValues()
  }

  emptyValues(){
    this.idUserWaiting = '';
    this.customer = null;
  }


}