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
home stay / camping price and notes, the UPI/bank/QR payment details —
and, under `labels`, **every single word and sentence a visitor can see**
on the booking page (every field label, placeholder, note, error
message, and button). Nothing is hard-coded in the HTML. Change a
value, save the file, and re-deploy (or just refresh if testing
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
- **Forgot your password?** On the login screen, tap **"Forgot password?
  Reset it"**. Since this is a static site there's no email/SMS to send a
  reset to — this just resets the saved password back to the default in
  `config.js`, without touching anything else you've saved (packages,
  prices, payment details). There's also a "Show password" checkbox on
  the login screen so you can double-check what you're typing.
- From the dashboard you can:
  - Edit the form title/subtitle and the WhatsApp number
  - Add, edit, reorder, or remove **packages** and their prices
  - Turn the **Home stay** / **Camping** sections on or off, and edit their
    prices and notes (Home Stay: 1st-adult price, price per extra adult,
    price per child, and the age children stay free up to)
  - Edit the **UPI ID, bank account, IFSC, and QR image URL**
  - Change the admin password
  - Edit **every piece of text on the form** — labels, placeholders,
    error messages, notes, and buttons — under the "Text on the form"
    section

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

## How the booking flow works

The form is two pages, like a Google Form with a page break:

1. **Page 1** — name, WhatsApp number, date, participants, children,
   package, home stay, camping, special request, and payment method.
   Tapping **Next** checks the required fields, then moves on.
2. **Page 2** — shows only the payment details for whichever method was
   chosen (UPI ID / Bank Transfer / QR Code) plus the live total. Tapping
   **Back** returns to page 1 without losing anything already filled in.
   Tapping **Submit** builds a WhatsApp message with every answer and opens
   WhatsApp (`wa.me`) with your number and that message pre-filled — the
   visitor just hits send.

## Current pricing rules

### Activity packages
- Adults / regular visitors pay the package's listed **price per person**.
- Every child **below 17** pays **₹600** for the activity packages, unless that package has a different child price configured.
- **Water falls** is ₹100 for everyone, so both adults and children pay ₹100.
- Each package can have its own emoji item list, adult price, and child price in `config.js`.

### Home Stay + Maggi & Bread
Home Stay is charged only according to the number of adults / regular visitors in the group:

- 1 adult = **₹1,500**
- 2 adults = **₹2,000**
- 3 adults = **₹2,500**
- 4 adults = **₹3,000**
- and so on: **₹1,500 + ₹500 for each additional adult**

Children below 17 are **free** for Home Stay when they are accompanied by an adult. They are not added to the Home Stay headcount.

Example: **1 adult + 2 children = ₹1,500 Home Stay total.**

### Camping
Camping is **₹1,500 per person**, including children. If a group has 2 adults + 1 child, camping is ₹4,500.

### Combined bookings
Visitors can select an activity package, Home Stay and Camping together. The calculator adds each selected service automatically.

## Editing prices, packages, emojis, text and the calculator

Everything that controls the visitor-facing form is organized in **`config.js`**. You can edit:

- Activity names and prices
- Child prices for each activity package
- Emoji item lists shown under each package
- Water falls pricing
- Home Stay first-adult and additional-adult prices
- Whether children stay free with an adult
- Camping price and emoji item list
- Form labels, notes, buttons and messages
- Payment information

The calculator code reads these values automatically, so you do **not** need to manually change the calculation whenever a price changes.

The Admin Dashboard also lets you edit package names, adult prices, child prices and emoji item lists, plus the Home Stay and other settings. Dashboard changes are stored in that browser's local storage; for changes that must appear for **all visitors**, edit `config.js` and re-deploy the website.

## Before you go live, double check

- [ ] `config.js` → `whatsappNumber` is correct (currently set to `916909659928`
      for +91 6909 659 928 — update the country code if that's wrong)
- [ ] `config.js` → `adminPassword` has been changed from the default
- [ ] `assets/qr.png` is your correct, current payment QR code
- [ ] Package prices in `config.js` match what you actually charge
