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
  U extends Record<string, any> | undefined = undefined,
> {
  content: U extends Record<string, any>
    ? U
    : T extends "code"
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
    : Record<string, never>;
  id: string;
  isHidden: boolean;
  type: T;
}
