import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, Subscription } from 'rxjs';
import { UserModel } from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(
    private http: HttpClient
  ) { }

  public getUsers(): Observable<Array<UserModel>> {
    return this.http.get<Array<UserModel>>('http://localhost:5193/api/User');
  }

  public createUser(request: UserModel): Observable<Array<UserModel>> {
    return this.http.post<Array<UserModel>>('http://localhost:5193/api/User', request);
  }

  public updateUser(id: string, request: UserModel): Observable<Array<UserModel>> {
    return this.http.put<Array<UserModel>>(`http://localhost:5193/api/User/${id}`, request);
  }

  public deleteUser(id: string, request: UserModel): Observable<ArrayBuffer> {
    const httpOptions = {
        headers: new HttpHeaders({ 'Content-Type': 'application/json' }), body: request
    };
    return this.http.delete<any>(`http://localhost:5193/api/User/${id}`, httpOptions);
  }
}
