import React, { useState } from 'react';
import { Plus, Users, CheckSquare, Calendar, Clock, Filter, User, Edit, Trash2, Flag, MessageSquare, Briefcase, UserPlus, Settings } from 'lucide-react';
import { TeamMember, Task, Project } from '../../types';
import { useLocalStorage } from '../../hooks/useLocalStorage';
import TaskModal from './TaskModal';
import TeamMemberModal from './TeamMemberModal';
import ProjectModal from './ProjectModal';

const mockTeamMembers: TeamMember[] = [
  {
    id: '1',
    name: 'João Silva',
    email: 'joao@email.com',
    role: 'admin',
    permissions: ['all'],
    isActive: true,
    createdAt: new Date('2024-01-01'),
    lastActive: new Date(),
    skills: ['Gestão', 'Marketing', 'Vendas'],
    hourlyRate: 50
  },
  {
    id: '2',
    name: 'Maria Santos',
    email: 'maria@email.com',
    role: 'manager',
    permissions: ['manage_tasks', 'view_reports'],
    isActive: true,
    createdAt: new Date('2024-02-15'),
    lastActive: new Date(),
    skills: ['Atendimento', 'Organização'],
    hourlyRate: 35
  },
  {
    id: '3',
    name: 'Pedro Costa',
    email: 'pedro@email.com',
    role: 'member',
    permissions: ['view_tasks'],
    isActive: true,
    createdAt: new Date('2024-03-10'),
    lastActive: new Date(Date.now() - 24 * 60 * 60 * 1000),
    skills: ['Design', 'Social Media'],
    hourlyRate: 25
  }
];

const mockProjects: Project[] = [
  {
    id: '1',
    name: 'Campanha de Marketing',
    description: 'Campanha para atrair novos clientes',
    color: '#3b82f6',
    icon: 'target',
    status: 'active',
    startDate: new Date('2024-12-01'),
    endDate: new Date('2024-12-31'),
    teamMembers: ['1', '2', '3'],
    ownerId: '1',
    progress: 65,
    budget: 5000,
    createdAt: new Date('2024-12-01'),
    updatedAt: new Date()
  },
  {
    id: '2',
    name: 'Melhoria do Sistema',
    description: 'Atualizações e melhorias na plataforma',
    color: '#10b981',
    icon: 'code',
    status: 'active',
    startDate: new Date('2024-11-15'),
    teamMembers: ['1', '3'],
    ownerId: '1',
    progress: 40,
    createdAt: new Date('2024-11-15'),
    updatedAt: new Date()
  }
];

const mockTasks: Task[] = [
  {
    id: '1',
    title: 'Criar conteúdo para redes sociais',
    description: 'Desenvolver posts para Instagram e Facebook da campanha',
    status: 'in-progress',
    priority: 'high',
    assignedTo: ['3'],
    createdBy: '1',
    projectId: '1',
    dueDate: new Date('2024-12-25'),
    estimatedHours: 8,
    actualHours: 5,
    tags: ['marketing', 'social'],
    attachments: [],
    comments: [],
    createdAt: new Date('2024-12-18'),
    updatedAt: new Date()
  },
  {
    id: '2',
    title: 'Configurar sistema de agendamento',
    description: 'Implementar melhorias no sistema de agendamento online',
    status: 'todo',
    priority: 'medium',
    assignedTo: ['1'],
    createdBy: '1',
    projectId: '2',
    dueDate: new Date('2024-12-30'),
    estimatedHours: 12,
    tags: ['desenvolvimento', 'sistema'],
    attachments: [],
    comments: [],
    createdAt: new Date('2024-12-17'),
    updatedAt: new Date()
  },
  {
    id: '3',
    title: 'Análise de concorrência',
    description: 'Pesquisar e analisar principais concorrentes do mercado',
    status: 'review',
    priority: 'low',
    assignedTo: ['2'],
    createdBy: '1',
    projectId: '1',
    dueDate: new Date('2024-12-22'),
    estimatedHours: 6,
    actualHours: 6,
    tags: ['pesquisa', 'análise'],
    attachments: [],
    comments: [],
    createdAt: new Date('2024-12-16'),
    updatedAt: new Date()
  }
];

