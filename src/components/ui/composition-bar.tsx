interface CompositionBarProps {
  composites: number[]; // Should add up to 100
}
const compositeColours = [
  "ff9980",
  "e4ea6C",
  "0e5b3d",
  "0d5d78",
  "aad5e1",
  "cc99cc",
];

export default function CompositionBar({ composites }: CompositionBarProps) {
  return (
    <div className="bg-muted h-4 rounded-sm relative flex w-full items-center overflow-x-hidden">
      {composites.map((composite, index) => (
        <div
          key={index}
          className={`bg-[#${compositeColours[index % compositeColours.length]}] size-full flex-1 transition-all`}
          style={{ transform: `translateX(-${100 - (composite || 0)}%)` }}
        ></div>
      ))}
    </div>
  );
}
