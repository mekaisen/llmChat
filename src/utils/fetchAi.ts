interface IContent {
  text: string
  type: string,
}

type TContent = string | IContent;

interface IMessages {
  content: TContent | TContent[]
  role: string,
}

// Definitions of subtypes are below
interface Response {
  // Depending on whether you set "stream" to "true" and
  // whether you passed in "messages" or a "prompt", you
  // will get a different output shape
  choices: (NonChatChoice | NonStreamingChoice | StreamingChoice)[];
  created: number; // Unix timestamp
  id: string;
  model: string;
  object: 'chat.completion.chunk' | 'chat.completion';

  system_fingerprint?: string; // Only present if the provider supports it

  // Usage data is always returned for non-streaming.
  // When streaming, you will get one usage object at
  // the end accompanied by an empty choices array.
  usage?: ResponseUsage;
}
interface ResponseUsage {
  /** The tokens generated */
  completion_tokens: number;
  /** Including images and tools if any */
  prompt_tokens: number;
  /** Sum of the above two fields */
  total_tokens: number;
}
// Subtypes:
interface NonChatChoice {
  error?: ErrorResponse;
  finish_reason: string | null;
  text: string;
}

interface NonStreamingChoice {
  error?: ErrorResponse;
  finish_reason: string | null;
  native_finish_reason: string | null;
  message: {
    content: string | null;
    role: string;
    tool_calls?: ToolCall[];
  };
}

interface StreamingChoice {
  error?: ErrorResponse;
  finish_reason: string | null;
  native_finish_reason: string | null;
  delta: {
    content: string | null;
    role?: string;
    tool_calls?: ToolCall[];
  };
}

interface ErrorResponse {
  code: number; // See "Error Handling" section
  message: string;
  metadata?: Record<string, unknown>; // Contains additional error information such as provider details, the raw error message, etc.
}

interface ToolCall {

  id: string;
  type: 'function';
}

const OPENROUTER_API_KEY = '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';

export const postToAi = (messages: TContent | TContent[]): IMessages[] => {
  return [{
    role: 'user',
    content: messages
  }];
};

const fetchAi = async (model: string, messages: IMessages[]): Promise<Response> => {
  const result = await fetch('https://openrouter.ai/api/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${OPENROUTER_API_KEY}`,
      'HTTP-Referer': 'YOUR_SITE_URL', // Optional. Site URL for rankings on openrouter.ai.
      'X-Title': 'YOUR_SITE_NAME', // Optional. Site title for rankings on openrouter.ai.
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      model,
      messages
    })
  });
  if (!result.ok) {
    const error = await result.json();
    if (error instanceof Error) {
      throw new TypeError(error.message || `Ошибка API: ${result.status}`);
    }
  }
  return (await result.json());
};
export { fetchAi };
