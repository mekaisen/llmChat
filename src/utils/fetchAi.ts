import { useEffect, useState } from 'react';

export interface IContent {
  text: string
  type: 'image_url' | 'text',
}
// Типы ответов API
export enum ResponseType {
  NON_CHAT = 'NonChatChoice',
  NON_STREAMING = 'NonStreamingChoice',
  STREAMING = 'StreamingChoice',
  UNKNOWN = 'Unknown'
}

export type TContent = string | IContent;

export interface IMessages {
  content: string | TContent[]
  role: 'assistant' | 'user',
}

// Definitions of subtypes are below
export interface Response {
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
export interface ResponseUsage {
  /** The tokens generated */
  completion_tokens: number;
  /** Including images and tools if any */
  prompt_tokens: number;
  /** Sum of the above two fields */
  total_tokens: number;
}
// Subtypes:
export interface NonChatChoice {
  error?: ErrorResponse;
  finish_reason: string | null;
  text: string;
}

export interface NonStreamingChoice {
  error?: ErrorResponse;
  finish_reason: string | null;
  native_finish_reason: string | null;
  message: {
    content: string | null;
    role: string;
    tool_calls?: ToolCall[];
  };
}

export interface StreamingChoice {
  error?: ErrorResponse;
  finish_reason: string | null;
  native_finish_reason: string | null;
  delta: {
    content: string | null;
    role?: string;
    tool_calls?: ToolCall[];
  };
}

export interface ErrorResponse {
  code: number; // See "Error Handling" section
  message: string;
  metadata?: Record<string, unknown>; // Contains additional error information such as provider details, the raw error message, etc.
}

export interface ToolCall {
  id: string;
  type: 'function';
}

const OPENROUTER_API_KEY = import.meta.env.VITE_OPENROUTER_API_KEY || '';

export const PostAi = async (model: string, messages: IMessages[]): Promise<Response> => {
  if (!OPENROUTER_API_KEY) {
    throw new Error('API ключ не найден. Проверьте наличие VITE_OPENROUTER_API_KEY в .env файле');
  }
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
  const answer = await result.json();
  return (answer);
};

export interface IResponsePost {
  error: Error | null
  loading: boolean,
  result: Response | null,
}

export const usePostAi = (model: string, messages: IMessages[]): IResponsePost => {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<Error | null>(null);
  const [result, setResult] = useState<Response | null>(null);

  useEffect(() => {
    (async () => {
      setLoading(true);
      setError(null);

      try {
        const answer = await PostAi(model, messages);
        setResult(answer);
      } catch (err) {
        if (err instanceof Error) {
          setError(err);
        } else {
          setError(new Error('Неизвестная ошибка'));
        }
        setResult(null);
      } finally {
        setLoading(false);
      }
    })();
  }, [model, JSON.stringify(messages)]);

  return { loading, error, result };
};

// export const getFakeAiResponse = (userMessage: string = 'hel'): Promise<IMessage> => {
//   return new Promise((resolve) => {
//     setTimeout(() => {
//       const responses = [
//         'Привет! Я - чат-бот, созданный для демонстрации. Я могу поддерживать простой диалог и отвечать на базовые вопросы. К сожалению, я не обладаю реальным искусственным интеллектом и работаю на заранее заданных ответах. Тем не менее, я постараюсь быть полезным! Вы можете задать мне вопрос или просто поговорить на общие темы.',
//         'Спасибо за ваше сообщение! Как демонстрационный чат-бот, я могу поддерживать базовую беседу. Хотя мои возможности ограничены заранее запрограммированными ответами, я постараюсь быть полезным собеседником. Не стесняйтесь задавать вопросы или делиться мыслями!',
//         'Добрый день! Я - простой демонстрационный бот. Моя задача - показать, как может выглядеть диалог с ИИ. Я работаю на основе предустановленных ответов, поэтому не могу вести сложные дискуссии. Но я с удовольствием пообщаюсь с вами на базовом уровне!',
//         'Здравствуйте! Рад нашему общению. Как тестовый чат-бот, я демонстрирую базовые возможности диалоговых систем. Хотя мои ответы ограничены, я постараюсь сделать наше общение приятным и информативным. О чем бы вы хотели поговорить?',
//         'Приветствую! Я - демонстрационный чат-бот, созданный для иллюстрации работы диалоговых интерфейсов. Мои ответы предопределены, но я постараюсь быть полезным собеседником. Давайте пообщаемся!'
//       ];

//       const randomResponse = responses[Math.floor(Math.random() * responses.length)];

//       const botMessage: IMessage = {
//         id: uuidv4(),
//         sender: 'bot',
//         text: randomResponse
//       };

//       resolve(botMessage);
//     }, 1000);
//   });
// };
