import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [RouterModule],
  template: `
    <nav style="display:flex; gap:1rem; padding:0.5rem; border-bottom:1px solid #eee;">
      <a routerLink="/">Home</a>
    </nav>
  `,
  styles: ``
})
export class HeaderComponent {}
