import { useDrag } from 'react-dnd';
import { useState } from 'react';
import useStore from '../store/useStore';
import './Task.css';

function Task({ task, columnId, boardId }) {
  const { updateTask, deleteTask } = useStore();
  const [isEditing, setIsEditing] = useState(false);
  const [title, setTitle] = useState(task.title);
  const [description, setDescription] = useState(task.description || '');

  const [{ isDragging }, drag] = useDrag({
    type: 'TASK',
    item: { taskId: task.id, columnId },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  const handleSave = async () => {
    await updateTask(boardId, columnId, task.id, {
      title,
      description
    });
    setIsEditing(false);
  };

  const handleDelete = async () => {
    if (window.confirm('¿Eliminar esta tarea?')) {
      await deleteTask(boardId, columnId, task.id);
    }
  };

  if (isDragging) {
    return <div className="task task-dragging" />;
  }

  return (
    <div ref={drag} className="task">
      {isEditing ? (
        <div className="task-edit">
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="task-edit-input"
            autoFocus
          />
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="task-edit-textarea"
            rows="3"
            placeholder="Descripción..."
          />
          <div className="task-edit-actions">
            <button onClick={handleSave} className="btn-save">Guardar</button>
            <button 
              onClick={() => {
                setIsEditing(false);
                setTitle(task.title);
                setDescription(task.description || '');
              }} 
              className="btn-cancel"
            >
              Cancelar
            </button>
          </div>
        </div>
      ) : (
        <>
          <div className="task-content" onClick={() => setIsEditing(true)}>
            <h4>{task.title}</h4>
            {task.description && <p>{task.description}</p>}
          </div>
          <button 
            onClick={handleDelete}
            className="btn-delete-task"
            title="Eliminar tarea"
          >
            Eliminar
          </button>
        </>
      )}
    </div>
  );
}

export default Task;
