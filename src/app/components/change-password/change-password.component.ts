import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule, ReactiveFormsModule, FormGroup, Validators, FormBuilder } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { TranslocoModule, TranslocoService } from '@jsverse/transloco';
import { AccordionModule } from 'ngx-bootstrap/accordion';
import { NgxSpinnerService } from 'ngx-spinner';
import Swal from 'sweetalert2';
import { environment } from '../../../environments/environment';
import { AuthenticationService } from '../../services/authentication.service';
import { SearchFormComponent } from '../../shared/search-form/search-form.component';
import { MustMatch } from '../../helpers/must-match.validator';
import { LocalStorageService } from '../../services/local-storage.service';
import { MetadataService } from '../../services/metadata.service';
import { RoutesPipe } from '../../pipes/routes.pipe';

@Component({
  selector: 'app-change-password',
  standalone: true,
  imports: [
    TranslocoModule,
    RouterModule,
    CommonModule,
    SearchFormComponent,
    AccordionModule,
    FormsModule,
    ReactiveFormsModule
  ],
  templateUrl: './change-password.component.html',
  styleUrl: './change-password.component.scss'
})
export class ChangePasswordComponent {
  hidePassword = true;
  userId:any
   public submitted = false;
   lang = this.translocoService.getActiveLang();
   public form:FormGroup = this.formbuilder.group({
     oldPassword:['',Validators.required],
     password:['',Validators.required],
     confirmPassword:['',Validators.required], // password == confirmPassword

   }, { validator: MustMatch('password', 'confirmPassword') })


   constructor(private formbuilder:FormBuilder,private router: Router,
     private auth:AuthenticationService,
     private spinner:NgxSpinnerService,
     private StorageService : LocalStorageService,
     private translocoService : TranslocoService,
     private metadataService : MetadataService,
     private route: RoutesPipe

     ) { }
     ngOnInit() {
      this.metadataService.updateMetadata('change-password');

       let currentUser = JSON.parse(this.StorageService.getItem(`${environment.localStorageUserKey}`)!);
       this.userId=currentUser.Id
     }
   get f() {return this.form.controls}
   submit(){
     
     this.submitted = true;
     if (this.form.invalid) {
       window.scroll({ top: 0, left: 0, behavior: 'smooth' });
       return
     }
     if(this.form.value.password != this.form.value.confirmPassword){
       // alert('Password and confirm password not matched')
       Swal.fire({
         icon: 'error',
         title: 'Oops...',
         text: 'Password and confirm password not matched',
         // footer: '<a href>Why do I have this issue?</a>'
       })
       return
     }

     const form = {
       UserId : this.userId,
       Password : this.form.value.password,
       OldPassword : ''
     }
     this.spinner.show()
     this.spinner.show()
     this.auth.UpdatePassword({...this.form.value}).subscribe((res:any)=>{
       this.spinner.hide()
      //  this.router.navigate([`/${this.lang}/auth/reset-successfully`]).then(()=>{
        this.router.navigate([this.route.transform('reset-successfully')]).then(()=>{
         this.auth.logout()
       }
       )

     })
   }
   showHidePassword(){
     this.hidePassword = !this.hidePassword;
   }
}
