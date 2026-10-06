import React, { useState } from 'react';
import { DocumentRecord, DocumentCategory, Property } from '../../types';
import { formatDate } from '../../utils/formatters';
import {
  FileText,
  Plus,
  Trash2,
  Sparkles,
  Upload,
  Search,
  CheckCircle,
  AlertCircle,
  Clock,
  X,
  FileCheck,
} from 'lucide-react';

interface DocumentsViewProps {
  documents: DocumentRecord[];
  properties: Property[];
  onCreateDocument: (doc: Omit<DocumentRecord, 'id' | 'uploadDate'>) => void;
  onDeleteDocument: (id: string) => void;
}

const CATEGORIES: DocumentCategory[] = [
  'Sale deed',
  'Property agreement',
  'Insurance',
  'Tax',
  'Rental agreement',
  'Invoice',
  'Warranty',
  'Maintenance',
  'Identity',
  'Other',
];

export const DocumentsView: React.FC<DocumentsViewProps> = ({
  documents,
  properties,
  onCreateDocument,
  onDeleteDocument,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [isScanningAI, setIsScanningAI] = useState(false);
  const [aiExtractedData, setAiExtractedData] = useState<{
    docType: DocumentCategory;
    propertyName: string;
    expiryDate: string;
    docNumber: string;
    description: string;
  } | null>(null);

  // Upload form state
  const [form, setForm] = useState({
    name: '',
    propertyId: properties[0]?.id || '',
    category: 'Property agreement' as DocumentCategory,
    expiryDate: '2028-12-31',
    description: '',
    fileSize: '4.8 MB',
    fileType: 'PDF',
    docNumber: 'DOC-2026-X88',
  });

  const filtered = documents.filter((d) => {
    const matchSearch =
      d.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      d.propertyName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (d.docNumber && d.docNumber.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchCat = selectedCategory === 'All' || d.category === selectedCategory;
    return matchSearch && matchCat;
  });

  // Simulate AI document scan with extraction confirmation
  const handleSimulateAIScan = () => {
    setIsScanningAI(true);
    setTimeout(() => {
      setIsScanningAI(false);
      setAiExtractedData({
        docType: 'Insurance',
        propertyName: 'Bangalore Luxury Villa',
        expiryDate: '2027-10-24',
        docNumber: 'TATA-AIG-EXT-88910',
        description: 'Comprehensive property risk certificate with all-risk coverage extracted via Gemini OCR.',
      });
      // prefill
      setForm((prev) => ({
        ...prev,
        name: 'Tata AIG Estate Policy Renewal Form (Extracted)',
        category: 'Insurance',
        expiryDate: '2027-10-24',
        docNumber: 'TATA-AIG-EXT-88910',
        description: 'Comprehensive property risk certificate with all-risk coverage extracted via Gemini OCR.',
      }));
    }, 1200);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const prop = properties.find((p) => p.id === form.propertyId);
    if (!prop) return;

    onCreateDocument({
      name: form.name,
      propertyId: form.propertyId,
      propertyName: prop.name,
      category: form.category,
      expiryDate: form.expiryDate,
      description: form.description,
      fileSize: form.fileSize,
      fileType: form.fileType,
      verified: true,
      docNumber: form.docNumber,
    });

    setIsUploadModalOpen(false);
    setAiExtractedData(null);
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-zinc-800 pb-5">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[11px] font-mono tracking-widest uppercase text-rose-400 font-semibold">
              SECURE DEEDS & LEGAL VAULT
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-heading font-bold text-white tracking-tight">
            Document Vault
          </h1>
          <p className="text-zinc-400 text-sm mt-0.5">
            Registered title conveyances, lease deeds, municipal approvals, and warranties.
          </p>
        </div>

        <button
          onClick={() => {
            setAiExtractedData(null);
            setIsUploadModalOpen(true);
          }}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-semibold shadow-lg shadow-rose-950/60 transition-all"
        >
          <Upload className="w-4 h-4" />
          <span>Upload Document</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="p-3 rounded-xl bg-zinc-900/60 border border-zinc-800 flex flex-wrap items-center gap-3 text-xs">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="w-4 h-4 text-zinc-500 absolute left-3 top-2.5" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search documents by deed number, title, or property..."
            className="w-full bg-zinc-950 border border-zinc-800 text-white pl-9 pr-3 py-1.5 rounded-lg focus:outline-none"
          />
        </div>

        <div className="flex items-center gap-2">
          <span className="text-zinc-500">Category:</span>
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="bg-zinc-950 border border-zinc-800 rounded-lg px-2.5 py-1.5 text-white"
          >
            <option value="All">All Categories</option>
            {CATEGORIES.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Document Vault Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filtered.map((doc) => (
          <div
            key={doc.id}
            className="p-5 rounded-2xl bg-zinc-900/70 border border-zinc-800 hover:border-zinc-700 transition-all shadow-xl space-y-3 flex flex-col justify-between"
          >
            <div>
              <div className="flex items-start justify-between">
                <span className="text-[10px] font-mono uppercase text-rose-400 font-semibold px-2 py-0.5 rounded bg-rose-950/60 border border-rose-800/40">
                  {doc.category}
                </span>
                <span className="text-[10px] font-mono text-zinc-500">{doc.fileSize}</span>
              </div>

              <h3 className="text-sm font-semibold text-white mt-2 leading-snug">{doc.name}</h3>
              <div className="text-xs text-zinc-400 mt-1">{doc.propertyName}</div>

              {doc.docNumber && (
                <div className="text-[11px] font-mono text-zinc-500 mt-1">Ref: {doc.docNumber}</div>
              )}

              <p className="text-xs text-zinc-300 mt-2 leading-relaxed bg-zinc-950/40 p-2.5 rounded-lg border border-zinc-800">
                {doc.description}
              </p>
            </div>

            <div className="pt-3 border-t border-zinc-800/80 flex items-center justify-between text-xs text-zinc-500 font-mono">
              <span className="flex items-center gap-1">
                <Clock className="w-3 h-3" />
                {formatDate(doc.uploadDate)}
              </span>
              <div className="flex items-center gap-2">
                <span className="text-emerald-400 flex items-center gap-1">
                  <FileCheck className="w-3.5 h-3.5" />
                  Verified
                </span>
                <button
                  onClick={() => onDeleteDocument(doc.id)}
                  className="p-1 text-zinc-500 hover:text-rose-400 transition-colors"
                  title="Delete Document"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Upload & AI Extraction Modal */}
      {isUploadModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div onClick={() => setIsUploadModalOpen(false)} className="fixed inset-0 bg-black/80 backdrop-blur-sm" />
          <div className="relative w-full max-w-lg bg-[#0b0e14] border border-zinc-800 rounded-2xl shadow-2xl p-6 z-10 space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
              <div>
                <h3 className="text-base font-semibold text-white">Deposit Document into Vault</h3>
                <p className="text-xs text-zinc-400">Supported formats: Encrypted PDF, DOCX, JPG</p>
              </div>
              <button onClick={() => setIsUploadModalOpen(false)} className="text-zinc-400 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* AI Document Intelligence Bar */}
            <div className="p-3.5 rounded-xl bg-zinc-950 border border-rose-900/40 flex items-center justify-between gap-3">
              <div>
                <div className="flex items-center gap-1.5 text-rose-400 text-xs font-semibold">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>AI Document Intelligence (Gemini OCR)</span>
                </div>
                <p className="text-[11px] text-zinc-400 mt-0.5">
                  Scan legal clauses, expiration dates, and deed registration numbers automatically.
                </p>
              </div>
              <button
                type="button"
                onClick={handleSimulateAIScan}
                disabled={isScanningAI}
                className="px-3 py-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-white text-xs font-medium shrink-0 flex items-center gap-1"
              >
                {isScanningAI ? 'Analyzing...' : 'Run OCR'}
              </button>
            </div>

            {/* Confirmation Banner for AI Extraction (Prompt Requirement) */}
            {aiExtractedData && (
              <div className="p-3 rounded-xl bg-emerald-950/30 border border-emerald-800/60 text-xs space-y-1">
                <div className="text-emerald-300 font-semibold flex items-center gap-1.5">
                  <CheckCircle className="w-3.5 h-3.5" />
                  <span>AI Extracted Metadata (Review & Confirm Before Saving)</span>
                </div>
                <p className="text-zinc-300">
                  Extracted Type: <span className="text-white font-mono">{aiExtractedData.docType}</span> · Expiry:{' '}
                  <span className="text-white font-mono">{aiExtractedData.expiryDate}</span> · Ref:{' '}
                  <span className="text-white font-mono">{aiExtractedData.docNumber}</span>
                </p>
                <div className="text-[10px] text-zinc-400 italic">
                  *AI extracted data is provided for verification and is not guaranteed legal certitude.
                </div>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              <div>
                <label className="text-zinc-400 block mb-1">Document Title *</label>
                <input
                  type="text"
                  required
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  placeholder="e.g. Registered Conveyance Deed"
                  className="w-full bg-zinc-900 border border-zinc-800 rounded-lg p-2.5 text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-zinc-400 block mb-1">Property</label>
                  <select
                    value={form.propertyId}
                    onChange={(e) => setForm({ ...form, propertyId: e.target.value })}
                    className="w-full bg-zinc-900 border border-zinc-800 rounded-lg p-2.5 text-white"
                  >
                    {properties.map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="text-zinc-400 block mb-1">Category</label>
                  <select
                    value={form.category}
                    onChange={(e) => setForm({ ...form, category: e.target.value as any })}
                    className="w-full bg-zinc-900 border border-zinc-800 rounded-lg p-2.5 text-white"
                  >
                    {CATEGORIES.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-zinc-400 block mb-1">Doc Number / Reference</label>
                  <input
                    type="text"
                    value={form.docNumber}
                    onChange={(e) => setForm({ ...form, docNumber: e.target.value })}
                    placeholder="e.g. BLR-SR-2021"
                    className="w-full bg-zinc-900 border border-zinc-800 rounded-lg p-2.5 text-white font-mono"
                  />
                </div>
                <div>
                  <label className="text-zinc-400 block mb-1">Expiry Date (if applicable)</label>
                  <input
                    type="date"
                    value={form.expiryDate}
                    onChange={(e) => setForm({ ...form, expiryDate: e.target.value })}
                    className="w-full bg-zinc-900 border border-zinc-800 rounded-lg p-2.5 text-white font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="text-zinc-400 block mb-1">Description / Clauses</label>
                <textarea
                  rows={2}
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  placeholder="Key covenants, registration details, or warranty terms..."
                  className="w-full bg-zinc-900 border border-zinc-800 rounded-lg p-2.5 text-white"
                />
              </div>

              <div className="flex justify-end gap-3 pt-3 border-t border-zinc-800">
                <button
                  type="button"
                  onClick={() => setIsUploadModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-zinc-800 text-zinc-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-semibold"
                >
                  Deposit Document
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
