import React from 'react';
import { CourseModule, QASubmission, ServicePoint, MapServiceType, RoadmapItem, LeaderboardUser, AdminStats, ModuleCompletion, UserDistribution, UserRole } from './types';

// Icons for the main app (AURA-style dashboard)
export const ICONS = {
  dashboard: <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6"><path d="M11.25 3.75a.75.75 0 0 1 .75.75v14.25a.75.75 0 0 1-1.5 0V4.5a.75.75 0 0 1 .75-.75Zm-3.75.75a.75.75 0 0 0-1.5 0v11.25a.75.75 0 0 0 1.5 0V4.5Zm7.5 3a.75.75 0 0 1 .75.75v8.25a.75.75 0 0 1-1.5 0V8.25a.75.75 0 0 1 .75-.75Zm-3.75-.75a.75.75 0 0 0-1.5 0v14.25a.75.75 0 0 0 1.5 0V7.5Z" /></svg>,
  qa: <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6"><path fillRule="evenodd" d="M4.848 2.771A49.144 49.144 0 0 1 12 2.25c2.43 0 4.817.178 7.152.52 1.978.292 3.348 2.024 3.348 3.97v6.02c0 1.946-1.37 3.678-3.348 3.97a48.901 48.901 0 0 1-3.476.383.39.39 0 0 0-.297.15l-2.755 4.133a.75.75 0 0 1-1.248 0l-2.755-4.133a.39.39 0 0 0-.297-.15 48.9 48.9 0 0 1-3.476-.384c-1.978-.29-3.348-2.024-3.348-3.97V6.74c0-1.947 1.37-3.68 3.348-3.97ZM6.75 8.25a.75.75 0 0 1 .75-.75h9a.75.75 0 0 1 0 1.5h-9a.75.75 0 0 1-.75-.75Zm.75 2.25a.75.75 0 0 0 0 1.5H12a.75.75 0 0 0 0-1.5H7.5Z" clipRule="evenodd" /></svg>,
  map: <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6"><path d="M20.5 3l-.16.03L15 5.1 9 3 3.36 4.9c-.21.07-.36.25-.36.48V20.5c0 .28.22.5.5.5l.16-.03L9 18.9l6 2.1 5.64-1.9c.21-.07.36-.25.36-.48V3.5c0-.28-.22.5-.5-.5zM15 19l-6-2.11V5l6 2.11V19z"/></svg>,
  scenarios: <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" className="w-6 h-6"><circle cx="12" cy="5" r="2" strokeWidth="2"/><circle cx="6" cy="19" r="2" strokeWidth="2"/><circle cx="18" cy="19" r="2" strokeWidth="2"/><path d="M12 7v4" strokeWidth="2" strokeLinecap="round"/><path d="M12 11c0 2-2 3-4 3H6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/><path d="M12 11c0 2 2 3 4 3h2" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>,
  admin: <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6"><path fillRule="evenodd" d="M2.25 2.25a.75.75 0 0 0 0 1.5H3v10.5a3 3 0 0 0 3 3h1.21l-2.12 3.18a.75.75 0 0 0 1.27 1.27L9 18.21l2.64 3.96a.75.75 0 0 0 1.27-1.27L10.79 18H12a3 3 0 0 0 3-3V3.75h.75a.75.75 0 0 0 0-1.5H2.25Zm6 6a.75.75 0 0 1 .75-.75h.01a.75.75 0 0 1 .75.75v.01a.75.75 0 0 1-.75.75h-.01a.75.75 0 0 1-.75-.75V8.25Zm3 0a.75.75 0 0 1 .75-.75h.01a.75.75 0 0 1 .75.75v.01a.75.75 0 0 1-.75.75h-.01a.75.75 0 0 1-.75-.75V8.25ZM9 11.25a.75.75 0 0 0-.75.75v.01c0 .414.336.75.75.75h.01a.75.75 0 0 0 .75-.75v-.01a.75.75 0 0 0-.75-.75H9Zm3.75.75a.75.75 0 0 1 .75-.75h.01a.75.75 0 0 1 .75.75v.01a.75.75 0 0 1-.75.75h-.01a.75.75 0 0 1-.75-.75v-.01ZM9.75 15a.75.75 0 0 0-.75.75v.01c0 .414.336.75.75.75h.01a.75.75 0 0 0 .75-.75v-.01a.75.75 0 0 0-.75-.75H9.75Zm3.75.75a.75.75 0 0 1 .75-.75h.01a.75.75 0 0 1 .75.75v.01a.75.75 0 0 1-.75.75h-.01a.75.75 0 0 1-.75-.75v-.01Z" clipRule="evenodd" /><path d="M16.5 2.25a.75.75 0 0 0 0 1.5h.75a.75.75 0 0 0 0-1.5h-.75Z" /></svg>,
  sun: <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" className="w-5 h-5"><circle cx="12" cy="12" r="4" strokeWidth="2"/><path strokeLinecap="round" strokeWidth="2" d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41"/></svg>,
  moon: <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" className="w-5 h-5"><path strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="M21 12.79A9 9 0 1111.21 3a7 7 0 009.79 9.79z"/></svg>,
  body: <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6"><path fillRule="evenodd" d="M7.5 6a4.5 4.5 0 1 1 9 0 4.5 4.5 0 0 1-9 0ZM3.751 20.105a8.25 8.25 0 0 1 16.498 0 .75.75 0 0 1-.437.695A18.683 18.683 0 0 1 12 21.75c-2.673 0-5.262-.424-7.812-1.25a.75.75 0 0 1-.437-.695Z" clipRule="evenodd" /></svg>,
  heart: <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6"><path d="m11.645 20.91-.007-.003-.022-.012a15.247 15.247 0 0 1-1.383-.597 15.218 15.218 0 0 1-1.58 1.118l.192.829a1.125 1.125 0 0 1-2.247 0l-.192-.828a15.247 15.247 0 0 1-1.383.597l-.022.012-.007.004a.75.75 0 0 1-.29-.687v-1.631c0-.414.336-.75.75-.75h1.5a.75.75 0 0 1 .75.75v1.631a.75.75 0 0 1-.29.687Zm4.013-1.687a.75.75 0 0 1 .29-.687v-1.631a.75.75 0 0 1 .75-.75h1.5a.75.75 0 0 1 .75.75v1.631a.75.75 0 0 1-.29.687l-.007.003-.022.012a15.247 15.247 0 0 1-1.383.597 15.218 15.218 0 0 1-1.58-1.118l.192.829a1.125 1.125 0 0 1-2.247 0l-.192-.828a15.247 15.247 0 0 1-1.383.597l-.022-.012-.007-.004Z" /><path d="M12.965 2.25A5.25 5.25 0 0 0 7.5 7.5v.01c0 3.228 3.12 6.45 5.25 8.253 2.13-1.803 5.25-5.025 5.25-8.253V7.5a5.25 5.25 0 0 0-5.465-5.25Z" /></svg>,
  shield: <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6"><path fillRule="evenodd" d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25Zm.53 5.47a.75.75 0 0 0-1.06 0l-3 3a.75.75 0 1 0 1.06 1.06l1.72-1.72v5.69a.75.75 0 0 0 1.5 0v-5.69l1.72 1.72a.75.75 0 1 0 1.06-1.06l-3-3Z" clipRule="evenodd" /></svg>,
  chat: <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6"><path fillRule="evenodd" d="M4.848 2.771A49.144 49.144 0 0 1 12 2.25c2.43 0 4.817.178 7.152.52 1.978.292 3.348 2.024 3.348 3.97v6.02c0 1.946-1.37 3.678-3.348 3.97a48.901 48.901 0 0 1-3.476.383.39.39 0 0 0-.297.15l-2.755 4.133a.75.75 0 0 1-1.248 0l-2.755-4.133a.39.39 0 0 0-.297-.15 48.9 48.9 0 0 1-3.476-.384c-1.978-.29-3.348-2.024-3.348-3.97V6.74c0-1.947 1.37-3.68 3.348-3.97Z" clipRule="evenodd" /></svg>,
  book: <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6"><path fillRule="evenodd" d="M12 2.25a.75.75 0 0 1 .75.75v16.5a.75.75 0 0 1-1.5 0V3a.75.75 0 0 1 .75-.75Z" clipRule="evenodd" /><path d="M3.527 3.97a.75.75 0 0 1 1.06 0l7.5 7.5a.75.75 0 0 1 0 1.06l-7.5 7.5a.75.75 0 0 1-1.06-1.06L10.44 12 3.527 5.03a.75.75 0 0 1 0-1.06ZM17.473 3.97a.75.75 0 0 1 1.06 0l-7.5 7.5a.75.75 0 0 1 0 1.06l7.5 7.5a.75.75 0 1 1-1.06 1.06L10.44 12l6.973-6.97a.75.75 0 0 1 1.06 0Z" /></svg>,
  question: <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6"><path fillRule="evenodd" d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12Zm11.378-3.917c-.882 0-1.672.504-1.963 1.288-.29.784-.171 1.65.316 2.284 1.453 1.906 2.252 3.597 2.252 5.482v.25a.75.75 0 0 1-1.5 0v-.25c0-1.355-.63-2.65-1.633-3.662-.51-.508-.88-1.18-.943-1.928a2.983 2.983 0 0 1 2.97-2.97c1.65 0 2.983 1.334 2.983 2.984 0 .792-.31 1.528-.829 2.078a.75.75 0 0 1-1.189-.925c.34-.44.518-.96.518-1.503 0-.82-.66-1.48-1.48-1.48Zm-1.628 12.083a1.125 1.125 0 1 0 0-2.25 1.125 1.125 0 0 0 0 2.25Z" clipRule="evenodd" /></svg>,
  // FIX: Add users icon to fix property does not exist error
  users: <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm6-11a7 7 0 10-14 0h14z" /></svg>,
  // Gamification Icons
  lock: <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10 1a4.5 4.5 0 0 0-4.5 4.5V9H5a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-6a2 2 0 0 0-2-2h-.5V5.5A4.5 4.5 0 0 0 10 1Zm3 8V5.5a3 3 0 1 0-6 0V9h6Z" clipRule="evenodd" /></svg>,
  play: <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor"><path d="M6.3 2.841A1.5 1.5 0 0 0 4 4.11V15.89a1.5 1.5 0 0 0 2.3 1.269l9.344-5.89a1.5 1.5 0 0 0 0-2.538L6.3 2.84Z" /></svg>,
  check: <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M16.704 4.153a.75.75 0 0 1 .143 1.052l-8 10.5a.75.75 0 0 1-1.127.075l-4.5-4.5a.75.75 0 0 1 1.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 0 1 1.052-.143Z" clipRule="evenodd" /></svg>,
  trophy: <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor"><path d="M15.5 2.5a3 3 0 0 0-3-3h-5a3 3 0 0 0-3 3H1.5a1 1 0 0 0-.994.89l-1 9A1 1 0 0 0 .5 13.5H3V17a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-3.5h2.5a1 1 0 0 0 .994-.89l-1-9A1 1 0 0 0 18.5 2.5h-3ZM10 6a.75.75 0 0 1 .75.75v3.5a.75.75 0 0 1-1.5 0V6.75A.75.75 0 0 1 10 6Z" /></svg>,
  back: <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" /></svg>,
  mood: <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" className="w-6 h-6"><circle cx="12" cy="12" r="9" strokeWidth="2"/><path d="M9 10h.01M15 10h.01" strokeWidth="2" strokeLinecap="round"/><path d="M8 15c1.333-1 2.667-1 4 0s2.667 1 4 0" strokeWidth="2" strokeLinecap="round"/></svg>,
  pencil: <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" className="w-6 h-6"><path d="M16.862 3.487a2.5 2.5 0 0 1 3.536 3.536l-10.5 10.5a2 2 0 0 1-.97.53l-4.012.915a.75.75 0 0 1-.9-.9l.915-4.012a2 2 0 0 1 .53-.97l10.5-10.5Z" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/><path d="M14.5 5.5l4 4" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>,
};

