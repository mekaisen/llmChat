import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { v4 as uuidv4 } from 'uuid';

import type { IMessages, NonChatChoice, NonStreamingChoice, StreamingChoice, TContent } from '../../utils/fetchAi';

import { ResponseType, usePostAi } from '../../utils/fetchAi';
import Input from '../Input/Input';
import View from '../View/View';

export interface IMessage {
  content: string | TContent[],
  id: string
  role: 'assistant' | 'user',
  type?: string
}

const isNonChatChoice = (choice: any): choice is NonChatChoice => {
  return 'text' in choice && typeof choice.text === 'string';
};

const isNonStreamingChoice = (choice: any): choice is NonStreamingChoice => {
  return 'message' in choice &&
    choice.message &&
    'content' in choice.message &&
    typeof choice.message.content === 'string';
};

const isStreamingChoice = (choice: any): choice is StreamingChoice => {
  return 'delta' in choice &&
    choice.delta &&
    'content' in choice.delta &&
    typeof choice.delta.content === 'string';
};

const Chat = () => {
  const [messages, setMessages] = useState<IMessage[]>([]);
  const [isWaitingFetching, setIsWaitingFetching] = useState(false);

  const context = useMemo(() => {
    return messages.map(({ role, content }) => ({
      role,
      content
    }));
  }, [messages]);

  const { result, error: _error } = usePostAi('microsoft/mai-ds-r1:free', isWaitingFetching ? context : []);

  useEffect(() => {
    if (!result?.choices?.length || !isWaitingFetching) return;

    const choice = result.choices[0];
    let botMessage: IMessage;

    // Обрабатываем выбор в соответствии с типом
    if (isNonChatChoice(choice)) {
      botMessage = {
        id: uuidv4(),
        role: 'assistant',
        content: choice.text || 'Нет ответа',
        type: ResponseType.NON_CHAT
      };
    } else if (isNonStreamingChoice(choice)) {
      botMessage = {
        id: uuidv4(),
        role: 'assistant',
        content: choice.message.content || 'Нет ответа',
        type: ResponseType.NON_STREAMING
      };
    } else if (isStreamingChoice(choice)) {
      botMessage = {
        id: uuidv4(),
        role: 'assistant',
        content: choice.delta.content || 'Нет ответа',
        type: ResponseType.STREAMING
      };
    } else {
      botMessage = {
        id: uuidv4(),
        role: 'assistant',
        content: 'Получен неизвестный формат ответа',
        type: ResponseType.UNKNOWN
      };
    }

    setIsWaitingFetching(false);
    setMessages((prev) => [...prev, botMessage]);
  }, [result, isWaitingFetching]);

  const handleSendMassage = useCallback(async (text: string): Promise<void> => {
    if (!text.trim()) return;

    const userMessage: IMessage = {
      id: uuidv4(),
      role: 'user',
      content: text
    };

    setMessages((prev) => [...prev, userMessage]);
    setIsWaitingFetching(true);
  }, []);

  return (
    <div className='grow relative'>
      <div className='px-4 min-h-full absolute top-0 bottom-0 left-0 right-0 overflow-auto'>
        <div className='flex flex-col h-full'>
          <header className='py-3 text-center border-b border-[rgb(var(--color-border))]'>
            <h1 className='text-lg font-medium'>Чат с ботом</h1>
          </header>
          <View answer={messages} />
          <Input setMessage={handleSendMassage} />
        </div>
      </div>
    </div>
  );
};

export default Chat;
