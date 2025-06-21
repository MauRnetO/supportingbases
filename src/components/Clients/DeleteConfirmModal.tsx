import React from 'react';
import { AlertTriangle, X, Trash2 } from 'lucide-react';
import { Client } from '../../types';

interface DeleteConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  client: Client | null;
}

export default function DeleteConfirmModal({ isOpen, onClose, onConfirm, client }: DeleteConfirmModalProps) {
  if (!isOpen || !client) return null;

  return (
    <div className="modal-overlay" data-modal-active="true">
      <div className="modal-content bg-white rounded-xl shadow-2xl w-full max-w-md">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
              <AlertTriangle className="w-5 h-5 text-red-600" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-900">Confirmar Exclusão</h2>
              <p className="text-sm text-gray-500">Esta ação não pode ser desfeita</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="w-5 h-5 text-gray-400" />
          </button>
        </div>

        <div className="p-6">
          <div className="mb-6">
            <p className="text-gray-700 mb-4">
              Tem certeza que deseja excluir o cliente <strong>{client.name}</strong>?
            </p>
            
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <div className="flex items-start space-x-3">
                <AlertTriangle className="w-5 h-5 text-yellow-600 mt-0.5" />
                <div className="text-sm text-yellow-800">
                  <p className="font-medium mb-1">Atenção:</p>
                  <ul className="list-disc list-inside space-y-1">
                    <li>Todos os agendamentos deste cliente serão mantidos</li>
                    <li>O histórico de agendamentos permanecerá no sistema</li>
                    <li>Esta ação não pode ser desfeita</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          <div className="flex space-x-3">
            <button
              onClick={onClose}
              className="flex-1 px-4 py-3 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg font-medium transition-colors"
            >
              Cancelar
            </button>
            <button
              onClick={onConfirm}
              className="flex-1 flex items-center justify-center px-4 py-3 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium transition-colors"
            >
              <Trash2 className="w-4 h-4 mr-2" />
              Excluir Cliente
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}