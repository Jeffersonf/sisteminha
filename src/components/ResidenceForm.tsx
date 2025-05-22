import React, { useEffect, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import { Loader } from '@googlemaps/js-api-loader';
import { supabase } from '../lib/supabase';
import type { Residence } from '../types/database';

interface ResidenceFormProps {
  residence?: Residence;
  onSubmit: (data: Residence) => void;
}

const ResidenceForm: React.FC<ResidenceFormProps> = ({ residence, onSubmit }) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const [map, setMap] = useState<google.maps.Map | null>(null);
  const [marker, setMarker] = useState<google.maps.Marker | null>(null);

  const { register, handleSubmit, setValue, watch } = useForm<Residence>({
    defaultValues: residence || {
      street: '',
      number: '',
      complement: '',
      neighborhood: '',
      city: '',
      state: '',
      postal_code: '',
      reference_point: '',
    },
  });

  useEffect(() => {
    const loader = new Loader({
      apiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY || 'AIzaSyCwvqhzA2faV6DTHhLggZ2NrsY4EVF8cQg',
      version: 'weekly',
      libraries: ['places'],
    });

    loader.load().then(() => {
      if (!mapRef.current) return;

      const initialPosition = residence?.latitude && residence?.longitude
        ? { lat: residence.latitude, lng: residence.longitude }
        : { lat: -23.5505, lng: -46.6333 }; // São Paulo

      const mapInstance = new google.maps.Map(mapRef.current, {
        center: initialPosition,
        zoom: 15,
      });

      const markerInstance = new google.maps.Marker({
        position: initialPosition,
        map: mapInstance,
        draggable: true,
      });

      google.maps.event.addListener(markerInstance, 'dragend', () => {
        const position = markerInstance.getPosition();
        if (position) {
          setValue('latitude', position.lat());
          setValue('longitude', position.lng());
        }
      });

      setMap(mapInstance);
      setMarker(markerInstance);

      // Initialize Places Autocomplete
      const input = document.getElementById('street') as HTMLInputElement;
      const autocomplete = new google.maps.places.Autocomplete(input, {
        types: ['address'],
      });

      autocomplete.addListener('place_changed', () => {
        const place = autocomplete.getPlace();
        if (!place.geometry?.location) return;

        mapInstance.setCenter(place.geometry.location);
        markerInstance.setPosition(place.geometry.location);
        setValue('latitude', place.geometry.location.lat());
        setValue('longitude', place.geometry.location.lng());
      });
    });
  }, [residence]);

  const onSubmitForm = async (data: Residence) => {
    onSubmit(data);
  };

  return (
    <form onSubmit={handleSubmit(onSubmitForm)} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label htmlFor="street" className="block text-sm font-medium text-gray-700">
            Rua
          </label>
          <input
            type="text"
            id="street"
            {...register('street')}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
        </div>

        <div>
          <label htmlFor="number" className="block text-sm font-medium text-gray-700">
            Número
          </label>
          <input
            type="text"
            id="number"
            {...register('number')}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
        </div>

        <div>
          <label htmlFor="complement" className="block text-sm font-medium text-gray-700">
            Complemento
          </label>
          <input
            type="text"
            id="complement"
            {...register('complement')}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
        </div>

        <div>
          <label htmlFor="neighborhood" className="block text-sm font-medium text-gray-700">
            Bairro
          </label>
          <input
            type="text"
            id="neighborhood"
            {...register('neighborhood')}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
        </div>

        <div>
          <label htmlFor="city" className="block text-sm font-medium text-gray-700">
            Cidade
          </label>
          <input
            type="text"
            id="city"
            {...register('city')}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
        </div>

        <div>
          <label htmlFor="state" className="block text-sm font-medium text-gray-700">
            Estado
          </label>
          <input
            type="text"
            id="state"
            {...register('state')}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
        </div>

        <div>
          <label htmlFor="postal_code" className="block text-sm font-medium text-gray-700">
            CEP
          </label>
          <input
            type="text"
            id="postal_code"
            {...register('postal_code')}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
        </div>

        <div>
          <label htmlFor="reference_point" className="block text-sm font-medium text-gray-700">
            Ponto de Referência
          </label>
          <input
            type="text"
            id="reference_point"
            {...register('reference_point')}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
        </div>
      </div>

      <div className="h-96 w-full mt-6">
        <div ref={mapRef} className="h-full w-full rounded-lg"></div>
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

export default ResidenceForm;