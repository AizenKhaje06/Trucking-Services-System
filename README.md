# TruckFlow - Professional Trucking Management System

A comprehensive web-based platform for managing trucking operations, deliveries, expenses, and profitability. Built with Next.js, React, and Google Sheets integration.

## Features

### Core Features (v1.0)
- **Role-Based Authentication**: Separate Owner and Employee portals
- **Material Management**: Define materials with pricing and costs
- **Delivery Recording**: Employees record daily deliveries with real-time profit calculation
- **Truck Fleet Management**: Register and manage trucks with capacity and driver assignment
- **Expense Tracking**: Record operational expenses by category
- **Transaction Management**: Complete transaction history with filtering and search
- **Profit Analytics**: Multi-dimensional profit analysis (per transaction, truck, employee, material, month)
- **EOD Summaries**: Daily end-of-day summaries with verification and locking
- **Monthly Reports**: Comprehensive monthly analytics with export capability
- **Session Management**: Secure sessions with 30-minute idle timeout
- **Backup & Recovery**: Export data to Excel with Google Sheets version history

### Dashboard Features
- **Owner Dashboard**: Complete fleet management and analytics
- **Employee Portal**: Delivery recording and personal earnings tracking
- **Real-Time Analytics**: Live profit calculations and trend analysis
- **Advanced Filtering**: Filter data by date, truck, material, employee, location
- **Responsive Design**: Works on desktop and tablet devices

## Tech Stack

- **Frontend**: React 18, Next.js 15, TypeScript
- **Styling**: Tailwind CSS v4, shadcn/ui components
- **Backend**: Next.js API Routes, Server Actions
- **Database**: Google Sheets (via Google Sheets API)
- **Authentication**: Session-based with HTTP-only cookies
- **Deployment**: Vercel

## Getting Started

### Prerequisites
- Node.js 18+
- Google Sheets API credentials
- Vercel account (for deployment)

### Installation

