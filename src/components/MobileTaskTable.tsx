"use client";
import React, { useState } from "react";
import styles from "../styles/MobileView.module.css";
import DropDown from "./DropDown";
import ActionButton from "./ActionButton";
import { Task, useTaskContext } from "../context/TaskContext";

interface TaskTableProps {
  tasks: Task[];
}

const TaskTable: React.FC<TaskTableProps> = ({ tasks = [] }) => {
  const { editTask, deleteTask } = useTaskContext();
  const [expandedRow, setExpandedRow] = useState<number | null>(null);

  const toggleRow = (index: number) => {
    setExpandedRow(expandedRow === index ? null : index);
  };

  return (
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
          >
            <div>
              <span className={styles.label}>SL.No</span>
              <span className={styles.value}>{index + 1}</span>
            </div>
            <div>
              <span className={styles.label}>Title</span>
              <span className={styles.value}>{task.name}</span>
            </div>
            <button className={styles.expandBtn} aria-label="Expand">
              {expandedRow === index ? "▲" : "▼"}
            </button>
          </div>
          {expandedRow === index && (
            <div className={styles.taskDetails}>
              <div>
                <span className={styles.label}>Description</span>
                <span className={styles.value}>{task.description}</span>
              </div>
              <div>
                <span className={styles.label}>Due Date</span>
                <span className={styles.value}>{task.dueDate}</span>
              </div>
              <div>
                <span className={styles.label}>Status</span>
                <span
                  className={`${styles.status} ${
                    styles[task.status.toLowerCase().replace(" ", "-")]
                  }`}
                >
                  {task.status}
                </span>
              </div>
              <div className={styles.priorityRow}>
                <span className={styles.label}>Priority</span>
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
          )}
        </div>
      ))}
    </div>
  );
};

export default TaskTable;
