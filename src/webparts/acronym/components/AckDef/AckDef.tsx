import * as React from "react";
import styles from "./AckDef.module.scss";
import { IDefinitionColProps } from "../DefinitionCol/DefinitionCol";

const AckDef = ({
  definition,
  additionalInformation,
  categories,
}: IDefinitionColProps) => {
  return (
    <div className={definition === "" ? styles.empty : styles.wrapper}>
      <div className={styles.catWrapper}>
        {categories
          ? categories.map((category, idx) => {
              return (
                <div className={styles.cat} key={`cat_${idx}`}>
                  {category}
                </div>
              );
            })
          : null}
      </div>
      <div className={styles.upper}>
        <div className={styles.upperText}>{definition}</div>
      </div>
      <div className={styles.lower}>
        <div className={styles.more}>{additionalInformation}</div>
      </div>
    </div>
  );
};

export default AckDef;
