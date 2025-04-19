import { useState } from 'react';
import { v4 as uuidv4 } from 'uuid';

import { postToAi, usePostAi } from '../../utils/fetchAi';
import Input from '../Input/Input';
import View from '../View/View';

export interface IMessage {
  id: string
  sender: 'bot' | 'user',
  text: string,
}

// Функция для проверки типа NonChatChoice
const isNonChatChoice = (choice: any): choice is { text: string } => {
  return 'text' in choice;
};
const isNonStreamingChoice = (choice: any): choice is { message: { content: string } } => {
  return 'message' in choice;
};
// const isNonChatChoice = (choice: any): choice is { text: string } => {
//   return 'text' in choice;
// };

const Chat = () => {
  const [inputMessage, setInputMessage] = useState('');
  const [messages, setMessages] = useState<IMessage[]>([]);
  const { loading, result, error } = usePostAi('thudm/glm-z1-32b:free', postToAi(inputMessage));
  console.log(result);
  const handleSendMassage = async (text: string): Promise<void> => {
    if (!text.trim()) return;

    const userMessage: IMessage = {
      id: uuidv4(),
      sender: 'user',
      text
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputMessage(text);
    console.log('123');
  };
  if (result?.choices) {
    console.log('321');
    const choice = result.choices[0];
    console.log('@resulkt', result);
    if (isNonChatChoice(choice)) {
      const botMessage: IMessage = {
        id: uuidv4(),
        sender: 'bot',
        text: choice.text || 'Нет ответа'
      };

      setMessages((prev) => [...prev, botMessage]);
    }
    if (isNonStreamingChoice(choice)) {
      const botMessage: IMessage = {
        id: uuidv4(),
        sender: 'bot',
        text: choice.message.content
      };
      setMessages((prev) => [...prev, botMessage]);
    }
  }

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
