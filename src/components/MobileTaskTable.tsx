"use client";

import React, { useState, useEffect } from "react";
import styles from "../styles/MobileView.module.css";
import DropDown from "./DropDown";
import ActionButton from "./ActionButton";
import { Task, useTaskContext } from "../context/TaskContext";

interface TaskTableProps {
  tasks: Task[];
}

const TaskTable: React.FC<TaskTableProps> = ({ tasks = [] }) => {
  const { editTask } = useTaskContext();
  const [expandedRow, setExpandedRow] = useState<number | null>(null);
  const [isMobile, setIsMobile] = useState(false);

  // Check if device is mobile
  useEffect(() => {
    const checkIsMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    checkIsMobile();
    window.addEventListener('resize', checkIsMobile);
    
    return () => window.removeEventListener('resize', checkIsMobile);
  }, []);

  const toggleRow = (index: number) => {
    setExpandedRow(expandedRow === index ? null : index);
  };

  // Desktop table view
  const renderDesktopTable = () => (
    <table className={styles.taskTable}>
      <thead>
        <tr>
          <th>SL.No</th>
          <th>Title</th>
          <th>Description</th>
          <th>Due Date</th>
          <th>Status</th>
          <th>Priority</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        {tasks.map((task, index) => (
          <tr key={task.id} className={styles.taskRow}>
            <td>{index + 1}</td>
            <td>{task.name}</td>
            <td>{task.description}</td>
            <td>{task.dueDate}</td>
            <td>
              <span
                className={`${styles.status} ${
                  styles[task.status.toLowerCase().replace(" ", "-")]
                }`}
              >
                {task.status}
              </span>
            </td>
            <td>
              <DropDown
                onChange={(priority) =>
                  editTask(task.id, { ...task, priority })
                }
                initialPriority={task.priority}
              />
            </td>
            <td>
              <ActionButton task={task} />
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );

  // Mobile card view
  const renderMobileCards = () => (
    <div className={styles.mobileContainer}>
      {tasks.map((task, index) => (
        <div
          key={task.id}
          className={`${styles.taskCard} ${
            expandedRow === index ? styles.expanded : ""
          }`}
        >
          <div
            className={styles.taskHeader}
            onClick={() => toggleRow(index)}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                toggleRow(index);
              }
            }}
          >
            <div className={styles.headerCell}>
              <span className={styles.headerLabel}>SL.No</span>
              <span className={styles.headerValue}>{index + 1}</span>
            </div>
            <div className={styles.headerCell}>
              <span className={styles.headerLabel}>Title</span>
              <span className={styles.headerValue}>{task.name}</span>
            </div>
            <button 
              className={styles.expandBtn} 
              aria-label={expandedRow === index ? "Collapse" : "Expand"}
              onClick={(e) => {
                e.stopPropagation();
                toggleRow(index);
              }}
            >
              {expandedRow === index ? "▲" : "▼"}
            </button>
          </div>

          {expandedRow === index && (
            <div className={styles.taskDetails}>
              <div className={styles.detailRow}>
                <span className={styles.label}>Description</span>
                <span className={styles.value}>{task.description}</span>
              </div>

              <div className={styles.detailRow}>
                <span className={styles.label}>Due Date</span>
                <span className={styles.value}>{task.dueDate}</span>
              </div>

              <div className={styles.detailRow}>
                <span className={styles.label}>Status</span>
                <span
                  className={`${styles.status} ${
                    styles[task.status.toLowerCase().replace(" ", "-")]
                  }`}
                >
                  {task.status}
                </span>
              </div>

              <div className={styles.detailRow}>
                <span className={styles.label}>Priority</span>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flex: 1, justifyContent: 'space-between' }}>
                  <DropDown
                    onChange={(priority) =>
                      editTask(task.id, { ...task, priority })
                    }
                    initialPriority={task.priority}
                  />
                  <span className={styles.actionIcon}>
                    <ActionButton task={task} />
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  );

  return (
    <div className={styles.taskTableContainer}>
      {/* Desktop view - hidden on mobile via CSS */}
      {renderDesktopTable()}
      
      {/* Mobile view - hidden on desktop via CSS */}
      {renderMobileCards()}
    </div>
  );
};

export default TaskTable;
