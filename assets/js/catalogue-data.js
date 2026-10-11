/* Paper-family data. IDs are used by product links and must remain stable. */
(() => {
  'use strict';

  const papers = [
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
    "id": "duplex-paper",
    "index": 1
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
    "id": "white-bag-paper",
    "index": 2
  },
  {
    "name": "Kraft paper",
    "group": "packaging",
    "tag": "EARTHY & EXPRESSIVE",
    "desc": "Warm brown character for bags, wrapping and packaging applications.",
    "uses": [
      "Paper bags",
      "Wrapping",
      "Packaging projects"
    ],
    "color": "#bb905e",
    "bg": "#e5d7bf",
    "id": "kraft-paper",
    "index": 3
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
    "id": "golden-paper",
    "index": 4
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
    "id": "scrap-paper",
    "index": 5
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
    "id": "butter-paper",
    "index": 6
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
    "id": "natural-paper",
    "index": 7
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
    "id": "sack-kraft-paper",
    "index": 8
  },
  {
    "name": "Kraft liner paper",
    "group": "boards",
    "tag": "THE OUTER LAYER",
    "desc": "A containerboard family used for the facing layers of corrugated packaging.",
    "uses": [
      "Corrugated box liners",
      "Transport packaging",
      "Printed box concepts"
    ],
    "color": "#a48563",
    "bg": "#e5e0d4",
    "suggested": true,
    "id": "kraft-liner-paper",
    "index": 9
  },
  {
    "name": "Fluting paper",
    "group": "boards",
    "tag": "THE CORE OF CORRUGATION",
    "desc": "Paper used for the corrugated middle layer in corrugated board.",
    "uses": [
      "Corrugated board production",
      "Packaging structures",
      "Box material enquiries"
    ],
    "color": "#bba17c",
    "bg": "#e5e0d4",
    "suggested": true,
    "id": "fluting-paper",
    "index": 10
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
    "id": "folding-boxboard",
    "index": 11
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
    "id": "sbs-board",
    "index": 12
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
    "id": "uncoated-printing-paper",
    "index": 13
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
    "id": "coated-art-paper",
    "index": 14
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
    "id": "tissue-wrapping-paper",
    "index": 15
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
    "id": "greaseproof-paper",
    "index": 16
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
    "id": "cupstock-board",
    "index": 17
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
    "id": "recycled-wrapping-paper",
    "index": 18
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
    "id": "copier-paper",
    "index": 19
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
    "id": "bond-writing-paper",
    "index": 20
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
    "id": "coloured-copier-paper",
    "index": 21
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
    "id": "envelope-paper",
    "index": 22
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
    "id": "ledger-paper",
    "index": 23
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
    "id": "drawing-paper",
    "index": 24
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
    "id": "thermal-receipt-paper",
    "index": 25
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
    "id": "direct-thermal-label-paper",
    "index": 26
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
    "id": "semi-gloss-label-paper",
    "index": 27
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
    "id": "uncoated-label-paper",
    "index": 28
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
    "id": "glassine-release-liner",
    "index": 29
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
    "id": "clay-coated-kraft-liner",
    "index": 30
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
    "id": "translucent-paper",
    "index": 31
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
    "id": "textured-paper",
    "index": 32
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
    "id": "dyed-through-coloured-paper",
    "index": 33
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
    "id": "metallic-finish-paper",
    "index": 34
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
    "id": "pearlescent-paper",
    "index": 35
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
    "id": "cotton-content-paper",
    "index": 36
  }
];

  const categories = [
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
  }
];

  window.MACatalogueData = Object.freeze({ papers, categories });
})();
