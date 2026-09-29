import { PHOTO_PRODUCT, PHOTO_THEMES } from '@/lib/photo-config';
import { ProductStory } from '@/components/ProductStory';
import { PartyScene } from '@/components/PartyScene';
import { PhotoPreview } from '@/components/PhotoPreview';
import { PhotoForm } from './PhotoForm';
import { ROOT_DOMAIN } from '@/lib/domain';
import { pageMeta, JsonLd, productLd } from '@/lib/seo';

export const metadata = pageMeta(
  '/photo-wall',
  'Live Party Photo Wall: QR Code Photo Sharing on Any TV',
  'Guests scan a QR code and their photos play live on the TV, at home or on a bar or function venue’s screens. 21sts, weddings, work Christmas parties. No app. NZ.',
);

export default function PhotoWallPage() {
  return (
    <>
    <JsonLd data={productLd({ name: PHOTO_PRODUCT.name, description: PHOTO_PRODUCT.blurb, path: '/photo-wall', price: PHOTO_PRODUCT.price, category: 'Party apps' })} />
    <ProductStory
      reviewId="photos"
      productName={PHOTO_PRODUCT.name}
      tag="Grown-up parties"
      title="Every guest’s photos, live on the big screen"
      pitch="Guests scan a QR code and add photos straight from their phone. They play on the TV as a live slideshow and land in one album you keep."
      price={PHOTO_PRODUCT.price}
      scene={<PartyScene crowd="adults" wall="#F3EEF8" label="Friends at a party cheering at their photos on the TV"><PhotoPreview theme={PHOTO_THEMES[0]} name="Sam's 40th" /></PartyScene>}
      steps={[
        { title: 'Name your event and pick a look', text: 'Four looks, from Champagne to Neon Night. Choose your web address too.' },
        { title: 'Put the slideshow on the TV', text: 'Open your link on the TV and print the QR cards for the tables and the bar.' },
        { title: 'Guests scan and share', text: 'Photos appear on the TV within seconds. Afterwards, download every photo in one go.' },
      ]}
      reasons={[
        { title: 'Photos from every angle', text: 'You can’t be everywhere. Your guests are, and now their photos come to you instead of staying on their phones.' },
        { title: 'The screen breaks the ice', text: 'A photo pops up, someone laughs, someone else goes to take a better one. It snowballs.' },
        { title: 'No chasing afterwards', text: 'No group chat begging for photos the next day. They’re already in your album.' },
      ]}
      stats={[
        { value: '0', label: 'group chats to chase for photos afterwards' },
        { value: '1,500', label: 'photos per album' },
        { value: '7 sec', label: 'per photo on the TV. New ones jump the queue.' },
        { value: '1', label: 'zip file with every photo, for keeps' },
      ]}
      includes={[
        `Your own album at your-event.${ROOT_DOMAIN}`,
        'A live TV slideshow with the QR code always on screen',
        'A shared album guests can browse on their phones',
        'Printable QR cards',
        'A private host page: remove photos, hide the album, close uploads, change wording',
        `Every photo as one download. The album stays online for ${PHOTO_PRODUCT.monthsLive} months`,
      ]}
      orderTitle="Set up your photo wall"
    >
      <PhotoForm />
    </ProductStory>
    </>
  );
}
