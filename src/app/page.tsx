import React from 'react';
import Link from 'next/link';
import Navbar from '../components/Navbar';

export default function Home() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
        <div className="container mx-auto px-4 py-16 max-w-6xl">
          <div className="text-center space-y-8">
            <h1 className="text-5xl font-bold text-gray-900 mb-6">
              Planifiez votre prochain voyage avec l&apos;IA
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Découvrez des destinations uniques et créez des itinéraires personnalisés
              grâce à notre assistant de voyage intelligent.
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
              {/* Planification intelligente */}
              <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow">
                <h2 className="text-2xl font-semibold text-gray-800 mb-4">Planification intelligente</h2>
                <p className="text-gray-600">Notre IA vous aide à créer l&apos;itinéraire parfait en fonction de vos préférences.</p>
              </div>

              {/* Recommandations personnalisées */}
              <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow">
                <h2 className="text-2xl font-semibold text-gray-800 mb-4">Recommandations personnalisées</h2>
                <p className="text-gray-600">Découvrez des lieux uniques adaptés à vos intérêts et votre style de voyage.</p>
              </div>

              {/* Organisation simplifiée */}
              <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow">
                <h2 className="text-2xl font-semibold text-gray-800 mb-4">Organisation simplifiée</h2>
                <p className="text-gray-600">Gérez facilement vos réservations et votre planning de voyage.</p>
              </div>
            </div>

            <div className="mt-12">
              <Link 
                href="/auth/login"
                className="inline-block bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors mr-4"
              >
                Commencer
              </Link>
              <Link 
                href="/destinations"
                className="inline-block bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold border-2 border-blue-600 hover:bg-blue-50 transition-colors"
              >
                Explorer les destinations
              </Link>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