1. **Clone the repository**
   \`\`\`bash
   git clone <your-repo-url>
   cd trucking-app
   npm install
   \`\`\`

2. **Set up environment variables**
   Create `.env.local`:
   \`\`\`
   GOOGLE_SHEETS_ID=your_spreadsheet_id
   GOOGLE_PROJECT_ID=your_project_id
   GOOGLE_PRIVATE_KEY=your_private_key
   GOOGLE_CLIENT_EMAIL=your_client_email
   \`\`\`

3. **Run development server**
   \`\`\`bash
   npm run dev
   \`\`\`
   Open http://localhost:3000

### Demo Credentials

**Fleet Owner**
- Account: OWN001
- Password: owner123

**Driver/Employee**
- Account: EMP001
- Password: emp123

## Project Structure

\`\`\`
trucking-app/
├── app/
│   ├── page.tsx                 # Login page
│   ├── owner-dashboard/         # Owner dashboard
│   ├── employee-portal/         # Employee portal
│   ├── api/
│   │   ├── auth/               # Authentication endpoints
│   │   ├── transactions/       # Transaction management
│   │   ├── deliveries/         # Delivery operations
│   │   ├── expenses/           # Expense tracking
│   │   ├── trucks/             # Truck management
│   │   ├── materials/          # Material management
│   │   ├── profit/             # Profit calculations
│   │   ├── eod/                # End-of-day summaries
│   │   ├── reports/            # Report generation
│   │   └── backup/             # Backup & export
│   └── globals.css             # Global styles
├── components/
│   ├── ui/                     # shadcn/ui components
│   ├── delivery-form-enhanced.tsx
│   ├── expense-manager.tsx
│   ├── truck-manager.tsx
│   ├── transaction-reporting.tsx
│   ├── profit-visibility-dashboard.tsx
│   ├── eod-summary-panel.tsx
│   ├── monthly-report-viewer.tsx
│   ├── backup-manager.tsx
│   ├── idle-timeout-warning.tsx
│   └── ...
├── lib/
│   ├── auth.ts                 # Session management
│   ├── google-sheets.ts        # Google Sheets API
│   ├── transactions.ts         # Transaction utilities
│   ├── deliveries.ts           # Delivery utilities
│   ├── expenses.ts             # Expense utilities
│   ├── trucks.ts               # Truck utilities
│   ├── materials.ts            # Material utilities
│   ├── profit-calculator.ts    # Profit calculations
│   ├── eod-summary.ts          # EOD utilities
│   ├── monthly-report.ts       # Report generation
│   ├── backup-export.ts        # Backup utilities
│   └── utils.ts                # Helper functions
├── hooks/
│   ├── use-auth.ts             # Authentication hook
│   └── use-mobile.ts           # Mobile detection
├── middleware.ts               # Route protection
├── DEPLOYMENT.md               # Deployment guide
├── MAINTENANCE.md              # Maintenance guide
├── ROADMAP.md                  # Future features
└── README.md                   # This file
\`\`\`

## Key Workflows

### Employee Delivery Recording
1. Employee logs in to portal
2. Clicks "Record Delivery"
3. Selects material, truck, quantity, customer, location
4. System calculates profit automatically
5. Submits delivery record
6. Data syncs to Google Sheets

### Owner Analytics
1. Owner logs in to dashboard
2. Selects date range and filters
3. Views real-time profit calculations
4. Analyzes trends and performance
5. Exports reports to Excel
6. Makes data-driven decisions

### Session Management
1. User logs in with credentials
2. Session created with 24-hour expiry
3. Idle timeout warning at 25 minutes
4. Auto-logout after 30 minutes of inactivity
5. User can extend session or logout manually

## API Endpoints

### Authentication
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout
- `GET /api/auth/session` - Get current session
- `POST /api/auth/verify` - Verify authentication
- `POST /api/auth/activity` - Update activity timestamp

### Transactions
- `GET /api/transactions/list` - List all transactions
- `POST /api/transactions/create` - Create transaction
- `GET /api/transactions/filter` - Filter transactions
- `GET /api/transactions/summary` - Get summary

### Deliveries
- `POST /api/deliveries/create` - Record delivery
- `GET /api/deliveries/list` - List deliveries
- `POST /api/deliveries/update-status` - Update status

### Expenses
- `POST /api/expenses/create` - Record expense
- `GET /api/expenses/list` - List expenses

### Reports
- `GET /api/reports/monthly` - Get monthly report
- `GET /api/eod/summary` - Get EOD summary
- `POST /api/backup/export` - Export backup

## Configuration

### Google Sheets Setup
1. Create Google Cloud project
2. Enable Google Sheets API
3. Create service account
4. Download credentials JSON
5. Add to Vercel environment variables

### Vercel Deployment
1. Connect GitHub repository
2. Add environment variables
3. Deploy automatically on push
4. Monitor deployments in dashboard

## Security

- **Session Security**: HTTP-only cookies, secure flag in production
- **Role-Based Access**: Owner and Employee roles strictly enforced
- **Data Isolation**: Employees only see their own data
- **API Protection**: All endpoints validate session and role
- **Credential Management**: Credentials stored in Vercel, never in code

## Performance

- **Caching**: Client-side caching with SWR
- **Optimization**: Lazy loading and code splitting
- **Database**: Google Sheets with efficient queries
- **API**: Optimized endpoints with filtering

## Backup & Recovery

- **Automatic Backup**: Google Sheets version history
- **Manual Export**: Export to Excel anytime
- **Recovery**: Restore from version history instantly
- **No Data Loss**: All data persists on redeploy

## Deployment

### Development
\`\`\`bash
npm run dev
\`\`\`

### Production Build
\`\`\`bash
npm run build
npm start
\`\`\`

### Deploy to Vercel
\`\`\`bash
git push origin main
# Vercel auto-deploys
\`\`\`

See [DEPLOYMENT.md](./DEPLOYMENT.md) for detailed instructions.

## Maintenance

See [MAINTENANCE.md](./MAINTENANCE.md) for:
- Daily operations checklist
- Weekly maintenance tasks
- Monthly reviews
- Quarterly planning
- Disaster recovery procedures

## Future Features

See [ROADMAP.md](./ROADMAP.md) for planned features:
- Printable invoices and waybills
- Mobile app adaptation
- SMS/email notifications
- Manager role
- Advanced analytics
- Multi-company support
- API integrations

## Troubleshooting

### Login Issues
- Verify credentials in Google Sheets
- Check account number and password
- Ensure user role is correct

### Missing Data
- Check Google Sheets for data
- Verify sheet names
- Check browser console for errors

### Performance Issues
- Clear browser cache
- Check API quota usage
- Review Vercel logs

See [DEPLOYMENT.md](./DEPLOYMENT.md) for more troubleshooting.

## Support

- **Documentation**: See DEPLOYMENT.md and MAINTENANCE.md
- **Issues**: Report bugs on GitHub
- **Features**: Request features on GitHub
- **Questions**: Check documentation first

## License

Proprietary - All rights reserved

## Version History

- **v1.0** (Current) - Initial release with core features
- **v1.1** (Planned) - Mobile adaptation and SMS notifications
- **v2.0** (Planned) - Manager role and advanced analytics

## Contributing

Contributions welcome! Please:
1. Fork the repository
2. Create feature branch
3. Commit changes
4. Push to branch
5. Create pull request

## Changelog

### v1.0 - Initial Release
- Core authentication and session management
- Material and truck management
- Delivery recording system
- Expense tracking
- Profit calculations and analytics
- EOD summaries and monthly reports
- Backup and export functionality
- Idle timeout and session management
- Comprehensive documentation

---

Built with ❤️ for trucking professionals
