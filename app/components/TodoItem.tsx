import { useState } from 'react';
import styles from './TodoItem.module.css';

interface TodoItemProps {
  id: string;
  title: string;
  completed: boolean;
  onToggle: (id: string, completed: boolean) => void;
  onDelete: (id: string) => void;
}

export default function TodoItem({ id, title, completed, onToggle, onDelete }: TodoItemProps) {
  const [isDeleting, setIsDeleting] = useState(false);

  const handleToggle = async () => {
    try {
      await onToggle(id, !completed);
    } catch (error) {
      console.error('Error toggling todo:', error);
    }
  };

  const handleDelete = async () => {
    try {
      setIsDeleting(true);
      await onDelete(id);
    } catch (error) {
      console.error('Error deleting todo:', error);
      setIsDeleting(false);
    }
  };

  return (
    <div className={`${styles.todoItem} ${completed ? styles.completed : ''}`}>
      <div className={styles.checkboxContainer}>
        <input
          type="checkbox"
          checked={completed}
          onChange={handleToggle}
          className={styles.checkbox}
        />
      </div>
      <span className={styles.title}>{title}</span>
      <button
        onClick={handleDelete}
        disabled={isDeleting}
        className={styles.deleteButton}
      >
        {isDeleting ? 'Deleting...' : 'Delete'}
      </button>
    </div>
  );
} 