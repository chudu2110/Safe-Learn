import React, { useState, useCallback, useRef } from 'react';
import { MapContainer, TileLayer, CircleMarker, useMap } from 'react-leaflet';
import { useEffect } from 'react';
import 'leaflet/dist/leaflet.css';
import { MAP_SERVICES } from '../constants';
import { MapServiceType, ServicePoint } from '../types';

export const MapPage: React.FC = () => {
  const [filters, setFilters] = useState<MapServiceType[]>([]);
  const [selectedPoint, setSelectedPoint] = useState<ServicePoint | null>(null);
  const [userPos, setUserPos] = useState<[number, number] | null>(null);
  const [geoError, setGeoError] = useState<string | null>(null);
  const [searchPos, setSearchPos] = useState<[number, number] | null>(null);
  const mapRef = useRef<any>(null);
  const [q, setQ] = useState('');
  const [loading, setLoading] = useState(false);
  const [suggestions, setSuggestions] = useState<any[]>([]);
  const [showSug, setShowSug] = useState(false);
  const sugTimerRef = useRef<any>(null);
  const toolbarRef = useRef<any>(null);
  const [catsOpen, setCatsOpen] = useState(false);
  const [serviceCoords, setServiceCoords] = useState<Record<number, { lat: number; lon: number } | null>>({});
  const [nearOnly, setNearOnly] = useState(true);
  const RADIUS_KM = 3;
  const [nearby, setNearby] = useState<any[]>([]);
  const [nearLoading, setNearLoading] = useState(false);
  const onPosition = useCallback((lat: number, lng: number) => { setUserPos([lat, lng]); setGeoError(null); }, []);
  const toggleFilter = (filter: MapServiceType) => { setFilters(prev => prev.includes(filter) ? prev.filter(f => f !== filter) : [...prev, filter]); };
  const serviceColors: Record<MapServiceType, string> = {
    [MapServiceType.GYNECOLOGY]: 'bg-accent-purple', [MapServiceType.ANDROLOGY]: 'bg-cyan-500', [MapServiceType.COUNSELING]: 'bg-accent-orange', [MapServiceType.HOTLINE]: 'bg-red-500',
  };
  const locateMe = async () => {
    if (userPos && mapRef.current) { mapRef.current.setView(userPos, 15, { animate: true }); return; }
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const { latitude, longitude } = pos.coords;
          setUserPos([latitude, longitude]);
          setGeoError(null);
          if (mapRef.current) mapRef.current.setView([latitude, longitude], 15, { animate: true });
        },
        async (err) => {
          setGeoError(err?.message || 'Không thể truy cập vị trí');
          try {
            const res = await fetch('https://ipapi.co/json/');
            const data = await res.json();
            if (data && typeof data.latitude === 'number' && typeof data.longitude === 'number') {
              const lat = data.latitude;
              const lon = data.longitude;
              setUserPos([lat, lon]);
              if (mapRef.current) mapRef.current.setView([lat, lon], 12, { animate: true });
            } else {
              try {
                const r2 = await fetch('https://ip-api.com/json');
                const d2 = await r2.json();
                if (d2 && typeof d2.lat === 'number' && typeof d2.lon === 'number') {
                  setUserPos([d2.lat, d2.lon]);
                  if (mapRef.current) mapRef.current.setView([d2.lat, d2.lon], 12, { animate: true });
                } else {
                  setGeoError('Không thể xác định vị trí từ IP');
                }
              } catch {}
            }
          } catch {}
        },
        { enableHighAccuracy: true, timeout: 8000, maximumAge: 0 }
      );
    }
  };
  useEffect(() => {
    const boot = async () => {
      try {
        if ('geolocation' in navigator) {
          navigator.geolocation.getCurrentPosition(
            (pos) => {
              const { latitude, longitude } = pos.coords;
              setUserPos([latitude, longitude]);
              setGeoError(null);
              if (mapRef.current) mapRef.current.setView([latitude, longitude], 15, { animate: true });
            },
            async () => {
              try {
                const res = await fetch('https://ipapi.co/json/');
                const data = await res.json();
                if (data && typeof data.latitude === 'number' && typeof data.longitude === 'number') {
                  setUserPos([data.latitude, data.longitude]);
                  if (mapRef.current) mapRef.current.setView([data.latitude, data.longitude], 12, { animate: true });
                } else {
                  const r2 = await fetch('https://ip-api.com/json');
                  const d2 = await r2.json();
                  if (d2 && typeof d2.lat === 'number' && typeof d2.lon === 'number') {
                    setUserPos([d2.lat, d2.lon]);
                    if (mapRef.current) mapRef.current.setView([d2.lat, d2.lon], 12, { animate: true });
                  }
                }
              } catch {}
            },
            { enableHighAccuracy: true, timeout: 8000, maximumAge: 0 }
          );
        }
      } catch {}
    };
    boot();
  }, []);
  const search = async () => {
    const query = q.trim();
    if (!query) return;
    setLoading(true);
    try {
      const vnBox = '102.14,23.39,109.46,8.18';
      const n = (s: string) => s.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
      const parts = query.split(',').map(p => p.trim()).filter(Boolean);
      let state = '';
      let county = '';
      let city = '';
      let street = '';
      let first = parts[0] || '';
      const fn = n(first);
      if (/(đường|phố|ngõ|xóm|thôn|ấp|bản|làng)/.test(fn) || /\d/.test(fn)) street = first;
      const words = n(query).split(/\s+/).filter(Boolean);
      const lastTwo = words.length >= 2 ? words.slice(-2).join(' ') : words.join(' ');
      for (const p of parts) {
        const pn = n(p);
        if (pn.includes('tinh') || pn.includes('thanh pho')) { state = p; continue; }
        if (pn.includes('huyen') || pn.includes('quan') || pn.includes('thi xa')) { county = p; continue; }
        if (pn.includes('xa') || pn.includes('phuong') || pn.includes('thi tran')) { city = p; continue; }
      }
      if (!state && lastTwo) state = lastTwo;
      const getBBox = async (name: string) => {
        const u = new URLSearchParams();
        u.set('format', 'jsonv2');
        u.set('addressdetails', '1');
        u.set('limit', '1');
        u.set('countrycodes', 'vn');
        u.set('q', `${name} Việt Nam`);
        const r = await fetch(`https://nominatim.openstreetmap.org/search?${u.toString()}`, { headers: { 'accept-language': 'vi' } });
        const d = await r.json();
        if (Array.isArray(d) && d[0]?.boundingbox) {
          const bb = d[0].boundingbox;
          const minlat = parseFloat(bb[0]);
          const maxlat = parseFloat(bb[1]);
          const minlon = parseFloat(bb[2]);
          const maxlon = parseFloat(bb[3]);
          if (!Number.isNaN(minlat) && !Number.isNaN(maxlat) && !Number.isNaN(minlon) && !Number.isNaN(maxlon)) {
            return `${minlon},${maxlat},${maxlon},${minlat}`;
          }
        }
        return '';
      };
      const sParams = new URLSearchParams();
      sParams.set('format', 'jsonv2');
      sParams.set('addressdetails', '1');
      sParams.set('namedetails', '1');
      sParams.set('limit', '7');
      sParams.set('country', 'Việt Nam');
      if (street) sParams.set('street', street);
      if (city) sParams.set('city', city);
      if (county) sParams.set('county', county);
      if (state) sParams.set('state', state);
      let res = await fetch(`https://nominatim.openstreetmap.org/search?${sParams.toString()}`, { headers: { 'accept-language': 'vi' } });
      let data = await res.json();
      if (!Array.isArray(data) || data.length === 0) {
        const params = new URLSearchParams();
        params.set('format', 'jsonv2');
        params.set('addressdetails', '1');
        params.set('limit', '10');
        params.set('countrycodes', 'vn');
        let vbox = await getBBox(state || county || city);
        if (!vbox) vbox = vnBox;
        params.set('viewbox', vbox);
        params.set('bounded', '1');
        params.set('q', `${street ? street + ' ' : ''}${county ? county + ' ' : ''}${city ? city + ' ' : ''}${state ? state + ' ' : ''}`.trim() || `${query} Việt Nam`);
        res = await fetch(`https://nominatim.openstreetmap.org/search?${params.toString()}`, { headers: { 'accept-language': 'vi' } });
        data = await res.json();
      }
      if (Array.isArray(data) && data.length > 0) {
        const pick = (items: any[]) => {
          const targetState = n(state);
          const targetCounty = n(county);
          const targetCity = n(city);
          for (const it of items) {
            const addr = it.address || {};
            const aState = addr.state ? n(addr.state) : '';
            const aCounty = addr.county ? n(addr.county) : '';
            const aCity = addr.city || addr.town || addr.village || addr.hamlet || '';
            const aCityN = n(aCity);
            if (targetState && !aState.includes(targetState)) continue;
            if (targetCounty && !aCounty.includes(targetCounty)) continue;
            if (targetCity && !aCityN.includes(targetCity)) continue;
            return it;
          }
          return items[0];
        };
        const chosen = pick(data);
        const lat = parseFloat(chosen.lat);
        const lon = parseFloat(chosen.lon);
        if (!Number.isNaN(lat) && !Number.isNaN(lon)) {
          setSearchPos([lat, lon]);
          if (mapRef.current) mapRef.current.setView([lat, lon], street ? 17 : 15, { animate: true });
        }
      }
    } catch {}
    setLoading(false);
    setShowSug(false);
  };
  const normalize = (s: string) => s.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
  const stripPrefixes = (s: string) => normalize(s).replace(/^(tinh|thanh pho|tp|huyen|quan|thi xa|thi tran|xa|phuong|thon|ap|ban|lang)\s+/,'').trim();
  const fetchSuggestions = async () => {
    const query = q.trim();
    if (query.length < 3) { setSuggestions([]); return; }
    const parts = query.split(',').map(p => p.trim()).filter(Boolean);
    let state = '';
    let county = '';
    let qPlace = '';
    for (const p of parts) {
      const pn = normalize(p);
      if (pn.includes('tinh') || pn.includes('thanh pho')) { state = p; continue; }
      if (pn.includes('huyen') || pn.includes('quan') || pn.includes('thi xa')) { county = p; continue; }
      if (!qPlace) qPlace = p;
    }
    const vnBox = '102.14,23.39,109.46,8.18';
    const params = new URLSearchParams();
    params.set('format', 'jsonv2');
    params.set('addressdetails', '1');
    params.set('namedetails', '1');
    params.set('limit', '7');
    params.set('countrycodes', 'vn');
    params.set('viewbox', vnBox);
    params.set('bounded', '1');
    params.set('q', qPlace || query);
    if (state) params.set('state', state.replace(/^(tinh|thanh pho|tp)\s+/i,''));
    if (county) params.set('county', county.replace(/^(huyen|quan|thi xa)\s+/i,''));
    const res = await fetch(`https://nominatim.openstreetmap.org/search?${params.toString()}`, { headers: { 'accept-language': 'vi' } });
    const data = await res.json();
    if (Array.isArray(data)) { setSuggestions(data); setShowSug(true); } else { setSuggestions([]); setShowSug(false); }
  };
  const selectSuggestion = (item: any) => {
    setShowSug(false);
    setQ(item.display_name || q);
    const lat = parseFloat(item.lat);
    const lon = parseFloat(item.lon);
    if (!Number.isNaN(lat) && !Number.isNaN(lon)) {
      setSearchPos([lat, lon]);
      if (mapRef.current) mapRef.current.setView([lat, lon], 16, { animate: true });
    }
  };
  useEffect(() => {
    if (sugTimerRef.current) clearTimeout(sugTimerRef.current);
    sugTimerRef.current = setTimeout(fetchSuggestions, 400);
    return () => { if (sugTimerRef.current) clearTimeout(sugTimerRef.current); };
  }, [q]);
  useEffect(() => {
    const onDocMouseDown = (e: any) => {
      if (toolbarRef.current && !toolbarRef.current.contains(e.target)) {
        setShowSug(false);
      }
    };
    document.addEventListener('mousedown', onDocMouseDown);
    return () => { document.removeEventListener('mousedown', onDocMouseDown); };
  }, []);
  const distKm = (a: [number, number], b: [number, number]) => {
    const toRad = (x: number) => x * Math.PI / 180;
    const R = 6371;
    const dLat = toRad(b[0] - a[0]);
    const dLon = toRad(b[1] - a[1]);
    const lat1 = toRad(a[0]);
    const lat2 = toRad(b[0]);
    const h = Math.sin(dLat/2)**2 + Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLon/2)**2;
    return 2 * R * Math.asin(Math.sqrt(h));
  };
  const matchCat = (tags: any, type: MapServiceType, name: string) => {
    const n = (s: string) => s.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
    const t = Object.fromEntries(Object.entries(tags || {}).map(([k,v]) => [k, typeof v === 'string' ? n(v) : v]));
    const nm = n(name || t.name || '');
    if (type === MapServiceType.GYNECOLOGY) {
      return (t['healthcare:speciality'] && /(s\w*an|san|phu\s*khoa|obgyn|gyn|gynecology)/.test(t['healthcare:speciality'])) || /(phu\s*khoa|san\s*phu|san\s*khoa|obgyn)/.test(nm);
    }
    if (type === MapServiceType.ANDROLOGY) {
      return (t['healthcare:speciality'] && /(nam\s*khoa|andrology|urology|tiet\s*nieu)/.test(t['healthcare:speciality'])) || /(nam\s*khoa|tiet\s*nieu|urology)/.test(nm);
    }
    if (type === MapServiceType.COUNSELING) {
      return (t['amenity'] === 'counselling' || t['healthcare'] === 'psychotherapist') || /(tu\s*van|tham\s*van|tam\s*ly)/.test(nm);
    }
    return false;
  };
  const viewboxAround = (lat: number, lon: number, km: number) => {
    const dLat = km / 111;
    const dLon = km / (111 * Math.cos(lat * Math.PI / 180));
    const minLon = lon - dLon;
    const maxLon = lon + dLon;
    const minLat = lat - dLat;
    const maxLat = lat + dLat;
    return `${minLon},${maxLat},${maxLon},${minLat}`;
  };
  useEffect(() => {
    const run = async () => {
      if (!userPos || filters.length === 0) { setNearby([]); return; }
      const active = filters.filter(t => t !== MapServiceType.HOTLINE);
      if (active.length === 0) { setNearby([]); return; }
      setNearLoading(true);
      const lat = userPos[0];
      const lon = userPos[1];
      const rad = Math.max(200, Math.floor(RADIUS_KM * 1000));
      const q = `\n[out:json][timeout:25];\n(\n  node["amenity"="hospital"](around:${rad},${lat},${lon});\n  node["amenity"="clinic"](around:${rad},${lat},${lon});\n  node["amenity"="doctors"](around:${rad},${lat},${lon});\n  node["healthcare"](around:${rad},${lat},${lon});\n  way["amenity"="hospital"](around:${rad},${lat},${lon});\n  way["amenity"="clinic"](around:${rad},${lat},${lon});\n  way["amenity"="doctors"](around:${rad},${lat},${lon});\n  way["healthcare"](around:${rad},${lat},${lon});\n  rel["amenity"="hospital"](around:${rad},${lat},${lon});\n  rel["amenity"="clinic"](around:${rad},${lat},${lon});\n  rel["amenity"="doctors"](around:${rad},${lat},${lon});\n  rel["healthcare"](around:${rad},${lat},${lon});\n);\nout center tags;`;
      try {
        const r = await fetch('https://overpass-api.de/api/interpreter', { method: 'POST', body: q });
        const d = await r.json();
        const elements = Array.isArray(d?.elements) ? d.elements : [];
        const list = elements.map((el: any) => {
          const cLat = el.lat ?? el.center?.lat;
          const cLon = el.lon ?? el.center?.lon;
          const dist = userPos ? distKm([cLat, cLon], userPos) : Number.POSITIVE_INFINITY;
          const name = el.tags?.name || el.tags?.official_name || el.tags?.short_name || '';
          return { lat: cLat, lon: cLon, dist, name, address: name, tags: el.tags };
        }).filter(it => Number.isFinite(it.dist) && typeof it.lat === 'number' && typeof it.lon === 'number' && it.name && it.name.trim().length > 0);
        let matched = list
          .filter(it => active.some(t => matchCat(it.tags, t, it.name)))
          .filter(it => it.dist <= RADIUS_KM)
          .sort((a,b) => a.dist - b.dist);
        if (matched.length === 0) {
          matched = list
            .filter(it => it.dist <= RADIUS_KM)
            .sort((a,b) => a.dist - b.dist);
        }
        setNearby(matched);
      } catch {
        const vb = viewboxAround(lat, lon, RADIUS_KM);
        const queries = ['bệnh viện', 'hospital', 'clinic', 'phòng khám', 'trạm y tế', 'doctors'];
        const seen: any[] = [];
        for (const kw of queries) {
          try {
            const p = new URLSearchParams();
            p.set('format', 'jsonv2');
            p.set('addressdetails', '1');
            p.set('limit', '10');
            p.set('countrycodes', 'vn');
            p.set('viewbox', vb);
            p.set('bounded', '1');
            p.set('q', kw);
            const rr = await fetch(`https://nominatim.openstreetmap.org/search?${p.toString()}`, { headers: { 'accept-language': 'vi' } });
            const dd = await rr.json();
            if (Array.isArray(dd)) {
              for (const it of dd) {
                const cLat = parseFloat(it.lat);
                const cLon = parseFloat(it.lon);
                const dist = userPos ? distKm([cLat, cLon], userPos) : Number.POSITIVE_INFINITY;
                if (Number.isFinite(dist) && dist <= RADIUS_KM) {
                  seen.push({ lat: cLat, lon: cLon, dist, name: it.display_name || 'Địa điểm', address: it.display_name });
                }
              }
            }
          } catch {}
          await new Promise(res => setTimeout(res, 300));
        }
        seen.sort((a,b) => a.dist - b.dist);
        setNearby(seen);
      }
      setNearLoading(false);
    };
    run();
  }, [userPos, filters]);
  useEffect(() => {
    let canceled = false;
    const run = async () => {
      for (const sp of MAP_SERVICES) {
        if (serviceCoords[sp.id] !== undefined) continue;
        try {
          const u = new URLSearchParams();
          u.set('format', 'jsonv2');
          u.set('addressdetails', '1');
          u.set('limit', '1');
          u.set('countrycodes', 'vn');
          u.set('q', `${sp.address} Việt Nam`);
          const r = await fetch(`https://nominatim.openstreetmap.org/search?${u.toString()}`, { headers: { 'accept-language': 'vi' } });
          const d = await r.json();
          if (!canceled) {
            if (Array.isArray(d) && d[0]?.lat && d[0]?.lon) {
              const lat = parseFloat(d[0].lat);
              const lon = parseFloat(d[0].lon);
              setServiceCoords(prev => ({ ...prev, [sp.id]: { lat, lon } }));
            } else {
              setServiceCoords(prev => ({ ...prev, [sp.id]: null }));
            }
          }
        } catch {
          if (!canceled) setServiceCoords(prev => ({ ...prev, [sp.id]: null }));
        }
        await new Promise(res => setTimeout(res, 400));
      }
    };
    run();
    return () => { canceled = true; };
  }, [MAP_SERVICES]);
  return (
    <div className="space-y-4">
      <style>{`
        .custom-scroll{scrollbar-width:thin;scrollbar-color:#94a3b8 #f1f5f9}
        .dark .custom-scroll{scrollbar-color:#475569 #0f172a}
        .custom-scroll::-webkit-scrollbar{width:8px;height:8px}
        .custom-scroll::-webkit-scrollbar-track{background:#f1f5f9;border-radius:8px}
        .custom-scroll::-webkit-scrollbar-thumb{background-color:#94a3b8;border-radius:8px;border:2px solid #f1f5f9}
        .custom-scroll::-webkit-scrollbar-thumb:hover{background-color:#64748b}
        .dark .custom-scroll::-webkit-scrollbar-track{background:#0f172a}
        .dark .custom-scroll::-webkit-scrollbar-thumb{background-color:#475569;border:2px solid #0f172a}
        .dark .custom-scroll::-webkit-scrollbar-thumb:hover{background-color:#64748b}
      `}</style>
      <div className="text-center">
        <h2 className="text-4xl font-bold text-slate-900 dark:text-white mb-2">Bản Đồ Dịch Vụ</h2>
        <p className="text-lg text-slate-500 dark:text-slate-300">Tìm kiếm các địa điểm hỗ trợ sức khỏe thân thiện và tin cậy.</p>
      </div>
      <div className="bg-white dark:bg-slate-800 p-3 rounded-2xl shadow-xl shadow-slate-900/5 dark:shadow-[0_0_18px_rgba(15,23,42,0.35)] border border-slate-200 dark:border-slate-700">
        <div className="flex items-center gap-2 justify-end pb-3">
          <div ref={toolbarRef} className="relative flex items-center gap-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg p-2 shadow">
            <input value={q} onChange={(e)=>setQ(e.target.value)} onFocus={()=>setShowSug(suggestions.length>0)} onKeyDown={(e)=>{ if(e.key==='Enter'){ e.preventDefault(); search(); } }} placeholder="Tìm kiếm địa chỉ" className="px-2 py-1 bg-transparent outline-none text-sm dark:text-white" />
            <button onClick={search} disabled={loading} className="px-3 py-1.5 rounded-md text-sm font-bold bg-cyan-500 text-white hover:bg-cyan-600">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" className="w-4 h-4"><circle cx="11" cy="11" r="7" strokeWidth="2"/><path d="M20 20l-3.5-3.5" strokeWidth="2" strokeLinecap="round"/></svg>
            </button>
            {showSug && suggestions.length > 0 && (
              <div className="absolute top-full right-0 mt-2 w-80 max-w-[80vw] max-h-56 overflow-y-auto bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg shadow-lg z-[1000]">
                {suggestions.map((s, idx) => (
                  <button key={idx} onMouseDown={() => selectSuggestion(s)} className="block w-full text-left px-3 py-2 hover:bg-slate-100 dark:hover:bg-slate-700 text-sm dark:text-white">
                    {s.display_name}
                  </button>
                ))}
              </div>
            )}
          </div>
          <button onClick={locateMe} className="px-3 py-2 rounded-lg text-sm font-bold bg-cyan-500 text-white hover:bg-cyan-600">Vị trí của tôi</button>
          {geoError ? (
            <span className="ml-2 text-xs text-red-600 dark:text-red-400">{geoError}</span>
          ) : null}
        </div>
        <div className="flex flex-col lg:flex-row gap-4 h-[calc(100vh-250px)]">
          <div className="w-full lg:w-2/3 xl:w-3/4 bg-slate-100 dark:bg-slate-900 rounded-xl relative overflow-hidden">
            <MapContainer
              center={userPos ?? [14.0583, 108.2772]}
              zoom={5}
              scrollWheelZoom={true}
              dragging={true}
              doubleClickZoom={true}
              touchZoom={true}
              zoomControl={true}
              attributionControl={false}
              className="w-full h-full"
            >
              <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />
              <FitMapOnResize />
              <GeoLocate onPosition={onPosition} onError={(e) => setGeoError(e.message)} />
              <MapInstanceReady onReady={(m) => { mapRef.current = m; }} />
              {userPos && (
                <CircleMarker center={userPos} radius={10} pathOptions={{ color: '#06b6d4', fillColor: '#06b6d4', fillOpacity: 0.6 }} />
              )}
              {searchPos && (
                <CircleMarker center={searchPos} radius={8} pathOptions={{ color: '#A855F7', fillColor: '#A855F7', fillOpacity: 0.5 }} />
              )}
            </MapContainer>
            
          </div>
          <div className="w-full lg:w-1/3 xl:w-1/4 flex flex-col space-y-4">
            <div className="bg-slate-100 dark:bg-slate-900 rounded-lg">
              <button onClick={() => setCatsOpen(o => !o)} aria-label="Bộ lọc" className="w-full flex items-center justify-between gap-2 px-3 py-2 text-sm font-semibold text-slate-700 dark:text-slate-200">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="w-4 h-4" fill="none" stroke="currentColor"><path d="M3 4h18l-6 7v6l-6-3v-3L3 4z" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className={`w-4 h-4 transition-transform ${catsOpen ? 'rotate-180' : 'rotate-0'}`} fill="none" stroke="currentColor"><path d="M6 9l6 6 6-6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
              </button>
              {catsOpen && (
                <div className="flex flex-wrap gap-2 p-2">
                  {Object.values(MapServiceType).map(type => (
                    <button
                      key={type}
                      onClick={() => toggleFilter(type)}
                      className={`px-3 py-1.5 rounded-lg text-sm font-semibold transition-all duration-300 flex-grow ${filters.includes(type) ? `${serviceColors[type]} text-white shadow-md` : 'bg-transparent border border-slate-300 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'}`}
                    >
                      <span className="inline-flex items-center">
                        {type}
                        {type === MapServiceType.HOTLINE ? (
                          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="w-4 h-4 ml-2" fill="none" stroke="currentColor"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.86 19.86 0 0 1-8.63-3.07 19.49 19.49 0 0 1-6-6 19.86 19.86 0 0 1-3.07-8.67A2 2 0 0 1 4.12 2h3a2 2 0 0 1 2 1.72 12.38 12.38 0 0 0 .67 2.73 2 2 0 0 1-.45 2.11L8 9a16 16 0 0 0 6 6l.44-.34a2 2 0 0 1 2.11-.45 12.38 12.38 0 0 0 2.73.67A2 2 0 0 1 22 16.92Z" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                        ) : null}
                      </span>
                    </button>
                  ))}
                </div>
              )}
            </div>
            <div className="flex-grow p-4 bg-slate-100 dark:bg-slate-900 rounded-lg min-h-0">
              {filters.length === 0 ? (
                <p className="text-sm text-slate-500 dark:text-slate-400 text-center">Chọn bộ lọc để hiển thị kết quả.</p>
              ) : (
                <div className="h-full overflow-y-auto custom-scroll rounded-md bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-inner">
                  {filters.includes(MapServiceType.HOTLINE) && (
                    <div className="px-4 py-3 border-b border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900">
                      <h4 className="text-sm font-bold text-slate-900 dark:text-white mb-2">Hotline quốc gia</h4>
                      <div className="flex flex-col gap-2">
                        <a href="tel:111" className="inline-flex items-center justify-between rounded-xl px-4 py-3 text-white" style={{ background: 'linear-gradient(135deg,#ef4444 0%,#dc2626 100%)', boxShadow: '0 6px 12px rgba(15,23,42,0.15)' }}>
                          <span>111 — Bảo vệ trẻ em</span>
                        </a>
                        <a href="tel:18001768" className="inline-flex items-center justify-between rounded-xl px-4 py-3 text-white" style={{ background: 'linear-gradient(135deg,#f472b6 0%,#d946ef 100%)', boxShadow: '0 6px 12px rgba(15,23,42,0.15)' }}>
                          <span>1800 1768 — Bảo vệ phụ nữ/trẻ em (UNFPA)</span>
                        </a>
                        <a href="tel:19009095" className="inline-flex items-center justify-between rounded-xl px-4 py-3 text-white" style={{ background: 'linear-gradient(135deg,#06b6d4 0%,#0891b2 100%)', boxShadow: '0 6px 12px rgba(15,23,42,0.15)' }}>
                          <span>1900 9095 — Bộ Y tế</span>
                        </a>
                        <a href="tel:02433335599" className="inline-flex items-center justify-between rounded-xl px-4 py-3 text-white" style={{ background: 'linear-gradient(135deg,#10b981 0%,#059669 100%)', boxShadow: '0 6px 12px rgba(15,23,42,0.15)' }}>
                          <span>024 3333 55 99 — CSAGA (Giới, Gia đình, Vị thành niên)</span>
                        </a>
                        <a href="tel:+84435770261" className="inline-flex items-center justify-between rounded-xl px-4 py-3 text-white" style={{ background: 'linear-gradient(135deg,#3b82f6 0%,#2563eb 100%)', boxShadow: '0 6px 12px rgba(15,23,42,0.15)' }}>
                          <span>(84-4) 3577 0261 — CCIHP (Sáng kiến Sức khỏe và Dân số)</span>
                        </a>
                        <a href="tel:0963061414" className="inline-flex items-center justify-between rounded-xl px-4 py-3 text-white" style={{ background: 'linear-gradient(135deg,#f97316 0%,#ea580c 100%)', boxShadow: '0 6px 12px rgba(15,23,42,0.15)' }}>
                          <span>096 306 1414 — Tư vấn tâm lý “Ngày Mai”</span>
                        </a>
                        <a href="tel:19009204" className="inline-flex items-center justify-between rounded-xl px-4 py-3 text-white" style={{ background: 'linear-gradient(135deg,#8b5cf6 0%,#6366f1 100%)', boxShadow: '0 6px 12px rgba(15,23,42,0.15)' }}>
                          <span>1900 9204 — BlueBlue Hotline (tâm lý cho thanh thiếu niên)</span>
                        </a>
                      </div>
                    </div>
                  )}
                  {userPos && nearOnly ? (
                    nearby.length > 0 ? (
                      <div className="divide-y divide-slate-200 dark:divide-slate-700">
                        {nearby.map(item => (
                          <button
                            key={`${item.lat},${item.lon}`}
                            onClick={() => {
                              setSelectedPoint(null);
                              setSearchPos([item.lat, item.lon]);
                              if (mapRef.current) mapRef.current.setView([item.lat, item.lon], 16, { animate: true });
                            }}
                            className="w-full text-left px-4 py-3 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
                          >
                            <div className="flex items-center justify-between">
                              <h4 className="font-semibold text-slate-900 dark:text-white truncate pr-3">{item.name}</h4>
                              <div className="flex items-center gap-2">
                                <span className="text-xs text-slate-500 dark:text-slate-400 whitespace-nowrap">{item.dist.toFixed(1)} km</span>
                                <a
                                  href={`https://www.google.com/maps/dir/?api=1&destination=${item.lat},${item.lon}`}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  aria-label="Dẫn đường"
                                  onClick={(e)=>e.stopPropagation()}
                                  className="inline-flex items-center justify-center rounded-md border border-slate-300 dark:border-slate-700 p-1 hover:bg-slate-100 dark:hover:bg-slate-700"
                                >
                                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="w-4 h-4" fill="none" stroke="currentColor"><circle cx="12" cy="12" r="10" strokeWidth="2"/><path d="M16.24 7.76l-2.12 5.3-5.3 2.12 2.12-5.3 5.3-2.12z" fill="currentColor"/><circle cx="12" cy="12" r="1" fill="currentColor"/></svg>
                                </a>
                              </div>
                            </div>
                            <p className="text-sm text-slate-500 dark:text-slate-400 truncate">{item.address}</p>
                          </button>
                        ))}
                      </div>
                    ) : (
                      nearLoading ? <p className="text-sm text-slate-500 dark:text-slate-400 text-center py-6">Đang tìm kết quả gần bạn…</p> : (filters.some(t => t !== MapServiceType.HOTLINE) ? <p className="text-sm text-slate-500 dark:text-slate-400 text-center py-6">Không có kết quả trong ${RADIUS_KM} km quanh vị trí của bạn.</p> : null)
                    )
                  ) : (
                    (() => {
                      const base = MAP_SERVICES
                        .filter(sp => filters.includes(sp.type))
                        .filter(sp => !!serviceCoords[sp.id]);
                      return (
                        <div className="divide-y divide-slate-200 dark:divide-slate-700">
                          {base.map(sp => (
                            <button
                              key={sp.id}
                              onClick={() => {
                                setSelectedPoint(sp);
                                const c = serviceCoords[sp.id];
                                if (c) {
                                  setSearchPos([c.lat, c.lon]);
                                  if (mapRef.current) mapRef.current.setView([c.lat, c.lon], 16, { animate: true });
                                }
                              }}
                              className={`w-full text-left px-4 py-3 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors ${selectedPoint?.id === sp.id ? 'ring-2 ring-cyan-500' : ''}`}
                            >
                              <div className="flex items-center justify-between">
                                <h4 className="font-semibold text-slate-900 dark:text-white truncate pr-3">{sp.name}</h4>
                                {serviceCoords[sp.id] ? (
                                  <div className="flex items-center gap-2">
                                    {userPos ? (
                                      <span className="text-xs text-slate-500 dark:text-slate-400 whitespace-nowrap">
                                        {distKm(userPos, [serviceCoords[sp.id]!.lat, serviceCoords[sp.id]!.lon]).toFixed(1)} km
                                      </span>
                                    ) : null}
                                    <a
                                      href={`https://www.google.com/maps/dir/?api=1&destination=${serviceCoords[sp.id]!.lat},${serviceCoords[sp.id]!.lon}`}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      aria-label="Dẫn đường"
                                      onClick={(e)=>e.stopPropagation()}
                                      className="inline-flex items-center justify-center rounded-md border border-slate-300 dark:border-slate-700 p-1 hover:bg-slate-100 dark:hover:bg-slate-700"
                                    >
                                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="w-4 h-4" fill="none" stroke="currentColor"><circle cx="12" cy="12" r="10" strokeWidth="2"/><path d="M16.24 7.76l-2.12 5.3-5.3 2.12 2.12-5.3 5.3-2.12z" fill="currentColor"/><circle cx="12" cy="12" r="1" fill="currentColor"/></svg>
                                    </a>
                                  </div>
                                ) : null}
                              </div>
                              <p className="text-sm text-slate-500 dark:text-slate-400 truncate">{sp.address}</p>
                            </button>
                          ))}
                        </div>
                      );
                    })()
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const FitMapOnResize: React.FC = () => {
  const map = useMap();
  useEffect(() => {
    const invalidate = () => map.invalidateSize();
    const t = setTimeout(invalidate, 0);
    window.addEventListener('resize', invalidate);
    return () => { clearTimeout(t); window.removeEventListener('resize', invalidate); };
  }, [map]);
  return null;
};

const GeoLocate: React.FC<{ onPosition: (lat: number, lng: number) => void; onError?: (err: GeolocationPositionError) => void }> = ({ onPosition, onError }) => {
  const map = useMap();
  const centeredRef = useRef(false);
  useEffect(() => {
    const fallback = async () => {
      if (centeredRef.current) return;
      try {
        const res = await fetch('https://ipapi.co/json/');
        const data = await res.json();
        if (data && typeof data.latitude === 'number' && typeof data.longitude === 'number') {
          onPosition(data.latitude, data.longitude);
          map.setView([data.latitude, data.longitude], 10, { animate: true });
          centeredRef.current = true;
        }
      } catch {}
    };
    const onFound = (e: any) => {
      const { lat, lng } = e.latlng;
      onPosition(lat, lng);
      if (!centeredRef.current) {
        map.setView([lat, lng], 15, { animate: true });
        centeredRef.current = true;
      }
    };
    const onErr = (e: any) => { onError && onError(e); fallback(); };
    map.on('locationfound', onFound);
    map.on('locationerror', onErr);
    map.locate({ watch: true, enableHighAccuracy: true, timeout: 10000, maximumAge: 0 });
    return () => { map.stopLocate(); map.off('locationfound', onFound); map.off('locationerror', onErr); };
  }, [map]);
  return null;
};
const LocateButton: React.FC<{ userPos: [number, number] | null }> = ({ userPos }) => {
  const map = useMap();
  const handleClick = () => {
    if (userPos) {
      map.setView(userPos, 15, { animate: true });
      return;
    }
    if (!('geolocation' in navigator)) return;
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude, longitude } = pos.coords;
        map.setView([latitude, longitude], 15, { animate: true });
      },
      async () => {
        try {
          const res = await fetch('https://ipapi.co/json/');
          const data = await res.json();
          if (data && typeof data.latitude === 'number' && typeof data.longitude === 'number') {
            map.setView([data.latitude, data.longitude], 12, { animate: true });
          }
        } catch {}
      },
      { enableHighAccuracy: true, timeout: 8000, maximumAge: 0 }
    );
  };
  return (
    <div style={{ position: 'absolute', top: 12, right: 12, zIndex: 1000 }}>
      <button onClick={handleClick} className="px-3 py-2 rounded-lg text-sm font-bold bg-cyan-500 text-white hover:bg-cyan-600">Vị trí của tôi</button>
    </div>
  );
};
const SearchControl: React.FC<{ onResult: (lat: number, lng: number) => void }> = ({ onResult }) => {
  const map = useMap();
  const [q, setQ] = useState('');
  const [loading, setLoading] = useState(false);
  const search = async () => {
    const query = q.trim();
    if (!query) return;
    setLoading(true);
    try {
      const res = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&limit=1`);
      const data = await res.json();
      if (Array.isArray(data) && data.length > 0) {
        const item = data[0];
        const lat = parseFloat(item.lat);
        const lon = parseFloat(item.lon);
        if (!Number.isNaN(lat) && !Number.isNaN(lon)) {
          onResult(lat, lon);
          map.setView([lat, lon], 15, { animate: true });
        }
      }
    } catch {}
    setLoading(false);
  };
  return (
    <div style={{ position: 'absolute', top: 12, left: 12, zIndex: 1000 }}>
      <div className="flex items-center gap-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg p-2 shadow">
        <input value={q} onChange={(e)=>setQ(e.target.value)} placeholder="Tìm kiếm địa chỉ" className="px-2 py-1 bg-transparent outline-none text-sm dark:text-white" />
        <button onClick={search} disabled={loading} className="px-3 py-1.5 rounded-md text-sm font-bold bg-cyan-500 text-white hover:bg-cyan-600">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" className="w-4 h-4"><circle cx="11" cy="11" r="7" strokeWidth="2"/><path d="M20 20l-3.5-3.5" strokeWidth="2" strokeLinecap="round"/></svg>
        </button>
      </div>
    </div>
  );
};
const MapInstanceReady: React.FC<{ onReady: (map: any) => void }> = ({ onReady }) => {
  const map = useMap();
  useEffect(() => { onReady(map); }, [map]);
  return null;
};
