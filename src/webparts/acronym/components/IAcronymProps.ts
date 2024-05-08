import { SPHttpClient } from "@microsoft/sp-http";

export interface IAcronymProps {
  spListLink: string;
  absoluteUrl: string;
  spHttpClient: SPHttpClient;
}
