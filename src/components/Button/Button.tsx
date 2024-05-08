import * as React from "react";
import styles from "./Button.module.scss";

interface IButtonProps {
  onClick: (keyofAcronym: string) => void;
  keyofAcronym: string;
  selectedLetter?: string | null;
  children: React.ReactNode;
  variant?: "letter" | "acronym";
}

const Button = ({
  onClick,
  keyofAcronym,
  selectedLetter,
  children,
  variant,
}: IButtonProps) => {
  const getClassName = () => {
    let cn = styles.min_size;

    if (selectedLetter === keyofAcronym) {
      cn += ` ${styles.selected_letter}`;
    } else {
      cn += ` ${styles.letter}`;
    }

    if (variant === "acronym") {
      cn += ` ${styles.acronym}`;
    }

    return cn;
  };

  if (keyofAcronym == "") return null;
  return (
    <span
      className={getClassName()}
      onClick={() => {
        onClick(keyofAcronym);
      }}
      id={keyofAcronym}
    >
      {children}
    </span>
  );
};

export default Button;
