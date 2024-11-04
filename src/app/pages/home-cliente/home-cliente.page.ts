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
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { qrCodeOutline } from 'ionicons/icons';
import { UtilService } from 'src/app/services/util.service';
import { Router } from '@angular/router';
import { UserService } from 'src/app/services/user.service';
import { FirestoreService } from 'src/app/services/firestore.service';
import { Usuario } from 'src/app/clases/usuario';
@Component({
  selector: 'app-home-cliente',
  templateUrl: './home-cliente.page.html',
  styleUrls: ['./home-cliente.page.scss'],
  standalone: true,
  imports: [
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
  fire = inject(FirestoreService);
  user = inject(UserService);

  constructor(private util: UtilService) {
    addIcons({ qrCodeOutline });
  }

  ngOnInit() {
    //Dependiendo el cambio
    this.msj = 'Su mesa es la numero 1';
    this.msjColor = 'primary';
  }

  async scan() {
    const data = await this.util.scan();
    console.log(data);
    if (data === '1') {
      this.util.msjError('QR inválido, todavia no se le asigno una mesa');
    } else if (data === '2') {
      this.util.msjError('Mesa inválida, su mesa es la');
    } else {
      // this.router.navigateByUrl('algun lugar');
    }
  }

  pedirMesa() {
    this.flagMesa = true;
    this.fire.getUserProfile(this.user.uidUser).forEach((next) => {
      const cliente = next.data() as Usuario;
      console.log(cliente);
      this.fire.add({
        cliente: cliente.nombre,
        foto_url: cliente.foto_url || '',
        id_cliente: cliente.id,
      });
    });
  }

  verEncuestas() {
    this.router.navigate(['/graficos'], {
      queryParams: { encuesta: 'clientes' },
    });
  }
}
