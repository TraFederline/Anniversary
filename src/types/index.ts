export interface MemoryItem {
  id: string;
  image: string;
  caption: string;
  location?: string;
  date?: string;
}

export interface StoryConfig {
  herName: string;
  yourName: string;
  anniversaryDate: string;
  yearsCount: string;
  heroKicker: string;
  heroTitle: string;
  storyQuote: string;
  beginningLead: string;
  beginningSteps: string[];
  beginningClimax: string;
  letterTitle: string;
  letterKicker: string;
  letterParagraphs: string[];
  littleThingsKicker: string;
  littleThings: string[];
  littleThingsClimax: string;
  kineticKicker: string;
  kineticLines: [string, string, string];
  kineticPhrase: string;
  finalPhrase: string;
  anniversaryHeadline: string;
  wishesPhrases: string[];
  loveYouPhrase: string;
  resolutionKicker: string;
  resolutionTitle: string;
  resolutionSubtitle: string;
  resolutionBadge: string;
  replayButtonText: string;
  videoSrc: string;
  audioSrc: string;
  memories: MemoryItem[];
}

export const DEFAULT_STORY_CONFIG: StoryConfig = {
  herName: "មី",
  yourName: "ចិត្រា",
  anniversaryDate: "30 មិថុនា 2026",
  yearsCount: "គម្រប់៤ខែ",
  heroKicker: "ជំពូកទី ១ · ពេលវេលាដែលអ្វីៗគ្រប់យ៉ាងចាប់ផ្ដើមផ្លាស់ប្ដូរ",
  heroTitle: "រឿងរ៉ាវរបស់យើង",
  storyQuote: "« ខ្ញុំមិនដែលគិតថា មនុស្សម្នាក់ អាចក្លាយជាចំណែកដ៏ស្រស់បំព្រងបំផុត នៅក្នុងជីវិតខ្ញុំយ៉ាងនេះសោះ។ »",
  beginningLead: "វាបានចាប់ផ្ដើមឡើង ដោយសាមញ្ញបំផុត...",
  beginningSteps: [
    "ការសន្ទនាមួយ",
    "ស្នាមញញឹមមួយ",
    "ហើយដោយមិនដឹងខ្លួន..."
  ],
  beginningClimax: "« អូនបានក្លាយជាមនុស្សសំខាន់បំផុតក្នុងជីវិតបង »",
  letterTitle: "សំបុត្រផ្ញើជូនមនុស្សជាទីស្រឡាញ់",
  letterKicker: "ពីបេះដូងរបស់បង",
  letterParagraphs: [
    "ក្រឡេកមើលទៅថ្ងៃដំបូងដែលពួកយើងបានជួបគ្នា រាល់ពេលវេលាជាមួយអូន ប្រៀបដូចជាកាដូដ៏វិសេសវិសាល ដែលបងមិនដែលនឹកស្មានដល់ថានឹងមានក្នុងឆាកជីវិតនេះ។",
    "ឆ្លងកាត់រាល់ពេលព្រឹកដ៏ស្ងប់ស្ងាត់ ការជជែកគ្នាយប់ជ្រៅ ការធ្វើដំណើរដោយឥតព្រាងទុក និងភាពស្ងៀមស្ងាត់ដ៏កក់ក្តៅ អូនគឺជាកន្លែងសុខសាន្ត និងជាដំណើរផ្សងព្រេងដ៏ស្រស់ស្អាតបំផុតរបស់បង។",
    "អរគុណអូនដែលតែងតែស្រឡាញ់បងដោយការអត់ធ្មត់ យល់ចិត្ត និងធ្វើឱ្យពិភពលោករបស់បងកាន់តែស្រស់បំព្រង និងមានន័យ ដោយគ្រាន់តែមានវត្តមានអូននៅក្បែរ។",
    "មិនថានៅថ្ងៃអនាគតមានរឿងអ្វីកើតឡើង ការបានកាន់ដៃអូនដើរទៅមុខជាមួយគ្នា គឺជាអនាគតតែមួយគត់ដែលបងប៉ងប្រាថ្នា។"
  ],
  littleThingsKicker: "រឿងរ៉ាវតូចៗនៃក្ដីស្រឡាញ់",
  littleThings: [
    "ស្នាមញញឹមដ៏កក់ក្តៅរបស់អូន...",
    "សំឡេងសើចដ៏ស្រស់ស្រាយពេលអូនសប្បាយចិត្ត...",
    "ការយកចិត្តទុកដាក់ និងភាពទន់ភ្លន់របស់អូន...",
    "រាល់រឿងរ៉ាវតូចៗដែលអូនបានធ្វើ..."
  ],
  littleThingsClimax: "« វិធីដែលអូនធ្វើឱ្យថ្ងៃធម្មតាៗ ក្លាយជាថ្ងៃដ៏ពិសេស និងមានន័យបំផុត »",
  kineticKicker: "សេចក្តីស្រឡាញ់ដែលឥតព្រំដែន",
  kineticLines: [
    "អូនគឺជា",
    "ចំណែកដ៏មានន័យបំផុត",
    "នៃរាល់ថ្ងៃរបស់បង"
  ],
  kineticPhrase: "អូនគឺជាចំណែកដ៏មានន័យបំផុត នៃរាល់ថ្ងៃរបស់បង",
  finalPhrase: "« ហើយប្រសិនបើបងអាចជ្រើសរើសជាថ្មី... បងនៅតែជ្រើសរើសអូនដដែល។ »",
  anniversaryHeadline: "រីករាយថ្ងៃខួបគម្រប់ស្នេហា",
  wishesPhrases: [
    "ដើម្បីអនុស្សាវរីយ៍កាន់តែច្រើន",
    "សំឡេងសើចកាន់តែច្រើន",
    "ការធ្វើដំណើរកាន់តែច្រើន",
    "និងពួកយើងជារៀងរហូត"
  ],
  loveYouPhrase: "« បងស្រឡាញ់អូន »",
  resolutionKicker: "ដំណើររឿងរបស់យើងនៅតែបន្ត",
  resolutionTitle: "រឿងរ៉ាវស្នេហារបស់យើង នៅតែបន្តសរសេរ...",
  resolutionSubtitle: "« នេះគ្រាន់តែជាការចាប់ផ្ដើមប៉ុណ្ណោះ »",
  resolutionBadge: "❤️ រីករាយថ្ងៃខួបគម្រប់ស្នេហា អូនសំឡាញ់ ❤️",
  replayButtonText: "ទស្សនារឿងរ៉ាវរបស់យើងម្ដងទៀត ↻",
  videoSrc: "/assets/anniversary-video.mp4",
  audioSrc: "/assets/music.mp3",
  memories: [
    {
      id: "mem-1",
      image: "/assets/photo01.jpg",
      caption: "រសៀលរដូវស្លឹកឈើជ្រុះដំបូងរបស់យើង",
      location: "ហាងកាហ្វេជ្រុងផ្លូវចាស់",
      date: "រដូវស្លឹកឈើជ្រុះ ២០២៤"
    },
    {
      id: "mem-2",
      image: "/assets/photo02.jpg",
      caption: "ការធ្វើដំណើរកាត់ឆ្នេរសមុទ្រ ក្រោមពន្លឺថ្ងៃរៀបលិច",
      location: "ផ្លូវមាត់សមុទ្រ",
      date: "រដូវផ្ការីក ២០២៥"
    },
    {
      id: "mem-3",
      image: "/assets/photo03.jpg",
      caption: "ពន្លឺរាត្រីលើកំពូលក្រុង ក្រោមមេឃស្រទន់",
      location: "លើដំបូលអគារខ្ពស់",
      date: "រដូវក្តៅ ២០២៥"
    },
    {
      id: "mem-4",
      image: "/assets/photo04.jpg",
      caption: "អង្គុយរាប់ផ្កាយលើមេឃដ៏ស្ងប់ស្ងាត់ជាមួយអូន",
      location: "កំពូលភ្នំស្ងប់ស្ងាត់",
      date: "រដូវរងា ២០២៥"
    }
  ]
};
