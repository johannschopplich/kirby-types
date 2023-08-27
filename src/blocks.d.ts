export type KirbyDefaultBlocks = {
  code: { code: string; language: string };
  gallery: { images: string[] };
  heading: { level: string; text: string };
  image: {
    location: string;
    image: string[];
    src: string;
    alt: string;
    caption: string;
    link: string;
    ratio: string;
    crop: boolean;
  };
  list: { text: string };
  markdown: { text: string };
  quote: { text: string; citation: string };
  text: { text: string };
  video: { url: string; caption: string };
};

export type KirbyDefaultBlockType = keyof KirbyDefaultBlocks;

export interface KirbyBlock<
  T extends string = keyof KirbyDefaultBlocks,
  U extends Record<string, unknown> | undefined = undefined,
> {
  content: U extends Record<string, unknown>
    ? U
    : T extends keyof KirbyDefaultBlocks
    ? KirbyDefaultBlocks[T]
    : Record<string, never>;
  id: string;
  isHidden: boolean;
  type: T;
}
