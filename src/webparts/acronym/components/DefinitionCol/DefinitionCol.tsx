import * as React from "react";
import styles from "../Acronym.module.scss";
import Intersection from "../../../../components/Intersection/Intersection";
import AckDef from "../AckDef/AckDef";

interface IDefinitionColProps {
  definition: string | null;
}

const DefinitionCol = ({ definition }: IDefinitionColProps) => {
  return (
    <div
      className={`${styles.flex} ${styles.center} ${styles.col} ${styles.acronym_def}`}
    >
      <Intersection key={"def"}>
        <AckDef def={definition} />
      </Intersection>
    </div>
  );
};

export default DefinitionCol;
