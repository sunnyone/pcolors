import { useState, useEffect } from 'react'
import './App.css'
import ColorWheel from './components/ColorWheel'
import NeutralColors from './components/NeutralColors'

interface ColorData {
  name: string;
  color: string;
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
