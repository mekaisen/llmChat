import { useEffect, useState } from 'react';
import { v4 as uuidv4 } from 'uuid';

import type { IMessages, NonChatChoice, NonStreamingChoice, StreamingChoice, TContent } from '../../utils/fetchAi';

import { ResponseType, usePostAi } from '../../utils/fetchAi';
import Input from '../Input/Input';
import View from '../View/View';

export interface IMessage {
  content: string | TContent[],
  id: string
  role: 'assistant' | 'user',
  type?: string // Добавляем тип сообщения
}
// Функция для проверки типа NonChatChoice (имеет свойство text)
const isNonChatChoice = (choice: any): choice is NonChatChoice => {
  return 'text' in choice && typeof choice.text === 'string';
};

// Функция для проверки типа NonStreamingChoice (имеет свойство message с content)
const isNonStreamingChoice = (choice: any): choice is NonStreamingChoice => {
  return 'message' in choice &&
    choice.message &&
    'content' in choice.message &&
    typeof choice.message.content === 'string';
};

// Функция для проверки типа StreamingChoice (имеет свойство delta с content)
const isStreamingChoice = (choice: any): choice is StreamingChoice => {
  return 'delta' in choice &&
    choice.delta &&
    'content' in choice.delta &&
    typeof choice.delta.content === 'string';
};

// export const postToAi = (messages: TContent | TContent[]): IMessages[] => {
//   return [{
//     role: 'user',
//     content: messages
//   }];
// };

const Chat = () => {
  // const [inputMessage, setInputMessage] = useState('');
  const [messages, setMessages] = useState<IMessage[]>([]);
  const [contextArray, setContextArray] = useState<IMessages[]>([]);

  const { loading: _loading, result, error: _error } = usePostAi('thudm/glm-z1-32b:free', contextArray);

  console.log(messages);
  console.log('@result', result);
  useEffect(() => {
    if (result?.choices && result.choices.length > 0) {
      const choice = result.choices[0];

      console.log('Тип ответа:', choice);

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
        console.error('Неизвестный тип ответа:', choice);
        botMessage = {
          id: uuidv4(),
          role: 'assistant',
          content: 'Получен неизвестный формат ответа',
          type: ResponseType.UNKNOWN
        };
      }
      setContextArray((prev) => [{
        role: botMessage.role,
        content: botMessage.content
      }, ...prev]);
      setMessages((prev) => [...prev, botMessage]);
    }
  }, [result]);

  const handleSendMassage = async (text: string): Promise<void> => {
    if (!text.trim()) return;

    const userMessage: IMessage = {
      id: uuidv4(),
      role: 'user',
      content: text
    };
    setContextArray((prev) => [{
      role: userMessage.role,
      content: userMessage.content
    }, ...prev]);
    setMessages((prev) => [...prev, userMessage]);
    // setInputMessage(text);
  };

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
