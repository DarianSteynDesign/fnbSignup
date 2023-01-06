import { Message } from '@angular/compiler/src/i18n/i18n_ast';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject, Subscription } from 'rxjs';
import { filter } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class EventBusService {
  private channel: any = new BehaviorSubject<any>("");
  public channelObservable = this.channel.asObservable();

  constructor() {
  }

  public publish(payload?: any): void {
    this.channel.next(payload);
  }
}
