import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { PricingService } from '../../../services/pricing.service';
import { HttpClient } from '@angular/common/http';
import { ToastService } from '../../../services/toast.service';
import { Pricing } from '../pricing/pricing.model';


@Component({
  selector: 'app-pricing',
  templateUrl: './pricing.component.html',
  styleUrl: './pricing.component.css'
})
export class PricingComponent {
  pricingForm!: FormGroup;
  availableStock: any;
  stocks: any[] = [];
  isSubmitting = false;
  message = '';

  constructor(
    private fb: FormBuilder,
    private pricingService: PricingService,
    private toast: ToastService,
    private http: HttpClient
  ) {}

  ngOnInit(): void {
    this.pricingForm = this.fb.group({
      availableStock: ['', Validators.required],
      price: ['', [Validators.required, Validators.min(1)]],
    });

    this.loadStock();

  }

  loadStock(): void {
    this.pricingService.getStock().subscribe({
      next: (stock) => (this.stocks = stock),
      error: (err) => console.log('Failed to load stock', err),
    });
  }

  onSubmit(): void {
    if(this.pricingForm.invalid) return;

    this.isSubmitting = true;
    this.message = '';

    const payload: Pricing = {
      stockId: this.pricingForm.value.availableStock,
      price: this.pricingForm.value.price,
    };

    this.pricingService.createPricing(payload).subscribe({
      next: (response) => {
        this.toast.success('Pricing created successfully');
        this.pricingForm.reset();
        this.loadStock();
        this.isSubmitting = false;
      },
      error: (err) => {
        this.toast.error(err.error.message);
        this.isSubmitting = false;
      },
    });
  }

  






}
