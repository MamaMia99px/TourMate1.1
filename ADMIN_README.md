# TouristApp Admin Panel - Government Edition

This document provides instructions for setting up and using the admin panel for the TouristApp, specifically designed for Local Government Unit (LGU) administration.

## Admin Role System

The admin panel has two distinct roles for proper governance:

### Reports Admin (View Only)
**Purpose**: Analytics and monitoring for general administrators
**Access**: Tourism reports and statistics only
**Emails**:
- `admin@touristapp.com`
- `superadmin@touristapp.com`  
- `reports.admin@touristapp.com`

### LGU Admin (Full Access)
**Purpose**: Content management for Local Government Unit officials
**Access**: Full content creation, editing, and management capabilities
**Emails**:
- `lgu.cebu@touristapp.com`
- `cebu.tourism@touristapp.com`
- `lgu.admin@touristapp.com`
- `tourism.officer@cebu.gov.ph`
- `content.manager@cebu.gov.ph`

## Authentication Process

To access the admin panel:
1. Create a Firebase account with one of the above email addresses
2. Log in through the main app login screen
3. System automatically detects admin role and redirects accordingly
4. Or navigate to Profile → Admin Panel (for existing admins)

## Admin Features by Role

### Reports Admin Features
- **View Reports**: Comprehensive analytics dashboard showing:
  - Content statistics and breakdowns
  - Recent additions and activity
  - Top locations and popular destinations
  - Performance insights and trends

### LGU Admin Features (Government Officials)
**Content Management**:
- **Add Attraction**: Add new tourist attractions with details like location, description, contact info
- **Add Restaurant**: Add dining establishments with cuisine type, price range, specialties
- **Add Beach**: Add beach destinations with activities, facilities, safety information
- **Add Destination**: Add general travel destinations and points of interest
- **Manage Content**: View, search, edit, and delete existing content across all categories

**Plus All Reports Admin Features**:
- Complete access to analytics and reporting tools

## Quick Start Guide

### For Reports Admins
1. **Setup**:
   - Contact system administrator to add your email to reports admin list
   - Create Firebase account with approved email
   - Log in through the app

2. **Viewing Analytics**:
   - Access "View Reports" for comprehensive insights
   - Monitor content performance and user engagement
   - Track tourism statistics and trends

### For LGU Admins (Government Officials)
1. **Setup**:
   - Contact system administrator to add your government email to LGU admin list
   - Create Firebase account with approved email
   - Log in through the app

2. **Adding Tourism Content**:
   - Navigate to appropriate "Add" section (Attraction, Restaurant, Beach, Destination)
   - Fill in all required fields with accurate tourism information
   - Upload high-quality images if applicable
   - Submit for immediate publication to the public app

3. **Managing Existing Content**:
   - Use "Manage Content" section
   - Search/filter to find specific tourism items
   - Edit information to keep content current
   - Remove outdated or incorrect information

4. **Monitoring Performance**:
   - Access "View Reports" to track content effectiveness
   - Monitor which locations and attractions are most popular
   - Use insights to guide future tourism content strategy

## Governance & Administration

### Content Approval Process
- **LGU Admins**: Authorized government officials responsible for accurate tourism information
- **Quality Control**: Content should reflect current, accurate information about Cebu tourism
- **Public Impact**: All additions immediately appear in the public tourism app

### Email Management
**Adding New Government Admins**:
1. Verify official government email address
2. Confirm tourism department authorization  
3. Add email to `lguAdminEmails` array in AdminAuthService.js
4. Provide admin training on content standards

### Data Integrity
- **Government Authority**: Only authorized LGU officials can modify tourism content
- **Accuracy Standards**: Information must be current and factually correct
- **Public Safety**: Ensure all recommended locations meet safety standards

## Technical Implementation

### Role Detection
The system automatically detects admin roles based on email domains:
- **Government emails** (*.gov.ph): Automatically granted LGU admin access
- **Predefined LGU emails**: Full content management capabilities
- **Reports admin emails**: Analytics access only

### Security Features
- Email-based role assignment
- Automatic redirection based on permissions
- Role indicators in dashboard interface
- Separate permission levels for different functions

## Support

**For Government Officials**:
- Contact IT department for LGU admin access
- Training available for content management procedures
- Technical support for tourism content updates

**For Reports Admins**:
- Contact system administrator for analytics access
- Dashboard training and interpretation support

## Security & Compliance

- **Role-based Access**: Separate permissions for viewing vs. content management
- **Government Authentication**: LGU admin access limited to official government emails
- **Audit Trail**: All content changes tracked for transparency
- **Public Responsibility**: Content directly impacts tourist experiences and safety

## Development Notes

### Adding New Admin Emails
**Reports Admin** (AdminAuthService.js):
```javascript
static adminEmails = [
  'admin@touristapp.com',
  'superadmin@touristapp.com',
  'reports.admin@touristapp.com'
];
```

**LGU Admin** (AdminAuthService.js):
```javascript
static lguAdminEmails = [
  'lgu.cebu@touristapp.com',
  'cebu.tourism@touristapp.com',
  'lgu.admin@touristapp.com',
  'tourism.officer@cebu.gov.ph',
  'content.manager@cebu.gov.ph'
];
```

### Dashboard Behavior
- **LGU Admins**: See full content management + reports
- **Reports Admins**: See only analytics dashboard
- **Role indicators**: Visual badges showing current permission level
- **Dynamic headers**: Dashboard title changes based on role

**Note**: This admin system is designed for government tourism management. All content changes directly affect the public tourism application and should be managed responsibly by authorized officials only. 