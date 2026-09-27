// Markets the printable storybook PDF on the storybook product page.
// The images are real pages made by the PDF generator (with sample messages).
export function KeepsakeFeature() {
  return (
    <section className="section keepsake" id="keepsake" aria-labelledby="keepsake-title">
      <div className="keepsake-visual" aria-hidden="true">
        <img className="kp kp-back" src="/images/storybook-pdf/sample-page-guess.webp" alt="" loading="lazy" width={1287} height={910} />
        <img className="kp kp-mid" src="/images/storybook-pdf/sample-page-wish.webp" alt="" loading="lazy" width={1287} height={910} />
        <img className="kp kp-front" src="/images/storybook-pdf/sample-cover.webp" alt="" loading="lazy" width={1287} height={910} />
      </div>
      <div className="keepsake-copy">
        <span className="ps-tag">Included</span>
        <h2 id="keepsake-title">Every message, in a storybook you can print</h2>
        <p>
          After the party, download a printable-quality PDF of the whole storybook, styled just like it looked on the TV:
          a cover with their name, one page for every guest’s message, and a thank-you page at the end.
        </p>
        <ul className="keepsake-points">
          <li><b>Print-sharp</b><span>Every word and drawing is vector, so it stays crisp at any size</span></li>
          <li><b>Your theme</b><span>The same animals, colours and fonts as your party’s TV</span></li>
          <li><b>A4 landscape</b><span>Print at home, at the print shop, or have it bound into a hardback</span></li>
          <li><b>One page per guest</b><span>With their name, so you’ll always know who wrote what</span></li>
        </ul>
        <p className="muted small">Sample pages shown. Yours uses your guests’ messages and your theme.</p>
      </div>
    </section>
  );
}
