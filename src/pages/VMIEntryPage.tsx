import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useApp } from '../contexts/AppContext';
import { Header } from '../components/ui/Header';
import { Button } from '../components/ui/Button';
import { CollapsibleSection } from '../components/ui/Tooltip';
import { VMIField, VMISelect } from '../components/VMIField';
import { AlertPanel } from '../components/AlertPanel';
import { AsynchronyType, MobilizationLevel, WeaningStatus } from '../types';
import { calculateVMIMetrics, generateVMIAlerts } from '../utils/vmiCalculations';
import { ventModes, asynchronyTypes, mobilizationLevels } from '../utils/vmiEducation';
export function VMIEntryPage() {
  const {
    patientId
  } = useParams<{
    patientId: string;
  }>();
  const navigate = useNavigate();
  const {
    patients,
    addVMIRecord,
    sectors
  } = useApp();
  const patient = patients.find(p => p.id === patientId);
  const sector = patient ? sectors.find(s => s.id === patient.sectorId) : null;
  const [formData, setFormData] = useState({
    // A) Lung Protection
    predictedBodyWeight: patient?.predictedBodyWeight || 70,
    tidalVolumeSet: 450,
    tidalVolumeExpired: 450,
    plateauPressure: 25,
    peep: 10,
    ventMode: '',
    fio2: 50,
    respiratoryRate: 20,
    // B) Synchrony
    hasAsynchrony: false,
    asynchronyTypes: [] as AsynchronyType[],
    asynchronyFrequency: '' as '' | 'rare' | 'occasional' | 'frequent',
    // C) Oxygenation
    spo2: 95,
    pao2: 80,
    paco2: 40,
    ph: 7.4,
    // D) Weaning
    weaningStatus: 'not-candidate' as WeaningStatus,
    sbtPerformed: false,
    sbtType: '',
    sbtResult: '' as '' | 'success' | 'failure',
    sbtFailureReason: '',
    // E) Mobilization
    mobilizationLevel: 0 as MobilizationLevel,
    mobilizationBarrier: ''
  });
  const [calculations, setCalculations] = useState(calculateVMIMetrics(formData));
  const [alerts, setAlerts] = useState<string[]>([]);
  useEffect(() => {
    const calc = calculateVMIMetrics(formData);
    setCalculations(calc);
    const newAlerts = generateVMIAlerts(formData, calc);
    setAlerts(newAlerts);
  }, [formData]);
  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    addVMIRecord({
      patientId: patient!.id,
      ...formData,
      asynchronyFrequency: formData.asynchronyFrequency || undefined,
      sbtType: formData.sbtType || undefined,
      sbtResult: formData.sbtResult || undefined,
      sbtFailureReason: formData.sbtFailureReason || undefined,
      mobilizationBarrier: formData.mobilizationBarrier || undefined,
      vtPerKg: calculations.vtPerKg,
      drivingPressure: calculations.drivingPressure,
      pfRatio: calculations.pfRatio,
      compliance: calculations.compliance,
      protectiveVentilation: calculations.protectiveVentilation,
      alerts
    });
    navigate(`/patient/${patient!.id}/vmi`);
  };
  if (!patient || patient.supportType !== 'imv') {
    return <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <p className="text-gray-600">
          Este módulo solo está disponible para pacientes en VMI
        </p>
      </div>;
  }
  const toggleAsynchronyType = (type: AsynchronyType) => {
    setFormData(prev => ({
      ...prev,
      asynchronyTypes: prev.asynchronyTypes.includes(type) ? prev.asynchronyTypes.filter(t => t !== type) : [...prev.asynchronyTypes, type]
    }));
  };
  return <div className="min-h-screen bg-gray-50">
      <Header title="Monitorización VMI" showBack showPatientList sectorId={sector?.id} />

      <main className="max-w-2xl mx-auto p-4 pb-24">
        <div className="bg-blue-50 border-2 border-blue-200 rounded-2xl p-4 mb-6">
          <p className="text-sm text-blue-900">
            <strong>Herramienta avanzada de VMI:</strong> Este módulo está
            diseñado para terapeutas con manejo avanzado de ventilación
            mecánica, y para ayudar a quienes están en formación a pensar como
            un experto.
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-6">
          <div className="text-sm text-gray-600 mb-1">Paciente</div>
          <div className="text-xl font-bold text-gray-900">{patient.alias}</div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* A) Lung Protection */}
          <CollapsibleSection title="A) Protección Pulmonar" subtitle="Parámetros fundamentales de ventilación protectiva">
            <div className="space-y-4">
              <VMIField label="Peso Predicho" educationKey="vtPerKg" unit="kg" type="number" step="0.1" value={formData.predictedBodyWeight} onChange={e => setFormData({
              ...formData,
              predictedBodyWeight: Number(e.target.value)
            })} required />

              <div className="grid grid-cols-2 gap-4">
                <VMIField label="Vt Programado" unit="ml" type="number" value={formData.tidalVolumeSet} onChange={e => setFormData({
                ...formData,
                tidalVolumeSet: Number(e.target.value)
              })} required />
                <VMIField label="Vt Espirado" educationKey="vtPerKg" unit="ml" type="number" value={formData.tidalVolumeExpired} onChange={e => setFormData({
                ...formData,
                tidalVolumeExpired: Number(e.target.value)
              })} required />
              </div>

              {calculations.vtPerKg > 0 && <div className={`p-4 rounded-xl ${calculations.vtPerKg > 8 ? 'bg-red-50' : 'bg-green-50'}`}>
                  <div className="text-sm text-gray-600 mb-1">
                    Vt/kg calculado
                  </div>
                  <div className={`text-3xl font-bold ${calculations.vtPerKg > 8 ? 'text-red-600' : 'text-green-600'}`}>
                    {calculations.vtPerKg} ml/kg
                  </div>
                </div>}

              <div className="grid grid-cols-2 gap-4">
                <VMIField label="Presión Plateau" educationKey="plateauPressure" unit="cmH₂O" type="number" value={formData.plateauPressure} onChange={e => setFormData({
                ...formData,
                plateauPressure: Number(e.target.value)
              })} required />
                <VMIField label="PEEP" educationKey="peep" unit="cmH₂O" type="number" value={formData.peep} onChange={e => setFormData({
                ...formData,
                peep: Number(e.target.value)
              })} required />
              </div>

              {calculations.drivingPressure > 0 && <div className={`p-4 rounded-xl ${calculations.drivingPressure > 15 ? 'bg-red-50' : 'bg-green-50'}`}>
                  <div className="text-sm text-gray-600 mb-1">
                    Driving Pressure (ΔP)
                  </div>
                  <div className={`text-3xl font-bold ${calculations.drivingPressure > 15 ? 'text-red-600' : 'text-green-600'}`}>
                    {calculations.drivingPressure} cmH₂O
                  </div>
                </div>}

              <VMISelect label="Modo Ventilatorio" options={ventModes} value={formData.ventMode} onChange={e => setFormData({
              ...formData,
              ventMode: e.target.value
            })} required />

              <div className="grid grid-cols-2 gap-4">
                <VMIField label="FiO₂" unit="%" type="number" value={formData.fio2} onChange={e => setFormData({
                ...formData,
                fio2: Number(e.target.value)
              })} required />
                <VMIField label="Frecuencia Resp." unit="rpm" type="number" value={formData.respiratoryRate} onChange={e => setFormData({
                ...formData,
                respiratoryRate: Number(e.target.value)
              })} />
              </div>

              {calculations.compliance && <div className="p-4 rounded-xl bg-blue-50">
                  <div className="text-sm text-gray-600 mb-1">
                    Compliance Estática
                  </div>
                  <div className="text-2xl font-bold text-blue-900">
                    {calculations.compliance} ml/cmH₂O
                  </div>
                </div>}
            </div>
          </CollapsibleSection>

          {/* B) Synchrony */}
          <CollapsibleSection title="B) Sincronía Paciente-Ventilador" subtitle="Evaluación de asincronías">
            <div className="space-y-4">
              <div>
                <label className="flex items-center gap-3 p-4 border-2 border-gray-300 rounded-xl cursor-pointer hover:bg-gray-50">
                  <input type="checkbox" checked={formData.hasAsynchrony} onChange={e => setFormData({
                  ...formData,
                  hasAsynchrony: e.target.checked
                })} className="w-6 h-6" />
                  <span className="text-lg font-medium">
                    Se observan asincronías
                  </span>
                </label>
              </div>

              {formData.hasAsynchrony && <>
                  <div>
                    <label className="text-sm font-medium text-gray-700 mb-2 block">
                      Tipos de asincronía detectados
                    </label>
                    <div className="space-y-2">
                      {asynchronyTypes.map(type => <label key={type.value} className="flex items-start gap-3 p-3 border border-gray-200 rounded-xl cursor-pointer hover:bg-gray-50">
                          <input type="checkbox" checked={formData.asynchronyTypes.includes(type.value as AsynchronyType)} onChange={() => toggleAsynchronyType(type.value as AsynchronyType)} className="w-5 h-5 mt-0.5" />
                          <div>
                            <div className="font-medium text-gray-900">
                              {type.label}
                            </div>
                            <div className="text-sm text-gray-600">
                              {type.description}
                            </div>
                          </div>
                        </label>)}
                    </div>
                  </div>

                  <VMISelect label="Frecuencia de asincronías" educationKey="asynchrony" options={[{
                value: 'rare',
                label: 'Raras (< 5%)'
              }, {
                value: 'occasional',
                label: 'Ocasionales (5-10%)'
              }, {
                value: 'frequent',
                label: 'Frecuentes (> 10%)'
              }]} value={formData.asynchronyFrequency} onChange={e => setFormData({
                ...formData,
                asynchronyFrequency: e.target.value as any
              })} />
                </>}
            </div>
          </CollapsibleSection>

          {/* C) Oxygenation */}
          <CollapsibleSection title="C) Oxigenación y Ventilación" subtitle="Gasometría y parámetros de intercambio">
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <VMIField label="SpO₂" unit="%" type="number" value={formData.spo2} onChange={e => setFormData({
                ...formData,
                spo2: Number(e.target.value)
              })} />
                <VMIField label="PaO₂" educationKey="pfRatio" unit="mmHg" type="number" value={formData.pao2} onChange={e => setFormData({
                ...formData,
                pao2: Number(e.target.value)
              })} />
              </div>

              {calculations.pfRatio && <div className={`p-4 rounded-xl ${calculations.pfRatio < 200 ? 'bg-red-50' : 'bg-green-50'}`}>
                  <div className="text-sm text-gray-600 mb-1">Relación P/F</div>
                  <div className={`text-3xl font-bold ${calculations.pfRatio < 200 ? 'text-red-600' : 'text-green-600'}`}>
                    {calculations.pfRatio}
                  </div>
                  <div className="text-sm mt-1 text-gray-700">
                    {calculations.pfRatio < 100 && 'SDRA Severo'}
                    {calculations.pfRatio >= 100 && calculations.pfRatio < 200 && 'SDRA Moderado'}
                    {calculations.pfRatio >= 200 && calculations.pfRatio < 300 && 'SDRA Leve'}
                    {calculations.pfRatio >= 300 && 'Normal'}
                  </div>
                </div>}

              <div className="grid grid-cols-2 gap-4">
                <VMIField label="PaCO₂" unit="mmHg" type="number" value={formData.paco2} onChange={e => setFormData({
                ...formData,
                paco2: Number(e.target.value)
              })} />
                <VMIField label="pH" type="number" step="0.01" value={formData.ph} onChange={e => setFormData({
                ...formData,
                ph: Number(e.target.value)
              })} />
              </div>
            </div>
          </CollapsibleSection>

          {/* D) Weaning */}
          <CollapsibleSection title="D) Destete de la Ventilación" subtitle="Evaluación y pruebas de destete">
            <div className="space-y-4">
              <VMISelect label="Estado de Destete" educationKey="weaningStatus" options={[{
              value: 'not-candidate',
              label: 'No candidato'
            }, {
              value: 'candidate',
              label: 'Candidato a destete'
            }, {
              value: 'sbt-trial',
              label: 'En prueba de respiración espontánea'
            }, {
              value: 'extubated',
              label: 'Extubado'
            }]} value={formData.weaningStatus} onChange={e => setFormData({
              ...formData,
              weaningStatus: e.target.value as WeaningStatus
            })} required />

              {(formData.weaningStatus === 'candidate' || formData.weaningStatus === 'sbt-trial') && <>
                  <div>
                    <label className="flex items-center gap-3 p-4 border-2 border-gray-300 rounded-xl cursor-pointer hover:bg-gray-50">
                      <input type="checkbox" checked={formData.sbtPerformed} onChange={e => setFormData({
                    ...formData,
                    sbtPerformed: e.target.checked
                  })} className="w-6 h-6" />
                      <span className="text-lg font-medium">SBT realizada</span>
                    </label>
                  </div>

                  {formData.sbtPerformed && <>
                      <VMIField label="Tipo de SBT" educationKey="sbt" placeholder="Ej: Tubo en T, PS 5-7" value={formData.sbtType} onChange={e => setFormData({
                  ...formData,
                  sbtType: e.target.value
                })} />

                      <VMISelect label="Resultado de SBT" options={[{
                  value: 'success',
                  label: 'Exitosa'
                }, {
                  value: 'failure',
                  label: 'Fallida'
                }]} value={formData.sbtResult} onChange={e => setFormData({
                  ...formData,
                  sbtResult: e.target.value as any
                })} />

                      {formData.sbtResult === 'failure' && <VMIField label="Motivo de falla" placeholder="Ej: Taquipnea, desaturación" value={formData.sbtFailureReason} onChange={e => setFormData({
                  ...formData,
                  sbtFailureReason: e.target.value
                })} />}
                    </>}
                </>}
            </div>
          </CollapsibleSection>

          {/* E) Mobilization */}
          <CollapsibleSection title="E) Movilización y Rehabilitación" subtitle="Nivel de actividad física">
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-700 mb-2 block">
                  Nivel máximo de movilización
                </label>
                <div className="space-y-2">
                  {mobilizationLevels.map(level => <label key={level.level} className={`flex items-start gap-3 p-4 border-2 rounded-xl cursor-pointer transition-colors ${formData.mobilizationLevel === level.level ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:bg-gray-50'}`}>
                      <input type="radio" name="mobilization" checked={formData.mobilizationLevel === level.level} onChange={() => setFormData({
                    ...formData,
                    mobilizationLevel: level.level as MobilizationLevel
                  })} className="w-5 h-5 mt-0.5" />
                      <div>
                        <div className="font-bold text-gray-900">
                          Nivel {level.level}: {level.label}
                        </div>
                        <div className="text-sm text-gray-600">
                          {level.description}
                        </div>
                      </div>
                    </label>)}
                </div>
              </div>

              {formData.mobilizationLevel === 0 && <VMIField label="Barrera para movilización" educationKey="mobilization" placeholder="Ej: Inestabilidad hemodinámica, sedación profunda" value={formData.mobilizationBarrier} onChange={e => setFormData({
              ...formData,
              mobilizationBarrier: e.target.value
            })} />}
            </div>
          </CollapsibleSection>

          {/* Alerts */}
          {alerts.length > 0 && <div>
              <h3 className="text-lg font-bold text-gray-900 mb-4">
                Evaluación Clínica
              </h3>
              <AlertPanel alerts={alerts} />
            </div>}

          {/* Submit */}
          <div className="flex gap-3 pt-4">
            <Button type="button" variant="secondary" onClick={() => navigate(-1)} fullWidth>
              Cancelar
            </Button>
            <Button type="submit" fullWidth>
              Guardar Monitorización
            </Button>
          </div>
        </form>
      </main>
    </div>;
}