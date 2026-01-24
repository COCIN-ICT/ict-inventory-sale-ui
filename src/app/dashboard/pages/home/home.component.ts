import { Component, OnInit } from '@angular/core';
import { UserService } from '../../../services/user.service';
import { UnitService } from '../../../services/unit.service';
import { DepartmentsService } from '../../../services/departments.service';
import { User } from '../user-management/users/users.model';
import { QuickStatsService } from '../../../services/quick-stats-service.service';

interface RecentActivity {
  user: string;
  action: string;
  date: string;
  details: string;
}


@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent implements OnInit {

  recentActivities: RecentActivity[] = [];
  loadingActivity = true;


  totalUsers = 0;
  activeUsers = 0;
  deactivatedUsers = 0;

  totalUnits= 0;
  totalDepartments= 0;

  pendingProduction = 0;
  pendingPurchases = 0;

  loading = true;

  constructor(
    private userService: UserService, 
    private quickStatsService: QuickStatsService,
    private unitsService: UnitService,
    private departmentsService: DepartmentsService) { }
  
  ngOnInit(): void {
    this.loadUserStats();
    this.loadQuickStats();
    this.loadUnits();
    this.loadDepartments();
   // this.loadRecentActivityFromUsers();
  }

  loadQuickStats(): void {
    this.quickStatsService.getQuickStats().subscribe({
      next: (stats) => {
        this.pendingProduction = stats.pendingProductionOrders;
        this.pendingPurchases = stats.pendingPurchaseOrders;
      },
      error: (err) => {
        console.error('Error loading quick stats', err);
      }
    });
  }

  private loadUnits(): void{
    this.unitsService.getUnits().subscribe({
      next: (units: any[]) => {
        this.totalUnits = units.length;
      }
    })
  }

  private loadDepartments(): void{
    this.departmentsService.getDepartments().subscribe({
      next: (depts: any[]) => {
        this.totalDepartments = depts.length;
      }
    })
  }

  private loadUserStats(): void {
    this.userService.getUsers().subscribe({
      next: (users: any[]) => {
        this.totalUsers = users.length;

        this.activeUsers = users.filter(
          user => user.status === 'active'
        ).length;

        this.deactivatedUsers = users.filter(
          user => user.status === 'inactive'
        ).length;

        this.loading = false;
      },
      error: () => {
        this.loading = false;
      }
    });
  }
}
