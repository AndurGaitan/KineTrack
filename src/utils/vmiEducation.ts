export interface EducationalContent {
  title: string;
  definition: string;
  importance: string;
  target: string;
  example?: string;
}
export const vmiEducation: Record<string, EducationalContent> = {
  vtPerKg: {
    title: 'Volumen Tidal por Kg (Vt/kg)',
    definition: 'Volumen de aire entregado por el ventilador en cada respiración, ajustado al peso corporal predicho del paciente.',
    importance: 'Es el pilar fundamental de la ventilación protectiva. Volúmenes tidales altos causan volutrauma, sobredistensión alveolar y daño pulmonar progresivo.',
    target: '6-8 ml/kg de peso predicho',
    example: 'Para un paciente de 70 kg: Vt objetivo = 420-560 ml'
  },
  plateauPressure: {
    title: 'Presión Plateau (Pplat)',
    definition: 'Presión alveolar al final de la inspiración, medida con una pausa inspiratoria de 0.5 segundos.',
    importance: 'Refleja la presión transmitida al parénquima pulmonar. Presiones altas se asocian con barotrauma y mayor mortalidad.',
    target: '≤ 30 cmH₂O (idealmente < 28)',
    example: 'Pplat de 32 cmH₂O indica riesgo de sobredistensión'
  },
  drivingPressure: {
    title: 'Driving Pressure (ΔP)',
    definition: 'Diferencia entre la presión plateau y la PEEP (Pplat - PEEP). Representa la presión necesaria para insuflar el pulmón.',
    importance: 'Es el predictor más fuerte de mortalidad en SDRA. Valores altos indican pulmón rígido o volumen tidal excesivo para el pulmón disponible.',
    target: '≤ 15 cmH₂O (idealmente < 13)',
    example: 'Pplat 28 - PEEP 10 = ΔP 18 (elevada)'
  },
  peep: {
    title: 'PEEP (Presión Positiva al Final de la Espiración)',
    definition: 'Presión positiva mantenida al final de la espiración para prevenir el colapso alveolar.',
    importance: 'Mantiene los alvéolos abiertos, mejora la oxigenación y previene el atelectrauma (daño por apertura-cierre cíclico).',
    target: 'Variable según patología. SDRA: 10-15 cmH₂O típicamente',
    example: 'PEEP baja en SDRA → colapso alveolar recurrente'
  },
  compliance: {
    title: 'Compliance Estática (Cst)',
    definition: 'Medida de la distensibilidad pulmonar. Se calcula como Vt / (Pplat - PEEP).',
    importance: 'Refleja la rigidez del sistema respiratorio. Valores bajos indican pulmón rígido (SDRA, fibrosis) o pared torácica rígida.',
    target: '> 40 ml/cmH₂O (normal: 50-100)',
    example: 'Cst de 25 ml/cmH₂O indica pulmón muy rígido'
  },
  pfRatio: {
    title: 'Relación PaO₂/FiO₂ (P/F)',
    definition: 'Índice de oxigenación que relaciona la presión arterial de oxígeno con la fracción inspirada de oxígeno.',
    importance: 'Define la severidad del SDRA y guía decisiones terapéuticas (prono, ECMO, etc.).',
    target: '> 300 normal. SDRA: leve (200-300), moderado (100-200), severo (< 100)',
    example: 'P/F de 120 con FiO₂ 80% indica SDRA moderado'
  },
  asynchrony: {
    title: 'Asincronías Paciente-Ventilador',
    definition: 'Desacople entre el esfuerzo respiratorio del paciente y la respuesta del ventilador.',
    importance: 'Aumentan el trabajo respiratorio, prolongan la ventilación, generan disconfort y pueden causar lesión pulmonar inducida por el ventilador.',
    target: '< 10% de los ciclos respiratorios',
    example: 'Double trigger → dos ciclos por un solo esfuerzo'
  },
  weaningStatus: {
    title: 'Estado de Destete',
    definition: 'Evaluación sistemática de la preparación del paciente para reducir o discontinuar el soporte ventilatorio.',
    importance: 'El destete precoz y protocolizado reduce complicaciones, días de VMI y costos. El destete tardío aumenta riesgos.',
    target: 'Evaluación diaria de candidatura',
    example: 'Criterios: estabilidad hemodinámica, FiO₂ ≤ 40%, PEEP ≤ 8'
  },
  sbt: {
    title: 'Prueba de Respiración Espontánea (SBT)',
    definition: 'Ensayo de ventilación con mínimo soporte (tubo en T o PS baja) para evaluar capacidad de respiración autónoma.',
    importance: 'Es el mejor predictor de éxito de extubación. Debe realizarse en todos los candidatos a destete.',
    target: '30-120 minutos sin deterioro',
    example: 'SBT con PS 5-7 cmH₂O durante 30 minutos'
  },
  mobilization: {
    title: 'Movilización Precoz',
    definition: 'Actividad física progresiva iniciada tempranamente durante la ventilación mecánica.',
    importance: 'Reduce delirium, debilidad adquirida en UCI, días de ventilación y mejora outcomes funcionales a largo plazo.',
    target: 'Iniciar dentro de las primeras 48-72 horas si es seguro',
    example: 'Nivel 2: sedestación en borde de cama con asistencia'
  }
};
export const mobilizationLevels = [{
  level: 0,
  label: 'Sin movilización',
  description: 'Paciente en cama, sin actividad'
}, {
  level: 1,
  label: 'Movilización pasiva',
  description: 'Ejercicios pasivos en cama, cambios posturales'
}, {
  level: 2,
  label: 'Sedestación',
  description: 'Sentado en borde de cama o silla con asistencia'
}, {
  level: 3,
  label: 'Bipedestación',
  description: 'De pie con asistencia, marcha en el lugar'
}, {
  level: 4,
  label: 'Deambulación',
  description: 'Caminando con o sin asistencia'
}];
export const asynchronyTypes = [{
  value: 'ineffective-effort',
  label: 'Esfuerzos inefectivos',
  description: 'El paciente intenta respirar pero el ventilador no detecta el esfuerzo'
}, {
  value: 'double-trigger',
  label: 'Double trigger',
  description: 'Dos ciclos del ventilador por un solo esfuerzo del paciente'
}, {
  value: 'premature-cycling',
  label: 'Ciclado prematuro',
  description: 'El ventilador termina la inspiración antes de que el paciente lo haga'
}, {
  value: 'delayed-cycling',
  label: 'Ciclado tardío',
  description: 'El ventilador prolonga la inspiración más allá del esfuerzo del paciente'
}, {
  value: 'auto-peep',
  label: 'Auto-PEEP',
  description: 'Atrapamiento aéreo por tiempo espiratorio insuficiente'
}];
export const ventModes = [{
  value: 'vc-cmv',
  label: 'VC-CMV (Volumen controlado)'
}, {
  value: 'pc-cmv',
  label: 'PC-CMV (Presión controlada)'
}, {
  value: 'simv-vc',
  label: 'SIMV-VC'
}, {
  value: 'simv-pc',
  label: 'SIMV-PC'
}, {
  value: 'psv',
  label: 'PSV (Presión soporte)'
}, {
  value: 'prvc',
  label: 'PRVC'
}, {
  value: 'aprv',
  label: 'APRV'
}, {
  value: 'other',
  label: 'Otro'
}];