import * as React from "react";
import * as ReactDom from "react-dom";
import {
  type IPropertyPaneConfiguration,
  PropertyPaneTextField,
} from "@microsoft/sp-property-pane";
import { BaseClientSideWebPart } from "@microsoft/sp-webpart-base";

import * as strings from "AcronymWebPartStrings";
import Acronym from "./components/Acronym";
import { IAcronymProps } from "./components/IAcronymProps";

export interface IAcronymWebPartProps {
  description: string;
  spListLink: string;
  absoluteUrl: string;
}

export default class AcronymWebPart extends BaseClientSideWebPart<IAcronymWebPartProps> {
  public render(): void {
    const element: React.ReactElement<IAcronymProps> = React.createElement(
      Acronym,
      {
        spListLink: this.properties.spListLink,
        absoluteUrl: this.context.pageContext.web.absoluteUrl,
        spHttpClient: this.context.spHttpClient,
      }
    );

    ReactDom.render(element, this.domElement);
  }

  protected onDispose(): void {
    ReactDom.unmountComponentAtNode(this.domElement);
  }

  protected getPropertyPaneConfiguration(): IPropertyPaneConfiguration {
    return {
      pages: [
        {
          groups: [
            {
              groupFields: [
                PropertyPaneTextField("spListLink", {
                  label: strings.SPListLinkLabel,
                }),
              ],
            },
          ],
        },
      ],
    };
  }
}
