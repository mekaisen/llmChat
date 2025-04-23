import { useState } from 'react';

import type { Response } from '../utils/fetchAi';

import { PostAi } from '../utils/fetchAi';

const TestButton = () => {
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState<Response | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleTestRequest = async () => {
    setLoading(true);
    setError(null);

    try {
      const result = await PostAi('microsoft/mai-ds-r1:free', [
        {
          role: 'user',
          content: 'привет'
        }
      ]);

      setResponse(result);
      console.log('Ответ API:', result);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Неизвестная ошибка';
      setError(errorMessage);
      console.error('Ошибка запроса:', errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className='p-4 border border-gray-200 rounded-md mb-4'>
      <h3 className='text-lg font-medium mb-2'>Тестовый запрос к PostAi</h3>
      <button
        className='bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-md disabled:opacity-50'
        disabled={loading}
        onClick={handleTestRequest}
      >
        {loading ? 'Отправка...' : 'Отправить "привет"'}
      </button>

      {error && (
        <div className='mt-3 p-3  text-red-700 rounded-md'>
          Ошибка: {error}
        </div>
      )}

      {response && (
        <div className='mt-3'>
          <div className='p-3  rounded-md'>
            <pre className='whitespace-pre-wrap text-sm'>
              {JSON.stringify(response, null, 2)}
            </pre>
          </div>
        </div>
      )}
    </div>
  );
};

export default TestButton;
