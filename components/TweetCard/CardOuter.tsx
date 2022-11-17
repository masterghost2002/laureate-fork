import CardInner from "./CardInner";
import { useCardStore } from "../../store/card";
import { useGradientStore } from "../../store/gradient";
import { LegacyRef, MutableRefObject } from "react";

interface Props {
  rootRef: MutableRefObject<HTMLDivElement | null>
}

export default function CardOuter({ rootRef }: Props) {
  const gradient = useGradientStore((state) => state.selectedGradient);

  const radius = useCardStore((state) => state.radius);

  return (
    <div
      ref={rootRef}
      style={{
        background: `linear-gradient(to bottom right, ${gradient.from}, ${gradient.to})`,
        borderRadius: `${radius}px`,
      }}
      className="flex h-full items-center justify-center overflow-hidden py-16 px-20 leading-normal shadow-md"
    >
      <CardInner />
    </div>
  );
}
