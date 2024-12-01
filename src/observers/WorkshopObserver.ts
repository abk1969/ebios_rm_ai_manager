import { Workshop } from '@/types/ebios';

type Observer = (workshop: Workshop) => void;

export class WorkshopObserver {
  private static observers: Observer[] = [];

  static subscribe(observer: Observer) {
    this.observers.push(observer);
  }

  static unsubscribe(observer: Observer) {
    this.observers = this.observers.filter(obs => obs !== observer);
  }

  static notify(workshop: Workshop) {
    this.observers.forEach(observer => observer(workshop));
  }
}