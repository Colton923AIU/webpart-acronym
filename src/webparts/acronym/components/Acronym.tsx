import type { IAcronymProps } from "./IAcronymProps";
import styles from "./Acronym.module.scss";
import { useState, useEffect } from "react";
import useSharePointListData from "../../../hooks/useSharePointListData/useSharePointListData";
import useAcronymData from "../../../hooks/useAcronymData/useAcronymData";
import LetterCol from "./LetterCol";
import AcronymCol from "./AcronymCol";
import DefinitionCol from "./DefinitionCol";
// import SearchBar from "./SearchBar";
import * as React from "react";

export interface SPListItem {
  Acronym: string;
  Definition: string;
  Category: string;
  ReferenceDetails: string;
}

export type ListTypes =
  | "Title"
  | "Definition"
  | "Category"
  | "ReferenceDetails";

const Acronym: React.FC<IAcronymProps> = (props: IAcronymProps) => {
  const [selectedLetter, setSelectedLetter] = React.useState<string | null>(
    null
  );
  const [selectedAck, setSelectedAck] = useState<string | null>(null);
  const [acksList, setAcksList] = useState<string[]>([]);
  const [definition, setDefinition] = useState<string | null>(null);
  const [additionalInformation, setAdditionalInformation] = useState<
    string | null
  >(null);
  const [categories, setCategories] = useState<string[] | null>(null);
  const [listData] = useSharePointListData({
    absoluteUrl: props.absoluteUrl,
    spListLink: props.spListLink,
    client: props.spHttpClient,
  });
  const [letterMap] = useAcronymData({
    listData: listData,
  });

  const letterHandler = (letter: string) => {
    if (selectedLetter !== letter) {
      setSelectedLetter(letter);
      return;
    } else {
      setSelectedLetter(null);
      setSelectedAck(null);
      setDefinition(null);
      setAdditionalInformation(null);
      setCategories(null);
      return;
    }
  };

  const acronymHandler = (ack: string) => {
    if (!listData) return;
    if (selectedAck !== ack) {
      setSelectedAck(ack);
      setDefinition(letterMap?.get(ack.charAt(0))?.get(ack) ?? null);
      const findInfo = listData.filter((item) => {
        if (item[ack]) {
          return true;
        }
        return false;
      });
      if (!findInfo) return;
      const additionalInformation = findInfo[0].additionalInformation;
      if (additionalInformation !== null) {
        setAdditionalInformation(additionalInformation.toString());
      }
      const categories =
        typeof findInfo[0].categories === "string"
          ? [findInfo[0].categories]
          : findInfo[0].categories;
      setCategories(categories);
      return;
    } else {
      setSelectedAck(null);
      setDefinition(null);
      setAdditionalInformation(null);
      setCategories(null);
      return;
    }
  };

  // const definitionHandler = (def: string) => {
  //   if (def !== definition) {
  //     setDefinition(def);
  //   }
  //   return;
  // };

  // const searchHandler = ({
  //   column,
  //   item,
  // }: {
  //   column: string;
  //   item: string;
  // }) => {
  //   switch (column) {
  //     case "colOne": {
  //       letterHandler(item);
  //       break;
  //     }
  //     case "colTwo": {
  //       letterHandler(item.charAt(0));
  //       setTimeout(() => {
  //         acronymHandler(item);
  //       }, 500);
  //       break;
  //     }
  //     case "colThree": {
  //       definitionHandler(item);
  //       break;
  //     }
  //     default: {
  //       return;
  //     }
  //   }
  //   return;
  // };

  const getKeys = (map: Map<string, Map<string, string>>) => {
    const keys: string[] = [];
    map.forEach((val, key) => {
      keys.push(key);
    });
    return keys;
  };

  useEffect(() => {
    if (letterMap !== null && selectedLetter !== null) {
      const currAckMap = letterMap.get(selectedLetter);
      if (!currAckMap) return;
      const list: string[] = [];
      currAckMap.forEach((val, key, map) => {
        list.push(key);
      });
      list.sort((a, b) => {
        return a.localeCompare(b);
      });
      setAcksList(list);
    } else {
      setAcksList([""]);
    }
  }, [selectedLetter]);

  if (!props.spListLink || listData === null || letterMap === null) return null;
  return (
    <div className={styles.wrapper}>
      {/* <SearchBar searchHandler={searchHandler} letterMap={letterMap} /> */}
      <div
        className={`${styles.flex} ${styles.center} ${styles.acronym_web_part}`}
        id="acronym_base"
      >
        <LetterCol
          letters={getKeys(letterMap)}
          letterHandler={letterHandler}
          selectedLetter={selectedLetter}
        />
        <AcronymCol
          acronymHandler={acronymHandler}
          acronyms={acksList}
          selectedAcronym={selectedAck}
        />
        <DefinitionCol
          definition={definition}
          categories={categories}
          additionalInformation={additionalInformation}
        />
      </div>
    </div>
  );
};

export default Acronym;