// Icons for the new SafeLearn landing page
export const LANDING_ICONS = {
  logo: <div className="w-8 h-8 flex items-center justify-center rounded-full bg-cyan-500 text-white"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="w-5 h-5" fill="currentColor"><path d="M12 21.35l-1.45-1.32C6.1 15.9 3 13.05 3 9.5 3 7.02 5.02 5 7.5 5c1.74 0 3.41.81 4.5 2.09C13.09 5.81 14.76 5 16.5 5 18.98 5 21 7.02 21 9.5c0 3.55-3.1 6.4-7.55 10.53L12 21.35z"/></svg></div>,
  star: <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg>,
  shield: <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>,
  expert: <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 5l8 3-8 3-8-3 8-3z" /><path strokeLinecap="round" strokeLinejoin="round" d="M4 12v3c0 2 4 3 8 3s8-1 8-3v-3" /><path strokeLinecap="round" strokeLinejoin="round" d="M20 8v4" /></svg>,
  arrow: <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>,
  // New icons for added sections
  privacy: <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-cyan-500 dark:text-cyan-300 transition-colors duration-300 group-hover:text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>,
  science: <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-cyan-500 dark:text-cyan-300 transition-colors duration-300 group-hover:text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" /></svg>,
  interactive: <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-cyan-500 dark:text-cyan-300 transition-colors duration-300 group-hover:text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M11 4a2 2 0 114 0v1a1 1 0 001 1h3a1 1 0 011 1v3a1 1 0 01-1 1h-1a2 2 0 100 4h1a1 1 0 011 1v3a1 1 0 01-1 1h-3a1 1 0 01-1-1v-1a2 2 0 10-4 0v1a1 1 0 01-1 1H7a1 1 0 01-1-1v-3a1 1 0 00-1-1H4a2 2 0 110-4h1a1 1 0 001-1V7a1 1 0 011-1h3a1 1 0 001-1V4z" /></svg>,
  path: <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-cyan-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M13 5l7 7-7 7M5 5l7 7-7 7" /></svg>,
  anonymousQA: <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-cyan-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>,
  scenarios: <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-cyan-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="5" r="2"/><circle cx="6" cy="19" r="2"/><circle cx="18" cy="19" r="2"/><path d="M12 7v4" strokeLinecap="round"/><path d="M12 11c0 2-2 3-4 3H6" strokeLinecap="round" strokeLinejoin="round"/><path d="M12 11c0 2 2 3 4 3h2" strokeLinecap="round" strokeLinejoin="round"/></svg>,
  mapSupport: <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-cyan-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>,
  quotes: <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-slate-300" fill="currentColor" viewBox="0 0 24 24"><path d="M6.5 10c-1.18 0-2.14.93-2.24 2.1l-.1 1.4c-.13 1.63.74 3.14 2.1 3.82.2.1.42.18.64.24V19c0 .55.45 1 1 1h.5c.55 0 1-.45 1-1v-2.03c1.41-.56 2.36-1.86 2.5-3.37l.11-1.3c.2-2.33-1.44-4.3-3.6-4.3h-.31zm8 0c-1.18 0-2.14.93-2.24 2.1l-.1 1.4c-.13 1.63.74 3.14 2.1 3.82.2.1.42.18.64.24V19c0 .55.45 1 1 1h.5c.55 0 1-.45 1-1v-2.03c1.41-.56 2.36-1.86 2.5-3.37l.11-1.3c.2-2.33-1.44-4.3-3.6-4.3h-.31z" /></svg>,
};


