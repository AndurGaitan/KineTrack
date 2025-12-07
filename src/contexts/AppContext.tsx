import React, { createContext, useContext } from 'react';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { AppState, User, Patient, ScoreRecord, Sector, VMIRecord, NIVRecord, HFNCRecord } from '../types';
import { initialSectors } from '../utils/mockData';
interface AppContextType extends AppState {
  login: (user: User) => void;
  logout: () => void;
  addPatient: (patient: Omit<Patient, 'id' | 'createdAt'>) => void;
  updatePatient: (id: string, patient: Partial<Patient>) => void;
  deletePatient: (id: string) => void;
  addScore: (score: Omit<ScoreRecord, 'id' | 'timestamp'>) => void;
  getPatientScores: (patientId: string) => ScoreRecord[];
  getSectorPatients: (sectorId: string) => Patient[];
  addVMIRecord: (record: Omit<VMIRecord, 'id' | 'timestamp'>) => void;
  getPatientVMIRecords: (patientId: string) => VMIRecord[];
  getVMIRecord: (id: string) => VMIRecord | undefined;
  addNIVRecord: (record: Omit<NIVRecord, 'id' | 'timestamp'>) => void;
  getPatientNIVRecords: (patientId: string) => NIVRecord[];
  getNIVRecord: (id: string) => NIVRecord | undefined;
  addHFNCRecord: (record: Omit<HFNCRecord, 'id' | 'timestamp'>) => void;
  getPatientHFNCRecords: (patientId: string) => HFNCRecord[];
  getHFNCRecord: (id: string) => HFNCRecord | undefined;
}
const AppContext = createContext<AppContextType | undefined>(undefined);
const initialState: AppState = {
  user: null,
  sectors: initialSectors,
  patients: [],
  scores: [],
  vmiRecords: [],
  nivRecords: [],
  hfncRecords: []
};
export function AppProvider({
  children
}: {
  children: ReactNode;
}) {
  const [state, setState] = useLocalStorage<AppState>('uci-app-state', initialState);
  const login = (user: User) => {
    setState(prev => ({
      ...prev,
      user
    }));
  };
  const logout = () => {
    setState(prev => ({
      ...prev,
      user: null
    }));
  };
  const addPatient = (patient: Omit<Patient, 'id' | 'createdAt'>) => {
    const newPatient: Patient = {
      ...patient,
      id: Date.now().toString(),
      createdAt: new Date().toISOString()
    };
    setState(prev => ({
      ...prev,
      patients: [...prev.patients, newPatient]
    }));
  };
  const updatePatient = (id: string, updates: Partial<Patient>) => {
    setState(prev => ({
      ...prev,
      patients: prev.patients.map(p => p.id === id ? {
        ...p,
        ...updates
      } : p)
    }));
  };
  const deletePatient = (id: string) => {
    setState(prev => ({
      ...prev,
      patients: prev.patients.filter(p => p.id !== id),
      scores: prev.scores.filter(s => s.patientId !== id),
      vmiRecords: prev.vmiRecords.filter(v => v.patientId !== id),
      nivRecords: prev.nivRecords.filter(n => n.patientId !== id),
      hfncRecords: prev.hfncRecords.filter(h => h.patientId !== id)
    }));
  };
  const addScore = (score: Omit<ScoreRecord, 'id' | 'timestamp'>) => {
    const newScore: ScoreRecord = {
      ...score,
      id: Date.now().toString(),
      timestamp: new Date().toISOString()
    };
    setState(prev => ({
      ...prev,
      scores: [...prev.scores, newScore]
    }));
  };
  const getPatientScores = (patientId: string) => {
    return state.scores.filter(s => s.patientId === patientId).sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
  };
  const getSectorPatients = (sectorId: string) => {
    return state.patients.filter(p => p.sectorId === sectorId);
  };
  const addVMIRecord = (record: Omit<VMIRecord, 'id' | 'timestamp'>) => {
    const newRecord: VMIRecord = {
      ...record,
      id: Date.now().toString(),
      timestamp: new Date().toISOString()
    };
    setState(prev => ({
      ...prev,
      vmiRecords: [...prev.vmiRecords, newRecord]
    }));
  };
  const getPatientVMIRecords = (patientId: string) => {
    return state.vmiRecords.filter(v => v.patientId === patientId).sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
  };
  const getVMIRecord = (id: string) => {
    return state.vmiRecords.find(v => v.id === id);
  };
  const addNIVRecord = (record: Omit<NIVRecord, 'id' | 'timestamp'>) => {
    const newRecord: NIVRecord = {
      ...record,
      id: Date.now().toString(),
      timestamp: new Date().toISOString()
    };
    setState(prev => ({
      ...prev,
      nivRecords: [...prev.nivRecords, newRecord]
    }));
  };
  const getPatientNIVRecords = (patientId: string) => {
    return state.nivRecords.filter(n => n.patientId === patientId).sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
  };
  const getNIVRecord = (id: string) => {
    return state.nivRecords.find(n => n.id === id);
  };
  const addHFNCRecord = (record: Omit<HFNCRecord, 'id' | 'timestamp'>) => {
    const newRecord: HFNCRecord = {
      ...record,
      id: Date.now().toString(),
      timestamp: new Date().toISOString()
    };
    setState(prev => ({
      ...prev,
      hfncRecords: [...prev.hfncRecords, newRecord]
    }));
  };
  const getPatientHFNCRecords = (patientId: string) => {
    return state.hfncRecords.filter(h => h.patientId === patientId).sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
  };
  const getHFNCRecord = (id: string) => {
    return state.hfncRecords.find(h => h.id === id);
  };
  return <AppContext.Provider value={{
    ...state,
    login,
    logout,
    addPatient,
    updatePatient,
    deletePatient,
    addScore,
    getPatientScores,
    getSectorPatients,
    addVMIRecord,
    getPatientVMIRecords,
    getVMIRecord,
    addNIVRecord,
    getPatientNIVRecords,
    getNIVRecord,
    addHFNCRecord,
    getPatientHFNCRecords,
    getHFNCRecord
  }}>
      {children}
    </AppContext.Provider>;
}
export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within AppProvider');
  }
  return context;
}