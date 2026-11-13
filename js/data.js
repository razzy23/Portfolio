/* ------------------------------------------------------------------
   EDIT ME — all of the site's content lives here.
   (and swap in your real text / links / cover images) when ready.
   Cover images: drop files in assets/work/ and set  cover: 'assets/work/x.jpg'
------------------------------------------------------------------- */
window.SITE = {
  name: 'Rav',
  email: '',                             // add your real email to enable the contact form
  portfolios: [
    { key: 'behance', label: 'Behance', url: 'https://behance.net/ravzxazanka',  img: 'assets/links/behance.png',  bg: '#0057FF' },
    { key: 'dribbble', label: 'Dribbble', url: 'https://dribbble.com/razzy23',    img: 'assets/links/dribbble.webp', bg: '#FFD1E6', pad: true },
    { key: 'medium', label: 'Medium', url: 'https://medium.com/@ravzeex0',      img: 'assets/links/medium.png',   bg: '#000' }
  ],

  about: {
    headline: "hi, i'm rav.",
    paragraphs: [
      'I design interfaces, build them, make graphics, and cut videos — often all in the same week.',
      'This is where I keep the work. Poke around. Some things move, some things talk back.'
    ],
    skills: ['UI design', 'Prototyping', 'Design systems', 'HTML / CSS / JS', 'Branding', 'Posters & social', 'Motion', 'Video editing'],
    facts: [
      ['4', 'disciplines'],
      ['∞', 'cups of coffee'],
      ['9', 'secrets on this site']
    ]
  },

  categories: {
    uiux: {
      title: 'UI/UX', file: 'ui-ux.fig', glyph: 'UI', color: '#B26CF2', tint: '#DDBBFF',
      blurb: 'Product design, flows and prototypes.',
      items: [
        { title: 'Traveller', year: '2024', role: 'Research + UX/UI design', tools: ['Figma', 'Market research'], desc: 'A taxi and public transport app for tourists in Sri Lanka: market research, user flows and the rider and driver apps.', link: 'case/traveller.html', cta: 'Open case study →', cover: 'assets/work/traveller/tuk.png', contain: true, bg: '#FFE9A8' },
      ]
    },
    web: {
      title: 'Web', file: 'web.fig', glyph: '</>', color: '#F23C9E', tint: '#FFB8E0',
      blurb: 'Websites and web apps, built by hand.',
      items: [
      ]
    },
    graphics: {
      title: 'Graphics', file: 'graphics.fig', glyph: 'Aa', color: '#0FC8DD', tint: '#D2F7FB',
      blurb: 'Brand identities, posters and social.',
      items: [
        { title: 'MadHack 2023 Concept', year: '2023', role: 'Brand design', tools: ['Figma', 'Brand identity', 'Illustration'], desc: 'Brand guidelines for MadHack 2023, the mobile app hackathon by the IEEE Student Branch of UCSC: logo system, colour, typography, mascot elements, swags and awards.', link: 'case/madhack.html', cta: 'Open case study →', cover: 'assets/work/madhack/logos/icon.svg', contain: true, bg: '#100B30' },
      ]
    },
    video: {
      title: 'Video', file: 'video.fig', glyph: '▶', color: '#1ED47A', tint: '#BFF7D6',
      blurb: 'Edits, motion and short-form.',
      items: [
      ]
    }
  }
};
