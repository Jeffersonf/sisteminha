import React, { useEffect, useState } from 'react';
import { Plus, Calendar, Edit, Trash2 } from 'lucide-react';
import { format } from 'date-fns';
import { supabase } from '../lib/supabase';
import type { Visit } from '../types/database';
import VisitForm from '../components/VisitForm';

const Visits = () => {
  const [visits, setVisits] = useState<Visit[]>([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedVisit, setSelectedVisit] = useState<Visit | undefined>();

  useEffect(() => {
    fetchVisits();
  }, []);

  const fetchVisits = async () => {
    const { data, error } = await supabase
      .from('visits')
      .select(`
        *,
        residences (
          street,
          number,
          neighborhood
        ),
        residents (
          full_name
        )
      `)
      .order('visit_date', { ascending: false });

    if (error) {
      console.error('Error fetching visits:', error);
      return;
    }

    setVisits(data);
  };

  const handleSubmit = async (data: Visit) => {
    const { error } = selectedVisit
      ? await supabase
          .from('visits')
          .update(data)
          .eq('id', selectedVisit.id)
      : await supabase
          .from('visits')
          .insert([data]);

    if (error) {
      console.error('Error saving visit:', error);
      return;
    }

    setIsFormOpen(false);
    setSelectedVisit(undefined);
    fetchVisits();
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Tem certeza que deseja excluir esta visita?')) return;

    const { error } = await supabase
      .from('visits')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error deleting visit:', error);
      return;
    }

    fetchVisits();
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Visitas</h1>
        <button
          onClick={() => {
            setSelectedVisit(undefined);
            setIsFormOpen(true);
          }}
          className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
        >
          <Plus className="w-4 h-4" />
          Nova Visita
        </button>
      </div>

      {isFormOpen ? (
        <div className="bg-white shadow-sm rounded-lg p-6">
          <VisitForm
            visit={selectedVisit}
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
                    Data
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Residência
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Residente Contatado
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Motivo
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Ações
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {visits.map((visit) => (
                  <tr key={visit.id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <Calendar className="w-4 h-4 text-gray-400 mr-2" />
                        <div className="text-sm text-gray-900">
                          {format(new Date(visit.visit_date), 'dd/MM/yyyy HH:mm')}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {visit.residences && (
                        `${visit.residences.street}, ${visit.residences.number} - ${visit.residences.neighborhood}`
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {visit.residents?.full_name || 'Não especificado'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {visit.reason}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button
                        onClick={() => {
                          setSelectedVisit(visit);
                          setIsFormOpen(true);
                        }}
                        className="text-blue-600 hover:text-blue-900 mr-4"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(visit.id)}
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

export default Visits;