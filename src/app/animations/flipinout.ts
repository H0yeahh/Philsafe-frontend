import { trigger, transition, style, animate } from '@angular/animations';


export const flipAnimation = trigger('flipAnimation', [
    transition(':enter', [
      style({ transform: 'rotateY(90deg)', opacity: 0 }),
      animate('500ms ease-in-out', style({ transform: 'rotateY(0)', opacity: 1 }))
    ]),
    transition(':leave', [
      style({ transform: 'rotateY(0)', opacity: 1 }),
      animate('500ms ease-in-out', style({ transform: 'rotateY(90deg)', opacity: 0 }))
    ])
  ]);