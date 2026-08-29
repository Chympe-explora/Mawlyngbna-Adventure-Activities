# Mawlyngbna Adventure — Booking Form

A static booking page styled like the Google Form you shared, plus a hidden
admin dashboard for editing prices and details. No backend/server needed —
it's plain HTML/CSS/JS, so it deploys straight to GitHub Pages for free.

## Files

| File | What it's for |
|---|---|
| `index.html` | The booking page visitors fill in |
| `style.css` | All the styling (purple Google-Forms look) |
| `app.js` | Booking page logic: steppers, payment reveal, copy/download buttons, WhatsApp submit |
| `config.js` | **Edit this to change prices, text, packages, payment info** |
| `admin.html` / `admin.js` / `admin.css` | The hidden admin dashboard |
| `assets/qr.png` | Your payment QR code image |

## Editing content the easy way

Almost everything editable lives at the top of **`config.js`** in one place:
title text, the WhatsApp number, the list of packages and prices, the
home stay / camping price and notes, and the UPI/bank/QR payment details.
Change a value, save the file, and re-deploy (or just refresh if testing
locally) — no need to touch the HTML or CSS.

You can also edit all of this live, from your phone or laptop, through the
**Admin Dashboard** — see below.

## Deploying to GitHub Pages

1. Create a new GitHub repository (e.g. `mawlyngbna-booking`).
2. Upload all the files in this folder to the repository (keep the folder
   structure — `assets/qr.png` must stay inside an `assets` folder).
3. In the repo, go to **Settings → Pages**.
4. Under "Build and deployment", set **Source: Deploy from a branch**,
   branch **main**, folder **/ (root)** → Save.
5. GitHub gives you a URL like `https://yourusername.github.io/mawlyngbna-booking/`
   within a minute or two. That's your live booking page.

You can also just drag-and-drop all these files into a new repo on
github.com in the browser — no git command line needed.

## The Admin Dashboard (`admin.html`)

- **Direct link:** open `admin.html` on your site
  (e.g. `https://yourusername.github.io/mawlyngbna-booking/admin.html`).
  Bookmark this — only share it with yourself.
- **Hidden tap trigger:** on the booking page, tapping the invisible bottom-right
  corner of the screen 5 times within 3 seconds also jumps to `admin.html`.
- It's protected by a password (default: `mawlyngbna2026`, set in `config.js`
  as `adminPassword` — **change this before you deploy**, and change it again
  any time from inside the dashboard).
- From the dashboard you can:
  - Edit the form title/subtitle and the WhatsApp number
  - Add, edit, reorder, or remove **packages** and their prices
  - Turn the **Home stay** / **Camping** sections on or off, and edit their
    price and note
  - Edit the **UPI ID, bank account, IFSC, and QR image URL**
  - Change the admin password

### Important limitation — please read

This site has no database or server, so the Admin Dashboard saves your
changes to that **one browser's local storage**. That means:

- Edits you make on your phone will show up next time you open the form
  **on that same phone/browser**.
- They will **not** automatically appear for visitors on other devices,
  because there's nowhere shared to store them.

For changes everyone should see (a new price, a new package), the reliable
way is to **edit `config.js` directly and re-deploy** (steps above) — that
updates the site for every visitor. The Admin Dashboard is best for quick
previews or for a kiosk/tablet you personally control. If you outgrow this,
the next step up would be a small backend (e.g. a free Google Sheet + Apps
Script, or a tiny database) — happy to help set that up if you need it.

## How booking submission works

When a visitor fills the form, picks a payment method, and taps
**"Confirm Booking & Send on WhatsApp"**, the site builds a message with all
their answers and opens WhatsApp (`wa.me`) with your number and that message
pre-filled — they just hit send in WhatsApp.

## Before you go live, double check

- [ ] `config.js` → `whatsappNumber` is correct (currently set to `916909659928`
      for +91 6909 659 928 — update the country code if that's wrong)
- [ ] `config.js` → `adminPassword` has been changed from the default
- [ ] `assets/qr.png` is your correct, current payment QR code
- [ ] Package prices in `config.js` match what you actually charge
