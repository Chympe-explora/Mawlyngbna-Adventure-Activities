/* ================================================================
   MAWLYNGBNA ADVENTURE — SITE CONFIG
   ⭐ THIS IS THE ONLY FILE YOU SHOULD EVER NEED TO EDIT BY HAND. ⭐

   You do NOT need to know how to code to use this file. Every
   single line below is either:
     (a) a plain sentence explaining what's next, or
     (b) one value in "quotes" or a number, that you can change.

   THE ONLY RULE: only change what is between the quotes " " or
   the numbers. Never delete a comma ",", a colon ":", or a
   curly bracket "{ }" — those are what hold the file together.
   If you're ever unsure, copy this whole file somewhere safe
   before you start editing, so you can always undo mistakes.

   Everything here can ALSO be edited live from the Admin
   Dashboard (open admin.html on your site) without touching this
   file at all — see README.md for when to use which.
   ================================================================ */


/* ================================================================
   JUMP TO WHAT YOU NEED — search this file for the label in CAPS
   ================================================================
     WHATSAPP NUMBER      → where booking messages get sent
     PACKAGES             → the list of adventure packages & prices
     CHILD PRICING RULE    → what a child costs, compared to an adult
     HOW MANY PEOPLE       → min/max people a visitor can pick
     HOME STAY             → the home stay add-on
     CAMPING                → the camping add-on
     TEXT ON THE FORM        → every single word/sentence visitors see
     PAYMENT DETAILS        → your UPI / bank / QR info
     ADMIN PASSWORD          → the password for the admin dashboard
   ================================================================ */

