import * as React from "react";

export type TAcronymData = Map<string, Map<string, string>>;
export interface IAcronymData {
  listData: Record<string, string>[] | null;
}

/*
    Purpose: Convert SP List Data to data useable by the Acronym Web Part.
    Returns access to Data Object Map<string, Map<string, string>>
*/

const useAcronymData: ({ listData }: IAcronymData) => [TAcronymData | null] = ({
  listData,
}: IAcronymData) => {
  const [letterMap, setLetterMap] = React.useState<Map<
    string,
    Map<string, string>
  > | null>(null);

  const initializeLetterMap = (listData: Record<string, string>[]) => {
    const uLetters = listData
      .map((listItem) => {
        return Object.keys(listItem)[0].charAt(0);
      })
      .reduce((uniqueLetters: string[], letter: string) => {
        if (uniqueLetters.indexOf(letter) === -1) {
          uniqueLetters.push(letter);
        }
        return uniqueLetters;
      }, [])
      .sort((a, b) => {
        return a.localeCompare(b);
      });

    const tempLetterMap = new Map();
    uLetters.forEach((val) => {
      const tempMap = new Map<string, string>();

      listData.filter((item) => {
        if (Object.keys(item)[0].charAt(0) === val) {
          tempMap.set(Object.keys(item)[0], item[Object.keys(item)[0]]);
        }
      });
      tempLetterMap.set(val, tempMap);
    });
    if (tempLetterMap.size > 0) setLetterMap(tempLetterMap);
  };

  React.useEffect(() => {
    if (!listData) return;
    initializeLetterMap(listData);
  }, [listData]);

  return [letterMap];
};

export default useAcronymData;
