import { Component, inject, OnInit } from '@angular/core';
import { CommonModule, Location } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonIcon, IonButtons, IonCard } from '@ionic/angular/standalone';
import { arrowBackCircleOutline } from 'ionicons/icons';
import { addIcons } from 'ionicons';
import { FirestoreService } from 'src/app/services/firestore.service';
import { UserService } from 'src/app/services/user.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-cuenta',
  templateUrl: './cuenta.page.html',
  styleUrls: ['./cuenta.page.scss'],
  standalone: true,
  imports: [IonCard, IonButtons, IonIcon, IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule]
})
export class CuentaPage implements OnInit {

  location = inject(Location);
  userService = inject(UserService);
  pedido: any = {};
  idCliente : any = this.userService.uidUser;

  constructor(private firestore : FirestoreService) { 
    addIcons({ arrowBackCircleOutline });



  }

  async ngOnInit() {
    await this.firestore.getPedidoEspecifico(this.idCliente, 'recibido').subscribe(
      (pedido: any) => {
        this.pedido = pedido[0];
        console.log('Pedido encontrado:', this.pedido); 
      }
    );
    console.log('idCliente:', this.idCliente); 
  }
  

  goBack(): void {
    this.location.back();
  }

  pay(pedido : any)
  {
    let modOrder : any = pedido;
    console.log(modOrder);
    Swal.fire({
      title: "¿Estás seguro de que quieres pagar?",
      showCancelButton: true,
      confirmButtonText: "Pagar",
      cancelButtonText: `Cancelar`,
      heightAuto: false
    }).then((result) => {
      if (result.isConfirmed) {
        modOrder.estado = 'pagado';     
        console.log(modOrder.estado);   
      this.firestore.updateOrderAndProducts(modOrder, 'pagado', 'pagado');
        Swal.fire({
          title: "¡Pedido pagado!",
          confirmButtonText: "Continuar",
          heightAuto: false
        })
      }
    });

  }
}