const DEFAULT_CONFIG = {

  /* ---------------------------------------------------------------
     HEADER TEXT
     The big title and the smaller line under it, at the very top
     of the booking page.
  ----------------------------------------------------------------- */
  formTitle: "Book Your Mawlyngbna Adventure Activities With Us",
  formSubtitle: "Fill in your details below to reserve your adventure experience",


  /* ---------------------------------------------------------------
     WHATSAPP NUMBER
     The visitor's booking always gets sent to THIS number when
     they tap Submit. It must be digits only — no "+", no spaces,
     no dashes — starting with the country code.

     EXAMPLE: an Indian mobile number 98765 43210 becomes:
        "919876543210"
        (91 = India's country code, then the 10-digit number)
  ----------------------------------------------------------------- */
  whatsappNumber: "916909659928",


  /* ---------------------------------------------------------------
     PACKAGES  (the visitor picks ONE of these)
     Each line is one package. Change the words inside the second
     "quotes" to rename it, and change the number after price: to
     change its cost per adult.

     TO ADD A NEW PACKAGE: copy a whole line (from { to },) and
     paste it as a new line, then edit its id/label/price.
     TO REMOVE A PACKAGE: delete its whole line.

     "id" just has to be different for every package — it's never
     shown to visitors, so the easiest thing is to leave the
     existing ids alone and just make new ones follow the pattern
     "pkg6", "pkg7", etc. when you add packages.
  ----------------------------------------------------------------- */
  packages: [
    { id: "pkg1", label: "Canyoning + kayaking",                  price: 1050 },
    { id: "pkg2", label: "Canyoning + kayaking + split rock",     price: 1200 },
    { id: "pkg3", label: "Canyoning",                              price: 850  },
    { id: "pkg4", label: "Canyoning + split rock",                 price: 1000 },
    { id: "pkg5", label: "Canyoning + kayaking + split rock + lunch", price: 1500 }
  ],


  /* ---------------------------------------------------------------
     CHILD PRICING RULE
     How much a child costs, compared to one adult, in the SAME
     package the visitor picked. This one number controls every
     package at once — you never set a separate child price per
     package.

       1     → a child costs the SAME as an adult (this is the
               current setting: if the package is ₹1050, a child
               also costs ₹1050)
       0.5   → a child costs HALF of an adult (₹1050 package → ₹525)
       0.25  → a child costs a QUARTER of an adult
       0     → children go free

     Just change the number below to any of those (or anything
     in between, like 0.7 for 70%).
  ----------------------------------------------------------------- */
  pricing: {
    childPriceMultiplier: 1
  },


  /* ---------------------------------------------------------------
     HOW MANY PEOPLE
     The lowest and highest numbers the + / − buttons will allow
     for "Number of participants" and "Number of child".
  ----------------------------------------------------------------- */
  limits: {
    minParticipants: 1,
    maxParticipants: 50,
    minChildren: 0,
    maxChildren: 50
  },


  /* ---------------------------------------------------------------
     HOME STAY  (an optional add-on the visitor can say yes/no to)
       enabled            → true shows this question on the form,
                             false hides it completely
       title              → the heading shown to visitors
       note               → the small grey description line under
                             the title
       adultBasePrice     → the price for the 1st adult
       additionalAdultPrice → the extra price added for EACH adult
                             after the first
       childPrice         → the price for each child above the
                             free age (see childFreeAge below)
       childFreeAge       → children this age or younger stay free;
                             children older than this pay childPrice

     EXAMPLE with the numbers below: 1 adult = ₹1500. 3 adults =
     ₹1500 + ₹500 + ₹500 = ₹2500. A 10-year-old child = ₹1000
     (older than 6). A 5-year-old child = free (6 or younger).
     Every child staying pays or is free based on their own age —
     the visitor enters each child's age on the booking form.
  ----------------------------------------------------------------- */
  homestay: {
    enabled: true,
    title: "Home Stay",
    note: "double bed with attach bathroom",
    adultBasePrice: 1500,
    additionalAdultPrice: 500,
    childPrice: 1000,
    childFreeAge: 6
  },


  /* ---------------------------------------------------------------
     CAMPING  (same kind of add-on as Home Stay, above)
  ----------------------------------------------------------------- */
  camping: {
    enabled: true,
    title: "Camping",
    price: 1500,
    note: "camping and bon fire, per person",
    perPerson: true
  },


  /* ---------------------------------------------------------------
     TEXT ON THE FORM
     EVERY word and sentence a visitor can see on the booking page
     lives here — every label, placeholder, note, error message,
     and button. Nothing is hard-coded in the HTML anymore: change
     any line below (between the quotes) and that exact text
     changes on the live site.

     Grouped by where it appears, top of the page to bottom. Leave
     any line exactly as-is if you don't want to change it.
  ----------------------------------------------------------------- */
  labels: {

    // ----- Top of page 1 -----
    topNote: "This form is to book your adventure.",
    requiredNote: "* Indicates required question",
    page1Indicator: "Page 1 of 2",
    page2Indicator: "Page 2 of 2",

    // ----- Name -----
    nameLabel: "Name",
    namePlaceholder: "Your answer",
    nameError: "Please enter your name.",

    // ----- WhatsApp number -----
    whatsappLabel: "WhatsApp Number",
    whatsappPlaceholder: "e.g. 9863012345",
    whatsappError: "Please enter a valid phone number (at least 10 digits).",

    // ----- Date of visit -----
    dateLabel: "Date of visit",
    dateError: "Please choose a date.",

    // ----- Participants / children -----
    participantsLabel: "Number of participants",
    childrenLabel: "Number of child",
    // This is the note that appears once "Number of child" is above
    // 0 — this is the line circled in your screenshot.
    childAgeNote: "Age of each child",
    // {n} is replaced automatically with 1, 2, 3... for each child.
    childAgeLabel: "Child {n} age",
    childAgePlaceholder: "age",

    // ----- Package question -----
    packageQuestionLabel: "Package for Mawlyngbna Adventure",
    packageError: "Please select a package.",
    perPersonText: "per person",

    // ----- Home Stay / Camping shared -----
    // The "note : " that comes right before each add-on's note text.
    notePrefix: "note : ",
    // The yes/no radio options for Home Stay and Camping (kept as
    // separate lines since the original form capitalized them
    // differently — change either one freely).
    homestayYesOption: "yes",
    homestayNoOption: "No",
    campingYesOption: "yes",
    campingNoOption: "no",

    // ----- Special request -----
    specialLabel: "Any special request",
    specialPlaceholder: "Your answer",

    // ----- Payment mode question (page 1) -----
    paymentModeLabel: "Payment mode",
    paymentModeError: "Please select a payment mode.",
    payUpiOption: "UPI ID",
    payBankOption: "Bank Transfer",
    payQrOption: "QR Code",

    // ----- Page 1 buttons -----
    clearFormBtn: "Clear form",
    nextBtn: "Next",

    // ----- Page 2 heading -----
    page2Title: "Payment",

    // ----- Page 2: UPI detail block -----
    payUpiHeading: "UPI ID",
    upiIdRowLabel: "UPI ID :",

    // ----- Page 2: Bank detail block -----
    payBankHeading: "Bank Transfer",
    accountRowLabel: "Account :",
    ifscRowLabel: "IFSC :",

    // ----- Page 2: QR detail block -----
    payQrHeading: "QR Code",
    scanAndPayText: "scan and pay",
    downloadQrBtn: "Download QR",
    copyUpiBtn: "Copy UPI ID",

    // ----- Copy buttons (used next to UPI ID / Account / IFSC) -----
    copyBtnText: "Copy",
    copiedBtnText: "Copied!",

    // ----- Live total box -----
    estimatedTotalLabel: "Estimated total",
    totalLabel: "Total",
    totalFooterNote: "The booking will be confirmed by admin after submission.",
    emptyBreakdownNote: "Select a package to see pricing",

    // ----- Page 2 buttons -----
    backBtn: "Back",
    submitBtn: "Submit",

    // ----- Pop-up messages (toasts) -----
    fillRequiredToast: "Please fill in all required fields.",
    copiedToastPrefix: "Copied: ",

    // ----- Words used inside the price breakdown lines -----
    // e.g. "Canyoning × 2 adults" / "Canyoning × 1 child"
    adultWord: "adult",
    adultsWord: "adults",
    childWord: "child",
    childrenWord: "children",
    freeText: "free",
    // {from} becomes childFreeAge + 1 automatically.
    homeStayAgedRangeText: "(age {from}-18)",
    // {age} becomes the Home Stay "free at this age or under" number.
    homeStayFreeAgeText: "(age {age} & under, free)"
  },


  /* ---------------------------------------------------------------
     PAYMENT DETAILS
     What visitors see on the payment page, depending on which
     payment method they chose (UPI ID / Bank Transfer / QR Code).
  ----------------------------------------------------------------- */
  payment: {
    accountName: "Aibanskhem Kharnaior",
    upiId: "aibanskhemkharnaior@okaxis",
    bankName: "Meghalaya Rural Bank 0869",
    bankAccount: "95507467578",
    bankIFSC: "SBIN006740",
    // The QR code image visitors see and can download. Put your
    // file at assets/qr.png (replacing the existing one) and leave
    // this line exactly as it is — or paste a different image web
    // address here instead.
    qrImageUrl: "assets/qr.png"
  },


  /* ---------------------------------------------------------------
     ADMIN PASSWORD
     Protects the hidden admin dashboard (admin.html) on this
     device/browser. Change this to your own password before you
     go live — anything you'll remember works.
  ----------------------------------------------------------------- */
  adminPassword: "mawlyngbna2026"

};


/* ================================================================
   HOW THE PRICE CALCULATOR WORKS (nothing to edit here — just
   read this if you want to understand the numbers on the site)
   ================================================================

   For every booking, the total is added up like this:

     1. Package price  ×  Number of adults
          e.g. ₹1050 × 2 adults = ₹2100

     2. Package price  ×  childPriceMultiplier  ×  Number of children
          e.g. ₹1050 × 1 (full price) × 1 child = ₹1050

     3. + Home stay, IF the visitor said yes:
          adultBasePrice for the 1st adult, + additionalAdultPrice
          for every adult after that, PLUS childPrice for every
          child older than childFreeAge (children childFreeAge or
          younger are free) — based on the age each child entered
          on the form.

     4. + Camping price, IF the visitor said yes
          (× number of people, only if perPerson is true above)

     Total = step 1 + step 2 + step 3 + step 4

   This happens automatically — you never calculate anything
   yourself. You only ever change the numbers above (package
   prices, the child multiplier, and the add-on prices), and the
   site recalculates the total live as the visitor fills the form.
   ================================================================ */
