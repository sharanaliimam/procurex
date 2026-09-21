import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { DashboardService } from '../../core/services/dashboard.service';
import { TenderService } from '../../core/services/tender.service';
import { ReportSummary, Tender } from '../../core/models/models';

@Component({
  selector: 'app-reports',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatTableModule,
    MatButtonModule
  ],
  templateUrl: './reports.component.html',
  styleUrl: './reports.component.css'
})
export class ReportsComponent implements OnInit {
  summary: ReportSummary | null = null;
  tenders: Tender[] = [];
  columns = ['tenderId', 'title', 'category', 'status', 'estimatedBudget', 'submissionDeadline'];

  categories = ['Goods', 'Works', 'Services', 'Consultancy'];
  statuses = ['Draft', 'Published', 'Under Evaluation', 'Awarded', 'Closed'];

  searchTerm = '';
  statusFilter = '';
  categoryFilter = '';

  constructor(private dashboardService: DashboardService, private tenderService: TenderService) {}

  ngOnInit(): void {
    this.dashboardService.getReportSummary().subscribe((data) => (this.summary = data));
    this.search();
  }

  search(): void {
    this.tenderService
      .getAll({ status: this.statusFilter, category: this.categoryFilter, search: this.searchTerm })
      .subscribe((data) => (this.tenders = data));
  }

  maxCount(items: { count: number }[]): number {
    return Math.max(1, ...items.map((i) => i.count));
  }

  maxAmount(): number {
    if (!this.summary) return 1;
    return Math.max(1, ...this.summary.byMonth.map((m) => m.totalAmount));
  }
}
