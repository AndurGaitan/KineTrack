import React from 'react';
import { Card } from './ui/Card';
import { Badge } from './ui/Badge';
import { Patient, Sector } from '../types';
import { ActivityIcon } from 'lucide-react';
interface PatientCardProps {
  patient: Patient;
  sector: Sector;
  scoreCount: number;
  onClick: () => void;
}
const supportTypeLabels = {
  oxygen: 'Oxígeno',
  vni: 'VNI',
  invasive: 'VM Invasiva'
};
export function PatientCard({
  patient,
  sector,
  scoreCount,
  onClick
}: PatientCardProps) {
  return <Card onClick={onClick}>
      <div className="flex items-start justify-between mb-3">
        <div>
          <h3 className="text-xl font-bold text-gray-900">{patient.alias}</h3>
          <p className="text-gray-600 mt-1">
            {sector.name} - Cama {patient.bed}
          </p>
        </div>
        <Badge variant="support" type={patient.supportType}>
          {supportTypeLabels[patient.supportType]}
        </Badge>
      </div>
      <div className="flex items-center gap-2 text-gray-600">
        <ActivityIcon className="w-5 h-5" />
        <span>
          {scoreCount} registro{scoreCount !== 1 ? 's' : ''}
        </span>
      </div>
    </Card>;
}