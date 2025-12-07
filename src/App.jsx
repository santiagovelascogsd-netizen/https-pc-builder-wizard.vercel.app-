import React, { useEffect, useState } from 'react';
import jsPDF from 'jspdf';

/***** DATOS (con precios y estructuras compatibles) *****/
const CPUs = [
  { marca: 'AMD', modelo: 'Ryzen 5 5600X', generacion: 'Zen 3', socket: 'AM4', consumo: 65, precio: 150 },
  { marca: 'AMD', modelo: 'Ryzen 7 5800X', generacion: 'Zen 3', socket: 'AM4', consumo: 105, precio: 250 },
  { marca: 'AMD', modelo: 'Ryzen 9 5900X', generacion: 'Zen 3', socket: 'AM4', consumo: 105, precio: 350 },
  { marca: 'AMD', modelo: 'Ryzen 5 7600X', generacion: 'Zen 4', socket: 'AM5', consumo: 105, precio: 280 },
  { marca: 'AMD', modelo: 'Ryzen 7 7700X', generacion: 'Zen 4', socket: 'AM5', consumo: 120, precio: 380 },
  { marca: 'INTEL', modelo: 'i5-12600K', generacion: 'Alder Lake', socket: 'LGA1700', consumo: 125, precio: 260 },
  { marca: 'INTEL', modelo: 'i7-12700K', generacion: 'Alder Lake', socket: 'LGA1700', consumo: 125, precio: 350 },
  { marca: 'INTEL', modelo: 'i9-12900K', generacion: 'Alder Lake', socket: 'LGA1700', consumo: 125, precio: 480 },
  { marca: 'INTEL', modelo: 'i5-13600K', generacion: 'Raptor Lake', socket: 'LGA1700', consumo: 125, precio: 310 },
  { marca: 'INTEL', modelo: 'i7-13700K', generacion: 'Raptor Lake', socket: 'LGA1700', consumo: 125, precio: 420 },
];

const Motherboards = [
  { modelo: 'ASUS B550', socket: 'AM4', tamano: 'ATX', precio: 120 },
  { modelo: 'MSI B550', socket: 'AM4', tamano: 'ATX', precio: 130 },
  { modelo: 'Gigabyte X570', socket: 'AM4', tamano: 'ATX', precio: 180 },
  { modelo: 'ASUS X670', socket: 'AM5', tamano: 'ATX', precio: 250 },
  { modelo: 'MSI X670', socket: 'AM5', tamano: 'ATX', precio: 260 },
  { modelo: 'ASUS Z690', socket: 'LGA1700', tamano: 'ATX', precio: 240 },
  { modelo: 'MSI Z690', socket: 'LGA1700', tamano: 'ATX', precio: 230 },
  { modelo: 'Gigabyte Z690', socket: 'LGA1700', tamano: 'ATX', precio: 220 },
];

const GPUs = [
  ...Array.from({ length: 10 }, (_, i) => ({ marca: 'NVIDIA', modelo: `RTX 30${i}00`, consumo: 200, precio: 300 + i * 20 })),
  ...Array.from({ length: 10 }, (_, i) => ({ marca: 'NVIDIA', modelo: `RTX 40${i}00`, consumo: 250, precio: 500 + i * 25 })),
  ...Array.from({ length: 10 }, (_, i) => ({ marca: 'NVIDIA', modelo: `RTX 50${i}00`, consumo: 300, precio: 700 + i * 30 })),
  ...Array.from({ length: 10 }, (_, i) => ({ marca: 'Radeon', modelo: `RX 6${i}00`, consumo: 180, precio: 250 + i * 20 })),
  ...Array.from({ length: 10 }, (_, i) => ({ marca: 'Radeon', modelo: `RX 7${i}00`, consumo: 200, precio: 350 + i * 25 })),
  ...Array.from({ length: 10 }, (_, i) => ({ marca: 'Radeon', modelo: `RX 8${i}00`, consumo: 220, precio: 450 + i * 25 })),
  ...Array.from({ length: 10 }, (_, i) => ({ marca: 'Radeon', modelo: `RX 9${i}00`, consumo: 250, precio: 550 + i * 30 })),
];

const RAMs = [
  { label: '8GB DDR4', precio: 25 },
  { label: '16GB DDR4', precio: 40 },
  { label: '32GB DDR4', precio: 70 },
  { label: '64GB DDR4', precio: 130 },
  { label: '128GB DDR4', precio: 250 },
];

