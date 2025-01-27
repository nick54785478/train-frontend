import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { SharedModule } from '../../../shared/shared.module';
import { CoreModule } from '../../../core/core.module';

@Component({
  selector: 'app-form-invalid',
  standalone: true,
  imports: [CommonModule, SharedModule, CoreModule],
  templateUrl: './form-invalid.component.html',
  styleUrl: './form-invalid.component.scss',
})
export class FormInvalidComponent {}
