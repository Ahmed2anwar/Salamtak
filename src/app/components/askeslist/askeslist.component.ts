import { Component } from '@angular/core';
import { FormBuilder, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { TranslocoModule, TranslocoService } from '@jsverse/transloco';
import { NgxSpinnerService } from 'ngx-spinner';
import { AuthenticationService } from '../../services/authentication.service';
import { CommonModule } from '@angular/common';
import { MatDialogModule } from '@angular/material/dialog';
import { MatSelectModule } from '@angular/material/select';
import { AccordionModule } from 'ngx-bootstrap/accordion';
import { MetadataService } from '../../services/metadata.service';

@Component({
  selector: 'app-askeslist',
  standalone: true,
  imports: [
    RouterModule,
    MatDialogModule,
    TranslocoModule,
    CommonModule,
    AccordionModule,
    FormsModule,
    ReactiveFormsModule,
    MatSelectModule
  ],
  templateUrl: './askeslist.component.html',
  styleUrl: './askeslist.component.scss'
})

export class AskeslistComponent {

  public user :any = null
  askes:any=[]



  constructor( private service : AuthenticationService,
    private formbuilder:FormBuilder,
   private spinner:NgxSpinnerService,
   private route: ActivatedRoute,
   private router:Router,
   private authentication: AuthenticationService,
   private translocoService: TranslocoService,
   private metadataService : MetadataService
 ) {
   this.authentication.currentUser.subscribe(currentUserSubject => this.user = currentUserSubject)
   this.route.queryParams.subscribe(params => {

   });
   this.spinner.show()


}

  ngOnInit(): void{
    this.metadataService.updateMetadata('askeslist');


  this.service.getQandAQuestien().subscribe((res:any)=>{
    
    this.askes=res.Data
    this.spinner.hide()
  })
}
}
