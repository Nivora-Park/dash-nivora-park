'use client';

import React, { useState, useCallback } from 'react';
import { Upload, FileText, X, CheckCircle, AlertCircle, Download } from 'lucide-react';
import Papa from 'papaparse';

interface MembershipImportData {
  name: string;
  email: string;
  phone: string;
  address: string;
  membership_type: string;
  vehicle_number: string;
  vehicle_type: string;
  start_date: string;
  end_date: string;
}

interface MembershipImportModalProps {
  isOpen: boolean;
  onClose: () => void;
  onImport: (data: MembershipImportData[]) => Promise<void>;
}

export function MembershipImportModal({
  isOpen,
  onClose,
  onImport,
}: MembershipImportModalProps) {
  const [isDragOver, setIsDragOver] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [parsedData, setParsedData] = useState<MembershipImportData[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [importStatus, setImportStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    
    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile) {
      // Accept any file that ends with .csv or has text/csv mime type
      if (droppedFile.name.toLowerCase().endsWith('.csv') || 
          droppedFile.type === 'text/csv' || 
          droppedFile.type === 'application/csv' ||
          droppedFile.type === 'text/plain') {
        setFile(droppedFile);
        parseCSV(droppedFile);
        setErrorMessage('');
      } else {
        setErrorMessage('Please upload a valid CSV file (.csv extension)');
      }
    }
  }, []);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      console.log('Selected file:', {
        name: selectedFile.name,
        type: selectedFile.type,
        size: selectedFile.size
      });
      
      // Accept any file that ends with .csv or has text/csv mime type
      if (selectedFile.name.toLowerCase().endsWith('.csv') || 
          selectedFile.type === 'text/csv' || 
          selectedFile.type === 'application/csv' ||
          selectedFile.type === 'text/plain') {
        setFile(selectedFile);
        parseCSV(selectedFile);
        setErrorMessage('');
      } else {
        setErrorMessage(`Please upload a valid CSV file. File type: ${selectedFile.type}, Name: ${selectedFile.name}`);
      }
    }
  };

  const parseCSV = (file: File) => {
    console.log('Parsing CSV file:', file.name);
    
    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        console.log('CSV parsing results:', results);
        const data = results.data as MembershipImportData[];
        setParsedData(data);
        setErrorMessage('');
      },
      error: (error) => {
        console.error('CSV parsing error:', error);
        setErrorMessage(`Error parsing CSV: ${error.message}`);
      },
    });
  };

  const handleImport = async () => {
    if (parsedData.length === 0) return;
    
    setIsLoading(true);
    setImportStatus('idle');
    
    try {
      const result = await onImport(parsedData);
      console.log('Import result:', result);
      
      if (result && result.errorCount > 0) {
        setImportStatus('error');
        setErrorMessage(`Import completed with ${result.errorCount} errors. ${result.errors?.join(', ')}`);
      } else {
        setImportStatus('success');
        setTimeout(() => {
          onClose();
          setFile(null);
          setParsedData([]);
          setImportStatus('idle');
        }, 2000);
      }
    } catch (error) {
      setImportStatus('error');
      setErrorMessage(error instanceof Error ? error.message : 'Import failed');
    } finally {
      setIsLoading(false);
    }
  };

  const downloadTemplate = () => {
    const template = [
      {
        name: 'John Doe',
        email: 'john@example.com',
        phone: '+6281234567890',
        address: 'Jl. Contoh No. 123, Jakarta',
        membership_type: 'Premium',
        vehicle_number: 'B1234ABC',
        vehicle_type: 'Car',
        start_date: '2024-01-01',
        end_date: '2024-12-31'
      }
    ];

    const csv = Papa.unparse(template);
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'membership_template.csv';
    a.click();
    window.URL.revokeObjectURL(url);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-[1px] flex items-center justify-center z-50">
      <div className="bg-white rounded-lg w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <div className="border-b p-6">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold">Import Membership Data</h2>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700"
            >
              <X className="h-6 w-6" />
            </button>
          </div>
        </div>
                <div className="p-6">

        {/* Template Download */}
        <div className="mb-6 p-4 bg-blue-50 rounded-lg">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-semibold text-blue-900">Download Template</h3>
              <p className="text-blue-700 text-sm">
                Download CSV template to see the required format
              </p>
            </div>
            <button
              onClick={downloadTemplate}
              className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              <Download className="h-4 w-4" />
              <span>Download Template</span>
            </button>
          </div>
        </div>

        {/* File Upload */}
        <div className="mb-6">
          <div
            className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
              isDragOver
                ? 'border-blue-500 bg-blue-50'
                : 'border-gray-300 hover:border-gray-400'
            }`}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
          >
            <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-lg font-medium text-gray-700 mb-2">
              Drop your CSV file here
            </p>
            <p className="text-gray-500 mb-4">
              or click to browse files
            </p>
                         <input
               type="file"
               accept=".csv,text/csv,application/csv,text/plain"
               onChange={handleFileSelect}
               className="hidden"
               id="file-upload"
             />
            <label
              htmlFor="file-upload"
              className="cursor-pointer inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              <FileText className="h-4 w-4 mr-2" />
              Choose File
            </label>
          </div>
        </div>

        {/* Error Message */}
        {errorMessage && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
            <div className="flex items-center space-x-2">
              <AlertCircle className="h-5 w-5 text-red-500" />
              <span className="text-red-700">{errorMessage}</span>
            </div>
          </div>
        )}

        {/* Success Message */}
        {importStatus === 'success' && (
          <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
            <div className="flex items-center space-x-2">
              <CheckCircle className="h-5 w-5 text-green-500" />
              <span className="text-green-700">Import successful!</span>
            </div>
          </div>
        )}

        {/* Data Preview */}
        {parsedData.length > 0 && (
          <div className="mb-6">
            <h3 className="text-lg font-semibold mb-4">
              Preview Data ({parsedData.length} records)
            </h3>
            <div className="overflow-x-auto">
              <table className="min-w-full border border-gray-200">
                <thead>
                  <tr className="bg-gray-50">
                    <th className="px-4 py-2 text-left border">Name</th>
                    <th className="px-4 py-2 text-left border">Email</th>
                    <th className="px-4 py-2 text-left border">Phone</th>
                    <th className="px-4 py-2 text-left border">Membership Type</th>
                    <th className="px-4 py-2 text-left border">Vehicle Number</th>
                  </tr>
                </thead>
                <tbody>
                  {parsedData.slice(0, 5).map((row, index) => (
                    <tr key={index} className="hover:bg-gray-50">
                      <td className="px-4 py-2 border">{row.name}</td>
                      <td className="px-4 py-2 border">{row.email}</td>
                      <td className="px-4 py-2 border">{row.phone}</td>
                      <td className="px-4 py-2 border">{row.membership_type}</td>
                      <td className="px-4 py-2 border">{row.vehicle_number}</td>
                    </tr>
                  ))}
                  {parsedData.length > 5 && (
                    <tr>
                      <td colSpan={5} className="px-4 py-2 text-center text-gray-500">
                        ... and {parsedData.length - 5} more records
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

                 {/* Action Buttons */}
         <div className="flex justify-end space-x-3">
           <button
             onClick={onClose}
             className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50"
           >
             Cancel
           </button>
           <button
             onClick={handleImport}
             disabled={parsedData.length === 0 || isLoading}
             className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
           >
             {isLoading ? 'Importing...' : `Import ${parsedData.length} Records`}
           </button>
         </div>
        </div>
      </div>
    </div>
  );
}
