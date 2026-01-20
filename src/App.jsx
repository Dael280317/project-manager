import { useEffect } from 'react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from './firebase/config';
import useStore from './store/useStore';
import Auth from './components/Auth';
import BoardList from './components/BoardList';
import Board from './components/Board';
import './App.css';

function App() {
  const { user, setUser, loadBoards, currentBoard } = useStore();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      if (user) {
        loadBoards(user.uid);
      }
    });

    return () => unsubscribe();
  }, [setUser, loadBoards]);

  if (!user) {
    return <Auth />;
  }

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="app">
        {!currentBoard ? (
          <BoardList />
        ) : (
          <Board />
        )}
      </div>
    </DndProvider>
  );
}

export default App;
