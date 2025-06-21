import React, { useState, useEffect } from 'react';
import { X, User, Mail, Save, Shield, Star, DollarSign } from 'lucide-react';
import { TeamMember } from '../../types';

interface TeamMemberModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (member: Partial<TeamMember>) => void;
  member?: TeamMember | null;
  mode: 'create' | 'edit' | 'view';
}

const roles = [
  { id: 'member', name: 'Membro', description: 'Acesso básico a tarefas' },
  { id: 'manager', name: 'Gerente', description: 'Pode gerenciar tarefas e ver relatórios' },
  { id: 'admin', name: 'Administrador', description: 'Acesso total ao sistema' }
];

const skillOptions = [
  'Design', 'Marketing', 'Vendas', 'Atendimento', 'Organização',
  'Gestão', 'Social Media', 'Fotografia', 'Copywriting', 'Análise'
];

export default function TeamMemberModal({ isOpen, onClose, onSave, member, mode }: TeamMemberModalProps) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    role: 'member' as TeamMember['role'],
    skills: [] as string[],
    hourlyRate: '',
    skillInput: ''
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (member && (mode === 'edit' || mode === 'view')) {
      setFormData({
        name: member.name,
        email: member.email,
        role: member.role,
        skills: member.skills,
        hourlyRate: member.hourlyRate?.toString() || '',
        skillInput: ''
      });
    } else {
      setFormData({
        name: '',
        email: '',
        role: 'member',
        skills: [],
        hourlyRate: '',
        skillInput: ''
      });
    }
    setErrors({});
  }, [member, mode, isOpen]);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) newErrors.name = 'Nome é obrigatório';
    if (!formData.email.trim()) {
      newErrors.email = 'Email é obrigatório';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Email inválido';
    }

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

    const permissions = getPermissionsForRole(formData.role);

    const memberData: Partial<TeamMember> = {
      ...formData,
      permissions,
      hourlyRate: formData.hourlyRate ? parseFloat(formData.hourlyRate) : undefined,
      ...(mode === 'edit' && member ? { id: member.id } : {})
    };

    onSave(memberData);
    onClose();
  };

  const handleChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const getPermissionsForRole = (role: TeamMember['role']): string[] => {
    switch (role) {
      case 'admin':
        return ['all'];
      case 'manager':
        return ['manage_tasks', 'view_reports', 'manage_team'];
      case 'member':
        return ['view_tasks'];
      default:
        return ['view_tasks'];
    }
  };

  const handleSkillToggle = (skill: string) => {
    const currentSkills = formData.skills;
    if (currentSkills.includes(skill)) {
      handleChange('skills', currentSkills.filter(s => s !== skill));
    } else {
      handleChange('skills', [...currentSkills, skill]);
    }
  };

  const handleAddCustomSkill = () => {
    const skill = formData.skillInput.trim();
    if (skill && !formData.skills.includes(skill)) {
      handleChange('skills', [...formData.skills, skill]);
      handleChange('skillInput', '');
    }
  };

  const handleSkillInputKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddCustomSkill();
    }
  };

  const handleRemoveSkill = (skillToRemove: string) => {
    handleChange('skills', formData.skills.filter(skill => skill !== skillToRemove));
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" data-modal-active="true">
      <div className="modal-content bg-white rounded-xl shadow-2xl w-full max-w-2xl">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
              <User className="w-5 h-5 text-purple-600" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-900">
                {mode === 'create' ? 'Novo Membro' : mode === 'edit' ? 'Editar Membro' : 'Visualizar Membro'}
              </h2>
              <p className="text-sm text-gray-500">
                {mode === 'create' ? 'Adicione um novo membro à equipe' : 
                 mode === 'edit' ? 'Atualize as informações do membro' : 
                 'Informações do membro da equipe'}
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
              <label className="block text-sm font-medium text-gray-700 mb-2">Nome Completo *</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <User className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => handleChange('name', e.target.value)}
                  disabled={mode === 'view'}
                  className={`block w-full pl-10 pr-3 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors ${
                    errors.name ? 'border-red-300 bg-red-50' : 'border-gray-300'
                  } ${mode === 'view' ? 'bg-gray-50' : ''}`}
                  placeholder="Digite o nome completo"
                />
              </div>
              {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Email *</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleChange('email', e.target.value)}
                  disabled={mode === 'view'}
                  className={`block w-full pl-10 pr-3 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors ${
                    errors.email ? 'border-red-300 bg-red-50' : 'border-gray-300'
                  } ${mode === 'view' ? 'bg-gray-50' : ''}`}
                  placeholder="membro@email.com"
                />
              </div>
              {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email}</p>}
            </div>
          </div>

          {/* Role */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">Função</label>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {roles.map((role) => (
                <div
                  key={role.id}
                  onClick={() => mode !== 'view' && handleChange('role', role.id)}
                  className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                    formData.role === role.id 
                      ? 'border-blue-500 bg-blue-50' 
                      : 'border-gray-300 hover:border-gray-400'
                  } ${mode === 'view' ? 'pointer-events-none' : ''}`}
                >
                  <div className="flex items-center justify-center mb-3">
                    <Shield className={`w-8 h-8 ${formData.role === role.id ? 'text-blue-600' : 'text-gray-400'}`} />
                  </div>
                  <h4 className={`font-medium text-center ${formData.role === role.id ? 'text-blue-900' : 'text-gray-900'}`}>
                    {role.name}
                  </h4>
                  <p className="text-sm text-gray-500 text-center mt-1">{role.description}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Hourly Rate */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Valor por Hora (R$)</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <DollarSign className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="number"
                min="0"
                step="0.01"
                value={formData.hourlyRate}
                onChange={(e) => handleChange('hourlyRate', e.target.value)}
                disabled={mode === 'view'}
                className={`block w-full pl-10 pr-3 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors ${
                  mode === 'view' ? 'bg-gray-50 border-gray-300' : 'border-gray-300'
                }`}
                placeholder="Ex: 50.00"
              />
            </div>
          </div>

          {/* Skills */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">Habilidades</label>
            
            {/* Predefined Skills */}
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-4">
              {skillOptions.map((skill) => (
                <label
                  key={skill}
                  className={`flex items-center p-3 border rounded-lg cursor-pointer transition-colors ${
                    formData.skills.includes(skill)
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-300 hover:border-gray-400'
                  } ${mode === 'view' ? 'pointer-events-none' : ''}`}
                >
                  <input
                    type="checkbox"
                    checked={formData.skills.includes(skill)}
                    onChange={() => handleSkillToggle(skill)}
                    disabled={mode === 'view'}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <span className="ml-3 text-sm font-medium text-gray-900">{skill}</span>
                </label>
              ))}
            </div>

            {/* Custom Skill Input */}
            {mode !== 'view' && (
              <div className="flex space-x-2 mb-3">
                <input
                  type="text"
                  value={formData.skillInput}
                  onChange={(e) => handleChange('skillInput', e.target.value)}
                  onKeyDown={handleSkillInputKeyDown}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Adicionar habilidade personalizada"
                />
                <button
                  type="button"
                  onClick={handleAddCustomSkill}
                  className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors"
                >
                  <Star className="w-4 h-4" />
                </button>
              </div>
            )}

            {/* Selected Skills */}
            {formData.skills.length > 0 && (
              <div>
                <p className="text-sm text-gray-600 mb-2">Habilidades selecionadas:</p>
                <div className="flex flex-wrap gap-2">
                  {formData.skills.map((skill) => (
                    <span
                      key={skill}
                      className="inline-flex items-center px-3 py-1 text-sm bg-blue-100 text-blue-800 rounded-full"
                    >
                      {skill}
                      {mode !== 'view' && (
                        <button
                          type="button"
                          onClick={() => handleRemoveSkill(skill)}
                          className="ml-2 text-blue-600 hover:text-blue-800"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      )}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Permissions Preview */}
          <div className="bg-gray-50 rounded-lg p-4">
            <h5 className="font-medium text-gray-900 mb-2">Permissões da Função</h5>
            <div className="space-y-1 text-sm">
              {formData.role === 'admin' && (
                <>
                  <p className="text-green-600">✓ Acesso completo ao sistema</p>
                  <p className="text-green-600">✓ Gerenciar equipe e projetos</p>
                  <p className="text-green-600">✓ Ver todos os relatórios</p>
                </>
              )}
              {formData.role === 'manager' && (
                <>
                  <p className="text-green-600">✓ Gerenciar tarefas e projetos</p>
                  <p className="text-green-600">✓ Ver relatórios de equipe</p>
                  <p className="text-green-600">✓ Gerenciar membros</p>
                  <p className="text-gray-500">✗ Configurações do sistema</p>
                </>
              )}
              {formData.role === 'member' && (
                <>
                  <p className="text-green-600">✓ Ver e atualizar suas tarefas</p>
                  <p className="text-gray-500">✗ Gerenciar outros membros</p>
                  <p className="text-gray-500">✗ Ver relatórios completos</p>
                </>
              )}
            </div>
          </div>

          {/* Member info for view/edit mode */}
          {mode !== 'create' && member && (
            <div className="bg-gray-50 rounded-lg p-4">
              <h5 className="font-medium text-gray-900 mb-2">Informações do Membro</h5>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-gray-500">Membro desde:</span>
                  <span className="ml-2 text-gray-900">{member.createdAt.toLocaleDateString('pt-BR')}</span>
                </div>
                {member.lastActive && (
                  <div>
                    <span className="text-gray-500">Último acesso:</span>
                    <span className="ml-2 text-gray-900">{member.lastActive.toLocaleDateString('pt-BR')}</span>
                  </div>
                )}
                <div>
                  <span className="text-gray-500">Status:</span>
                  <span className={`ml-2 ${member.isActive ? 'text-green-600' : 'text-red-600'}`}>
                    {member.isActive ? 'Ativo' : 'Inativo'}
                  </span>
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
                className="flex-1 flex items-center justify-center px-4 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-medium transition-colors"
              >
                <Save className="w-4 h-4 mr-2" />
                {mode === 'create' ? 'Adicionar Membro' : 'Salvar Alterações'}
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}