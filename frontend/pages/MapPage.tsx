import React, { useState } from 'react';
import { MAP_SERVICES } from '../constants';
import { MapServiceType, ServicePoint } from '../types';

export const MapPage: React.FC = () => {
  const [filters, setFilters] = useState<MapServiceType[]>(Object.values(MapServiceType));
  const [selectedPoint, setSelectedPoint] = useState<ServicePoint | null>(MAP_SERVICES[0]);
  const toggleFilter = (filter: MapServiceType) => { setFilters(prev => prev.includes(filter) ? prev.filter(f => f !== filter) : [...prev, filter]); };
  const serviceColors: Record<MapServiceType, string> = {
    [MapServiceType.GYNECOLOGY]: 'bg-accent-purple', [MapServiceType.ANDROLOGY]: 'bg-cyan-500', [MapServiceType.COUNSELING]: 'bg-accent-orange', [MapServiceType.HOTLINE]: 'bg-red-500',
  };
  return (
    <div className="space-y-4">
      <div className="text-center">
        <h2 className="text-4xl font-bold text-slate-900 dark:text-white mb-2">Bản Đồ Dịch Vụ</h2>
        <p className="text-lg text-slate-500 dark:text-slate-300">Tìm kiếm các địa điểm hỗ trợ sức khỏe thân thiện và tin cậy.</p>
      </div>
      <div className="bg-white dark:bg-slate-800 p-3 rounded-2xl shadow-xl shadow-slate-900/5 dark:shadow-[0_0_18px_rgba(15,23,42,0.35)] border border-slate-200 dark:border-slate-700">
        <div className="flex flex-col lg:flex-row gap-4 h-[calc(100vh-250px)]">
          <div className="w-full lg:w-2/3 xl:w-3/4 bg-slate-100 dark:bg-slate-900 rounded-xl relative overflow-hidden">
            <img src="https://i.imgur.com/Tf2v2bM.png" alt="Map background" className="absolute inset-0 w-full h-full object-cover"/>
            {MAP_SERVICES.filter(p => filters.includes(p.type)).map(point => (
              <button key={point.id} onClick={() => setSelectedPoint(point)} className="absolute transform -translate-x-1/2 -translate-y-1/2 group" style={{ top: point.position.top, left: point.position.left }} aria-label={point.name}>
                <div className={`w-5 h-5 rounded-full ${serviceColors[point.type]} ring-4 ring-white/50 dark:ring-white/20 group-hover:scale-125 transition-transform duration-300`}></div>
                <div className={`absolute inset-0 rounded-full ${serviceColors[point.type]} opacity-50 animate-pulse`}></div>
              </button>
            ))}
          </div>
          <div className="w-full lg:w-1/3 xl:w-1/4 flex flex-col space-y-4">
            <div className="flex flex-wrap gap-2 p-2 bg-slate-100 dark:bg-slate-900 rounded-lg">
              {Object.values(MapServiceType).map(type => (
                <button key={type} onClick={() => toggleFilter(type)} className={`px-3 py-1.5 rounded-lg text-sm font-semibold transition-all duration-300 flex-grow ${filters.includes(type) ? `${serviceColors[type]} text-white shadow-md` : 'bg-white dark:bg-slate-800 text-slate-500 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'}`}>{type}</button>
              ))}
            </div>
            <div className="flex-grow p-4 bg-slate-100 dark:bg-slate-900 rounded-lg">
              {selectedPoint ? (
                <div>
                  <h4 className="font.bold text-slate-900 dark:text-white">{selectedPoint.name}</h4>
                  <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">{selectedPoint.address}</p>
                  {selectedPoint.friendly === 'teen' && <span className="text-xs font-semibold bg-green-100 dark:bg-green-500/10 text-green-700 dark:text-green-300 px-2 py-1 rounded-full mt-3 inline-block">Thân thiện vị thành niên</span>}
                </div>
              ) : (
                <p className="text-sm text-slate-500 dark:text-slate-400 text-center mt-8">Chọn một điểm trên bản đồ để xem chi tiết.</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};