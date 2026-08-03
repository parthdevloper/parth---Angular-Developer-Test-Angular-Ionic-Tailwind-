import { Injectable, signal } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class NavDirectionService {
  direction = signal<'forward' | 'back'>('forward');
}
