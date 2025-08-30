# Image Upload Troubleshooting Guide

## 🚨 If Image Upload is Not Working

### Step 1: Check Dependencies
First, make sure the required package is installed:

```bash
npm install expo-image-picker
```

### Step 2: Clear Cache and Restart
```bash
npx expo start --clear
```

### Step 3: Test with Debug Screen
1. **Open the Admin Dashboard**
2. **Click "Test Image Upload"** (red camera icon)
3. **Try both "Test Gallery Picker" and "Test Camera"**
4. **Check the console/terminal for detailed logs**

### Step 4: Check Permissions
Make sure your device has granted:
- **Camera permission** (for taking photos)
- **Gallery permission** (for selecting images)

### Step 5: Common Issues and Solutions

#### Issue 1: "Permission needed" Error
**Solution:**
- Go to your device settings
- Find the TourMate app
- Enable Camera and Photos permissions
- Restart the app

#### Issue 2: App crashes when selecting image
**Solution:**
- Make sure you're testing on a physical device (not simulator)
- Check if you have enough storage space
- Try selecting a smaller image

#### Issue 3: Image picker doesn't open
**Solution:**
- Make sure you're using the latest version of Expo
- Try restarting the development server
- Check if the device has the required permissions

#### Issue 4: Images don't save properly
**Solution:**
- Check if Firebase is properly configured
- Verify the image URI is valid
- Make sure the form validation passes

### Step 6: Debug Information

When you use the test screen, check the console for these logs:

```
=== Testing Image Picker ===
ImagePicker available: true
Permission status: granted
Picker result: { canceled: false, assets: [...] }
Image selected successfully: { uri: "file://...", ... }
```

If you see any errors, they will help identify the specific issue.

### Step 7: Alternative Testing

If the test screen works but the main forms don't:

1. **Compare the code** between test screen and main forms
2. **Check for any differences** in the implementation
3. **Verify all imports** are correct
4. **Make sure the state management** is working properly

### Step 8: Platform-Specific Issues

#### Android:
- Make sure you have the latest Android SDK
- Check if the device supports the required features
- Verify that the app has proper permissions

#### iOS:
- Make sure you're using a physical device (simulator has limitations)
- Check if the device has enough storage
- Verify that the app has proper permissions

### Step 9: Still Not Working?

If none of the above solutions work:

1. **Check the Expo version**: Make sure you're using a compatible version
2. **Update expo-image-picker**: Try the latest version
3. **Test on a different device**: Some devices may have compatibility issues
4. **Check the Expo documentation**: Visit the official expo-image-picker docs

### Step 10: Emergency Fallback

If image upload still doesn't work, you can:

1. **Use a different image picker library**
2. **Implement a file input fallback**
3. **Use a web-based solution for testing**

## 📞 Getting Help

If you're still having issues:

1. **Check the console logs** for specific error messages
2. **Take a screenshot** of any error dialogs
3. **Note your device model** and OS version
4. **Describe exactly what happens** when you try to upload an image

## ✅ Success Checklist

The image upload is working correctly when:

- [ ] Test screen opens without errors
- [ ] Gallery picker opens and shows your photos
- [ ] Camera opens and takes photos
- [ ] Selected images appear in the preview
- [ ] Images save with the form data
- [ ] Images display in the content management screen

## 🔧 Quick Fix Commands

```bash
# Install dependencies
npm install expo-image-picker

# Clear cache and restart
npx expo start --clear

# Check if package is installed
npm list expo-image-picker

# Update to latest version
npm update expo-image-picker
```

Try these steps in order, and the image upload should start working! 🎉
