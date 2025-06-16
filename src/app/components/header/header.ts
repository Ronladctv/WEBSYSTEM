import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { materialProviders } from '../../shared-ui'; 

@Component({
  selector: 'app-header',
  imports: [RouterModule,
    materialProviders,
  ],
  templateUrl: './header.html',
  styleUrl: './header.css'
})
export class Header {

}
