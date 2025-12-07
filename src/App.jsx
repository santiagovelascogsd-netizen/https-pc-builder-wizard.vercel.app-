import React, { useState } from 'react';
import Procesador from './components/Procesador';

// ----- Datos -----
const CPUs = [
  { marca: 'AMD', modelo: 'Ryzen 5 5600X', generacion: 'Zen 3', socket: 'AM4', consumo: 65 },
  { marca: 'AMD', modelo: 'Ryzen 7 5800X', generacion: 'Zen 3', socket: 'AM4', consumo: 105 },
  { marca: 'AMD', modelo: 'Ryzen 9 5900X', generacion: 'Zen 3', socket: 'AM4', consumo: 105 },
  { marca: 'AMD', modelo: 'Ryzen 5 7600X', generacion: 'Zen 4', socket: 'AM5', consumo: 105 },
  { marca: 'AMD', modelo: 'Ryzen 7 7700X', generacion: 'Zen 4', socket: 'AM5', consumo: 120 },
  { marca: 'INTEL', modelo: 'i5-12600K', generacion: 'Alder Lake', socket: 'LGA1700', consumo: 125 },
  { marca: 'INTEL', modelo: 'i7-12700K', generacion: 'Alder Lake', socket: 'LGA1700', consumo: 125 },
  { marca: 'INTEL', modelo: 'i9-12900K', generacion: 'Alder Lake', socket: 'LGA1700', consumo: 125 },
  { marca: 'INTEL', modelo: 'i5-13600K', generacion: 'Raptor Lake', socket: 'LGA1700', consumo: 125 },
  { marca: 'INTEL', modelo: 'i7-13700K', generacion: 'Raptor Lake', socket: 'LGA1700', consumo: 125 },
];

const Motherboards = [
  { modelo: 'ASUS B550', socket: 'AM4', tamano: 'ATX' },
  { modelo: 'MSI B550', socket: 'AM4', tamano: 'ATX' },
  { modelo: 'Gigabyte X570', socket: 'AM4', tamano: 'ATX' },
  { modelo: 'ASUS X670', socket: 'AM5', tamano: 'ATX' },
  { modelo: 'MSI X670', socket: 'AM5', tamano: 'ATX' },
  { modelo: 'ASUS Z690', socket: 'LGA1700', tamano: 'ATX' },
  { modelo: 'MSI Z690', socket: 'LGA1700', tamano: 'ATX' },
  { modelo: 'Gigabyte Z690', socket: 'LGA1700', tamano: 'ATX' },
];

const GPUs = [
  ...Array.from({ length: 10 }, (_, i) => ({ marca: 'NVIDIA', modelo: `RTX 30${i}00`, consumo: 200 })),
  ...Array.from({ length: 10 }, (_, i) => ({ marca: 'NVIDIA', modelo: `RTX 40${i}00`, consumo: 250 })),
  ...Array.from({ length: 10 }, (_, i) => ({ marca: 'NVIDIA', modelo: `RTX 50${i}00`, consumo: 300 })),
  ...Array.from({ length: 10 }, (_, i) => ({ marca: 'Radeon', modelo: `RX 6${i}00`, consumo: 180 })),
  ...Array.from({ length: 10 }, (_, i) => ({ marca: 'Radeon', modelo: `RX 7${i}00`, consumo: 200 })),
  ...Array.from({ length: 10 }, (_, i) => ({ marca: 'Radeon', modelo: `RX 8${i}00`, consumo: 220 })),
  ...Array.from({ length: 10 }, (_, i) => ({ marca: 'Radeon', modelo: `RX 9${i}00`, consumo: 250 })),
];

const RAMs = ['8GB DDR4', '16GB DDR4', '32GB DDR4', '64GB DDR4', '128GB DDR4'];
const Storage = ['SSD 500GB', 'SSD 1TB', 'HDD 1TB', 'HDD 2TB'];

const PSUs = [
  ...['Bronze', 'Silver', 'Gold', 'Platinum', 'Titanium'].flatMap(cert =>
    Array.from({ length: 5 }, (_, i) => ({ modelo: `${cert} ${550 + i * 50}W`, potencia: 550 + i * 50, cert }))
  )
];

