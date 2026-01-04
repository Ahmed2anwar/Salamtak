import { Component, inject } from '@angular/core';
import { RouterModule } from '@angular/router';
import { TranslocoModule, TranslocoService } from '@jsverse/transloco';
import { RoutesPipe } from '../../../pipes/routes.pipe';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { LoginComponent } from '../login/login.component';

@Component({
  selector: 'app-reset-successfully',
  standalone: true,
  imports: [TranslocoModule, RouterModule, RoutesPipe],
  templateUrl: './reset-successfully.component.html',
  styleUrl: './reset-successfully.component.scss',
})
export class ResetSuccessfullyComponent {
  lang = this.translocoService.getActiveLang();
  constructor(
    private translocoService: TranslocoService,
    public dialog: MatDialog
  ) {}

  dialogRef = inject(MatDialogRef);
  login() {
    this.dialog.open(LoginComponent, {
      width: '400px',
      height: 'auto',
      data: {},
    });
    this.dialogRef.close();
  }
}
