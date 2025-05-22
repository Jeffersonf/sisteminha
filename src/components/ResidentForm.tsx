import React from 'react';
import { useForm } from 'react-hook-form';
import { supabase } from '../lib/supabase';
import type { Resident, Residence } from '../types/database';

interface ResidentFormProps {
  resident?: Resident;
  onSubmit: (data: Resident) => void;
}

const ResidentForm: React.FC<ResidentFormProps> = ({ resident, onSubmit }) => {
  const [residences, setResidences] = React.useState<Residence[]>([]);

  React.useEffect(() => {
    fetchResidences();
  }, []);

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

  const { register, handleSubmit } = useForm<Resident>({
    defaultValues: resident || {
      full_name: '',
      birth_date: '',
      cpf: '',
      sus_card: '',
      primary_phone: '',
      secondary_phone: '',
      notes: '',
    },
  });

  const onSubmitForm = async (data: Resident) => {
    onSubmit(data);
  };

  return (
    <form onSubmit={handleSubmit(onSubmitForm)} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label htmlFor="full_name" className="block text-sm font-medium text-gray-700">
            Nome Completo
          </label>
          <input
            type="text"
            id="full_name"
            {...register('full_name')}
            required
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
        </div>

        <div>
          <label htmlFor="birth_date" className="block text-sm font-medium text-gray-700">
            Data de Nascimento
          </label>
          <input
            type="date"
            id="birth_date"
            {...register('birth_date')}
            required
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
        </div>

        <div>
          <label htmlFor="cpf" className="block text-sm font-medium text-gray-700">
            CPF
          </label>
          <input
            type="text"
            id="cpf"
            {...register('cpf')}
            placeholder="000.000.000-00"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
        </div>

        <div>
          <label htmlFor="sus_card" className="block text-sm font-medium text-gray-700">
            Cartão SUS
          </label>
          <input
            type="text"
            id="sus_card"
            {...register('sus_card')}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
        </div>

        <div>
          <label htmlFor="primary_phone" className="block text-sm font-medium text-gray-700">
            Telefone Principal
          </label>
          <input
            type="tel"
            id="primary_phone"
            {...register('primary_phone')}
            placeholder="(00) 00000-0000"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
        </div>

        <div>
          <label htmlFor="secondary_phone" className="block text-sm font-medium text-gray-700">
            Telefone Secundário
          </label>
          <input
            type="tel"
            id="secondary_phone"
            {...register('secondary_phone')}
            placeholder="(00) 00000-0000"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
        </div>

        <div>
          <label htmlFor="residence_id" className="block text-sm font-medium text-gray-700">
            Residência
          </label>
          <select
            id="residence_id"
            {...register('residence_id')}
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

export default ResidentForm;