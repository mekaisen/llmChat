import ThemeManager from './components/ThemeManager';
import ThemeToggle from './components/ThemeToggle';
import Main from './page/Main';

const App = () => {
  return (
    <ThemeManager>
      <div className='flex w-full min-h-screen px-4'>
        <div className='container w-full max-w-[960px] mx-auto'>
          <header className='flex justify-end py-4'>
            <ThemeToggle />
          </header>
          <Main />
        </div>
      </div>
    </ThemeManager>
  );
};

export default App;