export const STUDENT_MS_COURSES: CourseModule[] = [
  { id: 'ms1', title: 'Giới tính sinh học & tâm lý', description: 'Khám phá sự khác biệt và tương đồng giữa các giới tính.', icon: ICONS.body, progress: 75 },
  { id: 'ms2', title: 'Dậy thì và thay đổi cơ thể', description: 'Hiểu rõ những thay đổi trong giai đoạn dậy thì.', icon: ICONS.body, progress: 50 },
  { id: 'ms3', title: 'Giao tiếp & tôn trọng', description: 'Xây dựng tình bạn, ranh giới an toàn và sự đồng thuận phù hợp lứa tuổi.', icon: ICONS.book, progress: 20 },
  { id: 'ms4', title: 'Phòng chống xâm hại, quấy rối', description: 'Kỹ năng nhận biết và bảo vệ bản thân an toàn.', icon: ICONS.shield, progress: 0 },
];

export const STUDENT_HS_COURSES: CourseModule[] = [
  { id: 'hs1', title: 'Tình yêu & Mối quan hệ', description: 'Xây dựng mối quan hệ lành mạnh, tôn trọng và an toàn.', icon: ICONS.heart, progress: 60 },
  { id: 'hs2', title: 'Sức khỏe tình dục', description: 'Các biện pháp tránh thai, phòng ngừa STIs hiệu quả.', icon: ICONS.shield, progress: 30 },
  { id: 'hs3', title: 'Bản dạng giới & Xu hướng tính dục', description: 'Tìm hiểu về sự đa dạng của giới và tính dục.', icon: ICONS.body, progress: 10 },
  { id: 'hs4', title: 'Trách nhiệm pháp lý & xã hội', description: 'Luật pháp liên quan và cách ứng xử văn minh.', icon: ICONS.book, progress: 0 },
];

