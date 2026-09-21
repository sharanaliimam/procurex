import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { AuthService } from '../../core/services/auth.service';
import { VendorService } from '../../core/services/vendor.service';

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterLink,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatSnackBarModule
  ],
  templateUrl: './signup.component.html',
  styleUrl: './signup.component.css'
})
export class SignupComponent {
  form: FormGroup;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private vendorService: VendorService,
    private router: Router,
    private snackBar: MatSnackBar
  ) {
    this.form = this.fb.group({
      username: ['', [Validators.required, Validators.minLength(3)]],
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      company: ['', Validators.required],
      phone: ['', [Validators.required, Validators.minLength(8)]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const payload = this.form.value;
    const vendorPayload: {
      vendorName: string;
      company: string;
      email: string;
      phone: string;
      businessCategory: 'Goods' | 'Works' | 'Services' | 'Consultancy';
      status: 'Active' | 'Inactive' | 'Blacklisted';
    } = {
      vendorName: payload.name,
      company: payload.company,
      email: payload.email,
      phone: payload.phone,
      businessCategory: 'Goods',
      status: 'Active'
    };

    this.vendorService.create(vendorPayload).subscribe({
      next: () => {
        const saved = this.authService.signUp({
          username: payload.username,
          name: payload.name,
          email: payload.email,
          password: payload.password
        });

        if (!saved) {
          this.snackBar.open('That username or email is already in use.', 'Close', { duration: 2500 });
          return;
        }

        this.snackBar.open('Account created successfully.', 'Close', { duration: 2000 });
        this.router.navigateByUrl('/dashboard');
      },
      error: (err) => {
        this.snackBar.open(err?.error?.message || 'Could not create vendor profile.', 'Close', { duration: 3000 });
      }
    });
  }
}
