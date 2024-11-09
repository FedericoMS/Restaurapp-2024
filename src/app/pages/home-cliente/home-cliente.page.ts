import { Component, Inject, inject, OnInit } from '@angular/core';
import { CommonModule, UpperCasePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  IonContent,
  IonHeader,
  IonTitle,
  IonToolbar,
  IonTabButton,
  IonButton,
  IonIcon,
  IonText,
  IonFab,
  IonFabButton,
  IonFabList,
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { qrCodeOutline } from 'ionicons/icons';
import { UtilService } from 'src/app/services/util.service';
import { Router } from '@angular/router';
import { UserService } from 'src/app/services/user.service';
import { FirestoreService } from 'src/app/services/firestore.service';
import { Usuario } from 'src/app/clases/usuario';
import { Mesa } from 'src/app/clases/mesa';
import { Subscription } from 'rxjs';
import { Pedido } from 'src/app/clases/pedido';
import { Alert } from 'src/app/clases/alert';
@Component({
  selector: 'app-home-cliente',
  templateUrl: './home-cliente.page.html',
  styleUrls: ['./home-cliente.page.scss'],
  standalone: true,
  imports: [
    IonFabList,
    IonFabButton,
    IonFab,
    IonText,
    IonIcon,
    IonButton,
    IonTabButton,
    IonContent,
    IonHeader,
    IonTitle,
    IonToolbar,
    CommonModule,
    FormsModule,
    UpperCasePipe,
  ],
})
export class HomeClientePage implements OnInit {
  router = inject(Router);
  msj = 'Mesa sin asignar';
  msjColor = 'danger';
  cliente?: Usuario;
  // mesa?: Mesa;
  fire = inject(FirestoreService);
  userService = inject(UserService);
  cantidad_de_veces_que_escaneo = 0;
  sub_mesas?: Subscription;
  sub_pedidos?: Subscription;
  pedido?: Pedido;
  mostrarPedirMesa = false;

  constructor(private util: UtilService) {
    addIcons({ qrCodeOutline });
    this.mostrarPedirMesa = this.userService.nroMesa > 0;
    this.router.routerState.root.queryParams.forEach((item) => {
      this.mostrarPedirMesa = item['espera'] || false;
      console.log(this.mostrarPedirMesa);
    });
  }
  ngOnDestroy(): void {
    this.sub_mesas?.unsubscribe();
    this.sub_pedidos?.unsubscribe();
  }

  ngOnInit() {
    this.sub_mesas = this.fire
      .getCollection('mesas')
      .valueChanges()
      .subscribe((next) => {
        const mesa = next as Mesa[];
        mesa.forEach((item) => {
          if (item.idCliente === this.userService.uidUser) {
            this.userService.nroMesa = item.numero;
          }
        });

        const num = this.userService.nroMesa;
        this.msj = num ? `Su mesa es la numero ${num}` : 'Mesa sin asignar';
        this.msjColor = num ? 'primary' : 'danger';
      });

    this.get_pedidos();
  }

  get_pedidos() {
    this.sub_pedidos = this.fire
      .getCollection('pedidos')
      .valueChanges()
      .subscribe((next) => {
        const pedido = next as Pedido[];
        if (!this.userService.nroMesa) {
          pedido.forEach((item) => {
            if (
              this.cliente?.id &&
              item.idCliente === this.cliente?.id &&
              item.estado !== 'finalizado'
            ) {
              this.pedido = item;
              this.util.pedido = this.pedido;
            }
          });
        }
      });
  }

  async scan() {
    const data = await this.util.scan();
    console.log(data);
    if (!this.userService.nroMesa) {
      this.util.msjError('QR inválido, todavia no se le asigno una mesa');
      //Acciones segun la cantidad de veces que escaneo el qr de la mesa
    } else if (data === this.userService.nroMesa.toString()) {
      //si es la primera vez que escanea la mesa lo asigno a la carta
      this.accionesDeEscanner();
      this.cantidad_de_veces_que_escaneo++;
    } else {
      this.util.msjError(
        'Mesa inválida, su mesa es la numero ' + this.userService.nroMesa
      );
    }
  }

  accionesDeEscanner() {
    switch (this.cantidad_de_veces_que_escaneo) {
      case 0:
        this.router.navigateByUrl('/carta');
        break;
      case 1:
        //Estado del pedido
        if (!this.util.estadoPedido()) this.cantidad_de_veces_que_escaneo = 0;
        break;
      default:
        //Ir a encuesta
        this.router.navigateByUrl('/sub-menu-cliente');
        break;
    }
  }

  pedirMesa() {
    this.mostrarPedirMesa = false;
    this.fire.getUserProfile(this.userService.uidUser).forEach((next) => {
      this.cliente = next.data() as Usuario;
      this.fire.add({
        cliente: this.cliente.nombre,
        foto_url: this.cliente.foto_url || '',
        id_cliente: this.cliente.id,
        apellido: this.cliente.apellido,
      });
    });
  }

  verEncuestas() {
    this.router.navigate(['/graficos'], {
      queryParams: { encuesta: 'clientes' },
    });
  }
}