const Cooling = {
  Aire: [{ modelo: 'Stock' }, { modelo: 'Cooler Master Hyper 212' }, { modelo: 'Noctua NH-U12S' }],
  Liquida: [{ modelo: 'Corsair H100i' }, { modelo: 'NZXT Kraken X63' }],
};

const Cases = [
  { modelo: 'Mini Tower 1', tamano: 'Mini-ATX', liquidaOk: true },
  { modelo: 'Mini Tower 2', tamano: 'Mini-ATX', liquidaOk: true },
  { modelo: 'ATX Mid Tower 1', tamano: 'ATX', liquidaOk: true },
  { modelo: 'ATX Mid Tower 2', tamano: 'ATX', liquidaOk: true },
  { modelo: 'ATX Mid Tower 3', tamano: 'ATX', liquidaOk: true },
  { modelo: 'E-ATX Tower 1', tamano: 'E-ATX', liquidaOk: true },
  { modelo: 'E-ATX Tower 2', tamano: 'E-ATX', liquidaOk: true },
  { modelo: 'E-ATX Tower 3', tamano: 'E-ATX', liquidaOk: true },
  { modelo: 'E-ATX Tower 4', tamano: 'E-ATX', liquidaOk: true },
  { modelo: 'E-ATX Tower 5', tamano: 'E-ATX', liquidaOk: true },
];

