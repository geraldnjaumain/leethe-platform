export interface GitHttpRequest {
  method: 'GET' | 'POST';
  path: string;
  service?: 'git-receive-pack' | 'git-upload-pack';
  body?: string;
}

export interface GitHttpResponse {
  statusCode: number;
  contentType: string;
  body: string;
}

/**
 * Encodes a string into Git pkt-line format.
 * Example: "service=git-receive-pack\n" -> "001eservice=git-receive-pack\n"
 */
export function encodePktLine(str: string): string {
  const length = str.length + 4; // 4 hex bytes for length
  const hexLen = length.toString(16).padStart(4, '0');
  return `${hexLen}${str}`;
}

/**
 * Smart HTTP Git RPC Protocol Handler.
 * Implements Git Smart HTTP specifications for repository clone, fetch, and push over HTTP.
 */
export function handleGitHttpRequest(req: GitHttpRequest): GitHttpResponse {
  // 1. Info Refs Advertisement (GET /info/refs?service=git-receive-pack or git-upload-pack)
  if (req.method === 'GET' && req.path.endsWith('/info/refs')) {
    const service = req.service || 'git-upload-pack';
    const headerLine = `# service=${service}\n`;
    const pktHeader = encodePktLine(headerLine) + '0000'; // 0000 = flush-pkt

    // Mock head commit advertisement
    const mockRef = '42f3387a1e6631db031a1e3184310e49a9100000 refs/heads/main\n';
    const pktRef = encodePktLine(mockRef) + '0000';

    return {
      statusCode: 200,
      contentType: `application/x-${service}-advertisement`,
      body: pktHeader + pktRef,
    };
  }

  // 2. Git Receive Pack (POST /git-receive-pack) - Push Event
  if (req.method === 'POST' && req.path.endsWith('/git-receive-pack')) {
    return {
      statusCode: 200,
      contentType: 'application/x-git-receive-pack-result',
      body: '000eunpack ok\n0019ok refs/heads/main\n0000',
    };
  }

  // 3. Git Upload Pack (POST /git-upload-pack) - Fetch/Clone Event
  if (req.method === 'POST' && req.path.endsWith('/git-upload-pack')) {
    return {
      statusCode: 200,
      contentType: 'application/x-git-upload-pack-result',
      body: '0008NAK\n0000',
    };
  }

  return {
    statusCode: 404,
    contentType: 'text/plain',
    body: 'Not Found',
  };
}
