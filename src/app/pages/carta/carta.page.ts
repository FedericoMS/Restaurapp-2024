import { Component, OnInit } from '@angular/core';
import { CommonModule, Location } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonSegmentButton, IonList, IonCard, IonCardHeader, IonCardTitle, IonCardContent, IonRow, IonCol, IonButton } from '@ionic/angular/standalone';
import { FirestoreService } from 'src/app/services/firestore.service';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { UserService } from 'src/app/services/user.service';
import { Route, Router } from '@angular/router';
import { arrowBackCircleOutline } from 'ionicons/icons';
import { addIcons } from 'ionicons';


@Component({
  selector: 'app-carta',
  templateUrl: './carta.page.html',
  styleUrls: ['./carta.page.scss'],
  standalone: true,
  schemas : [CUSTOM_ELEMENTS_SCHEMA] ,
  imports: [IonButton, IonCol, IonRow, IonCardContent, IonCardTitle, IonCardHeader, IonCard, IonList, IonSegmentButton, IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule]
})
export class CartaPage implements OnInit {

  productos: any[] = [];
  productosFiltrados: any[] = [];
  carrito: any[] = []; 
  filtroActual: string = 'todo';
  total: number = 0;
  nroMesa: number = 0; 
  idCliente : any = this.userService.uidUser;
  tiempoElaboracion : number = 0;

  constructor(private firestoreService: FirestoreService, public userService : UserService, private router : Router, private location : Location) {
    addIcons({arrowBackCircleOutline});
  }

  async ngOnInit() {
    this.cargarProductos();
    //this.idCliente = this.userService.getProperty('id');
    this.nroMesa = await this.userService.getProperty('nroMesa');
    console.log(this.nroMesa);
    console.log(this.idCliente);
  }

  cargarProductos() {
    this.firestoreService.getCollection('productos').valueChanges().subscribe((data: any) => {
      this.productos = data;
      this.filtrarProductos();
    });
  }

  filtrarProductos() {
    if (this.filtroActual === 'todo') {
      this.productosFiltrados = this.productos;
    } else {
      this.productosFiltrados = this.productos.filter(producto => producto.tipo === this.filtroActual);
    }
  }


  agregarProducto(producto: any) {
    this.carrito.push({ nombre: producto.nombre, tiempoPreparacion: producto.tiempoPreparacion, estado: 'pendiente', precio: producto.precio, tipo: producto.tipo });
    this.total += producto.precio;
    this.tiempoElaboracion = Math.max(this.tiempoElaboracion, producto.tiempoPreparacion);
  }

  quitarProducto(producto: any) {
    const index = this.carrito.findIndex(item => item.nombre === producto.nombre);
    if (index > -1) {
      this.carrito.splice(index, 1);
      this.total -= producto.precio;
      this.tiempoElaboracion = this.carrito.length > 0 
        ? Math.max(...this.carrito.map(item => item.tiempoPreparacion))
        : 0;  // Si el carrito está vacío, el tiempo de elaboración es 0
    }
  }

  async realizarPedido() {
    if (this.carrito.length === 0) {
      this.userService.showToast('El carrito está vacío', 'red', 'center', 'error', 'white', true);
      console.log("El carrito está vacío");
      return;
    }
    
    const pedido = {
      estado: 'pendiente de confirmación',
      idCliente: this.idCliente, // Puedes reemplazar esto con el ID real del cliente
      //idCliente: 'ID DEL CLIENTE',
      listaProductos: this.carrito,
      monto: this.total,
      nroMesa: this.nroMesa, //El número de mesa a tomar es el del cliente que está haciendo el pedido
      tiempoPreparacion: this.carrito.reduce((acc, item) => Math.max(acc, item.tiempoPreparacion), 0)
    };
    
    try {
      await this.firestoreService.addObject(pedido, 'pedidos');
      console.log("Pedido realizado exitosamente");
      this.carrito = []; // Limpiar carrito
      this.total = 0; // Reiniciar total
      this.tiempoElaboracion = 0;
      this.userService.showToast('Pedido realizado exitosamente', 'lightgreen', 'center', 'success', 'black', true);
      this.router.navigateByUrl('/home-cliente-anonimo');
    } catch (error) {
      console.error("Error al realizar el pedido:", error);
    }
  }
  
  swiperSlideChanged(e : any)
  {
    console.log('changed', e);
  }

  cambiarTipo(tipo : string)
  {
    this.filtroActual = tipo;
    this.filtrarProductos();
  }

  goBack() : void{
    this.location.back();
  }

}