export const PARENT_RESOURCES = [
    { id: 'p1', title: 'Nói chuyện về giới tính với con', description: 'Các kịch bản hội thoại nhẹ nhàng, hiệu quả.', icon: ICONS.chat, type: 'article' },
    { id: 'p2', title: 'Case study: Con tò mò về tình dục', description: 'Podcast phân tích tình huống thực tế từ chuyên gia.', icon: ICONS.book, type: 'podcast' },
    { id: 'p3', title: 'Đồng hành cùng con tuổi dậy thì', description: 'Video chia sẻ từ các bậc phụ huynh khác.', icon: ICONS.body, type: 'video' },
];

export const QA_DATA: QASubmission[] = [
  { id: 1, question: 'Làm thế nào để biết mình đang trong tuổi dậy thì?', answer: 'Dậy thì có nhiều dấu hiệu như thay đổi chiều cao, giọng nói, phát triển cơ quan sinh dục, và thay đổi về tâm sinh lý. Mỗi người có một tốc độ khác nhau, đó là điều hoàn toàn bình thường.', isPopular: true },
  { id: 2, question: 'Tại sao con gái lại có kinh nguyệt?', answer: 'Kinh nguyệt là một phần tự nhiên của chu kỳ sinh sản ở nữ giới, đánh dấu khả năng có thể mang thai. Nó xảy ra khi lớp niêm mạc tử cung bong ra nếu trứng không được thụ tinh.', isPopular: true },
  { id: 3, question: '"Sự đồng thuận" (consent) có nghĩa là gì?', answer: 'Sự đồng thuận là sự đồng ý một cách tự nguyện, rõ ràng và tỉnh táo cho một hành động nào đó, đặc biệt trong các mối quan hệ. Bất cứ lúc nào bạn cũng có quyền rút lại sự đồng thuận của mình.', isPopular: true },
];

