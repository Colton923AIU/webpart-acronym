declare interface IAcronymWebPartStrings {
  PropertyPaneDescription: string;
  PropertyPaneSPListLink: string;
  BasicGroupName: string;
  DescriptionFieldLabel: string;
  SPListLinkLabel: string;
  AppLocalEnvironmentSharePoint: string;
  AppLocalEnvironmentTeams: string;
  AppLocalEnvironmentOffice: string;
  AppLocalEnvironmentOutlook: string;
  AppSharePointEnvironment: string;
  AppTeamsTabEnvironment: string;
  AppOfficeEnvironment: string;
  AppOutlookEnvironment: string;
  UnknownEnvironment: string;
}

declare module 'AcronymWebPartStrings' {
  const strings: IAcronymWebPartStrings;
  export = strings;
}
