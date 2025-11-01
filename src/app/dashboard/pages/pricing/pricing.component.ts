import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { PricingService } from '../../../services/pricing.service';
import { HttpClient } from '@angular/common/http';
import { ToastService } from '../../../services/toast.service';
import { Pricing } from '../pricing/pricing.model';
import { ActivatedRoute } from '@angular/router';


@Component({
  selector: 'app-pricing',
  templateUrl: './pricing.component.html',
  styleUrl: './pricing.component.css'
})
export class PricingComponent {
  pricingForm!: FormGroup;
  stockId!: number;
  isEditMode = false;
  buttonLabel = 'Save Price';
  constructor(
    private fb: FormBuilder,
    private pricingService: PricingService,
    private toast: ToastService,
    private route: ActivatedRoute
  ) {}

   ngOnInit(): void {
    this.initializeForm();
    this.getStockIdFromRoute();
    this.loadPricingByStockId();
  }

  initializeForm(): void {
    this.pricingForm = this.fb.group({
      price: ['', [Validators.required, Validators.min(1)]],
    });
  }

  getStockIdFromRoute(): void {
    this.stockId = Number(this.route.snapshot.paramMap.get('id'));
  }

  loadPricingByStockId(): void {
    this.pricingService.getPricingByStock(this.stockId).subscribe({
      next: (res) => {
        if (res && res.length > 0) {
          this.isEditMode = true;
          this.buttonLabel = 'Update Price';
          this.pricingForm.patchValue({ price: res[0].price });
        }
      },
      error: (err) => console.error('Error loading pricing', err),
    });
  }

  onSubmit(): void {
    if (this.pricingForm.invalid) {
      this.pricingForm.markAllAsTouched();
      return;
    }

    const formValue = this.pricingForm.value;
    const payload: Pricing = {
      stockId: this.stockId,
      price: formValue.price,
    };

    if (this.isEditMode) {
      this.updatePricing(payload);
    } else {
      this.createPricing(payload);
    }
  }

  createPricing(payload: Pricing): void {
    this.pricingService.createPricing(payload).subscribe({
      next: (res) => {
        alert('Price saved successfully!');
        this.isEditMode = true;
        this.buttonLabel = 'Update Price';
      },
      error: (err) => console.error('Error creating pricing', err),
    });
  }

  updatePricing(payload: Pricing): void {
    this.pricingService.updatePricing(this.stockId, payload).subscribe({
      next: (res) => {
        alert('Price updated successfully!');
      },
      error: (err) => console.error('Error updating pricing', err),
    });
  }

}
