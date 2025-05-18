import { Component } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { AppService } from '../../services/app.service';
import { RoutesPipe } from '../../pipes/routes.pipe';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { TranslocoModule } from '@jsverse/transloco';

@Component({
  selector: 'app-my-receipt',
  standalone: true,
  imports: [RouterModule, CommonModule, TranslocoModule],
  templateUrl: './my-receipt.component.html',
  styleUrls: ['./my-receipt.component.scss'],
})
export class MyReceiptComponent {
  invoices: any[] = [];

  constructor(private service: AppService, private spinner: NgxSpinnerService) {
    // this.editAppointment()
  }
  ngOnInit(): void {
    this.spinner.show();
    this.getInvoices();
  }
  getInvoices(): void {
    this.service.getInvoicesForPatient().subscribe((res) => {
      this.invoices = res['Data']?.reverse() || [];
      if (this.invoices.length > 0) setTimeout(() => {}, 1000);
      this.spinner.hide();
    });
  }
}
