import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  IonContent,
  IonHeader,
  IonTitle,
  IonToolbar,
  IonButton,
  IonIcon,
  IonRange,
} from '@ionic/angular/standalone';
import { Encuesta } from 'src/app/clases/encuesta';
import { FirestoreService } from 'src/app/services/firestore.service';
import { Subscription } from 'rxjs';
import { addIcons } from 'ionicons';
import { UtilService } from 'src/app/services/util.service';
import { Router } from '@angular/router';
import { cameraOutline } from 'ionicons/icons';

@Component({
  selector: 'app-encuesta-empleados',
  templateUrl: './encuesta-empleados.page.html',
  styleUrls: ['./encuesta-empleados.page.scss'],
  standalone: true,
  imports: [
    IonRange,
    IonIcon,
    IonButton,
    IonContent,
    IonHeader,
    IonTitle,
    IonToolbar,
    CommonModule,
    FormsModule,
  ],
})
export class EncuestaEmpleadosPage implements OnInit {
  // ngOnInit() {
  //   const encuesta: Encuesta = new Encuesta({
  //     question: 'Estado de Limpieza',
  //     Excelente: 0,
  //     Bueno: 0,
  //     Regular: 0,
  //     Malo: 0,
  //   });

  //   this.fire.addEncuesta(encuesta, 'empleados');
  // }

  private util = inject(UtilService);
  private fire = inject(FirestoreService);
  private router = inject(Router);

  img: string = '';
  checkImg = 0;
  sub?: Subscription;
  res_encuestas: Encuesta[] = [];
  range?: Encuesta;
  radio?: Encuesta;
  chek?: Encuesta;
  select?: Encuesta;
  radioSelect = 'Si';
  Select_ok = 'Excelente';
  check_1 = false;
  check_2 = true;
  check_3 = false;
  range_select: number = 1;
  comentario = '';

  constructor() {
    addIcons({ cameraOutline });
  }

  ngOnInit() {
    this.get_resultados_encuesta();
  }

  get_resultados_encuesta() {
    this.util.mostrarSpinner = true;

    this.sub = this.fire
      .getCollection('encuesta_empleados')
      .valueChanges()
      .subscribe((next) => {
        this.res_encuestas = next as Encuesta[];
        this.res_encuestas.forEach((value) => {
          this.derivarTipos(value);
        });
        this.util.mostrarSpinner = false;
      });
  }

  async sacar_foto() {
    try {
      const img = (await this.util.takePicture()).dataUrl;
      if (img) {
        this.img = img;
        this.checkImg = 1;
      }
    } catch (error) {
      console.log(error);
    }
  }

  ngOnDestroy(): void {
    this.sub?.unsubscribe();
  }

  derivarTipos(encuesta: Encuesta) {
    switch (encuesta['tipo']) {
      case 'select':
        this.select = encuesta;
        break;
      case 'check':
        this.chek = encuesta;
        break;
      case 'radio':
        this.radio = encuesta;
        break;
      case 'range':
        this.range = encuesta;
        break;
    }
  }

  cambiarSelect(value: string) {
    this.Select_ok = value;
  }

  cambiarRadio(value: string) {
    this.radioSelect = value;
  }

  cambiarRange(event: any) {
    this.range_select = event.detail.value;
    console.log(this.range_select);
  }

  cambiarCheck(num: number) {
    switch (num) {
      case 1:
        this.check_1 = !this.check_1;
        break;
      case 2:
        this.check_2 = !this.check_2;
        break;
      case 3:
        this.check_3 = !this.check_3;
        break;
    }
  }

  guardar() {
    if (this.checkImg === 1) {
      this.util.mostrarSpinner = true;
      setTimeout(() => {
        if (this.chek && this.range && this.radio && this.select) {
          if (this.check_1) this.chek['Cocina']++;
          if (this.check_2) this.chek['Baños']++;
          if (this.check_3) this.chek['Mesas']++;

          this.range[this.range_select]++;
          this.select[this.Select_ok]++;
          this.radio[this.radioSelect]++;

          if (this.comentario !== '') this.fire.addComentarios(this.comentario);
          this.res_encuestas.forEach((value) => {
            this.fire.addEncuesta(value, 'empleados');
          });
        }
        this.util.mostrarSpinner = false;
        this.util.showToast('Se cargo exitosamente', 'lightgreen', 'center');
        setTimeout(() => {
          this.router.navigate(['/graficos'], {
            queryParams: { encuesta: 'empleados' },
          });
        }, 2200);
      }, 2000);
    } else {
      this.util.showToast(
        'Le falto subir la foto',
        'red',
        'center',
        'error',
        'white',
        true
      );
    }
  }
}
