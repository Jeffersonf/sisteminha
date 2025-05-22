import React, { useEffect, useState } from 'react';
import { Plus, User, Edit, Trash2 } from 'lucide-react';
import { format } from 'date-fns';
import { supabase } from '../lib/supabase';
import type { Resident } from '../types/database';
import ResidentForm from '../components/ResidentForm';

const Residents = () => {
  const [residents, setResidents] = useState<Resident[]>([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedResident, setSelectedResident] = useState<Resident | undefined>();

  useEffect(() => {
    fetchResidents();
  }, []);

  const fetchResidents = async () => {
    const { data, error } = await supabase
      .from('residents')
      .select(`
        *,
        residences (
          street,
          number,
          neighborhood
        )
      `)
      .order('full_name', { ascending: true });

    if (error) {
      console.error('Error fetching residents:', error);
      return;
    }

    setResidents(data);
  };

  const handleSubmit = async (data: Resident) => {
    const { error } = selectedResident
      ? await supabase
          .from('residents')
          .update(data)
          .eq('id', selectedResident.id)
      : await supabase
          .from('residents')
          .insert([data]);

    if (error) {
      console.error('Error saving resident:', error);
      return;
    }

    setIsFormOpen(false);
    setSelectedResident(undefined);
    fetchResidents();
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Tem certeza que deseja excluir este residente?')) return;

    const { error } = await supabase
      .from('residents')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error deleting resident:', error);
      return;
    }

    fetchResidents();
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Residentes</h1>
        <button
          onClick={() => {
            setSelectedResident(undefined);
            setIsFormOpen(true);
          }}
          className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
        >
          <Plus className="w-4 h-4" />
          Novo Residente
        </button>
      </div>

      {isFormOpen ? (
        <div className="bg-white shadow-sm rounded-lg p-6">
          <ResidentForm
            resident={selectedResident}
            onSubmit={handleSubmit}
          />
        </div>
      ) : (
        <div className="bg-white shadow-sm rounded-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Nome
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Data de Nascimento
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    CPF
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Cartão SUS
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Residência
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Ações
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {residents.map((resident) => (
                  <tr key={resident.id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <User className="w-4 h-4 text-gray-400 mr-2" />
                        <div className="text-sm text-gray-900">{resident.full_name}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {format(new Date(resident.birth_date), 'dd/MM/yyyy')}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {resident.cpf}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {resident.sus_card}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {resident.residences ? (
                        `${resident.residences.street}, ${resident.residences.number} - ${resident.residences.neighborhood}`
                      ) : (
                        'Sem residência'
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button
                        onClick={() => {
                          setSelectedResident(resident);
                          setIsFormOpen(true);
                        }}
                        className="text-blue-600 hover:text-blue-900 mr-4"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(resident.id)}
                        className="text-red-600 hover:text-red-900"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default Residents;