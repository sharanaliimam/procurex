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
import { BidService } from '../../core/services/bid.service';
import { TenderService } from '../../core/services/tender.service';
import { VendorService } from '../../core/services/vendor.service';
import { AuthService } from '../../core/services/auth.service';
import { AuthUser, Bid, Tender, Vendor } from '../../core/models/models';

@Component({
  selector: 'app-bids',
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
  templateUrl: './bids.component.html',
  styleUrl: './bids.component.css'
})
export class BidsComponent implements OnInit {
  bids: Bid[] = [];
  tenders: Tender[] = [];
  vendors: Vendor[] = [];
  columns = ['tender', 'vendor', 'quotedAmount', 'submissionDate', 'overallScore', 'status', 'actions'];
  statuses = ['Submitted', 'Under Evaluation', 'Approved', 'Rejected'];
  currentUser: AuthUser | null = null;
  isAdmin = false;

  showForm = false;
  editingId: string | null = null;
  form: FormGroup;
  tenderFilter = '';

  constructor(
    private fb: FormBuilder,
    private bidService: BidService,
    private tenderService: TenderService,
    private vendorService: VendorService,
    private authService: AuthService,
    private snackBar: MatSnackBar
  ) {
    this.form = this.fb.group({
      tender: ['', Validators.required],
      vendor: [''],
      quotedAmount: [0, [Validators.required, Validators.min(0)]],
    });
  }

  ngOnInit(): void {
    this.currentUser = this.authService.currentUser;
    this.isAdmin = this.currentUser?.role === 'admin';
    this.tenderService.getAll().subscribe((data) => (this.tenders = data));
    this.vendorService.getAll().subscribe((data) => {
      this.vendors = data;
      this.load();
    });
  }

  get currentVendorId(): string | null {
    if (!this.currentUser) return null;
    const match = this.vendors.find(
      (vendor) =>
        vendor.email?.toLowerCase() === this.currentUser?.email?.toLowerCase() ||
        vendor.email?.toLowerCase() === this.currentUser?.vendorEmail?.toLowerCase()
    );
    return match?._id || null;
  }

  load(): void {
    if (this.isAdmin) {
      this.bidService.getAll({ tender: this.tenderFilter }).subscribe((data) => (this.bids = data));
      return;
    }

    const vendorId = this.currentVendorId;
    if (!vendorId) {
      this.bids = [];
      return;
    }

    this.bidService.getAll({ vendor: vendorId, tender: this.tenderFilter }).subscribe((data) => (this.bids = data));
  }

  openCreate(): void {
    this.editingId = null;
    const vendorId = this.currentVendorId || '';
    this.form.reset({
      tender: '',
      vendor: vendorId,
      quotedAmount: 0
    });
    this.showForm = true;
  }

  openEdit(b: Bid): void {
    this.editingId = b._id!;
    this.form.patchValue({
      tender: this.idOf(b.tender),
      vendor: this.idOf(b.vendor),
      quotedAmount: b.quotedAmount
    });
    this.showForm = true;
  }

  idOf(entity: any): string {
    return typeof entity === 'string' ? entity : entity?._id;
  }

  nameOfTender(entity: any): string {
    return typeof entity === 'string' ? entity : `${entity?.tenderId} - ${entity?.title}`;
  }

  nameOfVendor(entity: any): string {
    return typeof entity === 'string' ? entity : `${entity?.vendorName} (${entity?.company})`;
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

    if (!this.isAdmin) {
      const vendorId = this.currentVendorId;
      if (!vendorId) {
        this.createVendorProfileForCurrentUser();
        return;
      }
      this.submitBid(vendorId);
      return;
    }

    this.submitBid(this.form.value.vendor);
  }

  private createVendorProfileForCurrentUser(): void {
    const user = this.authService.currentUser;
    if (!user) {
      this.snackBar.open('Please log in again before submitting a bid.', 'Close', { duration: 3000 });
      return;
    }

    const vendorPayload = {
      vendorName: user.name,
      company: user.name,
      email: user.email,
      phone: 'Not provided',
      businessCategory: 'Goods' as const,
      status: 'Active' as const
    };

    this.vendorService.create(vendorPayload).subscribe({
      next: (vendor) => {
        this.vendors = [...this.vendors, vendor];
        this.submitBid(vendor._id!);
      },
      error: (err) => {
        this.snackBar.open(err?.error?.message || 'Could not create your vendor profile. Please try again.', 'Close', { duration: 3000 });
      }
    });
  }

  private submitBid(vendorId: string): void {
    const payload = { ...this.form.value, vendor: vendorId, status: 'Submitted' };

    const op = this.editingId
      ? this.bidService.update(this.editingId, payload)
      : this.bidService.create(payload);

    op.subscribe({
      next: () => {
        this.snackBar.open(this.editingId ? 'Bid updated' : 'Bid submitted', 'Close', { duration: 2500 });
        this.showForm = false;
        this.load();
      },
      error: (err) => this.snackBar.open(err?.error?.message || 'Save failed', 'Close', { duration: 3000 })
    });
  }

  setStatus(b: Bid, status: 'Approved' | 'Rejected'): void {
    this.bidService.update(b._id!, { status }).subscribe({
      next: () => {
        this.snackBar.open(`Bid ${status.toLowerCase()}`, 'Close', { duration: 2200 });
        this.load();
      },
      error: (err) => this.snackBar.open(err?.error?.message || 'Approval failed', 'Close', { duration: 3000 })
    });
  }

  remove(b: Bid): void {
    if (!confirm('Delete this bid?')) return;
    this.bidService.delete(b._id!).subscribe(() => {
      this.snackBar.open('Bid deleted', 'Close', { duration: 2000 });
      this.load();
    });
  }

  statusClass(status: string): string {
    return 'status-' + status.toLowerCase().replace(/\s+/g, '-');
  }
}
