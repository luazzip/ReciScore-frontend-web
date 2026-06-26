interface SkeletonProps {
  rows?: number;
}

export default function Skeleton({ rows = 3 }: SkeletonProps) {
  return (
    <div className="skeleton-list" aria-hidden="true">
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="skeleton-row" />
      ))}
    </div>
  );
}
