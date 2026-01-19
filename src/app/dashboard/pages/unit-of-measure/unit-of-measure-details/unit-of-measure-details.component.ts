import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { UnitOfMeasureService, UnitOfMeasureResponse } from '../../../../services/unit-of-measure.service';

@Component({
  selector: 'app-unit-of-measure-details',
  templateUrl: './unit-of-measure-details.component.html',
  styleUrl: './unit-of-measure-details.component.css'
})
export class UnitOfMeasureDetailsComponent implements OnInit {
  unitOfMeasure?: UnitOfMeasureResponse;
  loading = false;
  errorMessage = '';

  constructor(
    private unitOfMeasureService: UnitOfMeasureService,
    private router: Router,
    private route: ActivatedRoute
  ) { }

  ngOnInit(): void {
    this.loadUnitOfMeasure();
  }

  loadUnitOfMeasure() {
    this.route.params.subscribe(params => {
      const unitOfMeasureId = +params['id'];
      if (unitOfMeasureId) {
        this.loading = true;
        this.errorMessage = '';

        this.unitOfMeasureService.getUnitOfMeasureById(unitOfMeasureId).subscribe({
          next: (response: UnitOfMeasureResponse) => {
            console.log('Unit of measure details loaded:', response);
            this.unitOfMeasure = response;
            this.loading = false;
          },
          error: (error) => {
            console.error('Error loading unit of measure details:', error);
            this.errorMessage = 'Failed to load unit of measure details. Please try again.';
            this.loading = false;
          }
        });
      }
    });
  }

  editUnitOfMeasure() {
    if (this.unitOfMeasure?.id) {
      this.router.navigate(['/dashboard/unit-of-measure/edit', this.unitOfMeasure.id]);
    }
  }

  goBack() {
    this.router.navigate(['/home/unit-of-measure/all']);
  }

  goBackToItemsManagement(): void {
    this.router.navigate(['/home/items-management']);
  }

  formatDate(dateString?: string): string {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }
} 