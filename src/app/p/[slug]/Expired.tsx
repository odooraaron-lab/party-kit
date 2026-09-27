export function Expired({ name }: { name: string }) {
  return (
    <div className="party-center">
      <h1 className="story-title">{name}'s story has finished</h1>
      <p>This birthday story is no longer online. Thanks for celebrating!</p>
    </div>
  );
}
