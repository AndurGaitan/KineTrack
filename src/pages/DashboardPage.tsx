import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../contexts/AppContext';
import { Header } from '../components/ui/Header';
import { Badge } from '../components/ui/Badge';
import { FAB } from '../components/ui/FAB';
import { SectorCard } from '../components/SectorCard';
export function DashboardPage() {
  const navigate = useNavigate();
  const {
    user,
    sectors,
    patients
  } = useApp();
  const getSectorPatientCount = (sectorId: string) => {
    return patients.filter(p => p.sectorId === sectorId).length;
  };
  return <div className="min-h-screen bg-gray-50">
      <Header title={`Hola, ${user?.name || 'Usuario'}`} action={<Badge>DEMO</Badge>} />

      <main className="max-w-2xl mx-auto p-4 pb-24">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Sectores UCI</h2>

        <div className="space-y-4">
          {sectors.map(sector => <SectorCard key={sector.id} sector={sector} patientCount={getSectorPatientCount(sector.id)} onClick={() => navigate(`/sector/${sector.id}`)} />)}
        </div>
      </main>

      <FAB onClick={() => navigate('/patient/new')} label="Nuevo Paciente" />
    </div>;
}