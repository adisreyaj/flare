export const extractHashTags = (text: string): ExtractHashTagsResult => {
  const regex = new RegExp(/(#+[a-zA-Z0-9_]+)/gi);
  const matches = text.match(regex);
  const matchesFormatted = matches ? matches.map((match) => match.trim()) : [];
  return {
    matches: matchesFormatted,
    content: text.replace(regex, ` <span class="hashtag">$1</span> `),
  };
};

export interface ExtractHashTagsResult {
  matches: string[];
  content: string;
}
