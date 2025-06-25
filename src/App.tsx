import { useState, useEffect } from 'react'
import './App.css'

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

interface ColorWheelProps {
  toneName: string;
  toneTitle: string;
  colors: ColorData[];
  x: number;
  y: number;
}

function ColorWheel({ toneName, toneTitle, colors, x, y }: ColorWheelProps) {
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

interface NeutralColorsProps {
  colors: ColorData[];
  x: number;
  y: number;
}

function NeutralColors({ colors, x, y }: NeutralColorsProps) {
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

function App() {
  const [colors, setColors] = useState<ColorData[]>([]);
  
  useEffect(() => {
    fetch('/colors.csv')
      .then(response => response.text())
      .then(text => {
        const lines = text.trim().split('\n');
        const colorData = lines.slice(1).map(line => {
          const values = line.split(',');
          return {
            name: values[0],
            color: values[1]
          };
        }).filter(item => item.name && item.color);
        setColors(colorData);
      });
  }, []);
  
  const filterColors = (pattern: RegExp) => {
    return colors.filter(color => pattern.test(color.name));
  };
  
  const neutralPattern = /^(W|Bk|Gy-[\.0-9]*)$/;
  const neutralColors = filterColors(neutralPattern);
  
  return (
    <div className="min-h-screen" style={{ 
      background: 'url(/img/bg.jpg)',
      fontFamily: '"PT Sans", Frutiger, Myriad, "Segoe UI", "Noto Sans Japanese", Meiryo, sans-serif'
    }}>
      <div className="bg-gray-800 text-gray-200 p-4">
        <h1 className="text-lg">pcolors - Hue/Tone Color Selector （ヒュー・トーン カラーセレクター）</h1>
      </div>
      
      <div className="relative w-[1200px] h-[800px] mx-auto bg-white">
        <svg width="1200" height="800" className="absolute inset-0">
          {colors.length > 0 && (
            <>
              <ColorWheel
                toneName="v"
                toneTitle="vivid"
                colors={filterColors(/^v\d/)}
                x={970}
                y={400}
              />
              
              <ColorWheel
                toneName="b"
                toneTitle="bright"
                colors={filterColors(/^b\d/)}
                x={680}
                y={190}
              />
              <ColorWheel
                toneName="s"
                toneTitle="strong"
                colors={filterColors(/^s\d/)}
                x={680}
                y={400}
              />
              <ColorWheel
                toneName="dp"
                toneTitle="deep"
                colors={filterColors(/^dp\d/)}
                x={680}
                y={610}
              />
              
              <ColorWheel
                toneName="lt+"
                toneTitle="light"
                colors={filterColors(/^lt\d/)}
                x={480}
                y={100}
              />
              <ColorWheel
                toneName="sf"
                toneTitle="soft"
                colors={filterColors(/^sf\d/)}
                x={480}
                y={300}
              />
              <ColorWheel
                toneName="d"
                toneTitle="dull"
                colors={filterColors(/^d\d/)}
                x={480}
                y={500}
              />
              <ColorWheel
                toneName="dk"
                toneTitle="dark"
                colors={filterColors(/^dk\d/)}
                x={480}
                y={700}
              />
              
              <ColorWheel
                toneName="p+"
                toneTitle="pale"
                colors={filterColors(/^p\d/)}
                x={270}
                y={100}
              />
              <ColorWheel
                toneName="ltg"
                toneTitle="lightgrayish"
                colors={filterColors(/^ltg\d/)}
                x={270}
                y={300}
              />
              <ColorWheel
                toneName="g"
                toneTitle="grayish"
                colors={filterColors(/^g\d/)}
                x={270}
                y={500}
              />
              <ColorWheel
                toneName="dkg"
                toneTitle="darkgrayish"
                colors={filterColors(/^dkg\d/)}
                x={270}
                y={700}
              />
              
              <NeutralColors
                colors={neutralColors}
                x={70}
                y={12}
              />
            </>
          )}
        </svg>
        
        <div className="absolute right-12 bottom-5 w-64 text-gray-400">
          <h2 className="text-xs mb-2">おことわり</h2>
          <ul className="text-xs leading-tight space-y-1 pl-4">
            <li>本ページに表示されている色は、PCCS公式のものではなく、近い色を表示しているものです。簡易に色を選択することを目的としており、正確さを提供するものではありません。</li>
            <li>本ページは、「配色 & カラーデザイン プロに学ぶ、一生枯れない永久不滅テクニック (SoftBank Creative) を参考に作成しました。</li>
          </ul>
        </div>
      </div>
    </div>
  );
}

export default App
