import { Component } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { materialProviders } from '../../shared-ui';

@Component({
  selector: 'app-security-component',
  imports: [MatCardModule,materialProviders ],
  templateUrl: './security-component.html',
  styleUrl: './security-component.css'
})
export class SecurityComponent {

}
