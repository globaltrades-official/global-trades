# Company Logo Placement

Place your company logo file here as `company-logo.png` (or `.svg` / `.jpg`).

The application is configured in `src/constants/theme.js` with:
```js
export const BRANDING = {
  COMPANY_NAME: "GLOBAL TRADES",
  TAGLINE: "WHOLESALE INDUSTRIAL SUPPLY CO.",
  LOGO_PATH: "/company-logo.png",
};
```

If your logo has a different name or extension, either rename it to `company-logo.png` or update `LOGO_PATH` in `src/constants/theme.js`.
