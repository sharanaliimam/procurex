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
import { TenderService } from '../../core/services/tender.service';
import { AuthService } from '../../core/services/auth.service';
import { AuthUser, Tender } from '../../core/models/models';

@Component({
  selector: 'app-tenders',
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
  templateUrl: './tenders.component.html',
  styleUrl: './tenders.component.css'
})
export class TendersComponent implements OnInit {
  tenders: Tender[] = [];
  columns = ['tenderId', 'title', 'category', 'estimatedBudget', 'submissionDeadline', 'status', 'actions'];
  categories = ['Goods', 'Works', 'Services', 'Consultancy'];
  statuses = ['Draft', 'Published', 'Under Evaluation', 'Awarded', 'Closed'];
  currentUser: AuthUser | null = null;
  isAdmin = false;

  showForm = false;
  editingId: string | null = null;
  form: FormGroup;

  searchTerm = '';
  statusFilter = '';

  constructor(
    private fb: FormBuilder,
    private tenderService: TenderService,
    private authService: AuthService,
    private snackBar: MatSnackBar
  ) {
    this.form = this.fb.group({
      tenderId: ['', Validators.required],
      title: ['', Validators.required],
      description: [''],
      category: ['Goods', Validators.required],
      estimatedBudget: [0, [Validators.required, Validators.min(0)]],
      publicationDate: ['', Validators.required],
      submissionDeadline: ['', Validators.required],
      status: ['Draft', Validators.required]
    });
  }

  ngOnInit(): void {
    this.currentUser = this.authService.currentUser;
    this.isAdmin = this.currentUser?.role === 'admin';
    this.load();
  }

  load(): void {
    this.tenderService.getAll({ status: this.statusFilter, search: this.searchTerm }).subscribe((data) => {
      this.tenders = data.filter((tender) => this.isAdmin || tender.status === 'Published');
    });
  }

  openCreate(): void {
    if (!this.isAdmin) {
      this.snackBar.open('Only the admin can create tenders.', 'Close', { duration: 2200 });
      return;
    }
    this.editingId = null;
    this.form.reset({ category: 'Goods', status: 'Draft', estimatedBudget: 0 });
    this.showForm = true;
  }

  openEdit(t: Tender): void {
    this.editingId = t._id!;
    this.form.patchValue({
      ...t,
      publicationDate: t.publicationDate?.substring(0, 10),
      submissionDeadline: t.submissionDeadline?.substring(0, 10)
    });
    this.showForm = true;
  }

  cancel(): void {
    this.showForm = false;
    this.editingId = null;
  }

  save(): void {
    if (!this.isAdmin) {
      this.snackBar.open('Only the admin can save tender records.', 'Close', { duration: 2200 });
      return;
    }
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    const payload = this.form.value;
    const op = this.editingId
      ? this.tenderService.update(this.editingId, payload)
      : this.tenderService.create(payload);

    op.subscribe({
      next: () => {
        this.snackBar.open(this.editingId ? 'Tender updated' : 'Tender created', 'Close', { duration: 2500 });
        this.showForm = false;
        this.load();
      },
      error: (err) => this.snackBar.open(err?.error?.message || 'Save failed', 'Close', { duration: 3000 })
    });
  }

  remove(t: Tender): void {
    if (!confirm(`Delete tender ${t.tenderId}?`)) return;
    this.tenderService.delete(t._id!).subscribe(() => {
      this.snackBar.open('Tender deleted', 'Close', { duration: 2000 });
      this.load();
    });
  }

  statusClass(status: string): string {
    return 'status-' + status.toLowerCase().replace(/\s+/g, '-');
  }
}
