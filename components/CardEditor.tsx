import React, { useState, useRef } from 'react';
import { BusinessCardData, ServiceItem, PartnerItem } from '../types';
import { generateCardContent } from '../services/geminiService';
import { MagicIcon, PrinterIcon, TrashIcon, UploadIcon } from './Icons';
import { v4 as uuidv4 } from 'uuid';
import { PANTONE_COLORS } from '../constants';

interface CardEditorProps {
  data: BusinessCardData;
  onChange: (data: BusinessCardData) => void;
}

const CardEditor: React.FC<CardEditorProps> = ({ data, onChange }) => {
  const [prompt, setPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleInputChange = (field: keyof BusinessCardData, value: any) => {
    onChange({ ...data, [field]: value });
  };

  const handleContactChange = (field: string, value: string) => {
    onChange({
      ...data,
      contact: { ...data.contact, [field]: value },
    });
  };

  const handleServiceChange = (id: string, text: string) => {
    const newServices = data.services.map((s) => (s.id === id ? { ...s, text } : s));
    onChange({ ...data, services: newServices });
  };

  const deleteService = (id: string) => {
    const newServices = data.services.filter((s) => s.id !== id);
    onChange({ ...data, services: newServices });
  };

  const handlePartnerChange = (id: string, name: string) => {
    const newPartners = data.partners.map((p) => (p.id === id ? { ...p, name } : p));
    onChange({ ...data, partners: newPartners });
  };

  const deletePartner = (id: string) => {
    const newPartners = data.partners.filter((p) => p.id !== id);
    onChange({ ...data, partners: newPartners });
  };

  const handleQRImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        onChange({
          ...data,
          contact: { ...data.contact, qrImage: reader.result as string }
        });
      };
      reader.readAsDataURL(file);
    }
  };

  const clearQRImage = () => {
    onChange({
        ...data,
        contact: { ...data.contact, qrImage: undefined }
      });
      if (fileInputRef.current) {
          fileInputRef.current.value = '';
      }
  }

  const handleGenerate = async () => {
    if (!prompt) return;
    setIsGenerating(true);
    try {
      const newData = await generateCardContent(prompt, data);
      onChange(newData);
    } catch (e) {
      alert('Failed to generate content. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="bg-white border-r border-gray-200 h-full overflow-y-auto w-full md:w-[400px] flex-shrink-0 shadow-lg z-20">
      <div className="p-6 space-y-8">
        
        {/* Header */}
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Card Editor</h2>
          <p className="text-sm text-gray-500">WanXi Tech Style Generator</p>
        </div>

        {/* AI Generator */}
        <div className="bg-orange-50 p-4 rounded-xl border border-orange-100">
          <label className="block text-sm font-semibold text-orange-800 mb-2">
            ✨ AI Auto-Fill
          </label>
          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="e.g. A logistics company handling cross-border e-commerce solutions."
            className="w-full text-sm p-3 rounded border border-orange-200 focus:ring-2 focus:ring-orange-500 outline-none mb-3 resize-none h-20"
          />
          <button
            onClick={handleGenerate}
            disabled={isGenerating || !prompt}
            className="w-full flex items-center justify-center gap-2 bg-[#FF4400] text-white py-2 px-4 rounded font-medium text-sm hover:bg-orange-700 transition-colors disabled:opacity-50"
          >
            {isGenerating ? 'Dreaming...' : (
              <>
                <MagicIcon className="w-4 h-4" />
                Generate Content
              </>
            )}
          </button>
        </div>

        {/* Dimensions */}
        <section className="space-y-3">
             <div className="flex justify-between items-center">
                <h3 className="text-sm font-bold uppercase text-gray-400 tracking-wider">Card Width (px)</h3>
                <span className="text-xs text-gray-500">{data.cardWidth || 500}px</span>
             </div>
             <input 
                type="range" 
                min="300" 
                max="800" 
                step="10"
                value={data.cardWidth || 500}
                onChange={(e) => handleInputChange('cardWidth', parseInt(e.target.value))}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
             />
        </section>

        {/* Pantone Color Selection */}
        <section className="space-y-3">
             <h3 className="text-sm font-bold uppercase text-gray-400 tracking-wider">Pantone Color of the Year</h3>
             <div className="grid grid-cols-6 gap-2">
                 {PANTONE_COLORS.map(color => (
                     <button
                        key={color.value}
                        onClick={() => handleInputChange('themeColor', color.value)}
                        className={`w-8 h-8 rounded-full border-2 transition-transform hover:scale-110 ${data.themeColor === color.value ? 'border-gray-800 scale-110' : 'border-transparent'}`}
                        style={{ backgroundColor: color.value }}
                        title={color.name}
                     />
                 ))}
                 {/* Custom Picker */}
                 <div className="relative w-8 h-8 rounded-full overflow-hidden border-2 border-gray-200 cursor-pointer hover:border-gray-400">
                     <input 
                        type="color" 
                        value={data.themeColor} 
                        onChange={(e) => handleInputChange('themeColor', e.target.value)}
                        className="absolute -top-2 -left-2 w-12 h-12 p-0 border-0 cursor-pointer opacity-0"
                     />
                     <div 
                        className="w-full h-full flex items-center justify-center bg-gray-100 text-gray-400 text-xs"
                     >+</div>
                 </div>
             </div>
             <div className="text-xs text-gray-500 text-right mt-1">
                 Current: {PANTONE_COLORS.find(c => c.value === data.themeColor)?.name || data.themeColor}
             </div>
        </section>

        {/* Basic Info */}
        <section className="space-y-4">
          <h3 className="text-sm font-bold uppercase text-gray-400 tracking-wider">Company Info</h3>
          
          <div className="grid grid-cols-2 gap-4">
             <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Chinese Name</label>
                <textarea
                  value={data.companyNameCN}
                  onChange={(e) => handleInputChange('companyNameCN', e.target.value)}
                  className="w-full p-2 border rounded focus:border-[#FF4400] outline-none text-sm h-16"
                  placeholder="Use newline for stack"
                />
             </div>
             <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">English Name</label>
                <input
                  type="text"
                  value={data.companyNameEN}
                  onChange={(e) => handleInputChange('companyNameEN', e.target.value)}
                  className="w-full p-2 border rounded focus:border-[#FF4400] outline-none text-sm h-16"
                />
             </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">Tagline</label>
            <input
              type="text"
              value={data.tagline}
              onChange={(e) => handleInputChange('tagline', e.target.value)}
              className="w-full p-2 border rounded focus:border-[#FF4400] outline-none text-sm"
            />
          </div>
        </section>

        {/* Services */}
        <section className="space-y-3">
          <h3 className="text-sm font-bold uppercase text-gray-400 tracking-wider flex justify-between">
            Core Services
            <span className="text-xs normal-case font-normal text-gray-400">
                {data.services.length > 6 ? '(2 Columns)' : '(Single Column)'}
            </span>
          </h3>
          {data.services.map((service, idx) => (
            <div key={service.id} className="flex gap-2 items-center group">
              <span className="text-xs font-bold w-4" style={{ color: data.themeColor }}>{idx + 1}</span>
              <input
                type="text"
                value={service.text}
                onChange={(e) => handleServiceChange(service.id, e.target.value)}
                className="flex-1 p-2 border rounded focus:border-gray-400 outline-none text-xs"
              />
              <button 
                onClick={() => deleteService(service.id)}
                className="text-gray-300 hover:text-red-500 p-1 opacity-0 group-hover:opacity-100 transition-opacity"
              >
                  <TrashIcon className="w-4 h-4" />
              </button>
            </div>
          ))}
          <button 
             onClick={() => onChange({...data, services: [...data.services, {id: uuidv4(), text: ''}]})}
             className="text-xs font-medium hover:underline"
             style={{ color: data.themeColor }}
          >
            + Add Service
          </button>
        </section>

        {/* Partners */}
        <section className="space-y-3">
          <h3 className="text-sm font-bold uppercase text-gray-400 tracking-wider">Partners</h3>
          <div className="grid grid-cols-1 gap-2">
            {data.partners.map((partner: any) => (
               <div key={partner.id} className="flex gap-2 items-center group">
                    <input
                        type="text"
                        value={partner.name || partner.text}
                        onChange={(e) => handlePartnerChange(partner.id, e.target.value)}
                        className="w-full p-2 border rounded focus:border-gray-400 outline-none text-xs"
                        placeholder="Partner Name"
                    />
                    <button 
                        onClick={() => deletePartner(partner.id)}
                        className="text-gray-300 hover:text-red-500 p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                        <TrashIcon className="w-4 h-4" />
                    </button>
              </div>
            ))}
          </div>
           <button 
             onClick={() => onChange({...data, partners: [...data.partners, {id: uuidv4(), name: ''}]})}
             className="text-xs font-medium hover:underline"
             style={{ color: data.themeColor }}
          >
            + Add Partner
          </button>
        </section>

        {/* Contact */}
        <section className="space-y-4">
           <h3 className="text-sm font-bold uppercase text-gray-400 tracking-wider">Contact & QR</h3>
           <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">Phone</label>
            <input
              type="text"
              value={data.contact.phone}
              onChange={(e) => handleContactChange('phone', e.target.value)}
              className="w-full p-2 border rounded focus:border-[#FF4400] outline-none text-sm"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">Email</label>
            <input
              type="text"
              value={data.contact.email}
              onChange={(e) => handleContactChange('email', e.target.value)}
              className="w-full p-2 border rounded focus:border-[#FF4400] outline-none text-sm"
            />
          </div>
          
          <div className="p-3 bg-gray-50 rounded-lg border border-gray-100">
             <label className="block text-xs font-bold text-gray-700 mb-2">WeChat QR Code</label>
             
             {!data.contact.qrImage ? (
                <>
                    <input
                        type="text"
                        value={data.contact.qrData}
                        onChange={(e) => handleContactChange('qrData', e.target.value)}
                        className="w-full p-2 border rounded focus:border-[#FF4400] outline-none text-sm mb-2"
                        placeholder="Enter URL to generate QR"
                    />
                    <div className="flex items-center gap-2">
                        <span className="text-xs text-gray-400">OR</span>
                        <label className="flex items-center gap-1 cursor-pointer text-xs bg-white border px-2 py-1 rounded hover:bg-gray-50">
                            <UploadIcon className="w-3 h-3" />
                            Upload Image
                            <input 
                                ref={fileInputRef}
                                type="file" 
                                accept="image/*" 
                                onChange={handleQRImageUpload}
                                className="hidden" 
                            />
                        </label>
                    </div>
                </>
             ) : (
                 <div className="flex items-start gap-4">
                     <img src={data.contact.qrImage} alt="Preview" className="w-16 h-16 object-cover border rounded" />
                     <div className="space-y-1">
                         <p className="text-xs text-green-600 font-medium">Image Uploaded</p>
                         <button 
                            onClick={clearQRImage}
                            className="text-xs text-red-500 underline"
                         >
                             Remove & Use URL
                         </button>
                     </div>
                 </div>
             )}
          </div>
        </section>

        {/* Action Buttons */}
        <div className="pt-4 border-t border-gray-100">
          <button
            onClick={handlePrint}
            className="w-full flex items-center justify-center gap-2 bg-gray-900 text-white py-3 px-4 rounded font-medium hover:bg-black transition-colors"
          >
            <PrinterIcon className="w-5 h-5" />
            Print / Save as PDF
          </button>
          <p className="text-center text-xs text-gray-400 mt-2">
            Tip: Enable "Background Graphics" in print settings
          </p>
        </div>

      </div>
    </div>
  );
};

export default CardEditor;