import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { DocumentService } from '../../core/services/document.service';
import { TenderService } from '../../core/services/tender.service';
import { ProcureDocument, Tender } from '../../core/models/models';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-documents',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatCardModule,
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    MatFormFieldModule,
    MatSelectModule,
    MatSnackBarModule,
    MatTooltipModule
  ],
  templateUrl: './documents.component.html',
  styleUrl: './documents.component.css'
})
export class DocumentsComponent implements OnInit {
  documents: ProcureDocument[] = [];
  tenders: Tender[] = [];
  columns = ['tender', 'docType', 'originalName', 'uploadDate', 'actions'];
  docTypes = ['Tender Notice', 'Terms & Conditions', 'Technical Specification', 'Evaluation Report', 'Other'];

  selectedTenderId = '';
  selectedDocType = 'Tender Notice';
  selectedFile: File | null = null;
  tenderFilter = '';

  constructor(
    private documentService: DocumentService,
    private tenderService: TenderService,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.tenderService.getAll().subscribe((data) => (this.tenders = data));
    this.load();
  }

  load(): void {
    this.documentService.getAll(this.tenderFilter).subscribe((data) => (this.documents = data));
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.selectedFile = input.files?.[0] || null;
  }

  upload(): void {
    if (!this.selectedTenderId || !this.selectedFile) {
      this.snackBar.open('Please choose a tender and a file first', 'Close', { duration: 2500 });
      return;
    }
    const formData = new FormData();
    formData.append('tender', this.selectedTenderId);
    formData.append('docType', this.selectedDocType);
    formData.append('file', this.selectedFile);

    this.documentService.upload(formData).subscribe({
      next: () => {
        this.snackBar.open('Document uploaded', 'Close', { duration: 2500 });
        this.selectedFile = null;
        this.load();
      },
      error: (err) => this.snackBar.open(err?.error?.message || 'Upload failed', 'Close', { duration: 3000 })
    });
  }

  download(doc: ProcureDocument): void {
    window.open(this.documentService.downloadUrl(doc._id!), '_blank');
  }

  remove(doc: ProcureDocument): void {
    if (!confirm(`Delete "${doc.originalName}"?`)) return;
    this.documentService.delete(doc._id!).subscribe(() => {
      this.snackBar.open('Document deleted', 'Close', { duration: 2000 });
      this.load();
    });
  }

  nameOfTender(entity: any): string {
    return typeof entity === 'string' ? entity : `${entity?.tenderId} - ${entity?.title}`;
  }
}
