import React, { useState } from 'react';
import CardEditor from './components/CardEditor';
import CardPreview from './components/CardPreview';
import { INITIAL_DATA } from './constants';
import { BusinessCardData } from './types';

function App() {
  const [data, setData] = useState<BusinessCardData>(INITIAL_DATA);

  return (
    <div className="flex flex-col md:flex-row h-screen w-full overflow-hidden bg-[#e0e0e0]">
      {/* Sidebar Editor (Hidden in Print) */}
      <div className="no-print h-full md:w-[400px] z-20 shadow-2xl">
        <CardEditor data={data} onChange={setData} />
      </div>

      {/* Main Preview Area */}
      <main className="flex-1 h-full overflow-auto relative flex items-center justify-center p-4 md:p-12">
        <div className="transform scale-[0.5] md:scale-[0.6] lg:scale-[0.8] origin-center transition-transform duration-300 ease-out">
          <CardPreview data={data} />
        </div>
        
        {/* Mobile-only instruction overlay */}
        <div className="absolute bottom-4 left-0 w-full text-center md:hidden pointer-events-none text-gray-500 text-xs no-print">
          Scroll down to edit
        </div>
      </main>
    </div>
  );
}

export default App;
