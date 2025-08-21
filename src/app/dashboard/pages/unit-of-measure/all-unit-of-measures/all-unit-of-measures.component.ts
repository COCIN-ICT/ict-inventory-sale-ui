import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UnitOfMeasureService, UnitOfMeasureResponse } from '../../../../services/unit-of-measure.service';

@Component({
  selector: 'app-all-unit-of-measures',
  templateUrl: './all-unit-of-measures.component.html',
  styleUrl: './all-unit-of-measures.component.css'
})
export class AllUnitOfMeasuresComponent implements OnInit {
  unitOfMeasures: UnitOfMeasureResponse[] = [];
  loading = false;
  errorMessage = '';

  constructor(
    private unitOfMeasureService: UnitOfMeasureService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.loadUnitOfMeasures();
  }

  loadUnitOfMeasures() {
    this.loading = true;
    this.errorMessage = '';

    this.unitOfMeasureService.getAllUnitOfMeasures().subscribe({
      next: (response: UnitOfMeasureResponse[]) => {
        console.log('Unit of measures response:', response);
        this.unitOfMeasures = response || [];
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading unit of measures:', error);
        this.errorMessage = 'Failed to load unit of measures. Please try again.';
        this.loading = false;
      }
    });
  }

  viewUnitOfMeasure(id: number) {
    this.router.navigate(['/home/unit-of-measure/view', id]);
  }

  editUnitOfMeasure(id: number) {
    this.router.navigate(['/home/unit-of-measure/edit', id]);
  }

  createNewUnitOfMeasure() {
    this.router.navigate(['/home/unit-of-measure/create']);
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