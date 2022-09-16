export type KirbyBlockType =
  | "code"
  | "gallery"
  | "heading"
  | "image"
  | "line"
  | "list"
  | "markdown"
  | "quote"
  | "table"
  | "text"
  | "video";

export interface KirbyBlock<
  T extends string = KirbyBlockType,
  U = Record<string, any>
> {
  content: T extends "code"
    ? { code: string; language: string }
    : T extends "gallery"
    ? { images: string[] }
    : T extends "heading"
    ? { level: string; text: string }
    : T extends "image"
    ? {
        location: string;
        image: string[];
        src: string;
        alt: string;
        caption: string;
        link: string;
        ratio: string;
        crop: boolean;
      }
    : T extends "line"
    ? Record<string, never>
    : T extends "list"
    ? { text: string }
    : T extends "markdown"
    ? { text: string }
    : T extends "quote"
    ? { text: string; citation: string }
    : T extends "text"
    ? { text: string }
    : T extends "video"
    ? { url: string; caption: string }
    : U;
  id: string;
  isHidden: boolean;
  type: T;
}
