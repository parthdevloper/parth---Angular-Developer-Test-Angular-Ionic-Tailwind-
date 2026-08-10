import { trigger, transition, style, animate, AnimationMetadata } from '@angular/animations';

const SLIDE_MS = '280ms ease-out';
const FADE_MS = '250ms ease-out';

function slideFrom(offset: string): AnimationMetadata[] {
  return [
    style({ opacity: 0, transform: `translateX(${offset})` }),
    animate(SLIDE_MS, style({ opacity: 1, transform: 'translateX(0)' }))
  ];
}

export const tabEntry = trigger('tabEntry', [
  transition('void => forward', slideFrom('30%')),
  transition('void => back', slideFrom('-30%')),
  transition('void => *', [
    style({ opacity: 0 }),
    animate('200ms ease-out', style({ opacity: 1 }))
  ])
]);

const riseUp: AnimationMetadata[] = [
  style({ opacity: 0, transform: 'translateY(10px)' }),
  animate(FADE_MS, style({ opacity: 1, transform: 'translateY(0)' }))
];

export const fadeIn = trigger('fadeIn', [
  transition(':enter', riseUp),
  transition('false => true, void => true', riseUp)
]);
