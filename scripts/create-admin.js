// create-admin.js - Utility script to create admin accounts
// Usage: node scripts/create-admin.js

const { initializeApp } = require('firebase/app');
const { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword } = require('firebase/auth');

// Firebase configuration (same as in your app)
const firebaseConfig = {
  apiKey: "AIzaSyAZSM44g_4krJ8zbeQMlwQJF7VvcDa09vM",
  authDomain: "tourismapp-82791.firebaseapp.com",
  projectId: "tourismapp-82791",
  storageBucket: "tourismapp-82791.firebasestorage.app",
  messagingSenderId: "830491999664",
  appId: "1:830491999664:web:38ff52fa6fe313be01aa75"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

// Admin email lists (same as in your environment.js)
const ADMIN_EMAILS = [
  'admin@touristapp.com',
  'superadmin@touristapp.com',
  'reports.admin@touristapp.com'
];

const LGU_ADMIN_EMAILS = [
  'lgu.cebu@touristapp.com',
  'cebu.tourism@touristapp.com',
  'lgu.admin@touristapp.com',
  'tourism.officer@cebu.gov.ph',
  'content.manager@cebu.gov.ph'
];

async function createAdminAccount(email, password, adminType = 'reports') {
  try {
    console.log(`Creating ${adminType} admin account for: ${email}`);
    
    // Create user account
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    
    console.log(`✅ Admin account created successfully!`);
    console.log(`📧 Email: ${user.email}`);
    console.log(`🆔 User ID: ${user.uid}`);
    console.log(`👤 Admin Type: ${adminType}`);
    
    // Verify admin status
    const isAdmin = ADMIN_EMAILS.includes(email.toLowerCase()) || LGU_ADMIN_EMAILS.includes(email.toLowerCase());
    console.log(`🔐 Admin Access: ${isAdmin ? '✅ Granted' : '❌ Not Found in Admin Lists'}`);
    
    if (!isAdmin) {
      console.log(`⚠️  Warning: Email not found in admin lists. Add to environment.js:`);
      if (adminType === 'lgu') {
        console.log(`   LGU_ADMIN_EMAILS: ['${email}', ...]`);
      } else {
        console.log(`   ADMIN_EMAILS: ['${email}', ...]`);
      }
    }
    
    return { success: true, user };
  } catch (error) {
    console.error(`❌ Error creating admin account:`, error.message);
    return { success: false, error };
  }
}

async function testAdminLogin(email, password) {
  try {
    console.log(`Testing admin login for: ${email}`);
    
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    
    console.log(`✅ Login successful!`);
    console.log(`📧 Email: ${user.email}`);
    console.log(`🆔 User ID: ${user.uid}`);
    
    // Check admin status
    const isReportsAdmin = ADMIN_EMAILS.includes(email.toLowerCase());
    const isLguAdmin = LGU_ADMIN_EMAILS.includes(email.toLowerCase());
    
    if (isLguAdmin) {
      console.log(`👑 Admin Role: LGU Admin (Full Content Management + Reports)`);
    } else if (isReportsAdmin) {
      console.log(`📊 Admin Role: Reports Admin (Analytics Only)`);
    } else {
      console.log(`❌ Admin Role: Not an admin`);
    }
    
    return { success: true, user, isReportsAdmin, isLguAdmin };
  } catch (error) {
    console.error(`❌ Login failed:`, error.message);
    return { success: false, error };
  }
}

// Example usage
async function main() {
  console.log('🚀 TourMate Admin Account Creator');
  console.log('=====================================\n');
  
  console.log('📋 To create an admin account:');
  console.log('1. Edit this script and modify the email/password below');
  console.log('2. Add your email to environment.js admin lists');
  console.log('3. Run this script to create the Firebase account');
  console.log('4. Login through the web app\n');
  
  // Example: Create a new reports admin (modify these values)
  // await createAdminAccount('your.email@touristapp.com', 'YourSecurePassword123!', 'reports');
  
  // Example: Create a new LGU admin (modify these values)
  // await createAdminAccount('your.email@cebu.gov.ph', 'YourSecurePassword123!', 'lgu');
  
  console.log('💡 Uncomment the lines above and modify with your email/password');
}

// Run if called directly
if (require.main === module) {
  main().catch(console.error);
}

module.exports = { createAdminAccount, testAdminLogin };
