import React, { useState } from 'react';
import { makeBatchPrediction } from '../services/predictionService';
import { exportToCSV, exportToExcel } from '../utils/helpers';
import toast from 'react-hot-toast';
import {
  CloudArrowUpIcon,
  DocumentArrowDownIcon,
  CheckCircleIcon,
  XCircleIcon,
  ArrowDownTrayIcon,
} from '@heroicons/react/24/outline';

const BatchPrediction = () => {
  const [file, setFile] = useState(null);
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);
  const [dragActive, setDragActive] = useState(false);

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileChange(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (selectedFile) => {
    if (selectedFile) {
      const fileType = selectedFile.name.split('.').pop().toLowerCase();
      if (['csv', 'xlsx', 'xls'].includes(fileType)) {
        setFile(selectedFile);
        setResults(null);
        toast.success('File selected successfully!');
      } else {
        toast.error('Please upload a CSV or Excel file');
      }
    }
  };

  const handleFileInput = (e) => {
    if (e.target.files && e.target.files[0]) {
      handleFileChange(e.target.files[0]);
    }
  };

  const handleUpload = async () => {
    if (!file) {
      toast.error('Please select a file first');
      return;
    }

    setLoading(true);
    try {
      const response = await makeBatchPrediction(file);
      setResults(response);
      toast.success(`Processed ${response.predictions?.length || 0} predictions successfully!`);
    } catch (error) {
      toast.error('Failed to process batch prediction. Please try again.');
      console.error('Batch prediction error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleExport = (format) => {
    if (!results || !results.predictions) {
      toast.error('No predictions to export');
      return;
    }

    const exportData = results.predictions.map((item, index) => ({
      'Row Number': index + 1,
      ...item.input,
      'Prediction': item.prediction === 1 ? 'Interested' : 'Not Interested',
      'Confidence': item.probability ? `${(item.probability * 100).toFixed(2)}%` : 'N/A',
    }));

    if (format === 'csv') {
      exportToCSV(exportData, `batch_predictions_${Date.now()}.csv`);
    } else {
      exportToExcel(exportData, `batch_predictions_${Date.now()}.xlsx`);
    }
    
    toast.success(`Exported ${exportData.length} predictions to ${format.toUpperCase()}`);
  };

  const handleReset = () => {
    setFile(null);
    setResults(null);
  };

  const getSummaryStats = () => {
    if (!results || !results.predictions) return null;
    
    const total = results.predictions.length;
    const interested = results.predictions.filter(p => p.prediction === 1).length;
    const notInterested = total - interested;
    
    return {
      total,
      interested,
      notInterested,
      interestRate: (interested / total * 100).toFixed(1),
    };
  };

  const stats = getSummaryStats();

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          Batch Prediction
        </h1>
        <p className="mt-2 text-gray-600 dark:text-gray-400">
          Upload a CSV or Excel file to predict multiple customers at once
        </p>
      </div>

      {/* Upload Section */}
      <div className="card">
        <div
          className={`border-2 border-dashed rounded-lg p-12 text-center transition-colors ${
            dragActive
              ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20'
              : 'border-gray-300 dark:border-gray-600'
          }`}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
        >
          <CloudArrowUpIcon className="h-16 w-16 mx-auto text-gray-400 mb-4" />
          
          {file ? (
            <div className="space-y-4">
              <div className="flex items-center justify-center space-x-2">
                <DocumentArrowDownIcon className="h-6 w-6 text-green-500" />
                <span className="text-lg font-medium text-gray-900 dark:text-white">
                  {file.name}
                </span>
              </div>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Size: {(file.size / 1024).toFixed(2)} KB
              </p>
              <div className="flex justify-center space-x-4">
                <button
                  onClick={handleUpload}
                  disabled={loading}
                  className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? 'Processing...' : 'Process File'}
                </button>
                <button onClick={handleReset} className="btn-secondary">
                  Choose Different File
                </button>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <p className="text-lg font-medium text-gray-900 dark:text-white">
                Drag and drop your file here
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                or click to browse
              </p>
              <label className="inline-block">
                <input
                  type="file"
                  className="hidden"
                  accept=".csv,.xlsx,.xls"
                  onChange={handleFileInput}
                />
                <span className="btn-primary cursor-pointer">
                  Select File
                </span>
              </label>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Supported formats: CSV, XLSX, XLS
              </p>
            </div>
          )}
        </div>

        {/* Sample Format Info */}
        <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
          <h4 className="font-medium text-blue-900 dark:text-blue-300 mb-2">
            Required CSV/Excel Format:
          </h4>
          <p className="text-sm text-blue-800 dark:text-blue-400">
            Columns: Gender, Age, Driving_License, Region_Code, Previously_Insured, 
            Vehicle_Age, Vehicle_Damage, Annual_Premium, Policy_Sales_Channel, Vintage
          </p>
          <button className="mt-3 text-sm text-primary-600 hover:text-primary-700 dark:text-primary-400 font-medium">
            Download Sample Template
          </button>
        </div>
      </div>

      {/* Results Section */}
      {results && stats && (
        <div className="space-y-6">
          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="card bg-gradient-to-br from-blue-500 to-blue-600 text-white">
              <p className="text-sm opacity-90">Total Processed</p>
              <p className="text-3xl font-bold mt-2">{stats.total}</p>
            </div>
            <div className="card bg-gradient-to-br from-green-500 to-green-600 text-white">
              <p className="text-sm opacity-90">Interested</p>
              <p className="text-3xl font-bold mt-2">{stats.interested}</p>
            </div>
            <div className="card bg-gradient-to-br from-red-500 to-red-600 text-white">
              <p className="text-sm opacity-90">Not Interested</p>
              <p className="text-3xl font-bold mt-2">{stats.notInterested}</p>
            </div>
            <div className="card bg-gradient-to-br from-purple-500 to-purple-600 text-white">
              <p className="text-sm opacity-90">Interest Rate</p>
              <p className="text-3xl font-bold mt-2">{stats.interestRate}%</p>
            </div>
          </div>

          {/* Export Buttons */}
          <div className="card">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Export Results
              </h3>
              <div className="flex space-x-3">
                <button
                  onClick={() => handleExport('csv')}
                  className="btn-secondary flex items-center space-x-2"
                >
                  <ArrowDownTrayIcon className="h-5 w-5" />
                  <span>Export as CSV</span>
                </button>
                <button
                  onClick={() => handleExport('excel')}
                  className="btn-primary flex items-center space-x-2"
                >
                  <ArrowDownTrayIcon className="h-5 w-5" />
                  <span>Export as Excel</span>
                </button>
              </div>
            </div>
          </div>

          {/* Results Table */}
          <div className="card">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Prediction Results
            </h3>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 dark:bg-gray-700">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Row
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Gender
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Age
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Vehicle Age
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Prediction
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Confidence
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                  {results.predictions.slice(0, 10).map((item, index) => (
                    <tr key={index} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                      <td className="px-4 py-3 text-sm text-gray-900 dark:text-gray-100">
                        {index + 1}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-900 dark:text-gray-100">
                        {item.input?.Gender || 'N/A'}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-900 dark:text-gray-100">
                        {item.input?.Age || 'N/A'}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-900 dark:text-gray-100">
                        {item.input?.Vehicle_Age || 'N/A'}
                      </td>
                      <td className="px-4 py-3 text-sm">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          item.prediction === 1
                            ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
                            : 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'
                        }`}>
                          {item.prediction === 1 ? (
                            <>
                              <CheckCircleIcon className="h-4 w-4 mr-1" />
                              Interested
                            </>
                          ) : (
                            <>
                              <XCircleIcon className="h-4 w-4 mr-1" />
                              Not Interested
                            </>
                          )}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-900 dark:text-gray-100">
                        {item.probability ? `${(item.probability * 100).toFixed(1)}%` : 'N/A'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {results.predictions.length > 10 && (
              <div className="mt-4 text-center text-sm text-gray-500 dark:text-gray-400">
                Showing first 10 of {results.predictions.length} results. Export to see all.
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default BatchPrediction;