const Storage = [
  { label: 'SSD 500GB', precio: 30 },
  { label: 'SSD 1TB', precio: 50 },
  { label: 'HDD 1TB', precio: 40 },
  { label: 'HDD 2TB', precio: 60 },
];

const PSUs = [
  ...['Bronze', 'Silver', 'Gold', 'Platinum', 'Titanium'].flatMap(cert =>
    Array.from({ length: 5 }, (_, i) => ({ modelo: `${cert} ${550 + i * 50}W`, potencia: 550 + i * 50, cert, precio: 60 + i * 10 }) )
  )
];

const Cooling = {
  Aire: [{ modelo: 'Stock', precio: 0 }, { modelo: 'Cooler Master Hyper 212', precio: 40 }, { modelo: 'Noctua NH-U12S', precio: 80 }],
  Liquida: [{ modelo: 'Corsair H100i', precio: 120 }, { modelo: 'NZXT Kraken X63', precio: 150 }],
};

const Cases = [
  { modelo: 'Mini Tower 1', tamano: 'Mini-ATX', liquidaOk: true, precio: 50 },
  { modelo: 'Mini Tower 2', tamano: 'Mini-ATX', liquidaOk: true, precio: 55 },
  { modelo: 'ATX Mid Tower 1', tamano: 'ATX', liquidaOk: true, precio: 70 },
  { modelo: 'ATX Mid Tower 2', tamano: 'ATX', liquidaOk: true, precio: 75 },
  { modelo: 'ATX Mid Tower 3', tamano: 'ATX', liquidaOk: true, precio: 80 },
  { modelo: 'E-ATX Tower 1', tamano: 'E-ATX', liquidaOk: true, precio: 90 },
  { modelo: 'E-ATX Tower 2', tamano: 'E-ATX', liquidaOk: true, precio: 95 },
  { modelo: 'E-ATX Tower 3', tamano: 'E-ATX', liquidaOk: true, precio: 100 },
  { modelo: 'E-ATX Tower 4', tamano: 'E-ATX', liquidaOk: true, precio: 110 },
  { modelo: 'E-ATX Tower 5', tamano: 'E-ATX', liquidaOk: true, precio: 120 },
];

