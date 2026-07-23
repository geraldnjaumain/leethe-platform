import { DiffFile, DiffHunk, DiffLine } from '../../../packages/types/vcs';

/**
 * Fast O(N) Unified Git Patch Parser.
 * Converts raw git patch strings into structured DiffFile metadata.
 */
export function parseGitDiff(rawPatch: string): DiffFile[] {
  const files: DiffFile[] = [];
  const lines = rawPatch.split(/\r?\n/);
  
  let currentFile: DiffFile | null = null;
  let currentHunk: DiffHunk | null = null;
  
  let oldLineCounter = 0;
  let newLineCounter = 0;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    // File header: diff --git a/file b/file
    if (line.startsWith('diff --git')) {
      if (currentFile) {
        if (currentHunk) currentFile.hunks.push(currentHunk);
        files.push(currentFile);
      }

      const match = line.match(/diff --git a\/(.+) b\/(.+)/);
      const oldPath = match ? match[1] : '';
      const newPath = match ? match[2] : '';

      currentFile = {
        oldPath,
        newPath,
        additions: 0,
        deletions: 0,
        hunks: [],
      };
      currentHunk = null;
      continue;
    }

    if (!currentFile) continue;

    // New file mode
    if (line.startsWith('new file mode')) {
      currentFile.isNew = true;
    } else if (line.startsWith('deleted file mode')) {
      currentFile.isDeleted = true;
    }

    // Hunk header: @@ -1,5 +1,6 @@ Header description
    if (line.startsWith('@@')) {
      if (currentHunk) {
        currentFile.hunks.push(currentHunk);
      }

      const hunkMatch = line.match(/^@@ -(\d+)(?:,(\d+))? \+(\d+)(?:,(\d+))? @@(.*)/);
      if (hunkMatch) {
        oldLineCounter = parseInt(hunkMatch[1], 10);
        const oldLines = hunkMatch[2] !== undefined ? parseInt(hunkMatch[2], 10) : 1;
        newLineCounter = parseInt(hunkMatch[3], 10);
        const newLines = hunkMatch[4] !== undefined ? parseInt(hunkMatch[4], 10) : 1;

        currentHunk = {
          oldStart: oldLineCounter,
          oldLines,
          newStart: newLineCounter,
          newLines,
          header: line,
          lines: [],
        };
      }
      continue;
    }

    if (!currentHunk) continue;

    // Parse diff content lines
    if (line.startsWith('+') && !line.startsWith('+++')) {
      currentFile.additions++;
      currentHunk.lines.push({
        type: 'add',
        newLineNumber: newLineCounter++,
        content: line.slice(1),
      });
    } else if (line.startsWith('-') && !line.startsWith('---')) {
      currentFile.deletions++;
      currentHunk.lines.push({
        type: 'delete',
        oldLineNumber: oldLineCounter++,
        content: line.slice(1),
      });
    } else if (line.startsWith(' ') || line === '') {
      currentHunk.lines.push({
        type: 'normal',
        oldLineNumber: oldLineCounter++,
        newLineNumber: newLineCounter++,
        content: line.startsWith(' ') ? line.slice(1) : line,
      });
    }
  }

  if (currentFile) {
    if (currentHunk) currentFile.hunks.push(currentHunk);
    files.push(currentFile);
  }

  return files;
}
