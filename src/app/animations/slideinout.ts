import { trigger, transition, style, animate } from '@angular/animations';

export const slideInOut = trigger('slideInOut', [
    transition(':enter', [
      style({ transform: 'translateX(-100%)' }),
      animate('500ms ease-in-out', style({ transform: 'translateX(0)' }))
    ]),
    transition(':leave', [
      style({ transform: 'translateX(0)' }),
      animate('500ms ease-in-out', style({ transform: 'translateX(-100%)' }))
    ])
  ]);