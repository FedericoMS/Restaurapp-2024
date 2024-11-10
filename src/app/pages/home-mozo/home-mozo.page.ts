import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonFabButton, IonFab, IonFabList, IonCard, IonCardHeader, IonCardSubtitle, IonCardTitle, IonButton, IonIcon } from '@ionic/angular/standalone';
import { SpinnerComponent } from 'src/app/components/spinner/spinner.component';
import { UserService } from 'src/app/services/user.service';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { FirestoreService } from 'src/app/services/firestore.service';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';
import { addIcons } from 'ionicons';
import { chatbubbleOutline } from 'ionicons/icons';

@Component({
  selector: 'app-home-mozo',
  templateUrl: './home-mozo.page.html',
  styleUrls: ['./home-mozo.page.scss'],
  standalone: true,
  imports: [IonIcon, IonButton, IonCard, IonFabList, IonFab, IonFabButton, IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule, SpinnerComponent]
})
export class HomeMozoPage implements OnInit {

  isLoading : boolean = false;
  listaPedidos : any;
  userAuth: any = this.angularFireAuth.authState;
  

  constructor(public userService: UserService, private angularFireAuth: AngularFireAuth, private firestoreService: FirestoreService, private router : Router) {
    addIcons({ chatbubbleOutline });
    setTimeout(() => {
      this.isLoading = true;      
    }, 1800);
    // this.userAuth = this.angularFireAuth.authState.subscribe(async (user) => {
    //   this.userAuth = user;
    //   console.log(user);
    // });
    this.firestoreService.getPedidos().subscribe((pedidos: any) => {
      this.listaPedidos = pedidos;
    });
  }

  ngOnInit() {
    setTimeout(() => {
      this.isLoading = false;      
    }, 2500);
  }


  approveOrder(pedido : any)
  {
    let modOrder : any = pedido;
    console.log(modOrder);
    Swal.fire({
      title: "¿Estás seguro de que quieres aprobar este pedido?",
      showCancelButton: true,
      confirmButtonText: "Aprobar",
      cancelButtonText: `Cancelar`,
      heightAuto: false
    }).then((result) => {
      if (result.isConfirmed) {
        modOrder.estado = 'en preparación';     
        console.log(modOrder.estado);   
        this.firestoreService.updateOrderAndProducts(modOrder, 'en preparación', 'en preparación');
        Swal.fire({
          title: "¡Pedido en preparación!",
          confirmButtonText: "Continuar",
          heightAuto: false
        })
      }
    });
  }

  rejectOrder(pedido : any)
  {
    let modOrder : any = pedido;
    console.log(modOrder);
    Swal.fire({
      title: "¿Estás seguro de que quieres rechazar este pedido?",
      showCancelButton: true,
      confirmButtonText: "Rechazar",
      cancelButtonText: `Cancelar`,
      heightAuto: false
    }).then((result) => {
      if (result.isConfirmed) {
        modOrder.estado = 'rechazado';     
        console.log(modOrder.estado);   
      this.firestoreService.updateOrderAndProducts(modOrder, 'rechazado', 'rechazado');
        Swal.fire({
          title: "Pedido rechazado",
          confirmButtonText: "Continuar",
          heightAuto: false
        })
      }
    });
  }

  deliverOrder(pedido : any)
  {
    let modOrder : any = pedido;
    console.log(modOrder);
    Swal.fire({
      title: "¿Estás seguro de que quieres entregar este pedido?",
      showCancelButton: true,
      confirmButtonText: "Sí",
      cancelButtonText: `Cancelar`,
      heightAuto: false
    }).then((result) => {
      if (result.isConfirmed) {
        modOrder.estado = 'en entrega';     
        console.log(modOrder.estado);   
        this.firestoreService.updateOrder(modOrder)
        Swal.fire({
          title: "Pedido en entrega",
          confirmButtonText: "Continuar",
          heightAuto: false
        })
      }
    });
  }

  confirmPayment(pedido : any)
  {
    let modOrder : any = pedido;
    console.log(modOrder);
    Swal.fire({
      title: "¿Estás seguro de que quieres confirmar el pago de este pedido?",
      showCancelButton: true,
      confirmButtonText: "Sí",
      cancelButtonText: `Cancelar`,
      heightAuto: false
    }).then((result) => {
      if (result.isConfirmed) {
        modOrder.estado = 'finalizado';     
        console.log(modOrder.estado);   
        this.firestoreService.updateOrder(modOrder);
        //AGREGAR FUNCIÓN QUE LIBERE LA MESA ACTUAL
    //    this.firestoreService.updateDatabase('mesas', )
        Swal.fire({
          title: "Pedido finalizado",
          confirmButtonText: "Continuar",
          heightAuto: false
        })
      }
    });
  }

  goChat(){
    this.router.navigateByUrl('chat');
  }
  
  tienePedidosPendientes(): boolean {
    return this.listaPedidos && this.listaPedidos.some((pedido: any) => pedido.estado === 'pendiente de confirmación');
  }
  

}
