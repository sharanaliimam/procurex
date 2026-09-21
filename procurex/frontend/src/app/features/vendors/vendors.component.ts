import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { VendorService } from '../../core/services/vendor.service';
import { Vendor } from '../../core/models/models';

@Component({
  selector: 'app-vendors',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatCardModule,
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatSnackBarModule,
    MatTooltipModule
  ],
  templateUrl: './vendors.component.html',
  styleUrl: './vendors.component.css'
})
export class VendorsComponent implements OnInit {
  vendors: Vendor[] = [];
  columns = ['vendorName', 'company', 'email', 'phone', 'businessCategory', 'status', 'actions'];
  categories = ['Goods', 'Works', 'Services', 'Consultancy'];
  statuses = ['Active', 'Inactive', 'Blacklisted'];

  showForm = false;
  editingId: string | null = null;
  form: FormGroup;
  searchTerm = '';

  constructor(
    private fb: FormBuilder,
    private vendorService: VendorService,
    private snackBar: MatSnackBar
  ) {
    this.form = this.fb.group({
      vendorName: ['', Validators.required],
      company: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', Validators.required],
      businessCategory: ['Goods', Validators.required],
      status: ['Active', Validators.required]
    });
  }

  ngOnInit(): void {
    this.load();
  }

  load(): void {
    this.vendorService.getAll({ search: this.searchTerm }).subscribe((data) => (this.vendors = data));
  }

  openCreate(): void {
    this.editingId = null;
    this.form.reset({ businessCategory: 'Goods', status: 'Active' });
    this.showForm = true;
  }

  openEdit(v: Vendor): void {
    this.editingId = v._id!;
    this.form.patchValue(v);
    this.showForm = true;
  }

  cancel(): void {
    this.showForm = false;
    this.editingId = null;
  }

  save(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    const op = this.editingId
      ? this.vendorService.update(this.editingId, this.form.value)
      : this.vendorService.create(this.form.value);

    op.subscribe({
      next: () => {
        this.snackBar.open(this.editingId ? 'Vendor updated' : 'Vendor added', 'Close', { duration: 2500 });
        this.showForm = false;
        this.load();
      },
      error: (err) => this.snackBar.open(err?.error?.message || 'Save failed', 'Close', { duration: 3000 })
    });
  }

  remove(v: Vendor): void {
    if (!confirm(`Delete vendor ${v.vendorName}?`)) return;
    this.vendorService.delete(v._id!).subscribe(() => {
      this.snackBar.open('Vendor deleted', 'Close', { duration: 2000 });
      this.load();
    });
  }

  statusClass(status: string): string {
    return 'status-' + status.toLowerCase().replace(/\s+/g, '-');
  }
}
