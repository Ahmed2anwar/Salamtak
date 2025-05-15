import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SearchFormComponent } from '../../shared/search-form/search-form.component';

@Component({
  selector: 'app-doctors-layout',
  standalone: true,
  imports: [
    SearchFormComponent,
    CommonModule,
    RouterModule
  ],
  templateUrl: './doctors-layout.component.html',
  // src/app/@layouts/listing-layout/listing-layout.component.scss
  styleUrls : [
    '../listing-layout/listing-layout.component.scss',
    './doctors-layout.component.scss'
  ]
})
export class DoctorsLayoutComponent {

}
