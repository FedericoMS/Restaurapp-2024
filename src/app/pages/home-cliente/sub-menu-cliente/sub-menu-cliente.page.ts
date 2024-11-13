import { Component, inject, OnInit } from '@angular/core';
import { CommonModule, Location } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  IonContent,
  IonHeader,
  IonTitle,
  IonToolbar,
  IonFabList,
  IonFab,
  IonFabButton,
  IonButtons,
  IonIcon,
} from '@ionic/angular/standalone';
import { Router } from '@angular/router';
import { UtilService } from 'src/app/services/util.service';
import { PushService } from 'src/app/services/push.service';
import { FirestoreService } from 'src/app/services/firestore.service';
import { Subscription } from 'rxjs';
import { Pedido } from 'src/app/clases/pedido';
import { Alert } from 'src/app/clases/alert';
import { UserService } from 'src/app/services/user.service';
import { addIcons } from 'ionicons';
import { sendOutline, arrowBackCircleOutline } from 'ionicons/icons';
@Component({
  selector: 'app-sub-menu-cliente',
  templateUrl: './sub-menu-cliente.page.html',
  styleUrls: ['./sub-menu-cliente.page.scss'],
  standalone: true,
  imports: [
    IonIcon,
    IonButtons,
    IonFabButton,
    IonFab,
    IonFabList,
    IonContent,
    IonHeader,
    IonTitle,
    IonToolbar,
    CommonModule,
    FormsModule,
  ],
})
export class SubMenuClientePage implements OnInit {
  router = inject(Router);
  util = inject(UtilService);
  push = inject(PushService);
  fire = inject(FirestoreService);
  userService = inject(UserService);
  disable_encuesta = false;
  sub?: Subscription;
  texto = 'PEDIR LA CUENTA';
  estado_cuenta = 0;
  mostrarCuenta = false;

  constructor(private location: Location) {
    addIcons({ arrowBackCircleOutline, sendOutline });
    this.router.routerState.root.queryParams.forEach((item) => {
      this.mostrarCuenta = item['cuenta'] ? true : false;
    });
  }

  ngOnInit() {
    this.sub = this.fire
      .getCollection('pedidos')
      .doc(this.util.pedido?.id)
      .valueChanges()
      .subscribe((next) => {
        const pedido = next as Pedido;
        console.log(pedido);
        if (pedido.estado_cuenta) {
          this.texto = 'PAGAR LA CUENTA';
          this.estado_cuenta = 2;
        }
      });
  }

  ngOnDestroy(): void {
    this.sub?.unsubscribe();
  }

  realizarEncuesta() {
    if (this.disable_encuesta) {
      this.util.msjError(
        'Ya realizo la encuesta!, no puede realizar otra vez la encuesta'
      );
    } else {
      this.router.navigateByUrl('/encuesta-clientes', { replaceUrl: true });
      this.disable_encuesta = true;
    }
  }

  verEstadoPedido() {
    this.util.estadoPedido();
  }

  pedirCuenta() {
    switch (this.estado_cuenta) {
      case 0: //No pidio la cuenta
        this.push.send_push_notification(
          'Solicitud de cuenta',
          'Un cliente le ha solicitado la cuenta',
          'mozo'
        );
        this.texto = 'ESPERANDO CONFIRMACIÓN';
        if (this.util.pedido) {
          this.util.pedido.estado = 'cuenta pedida';
          this.fire.updateOrder(this.util.pedido);
        }
        this.estado_cuenta = 1;
        break;

      case 1: //Ya pidio la cuenta
        this.util.msjError('Todavia no enviaron su cuenta');
        break;

      case 2: //cuenta a pagar
        this.router.navigateByUrl('/cuenta', { replaceUrl: true });
        break;
    }
  }

  goBack(): void {
    this.location.back();
  }
}
