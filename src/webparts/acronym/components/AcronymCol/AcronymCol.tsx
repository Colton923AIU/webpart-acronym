import * as React from "react";
import styles from "../Acronym.module.scss";
import Intersection from "../../../../components/Intersection/Intersection";
import Button from "../../../../components/Button/Button";

export interface IAcronymColProps {
  acronyms: string[];
  acronymHandler: (acronym: string) => void;
  selectedAcronym: string | null;
}

const AcronymCol = ({
  acronyms,
  acronymHandler,
  selectedAcronym,
}: IAcronymColProps) => {
  console.log("acronyms: ", acronyms);
  return (
    <div
      className={`${styles.flex} ${styles.col} ${styles.acronym_ack} ${styles.scroll_y}`}
      id={"ack-scroller"}
    >
      {acronyms
        .filter((ack) => {
          if (ack !== "additionalInformation" && ack !== "categories") {
            return true;
          }
          return false;
        })
        .map((ack) => {
          if (!ack) return null;
          return (
            <Intersection key={"button_letters" + "_" + ack}>
              <Button
                keyofAcronym={ack}
                selectedLetter={selectedAcronym}
                onClick={() => {
                  acronymHandler(ack);
                }}
                variant="acronym"
              >
                {ack}
              </Button>
            </Intersection>
          );
        })}
    </div>
  );
};

export default AcronymCol;
