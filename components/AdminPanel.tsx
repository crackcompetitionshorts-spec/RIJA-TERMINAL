
import React, { useState, useEffect } from 'react';
import { GoogleGenAI } from '@google/genai';
import { SessionData, NeuralRule, Zone, LogicRule } from '../types';
import { BauhausButton, BauhausCard, BauhausInput } from './ui/BauhausComponents';
import { ADMIN_PASSWORD } from '../constants';
import { storageService } from '../services/storageService';
import { Trash2, BrainCircuit, Wand2, Terminal, Loader2, FileSpreadsheet, Upload, Link, RefreshCw, Lock, X } from 'lucide-react';
import * as XLSX from 'xlsx';

interface AdminPanelProps {
  currentData: SessionData;
  aiInstructions: string;
  onUpdateData: (data: SessionData) => void;
  onUpdateInstructions: (instr: string) => void;
  onClose: () => void;
}

export const AdminPanel: React.FC<AdminPanelProps> = ({
  currentData,
  aiInstructions,
  onUpdateData,
  onUpdateInstructions,
  onClose
}) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [formData, setFormData] = useState<SessionData>(currentData);
  const [instructionText, setInstructionText] = useState(aiInstructions);
  const [rules, setRules] = useState<NeuralRule[]>([]);
  const [logicRules, setLogicRules] = useState<LogicRule[]>([]);
  const [logicPrompt, setLogicPrompt] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [sheetUrlInput, setSheetUrlInput] = useState('');
  const [isSyncingSheet, setIsSyncingSheet] = useState(false);

  useEffect(() => {
    setRules(storageService.loadRules());
    setLogicRules(storageService.loadLogic());
    if (currentData.googleSheetId) {
        setSheetUrlInput(`https://docs.google.com/spreadsheets/d/${currentData.googleSheetId}`);
    }
  }, []);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === ADMIN_PASSWORD) {
      setIsAuthenticated(true);
    } else {
      alert("ACCESS DENIED");
    }
  };

  const handleDataChange = (
    session: 'session1' | 'session2',
    field: keyof SessionData['session1'],
    value: string
  ) => {
    setFormData(prev => ({
      ...prev,
      [session]: {
        ...prev[session],
        [field]: parseFloat(value) || 0
      }
    }));
  };

  const handleSourceToggle = (source: 'manual' | 'excel' | 'google_sheet') => {
      setFormData(prev => ({ ...prev, dataSource: source }));
  };

  const extractSheetId = (url: string) => {
    const match = url.match(/\/d\/(.*?)(\/|$)/);
    return match ? match[1] : null;
  };

  const handleGoogleSheetSync = async () => {
    const sheetId = extractSheetId(sheetUrlInput);
    if (!sheetId) { alert("Invalid URL"); return; }
    setIsSyncingSheet(true);
    try {
        const ohlcUrl = `https://docs.google.com/spreadsheets/d/${sheetId}/gviz/tq?tqx=out:csv&sheet=OHLC`;
        const zonesUrl = `https://docs.google.com/spreadsheets/d/${sheetId}/gviz/tq?tqx=out:csv&sheet=Zones`;
        const [ohlcRes, zonesRes] = await Promise.all([fetch(ohlcUrl), fetch(zonesUrl)]);
        if (!ohlcRes.ok || !zonesRes.ok) throw new Error("Failed");
        const ohlcWorkbook = XLSX.read(await ohlcRes.text(), { type: 'string' });
        const zonesWorkbook = XLSX.read(await zonesRes.text(), { type: 'string' });
        const ohlcData = XLSX.utils.sheet_to_json(ohlcWorkbook.Sheets[ohlcWorkbook.SheetNames[0]]);
        const zonesData = XLSX.utils.sheet_to_json(zonesWorkbook.Sheets[zonesWorkbook.SheetNames[0]]);
        const newFormData = { ...formData, dataSource: 'google_sheet' as const, googleSheetId: sheetId };
        ohlcData.forEach((row: any) => {
            if (row.Session == 1) newFormData.session1 = { open: Number(row.Open), high: Number(row.High), low: Number(row.Low), close: Number(row.Close) };
            else if (row.Session == 2) newFormData.session2 = { open: Number(row.Open), high: Number(row.High), low: Number(row.Low), close: Number(row.Close) };
        });
        const parsedZones: Zone[] = [];
        zonesData.forEach((row: any) => {
            parsedZones.push({
                label: row.Label || 'Zone', level: Number(row.Level), type: row.Type?.toLowerCase() || 'neural', percentage: 0, color: row.Color || '#000'
            });
        });
        newFormData.excelZones = parsedZones;
        setFormData(newFormData);
        alert("Sync Complete");
    } catch (e) { alert("Sync Failed"); } finally { setIsSyncingSheet(false); }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if(!file) return;
      const data = await file.arrayBuffer();
      const workbook = XLSX.read(data);
      const newFormData = { ...formData, dataSource: 'excel' as const };
      const ohlcSheet = workbook.Sheets['OHLC'];
      if(ohlcSheet) {
          XLSX.utils.sheet_to_json(ohlcSheet).forEach((row: any) => {
            if (row.Session == 1) newFormData.session1 = { open: Number(row.Open), high: Number(row.High), low: Number(row.Low), close: Number(row.Close) };
            else if (row.Session == 2) newFormData.session2 = { open: Number(row.Open), high: Number(row.High), low: Number(row.Low), close: Number(row.Close) };
          });
      }
      const zonesSheet = workbook.Sheets['Zones'];
      if(zonesSheet) {
          newFormData.excelZones = XLSX.utils.sheet_to_json(zonesSheet).map((row:any) => ({
             label: row.Label, level: Number(row.Level), type: row.Type?.toLowerCase(), percentage: 0, color: row.Color
          }));
      }
      setFormData(newFormData);
      alert("File Imported");
  };

  const handleAnalyzeAndInject = async () => {
    if (!logicPrompt.trim() || !process.env.API_KEY) return;
    setIsAnalyzing(true);
    try {
        const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
        const systemPrompt = `Classify logic to JSON: { "type": "ZONE" | "LOGIC", "zoneData": { ... }, "logicContent": string }. Input: ${logicPrompt}`;
        const result = await ai.models.generateContent({ model: 'gemini-3-flash-preview', contents: [{ role: 'user', parts: [{ text: systemPrompt }] }] });
        const text = result.text?.replace(/```json/g, '').replace(/```/g, '').trim();
        if (text) {
            const parsed = JSON.parse(text);
            if (parsed.type === "ZONE") {
                const newRule: NeuralRule = { id: Date.now().toString(), name: parsed.zoneData.name || "AI", base: parsed.zoneData.base || "pivot2", direction: parsed.zoneData.direction || "add", value: Number(parsed.zoneData.value), unit: parsed.zoneData.unit || "percent", color: "#000", isActive: true };
                const u = [...rules, newRule]; setRules(u); storageService.saveRules(u);
            } else {
                const newL: LogicRule = { id: Date.now().toString(), content: parsed.logicContent, isActive: true };
                const u = [...logicRules, newL]; setLogicRules(u); storageService.saveLogic(u);
            }
            setLogicPrompt('');
        }
    } catch(e) { alert("AI Error"); } finally { setIsAnalyzing(false); }
  };

  const handleDeleteRule = (id: string) => { const u = rules.filter(r => r.id !== id); setRules(u); storageService.saveRules(u); };
  const handleDeleteLogic = (id: string) => { const u = logicRules.filter(r => r.id !== id); setLogicRules(u); storageService.saveLogic(u); };
  const handleSave = () => { onUpdateData(formData); onUpdateInstructions(instructionText); window.location.reload(); };

  if (!isAuthenticated) {
    return (
      <div className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4 backdrop-blur-md">
        <div className="w-full max-w-sm text-center space-y-6 bg-rh-surface p-6 md:p-8 rounded-3xl border border-rh-border shadow-soft">
          <div className="w-16 h-16 bg-black rounded-2xl mx-auto flex items-center justify-center border border-rh-border">
             <Lock className="text-rh-green" />
          </div>
          <h2 className="text-2xl font-bold text-white">Admin Access</h2>
          <form onSubmit={handleLogin} className="space-y-4">
            <input 
              type="password" 
              className="w-full bg-black border border-rh-border rounded-xl p-4 text-center text-lg font-bold tracking-widest text-white focus:outline-none focus:ring-1 focus:ring-rh-green"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••"
            />
            <div className="flex gap-2">
                <button type="button" onClick={onClose} className="flex-1 py-3 font-bold text-gray-500 hover:text-white transition-colors">Cancel</button>
                <button type="submit" className="flex-1 bg-rh-green text-black rounded-xl font-bold py-3 hover:bg-green-400">Unlock</button>
            </div>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black z-50 overflow-auto">
      <div className="max-w-5xl mx-auto p-4 md:p-6 space-y-6 md:space-y-8 pb-24">
        <div className="flex justify-between items-center pb-4 border-b border-rh-border">
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-white">System Configuration</h1>
          <button onClick={onClose} className="w-10 h-10 flex items-center justify-center rounded-full bg-rh-surface border border-rh-border text-gray-400 hover:text-white hover:border-white transition-colors">
            <X size={20} />
          </button>
        </div>

        {/* Tabs */}
        <div className="bg-rh-surface p-1 rounded-xl flex gap-1 w-full md:w-max border border-rh-border overflow-x-auto">
             {['manual', 'excel', 'google_sheet'].map((s) => (
                 <button 
                    key={s}
                    onClick={() => handleSourceToggle(s as any)}
                    className={`flex-1 md:flex-none px-4 md:px-6 py-2 rounded-lg text-xs md:text-sm font-bold capitalize transition-all whitespace-nowrap ${formData.dataSource === s ? 'bg-rh-green text-black' : 'text-gray-400 hover:text-white'}`}
                 >
                    {s.replace('_', ' ')}
                 </button>
             ))}
        </div>

        {formData.dataSource === 'manual' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <BauhausCard title="Session 1">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <BauhausInput label="Open" type="number" value={formData.session1.open} onChange={e => handleDataChange('session1', 'open', e.target.value)} />
              <BauhausInput label="High" type="number" value={formData.session1.high} onChange={e => handleDataChange('session1', 'high', e.target.value)} />
              <BauhausInput label="Low" type="number" value={formData.session1.low} onChange={e => handleDataChange('session1', 'low', e.target.value)} />
              <BauhausInput label="Close" type="number" value={formData.session1.close} onChange={e => handleDataChange('session1', 'close', e.target.value)} />
            </div>
          </BauhausCard>
          <BauhausCard title="Session 2">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <BauhausInput label="Open" type="number" value={formData.session2.open} onChange={e => handleDataChange('session2', 'open', e.target.value)} />
              <BauhausInput label="High" type="number" value={formData.session2.high} onChange={e => handleDataChange('session2', 'high', e.target.value)} />
              <BauhausInput label="Low" type="number" value={formData.session2.low} onChange={e => handleDataChange('session2', 'low', e.target.value)} />
              <BauhausInput label="Close" type="number" value={formData.session2.close} onChange={e => handleDataChange('session2', 'close', e.target.value)} />
            </div>
          </BauhausCard>
        </div>
        ) : formData.dataSource === 'excel' ? (
              <BauhausCard title="Local Data Import">
                 <div className="flex flex-col items-center justify-center p-8 border-2 border-dashed border-rh-border rounded-xl bg-black/20">
                     <FileSpreadsheet size={32} className="text-gray-600 mb-4" />
                     <label className="cursor-pointer bg-rh-green text-black px-6 py-2 rounded-full font-bold hover:shadow-[0_0_15px_#00C805]">
                        Upload .XLSX
                        <input type="file" accept=".xlsx, .xls" className="hidden" onChange={handleFileUpload} />
                     </label>
                 </div>
              </BauhausCard>
        ) : (
              <BauhausCard title="Google Drive Link">
                 <div className="flex flex-col md:flex-row gap-4">
                     <BauhausInput 
                        placeholder="Paste Sheet URL" 
                        value={sheetUrlInput}
                        onChange={(e) => setSheetUrlInput(e.target.value)}
                     />
                     <BauhausButton onClick={handleGoogleSheetSync} disabled={isSyncingSheet}>
                        {isSyncingSheet ? <Loader2 className="animate-spin" /> : "Sync"}
                     </BauhausButton>
                 </div>
              </BauhausCard>
        )}

        {/* Logic Injection */}
        <div className="pt-8 border-t border-rh-border">
            <h2 className="text-2xl font-bold mb-6 text-white">Neural Logic</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <BauhausCard className="md:col-span-1 !bg-black !border-rh-border">
                    <textarea
                        className="w-full h-32 p-3 text-sm bg-rh-surface text-white rounded-xl border border-rh-border focus:outline-none focus:ring-1 focus:ring-rh-green resize-none mb-4 placeholder:text-gray-600"
                        placeholder="Type logic rule naturally..."
                        value={logicPrompt}
                        onChange={(e) => setLogicPrompt(e.target.value)}
                    />
                    <BauhausButton onClick={handleAnalyzeAndInject} disabled={isAnalyzing} className="w-full !bg-white !text-black">
                        {isAnalyzing ? "Processing..." : "Inject Rule"}
                    </BauhausButton>
                </BauhausCard>

                <div className="md:col-span-2 space-y-4">
                    {rules.map(r => (
                        <div key={r.id} className="bg-rh-surface border border-rh-border p-4 rounded-xl flex justify-between items-center">
                            <span className="font-bold text-sm text-white">{r.name} ({r.value} {r.unit})</span>
                            <button onClick={() => handleDeleteRule(r.id)}><Trash2 size={16} className="text-gray-500 hover:text-red-500 transition-colors"/></button>
                        </div>
                    ))}
                    {logicRules.map(r => (
                        <div key={r.id} className="bg-rh-surfaceHighlight border border-l-4 border-l-rh-green border-y-0 border-r-0 p-4 rounded-r-xl flex justify-between items-center text-gray-200">
                            <span className="font-medium text-sm">{r.content}</span>
                            <button onClick={() => handleDeleteLogic(r.id)}><Trash2 size={16} className="text-gray-500 hover:text-red-500 transition-colors"/></button>
                        </div>
                    ))}
                </div>
            </div>
        </div>

        <div className="flex justify-end pt-8">
          <BauhausButton onClick={handleSave} className="w-full md:w-auto !px-12 !py-4 text-lg shadow-[0_0_20px_#00C805] hover:shadow-[0_0_30px_#00C805]">
            Save & Reboot
          </BauhausButton>
        </div>
      </div>
    </div>
  );
};
