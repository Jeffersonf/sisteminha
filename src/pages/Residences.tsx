import React, { useEffect, useState } from 'react';
import { Plus, MapPin, Edit, Trash2 } from 'lucide-react';
import { supabase } from '../lib/supabase';
import type { Residence } from '../types/database';
import ResidenceForm from '../components/ResidenceForm';

const Residences = () => {
  const [residences, setResidences] = useState<Residence[]>([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedResidence, setSelectedResidence] = useState<Residence | undefined>();

  useEffect(() => {
    fetchResidences();
  }, []);

  const fetchResidences = async () => {
    const { data, error } = await supabase
      .from('residences')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching residences:', error);
      return;
    }

    setResidences(data);
  };

  const handleSubmit = async (data: Residence) => {
    const { error } = selectedResidence
      ? await supabase
          .from('residences')
          .update(data)
          .eq('id', selectedResidence.id)
      : await supabase
          .from('residences')
          .insert([data]);

    if (error) {
      console.error('Error saving residence:', error);
      return;
    }

    setIsFormOpen(false);
    setSelectedResidence(undefined);
    fetchResidences();
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Tem certeza que deseja excluir esta residência?')) return;

    const { error } = await supabase
      .from('residences')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error deleting residence:', error);
      return;
    }

    fetchResidences();
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Residências</h1>
        <button
          onClick={() => {
            setSelectedResidence(undefined);
            setIsFormOpen(true);
          }}
          className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
        >
          <Plus className="w-4 h-4" />
          Nova Residência
        </button>
      </div>

      {isFormOpen ? (
        <div className="bg-white shadow-sm rounded-lg p-6">
          <ResidenceForm
            residence={selectedResidence}
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
                    Endereço
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Bairro
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Cidade/Estado
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Ações
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {residences.map((residence) => (
                  <tr key={residence.id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <MapPin className="w-4 h-4 text-gray-400 mr-2" />
                        <div className="text-sm text-gray-900">
                          {residence.street}, {residence.number}
                          {residence.complement && ` - ${residence.complement}`}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {residence.neighborhood}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {residence.city}/{residence.state}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button
                        onClick={() => {
                          setSelectedResidence(residence);
                          setIsFormOpen(true);
                        }}
                        className="text-blue-600 hover:text-blue-900 mr-4"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(residence.id)}
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

export default Residences;