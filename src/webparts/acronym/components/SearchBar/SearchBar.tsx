import * as React from "react";
import styles from "../Acronym.module.scss";

export interface ISearchBarProps {
  searchHandler: ({ column, item }: { column: string; item: string }) => void;
  letterMap: Map<string, Map<string, string>>;
}

const SearchBar = ({ searchHandler, letterMap }: ISearchBarProps) => {
  const [searchInput, setSearchInput] = React.useState<string>("");
  const [searchResults, setSearchResults] = React.useState<{
    colOne: string[];
    colTwo: string[];
    colThree: string[];
  }>();
  const [searching, setSearching] = React.useState<boolean>(false);

  const defaultSearchObject = (
    localLetterMap: Map<string, Map<string, string>>
  ) => {
    const letterKeys = () => {
      const keys: string[] = [];
      localLetterMap.forEach((val, key) => {
        keys.push(key);
      });
      return keys;
    };
    const ackKeys = () => {
      const keys: string[] = [];
      letterKeys().map((val: string) => {
        const map = localLetterMap.get(val);
        map?.forEach((val, key) => {
          keys.push(key);
        });
      });

      return keys;
    };
    const defs = () => {
      const defs: string[] = [];
      letterKeys().map((val: string) => {
        const map = localLetterMap.get(val);
        map?.forEach((val, key) => {
          if (key !== "additionalInformation" && key !== "categories") {
            defs.push(val);
          }
        });
      });

      return defs;
    };

    const srchObj = {
      colOne: letterKeys(),
      colTwo: ackKeys(),
      colThree: defs(),
    };
    return srchObj;
  };

  const ResetSearchResults = (str?: string) => {
    const searchCol1 = (str: string) => {
      return defaultSearchObject(letterMap).colOne.filter((val) => {
        if (val.toLowerCase().indexOf(str) !== -1) {
          return true;
        }
        return false;
      });
    };
    const searchCol2 = (str: string) => {
      return defaultSearchObject(letterMap).colTwo.filter((val) => {
        if (val.toLowerCase().indexOf(str) !== -1) {
          return true;
        }
        return false;
      });
    };
    const searchCol3 = (str: string) => {
      return defaultSearchObject(letterMap).colThree.filter((val) => {
        if (val === null) {
          return false;
        }
        if (val.toLowerCase().indexOf(str) !== -1) {
          return true;
        }
        return false;
      });
    };

    if (str !== undefined) {
      setSearchResults({
        colOne: searchCol1(str.toLowerCase()),
        colTwo: searchCol2(str.toLowerCase()),
        colThree: searchCol3(str.toLowerCase()),
      });
    } else {
      setSearchResults(defaultSearchObject(letterMap));
    }
  };

  const handleSearchInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    let timer;
    clearTimeout(timer);
    const input = e.target.value;
    if (input !== searchInput && input !== "") {
      timer = setTimeout(() => {
        setSearchInput(input);
      }, 500);
    } else if (input.length < searchInput.length) {
      const result = searchInput.slice(0, searchInput.length - 1);
      setSearchInput(result);
    }
  };

  const handleSearchBarFocus = () => {
    setSearching(true);
    const searchOverlay = document.getElementById("searchOverlay");
    if (!searchOverlay) return;
    searchOverlay.classList.add(styles.show);
    searchOverlay.classList.remove(styles.hide);
  };

  const handleSearchBarBlur = () => {
    setTimeout(() => {
      setSearching(false);
      const searchOverlay = document.getElementById("searchOverlay");
      if (!searchOverlay) return;
      searchOverlay.classList.add(styles.hide);
      searchOverlay.classList.remove(styles.show);
    }, 200);
  };

  React.useEffect(() => {
    ResetSearchResults(searchInput.toLowerCase());
  }, [searchInput]);

  return (
    <>
      <div className={styles.search_bar}>
        <input
          id={"search_bar"}
          className={styles.search_input}
          type={"text"}
          onChange={handleSearchInput}
          placeholder="Search..."
          onFocus={() => handleSearchBarFocus()}
          onBlur={() => handleSearchBarBlur()}
        />
      </div>
      {searchResults ? (
        <div
          id="searchOverlay"
          className={`${styles.hide} ${styles.searchOverlay}`}
        >
          {searching && searchInput !== ""
            ? Object.keys(searchResults).map((val, idx) => {
                if (!val) return null;
                return (
                  <div key={`searchBar_${idx}`}>
                    {searchResults[val as keyof typeof searchResults].map(
                      (item, j) => {
                        return (
                          <div
                            key={`innerSearch_${j}_${idx}`}
                            className={styles.item}
                            onClick={() => {
                              searchHandler({ column: val, item: item });
                            }}
                          >
                            {item}
                          </div>
                        );
                      }
                    )}
                  </div>
                );
              })
            : null}
        </div>
      ) : null}
    </>
  );
};

export default SearchBar;
