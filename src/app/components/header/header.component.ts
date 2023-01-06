import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { UserModel } from 'src/app/models/user.model';
import { EventBusService } from 'src/app/services/event-bus.service';

@Component({
  selector: 'header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
  public listOfUsers = [];

  constructor(    
    private http: HttpClient,
    private eventBusService: EventBusService
  ) { }

  ngOnInit(): void {
    this.getUsers();
  }

  private getUsers(): void {
    this.http.get<Array<UserModel>>('http://localhost:5193/api/User').subscribe((data: any) => {
        this.listOfUsers = data;
    });
  }

  public selectUser(userInfo: UserModel): void {
    this.eventBusService.publish(userInfo);
  }

}
