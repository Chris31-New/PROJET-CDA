import { PrismaMariaDb } from '@prisma/adapter-mariadb';
import {
  PrismaClient,
  StatusTask,
  Task,
  Project,
  Speciality,
  Company,
} from '../generated/prisma/client';

const prisma = new PrismaClient({
  adapter: new PrismaMariaDb(process.env.DATABASE_URL!),
});

export async function seedTasks() {
  console.log('Seeding Tasks...');

  const projects: Project[] = await prisma.project.findMany({
    orderBy: { id: 'asc' },
  });
  const specialities: Speciality[] = await prisma.speciality.findMany({
    orderBy: { id: 'asc' },
  });
  const companies: Company[] = await prisma.company.findMany({
    orderBy: { id: 'asc' },
  });

  if (!projects.length || !specialities.length || !companies.length) {
    throw new Error('Projects, specialities, or companies are missing!');
  }

  // Fonction utilitaire pour générer des dates cohérentes
  function randomDateBetween(start: Date, end: Date) {
    return new Date(
      start.getTime() + Math.random() * (end.getTime() - start.getTime()),
    );
  }

  const tasksData: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>[] = [];

  // Définir des templates de tâches par type de projet
  const taskTemplatesByProjectType: Record<
    string,
    { name: string; description: string; status: StatusTask }[]
  > = {
    CONSTRUCTION: [
      {
        name: 'Site Excavation',
        description: 'Excavate site according to the plan.',
        status: StatusTask.DONE,
      },
      {
        name: 'Foundation Laying',
        description: 'Pour reinforced concrete foundations.',
        status: StatusTask.IN_PROGRESS,
      },
      {
        name: 'Erect Load-Bearing Walls',
        description: 'Construct structural walls.',
        status: StatusTask.TO_DO,
      },
      {
        name: 'Install Roof Framework',
        description: 'Assemble metal roof framework.',
        status: StatusTask.TO_DO,
      },
      {
        name: 'Roof Installation',
        description: 'Install roof and insulation layers.',
        status: StatusTask.TO_DO,
      },
      {
        name: 'Plumbing Rough-In',
        description: 'Install plumbing pipes and connections.',
        status: StatusTask.TO_DO,
      },
      {
        name: 'Electrical Wiring',
        description: 'Install electrical conduits and wiring.',
        status: StatusTask.TO_DO,
      },
      {
        name: 'Interior Carpentry',
        description: 'Install doors, windows, and stairs.',
        status: StatusTask.TO_DO,
      },
      {
        name: 'Painting & Finishing',
        description: 'Apply paint to walls and ceilings.',
        status: StatusTask.TO_DO,
      },
      {
        name: 'Final Cleaning & Handover',
        description: 'Clean site and hand over keys.',
        status: StatusTask.TO_DO,
      },
    ],
    RENOVATION: [
      {
        name: 'Demolition',
        description: 'Remove old structures and fixtures.',
        status: StatusTask.TO_DO,
      },
      {
        name: 'Structural Repairs',
        description: 'Repair walls, beams, and foundations.',
        status: StatusTask.TO_DO,
      },
      {
        name: 'Install New Flooring',
        description: 'Lay down new flooring material.',
        status: StatusTask.TO_DO,
      },
      {
        name: 'Electrical Updates',
        description: 'Upgrade electrical wiring and fixtures.',
        status: StatusTask.TO_DO,
      },
      {
        name: 'Plumbing Updates',
        description: 'Replace old plumbing with new pipes.',
        status: StatusTask.TO_DO,
      },
      {
        name: 'Painting',
        description: 'Paint interior and exterior walls.',
        status: StatusTask.TO_DO,
      },
      {
        name: 'Install Fixtures',
        description: 'Install cabinets, sinks, and hardware.',
        status: StatusTask.TO_DO,
      },
    ],
  };

  projects.forEach((project, projIndex) => {
    const templateTasks = taskTemplatesByProjectType[project.project_type] || [
      {
        name: `General Task 1`,
        description: 'Generic task description',
        status: StatusTask.TO_DO,
      },
      {
        name: `General Task 2`,
        description: 'Generic task description',
        status: StatusTask.TO_DO,
      },
      {
        name: `General Task 3`,
        description: 'Generic task description',
        status: StatusTask.TO_DO,
      },
    ];

    templateTasks.forEach((taskTemplate, taskIndex) => {
      const speciality =
        specialities[(projIndex + taskIndex) % specialities.length];
      const company = companies[(projIndex + taskIndex) % companies.length];

      tasksData.push({
        ...taskTemplate,
        start_date: randomDateBetween(project.start_date, project.end_Date),
        end_date: randomDateBetween(project.start_date, project.end_Date),
        status_note: '',
        project_id: project.id,
        speciality_id: speciality.id,
        company_id: company.id,
      });
    });
  });

  // Créer les tâches en base
  for (const task of tasksData) {
    await prisma.task.create({ data: task });
  }

  console.log('Tasks seeded successfully!');

  ///////////////////
  // TASK DEPENDENCIES
  ///////////////////

  console.log('Seeding Task Dependencies...');

  const taskDependancesData: {
    first_task_id: number;
    second_task_id: number;
  }[] = [];

  // Récupérer toutes les tâches après insertion
  const allTasks = await prisma.task.findMany({ orderBy: { id: 'asc' } });

  // Fonction utilitaire pour ajouter sans doublon
  const depSet = new Set<string>();
  function addDep(first: number, second: number) {
    const key = `${first}_${second}`;
    if (!depSet.has(key)) {
      depSet.add(key);
      taskDependancesData.push({
        first_task_id: first,
        second_task_id: second,
      });
    }
  }

  // ---- Dépendances pour le projet de construction (séquentielles) ----
  const constructionProject = allTasks.find((t) => t.project_id === 2); // ou ton ID réel
  const constructionTasksInserted = allTasks.filter(
    (t) => t.project_id === constructionProject?.project_id,
  );

  for (let i = 0; i < constructionTasksInserted.length - 1; i++) {
    addDep(
      constructionTasksInserted[i].id,
      constructionTasksInserted[i + 1].id,
    );
  }

  // ---- Dépendances aléatoires pour les autres projets ----
  const otherProjects = allTasks
    .map((t) => t.project_id)
    .filter(
      (id, index, arr) =>
        arr.indexOf(id) === index && id !== constructionProject?.project_id,
    );

  for (const projectId of otherProjects) {
    const projectTasks = allTasks.filter((t) => t.project_id === projectId);
    if (projectTasks.length >= 2) {
      for (let k = 0; k < Math.min(2, projectTasks.length - 1); k++) {
        const firstIndex = Math.floor(
          Math.random() * (projectTasks.length - 1),
        );
        const secondIndex = firstIndex + 1;
        addDep(projectTasks[firstIndex].id, projectTasks[secondIndex].id);
      }
    }
  }

  // ---- Insert en base ----
  for (const dep of taskDependancesData) {
    await prisma.task_Dependance.upsert({
      where: {
        first_task_id_second_task_id: {
          first_task_id: dep.first_task_id,
          second_task_id: dep.second_task_id,
        },
      },
      update: {}, // pas de modification si déjà existant
      create: dep,
    });
  }

  console.log('Task dependencies seeded successfully!');
}
