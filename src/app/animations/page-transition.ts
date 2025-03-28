import { trigger, transition, style, animate } from '@angular/animations';

export const pageTransitions = trigger('pageTransition', [
  // Transition when entering the page
  transition(':enter', [
    style({ opacity: 0, transform: 'translateX(-100%)' }), // Start state
    animate('500ms ease-in-out', style({ opacity: 1, transform: 'translateX(0)' })) // End state
  ]),
  // Transition when leaving the page
  transition(':leave', [
    style({ opacity: 1, transform: 'translateX(0)' }), // Start state
    animate('500ms ease-in-out', style({ opacity: 0, transform: 'translateX(100%)' })) // End state
  ])
]);