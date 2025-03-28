import { trigger, transition, style, animate } from '@angular/animations';


export const scaleInOut = trigger('scaleInOut', [
  transition(':enter', [
    style({ transform: 'scale(0)', opacity: 0 }),
    animate('400ms ease-in-out', style({ transform: 'scale(1)', opacity: 1 }))
  ]),
  transition(':leave', [
    style({ transform: 'scale(1)', opacity: 1 }),
    animate('400ms ease-in-out', style({ transform: 'scale(0)', opacity: 0 }))
  ])
]);


