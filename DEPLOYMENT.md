# GitHub Pages Deployment Guide

This guide will help you deploy the Pathfinding Visualizer to GitHub Pages.

**Important Note:** This deployment will **NOT** affect your existing portfolio at `https://mohmedvaid.github.io/`. Each repository deploys to its own subdirectory, so this project will be available at `https://mohmedvaid.github.io/algo-visualizer/`.

## Option 1: Automatic Deployment with GitHub Actions (Recommended)

This is already set up! Just follow these steps:

### Step 1: Enable GitHub Pages in Repository Settings

1. Go to your GitHub repository on GitHub.com
2. Click on **Settings** tab
3. Scroll down to **Pages** in the left sidebar
4. Under **Source**, select **GitHub Actions**
5. Save the settings

### Step 2: Push Your Code

The GitHub Actions workflow will automatically deploy when you push to `main`:

```bash
git add .
git commit -m "Deploy to GitHub Pages"
git push origin main
```

### Step 3: Wait for Deployment

1. Go to the **Actions** tab in your GitHub repository
2. Wait for the "Deploy to GitHub Pages" workflow to complete
3. Once green, your site will be live!

### Step 4: Access Your Site

Your site will be available at:
```
https://mohmedvaid.github.io/algo-visualizer/
```

**Note:** This will not affect your existing portfolio at `https://mohmedvaid.github.io/`. Each repository deploys to its own subdirectory.

Or check the **Actions** tab → latest workflow run → **github-pages** environment → **View deployment** button.

---

## Option 2: Manual Deployment (Alternative)

If you prefer manual deployment without GitHub Actions:

### Step 1: Create a `docs` folder

```bash
mkdir docs
cp -r public/* docs/
```

### Step 2: Fix file paths in HTML

Update `docs/index.html` to ensure all paths work correctly (remove leading slashes if needed).

### Step 3: Enable GitHub Pages

1. Go to repository **Settings** → **Pages**
2. Under **Source**, select **Deploy from a branch**
3. Select **main** branch and **/docs** folder
4. Click **Save**

### Step 4: Push to GitHub

```bash
git add docs/
git commit -m "Add docs folder for GitHub Pages"
git push origin main
```

Your site will be live in a few minutes!

---

## Troubleshooting

### 404 Errors

- Ensure file paths in HTML use relative paths (e.g., `./js/main.js` not `/js/main.js`)
- Check that all files are in the `docs` folder
- Wait a few minutes after deployment for DNS propagation

### Files Not Loading

- Check browser console for errors
- Verify all asset paths are correct
- Ensure all files were copied to the `docs` folder

### Deployment Not Working

- Check the **Actions** tab for error messages
- Verify GitHub Pages is enabled in repository settings
- Ensure you're pushing to the `main` branch

---

## Updating Your Site

Every time you push to `main`, the site will automatically redeploy with GitHub Actions!

Just commit and push:
```bash
git add .
git commit -m "Update visualization"
git push origin main
```

