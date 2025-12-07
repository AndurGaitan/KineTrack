import { VMIRecord } from '../types';
export interface VMICalculations {
  vtPerKg: number;
  drivingPressure: number;
  pfRatio?: number;
  compliance?: number;
  protectiveVentilation: boolean;
}
export function calculateVMIMetrics(data: Partial<VMIRecord>): VMICalculations {
  const vtPerKg = data.tidalVolumeExpired && data.predictedBodyWeight ? Number((data.tidalVolumeExpired / data.predictedBodyWeight).toFixed(1)) : 0;
  const drivingPressure = data.plateauPressure && data.peep !== undefined ? data.plateauPressure - data.peep : 0;
  const pfRatio = data.pao2 && data.fio2 ? Number((data.pao2 / (data.fio2 / 100)).toFixed(0)) : undefined;
  const compliance = data.tidalVolumeExpired && drivingPressure > 0 ? Number((data.tidalVolumeExpired / drivingPressure).toFixed(1)) : undefined;
  const protectiveVentilation = vtPerKg > 0 && vtPerKg <= 8 && data.plateauPressure !== undefined && data.plateauPressure <= 30 && drivingPressure > 0 && drivingPressure <= 15;
  return {
    vtPerKg,
    drivingPressure,
    pfRatio,
    compliance,
    protectiveVentilation
  };
}
export function generateVMIAlerts(record: Partial<VMIRecord>, calculations: VMICalculations): string[] {
  const alerts: string[] = [];

  // Vt/kg alerts
  if (calculations.vtPerKg > 8) {
    alerts.push('Vt/kg elevado - Considerar reducción para ventilación protectiva (objetivo: 6-8 ml/kg)');
  } else if (calculations.vtPerKg > 0 && calculations.vtPerKg < 4) {
    alerts.push('Vt/kg muy bajo - Verificar si es intencional o revisar configuración');
  }

  // Plateau pressure alerts
  if (record.plateauPressure && record.plateauPressure > 30) {
    alerts.push('Pplat > 30 cmH₂O - Alto riesgo de barotrauma y volutrauma');
  } else if (record.plateauPressure && record.plateauPressure > 28) {
    alerts.push('Pplat entre 28-30 cmH₂O - Zona de precaución, considerar optimización');
  }

  // Driving pressure alerts
  if (calculations.drivingPressure > 15) {
    alerts.push('Driving pressure > 15 cmH₂O - Fuerte predictor de mortalidad en SDRA');
  } else if (calculations.drivingPressure > 13) {
    alerts.push('Driving pressure elevada - Considerar reducir Vt o aumentar PEEP si es apropiado');
  }

  // PEEP alerts
  if (record.peep !== undefined && record.peep < 5) {
    alerts.push('PEEP baja - Riesgo de atelectrauma (colapso-apertura cíclico)');
  }

  // Compliance alerts
  if (calculations.compliance && calculations.compliance < 30) {
    alerts.push('Compliance muy baja - Pulmón extremadamente rígido, considerar estrategias avanzadas');
  }

  // P/F ratio alerts
  if (calculations.pfRatio) {
    if (calculations.pfRatio < 100) {
      alerts.push('P/F < 100 - SDRA severo. Considerar prono, reclutamiento, ECMO según contexto');
    } else if (calculations.pfRatio < 200) {
      alerts.push('P/F < 200 - SDRA moderado/severo. Optimizar estrategia ventilatoria');
    }
  }

  // Asynchrony alerts
  if (record.hasAsynchrony && record.asynchronyFrequency === 'frequent') {
    alerts.push('Asincronías frecuentes - Revisar trigger, flujo, modo ventilatorio y nivel de sedación');
  } else if (record.hasAsynchrony && record.asynchronyFrequency === 'occasional') {
    alerts.push('Asincronías ocasionales detectadas - Monitorear evolución');
  }

  // Weaning alerts
  if (record.weaningStatus === 'candidate' && !record.sbtPerformed) {
    alerts.push('Paciente candidato a destete sin SBT registrada - Considerar realizar prueba');
  }

  // Mobilization alerts
  if (record.mobilizationLevel === 0 && !record.mobilizationBarrier) {
    alerts.push('Sin movilización documentada - Registrar barreras o considerar inicio progresivo');
  }

  // FiO2 alerts
  if (record.fio2 && record.fio2 > 60) {
    alerts.push('FiO₂ > 60% - Riesgo de toxicidad por oxígeno. Optimizar PEEP para reducir FiO₂');
  }

  // Protective ventilation success
  if (calculations.protectiveVentilation) {
    alerts.push('✓ Ventilación protectiva lograda - Vt/kg, Pplat y ΔP en rangos objetivo');
  }
  return alerts;
}
export interface QualityMetrics {
  totalRecords: number;
  protectiveVentilationRate: number;
  averageVtPerKg: number;
  averageDrivingPressure: number;
  sbtCompletionRate: number;
  averageMobilizationLevel: number;
}
export function calculateQualityMetrics(records: VMIRecord[]): QualityMetrics {
  if (records.length === 0) {
    return {
      totalRecords: 0,
      protectiveVentilationRate: 0,
      averageVtPerKg: 0,
      averageDrivingPressure: 0,
      sbtCompletionRate: 0,
      averageMobilizationLevel: 0
    };
  }
  const protectiveCount = records.filter(r => r.protectiveVentilation).length;
  const protectiveVentilationRate = protectiveCount / records.length * 100;
  const totalVtPerKg = records.reduce((sum, r) => sum + r.vtPerKg, 0);
  const averageVtPerKg = totalVtPerKg / records.length;
  const totalDP = records.reduce((sum, r) => sum + r.drivingPressure, 0);
  const averageDrivingPressure = totalDP / records.length;
  const candidates = records.filter(r => r.weaningStatus === 'candidate' || r.weaningStatus === 'sbt-trial');
  const sbtPerformed = candidates.filter(r => r.sbtPerformed).length;
  const sbtCompletionRate = candidates.length > 0 ? sbtPerformed / candidates.length * 100 : 0;
  const totalMob = records.reduce((sum, r) => sum + r.mobilizationLevel, 0);
  const averageMobilizationLevel = totalMob / records.length;
  return {
    totalRecords: records.length,
    protectiveVentilationRate: Number(protectiveVentilationRate.toFixed(1)),
    averageVtPerKg: Number(averageVtPerKg.toFixed(1)),
    averageDrivingPressure: Number(averageDrivingPressure.toFixed(1)),
    sbtCompletionRate: Number(sbtCompletionRate.toFixed(1)),
    averageMobilizationLevel: Number(averageMobilizationLevel.toFixed(1))
  };
}