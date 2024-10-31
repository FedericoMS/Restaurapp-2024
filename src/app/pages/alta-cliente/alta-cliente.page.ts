import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonButton, IonIcon, IonSegmentButton, IonLabel, IonSegment } from '@ionic/angular/standalone';
import { Usuario } from 'src/app/clases/usuario';
import { FirestoreService } from 'src/app/services/firestore.service';
import { UtilService } from 'src/app/services/util.service';
import { addIcons } from 'ionicons';
import { cameraOutline, checkmark, closeOutline, qrCodeOutline} from 'ionicons/icons'
import { cuilValidator } from 'src/app/validators/cuilValidator';
import { SpinnerComponent } from 'src/app/components/spinner/spinner.component';
import { Alert } from 'src/app/clases/alert';

@Component({
  selector: 'app-alta-cliente',
  templateUrl: './alta-cliente.page.html',
  styleUrls: ['./alta-cliente.page.scss'],
  standalone: true,
  imports: [IonSegment, IonLabel, IonSegmentButton, IonIcon, IonButton, IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule, ReactiveFormsModule,SpinnerComponent]
})
export class AltaClientePage implements OnInit {
  fg!: FormGroup;
  list_roles = Usuario.get_roles();
  foto_url: string = '';
  img?: string = '';
  isLoading: boolean;


  constructor(private firestore : FirestoreService, private utilService : UtilService, private fb : FormBuilder){
    addIcons({qrCodeOutline,cameraOutline,closeOutline,checkmark})
    this.isLoading = false;
    this.fg = this.fb.group({
      nombre: ['', [Validators.required]],
      apellido: ['', [Validators.required]],
      dni: [
        '',
        [
          Validators.required,
          Validators.min(1000000),
          Validators.max(99999999),
        ],
      ],
      rol: [this.list_roles[6]],
      contrasenia: ['', [Validators.required]],
      correo: ['', [Validators.required, Validators.email]],
    });
  }




  ngOnInit() {}
  async cargarConQr() {
    const datos = await this.utilService.scan_dni();
    if (datos) {
      this.fg.controls['nombre'].setValue(datos.nombre);
      this.fg.controls['apellido'].setValue(datos.apellido);
      this.fg.controls['dni'].setValue(datos.dni);
    } else {
      Alert.error('Ocurrió un error', 'Vuelva a intentar más tarde');
    }
  }

  async cargar() {
    if (this.fg.valid) {
      this.isLoading = true;
      await this.upload_storage();

      this.firestore
        .addUsuario(
          new Usuario(
            this.fg.controls['nombre'].value,
            this.fg.controls['apellido'].value,
            this.fg.controls['dni'].value,
            this.fg.controls['cuil'].value,
            this.foto_url,
            this.fg.controls['rol'].value
          )
        )
        .then(() => {
          Alert.success('Se cargo exitosamente el cliente', '');
          this.fg.reset();
          this.isLoading = false;
        })
        .catch(() => {
          Alert.error(
            'Hubo un problema al cargar el cliente',
            'Vuelva a intentar más tarde'
          );
          this.isLoading = false;
        });
    } else {
      Alert.error(
        'Ocurrió un error',
        'Verifique que todos los campos estén completos sin errores!'
      );
      Object.keys(this.fg.controls).forEach((controlName) => {
        this.fg.controls[controlName].markAsTouched();
      });
    }
  }

  async sacar_foto() {
    try {
      this.img = await this.utilService.sacar_foto();
    } catch (error) {
      console.log(error);
    }
  }

  async upload_storage() {
    if (this.img) {
      this.foto_url = await this.firestore.uploadImage(
        `imagenes_clientes/${Date.now()}`,
        this.img
      );
    }
  }
  emptyInputs() {
    this.fg.reset({
      rol: this.fg.get('rol')?.value,
      nombre: '',
      apellido: '',
      correo: '',
      contrasenia: '',
      dni: '',
    });
    
    Object.keys(this.fg.controls).forEach((key) => {
      const control = this.fg.get(key);
      control?.markAsPristine();
      control?.markAsUntouched();
      control?.updateValueAndValidity();
    });
  
    this.img = '';
  }

}
