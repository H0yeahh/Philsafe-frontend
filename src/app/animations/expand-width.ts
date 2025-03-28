import { trigger, transition, style, animate } from '@angular/animations';

export const expandWidth = trigger('expandCollapse', [
    transition(':enter', [
      style({ width: '0', overflow: 'hidden', opacity: 0 }),
      animate('500ms ease-in-out', style({ width: '*', opacity: 1 }))
    ]),
    transition(':leave', [
      style({ width: '*', overflow: 'hidden', opacity: 1 }),
      animate('500ms ease-in-out', style({ width: '0', opacity: 0 }))
    ])
  ]);