import {
  Component,
  OnInit,
  Input,
  Output,
  EventEmitter,
  OnChanges,
  SimpleChanges
} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { PricingService } from '../../../services/pricing.service';
import { ToastService } from '../../../services/toast.service';
import { Pricing } from '../pricing/pricing.model';

@Component({
  selector: 'app-pricing',
  templateUrl: './pricing.component.html',
  styleUrl: './pricing.component.css'
})
export class PricingComponent implements OnInit, OnChanges {
  @Input() stockId!: number;
  @Output() pricingUpdated = new EventEmitter<void>();

  pricingForm!: FormGroup;

  currentPrice: number | null = null;
  currentPricingId: number | null = null;
  isSubmitting = false;

  constructor(
    private fb: FormBuilder,
    private pricingService: PricingService,
    private toast: ToastService
  ) {}

  /* -------------------- lifecycle -------------------- */

  ngOnInit(): void {
    this.initForm();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['stockId'] && changes['stockId'].currentValue) {
      this.loadCurrentPrice();
    }
  }

  /* -------------------- form -------------------- */

  private initForm(): void {
    this.pricingForm = this.fb.group({
      price: ['', [Validators.required, Validators.min(1)]],
    });
  }

  /* -------------------- data -------------------- */

  private loadCurrentPrice(): void {
  if (!this.stockId) return;

  this.pricingService.getPricingByStock(this.stockId).subscribe({
    next: (pricing) => {
      if (pricing?.id) {
        this.currentPricingId = pricing.id;
        this.currentPrice = pricing.price;
        this.pricingForm.patchValue({ price: pricing.price });
      } else {
        this.resetPricingState();
      }
    },
    error: (err) => {
      if (err.status === 404) {
        // no pricing exists yet
        this.resetPricingState();
      } else {
        this.toast.error('Failed to load pricing');
      }
    }
  });
}


  private resetPricingState(): void {
    this.currentPricingId = null;
    this.currentPrice = null;
    this.pricingForm.reset();
  }

  /* -------------------- submit -------------------- */

  submitPrice(): void {
    if (this.pricingForm.invalid || this.isSubmitting) {
      this.pricingForm.markAllAsTouched();
      return;
    }

    this.isSubmitting = true;

    const payload: Pricing = {
      stockId: this.stockId,
      price: this.pricingForm.value.price,
    };

    const request$ = this.currentPricingId
      ? this.pricingService.updatePricing(this.currentPricingId, payload)
      : this.pricingService.createPricing(payload);

    request$.subscribe({
      next: () => {
        this.toast.success(
          this.currentPricingId
            ? 'Price updated successfully!'
            : 'Price saved successfully!'
        );

        // Always re-sync from backend (source of truth)
        this.loadCurrentPrice();
        this.pricingUpdated.emit();
      },
      error: () => this.toast.error('Failed to save price'),
      complete: () => (this.isSubmitting = false),
    });
  }
}
