

import React, { useState, useEffect, useRef } from 'react';
import { Modal, Button } from 'react-bootstrap';

const TaskDetailsModal = ({ show, onHide, item }) => {
  const [selectedImage, setSelectedImage] = useState(null);
  const descriptionRef = useRef(null);
  const originalTask = item?.originalTask;

  useEffect(() => {
    const container = descriptionRef.current;
    if (!container) return;

    const imgs = container.querySelectorAll('img');
    const listeners = [];

    imgs.forEach((img) => {
      img.style.maxWidth = '200px';
      img.style.cursor = 'pointer';

      const onClick = () => {
        setSelectedImage(img.src);
      };

      img.addEventListener('click', onClick);
      listeners.push({ img, onClick });
    });

    return () => {
      listeners.forEach(({ img, onClick }) => {
        img.removeEventListener('click', onClick);
      });
    };
  }, [originalTask?.description]);

  if (!item) {
    return (
      <Modal show={show} onHide={onHide} className="jira-modal">
        <Modal.Header closeButton>
          <Modal.Title>Task Details</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>No item selected.</p>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={onHide}>Close</Button>
        </Modal.Footer>
      </Modal>
    );
  }

  return (
    <>
      <Modal show={show} onHide={onHide} className="jira-modal">
        <Modal.Header closeButton>
          <Modal.Title>{item.type === 'PROJECT' ? 'Project Details' : 'Task Details'}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {item.type === 'PROJECT' ? (
            <>
              <p><strong>Project Name:</strong> {item.title}</p>
              <p>This is a project, not a task. It does not have task-specific details like description or status.</p>
              {item.originalProject && (
                <>
                  <p><strong>Members:</strong> {item.originalProject.members?.join(', ') || 'N/A'}</p>
                </>
              )}
            </>
          ) : (
            <>
              <p><strong>Type:</strong> {item.type}</p>
              <p><strong>Title:</strong> {originalTask?.title || 'N/A'}</p>
              <p><strong>Status:</strong> {originalTask?.status || 'N/A'}</p>
              <p><strong>Assignee:</strong> {originalTask?.assignee || 'N/A'}</p>
              <p><strong>Due Date:</strong> {originalTask?.dueDate || 'N/A'}</p>
              <p><strong>Description:</strong></p>
              {originalTask?.description ? (
                <div
                  ref={descriptionRef}
                  style={{ maxWidth: '100%' }}
                  dangerouslySetInnerHTML={{ __html: originalTask.description }}
                />
              ) : (
                <p>No description available.</p>
              )}
              {originalTask?.attachments?.length > 0 && (
                <div>
                  <p><strong>Attachments:</strong></p>
                  {originalTask.attachments.map((file, index) => (
                    <div key={index}>
                      {file.url && file.name.match(/\.(jpg|jpeg|png|gif)$/i) ? (
                        <img
                          src={file.url}
                          alt={file.name}
                          style={{ maxWidth: '200px', margin: '5px 0', cursor: 'pointer' }}
                          onClick={() => setSelectedImage(file.url)}
                        />
                      ) : (
                        <p>{file.name}</p>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={onHide}>Close</Button>
        </Modal.Footer>
      </Modal>

      {/* Modal for Enlarged Image */}
      <Modal show={!!selectedImage} onHide={() => setSelectedImage(null)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Image Preview</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedImage && (
            <img
              src={selectedImage}
              alt="Enlarged"
              style={{ width: '100%', maxHeight: '500px', objectFit: 'contain' }}
            />
          )}
        </Modal.Body>
      </Modal>
    </>
  );
};

export default TaskDetailsModal;
