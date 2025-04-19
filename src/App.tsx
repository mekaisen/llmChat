import ThemeManager from './components/ThemeManager';
import ThemeToggle from './components/ThemeToggle';
import Main from './page/Main';

const App = () => {
  return (
    <ThemeManager>
      <div className='w-full h-full flex flex-col absolute top-0 bottom-0 left-0 right-0'>
        <div className='w-full h-full flex flex-1 flex-col'>
          <div className='grow flex flex-col'>
            <header className='flex justify-end py-4 p-3'>
              <ThemeToggle />
            </header>
            <Main />
          </div>
        </div>
      </div>
    </ThemeManager>
  );
};

export default App;
