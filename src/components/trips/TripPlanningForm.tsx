import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useRouter } from 'next/navigation';

interface TripFormData {
  destination: string;
  startDate: string;
  endDate: string;
  preferences: string[];
  budget: string;
  travelStyle: string;
  additionalNotes: string;
}

const travelStyles = [
  'Détente',
  'Aventure',
  'Culture',
  'Gastronomie',
  'Nature',
  'Shopping',
];

const budgetRanges = [
  'Économique (< 500€)',
  'Modéré (500€ - 1000€)',
  'Confort (1000€ - 2000€)',
  'Luxe (> 2000€)',
];

const preferences = [
  'Musées',
  'Plages',
  'Randonnées',
  'Restaurants',
  'Vie nocturne',
  'Sites historiques',
  'Parcs',
  'Sports',
  'Spa & Bien-être',
];

export default function TripPlanningForm() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [aiSuggestions, setAiSuggestions] = useState<string>('');
  
  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<TripFormData>();

  const onSubmit = async (data: TripFormData) => {
    setIsLoading(true);
    try {
      // First, get AI suggestions
      const suggestionsResponse = await fetch('/api/ai/trip-suggestions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });
      
      const suggestionsData = await suggestionsResponse.json();
      setAiSuggestions(suggestionsData.suggestions);

      // Then, save the trip
      const saveResponse = await fetch('/api/trips', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...data,
          aiSuggestions: suggestionsData.suggestions,
        }),
      });

      if (saveResponse.ok) {
        router.push('/trips');
      }
    } catch (error) {
      console.error('Error creating trip:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        {/* Destination */}
        <div>
          <label htmlFor="destination" className="block text-sm font-medium text-gray-700">
            Destination
          </label>
          <input
            type="text"
            id="destination"
            {...register('destination', { required: true })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            placeholder="Paris, France"
          />
          {errors.destination && (
            <p className="mt-1 text-sm text-red-600">La destination est requise</p>
          )}
        </div>

        {/* Travel Style */}
        <div>
          <label htmlFor="travelStyle" className="block text-sm font-medium text-gray-700">
            Style de voyage
          </label>
          <select
            id="travelStyle"
            {...register('travelStyle', { required: true })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          >
            <option value="">Sélectionnez un style</option>
            {travelStyles.map((style) => (
              <option key={style} value={style}>
                {style}
              </option>
            ))}
          </select>
          {errors.travelStyle && (
            <p className="mt-1 text-sm text-red-600">Le style de voyage est requis</p>
          )}
        </div>

        {/* Start Date */}
        <div>
          <label htmlFor="startDate" className="block text-sm font-medium text-gray-700">
            Date de début
          </label>
          <input
            type="date"
            id="startDate"
            {...register('startDate', { required: true })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
          {errors.startDate && (
            <p className="mt-1 text-sm text-red-600">La date de début est requise</p>
          )}
        </div>

        {/* End Date */}
        <div>
          <label htmlFor="endDate" className="block text-sm font-medium text-gray-700">
            Date de fin
          </label>
          <input
            type="date"
            id="endDate"
            {...register('endDate', { required: true })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
          {errors.endDate && (
            <p className="mt-1 text-sm text-red-600">La date de fin est requise</p>
          )}
        </div>

        {/* Budget */}
        <div>
          <label htmlFor="budget" className="block text-sm font-medium text-gray-700">
            Budget
          </label>
          <select
            id="budget"
            {...register('budget', { required: true })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          >
            <option value="">Sélectionnez un budget</option>
            {budgetRanges.map((range) => (
              <option key={range} value={range}>
                {range}
              </option>
            ))}
          </select>
          {errors.budget && (
            <p className="mt-1 text-sm text-red-600">Le budget est requis</p>
          )}
        </div>
      </div>

      {/* Preferences */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Préférences de voyage
        </label>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {preferences.map((pref) => (
            <div key={pref} className="flex items-center">
              <input
                type="checkbox"
                id={`pref-${pref}`}
                value={pref}
                {...register('preferences')}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label
                htmlFor={`pref-${pref}`}
                className="ml-2 block text-sm text-gray-700"
              >
                {pref}
              </label>
            </div>
          ))}
        </div>
      </div>

      {/* Additional Notes */}
      <div>
        <label htmlFor="additionalNotes" className="block text-sm font-medium text-gray-700">
          Notes supplémentaires
        </label>
        <textarea
          id="additionalNotes"
          {...register('additionalNotes')}
          rows={4}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          placeholder="Ajoutez des détails supplémentaires sur vos attentes..."
        />
      </div>

      {/* AI Suggestions Display */}
      {aiSuggestions && (
        <div className="mt-6 p-4 bg-blue-50 rounded-lg">
          <h3 className="text-lg font-medium text-blue-900 mb-2">
            Suggestions de l'IA
          </h3>
          <div className="text-blue-700 whitespace-pre-line">
            {aiSuggestions}
          </div>
        </div>
      )}

      {/* Submit Button */}
      <div className="flex justify-end">
        <button
          type="submit"
          disabled={isLoading}
          className={`inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${
            isLoading ? 'opacity-50 cursor-not-allowed' : ''
          }`}
        >
          {isLoading ? 'Création en cours...' : 'Créer le voyage'}
        </button>
      </div>
    </form>
  );
}
