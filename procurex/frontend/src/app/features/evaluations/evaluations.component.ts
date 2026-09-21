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
import { EvaluationService } from '../../core/services/evaluation.service';
import { BidService } from '../../core/services/bid.service';
import { Bid, Evaluation } from '../../core/models/models';

@Component({
  selector: 'app-evaluations',
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
  templateUrl: './evaluations.component.html',
  styleUrl: './evaluations.component.css'
})
export class EvaluationsComponent implements OnInit {
  evaluations: Evaluation[] = [];
  bids: Bid[] = [];
  columns = ['tender', 'vendor', 'technicalScore', 'financialScore', 'overallScore', 'status', 'actions'];

  showForm = false;
  editingId: string | null = null;
  form: FormGroup;

  constructor(
    private fb: FormBuilder,
    private evaluationService: EvaluationService,
    private bidService: BidService,
    private snackBar: MatSnackBar
  ) {
    this.form = this.fb.group({
      bid: ['', Validators.required],
      technicalScore: [0, [Validators.required, Validators.min(0), Validators.max(100)]],
      financialScore: [0, [Validators.required, Validators.min(0), Validators.max(100)]],
      remarks: ['']
    });
  }

  ngOnInit(): void {
    this.bidService.getAll().subscribe((data) => (this.bids = data));
    this.load();
  }

  load(): void {
    // Sorted by overallScore desc from the API - this IS the ranking.
    this.evaluationService.getAll().subscribe((data) => (this.evaluations = data));
  }

  get previewScore(): number {
    const t = this.form.value.technicalScore || 0;
    const f = this.form.value.financialScore || 0;
    return Math.round((t * 0.6 + f * 0.4) * 100) / 100;
  }

  openCreate(): void {
    this.editingId = null;
    this.form.reset({ technicalScore: 0, financialScore: 0, remarks: '' });
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
    const payload = this.form.value;
    const bid = this.bids.find((b) => b._id === payload.bid);
    const body = {
      bid: payload.bid,
      tender: this.idOf(bid?.tender),
      vendor: this.idOf(bid?.vendor),
      technicalScore: payload.technicalScore,
      financialScore: payload.financialScore,
      remarks: payload.remarks
    };
    this.evaluationService.create(body).subscribe({
      next: () => {
        this.snackBar.open('Evaluation submitted', 'Close', { duration: 2500 });
        this.showForm = false;
        this.load();
      },
      error: (err) => this.snackBar.open(err?.error?.message || 'Save failed', 'Close', { duration: 3000 })
    });
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

  setStatus(e: Evaluation, status: 'Approved' | 'Rejected'): void {
    this.evaluationService.update(e._id!, { status }).subscribe(() => {
      this.snackBar.open(`Evaluation ${status.toLowerCase()}`, 'Close', { duration: 2000 });
      this.load();
    });
  }

  remove(e: Evaluation): void {
    if (!confirm('Delete this evaluation?')) return;
    this.evaluationService.delete(e._id!).subscribe(() => {
      this.snackBar.open('Evaluation deleted', 'Close', { duration: 2000 });
      this.load();
    });
  }

  statusClass(status: string): string {
    return 'status-' + status.toLowerCase().replace(/\s+/g, '-');
  }
}
