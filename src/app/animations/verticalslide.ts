import { trigger, transition, style, animate } from '@angular/animations';


export const slideUpDown = trigger('slideUpDown', [
    transition(':enter', [
      style({ transform: 'translateY(-100%)' }),
      animate('500ms ease-in-out', style({ transform: 'translateY(0)' }))
    ]),
    transition(':leave', [
      style({ transform: 'translateY(0)' }),
      animate('500ms ease-in-out', style({ transform: 'translateY(-100%)' }))
    ])
  ]);