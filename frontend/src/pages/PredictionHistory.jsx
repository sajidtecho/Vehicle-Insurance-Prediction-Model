import React, { useEffect, useState } from 'react';
import { getPredictionHistory, deletePrediction, exportPredictions } from '../services/predictionService';
import { formatDate, formatPredictionResult, exportToCSV, exportToExcel } from '../utils/helpers';
import toast from 'react-hot-toast';
import {
  MagnifyingGlassIcon,
  TrashIcon,
  ArrowDownTrayIcon,
  FunnelIcon,
  CheckIcon,
} from '@heroicons/react/24/outline';

const PredictionHistory = () => {
  const [predictions, setPredictions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState('all'); // all, interested, not_interested
  const [selectedIds, setSelectedIds] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    loadHistory();
  }, [filter]);

  const loadHistory = async () => {
    setLoading(true);
    try {
      const params = {};
      if (filter !== 'all') {
        params.prediction = filter === 'interested' ? 1 : 0;
      }
      const data = await getPredictionHistory(params);
      setPredictions(data.predictions || []);
    } catch (error) {
      toast.error('Failed to load prediction history');
      console.error('Error loading history:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this prediction?')) {
      return;
    }

    try {
      await deletePrediction(id);
      toast.success('Prediction deleted successfully');
      loadHistory();
    } catch (error) {
      toast.error('Failed to delete prediction');
      console.error('Error deleting prediction:', error);
    }
  };

  const handleSelectAll = () => {
    if (selectedIds.length === filteredPredictions.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(filteredPredictions.map(p => p._id || p.id));
    }
  };

  const handleSelectOne = (id) => {
    if (selectedIds.includes(id)) {
      setSelectedIds(selectedIds.filter(selectedId => selectedId !== id));
    } else {
      setSelectedIds([...selectedIds, id]);
    }
  };

  const handleExportSelected = (format) => {
    const selectedPredictions = predictions.filter(p => 
      selectedIds.includes(p._id || p.id)
    );

    if (selectedPredictions.length === 0) {
      toast.error('Please select predictions to export');
      return;
    }

    const exportData = selectedPredictions.map((item, index) => ({
      'ID': item._id || item.id,
      'Date': formatDate(item.createdAt || item.timestamp),
      'Gender': item.data?.Gender || 'N/A',
      'Age': item.data?.Age || 'N/A',
      'Region Code': item.data?.Region_Code || 'N/A',
      'Vehicle Age': item.data?.Vehicle_Age || 'N/A',
      'Vehicle Damage': item.data?.Vehicle_Damage || 'N/A',
      'Previously Insured': item.data?.Previously_Insured === '1' ? 'Yes' : 'No',
      'Annual Premium': item.data?.Annual_Premium || 'N/A',
      'Prediction': formatPredictionResult(item.prediction),
      'Confidence': item.probability ? `${(item.probability * 100).toFixed(2)}%` : 'N/A',
    }));

    if (format === 'csv') {
      exportToCSV(exportData, `predictions_export_${Date.now()}.csv`);
    } else {
      exportToExcel(exportData, `predictions_export_${Date.now()}.xlsx`);
    }

    toast.success(`Exported ${exportData.length} predictions to ${format.toUpperCase()}`);
    setSelectedIds([]);
  };

  const filteredPredictions = predictions.filter(prediction => {
    const matchesSearch = searchTerm === '' || 
      JSON.stringify(prediction).toLowerCase().includes(searchTerm.toLowerCase());
    return matchesSearch;
  });

  const paginatedPredictions = filteredPredictions.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const totalPages = Math.ceil(filteredPredictions.length / itemsPerPage);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Prediction History
          </h1>
          <p className="mt-2 text-gray-600 dark:text-gray-400">
            View and manage all your prediction records
          </p>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="card">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
          {/* Search */}
          <div className="relative flex-1 max-w-md">
            <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search predictions..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 input-field"
            />
          </div>

          {/* Filter */}
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <FunnelIcon className="h-5 w-5 text-gray-400" />
              <select
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                className="input-field"
              >
                <option value="all">All Predictions</option>
                <option value="interested">Interested Only</option>
                <option value="not_interested">Not Interested Only</option>
              </select>
            </div>

            {/* Export Buttons */}
            {selectedIds.length > 0 && (
              <div className="flex space-x-2">
                <button
                  onClick={() => handleExportSelected('csv')}
                  className="btn-secondary flex items-center space-x-2"
                >
                  <ArrowDownTrayIcon className="h-5 w-5" />
                  <span>CSV ({selectedIds.length})</span>
                </button>
                <button
                  onClick={() => handleExportSelected('excel')}
                  className="btn-primary flex items-center space-x-2"
                >
                  <ArrowDownTrayIcon className="h-5 w-5" />
                  <span>Excel ({selectedIds.length})</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Results Count */}
      <div className="text-sm text-gray-600 dark:text-gray-400">
        Showing {paginatedPredictions.length} of {filteredPredictions.length} predictions
        {selectedIds.length > 0 && ` (${selectedIds.length} selected)`}
      </div>

      {/* Table */}
      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th className="px-4 py-3 text-left">
                  <input
                    type="checkbox"
                    checked={selectedIds.length === filteredPredictions.length && filteredPredictions.length > 0}
                    onChange={handleSelectAll}
                    className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                  />
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Customer Info
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Vehicle
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Premium
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Prediction
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Confidence
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {paginatedPredictions.map((item) => {
                const id = item._id || item.id;
                return (
                  <tr key={id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                    <td className="px-4 py-3">
                      <input
                        type="checkbox"
                        checked={selectedIds.includes(id)}
                        onChange={() => handleSelectOne(id)}
                        className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                      />
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-900 dark:text-gray-100">
                      {formatDate(item.createdAt || item.timestamp)}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-900 dark:text-gray-100">
                      <div>
                        <div>{item.data?.Gender}, {item.data?.Age} yrs</div>
                        <div className="text-xs text-gray-500">Region: {item.data?.Region_Code}</div>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-900 dark:text-gray-100">
                      <div>
                        <div>{item.data?.Vehicle_Age}</div>
                        <div className="text-xs text-gray-500">{item.data?.Vehicle_Damage === 'Yes' ? 'Has Damage' : 'No Damage'}</div>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-900 dark:text-gray-100">
                      ${parseFloat(item.data?.Annual_Premium || 0).toLocaleString()}
                    </td>
                    <td className="px-4 py-3 text-sm">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        item.prediction === 1 || item.prediction === '1'
                          ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
                          : 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'
                      }`}>
                        {formatPredictionResult(item.prediction)}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-900 dark:text-gray-100">
                      {item.probability ? `${(item.probability * 100).toFixed(1)}%` : 'N/A'}
                    </td>
                    <td className="px-4 py-3 text-sm">
                      <button
                        onClick={() => handleDelete(id)}
                        className="text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300"
                      >
                        <TrashIcon className="h-5 w-5" />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="px-4 py-3 border-t border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <button
                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="btn-secondary disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Previous
              </button>
              <span className="text-sm text-gray-700 dark:text-gray-300">
                Page {currentPage} of {totalPages}
              </span>
              <button
                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                className="btn-secondary disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>

      {filteredPredictions.length === 0 && (
        <div className="card text-center py-12">
          <p className="text-gray-500 dark:text-gray-400">
            No predictions found. Make some predictions to see them here!
          </p>
        </div>
      )}
    </div>
  );
};

export default PredictionHistory;
