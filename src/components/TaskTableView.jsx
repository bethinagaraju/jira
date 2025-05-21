import React, { useMemo, useState } from 'react';
import {
  useReactTable,
  getCoreRowModel,
  flexRender,
} from '@tanstack/react-table';
import { Button, Form, Modal } from 'react-bootstrap';
import { useTasks } from '../context/TaskContext';
import { MdDelete, MdInfoOutline } from 'react-icons/md';
import TaskDetailsModal from './TaskDetailsModal';
import './TaskTableView.css';

// Icon Components
const StoryIcon = () => (
  <svg width="16" height="16" viewBox="0 0 112 112" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M96 0H16C7.16344 0 0 7.16344 0 16V96C0 104.837 7.16344 112 16 112H96C104.837 112 112 104.837 112 96V16C112 7.16344 104.837 0 96 0Z" fill="#63BA3C"/>
    <path fillRule="evenodd" clipRule="evenodd" d="M72 24H40C35.584 24 32 27.584 32 32V84C32 86.208 33.792 88 36 88C37.4 88 38.568 87.24 39.28 86.152L39.312 86.16L54.72 68.32C55.36 67.472 56.64 67.472 57.28 68.32L72.688 86.16L72.72 86.152C73.432 87.24 74.6 88 76 88C78.208 88 80 86.208 80 84V32C80 27.584 76.416 24 72 24Z" fill="white"/>
  </svg>
);

const EpicIcon = () => (
  <svg width="16" height="16" viewBox="0 0 112 112" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M96 0H16C7.16344 0 0 7.16344 0 16V96C0 104.837 7.16344 112 16 112H96C104.837 112 112 104.837 112 96V16C112 7.16344 104.837 0 96 0Z" fill="#904EE2"/>
    <path fillRule="evenodd" clipRule="evenodd" d="M79.3864 54.0528L79.3704 54.0208C79.7384 53.4208 80.0024 52.7568 80.0024 51.9968C80.0024 49.7888 78.2104 47.9968 76.0024 47.9968H56.0024V27.9968C56.0024 25.7888 54.2104 23.9968 52.0024 23.9968C50.6264 23.9968 49.4824 24.7328 48.7624 25.7808C48.5384 26.1088 48.3544 26.4448 48.2344 26.8208L32.6504 57.8928L32.6664 57.9168C32.2824 58.5328 32.0024 59.2208 32.0024 59.9968C32.0024 62.2128 33.7944 63.9968 36.0024 63.9968H56.0024V83.9968C56.0024 86.2128 57.7944 87.9968 60.0024 87.9968C61.4344 87.9968 62.6344 87.2048 63.3464 86.0688L63.3704 86.0768L63.4744 85.8688C63.5624 85.7008 63.6584 85.5488 63.7224 85.3728L79.3864 54.0528Z" fill="white"/>
  </svg>
);

const TaskIcon = () => (
  <svg width="16" height="16" viewBox="0 0 112 112" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M96 0H16C7.16344 0 0 7.16344 0 16V96C0 104.837 7.16344 112 16 112H96C104.837 112 112 104.837 112 96V16C112 7.16344 104.837 0 96 0Z" fill="#4BADE8"/>
  </svg>
);

const BugIcon = () => (
  <svg width="16" height="16" viewBox="0 0 112 112" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M96 0H16C7.16344 0 0 7.16344 0 16V96C0 104.837 7.16344 112 16 112H96C104.837 112 112 104.837 112 96V16C112 7.16344 104.837 0 96 0Z" fill="#E5493A"/>
    <path fillRule="evenodd" clipRule="evenodd" d="M84 56C84 71.4653 71.4653 84 56 84C40.5347 84 28 71.4653 28 56C28 40.5347 40.5347 28 56 28C71.4653 28 84 40.5347 84 56Z" fill="white"/>
  </svg>
);

const ProjectIcon = () => (
  <svg width="16" height="16" viewBox="0 0 112 112" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M96 0H16C7.16344 0 0 7.16344 0 16V96C0 104.837 7.16344 112 16 112H96C104.837 112 112 104.837 112 96V16C112 7.16344 104.837 0 96 0Z" fill="#FFAB00"/>
    <path fillRule="evenodd" clipRule="evenodd" d="M36 32H76C78.2091 32 80 33.7909 80 36V76C80 78.2091 78.2091 80 76 80H36C33.7909 80 32 78.2091 32 76V36C32 33.7909 33.7909 32 36 32ZM36 36V48H56V36H36ZM56 48H76V76H56V48ZM36 76H56V60H36V76Z" fill="white"/>
  </svg>
);

