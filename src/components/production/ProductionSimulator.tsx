import React, { useState } from 'react';
import './ProductionSimulator.css'; // Archivo CSS para estilos y animaciones

const MACHINE_OPTIONS = [
  { value: 'grande', label: 'Máquina Grande' },
  { value: 'ambas', label: 'Ambas Máquinas' },
];

const ProductionSimulator: React.FC = () => {
  const [machineMode, setMachineMode] = useState<'grande' | 'ambas'>('grande');

  return (
    <div className="production-simulator">
      <h2>Producción</h2>
      <div style={{ marginBottom: 24 }}>
        <span style={{ fontWeight: 500, marginRight: 12 }}>Selecciona máquina activa:</span>
        <div style={{ display: 'inline-flex', gap: 8 }}>
          {MACHINE_OPTIONS.map(opt => (
            <label key={opt.value} style={{ display: 'inline-flex', alignItems: 'center', cursor: 'pointer', fontWeight: machineMode === opt.value ? 600 : 400 }}>
              <input
                type="radio"
                name="machineMode"
                value={opt.value}
                checked={machineMode === opt.value}
                onChange={() => setMachineMode(opt.value as 'grande' | 'ambas')}
                style={{ accentColor: '#2563eb', marginRight: 6 }}
              />
              {opt.label}
            </label>
          ))}
        </div>
      </div>
      {/* Mensajes informativos removidos por preferencia del usuario */}
    </div>
  );
};

export default ProductionSimulator;
