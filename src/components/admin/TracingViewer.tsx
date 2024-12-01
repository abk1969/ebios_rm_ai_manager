import React, { useState, useEffect } from 'react';
import { TracingService } from '@/decorators/withTracing';
import { Download, RefreshCw, Trash2 } from 'lucide-react';

const TracingViewer = () => {
  const [traces, setTraces] = useState<any[]>([]);
  const [filter, setFilter] = useState('');

  useEffect(() => {
    updateTraces();
  }, []);

  const updateTraces = () => {
    setTraces(TracingService.getTraces());
  };

  const clearTraces = () => {
    TracingService.clearTraces();
    updateTraces();
  };

  const downloadTraces = () => {
    const data = JSON.stringify(traces, null, 2);
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `traces-${new Date().toISOString()}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const filteredTraces = traces.filter(trace => 
    JSON.stringify(trace).toLowerCase().includes(filter.toLowerCase())
  );

  return (
    <div className="p-4">
      <div className="mb-4 flex justify-between items-center">
        <h2 className="text-xl font-semibold">Traces d'exécution</h2>
        <div className="flex space-x-2">
          <button
            onClick={updateTraces}
            className="p-2 text-gray-600 hover:text-gray-900"
            title="Rafraîchir"
          >
            <RefreshCw className="h-5 w-5" />
          </button>
          <button
            onClick={downloadTraces}
            className="p-2 text-gray-600 hover:text-gray-900"
            title="Télécharger"
          >
            <Download className="h-5 w-5" />
          </button>
          <button
            onClick={clearTraces}
            className="p-2 text-red-600 hover:text-red-700"
            title="Effacer"
          >
            <Trash2 className="h-5 w-5" />
          </button>
        </div>
      </div>

      <div className="mb-4">
        <input
          type="text"
          placeholder="Filtrer les traces..."
          className="w-full p-2 border rounded"
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
        />
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Timestamp
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Component
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Method
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Duration (ms)
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredTraces.map((trace, index) => (
              <tr key={index} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {new Date(trace.timestamp).toLocaleString()}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {trace.component}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {trace.method}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {trace.duration.toFixed(2)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                    trace.error 
                      ? 'bg-red-100 text-red-800' 
                      : 'bg-green-100 text-green-800'
                  }`}>
                    {trace.error ? 'Error' : 'Success'}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TracingViewer;