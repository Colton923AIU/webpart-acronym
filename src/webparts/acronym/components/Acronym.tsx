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
import { getURL } from "./SPListLinkParser";

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
    url:
      getURL({
        absoluteUrl: props.absoluteUrl,
        spListLink: props.spListLink,
      }) ?? "",
    client: props.spHttpClient,
  });
  const [letterMap] = useAcronymData({
    listData: listData,
  });

  const letterHandler = (letter: string) => {
    if (selectedLetter !== letter) {
      setSelectedLetter(letter);
      setSelectedAck(null);
      setDefinition(null);
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
      return;
    } else {
      setSelectedAck(null);
      setDefinition(null);
      return;
    }
  };

  const searchHandler = ({
    column,
    item,
  }: {
    column: string;
    item: string;
  }) => {
    const scrollToButtonLetter = (sel: string) => {
      const buttonLetter = document.getElementById(sel);
      buttonLetter?.scrollIntoView({ behavior: "smooth" });
      return;
    };

    const scrollToButtonLetters = (sel: string) => {
      const buttonLetters = document.getElementById(sel);
      buttonLetters?.scrollIntoView({ behavior: "smooth" });
      return;
    };
    switch (column) {
      case "colOne": {
        letterHandler(item);
        scrollToButtonLetter(item);
        break;
      }
      case "colTwo": {
        setSelectedLetter(item.charAt(0));
        scrollToButtonLetter(item.charAt(0));
        setSelectedAck(item);
        setTimeout(() => {
          scrollToButtonLetters(item);
        }, 500);
        break;
      }
      case "colThree": {
        setSelectedLetter(null);
        setSelectedAck(null);
        setDefinition(item);
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

  // UseEffect for the Acronym's shorthand reactivity
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

  // UseEffect for the Acronym's definition reactivity
  useEffect(() => {
    if (selectedLetter !== null) {
      if (selectedAck !== null && letterMap !== null) {
        setDefinition(letterMap.get(selectedLetter)?.get(selectedAck) ?? null);
      }
    }
  }, [selectedAck]);

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
