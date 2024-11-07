import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { CommonModule, Location } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonButtons, IonIcon, IonButton } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { sendOutline, arrowBackCircleOutline} from 'ionicons/icons';
import {  Router } from '@angular/router';


import { DayNamePipe } from 'src/app/pipes/day-name.pipe';
import { FirestoreService } from 'src/app/services/firestore.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.page.html',
  styleUrls: ['./chat.page.scss'],
  standalone: true,
  imports: [DayNamePipe,IonButton, IonIcon, IonButtons, IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule]
})
export class ChatPage implements OnInit, AfterViewInit {
  @ViewChild('scrollAnchor', { static: false }) private scrollAnchor!: ElementRef;

  arrayMessages!: any;
  message! : string;

  constructor(private router : Router,private firestore : FirestoreService, public userService : UserService) { 
    addIcons({arrowBackCircleOutline,sendOutline});
    this.message = '';
  }

  ngOnInit() {

    this.firestore.getMessages()
    .subscribe( (response : any) => {
      this.arrayMessages = [];
      for(let message of response)
      {
        this.arrayMessages.push(message);
      }
      console.log(this.arrayMessages);
      this.scrollToBottom();
    })
  }

  ngAfterViewInit() {
    this.scrollToBottom();
  }

  scrollToBottom(){
    setTimeout(() => {
      if (this.scrollAnchor) {
        this.scrollAnchor.nativeElement.scrollIntoView({ behavior: 'smooth' });
      }
    }, 100);
  }


  goBack() : void{
    this.router.navigateByUrl('home-mozo');
  }

  sendMessage() : void{
    if (this.message != '') {
      this.firestore.sendMessage(this.userService.getUserName(),this.message, this.userService.uidUser,this.userService.nroMesa);
      this.message = '';
    }
    else{
      this.userService.showToast('No has cargado un mensaje','red', 'center','error','white', true);
    }
  }
  
  validateSameDay(date: Date, index: number): boolean {
    if (index === 0) {
      return true;
    }

    const previousMessageDate = new Date(this.arrayMessages[index - 1].time);
  
    const isSameDay = 
      date.getDate() === previousMessageDate.getDate() &&
      date.getMonth() === previousMessageDate.getMonth() &&
      date.getFullYear() === previousMessageDate.getFullYear();
  
    return !isSameDay;

  }



}
