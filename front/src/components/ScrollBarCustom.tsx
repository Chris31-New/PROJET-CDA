import SimpleBar from "simplebar-react";
import type { ReactNode } from "react";
import { useRef } from "react";

interface ScrollBarProps {
  children: ReactNode;
  width?: string;
  height?: string;
  className?: string;
  direction?: "x" | "y" | "both";
}

const ScrollBarCustom = ({
  children,
  width = "100%",
  height = "auto",
  className = "",
  direction,
}: ScrollBarProps) => {
  const wrapperRef = useRef<HTMLDivElement | null>(null);
  const isDown = useRef(false);
  const startX = useRef(0);
  const scrollLeft = useRef(0);

  const getScrollableNode = () => {
    return wrapperRef.current?.querySelector(
      ".simplebar-content-wrapper"
    ) as HTMLDivElement | null;
  };

  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    if (direction === "y") return;

    const scrollEl = getScrollableNode();
    if (!scrollEl) return;

    isDown.current = true;
    startX.current = e.pageX;
    scrollLeft.current = scrollEl.scrollLeft;
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (direction === "y") return;

    const scrollEl = getScrollableNode();
    if (!isDown.current || !scrollEl) return;

    e.preventDefault();
    const x = e.pageX;
    const walk = x - startX.current;

    scrollEl.scrollLeft = scrollLeft.current - walk;
  };

  const stopDragging = () => {
    isDown.current = false;
  };

  const overflowStyle =
    direction === "x"
      ? { overflowX: "auto", overflowY: "hidden" }
      : direction === "y"
      ? { overflowY: "auto", overflowX: "hidden" }
      : { overflowX: "auto", overflowY: "auto" };

  return (
    <div
      ref={wrapperRef}
      className={`select-none ${direction !== "y" ? "cursor-grab active:cursor-grabbing" : ""} ${className}`}
      style={{ width, height }}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={stopDragging}
      onMouseLeave={stopDragging}
    >
      <SimpleBar
        style={{ width: "100%", height: "100%" }}
        autoHide={false}
        scrollableNodeProps={{
          style: overflowStyle,
        }}
      >
        {children}
      </SimpleBar>
    </div>
  );
};

export default ScrollBarCustom;