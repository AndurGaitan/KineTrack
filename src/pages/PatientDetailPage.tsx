import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useApp } from '../contexts/AppContext';
import { Header } from '../components/ui/Header';
import { Card } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { ScoreHistoryList } from '../components/ScoreHistoryList';
import { EditIcon, BedDoubleIcon, ActivityIcon, WindIcon, DropletIcon } from 'lucide-react';
const supportTypeLabels = {
  imv: 'VMI',
  niv: 'VNI',
  hfnc: 'HFNC',
  'conventional-oxygen': 'O₂ Convencional',
  'room-air': 'Aire Ambiente'
};
const supportTypeFullLabels = {
  imv: 'Ventilación Mecánica Invasiva',
  niv: 'Ventilación No Invasiva',
  hfnc: 'Cánula Nasal de Alto Flujo',
  'conventional-oxygen': 'Oxígeno Convencional',
  'room-air': 'Aire Ambiente'
};
export function PatientDetailPage() {
  const {
    id
  } = useParams<{
    id: string;
  }>();
  const navigate = useNavigate();
  const {
    patients,
    sectors,
    getPatientScores,
    getPatientVMIRecords,
    getPatientNIVRecords,
    getPatientHFNCRecords
  } = useApp();
  const patient = patients.find(p => p.id === id);
  const sector = patient ? sectors.find(s => s.id === patient.sectorId) : null;
  const scores = patient ? getPatientScores(patient.id) : [];
  const vmiRecords = patient ? getPatientVMIRecords(patient.id) : [];
  const nivRecords = patient ? getPatientNIVRecords(patient.id) : [];
  const hfncRecords = patient ? getPatientHFNCRecords(patient.id) : [];
  if (!patient || !sector) {
    return <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-gray-600">Paciente no encontrado</p>
      </div>;
  }
  const supportType = patient.supportType;
  return <div className="min-h-screen bg-gray-50">
      <Header title={patient.alias} showBack showPatientList sectorId={sector.id} action={<button onClick={() => navigate(`/patient/${patient.id}/edit`)} className="p-2 active:bg-gray-100 rounded-lg transition-colors" aria-label="Editar">
            <EditIcon className="w-5 h-5" />
          </button>} />

      <main className="max-w-2xl mx-auto p-4 space-y-6">
        <Card>
          <div className="space-y-4">
            <div className="flex items-start justify-between">
              <div>
                <div className="text-sm text-gray-600 mb-1">Ubicación</div>
                <div className="flex items-center gap-2 text-lg font-medium text-gray-900">
                  <BedDoubleIcon className="w-5 h-5" />
                  {sector.name} - Cama {patient.bed}
                </div>
              </div>
              <Badge variant="support" type={patient.supportType}>
                {supportTypeLabels[patient.supportType]}
              </Badge>
            </div>
          </div>
        </Card>

        {/* IMV Module */}
        {supportType === 'imv' && <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200">
            <div className="flex items-start justify-between mb-4">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <ActivityIcon className="w-6 h-6 text-blue-600" />
                  <h3 className="text-lg font-bold text-gray-900">
                    Monitorización Avanzada VMI
                  </h3>
                </div>
                <p className="text-sm text-gray-700">
                  Herramienta de nivel experto para{' '}
                  {supportTypeFullLabels[supportType]}
                </p>
                {vmiRecords.length > 0 && <p className="text-sm text-blue-700 mt-2 font-medium">
                    {vmiRecords.length} registro
                    {vmiRecords.length > 1 ? 's' : ''} de monitorización
                  </p>}
              </div>
            </div>
            <Button onClick={() => navigate(`/patient/${patient.id}/vmi`)} className="w-full bg-blue-600">
              Acceder a Monitorización VMI
            </Button>
          </Card>}

        {/* NIV Module */}
        {supportType === 'niv' && <Card className="bg-gradient-to-br from-purple-50 to-pink-50 border-purple-200">
            <div className="flex items-start justify-between mb-4">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <WindIcon className="w-6 h-6 text-purple-600" />
                  <h3 className="text-lg font-bold text-gray-900">
                    Monitorización VNI
                  </h3>
                </div>
                <p className="text-sm text-gray-700">
                  Evaluación de interfaz, piel, HACOR y parámetros de{' '}
                  {supportTypeFullLabels[supportType]}
                </p>
                {nivRecords.length > 0 && <p className="text-sm text-purple-700 mt-2 font-medium">
                    {nivRecords.length} registro
                    {nivRecords.length > 1 ? 's' : ''} de monitorización
                  </p>}
              </div>
            </div>
            <Button onClick={() => navigate(`/patient/${patient.id}/niv`)} className="w-full bg-purple-600">
              Acceder a Monitorización VNI
            </Button>
          </Card>}

        {/* HFNC Module */}
        {supportType === 'hfnc' && <Card className="bg-gradient-to-br from-teal-50 to-cyan-50 border-teal-200">
            <div className="flex items-start justify-between mb-4">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <DropletIcon className="w-6 h-6 text-teal-600" />
                  <h3 className="text-lg font-bold text-gray-900">
                    Monitorización HFNC
                  </h3>
                </div>
                <p className="text-sm text-gray-700">
                  Evaluación de flujo, ROX, humidificación y ajuste de{' '}
                  {supportTypeFullLabels[supportType]}
                </p>
                {hfncRecords.length > 0 && <p className="text-sm text-teal-700 mt-2 font-medium">
                    {hfncRecords.length} registro
                    {hfncRecords.length > 1 ? 's' : ''} de monitorización
                  </p>}
              </div>
            </div>
            <Button onClick={() => navigate(`/patient/${patient.id}/hfnc`)} className="w-full bg-teal-600">
              Acceder a Monitorización HFNC
            </Button>
          </Card>}

        {/* Basic Module for conventional oxygen */}
        {supportType === 'conventional-oxygen' && <Card className="bg-gray-50 border-gray-200">
            <div className="text-center py-6">
              <p className="text-gray-600">
                Soporte respiratorio básico - Sin módulo avanzado disponible
              </p>
            </div>
          </Card>}

        <div className="grid grid-cols-2 gap-3">
          <Button variant="primary" onClick={() => navigate(`/score/hacor/${patient.id}`)} className="min-h-[80px] flex flex-col items-center justify-center">
            <span className="text-2xl font-bold">HACOR</span>
            <span className="text-sm opacity-90">Calcular Score</span>
          </Button>
          <Button variant="primary" onClick={() => navigate(`/score/rox/${patient.id}`)} className="min-h-[80px] flex flex-col items-center justify-center">
            <span className="text-2xl font-bold">ROX</span>
            <span className="text-sm opacity-90">Calcular Score</span>
          </Button>
        </div>

        <div>
          <h2 className="text-xl font-bold text-gray-900 mb-4">
            Historial de Scores
          </h2>
          <ScoreHistoryList scores={scores} />
        </div>
      </main>
    </div>;
}