import Main from './page/Main';
import { postToAi, usePostAi } from './utils/fetchAi';

;

const App = () => {
  const { error, loading, result } = usePostAi('arliai/qwq-32b-arliai-rpr-v1:free', postToAi('привет'));

  console.log(result);
  console.log(loading);
  console.log(error);
  return (
    <div className='flex w-full  min-h-screen px-4'>
      <div className='container w-full max-w-[960px] mx-auto'>
        <Main>
        </Main>
      </div>
    </div>
  );
};

export default App;
