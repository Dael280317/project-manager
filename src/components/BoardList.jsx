import { useState } from 'react';
import { signOut } from 'firebase/auth';
import { auth } from '../firebase/config';
import useStore from '../store/useStore';
import './BoardList.css';

function BoardList() {
  const { boards, createBoard, setCurrentBoard, deleteBoard, user, loading } = useStore();
  const [showModal, setShowModal] = useState(false);
  const [boardName, setBoardName] = useState('');
  const [boardColor, setBoardColor] = useState('#667eea');
  const [isCreating, setIsCreating] = useState(false);

  const handleCreateBoard = async (e) => {
    e.preventDefault();
    if (!boardName.trim()) return;

    setIsCreating(true);
    try {
      const boardId = await createBoard({
        name: boardName,
        color: boardColor,
        description: ''
      });
      setShowModal(false);
      setBoardName('');
      setTimeout(() => {
        setCurrentBoard(boardId);
      }, 1000);
    } catch (error) {
      console.error('Error al crear tablero:', error);
      alert('Error al crear el tablero: ' + error.message);
    } finally {
      setIsCreating(false);
    }
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
    }
  };

  return (
    <div className="board-list-container">
      <header className="board-list-header">
        <h1>Mis Tableros</h1>
        <div className="header-actions">
          <span className="user-email">{user?.email || 'Invitado'}</span>
          <button onClick={handleLogout} className="btn-logout">
            Cerrar Sesión
          </button>
        </div>
      </header>

      {loading && (
        <div style={{ textAlign: 'center', color: '#999', padding: '40px' }}>
          Cargando tableros...
        </div>
      )}
      
      <div className="boards-grid">
        {!loading && boards.length === 0 && (
          <div style={{ gridColumn: '1 / -1', textAlign: 'center', color: '#999', padding: '40px' }}>
            No tienes tableros aún. Crea uno para comenzar.
          </div>
        )}
        {boards.map((board) => (
          <div
            key={board.id}
            className="board-card"
            style={{ borderTopColor: board.color }}
            onClick={() => setCurrentBoard(board.id)}
          >
            <h3>{board.name}</h3>
            <p className="board-description">
              {board.description || 'Sin descripción'}
            </p>
            <div className="board-stats">
              <span>{board.columns?.reduce((acc, col) => acc + col.tasks?.length || 0, 0)} tareas</span>
            </div>
            <button
              className="btn-delete-board"
              onClick={(e) => {
                e.stopPropagation();
                if (window.confirm('¿Estás seguro de eliminar este tablero?')) {
                  deleteBoard(board.id);
                }
              }}
            >
              Eliminar
            </button>
          </div>
        ))}

        <div className="board-card new-board" onClick={() => setShowModal(true)}>
          <div className="new-board-content">
            <h3>Crear nuevo tablero</h3>
          </div>
        </div>
      </div>

      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h2>Crear Nuevo Tablero</h2>
            <form onSubmit={handleCreateBoard}>
              <div className="form-group">
                <label>Nombre del tablero</label>
                <input
                  type="text"
                  value={boardName}
                  onChange={(e) => setBoardName(e.target.value)}
                  placeholder="Mi proyecto..."
                  autoFocus
                  required
                />
              </div>

              <div className="form-group">
                <label>Color</label>
                <div className="color-picker">
                  {['#667eea', '#f093fb', '#4facfe', '#43e97b', '#fa709a', '#fee140'].map((color) => (
                    <button
                      key={color}
                      type="button"
                      className={`color-option ${boardColor === color ? 'active' : ''}`}
                      style={{ backgroundColor: color }}
                      onClick={() => setBoardColor(color)}
                    />
                  ))}
                </div>
              </div>

              <div className="modal-actions">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="btn-secondary"
                >
                  Cancelar
                </button>
                <button type="submit" disabled={isCreating} className="btn-primary">
                  {isCreating ? 'Creando...' : 'Crear'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default BoardList;
