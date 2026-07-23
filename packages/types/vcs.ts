/**
 * Leethe Native VCS Engine Types
 */

export type DiffLineType = 'add' | 'delete' | 'normal' | 'hunk';

export interface DiffLine {
  type: DiffLineType;
  oldLineNumber?: number;
  newLineNumber?: number;
  content: string;
}

export interface DiffHunk {
  oldStart: number;
  oldLines: number;
  newStart: number;
  newLines: number;
  header: string;
  lines: DiffLine[];
}

export interface DiffFile {
  oldPath: string;
  newPath: string;
  additions: number;
  deletions: number;
  hunks: DiffHunk[];
  isNew?: boolean;
  isDeleted?: boolean;
}

export interface Repository {
  id: string;
  orgId: string;
  name: string;
  slug: string;
  description?: string;
  defaultBranch: string;
  isPrivate: boolean;
  createdAt: string;
}

export interface Commit {
  sha: string;
  repoId: string;
  authorName: string;
  authorEmail: string;
  message: string;
  createdAt: string;
}

export interface Branch {
  name: string;
  commitSha: string;
  isDefault: boolean;
}

export interface PullRequest {
  id: string;
  repoId: string;
  number: number;
  title: string;
  description: string;
  sourceBranch: string;
  targetBranch: string;
  authorId: string;
  status: 'open' | 'merged' | 'closed';
  createdAt: string;
}
