import type { KeyboardEvent } from 'react';

import { useState } from 'react';

interface InputProps {
  setMessage: (text: string) => void
}

const Input = ({ setMessage }: InputProps) => {
  const [text, setText] = useState('');

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey && text.trim()) {
      setMessage(text);
      setText('');
    }
  };

  return (
    <div className='basis-auto z-3 w-full sticky bottom-0 border-2 chat-input-container'>
      <div className='flex items-center gap-2'>
        <input
          className='flex-1 chat-input'
          type='text'
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder='Напишите сообщение...'
        />
        <button
          className='chat-send-button'
          type='button'
          onClick={() => {
            if (text.trim()) {
              setMessage(text);
              setText('');
            }
          }}
        >
          <svg fill='none' height='16' width='16' xmlns='http://www.w3.org/2000/svg' stroke='currentColor' strokeLinecap='round' strokeLinejoin='round' strokeWidth='2' viewBox='0 0 24 24'>
            <line x1='22' x2='11' y1='2' y2='13'></line>
            <polygon points='22 2 15 22 11 13 2 9 22 2'></polygon>
          </svg>
        </button>
      </div>
    </div>
  );
};
export default Input;
