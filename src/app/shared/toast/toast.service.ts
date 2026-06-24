import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export type ToastType = 'success' | 'error' | 'info';

export interface ToastMessage {
  id: number;
  text: string;
  type: ToastType;
}

@Injectable({ providedIn: 'root' })
export class ToastService {
  private nextId = 1;
  private readonly messagesSubject = new BehaviorSubject<ToastMessage[]>([]);
  readonly messages$ = this.messagesSubject.asObservable();

  show(text: string, type: ToastType = 'success'): void {
    const message: ToastMessage = { id: this.nextId++, text, type };
    this.messagesSubject.next([...this.messagesSubject.value, message]);
    setTimeout(() => this.dismiss(message.id), 3200);
  }

  dismiss(id: number): void {
    this.messagesSubject.next(this.messagesSubject.value.filter(message => message.id !== id));
  }
}
