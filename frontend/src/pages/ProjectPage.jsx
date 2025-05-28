import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

function ProjectPage() {
  const { id } = useParams();
  const [project, setProject] = useState(null);

  useEffect(() => {
    axios.get(`/api/projects/${id}`)
      .then(res => setProject(res.data))
      .catch(() => setProject({ title: 'Not Found', content: 'This project does not exist.' }));
  }, [id]);

  if (!project) return <p>Loading...</p>;

  return (
    <div className="mt-4">
      <h2 className="text-primary mb-3">{project.title}</h2>
      <p>{project.content}</p>
    </div>
  );
}

export default ProjectPage;
