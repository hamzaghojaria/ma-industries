/* Shared catalogue. Existing product IDs remain stable. */
(()=>{const papers=[
  {
    "name": "Duplex paper",
    "group": "boards",
    "tag": "STRUCTURE & SURFACE",
    "desc": "A versatile starting point for cartons, printed packaging and presentation.",
    "uses": [
      "Carton concepts",
      "Printed packaging",
      "Display and presentation"
    ],
    "color": "#e8e3d6",
    "bg": "#dedcd2",
    "image": "assets/images/products/duplex-paper.webp",
    "id": "duplex-paper",
    "index": 1,
    "gsm": {
      "min": 230,
      "max": 400
    }
  },
  {
    "name": "White bag paper",
    "group": "packaging",
    "tag": "A CLEAN CANVAS",
    "desc": "A crisp white foundation for carry bags and branded packaging ideas.",
    "uses": [
      "Carry bags",
      "Retail packaging",
      "Branding and print"
    ],
    "color": "#fffdf3",
    "bg": "#e4e6de",
    "image": "assets/images/products/white-bag-paper.webp",
    "id": "white-bag-paper",
    "index": 2,
    "gsm": {
      "min": 50,
      "max": 130
    }
  },
  {
    "name": "Kraft paper",
    "group": "packaging",
    "tag": "EARTHY & EXPRESSIVE",
    "desc": "Brown kraft paper for bags, wrapping and packaging. Discuss machine-glazed (MG) or machine-finished (MF) grades for your application.",
    "uses": [
      "Grocery and shopping bags",
      "Wrapping and envelopes",
      "Packaging applications"
    ],
    "color": "#bb905e",
    "bg": "#e5d7bf",
    "image": "assets/images/products/kraft-paper.webp",
    "id": "kraft-paper",
    "index": 3,
    "gsm": {
      "min": 45,
      "max": 200
    },
    "details": "MG kraft is a useful starting point for bags and wrapping (reference: 45–100 GSM). MF kraft is commonly discussed for corrugated packaging (reference: 120–200 GSM). Confirm finish, strength and suitability for the intended use."
  },
  {
    "name": "Golden paper",
    "group": "creative",
    "tag": "A TOUCH OF OCCASION",
    "desc": "A golden visual accent for decorative work and special presentations.",
    "uses": [
      "Decorative projects",
      "Gift presentation",
      "Creative finishing"
    ],
    "color": "#b99a49",
    "bg": "#e5dec9",
    "image": "assets/images/products/golden-paper.webp",
    "id": "golden-paper",
    "index": 4,
    "gsm": {
      "min": 110,
      "max": 350
    }
  },
  {
    "name": "Scrap paper",
    "group": "everyday",
    "tag": "ANOTHER CHAPTER",
    "desc": "Paper recovery material. Discuss the grade, composition and intended use.",
    "uses": [
      "Paper recovery",
      "Reprocessing enquiries",
      "Grade-based sourcing"
    ],
    "color": "#aaa08a",
    "bg": "#dcded4",
    "image": "assets/images/products/scrap-paper.webp",
    "id": "scrap-paper",
    "index": 5,
    "gsm": null
  },
  {
    "name": "Butter paper",
    "group": "wrapping",
    "tag": "LIGHT & SUBTLE",
    "desc": "A delicate-looking paper family for wrapping and interleaving enquiries.",
    "uses": [
      "Wrapping enquiries",
      "Interleaving",
      "Application-specific sourcing"
    ],
    "color": "#f5ecd7",
    "bg": "#e9e5dc",
    "image": "assets/images/products/butter-paper.webp",
    "id": "butter-paper",
    "index": 6,
    "gsm": {
      "min": 18,
      "max": 39
    }
  },
  {
    "name": "Natural paper",
    "group": "creative",
    "tag": "QUIETLY DISTINCTIVE",
    "desc": "Natural tones and an understated character for thoughtful paper projects.",
    "uses": [
      "Creative projects",
      "Presentation",
      "Natural-look packaging"
    ],
    "color": "#c9ba99",
    "bg": "#e1ded1",
    "image": "assets/images/products/natural-paper.webp",
    "id": "natural-paper",
    "index": 7,
    "gsm": {
      "min": 90,
      "max": 350
    }
  },
  {
    "name": "Sack kraft paper",
    "group": "packaging",
    "tag": "MADE FOR SACK CONCEPTS",
    "desc": "Kraft paper grades used in industrial paper sacks. Discuss strength, porosity and sack construction.",
    "uses": [
      "Industrial sack enquiries",
      "Multiwall bag concepts",
      "Dry goods packaging"
    ],
    "color": "#ae8052",
    "bg": "#e5e0d4",
    "suggested": true,
    "image": "assets/images/products/sack-kraft-paper.webp",
    "id": "sack-kraft-paper",
    "index": 8,
    "gsm": {
      "min": 70,
      "max": 120
    }
  },
  {
    "name": "Kraft liner paper",
    "group": "boards",
    "tag": "THE OUTER LAYER",
    "desc": "A kraft liner family for the outer faces of corrugated board. Discuss kraftliner, test liner or semi-kraft liner to match your packaging needs.",
    "uses": [
      "Corrugated outer liners",
      "Printed shipping cartons",
      "Industrial packaging"
    ],
    "color": "#a48563",
    "bg": "#e5e0d4",
    "suggested": true,
    "image": "assets/images/products/kraft-liner-paper.webp",
    "id": "kraft-liner-paper",
    "index": 9,
    "gsm": {
      "min": 125,
      "max": 200
    },
    "details": "Kraftliner, recycled test liner and semi-kraft liner are distinct grades. Discuss fibre composition, natural or golden shade, GSM, BF, compression performance and print finish; specifications vary by grade."
  },
  {
    "name": "Fluting paper",
    "group": "boards",
    "tag": "THE CORE OF CORRUGATION",
    "desc": "The corrugated middle layer that gives a board its fluted structure. Select the grade around box design, strength and converting requirements.",
    "uses": [
      "Corrugated board manufacture",
      "Shipping cartons",
      "Protective packaging"
    ],
    "color": "#bba17c",
    "bg": "#e5e0d4",
    "suggested": true,
    "image": "assets/images/products/fluting-paper.webp",
    "id": "fluting-paper",
    "index": 10,
    "gsm": {
      "min": 80,
      "max": 300
    },
    "details": "Reference mill grades span 80–300 GSM. Discuss bursting factor (BF), compression requirements, moisture, reel width and the intended box construction. Not every GSM, BF and shade combination is available."
  },
  {
    "name": "Folding boxboard",
    "group": "boards",
    "tag": "FORM MEETS PRESENTATION",
    "desc": "A paperboard family for folding cartons and printed packaging projects.",
    "uses": [
      "Folding cartons",
      "Retail packaging",
      "Presentation packaging"
    ],
    "color": "#eee6d3",
    "bg": "#e5e0d4",
    "suggested": true,
    "image": "assets/images/products/folding-boxboard.webp",
    "id": "folding-boxboard",
    "index": 11,
    "gsm": {
      "min": 200,
      "max": 400
    }
  },
  {
    "name": "SBS board",
    "group": "boards",
    "tag": "A WHITE BOARD CANVAS",
    "desc": "Solid bleached sulphate board for graphical and premium packaging enquiries.",
    "uses": [
      "Graphical applications",
      "Premium packaging",
      "Presentation projects"
    ],
    "color": "#fffaf0",
    "bg": "#e5e0d4",
    "suggested": true,
    "image": "assets/images/products/sbs-board.webp",
    "id": "sbs-board",
    "index": 12,
    "gsm": {
      "min": 200,
      "max": 400
    }
  },
  {
    "name": "Uncoated printing paper",
    "group": "creative",
    "tag": "LET THE STORY LEAD",
    "desc": "An uncoated paper family for printed communications and stationery.",
    "uses": [
      "Printed communications",
      "Stationery",
      "Book and document projects"
    ],
    "color": "#eeebe3",
    "bg": "#e5e0d4",
    "suggested": true,
    "image": "assets/images/products/uncoated-printing-paper.webp",
    "id": "uncoated-printing-paper",
    "index": 13,
    "gsm": {
      "min": 58,
      "max": 120
    }
  },
  {
    "name": "Coated art paper",
    "group": "creative",
    "tag": "IMAGE-LED EXPRESSION",
    "desc": "Coated paper for image-rich print projects. Discuss finish and printing compatibility.",
    "uses": [
      "Brochures",
      "Catalogues",
      "Promotional print"
    ],
    "color": "#fffdf6",
    "bg": "#e5e0d4",
    "suggested": true,
    "image": "assets/images/products/coated-art-paper.webp",
    "id": "coated-art-paper",
    "index": 14,
    "gsm": {
      "min": 90,
      "max": 350
    }
  },
  {
    "name": "Tissue wrapping paper",
    "group": "everyday",
    "tag": "A SOFTER LAYER",
    "desc": "A lightweight paper family for decorative wrapping and interleaving.",
    "uses": [
      "Gift wrapping",
      "Retail presentation",
      "Interleaving enquiries"
    ],
    "color": "#e9d8cf",
    "bg": "#e5e0d4",
    "suggested": true,
    "image": "assets/images/products/tissue-wrapping-paper.webp",
    "id": "tissue-wrapping-paper",
    "index": 15,
    "gsm": {
      "min": 18,
      "max": 40
    }
  },
  {
    "name": "Greaseproof paper",
    "group": "wrapping",
    "tag": "A PURPOSEFUL BARRIER",
    "desc": "Specialty paper grades designed for grease resistance in suitable applications.",
    "uses": [
      "Wrapping applications",
      "Grease-resistant packaging",
      "Lining enquiries"
    ],
    "color": "#eee4c8",
    "bg": "#e5e0d4",
    "suggested": true,
    "image": "assets/images/products/greaseproof-paper.webp",
    "id": "greaseproof-paper",
    "index": 16,
    "gsm": {
      "min": 40,
      "max": 80
    }
  },
  {
    "name": "Cupstock board",
    "group": "wrapping",
    "tag": "BUILT AROUND THE CUP",
    "desc": "A board family for cup-converting enquiries, with barrier and sealing requirements to discuss.",
    "uses": [
      "Paper cup converting",
      "Beverage packaging",
      "Foodservice enquiries"
    ],
    "color": "#f6f1e5",
    "bg": "#e5e0d4",
    "suggested": true,
    "image": "assets/images/products/cupstock-board.webp",
    "id": "cupstock-board",
    "index": 17,
    "gsm": {
      "min": 185,
      "max": 345
    }
  },
  {
    "name": "Recycled wrapping paper",
    "group": "everyday",
    "tag": "A PRACTICAL NEXT CHAPTER",
    "desc": "Recycled-fibre paper families for general wrapping and cushioning enquiries.",
    "uses": [
      "General wrapping",
      "Void filling concepts",
      "Protective interleaving"
    ],
    "color": "#aca18c",
    "bg": "#e5e0d4",
    "suggested": true,
    "image": "assets/images/products/recycled-wrapping-paper.webp",
    "id": "recycled-wrapping-paper",
    "index": 18,
    "gsm": {
      "min": 60,
      "max": 120
    }
  },
  {
    "name": "Copier paper",
    "group": "office",
    "tag": "READY FOR THE WORKDAY",
    "desc": "Paper grades for everyday copying and office printing.",
    "uses": [
      "Office documents",
      "Photocopying",
      "Reports"
    ],
    "color": "#f8f8ef",
    "bg": "#e5e0d4",
    "suggested": true,
    "image": "assets/images/products/copier-paper.webp",
    "id": "copier-paper",
    "index": 19,
    "gsm": {
      "min": 70,
      "max": 100
    }
  },
  {
    "name": "Bond writing paper",
    "group": "office",
    "tag": "WORDS WITH SUBSTANCE",
    "desc": "Uncoated writing-paper families for correspondence and business stationery.",
    "uses": [
      "Letterheads",
      "Forms",
      "Writing stationery"
    ],
    "color": "#eee8d7",
    "bg": "#e5e0d4",
    "suggested": true,
    "image": "assets/images/products/bond-writing-paper.webp",
    "id": "bond-writing-paper",
    "index": 20,
    "gsm": {
      "min": 70,
      "max": 100
    }
  },
  {
    "name": "Coloured copier paper",
    "group": "office",
    "tag": "ORGANISE IN COLOUR",
    "desc": "Coloured office-paper grades for organising documents and making notices stand out.",
    "uses": [
      "Notices",
      "Document dividers",
      "Office printing"
    ],
    "color": "#c0d8dd",
    "bg": "#e5e0d4",
    "suggested": true,
    "image": "assets/images/products/coloured-copier-paper.webp",
    "id": "coloured-copier-paper",
    "index": 21,
    "gsm": {
      "min": 75,
      "max": 80
    }
  },
  {
    "name": "Envelope paper",
    "group": "office",
    "tag": "MADE FOR CORRESPONDENCE",
    "desc": "Paper families for envelope converting, with opacity and folding requirements to discuss.",
    "uses": [
      "Business envelopes",
      "Mailers",
      "Stationery sets"
    ],
    "color": "#dac9a9",
    "bg": "#e5e0d4",
    "suggested": true,
    "image": "assets/images/products/envelope-paper.webp",
    "id": "envelope-paper",
    "index": 22,
    "gsm": {
      "min": 68,
      "max": 175
    }
  },
  {
    "name": "Ledger paper",
    "group": "office",
    "tag": "A PLACE FOR EVERY RECORD",
    "desc": "Writing-paper grades for account books and record keeping.",
    "uses": [
      "Ledgers",
      "Registers",
      "Record books"
    ],
    "color": "#dce8cf",
    "bg": "#e5e0d4",
    "suggested": true,
    "image": "assets/images/products/ledger-paper.webp",
    "id": "ledger-paper",
    "index": 23,
    "gsm": {
      "min": 70,
      "max": 95
    }
  },
  {
    "name": "Drawing paper",
    "group": "office",
    "tag": "SPACE FOR THE FIRST IDEA",
    "desc": "Paper families for pencil work and drawing; choose surface and weight for your medium.",
    "uses": [
      "Sketching",
      "Technical drawing",
      "Art stationery"
    ],
    "color": "#f3e9db",
    "bg": "#e5e0d4",
    "suggested": true,
    "image": "assets/images/products/drawing-paper.webp",
    "id": "drawing-paper",
    "index": 24,
    "gsm": {
      "min": 80,
      "max": 170
    }
  },
  {
    "name": "Thermal receipt paper",
    "group": "labels",
    "tag": "A CLEAR TRANSACTION",
    "desc": "Coated paper for direct thermal receipt printing; printer compatibility and image life depend on the grade.",
    "uses": [
      "POS receipts",
      "Transaction records",
      "Ticket printing"
    ],
    "color": "#f1f2e9",
    "bg": "#e5e0d4",
    "suggested": true,
    "image": "assets/images/products/thermal-receipt-paper.webp",
    "id": "thermal-receipt-paper",
    "index": 25,
    "gsm": {
      "min": 44,
      "max": 90
    }
  },
  {
    "name": "Direct thermal label paper",
    "group": "labels",
    "tag": "PRINT WITHOUT A RIBBON",
    "desc": "Heat-sensitive label facestock for compatible direct thermal printers. Adhesive and service conditions need separate selection.",
    "uses": [
      "Shipping labels",
      "Barcode labels",
      "Retail labels"
    ],
    "color": "#eeeedd",
    "bg": "#e5e0d4",
    "suggested": true,
    "image": "assets/images/products/direct-thermal-label-paper.webp",
    "id": "direct-thermal-label-paper",
    "index": 26,
    "gsm": {
      "min": 65,
      "max": 70
    }
  },
  {
    "name": "Semi-gloss label paper",
    "group": "labels",
    "tag": "A POLISHED LABEL SURFACE",
    "desc": "Coated paper facestock for printed labels, subject to ink and converting compatibility.",
    "uses": [
      "Product labels",
      "Retail packaging",
      "Promotional labels"
    ],
    "color": "#ede1ca",
    "bg": "#e5e0d4",
    "suggested": true,
    "image": "assets/images/products/semi-gloss-label-paper.webp",
    "id": "semi-gloss-label-paper",
    "index": 27,
    "gsm": {
      "min": 70,
      "max": 80
    }
  },
  {
    "name": "Uncoated label paper",
    "group": "labels",
    "tag": "A NATURAL LABEL FINISH",
    "desc": "Uncoated paper facestock for labels with a matte appearance. Printing method and adhesive must be matched to the application.",
    "uses": [
      "Address labels",
      "Product labels",
      "Stationery labels"
    ],
    "color": "#d9ceb6",
    "bg": "#e5e0d4",
    "suggested": true,
    "image": "assets/images/products/uncoated-label-paper.webp",
    "id": "uncoated-label-paper",
    "index": 28,
    "gsm": {
      "min": 70,
      "max": 100
    }
  },
  {
    "name": "Glassine release liner",
    "group": "labels",
    "tag": "THE LAYER BEHIND THE LABEL",
    "desc": "Dense, smooth paper used as a base for release liners in pressure-sensitive label constructions. Release coating and converting performance vary by grade.",
    "uses": [
      "Label backing",
      "Die-cut label converting",
      "Release-liner enquiries"
    ],
    "color": "#e3d8b4",
    "bg": "#e5e0d4",
    "suggested": true,
    "image": "assets/images/products/glassine-release-liner.webp",
    "id": "glassine-release-liner",
    "index": 29,
    "gsm": {
      "min": 60,
      "max": 80
    }
  },
  {
    "name": "Clay-coated kraft liner",
    "group": "labels",
    "tag": "SUPPORT FOR CONVERTING",
    "desc": "Coated kraft paper used as a release-liner base for adhesive-material converting. Confirm coating and release requirements.",
    "uses": [
      "Release-liner converting",
      "Adhesive materials",
      "Label construction enquiries"
    ],
    "color": "#c6b694",
    "bg": "#e5e0d4",
    "suggested": true,
    "image": "assets/images/products/clay-coated-kraft-liner.webp",
    "id": "clay-coated-kraft-liner",
    "index": 30,
    "gsm": {
      "min": 41,
      "max": 155
    }
  },
  {
    "name": "Translucent paper",
    "group": "specialty",
    "tag": "LET THE LIGHT THROUGH",
    "desc": "Translucent paper families for layered graphic and stationery projects.",
    "uses": [
      "Invitation overlays",
      "Presentation layers",
      "Creative stationery"
    ],
    "color": "#e1e4dc",
    "bg": "#e5e0d4",
    "suggested": true,
    "image": "assets/images/products/translucent-paper.webp",
    "id": "translucent-paper",
    "index": 31,
    "gsm": {
      "min": 80,
      "max": 375
    }
  },
  {
    "name": "Textured paper",
    "group": "specialty",
    "tag": "CHARACTER IN THE SURFACE",
    "desc": "Embossed or textured papers for tactile stationery and presentation. Confirm print and fold suitability.",
    "uses": [
      "Invitations",
      "Presentation covers",
      "Premium stationery"
    ],
    "color": "#cbb99e",
    "bg": "#e5e0d4",
    "suggested": true,
    "image": "assets/images/products/textured-paper.webp",
    "id": "textured-paper",
    "index": 32,
    "gsm": {
      "min": 100,
      "max": 320
    }
  },
  {
    "name": "Dyed-through coloured paper",
    "group": "specialty",
    "tag": "COLOUR THROUGH EVERY LAYER",
    "desc": "Coloured paper families with colour through the sheet for creative print and converting projects.",
    "uses": [
      "Creative packaging",
      "Cardmaking",
      "Coloured stationery"
    ],
    "color": "#a8b9a0",
    "bg": "#e5e0d4",
    "suggested": true,
    "image": "assets/images/products/dyed-through-coloured-paper.webp",
    "id": "dyed-through-coloured-paper",
    "index": 33,
    "gsm": {
      "min": 80,
      "max": 350
    }
  },
  {
    "name": "Metallic finish paper",
    "group": "specialty",
    "tag": "A LITTLE MORE BRILLIANCE",
    "desc": "Decorative paper families with a metallic appearance for distinctive presentation.",
    "uses": [
      "Gift presentation",
      "Decorative print",
      "Creative packaging"
    ],
    "color": "#bfa566",
    "bg": "#e5e0d4",
    "suggested": true,
    "image": "assets/images/products/metallic-finish-paper.webp",
    "id": "metallic-finish-paper",
    "index": 34,
    "gsm": {
      "min": 110,
      "max": 350
    }
  },
  {
    "name": "Pearlescent paper",
    "group": "specialty",
    "tag": "A SOFT SHIMMER",
    "desc": "Decorative papers with a pearlescent finish; choose the grade for your printing and converting process.",
    "uses": [
      "Occasion stationery",
      "Invitations",
      "Presentation projects"
    ],
    "color": "#dcd2e4",
    "bg": "#e5e0d4",
    "suggested": true,
    "image": "assets/images/products/pearlescent-paper.webp",
    "id": "pearlescent-paper",
    "index": 35,
    "gsm": {
      "min": 110,
      "max": 350
    }
  },
  {
    "name": "Cotton-content paper",
    "group": "specialty",
    "tag": "A DISTINCTIVE HAND FEEL",
    "desc": "Specialty papers containing cotton fibres for tactile print and stationery projects. Fibre composition varies by grade.",
    "uses": [
      "Letterpress enquiries",
      "Fine stationery",
      "Invitations"
    ],
    "color": "#e5dfce",
    "bg": "#e5e0d4",
    "suggested": true,
    "image": "assets/images/products/cotton-content-paper.webp",
    "id": "cotton-content-paper",
    "index": 36,
    "gsm": {
      "min": 120,
      "max": 320
    }
  },
  {
    "id": "sugarcane-copy-paper",
    "name": "Copy paper",
    "group": "sugarcane-paper",
    "tag": "SUGARCANE PAPER PRODUCTS",
    "desc": "Office documents and everyday printing.",
    "uses": [
      "Office printing",
      "Documents"
    ],
    "color": "#d4c8a8",
    "bg": "#e9ede3",
    "image": "assets/images/products/sugarcane-copy-paper-photo.jpg",
    "index": 37,
    "gsm": null,
    "material": "Sugarcane paper / bagasse pulp; composition varies by product",
    "illustration": false,
    "details": "Confirm sizes, pack quantities, material composition and application suitability on enquiry. Request product-specific documentation for any food-contact or certification requirement."
  },
  {
    "id": "sugarcane-paper-cups",
    "name": "Paper cups",
    "group": "sugarcane-paper",
    "tag": "SUGARCANE PAPER PRODUCTS",
    "desc": "Paper cups for beverage service.",
    "uses": [
      "Beverage service",
      "Hospitality"
    ],
    "color": "#d4c8a8",
    "bg": "#e9ede3",
    "image": "assets/images/products/sugarcane-paper-cups-photo.jpg",
    "index": 38,
    "gsm": null,
    "material": "Sugarcane paper / bagasse pulp; composition varies by product",
    "illustration": false,
    "details": "Confirm sizes, pack quantities, material composition and application suitability on enquiry. Request product-specific documentation for any food-contact or certification requirement."
  },
  {
    "id": "sugarcane-bath-tissues",
    "name": "Bath tissues",
    "group": "sugarcane-paper",
    "tag": "SUGARCANE PAPER PRODUCTS",
    "desc": "Tissue products for washrooms and daily use.",
    "uses": [
      "Washrooms",
      "Household use"
    ],
    "color": "#d4c8a8",
    "bg": "#e9ede3",
    "image": "assets/images/products/sugarcane-bath-tissues-photo.jpg",
    "index": 39,
    "gsm": null,
    "material": "Sugarcane paper / bagasse pulp; composition varies by product",
    "illustration": false,
    "details": "Confirm sizes, pack quantities, material composition and application suitability on enquiry. Request product-specific documentation for any food-contact or certification requirement."
  },
  {
    "id": "sugarcane-food-containers",
    "name": "Food containers",
    "group": "sugarcane-paper",
    "tag": "SUGARCANE PAPER PRODUCTS",
    "desc": "Pulp containers for takeaway and food service.",
    "uses": [
      "Takeaway packaging",
      "Food service"
    ],
    "color": "#d4c8a8",
    "bg": "#e9ede3",
    "image": "assets/images/products/sugarcane-food-containers-photo.jpg",
    "index": 40,
    "gsm": null,
    "material": "Sugarcane paper / bagasse pulp; composition varies by product",
    "illustration": false,
    "details": "Confirm sizes, pack quantities, material composition and application suitability on enquiry. Request product-specific documentation for any food-contact or certification requirement."
  },
  {
    "id": "sugarcane-packaging-paper",
    "name": "Packaging paper",
    "group": "sugarcane-paper",
    "tag": "SUGARCANE PAPER PRODUCTS",
    "desc": "Paper for wrapping and packaging applications.",
    "uses": [
      "Wrapping",
      "Packaging"
    ],
    "color": "#d4c8a8",
    "bg": "#e9ede3",
    "image": "assets/images/products/sugarcane-packaging-paper-photo.jpg",
    "index": 41,
    "gsm": null,
    "material": "Sugarcane paper / bagasse pulp; composition varies by product",
    "illustration": false,
    "details": "Confirm sizes, pack quantities, material composition and application suitability on enquiry. Request product-specific documentation for any food-contact or certification requirement."
  },
  {
    "id": "cutting-boards",
    "name": "Cutting boards",
    "group": "sugarcane-kitchenware",
    "tag": "SUGARCANE KITCHENWARE",
    "desc": "Boards for everyday kitchen preparation.",
    "uses": [
      "Food preparation",
      "Kitchen use"
    ],
    "color": "#a7b9a1",
    "bg": "#e9ede3",
    "image": "assets/images/products/cutting-boards-photo.jpg",
    "index": 42,
    "gsm": null,
    "material": "Bio-PE / Bio-PP range; confirm composition for the selected item",
    "illustration": false,
    "details": "Confirm sizes, pack quantities, material composition and application suitability on enquiry. Request product-specific documentation for any food-contact or certification requirement."
  },
  {
    "id": "reusable-cups",
    "name": "Reusable cups",
    "group": "sugarcane-kitchenware",
    "tag": "SUGARCANE KITCHENWARE",
    "desc": "Reusable drinkware for everyday routines.",
    "uses": [
      "Reusable drinkware",
      "Home and office"
    ],
    "color": "#a7b9a1",
    "bg": "#e9ede3",
    "image": "assets/images/products/reusable-cups-photo.jpg",
    "index": 43,
    "gsm": null,
    "material": "Bio-PE / Bio-PP range; confirm composition for the selected item",
    "illustration": false,
    "details": "Confirm sizes, pack quantities, material composition and application suitability on enquiry. Request product-specific documentation for any food-contact or certification requirement."
  },
  {
    "id": "salad-bowls",
    "name": "Salad bowls",
    "group": "sugarcane-kitchenware",
    "tag": "SUGARCANE KITCHENWARE",
    "desc": "Bowls for preparation and serving.",
    "uses": [
      "Salad preparation",
      "Serving"
    ],
    "color": "#a7b9a1",
    "bg": "#e9ede3",
    "image": "assets/images/products/salad-bowls-photo.jpg",
    "index": 44,
    "gsm": null,
    "material": "Bio-PE / Bio-PP range; confirm composition for the selected item",
    "illustration": false,
    "details": "Confirm sizes, pack quantities, material composition and application suitability on enquiry. Request product-specific documentation for any food-contact or certification requirement."
  },
  {
    "id": "rice-paddles",
    "name": "Rice paddles",
    "group": "sugarcane-kitchenware",
    "tag": "SUGARCANE KITCHENWARE",
    "desc": "Practical utensils for serving rice.",
    "uses": [
      "Serving rice",
      "Kitchen utensils"
    ],
    "color": "#a7b9a1",
    "bg": "#e9ede3",
    "image": "assets/images/products/rice-paddles-photo.jpg",
    "index": 45,
    "gsm": null,
    "material": "Bio-PE / Bio-PP range; confirm composition for the selected item",
    "illustration": false,
    "details": "Confirm sizes, pack quantities, material composition and application suitability on enquiry. Request product-specific documentation for any food-contact or certification requirement."
  },
  {
    "id": "glass-airtight-containers",
    "name": "Glass airtight containers",
    "group": "sugarcane-kitchenware",
    "tag": "SUGARCANE KITCHENWARE",
    "desc": "Glass storage containers with lids; confirm lid material and seal specifications.",
    "uses": [
      "Food storage",
      "Kitchen organisation"
    ],
    "color": "#a7b9a1",
    "bg": "#e9ede3",
    "image": "assets/images/products/glass-airtight-containers-photo.jpg",
    "index": 46,
    "gsm": null,
    "material": "Glass body; confirm lid material, seal and care specifications",
    "illustration": false,
    "details": "Confirm sizes, pack quantities, material composition and application suitability on enquiry. Request product-specific documentation for any food-contact or certification requirement."
  },
  {
    "id": "double-zipper-bags",
    "name": "Double zipper bags",
    "group": "sugarcane-bags",
    "tag": "SUGARCANE BAGS & WRAPS",
    "desc": "Resealable bags for organised food storage.",
    "uses": [
      "Food storage",
      "Resealable packaging"
    ],
    "color": "#b7c9ba",
    "bg": "#e9ede3",
    "image": "assets/images/products/double-zipper-bags-photo.jpg",
    "index": 47,
    "gsm": null,
    "material": "Bio-polyethylene (Bio-PE); confirm bio-based content and formulation",
    "illustration": false,
    "details": "Confirm sizes, pack quantities, material composition and application suitability on enquiry. Request product-specific documentation for any food-contact or certification requirement."
  },
  {
    "id": "disposable-gloves",
    "name": "Disposable gloves",
    "group": "sugarcane-bags",
    "tag": "SUGARCANE BAGS & WRAPS",
    "desc": "Single-use gloves for everyday handling tasks.",
    "uses": [
      "Food handling",
      "Kitchen preparation"
    ],
    "color": "#b7c9ba",
    "bg": "#e9ede3",
    "image": "assets/images/products/disposable-gloves-photo.jpg",
    "index": 48,
    "gsm": null,
    "material": "Bio-polyethylene (Bio-PE); confirm bio-based content and formulation",
    "illustration": false,
    "details": "Confirm sizes, pack quantities, material composition and application suitability on enquiry. Request product-specific documentation for any food-contact or certification requirement."
  },
  {
    "id": "easy-cut-cling-wraps",
    "name": "Easy-cut cling wraps",
    "group": "sugarcane-bags",
    "tag": "SUGARCANE BAGS & WRAPS",
    "desc": "Cling film rolls for covering and wrapping.",
    "uses": [
      "Food covering",
      "Kitchen wrapping"
    ],
    "color": "#b7c9ba",
    "bg": "#e9ede3",
    "image": "assets/images/products/easy-cut-cling-wraps-photo.jpg",
    "index": 49,
    "gsm": null,
    "material": "Bio-polyethylene (Bio-PE); confirm bio-based content and formulation",
    "illustration": false,
    "details": "Confirm sizes, pack quantities, material composition and application suitability on enquiry. Request product-specific documentation for any food-contact or certification requirement."
  },
  {
    "id": "food-storage-roll-bags",
    "name": "Food storage roll bags",
    "group": "sugarcane-bags",
    "tag": "SUGARCANE BAGS & WRAPS",
    "desc": "Bags on a roll for convenient storage.",
    "uses": [
      "Food storage",
      "Kitchen organisation"
    ],
    "color": "#b7c9ba",
    "bg": "#e9ede3",
    "image": "assets/images/products/food-storage-roll-bags-photo.jpg",
    "index": 50,
    "gsm": null,
    "material": "Bio-polyethylene (Bio-PE); confirm bio-based content and formulation",
    "illustration": false,
    "details": "Confirm sizes, pack quantities, material composition and application suitability on enquiry. Request product-specific documentation for any food-contact or certification requirement."
  },
  {
    "id": "food-storage-pop-up-bags",
    "name": "Food storage pop-up bags",
    "group": "sugarcane-bags",
    "tag": "SUGARCANE BAGS & WRAPS",
    "desc": "Easy-access bags for everyday storage.",
    "uses": [
      "Food storage",
      "Convenient dispensing"
    ],
    "color": "#b7c9ba",
    "bg": "#e9ede3",
    "image": "assets/images/products/food-storage-pop-up-bags-photo.jpg",
    "index": 51,
    "gsm": null,
    "material": "Bio-polyethylene (Bio-PE); confirm bio-based content and formulation",
    "illustration": false,
    "details": "Confirm sizes, pack quantities, material composition and application suitability on enquiry. Request product-specific documentation for any food-contact or certification requirement."
  },
  {
    "id": "recycled-hangers",
    "name": "Recycled hangers",
    "group": "recycled-household",
    "tag": "RECYCLED HOUSEHOLD PRODUCTS",
    "desc": "Hangers for everyday wardrobe organisation.",
    "uses": [
      "Clothing storage",
      "Wardrobe organisation"
    ],
    "color": "#afb9c3",
    "bg": "#e9ede3",
    "image": "assets/images/ranges/recycled-household-photo.jpg",
    "index": 52,
    "gsm": null,
    "material": "Post-consumer recycled polypropylene (PCR PP); confirm content by item",
    "illustration": true,
    "details": "Confirm sizes, pack quantities, material composition and application suitability on enquiry. Request product-specific documentation for any food-contact or certification requirement."
  },
  {
    "id": "recycled-storage-boxes",
    "name": "Recycled storage boxes",
    "group": "recycled-household",
    "tag": "RECYCLED HOUSEHOLD PRODUCTS",
    "desc": "Boxes for organising home and workplace essentials.",
    "uses": [
      "Household storage",
      "Workplace organisation"
    ],
    "color": "#afb9c3",
    "bg": "#e9ede3",
    "image": "assets/images/ranges/recycled-household-photo.jpg",
    "index": 53,
    "gsm": null,
    "material": "Post-consumer recycled polypropylene (PCR PP); confirm content by item",
    "illustration": true,
    "details": "Confirm sizes, pack quantities, material composition and application suitability on enquiry. Request product-specific documentation for any food-contact or certification requirement."
  },
  {
    "id": "recycled-cleaning-tools",
    "name": "Recycled cleaning tools",
    "group": "recycled-household",
    "tag": "RECYCLED HOUSEHOLD PRODUCTS",
    "desc": "Practical tools for everyday cleaning.",
    "uses": [
      "Household cleaning",
      "Workplace cleaning"
    ],
    "color": "#afb9c3",
    "bg": "#e9ede3",
    "image": "assets/images/ranges/recycled-household-photo.jpg",
    "index": 54,
    "gsm": null,
    "material": "Post-consumer recycled polypropylene (PCR PP); confirm content by item",
    "illustration": true,
    "details": "Confirm sizes, pack quantities, material composition and application suitability on enquiry. Request product-specific documentation for any food-contact or certification requirement."
  },
  {
    "id": "sugarcane-plates",
    "name": "Plates",
    "group": "sugarcane-paper",
    "tag": "SUGARCANE PAPER PRODUCTS",
    "desc": "Enquire about bagasse plates for serving meals and catered events.",
    "uses": [
      "Meal service",
      "Catering enquiries"
    ],
    "color": "#d4c8a8",
    "bg": "#e9ede3",
    "image": "assets/images/products/sugarcane-plates-photo.jpg",
    "index": 55,
    "gsm": null,
    "material": "Sugarcane bagasse pulp options; confirm composition, coatings and intended-use suitability",
    "illustration": false,
    "sourcingOnly": true,
    "details": "Additional sourcing range. Product availability, material composition, sizes and pack quantities are confirmed on enquiry. Request item-specific documentation for food-contact, temperature or care requirements where relevant."
  },
  {
    "id": "sugarcane-soup-bowls",
    "name": "Soup bowls",
    "group": "sugarcane-paper",
    "tag": "SUGARCANE PAPER PRODUCTS",
    "desc": "Explore deep bagasse bowls for soup and other foodservice applications.",
    "uses": [
      "Soup service",
      "Foodservice enquiries"
    ],
    "color": "#d4c8a8",
    "bg": "#e9ede3",
    "image": "assets/images/products/sugarcane-soup-bowls-photo.jpg",
    "index": 56,
    "gsm": null,
    "material": "Sugarcane bagasse pulp options; confirm composition, coatings and intended-use suitability",
    "illustration": false,
    "sourcingOnly": true,
    "details": "Additional sourcing range. Product availability, material composition, sizes and pack quantities are confirmed on enquiry. Request item-specific documentation for food-contact, temperature or care requirements where relevant."
  },
  {
    "id": "sugarcane-serving-trays",
    "name": "Serving trays",
    "group": "sugarcane-paper",
    "tag": "SUGARCANE PAPER PRODUCTS",
    "desc": "Enquire about bagasse trays for presenting and serving food.",
    "uses": [
      "Food presentation",
      "Catering and service"
    ],
    "color": "#d4c8a8",
    "bg": "#e9ede3",
    "image": "assets/images/products/sugarcane-serving-trays-photo.jpg",
    "index": 57,
    "gsm": null,
    "material": "Sugarcane bagasse pulp options; confirm composition, coatings and intended-use suitability",
    "illustration": false,
    "sourcingOnly": true,
    "details": "Additional sourcing range. Product availability, material composition, sizes and pack quantities are confirmed on enquiry. Request item-specific documentation for food-contact, temperature or care requirements where relevant."
  },
  {
    "id": "bio-based-reusable-cutlery",
    "name": "Bio-based reusable cutlery",
    "group": "sugarcane-kitchenware",
    "tag": "SUGARCANE KITCHENWARE",
    "desc": "Explore reusable fork, spoon and knife sets made with bio-based material options.",
    "uses": [
      "Reusable dining utensils",
      "Home and hospitality"
    ],
    "color": "#a7b9a1",
    "bg": "#e9ede3",
    "image": "assets/images/products/bio-based-reusable-cutlery-photo.jpg",
    "index": 58,
    "gsm": null,
    "material": "Sugarcane-based polymer options; confirm composition and bio-based content",
    "illustration": false,
    "sourcingOnly": true,
    "details": "Additional sourcing range. Product availability, material composition, sizes and pack quantities are confirmed on enquiry. Request item-specific documentation for food-contact, temperature or care requirements where relevant."
  },
  {
    "id": "reusable-drinking-straws",
    "name": "Reusable drinking straws",
    "group": "sugarcane-kitchenware",
    "tag": "SUGARCANE KITCHENWARE",
    "desc": "Enquire about reusable drinking straws and the available bio-based formulations.",
    "uses": [
      "Beverage service",
      "Reusable drinkware accessories"
    ],
    "color": "#a7b9a1",
    "bg": "#e9ede3",
    "image": "assets/images/products/reusable-drinking-straws-photo.jpg",
    "index": 59,
    "gsm": null,
    "material": "Sugarcane-based polymer options; confirm composition and bio-based content",
    "illustration": false,
    "sourcingOnly": true,
    "details": "Additional sourcing range. Product availability, material composition, sizes and pack quantities are confirmed on enquiry. Request item-specific documentation for food-contact, temperature or care requirements where relevant."
  },
  {
    "id": "bio-based-food-storage-containers",
    "name": "Bio-based food-storage containers",
    "group": "sugarcane-kitchenware",
    "tag": "SUGARCANE KITCHENWARE",
    "desc": "Explore reusable storage containers with bio-based plastic bodies and fitted lids.",
    "uses": [
      "Kitchen organisation",
      "Food storage enquiries"
    ],
    "color": "#a7b9a1",
    "bg": "#e9ede3",
    "image": "assets/images/products/bio-based-food-storage-containers-photo.jpg",
    "index": 60,
    "gsm": null,
    "material": "Sugarcane-based polymer options; confirm composition and bio-based content",
    "illustration": false,
    "sourcingOnly": true,
    "details": "Additional sourcing range. Product availability, material composition, sizes and pack quantities are confirmed on enquiry. Request item-specific documentation for food-contact, temperature or care requirements where relevant."
  },
  {
    "id": "bio-pe-carry-bags",
    "name": "Bio-PE carry bags",
    "group": "sugarcane-bags",
    "tag": "SUGARCANE BAGS & WRAPS",
    "desc": "Enquire about sugarcane-based polyethylene carry bags for retail and everyday use.",
    "uses": [
      "Retail carry bags",
      "Everyday carrying"
    ],
    "color": "#b7c9ba",
    "bg": "#e9ede3",
    "image": "assets/images/products/bio-pe-carry-bags-photo.jpg",
    "index": 61,
    "gsm": null,
    "material": "Bio-PE (bio-polyethylene) options; confirm formulation and bio-based content",
    "illustration": false,
    "sourcingOnly": true,
    "details": "Additional sourcing range. Product availability, material composition, sizes and pack quantities are confirmed on enquiry. Request item-specific documentation for food-contact, temperature or care requirements where relevant."
  },
  {
    "id": "bio-pe-bin-liners",
    "name": "Bio-PE bin liners",
    "group": "sugarcane-bags",
    "tag": "SUGARCANE BAGS & WRAPS",
    "desc": "Explore bin-liner options using sugarcane-based polyethylene formulations.",
    "uses": [
      "Household waste collection",
      "Workplace cleaning"
    ],
    "color": "#b7c9ba",
    "bg": "#e9ede3",
    "image": "assets/images/products/bio-pe-bin-liners-photo.jpg",
    "index": 62,
    "gsm": null,
    "material": "Bio-PE (bio-polyethylene) options; confirm formulation and bio-based content",
    "illustration": false,
    "sourcingOnly": true,
    "details": "Additional sourcing range. Product availability, material composition, sizes and pack quantities are confirmed on enquiry. Request item-specific documentation for food-contact, temperature or care requirements where relevant."
  }
];
const categories=[
  {
    "id": "packaging",
    "name": "Packaging & bags",
    "line": "Give your next package its foundation.",
    "desc": "Explore paper families for carry bags, wrapping and industrial sacks.",
    "color": "#c39b6b"
  },
  {
    "id": "boards",
    "name": "Boards & cartons",
    "line": "Structure for ideas that take shape.",
    "desc": "Discover board families for folding cartons, corrugated packaging and presentation.",
    "color": "#dad3bf"
  },
  {
    "id": "creative",
    "name": "Print & creative",
    "line": "A surface for every story.",
    "desc": "From natural character to golden accents and print-focused papers.",
    "color": "#b89a53"
  },
  {
    "id": "wrapping",
    "name": "Wrapping & foodservice",
    "line": "Consider every layer.",
    "desc": "Explore wrapping and foodservice material families. Suitability depends on the specific grade and application.",
    "color": "#f4ead5"
  },
  {
    "id": "everyday",
    "name": "Everyday & recovery",
    "line": "Make the most of every sheet.",
    "desc": "Paper families for daily use, cushioning and material recovery.",
    "color": "#a9aa95"
  },
  {
    "id": "office",
    "name": "Office & stationery",
    "line": "Paper for the working day.",
    "desc": "Explore papers for documents, correspondence, records and drawing.",
    "color": "#dce7e9"
  },
  {
    "id": "labels",
    "name": "Labels & liners",
    "line": "Give every item its identity.",
    "desc": "Explore label facestocks, thermal papers and release liners for converting enquiries.",
    "color": "#c6d0b1"
  },
  {
    "id": "specialty",
    "name": "Specialty & finishes",
    "line": "A finish that makes an impression.",
    "desc": "Discover translucent, textured, coloured and decorative papers for distinctive projects.",
    "color": "#b7acc8"
  },
  {
    "id": "sugarcane-paper",
    "name": "Sugarcane Paper Products",
    "line": "A new chapter for sugarcane.",
    "desc": "Bagasse paper, plates, bowls and trays for office, packaging and foodservice enquiries.",
    "color": "#d4c8a8",
    "collection": "sugarcane-recycled"
  },
  {
    "id": "sugarcane-kitchenware",
    "name": "Sugarcane Kitchenware",
    "line": "Made for the everyday table.",
    "desc": "Reusable cups, bowls, boards, cutlery, straws and food-storage essentials.",
    "color": "#a7b9a1",
    "collection": "sugarcane-recycled"
  },
  {
    "id": "sugarcane-bags",
    "name": "Sugarcane Bags & Wraps",
    "line": "Keep the everyday covered.",
    "desc": "Explore Bio-PE storage bags, wraps, gloves, carry bags and bin liners.",
    "color": "#b7c9ba",
    "collection": "sugarcane-recycled"
  },
  {
    "id": "recycled-household",
    "name": "Recycled Household Products",
    "line": "Resources, given another purpose.",
    "desc": "Recycled plastic hangers, storage boxes and cleaning tools.",
    "color": "#afb9c3",
    "collection": "sugarcane-recycled"
  }
];
window.MACatalogueData=Object.freeze({papers,categories});})();
