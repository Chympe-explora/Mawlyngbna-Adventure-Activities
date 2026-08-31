/* ================================================================
   MAWLYNGBNA ADVENTURE — EASY EDIT CONFIG

   ⭐ FOR SIMPLE EDITING, ONLY CHANGE VALUES IN THIS FILE. ⭐

   Prices, package names, emojis, package details, add-ons and all
   visitor-facing text are kept here so they are easy to find.

   IMPORTANT:
   - Keep commas, quotes, brackets and colons in place.
   - Prices are in Indian Rupees (₹).
   - "participants" means adults / regular visitors.
   - "children" means visitors below 17 years.
   ================================================================ */

const DEFAULT_CONFIG = {

  /* ===================== HEADER ===================== */
  formTitle: "Book Your Mawlyngbna Adventure Activities With Us",
  formSubtitle: "Fill in your details below to reserve your adventure experience",

  /* WhatsApp number — digits only, including country code. */
  whatsappNumber: "916909659928",


  /* ================================================================
     ACTIVITY PACKAGES

     price      = price for one adult / regular visitor
     childPrice = price for ONE child below 17

     NORMAL ACTIVITY:
       childPrice: 600

     ACTIVITY WHERE CHILD PAYS THE SAME AS EVERYONE:
       childPrice: 100
       (example: Water falls)

     items = the emoji bullet points visitors see under the package.
     Add/remove/edit these lines to change what visitors see.

     To add a package, copy one whole { ... } block and edit it.
     ================================================================ */
  packages: [
    {
      id: "pkg1",
      label: "Canyoning + kayaking",
      price: 1050,
      childPrice: 600,
      items: [
        "🧗 Canyoning",
        "🛶 Kayaking"
      ]
    },
    {
      id: "pkg2",
      label: "Canyoning + kayaking + split rock",
      price: 1200,
      childPrice: 600,
      items: [
        "🧗 Canyoning",
        "🛶 Kayaking",
        "🪨 Split rock"
      ]
    },
    {
      id: "pkg3",
      label: "Canyoning",
      price: 850,
      childPrice: 600,
      items: [
        "🧗 Canyoning"
      ]
    },
    {
      id: "pkg4",
      label: "Canyoning + split rock",
      price: 1000,
      childPrice: 600,
      items: [
        "🧗 Canyoning",
        "🪨 Split rock"
      ]
    },
    {
      id: "pkg5",
      label: "Canyoning + kayaking + split rock + lunch",
      price: 1500,
      childPrice: 600,
      items: [
        "🧗 Canyoning",
        "🛶 Kayaking",
        "🪨 Split rock",
        "🍱 Lunch"
      ]
    },
    {
      id: "pkg6",
      label: "Water falls",
      price: 100,
      childPrice: 100,
      items: [
        "💦 Water falls"
      ]
    }
  ],


  /* ===================== BOOKING LIMITS ===================== */
  limits: {
    minParticipants: 1,
    maxParticipants: 50,
    minChildren: 0,
    maxChildren: 50
  },


  /* ================================================================
     HOME STAY + MAGGIE & BREAD

     1 adult       = ₹1500
     2 adults      = ₹2000
     3 adults      = ₹2500
     4 adults      = ₹3000

     Formula:
       ₹1500 + ₹500 × (number of adults - 1)

     Children below 17 are FREE when they are accompanied by an adult.
     Therefore:
       1 adult + 2 children = ₹1500
       2 adults + 2 children = ₹2000

     Children are NOT added to the Home Stay headcount.
     ================================================================ */
  homestay: {
    enabled: true,
    title: "🏠 Home Stay + Maggi & Bread",
    note: "Home stay with Maggi and bread",
    firstAdultPrice: 1500,
    additionalAdultPrice: 500,
    childrenFreeWithAdult: true
  },


  /* ================================================================
     CAMPING

     ₹1500 PER PERSON.
     Children also pay ₹1500 because camping is charged for everyone.
     ================================================================ */
  camping: {
    enabled: true,
    title: "🏕️ Camping Package",
    price: 1500,
    note: "Tent, chair, blanket, pillow and breakfast — Maggi / roti",
    perPerson: true,
    items: [
      "⛺ Camping tent",
      "🪑 Camping chair",
      "🛏️ Blanket",
      "😴 Pillow",
      "🍜 Breakfast — Maggi / roti"
    ]
  },


  /* ================================================================
     ALL VISITOR-FACING TEXT
     If a visitor can see it, put the wording here whenever possible.
     ================================================================ */
  labels: {
    topNote: "This form collects your name, WhatsApp number and booking details so we can confirm your adventure.",
    requiredNote: "* Indicates required question",
    page1Indicator: "Page 1 of 2",
    page2Indicator: "Page 2 of 2",

    nameLabel: "Name",
    namePlaceholder: "Your answer",
    nameError: "Please enter your name.",

    whatsappLabel: "WhatsApp Number",
    whatsappPlaceholder: "e.g. 9863012345",
    whatsappError: "Please enter a valid phone number (at least 10 digits).",

    dateLabel: "Date of visit",
    dateError: "Please choose a date.",

    participantsLabel: "Number of participants",
    childrenLabel: "Number of child below 17",
    childNote: "Children below 17 are charged ₹600 for activities. Water falls are ₹100 for everyone. Children stay free in Home Stay when accompanied by an adult.",

    packageQuestionLabel: "📦 Package for Mawlyngbna Adventure Activities",
    packageError: "Please select a package.",
    perPersonText: "per person",
    childPriceText: "Child: ₹{price}",
    packageDetailsText: "Includes:",

    notePrefix: "Note: ",
    homestayYesOption: "yes",
    homestayNoOption: "no",
    campingYesOption: "yes",
    campingNoOption: "no",

    specialLabel: "Any special request",
    specialPlaceholder: "Your answer",

    paymentModeLabel: "Payment mode",
    paymentModeError: "Please select a payment mode.",
    payUpiOption: "UPI ID",
    payBankOption: "Bank Transfer",
    payQrOption: "QR Code",

    clearFormBtn: "Clear form",
    nextBtn: "Next",

    page2Title: "Payment",
    payUpiHeading: "UPI ID",
    upiIdRowLabel: "UPI ID :",
    payBankHeading: "Bank Transfer",
    accountRowLabel: "Account :",
    ifscRowLabel: "IFSC :",
    payQrHeading: "QR Code",
    scanAndPayText: "scan and pay",
    downloadQrBtn: "Download QR",
    copyUpiBtn: "Copy UPI ID",

    copyBtnText: "Copy",
    copiedBtnText: "Copied!",

    estimatedTotalLabel: "Estimated total",
    totalLabel: "Total",
    totalFooterNote: "Final amount will be confirmed with you on WhatsApp.",
    emptyBreakdownNote: "Select a package to see pricing",

    backBtn: "Back",
    submitBtn: "Submit",

    fillRequiredToast: "Please fill in all required fields.",
    copiedToastPrefix: "Copied: ",

    adultWord: "adult",
    adultsWord: "adults",
    childWord: "child",
    childrenWord: "children",
    freeText: "free",

    homeStayChildFreeText: "Children below 17 are free with an adult"
  },


  /* ===================== PAYMENT DETAILS ===================== */
  payment: {
    accountName: "Aibanskhem Kharnaior",
    upiId: "aibanskhemkharnaior@okaxis",
    bankName: "Meghalaya Rural Bank 0869",
    bankAccount: "95507467578",
    bankIFSC: "SBIN006740",
    qrImageUrl: "assets/qr.png"
  },


  /* ===================== ADMIN PASSWORD ===================== */
  adminPassword: "mawlyngbna2026"
};


/* ================================================================
   PRICE CALCULATOR — FOR REFERENCE

   ACTIVITY:
     Adult total = adult package price × adults
     Child total = package child price × children

   HOME STAY:
     First adult = ₹1500
     Every additional adult = ₹500
     Children below 17 = FREE when an adult is present

   CAMPING:
     ₹1500 × (adults + children)

   FINAL TOTAL = Activity + Home Stay + Camping
   ================================================================ */
