import React from 'react';

const Procesador = ({ marca, color, onSelect }) => {
  return (
    <div
      onClick={() => onSelect(marca)}
      style={{
        backgroundColor: color,
        color: 'white',
        width: '150px',
        height: '100px',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        margin: '10px',
        borderRadius: '8px',
        cursor: 'pointer',
        fontWeight: 'bold',
        fontSize: '20px',
      }}
    >
      {marca}
    </div>
  );
};

export default Procesador;