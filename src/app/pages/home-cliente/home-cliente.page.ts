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
import { chatbubbleOutline, qrCodeOutline } from 'ionicons/icons';
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
  fire = inject(FirestoreService);
  userService = inject(UserService);
  mesaAsignada = this.userService.nroMesa > 0;
  sub_user?: Subscription;
  sub_pedidos?: Subscription;
  pedido?: Pedido;

  constructor(private util: UtilService) {
    addIcons({ qrCodeOutline, chatbubbleOutline });
  }
  ngOnDestroy(): void {
    this.sub_user?.unsubscribe();
    this.sub_pedidos?.unsubscribe();
  }

  ngOnInit() {
    this.sub_user = this.fire
      .getUserProfile2(this.userService.uidUser)
      .subscribe((next) => {
        const aux: Usuario = next as Usuario;
        this.cliente = aux;
        this.userService.nroMesa = aux.nroMesa;

        if (aux.lista_espera) {
          this.flagMesa = true;
        }
        if (aux.nroMesa) {
          this.msj = 'Su mesa es la número ' + aux.nroMesa;
          this.msjColor = 'primary';
          if (this.userService.nroMesa !== aux.nroMesa) {
            console.log('NG ONINIT');
            this.fire.updateUser(this.cliente);
          }
        } else {
          this.msj = 'Mesa sin asignar';
          this.msjColor = 'danger';
        }
      });
    this.get_pedidos();
  }

  get_pedidos() {
    this.sub_pedidos = this.fire
      .getCollection('pedidos')
      .valueChanges()
      .subscribe((next) => {
        const pedido = next as Pedido[];
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
      });
  }

  async scan() {
    const data = await this.util.scan();
    console.log(data);
    if (!this.userService.nroMesa) {
      this.util.msjError('QR inválido, todavía no se le asignó una mesa');
      //Acciones segun la cantidad de veces que escaneo el qr de la mesa
    } else if (data === this.userService.nroMesa.toString()) {
      //si es la primera vez que escanea la mesa lo asigno a la carta
      this.accionesDeEscanner();
    } else {
      this.util.msjError(
        'Mesa inválida, su mesa es la número ' + this.cliente?.nroMesa
      );
    }
  }

  accionesDeEscanner() {
    if (this.userService.nroMesa && this.pedido === undefined) {
      this.router.navigateByUrl('/carta');
    } else if (this.pedido && this.userService.nroMesa) {
      this.util.estadoPedido();
    } else if (this.pedido?.estado === 'en preparación') {
      //Ir a encuesta
      this.router.navigateByUrl('/sub-menu-cliente');
    }
  }

  pedirMesa() {
    this.flagMesa = true;
    this.fire.getUserProfile(this.userService.uidUser).forEach((next) => {
      this.cliente = next.data() as Usuario;
      this.cliente.lista_espera = true;
      this.fire.updateUser(this.cliente);
      this.fire.add({
        cliente: `${this.cliente.nombre} ${this.cliente.apellido ?? ''}`,
        foto_url: this.cliente.foto_url || '',
        id_cliente: this.cliente.id,
      });
    });
  }

  verEncuestas() {
    this.router.navigate(['/graficos'], {
      queryParams: { encuesta: 'clientes' },
    });
  }

  goChat() {
    this.router.navigateByUrl('chat');
  }
}
