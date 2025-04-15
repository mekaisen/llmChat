import { fetchAi, postToAi } from './utils/fetchAi';

const App = () => {
  fetchAi('meta-llama/llama-3.2-1b-instruct:free', postToAi('hello ai')).then((res) => console.log(res));
  return (
    <div>ewq</div>
  );
};

export default App;
