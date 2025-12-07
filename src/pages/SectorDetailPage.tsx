import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useApp } from '../contexts/AppContext';
import { Header } from '../components/ui/Header';
import { BedGrid } from '../components/BedGrid';
import { Patient } from '../types';
export function SectorDetailPage() {
  const {
    id
  } = useParams<{
    id: string;
  }>();
  const navigate = useNavigate();
  const {
    sectors,
    getSectorPatients
  } = useApp();
  const sector = sectors.find(s => s.id === id);
  const patients = sector ? getSectorPatients(sector.id) : [];
  if (!sector) {
    return <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-gray-600">Sector no encontrado</p>
      </div>;
  }
  const handleBedClick = (bed: number, patient?: Patient) => {
    if (patient) {
      navigate(`/patient/${patient.id}`);
    } else {
      navigate(`/patient/new?sectorId=${sector.id}&bed=${bed}`);
    }
  };
  return <div className="min-h-screen bg-gray-50">
      <Header title={sector.name} showBack />

      <main className="max-w-2xl mx-auto p-4">
        <BedGrid totalBeds={sector.beds} patients={patients} onBedClick={handleBedClick} />
      </main>
    </div>;
}