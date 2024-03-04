import { SPHttpClient, type SPHttpClientResponse } from "@microsoft/sp-http";
import * as React from "react";
import type { ListTypes } from "../../webparts/acronym/components/Acronym";

export type TSPListData = Record<string, string>[];
export interface ISPListData {
  url: string; // URL to the users' SP List
  client: SPHttpClient; // SP Client for making fetch reqs
}

/*
    Purpose: When a user copy and paste's their SP List,
    this hook will return access to the data via setState.
*/

const useSharePointListData: ({
  url,
  client,
}: ISPListData) => [TSPListData | null] = ({ url, client }: ISPListData) => {
  const [listData, setListData] = React.useState<TSPListData | null>(null);

  const getSPListData = async (url: string) => {
    if (!url) return;
    if (url.length < 3) return;
    try {
      const data = await client
        .get(url, SPHttpClient.configurations.v1)
        .then((response: SPHttpClientResponse) => {
          return response.json();
        });
      if (data) {
        const cleanData = data.value.map(
          (item: Record<ListTypes, string | number | null | boolean>) => {
            return {
              [item.Title as string]: item.Definition,
            };
          }
        );
        setListData(cleanData);
        return;
      }
    } catch {
      console.log("Response from SP List Getter Failed");
      return;
    }
  };

  React.useEffect(() => {
    getSPListData(url);
  }, [url]);

  return [listData];
};

export default useSharePointListData;
