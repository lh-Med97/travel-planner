'use client';

import React from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { TripFormData } from '@/types/trip';

interface TripFormProps {
  onSubmit: (data: TripFormData) => void;
  initialData?: TripFormData;
  isLoading?: boolean;
}

export default function TripForm({ onSubmit, initialData, isLoading = false }: TripFormProps) {
  const { register, control, handleSubmit, formState: { errors } } = useForm<TripFormData>({
    defaultValues: initialData || {
      title: '',
      startDate: '',
      endDate: '',
      destinations: [{ name: '', description: '', date: '' }]
    }
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'destinations'
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div>
        <label htmlFor="title" className="block text-sm font-medium text-gray-700">
          Titre du voyage
        </label>
        <input
          type="text"
          {...register('title', { required: 'Le titre est requis' })}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
        />
        {errors.title && (
          <p className="mt-1 text-sm text-red-600">{errors.title.message}</p>
        )}
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <div>
          <label htmlFor="startDate" className="block text-sm font-medium text-gray-700">
            Date de début
          </label>
          <input
            type="date"
            {...register('startDate', { required: 'La date de début est requise' })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
          {errors.startDate && (
            <p className="mt-1 text-sm text-red-600">{errors.startDate.message}</p>
          )}
        </div>

        <div>
          <label htmlFor="endDate" className="block text-sm font-medium text-gray-700">
            Date de fin
          </label>
          <input
            type="date"
            {...register('endDate', { required: 'La date de fin est requise' })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
          {errors.endDate && (
            <p className="mt-1 text-sm text-red-600">{errors.endDate.message}</p>
          )}
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-medium text-gray-900">Destinations</h3>
          <button
            type="button"
            onClick={() => append({ name: '', description: '', date: '' })}
            className="inline-flex items-center px-3 py-1.5 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
          >
            Ajouter une destination
          </button>
        </div>

        {fields.map((field, index) => (
          <div key={field.id} className="border rounded-lg p-4 space-y-4">
            <div className="flex justify-between items-center">
              <h4 className="text-sm font-medium text-gray-700">Destination {index + 1}</h4>
              {fields.length > 1 && (
                <button
                  type="button"
                  onClick={() => remove(index)}
                  className="text-red-600 hover:text-red-800"
                >
                  Supprimer
                </button>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Nom de la destination
              </label>
              <input
                type="text"
                {...register(`destinations.${index}.name` as const, { required: 'Le nom est requis' })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
              {errors.destinations?.[index]?.name && (
                <p className="mt-1 text-sm text-red-600">{errors.destinations[index]?.name?.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Description
              </label>
              <textarea
                {...register(`destinations.${index}.description` as const)}
                rows={3}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Date de visite
              </label>
              <input
                type="date"
                {...register(`destinations.${index}.date` as const, { required: 'La date est requise' })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
              {errors.destinations?.[index]?.date && (
                <p className="mt-1 text-sm text-red-600">{errors.destinations[index]?.date?.message}</p>
              )}
            </div>
          </div>
        ))}
      </div>

      <div className="flex justify-end">
        <button
          type="submit"
          disabled={isLoading}
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? 'Enregistrement...' : 'Enregistrer le voyage'}
        </button>
      </div>
    </form>
  );
}
