import { useState } from 'react';

interface ColorData {
  name: string;
  color: string;
}

interface NeutralColorsProps {
  colors: ColorData[];
  x: number;
  y: number;
}

function getBlackOrWhite(bgcolor: string): string {
  const hex = bgcolor.replace('#', '');
  const r = parseInt(hex.substr(0, 2), 16);
  const g = parseInt(hex.substr(2, 2), 16);
  const b = parseInt(hex.substr(4, 2), 16);
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
  return luminance > 0.5 ? "#111" : "#eee";
}

export default function NeutralColors({ colors, x, y }: NeutralColorsProps) {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  
  const handleClick = (color: string) => {
    navigator.clipboard.writeText(color);
  };
  
  return (
    <g transform={`translate(${x},${y})`}>
      {colors.map((color, index) => {
        const rectY = index * 47;
        const textColor = getBlackOrWhite(color.color);
        const strokeColor = color.color === '#ffffff' || color.color.startsWith('#f') ? "#111" : "none";
        
        return (
          <g
            key={color.name}
            className="cursor-pointer"
            onMouseEnter={() => setHoveredIndex(index)}
            onMouseLeave={() => setHoveredIndex(null)}
            onClick={() => handleClick(color.color)}
          >
            <rect
              x="0"
              y={rectY}
              width="60"
              height="25"
              fill={color.color}
              stroke={strokeColor}
              strokeWidth="1"
            />
            <text
              x="5"
              y={rectY + 12}
              fill={textColor}
              fontSize="12px"
              fontWeight="bold"
            >
              {color.name}
            </text>
            {hoveredIndex === index && (
              <text
                x="5"
                y={rectY + 24}
                fill={textColor}
                fontSize="10px"
              >
                {color.color}
              </text>
            )}
          </g>
        );
      })}
    </g>
  );
}
