# Workspace Rules for Global Trades

## Automatic Vercel Production Deployment
- Whenever any feature, bug fix, or UI change is completed and verified with `npm run build`, **immediately** stage, commit with a concise conventional commit message, and push to `origin main`.
- Pushing to `origin main` immediately triggers Vercel's automated deployment pipeline for [globaltrades-calicut.vercel.app](https://globaltrades-calicut.vercel.app).
- Never leave completed changes uncommitted or unpushed; always ensure the live Vercel production website is updated immediately.
