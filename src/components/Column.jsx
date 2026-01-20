import { useDrop } from 'react-dnd';
import { useState } from 'react';
import useStore from '../store/useStore';
import Task from './Task';
import './Column.css';

function Column({ column, boardId, onDelete }) {
  const { addTask, moveTask } = useStore();
  const [showAddTask, setShowAddTask] = useState(false);
  const [taskTitle, setTaskTitle] = useState('');
  const [taskDescription, setTaskDescription] = useState('');

  const [{ isOver }, drop] = useDrop({
    accept: 'TASK',
    drop: (item) => {
      if (item.columnId !== column.id) {
        moveTask(boardId, item.columnId, column.id, item.taskId, column.tasks.length);
      }
    },
    collect: (monitor) => ({
      isOver: monitor.isOver(),
    }),
  });

  const handleAddTask = async (e) => {
    e.preventDefault();
    if (!taskTitle.trim()) return;

    await addTask(boardId, column.id, {
      title: taskTitle,
      description: taskDescription,
      priority: 'medium'
    });

    setTaskTitle('');
    setTaskDescription('');
    setShowAddTask(false);
  };

  return (
    <div 
      ref={drop} 
      className={`column ${isOver ? 'drag-over' : ''}`}
    >
      <div className="column-header">
        <h3>{column.title}</h3>
        <div className="column-actions">
          <span className="task-count">{column.tasks?.length || 0}</span>
          {onDelete && (
            <button 
              onClick={() => onDelete(column.id)}
              className="btn-delete-column"
              title="Eliminar columna"
            >
              Eliminar
            </button>
          )}
        </div>
      </div>

      <div className="tasks-list">
        {column.tasks?.map((task) => (
          <Task
            key={task.id}
            task={task}
            columnId={column.id}
            boardId={boardId}
          />
        ))}
      </div>

      {showAddTask ? (
        <form onSubmit={handleAddTask} className="add-task-form">
          <input
            type="text"
            value={taskTitle}
            onChange={(e) => setTaskTitle(e.target.value)}
            placeholder="Título de la tarea"
            autoFocus
            className="task-input"
          />
          <textarea
            value={taskDescription}
            onChange={(e) => setTaskDescription(e.target.value)}
            placeholder="Descripción (opcional)"
            className="task-textarea"
            rows="2"
          />
          <div className="form-actions">
            <button type="submit" className="btn-add">Agregar</button>
            <button 
              type="button" 
              onClick={() => {
                setShowAddTask(false);
                setTaskTitle('');
                setTaskDescription('');
              }}
              className="btn-cancel"
            >
              Cancelar
            </button>
          </div>
        </form>
      ) : (
        <button 
          onClick={() => setShowAddTask(true)}
          className="btn-add-task"
        >
          Agregar tarea
        </button>
      )}
    </div>
  );
}

export default Column;
