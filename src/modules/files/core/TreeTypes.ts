export type TreeNode = {
  name: string;
  absPath: string;
  isDir: boolean;
  children?: TreeNode[];
};
