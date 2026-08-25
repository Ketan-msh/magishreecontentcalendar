/**
 * Magishree Bagaicha Resort - Bhadra Content Calendar Data
 * Internal Agency & Client Reference Tool
 */

const contentData = [
  {
    id: 1,
    number: "01",
    type: "Reel",
    title: "Drone Property Reveal",
    theme: "Continuous aerial glide establishing Godavari's lush surroundings and garden layout.",
    audioNote: "Warm acoustic or lo-fi trending audio, no voiceover.",
    editNote: "Intended edit sequence order: Shot 5 → Shot 1 → Shot 2 → Shot 3 → Shot 4.",
    shotList: [
      { num: 1, desc: "Parking → footpath → garden → resort (establishing, low-medium altitude, forward glide)" },
      { num: 2, desc: "Godavari Hills → resort top-down/top-angle view (context shot)" },
      { num: 3, desc: "Rise at 120° tilt toward the front building elevation" },
      { num: 4, desc: "Vertical rise straight up from the garden (reveal-style)" },
      { num: 5, desc: "Slow, controlled orbit around the property center (final hero shot — slow, not a fast spin)" }
    ],
    caption: "This is Magishree Bagaicha Resort from above — Godavari's green folded around it. Come see it up close. 🌿",
    hashtags: [
      "#MagishreeBagaichaResort", "#GodavariResort", "#KathmanduGetaway",
      "#GodavariNepal", "#ResortNearKathmandu", "#DroneNepal",
      "#NepalTravelgram", "#WeekendGetawayNepal", "#GardenResortNepal", "#VisitGodavari"
    ]
  },
  {
    id: 2,
    number: "02",
    type: "Post",
    title: "Room Aesthetic",
    theme: "Highlighting natural window light, bed texture, and cozy calm over room size.",
    productionNote: "Note: room is basic, so the shots sell light/calm/comfort rather than size.",
    shotList: [
      { num: 1, desc: "Wide shot from the doorway, natural window light falling across the bed" },
      { num: 2, desc: "Close-up of the bedding/linen texture" },
      { num: 3, desc: "Shot through the window framed by the curtain" },
      { num: 4, desc: "A small styled detail if available (tray, flowers, book, tea/coffee setup)" },
      { num: 5, desc: "Evening/lamp-lit version of the same room for a cozy alternate mood" }
    ],
    caption: "Simple, quiet, and just comfortable enough. Exactly what a stay away from the city should feel like.",
    hashtags: [
      "#MagishreeBagaichaResort", "#CozyStayNepal", "#GodavariRoom",
      "#NepalStaycation", "#ResortRoomNepal", "#KathmanduWeekendStay"
    ]
  },
  {
    id: 3,
    number: "03",
    type: "Reel",
    title: "Couple Package",
    theme: "Romantic, face-free moments showcasing peaceful staycation & daycation packages.",
    productionNote: "All shots captured from behind or side-angle (no faces shown). Voiceover length ~20–23 seconds total.",
    shotList: [
      { num: 1, desc: "Couple walking through the garden, shot from behind" },
      { num: 2, desc: "Couple sitting on the swing, shot from behind at a slight side angle" },
      { num: 3, desc: "Couple watching something on a laptop, bedside, shot from the side" },
      { num: 4, desc: "Couple sitting at a table, enjoying the view" }
    ],
    voiceover: [
      { shot: "Garden walk", time: "0–5s", nepali: "Kahilyai nabirsine palharu — yehi bata suru huncha.", english: "Moments you'll never forget — it starts right here." },
      { shot: "Swing", time: "5–10s", nepali: "Magishree Bagaicha Resort ma, timro love story ko naya adhyaaya.", english: "At Magishree Bagaicha Resort, a new chapter of your love story." },
      { shot: "Laptop, bedside", time: "10–15s", nepali: "Kunai hatar chaina, kunai chinta chaina — timi dui ra yo shanta samaya matra.", english: "No rush, no worries — just the two of you and this quiet time." },
      { shot: "Table, view", time: "15–20s", nepali: "Ra euta view, jasले yo pal lai sadhai ko yaad banaidincha.", english: "And a view that turns this moment into a memory that lasts." },
      { shot: "CTA (overlay + VO)", time: "20–23s", nepali: "Staycation ra daycation packages — ekdam ramro price ma. Aaja nai book garnuhos!", english: "Staycation and daycation packages — at a great price. Book today!" }
    ],
    caption: "Two people, no rush, a garden that does the rest. Staycation & daycation couple packages — book your slot now.",
    hashtags: [
      "#CoupleStaycationNepal", "#MagishreeBagaichaResort", "#GodavariCoupleGetaway",
      "#DaycationKathmandu", "#RomanticGetawayNepal", "#NepaliCouples", "#KathmanduDateIdea"
    ]
  },
  {
    id: 4,
    number: "04",
    type: "Post",
    title: "Garden View",
    theme: "Carousel focusing on lush footpaths, golden hour light, and quiet garden corners.",
    shotList: [
      { num: 1, desc: "Someone on the swing, candid/relaxed pose" },
      { num: 2, desc: "Someone reading a book on a garden bench or mat" },
      { num: 3, desc: "Footpath trail through the greenery" },
      { num: 4, desc: "A close detail shot — flowers, leaves, or dew on grass" },
      { num: 5, desc: "A wide garden shot at golden hour for the carousel cover" }
    ],
    caption: "The garden does most of the talking here. Slow mornings, green everywhere.",
    hashtags: [
      "#GodavariGarden", "#MagishreeBagaichaResort", "#NepalNatureStay",
      "#GardenResortNepal", "#GreenEscapeKathmandu"
    ]
  },
  {
    id: 5,
    number: "05",
    type: "Reel",
    title: "Garden Moments (Ambient)",
    theme: "Soundscape of nature with locked-off still clips and ambient natural audio.",
    productionNote: "3 still/locked-off clips, natural sound only, no music. Fallback option if group gathering isn't possible.",
    shotList: [
      { num: 1, desc: "Wind moving through garden trees/leaves, dappled light shifting" },
      { num: 2, desc: "Sunlight filtering through the canopy onto the footpath" },
      { num: 3, desc: "An empty swing swaying gently on its own" }
    ],
    textOptions: [
      { text: "Nowhere to be.", isRecommended: false },
      { text: "Slow down here.", isRecommended: true },
      { text: "Peace, uninterrupted.", isRecommended: false },
      { text: "Just breathe out.", isRecommended: false }
    ],
    caption: "No plans, no noise. Just the garden being the garden.",
    hashtags: [
      "#SlowLivingNepal", "#MagishreeBagaichaResort", "#GodavariNepal",
      "#NatureReelsNepal", "#CalmContentNepal", "#GardenAmbience"
    ]
  },
  {
    id: 6,
    number: "06",
    type: "Post",
    title: "Teej Booking Push",
    theme: "Festive garden-backed promotional post targeted for Haritalika Teej lead time.",
    productionNote: "Best scheduled a few days before Haritalika Teej (Sep 14) for booking lead time. Concept: festive but simple — red/green Teej palette, garden as backdrop, direct booking message.",
    shotList: [
      { num: 1, desc: "Garden backdrop with warm festive lighting / subtle Teej setup elements" },
      { num: 2, desc: "Group or individual enjoying tea/refreshments in the lush garden environment" },
      { num: 3, desc: "Direct festive booking callout graphics or card framing with clear CTA" }
    ],
    caption: "This Teej, treat yourself to a day in the garden. Book your slot at Magishree Bagaicha Resort before the dates fill up.",
    hashtags: [
      "#TeejOffer", "#HaritalikaTeej2026", "#TeejNepal",
      "#MagishreeBagaichaResort", "#TeejSpecialKathmandu", "#BookYourTeej", "#GodavariTeej"
    ]
  },
  {
    id: 7,
    number: "07",
    type: "Post",
    title: "Newari Food Platter",
    theme: "Authentic Samay Baji and Newari delicacies served outdoors in the garden.",
    shotList: [
      { num: 1, desc: "Top-down shot of the full Samay Baji / Newari platter" },
      { num: 2, desc: "A hand picking up choila or chiura" },
      { num: 3, desc: "Close-up detail of one item — achar, chatamari, or the meat dish" },
      { num: 4, desc: "Wide context shot of the platter against the garden/table backdrop" }
    ],
    caption: "Newari flavors, garden setting. Some things just taste better outdoors.",
    hashtags: [
      "#NewariFood", "#SamayBaji", "#MagishreeBagaichaResort",
      "#KathmanduFoodie", "#NewariCuisineNepal", "#GodavariEats"
    ]
  },
  {
    id: 8,
    number: "08",
    type: "Reel",
    title: "Location Reveal (\"Speed Run to Magishree\")",
    theme: "Dynamic journey reel best scheduled right around Teej (Sep 13–14) during peak search intent.",
    productionNote: "Features TWO execution versions depending on feasibility during production.",
    locationVersions: {
      original: {
        title: "Original Concept (Multi-Location, Flash-Style)",
        note: "Keep the 'arrive → look around → speed away' beat identical at every stop — that repetition sells the 'one continuous journey' feeling.",
        beats: [
          { loc: "Satdobato Chowk", time: "2.5s", action: "Guy appears in a jump-cut/landing shot, looks around, starts running toward Godavari" },
          { loc: "Fast-forward", time: "2s", action: "Speed-ramp transition" },
          { loc: "Newari Basti", time: "2.5s", action: "Arrives, looks around, prepares to continue" },
          { loc: "Fast-forward", time: "2s", action: "Speed-ramp transition" },
          { loc: "Godavari Nursery", time: "2.5s", action: "Arrives, looks around" },
          { loc: "Fast-forward", time: "2s", action: "Speed-ramp transition" },
          { loc: "Magishree turn", time: "2.5s", action: "Arrives at the turn-off, looks around, orients" },
          { loc: "Speed + turn", time: "2s", action: "Strong speed-ramp as he turns right toward Magishree" },
          { loc: "Resort reveal", time: "5–7s", action: "Cut to drone: parking → footpath → full property reveal (hero shot)" }
        ]
      },
      alternate: {
        title: "Easier Alternate (Single-Location, On-Property)",
        note: "Same visual rhythm and payoff shot, but shootable solo in an afternoon on-site — the recommended fallback if the 3-location shoot isn't feasible.",
        beats: [
          { loc: "Gate / entrance", time: "2.5s", action: "Guy appears at the Magishree entrance/road turn-off, looks around, starts running" },
          { loc: "Speed-ramp", time: "1.5s", action: "Whip-pan / speed transition" },
          { loc: "Footpath", time: "2.5s", action: "Arrives on the footpath, looks around, checks direction" },
          { loc: "Speed-ramp", time: "1.5s", action: "Whip-pan / speed transition" },
          { loc: "Garden edge", time: "2.5s", action: "Arrives at the garden, looks around one last time" },
          { loc: "Final speed burst", time: "2s", action: "Runs the last stretch toward the building" },
          { loc: "Resort reveal", time: "5–7s", action: "Cut to drone: parking → footpath → full property reveal (hero shot)" }
        ]
      }
    },
    caption: "He didn't stop until he got here. Neither should you — Magishree Bagaicha Resort, Godavari.",
    hashtags: [
      "#MagishreeBagaichaResort", "#GodavariNepal", "#TrendingReelNepal",
      "#SpeedRunReel", "#KathmanduToGodavari", "#ResortRevealReel", "#TeejGetaway"
    ]
  },
  {
    id: 9,
    number: "09",
    type: "Post",
    title: "Scenic Drone Carousel",
    theme: "Month-closing aerial carousel capturing Godavari hills and garden geometry.",
    shotList: [
      { num: 1, desc: "Sunrise/sunset over the Godavari hills from above" },
      { num: 2, desc: "Straight top-down aerial of the garden layout" },
      { num: 3, desc: "Resort building framed by surrounding greenery" },
      { num: 4, desc: "Footpath trail seen from above, winding through the property" },
      { num: 5, desc: "Wide establishing shot showing the property against the hills (cover image)" }
    ],
    caption: "Godavari from above — one last look before the month closes out.",
    hashtags: [
      "#GodavariAerial", "#MagishreeBagaichaResort", "#DroneNepal",
      "#GodavariHills", "#KathmanduValleyView", "#NepalFromAbove"
    ]
  }
];
