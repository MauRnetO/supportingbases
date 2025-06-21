import React, { useState, useEffect } from 'react';
import { X, CheckSquare, Save, Calendar, Clock, Flag, User, Tag, Briefcase } from 'lucide-react';
import { Task, TeamMember, Project } from '../../types';

interface TaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (task: Partial<Task>) => void;
  task?: Task | null;
  mode: 'create' | 'edit' | 'view';
  teamMembers: TeamMember[];
  projects: Project[];
}

const priorities = [
  { id: 'low', name: 'Baixa', color: 'text-gray-500' },
  { id: 'medium', name: 'Média', color: 'text-yellow-500' },
  { id: 'high', name: 'Alta', color: 'text-orange-500' },
  { id: 'urgent', name: 'Urgente', color: 'text-red-500' }
];

const statuses = [
  { id: 'todo', name: 'Para Fazer' },
  { id: 'in-progress', name: 'Em Andamento' },
  { id: 'review', name: 'Em Revisão' },
  { id: 'done', name: 'Concluído' }
];

export default function TaskModal({ isOpen, onClose, onSave, task, mode, teamMembers, projects }: TaskModalProps) {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    priority: 'medium' as Task['priority'],
    status: 'todo' as Task['status'],
    assignedTo: [] as string[],
    projectId: '',
    dueDate: '',
    estimatedHours: '',
    tags: [] as string[],
    tagInput: ''
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (task && (mode === 'edit' || mode === 'view')) {
      setFormData({
        title: task.title,
        description: task.description,
        priority: task.priority,
        status: task.status,
        assignedTo: task.assignedTo,
        projectId: task.projectId,
        dueDate: task.dueDate ? task.dueDate.toISOString().split('T')[0] : '',
        estimatedHours: task.estimatedHours?.toString() || '',
        tags: task.tags,
        tagInput: ''
      });
    } else {
      setFormData({
        title: '',
        description: '',
        priority: 'medium',
        status: 'todo',
        assignedTo: [],
        projectId: projects.length > 0 ? projects[0].id : '',
        dueDate: '',
        estimatedHours: '',
        tags: [],
        tagInput: ''
      });
    }
    setErrors({});
  }, [task, mode, isOpen, projects]);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.title.trim()) newErrors.title = 'Título é obrigatório';
    if (!formData.description.trim()) newErrors.description = 'Descrição é obrigatória';
    if (!formData.projectId) newErrors.projectId = 'Projeto é obrigatório';
    if (formData.assignedTo.length === 0) newErrors.assignedTo = 'Pelo menos um responsável é obrigatório';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (mode === 'view') {
      onClose();
      return;
    }
    
    if (!validateForm()) return;

    const taskData: Partial<Task> = {
      ...formData,
      dueDate: formData.dueDate ? new Date(formData.dueDate) : undefined,
      estimatedHours: formData.estimatedHours ? parseInt(formData.estimatedHours) : undefined,
      ...(mode === 'edit' && task ? { id: task.id } : {})
    };

    onSave(taskData);
    onClose();
  };

  const handleChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const handleAssigneeToggle = (memberId: string) => {
    const currentAssignees = formData.assignedTo;
    if (currentAssignees.includes(memberId)) {
      handleChange('assignedTo', currentAssignees.filter(id => id !== memberId));
    } else {
      handleChange('assignedTo', [...currentAssignees, memberId]);
    }
  };

  const handleAddTag = () => {
    const tag = formData.tagInput.trim();
    if (tag && !formData.tags.includes(tag)) {
      handleChange('tags', [...formData.tags, tag]);
      handleChange('tagInput', '');
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    handleChange('tags', formData.tags.filter(tag => tag !== tagToRemove));
  };

  const handleTagInputKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddTag();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" data-modal-active="true">
      <div className="modal-content bg-white rounded-xl shadow-2xl w-full max-w-2xl">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
              <CheckSquare className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-900">
                {mode === 'create' ? 'Nova Tarefa' : mode === 'edit' ? 'Editar Tarefa' : 'Visualizar Tarefa'}
              </h2>
              <p className="text-sm text-gray-500">
                {mode === 'create' ? 'Crie uma nova tarefa para a equipe' : 
                 mode === 'edit' ? 'Atualize as informações da tarefa' : 
                 'Detalhes da tarefa'}
              </p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
            <X className="w-5 h-5 text-gray-400" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Title */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Título *</label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => handleChange('title', e.target.value)}
              disabled={mode === 'view'}
              className={`block w-full px-3 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors ${
                errors.title ? 'border-red-300 bg-red-50' : 'border-gray-300'
              } ${mode === 'view' ? 'bg-gray-50' : ''}`}
              placeholder="Digite o título da tarefa"
            />
            {errors.title && <p className="mt-1 text-sm text-red-600">{errors.title}</p>}
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Descrição *</label>
            <textarea
              value={formData.description}
              onChange={(e) => handleChange('description', e.target.value)}
              disabled={mode === 'view'}
              rows={4}
              className={`block w-full px-3 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors resize-none ${
                errors.description ? 'border-red-300 bg-red-50' : 'border-gray-300'
              } ${mode === 'view' ? 'bg-gray-50' : ''}`}
              placeholder="Descreva a tarefa detalhadamente..."
            />
            {errors.description && <p className="mt-1 text-sm text-red-600">{errors.description}</p>}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Project */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Projeto *</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Briefcase className="h-5 w-5 text-gray-400" />
                </div>
                <select
                  value={formData.projectId}
                  onChange={(e) => handleChange('projectId', e.target.value)}
                  disabled={mode === 'view'}
                  className={`block w-full pl-10 pr-3 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors ${
                    errors.projectId ? 'border-red-300 bg-red-50' : 'border-gray-300'
                  } ${mode === 'view' ? 'bg-gray-50' : ''}`}
                >
                  <option value="">Selecione um projeto</option>
                  {projects.map(project => (
                    <option key={project.id} value={project.id}>{project.name}</option>
                  ))}
                </select>
              </div>
              {errors.projectId && <p className="mt-1 text-sm text-red-600">{errors.projectId}</p>}
            </div>

            {/* Priority */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Prioridade</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Flag className="h-5 w-5 text-gray-400" />
                </div>
                <select
                  value={formData.priority}
                  onChange={(e) => handleChange('priority', e.target.value)}
                  disabled={mode === 'view'}
                  className={`block w-full pl-10 pr-3 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors ${
                    mode === 'view' ? 'bg-gray-50 border-gray-300' : 'border-gray-300'
                  }`}
                >
                  {priorities.map(priority => (
                    <option key={priority.id} value={priority.id}>{priority.name}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Status - only show for edit/view mode */}
          {mode !== 'create' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
              <select
                value={formData.status}
                onChange={(e) => handleChange('status', e.target.value)}
                disabled={mode === 'view'}
                className={`block w-full px-3 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors ${
                  mode === 'view' ? 'bg-gray-50 border-gray-300' : 'border-gray-300'
                }`}
              >
                {statuses.map(status => (
                  <option key={status.id} value={status.id}>{status.name}</option>
                ))}
              </select>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Due Date */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Data de Entrega</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Calendar className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="date"
                  value={formData.dueDate}
                  onChange={(e) => handleChange('dueDate', e.target.value)}
                  disabled={mode === 'view'}
                  min={new Date().toISOString().split('T')[0]}
                  className={`block w-full pl-10 pr-3 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors ${
                    mode === 'view' ? 'bg-gray-50 border-gray-300' : 'border-gray-300'
                  }`}
                />
              </div>
            </div>

            {/* Estimated Hours */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Horas Estimadas</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Clock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="number"
                  min="1"
                  value={formData.estimatedHours}
                  onChange={(e) => handleChange('estimatedHours', e.target.value)}
                  disabled={mode === 'view'}
                  className={`block w-full pl-10 pr-3 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors ${
                    mode === 'view' ? 'bg-gray-50 border-gray-300' : 'border-gray-300'
                  }`}
                  placeholder="Ex: 8"
                />
              </div>
            </div>
          </div>

          {/* Assignees */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">Responsáveis *</label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-40 overflow-y-auto">
              {teamMembers.filter(m => m.isActive).map((member) => (
                <label
                  key={member.id}
                  className={`flex items-center p-3 border rounded-lg cursor-pointer transition-colors ${
                    formData.assignedTo.includes(member.id)
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-300 hover:border-gray-400'
                  } ${mode === 'view' ? 'pointer-events-none' : ''}`}
                >
                  <input
                    type="checkbox"
                    checked={formData.assignedTo.includes(member.id)}
                    onChange={() => handleAssigneeToggle(member.id)}
                    disabled={mode === 'view'}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <div className="ml-3 flex items-center space-x-2">
                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                      <User className="w-4 h-4 text-blue-600" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">{member.name}</p>
                      <p className="text-xs text-gray-500">{member.role === 'admin' ? 'Admin' : member.role === 'manager' ? 'Gerente' : 'Membro'}</p>
                    </div>
                  </div>
                </label>
              ))}
            </div>
            {errors.assignedTo && <p className="mt-1 text-sm text-red-600">{errors.assignedTo}</p>}
          </div>

          {/* Tags */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Tags</label>
            {mode !== 'view' && (
              <div className="flex space-x-2 mb-3">
                <input
                  type="text"
                  value={formData.tagInput}
                  onChange={(e) => handleChange('tagInput', e.target.value)}
                  onKeyDown={handleTagInputKeyDown}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Digite uma tag e pressione Enter"
                />
                <button
                  type="button"
                  onClick={handleAddTag}
                  className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors"
                >
                  <Tag className="w-4 h-4" />
                </button>
              </div>
            )}
            <div className="flex flex-wrap gap-2">
              {formData.tags.map((tag) => (
                <span
                  key={tag}
                  className="inline-flex items-center px-3 py-1 text-sm bg-blue-100 text-blue-800 rounded-full"
                >
                  {tag}
                  {mode !== 'view' && (
                    <button
                      type="button"
                      onClick={() => handleRemoveTag(tag)}
                      className="ml-2 text-blue-600 hover:text-blue-800"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  )}
                </span>
              ))}
            </div>
          </div>

          {/* Task info for view/edit mode */}
          {mode !== 'create' && task && (
            <div className="bg-gray-50 rounded-lg p-4">
              <h5 className="font-medium text-gray-900 mb-2">Informações da Tarefa</h5>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-gray-500">Criada em:</span>
                  <span className="ml-2 text-gray-900">{task.createdAt.toLocaleDateString('pt-BR')}</span>
                </div>
                <div>
                  <span className="text-gray-500">Atualizada em:</span>
                  <span className="ml-2 text-gray-900">{task.updatedAt.toLocaleDateString('pt-BR')}</span>
                </div>
                {task.completedAt && (
                  <div>
                    <span className="text-gray-500">Concluída em:</span>
                    <span className="ml-2 text-green-600">{task.completedAt.toLocaleDateString('pt-BR')}</span>
                  </div>
                )}
                {task.actualHours && (
                  <div>
                    <span className="text-gray-500">Horas trabalhadas:</span>
                    <span className="ml-2 text-gray-900">{task.actualHours}h</span>
                  </div>
                )}
              </div>
            </div>
          )}

          <div className="flex space-x-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-3 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg font-medium transition-colors"
            >
              {mode === 'view' ? 'Fechar' : 'Cancelar'}
            </button>
            {mode !== 'view' && (
              <button
                type="submit"
                className="flex-1 flex items-center justify-center px-4 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors"
              >
                <Save className="w-4 h-4 mr-2" />
                {mode === 'create' ? 'Criar Tarefa' : 'Salvar Alterações'}
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}