import { useState } from 'react';

interface ColorData {
  name: string;
  color: string;
}

interface ColorChipProps {
  data: ColorData;
  arc: {
    startAngle: number;
    endAngle: number;
    innerRadius: number;
    outerRadius: number;
  };
  isVivid: boolean;
}

interface ColorWheelProps {
  toneName: string;
  toneTitle: string;
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

function createArcPath(innerRadius: number, outerRadius: number, startAngle: number, endAngle: number): string {
  const x1 = Math.cos(startAngle) * outerRadius;
  const y1 = Math.sin(startAngle) * outerRadius;
  const x2 = Math.cos(endAngle) * outerRadius;
  const y2 = Math.sin(endAngle) * outerRadius;
  const x3 = Math.cos(endAngle) * innerRadius;
  const y3 = Math.sin(endAngle) * innerRadius;
  const x4 = Math.cos(startAngle) * innerRadius;
  const y4 = Math.sin(startAngle) * innerRadius;
  
  const largeArcFlag = endAngle - startAngle <= Math.PI ? "0" : "1";
  
  return [
    "M", x1, y1,
    "A", outerRadius, outerRadius, 0, largeArcFlag, 1, x2, y2,
    "L", x3, y3,
    "A", innerRadius, innerRadius, 0, largeArcFlag, 0, x4, y4,
    "Z"
  ].join(" ");
}

function ColorChip({ data, arc, isVivid }: ColorChipProps) {
  const [isHovered, setIsHovered] = useState(false);
  
  const handleClick = () => {
    navigator.clipboard.writeText(data.color);
  };
  
  const currentOuterRadius = isHovered ? arc.outerRadius * 1.1 : arc.outerRadius;
  const currentInnerRadius = arc.innerRadius;
  
  const pathData = createArcPath(currentInnerRadius, currentOuterRadius, arc.startAngle, arc.endAngle);
  
  const midAngle = (arc.startAngle + arc.endAngle) / 2;
  const textRadius = isHovered ? (currentOuterRadius + currentInnerRadius) / 2 * 1.05 : (currentOuterRadius + currentInnerRadius) / 2;
  const textX = Math.cos(midAngle) * textRadius;
  const textY = Math.sin(midAngle) * textRadius;
  
  const textColor = getBlackOrWhite(data.color);
  
  return (
    <g
      className="cursor-pointer"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={handleClick}
    >
      <path
        d={pathData}
        fill={data.color}
        stroke="white"
        strokeWidth="4"
        style={{
          transition: 'all 0.1s ease'
        }}
      />
      <text
        x={textX}
        y={textY}
        textAnchor="middle"
        dominantBaseline="middle"
        fill={textColor}
        fontSize={isVivid ? "14px" : "12px"}
        fontWeight="bold"
        style={{
          transition: 'all 0.1s ease'
        }}
      >
        {data.name}
      </text>
      {isHovered && (
        <text
          x={textX}
          y={textY + 12}
          textAnchor="middle"
          dominantBaseline="middle"
          fill={textColor}
          fontSize="10px"
        >
          {data.color}
        </text>
      )}
    </g>
  );
}

export default function ColorWheel({ toneName, toneTitle, colors, x, y }: ColorWheelProps) {
  const isVivid = toneName === 'v';
  const outerRadius = isVivid ? 160 : 90;
  const innerRadius = isVivid ? 100 : 50;
  
  const chipCount = isVivid ? 24 : 12;
  const chipAngle = (Math.PI * 2) / chipCount;
  const chipSkipCount = isVivid ? chipCount / 4 * 3 - 1 - 0.5 : chipCount / 4 * 3 - 0.5;
  const startAngle = chipAngle * chipSkipCount;
  
  return (
    <g transform={`translate(${x},${y})`}>
      <text
        x="0"
        y="0.25em"
        textAnchor="middle"
        dominantBaseline="middle"
        fontSize={isVivid ? "80px" : "40px"}
        fill="#222"
      >
        {toneName}
      </text>
      <text
        x="0"
        y="1.8em"
        textAnchor="middle"
        dominantBaseline="middle"
        fontSize={isVivid ? "24px" : "16px"}
        fill="#777"
      >
        {toneTitle}
      </text>
      {colors.map((color, index) => {
        const angleStart = startAngle + index * chipAngle;
        const angleEnd = angleStart + chipAngle;
        
        return (
          <ColorChip
            key={color.name}
            data={color}
            arc={{
              startAngle: angleStart,
              endAngle: angleEnd,
              innerRadius,
              outerRadius
            }}
            isVivid={isVivid}
          />
        );
      })}
    </g>
  );
}
