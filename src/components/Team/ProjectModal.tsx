import React, { useState, useEffect } from 'react';
import { X, Briefcase, Save, Calendar, Users, DollarSign, User } from 'lucide-react';
import { Project, TeamMember } from '../../types';

interface ProjectModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (project: Partial<Project>) => void;
  project?: Project | null;
  mode: 'create' | 'edit' | 'view';
  teamMembers: TeamMember[];
}

const colors = [
  '#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6',
  '#06b6d4', '#84cc16', '#f97316', '#ec4899', '#6366f1'
];

const icons = [
  { id: 'briefcase', name: 'Briefcase', icon: '💼' },
  { id: 'target', name: 'Target', icon: '🎯' },
  { id: 'rocket', name: 'Rocket', icon: '🚀' },
  { id: 'star', name: 'Star', icon: '⭐' },
  { id: 'heart', name: 'Heart', icon: '❤️' },
  { id: 'lightbulb', name: 'Lightbulb', icon: '💡' },
  { id: 'code', name: 'Code', icon: '💻' },
  { id: 'design', name: 'Design', icon: '🎨' }
];

export default function ProjectModal({ isOpen, onClose, onSave, project, mode, teamMembers }: ProjectModalProps) {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    color: colors[0],
    icon: icons[0].id,
    startDate: '',
    endDate: '',
    teamMembers: [] as string[],
    budget: ''
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (project && (mode === 'edit' || mode === 'view')) {
      setFormData({
        name: project.name,
        description: project.description,
        color: project.color,
        icon: project.icon,
        startDate: project.startDate.toISOString().split('T')[0],
        endDate: project.endDate ? project.endDate.toISOString().split('T')[0] : '',
        teamMembers: project.teamMembers,
        budget: project.budget?.toString() || ''
      });
    } else {
      setFormData({
        name: '',
        description: '',
        color: colors[0],
        icon: icons[0].id,
        startDate: new Date().toISOString().split('T')[0],
        endDate: '',
        teamMembers: [],
        budget: ''
      });
    }
    setErrors({});
  }, [project, mode, isOpen]);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) newErrors.name = 'Nome é obrigatório';
    if (!formData.description.trim()) newErrors.description = 'Descrição é obrigatória';
    if (!formData.startDate) newErrors.startDate = 'Data de início é obrigatória';
    if (formData.teamMembers.length === 0) newErrors.teamMembers = 'Pelo menos um membro da equipe é obrigatório';

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

    const projectData: Partial<Project> = {
      ...formData,
      startDate: new Date(formData.startDate),
      endDate: formData.endDate ? new Date(formData.endDate) : undefined,
      budget: formData.budget ? parseFloat(formData.budget) : undefined,
      ...(mode === 'edit' && project ? { id: project.id } : {})
    };

    onSave(projectData);
    onClose();
  };

  const handleChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const handleMemberToggle = (memberId: string) => {
    const currentMembers = formData.teamMembers;
    if (currentMembers.includes(memberId)) {
      handleChange('teamMembers', currentMembers.filter(id => id !== memberId));
    } else {
      handleChange('teamMembers', [...currentMembers, memberId]);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" data-modal-active="true">
      <div className="modal-content bg-white rounded-xl shadow-2xl w-full max-w-2xl">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
              <Briefcase className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-900">
                {mode === 'create' ? 'Novo Projeto' : mode === 'edit' ? 'Editar Projeto' : 'Visualizar Projeto'}
              </h2>
              <p className="text-sm text-gray-500">
                {mode === 'create' ? 'Crie um novo projeto para organizar tarefas' : 
                 mode === 'edit' ? 'Atualize as informações do projeto' : 
                 'Detalhes do projeto'}
              </p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
            <X className="w-5 h-5 text-gray-400" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Basic Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Nome do Projeto *</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => handleChange('name', e.target.value)}
                disabled={mode === 'view'}
                className={`block w-full px-3 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors ${
                  errors.name ? 'border-red-300 bg-red-50' : 'border-gray-300'
                } ${mode === 'view' ? 'bg-gray-50' : ''}`}
                placeholder="Digite o nome do projeto"
              />
              {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Orçamento (R$)</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <DollarSign className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  value={formData.budget}
                  onChange={(e) => handleChange('budget', e.target.value)}
                  disabled={mode === 'view'}
                  className={`block w-full pl-10 pr-3 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors ${
                    mode === 'view' ? 'bg-gray-50 border-gray-300' : 'border-gray-300'
                  }`}
                  placeholder="Ex: 5000.00"
                />
              </div>
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Descrição *</label>
            <textarea
              value={formData.description}
              onChange={(e) => handleChange('description', e.target.value)}
              disabled={mode === 'view'}
              rows={3}
              className={`block w-full px-3 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors resize-none ${
                errors.description ? 'border-red-300 bg-red-50' : 'border-gray-300'
              } ${mode === 'view' ? 'bg-gray-50' : ''}`}
              placeholder="Descreva o projeto e seus objetivos..."
            />
            {errors.description && <p className="mt-1 text-sm text-red-600">{errors.description}</p>}
          </div>

          {/* Visual Settings */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Color */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">Cor do Projeto</label>
              <div className="grid grid-cols-5 gap-2">
                {colors.map((color) => (
                  <button
                    key={color}
                    type="button"
                    onClick={() => mode !== 'view' && handleChange('color', color)}
                    disabled={mode === 'view'}
                    className={`w-12 h-12 rounded-lg border-2 transition-all ${
                      formData.color === color 
                        ? 'border-gray-400 ring-2 ring-offset-2 ring-gray-300' 
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                    style={{ backgroundColor: color }}
                  />
                ))}
              </div>
            </div>

            {/* Icon */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">Ícone do Projeto</label>
              <div className="grid grid-cols-4 gap-2">
                {icons.map((icon) => (
                  <button
                    key={icon.id}
                    type="button"
                    onClick={() => mode !== 'view' && handleChange('icon', icon.id)}
                    disabled={mode === 'view'}
                    className={`p-3 border rounded-lg transition-colors text-center ${
                      formData.icon === icon.id 
                        ? 'border-blue-500 bg-blue-50' 
                        : 'border-gray-300 hover:border-gray-400'
                    }`}
                  >
                    <span className="text-xl">{icon.icon}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Dates */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Data de Início *</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Calendar className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="date"
                  value={formData.startDate}
                  onChange={(e) => handleChange('startDate', e.target.value)}
                  disabled={mode === 'view'}
                  className={`block w-full pl-10 pr-3 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors ${
                    errors.startDate ? 'border-red-300 bg-red-50' : 'border-gray-300'
                  } ${mode === 'view' ? 'bg-gray-50' : ''}`}
                />
              </div>
              {errors.startDate && <p className="mt-1 text-sm text-red-600">{errors.startDate}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Data de Término (Opcional)</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Calendar className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="date"
                  value={formData.endDate}
                  onChange={(e) => handleChange('endDate', e.target.value)}
                  disabled={mode === 'view'}
                  min={formData.startDate}
                  className={`block w-full pl-10 pr-3 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors ${
                    mode === 'view' ? 'bg-gray-50 border-gray-300' : 'border-gray-300'
                  }`}
                />
              </div>
            </div>
          </div>

          {/* Team Members */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">Membros da Equipe *</label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-40 overflow-y-auto">
              {teamMembers.filter(m => m.isActive).map((member) => (
                <label
                  key={member.id}
                  className={`flex items-center p-3 border rounded-lg cursor-pointer transition-colors ${
                    formData.teamMembers.includes(member.id)
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-300 hover:border-gray-400'
                  } ${mode === 'view' ? 'pointer-events-none' : ''}`}
                >
                  <input
                    type="checkbox"
                    checked={formData.teamMembers.includes(member.id)}
                    onChange={() => handleMemberToggle(member.id)}
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
            {errors.teamMembers && <p className="mt-1 text-sm text-red-600">{errors.teamMembers}</p>}
          </div>

          {/* Preview */}
          <div className="bg-gray-50 rounded-lg p-4">
            <h5 className="font-medium text-gray-900 mb-3">Prévia do Projeto</h5>
            <div className="flex items-center space-x-3">
              <div 
                className="w-12 h-12 rounded-lg flex items-center justify-center"
                style={{ backgroundColor: formData.color }}
              >
                <span className="text-xl">
                  {icons.find(icon => icon.id === formData.icon)?.icon || '💼'}
                </span>
              </div>
              <div>
                <h6 className="font-medium text-gray-900">{formData.name || 'Nome do Projeto'}</h6>
                <p className="text-sm text-gray-500">{formData.description || 'Descrição do projeto'}</p>
                <div className="flex items-center space-x-4 text-xs text-gray-500 mt-1">
                  <span>{formData.teamMembers.length} membros</span>
                  {formData.budget && <span>R$ {parseFloat(formData.budget).toLocaleString()}</span>}
                </div>
              </div>
            </div>
          </div>

          {/* Project info for view/edit mode */}
          {mode !== 'create' && project && (
            <div className="bg-gray-50 rounded-lg p-4">
              <h5 className="font-medium text-gray-900 mb-2">Informações do Projeto</h5>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-gray-500">Criado em:</span>
                  <span className="ml-2 text-gray-900">{project.createdAt.toLocaleDateString('pt-BR')}</span>
                </div>
                <div>
                  <span className="text-gray-500">Atualizado em:</span>
                  <span className="ml-2 text-gray-900">{project.updatedAt.toLocaleDateString('pt-BR')}</span>
                </div>
                <div>
                  <span className="text-gray-500">Status:</span>
                  <span className={`ml-2 ${
                    project.status === 'active' ? 'text-green-600' :
                    project.status === 'completed' ? 'text-blue-600' :
                    project.status === 'paused' ? 'text-yellow-600' : 'text-red-600'
                  }`}>
                    {project.status === 'active' ? 'Ativo' :
                     project.status === 'completed' ? 'Concluído' :
                     project.status === 'paused' ? 'Pausado' : 'Cancelado'}
                  </span>
                </div>
                <div>
                  <span className="text-gray-500">Progresso:</span>
                  <span className="ml-2 text-gray-900">{project.progress}%</span>
                </div>
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
                className="flex-1 flex items-center justify-center px-4 py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium transition-colors"
              >
                <Save className="w-4 h-4 mr-2" />
                {mode === 'create' ? 'Criar Projeto' : 'Salvar Alterações'}
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}