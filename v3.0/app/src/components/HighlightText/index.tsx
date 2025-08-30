import React from 'react';

interface HighlightProps {
  text: string;
  search: string;
}

const Highlight: React.FC<HighlightProps> = ({ text, search }) => {
  if (!text) return null;
  if (!search) return <>{text}</>;

  const parts = text.split(new RegExp(`(${search})`, 'gi'));

  return (
    <span>
      {parts.map((part, index) => 
        part.toLowerCase() === search.toLowerCase() ? (
          <mark key={index}>{part}</mark>
        ) : (
          part
        )
      )}
    </span>
  );
};

export default Highlight;