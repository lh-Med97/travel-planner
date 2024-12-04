'use client';

import React from 'react';
import Link from 'next/link';
import { useSession, signOut } from 'next-auth/react';

const Navbar = () => {
  const { data: session } = useSession();

  return (
    <nav className="bg-white shadow-md">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <Link href="/" className="text-xl font-bold text-blue-600">
            Travel Planner
          </Link>
          
          <div className="flex items-center space-x-4">
            <Link href="/destinations" className="text-gray-600 hover:text-blue-600">
              Destinations
            </Link>
            {session ? (
              <>
                <Link href="/trips" className="text-gray-600 hover:text-blue-600">
                  Mes Voyages
                </Link>
                <Link href="/profile" className="text-gray-600 hover:text-blue-600">
                  Profile
                </Link>
                <button
                  onClick={() => signOut()}
                  className="text-gray-600 hover:text-blue-600"
                >
                  Déconnexion
                </button>
              </>
            ) : (
              <>
                <Link
                  href="/auth/login"
                  className="text-gray-600 hover:text-blue-600"
                >
                  Connexion
                </Link>
                <Link
                  href="/auth/register"
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
                >
                  S'inscrire
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
