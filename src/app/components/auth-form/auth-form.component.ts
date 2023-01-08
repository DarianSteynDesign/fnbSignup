import { Component, HostListener, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FormControl } from '@angular/forms';
import { EventBusService } from 'src/app/services/event-bus.service';
import { UserModel } from 'src/app/models/user.model';
import { Subscription } from 'rxjs';
import { UserService } from 'src/app/services/user.service';
import { EventPayloadModel } from 'src/app/models/event-payload.model';
import { ToastModel } from 'src/app/models/toast-payload.model';

@Component({
  selector: 'auth-form',
  templateUrl: './auth-form.component.html',
  styleUrls: ['./auth-form.component.scss']
})
export class AuthFormComponent implements OnInit {

  public name: FormControl = new FormControl('');
  public surname: FormControl = new FormControl('');
  public email: FormControl = new FormControl('');
  public password: FormControl = new FormControl('');
  public selectedUserId: string = "";

  private userSelectSubscription: Subscription;
  
  constructor(
    private http: HttpClient,
    private eventBusService: EventBusService,
    private userService: UserService
  ) { }

  @HostListener('document:click', ['$event'])
  documentClick(event: any): void {
    if(event.target.classList.contains('input')) {
      this.updateInputStateToActive(event, true);
    } else {
      this.updateInputStateToActive(event, false);
    }
  }

  ngOnInit(): void {
    this.registerSubscriptions();
  }

  private registerSubscriptions(): void {
    this.userSelectSubscription = this.eventBusService.channelObservable.subscribe((response: EventPayloadModel) => {
      if(response && response.channel == 'userSelect'){
        this.selectedUserId = response.body.id;
        this.updateFormInfo(response.body);
        this.allInputsActive();
      }
    });
  }

  public signupUsers(): void {
    try {
      const genRanHex: any = size => [...Array(size)].map(() => Math.floor(Math.random() * 16).toString(16)).join('');

      let request: UserModel = {
        "id": genRanHex,
        "name": this.name.value,
        "surname": this.surname.value,
        "email": this.email.value,
        "password": this.password.value
      };

      if(request){
        this.userService.createUser(request).subscribe(
          success => {
            this.displaySuccess('Sign up successful!');
            this.updateUserListEvent(genRanHex);
            this.clearFormInfo();
          },
          error => {
            this.displayError('Error signing up');
          }
        );
      }
    } catch (error) {
      console.log('Oops, looks like we encountered a error');
    }
  }

  public updateDetails(deleteUser: boolean, id: string): void {
    try {
      let request: UserModel = {
        "id": id,
        "name": this.name.value,
        "surname": this.surname.value,
        "email": this.email.value,
        "password": this.password.value
      };

      if(deleteUser){
        this.userService.deleteUser(id, request).subscribe(
          success => {
            this.displaySuccess('User deleted successfully');
            this.updateUserListEvent(id);
            this.clearFormInfo();
          },
          error => {
              this.displayError('Error deleting user');
          }
        );
      } else {
        if(request && this.name.value != '' && this.surname.value != '' && this.email.value != '' && this.password.value != '') {
          this.userService.updateUser(id, request).subscribe(
            success => {
              this.displaySuccess('User updated successfully');
              this.updateUserListEvent(id);
            },
            error => {
                this.displayError('Error updating user');
            }
          );
        }
      }
    } catch (error) {
      console.log('Oops, looks like we encountered a error');
    }
  }

  private updateFormInfo(value: UserModel): void {
    this.name.patchValue(value.name);
    this.surname.patchValue(value.surname);
    this.email.patchValue(value.email);
    this.password.patchValue(value.password);
  }

  public clearFormInfo(): void {
    this.name.patchValue('');
    this.surname.patchValue('');
    this.email.patchValue('');
    this.password.patchValue('');
  }

  private displaySuccess(message: string): void {
    let toastPayload: ToastModel = {state: true, message: message};
    this.eventBusService.publish(new EventPayloadModel('requestState', toastPayload));
    // "Logging"
    console.log('User updated successfully');
  }

  private displayError(message: string): void {
    let toastPayload: ToastModel = {state: false, message: message};
    this.eventBusService.publish(new EventPayloadModel('requestState', toastPayload));
    // "Logging"
    console.log('There was an error!');
  }

  private updateUserListEvent(updateUserId: string): void {
    this.eventBusService.publish(new EventPayloadModel('userListUpdate', updateUserId));
  }

  public updateInputStateToActive(event?: any, activeState?: boolean): void {
    if(activeState && event){
      event.target.parentElement.classList.add('active');
    } else {
      const htmlElements = document.querySelectorAll('.input-container');

      htmlElements.forEach((item) => {
        if((item.children[1] as HTMLInputElement).value == '') {
          item.classList.remove("active")
        }
      })
    }
  }

  private allInputsActive(): void {
    const htmlElements = document.querySelectorAll('.input-container');

    htmlElements.forEach((item) => {
      item.classList.add("active")
    });
  }

  ngOnDestroy() {
    if(this.userSelectSubscription) this.userSelectSubscription.unsubscribe();
  }
}
