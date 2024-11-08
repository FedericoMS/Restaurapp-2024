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
  flagMesa = false;
  msj = 'Mesa sin asignar';
  msjColor = 'danger';
  cliente?: Usuario;
  mesa?: Mesa;
  fire = inject(FirestoreService);
  userService = inject(UserService);
  mesaAsignada = this.userService.nroMesa > 0;
  cantidad_de_veces_que_escaneo = 0;
  sub_mesas?: Subscription;
  sub_pedidos?: Subscription;
  pedido?: Pedido;

  constructor(private util: UtilService) {
    addIcons({ qrCodeOutline });
  }
  ngOnDestroy(): void {
    this.sub_mesas?.unsubscribe();
    this.sub_pedidos?.unsubscribe();
  }

  ngOnInit() {
    this.util.showSpinner();
    //Dependiendo el cambio capturo la mesa asignada
    this.get_mesas();
    this.get_pedidos();
  }

  get_mesas() {
    this.sub_mesas = this.fire
      .getCollection('mesas')
      .valueChanges()
      .subscribe((next) => {
        const mesa = next as Mesa[];
        if (!this.userService.nroMesa) {
          mesa.forEach((item) => {
            if (this.cliente?.id && item.idCliente === this.cliente?.id) {
              this.mesa = item;
              this.mesaAsignada = true;
              this.flagMesa = true;
              this.msj = 'Su mesa es la numero ' + item.numero;
              this.msjColor = 'primary';
            }
          });
        }
        this.util.hideSpinner();
      });
  }

  get_pedidos() {
    this.sub_mesas = this.fire
      .getCollection('pedidos')
      .valueChanges()
      .subscribe((next) => {
        const mesa = next as Pedido[];
        if (!this.userService.nroMesa) {
          mesa.forEach((item) => {
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
      this.accionesDeEscanner();
    } else if (data === this.userService.nroMesa.toString()) {
      //si es la primera vez que escanea la mesa lo asigno a la carta
      this.cantidad_de_veces_que_escaneo++;
    } else {
      this.util.msjError(
        'Mesa inválida, su mesa es la numero ' + this.mesa?.numero
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
    this.flagMesa = true;
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
