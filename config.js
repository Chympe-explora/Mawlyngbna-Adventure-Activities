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
       enabled    → true shows this question on the form,
                    false hides it completely
       title      → the heading shown to visitors
       price      → the cost in rupees
       note       → the small grey description line under the title
       perPerson  → true  = price is charged ONCE PER PERSON
                    (adults + children added together)
                  → false = price is one flat charge for the
                    whole group, no matter how many people
  ----------------------------------------------------------------- */
  homestay: {
    enabled: true,
    title: "Home Stay",
    price: 3000,
    note: "double bed with attach bathroom",
    perPerson: false
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

     3. + Home stay price, IF the visitor said yes
          (× number of people, only if perPerson is true above)

     4. + Camping price, IF the visitor said yes
          (× number of people, only if perPerson is true above)

     Total = step 1 + step 2 + step 3 + step 4

   This happens automatically — you never calculate anything
   yourself. You only ever change the numbers above (package
   prices, the child multiplier, and the add-on prices), and the
   site recalculates the total live as the visitor fills the form.
   ================================================================ */
