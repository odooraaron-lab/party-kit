// Display-only stars (e.g. 4.5 → four and a half).
export function Stars({ value, size = 18 }: { value: number; size?: number }) {
  return (
    <span className="stars" role="img" aria-label={`${value} out of 5 stars`} style={{ fontSize: size }}>
      {[1, 2, 3, 4, 5].map((n) => {
        const fill = Math.max(0, Math.min(1, value - (n - 1)));
        return (
          <span key={n} className="star" aria-hidden="true">
            <span className="star-bg">★</span>
            <span className="star-fg" style={{ width: `${fill * 100}%` }}>★</span>
          </span>
        );
      })}
    </span>
  );
}
