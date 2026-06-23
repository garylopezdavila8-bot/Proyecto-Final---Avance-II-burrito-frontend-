import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-admin-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class AdminLogin implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly router = inject(Router);
  private readonly authService = inject(AuthService);

  loginForm = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]],
  });

  submitted = false;
  loading = signal(false);
  errorMessage = signal('');

  ngOnInit(): void {
    if (this.authService.isAdmin()) {
      this.router.navigate(['/burritoadministrador/dash']);
    }
  }

  get f() {
    return this.loginForm.controls;
  }

  onSubmit(): void {
    this.submitted = true;
    this.errorMessage.set('');

    if (this.loginForm.invalid) {
      return;
    }

    const { email, password } = this.loginForm.value;
    this.loading.set(true);

    this.authService.login(email!, password!).subscribe({
      next: (response) => {
        this.loading.set(false);
        if (response.rol !== 'admin') {
          this.authService.logout('/burritoadministrador/login');
          this.errorMessage.set('Esta cuenta no tiene permisos de administrador.');
          return;
        }
        this.router.navigate(['/burritoadministrador/dash']);
      },
      error: (err) => {
        this.loading.set(false);
        this.errorMessage.set(err.error?.message ?? 'Credenciales inválidas.');
      },
    });
  }
}
