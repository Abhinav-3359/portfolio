# Abhinav Anand — Portfolio

React + Vite single-page portfolio. No backend is needed: it is a static site, so it hosts for free.

## Run locally

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # outputs to dist/
```

## Edit content

Everything (bio, experience, projects, skills, links) is in `src/data.js`.
Replace `public/Abhinav_Anand_Resume.pdf` when you update your resume.

## Deploy to GitHub Pages with itzmeabhinav.com

1. Create a GitHub repo (for example `portfolio`) and push this folder to the `main` branch.
2. Repo **Settings → Pages → Build and deployment → Source: GitHub Actions**.
   The workflow in `.github/workflows/deploy.yml` builds and deploys on every push.
3. Repo **Settings → Pages → Custom domain**: enter `itzmeabhinav.com` and save.
   (`public/CNAME` already contains it.)
4. In GoDaddy: **My Products → Domains → itzmeabhinav.com → DNS**. Delete any existing
   "Parked" A record for `@`, then add:

   | Type  | Name | Value                  |
   |-------|------|------------------------|
   | A     | @    | 185.199.108.153        |
   | A     | @    | 185.199.109.153        |
   | A     | @    | 185.199.110.153        |
   | A     | @    | 185.199.111.153        |
   | CNAME | www  | `<your-github-username>.github.io` |

   Use your GitHub username in the CNAME value.
5. Wait for DNS (a few minutes to a few hours), then tick **Enforce HTTPS** in Pages settings.

## Notes

- Your phone number is deliberately not shown on the public site.
- Light/dark theme follows the visitor's system setting and can be toggled.
