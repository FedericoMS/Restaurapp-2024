import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonButton, IonIcon } from '@ionic/angular/standalone';
import { FirestoreService } from 'src/app/services/firestore.service';
import { UtilService } from 'src/app/services/util.service';
import { EstadoAprobacion, Usuario } from 'src/app/clases/usuario';
import { addIcons } from 'ionicons';
import { cameraOutline, checkmark, closeOutline, qrCodeOutline} from 'ionicons/icons'
import { cuilValidator } from 'src/app/validators/cuilValidator';
import { SpinnerComponent } from 'src/app/components/spinner/spinner.component';
import { UserService } from 'src/app/services/user.service';
@Component({
  selector: 'app-alta-duenio-supervisor',
  templateUrl: './alta-duenio-supervisor.page.html',
  styleUrls: ['./alta-duenio-supervisor.page.scss'],
  standalone: true,
  imports: [SpinnerComponent,IonIcon, IonButton, IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule, ReactiveFormsModule]
})
export class AltaDuenioSupervisorPage implements OnInit {
  fg!: FormGroup;
  list_roles = Usuario.get_roles();
  foto_url: string = '';
  img?: string = '';
  isLoading: boolean;


  constructor(private userService : UserService,private firestore : FirestoreService, private utilService : UtilService, private fb : FormBuilder){
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
      this.userService.showToast('Ocurrió un error. ' + 'Vuelva a intentar más tarde', 'red', 'center', 'error', 'white', true);

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
            this.fg.controls['rol'].value,
            EstadoAprobacion.Aprobado
          )
        )
        .then(() => {
          this.userService.showToast('Se cargo exitosamente el ' + this.fg.controls['rol'].value, 'lightgreen', 'center', 'success', 'black');
          this.fg.reset();
          this.isLoading = false;
        })
        .catch(() => {
          this.userService.showToast('Hubo un problema al cargar el ' + this.fg.controls['rol'].value, 'red', 'center', 'error', 'white', true);
          this.isLoading = false;
        });
    } else {
      this.userService.showToast('Ocurrió un error. ' +'Verifique que todos los campos estén completos sin errores!', 'red', 'center', 'error', 'white', true);
      Object.keys(this.fg.controls).forEach((controlName) => {
        this.fg.controls[controlName].markAsTouched();
      });
    }
  }

  async sacar_foto() {
    try {
      this.img = await this.utilService.sacar_foto();
      this.userService.showToast('Se cargo la foto', 'lightgreen', 'center', 'success', 'black'); 
    } catch (error) {
      console.log(error);
    }
  }

  async upload_storage() {
    if (this.img) {
      this.foto_url = await this.firestore.uploadImage(
        `imagenes_dueños_supervisores/${Date.now()}`,
        this.img
      );
    }
  }
  allowOnlyNumbers(event: KeyboardEvent) {
    const charCode = event.charCode;
    if (charCode < 48 || charCode > 57) {
      event.preventDefault();
    }
  }
  
  formatCuil() {
    let rawValue = this.fg.get('cuil')?.value.replace(/-/g, '');
    
    if (!/^\d*$/.test(rawValue)) {
      rawValue = rawValue.replace(/\D/g, '');
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
