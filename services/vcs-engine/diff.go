package main

import (
	"strings"
)

type DiffLineType string

const (
	LineAdd    DiffLineType = "add"
	LineDelete DiffLineType = "delete"
	LineNormal DiffLineType = "normal"
)

type DiffLine struct {
	Type          DiffLineType `json:"type"`
	OldLineNumber int          `json:"oldLineNumber,omitempty"`
	NewLineNumber int          `json:"newLineNumber,omitempty"`
	Content       string       `json:"content"`
}

type DiffHunk struct {
	Header   string     `json:"header"`
	OldStart int        `json:"oldStart"`
	NewStart int        `json:"newStart"`
	Lines    []DiffLine `json:"lines"`
}

type DiffFile struct {
	OldPath   string     `json:"oldPath"`
	NewPath   string     `json:"newPath"`
	Additions int        `json:"additions"`
	Deletions int        `json:"deletions"`
	Hunks     []DiffHunk `json:"hunks"`
}

// ParseGitDiff parses a raw unified git diff patch in Go with O(N) efficiency.
func ParseGitDiff(patch string) []DiffFile {
	var files []DiffFile
	lines := strings.Split(patch, "\n")

	var currentFile *DiffFile
	var currentHunk *DiffHunk

	oldCounter := 0
	newCounter := 0

	for _, line := range lines {
		if strings.HasPrefix(line, "diff --git") {
			if currentFile != nil {
				if currentHunk != nil {
					currentFile.Hunks = append(currentFile.Hunks, *currentHunk)
				}
				files = append(files, *currentFile)
			}
			currentFile = &DiffFile{
				Hunks: []DiffHunk{},
			}
			currentHunk = nil
			continue
		}

		if currentFile == nil {
			continue
		}

		if strings.HasPrefix(line, "--- a/") {
			currentFile.OldPath = strings.TrimPrefix(line, "--- a/")
			continue
		}
		if strings.HasPrefix(line, "+++ b/") {
			currentFile.NewPath = strings.TrimPrefix(line, "+++ b/")
			continue
		}

		if strings.HasPrefix(line, "@@") {
			if currentHunk != nil {
				currentFile.Hunks = append(currentFile.Hunks, *currentHunk)
			}
			currentHunk = &DiffHunk{
				Header: line,
				Lines:  []DiffLine{},
			}
			oldCounter = 1
			newCounter = 1
			continue
		}

		if currentHunk == nil {
			continue
		}

		if strings.HasPrefix(line, "+") {
			currentFile.Additions++
			currentHunk.Lines = append(currentHunk.Lines, DiffLine{
				Type:          LineAdd,
				NewLineNumber: newCounter,
				Content:       strings.TrimPrefix(line, "+"),
			})
			newCounter++
		} else if strings.HasPrefix(line, "-") {
			currentFile.Deletions++
			currentHunk.Lines = append(currentHunk.Lines, DiffLine{
				Type:          LineDelete,
				OldLineNumber: oldCounter,
				Content:       strings.TrimPrefix(line, "-"),
			})
			oldCounter++
		} else {
			currentHunk.Lines = append(currentHunk.Lines, DiffLine{
				Type:          LineNormal,
				OldLineNumber: oldCounter,
				NewLineNumber: newCounter,
				Content:       strings.TrimPrefix(line, " "),
			})
			oldCounter++
			newCounter++
		}
	}

	if currentFile != nil {
		if currentHunk != nil {
			currentFile.Hunks = append(currentFile.Hunks, *currentHunk)
		}
		files = append(files, *currentFile)
	}

	return files
}
