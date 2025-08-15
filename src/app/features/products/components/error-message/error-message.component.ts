import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-error-message',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatButtonModule, MatIconModule],
  template: `
    <mat-card class="error-card" *ngIf="error">
      <mat-card-content class="error-content">
        <div class="error-header">
          <mat-icon class="error-icon">error_outline</mat-icon>
          <h3>{{ title || 'Error' }}</h3>
        </div>

        <p class="error-message">{{ error }}</p>

        <div class="error-actions" *ngIf="showRetry">
          <button mat-raised-button color="primary" (click)="onRetry()">
            <mat-icon>refresh</mat-icon>
            Reintentar
          </button>
        </div>
      </mat-card-content>
    </mat-card>
  `,
  styles: [
    `
      .error-card {
        margin: 16px 0;
        background-color: #ffebee;
        border-left: 4px solid #f44336;
      }

      .error-content {
        padding: 20px;
      }

      .error-header {
        display: flex;
        align-items: center;
        gap: 12px;
        margin-bottom: 12px;
      }

      .error-icon {
        color: #f44336;
        font-size: 24px;
        width: 24px;
        height: 24px;
      }

      .error-header h3 {
        margin: 0;
        color: #c62828;
        font-size: 16px;
        font-weight: 500;
      }

      .error-message {
        margin: 0 0 16px 0;
        color: #666;
        line-height: 1.5;
      }

      .error-actions {
        display: flex;
        justify-content: flex-end;
      }
    `,
  ],
})
export class ErrorMessageComponent {
  @Input() error: string | null = null;
  @Input() title?: string;
  @Input() showRetry: boolean = true;
  @Output() retry = new EventEmitter<void>();

  onRetry(): void {
    this.retry.emit();
  }
}
