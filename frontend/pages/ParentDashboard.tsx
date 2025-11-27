import React from 'react';
import { PARENT_RESOURCES, ICONS } from '../constants';
import { View } from '../types';

const ParentResourceItem: React.FC<{ resource: any; onOpen: () => void }> = ({ resource, onOpen }) => (
     <div className="flex items-start space-x-4 p-4 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors duration-200">
        <div className="flex-shrink-0 w-12 h-12 flex items-center justify-center rounded-full bg-accent-orange text-white shadow-lg shadow-accent-orange/30">
            {resource.icon}
        </div>
        <div className="flex-grow">
            <h3 className="font-semibold text-slate-900 dark:text-white">{resource.title}</h3>
            <p className="text-sm text-slate-500 dark:text-slate-300">{resource.description}</p>
            <button onClick={onOpen} className="mt-2 text-sm text-cyan-600 dark:text-cyan-300 font-semibold hover:underline">Tìm hiểu thêm →</button>
        </div>
    </div>
);

export const ParentDashboard: React.FC<{setView: (view: View) => void;}> = ({setView}) => (
     <div className="grid lg:grid-cols-5 gap-8 items-start">
        <div className="lg:col-span-3 bg-white dark:bg-slate-800 p-4 sm:p-6 rounded-2xl shadow- xl shadow-slate-900/5 dark:shadow-[0_0_18px_rgba(15,23,42,0.35)] border border-slate-200 dark:border-slate-700">
            <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-1">Công cụ cho Phụ huynh</h2>
            <p className="text-slate-500 dark:text-slate-300 mb-4">Đồng hành và trò chuyện cởi mở cùng con.</p>
            <div className="divide-y divide-slate-200 dark:divide-slate-700 -mx-4 sm:-mx-6">
                {PARENT_RESOURCES.map(res => (
                  <ParentResourceItem
                    key={res.id}
                    resource={res}
                    onOpen={() => {
                      if (res.id === 'p1') {
                        setView(View.PARENT_ARTICLES);
                      }
                    }}
                  />
                ))}
            </div>
        </div>
        <div className="lg:col-span-2">
           <div onClick={() => setView(View.QA)} className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-xl shadow-slate-900/5 dark:shadow-[0_0_18px_rgba(15,23,42,0.35)] border-2 border-dashed border-slate-200 dark:border-slate-700 hover:border-cyan-500 hover:dark:border-cyan-400 transition-colors duration-300 cursor-pointer text-center">
                <div className="text-cyan-500 text-4xl mb-3 flex justify-center">{ICONS.question}</div>
                <h3 className="font-bold text-lg text-slate-900 dark:text-white">Những điều con băn khoăn</h3>
                <p className="text-slate-500 dark:text-slate-300 mt-1 text-sm">Đọc các câu hỏi phổ biến (ẩn danh) để hiểu hơn về suy nghĩ của con trẻ.</p>
            </div>
        </div>
    </div>
);
