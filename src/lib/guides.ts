// Party ideas guides: helpful articles aimed at what people search for,
// each pointing to the product that solves it. Keep claims factual.

export type GuideSection = { h2: string; body: string[]; list?: string[]; cta?: { href: string; label: string } };
export type Guide = {
  slug: string;
  title: string;        // <title> and search result headline (keep under ~60 characters)
  description: string;  // search result snippet (keep under ~155 characters)
  h1: string;
  kicker: string;
  intro: string;
  product: 'story' | 'photos' | 'slideshow' | null;
  sections: GuideSection[];
  faq: [string, string][];
};

export const GUIDES: Guide[] = [
  {
    slug: 'qr-code-photo-sharing-for-parties',
    title: 'QR Code Photo Sharing for Parties (No App Needed)',
    description: 'Let guests scan a QR code and upload their party photos straight to one shared album and your TV. No app, no sign-up. How it works, NZ.',
    h1: 'QR code photo sharing for parties',
    kicker: 'Guest photos',
    intro: 'Every guest at your party is taking photos. Most of them never reach you. A QR code on the table fixes that: guests scan it with their phone camera, pick their photos, and they land in one shared album, and on the TV, straight away.',
    product: 'photos',
    sections: [
      {
        h2: 'How scanning a QR code to upload photos works',
        body: ['You print a card with a QR code and put it on the tables, the bar and by the door. Guests point their phone camera at it and a web page opens. They tap “Add photos”, choose from their camera roll or take a new one, and that’s it.'],
        list: ['No app to download and no account to create', 'Works on iPhone and Android with the normal camera', 'Photos are shrunk on the phone first, so uploads are quick even on party Wi-Fi', 'Location data is stripped from photos before they’re shared'],
      },
      {
        h2: 'Why a QR code beats a group chat or shared drive',
        body: ['Group chats squash photos and bury them between messages. Shared drives need everyone to have the right account and the right link. A QR code is one step for guests, and everything ends up in one place for you, ready to download in a single zip.'],
      },
      {
        h2: 'Put the photos on the big screen',
        body: ['The fun part is watching them arrive. Open your photo wall on the TV and every new photo pops up within seconds, with the name of who took it. People go and take better ones just to see them on the screen.'],
        cta: { href: '/photo-wall', label: 'See the Party Photo Wall' },
      },
      {
        h2: 'Tips for getting everyone to share',
        body: [],
        list: ['Put a QR card on every table, not just one by the door', 'Show the QR code on the TV too, so people can scan from across the room', 'Mention it once in a speech: “Scan the code, your photos go on the TV”', 'Leave uploads open for a day after, for the photos people remember later'],
      },
    ],
    faq: [
      ['Do guests need an app to upload photos with a QR code?', 'No. The QR code opens a normal web page in their phone’s browser. There is nothing to install and no account to make.'],
      ['Can I remove a photo that shouldn’t be there?', 'Yes. From your private host page you can remove any photo, and it disappears from the TV within seconds. You can also close uploads or hide the album from guests.'],
      ['How do I get all the photos afterwards?', 'Download every photo in one zip from your host page. The album stays online for six months.'],
    ],
  },
  {
    slug: 'party-tv-screen-ideas',
    title: 'Party TV Screen Ideas: Digital Signage for Parties',
    description: 'Turn the TV into the centrepiece of your party: live guest messages, a QR code photo wall or a looping slideshow. Easy party digital signage ideas.',
    h1: 'Party TV screen ideas: digital signage for your party',
    kicker: 'Party TV screens',
    intro: 'Businesses use digital signage to catch people’s eye. At a party, the TV on the wall can do the same job: welcome people, show off photos, and get everyone joining in. You don’t need special screens or software, just a TV with a web browser.',
    product: null,
    sections: [
      {
        h2: '1. A live guest message board',
        body: ['Guests scan a QR code and write a message, and it appears on the TV. At a kids’ birthday it can be a storybook where each message becomes a new page, with animated animals and the child’s name. Kids love spotting their message on the big screen.'],
        cta: { href: '/tv-story', label: 'See the Birthday Storybook TV' },
      },
      {
        h2: '2. A live photo wall',
        body: ['Guests scan to upload photos, and the TV becomes a live slideshow of the night. It shows the newest photo first, then keeps cycling through the album. Perfect for 21sts, 30ths, 40ths, engagements and work parties.'],
        cta: { href: '/photo-wall', label: 'See the Party Photo Wall' },
      },
      {
        h2: '3. A looping slideshow of old photos',
        body: ['For milestone birthdays, anniversaries and farewells, a slideshow of photos and videos through the years gets people talking. Upload them ahead of time, open the address on the TV, and it plays on repeat all night.'],
        cta: { href: '/tv-slideshow', label: 'See the TV Slideshow' },
      },
      {
        h2: 'What you need',
        body: ['Any smart TV with a web browser, or a laptop, Chromecast or Fire TV Stick plugged into the TV. Wi-Fi at the venue. That’s all: everything runs from a web address, so there’s nothing to install.'],
        list: ['Set the TV to full screen and turn off its sleep timer', 'Put the TV where people gather, not in a corner', 'Test it the day before, on the same Wi-Fi if you can'],
      },
    ],
    faq: [
      ['Do I need special digital signage hardware for a party?', 'No. A normal smart TV with a web browser works, or plug in a laptop, Chromecast or Fire TV Stick.'],
      ['How do I get the party page onto the TV?', 'Open the TV’s web browser and go to the short address we give you. It shows a 6-digit code; type it into your host page on your phone and the TV connects.'],
      ['Will it work without internet?', 'It needs Wi-Fi to receive new messages and photos. If the connection drops briefly, the screen keeps showing what it already has.'],
    ],
  },
  {
    slug: 'kids-birthday-party-ideas',
    title: 'Kids Birthday Party Ideas NZ: Keep Everyone Involved',
    description: 'Easy kids birthday party ideas from NZ parents: themes, activities for mixed ages, and a TV storybook where guests’ messages pop up live.',
    h1: 'Kids birthday party ideas that get everyone involved',
    kicker: 'Kids parties',
    intro: 'The best kids’ parties give every guest something to do, from the toddlers to the grandparents. Here are simple ideas that work at home, in a hall or at the park, without a big budget.',
    product: 'story',
    sections: [
      {
        h2: 'Pick a theme that runs through everything',
        body: ['A theme makes decisions easy: invitations, cake, colours and games all follow it. Favourites with NZ kids include dinosaurs, under the sea, safari animals, farmyard and woodland.'],
      },
      {
        h2: 'Activities for mixed ages',
        body: [],
        list: ['Treasure hunt with picture clues for non-readers', 'Decorate-your-own biscuit or cupcake station', 'Musical statues and pass the parcel for the little ones', 'A photo corner with props for the older kids and adults', 'A birthday message wall where every guest adds a wish'],
      },
      {
        h2: 'Turn birthday messages into a storybook on the TV',
        body: ['Instead of a card box nobody reads until later, guests scan a QR code and write a birthday wish. Each message pops up on the TV as a new storybook page, with animals that dance and the child’s name throughout. Afterwards you can download every page as a printable storybook to keep.'],
        cta: { href: '/tv-story', label: 'See the Birthday Storybook TV' },
      },
      {
        h2: 'Keep the day simple',
        body: ['Two hours is plenty for under-fives. Serve food early, do the cake about two-thirds of the way through, and have a quiet corner for anyone who needs a break.'],
      },
    ],
    faq: [
      ['How long should a kids birthday party be?', 'Around 90 minutes to two hours for under-fives, and two to three hours for older kids.'],
      ['What is a good activity when kids and adults are at the same party?', 'Something everyone can join from where they are, like a birthday message wall. With the storybook TV, guests of any age scan a QR code and write a wish that appears on the TV.'],
      ['Do guests need an app for the storybook?', 'No. They scan the QR code with their phone camera and a page opens.'],
    ],
  },
  {
    slug: 'kids-party-packs-nz',
    title: 'Kids Party Packs NZ: What to Include',
    description: 'What goes in a kids party pack: plates, cups, decorations, party bags and more. A simple checklist for NZ parents, plus themed party packs.',
    h1: 'Kids party packs: what to include',
    kicker: 'Party packs',
    intro: 'A party pack puts the tableware, decorations and extras for a kids’ party in one box, so you’re not running around three shops the week before. Here’s a checklist of what’s worth having.',
    product: null,
    sections: [
      {
        h2: 'The party pack checklist',
        body: [],
        list: ['Plates, cups, napkins and cutlery, matched to your theme', 'Decorations: bunting, a balloon garland and a banner', 'Candles and a cake topper', 'Party bag fillers for each guest', 'Printable invitations and thank-you cards', 'Photo booth props'],
      },
      {
        h2: 'Choose reusable and compostable where you can',
        body: ['Fabric bunting lasts for years of birthdays, and compostable cups and plates mean less goes to landfill. Party bag fillers that get played with (not plastic that breaks the same day) go down better with parents too.'],
      },
      {
        h2: 'Add something for the big screen',
        body: ['If there’s a TV at the venue, put it to work. With the Birthday Storybook TV, guests scan a QR code and their birthday messages pop up on the TV as storybook pages.'],
        cta: { href: '/tv-story', label: 'See the Birthday Storybook TV' },
      },
    ],
    faq: [
      ['What should be in a kids party pack?', 'Tableware (plates, cups, napkins), decorations, candles and a cake topper, party bag fillers, and invitations. Matching them to one theme keeps it simple.'],
      ['How many party bags do I need?', 'One per child guest, plus two or three spares for siblings who turn up.'],
      ['When will your party packs be available?', 'They’re coming back soon. Use “Notify me” on any product page and we’ll email you when they’re in stock.'],
    ],
  },
  {
    slug: 'birthday-slideshow-on-tv',
    title: 'How to Play a Birthday Slideshow on the TV',
    description: 'Make a photo and video slideshow for a 50th, 60th, anniversary or farewell and play it on any TV from a web address. No laptop to babysit.',
    h1: 'How to play a birthday slideshow on the TV',
    kicker: 'Slideshows',
    intro: 'A slideshow of photos through the years is the easiest way to make a milestone birthday, anniversary or farewell feel special. The hard part is usually getting it onto the TV and keeping it running. Here’s the easy way.',
    product: 'slideshow',
    sections: [
      {
        h2: 'Gather the photos early',
        body: ['Ask family a couple of weeks ahead for photos and short videos, and scan a few old prints on your phone. Aim for 50 to 150 items: enough to loop through a couple of times over the night.'],
      },
      {
        h2: 'Skip the laptop on a chair',
        body: ['Instead of a laptop plugged into the TV with a playlist to babysit, upload everything to a web address. Open that address on the TV’s browser and it plays every photo and video in order, then starts again, all night.'],
        cta: { href: '/tv-slideshow', label: 'See the TV Slideshow' },
      },
      {
        h2: 'Tips for a slideshow people watch',
        body: [],
        list: ['Mix eras: baby photos, school photos, holidays, recent ones', 'Keep videos short, under a minute each works best', 'Add a title that shows between rounds, like “Happy 50th, Dad”', 'Test it on the actual TV the day before'],
      },
    ],
    faq: [
      ['How do I play a slideshow on a smart TV?', 'Open the TV’s web browser and go to your slideshow’s address. It plays photos and videos in order and repeats. One click turns the sound on.'],
      ['Can I add photos after it’s set up?', 'Yes. Your private upload page lets you add or remove photos and videos any time.'],
      ['What if a video won’t play on the TV?', 'The slideshow skips anything the TV can’t play, so the show never stops.'],
    ],
  },
];

export const getGuide = (slug: string) => GUIDES.find((g) => g.slug === slug);
