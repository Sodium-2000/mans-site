# Cloudinary Setup Instructions

## What You Need to Do

### 1. Get Cloudinary Credentials

1. Go to https://cloudinary.com and sign up for a free account
2. After logging in, go to your Dashboard
3. You'll see three important values:
   - **Cloud Name**
   - **API Key**
   - **API Secret**

### 2. Update Your .env File

Open your `.env` file and replace the placeholder values with your actual Cloudinary credentials:

```
CLOUDINARY_CLOUD_NAME=your_actual_cloud_name
CLOUDINARY_API_KEY=your_actual_api_key
CLOUDINARY_API_SECRET=your_actual_api_secret
```

### 3. How Image Upload Works

#### For Activities/Courses:
- **Cloudinary Upload**: Up to 5 images can be uploaded directly (stored in `activities` folder)
- **External Links**: Additional images can be linked from external URLs
- Both types will display together on the show page

#### For Weekly Letters:
- **Cloudinary Upload**: Up to 5 images can be uploaded directly (stored in `weekly-letters` folder)
- Images will display below the letter content

### 4. Image Storage Structure

Your images will be organized in Cloudinary as:
- `/activities/` - Activity and course images
- `/weekly-letters/` - Weekly letter images  
- `/general/` - Profile and general site images

### 5. Image Limits

- Maximum 5 images per upload via Cloudinary
- Each image is limited to 5MB
- Supported formats: JPG, JPEG, PNG, GIF, WEBP
- Images are auto-resized to max 1200x1200px

### 6. Testing

After adding your credentials:

1. Start your server: `npm start` or `nodemon app.js`
2. Log in as admin
3. Create a new activity or weekly letter
4. Try uploading images
5. Check if they appear correctly

### 7. Troubleshooting

If images don't upload:
- Check that your .env file has correct credentials (no quotes needed)
- Restart your server after updating .env
- Check browser console for errors
- Verify your Cloudinary account is active

---

**Note**: The cloudinary package is already installed and configured. You just need to add your credentials!
