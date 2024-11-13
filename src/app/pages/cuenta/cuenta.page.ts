import { Component, inject, OnInit } from '@angular/core';
import { CommonModule, Location } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  IonContent,
  IonHeader,
  IonTitle,
  IonToolbar,
  IonIcon,
  IonButtons,
  IonCard,
} from '@ionic/angular/standalone';
import { arrowBackCircleOutline } from 'ionicons/icons';
import { addIcons } from 'ionicons';
import { FirestoreService } from 'src/app/services/firestore.service';
import { UserService } from 'src/app/services/user.service';
import Swal from 'sweetalert2';
import { UtilService } from 'src/app/services/util.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-cuenta',
  templateUrl: './cuenta.page.html',
  styleUrls: ['./cuenta.page.scss'],
  standalone: true,
  imports: [
    IonCard,
    IonButtons,
    IonIcon,
    IonContent,
    IonHeader,
    IonTitle,
    IonToolbar,
    CommonModule,
    FormsModule,
  ],
})
export class CuentaPage implements OnInit {
  location = inject(Location);
  userService = inject(UserService);
  pedido: any = {};
  idCliente: any = this.userService.uidUser;
  util = inject(UtilService);
  montoFinal: number = 0;
  tipFlag: boolean = false;
  tip: string = '0%';
  router = inject(Router);

  constructor(private firestore: FirestoreService) {
    addIcons({ arrowBackCircleOutline });
  }

  async ngOnInit() {
    //REVISAR SI ES ÓPTIMO ESTE FUNCIONAMIENTO
    await this.firestore
      .getPedidoEspecifico(this.idCliente, 'recibido')
      .subscribe((pedido: any) => {
        this.pedido = pedido[0];
        this.montoFinal = this.pedido.monto;
        console.log('Pedido encontrado:', this.pedido);
        console.log('El monto final es: ' + this.montoFinal);
      });
    console.log('idCliente:', this.idCliente);
  }

  goBack(): void {
    this.location.back();
  }

  pay(pedido: any) {
    let modOrder: any = pedido;
    console.log(modOrder);
    Swal.fire({
      title: '¿Estás seguro de que quieres pagar?',
      showCancelButton: true,
      confirmButtonText: 'Pagar',
      cancelButtonText: `Cancelar`,
      heightAuto: false,
    }).then((result) => {
      if (result.isConfirmed) {
        modOrder.estado = 'pagado';
        modOrder.monto = this.montoFinal;
        console.log(modOrder.estado);
        this.firestore.updateOrderAndProducts(modOrder, 'pagado', 'pagado');
        Swal.fire({
          title: '¡Pedido pagado!',
          confirmButtonText: 'Continuar',
          heightAuto: false,
        }).then((res) => {
          if (res.isConfirmed) {
            this.router.navigateByUrl('/ingreso-local', {
              replaceUrl: true,
            });
          }
        });
      }
    });
  }

  async scanTip() {
    const data = await this.util.scan();
    switch (data) {
      case '5':
        this.montoFinal = Math.round(this.montoFinal * 1.05);
        this.tip = '5%';
        this.tipFlag = true;
        break;
      case '10':
        this.montoFinal = Math.round(this.montoFinal * 1.1);
        this.tip = '10%';
        this.tipFlag = true;
        break;
      case '15':
        this.montoFinal = Math.round(this.montoFinal * 1.15);
        this.tip = '15%';
        this.tipFlag = true;
        break;
      case '20':
        this.montoFinal = Math.round(this.montoFinal * 1.2);
        this.tip = '20%';
        this.tipFlag = true;
        break;
      default:
        this.tip = '0%';
        this.tipFlag = true;
        break;
    }
  }
}
