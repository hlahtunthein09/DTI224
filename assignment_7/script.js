const jobs = [
  {
    id: 1,
    title: 'Frontend Developer',
    company: 'Northstar Labs',
    location: 'Remote',
    type: 'Full-time',
    priority: 'high',
    tags: ['React', 'UI', 'Remote'],
    status: 'found-jobs'
  },
  {
    id: 2,
    title: 'Junior Web Designer',
    company: 'Pixel Harbor',
    location: 'Singapore',
    type: 'Contract',
    priority: 'medium',
    tags: ['Figma', 'CSS', 'Brand'],
    status: 'found-jobs'
  },
  {
    id: 3,
    title: 'UI Engineer',
    company: 'CloudNest',
    location: 'Hybrid',
    type: 'Full-time',
    priority: 'high',
    tags: ['TypeScript', 'Design Systems'],
    status: 'applied'
  },
  {
    id: 4,
    title: 'Product Analyst',
    company: 'Summit Works',
    location: 'New York',
    type: 'Permanent',
    priority: 'low',
    tags: ['SQL', 'Analytics'],
    status: 'applied'
  },
  {
    id: 5,
    title: 'Frontend Intern',
    company: 'BrightPath',
    location: 'Remote',
    type: 'Internship',
    priority: 'medium',
    tags: ['HTML', 'CSS', 'Mentorship'],
    status: 'interview'
  },
  {
    id: 6,
    title: 'Senior JavaScript Developer',
    company: 'Harbor Tech',
    location: 'Berlin',
    type: 'Full-time',
    priority: 'high',
    tags: ['JavaScript', 'Node.js'],
    status: 'interview'
  }
];

let draggedJobId = null;

const columnMap = {
  'found-jobs': document.getElementById('found-jobs'),
  applied: document.getElementById('applied'),
  interview: document.getElementById('interview')
};

function renderBoard() {
  Object.entries(columnMap).forEach(([status, columnElement]) => {
    const jobsInColumn = jobs.filter((job) => job.status === status);

    if (jobsInColumn.length === 0) {
      columnElement.innerHTML = '<div class="empty-state">No jobs in this stage yet.</div>';
    } else {
      columnElement.innerHTML = jobsInColumn
        .map(
          (job) => `
            <article class="card" draggable="true" data-id="${job.id}">
              <div class="card-top">
                <h3 class="role">${job.title}</h3>
                <span class="priority ${job.priority}">${job.priority}</span>
              </div>
              <p class="company">${job.company}</p>
              <div class="meta">
                <span class="meta-item">${job.location}</span>
                <span class="meta-item">${job.type}</span>
              </div>
              <div class="tags">
                ${job.tags.map((tag) => `<span class="tag">${tag}</span>`).join('')}
              </div>
            </article>
          `
        )
        .join('');
    }

    const countElement = document.getElementById(`count-${status}`);
    if (countElement) {
      countElement.textContent = String(jobsInColumn.length);
    }
  });

  attachCardEvents();
}

function attachCardEvents() {
  const cards = document.querySelectorAll('.card');

  cards.forEach((card) => {
    card.addEventListener('dragstart', (event) => {
      draggedJobId = Number(event.currentTarget.dataset.id);
      event.currentTarget.classList.add('dragging');
      event.dataTransfer.effectAllowed = 'move';
    });

    card.addEventListener('dragend', (event) => {
      event.currentTarget.classList.remove('dragging');
      document.querySelectorAll('.dropzone').forEach((zone) => zone.classList.remove('drag-over'));
    });
  });
}

function setupDropZones() {
  document.querySelectorAll('.dropzone').forEach((zone) => {
    zone.addEventListener('dragover', (event) => {
      event.preventDefault();
      zone.classList.add('drag-over');
      event.dataTransfer.dropEffect = 'move';
    });

    zone.addEventListener('dragleave', () => {
      zone.classList.remove('drag-over');
    });

    zone.addEventListener('drop', (event) => {
      event.preventDefault();
      zone.classList.remove('drag-over');

      if (draggedJobId === null) {
        return;
      }

      const nextStatus = zone.id;
      const targetJob = jobs.find((job) => job.id === draggedJobId);

      if (targetJob) {
        targetJob.status = nextStatus;
      }

      draggedJobId = null;
      renderBoard();
    });
  });
}

renderBoard();
setupDropZones();
