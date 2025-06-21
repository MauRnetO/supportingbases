import { useState, useEffect } from 'react';
import { Appointment } from '../types';
import { useLocalStorage } from '../../core/hooks/useLocalStorage';

export function useAppointments() {
  const [appointments, setAppointments] = useLocalStorage<Appointment[]>('appointments', []);
  const [loading, setLoading] = useState(false);

  const createAppointment = async (appointmentData: Partial<Appointment>) => {
    setLoading(true);
    try {
      const newAppointment: Appointment = {
        id: Date.now().toString(),
        ...appointmentData as Appointment,
      };
      setAppointments(prev => [...prev, newAppointment]);
      return newAppointment;
    } finally {
      setLoading(false);
    }
  };

  const updateAppointment = async (id: string, updates: Partial<Appointment>) => {
    setLoading(true);
    try {
      setAppointments(prev => 
        prev.map(apt => apt.id === id ? { ...apt, ...updates } : apt)
      );
    } finally {
      setLoading(false);
    }
  };

  const deleteAppointment = async (id: string) => {
    setLoading(true);
    try {
      setAppointments(prev => prev.filter(apt => apt.id !== id));
    } finally {
      setLoading(false);
    }
  };

  return {
    appointments,
    loading,
    createAppointment,
    updateAppointment,
    deleteAppointment,
  };
}