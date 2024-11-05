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
  mesaAsignada = false;

  constructor(private util: UtilService) {
    addIcons({ qrCodeOutline });
  }

  ngOnInit() {
    this.util.showSpinner();
    //Dependiendo el cambio
    this.fire
      .getCollection('mesas')
      .valueChanges()
      .subscribe((next) => {
        const mesa = next as Mesa[];
        mesa.forEach((item) => {
          if (this.cliente?.id && item.idCliente === this.cliente?.id) {
            this.mesa = item;
            this.mesaAsignada = true;
            this.flagMesa = true;
            console.log(this.mesa);
            this.msj = 'Su mesa es la numero ' + item.numero;
            this.msjColor = 'primary';
          }
        });
        this.util.hideSpinner();
      });
  }

  async scan() {
    const data = await this.util.scan();
    console.log(data);
    if (!this.mesaAsignada) {
      this.util.msjError('QR inválido, todavia no se le asigno una mesa');
    } else if (data === this.mesa?.numero.toString()) {
      // this.router.navigateByUrl('algun lugar');
      console.log('se rutea a pedidos');
    } else {
      this.util.msjError(
        'Mesa inválida, su mesa es la numero ' + this.mesa?.numero
      );
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