// ----- App -----
function App() {
  const [step, setStep] = useState(1);
  const [marca, setMarca] = useState('');
  const [cpu, setCpu] = useState(null);
  const [motherboard, setMotherboard] = useState(null);
  const [gpuMarca, setGpuMarca] = useState('');
  const [gpu, setGpu] = useState(null);
  const [ram, setRam] = useState('');
  const [storage, setStorage] = useState('');
  const [tipoCooling, setTipoCooling] = useState('');
  const [refrigeracion, setRefrigeracion] = useState(null);
  const [psu, setPsu] = useState(null);
  const [pcCase, setPcCase] = useState(null);

  const renderBlock = (label, color, onClick) => (
    <div
      onClick={onClick}
      style={{
        minWidth: '140px',
        height: '140px',
        backgroundColor: color,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: '12px',
        cursor: 'pointer',
        fontWeight: 'bold',
        fontSize: '14px',
        color: 'white',
        boxShadow: '0 4px 8px rgba(0,0,0,0.2)',
        transition: 'transform 0.2s, box-shadow 0.2s',
        whiteSpace: 'pre-line',
        textAlign: 'center',
        margin: '0 auto',
      }}
      onMouseEnter={e => { e.currentTarget.style.transform = 'scale(1.05)'; e.currentTarget.style.boxShadow = '0 8px 16px rgba(0,0,0,0.3)'; }}
      onMouseLeave={e => { e.currentTarget.style.transform = 'scale(1)'; e.currentTarget.style.boxShadow = '0 4px 8px rgba(0,0,0,0.2)'; }}
    >
      <span>{label}</span>
    </div>
  );

const renderCarousel = (items, colorFn, onClickFn) => (
  <div style={{
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    flexWrap: 'wrap',     // <<-- hace que bajen las filas
    gap: '20px',
    padding: '10px',
    margin: '20px auto',
    width: '100%',        // <<-- evita overflow
    overflow: 'hidden'    // <<-- quita la barra de desplazamiento
  }}>
    {items.map(item =>
      renderBlock(
        item.label || item.modelo || item,
        colorFn(item),
        () => onClickFn(item)
      )
    )}
  </div>
);


  const BackButton = ({ onClick }) => (
    <div style={{ marginTop: '20px', textAlign: 'center' }}>
      <button
        style={{
          padding: '10px 20px',
          borderRadius: '8px',
          border: 'none',
          backgroundColor: '#555',
          color: 'white',
          cursor: 'pointer',
          fontSize: '16px'
        }}
        onClick={onClick}
      >
        ← Regresar
      </button>
    </div>
  );

  const totalConsumo = (cpu ? cpu.consumo : 0) + (gpu ? gpu.consumo : 0);
return(
 <div
  style={{
    width: "100vw",
    height: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "column",
    textAlign: "center"
  }}
>
    <div>
      <h1>PC Builder Wizard</h1>

      {step === 1 && renderCarousel(['AMD', 'INTEL'], m => m === 'AMD' ? 'red' : 'blue', m => { setMarca(m); setStep(2); })}

      {step === 2 && (
        <>
          <h2>Selecciona tu CPU ({marca})</h2>
          {renderCarousel(CPUs.filter(c => c.marca === marca), () => marca === 'AMD' ? 'orange' : 'skyblue', c => { setCpu(c); setStep(3); })}
          <BackButton onClick={() => setStep(1)} />
        </>
      )}

      {step === 3 && cpu && (
        <>
          <h2>Selecciona tu Motherboard ({cpu.socket})</h2>
          {renderCarousel(Motherboards.filter(m => m.socket === cpu.socket), () => 'purple', m => { setMotherboard(m); setStep(4); })}
          <BackButton onClick={() => setStep(2)} />
        </>
      )}

      {step === 4 && motherboard && (
        <>
          <h2>Selecciona la marca de GPU</h2>
          {renderCarousel(['NVIDIA', 'Radeon'], m => m === 'NVIDIA' ? 'red' : 'purple', m => { setGpuMarca(m); setStep(5); })}
          <BackButton onClick={() => setStep(3)} />
        </>
      )}

      {step === 5 && gpuMarca && (
        <>
          <h2>Selecciona tu GPU ({gpuMarca})</h2>
          {renderCarousel(GPUs.filter(g => g.marca === gpuMarca), () => 'pink', g => { setGpu(g); setStep(6); })}
          <BackButton onClick={() => setStep(4)} />
        </>
      )}

      {step === 6 && (
        <>
          <h2>Selecciona tu RAM</h2>
          {renderCarousel(RAMs, () => 'lightblue', r => { setRam(r); setStep(7); })}
          <BackButton onClick={() => setStep(5)} />
        </>
      )}

      {step === 7 && (
        <>
          <h2>Selecciona tu Almacenamiento</h2>
          {renderCarousel(Storage, () => 'yellow', s => { setStorage(s); setStep(8); })}
          <BackButton onClick={() => setStep(6)} />
        </>
      )}

      {step === 8 && (
        <>
          <h2>Selecciona tu tipo de refrigeración</h2>
          {renderCarousel(Object.keys(Cooling), t => t === 'Aire' ? 'gray' : 'teal', t => { setTipoCooling(t); setStep(9); })}
          <BackButton onClick={() => setStep(7)} />
        </>
      )}

      {step === 9 && tipoCooling && (
        <>
          <h2>Selecciona tu modelo de refrigeración ({tipoCooling})</h2>
          {renderCarousel(Cooling[tipoCooling], () => tipoCooling === 'Aire' ? 'gray' : 'teal', c => { setRefrigeracion(c); setStep(10); })}
          <BackButton onClick={() => setStep(8)} />
        </>
      )}

      {step === 10 && (
        <>
          <h2>Selecciona tu Fuente recomendada (consumo: {totalConsumo}W)</h2>
          {renderCarousel(PSUs.filter(p => p.potencia >= totalConsumo), () => 'brown', p => { setPsu(p); setStep(11); })}
          <BackButton onClick={() => setStep(9)} />
        </>
      )}

      {step === 11 && motherboard && refrigeracion && (
        <>
          <h2>Selecciona tu Gabinete compatible</h2>
          {renderCarousel(
            Cases.filter(c =>
              c.tamano === motherboard.tamano &&
              (refrigeracion.modelo.includes('Liquida') ? c.liquidaOk : true)
            ),
            () => 'darkgreen',
            c => { setPcCase(c); setStep(12); }
          )}
          <BackButton onClick={() => setStep(10)} />
        </>
      )}

      {step === 12 && (
        <div>
          <h2>Resumen de tu PC</h2>
          <p>Marca: {marca}</p>
          <p>CPU: {cpu.modelo} ({cpu.generacion})</p>
          <p>Motherboard: {motherboard.modelo}</p>
          <p>GPU: {gpu.modelo}</p>
          <p>RAM: {ram}</p>
          <p>Almacenamiento: {storage}</p>
          <p>Refrigeración: {refrigeracion.modelo}</p>
          <p>Fuente: {psu.modelo} ({psu.cert})</p>
          <p>Gabinete: {pcCase.modelo}</p>
          <BackButton onClick={() => setStep(11)} />
        </div>
      )}
    </div>

  </div>
);
}

export default App;
