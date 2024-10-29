import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonButton, IonIcon } from '@ionic/angular/standalone';
import { FirestoreService } from 'src/app/services/firestore.service';
import { UtilService } from 'src/app/services/util.service';
import { Empleado } from 'src/app/clases/empleado';
import { Alert } from 'src/app/clases/alert';
import { addIcons } from 'ionicons';
import { cameraOutline, qrCodeOutline} from 'ionicons/icons'
import { cuilValidator } from 'src/app/validators/cuilValidator';
@Component({
  selector: 'app-alta-duenio-supervisor',
  templateUrl: './alta-duenio-supervisor.page.html',
  styleUrls: ['./alta-duenio-supervisor.page.scss'],
  standalone: true,
  imports: [IonIcon, IonButton, IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule, FormsModule, ReactiveFormsModule]
})
export class AltaDuenioSupervisorPage implements OnInit {
  fg!: FormGroup;
  list_roles = Empleado.get_roles();
  foto_url: string = '';
  img?: string = '';


  constructor(private firestore : FirestoreService, private utilService : UtilService, private fb : FormBuilder){
    addIcons({qrCodeOutline,cameraOutline})
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
      cuil: [
        '',
        [
          Validators.required,
          cuilValidator()
        ],
      ],

      rol: [this.list_roles[4]],
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
      await this.upload_storage();

      this.firestore
        .addUsuario(
          new Empleado(
            this.fg.controls['nombre'].value,
            this.fg.controls['apellido'].value,
            this.fg.controls['dni'].value,
            this.fg.controls['cuil'].value,
            this.foto_url,
            this.fg.controls['rol'].value
          )
        )
        .then(() => {
          Alert.success('Se cargo exitosamente el empleado', '');
          this.fg.reset();
        })
        .catch(() => {
          Alert.error(
            'Hubo un problema al cargar el empleado',
            'Vuelva a intentar más tarde'
          );
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
        `imagenes_empelados/${Date.now()}`,
        this.img
      );
    }
  }
  allowOnlyNumbers(event: KeyboardEvent) {
    const charCode = event.charCode;
    // Evita que se ingresen caracteres que no sean números
    if (charCode < 48 || charCode > 57) {
      event.preventDefault();
    }
  }
  
  // También puedes agregar validación en la función formatCuil
  formatCuil() {
    let rawValue = this.fg.get('cuil')?.value.replace(/-/g, '');
    
    // Validar que solo contenga números
    if (!/^\d*$/.test(rawValue)) {
      rawValue = rawValue.replace(/\D/g, ''); // Elimina cualquier carácter no numérico
    }
  
    if (rawValue.length > 2) {
      rawValue = rawValue.slice(0, 2) + '-' + rawValue.slice(2);
    }
    if (rawValue.length > 11) {
      rawValue = rawValue.slice(0, 11) + '-' + rawValue.slice(11);
    }
  
    this.fg.get('cuil')?.setValue(rawValue, { emitEvent: false });
  }
}
