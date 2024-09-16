import { SPHttpClient } from "@microsoft/sp-http";

export interface IAcronymProps {
  spListLink: string;
  theme: string;
  absoluteUrl: string;
  spHttpClient: SPHttpClient;
}
