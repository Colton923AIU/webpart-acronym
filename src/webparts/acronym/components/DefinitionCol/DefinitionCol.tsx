import * as React from "react";
import styles from "../Acronym.module.scss";
import Intersection from "../../../../components/Intersection/Intersection";
import AckDef from "../AckDef/AckDef";

export interface IDefinitionColProps {
  definition: string | null;
  additionalInformation: string | null;
  categories: string[] | null;
}

const DefinitionCol = (props: IDefinitionColProps) => {
  return (
    <div
      className={`${styles.flex} ${styles.center} ${styles.col} ${styles.acronym_def}`}
    >
      <Intersection key={"def"}>
        <AckDef {...props} />
      </Intersection>
    </div>
  );
};

export default DefinitionCol;