export const MAP_SERVICES: ServicePoint[] = [
    { id: 1, name: 'Phòng khám Sức khỏe Vị thành niên An Tâm', type: MapServiceType.GYNECOLOGY, address: '123 Đường Sức Khỏe, Q.1, TP.HCM', friendly: 'teen', position: { top: '25%', left: '30%' } },
    { id: 2, name: 'Trung tâm Tư vấn Tâm lý Tuổi Trẻ', type: MapServiceType.COUNSELING, address: '456 Đường Lắng Nghe, Q.3, TP.HCM', friendly: 'teen', position: { top: '40%', left: '60%' } },
    { id: 3, name: 'Phòng khám Nam khoa Hạnh Phúc', type: MapServiceType.ANDROLOGY, address: '789 Đường Tự Tin, Q.5, TP.HCM', friendly: 'all', position: { top: '65%', left: '20%' } },
    { id: 4, name: 'Tổng đài Quốc gia Bảo vệ Trẻ em', type: MapServiceType.HOTLINE, address: 'Gọi 111 (miễn phí, 24/7)', friendly: 'all', position: { top: '55%', left: '80%' } },
    { id: 5, name: 'Đường dây nóng Bộ Y tế', type: MapServiceType.HOTLINE, address: 'Gọi 1900 9095 (Y tế, 24/7)', friendly: 'all', position: { top: '50%', left: '75%' } },
];

