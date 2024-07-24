import React from 'react';

interface ButtonProps {
  text: string;
  onClick?: () => void;
}

export default function Button({ text, onClick }: ButtonProps): React.ReactElement {
  return (
    <input
      type="submit"
      onClick={onClick}
      className="w-full p-3 bg-primary text-white font-semibold rounded-lg hover:bg-neutral-900 cursor-pointer transition-all duration-300"
      value={text}
    />
  );
}