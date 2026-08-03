import { trigger, transition, style, animate } from '@angular/animations';

export const tabEntry = trigger('tabEntry', [
  transition('void => forward', [
    style({ opacity: 0, transform: 'translateX(30%)' }),
    animate('280ms ease-out', style({ opacity: 1, transform: 'translateX(0)' }))
  ]),
  transition('void => back', [
    style({ opacity: 0, transform: 'translateX(-30%)' }),
    animate('280ms ease-out', style({ opacity: 1, transform: 'translateX(0)' }))
  ]),
  transition('void => *', [
    style({ opacity: 0 }),
    animate('200ms ease-out', style({ opacity: 1 }))
  ]),
  //   transition('void => *', [
  //   style({ opacity: 4 }),
  //   animate('200ms ease-out', style({ opacity: 1 }))
  // ])
]);

export const fadeIn = trigger('fadeIn', [
  transition(':enter', [
    style({ opacity: 0, transform: 'translateY(10px)' }),
    animate('250ms ease-out', style({ opacity: 1, transform: 'translateY(0)' }))
  ]),
  transition('false => true, void => true', [
    style({ opacity: 0, transform: 'translateY(10px)' }),
    animate('250ms ease-out', style({ opacity: 1, transform: 'translateY(0)' }))
  ])
]);
