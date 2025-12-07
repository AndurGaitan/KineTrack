import React from 'react';
import { Patient } from '../types';
import { BedDoubleIcon } from 'lucide-react';
interface BedGridProps {
  totalBeds: number;
  patients: Patient[];
  onBedClick: (bed: number, patient?: Patient) => void;
}
export function BedGrid({
  totalBeds,
  patients,
  onBedClick
}: BedGridProps) {
  const beds = Array.from({
    length: totalBeds
  }, (_, i) => i + 1);
  return <div className="grid grid-cols-2 gap-4">
      {beds.map(bedNumber => {
      const patient = patients.find(p => p.bed === bedNumber);
      const isEmpty = !patient;
      return <button key={bedNumber} onClick={() => onBedClick(bedNumber, patient)} className={`min-h-[120px] rounded-2xl border-2 p-4 flex flex-col items-center justify-center gap-2 transition-all active:scale-95 ${isEmpty ? 'border-dashed border-gray-300 bg-gray-50' : 'border-blue-200 bg-blue-50'}`}>
            <BedDoubleIcon className={`w-8 h-8 ${isEmpty ? 'text-gray-400' : 'text-blue-600'}`} />
            <div className="text-center">
              <div className="text-sm font-medium text-gray-600">
                Cama {bedNumber}
              </div>
              {patient && <div className="text-lg font-bold text-gray-900 mt-1">
                  {patient.alias}
                </div>}
              {isEmpty && <div className="text-sm text-gray-400 mt-1">Disponible</div>}
            </div>
          </button>;
    })}
    </div>;
}