// Gamification Data
export const ROADMAP_MS_DATA: RoadmapItem[] = [
    { id: 1, type: 'lesson', title: 'Bài 1: Cơ thể mình là duy nhất', status: 'completed', position: { top: '5%', left: '60%' } },
    { id: 2, type: 'lesson', title: 'Bài 2: Những thay đổi diệu kỳ', status: 'completed', position: { top: '18%', left: '35%' } },
    { id: 3, type: 'lesson', title: 'Bài 3: Cảm xúc tuổi mới lớn', status: 'current', position: { top: '30%', left: '70%' } },
    { id: 4, type: 'badge', title: 'Huy hiệu "Hiểu Bản Thân"', status: 'locked', position: { top: '45%', left: '50%' } },
    { id: 5, type: 'lesson', title: 'Bài 5: Tình bạn khác giới', status: 'locked', position: { top: '60%', left: '30%' } },
    { id: 6, type: 'lesson', title: 'Bài 6: Tôn trọng sự khác biệt', status: 'locked', position: { top: '75%', left: '65%' } },
    { id: 7, type: 'lesson', title: 'Bài 7: Nói "Không" đúng cách', status: 'locked', position: { top: '88%', left: '40%' } },
    { id: 8, type: 'badge', title: 'Huy hiệu "Tôn Trọng"', status: 'locked', position: { top: '100%', left: '55%' } },
];

export const ROADMAP_HS_DATA: RoadmapItem[] = [
    { id: 1, type: 'lesson', title: 'Bài 1: Đồng thuận trong mối quan hệ', status: 'completed', position: { top: '5%', left: '60%' } },
    { id: 2, type: 'lesson', title: 'Bài 2: Tránh thai an toàn', status: 'completed', position: { top: '18%', left: '35%' } },
    { id: 3, type: 'lesson', title: 'Bài 3: Phòng ngừa bệnh lây qua đường tình dục (STIs)', status: 'current', position: { top: '30%', left: '70%' } },
    { id: 4, type: 'badge', title: 'Huy hiệu "An Toàn & Tôn Trọng"', status: 'locked', position: { top: '45%', left: '50%' } },
    { id: 5, type: 'lesson', title: 'Bài 5: An toàn trên môi trường số', status: 'locked', position: { top: '60%', left: '30%' } },
    { id: 6, type: 'lesson', title: 'Bài 6: Đa dạng bản dạng giới', status: 'locked', position: { top: '75%', left: '65%' } },
    { id: 7, type: 'lesson', title: 'Bài 7: Trách nhiệm pháp lý liên quan', status: 'locked', position: { top: '88%', left: '40%' } },
    { id: 8, type: 'badge', title: 'Huy hiệu "Hiểu Luật"', status: 'locked', position: { top: '100%', left: '55%' } },
];

export const LEADERBOARD_DATA: LeaderboardUser[] = [
    { id: 1, name: 'Minh Anh', xp: 2450, avatar: 'https://i.pravatar.cc/40?u=1' },
    { id: 2, name: 'Gia Huy', xp: 2210, avatar: 'https://i.pravatar.cc/40?u=2' },
    { id: 3, name: 'Khánh An', xp: 2180, avatar: 'https://i.pravatar.cc/40?u=3' },
    { id: 4, name: 'Bạn', xp: 1850, avatar: 'https://i.pravatar.cc/40?u=4', isCurrentUser: true },
    { id: 5, name: 'Thảo Nhi', xp: 1700, avatar: 'https://i.pravatar.cc/40?u=5' },
    { id: 6, name: 'Đức Trí', xp: 1650, avatar: 'https://i.pravatar.cc/40?u=6' },
    { id: 7, name: 'Bảo Ngọc', xp: 1500, avatar: 'https://i.pravatar.cc/40?u=7' },
];

// Admin Dashboard Data
export const ADMIN_STATS_DATA: AdminStats = {
  totalStudents: { value: 10213, change: 5.2 },
  totalParents: { value: 487, change: 1.8 },
  completionRate: { value: 42, change: -2.1 },
  engagementRate: { value: 76, change: 8.3 },
};

export const MODULE_COMPLETION_DATA: ModuleCompletion[] = [
  { id: 'ms1', title: 'Giới tính', completion: 85 },
  { id: 'ms2', title: 'Dậy thì', completion: 62 },
  { id: 'ms3', title: 'Quan hệ', completion: 45 },
  { id: 'ms4', title: 'An toàn', completion: 31 },
  { id: 'hs1', title: 'Tình yêu', completion: 55 },
  { id: 'hs2', title: 'Sức khỏe TD', completion: 38 },
];

export const USER_DISTRIBUTION_DATA: UserDistribution[] = [
    { role: UserRole.STUDENT_MS, count: 6528 },
    { role: UserRole.STUDENT_HS, count: 3685 },
    { role: UserRole.PARENT, count: 487 },
];
