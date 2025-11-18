import React, { useEffect, useState } from 'react';
import { Scenario } from '../types';
import { generateScenario } from '../services/geminiService';

export const ScenarioPage: React.FC = () => {
  const [scenario, setScenario] = useState<Scenario | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);

  const handleGenerateScenario = async () => {
    setLoading(true);
    setError(null);
    setScenario(null);
    setSelectedOption(null);
    const result = await generateScenario();
    if (result) {
      setScenario(result);
    } else {
      setError("Không thể tạo tình huống. Vui lòng thử lại sau.");
    }
    setLoading(false);
  };

  useEffect(() => {
    handleGenerateScenario();
  }, []);

  return (
    <div className="max-w-4xl mx-auto">
      <div className="text-center mb-12">
        <h2 className="text-4xl font-bold text-slate-900 dark:text-white mb-2">Tình Huống Tương Tác</h2>
        <p className="text-lg text-slate-500 dark:text-slate-300">Thực hành kỹ năng qua các tình huống thực tế do AI tạo ra.</p>
      </div>
      <div className="bg-white dark:bg-slate-800 p-6 sm:p-8 rounded-2xl shadow-xl shadow-slate-900/5 dark:shadow-[0_0_18px_rgba(15,23,42,0.35)] border border-slate-200 dark:border-slate-700 min-h-[400px] flex flex-col justify-center items-center">
        {loading && <div className="text-center text-slate-500 dark:text-slate-400">Đang tạo tình huống mới...</div>}
        {error && <p className="text-red-500">{error}</p>}
        {scenario && !loading && (
          <div className="w-full">
            <h3 className="text-2xl font-bold text-cyan-600 dark:text-cyan-300 text-center">{scenario.title}</h3>
            <p className="text-slate-600 dark:text-slate-300 my-6 text-center leading-relaxed">{scenario.situation}</p>
            <div className="space-y-4">
              {scenario.options.map((option, index) => (
                <div key={index}>
                  <button
                    onClick={() => setSelectedOption(index)}
                    disabled={selectedOption !== null}
                    className={`w-full text-left p-4 rounded-lg border-2 transition-all duration-300 ${selectedOption === index ? 'border-cyan-500 bg-cyan-50 dark:bg-cyan-500/10' : 'border-slate-200 dark:border-slate-700 hover:border-cyan-400 hover:bg-slate-50 dark:hover:bg-slate-800'} disabled:cursor-not-allowed`}
                  >
                    {option.text}
                  </button>
                  {selectedOption === index && (
                    <div className="p-4 mt-2 bg-slate-100 dark:bg-slate-900 rounded-lg text-slate-700 dark:text-slate-300 border-l-4 border-cyan-500 dark:border-cyan-700">
                      <p className="font-semibold mb-1">Phản hồi:</p>
                      <p>{option.feedback}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
        <button
          onClick={handleGenerateScenario}
          disabled={loading}
          className="mt-8 bg-cyan-500 hover:bg-cyan-600 dark:bg-gradient-to-r dark:from-cyan-500 dark:to-accent-purple dark:hover:from-cyan-400 dark:hover:to-accent-purple/90 text-white font-bold py-3 px-6 rounded-lg transition-all duration-300 disabled:bg-slate-400 disabled:dark:bg-slate-700 flex items-center space-x-2"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z" clipRule="evenodd" /></svg>
          <span>{selectedOption !== null ? 'Tạo tình huống khác' : 'Tạo tình huống mới'}</span>
        </button>
      </div>
    </div>
  );
};