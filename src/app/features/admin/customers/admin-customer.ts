import { Component } from '@angular/core';
import { AdminCustomerHttp } from '../../../shared/services/admin/admin-customer-http';
import { OnInit } from '@angular/core';
import { CustomerList } from '../../../shared/models/CustomerList';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-admin-customer',
  imports: [CommonModule],
  templateUrl: './admin-customer.html',
  styleUrl: './admin-customer.scss',
})
export class AdminCustomer implements OnInit {
  customers: CustomerList[] = [];

  page = 1;
  pageSize = 25;
  totalPages = 0;
  hasNext = false;
  hasPrevious = false;

  constructor(private adminCustomerHttp: AdminCustomerHttp) {}

  ngOnInit() {
    this.loadCustomers();
  }

  loadCustomers() {
    this.adminCustomerHttp
      .getCustomerList(this.page, this.pageSize)
      .subscribe(res => {
        this.customers = res.items;
        this.totalPages = res.totalPages;
        this.hasNext = res.hasNext;
        this.hasPrevious = res.hasPrevious;
      });
  }

  nextPage() {
    if (this.hasNext) {
      this.page++;
      this.loadCustomers();
    }
  }

  prevPage() {
    if (this.hasPrevious) {
      this.page--;
      this.loadCustomers();
    }
  }
}
