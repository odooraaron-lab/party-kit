import { SLIDESHOW_PRODUCT as P } from '@/lib/slideshow-config';
import { ProductStory } from '@/components/ProductStory';
import { PartyScene } from '@/components/PartyScene';
import { SlideshowForm } from './SlideshowForm';
import { pageMeta, JsonLd, productLd } from '@/lib/seo';

export const metadata = pageMeta(
  '/tv-slideshow',
  'TV Slideshow for Parties: Photos & Videos on Any TV',
  'Upload photos and videos and get a web address that plays them on any TV, at home or at the venue, on repeat. 21sts, 50ths, weddings and farewells. No laptop or USB needed.',
);

export default function SlideshowPage() {
  return (
    <>
    <JsonLd data={productLd({ name: P.name, description: P.blurb, path: '/tv-slideshow', price: P.price, category: 'Party apps' })} />
    <ProductStory
      reviewId="slideshow"
      productName={P.name}
      tag="Any occasion"
      title="Your photos and videos, playing on any TV"
      pitch="Upload them before the day, get your own web address, and open it on the TV. It plays on a loop while everyone catches up."
      price={P.price}
      priceNote="One-time payment. Upload straight after paying."
      scene={<PartyScene crowd="family" wall="#FFF6E6" label="A family laughing at old photos on the TV"><div className="ss-preview"><span>Happy 50th, Dad</span></div></PartyScene>}
      steps={[
        { title: 'Pick your address and title', text: 'Something like happy-50th-dad. The title shows on screen between rounds.' },
        { title: 'Upload photos and videos', text: 'From your phone or computer, straight after paying. Come back to add more any time.' },
        { title: 'Open it on the TV', text: 'It plays everything in order, then starts again. One click turns the sound on.' },
      ]}
      reasons={[
        { title: 'It starts conversations', text: 'Old photos on a big screen get people talking. “Is that you?” “Look at that hair!”' },
        { title: 'Nothing to run on the day', text: 'No laptop to babysit or playlist to manage. Open the address and let it play.' },
        { title: 'Made for milestones', text: 'Big birthdays, anniversaries, farewells — anywhere a room full of people shares a history.' },
      ]}
      stats={[
        { value: `${P.maxItems}`, label: 'photos and videos in one slideshow' },
        { value: `${Math.round(P.maxVideoSeconds / 60)} min`, label: 'per video, so the good speeches fit' },
        { value: '1', label: 'click on the TV for sound' },
        { value: '0', label: 'cables, if your TV has a web browser' },
      ]}
      includes={[
        'Your own web address that plays the slideshow',
        'A private upload page for photos and videos',
        'A title card between rounds',
        `Plays on a loop for ${P.monthsLive} months`,
      ]}
      orderTitle="Make your slideshow"
    >
      <SlideshowForm />
    </ProductStory>
    </>
  );
}
