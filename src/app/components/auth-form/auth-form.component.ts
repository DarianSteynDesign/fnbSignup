import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FormControl } from '@angular/forms';
import { EventBusService } from 'src/app/services/event-bus.service';
import { UserModel } from 'src/app/models/user.model';

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
  
  constructor(
    private http: HttpClient,
    private eventBusService: EventBusService
  ) { }

  ngOnInit(): void {
    this.registerSubscriptions();
  }

  private registerSubscriptions(): void {
    this.eventBusService.channelObservable.subscribe((response: UserModel) => {
      this.selectedUserId = response.id;
      this.updateFormInfo(response);
    });
  }

  public signupUsers(): void {
    try {
      const genRanHex: any = size => [...Array(size)].map(() => Math.floor(Math.random() * 16).toString(16)).join('');

      let request: UserModel = {
        "id": genRanHex,
        "name": "string",
        "surname": "string",
        "email": "string",
        "password": "string"
      };

      if(request){
        this.http.post<Array<UserModel>>('http://localhost:5193/api/User', request).subscribe({
          error: error => {
              console.error('There was an error!', error);
          }
        });
      }
    } catch (error) {
      console.log('Oops, looks like we encountered a error');
    }
  }

  public updateDetails(id: string): void {
    try {
      let request: UserModel = {
        "id": id,
        "name": this.name.value,
        "surname": this.surname.value,
        "email": this.email.value,
        "password": this.password.value
      };

      if(request && this.name.value != '' && this.surname.value != '' && this.email.value != '' && this.password.value != ''){
        this.http.put<Array<UserModel>>(`http://localhost:5193/api/User/${id}`, request).subscribe({
          error: error => {
              console.error('There was an error!', error);
          }
        });
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
}
