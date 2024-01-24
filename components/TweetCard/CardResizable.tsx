import { useCardStore } from "../../store/card";
import { Resizable } from "re-resizable";
import CardOuter from "./CardOuter";
import { MutableRefObject, useEffect, useState, useRef } from "react";
import { MIN_ALLOWED_HEIGHT, MIN_ALLOWED_WIDTH } from "../../store/constants";

interface Props {
  rootRef: MutableRefObject<HTMLDivElement | null>;
}

export default function ResizableTweet({ rootRef }: Props) {
  const [widthBuffer, setWidthBuffer] = useState(750);
  const [heightBuffer, setHeightBuffer] = useState(375);

  const cardWidth = useCardStore((state) => state.width);
  const cardHeight = useCardStore((state) => state.height);
  const setWidth = useCardStore((state) => state.setWidth);
  const setHeight = useCardStore((state) => state.setHeight);
  const setScale = useCardStore((state) => state.setScale);
  const cardRef = useRef<Resizable>(null);

  useEffect(changeScale, [cardWidth]);
  useEffect(() => {
    window.addEventListener('resize', changeScale);

    return () => {
      window.removeEventListener('resize', changeScale);
    }
  }, [])

  function changeScale() {
    const width = (window.innerWidth > 0) ? window.innerWidth : screen.width;
    const currentCardWidth = cardRef.current?.size.width || cardWidth;
    const newScale = (width - 20) / currentCardWidth;

    setScale(() => newScale > 1 ? 1 : newScale);
  }

  function resizeHandler(e: any, dir: any) {
    switch (dir) {
      case "left":
        setWidthBuffer((width) => width - e.movementX);
        break;
      case "right":
        setWidthBuffer((width) => width + e.movementX);
        break;
      case "top":
        setHeightBuffer((height) => height - e.movementY);
        break;
      case "bottom":
        setHeightBuffer((height) => height + e.movementY);
        break;
      case "topLeft":
        setWidthBuffer((width) => width - e.movementX);
        setHeightBuffer((height) => height - e.movementY);
        break;
      case "topRight":
        setWidthBuffer((width) => width + e.movementX);
        setHeightBuffer((height) => height - e.movementY);
        break;
      case "bottomLeft":
        setWidthBuffer((width) => width - e.movementX);
        setHeightBuffer((height) => height + e.movementY);
        break;
      case "bottomRight":
        setWidthBuffer((width) => width + e.movementX);
        setHeightBuffer((height) => height + e.movementY);
        break;
    }
  }

  function resizeStopHandler() {
    if (widthBuffer < MIN_ALLOWED_WIDTH) {
      setWidthBuffer(MIN_ALLOWED_WIDTH);
    }

    if (heightBuffer < MIN_ALLOWED_HEIGHT) {
      setHeightBuffer(MIN_ALLOWED_HEIGHT);
    }
  }

  useEffect(() => {
    setWidth(() => widthBuffer);
  }, [widthBuffer, setWidth]);

  useEffect(() => {
    setHeight(() => heightBuffer);
  }, [heightBuffer, setHeight]);

  return (
    <Resizable
      size={{ width: cardWidth, height: cardHeight }}
      onResize={resizeHandler}
      ref={cardRef}
      onResizeStop={resizeStopHandler}
      className="lg:-translate-x-24"
      minHeight={MIN_ALLOWED_HEIGHT}
      minWidth={MIN_ALLOWED_WIDTH}
    >
      <CardOuter rootRef={rootRef} />
    </Resizable>
  );
}
