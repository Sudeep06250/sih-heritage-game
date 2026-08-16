/**
 * Kram Khoj (क्रम खोज) — Odisha Coastal Heritage Sequence Quest
 * Datasets for Level 1 (Sand Art), Level 2 (Sankha Bangles), Level 3 (Tarakasi Silver Filigree), and Level 4 (Khasta Gaza).
 * Based directly on user reference screenshot images and verified facts.
 */

window.HERITAGE_LEVELS = [
  {
    level: 1,
    id: 'sand_art',
    name: 'Puri Beach Sand Art',
    hindiName: 'पुरी बालुका कला',
    subtitle: 'Large-scale sand art installations on Puri Beach created by master sculptors.',
    icon: '🏖️',
    cardThumb: 'images/sand_art_hero.jpg',
    question: 'What comes next in the sand sculpture sequence?',
    sequenceSteps: [
      {
        num: 1,
        title: '1. Gathering the Sand',
        desc: 'Gathering damp golden sand & sea water from Puri high-tide mark.',
        imgSrc: 'images/sand_art_step_1.jpg'
      },
      {
        num: 2,
        title: '2. Shaping the Temple Base',
        desc: 'Tamping wet sand mound and shaping the architectural base.',
        imgSrc: 'images/sand_art_step_2.jpg'
      },
      {
        num: 3,
        title: '3. Carving the Chariot',
        desc: 'Carving wheels, spires, and temple chariot outlines.',
        imgSrc: 'images/sand_art_step_3.jpg'
      }
    ],
    targetStep: {
      num: 4,
      title: 'A. Completed Sculpture',
      desc: 'The finished Sudarshan Patnaik masterpiece sculpture on Puri beach.'
    },
    choices: [
      {
        id: 'A',
        title: 'A. Completed Sculpture',
        desc: 'The finished Sudarshan Patnaik masterpiece sculpture on Puri beach.',
        isCorrect: true,
        imgSrc: 'images/sand_art_choice_a.jpg'
      },
      {
        id: 'B',
        title: 'B. Final Painting',
        desc: 'Attempting to paint raw beach sand with acrylic wall paints.',
        isCorrect: false,
        imgSrc: 'images/sand_art_choice_b.jpg'
      },
      {
        id: 'C',
        title: 'C. Beach Cleanup',
        desc: 'Raking the raw sand mound to flatten the beach area.',
        isCorrect: false,
        imgSrc: 'images/sand_art_choice_c.jpg'
      }
    ],
    hints: [
      "Think of the completed Sudarshan Patnaik masterpiece!",
      "The final step transforms the carved sand base into a complete, pristine temple sculpture."
    ],
    fact: {
      badgeTitle: 'Master Sand Sculptor',
      badgeIcon: '🏆',
      badgeDesc: 'Mastered the large-scale sand art installations of Puri Beach',
      title: 'DID YOU KNOW?',
      text: 'Odisha is famous for its intricate sand art, particularly the large-scale installations at Puri Beach created by the internationally renowned Sudarshan Patnaik. The special quality of the local sand allows for incredible detail.',
      source: 'Source: Odisha is famous for its intricate sand art, particularly the large-scale installations at Puri Beach Tourism, June 2022.',
      fullChartImage: 'images/sand_art_full.jpg'
    }
  },

  {
    level: 2,
    id: 'sankha_craft',
    name: 'Sankha Craft of Odisha',
    hindiName: 'शंख चूड़ी निर्माण',
    subtitle: 'Delicate, intricate manual carving of sacred conch shell bangles in Puri.',
    icon: '🐚',
    cardThumb: 'images/sankha_hero.jpg',
    question: 'What comes next for detail in the Sankha bangle process?',
    sequenceSteps: [
      {
        num: 1,
        title: '1. Selection of Raw Conch Shells',
        desc: 'Choosing high-quality marine conch shells from Puri ocean coast.',
        imgSrc: 'images/sankha_step_1.jpg'
      },
      {
        num: 2,
        title: '2. Cutting the Bangle Blanks',
        desc: 'Sawing the conch shell into circular bangle blanks using a hand saw blade.',
        imgSrc: 'images/sankha_step_2.jpg'
      },
      {
        num: 3,
        title: '3. Rough Shaping & Initial Polish',
        desc: 'Shaping the cut shell blanks and smoothing edges on a wheel.',
        imgSrc: 'images/sankha_step_3.jpg'
      }
    ],
    targetStep: {
      num: 4,
      title: 'A. Intricate Manual Carving',
      desc: 'Carving delicate patterns, flora, and motifs onto the bangle surface.'
    },
    choices: [
      {
        id: 'A',
        title: 'A. Intricate Manual Carving',
        desc: 'Carving delicate patterns, flora, and motifs onto the bangle surface.',
        isCorrect: true,
        imgSrc: 'images/sankha_choice_a.jpg'
      },
      {
        id: 'B',
        title: 'B. Simple Varnishing Step',
        desc: 'Dipping raw bangle blank into synthetic plastic varnish.',
        isCorrect: false,
        imgSrc: 'images/sankha_choice_b.jpg'
      },
      {
        id: 'C',
        title: 'C. Final Sale in a Bazaar',
        desc: 'Selling unfinished blank shell rings directly in a local shop.',
        isCorrect: false,
        imgSrc: 'images/sankha_choice_c.jpg'
      }
    ],
    hints: [
      "Think about the finish! What comes next for detail?",
      "Sankharis are renowned for their delicate, intricate manual carving skills on the bangle surface."
    ],
    fact: {
      badgeTitle: 'Master Shankha Artisan',
      badgeIcon: '🐚',
      badgeDesc: 'Mastered the ancient conch shell manual carving craft',
      title: 'DID YOU KNOW?',
      text: 'Shankha (conch shell) crafting is a prominent heritage art in Odisha, especially in coastal towns like Puri. The artisans, known as \'Sankharis,\' are renowned for their delicate, intricate manual carving skills. These beautiful bangles have deep cultural and religious significance, often worn in traditional ceremonies.',
      source: 'Source: Sankha Craft of Odisha (Puri Cultural Society, July 2024).',
      fullChartImage: 'images/sankha_full.jpg'
    }
  },

  {
    level: 3,
    id: 'tarakasi_craft',
    name: 'Tarakasi (Silver Filigree)',
    hindiName: 'तारकसी रजत शिल्प',
    subtitle: 'The glorious heritage art of twisting fine silver wires into filigree in Cuttack.',
    icon: '💍',
    cardThumb: 'images/tarakasi_hero.jpg',
    question: 'What comes next for detail in creating Tarakasi silver filigree?',
    sequenceSteps: [
      {
        num: 1,
        title: '1. Melting and Drawing Wire',
        desc: 'Melting pure silver ingot and drawing hair-thin silver wires.',
        imgSrc: 'images/tarakasi_step_1.jpg'
      },
      {
        num: 2,
        title: '2. Creating the Core Pattern',
        desc: 'Bending silver wire frame to form the outer core silhouette.',
        imgSrc: 'images/tarakasi_step_2.jpg'
      },
      {
        num: 3,
        title: '3. Filling and Shaping Fine Weave',
        desc: 'Twisting & interweaving micro silver wires inside the core frame.',
        imgSrc: 'images/tarakasi_step_3.jpg'
      }
    ],
    targetStep: {
      num: 4,
      title: 'A. Final Polishing and Detailing',
      desc: 'Master Karigars give the intricate silver filigree its brilliant polish.'
    },
    choices: [
      {
        id: 'A',
        title: 'A. Final Polishing and Detailing',
        desc: 'Master Karigars give the intricate silver filigree its brilliant polish.',
        isCorrect: true,
        imgSrc: 'images/tarakasi_choice_a.jpg'
      },
      {
        id: 'B',
        title: 'B. Basic Soldering without Weave',
        desc: 'Soldering plain silver rods without any filigree weave.',
        isCorrect: false,
        imgSrc: 'images/tarakasi_choice_b.jpg'
      },
      {
        id: 'C',
        title: 'C. Simple Sale in a Bazaar',
        desc: 'Selling raw unpolished wire coils in a street market.',
        isCorrect: false,
        imgSrc: 'images/tarakasi_choice_c.jpg'
      }
    ],
    hints: [
      "Think about the finish! The final piece is always the goal.",
      "After filling and shaping the fine weave, master Filigree Karigars give the silver piece its final polishing and detailing."
    ],
    fact: {
      badgeTitle: 'Filigree Karigar Master',
      badgeIcon: '💎',
      badgeDesc: 'Mastered the glorious silver filigree art of Cuttack',
      title: 'DID YOU KNOW?',
      text: 'Tarakasi, the intricate art of silver filigree, is a glorious heritage craft from Cuttack, Odisha. Master artisans, known as "Filigree Karigars," draw extremely fine silver wires and twist them into complex patterns. These delicate designs, often inspired by flora, fauna, and local mythology, are among the finest in the world.',
      source: 'Source: Tarakasi Craft of Odisha (Odisha Cultural Heritage Trust, August 2024).',
      fullChartImage: 'images/tarakasi_full.jpg'
    }
  },

  {
    level: 4,
    id: 'khasta_gaza',
    name: 'Khasta Gaza (Puri Dessert)',
    hindiName: 'पुरी खस्ता गजा',
    subtitle: 'Beloved Odia sweet prized for its flaky, deep-fried layers and rich ghee flavor.',
    icon: '🥮',
    cardThumb: 'images/khasta_gaza_hero.jpg',
    question: 'What comes next after cutting the distinct rectangular Gaza shapes?',
    sequenceSteps: [
      {
        num: 1,
        title: '1. Preparing the Gaza Dough',
        desc: 'Maida, ghee, a pinch of salt & water mixed to make a firm dough.',
        imgSrc: 'images/khasta_gaza_step_1.jpg'
      },
      {
        num: 2,
        title: '2. Rolling and Layering Gaza',
        desc: 'Rolling dough into sheets and folding ghee-layered sheets.',
        imgSrc: 'images/khasta_gaza_step_2.jpg'
      },
      {
        num: 3,
        title: '3. Cutting Distinct Shapes',
        desc: 'Cutting the rolled layered dough into diamond and rectangular shapes.',
        imgSrc: 'images/khasta_gaza_step_3.jpg'
      }
    ],
    targetStep: {
      num: 4,
      title: 'A. Deep Frying in Ghee or Oil',
      desc: 'Deep frying pastry pieces on low flame until golden crisp, then syrup soak.'
    },
    choices: [
      {
        id: 'A',
        title: 'A. Deep Frying in Ghee or Oil',
        desc: 'Deep frying pastry pieces on low flame until golden crisp, then syrup soak.',
        isCorrect: true,
        imgSrc: 'images/khasta_gaza_choice_a.jpg'
      },
      {
        id: 'B',
        title: 'B. Oven-Baking Gaza Pieces',
        desc: 'Baking raw Gaza dough shapes inside a commercial convection oven.',
        isCorrect: false,
        imgSrc: 'images/khasta_gaza_choice_b.jpg'
      },
      {
        id: 'C',
        title: 'C. Laying Gaza to Air-Dry',
        desc: 'Spreading raw un-cooked dough pieces on trays to dry in wind.',
        isCorrect: false,
        imgSrc: 'images/khasta_gaza_choice_c.jpg'
      }
    ],
    hints: [
      "Think about the finish! What comes next for detail?",
      "The crisp, layered texture is achieved by careful rolling, cutting, and deep-frying in pure ghee!"
    ],
    fact: {
      badgeTitle: 'Mahaprasad Master Chef',
      badgeIcon: '🥮',
      badgeDesc: 'Mastered the sacred Gaza sweet creation of Jagannath Puri',
      title: 'DID YOU KNOW?',
      text: 'Khasta Gaza is a beloved Odia sweet, prized for its flaky, deep-fried layers and rich ghee flavor. Originating from Puri and loved across Odisha, it is characterized by its crisp, layered texture, achieved by careful rolling, cutting, and deep-frying in pure ghee, followed by a light syrup-soaking. It\'s often served at festive and ceremonial occasions.',
      source: 'Source: Khasta Gaza Heritage Sweet of Puri, Odisha.',
      fullChartImage: 'images/khasta_gaza_full.jpg'
    }
  }
];
