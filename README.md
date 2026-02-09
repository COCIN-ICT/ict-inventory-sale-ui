#  ICT Inventory & Sales Management System

[![Angular](https://img.shields.io/badge/Angular-17.2.0-red.svg)](https://angular.io/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.3.2-blue.svg)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4.17-38bdf8.svg)](https://tailwindcss.com/)
[![License](https://img.shields.io/badge/License-Private-yellow.svg)](LICENSE)

A comprehensive **Inventory and Sales Management System** built with Angular 17, designed for managing purchase orders, sales orders, inventory, suppliers, budgets, and financial transactions. This enterprise-grade application provides a complete solution for inventory control, sales processing, and business operations management.

---

##  Table of Contents

- [Features](#-features)
- [Technology Stack](#-technology-stack)
- [Prerequisites](#-prerequisites)
- [Installation](#-installation)
- [Configuration](#-configuration)
- [Running the Application](#-running-the-application)
- [Project Structure](#-project-structure)
- [Key Modules](#-key-modules)
- [API Integration](#-api-integration)
- [Authentication & Authorization](#-authentication--authorization)
- [Development Guidelines](#-development-guidelines)
- [Building for Production](#-building-for-production)
- [Testing](#-testing)
- [Contributing](#-contributing)
- [Support](#-support)

---

## Features

###  Point of Sale (POS)
- **Sales Orders Management**: Create, view, and manage sales orders with customer information
- **Sales Items**: Manage sales items and inventory
- **Sales Credit**: Handle credit transactions and payments
- **Sales Promotions**: Create and manage promotional offers

###  Purchase Management
- **Purchase Orders**: Complete workflow from creation to receiving
  - Order creation with budget integration
  - Vetting and approval process
  - Order receiving and clearing
  - Status tracking (Pending, Vetted, Approved, Received, Completed, etc.)
- **Purchase Quotations**: Manage purchase quotations
- **Purchase Items**: Track purchased items

###  Inventory Management
- **Items Management**: Comprehensive item management with categories and units
- **Stock Transfer**: Transfer stock between units/stores
- **Store Management**: Manage multiple stores and warehouses
- **Stock Details**: Real-time stock level tracking
- **Pricing Management**: Configure and manage item pricing

###  Financial Management
- **Budget Management**: Create and manage budgets with line items
- **Other Expenses**: Track miscellaneous expenses with budget line item integration
- **Other Income**: Record various income sources with payment methods
- **Bank Accounts**: Manage bank account information
- **Financial Reports**: Generate comprehensive financial reports

###  User & Supplier Management
- **User Management**: Complete user administration
  - User creation and management
  - Role-based access control (RBAC)
  - Permission management
  - Department management
  - Unit management
  - User deactivation
- **Supplier Management**: 
  - Supplier CRUD operations
  - Supplier history tracking
  - Outstanding payments management
  - Active supplier management

###  Reports & Analytics
- **Purchase Order Reports**: Filter by status, date range, and unit
- **Production Order Reports**: Track production metrics
- **Sales Order Reports**: Analyze sales performance
- **Custom Date Range Filtering**: Flexible reporting options

### Production Management
- **Production Orders**: Manage production workflows
- **Production Input Items**: Track production inputs

###  Security Features
- JWT-based authentication with refresh tokens
- Role-based access control (RBAC)
- Protected routes with authentication guards
- Automatic token refresh
- Session management

---

## 🛠 Technology Stack

### Frontend Framework
- **Angular 17.2.0** - Modern web framework
- **TypeScript 5.3.2** - Type-safe JavaScript
- **RxJS 7.8.0** - Reactive programming

### UI/UX
- **Tailwind CSS 3.4.17** - Utility-first CSS framework
- **Angular Material 17.3.10** - Material Design components
- **Lucide Angular** - Modern icon library
- **Toastify.js** - Elegant toast notifications

### State Management
- **NgRx Store** - Predictable state container
- **NgRx Effects** - Side effect management
- **NgRx Store DevTools** - Development tools

### HTTP & API
- **Angular HttpClient** - HTTP client with interceptors
- **Axios** - HTTP client library
- **OpenAPI Generator** - Auto-generated API client

### Development Tools
- **Angular CLI 17.2.0** - Development toolkit
- **Karma & Jasmine** - Testing framework
- **PostCSS & Autoprefixer** - CSS processing

### Server-Side Rendering
- **Angular SSR** - Server-side rendering support
- **Express.js** - Node.js server framework

---

##  Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (v18.x or higher) - [Download](https://nodejs.org/)
- **npm** (v9.x or higher) - Comes with Node.js
- **Angular CLI** (v17.2.0) - Install globally: `npm install -g @angular/cli@17.2.0`
- **Git** - [Download](https://git-scm.com/)

### Verify Installation

```bash
node --version    # Should be v18.x or higher
npm --version     # Should be v9.x or higher
ng version        # Should be 17.2.0
```

---

##  Installation

### 1. Clone the Repository

```bash
git clone https://github.com/COCIN-ICT/ict-inventory-sale-ui.git
cd ict-inventory-sale-ui
```

### 2. Install Dependencies

```bash
npm install
```

This will install all required packages listed in `package.json`.

### 3. Verify Installation

```bash
ng version
```

You should see Angular CLI version information.

---

##  Configuration

### Environment Configuration

The application uses environment files for configuration. Update the API URL in:

**`src/environments/environment.ts`** (Development):
```typescript
export const environment = {
  production: false,
  apiUrl: 'http://localhost:8080/api/v1'
};
```

**`src/environments/environment.prod.ts`** (Production):
```typescript
export const environment = {
  production: true,
  apiUrl: 'https://your-api-domain.com/api/v1'
};
```

### Proxy Configuration

For development, the application uses a proxy configuration file (`proxy.conf.json`) to handle CORS and API routing. Ensure your backend API is running on the configured port.

---

##  Running the Application

### Development Server

Start the development server with proxy configuration:

```bash
npm start
# or
ng serve --proxy-config proxy.conf.json
```

The application will be available at:
- **URL**: `http://localhost:4200`
- **Auto-reload**: Enabled (changes will automatically refresh)

### Development Server (Alternative)

If you prefer to run without proxy:

```bash
ng serve
```

### Build and Watch

Build the project and watch for changes:

```bash
npm run watch
# or
ng build --watch --configuration development
```

---

##  Project Structure

```
ict-inventory-sale-ui/
├── src/
│   ├── app/
│   │   ├── api/                    # Auto-generated API client (OpenAPI)
│   │   ├── auth/                   # Authentication module
│   │   │   ├── auth.guard.ts      # Route protection
│   │   │   ├── auth.service.ts    # Auth service
│   │   │   └── login/             # Login component
│   │   ├── dashboard/
│   │   │   └── pages/             # Feature modules (lazy-loaded)
│   │   │       ├── point-of-sale/ # POS landing page
│   │   │       ├── sales-order/   # Sales order management
│   │   │       ├── purchase-order/# Purchase order management
│   │   │       ├── items-management/
│   │   │       ├── other-expense/
│   │   │       ├── other-income/
│   │   │       ├── reports/
│   │   │       └── ...            # 30+ feature modules
│   │   ├── layout/                # Layout components
│   │   │   ├── sidebar/          # Navigation sidebar
│   │   │   ├── header/           # App header
│   │   │   ├── footer/           # App footer
│   │   │   └── main/             # Main layout wrapper
│   │   ├── services/             # Business logic services
│   │   │   ├── sales-order.service.ts
│   │   │   ├── purchase-order.service.ts
│   │   │   ├── auth.service.ts
│   │   │   └── ...              # 30+ services
│   │   ├── shared/              # Shared components/pipes
│   │   │   └── confirm-dialog/  # Reusable dialog component
│   │   ├── store/               # NgRx state management
│   │   │   └── auth/            # Auth state
│   │   ├── app-routing.module.ts # Main routing configuration
│   │   ├── app.module.ts        # Root module
│   │   └── auth.interceptor.ts  # HTTP interceptor
│   ├── assets/                  # Static assets
│   ├── environments/           # Environment configurations
│   └── styles.css              # Global styles
├── angular.json                # Angular configuration
├── package.json               # Dependencies
├── tailwind.config.js         # Tailwind CSS configuration
├── tsconfig.json              # TypeScript configuration
└── proxy.conf.json            # Proxy configuration
```

---

##  Key Modules

### Point of Sale (POS)
- **Route**: `/home/point-of-sale`
- **Features**: Sales orders, sales items, sales credit, sales promotions
- **Components**: Landing page with card-based navigation

### Purchase Orders
- **Route**: `/home/purchase-order`
- **Features**: Create, vet, approve, receive, clear purchase orders
- **Workflow**: Multi-stage approval process with budget integration

### Sales Orders
- **Route**: `/home/pos/sales-orders`
- **Features**: Create sales orders with customer management
- **Components**: List, create, details views

### Items Management
- **Route**: `/home/items-management`
- **Features**: Items, categories, unit of measures
- **Layout**: Card-based navigation

### Financial Management
- **Other Expenses**: `/home/other-expense`
- **Other Income**: `/home/other-income`
- **Budget**: `/home/budget`
- **Bank Accounts**: `/home/bank-account`

### Reports
- **Route**: `/home/reports`
- **Features**: Purchase, production, and sales order reports
- **Filtering**: Date range, status, unit filtering

---

##  API Integration

### Service Pattern

Services follow a consistent pattern:

```typescript
@Injectable({ providedIn: 'root' })
export class FeatureService {
  private base = environment.apiUrl || '';
  
  constructor(private http: HttpClient) {}
  
  getAll(params?: any): Observable<any> {
    let httpParams = new HttpParams();
    if (params) {
      Object.keys(params).forEach(key => {
        if (params[key] !== null && params[key] !== undefined) {
          httpParams = httpParams.set(key, params[key].toString());
        }
      });
    }
    return this.http.get(`${this.base}/feature`, { params: httpParams });
  }
  
  getById(id: number): Observable<any> {
    return this.http.get(`${this.base}/feature/${id}`);
  }
  
  create(payload: any): Observable<any> {
    return this.http.post(`${this.base}/feature`, payload);
  }
}
```

### API Base URL

**Important**: The `environment.apiUrl` already includes `/api/v1`, so services should NOT add it again.

**Correct**:
```typescript
return this.http.get(`${this.base}/sales/order`);
```

### HTTP Interceptor

The `AuthInterceptor` automatically:
- Adds Bearer token to requests
- Handles 401 errors with token refresh
- Manages token refresh queue
- Shows error notifications

---

## Authentication & Authorization

### Authentication Flow

1. **Login**: User submits credentials
2. **Token Storage**: JWT token and refresh token stored in localStorage
3. **Request Interception**: Token automatically added to API requests
4. **Token Refresh**: Automatic refresh on 401 errors
5. **Logout**: Clears tokens and redirects to login

### Role-Based Access Control (RBAC)

```typescript
// In templates
*ngIf="authService.hasRole(['ADMIN'])"

// In components
if (this.authService.hasRole(['ADMIN', 'MANAGER'])) {
  // Admin or Manager logic
}
```

### Protected Routes

Routes are protected using `AuthGuard`:

```typescript
{ 
  path: 'home', 
  component: MainComponent, 
  canActivate: [AuthGuard],
  children: [...]
}
```

---

##  Development Guidelines

### Code Style

- **TypeScript**: Strict mode enabled
- **Components**: Use Angular Material and Tailwind CSS
- **Services**: Injectable with `providedIn: 'root'`
- **Forms**: Reactive forms with FormBuilder
- **Observables**: Proper subscription management




### Error Handling

```typescript
this.service.create(payload).subscribe({
  next: (response) => {
    this.toast.success('Operation successful');
    this.router.navigate(['/home/feature/list']);
  },
  error: (error) => {
    console.error('Error:', error);
    this.toast.error('Operation failed. Please try again.');
  }
});
```

---


### Build Command

```bash
npm run build
# or
ng build --configuration production
```

### Output

The build artifacts will be stored in the `dist/pims/` directory.

### Server-Side Rendering (SSR)

Build for SSR:

```bash
ng build --configuration production
npm run serve:ssr:pims
```

---

##  Testing

### Unit Tests

Run unit tests via Karma:

```bash
npm test
# or
ng test
```

### Code Coverage

```bash
ng test --code-coverage
```

Coverage reports will be generated in `coverage/` directory.

---



### Contribution Guidelines

- Follow Angular style guide
- Write meaningful commit messages
- Add tests for new features
- Update documentation as needed
- Ensure all tests pass

---

## 📝 License

This project is private and proprietary. All rights reserved.

---



## Project Status

 **Active Development** - The project is actively maintained and developed.

**Current Version**: 0.0.0  
**Last Updated**: 2024

---

