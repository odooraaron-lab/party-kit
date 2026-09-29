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
  category: 'events' | 'kids' | 'photos';
  sections: GuideSection[];
  faq: [string, string][];
};

export const GUIDES: Guide[] = [
  {
    slug: 'qr-code-photo-sharing-for-parties',
    category: 'photos',
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
    category: 'photos',
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
    category: 'kids',
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
    category: 'kids',
    title: 'Kids Party Packs NZ: What to Include',
    description: 'What goes in a kids party pack: plates, cups, decorations, party bags and more. A simple checklist for NZ parents.',
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
    ],
  },
  {
    slug: 'birthday-slideshow-on-tv',
    category: 'photos',
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
  // ─────────── Events & venues ───────────
  {
    slug: 'display-photos-on-tv-at-venue',
    category: 'events',
    title: 'How to Show Photos on the TV at a Bar or Function Venue',
    description: 'Having a 21st, engagement or work do at a bar, restaurant or function room? Put your photos on the venue’s TVs from a web link. No laptop, no USB, no AV hire.',
    h1: 'How to show photos on the TV at a bar or function venue',
    kicker: 'Events at venues',
    intro: 'Most bars, restaurants and function rooms have TVs on the wall, but getting your own photos onto them is where parties usually come unstuck: a laptop on a chair, an HDMI cable that doesn’t reach, a USB stick the TV won’t read, or a screen system only the venue can run. There’s an easier way.',
    product: 'photos',
    sections: [
      {
        h2: 'The usual options (and why they’re a hassle)',
        body: [],
        list: [
          'A laptop plugged into the TV: someone has to babysit it, and it goes to sleep mid-speech.',
          'A USB stick: many TVs won’t play every photo or video format, and you can’t add new photos on the night.',
          'The venue’s own screen or music-video system: often only staff can run it, if they can add your content at all.',
          'Hiring AV gear: great for big events, expensive for a birthday.',
        ],
      },
      {
        h2: 'The easy way: a web link on the TV',
        body: [
          'Most smart TVs have a web browser, and most venues have a Chromecast or streaming stick behind at least one screen. That’s all you need. Wishcast gives you a web address for your event: open it on the venue’s TV and it plays your photos full screen, all night, on its own.',
          'Choose a live photo wall, where guests scan a QR code and their photos pop up on the TV as they take them, or a slideshow of photos and videos you upload beforehand. Or both on different screens.',
        ],
        cta: { href: '/photo-wall', label: 'See the Party Photo Wall' },
      },
      {
        h2: 'What to ask the venue when you book',
        body: [],
        list: [
          'Which TVs are in our area, and do they have a web browser or a Chromecast/streaming stick?',
          'Can staff open a web address on the TV for us, or can we do it ourselves?',
          'Is there guest Wi-Fi we can put on the QR cards?',
          'Can we have the TV sound off (or on for speeches)?',
          'Can we come in 15 minutes early to test it?',
        ],
      },
      {
        h2: 'On the night',
        body: ['Open the link on the TV before guests arrive, put the QR cards on the tables and the bar, and you’re done. New photos jump the queue so everyone sees theirs within seconds. Afterwards, download every guest photo in one zip.'],
      },
    ],
    faq: [
      ['Can I use the venue’s TV?', 'Usually, yes. If the TV has a web browser or a Chromecast or streaming stick, staff can open your link in a minute. Check when you book.'],
      ['Do I need a laptop?', 'No. The TV plays the web link by itself. A laptop plugged into the TV also works as a backup.'],
      ['Can I show it on more than one TV?', 'Yes. Open the same link on as many screens as you like.'],
      ['Do guests need an app?', 'No. They scan a QR code with their phone camera and add photos from their camera roll.'],
    ],
  },
  {
    slug: '21st-birthday-photo-slideshow',
    category: 'events',
    title: '21st Birthday Photo Slideshow & Live Photo Wall on the TV',
    description: 'Ideas for a 21st at a bar or venue: a throwback slideshow of baby photos on the TV, plus a live photo wall where guests share photos by QR code. NZ.',
    h1: '21st birthday ideas: a throwback slideshow and a live photo wall',
    kicker: '21sts',
    intro: 'A 21st is when the embarrassing baby photos come out, and when every guest is taking photos you’ll never see. Put both on the TV: a throwback slideshow for the speeches and a live photo wall for the rest of the night.',
    product: 'photos',
    sections: [
      {
        h2: 'Before the party: the throwback slideshow',
        body: [
          'Ask family for baby photos, school photos, sports teams, holidays and awkward teenage phases. Aim for 50 to 150 photos and a few short videos. Upload them to a TV slideshow and you get a web address that plays them on repeat on the venue’s TV. Perfect during dinner and before the speeches.',
        ],
        cta: { href: '/tv-slideshow', label: 'See the TV Slideshow' },
      },
      {
        h2: 'On the night: the live photo wall',
        body: ['Put QR cards on the tables and the bar. Guests scan with their phone camera, add their photos, and they pop up on the TV within seconds with the photographer’s name. It gets people mingling, and by the end of the night you have every guest’s photos in one album.'],
        cta: { href: '/photo-wall', label: 'See the Party Photo Wall' },
      },
      {
        h2: '21st photo ideas guests love',
        body: [],
        list: ['A “then and now” photo with the birthday person', 'Every friend group, one photo each', 'The cake and the key', 'The speeches (and the reactions)', 'The dance floor, late', 'A photo with the grandparents'],
      },
      {
        h2: 'Checklist for a 21st at a venue',
        body: [],
        list: ['Ask the venue which TVs you can use and how to open a web link on them', 'Print the QR cards and bring a few extra', 'Test your links on the TV before guests arrive', 'Nominate a friend to keep an eye on the photo wall from the host page', 'Close uploads at the end of the night and download the zip'],
      },
    ],
    faq: [
      ['How do I play a 21st slideshow at a bar?', 'Upload your photos and videos to a TV slideshow, then open its web address on the venue’s TV. It plays on repeat with no laptop needed.'],
      ['Can guests add photos during the party?', 'Yes, with a live photo wall. Guests scan a QR code and their photos appear on the TV straight away.'],
      ['Can I remove a photo if someone posts something silly?', 'Yes. Your private host page lets you remove any photo instantly, or pause uploads.'],
    ],
  },
  {
    slug: 'work-christmas-party-ideas',
    category: 'events',
    title: 'Work Christmas Party Ideas: A Live Photo Wall on the TV',
    description: 'A simple work Christmas party idea for NZ teams: staff scan a QR code and their photos appear live on the venue TV. Keep every photo afterwards. No app.',
    h1: 'Work Christmas party ideas: put the team on the big screen',
    kicker: 'Christmas parties',
    intro: 'The best work Christmas parties get people who don’t usually mix talking to each other. A live photo wall does that on its own: staff scan a QR code, their photos pop up on the venue’s TV, and everyone wanders over to see who’s next.',
    product: 'photos',
    sections: [
      {
        h2: 'How it works at a work do',
        body: ['Set up your photo wall with the company or team name, and pick a look. On the night, open the link on the venue’s TV and put QR cards on the tables and the bar. Staff add photos from their phones, with no app and no sign-up, and every photo plays on the screen with the name of who took it.'],
        cta: { href: '/photo-wall', label: 'See the Party Photo Wall' },
      },
      {
        h2: 'Keep it work-appropriate',
        body: ['You stay in control. From your private host page you can remove any photo instantly, hide the album, close uploads, or change the wording on screen. Nothing is public or searchable.'],
      },
      {
        h2: 'More Christmas party ideas that suit a photo wall',
        body: [],
        list: ['A Secret Santa reveal photo', 'Best Christmas jumper or Hawaiian shirt competition', 'Team photos: one per department', 'A “year in photos” slideshow of the team’s highlights', 'Photo challenges on the table cards: “a photo with someone from another team”'],
      },
      {
        h2: 'After the party',
        body: ['Download every photo in one zip for the staff newsletter, intranet or next year’s invite. The album stays online for six months, then it’s deleted.'],
      },
    ],
    faq: [
      ['Is it suitable for a corporate Christmas party?', 'Yes. It’s private to your event, you can remove any photo, and you can close uploads at any time.'],
      ['Can we show it on the venue’s TVs?', 'Usually. Any TV with a web browser, or a Chromecast or streaming stick, can open your link. Check with the venue when you book.'],
      ['Can the company pay by invoice?', 'Checkout is by card, Apple Pay or Google Pay, and you get a receipt for your expense claim.'],
    ],
  },
  {
    slug: 'corporate-event-photo-sharing',
    category: 'events',
    title: 'Corporate Event Photo Sharing: QR Code to a Live TV Wall',
    description: 'Collect photos from staff and guests at conferences, awards nights, launches and farewells with a QR code, shown live on screen. Download all photos after.',
    h1: 'Photo sharing for corporate events, awards nights and farewells',
    kicker: 'Corporate events',
    intro: 'At a conference, awards night or product launch, the best photos are on your guests’ phones. A QR code collects them all in one place, and a live photo wall on the screens gives the room something to watch between speeches.',
    product: 'photos',
    sections: [
      {
        h2: 'Where it works well',
        body: [],
        list: ['Awards nights and staff celebrations', 'Conferences and team off-sites', 'Product launches and client functions', 'Farewells and retirement parties', 'Team-building days and sports events'],
      },
      {
        h2: 'How it works',
        body: ['Choose a web address for your event and a look. Open the link on the venue’s screens and put QR cards on tables, lanyards or slides. Guests scan and add photos from their phones, with no app, and they appear on screen within seconds with the photographer’s name.'],
        cta: { href: '/photo-wall', label: 'See the Party Photo Wall' },
      },
      {
        h2: 'Control and privacy',
        body: ['Your host page lets you remove any photo, pause uploads, hide the album and change the wording. Location data is stripped from photos before they’re shared, and the album isn’t public or searchable. Remind guests to only share photos of people who are happy to be on screen.'],
      },
      {
        h2: 'Use the photos afterwards',
        body: ['Download every photo in one zip for internal comms, the intranet or a recap post (with people’s permission). Handy when the photographer can’t be everywhere.'],
      },
    ],
    faq: [
      ['How many photos can guests upload?', 'Up to 1,500 photos per album.'],
      ['Can we run it on several screens?', 'Yes. Open the same link on as many screens as you like.'],
      ['Is there a subscription?', 'No. It’s a one-time payment per event.'],
    ],
  },
  {
    slug: 'wedding-qr-code-photo-sharing',
    category: 'events',
    title: 'Wedding QR Code Photo Sharing & Live Slideshow (NZ)',
    description: 'Let wedding guests scan a QR code to share their photos, shown live on the reception venue’s TV or projector. One album, one download. No app. NZ.',
    h1: 'Wedding QR code photo sharing, live on the reception screen',
    kicker: 'Weddings',
    intro: 'Your photographer captures the big moments. Your guests capture everything else: the kids on the dance floor, the table jokes, the moment the best man lost his notes. A QR code brings all of those photos to you, and a live slideshow on the reception screen shares them with the room.',
    product: 'photos',
    sections: [
      {
        h2: 'How it works',
        body: ['Put a QR card on each table. Guests scan it with their phone camera, choose photos from their camera roll or take new ones, and they appear on the venue’s TV or projector within seconds. Everything lands in one album you can download afterwards.'],
        cta: { href: '/photo-wall', label: 'See the Party Photo Wall' },
      },
      {
        h2: 'A slideshow of your story, too',
        body: ['Before the reception, play a slideshow of the two of you through the years, with baby photos, how you met, travels and the proposal, on repeat during pre-dinner drinks.'],
        cta: { href: '/tv-slideshow', label: 'See the TV Slideshow' },
      },
      {
        h2: 'Tips for the reception',
        body: [],
        list: ['Ask the venue which screen or projector you can use and how to open a web link on it', 'Add the venue Wi-Fi to your table cards', 'Pick the Champagne look to match an elegant reception', 'Ask the MC to mention the QR code after the entrées', 'Nominate someone other than you to watch the host page'],
      },
    ],
    faq: [
      ['Do wedding guests need an app?', 'No. They scan the QR code with their phone camera and add photos in the browser.'],
      ['How long can we keep the photos?', 'The album stays online for six months. Download every photo as one zip whenever you like.'],
      ['Can we hide the album until after the wedding?', 'Yes. You can hide the album, close uploads and remove photos from your host page.'],
    ],
  },
  {
    slug: 'function-venue-photo-wall',
    category: 'events',
    title: 'For Hospitality Venues: Offer a Guest Photo Wall at Functions',
    description: 'Bars, restaurants and function venues: give your function bookings a live guest photo wall on your TVs with no AV setup. Guests scan a QR code. NZ.',
    h1: 'For bars, restaurants and function venues',
    kicker: 'For venues',
    intro: 'Function guests increasingly ask to put photos on your screens, for 21sts, engagements, work dos and Christmas parties. Instead of plugging in their laptop or learning your screen system, point them to Wishcast: they get a web link that plays on your TVs, and guests add photos with a QR code.',
    product: 'photos',
    sections: [
      {
        h2: 'Why venues like it',
        body: [],
        list: [
          'No laptops, cables or USB sticks behind the bar',
          'Nothing for staff to learn: just open a web address on the TV',
          'Works alongside your existing screens and music system',
          'The host manages their own photos, so your team doesn’t have to',
          'A better night for the group means more rebookings',
        ],
      },
      {
        h2: 'What your screens need',
        body: ['Any TV with a web browser, or any TV with a Chromecast, Fire TV Stick or similar. If your screens run a separate signage or music-video system, one TV on a spare input or a streaming stick is enough for a function.'],
      },
      {
        h2: 'How to offer it',
        body: ['Mention it in your function pack or booking confirmation: “Want your photos on our TVs? Set up a Wishcast photo wall at myqr.co.nz/photo-wall.” Hosts buy it themselves in a couple of minutes and bring the link on the night.'],
        cta: { href: '/photo-wall', label: 'See the Party Photo Wall' },
      },
      {
        h2: 'Use the same TVs for your specials',
        body: ['Between functions, your screens can sell for you. myQR Digital Signage shows your food and drink specials, events and announcements on every TV in the venue, scheduled by day and hour, from $39 a month.'],
        cta: { href: 'https://digitalsignage.myqr.co.nz', label: 'See Digital Signage' },
      },
    ],
    faq: [
      ['Does the venue pay for it?', 'No. The person hosting the function buys it for their event.'],
      ['What do staff need to do?', 'Open the host’s web link on the TV at the start of the function. That’s it.'],
      ['Will it interfere with our screen system?', 'No. It’s just a web page on the TV. Switch back to your usual input afterwards.'],
      ['Can we use the same TVs for our own specials?', 'Yes. Our sister service, myQR Digital Signage (digitalsignage.myqr.co.nz), puts your food and drink specials and events on the same TVs for one flat monthly price.'],
    ],
  },
  // ─────────── Kids & QR codes ───────────
  {
    slug: 'first-birthday-party-ideas',
    category: 'kids',
    title: 'First Birthday Party Ideas NZ: A Keepsake from Every Guest',
    description: 'First birthday party ideas that make a keepsake: guests scan a QR code and write a wish for baby that pops up on the TV, then it becomes a printable storybook.',
    h1: 'First birthday party ideas that become a keepsake',
    kicker: 'First birthdays',
    intro: 'Baby won’t remember their first birthday, but you can keep what everyone said. Instead of a guest book nobody signs, let guests scan a QR code and write a wish for baby. Each one pops up on the TV as a storybook page, and afterwards you get the whole storybook as a printable PDF.',
    product: 'story',
    sections: [
      {
        h2: 'A wish from every guest',
        body: ['Grandparents, aunties, friends and the other babies’ parents each write a message. They appear on the TV one by one during the party, and they’re saved in a storybook to read to your child when they’re older.'],
        cta: { href: '/tv-story', label: 'See the Birthday Storybook TV' },
      },
      {
        h2: 'Simple first birthday ideas',
        body: [],
        list: ['Keep it short: one to two hours around nap time', 'A smash cake on a plastic sheet', 'A photo spot with the month-by-month photos from the year', 'A time capsule: guests add a note or a newspaper from the day', 'A gentle theme: farm, ocean, safari or woodland', 'Food the grown-ups want, because they’re the main guests'],
      },
      {
        h2: 'A slideshow of the first year',
        body: ['Play a slideshow of baby’s first year on the TV: newborn photos, first smiles, first foods, first steps.'],
        cta: { href: '/tv-slideshow', label: 'See the TV Slideshow' },
      },
    ],
    faq: [
      ['What can I do at a first birthday party?', 'Keep it short and simple, focus on the grown-ups, and make a keepsake: guest wishes, a first-year slideshow and plenty of photos.'],
      ['Do guests need an app to write a message?', 'No. They scan a QR code with their phone camera and type their wish.'],
      ['Can I print the messages?', 'Yes. You get a printable storybook PDF of every wish.'],
    ],
  },
  {
    slug: 'qr-code-party-ideas',
    category: 'photos',
    title: 'QR Code Party Ideas: 8 Ways to Use QR Codes at a Party',
    description: 'Fun ways to use QR codes at a party: guest photo sharing, birthday wishes on the TV, a digital guest book, playlists and more. No app needed. NZ ideas.',
    h1: '8 ways to use QR codes at a party',
    kicker: 'QR codes',
    intro: 'Everyone’s phone camera can scan a QR code now, which makes them the easiest way to get guests joining in. Here are eight ways to use them at a party, from kids’ birthdays to 21sts and work dos.',
    product: null,
    sections: [
      {
        h2: '1. Guest photo sharing',
        body: ['Guests scan and add photos to one shared album, shown live on the TV. No more chasing photos in the group chat.'],
        cta: { href: '/photo-wall', label: 'Party Photo Wall' },
      },
      {
        h2: '2. Birthday wishes on the TV',
        body: ['Guests scan and write a birthday message that pops up on the TV as a storybook page. A favourite at kids’ parties.'],
        cta: { href: '/tv-story', label: 'Birthday Storybook TV' },
      },
      {
        h2: '3. A digital guest book',
        body: ['Replace the paper guest book with messages guests write on their phones, then keep them as a printable PDF.'],
      },
      {
        h2: '4. The playlist',
        body: ['Link to a shared playlist so guests can add songs for the night.'],
      },
      {
        h2: '5. Wi-Fi details',
        body: ['Put the venue or home Wi-Fi on the same card as your photo QR code, so uploads are quick.'],
      },
      {
        h2: '6. RSVPs and details',
        body: ['A QR code on the invite linking to the time, address, parking and dress code.'],
      },
      {
        h2: '7. Photo challenges',
        body: ['Print challenges next to the QR code: “a photo with the oldest guest”, “the best dance move”, “a selfie with the cake”.'],
      },
      {
        h2: '8. Thank-yous afterwards',
        body: ['Share the photo album link in your thank-you message so everyone can see and download the night.'],
      },
    ],
    faq: [
      ['Do guests need an app to scan a QR code?', 'No. iPhone and Android phone cameras scan QR codes directly.'],
      ['Where should I put the QR codes?', 'On every table, at the bar and by the door. The TV can show it too.'],
      ['How big should a QR code be?', 'About 3 to 5 cm across on a table card is easy to scan.'],
    ],
  },
  {
    slug: 'kids-party-games-and-activities',
    category: 'kids',
    title: 'Kids Party Activities That Include Everyone (NZ Ideas)',
    description: 'Kids party activities for mixed ages, shy kids and the grown-ups too: classic games, a TV storybook of birthday wishes, crafts and photo fun. NZ ideas.',
    h1: 'Kids party activities that include everyone',
    kicker: 'Kids parties',
    intro: 'The best kids’ parties have something for the toddler siblings, the shy ones, the too-cool older cousins and the grown-ups standing around with a cuppa. Here’s a mix of activities that keeps everyone involved.',
    product: 'story',
    sections: [
      {
        h2: 'Classic games that always work',
        body: [],
        list: ['Pass the parcel (a prize in every layer)', 'Musical statues or musical chairs', 'Treasure hunt with picture clues for non-readers', 'Sack races and egg-and-spoon outside', 'Piñata for the big finish'],
      },
      {
        h2: 'Quiet activities for shy kids',
        body: [],
        list: ['A colouring and sticker table', 'Decorate-your-own cupcake or biscuit', 'Play-dough station', 'A reading corner with a few favourite books'],
      },
      {
        h2: 'Something for the grown-ups',
        body: ['Parents and grandparents can join in with a birthday storybook on the TV: they scan a QR code and write a wish for the birthday child, and it pops up as a storybook page. Kids love seeing their name on the screen, and you keep every message as a printable PDF.'],
        cta: { href: '/tv-story', label: 'See the Birthday Storybook TV' },
      },
      {
        h2: 'Tips for running the day',
        body: [],
        list: ['Plan about 20 minutes per activity for under-fives', 'Have a quiet space for overwhelmed kids', 'Do food before the cake, and the cake before the tired meltdowns', 'Recruit a grown-up to run each game'],
      },
    ],
    faq: [
      ['What activities work for mixed ages?', 'Treasure hunts with picture clues, pass the parcel, crafts, and anything the grown-ups can join, like writing wishes on the TV storybook.'],
      ['How many activities do I need?', 'Three or four for a two-hour party, plus food, cake and presents.'],
      ['Do guests need an app for the TV storybook?', 'No. They scan a QR code with their phone camera and type a wish.'],
    ],
  },
];

export const CATEGORIES: { id: Guide['category']; name: string; blurb: string }[] = [
  { id: 'events', name: 'Events, 21sts & venues', blurb: 'Photos on the TV at bars, restaurants and function venues: 21sts, weddings, work Christmas parties and corporate events.' },
  { id: 'kids', name: 'Kids parties', blurb: 'Ideas that keep every kid (and grown-up) involved.' },
  { id: 'photos', name: 'QR codes, photos & slideshows', blurb: 'Guest photo sharing, QR code ideas and slideshows on any TV.' },
];

export const getGuide = (slug: string) => GUIDES.find((g) => g.slug === slug);
