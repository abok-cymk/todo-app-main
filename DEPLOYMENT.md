# Todo App Deployment Guide

This guide explains how to deploy the Todo App with the client on GitHub Pages and backend on Vercel.

## Prerequisites

- GitHub account
- Vercel account
- A PostgreSQL database (recommended: [Neon](https://neon.tech/), [Supabase](https://supabase.com/), or [Railway](https://railway.app/))

## Backend Deployment (Vercel)

### 1. Set up Database

First, create a PostgreSQL database using one of these services:
- **Neon** (recommended): https://neon.tech/
- **Supabase**: https://supabase.com/
- **Railway**: https://railway.app/

### 2. Deploy to Vercel

1. Install Vercel CLI:
   ```bash
   npm i -g vercel
   ```

2. From the root directory (`todo-app-main`), run:
   ```bash
   vercel
   ```

3. Follow the prompts:
   - Link to existing project: No
   - Project name: `todo-backend` (or your preferred name)
   - Directory: `.` (root directory)
   - Override settings: No

4. Set environment variables in Vercel dashboard:
   ```
   DB_HOST=your-database-host
   DB_PORT=5432
   DB_USERNAME=your-username
   DB_PASSWORD=your-password
   DB_NAME=your-database-name
   NODE_ENV=production
   ```

5. Redeploy:
   ```bash
   vercel --prod
   ```

### 3. Update Client API URL

In `client/src/contexts/TodoContext.tsx`, replace:
```typescript
const API_BASE_URL = import.meta.env.PROD 
    ? 'https://your-vercel-app.vercel.app' // Replace with your actual Vercel URL
    : '';
```

With your actual Vercel deployment URL.

## Client Deployment (GitHub Pages)

### 1. Push to GitHub

1. Create a new repository on GitHub named `todo-app-main`
2. Push your code:
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git branch -M main
   git remote add origin https://github.com/yourusername/todo-app-main.git
   git push -u origin main
   ```

### 2. Enable GitHub Pages

1. Go to your repository settings
2. Scroll to "Pages" section
3. Source: "Deploy from a branch"
4. Branch: `gh-pages`
5. Folder: `/ (root)`

### 3. Manual Deployment (Alternative)

If GitHub Actions doesn't work, you can deploy manually:

```bash
cd client
npm install
npm run build
npm run deploy
```

## Local Development

### Backend
```bash
cd backend
npm install
npm run dev
```

### Client
```bash
cd client
npm install
npm run dev
```

## Environment Variables

### Backend (.env)
```
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=root
DB_NAME=todo_app
```

### Production Environment Variables (Vercel)
- `DB_HOST`: Your production database host
- `DB_PORT`: Database port (usually 5432)
- `DB_USERNAME`: Database username
- `DB_PASSWORD`: Database password
- `DB_NAME`: Database name
- `NODE_ENV`: production

## Troubleshooting

### Backend Issues
- Check Vercel function logs in the dashboard
- Ensure all environment variables are set correctly
- Verify database connection

### Client Issues
- Check if the API URL is correct in `TodoContext.tsx`
- Ensure GitHub Pages is enabled
- Check GitHub Actions workflow status

### CORS Issues
If you encounter CORS issues, make sure your backend CORS configuration allows your GitHub Pages domain:

```typescript
app.use(cors({
  origin: ['http://localhost:5173', 'https://yourusername.github.io']
}));
```

## URLs

After deployment:
- **Client**: `https://yourusername.github.io/todo-app-main/`
- **Backend**: `https://your-vercel-app.vercel.app/api/todos`
