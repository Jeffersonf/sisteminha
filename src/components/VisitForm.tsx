import React from 'react';
import { useForm } from 'react-hook-form';
import { format } from 'date-fns';
import { supabase } from '../lib/supabase';
import type { Visit, Residence, Resident } from '../types/database';

interface VisitFormProps {
  visit?: Visit;
  onSubmit: (data: Visit) => void;
}

const VisitForm: React.FC<VisitFormProps> = ({ visit, onSubmit }) => {
  const [residences, setResidences] = React.useState<Residence[]>([]);
  const [residents, setResidents] = React.useState<Resident[]>([]);
  const [selectedResidenceId, setSelectedResidenceId] = React.useState<string>('');

  React.useEffect(() => {
    fetchResidences();
  }, []);

  React.useEffect(() => {
    if (selectedResidenceId) {
      fetchResidents(selectedResidenceId);
    }
  }, [selectedResidenceId]);

  const fetchResidences = async () => {
    const { data, error } = await supabase
      .from('residences')
      .select('*')
      .order('street', { ascending: true });

    if (error) {
      console.error('Error fetching residences:', error);
      return;
    }

    setResidences(data || []);
  };

  const fetchResidents = async (residenceId: string) => {
    const { data, error } = await supabase
      .from('residents')
      .select('*')
      .eq('residence_id', residenceId)
      .order('full_name', { ascending: true });

    if (error) {
      console.error('Error fetching residents:', error);
      return;
    }

    setResidents(data || []);
  };

  const { register, handleSubmit, watch } = useForm<Visit>({
    defaultValues: visit || {
      visit_date: format(new Date(), "yyyy-MM-dd'T'HH:mm"),
      reason: '',
      notes: '',
    },
  });

  const watchResidenceId = watch('residence_id');

  React.useEffect(() => {
    if (watchResidenceId !== selectedResidenceId) {
      setSelectedResidenceId(watchResidenceId);
    }
  }, [watchResidenceId]);

  const onSubmitForm = async (data: Visit) => {
    onSubmit(data);
  };

  return (
    <form onSubmit={handleSubmit(onSubmitForm)} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label htmlFor="residence_id" className="block text-sm font-medium text-gray-700">
            Residência
          </label>
          <select
            id="residence_id"
            {...register('residence_id')}
            required
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          >
            <option value="">Selecione uma residência</option>
            {residences.map((residence) => (
              <option key={residence.id} value={residence.id}>
                {residence.street}, {residence.number} - {residence.neighborhood}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="resident_id" className="block text-sm font-medium text-gray-700">
            Residente Contatado
          </label>
          <select
            id="resident_id"
            {...register('resident_id')}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          >
            <option value="">Selecione um residente</option>
            {residents.map((resident) => (
              <option key={resident.id} value={resident.id}>
                {resident.full_name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="visit_date" className="block text-sm font-medium text-gray-700">
            Data e Hora da Visita
          </label>
          <input
            type="datetime-local"
            id="visit_date"
            {...register('visit_date')}
            required
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
        </div>

        <div>
          <label htmlFor="reason" className="block text-sm font-medium text-gray-700">
            Motivo da Visita
          </label>
          <input
            type="text"
            id="reason"
            {...register('reason')}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
        </div>

        <div className="col-span-2">
          <label htmlFor="notes" className="block text-sm font-medium text-gray-700">
            Observações
          </label>
          <textarea
            id="notes"
            {...register('notes')}
            rows={3}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
        </div>
      </div>

      <div className="flex justify-end">
        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          Salvar
        </button>
      </div>
    </form>
  );
};

export default VisitForm;