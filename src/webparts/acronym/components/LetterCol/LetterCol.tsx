import * as React from "react";
import styles from "../Acronym.module.scss";
import Intersection from "../../../../components/Intersection/Intersection";
import Button from "../../../../components/Button/Button";

interface ILetterColProps {
  letters: string[];
  letterHandler: (letter: string) => void;
  selectedLetter: string | null;
}

const LetterCol = ({
  letters,
  letterHandler,
  selectedLetter,
}: ILetterColProps) => {
  return (
    <div
      className={`${styles.flex} ${styles.col} ${styles.acronym_letters} ${styles.scroll_y}`}
      id={"let-scroller"}
    >
      {letters.map((letter) => {
        return (
          <Intersection key={letter}>
            <Button
              key={"button_letter" + "_" + letter}
              keyofAcronym={letter}
              selectedLetter={selectedLetter}
              onClick={() => {
                letterHandler(letter);
              }}
              variant="letter"
            >
              {letter}
            </Button>
          </Intersection>
        );
      })}
    </div>
  );
};

export default LetterCol;
