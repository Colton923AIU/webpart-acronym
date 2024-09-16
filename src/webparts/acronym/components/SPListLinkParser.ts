const SPListLinkParser = (link: string) => {
  const parsed = link;
  const parts = parsed.split("/")[parsed.split("/").indexOf("Lists") + 1];
  if (!parts) return null;
  return parts.replace(/%20/g, " ").split("?")[0];
};

const getURL = ({
  absoluteUrl,
  spListLink,
}: {
  absoluteUrl: string;
  spListLink: string;
}) => {
  if (!absoluteUrl || !spListLink) return null;

  if (absoluteUrl.length < 3) {
    return null;
  }

  if (spListLink.length < 3) {
    return null;
  }

  const spLink = spListLink;
  const parsedLink = SPListLinkParser(spLink);

  if (!parsedLink) {
    return null;
  }

  const basePath = new URL(spListLink).origin;
  const subsites = spListLink.split("Lists")[0].split("com")[1];
  const url =
    basePath + subsites + `_api/web/lists/GetByTitle('${parsedLink}')/items`;

  return url;
};

export { SPListLinkParser, getURL };
