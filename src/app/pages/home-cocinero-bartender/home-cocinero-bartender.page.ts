import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonCard, IonFab, IonFabButton, IonFabList } from '@ionic/angular/standalone';
import { UserService } from 'src/app/services/user.service';
import { FirestoreService } from 'src/app/services/firestore.service';
import Swal from 'sweetalert2';
import { SpinnerComponent } from 'src/app/components/spinner/spinner.component';
import { PushService } from 'src/app/services/push.service';

@Component({
  selector: 'app-home-cocinero-bartender',
  templateUrl: './home-cocinero-bartender.page.html',
  styleUrls: ['./home-cocinero-bartender.page.scss'],
  standalone: true,
  imports: [IonFabList, IonFabButton, IonFab, IonCard, IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule, SpinnerComponent]
})
export class HomeCocineroBartenderPage implements OnInit {

  userRol: any = '';
  isLoading: boolean = false;
  listaPedidos: any[] = [];
  pedidosFiltrados: any[] = [];
  push = inject(PushService);

  constructor(public userService: UserService, private firestoreService: FirestoreService) {

    setTimeout(() => {
      this.isLoading = true;
    }, 1800);




  }


  //Muy importante el async-await, ya que al ser un promise, 
  //se tiene que esperar a que se resuelva para obtener el rol
  async ngOnInit() {
    this.userRol = await this.userService.getRole();
    console.log('Mi rol es: ' + this.userRol);

    setTimeout(() => {
      this.isLoading = false;
    }, 2600);

    this.firestoreService.getPedidos().subscribe((pedidos: any) => {
      this.listaPedidos = pedidos;
      this.filtrarProductos();
    });

    // Usar await para obtener los valores resueltos antes de imprimir
    const userId = await this.userService.getProperty('id');
    const userRol = await this.userService.getProperty('rol');
    //const nroMesa = await this.userService.getProperty('nroMesa');

    console.log(`Mi id es: ${userId}`);
    console.log(`Mi Rol es: ${userRol}`);
    //console.log(`Mi mesa es: ${nroMesa}`);
  }


  filtrarProductos() {
    this.pedidosFiltrados = this.listaPedidos
      .map(pedido => {
        // Filtrar productos dentro de cada pedido según el rol del usuario y el estado "en preparación"
        const productosFiltrados = pedido.listaProductos.filter((producto: { tipo: string; estado: string }) => {
          const esProductoParaCocinero = (producto.tipo === 'comida' || producto.tipo === 'postre') && producto.estado === 'en preparación';
          const esProductoParaBartender = producto.tipo === 'bebida' && producto.estado === 'en preparación';

          // Retorna true si el producto corresponde al rol actual y está en "en preparación"
          return this.userRol === 'cocinero' ? esProductoParaCocinero : esProductoParaBartender;
        });

        // Si hay productos filtrados, devuelve el pedido con solo esos productos; si no, retorna null
        return productosFiltrados.length > 0 ? { ...pedido, listaProductos: productosFiltrados } : null;
      })
      .filter(pedido => pedido !== null); // Filtra los pedidos que no tienen productos relevantes para el usuario
  }

  tieneProductosEnPreparacion(): boolean {
    return this.listaPedidos && this.listaPedidos.some((pedido: any) =>
      pedido.listaProductos && pedido.listaProductos.some((producto: any) => producto.estado === 'en preparación')
    );
  }





  async updateProductStatus(pedido: any, productoNombre: string) {
    try {
      const pedidoData = await this.firestoreService.getPedidoById(pedido.id);
  
      if (!pedidoData) return; 
  
      const listaProductosActualizada = [...pedidoData.listaProductos];  
      const productoIndex = listaProductosActualizada.findIndex((producto: any) => producto.nombre == productoNombre && producto.estado == 'en preparación');
      
      if (productoIndex !== -1) {
        listaProductosActualizada[productoIndex].estado = 'preparado';
        const todosProductosPreparados : boolean = listaProductosActualizada.every((producto: any) => producto.estado === 'preparado');
        const nuevoEstadoPedido = todosProductosPreparados ? 'preparado' : 'en preparación';
        if(nuevoEstadoPedido == 'preparado')
        {
          this.push.send_push_notification('Pedido preparado', 'Tienes un pedido listo para entregar', 'mozo');
        }
  
        // Actualizar en Firestore el array completo con el producto actualizado y el estado del pedido si es necesario
        await this.firestoreService.updateOrderPartial(pedido.id, {
          listaProductos: listaProductosActualizada,
          estado: nuevoEstadoPedido
        });
  
        // Mostrar confirmación
        Swal.fire({
          title: "Producto terminado!",
          confirmButtonText: "Continuar",
          heightAuto: false
        });
  
      } else {
        console.error("Producto no encontrado en el pedido.");
      }
    } catch (error) {
      console.error("Error al actualizar el producto:", error);
      Swal.fire({
        title: "Error al actualizar el producto",
        text: "Intenta nuevamente",
        icon: "error",
        confirmButtonText: "OK",
        heightAuto: false
      });
    }
  }
  
  

}










