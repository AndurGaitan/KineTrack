import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useApp } from '../contexts/AppContext';
import { Header } from '../components/ui/Header';
import { Card } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { AlertPanel } from '../components/AlertPanel';
import { CheckCircleIcon, AlertCircleIcon } from 'lucide-react';
import { asynchronyTypes, mobilizationLevels, ventModes } from '../utils/vmiEducation';
export function VMIRecordDetailPage() {
  const {
    patientId,
    recordId
  } = useParams<{
    patientId: string;
    recordId: string;
  }>();
  const navigate = useNavigate();
  const {
    patients,
    getVMIRecord,
    sectors
  } = useApp();
  const patient = patients.find(p => p.id === patientId);
  const sector = patient ? sectors.find(s => s.id === patient.sectorId) : null;
  const record = recordId ? getVMIRecord(recordId) : undefined;
  if (!patient || !record) {
    return <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-gray-600">Registro no encontrado</p>
      </div>;
  }
  const date = new Date(record.timestamp);
  const formattedDate = date.toLocaleDateString('es-AR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  });
  const formattedTime = date.toLocaleTimeString('es-AR', {
    hour: '2-digit',
    minute: '2-digit'
  });
  const ventModeLabel = ventModes.find(m => m.value === record.ventMode)?.label || record.ventMode;
  const mobilizationLabel = mobilizationLevels.find(m => m.level === record.mobilizationLevel)?.label || '';
  return <div className="min-h-screen bg-gray-50">
      <Header title="Detalle de Monitorización" showBack showPatientList sectorId={sector?.id} />

      <main className="max-w-2xl mx-auto p-4 space-y-6">
        <Card>
          <div className="flex items-start justify-between mb-4">
            <div>
              <div className="text-sm text-gray-600 mb-1">Paciente</div>
              <div className="text-xl font-bold text-gray-900">
                {patient.alias}
              </div>
              <div className="text-sm text-gray-600 mt-2">
                {formattedDate} - {formattedTime}
              </div>
            </div>
            {record.protectiveVentilation ? <div className="flex items-center gap-2 text-green-600">
                <CheckCircleIcon className="w-6 h-6" />
                <span className="font-medium">Ventilación Protectiva</span>
              </div> : <div className="flex items-center gap-2 text-yellow-600">
                <AlertCircleIcon className="w-6 h-6" />
                <span className="font-medium">Revisar Parámetros</span>
              </div>}
          </div>
        </Card>

        {/* Lung Protection */}
        <Card>
          <h3 className="text-lg font-bold text-gray-900 mb-4">
            Protección Pulmonar
          </h3>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <div className="text-sm text-gray-600 mb-1">Peso Predicho</div>
                <div className="text-2xl font-bold text-gray-900">
                  {record.predictedBodyWeight} kg
                </div>
              </div>
              <div>
                <div className="text-sm text-gray-600 mb-1">
                  Modo Ventilatorio
                </div>
                <div className="text-lg font-medium text-gray-900">
                  {ventModeLabel}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div className={`p-4 rounded-xl ${record.vtPerKg > 8 ? 'bg-red-50' : 'bg-green-50'}`}>
                <div className="text-sm text-gray-600 mb-1">Vt/kg</div>
                <div className={`text-3xl font-bold ${record.vtPerKg > 8 ? 'text-red-600' : 'text-green-600'}`}>
                  {record.vtPerKg}
                </div>
              </div>
              <div className={`p-4 rounded-xl ${record.plateauPressure > 30 ? 'bg-red-50' : 'bg-green-50'}`}>
                <div className="text-sm text-gray-600 mb-1">Pplat</div>
                <div className={`text-3xl font-bold ${record.plateauPressure > 30 ? 'text-red-600' : 'text-green-600'}`}>
                  {record.plateauPressure}
                </div>
              </div>
              <div className={`p-4 rounded-xl ${record.drivingPressure > 15 ? 'bg-red-50' : 'bg-green-50'}`}>
                <div className="text-sm text-gray-600 mb-1">ΔP</div>
                <div className={`text-3xl font-bold ${record.drivingPressure > 15 ? 'text-red-600' : 'text-green-600'}`}>
                  {record.drivingPressure}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div>
                <div className="text-sm text-gray-600 mb-1">Vt Espirado</div>
                <div className="text-xl font-bold text-gray-900">
                  {record.tidalVolumeExpired} ml
                </div>
              </div>
              <div>
                <div className="text-sm text-gray-600 mb-1">PEEP</div>
                <div className="text-xl font-bold text-gray-900">
                  {record.peep} cmH₂O
                </div>
              </div>
              <div>
                <div className="text-sm text-gray-600 mb-1">FiO₂</div>
                <div className="text-xl font-bold text-gray-900">
                  {record.fio2}%
                </div>
              </div>
            </div>

            {record.compliance && <div className="p-4 rounded-xl bg-blue-50">
                <div className="text-sm text-gray-600 mb-1">
                  Compliance Estática
                </div>
                <div className="text-2xl font-bold text-blue-900">
                  {record.compliance} ml/cmH₂O
                </div>
              </div>}
          </div>
        </Card>

        {/* Synchrony */}
        {record.hasAsynchrony && <Card>
            <h3 className="text-lg font-bold text-gray-900 mb-4">
              Sincronía Paciente-Ventilador
            </h3>
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <AlertCircleIcon className="w-5 h-5 text-yellow-600" />
                <span className="font-medium text-gray-900">
                  Asincronías detectadas
                </span>
              </div>
              {record.asynchronyFrequency && <div className="text-sm text-gray-600">
                  Frecuencia:{' '}
                  <span className="font-medium text-gray-900">
                    {record.asynchronyFrequency === 'rare' && 'Raras'}
                    {record.asynchronyFrequency === 'occasional' && 'Ocasionales'}
                    {record.asynchronyFrequency === 'frequent' && 'Frecuentes'}
                  </span>
                </div>}
              <div className="flex flex-wrap gap-2 mt-2">
                {record.asynchronyTypes.map(type => {
              const asyncType = asynchronyTypes.find(a => a.value === type);
              return asyncType ? <Badge key={type} className="bg-yellow-100 text-yellow-800">
                      {asyncType.label}
                    </Badge> : null;
            })}
              </div>
            </div>
          </Card>}

        {/* Oxygenation */}
        <Card>
          <h3 className="text-lg font-bold text-gray-900 mb-4">
            Oxigenación y Ventilación
          </h3>
          <div className="space-y-4">
            {record.pfRatio && <div className={`p-4 rounded-xl ${record.pfRatio < 200 ? 'bg-red-50' : 'bg-green-50'}`}>
                <div className="text-sm text-gray-600 mb-1">Relación P/F</div>
                <div className={`text-3xl font-bold ${record.pfRatio < 200 ? 'text-red-600' : 'text-green-600'}`}>
                  {record.pfRatio}
                </div>
                <div className="text-sm mt-1 text-gray-700">
                  {record.pfRatio < 100 && 'SDRA Severo'}
                  {record.pfRatio >= 100 && record.pfRatio < 200 && 'SDRA Moderado'}
                  {record.pfRatio >= 200 && record.pfRatio < 300 && 'SDRA Leve'}
                  {record.pfRatio >= 300 && 'Normal'}
                </div>
              </div>}

            <div className="grid grid-cols-2 gap-4">
              {record.spo2 && <div>
                  <div className="text-sm text-gray-600 mb-1">SpO₂</div>
                  <div className="text-2xl font-bold text-gray-900">
                    {record.spo2}%
                  </div>
                </div>}
              {record.pao2 && <div>
                  <div className="text-sm text-gray-600 mb-1">PaO₂</div>
                  <div className="text-2xl font-bold text-gray-900">
                    {record.pao2} mmHg
                  </div>
                </div>}
              {record.paco2 && <div>
                  <div className="text-sm text-gray-600 mb-1">PaCO₂</div>
                  <div className="text-2xl font-bold text-gray-900">
                    {record.paco2} mmHg
                  </div>
                </div>}
              {record.ph && <div>
                  <div className="text-sm text-gray-600 mb-1">pH</div>
                  <div className="text-2xl font-bold text-gray-900">
                    {record.ph}
                  </div>
                </div>}
            </div>
          </div>
        </Card>

        {/* Weaning */}
        <Card>
          <h3 className="text-lg font-bold text-gray-900 mb-4">
            Estado de Destete
          </h3>
          <div className="space-y-3">
            <div>
              <div className="text-sm text-gray-600 mb-1">Estado</div>
              <div className="text-lg font-medium text-gray-900">
                {record.weaningStatus === 'not-candidate' && 'No candidato'}
                {record.weaningStatus === 'candidate' && 'Candidato a destete'}
                {record.weaningStatus === 'sbt-trial' && 'En prueba de respiración espontánea'}
                {record.weaningStatus === 'extubated' && 'Extubado'}
              </div>
            </div>
            {record.sbtPerformed && <>
                <div>
                  <div className="text-sm text-gray-600 mb-1">
                    SBT Realizada
                  </div>
                  <div className="text-lg font-medium text-gray-900">
                    {record.sbtType}
                  </div>
                </div>
                {record.sbtResult && <div>
                    <div className="text-sm text-gray-600 mb-1">Resultado</div>
                    <Badge variant={record.sbtResult === 'success' ? 'risk' : undefined} type={record.sbtResult === 'success' ? 'low' : 'high'}>
                      {record.sbtResult === 'success' ? 'Exitosa' : 'Fallida'}
                    </Badge>
                    {record.sbtResult === 'failure' && record.sbtFailureReason && <p className="text-sm text-gray-700 mt-2">
                          Motivo: {record.sbtFailureReason}
                        </p>}
                  </div>}
              </>}
          </div>
        </Card>

        {/* Mobilization */}
        <Card>
          <h3 className="text-lg font-bold text-gray-900 mb-4">Movilización</h3>
          <div className="space-y-3">
            <div>
              <div className="text-sm text-gray-600 mb-1">Nivel Máximo</div>
              <div className="text-2xl font-bold text-gray-900">
                Nivel {record.mobilizationLevel}: {mobilizationLabel}
              </div>
            </div>
            {record.mobilizationBarrier && <div>
                <div className="text-sm text-gray-600 mb-1">Barrera</div>
                <div className="text-gray-900">
                  {record.mobilizationBarrier}
                </div>
              </div>}
          </div>
        </Card>

        {/* Alerts */}
        {record.alerts.length > 0 && <div>
            <h3 className="text-lg font-bold text-gray-900 mb-4">
              Evaluación Clínica
            </h3>
            <AlertPanel alerts={record.alerts} />
          </div>}
      </main>
    </div>;
}