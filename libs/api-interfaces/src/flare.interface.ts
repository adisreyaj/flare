export enum BlockType {
  text = 'TEXT',
  code = 'CODE',
  script = 'SCRIPT',
  poll = 'POLL',
  githubRepo = 'GITHUB_REPO',
  techStack = 'TECH_STACK',
  images = 'IMAGES',
}

export interface BlockData<BlockContent = unknown> {
  type: BlockType;
  content: BlockContent;
}

export type ImageBlockData = BlockData<{ file?: File; url: string }[]>;
export type CodeBlockData = BlockData<{ value: string; mode: string }>;
