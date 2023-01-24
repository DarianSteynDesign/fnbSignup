import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { EventPayloadModel } from 'src/app/models/event-payload.model';
import { ToastModel } from 'src/app/models/toast-payload.model';
import { UserModel } from 'src/app/models/user.model';
import { EventBusService } from 'src/app/services/event-bus.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
  public listOfUsers = [];
  public currentUser = "";
  public setToastActive: boolean = false;
  public toastMessage: string = "";

  private userListUpdateSubscription: Subscription;

  constructor(    
    private http: HttpClient,
    private eventBusService: EventBusService,
    private userService: UserService
  ) { }

  ngOnInit(): void {
    this.getUsers();
    this.registerSubscriptions();
  }

  private registerSubscriptions(): void {
    this.userListUpdateSubscription = this.eventBusService.channelObservable.subscribe((response: EventPayloadModel) => {
      if(response) {
        switch(response.channel) {
          case 'userListUpdate':
            this.getUsers();
            break;
          case 'requestState':
            this.displayToast(response.body);
            break;
        }
      }
    });
  }

  private getUsers(): void {
    this.userService.getUsers().subscribe((data: any) => {
      this.listOfUsers = data;
      this.currentUser = this.listOfUsers[0].name;
    });
  }

  public selectUser(userInfo: UserModel): void {
    this.eventBusService.publish(new EventPayloadModel('userSelect', userInfo));
    this.currentUser = userInfo.name;
  }

  public displayToast(toastOptions: ToastModel): void {
    this.setToastActive = toastOptions.state;
    this.toastMessage = toastOptions.message;

    setTimeout(() => {
      this.setToastActive = false;
      this.toastMessage = "";
    }, 3500)
  }

  ngOnDestroy() {
    if(this.userListUpdateSubscription) this.userListUpdateSubscription.unsubscribe();
  }
}
