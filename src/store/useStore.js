import { create } from 'zustand';
import { 
  collection, 
  doc, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  onSnapshot,
  query,
  orderBy,
  Timestamp
} from 'firebase/firestore';
import { db } from '../firebase/config';

const useStore = create((set, get) => ({
  user: null,
  boards: [],
  currentBoard: null,
  loading: false,
  error: null,

  setUser: (user) => set({ user }),
  
  setBoards: (boards) => set({ boards }),
  
  setCurrentBoard: (boardId) => {
    const boards = get().boards;
    const board = boards.find(b => b.id === boardId);
    set({ currentBoard: board || null });
  },

  loadBoards: (userId) => {
    if (!userId) return;
    
    set({ loading: true });
    const boardsRef = collection(db, 'boards');
    
    const q = query(boardsRef);
    
    const unsubscribe = onSnapshot(q, (snapshot) => {
      let boards = snapshot.docs
        .map(doc => ({ id: doc.id, ...doc.data() }))
        .filter(board => {
          const isOwner = board.userId === userId;
          const isMember = board.members && Array.isArray(board.members) && board.members.includes(userId);
          return isOwner || isMember;
        });
      
      boards.sort((a, b) => {
        try {
          const aTime = a.createdAt?.toMillis?.() || a.createdAt?.seconds * 1000 || 0;
          const bTime = b.createdAt?.toMillis?.() || b.createdAt?.seconds * 1000 || 0;
          return bTime - aTime;
        } catch {
          return 0;
        }
      });
      
      set({ boards, loading: false });
      
      const currentBoardId = get().currentBoard?.id;
      if (currentBoardId) {
        const updatedBoard = boards.find(b => b.id === currentBoardId);
        if (updatedBoard) {
          set({ currentBoard: updatedBoard });
        }
      }
    }, (error) => {
      console.error('Error cargando tableros:', error);
      set({ error: error.message, loading: false });
    });

    return unsubscribe;
  },

  createBoard: async (boardData) => {
    try {
      const user = get().user;
      if (!user) throw new Error('Usuario no autenticado');

      const newBoard = {
        ...boardData,
        userId: user.uid,
        members: [user.uid],
        createdAt: Timestamp.now(),
        columns: [
          { id: '1', title: 'Por hacer', tasks: [] },
          { id: '2', title: 'En progreso', tasks: [] },
          { id: '3', title: 'Completado', tasks: [] }
        ]
      };

      const docRef = await addDoc(collection(db, 'boards'), newBoard);
      return docRef.id;
    } catch (error) {
      set({ error: error.message });
      throw error;
    }
  },

  updateBoard: async (boardId, updates) => {
    try {
      const boardRef = doc(db, 'boards', boardId);
      await updateDoc(boardRef, {
        ...updates,
        updatedAt: new Date()
      });
    } catch (error) {
      set({ error: error.message });
      throw error;
    }
  },

  deleteBoard: async (boardId) => {
    try {
      const boardRef = doc(db, 'boards', boardId);
      await deleteDoc(boardRef);
      if (get().currentBoard?.id === boardId) {
        set({ currentBoard: null });
      }
    } catch (error) {
      set({ error: error.message });
      throw error;
    }
  },

  updateColumns: async (boardId, columns) => {
    try {
      await get().updateBoard(boardId, { columns });
    } catch (error) {
      set({ error: error.message });
      throw error;
    }
  },

  addTask: async (boardId, columnId, task) => {
    try {
      const board = get().boards.find(b => b.id === boardId);
      if (!board) throw new Error('Tablero no encontrado');

      const column = board.columns.find(c => c.id === columnId);
      if (!column) throw new Error('Columna no encontrada');

      const newTask = {
        id: Date.now().toString(),
        ...task,
        createdAt: new Date()
      };

      const updatedColumns = board.columns.map(col =>
        col.id === columnId
          ? { ...col, tasks: [...col.tasks, newTask] }
          : col
      );

      await get().updateColumns(boardId, updatedColumns);
    } catch (error) {
      set({ error: error.message });
      throw error;
    }
  },

  updateTask: async (boardId, columnId, taskId, updates) => {
    try {
      const board = get().boards.find(b => b.id === boardId);
      if (!board) throw new Error('Tablero no encontrado');

      const updatedColumns = board.columns.map(col =>
        col.id === columnId
          ? {
              ...col,
              tasks: col.tasks.map(task =>
                task.id === taskId ? { ...task, ...updates } : task
              )
            }
          : col
      );

      await get().updateColumns(boardId, updatedColumns);
    } catch (error) {
      set({ error: error.message });
      throw error;
    }
  },

  deleteTask: async (boardId, columnId, taskId) => {
    try {
      const board = get().boards.find(b => b.id === boardId);
      if (!board) throw new Error('Tablero no encontrado');

      const updatedColumns = board.columns.map(col =>
        col.id === columnId
          ? { ...col, tasks: col.tasks.filter(task => task.id !== taskId) }
          : col
      );

      await get().updateColumns(boardId, updatedColumns);
    } catch (error) {
      set({ error: error.message });
      throw error;
    }
  },

  moveTask: async (boardId, sourceColumnId, destinationColumnId, taskId, newIndex) => {
    try {
      const board = get().boards.find(b => b.id === boardId);
      if (!board) throw new Error('Tablero no encontrado');

      const sourceColumn = board.columns.find(c => c.id === sourceColumnId);
      const destinationColumn = board.columns.find(c => c.id === destinationColumnId);
      
      if (!sourceColumn || !destinationColumn) {
        throw new Error('Columna no encontrada');
      }

      const task = sourceColumn.tasks.find(t => t.id === taskId);
      if (!task) throw new Error('Tarea no encontrada');

      const updatedColumns = board.columns.map(col => {
        if (col.id === sourceColumnId) {
          return {
            ...col,
            tasks: col.tasks.filter(t => t.id !== taskId)
          };
        }
        if (col.id === destinationColumnId) {
          const newTasks = [...col.tasks];
          newTasks.splice(newIndex, 0, task);
          return {
            ...col,
            tasks: newTasks
          };
        }
        return col;
      });

      await get().updateColumns(boardId, updatedColumns);
    } catch (error) {
      set({ error: error.message });
      throw error;
    }
  }
}));

export default useStore;
