import * as React from "react";
import styles from "./Intersection.module.scss";

export type IntersectionProps = {
  children?: React.ReactNode;
};

const Intersection = ({ children }: IntersectionProps) => {
  const containerRef = React.useRef(null);
  const [isVisible, setIsVisible] = React.useState(true);

  const cbFn = (entries: any) => {
    if (!entries) return;
    const [entry] = entries;
    if (!entry) return;
    setIsVisible(entry.isIntersecting);
  };

  const options = {
    root: null,
    rootMargin: "100px",
    threshold: 0.6,
  };

  React.useEffect(() => {
    const observer = new IntersectionObserver(cbFn, options);
    if (containerRef.current) {
      observer.observe(containerRef.current);
    }
    return () => {
      if (containerRef.current) {
        observer.unobserve(containerRef.current);
      }
    };
  }, [containerRef, options]);

  return (
    <div
      ref={containerRef}
      className={isVisible ? styles.visible : styles.hidden}
    >
      {children}
    </div>
  );
};

export default Intersection;
