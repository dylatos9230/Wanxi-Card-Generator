import React from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { BusinessCardData } from '../types';
import { WanXiLogo } from './Icons';

interface CardPreviewProps {
  data: BusinessCardData;
}

const CardPreview: React.FC<CardPreviewProps> = ({ data }) => {
  const themeColor = data.themeColor || '#FF4400';
  const isMultiColumnServices = data.services.length > 6;
  const cardWidth = data.cardWidth || 500;
  // Maintain aspect ratio 500:888 = 1:1.776
  const cardHeight = cardWidth * 1.776;

  // Calculate scaling factor relative to base design (500px) to scale text proportionally
  const scale = cardWidth / 500;

  return (
    <div className="w-full flex justify-center items-center py-8 bg-gray-100 min-h-[800px]">
      <div 
        className="print-container relative bg-white shadow-2xl overflow-hidden text-gray-900"
        style={{ 
            width: `${cardWidth}px`, 
            height: `${cardHeight}px`, 
            flexShrink: 0,
            fontSize: `${16 * scale}px` // Scale base font size
        }}
      >
        {/* TOP SECTION: HEADER & SERVICES */}
        <div className="relative z-10" style={{ padding: `${3 * scale}rem`, paddingBottom: 0 }}>
          
          {/* Header */}
          <div className="flex justify-between items-start" style={{ marginBottom: `${4 * scale}rem` }}>
            <div className="flex flex-col">
              {/* Chinese Name */}
              <h1 
                className="leading-tight font-serif tracking-tight font-bold text-gray-900 whitespace-pre-line"
                style={{ fontSize: `${4 * scale}rem` }}
              >
                {data.companyNameCN}
              </h1>
              {/* English Name with Underline */}
              <div className="relative inline-block" style={{ marginTop: `${0.5 * scale}rem` }}>
                <h2 
                    className="text-gray-500 font-medium uppercase"
                    style={{ fontSize: `${1.5 * scale}rem`, letterSpacing: '0.15em' }}
                >
                  {data.companyNameEN}
                </h2>
                <div 
                  className="absolute left-0"
                  style={{ 
                      backgroundColor: themeColor,
                      bottom: `-${0.5 * scale}rem`,
                      width: `${4 * scale}rem`,
                      height: `${0.25 * scale}rem`
                  }}
                ></div>
              </div>
            </div>

            {/* Logo and Tagline area */}
            <div className="flex flex-col items-center">
              <WanXiLogo 
                className="mb-4" 
                color={themeColor} 
                style={{ width: `${8 * scale}rem`, height: `${8 * scale}rem` }}
              />
              <p 
                className="text-gray-300 font-light text-center"
                style={{ fontSize: `${0.875 * scale}rem`, letterSpacing: '0.1em' }}
              >
                {data.tagline}
              </p>
            </div>
          </div>

          {/* Core Services */}
          <div style={{ marginBottom: `${2 * scale}rem` }}>
            <h3 
                className="font-serif text-gray-800"
                style={{ fontSize: `${1.25 * scale}rem`, marginBottom: `${1.5 * scale}rem` }}
            >
                核心服务
            </h3>
            <div className={isMultiColumnServices ? "grid grid-cols-2" : ""} style={{ gap: `${0.75 * scale}rem`, columnGap: `${2 * scale}rem` }}>
              {data.services.map((service, index) => (
                <div key={service.id} className="flex items-start" style={{ marginBottom: isMultiColumnServices ? 0 : `${0.75 * scale}rem` }}>
                  <span 
                    className="font-bold mr-3"
                    style={{ color: themeColor, fontSize: `${1 * scale}rem`, width: `${1.5 * scale}rem` }}
                  >
                    {String(index + 1).padStart(2, '0')}
                  </span>
                  <span 
                    className="text-gray-700 tracking-wide font-light whitespace-pre-wrap"
                    style={{ fontSize: `${0.875 * scale}rem` }}
                  >
                    {service.text}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* BOTTOM SECTION: DIAGONAL BLACK BACKGROUND */}
        <div 
          className="absolute bottom-0 left-0 w-full bg-[#080808] text-white flex flex-col justify-between"
          style={{ 
              height: '45%', 
              clipPath: 'polygon(0 20%, 100% 0, 100% 100%, 0% 100%)',
              paddingTop: `${4 * scale}rem`,
              paddingLeft: `${3 * scale}rem`,
              paddingRight: `${3 * scale}rem`,
              paddingBottom: `${3 * scale}rem`
           }}
        >
            {/* Partners List */}
            <div style={{ marginTop: `${1.5 * scale}rem` }}>
               <h3 
                className="font-serif text-gray-400 opacity-80"
                style={{ fontSize: `${1.125 * scale}rem`, marginBottom: `${1 * scale}rem` }}
               >
                合作伙伴
               </h3>
               <div className="grid grid-cols-2" style={{ columnGap: `${1 * scale}rem`, rowGap: `${0.5 * scale}rem` }}>
                 {data.partners.map((partner: any) => (
                   <div key={partner.id} className="flex items-center space-x-2">
                     <div 
                        className="rounded-full flex-shrink-0"
                        style={{ backgroundColor: themeColor, width: `${0.25 * scale}rem`, height: `${0.25 * scale}rem` }}
                     ></div>
                     <span 
                        className="text-gray-300 font-light whitespace-nowrap overflow-hidden text-ellipsis"
                        style={{ fontSize: `${0.75 * scale}rem` }}
                     >
                       {partner.name || partner.text}
                     </span>
                   </div>
                 ))}
               </div>
            </div>

            {/* Footer: Contact & QR */}
            <div className="flex justify-between items-end" style={{ marginTop: `${2 * scale}rem` }}>
              <div>
                <h4 
                  className="uppercase font-medium"
                  style={{ color: themeColor, fontSize: `${1.875 * scale}rem`, marginBottom: `${1 * scale}rem`, letterSpacing: '0.1em' }}
                >
                  CONTACT
                </h4>
                <div className="space-y-1 text-gray-300 font-light" style={{ fontSize: `${0.875 * scale}rem` }}>
                  <p>电话 <span className="ml-2 text-white">{data.contact.phone}</span></p>
                  <p>邮箱 <span className="ml-2 text-white">{data.contact.email}</span></p>
                </div>
              </div>

              <div className="flex flex-col items-end">
                  <div className="bg-white" style={{ padding: `${0.5 * scale}rem` }}>
                    {data.contact.qrImage ? (
                      <img 
                        src={data.contact.qrImage} 
                        alt="QR Code" 
                        style={{ width: `${5 * scale}rem`, height: `${5 * scale}rem`, objectFit: 'cover' }}
                      />
                    ) : (
                      <QRCodeSVG 
                        value={data.contact.qrData} 
                        size={80 * scale} 
                        fgColor="#000000" 
                        bgColor="#ffffff" 
                        level="M" 
                      />
                    )}
                  </div>
              </div>
            </div>
        </div>
      </div>
    </div>
  );
};

export default CardPreview;