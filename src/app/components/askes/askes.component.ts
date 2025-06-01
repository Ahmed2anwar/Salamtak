import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import {
  FormsModule,
  FormGroup,
  Validators,
  FormBuilder,
  ReactiveFormsModule,
} from '@angular/forms';
import { MatDialogModule } from '@angular/material/dialog';
import { RouterModule, ActivatedRoute, Router } from '@angular/router';
import { TranslocoModule, TranslocoService } from '@jsverse/transloco';
import { AccordionModule } from 'ngx-bootstrap/accordion';
import { NgxSpinnerService } from 'ngx-spinner';
import Swal from 'sweetalert2';
import { AuthenticationService } from '../../services/authentication.service';
import { MatSelectModule } from '@angular/material/select';
import { MetadataService } from '../../services/metadata.service';
import { RoutesPipe } from '../../pipes/routes.pipe';

@Component({
  selector: 'app-askes',
  standalone: true,
  imports: [
    RouterModule,
    MatDialogModule,
    TranslocoModule,
    CommonModule,
    AccordionModule,
    FormsModule,
    ReactiveFormsModule,
    MatSelectModule,
  ],
  templateUrl: './askes.component.html',
  styleUrl: './askes.component.scss',
})
export class AskesComponent {
  public Specialist: any = {
    Data: [],
    Filtered: [],
    Selected: null,
  };
  edit = false;
  profileData: any = null;
  public user: any = null;
  public formSubmitted = false;

  // form validation
  public submitted = false;
  lang = this.translocoService.getActiveLang();
  public form: FormGroup = this.formbuilder.group({
    SpecialistID: ['', Validators.required],
    Question: ['', Validators.required],
    QDetails: ['', Validators.required],
    GenderID: ['', Validators.required],
    IsForMe: ['', Validators.required],
    Age: ['', Validators.required],
    // bioAr : ['',[Validators.required,Validators.pattern(/[\u0600-\u06FF]/)]],
  });

  constructor(
    private service: AuthenticationService,
    private formbuilder: FormBuilder,
    private spinner: NgxSpinnerService,
    private route: ActivatedRoute,
    private router: Router,
    private authentication: AuthenticationService,
    private translocoService: TranslocoService,
    private metadataService: MetadataService,
    private routePipe: RoutesPipe
  ) {
    this.authentication.currentUser.subscribe(
      (currentUserSubject) => (this.user = currentUserSubject)
    );
    this.route.queryParams.subscribe((params) => {
      if (params['Mode'] == 'Edit') {
        this.edit = true;
      }
    });
    this.spinner.show();
  }
  ngOnInit(): void {
    this.metadataService.updateMetadata('askes');
    this.getSpecialist();
  }

  getSpecialist() {
    this.spinner.show();
    this.service.getSpecialist().subscribe((res) => {
      this.Specialist.Data = res['Data'];
      this.Specialist.Filtered = res['Data'];
      this.spinner.hide();
    });
  }
  onSpecialistChange(event: any) {
    // set value
    this.form.patchValue({
      SpecialistID: event.value,
    });
  }

  get f() {
    return this.form.controls;
  }

  formSubmit() {
    {
      this.formSubmitted = true;
      if (this.form.invalid) {
        window.scroll({ top: 0, left: 0, behavior: 'smooth' });
        return;
      }

      var form: any = {
        SpecialistID: this.form.value.SpecialistID.Id,
        Question: this.form.value.Question,
        GenderID: this.form.value.GenderID,
        QDetails: this.form.value.QDetails,
        IsForMe: this.form.value.IsForMe,
        Age: this.form.value.Age,
      };

      this.spinner.show();
      this.service.CreateQandAForPatient(form).subscribe((res: any) => {
        this.spinner.hide();
        Swal.fire({
          title: this.translocoService.translate('form.input.ask.done'),
          icon: 'success',
          showCancelButton: false,
          confirmButtonColor: '#3085d6',
          cancelButtonColor: '#d33',
          confirmButtonText: this.translocoService.translate(
            'swal.Soon.ConfirmButtonText'
          ),
          timer: 4000,
        }).then((result) => {
          // this.router.navigate([`/${this.lang}/home`])
          this.router.navigate([this.routePipe.transform('home')]);
        });
      });
    }
  }
  onIsForMeChange(isForMe: boolean): void {
    this.form.get('IsForMe')?.setValue(isForMe);

    // Automatically set gender depending on IsForMe
    // Customize logic as needed
    if (isForMe) {
      this.form.get('GenderID')?.setValue(2); // Male
    } else {
      this.form.get('GenderID')?.setValue(1); // Female
    }
  }
  setGenderValueToForm(Gender: String) {
    this.form.controls['gender'].setValue(Gender);
  }
}
