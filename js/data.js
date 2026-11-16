/* ------------------------------------------------------------------
   EDIT ME — all of the site's content lives here.
   (and swap in your real text / links / cover images) when ready.
   Cover images: drop files in assets/work/ and set  cover: 'assets/work/x.jpg'
------------------------------------------------------------------- */
window.SITE = {
  name: 'Rav',
  email: 'ravindu.w23@gmail.com',                             // your email: used as a mailto: fallback if formKey is empty
  formKey: '1bbda94b-4f71-472e-bdf0-1a20ad39f751',                           // free access key from web3forms.com (emails you the messages, no backend)
  wall: [],                              // kind words: { text: '…', by: 'Name' } — shown as sticky notes on the contact wall
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
      ['10', 'secrets on this site']
    ]
  },

  categories: {
    uiux: {
      title: 'UI/UX', file: 'ui-ux.fig', glyph: 'UI', color: '#B26CF2', tint: '#DDBBFF',
      blurb: 'Product design, flows and prototypes.',
      items: [
        { title: 'Traveller', year: '2024', role: 'Research + UX/UI design', tools: ['Figma', 'Market research'], desc: 'A taxi and public transport app for tourists in Sri Lanka: market research, user flows and the rider and driver apps.', link: 'case/traveller.html', cta: 'Open case study →', cover: 'assets/work/traveller/tuk.png', contain: true, bg: '#FFE9A8' },
        { title: 'Intergalactic', year: '2023', role: 'UX designer · design system & branding', tools: ['Figma', 'Photoshop', 'Wireframing'], desc: 'An interplanetary travel booking app, designed in a team of three UX designers for the Rootcode Triathlon design phase. My part: the design system and branding, while the others added screens like profile and sign up.', link: 'case/intergalactic.html', cta: 'Open case study →', logo: 'intergalactic', contain: true, bg: '#020208' },
        { title: 'COCO', year: '2023', role: 'Brand concept + hi-fi designs', tools: ['Figma', 'User journey', 'Design system'], desc: 'A one-stop-shop app for all things pet related: pet health, vet booking, IoT feeders and a shop. Made in a team of four; my part was mostly the brand concept and the high-fidelity designs.', link: 'case/coco.html', cta: 'Open case study →', cover: 'assets/work/coco/logo-icon.png', contain: true, bg: '#FFFBEF' },
        { title: 'Travello', year: '2023', role: 'Solo practice project · persona + UI', tools: ['Figma', 'Persona'], desc: 'A solo practice project: a travel companion app to discover places, plan the trip and keep a timeline of everywhere you have been.', link: 'case/travello.html', cta: 'Open case study →', cover: 'assets/work/travello/logo.svg', contain: true, bg: '#FAF8F5' },
        { title: 'ekoo', year: '2024', role: 'Hi-fi designs + prototyping', tools: ['Figma', 'Prototyping', 'Hackathon'], desc: 'A hackathon app that connects eco-travellers with Sri Lankan communities for authentic, sustainable experiences. Concepted and designed by a team of three in 12 hours; I was in charge of the high-fidelity designs and prototyping.', link: 'case/ekoo.html', cta: 'Open case study →', cover: 'assets/work/ekoo/logo.svg', contain: true, bg: '#E6F7F1' },
      ]
    },
    web: {
      title: 'Web', file: 'web.fig', glyph: '</>', color: '#F23C9E', tint: '#FFB8E0',
      blurb: 'Websites and web apps, built by hand.',
      items: [
        { title: 'Bucket List by Go Holidays', year: '2026', role: 'Research, design + development', tools: ['Figma', 'Claude', 'Meta Pixel'], desc: 'A luxury travel microsite with one extraordinary journey for every month. Brand, design language and build in three months, with 3,000+ visits and 250+ itinerary downloads and enquiries in the first month.', link: 'case/bucketlist.html', cta: 'Open case study →', live: 'https://goholidays.lk/bucketlist/', cover: 'assets/work/bucketlist/Favicon.svg', contain: true, bg: '#F2EAD8' }
      ]
    },
    graphics: {
      title: 'Graphics', file: 'graphics.fig', glyph: 'Aa', color: '#0FC8DD', tint: '#D2F7FB',
      blurb: 'Brand identities, posters and social.',
      items: [
        { title: 'RevolUX 3.0', year: '2024', role: 'Project lead · concept + key pieces', tools: ['Figma', 'Photoshop', 'Leonardo AI'], desc: 'A retro arcade look for RevolUX 3.0, an inter-university UI/UX designathon: launch carousel, social posts and delegate merch, built from wireframe meshes, terminal windows and 1980s game screens.', link: 'case/revolux.html', cta: 'Open case study →', cover: 'assets/work/revolux/logo.png', contain: true, bg: '#04120B' },
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
