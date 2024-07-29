import React from 'react';

interface ButtonProps {
  text: string;
  onClick?: () => void;
  disabled?: boolean;
}

export default function Button({ text, onClick, disabled=false }: ButtonProps): React.ReactElement {
  return (
    <button
      onClick={onClick}
      className="w-full p-3 bg-black/60 text-white font-semibold rounded-lg hover:bg-black cursor-pointer transition-all duration-300 disabled:bg-neutral-400"
      disabled={disabled}
    >{text}</button>
  );
}