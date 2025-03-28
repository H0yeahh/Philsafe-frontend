import { trigger, state, transition, style, animate } from '@angular/animations';

export const expandCollapse = trigger('expandCollapse', [
   
  state('void', style({ height: '0px', opacity: 0, overflow: 'hidden' })),
  state('*', style({ height: '*', opacity: 1, overflow: 'hidden' })),


  transition(':enter', [
    style({ height: '0px', opacity: 0, overflow: 'hidden' }), 
    animate('500ms ease-in-out', style({ height: '*', opacity: 1 })) 
  ]),


  transition(':leave', [
    style({ height: '*', opacity: 1, overflow: 'hidden' }), 
    animate('500ms ease-in-out', style({ height: '0px', opacity: 0 })) 
  ])
  ]);