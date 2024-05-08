import * as React from "react";
import type { IAcronymProps } from "./IAcronymProps";
import styles from "./Acronym.module.scss";
import { useState, useEffect } from "react";
import useSharePointListData from "../../../hooks/useSharePointListData/useSharePointListData";
import useAcronymData from "../../../hooks/useAcronymData/useAcronymData";
import LetterCol from "./LetterCol";
import AcronymCol from "./AcronymCol";
import DefinitionCol from "./DefinitionCol";
import SearchBar from "./SearchBar";

export interface SPListItem {
  Acronym: string;
  Definition: string;
}

export type ListTypes = "Title" | "Definition";

/*
[State]

 *** Selected Letter ***
     user selected letter from ULetters(listData)

 *** Selected Ack ***
     user selected acronym

 *** Acks List (acronyms list) ***
     list of available acronyms based on selected letter

 *** Definition ***
     result of user selections

 *** List Data ***
     useEffect->setState pattern for setting the sharepoint list data

 *** Letter Map ***
     the main data structure for this component

 */

const Acronym: React.FC<IAcronymProps> = (props: IAcronymProps) => {
  const [selectedLetter, setSelectedLetter] = React.useState<string | null>(
    null
  );
  const [selectedAck, setSelectedAck] = useState<string | null>(null);
  const [acksList, setAcksList] = useState<string[]>([]);
  const [definition, setDefinition] = useState<string | null>(null);
  const [listData] = useSharePointListData({
    absoluteUrl: props.absoluteUrl,
    spListLink: props.spListLink,
    client: props.spHttpClient,
  });
  const [letterMap] = useAcronymData({
    listData: listData,
  });

  // const scrollToButtonLetter = (sel: string) => {
  //   const buttonLetter = document.getElementById(sel.toUpperCase());
  //   const letScroller = document.getElementById("let-scroller");

  //   if (!buttonLetter || !letScroller) return;

  //   setTimeout(() => {
  //     buttonLetter.scrollIntoView({
  //       behavior: "smooth",
  //       block: "center",
  //       inline: "nearest",
  //     });
  //   }, 500);
  //   return;
  // };

  // const scrollToButtonLetters = (sel: string) => {
  //   const buttonLetters = document.getElementById(sel);
  //   const ackScroller = document.getElementById("ack-scroller");

  //   if (!buttonLetters || !ackScroller) return;

  //   setTimeout(() => {
  //     buttonLetters.scrollIntoView({
  //       behavior: "smooth",
  //       block: "center",
  //       inline: "nearest",
  //     });
  //   }, 500);
  //   return;
  // };

  const letterHandler = (letter: string) => {
    if (selectedLetter !== letter) {
      setSelectedLetter(letter);
      // scrollToButtonLetter(letter);
      return;
    } else {
      setSelectedLetter(null);
      setSelectedAck(null);
      setDefinition(null);
      return;
    }
  };

  const acronymHandler = (ack: string) => {
    if (selectedAck !== ack) {
      setSelectedAck(ack);
      setDefinition(letterMap?.get(ack.charAt(0))?.get(ack) ?? null);
      // scrollToButtonLetters(ack);
      return;
    } else {
      setSelectedAck(null);
      setDefinition(null);
      return;
    }
  };

  const definitionHandler = (def: string) => {
    if (def !== definition) {
      setDefinition(def);
    }
    return;
  };

  const searchHandler = ({
    column,
    item,
  }: {
    column: string;
    item: string;
  }) => {
    switch (column) {
      case "colOne": {
        letterHandler(item);
        break;
      }
      case "colTwo": {
        letterHandler(item.charAt(0));
        setTimeout(() => {
          acronymHandler(item);
        }, 500);
        break;
      }
      case "colThree": {
        definitionHandler(item);
        break;
      }
      default: {
        return;
      }
    }
    return;
  };

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
      <SearchBar searchHandler={searchHandler} letterMap={letterMap} />
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
        <DefinitionCol definition={definition} />
      </div>
    </div>
  );
};

export default Acronym;
