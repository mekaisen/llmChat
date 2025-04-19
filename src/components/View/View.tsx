import type { IMessage } from '../Chat/Chat';

const View = ({ answer }: { answer: IMessage[] }) => {
  return (
    <div className='flex flex-col shrink grow chat-container'>
      <div className='flex flex-col shrink grow max-w-[960px] mx-auto w-full'>
        <div className='flex flex-col'>
          {answer.map((message) => {
            const isUser = message.sender === 'user';
            const isTyping = message.sender === 'bot' && message.text === '...';

            return (
              <div key={message.id} className={`flex flex-col ${isUser ? 'items-end' : ''}`}>
                <div className={`chat-message ${isUser ? 'chat-message-user' : 'chat-message-bot'}`}>
                  {isTyping ? (
                    <div className='typing-indicator'>
                      <span></span><span></span><span></span>
                    </div>
                  ) : (
                    message.text
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
export default View;
