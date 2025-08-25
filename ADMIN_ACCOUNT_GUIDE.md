# 🔐 Admin Account Creation Guide

## Overview

TourMate uses **email-based admin authentication** with two admin types:

- **📊 Reports Admin**: Can view analytics and reports
- **👑 LGU Admin**: Can manage content + view reports (Full access)

## Method 1: Quick Setup (Recommended)

### Step 1: Add Admin Email to Configuration

Edit `src/config/environment.js` and add your email to the appropriate list:

```javascript
// For Reports Admin (Analytics only)
ADMIN_EMAILS: [
  'admin@touristapp.com',
  'superadmin@touristapp.com',
  'reports.admin@touristapp.com',
  'your.email@touristapp.com'  // ← Add your email here
],

// For LGU Admin (Full content management)
LGU_ADMIN_EMAILS: [
  'lgu.cebu@touristapp.com',
  'cebu.tourism@touristapp.com',
  'lgu.admin@touristapp.com',
  'tourism.officer@cebu.gov.ph',
  'content.manager@cebu.gov.ph',
  'your.email@cebu.gov.ph'  // ← Add your email here
],
```

### Step 2: Create Firebase Account

1. Go to [Firebase Console](https://console.firebase.google.com)
2. Select project: `tourismapp-82791`
3. Navigate to **Authentication** → **Users**
4. Click **"Add User"**
5. Enter your email and password
6. Click **"Add user"**

### Step 3: Test Admin Access

1. Run: `npx expo start --web`
2. Login with your email and password
3. You should see the Admin Dashboard

## Method 2: Using the Admin Creation Script

### Step 1: Install Dependencies

```bash
npm install firebase
```

### Step 2: Run the Script

```bash
node scripts/create-admin.js
```

### Step 3: Customize the Script

Edit `scripts/create-admin.js` and modify the example emails:

```javascript
// Create a new reports admin
await createAdminAccount('your.email@touristapp.com', 'YourSecurePassword123!', 'reports');

// Create a new LGU admin
await createAdminAccount('your.email@cebu.gov.ph', 'YourSecurePassword123!', 'lgu');
```

## Method 3: Environment Variables (Production)

Create a `.env` file in your project root:

```bash
# Reports Admins
EXPO_PUBLIC_ADMIN_EMAILS=admin1@touristapp.com,admin2@touristapp.com

# LGU Admins
EXPO_PUBLIC_LGU_ADMIN_EMAILS=lgu1@cebu.gov.ph,lgu2@cebu.gov.ph
```

## Admin Roles & Permissions

### 📊 Reports Admin
- **Access**: Analytics dashboard only
- **Can**: View reports, statistics, user analytics
- **Cannot**: Add/edit content, manage attractions

### 👑 LGU Admin (Full Access)
- **Access**: Complete content management system
- **Can**: 
  - Add/edit attractions, restaurants, beaches
  - Manage tourism content
  - View all reports and analytics
  - Approve content changes
- **Cannot**: Access system-level settings

## Security Best Practices

### Password Requirements
- Minimum 8 characters
- Include uppercase, lowercase, numbers, symbols
- Example: `SecurePassword123!`

### Email Verification
- Use official government emails for LGU admins
- Use company emails for reports admins
- Avoid personal email addresses

### Access Management
- Regularly review admin email lists
- Remove access for inactive admins
- Use environment variables in production

## Troubleshooting

### "Access Denied" Error
1. Check if email is in admin lists
2. Verify Firebase account exists
3. Ensure correct password

### "Not Found in Admin Lists" Warning
1. Add email to `environment.js`
2. Restart the development server
3. Clear browser cache

### Firebase Connection Issues
1. Check internet connection
2. Verify Firebase project ID
3. Ensure Firebase Authentication is enabled

## Example Admin Accounts

### Reports Admin
```
Email: reports.admin@touristapp.com
Password: ReportsPass123!
Role: Analytics and reports only
```

### LGU Admin
```
Email: lgu.cebu@touristapp.com
Password: LguPass123!
Role: Full content management
```

## Support

For issues with admin account creation:
1. Check Firebase Console for user status
2. Verify email is in admin lists
3. Test login with correct credentials
4. Contact system administrator if problems persist

---

**Note**: Admin accounts have significant privileges. Only create accounts for authorized personnel and maintain proper security practices.
