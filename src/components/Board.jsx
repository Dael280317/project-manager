import { useDrop } from 'react-dnd';
import { useRef } from 'react';
import useStore from '../store/useStore';
import Column from './Column';
import './Board.css';

function Board() {
  const { currentBoard, setCurrentBoard, updateColumns } = useStore();

  const [{ isOver }, drop] = useDrop({
    accept: 'TASK',
    drop: () => ({ type: 'board' }),
    collect: (monitor) => ({
      isOver: monitor.isOver(),
    }),
  });

  if (!currentBoard) {
    return <div>Cargando...</div>;
  }

  const handleAddColumn = () => {
    const newColumn = {
      id: Date.now().toString(),
      title: 'Nueva Columna',
      tasks: []
    };
    updateColumns(currentBoard.id, [...currentBoard.columns, newColumn]);
  };

  const handleDeleteColumn = (columnId) => {
    if (currentBoard.columns.length <= 1) {
      alert('Debe haber al menos una columna');
      return;
    }
    const updatedColumns = currentBoard.columns.filter(col => col.id !== columnId);
    updateColumns(currentBoard.id, updatedColumns);
  };

  return (
    <div className="board-container" ref={drop}>
      <header className="board-header">
        <button onClick={() => setCurrentBoard(null)} className="btn-back">
          Volver
        </button>
        <h1>{currentBoard.name}</h1>
        <div className="board-actions">
          <button onClick={handleAddColumn} className="btn-add-column">
            Agregar Columna
          </button>
        </div>
      </header>

      <div className="columns-container">
        {currentBoard.columns?.map((column) => (
          <Column
            key={column.id}
            column={column}
            boardId={currentBoard.id}
            onDelete={handleDeleteColumn}
          />
        ))}
      </div>
    </div>
  );
}

export default Board;
