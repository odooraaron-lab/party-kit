import { STORY_PRODUCT, STORY_VIDEO, THEMES } from '@/lib/story';
import { VideoFeature } from '@/components/VideoFeature';
import { KeepsakeFeature } from '@/components/KeepsakeFeature';
import { loadCasts } from '@/lib/cast';
import { ProductStory } from '@/components/ProductStory';
import { PartyScene } from '@/components/PartyScene';
import { ThemePreview } from '@/components/ThemePreview';
import { StoryForm } from './StoryForm';
import { ROOT_DOMAIN } from '@/lib/domain';
import { pageMeta, JsonLd, productLd } from '@/lib/seo';

export const metadata = pageMeta(
  '/tv-story',
  'Kids Birthday Party Idea: QR Code Messages on the TV',
  'A kids birthday party idea for the TV: guests scan a QR code and write a wish that pops up as a storybook page. Five themes, printable storybook PDF. NZ.',
);

export default function TvStoryPage() {
  const casts = loadCasts();
  const dino = THEMES.find((t) => t.id === 'dino') ?? THEMES[0];
  return (
    <>
    <JsonLd data={productLd({ name: STORY_PRODUCT.name, description: STORY_PRODUCT.blurb, path: '/tv-story', price: STORY_PRODUCT.price, category: 'Party apps' })} />
    <ProductStory
      reviewId="story"
      feature={<VideoFeature {...STORY_VIDEO} />}
      afterStats={<KeepsakeFeature />}
      productName={STORY_PRODUCT.name}
      tag="Kids’ parties"
      title="Every guest writes a page of the birthday storybook"
      pitch="Guests scan a QR code and write a birthday message on their phone. Seconds later it pops up on your TV as a new storybook page, with animated animals cheering it on."
      price={STORY_PRODUCT.price}
      scene={<PartyScene crowd="kids" label="Kids and grown-ups cheering at a TV showing a birthday storybook"><ThemePreview theme={dino} art={casts[dino.id]} name="Ari" /></PartyScene>}
      steps={[
        { title: 'Pick a theme and add their name', text: 'Five themes, each with its own animals and colours. Your party site is live the moment you pay.' },
        { title: 'Put it on the TV', text: 'Open your link in the TV’s web browser and print the QR cards for the tables.' },
        { title: 'Guests scan and write', text: 'Each message lands on the TV as a new page. Afterwards, download the printable storybook PDF to keep.' },
      ]}
      reasons={[
        { title: 'Everyone has something to do', text: 'Guests who don’t know anyone have an instant icebreaker: scan, write, watch it land.' },
        { title: 'It’s on the big screen', text: 'Seeing your own message appear on the TV gets a cheer every time, and kids love spotting their names.' },
        { title: 'It works for every age', text: 'Grandparents write the long ones, older kids write the funny ones, toddlers point at the dancing animals.' },
      ]}
      stats={[
        { value: '0', label: 'apps for guests to download' },
        { value: '1', label: 'QR code for the whole party' },
        { value: '2 sec', label: 'how often the TV checks for new pages. Very keen.' },
        { value: '5', label: 'themes, each with its own cast of animals' },
      ]}
      includes={[
        `Your own party site at their-name.${ROOT_DOMAIN}`,
        'The TV storybook with animated animals, music and sound effects',
        'Printable QR cards for the tables and the door',
        'A private host page to change the wording and remove any message',
        'A printable-quality PDF storybook of every message, styled like the TV',
        'A five-minute setup guide',
      ]}
      orderTitle="Make your storybook"
    >
      <StoryForm casts={casts} />
    </ProductStory>
    </>
  );
}