const statusColors = {
  'todo': 'bg-gray-100 text-gray-800 border-gray-300',
  'in-progress': 'bg-blue-100 text-blue-800 border-blue-300',
  'review': 'bg-yellow-100 text-yellow-800 border-yellow-300',
  'done': 'bg-green-100 text-green-800 border-green-300'
};

const statusLabels = {
  'todo': 'Para Fazer',
  'in-progress': 'Em Andamento',
  'review': 'Em Revisão',
  'done': 'Concluído'
};

const priorityColors = {
  'low': 'text-gray-500',
  'medium': 'text-yellow-500',
  'high': 'text-orange-500',
  'urgent': 'text-red-500'
};

const priorityLabels = {
  'low': 'Baixa',
  'medium': 'Média',
  'high': 'Alta',
  'urgent': 'Urgente'
};

export default function TeamManagement() {
  const [teamMembers, setTeamMembers] = useLocalStorage<TeamMember[]>('teamMembers', mockTeamMembers);
  const [tasks, setTasks] = useLocalStorage<Task[]>('teamTasks', mockTasks);
  const [projects, setProjects] = useLocalStorage<Project[]>('teamProjects', mockProjects);
  
  const [activeTab, setActiveTab] = useState<'tasks' | 'projects' | 'team'>('tasks');
  const [selectedProject, setSelectedProject] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [selectedAssignee, setSelectedAssignee] = useState<string>('all');
  
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [isMemberModalOpen, setIsMemberModalOpen] = useState(false);
  const [isProjectModalOpen, setIsProjectModalOpen] = useState(false);
  
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [selectedMember, setSelectedMember] = useState<TeamMember | null>(null);
  const [selectedProjectData, setSelectedProjectData] = useState<Project | null>(null);
  
  const [taskModalMode, setTaskModalMode] = useState<'create' | 'edit' | 'view'>('create');
  const [memberModalMode, setMemberModalMode] = useState<'create' | 'edit' | 'view'>('create');
  const [projectModalMode, setProjectModalMode] = useState<'create' | 'edit' | 'view'>('create');

  const filteredTasks = tasks.filter(task => {
    const matchesProject = selectedProject === 'all' || task.projectId === selectedProject;
    const matchesStatus = selectedStatus === 'all' || task.status === selectedStatus;
    const matchesAssignee = selectedAssignee === 'all' || task.assignedTo.includes(selectedAssignee);
    
    return matchesProject && matchesStatus && matchesAssignee;
  });

  const handleCreateTask = () => {
    setSelectedTask(null);
    setTaskModalMode('create');
    setIsTaskModalOpen(true);
  };

  const handleEditTask = (task: Task) => {
    setSelectedTask(task);
    setTaskModalMode('edit');
    setIsTaskModalOpen(true);
  };

  const handleViewTask = (task: Task) => {
    setSelectedTask(task);
    setTaskModalMode('view');
    setIsTaskModalOpen(true);
  };

  const handleSaveTask = (taskData: Partial<Task>) => {
    if (taskModalMode === 'create') {
      const newTask: Task = {
        id: Date.now().toString(),
        title: taskData.title!,
        description: taskData.description!,
        status: 'todo',
        priority: taskData.priority!,
        assignedTo: taskData.assignedTo!,
        createdBy: '1', // Current user
        projectId: taskData.projectId!,
        dueDate: taskData.dueDate,
        estimatedHours: taskData.estimatedHours,
        actualHours: 0,
        tags: taskData.tags!,
        attachments: [],
        comments: [],
        createdAt: new Date(),
        updatedAt: new Date()
      };
      setTasks(prev => [...prev, newTask]);
    } else if (taskModalMode === 'edit' && selectedTask) {
      setTasks(prev => prev.map(task => 
        task.id === selectedTask.id 
          ? { ...task, ...taskData, updatedAt: new Date() }
          : task
      ));
    }
  };

  const handleDeleteTask = (taskId: string) => {
    if (confirm('Tem certeza que deseja excluir esta tarefa?')) {
      setTasks(prev => prev.filter(task => task.id !== taskId));
    }
  };

  const handleCreateMember = () => {
    setSelectedMember(null);
    setMemberModalMode('create');
    setIsMemberModalOpen(true);
  };

  const handleEditMember = (member: TeamMember) => {
    setSelectedMember(member);
    setMemberModalMode('edit');
    setIsMemberModalOpen(true);
  };

  const handleSaveMember = (memberData: Partial<TeamMember>) => {
    if (memberModalMode === 'create') {
      const newMember: TeamMember = {
        id: Date.now().toString(),
        name: memberData.name!,
        email: memberData.email!,
        role: memberData.role!,
        permissions: memberData.permissions!,
        isActive: true,
        createdAt: new Date(),
        skills: memberData.skills!,
        hourlyRate: memberData.hourlyRate
      };
      setTeamMembers(prev => [...prev, newMember]);
    } else if (memberModalMode === 'edit' && selectedMember) {
      setTeamMembers(prev => prev.map(member => 
        member.id === selectedMember.id 
          ? { ...member, ...memberData }
          : member
      ));
    }
  };

  const handleCreateProject = () => {
    setSelectedProjectData(null);
    setProjectModalMode('create');
    setIsProjectModalOpen(true);
  };

  const handleEditProject = (project: Project) => {
    setSelectedProjectData(project);
    setProjectModalMode('edit');
    setIsProjectModalOpen(true);
  };

  const handleSaveProject = (projectData: Partial<Project>) => {
    if (projectModalMode === 'create') {
      const newProject: Project = {
        id: Date.now().toString(),
        name: projectData.name!,
        description: projectData.description!,
        color: projectData.color!,
        icon: projectData.icon!,
        status: 'active',
        startDate: projectData.startDate!,
        endDate: projectData.endDate,
        teamMembers: projectData.teamMembers!,
        ownerId: '1', // Current user
        progress: 0,
        budget: projectData.budget,
        createdAt: new Date(),
        updatedAt: new Date()
      };
      setProjects(prev => [...prev, newProject]);
    } else if (projectModalMode === 'edit' && selectedProjectData) {
      setProjects(prev => prev.map(project => 
        project.id === selectedProjectData.id 
          ? { ...project, ...projectData, updatedAt: new Date() }
          : project
      ));
    }
  };

  const getTaskStats = () => {
    const total = tasks.length;
    const todo = tasks.filter(t => t.status === 'todo').length;
    const inProgress = tasks.filter(t => t.status === 'in-progress').length;
    const review = tasks.filter(t => t.status === 'review').length;
    const done = tasks.filter(t => t.status === 'done').length;
    
    return { total, todo, inProgress, review, done };
  };

  const stats = getTaskStats();

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Gestão de Equipe</h1>
          <p className="text-gray-600">Gerencie tarefas, projetos e membros da equipe</p>
        </div>
        
        <div className="flex items-center space-x-3">
          {activeTab === 'tasks' && (
            <button 
              onClick={handleCreateTask}
              className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
            >
              <Plus className="w-4 h-4 mr-2" />
              Nova Tarefa
            </button>
          )}
          {activeTab === 'projects' && (
            <button 
              onClick={handleCreateProject}
              className="flex items-center px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
            >
              <Plus className="w-4 h-4 mr-2" />
              Novo Projeto
            </button>
          )}
          {activeTab === 'team' && (
            <button 
              onClick={handleCreateMember}
              className="flex items-center px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition-colors"
            >
              <UserPlus className="w-4 h-4 mr-2" />
              Adicionar Membro
            </button>
          )}
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          {[
            { id: 'tasks', name: 'Tarefas', icon: CheckSquare, count: stats.total },
            { id: 'projects', name: 'Projetos', icon: Briefcase, count: projects.length },
            { id: 'team', name: 'Equipe', icon: Users, count: teamMembers.filter(m => m.isActive).length }
          ].map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <Icon className="w-4 h-4 mr-2" />
                {tab.name}
                <span className={`ml-2 px-2 py-1 text-xs rounded-full ${
                  activeTab === tab.id ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-600'
                }`}>
                  {tab.count}
                </span>
              </button>
            );
          })}
        </nav>
      </div>

      {/* Tasks Tab */}
      {activeTab === 'tasks' && (
        <div className="space-y-6">
          {/* Task Stats */}
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            <div className="bg-white p-4 rounded-lg border border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Total</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
                </div>
                <CheckSquare className="w-6 h-6 text-gray-400" />
              </div>
            </div>
            
            <div className="bg-white p-4 rounded-lg border border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Para Fazer</p>
                  <p className="text-2xl font-bold text-gray-600">{stats.todo}</p>
                </div>
                <div className="w-3 h-3 bg-gray-500 rounded-full"></div>
              </div>
            </div>
            
            <div className="bg-white p-4 rounded-lg border border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Em Andamento</p>
                  <p className="text-2xl font-bold text-blue-600">{stats.inProgress}</p>
                </div>
                <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
              </div>
            </div>
            
            <div className="bg-white p-4 rounded-lg border border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Em Revisão</p>
                  <p className="text-2xl font-bold text-yellow-600">{stats.review}</p>
                </div>
                <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
              </div>
            </div>
            
            <div className="bg-white p-4 rounded-lg border border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Concluído</p>
                  <p className="text-2xl font-bold text-green-600">{stats.done}</p>
                </div>
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              </div>
            </div>
          </div>

          {/* Filters */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
            <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center">
              <div className="flex items-center space-x-2">
                <Filter className="w-4 h-4 text-gray-400" />
                <span className="text-sm font-medium text-gray-700">Filtros:</span>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-4 flex-1">
                <select
                  value={selectedProject}
                  onChange={(e) => setSelectedProject(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="all">Todos os projetos</option>
                  {projects.map(project => (
                    <option key={project.id} value={project.id}>{project.name}</option>
                  ))}
                </select>
                
                <select
                  value={selectedStatus}
                  onChange={(e) => setSelectedStatus(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="all">Todos os status</option>
                  <option value="todo">Para Fazer</option>
                  <option value="in-progress">Em Andamento</option>
                  <option value="review">Em Revisão</option>
                  <option value="done">Concluído</option>
                </select>
                
                <select
                  value={selectedAssignee}
                  onChange={(e) => setSelectedAssignee(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="all">Todos os responsáveis</option>
                  {teamMembers.filter(m => m.isActive).map(member => (
                    <option key={member.id} value={member.id}>{member.name}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Tasks Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredTasks.map((task) => {
              const assignees = teamMembers.filter(m => task.assignedTo.includes(m.id));
              const project = projects.find(p => p.id === task.projectId);
              
              return (
                <div key={task.id} className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-all duration-200 group">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-2">
                        <h3 className="font-semibold text-gray-900 line-clamp-2">{task.title}</h3>
                        <Flag className={`w-4 h-4 ${priorityColors[task.priority]}`} />
                      </div>
                      {project && (
                        <div className="flex items-center space-x-2 mb-2">
                          <div 
                            className="w-3 h-3 rounded-full"
                            style={{ backgroundColor: project.color }}
                          ></div>
                          <span className="text-xs text-gray-500">{project.name}</span>
                        </div>
                      )}
                      <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full border ${statusColors[task.status]}`}>
                        {statusLabels[task.status]}
                      </span>
                    </div>
                    
                    <div className="flex space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={() => handleViewTask(task)}
                        className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        title="Ver tarefa"
                      >
                        <CheckSquare className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleEditTask(task)}
                        className="p-2 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                        title="Editar tarefa"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteTask(task.id)}
                        className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        title="Excluir tarefa"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                  
                  <p className="text-sm text-gray-600 mb-4 line-clamp-2">{task.description}</p>
                  
                  <div className="space-y-3">
                    {task.dueDate && (
                      <div className="flex items-center text-sm text-gray-600">
                        <Calendar className="w-4 h-4 mr-2" />
                        {task.dueDate.toLocaleDateString('pt-BR')}
                      </div>
                    )}
                    
                    {task.estimatedHours && (
                      <div className="flex items-center text-sm text-gray-600">
                        <Clock className="w-4 h-4 mr-2" />
                        {task.actualHours || 0}h / {task.estimatedHours}h
                      </div>
                    )}
                    
                    {assignees.length > 0 && (
                      <div className="flex items-center space-x-2">
                        <div className="flex -space-x-1">
                          {assignees.slice(0, 3).map((member) => (
                            <div
                              key={member.id}
                              className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center text-xs font-medium text-blue-600 border-2 border-white"
                              title={member.name}
                            >
                              {member.name.charAt(0)}
                            </div>
                          ))}
                          {assignees.length > 3 && (
                            <div className="w-6 h-6 bg-gray-100 rounded-full flex items-center justify-center text-xs font-medium text-gray-600 border-2 border-white">
                              +{assignees.length - 3}
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                    
                    {task.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1">
                        {task.tags.slice(0, 2).map((tag) => (
                          <span key={tag} className="px-2 py-1 text-xs bg-gray-100 text-gray-600 rounded-full">
                            {tag}
                          </span>
                        ))}
                        {task.tags.length > 2 && (
                          <span className="px-2 py-1 text-xs bg-gray-100 text-gray-600 rounded-full">
                            +{task.tags.length - 2}
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {filteredTasks.length === 0 && (
            <div className="text-center py-12">
              <CheckSquare className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">Nenhuma tarefa encontrada</h3>
              <p className="text-gray-500 mb-4">
                {tasks.length === 0 
                  ? 'Comece criando sua primeira tarefa.'
                  : 'Tente ajustar os filtros para ver mais tarefas.'
                }
              </p>
              {tasks.length === 0 && (
                <button 
                  onClick={handleCreateTask}
                  className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Criar Primeira Tarefa
                </button>
              )}
            </div>
          )}
        </div>
      )}

      {/* Projects Tab */}
      {activeTab === 'projects' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {projects.map((project) => {
              const projectTasks = tasks.filter(t => t.projectId === project.id);
              const completedTasks = projectTasks.filter(t => t.status === 'done').length;
              const progress = projectTasks.length > 0 ? (completedTasks / projectTasks.length) * 100 : 0;
              
              return (
                <div key={project.id} className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-all duration-200 group">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <div 
                        className="w-10 h-10 rounded-lg flex items-center justify-center"
                        style={{ backgroundColor: project.color }}
                      >
                        <Briefcase className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900">{project.name}</h3>
                        <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                          project.status === 'active' ? 'bg-green-100 text-green-800' :
                          project.status === 'completed' ? 'bg-blue-100 text-blue-800' :
                          project.status === 'paused' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-red-100 text-red-800'
                        }`}>
                          {project.status === 'active' ? 'Ativo' :
                           project.status === 'completed' ? 'Concluído' :
                           project.status === 'paused' ? 'Pausado' : 'Cancelado'}
                        </span>
                      </div>
                    </div>
                    
                    <div className="flex space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={() => handleEditProject(project)}
                        className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        title="Editar projeto"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                  
                  <p className="text-sm text-gray-600 mb-4 line-clamp-2">{project.description}</p>
                  
                  <div className="space-y-3">
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-gray-600">Progresso</span>
                        <span className="text-gray-900 font-medium">{Math.round(progress)}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className="h-2 rounded-full transition-all duration-300"
                          style={{ 
                            width: `${progress}%`,
                            backgroundColor: project.color 
                          }}
                        ></div>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">Tarefas:</span>
                      <span className="text-gray-900">{completedTasks}/{projectTasks.length}</span>
                    </div>
                    
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">Equipe:</span>
                      <div className="flex -space-x-1">
                        {teamMembers.filter(m => project.teamMembers.includes(m.id)).slice(0, 3).map((member) => (
                          <div
                            key={member.id}
                            className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center text-xs font-medium text-blue-600 border-2 border-white"
                            title={member.name}
                          >
                            {member.name.charAt(0)}
                          </div>
                        ))}
                        {project.teamMembers.length > 3 && (
                          <div className="w-6 h-6 bg-gray-100 rounded-full flex items-center justify-center text-xs font-medium text-gray-600 border-2 border-white">
                            +{project.teamMembers.length - 3}
                          </div>
                        )}
                      </div>
                    </div>
                    
                    {project.budget && (
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-600">Orçamento:</span>
                        <span className="text-green-600 font-medium">R$ {project.budget.toLocaleString()}</span>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {projects.length === 0 && (
            <div className="text-center py-12">
              <Briefcase className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">Nenhum projeto criado</h3>
              <p className="text-gray-500 mb-4">Comece criando seu primeiro projeto para organizar tarefas.</p>
              <button 
                onClick={handleCreateProject}
                className="inline-flex items-center px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
              >
                <Plus className="w-4 h-4 mr-2" />
                Criar Primeiro Projeto
              </button>
            </div>
          )}
        </div>
      )}

      {/* Team Tab */}
      {activeTab === 'team' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {teamMembers.filter(m => m.isActive).map((member) => {
              const memberTasks = tasks.filter(t => t.assignedTo.includes(member.id));
              const completedTasks = memberTasks.filter(t => t.status === 'done').length;
              
              return (
                <div key={member.id} className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-all duration-200 group">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                        <User className="w-6 h-6 text-blue-600" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900">{member.name}</h3>
                        <p className="text-sm text-gray-500">{member.email}</p>
                        <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                          member.role === 'admin' ? 'bg-red-100 text-red-800' :
                          member.role === 'manager' ? 'bg-purple-100 text-purple-800' :
                          'bg-gray-100 text-gray-800'
                        }`}>
                          {member.role === 'admin' ? 'Administrador' :
                           member.role === 'manager' ? 'Gerente' : 'Membro'}
                        </span>
                      </div>
                    </div>
                    
                    <div className="flex space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={() => handleEditMember(member)}
                        className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        title="Editar membro"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                  
                  <div className="space-y-3">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">Tarefas ativas:</span>
                      <span className="text-gray-900">{memberTasks.filter(t => t.status !== 'done').length}</span>
                    </div>
                    
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">Concluídas:</span>
                      <span className="text-green-600">{completedTasks}</span>
                    </div>
                    
                    {member.hourlyRate && (
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-600">Valor/hora:</span>
                        <span className="text-blue-600 font-medium">R$ {member.hourlyRate}</span>
                      </div>
                    )}
                    
                    {member.lastActive && (
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-600">Último acesso:</span>
                        <span className="text-gray-900">
                          {member.lastActive.toLocaleDateString('pt-BR')}
                        </span>
                      </div>
                    )}
                    
                    {member.skills.length > 0 && (
                      <div>
                        <p className="text-sm text-gray-600 mb-2">Habilidades:</p>
                        <div className="flex flex-wrap gap-1">
                          {member.skills.slice(0, 3).map((skill) => (
                            <span key={skill} className="px-2 py-1 text-xs bg-blue-100 text-blue-700 rounded-full">
                              {skill}
                            </span>
                          ))}
                          {member.skills.length > 3 && (
                            <span className="px-2 py-1 text-xs bg-gray-100 text-gray-600 rounded-full">
                              +{member.skills.length - 3}
                            </span>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {teamMembers.filter(m => m.isActive).length === 0 && (
            <div className="text-center py-12">
              <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">Nenhum membro na equipe</h3>
              <p className="text-gray-500 mb-4">Adicione membros para começar a gerenciar tarefas em equipe.</p>
              <button 
                onClick={handleCreateMember}
                className="inline-flex items-center px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition-colors"
              >
                <UserPlus className="w-4 h-4 mr-2" />
                Adicionar Primeiro Membro
              </button>
            </div>
          )}
        </div>
      )}

      {/* Modals */}
      <TaskModal
        isOpen={isTaskModalOpen}
        onClose={() => setIsTaskModalOpen(false)}
        onSave={handleSaveTask}
        task={selectedTask}
        mode={taskModalMode}
        teamMembers={teamMembers}
        projects={projects}
      />

      <TeamMemberModal
        isOpen={isMemberModalOpen}
        onClose={() => setIsMemberModalOpen(false)}
        onSave={handleSaveMember}
        member={selectedMember}
        mode={memberModalMode}
      />

      <ProjectModal
        isOpen={isProjectModalOpen}
        onClose={() => setIsProjectModalOpen(false)}
        onSave={handleSaveProject}
        project={selectedProjectData}
        mode={projectModalMode}
        teamMembers={teamMembers}
      />
    </div>
  );
}