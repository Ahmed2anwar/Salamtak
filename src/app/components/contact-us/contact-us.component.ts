import { CommonModule } from '@angular/common';
import { Component, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormsModule, FormGroup, Validators, FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { TranslocoModule, TranslocoService } from '@jsverse/transloco';
import { AccordionModule } from 'ngx-bootstrap/accordion';
import { NgxSpinnerService } from 'ngx-spinner';
import Swal from 'sweetalert2';
import { COMPONENT_KEYWORDS } from '../../component-keywords';
import { SearchFormComponent } from '../../shared/search-form/search-form.component';
import { AppService } from '../../services/app.service';
import { NgxMatIntlTelInputComponent } from 'ngx-mat-intl-tel-input';
import { CountryISO } from 'ngx-intl-tel-input';
import { MetadataService } from '../../services/metadata.service';

@Component({
  selector: 'app-contact-us',
  standalone: true,
  imports: [
    TranslocoModule,
    RouterModule,
    CommonModule,
    AccordionModule,
    FormsModule,
    NgxMatIntlTelInputComponent,
    ReactiveFormsModule
  ],
  templateUrl: './contact-us.component.html',
  styleUrl: './contact-us.component.scss',
  encapsulation: ViewEncapsulation.None
})
export class ContactUsComponent {
  CountryISO = CountryISO;
  @ViewChild(NgxMatIntlTelInputComponent, { static: true })
  private phoneComponent: any;
  phone = '17143'
  titleKey : any;
  descriptionKey: any;
  phoneLabelTranslation = 'form.input.phone.label';

  public submitted = false;
  public form:FormGroup = this.formbuilder.group({
    name:['',Validators.required],
    email:['',[Validators.required,Validators.email]],
    Phone:['',Validators.required],
    subject:['',Validators.required],
    message:['',Validators.required]
  });

  constructor(private formbuilder:FormBuilder,

    private spinner: NgxSpinnerService,
    private service: AppService,
    private translocoService: TranslocoService,
    private metadataService : MetadataService
    ) { }

  ngOnInit(): void {
    this.metadataService.updateMetadata('contact-us');

    const lang = this.translocoService.getActiveLang();


      if (lang) {
         if (lang === 'ar') {
this.titleKey='تواصل بسهولة مع فريق سلامتك المتخصص من خلال رقم 17143'
this.descriptionKey=' نقدم لك صفحة "اتصل بنا" لسهولة التواصل مع فريق سلامتك المتخصص. سواء كانت لديك استفسارات أو تعليقات أو تحتاج إلى مساعدة، اتصل بنا علي رقم 17143 ونحن على  اتم الإستعداد لمساعدتك.'
         }
        else {
          this.titleKey='Contact Us'
          this.descriptionKey='Need to get in touch with Salamtak Group? Call us at 17143, or write to us, and we will work towards a solution for you.'
         }
      }
    const keywords = COMPONENT_KEYWORDS.ContactUs.join(', '); // Get keywords for HomeComponent
    this.service.updateDynamicMetaTags(this.titleKey, this.descriptionKey, keywords);

   }
  // createContactUs
  get f() {return this.form.controls}
  submit(){
    this.submitted = true;
    if (this.form.invalid) {
      // window.scroll({ top: 0, left: 0, behavior: 'smooth' });
      return
    }
    // alert(JSON.stringify({...this.form.value}))
    this.spinner.show()
    const form = {
      Name : this.form.value.name,
      Email : this.form.value.email,
      Phone : this.phoneComponent.value.internationalNumber,
      Subject : this.form.value.subject,
      Message : this.form.value.message,
    }
    this.service.createContactUs(form).subscribe(res => {
      this.spinner.hide()

      Swal.fire({
        icon: 'success',
        title: 'Your message has been sent successfully',
        showConfirmButton: false,
        timer: 1500
      }).then(() => {
        // window.location.reload()
        this.spinner.hide()
        this.form.reset()
        this.submitted = false;
        document.location.reload()
      })

    })
  }
}