const TaskTableView = ({
  filteredTasks,
  handleEdit,
  handleDelete,
  hideProjectColumn = false,
}) => {
  const {
    deleteTask,
    editTask,
    projects,
    teamMembers,
    deleteProject,
    removeTeamMember,
  } = useTasks();
  const [expanded, setExpanded] = useState({});
  const [editingCell, setEditingCell] = useState(null);
  const [editValue, setEditValue] = useState('');
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);

  const hierarchy = useMemo(() => {
    const buildHierarchy = () => {
      const projectsMap = new Map();

      if (!Array.isArray(filteredTasks)) {
        console.warn('filteredTasks is not an array:', filteredTasks);
        return [];
      }

      filteredTasks.forEach(task => {
        const projectName = task.project || 'Unassigned Project';
        if (!projectsMap.has(projectName)) {
          projectsMap.set(projectName, []);
        }
        projectsMap.get(projectName).push(task);
      });

      const hierarchy = [];
      projectsMap.forEach((projectTasks, projectName) => {
        const projectId = `project-${projectName}`;
        const projectNode = {
          id: projectId,
          title: projectName,
          type: 'PROJECT',
          assignee: '',
          dueDate: '',
          status: 'Todo',
          parentId: null,
          depth: 0,
          originalTask: null,
          originalProject: projects.find(p => p.name === projectName) || null,
        };
        hierarchy.push(projectNode);

        const epics = projectTasks.filter(task => task.workType === 'Epic');
        epics.forEach(epic => {
          const epicId = epic.id?.toString();
          hierarchy.push({
            id: epicId,
            title: epic.title,
            type: 'EPIC',
            assignee: '',
            dueDate: epic.dueDate,
            status: epic.status,
            parentId: projectId,
            depth: 1,
            originalTask: epic,
          });

          const stories = projectTasks.filter(
            t => t.parent?.toString() === epicId && t.workType === 'Story'
          );
          stories.forEach(story => {
            const storyId = story.id?.toString();
            hierarchy.push({
              id: storyId,
              title: story.title,
              type: 'STORY',
              assignee: story.assignee || 'N/A',
              dueDate: story.dueDate,
              status: story.status,
              parentId: epicId,
              depth: 2,
              originalTask: story,
            });

            const subTasks = projectTasks.filter(
              t =>
                t.parent?.toString() === storyId &&
                (t.workType === 'Task' || t.workType === 'Bug')
            );
            subTasks.forEach(sub => {
              hierarchy.push({
                id: sub.id?.toString(),
                title: sub.title,
                type: sub.workType.toUpperCase(),
                assignee: sub.assignee || 'N/A',
                dueDate: sub.dueDate,
                status: sub.status,
                parentId: storyId,
                depth: 3,
                originalTask: sub,
              });
            });
          });
        });
      });

      return hierarchy;
    };

    return buildHierarchy();
  }, [filteredTasks, projects]);

  const visibleRows = useMemo(() => {
    const map = {};
    hierarchy.forEach(row => (map[row.id] = row));

    const isVisible = row => {
      if (row.depth === 0) return true;
      const parent = map[row.parentId];
      return parent && expanded[parent.id] && isVisible(parent);
    };

    return hierarchy.filter(isVisible);
  }, [hierarchy, expanded]);

  const toggleRow = (rowId) => {
    setExpanded(prev => ({ ...prev, [rowId]: !prev[rowId] }));
  };

  const startEditing = (rowId, columnId, value) => {
    setEditingCell({ rowId, columnId });
    setEditValue(value);
  };

  const stopEditing = () => {
    setEditingCell(null);
    setEditValue('');
  };

  const saveEdit = (row) => {
    if (!row.original.originalTask) {
      stopEditing();
      return;
    }

    const updatedTask = { ...row.original.originalTask };

    switch (editingCell.columnId) {
      case 'status':
        updatedTask.status = editValue;
        break;
      case 'assignee':
        updatedTask.assignee = editValue;
        break;
      case 'dueDate':
        updatedTask.dueDate = editValue;
        break;
      default:
        break;
    }

    editTask(updatedTask);
    stopEditing();
  };

  const handleDeleteClick = (row) => {
    setItemToDelete(row.original);
    setShowDeleteModal(true);
  };

  const handleMoreInfoClick = (row) => {
    setSelectedItem(row.original);
    setShowDetailsModal(true);
  };

  const confirmDelete = () => {
    if (!itemToDelete) return;

    switch (itemToDelete.type) {
      case 'PROJECT':
        if (itemToDelete.originalProject) {
          deleteProject(itemToDelete.originalProject.id);
        }
        break;
      case 'EPIC':
      case 'STORY':
      case 'TASK':
      case 'BUG':
        if (itemToDelete.originalTask) {
          handleDelete(itemToDelete.originalTask.id);
        }
        break;
      default:
        break;
    }

    setShowDeleteModal(false);
    setItemToDelete(null);
  };

  const statusOptions = ['Todo', 'In Progress', 'In Review', 'Done', 'Blocked'];
  const projectOptions = projects.map(project => project.name);
  const assigneeOptions = ['', ...teamMembers.map(member => member.name)];

  const getDueDateBarWidth = (dueDate) => {
    if (!dueDate) return '0%';
    const today = new Date();
    const due = new Date(dueDate);
    if (due < today) return '0%';
    const diffTime = due - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    const maxDays = 30;
    const width = Math.min((Math.abs(diffDays) / maxDays) * 100, 100);
    return `${width}%`;
  };

  const renderEditableCell = (cell) => {
    const row = cell.row;
    const columnId = cell.column.id;
    const value = cell.getValue();

    if (editingCell?.rowId === row.id && editingCell?.columnId === columnId) {
      return (
        <div className="d-flex align-items-center">
          {columnId === 'status' && (
            <Form.Select
              size="sm"
              value={editValue}
              onChange={(e) => setEditValue(e.target.value)}
              autoFocus
              onBlur={() => saveEdit(row)}
              onKeyDown={(e) => e.key === 'Enter' && saveEdit(row)}
              style={{ fontSize: '14px', padding: '2px 8px' }}
            >
              {statusOptions.map(option => (
                <option key={option} value={option}>{option}</option>
              ))}
            </Form.Select>
          )}

          {columnId === 'assignee' && (
            <Form.Select
              size="sm"
              value={editValue}
              onChange={(e) => setEditValue(e.target.value)}
              autoFocus
              onBlur={() => saveEdit(row)}
              onKeyDown={(e) => e.key === 'Enter' && saveEdit(row)}
              style={{ fontSize: '14px', padding: '2px 8px' }}
            >
              {assigneeOptions.map(option => (
                <option key={option || 'unassigned'} value={option}>
                  {option || 'Unassigned'}
                </option>
              ))}
            </Form.Select>
          )}

          {columnId === 'dueDate' && (
            <Form.Control
              type="date"
              size="sm"
              value={editValue}
              onChange={(e) => setEditValue(e.target.value)}
              autoFocus
              onBlur={() => saveEdit(row)}
              onKeyDown={(e) => e.key === 'Enter' && saveEdit(row)}
              style={{ fontSize: '14px', padding: '2px 8px' }}
            />
          )}
        </div>
      );
    }

    const isEditable = ['TASK', 'BUG', 'STORY', 'EPIC'].includes(row.original.type) &&
      ['status', 'assignee', 'dueDate'].includes(columnId) &&
      row.original.originalTask;

    if (columnId === 'status' && value) {
      const statusClass = `status-badge status-${value.toLowerCase().replace(' ', '-')}`;
      return (
        <div
          className={`editable-cell ${isEditable ? '' : 'not-editable'}`}
          onClick={() => isEditable && startEditing(row.id, columnId, value)}
          style={{ minHeight: '30px' }}
        >
          <span className={statusClass}>{value}</span>
        </div>
      );
    }

    if (columnId === 'dueDate' && value) {
      return (
        <div
          className={`due-date-cell editable-cell ${isEditable ? '' : 'not-editable'}`}
          onClick={() => isEditable && startEditing(row.id, columnId, value)}
          style={{ minHeight: '30px', position: 'relative' }}
        >
          {value}
          <div className="due-date-bar" style={{ width: getDueDateBarWidth(value) }} />
        </div>
      );
    }

    return (
      <div
        className={`editable-cell ${isEditable ? '' : 'not-editable'}`}
        onClick={() => isEditable && startEditing(row.id, columnId, value)}
        style={{ minHeight: '30px' }}
      >
        {value}
      </div>
    );
  };

  const columns = useMemo(
    () => [
      {
        accessorKey: 'title',
        header: 'Hierarchy',
        cell: ({ row, getValue }) => {
          const rowData = row.original;
          const hasChildren = hierarchy.some(r => r.parentId === rowData.id);

          const renderIcon = () => {
            switch (rowData.type) {
              case 'PROJECT':
                return <ProjectIcon />;
              case 'EPIC':
                return <EpicIcon />;
              case 'STORY':
                return <StoryIcon />;
              case 'TASK':
                return <TaskIcon />;
              case 'BUG':
                return <BugIcon />;
              default:
                return null;
            }
          };

          return (
            <div className="hierarchy-cell">
              {hasChildren && (
                <button
                  className="expand-btn"
                  onClick={() => toggleRow(rowData.id)}
                >
                  {expanded[rowData.id] ? '▼' : '▶'}
                </button>
              )}
              <span className="issue-icon">{renderIcon()}</span>
              <span className="type-label">{rowData.type}</span>: {getValue()}
            </div>
          );
        },
      },
      {
        accessorKey: 'assignee',
        header: 'Assignee',
        cell: renderEditableCell,
      },
      {
        accessorKey: 'dueDate',
        header: 'Due Date',
        cell: renderEditableCell,
      },
      {
        accessorKey: 'status',
        header: 'Status',
        cell: renderEditableCell,
      },
      {
        header: 'Actions',
        cell: ({ row }) => (
          <div>
            {handleEdit && ['TASK', 'BUG', 'STORY', 'EPIC'].includes(row.original.type) && row.original.originalTask && (
              <button
                className="action-btn me-2"
                onClick={() => handleEdit(row.original.originalTask)}
              >
                ✏️
              </button>
            )}
            {['TASK', 'BUG', 'STORY', 'EPIC'].includes(row.original.type) && row.original.originalTask && (
              <button
                className="action-btn me-2"
                onClick={() => handleMoreInfoClick(row)}
                title="More Info"
              >
                <MdInfoOutline />
              </button>
            )}
            <button
              className="action-btn"
              onClick={() => handleDeleteClick(row)}
            >
              <MdDelete />
            </button>
          </div>
        ),
      },
    ],
    [expanded, hierarchy, editingCell, editValue, handleEdit]
  );

  const table = useReactTable({
    data: visibleRows,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <>
      <div className="jira-table-container">
        <table className="jira-table">
          <thead>
            {table.getHeaderGroups().map(headerGroup => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map(header => (
                  <th key={header.id}>
                    {flexRender(header.column.columnDef.header, header.getContext())}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody>
            {table.getRowModel().rows.map(row => (
              <tr key={row.id}>
                {row.getVisibleCells().map(cell => (
                  <td key={cell.id}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Modal
        show={showDeleteModal}
        onHide={() => setShowDeleteModal(false)}
        className="jira-modal"
      >
        <Modal.Header closeButton>
          <Modal.Title>Confirm Delete</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {itemToDelete && (
            <>
              <p>Are you sure you want to delete this {itemToDelete.type.toLowerCase()}?</p>
              <p><strong>{itemToDelete.title}</strong></p>
              {itemToDelete.type === 'PROJECT' && (
                <p className="text-danger">
                  Warning: This will also delete all tasks and epics associated with this project!
                </p>
              )}
              {itemToDelete.type === 'EPIC' && (
                <p className="text-danger">
                  Warning: This will also delete all stories and tasks under this epic!
                </p>
              )}
              {itemToDelete.type === 'STORY' && (
                <p className="text-danger">
                  Warning: This will also delete all tasks under this story!
                </p>
              )}
            </>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>
            Cancel
          </Button>
          <Button variant="danger" onClick={confirmDelete}>
            Delete
          </Button>
        </Modal.Footer>
      </Modal>

      <TaskDetailsModal
        show={showDetailsModal}
        onHide={() => setShowDetailsModal(false)}
        item={selectedItem}
      />
    </>
  );
};

export default TaskTableView;