/***** APP PRINCIPAL *****/
function App() {
  const [step, setStep] = useState(1);
  const [marca, setMarca] = useState('');
  const [cpu, setCpu] = useState(null);
  const [motherboard, setMotherboard] = useState(null);
  const [gpuMarca, setGpuMarca] = useState('');
  const [gpu, setGpu] = useState(null);
  const [ram, setRam] = useState(null);
  const [storage, setStorage] = useState(null);
  const [tipoCooling, setTipoCooling] = useState('');
  const [refrigeracion, setRefrigeracion] = useState(null);
  const [psu, setPsu] = useState(null);
  const [pcCase, setPcCase] = useState(null);
  const [warnings, setWarnings] = useState([]);

  // parse URL params to prefill configuration (opcional y útil para permalinks)
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const cpuParam = params.get('cpu');
    const gpuParam = params.get('gpu');
    const mbParam = params.get('motherboard');
    const ramParam = params.get('ram');
    const storageParam = params.get('storage');
    const coolingParam = params.get('cooling');
    const psuParam = params.get('psu');
    const caseParam = params.get('case');
    const marcaParam = params.get('marca');

    if (marcaParam) setMarca(marcaParam);
    if (cpuParam) {
      const found = CPUs.find(c => c.modelo === cpuParam);
      if (found) setCpu(found);
    }
    if (gpuParam) {
      const found = GPUs.find(g => g.modelo === gpuParam);
      if (found) setGpu(found);
    }
    if (mbParam) {
      const found = Motherboards.find(m => m.modelo === mbParam);
      if (found) setMotherboard(found);
    }
    if (ramParam) {
      const found = RAMs.find(r => r.label === ramParam);
      if (found) setRam(found);
    }
    if (storageParam) {
      const found = Storage.find(s => s.label === storageParam);
      if (found) setStorage(found);
    }
    if (coolingParam) {
      // find in either cooling type
      const foundA = Cooling.Aire.find(c => c.modelo === coolingParam);
      const foundL = Cooling.Liquida.find(c => c.modelo === coolingParam);
      if (foundA) { setTipoCooling('Aire'); setRefrigeracion(foundA); }
      else if (foundL) { setTipoCooling('Liquida'); setRefrigeracion(foundL); }
    }
    if (psuParam) {
      const found = PSUs.find(p => p.modelo === psuParam);
      if (found) setPsu(found);
    }
    if (caseParam) {
      const found = Cases.find(c => c.modelo === caseParam);
      if (found) setPcCase(found);
    }
  }, []);

  // small helper para obtener label de un item (obj / string)
  const getLabel = (item) => {
    if (!item) return '';
    if (typeof item === 'string') return item;
    if (item.label) return item.label;
    if (item.modelo) return item.modelo;
    return String(item);
  };

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
      onMouseEnter={e => { e.currentTarget.style.transform = 'scale(1.05)'; e.currentTarget.style.boxShadow = '0 6px 14px rgba(0,0,0,0.3)'; }}
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
      {items.map((item, idx) =>
        renderBlock(
          getLabel(item),
          colorFn(item),
          () => onClickFn(item, idx)
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

  // consumo total (W)
  const totalConsumo = (cpu ? cpu.consumo : 0) + (gpu ? gpu.consumo : 0);

  // precio total (suma componentes seleccionados)
  const totalPrecio =
    (cpu?.precio || 0) +
    (motherboard?.precio || 0) +
    (gpu?.precio || 0) +
    (ram?.precio || 0) +
    (storage?.precio || 0) +
    (refrigeracion?.precio || 0) +
    (psu?.precio || 0) +
    (pcCase?.precio || 0);

  // generar link compartible con params
  const copyConfigLink = () => {
    const params = new URLSearchParams();
    if (marca) params.set('marca', marca);
    if (cpu) params.set('cpu', cpu.modelo);
    if (motherboard) params.set('motherboard', motherboard.modelo);
    if (gpu) params.set('gpu', gpu.modelo);
    if (ram) params.set('ram', ram.label);
    if (storage) params.set('storage', storage.label);
    if (refrigeracion) params.set('cooling', refrigeracion.modelo);
    if (psu) params.set('psu', psu.modelo);
    if (pcCase) params.set('case', pcCase.modelo);

    const url = `${window.location.origin}${window.location.pathname}?${params.toString()}`;
    navigator.clipboard.writeText(url).then(() => {
      alert('Link copiado al portapapeles');
    }).catch(() => {
      prompt('Copia manualmente este link:', url);
    });
  };

  // exportar resumen a PDF (simple)
  const exportPDF = () => {
    const doc = new jsPDF();
    doc.setFontSize(14);
    doc.text('Resumen de PC', 10, 10);
    let y = 20;
    const pushLine = (label, value) => {
      doc.setFontSize(11);
      doc.text(`${label}: ${value}`, 10, y);
      y += 8;
      if (y > 280) { doc.addPage(); y = 10; }
    };

    pushLine('Marca', marca || '-');
    pushLine('CPU', cpu ? `${cpu.modelo} (${cpu.precio ? '$' + cpu.precio : '—'})` : '-');
    pushLine('Motherboard', motherboard ? `${motherboard.modelo} (${motherboard.precio ? '$' + motherboard.precio : '—'})` : '-');
    pushLine('GPU', gpu ? `${gpu.modelo} (${gpu.precio ? '$' + gpu.precio : '—'})` : '-');
    pushLine('RAM', ram ? `${ram.label} (${ram.precio ? '$' + ram.precio : '—'})` : '-');
    pushLine('Almacenamiento', storage ? `${storage.label} (${storage.precio ? '$' + storage.precio : '—'})` : '-');
    pushLine('Refrigeración', refrigeracion ? `${refrigeracion.modelo} (${refrigeracion.precio ? '$' + refrigeracion.precio : '—'})` : '-');
    pushLine('Fuente (PSU)', psu ? `${psu.modelo} (${psu.precio ? '$' + psu.precio : '—'})` : '-');
    pushLine('Gabinete', pcCase ? `${pcCase.modelo} (${pcCase.precio ? '$' + pcCase.precio : '—'})` : '-');
    pushLine('Consumo estimado (W)', `${totalConsumo} W`);
    pushLine('Precio estimado total', `$ ${totalPrecio} USD`);
    if (warnings.length) {
      pushLine('Advertencias', warnings.join('; '));
    }
    doc.save('cotizacion_pc.pdf');
  };

  // RUTINA de warnings / validaciones simples
  useEffect(() => {
    const w = [];
    // Si CPU y motherboard existen, verificar socket
    if (cpu && motherboard && cpu.socket !== motherboard.socket) {
      w.push('Socket de CPU y motherboard no coinciden.');
    }
    // RAM DDR compat with CPU generation (ejemplo simple)
    if (cpu && ram) {
      // asumimos: Ryzen Zen 4 necesita DDR5 -> avisar si RAM contiene DDR4
      if (cpu.generacion?.toLowerCase().includes('zen 4') && ram.label.includes('DDR4')) {
        w.push('Las CPUs Zen 4 (Ryzen 7000) normalmente requieren DDR5 — revisa la RAM seleccionada.');
      }
    }
    // refrigeracion líquida incompatible check (very simple)
    if (refrigeracion && refrigeracion.modelo.toLowerCase().includes('h100i') && pcCase && !pcCase.liquidaOk) {
      w.push('El gabinete no está indicado para refrigeración líquida (según datos).');
    }
    // PSU demasiado baja (seguro mínimo es totalConsumo + margen 100W)
    if (psu && psu.potencia < totalConsumo + 100) {
      w.push('La PSU seleccionada podría ser insuficiente (considera +100W de margen).');
    }
    // GPU grande vs Mini-ATX (heurística por nombre)
    if (gpu && pcCase && pcCase.tamano.toLowerCase().includes('mini') && gpu.modelo.toLowerCase().includes('500')) {
      w.push('GPU de alta gama seleccionada puede no caber en Mini-ATX.');
    }

    setWarnings(w);
  }, [cpu, motherboard, ram, refrigeracion, psu, pcCase, gpu, totalConsumo]);

  return (
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
                (refrigeracion.modelo.toLowerCase().includes('corsair') || refrigeracion.modelo.toLowerCase().includes('kraken') ? c.liquidaOk : true)
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
            <p>CPU: {cpu ? `${cpu.modelo} (${cpu.generacion}) — $${cpu.precio}` : '-'}</p>
            <p>Motherboard: {motherboard ? `${motherboard.modelo} — $${motherboard.precio}` : '-'}</p>
            <p>GPU: {gpu ? `${gpu.modelo} — $${gpu.precio}` : '-'}</p>
            <p>RAM: {ram ? `${ram.label} — $${ram.precio}` : '-'}</p>
            <p>Almacenamiento: {storage ? `${storage.label} — $${storage.precio}` : '-'}</p>
            <p>Refrigeración: {refrigeracion ? `${refrigeracion.modelo} — $${refrigeracion.precio}` : '-'}</p>
            <p>Fuente: {psu ? `${psu.modelo} (${psu.cert}) — $${psu.precio}` : '-'}</p>
            <p>Gabinete: {pcCase ? `${pcCase.modelo} — $${pcCase.precio}` : '-'}</p>

            <hr style={{ width: '80%', margin: '10px auto' }} />

            <p><strong>Consumo estimado:</strong> {totalConsumo} W</p>
            <p><strong>Precio estimado total:</strong> $ {totalPrecio} USD</p>

            {warnings.length > 0 && (
              <div style={{ color: 'orange', marginTop: '10px' }}>
                <strong>Advertencias:</strong>
                <ul style={{ textAlign: 'left', display: 'inline-block', marginLeft: '10px' }}>
                  {warnings.map((w, i) => <li key={i}>{w}</li>)}
                </ul>
              </div>
            )}

            <div style={{ marginTop: '16px', display: 'flex', justifyContent: 'center', gap: '12px', flexWrap: 'wrap' }}>
              <button
                onClick={() => setStep(11)}
                style={{ padding: '10px 16px', borderRadius: 8, border: 'none', background: '#555', color: 'white', cursor: 'pointer' }}
              >
                ← Regresar
              </button>

              <button
                onClick={copyConfigLink}
                style={{ padding: '10px 16px', borderRadius: 8, border: 'none', background: '#2b8a3e', color: 'white', cursor: 'pointer' }}
              >
                Copiar link de la configuración
              </button>

              <button
                onClick={exportPDF}
                style={{ padding: '10px 16px', borderRadius: 8, border: 'none', background: '#0b5cff', color: 'white', cursor: 'pointer' }}
              >
                Descargar cotización (PDF)
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
