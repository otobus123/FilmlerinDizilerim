/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useMemo } from 'react';
import { 
  Film as FilmIcon, 
  Tv, 
  PlusCircle, 
  BarChart3, 
  LogOut, 
  Search, 
  Download, 
  Calendar, 
  Users, 
  Star, 
  Info, 
  Trash2, 
  Edit3,
  Sparkles,
  Zap,
  AlertTriangle,
  CheckCircle2,
  AlertCircle,
  Mail,
  ChevronDown,
  ChevronUp,
  ChevronRight,
  Settings as SettingsIcon,
  Plus,
  X,
  Play
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import * as XLSX from 'xlsx';
import { cn } from './lib/utils';
import { Film, FilmStatus, User, AppSettings, EpisodeWatchedDate } from './types';
import { fetchMovieDetails } from './services/geminiService';
import { DUMMY_DATA } from './dummyData';
import { USER_MANUAL, ManualItem } from './manualData';

const USERS = [
  { email: 'graydersile@gmail.com', password: '19071907', username: 'Grayder Sile' },
  { email: 'otobus@gmail.com', password: 'Aa12345678.', username: 'Otobüs' }
];

const DEFAULT_SETTINGS: AppSettings = {
  categories: ['Aksiyon', 'Dram', 'Komedi', 'Bilim Kurgu', 'Korku', 'Belgesel'],
  companions: ['Eşim', 'Arkadaşlarım', 'Ailem', 'Yalnız'],
  apiKeys: ['', ''],
  activeKeyIndex: 0
};

const TRANSLATIONS = {
  tr: {
    dashboard: "Dashboard",
    entry: "Film veya Dizi İşle",
    search: "Film veya Dizi Bul",
    reports: "Raporlar",
    settings: "Ayarlar",
    logout: "Çıkış Yap",
    welcome: "Hoş Geldiniz",
    recentWatched: "Son Seyredilenler",
    upcomingReleases: "Yaklaşan Vizyonlar",
    totalFilms: "Toplam Film",
    totalSeries: "Toplam Dizi",
    watchedThisMonth: "Bu Ay İzlenen",
    upcomingThisMonth: "Bu Ay Gelecek",
    movie: "Film",
    series: "Dizi",
    saveMovie: "Film İşle",
    saveSeries: "Dizi İşle",
    originalTitle: "Orijinal Adı",
    turkishTitle: "Türkçe Adı",
    plot: "Konu",
    actors: "Oyuncular",
    category: "Film/Dizi Kategorisi",
    companions: "Kiminle Seyrettim",
    watchedDate: "Seyrettiğim Tarih",
    rating: "Puanım",
    notes: "Notlar",
    trailer: "Fragman Linki",
    imdbRating: "IMDb Puanı",
    releaseYear: "Yapım Yılı",
    releaseDate: "Vizyon Tarihi",
    status: "Durum",
    seasons: "Sezon Sayısı",
    episodes: "Toplam Bölüm",
    edit: "Düzenle",
    delete: "Sil",
    cancel: "İptal",
    save: "Kaydet",
    copyTitle: "Türkçe Adı Kopyala",
    aiParser: "Manuel AI Ayrıştırıcı",
    aiParserPlaceholder: "Kopyaladığınız ve yapay zekadan aldığınız sonucu aynen buraya yapıştırınız",
    parse: "Alanlara Ayrıştır",
    parseSuccess: "Bilgiler başarıyla alanlara ayrıştırıldı",
    forgotPassword: "Şifremi Unuttum",
    rememberMe: "Şifremi Hatırla",
    login: "Giriş Yap",
    email: "E-posta Adresi",
    password: "Şifre",
    alone: "Yalnız",
    details: "Ayrıntılar",
    noData: "Veri bulunamadı",
    searchPlaceholder: "Film veya dizi ara...",
    all: "Tümü",
    watched: "Seyredilenler",
    upcoming: "Gelecekler",
    exportExcel: "Excel'e Aktar",
    sendReport: "E-posta Raporu Gönder",
    duplicates: "Mükerrer",
    bulkDelete: "Seçilenleri Sil",
    manual: "Kullanım El Kitabı",
    manualSearch: "Yardım konusu ara...",
    smtpSettings: "Google Mail (SMTP) Ayarları",
    geminiSettings: "Gemini AI Ayarları (Yedekli Sistem)",
    debugLogs: "Sistem Hata/Bilgi Günlükleri",
    backup: "Veritabanı Yedeği",
    loadDummy: "Örnek Veri Yükle",
    deleteData: "Tüm Verileri Sil"
  },
  en: {
    dashboard: "Dashboard",
    entry: "Process Movie or Series",
    search: "Find Movie or Series",
    reports: "Reports",
    settings: "Settings",
    logout: "Logout",
    welcome: "Welcome",
    recentWatched: "Recently Watched",
    upcomingReleases: "Upcoming Releases",
    totalFilms: "Total Movies",
    totalSeries: "Total Series",
    watchedThisMonth: "Watched This Month",
    upcomingThisMonth: "Upcoming This Month",
    movie: "Movie",
    series: "Series",
    saveMovie: "Process Movie",
    saveSeries: "Process Series",
    originalTitle: "Original Title",
    turkishTitle: "Turkish Title",
    plot: "Plot",
    actors: "Actors",
    category: "Movie/Series Category",
    companions: "Who I Watched With",
    watchedDate: "Watched Date",
    rating: "My Rating",
    notes: "Notes",
    trailer: "Trailer Link",
    imdbRating: "IMDb Rating",
    releaseYear: "Release Year",
    releaseDate: "Release Date",
    status: "Status",
    seasons: "Seasons",
    episodes: "Total Episodes",
    edit: "Edit",
    delete: "Delete",
    cancel: "Cancel",
    save: "Save",
    copyTitle: "Copy Turkish Title",
    aiParser: "Manual AI Parser",
    aiParserPlaceholder: "Paste the result you copied from AI exactly here",
    parse: "Parse to Fields",
    parseSuccess: "Information successfully parsed into fields",
    forgotPassword: "Forgot Password",
    rememberMe: "Remember Me",
    login: "Login",
    email: "Email Address",
    password: "Password",
    alone: "Alone",
    details: "Details",
    noData: "No data found",
    searchPlaceholder: "Search movie or series...",
    all: "All",
    watched: "Watched",
    upcoming: "Upcoming",
    exportExcel: "Export to Excel",
    sendReport: "Send Email Report",
    duplicates: "Duplicates",
    bulkDelete: "Delete Selected",
    manual: "User Manual",
    manualSearch: "Search help topics...",
    smtpSettings: "Google Mail (SMTP) Settings",
    geminiSettings: "Gemini AI Settings (Redundant System)",
    debugLogs: "System Error/Info Logs",
    backup: "Database Backup",
    loadDummy: "Load Sample Data",
    deleteData: "Delete All Data"
  }
};

const formatDate = (dateStr: string | undefined) => {
  if (!dateStr || dateStr === 'Tarih Belirtilmedi') return dateStr || 'Tarih Belirtilmedi';
  // If it's already in DD.MM.YYYY format, return as is
  if (/^\d{2}\.\d{2}\.\d{4}$/.test(dateStr)) return dateStr;
  
  try {
    const date = new Date(dateStr);
    if (isNaN(date.getTime())) return dateStr;
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}.${month}.${year}`;
  } catch (e) {
    return dateStr;
  }
};

export default function App() {
  const [user, setUser] = useState<User | null>(null);
  const [language, setLanguage] = useState<'tr' | 'en'>('tr');
  const [activeTab, setActiveTab] = useState<'dashboard' | 'entry' | 'reports' | 'settings' | 'search'>('dashboard');
  const [reportFilter, setReportFilter] = useState<FilmStatus | undefined>(undefined);
  const [films, setFilms] = useState<Film[]>([]);
  const [settings, setSettings] = useState<AppSettings>(DEFAULT_SETTINGS);
  const [isAuthReady, setIsAuthReady] = useState(false);
  const [editingFilm, setEditingFilm] = useState<Film | null>(null);

  const t = TRANSLATIONS[language];

  // Load data
  useEffect(() => {
    const savedUser = localStorage.getItem('movie_app_user');
    const savedSettings = localStorage.getItem('movie_app_settings');
    const savedFilms = localStorage.getItem('movie_app_films');
    const savedLang = localStorage.getItem('movie_app_lang');
    
    if (savedUser) setUser(JSON.parse(savedUser));
    if (savedLang) setLanguage(savedLang as 'tr' | 'en');
    if (savedSettings) {
      const parsed = JSON.parse(savedSettings);
      // Migration: if old key exists and new keys are empty, move it
      const oldKey = localStorage.getItem('movie_app_api_key');
      if (oldKey && (!parsed.apiKeys || parsed.apiKeys[0] === '')) {
        parsed.apiKeys = [oldKey, ''];
        localStorage.removeItem('movie_app_api_key');
      }
      setSettings(parsed);
    } else {
      // Check for old key even if no settings saved
      const oldKey = localStorage.getItem('movie_app_api_key');
      if (oldKey) {
        setSettings({ ...DEFAULT_SETTINGS, apiKeys: [oldKey, ''] });
        localStorage.removeItem('movie_app_api_key');
      }
    }
    
    if (savedFilms) {
      setFilms(JSON.parse(savedFilms));
    } else {
      // Load dummy data on first run
      setFilms(DUMMY_DATA);
    }
    
    setIsAuthReady(true);
  }, []);

  const addDebugLog = React.useCallback((message: string, type: 'error' | 'info' = 'info') => {
    const logs = JSON.parse(localStorage.getItem('movie_app_debug_logs') || '[]');
    logs.unshift({
      id: crypto.randomUUID(),
      timestamp: new Date().toLocaleString('tr-TR'),
      message,
      type
    });
    localStorage.setItem('movie_app_debug_logs', JSON.stringify(logs.slice(0, 50)));
  }, []);

  // Save settings
  useEffect(() => {
    if (isAuthReady) {
      localStorage.setItem('movie_app_settings', JSON.stringify(settings));
    }
  }, [settings, isAuthReady]);

  // Save data to local storage
  useEffect(() => {
    if (isAuthReady) {
      localStorage.setItem('movie_app_films', JSON.stringify(films));
    }
  }, [films, isAuthReady]);

  const handleSaveFilm = React.useCallback((f: Film) => {
    setFilms(prev => {
      if (editingFilm) {
        return prev.map(item => item.id === f.id ? f : item);
      } else {
        return [f, ...prev];
      }
    });
    setEditingFilm(null);
    setActiveTab('dashboard');
  }, [editingFilm]);

  const handleLogin = (email: string, pass: string, remember: boolean) => {
    const found = USERS.find(u => u.email === email && u.password === pass);
    if (found) {
      const userData = { email: found.email, username: found.username };
      setUser(userData);
      if (remember) {
        localStorage.setItem('movie_app_user', JSON.stringify(userData));
      } else {
        localStorage.removeItem('movie_app_user');
      }
    } else {
      alert(language === 'tr' ? 'Hatalı kullanıcı adı veya şifre!' : 'Invalid email or password!');
    }
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('movie_app_user');
  };

  if (!isAuthReady) return null;

  if (!user) {
    return <LoginScreen onLogin={handleLogin} language={language} t={t} />;
  }

  const toggleLanguage = () => {
    const newLang = language === 'tr' ? 'en' : 'tr';
    setLanguage(newLang);
    localStorage.setItem('movie_app_lang', newLang);
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-zinc-50">
      {/* Sidebar */}
      <aside className="w-full md:w-64 bg-zinc-900 text-zinc-400 p-6 flex flex-col gap-8">
        <div className="flex items-center justify-between text-white">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg overflow-hidden border-2 border-orange-500 bg-zinc-800 flex items-center justify-center">
              <svg viewBox="0 0 100 100" className="w-full h-full p-1 fill-orange-500">
                <path d="M20,10 L80,10 L90,30 L10,30 Z M10,35 L90,35 L90,90 L10,90 Z M30,45 L70,45 L70,75 L30,75 Z" />
                <circle cx="50" cy="60" r="5" fill="white" />
              </svg>
            </div>
            <h1 className="font-serif text-xl font-bold tracking-tight">{language === 'tr' ? 'Film ve Dizilerim' : 'My Movies & Series'}</h1>
          </div>
          <button 
            onClick={toggleLanguage}
            className="p-2 hover:bg-zinc-800 rounded-lg transition-colors text-xs font-bold text-orange-500 border border-orange-500/30"
          >
            {language === 'tr' ? 'ENG' : 'TUR'}
          </button>
        </div>

        <nav className="flex flex-col gap-2 flex-1">
          <NavItem 
            icon={<FilmIcon className="w-5 h-5" />} 
            label={t.dashboard} 
            active={activeTab === 'dashboard'} 
            onClick={() => setActiveTab('dashboard')} 
          />
          <NavItem 
            icon={<PlusCircle className="w-5 h-5" />} 
            label={t.entry} 
            active={activeTab === 'entry'} 
            onClick={() => setActiveTab('entry')} 
          />
          <NavItem 
            icon={<Search className="w-5 h-5" />} 
            label={t.search} 
            active={activeTab === 'search'} 
            onClick={() => setActiveTab('search')} 
          />
          <NavItem 
            icon={<BarChart3 className="w-5 h-5" />} 
            label={t.reports} 
            active={activeTab === 'reports'} 
            onClick={() => setActiveTab('reports')} 
          />
          <NavItem 
            icon={<SettingsIcon className="w-5 h-5" />} 
            label={t.settings} 
            active={activeTab === 'settings'} 
            onClick={() => setActiveTab('settings')} 
          />
        </nav>

        <div className="pt-6 border-t border-zinc-800 flex flex-col gap-4">
          <div className="flex items-center gap-3 px-2">
            <div className="w-8 h-8 rounded-full bg-zinc-700 flex items-center justify-center text-xs font-bold text-white">
              {user.username[0]}
            </div>
            <div className="flex-1 overflow-hidden">
              <p className="text-sm font-medium text-white truncate">{user.username}</p>
              <p className="text-xs truncate opacity-50">{user.email}</p>
            </div>
          </div>
          <button 
            onClick={handleLogout}
            className="flex items-center gap-2 px-2 py-2 text-sm hover:text-white transition-colors"
          >
            <LogOut className="w-4 h-4" />
            {t.logout}
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-4 md:p-8 overflow-y-auto max-h-screen">
        <AnimatePresence mode="wait">
          {activeTab === 'dashboard' && (
            <DashboardView films={films} t={t} language={language} onNavigate={(tab, filter) => {
              setReportFilter(filter);
              setActiveTab(tab);
            }} onEdit={(f) => {
              setEditingFilm(f);
              setActiveTab('entry');
            }} />
          )}
          {activeTab === 'entry' && (
            <FilmEntryView 
              settings={settings} 
              onUpdateSettings={setSettings}
              filmToEdit={editingFilm}
              addDebugLog={addDebugLog}
              onSave={handleSaveFilm} 
              t={t}
              language={language}
              onAddCategory={(cat) => setSettings(prev => ({ ...prev, categories: Array.from(new Set([...prev.categories, cat])) }))}
              onCancel={() => {
                setEditingFilm(null);
                setActiveTab('dashboard');
              }}
            />
          )}
          {activeTab === 'reports' && (
            <ReportsView 
              films={films} 
              settings={settings}
              initialFilter={reportFilter}
              t={t}
              language={language}
              onDelete={(id) => setFilms(films.filter(f => f.id !== id))}
              onBulkDelete={(ids) => {
                if (window.confirm(language === 'tr' ? `${ids.length} adet kaydı silmek istediğinize emin misiniz?` : `Are you sure you want to delete ${ids.length} records?`)) {
                  setFilms(films.filter(f => !ids.includes(f.id)));
                }
              }}
              onUpdate={(updated) => setFilms(films.map(f => f.id === updated.id ? updated : f))}
              onEdit={(f) => {
                setEditingFilm(f);
                setActiveTab('entry');
              }}
              user={user}
            />
          )}
          {activeTab === 'search' && (
            <FilmSearchView films={films} t={t} language={language} onEdit={(f) => {
              setEditingFilm(f);
              setActiveTab('entry');
            }} />
          )}
          {activeTab === 'settings' && (
            <SettingsView 
              settings={settings} 
              onUpdate={setSettings} 
              user={user} 
              films={films} 
              t={t}
              language={language}
              addDebugLog={addDebugLog} 
              onLoadDummyData={() => {
                if (window.confirm(language === 'tr' ? 'Mevcut verilerinizin üzerine 40 adet örnek film/dizi eklenecektir. Onaylıyor musunuz?' : '40 sample movies/series will be added over your existing data. Do you confirm?')) {
                  setFilms(prev => [...DUMMY_DATA, ...prev]);
                  addDebugLog('Örnek veriler başarıyla yüklendi.');
                }
              }}
              onClearData={() => {
                if (window.confirm(language === 'tr' ? 'Tüm verileriniz kalıcı olarak silinecektir. Bu işlem geri alınamaz! Onaylıyor musunuz?' : 'All your data will be permanently deleted. This action cannot be undone! Do you confirm?')) {
                  setFilms([]);
                  addDebugLog('Tüm veriler temizlendi.', 'info');
                }
              }}
            />
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}

// --- Components ---

function NavItem({ icon, label, active, onClick }: { icon: React.ReactNode, label: string, active: boolean, onClick: () => void }) {
  return (
    <button 
      onClick={onClick}
      className={cn(
        "flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200",
        active ? "bg-zinc-800 text-white shadow-lg" : "hover:bg-zinc-800/50 hover:text-zinc-200"
      )}
    >
      {icon}
      <span className="font-medium">{label}</span>
    </button>
  );
}

function SettingsView({ settings, onUpdate, user, films, t, language, addDebugLog, onLoadDummyData, onClearData }: { settings: AppSettings, onUpdate: (s: AppSettings) => void, user: User, films: Film[], t: any, language: 'tr' | 'en', addDebugLog: (msg: string, type?: 'error' | 'info') => void, onLoadDummyData: () => void, onClearData: () => void }) {
  const [newCat, setNewCat] = useState('');
  const [newComp, setNewComp] = useState('');
  const [apiKeys, setApiKeys] = useState(settings.apiKeys || ['', '']);
  const [smtp, setSmtp] = useState(settings.smtpSettings || { host: 'smtp.gmail.com', port: '465', user: '', pass: '', fromEmail: '', toEmail: '' });
  const [debugLogs, setDebugLogs] = useState<any[]>([]);
  const [testingAI, setTestingAI] = useState(false);
  const [manualSearch, setManualSearch] = useState('');

  const filteredManual = useMemo(() => {
    if (!manualSearch.trim()) return USER_MANUAL;
    const query = manualSearch.toLowerCase();
    return USER_MANUAL.filter(item => 
      item.title.toLowerCase().includes(query) || 
      item.content.toLowerCase().includes(query) ||
      item.category.toLowerCase().includes(query)
    );
  }, [manualSearch]);

  useEffect(() => {
    const logs = JSON.parse(localStorage.getItem('movie_app_debug_logs') || '[]');
    setDebugLogs(logs);
  }, []);

  const saveApiKeys = () => {
    onUpdate({ ...settings, apiKeys: apiKeys });
    alert('Gemini API Anahtarları kaydedildi.');
  };

  const testAI = async (index: number) => {
    const key = apiKeys[index];
    if (!key.trim()) return alert(`Lütfen önce ${index + 1}. anahtarı girin.`);
    setTestingAI(true);
    const startTime = performance.now();
    try {
      const results = await fetchMovieDetails('Inception', key.trim());
      const duration = ((performance.now() - startTime) / 1000).toFixed(2);
      if (results && results.length > 0) {
        alert(`AI Bağlantısı Başarılı! (Anahtar ${index + 1}, Süre: ${duration}sn)\nTest film: Inception bulundu.`);
      } else {
        alert(`AI Bağlantısı kuruldu ancak sonuç dönmedi. (Anahtar ${index + 1}, Süre: ${duration}sn)`);
      }
    } catch (err: any) {
      const duration = ((performance.now() - startTime) / 1000).toFixed(2);
      alert(`AI Test Hatası (Anahtar ${index + 1}): ${err.message}\n(Süre: ${duration}sn)`);
    } finally {
      setTestingAI(false);
    }
  };

  const saveSmtp = () => {
    onUpdate({ ...settings, smtpSettings: smtp });
    alert('SMTP ayarları kaydedildi.');
  };

  const clearDebugLogs = () => {
    localStorage.removeItem('movie_app_debug_logs');
    setDebugLogs([]);
    alert('Debug kayıtları temizlendi.');
  };

  const downloadBackup = () => {
    try {
      const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(films, null, 2));
      const downloadAnchorNode = document.createElement('a');
      downloadAnchorNode.setAttribute("href", dataStr);
      downloadAnchorNode.setAttribute("download", "film_arsivi_yedek.json");
      document.body.appendChild(downloadAnchorNode);
      downloadAnchorNode.click();
      downloadAnchorNode.remove();
      addDebugLog('Veritabanı yedeği başarıyla indirildi.');
    } catch (err: any) {
      addDebugLog(`Yedekleme hatası: ${err.message}`, 'error');
      alert('Yedekleme sırasında bir hata oluştu.');
    }
  };

  const addCategory = () => {
    if (newCat && !settings.categories.includes(newCat)) {
      onUpdate({ ...settings, categories: [...settings.categories, newCat] });
      setNewCat('');
    }
  };

  const removeCategory = (cat: string) => {
    onUpdate({ ...settings, categories: settings.categories.filter(c => c !== cat) });
  };

  const addCompanion = () => {
    if (newComp && !settings.companions.includes(newComp)) {
      onUpdate({ ...settings, companions: [...settings.companions, newComp] });
      setNewComp('');
    }
  };

  const removeCompanion = (comp: string) => {
    onUpdate({ ...settings, companions: settings.companions.filter(c => c !== comp) });
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-4xl mx-auto space-y-8"
    >
      <header>
        <h2 className="font-serif text-4xl font-bold text-zinc-900">Ayarlar</h2>
        <p className="text-zinc-500 mt-2">Kategorileri ve kiminle seyrettiğinizi buradan yönetin.</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Categories */}
        <div className="bg-white p-6 rounded-3xl border border-zinc-200 shadow-sm space-y-4">
          <h3 className="font-bold text-lg flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-orange-500" />
            Film/Dizi Kategorileri
          </h3>
          <div className="flex gap-2">
            <input 
              type="text" 
              value={newCat}
              onChange={e => setNewCat(e.target.value)}
              placeholder="Yeni kategori..."
              className="flex-1 px-4 py-2 rounded-xl border border-zinc-200 focus:ring-2 focus:ring-orange-500 outline-none"
            />
            <button onClick={addCategory} className="p-2 bg-zinc-900 text-white rounded-xl hover:bg-zinc-800">
              <Plus className="w-6 h-6" />
            </button>
          </div>
          <div className="flex flex-wrap gap-2">
            {settings.categories.map(cat => (
              <span key={cat} className="flex items-center gap-1 px-3 py-1 bg-zinc-100 text-zinc-700 rounded-lg text-sm">
                {cat}
                <button onClick={() => removeCategory(cat)} className="text-zinc-400 hover:text-red-500">
                  <X className="w-3 h-3" />
                </button>
              </span>
            ))}
          </div>
        </div>

        {/* Companions */}
        <div className="bg-white p-6 rounded-3xl border border-zinc-200 shadow-sm space-y-4">
          <h3 className="font-bold text-lg flex items-center gap-2">
            <Users className="w-5 h-5 text-blue-500" />
            Kiminle Seyrettim
          </h3>
          <div className="flex gap-2">
            <input 
              type="text" 
              value={newComp}
              onChange={e => setNewComp(e.target.value)}
              placeholder="Yeni kişi..."
              className="flex-1 px-4 py-2 rounded-xl border border-zinc-200 focus:ring-2 focus:ring-blue-500 outline-none"
            />
            <button onClick={addCompanion} className="p-2 bg-zinc-900 text-white rounded-xl hover:bg-zinc-800">
              <Plus className="w-6 h-6" />
            </button>
          </div>
          <div className="flex flex-wrap gap-2">
            {settings.companions.map(comp => (
              <span key={comp} className="flex items-center gap-1 px-3 py-1 bg-zinc-100 text-zinc-700 rounded-lg text-sm">
                {comp}
                <button onClick={() => removeCompanion(comp)} className="text-zinc-400 hover:text-red-500">
                  <X className="w-3 h-3" />
                </button>
              </span>
            ))}
          </div>
        </div>

        {/* SMTP Settings */}
        {user.email === 'otobus@gmail.com' && (
          <div className="md:col-span-2 bg-white p-6 rounded-3xl border border-zinc-200 shadow-sm space-y-6">
            <h3 className="font-bold text-lg flex items-center gap-2">
              <Mail className="w-5 h-5 text-purple-500" />
              {t.smtpSettings}
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-xs font-bold text-zinc-500">SMTP Host</label>
                <input type="text" value={smtp.host} onChange={e => setSmtp({...smtp, host: e.target.value})} className="w-full px-4 py-2 rounded-xl border border-zinc-200 outline-none" />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-bold text-zinc-500">Port (SSL: 465)</label>
                <input type="text" value={smtp.port} onChange={e => setSmtp({...smtp, port: e.target.value})} className="w-full px-4 py-2 rounded-xl border border-zinc-200 outline-none" />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-bold text-zinc-500">{language === 'tr' ? 'Gmail Adresi' : 'Gmail Address'}</label>
                <input type="email" value={smtp.user} onChange={e => setSmtp({...smtp, user: e.target.value})} className="w-full px-4 py-2 rounded-xl border border-zinc-200 outline-none" placeholder="ornek@gmail.com" />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-bold text-zinc-500">{language === 'tr' ? 'Uygulama Şifresi' : 'App Password'}</label>
                <input type="password" value={smtp.pass} onChange={e => setSmtp({...smtp, pass: e.target.value})} className="w-full px-4 py-2 rounded-xl border border-zinc-200 outline-none" placeholder="xxxx xxxx xxxx xxxx" />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-bold text-zinc-500">{language === 'tr' ? 'Gönderen E-posta' : 'Sender Email'}</label>
                <input type="email" value={smtp.fromEmail} onChange={e => setSmtp({...smtp, fromEmail: e.target.value})} className="w-full px-4 py-2 rounded-xl border border-zinc-200 outline-none" />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-bold text-zinc-500">{language === 'tr' ? 'Alıcı E-posta' : 'Receiver Email'}</label>
                <input type="email" value={smtp.toEmail} onChange={e => setSmtp({...smtp, toEmail: e.target.value})} className="w-full px-4 py-2 rounded-xl border border-zinc-200 outline-none" />
              </div>
            </div>
            <button onClick={saveSmtp} className="w-full py-3 bg-zinc-900 text-white rounded-xl font-bold hover:bg-zinc-800 transition-all">
              {language === 'tr' ? 'SMTP Ayarlarını Kaydet' : 'Save SMTP Settings'}
            </button>
          </div>
        )}

        {/* User Manual */}
        <div className="md:col-span-2 bg-white p-6 rounded-3xl border border-zinc-200 shadow-sm space-y-6">
          <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <h3 className="font-bold text-lg flex items-center gap-2">
              <Info className="w-5 h-5 text-blue-500" />
              {language === 'tr' ? 'Kullanım El Kitabı' : 'Usage Manual'}
            </h3>
            <div className="relative w-full md:w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
              <input 
                type="text" 
                value={manualSearch}
                onChange={e => setManualSearch(e.target.value)}
                placeholder={language === 'tr' ? "Yardım konusu ara..." : "Search help topic..."}
                className="w-full pl-9 pr-4 py-2 rounded-xl border border-zinc-200 text-sm outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </header>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-[500px] overflow-y-auto pr-2 custom-scrollbar">
            {filteredManual.map(item => (
              <div key={item.id} className="p-4 bg-zinc-50 rounded-2xl border border-zinc-100 space-y-2 hover:border-blue-200 transition-colors">
                <div className="flex items-center justify-between">
                  <h4 className="font-bold text-zinc-900 text-sm">{item.title}</h4>
                  <span className="text-[10px] px-2 py-0.5 bg-white border border-zinc-200 rounded-full text-zinc-500">{item.category}</span>
                </div>
                <p className="text-xs text-zinc-600 leading-relaxed">{item.content}</p>
              </div>
            ))}
            {filteredManual.length === 0 && (
              <div className="md:col-span-2 text-center py-12 text-zinc-400 italic">
                {language === 'tr' ? 'Aramanızla eşleşen bir yardım konusu bulunamadı.' : 'No help topic found matching your search.'}
              </div>
            )}
          </div>
        </div>

        {/* Gemini AI Settings */}
        {user.email === 'otobus@gmail.com' && (
          <div className="md:col-span-2 bg-white p-6 rounded-3xl border border-zinc-200 shadow-sm space-y-6">
            <h3 className="font-bold text-lg flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-orange-500" />
              {t.geminiSettings}
            </h3>
            <div className="space-y-6">
              {[0, 1].map(index => (
                <div key={index} className="space-y-2">
                  <label className="text-xs font-bold text-zinc-500 flex items-center justify-between">
                    <span>Gemini API Key {index + 1} {settings.activeKeyIndex === index && <span className="text-green-600 ml-2">({language === 'tr' ? 'Aktif' : 'Active'})</span>}</span>
                  </label>
                  <div className="flex gap-2">
                    <input 
                      type="password" 
                      value={apiKeys[index]} 
                      onChange={e => {
                        const newKeys = [...apiKeys];
                        newKeys[index] = e.target.value;
                        setApiKeys(newKeys);
                      }} 
                      className="flex-1 px-4 py-2 rounded-xl border border-zinc-200 outline-none focus:ring-2 focus:ring-orange-500" 
                      placeholder={language === 'tr' ? `${index + 1}. anahtarınızı girin...` : `Enter your ${index + 1}. key...`}
                    />
                    <button 
                      onClick={() => testAI(index)} 
                      disabled={testingAI}
                      className="px-4 py-2 bg-orange-500 text-white rounded-xl font-bold hover:bg-orange-600 transition-all disabled:opacity-50 flex items-center gap-2"
                    >
                      Test
                    </button>
                  </div>
                </div>
              ))}
              <button onClick={saveApiKeys} className="w-full py-3 bg-zinc-900 text-white rounded-xl font-bold hover:bg-zinc-800 transition-all">
                {language === 'tr' ? 'Anahtarları Kaydet' : 'Save Keys'}
              </button>
              <div className="p-4 bg-orange-50 rounded-2xl border border-orange-100 space-y-2">
                <h4 className="font-bold text-orange-900 text-sm flex items-center gap-2">
                  <Info className="w-4 h-4" />
                  {language === 'tr' ? 'Yedekli Sistem Nasıl Çalışır?' : 'How Does the Redundant System Work?'}
                </h4>
                <ul className="text-xs text-orange-800 space-y-1 list-disc pl-4">
                  {language === 'tr' ? (
                    <>
                      <li>İki farklı API anahtarı ekleyebilirsiniz.</li>
                      <li>Bir anahtarın kotası dolduğunda sistem otomatik olarak diğerini dener.</li>
                      <li>En son başarıyla çalışan anahtar, bir sonraki aramada ilk tercih olur.</li>
                      <li>Bu sayede kesintisiz ve daha hızlı bir AI deneyimi yaşarsınız.</li>
                    </>
                  ) : (
                    <>
                      <li>You can add two different API keys.</li>
                      <li>When one key's quota is full, the system automatically tries the other.</li>
                      <li>The last successfully working key becomes the first choice in the next search.</li>
                      <li>This way, you get an uninterrupted and faster AI experience.</li>
                    </>
                  )}
                </ul>
              </div>
            </div>
          </div>
        )}

        {/* Debug Logs */}
        {user.email === 'otobus@gmail.com' && (
          <div className="md:col-span-2 bg-white p-6 rounded-3xl border border-zinc-200 shadow-sm space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-lg flex items-center gap-2">
                <AlertCircle className="w-5 h-5 text-red-500" />
                Sistem Debug Kayıtları
              </h3>
              <button 
                onClick={clearDebugLogs}
                className="text-xs font-bold text-red-500 hover:text-red-600 px-3 py-1 rounded-lg hover:bg-red-50 transition-all"
              >
                Kayıtları Temizle
              </button>
            </div>
            <div className="bg-zinc-900 rounded-2xl p-4 font-mono text-[10px] h-64 overflow-y-auto space-y-2">
              {debugLogs.length === 0 ? (
                <p className="text-zinc-500 italic">Henüz bir kayıt yok.</p>
              ) : (
                debugLogs.map(log => (
                  <div key={log.id} className={cn(
                    "border-l-2 pl-2 py-1",
                    log.type === 'error' ? "border-red-500 text-red-400" : "border-blue-500 text-blue-400"
                  )}>
                    <span className="opacity-50">[{log.timestamp}]</span> {log.message}
                  </div>
                ))
              )}
            </div>
            <p className="text-[10px] text-zinc-400">Buradaki kayıtlar AI hatalarını ve sistem olaylarını takip etmenizi sağlar.</p>
          </div>
        )}

        {/* Backup Section */}
        <div className="md:col-span-2 bg-white p-6 rounded-3xl border border-zinc-200 shadow-sm space-y-6">
          <h3 className="font-bold text-lg flex items-center gap-2">
            <Download className="w-5 h-5 text-blue-500" />
            {t.backup}
          </h3>
          <p className="text-sm text-zinc-500">
            {language === 'tr' 
              ? 'Tüm film ve dizi verilerinizi JSON formatında bilgisayarınıza indirebilirsiniz. Bu dosya, verilerinizin ham halidir.' 
              : 'You can download all your movie and series data to your computer in JSON format. This file is the raw state of your data.'}
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <button 
              onClick={downloadBackup}
              className="py-3 bg-zinc-900 text-white rounded-xl font-bold hover:bg-zinc-800 transition-all flex items-center justify-center gap-2 shadow-lg shadow-zinc-900/20"
            >
              <Download className="w-5 h-5" />
              {language === 'tr' ? 'JSON Yedeği İndir' : 'Download JSON Backup'}
            </button>
            <button 
              onClick={onLoadDummyData}
              className="py-3 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition-all flex items-center justify-center gap-2 shadow-lg shadow-blue-600/20"
            >
              <PlusCircle className="w-5 h-5" />
              {t.loadDummy}
            </button>
            <button 
              onClick={onClearData}
              className="py-3 bg-red-600 text-white rounded-xl font-bold hover:bg-red-700 transition-all flex items-center justify-center gap-2 shadow-lg shadow-red-600/20"
            >
              <Trash2 className="w-5 h-5" />
              {t.deleteData}
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

function LoginScreen({ onLogin, language, t }: { onLogin: (e: string, p: string, r: boolean) => void, language: 'tr' | 'en', t: any }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [remember, setRemember] = useState(() => {
    const saved = localStorage.getItem('movie_app_remember');
    return saved === null ? true : saved === 'true';
  });
  const [forgotMode, setForgotMode] = useState(false);
  const [forgotEmail, setForgotEmail] = useState('');

  useEffect(() => {
    if (remember) {
      const savedEmail = localStorage.getItem('movie_app_login_email');
      const savedPass = localStorage.getItem('movie_app_login_pass');
      if (savedEmail) setEmail(savedEmail);
      if (savedPass) setPassword(savedPass);
    }
  }, [remember]);

  const handleLoginSubmit = () => {
    if (remember) {
      localStorage.setItem('movie_app_login_email', email);
      localStorage.setItem('movie_app_login_pass', password);
    } else {
      localStorage.removeItem('movie_app_login_email');
      localStorage.removeItem('movie_app_login_pass');
    }
    localStorage.setItem('movie_app_remember', String(remember));
    onLogin(email, password, remember);
  };

  const handleForgotSubmit = () => {
    const found = USERS.find(u => u.email === forgotEmail);
    if (found) {
      alert(language === 'tr' 
        ? `Şifreniz: ${found.password}\n(Gerçek bir sistemde bu bilgi e-postanıza gönderilirdi.)` 
        : `Your password is: ${found.password}\n(In a real system, this would be sent to your email.)`);
      setForgotMode(false);
    } else {
      alert(language === 'tr' ? 'Bu e-posta adresi sistemde kayıtlı değil!' : 'This email address is not registered in the system!');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-zinc-900 p-4">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md bg-white rounded-3xl p-8 shadow-2xl"
      >
        <div className="flex flex-col items-center gap-4 mb-8">
          <div className="p-4 bg-orange-500 rounded-2xl shadow-lg shadow-orange-500/20">
            <FilmIcon className="w-10 h-10 text-white" />
          </div>
          <h2 className="font-serif text-3xl font-bold text-zinc-900">{forgotMode ? t.forgotPassword : t.welcome}</h2>
          <p className="text-zinc-500 text-center">
            {forgotMode 
              ? (language === 'tr' ? 'Şifrenizi sıfırlamak için e-posta adresinizi girin.' : 'Enter your email address to reset your password.')
              : (language === 'tr' ? 'Film ve dizi arşivinize erişmek için giriş yapın.' : 'Log in to access your movie and series archive.')}
          </p>
        </div>

        {forgotMode ? (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-zinc-700 mb-1">{t.email}</label>
              <input 
                type="email" 
                value={forgotEmail}
                onChange={e => setForgotEmail(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-zinc-200 focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none transition-all"
                placeholder="email@example.com"
              />
            </div>
            <button 
              onClick={handleForgotSubmit}
              className="w-full bg-zinc-900 text-white py-4 rounded-xl font-bold hover:bg-zinc-800 transition-all shadow-lg active:scale-[0.98]"
            >
              {language === 'tr' ? 'Şifremi Gönder' : 'Send My Password'}
            </button>
            <button 
              onClick={() => setForgotMode(false)}
              className="w-full text-zinc-500 py-2 text-sm font-medium hover:text-zinc-700 transition-colors"
            >
              {t.cancel}
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="flex flex-wrap gap-2 mb-4 justify-center">
              {USERS.map(u => (
                <button 
                  key={u.email}
                  onClick={() => { setEmail(u.email); setPassword(u.password); }}
                  className="px-3 py-1 bg-zinc-100 hover:bg-zinc-200 rounded-full text-xs font-medium text-zinc-600 transition-colors"
                >
                  {u.username}
                </button>
              ))}
            </div>

            <div>
              <label className="block text-sm font-semibold text-zinc-700 mb-1">{t.email}</label>
              <input 
                type="email" 
                value={email}
                onChange={e => setEmail(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-zinc-200 focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none transition-all"
                placeholder="email@example.com"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-zinc-700 mb-1">{t.password}</label>
              <input 
                type="password" 
                value={password}
                onChange={e => setPassword(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-zinc-200 focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none transition-all"
                placeholder="••••••••"
              />
            </div>
            
            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 cursor-pointer">
                <input 
                  type="checkbox" 
                  checked={remember}
                  onChange={e => setRemember(e.target.checked)}
                  className="w-4 h-4 rounded border-zinc-300 text-orange-500 focus:ring-orange-500"
                />
                <span className="text-sm text-zinc-600">{t.rememberMe}</span>
              </label>
              <button 
                onClick={() => setForgotMode(true)}
                className="text-sm text-orange-600 font-medium hover:text-orange-700 transition-colors"
              >
                {t.forgotPassword}
              </button>
            </div>

            <button 
              onClick={handleLoginSubmit}
              className="w-full bg-zinc-900 text-white py-4 rounded-xl font-bold hover:bg-zinc-800 transition-all shadow-lg active:scale-[0.98]"
            >
              {t.login}
            </button>
          </div>
        )}
      </motion.div>
    </div>
  );
}

const DashboardView = React.memo(function DashboardView({ films, onNavigate, onEdit, t, language }: { films: Film[], onNavigate: (tab: any, filter?: any) => void, onEdit: (f: Film) => void, t: any, language: 'tr' | 'en' }) {
  const [selectedFilm, setSelectedFilm] = useState<Film | null>(null);
  const upcoming = films.filter(f => f.status === 'Upcoming').sort((a, b) => (a.releaseDate || '').localeCompare(b.releaseDate || ''));
  const watched = films.filter(f => f.status === 'Watched').sort((a, b) => (b.watchedDate || '').localeCompare(a.watchedDate || ''));

  const getDisplayDate = (f: Film) => {
    let date = language === 'tr' ? 'Tarih Belirtilmedi' : 'Date Not Specified';
    if (f.status === 'Upcoming') {
      date = f.releaseDate || (language === 'tr' ? 'Tarih Belirtilmedi' : 'Date Not Specified');
    } else if (f.watchedDate) {
      date = f.watchedDate;
    } else if (f.type === 'Series' && f.episodeWatchedDates && f.episodeWatchedDates.length > 0) {
      const dates = f.episodeWatchedDates
        .map(ed => ed.date)
        .filter(d => d && d.trim() !== '')
        .sort((a, b) => b.localeCompare(a));
      date = dates.length > 0 ? dates[0] : (language === 'tr' ? 'Tarih Belirtilmedi' : 'Date Not Specified');
    }
    return formatDate(date);
  };

  const stats = {
    total: films.length,
    movies: films.filter(f => f.type === 'Movie').length,
    series: films.filter(f => f.type === 'Series').length,
    watchedThisMonth: films.filter(f => {
      if (f.status !== 'Watched') return false;
      const date = f.watchedDate ? new Date(f.watchedDate) : null;
      if (!date) return false;
      const now = new Date();
      return date.getMonth() === now.getMonth() && date.getFullYear() === now.getFullYear();
    }).length,
    upcomingThisMonth: films.filter(f => {
      if (f.status !== 'Upcoming') return false;
      const date = f.releaseDate ? new Date(f.releaseDate) : null;
      if (!date) return false;
      const now = new Date();
      return date.getMonth() === now.getMonth() && date.getFullYear() === now.getFullYear();
    }).length
  };

  return (
    <motion.div 
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="space-y-8"
    >
      <header>
        <h2 className="font-serif text-4xl font-bold text-zinc-900">{t.dashboard}</h2>
        <p className="text-zinc-500 mt-2">{language === 'tr' ? 'Arşivinizin genel özeti ve yaklaşanlar.' : 'General summary of your archive and upcoming releases.'}</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div onClick={() => onNavigate('reports')} className="cursor-pointer transition-transform hover:scale-[1.02]">
          <StatCard 
            icon={<FilmIcon />} 
            label={t.totalFilms} 
            value={stats.movies} 
            color="bg-blue-500" 
          />
        </div>
        <div onClick={() => onNavigate('reports')} className="cursor-pointer transition-transform hover:scale-[1.02]">
          <StatCard 
            icon={<Tv />} 
            label={t.totalSeries} 
            value={stats.series} 
            color="bg-purple-500" 
          />
        </div>
        <div onClick={() => onNavigate('reports', 'Watched')} className="cursor-pointer transition-transform hover:scale-[1.02]">
          <StatCard icon={<CheckCircle2 />} label={t.watchedThisMonth} value={stats.watchedThisMonth} color="bg-green-500" />
        </div>
        <div onClick={() => onNavigate('reports', 'Upcoming')} className="cursor-pointer transition-transform hover:scale-[1.02]">
          <StatCard icon={<Calendar />} label={t.upcomingThisMonth} value={stats.upcomingThisMonth} color="bg-orange-500" />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <section className="bg-white p-6 rounded-3xl card-shadow border border-zinc-100">
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-serif text-xl font-bold flex items-center gap-2">
              <Calendar className="w-5 h-5 text-orange-500" />
              {t.upcomingReleases}
            </h3>
          </div>
          <div className="space-y-4">
            {upcoming.slice(0, 5).map(f => (
              <div 
                key={f.id} 
                onClick={() => setSelectedFilm(f)}
                className="flex items-center gap-4 p-4 rounded-2xl bg-zinc-50 border border-zinc-100 cursor-pointer hover:border-orange-200 transition-all"
              >
                <div className="flex-1">
                  <h4 className="font-bold text-zinc-900">{f.turkishTitle || f.originalTitle}</h4>
                  <p className="text-xs text-zinc-500">{getDisplayDate(f)}</p>
                </div>
                <div className="px-3 py-1 bg-orange-100 text-orange-700 text-[10px] font-bold uppercase rounded-full">
                  {language === 'tr' ? 'Vizyon' : 'Release'}
                </div>
              </div>
            ))}
            {upcoming.length === 0 && <p className="text-zinc-400 text-center py-8">{t.noData}</p>}
          </div>
        </section>

        <section className="bg-white p-6 rounded-3xl card-shadow border border-zinc-100">
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-serif text-xl font-bold flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-green-500" />
              {t.recentWatched}
            </h3>
          </div>
          <div className="space-y-4">
            {watched.slice(0, 5).map(f => (
              <div 
                key={f.id} 
                onClick={() => setSelectedFilm(f)}
                className="flex items-center gap-4 p-4 rounded-2xl bg-zinc-50 border border-zinc-100 cursor-pointer hover:border-green-200 transition-all"
              >
                <div className="flex-1">
                  <h4 className="font-bold text-zinc-900">{f.turkishTitle || f.originalTitle}</h4>
                  <p className="text-xs text-zinc-500">{getDisplayDate(f)}</p>
                </div>
                <div className="flex items-center gap-1">
                  <Star className="w-3 h-3 text-yellow-500 fill-yellow-500" />
                  <span className="text-sm font-bold text-zinc-700">{f.rating}</span>
                </div>
              </div>
            ))}
            {watched.length === 0 && <p className="text-zinc-400 text-center py-8">{t.noData}</p>}
          </div>
        </section>
      </div>

      {/* Detail Modal */}
      <AnimatePresence>
        {selectedFilm && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-900/60 backdrop-blur-sm">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white w-full max-w-4xl rounded-3xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col"
            >
              <div className="p-4 border-b border-zinc-100 flex items-center justify-between">
                <h3 className="font-bold text-zinc-900">{t.details}</h3>
                <button onClick={() => setSelectedFilm(null)} className="p-2 hover:bg-zinc-100 rounded-full transition-colors">
                  <X className="w-6 h-6" />
                </button>
              </div>
              <div className="flex-1 overflow-y-auto">
                <FilmDetailView film={selectedFilm} onEdit={(f) => {
                  onEdit(f);
                  setSelectedFilm(null);
                }} t={t} language={language} />
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </motion.div>
  );
});

function StatCard({ icon, label, value, color }: { icon: React.ReactNode, label: string, value: number | string, color: string }) {
  return (
    <div className="bg-white p-6 rounded-3xl card-shadow border border-zinc-100 flex items-center gap-6">
      <div className={cn("p-4 rounded-2xl text-white shadow-lg", color)}>
        {icon}
      </div>
      <div>
        <p className="text-sm font-medium text-zinc-500">{label}</p>
        <p className={cn("font-bold text-zinc-900", typeof value === 'string' ? "text-xl" : "text-3xl")}>{value}</p>
      </div>
    </div>
  );
}

function FilmEntryView({ settings, onUpdateSettings, onSave, onAddCategory, filmToEdit, onCancel, addDebugLog, t, language }: { settings: AppSettings, onUpdateSettings: (s: AppSettings) => void, onSave: (f: Film) => void, onAddCategory: (cat: string) => void, filmToEdit?: Film | null, onCancel?: () => void, addDebugLog: (msg: string, type?: 'error' | 'info') => void, t: any, language: 'tr' | 'en' }) {
  const [status, setStatus] = useState<FilmStatus>(filmToEdit?.status || 'Watched');
  const [type, setType] = useState<'Movie' | 'Series'>(filmToEdit?.type || 'Movie');
  const [originalTitle, setOriginalTitle] = useState(filmToEdit?.originalTitle || '');
  const [turkishTitle, setTurkishTitle] = useState(filmToEdit?.turkishTitle || '');
  const [releaseYear, setReleaseYear] = useState(filmToEdit?.releaseYear || '');
  const [releaseDate, setReleaseDate] = useState(filmToEdit?.releaseDate || '');
  const [plannedWatchDate, setPlannedWatchDate] = useState(filmToEdit?.plannedWatchDate || '');
  const [watchedDate, setWatchedDate] = useState(filmToEdit?.watchedDate || '');
  const [companions, setCompanions] = useState<string[]>(filmToEdit?.companions || []);
  const [category, setCategory] = useState(filmToEdit?.category || '');
  const [plot, setPlot] = useState(filmToEdit?.plot || '');
  const [actors, setActors] = useState(filmToEdit?.actors || '');
  const [imdbRating, setImdbRating] = useState(filmToEdit?.imdbRating || '');
  const [trailerLink, setTrailerLink] = useState(filmToEdit?.trailerLink || '');
  const [seasons, setSeasons] = useState<number>(filmToEdit?.seasons || 0);
  const [totalEpisodes, setTotalEpisodes] = useState<number>(filmToEdit?.totalEpisodes || 0);
  const [episodeWatchedDates, setEpisodeWatchedDates] = useState<EpisodeWatchedDate[]>(filmToEdit?.episodeWatchedDates || []);
  const [rating, setRating] = useState(filmToEdit?.rating || 5);
  const [notes, setNotes] = useState(filmToEdit?.notes || '');
  const [loadingAI, setLoadingAI] = useState(false);
  const [success, setSuccess] = useState(false);
  const [aiResults, setAiResults] = useState<any[]>([]);
  const [showAiModal, setShowAiModal] = useState(false);
  const [generatedPrompt, setGeneratedPrompt] = useState('');

  // Reset form when filmToEdit changes
  useEffect(() => {
    if (filmToEdit) {
      setStatus(filmToEdit.status);
      setType(filmToEdit.type);
      setOriginalTitle(filmToEdit.originalTitle);
      setTurkishTitle(filmToEdit.turkishTitle || '');
      setReleaseYear(filmToEdit.releaseYear || '');
      setReleaseDate(filmToEdit.releaseDate || '');
      setPlannedWatchDate(filmToEdit.plannedWatchDate || '');
      setWatchedDate(filmToEdit.watchedDate || '');
      setCompanions(filmToEdit.companions);
      setCategory(filmToEdit.category || '');
      setPlot(filmToEdit.plot);
      setActors(filmToEdit.actors);
      setImdbRating(filmToEdit.imdbRating || '');
      setTrailerLink(filmToEdit.trailerLink || '');
      setSeasons(filmToEdit.seasons || 0);
      setTotalEpisodes(filmToEdit.totalEpisodes || 0);
      setEpisodeWatchedDates(filmToEdit.episodeWatchedDates || []);
      setRating(filmToEdit.rating || 5);
      setNotes(filmToEdit.notes || '');
    }
  }, [filmToEdit]);

  const handleAISuggest = async () => {
    const searchTitle = originalTitle || turkishTitle;
    if (!searchTitle) return alert('Lütfen önce filmin orijinal adını veya Türkçe adını girin.');
    
    setLoadingAI(true);
    const startTime = performance.now();
    
    const keys = settings.apiKeys.filter(k => k.trim() !== '');
    if (keys.length === 0) {
      setLoadingAI(false);
      return alert('AI Özelliği Çalışmıyor: Lütfen Ayarlar sekmesinden API Anahtarınızı girin.');
    }

    let currentIndex = settings.activeKeyIndex;
    if (currentIndex >= keys.length) currentIndex = 0;

    const tryFetch = async (index: number, attempts: number): Promise<any> => {
      const key = keys[index];
      try {
        addDebugLog(`AI araması başlatıldı (${index + 1}. anahtar): ${searchTitle}`);
        const results = await fetchMovieDetails(searchTitle, key);
        
        // Success! Update active key index in settings
        if (index !== settings.activeKeyIndex) {
          onUpdateSettings({ ...settings, activeKeyIndex: index });
        }
        return results;
      } catch (err: any) {
        // If it's a quota or auth error and we have another key, try it
        const isAuthError = err.message === 'API_KEY_INVALID' || err.message === 'PERMISSION_DENIED';
        const isQuotaError = err.message === 'QUOTA_EXCEEDED' || err.message === 'AI_BUSY';
        
        if ((isAuthError || isQuotaError) && attempts < keys.length) {
          const nextIndex = (index + 1) % keys.length;
          addDebugLog(`Anahtar ${index + 1} başarısız (${err.message}), diğer anahtar deneniyor...`, 'error');
          return tryFetch(nextIndex, attempts + 1);
        }
        throw err;
      }
    };

    try {
      const results = await tryFetch(currentIndex, 1);
      const duration = ((performance.now() - startTime) / 1000).toFixed(2);
      
      if (results && results.length > 0) {
        addDebugLog(`${results.length} sonuç bulundu. (Süre: ${duration}sn)`);
        if (results.length === 1) {
          applyAiResult(results[0]);
        } else {
          setAiResults(results);
          setShowAiModal(true);
        }
      } else {
        addDebugLog(`Sonuç bulunamadı. (Süre: ${duration}sn)`, 'error');
        alert('Sonuç bulunamadı.');
      }
    } catch (err: any) {
      const duration = ((performance.now() - startTime) / 1000).toFixed(2);
      addDebugLog(`AI Hatası: ${err.message} (Süre: ${duration}sn)`, 'error');
      if (err.message === 'API_KEY_MISSING') {
        alert('AI Özelliği Çalışmıyor: Lütfen Ayarlar sekmesinden API Anahtarınızı girin.');
      } else if (err.message === 'AI_BUSY') {
        alert('Yapay zeka şu an çok yoğun. Lütfen birkaç saniye sonra tekrar deneyin.');
      } else if (err.message === 'QUOTA_EXCEEDED') {
        alert('AI Kotası Doldu: Tüm anahtarların kotası dolmuş olabilir. Lütfen 1 dakika bekleyip tekrar deneyin.');
      } else {
        alert(`AI verisi alınamadı: ${err.message}. İnternet bağlantınızı veya API anahtarlarınızı kontrol edin.`);
      }
    } finally {
      setLoadingAI(false);
    }
  };

  const [aiResultPaste, setAiResultPaste] = useState('');

  const handleParseAIResult = () => {
    if (!aiResultPaste.trim()) return alert('Lütfen yapay zekadan gelen sonucu yapıştırın.');
    try {
      let cleaned = aiResultPaste.trim();
      
      // Remove wrapping quotes if present (e.g. " { ... } ")
      if (cleaned.startsWith('"') && cleaned.endsWith('"')) {
        cleaned = cleaned.substring(1, cleaned.length - 1).trim();
      }
      
      // Find JSON block
      const jsonMatch = cleaned.match(/\{[\s\S]*\}/);
      let jsonStr = jsonMatch ? jsonMatch[0] : cleaned;
      
      // Handle unescaped newlines inside JSON strings which break JSON.parse
      // We replace literal newlines with spaces to make it valid JSON
      // The AI should ideally use \n escape sequence, but if it doesn't, this fix helps
      jsonStr = jsonStr.replace(/\n/g, ' ').replace(/\r/g, ' ');
      
      const details = JSON.parse(jsonStr);
      applyAiResult(details);
      setAiResultPaste('');
      alert(t.parseSuccess);
    } catch (err) {
      console.error('Parse error:', err);
      alert('Hata: Yapıştırılan metin ayrıştırılamadı. Lütfen yapay zekadan gelen JSON formatının tam ve doğru olduğundan emin olun.');
    }
  };

  const generateManualPrompt = () => {
    const searchTitle = originalTitle || turkishTitle;
    if (!searchTitle) return alert('Lütfen önce filmin adını girin.');
    
    const prompt = `Aşağıdaki film/dizi için bilgileri tam olarak şu JSON formatında ver. 
ÖNEMLİ: Sadece geçerli bir JSON objesi döndür. Metin içinde asla gerçek satır sonu (Enter) kullanma, satır sonları için sadece "\\n" karakter dizisini kullan. Başka açıklama yapma.

{
  "originalTitle": "Orijinal Ad",
  "turkishTitle": "Türkçe Ad",
  "plot": "Türkçe kısa özet",
  "actors": "Oyuncu 1\\nOyuncu 2\\nOyuncu 3",
  "category": "Kategori (TR)",
  "imdbRating": "8.5/10",
  "releaseYear": "2024",
  "trailerLink": "YouTube Linki",
  "seasons": 0,
  "totalEpisodes": 0
}

Film/Dizi Adı: "${searchTitle}"`;

    setGeneratedPrompt(prompt);
  };

  const copyPrompt = () => {
    navigator.clipboard.writeText(generatedPrompt);
    alert('Prompt kopyalandı! Şimdi ChatGPT veya Gemini\'ye yapıştırıp sonucu buraya manuel girebilirsiniz.');
  };

  const applyAiResult = (details: any) => {
    setPlot(details.plot);
    
    // Ensure actors are newline separated if they come as comma separated
    let actorsList = details.actors;
    if (actorsList.includes(',') && !actorsList.includes('\n')) {
      actorsList = actorsList.split(',').map((a: string) => a.trim()).join('\n');
    }
    setActors(actorsList);
    
    setImdbRating(details.imdbRating);
    setReleaseYear(details.releaseYear);
    setTrailerLink(details.trailerLink || '');
    
    // Update titles if they are empty
    if (!originalTitle && details.originalTitle) setOriginalTitle(details.originalTitle);
    if (!turkishTitle && details.turkishTitle) setTurkishTitle(details.turkishTitle);
    
    if (details.category) {
      setCategory(details.category);
      if (!settings.categories.includes(details.category)) {
        onAddCategory(details.category);
      }
    }

    if (type === 'Series') {
      if (details.seasons) setSeasons(details.seasons);
      if (details.totalEpisodes) {
        setTotalEpisodes(details.totalEpisodes);
        setEpisodeWatchedDates(prev => {
          const newDates = [...prev];
          for (let i = 1; i <= details.totalEpisodes; i++) {
            if (!newDates.find(d => d.episodeNumber === i)) {
              newDates.push({ episodeNumber: i, seasonNumber: 1, date: '' });
            }
          }
          return newDates.sort((a, b) => a.episodeNumber - b.episodeNumber);
        });
      }
    }
    setShowAiModal(false);
  };

  const handleSave = () => {
    if (!originalTitle) return alert(language === 'tr' ? 'Orijinal ad zorunludur.' : 'Original title is required.');
    
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const thirtyDaysFromNow = new Date(today);
    thirtyDaysFromNow.setDate(today.getDate() + 30);
    
    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);

    if (status === 'Upcoming') {
      if (!plannedWatchDate) return alert(language === 'tr' ? 'Seyretmeyi planladığınız tarih zorunludur.' : 'Planned watch date is required.');
      
      if (releaseDate) {
        const rd = new Date(releaseDate);
        if (rd < thirtyDaysFromNow) {
          return alert(language === 'tr' ? 'Vizyon tarihi bugünden itibaren en az 30 gün sonra olmalıdır.' : 'Release date must be at least 30 days from today.');
        }
      }
      
      const pwd = new Date(plannedWatchDate);
      if (pwd < thirtyDaysFromNow) {
        return alert(language === 'tr' ? 'Seyretmeyi planladığınız tarih bugünden itibaren en az 30 gün sonra olmalıdır.' : 'Planned watch date must be at least 30 days from today.');
      }
    }

    if (status === 'Watched') {
      const hasEpisodeDate = type === 'Series' && episodeWatchedDates.some(ed => ed.date && ed.date.trim() !== '');
      
      if (!watchedDate && !hasEpisodeDate) {
        return alert(language === 'tr' ? 'Seyrettiğiniz filmler için izleme tarihi zorunludur.' : 'Watched date is required for watched films.');
      }
      
      if (watchedDate) {
        const wd = new Date(watchedDate);
        if (wd > tomorrow) {
          return alert(language === 'tr' ? 'Seyrettiğiniz tarih yarından sonra olamaz. Lütfen geçerli bir tarih girin.' : 'Watched date cannot be after tomorrow. Please enter a valid date.');
        }
      }
    }
    
    const newFilm: Film = {
      id: filmToEdit?.id || crypto.randomUUID(),
      type,
      status,
      originalTitle,
      turkishTitle,
      releaseDate: status === 'Upcoming' ? releaseDate : undefined,
      plannedWatchDate: status === 'Upcoming' ? plannedWatchDate : undefined,
      watchedDate: status === 'Watched' ? watchedDate : undefined,
      releaseYear,
      companions,
      category,
      plot,
      actors,
      imdbRating,
      trailerLink,
      seasons: type === 'Series' ? seasons : undefined,
      totalEpisodes: type === 'Series' ? totalEpisodes : undefined,
      episodeWatchedDates: type === 'Series' ? episodeWatchedDates : undefined,
      rating: status === 'Watched' ? rating : undefined,
      notes,
      createdAt: filmToEdit?.createdAt || new Date().toISOString()
    };

    onSave(newFilm);
    setSuccess(true);
    setTimeout(() => {
      setSuccess(false);
      if (!filmToEdit) {
        setOriginalTitle('');
        setTurkishTitle('');
        setPlot('');
        setActors('');
        setImdbRating('');
        setTrailerLink('');
        setCategory('');
        setCompanions([]);
        setEpisodeWatchedDates([]);
        setNotes('');
        setReleaseYear('');
        setReleaseDate('');
        setPlannedWatchDate('');
        setWatchedDate('');
      }
    }, 500);
  };

  const handleEpisodeDateChange = (epNum: number, date: string) => {
    setEpisodeWatchedDates(prev => prev.map(d => d.episodeNumber === epNum ? { ...d, date } : d));
  };

  return (
    <motion.div 
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="max-w-6xl mx-auto space-y-8"
    >
      <header className="flex items-center justify-between">
        <div>
          <h2 className="font-serif text-4xl font-bold text-zinc-900">{filmToEdit ? t.edit : t.entry}</h2>
          <p className="text-zinc-500 mt-2">{filmToEdit ? (language === 'tr' ? 'Mevcut kaydı güncelleyin.' : 'Update the existing record.') : (language === 'tr' ? 'Arşivinize yeni bir film veya dizi ekleyin.' : 'Add a new movie or series to your archive.')}</p>
        </div>
        <div className="flex gap-2">
          {filmToEdit && (
            <button 
              onClick={onCancel}
              className="px-6 py-2 rounded-xl font-bold text-zinc-500 hover:bg-zinc-100 transition-all"
            >
              {t.cancel}
            </button>
          )}
          <div className="flex bg-white p-1 rounded-2xl border border-zinc-200 shadow-sm">
          <button 
            onClick={() => setStatus('Upcoming')}
            className={cn("px-6 py-2 rounded-xl font-bold transition-all", status === 'Upcoming' ? "bg-orange-500 text-white shadow-lg" : "text-zinc-500 hover:bg-zinc-50")}
          >
            {language === 'tr' ? 'Vizyona Girecek' : 'Upcoming'}
          </button>
          <button 
            onClick={() => setStatus('Watched')}
            className={cn("px-6 py-2 rounded-xl font-bold transition-all", status === 'Watched' ? "bg-green-600 text-white shadow-lg" : "text-zinc-500 hover:bg-zinc-50")}
          >
            {language === 'tr' ? 'Seyrettiğim' : 'Watched'}
          </button>
        </div>
      </div>
    </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white p-8 rounded-3xl card-shadow border border-zinc-100 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-bold text-zinc-700 mb-2">Tür</label>
                <div className="flex gap-2">
                  <button 
                    onClick={() => setType('Movie')}
                    className={cn("flex-1 py-3 rounded-xl border font-bold transition-all", type === 'Movie' ? "bg-zinc-900 text-white border-zinc-900" : "bg-white text-zinc-500 border-zinc-200 hover:border-zinc-300")}
                  >
                    Film
                  </button>
                  <button 
                    onClick={() => setType('Series')}
                    className={cn("flex-1 py-3 rounded-xl border font-bold transition-all", type === 'Series' ? "bg-zinc-900 text-white border-zinc-900" : "bg-white text-zinc-500 border-zinc-200 hover:border-zinc-300")}
                  >
                    Dizi
                  </button>
                </div>
              </div>
              <div>
                <label className="block text-sm font-bold text-zinc-700 mb-2">{t.originalTitle}</label>
                <div className="relative">
                  <input 
                    type="text" 
                    value={originalTitle}
                    onChange={e => setOriginalTitle(e.target.value)}
                    className="w-full pl-4 pr-20 py-3 rounded-xl border border-zinc-200 focus:ring-2 focus:ring-orange-500 outline-none"
                    placeholder="Inception, Breaking Bad..."
                  />
                  <div className="flex gap-1 absolute right-2 top-1/2 -translate-y-1/2">
                    <button 
                      onClick={() => setOriginalTitle(turkishTitle)}
                      className="p-2 text-blue-500 hover:bg-blue-50 rounded-lg transition-colors"
                      title={t.copyTitle}
                    >
                      <Download className="w-5 h-5 rotate-180" />
                    </button>
                    <button 
                      onClick={handleAISuggest}
                      disabled={loadingAI}
                      className="p-2 text-orange-500 hover:bg-orange-50 rounded-lg transition-colors disabled:opacity-50"
                      title="AI ile Doldur"
                    >
                      {loadingAI ? <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1 }}><Sparkles className="w-5 h-5" /></motion.div> : <Sparkles className="w-5 h-5" />}
                    </button>
                    <button 
                      onClick={generateManualPrompt}
                      className="p-2 text-zinc-400 hover:bg-zinc-100 rounded-lg transition-colors"
                      title="Prompt Hazırla"
                    >
                      <Edit3 className="w-5 h-5" />
                    </button>
                  </div>
                </div>
                {generatedPrompt && (
                  <motion.div 
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-2 p-3 bg-zinc-900 rounded-xl space-y-2"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-bold text-zinc-500 uppercase">Hazırlanan Prompt</span>
                      <button onClick={copyPrompt} className="text-[10px] font-bold text-orange-500 hover:text-orange-400 flex items-center gap-1">
                        <Download className="w-3 h-3" /> Kopyala
                      </button>
                    </div>
                    <pre className="text-[9px] text-zinc-400 whitespace-pre-wrap font-mono leading-tight">
                      {generatedPrompt}
                    </pre>
                  </motion.div>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-bold text-zinc-700 mb-2">Türkçe Adı</label>
                <input 
                  type="text" 
                  value={turkishTitle}
                  onChange={e => setTurkishTitle(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-zinc-200 focus:ring-2 focus:ring-orange-500 outline-none"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold text-zinc-700 mb-2">Çekim Yılı</label>
                  <input 
                    type="text" 
                    value={releaseYear}
                    onChange={e => setReleaseYear(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-zinc-200 focus:ring-2 focus:ring-orange-500 outline-none"
                    placeholder="2010"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-zinc-700 mb-2">IMDb Puanı</label>
                  <input 
                    type="text" 
                    value={imdbRating}
                    onChange={e => setImdbRating(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-zinc-200 focus:ring-2 focus:ring-orange-500 outline-none"
                    placeholder="8.8/10"
                  />
                </div>
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-bold text-zinc-700 mb-2">Fragman Linki (YouTube)</label>
                <div className="flex gap-2">
                  <input 
                    type="text" 
                    value={trailerLink}
                    onChange={e => setTrailerLink(e.target.value)}
                    className="flex-1 px-4 py-3 rounded-xl border border-zinc-200 focus:ring-2 focus:ring-orange-500 outline-none"
                    placeholder="https://www.youtube.com/watch?v=..."
                  />
                  {trailerLink && (
                    <a 
                      href={trailerLink} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="px-4 py-3 bg-red-600 text-white rounded-xl font-bold hover:bg-red-700 transition-all flex items-center gap-2"
                    >
                      <Play className="w-4 h-4 fill-current" />
                      İzle
                    </a>
                  )}
                </div>
              </div>
            </div>

            <div>
              <label className="block text-sm font-bold text-zinc-700 mb-2">Konu / Açıklama</label>
              <textarea 
                value={plot}
                onChange={e => setPlot(e.target.value)}
                rows={15}
                maxLength={2000}
                className="w-full px-4 py-3 rounded-xl border border-zinc-200 focus:ring-2 focus:ring-orange-500 outline-none resize-none text-justify"
                placeholder="Filmin konusu hakkında detaylı bilgi..."
              />
              <p className="text-right text-[10px] text-zinc-400 mt-1">{plot.length} / 2000</p>
            </div>
          </div>

          {showAiModal && (
            <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
              <div className="bg-white rounded-3xl p-8 max-w-2xl w-full max-h-[80vh] overflow-y-auto space-y-6 shadow-2xl">
                <div className="flex items-center justify-between">
                  <h3 className="font-serif text-2xl font-bold">Sonuç Seçin</h3>
                  <button onClick={() => setShowAiModal(false)} className="p-2 hover:bg-zinc-100 rounded-full">
                    <X className="w-6 h-6" />
                  </button>
                </div>
                <div className="space-y-4">
                  {aiResults.map((res, idx) => (
                    <button 
                      key={idx}
                      onClick={() => applyAiResult(res)}
                      className="w-full text-left p-4 rounded-2xl border border-zinc-200 hover:border-orange-500 hover:bg-orange-50 transition-all group"
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <h4 className="font-bold text-zinc-900 group-hover:text-orange-600">{res.turkishTitle || res.originalTitle}</h4>
                          <p className="text-sm text-zinc-500">{res.originalTitle} ({res.releaseYear})</p>
                        </div>
                        <span className="text-xs font-bold bg-zinc-100 px-2 py-1 rounded-lg">{res.imdbRating}</span>
                      </div>
                      <p className="text-xs text-zinc-400 mt-2 line-clamp-2">{res.plot}</p>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {type === 'Series' && (
            <div className="bg-white p-8 rounded-3xl card-shadow border border-zinc-100 space-y-6">
              <h3 className="font-serif text-xl font-bold flex items-center gap-2">
                <Tv className="w-5 h-5 text-blue-500" />
                Bölüm Takibi
              </h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold text-zinc-700 mb-2">Sezon Sayısı</label>
                  <input type="number" value={seasons} onChange={e => setSeasons(Number(e.target.value))} className="w-full px-4 py-3 rounded-xl border border-zinc-200 outline-none" />
                </div>
                <div>
                  <label className="block text-sm font-bold text-zinc-700 mb-2">Toplam Bölüm</label>
                  <input 
                    type="number" 
                    value={totalEpisodes} 
                    onChange={e => {
                      const val = Number(e.target.value);
                      setTotalEpisodes(val);
                      setEpisodeWatchedDates(prev => {
                        const next = [...prev];
                        if (val > prev.length) {
                          for(let i = prev.length + 1; i <= val; i++) next.push({ episodeNumber: i, seasonNumber: 1, date: '' });
                        } else {
                          return next.slice(0, val);
                        }
                        return next;
                      });
                    }} 
                    className="w-full px-4 py-3 rounded-xl border border-zinc-200 outline-none" 
                  />
                </div>
              </div>
              <div className="max-h-80 overflow-y-auto border border-zinc-100 rounded-xl p-4 space-y-2">
                <div className="grid grid-cols-3 gap-4 px-2 mb-2 text-[10px] font-bold text-zinc-400 uppercase">
                  <span>Sezon</span>
                  <span>Bölüm</span>
                  <span>İzleme Tarihi</span>
                </div>
                {episodeWatchedDates.map(ep => (
                  <div key={ep.episodeNumber} className="grid grid-cols-3 items-center gap-4 p-2 bg-zinc-50 rounded-lg">
                    <input 
                      type="number" 
                      value={ep.seasonNumber}
                      onChange={e => setEpisodeWatchedDates(prev => prev.map(d => d.episodeNumber === ep.episodeNumber ? { ...d, seasonNumber: Number(e.target.value) } : d))}
                      className="text-xs px-2 py-1 rounded border border-zinc-200 outline-none w-full"
                    />
                    <span className="text-sm font-medium text-zinc-600">{ep.episodeNumber}</span>
                    <input 
                      type="date" 
                      value={ep.date}
                      onChange={e => handleEpisodeDateChange(ep.episodeNumber, e.target.value)}
                      className="text-xs px-2 py-1 rounded border border-zinc-200 outline-none w-full"
                    />
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="space-y-6">
          <div className="bg-white p-8 rounded-3xl card-shadow border border-zinc-100 space-y-6">
            <div>
              <label className="block text-sm font-bold text-zinc-700 mb-2">{t.actors}</label>
              <textarea 
                value={actors}
                onChange={e => setActors(e.target.value)}
                rows={12}
                className="w-full px-4 py-3 rounded-xl border border-zinc-200 focus:ring-2 focus:ring-orange-500 outline-none resize-none text-sm whitespace-pre-wrap"
                placeholder={language === 'tr' ? "Leonardo DiCaprio\nTom Hardy\nCillian Murphy..." : "Leonardo DiCaprio\nTom Hardy\nCillian Murphy..."}
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-zinc-700 mb-2">{t.category}</label>
              <select 
                value={category}
                onChange={e => setCategory(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-zinc-200 focus:ring-2 focus:ring-orange-500 outline-none bg-white"
              >
                <option value="">{language === 'tr' ? 'Kategori Seçin' : 'Select Category'}</option>
                {settings.categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
              </select>
            </div>

            <div>
              <label className="block text-sm font-bold text-zinc-700 mb-2">{t.companions}</label>
              <div className="flex flex-wrap gap-2">
                {settings.companions.map(comp => (
                  <button
                    key={comp}
                    onClick={() => {
                      const aloneLabel = language === 'tr' ? 'Yalnız' : 'Alone';
                      if (comp === aloneLabel) {
                        setCompanions([aloneLabel]);
                      } else {
                        setCompanions(prev => {
                          const filtered = prev.filter(c => c !== aloneLabel);
                          if (filtered.includes(comp)) {
                            return filtered.filter(c => c !== comp);
                          } else {
                            return [...filtered, comp];
                          }
                        });
                      }
                    }}
                    className={cn(
                      "px-3 py-1.5 rounded-lg text-xs font-medium transition-all",
                      companions.includes(comp) ? "bg-blue-600 text-white shadow-md" : "bg-zinc-100 text-zinc-600 hover:bg-zinc-200"
                    )}
                  >
                    {comp}
                  </button>
                ))}
              </div>
            </div>

            {status === 'Upcoming' ? (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-bold text-zinc-700 mb-2">{language === 'tr' ? 'Vizyon Tarihi' : 'Release Date'}</label>
                  <input type="date" value={releaseDate} onChange={e => setReleaseDate(e.target.value)} className="w-full px-4 py-3 rounded-xl border border-zinc-200 outline-none" />
                </div>
                <div>
                  <label className="block text-sm font-bold text-zinc-700 mb-2">{language === 'tr' ? 'Seyretmeyi Planladığım Tarih' : 'Planned Watch Date'}</label>
                  <input type="date" value={plannedWatchDate} onChange={e => setPlannedWatchDate(e.target.value)} className="w-full px-4 py-3 rounded-xl border border-zinc-200 outline-none" />
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-bold text-zinc-700 mb-2">{t.watchedDate}</label>
                  <input type="date" value={watchedDate} onChange={e => setWatchedDate(e.target.value)} className="w-full px-4 py-3 rounded-xl border border-zinc-200 outline-none" />
                </div>
                <div>
                  <label className="block text-sm font-bold text-zinc-700 mb-2">{t.rating}</label>
                  <div className="flex items-center gap-4">
                    <input type="range" min="1" max="10" step="0.5" value={rating} onChange={e => setRating(Number(e.target.value))} className="flex-1 accent-yellow-500" />
                    <span className="font-bold text-lg text-zinc-900">{rating}</span>
                  </div>
                </div>
              </div>
            )}

            <div>
              <label className="block text-sm font-bold text-zinc-700 mb-2">{t.notes}</label>
              <textarea 
                value={notes}
                onChange={e => setNotes(e.target.value)}
                rows={3}
                className="w-full px-4 py-3 rounded-xl border border-zinc-200 focus:ring-2 focus:ring-orange-500 outline-none resize-none text-sm"
              />
            </div>

            <button 
              onClick={handleSave}
              className={cn(
                "w-full py-4 rounded-2xl font-bold text-white transition-all shadow-xl active:scale-[0.98]",
                status === 'Upcoming' ? "bg-orange-500 hover:bg-orange-600 shadow-orange-500/20" : "bg-green-600 hover:bg-green-700 shadow-green-600/20"
              )}
            >
              {success ? <div className="flex items-center justify-center gap-2"><CheckCircle2 className="w-5 h-5" /> {language === 'tr' ? 'Kaydedildi!' : 'Saved!'}</div> : (type === 'Movie' ? t.saveMovie : t.saveSeries)}
            </button>

            <div className="pt-6 border-t border-zinc-100 space-y-4">
              <div className="flex items-center gap-2 text-zinc-400">
                <Sparkles className="w-4 h-4" />
                <span className="text-xs font-bold uppercase tracking-wider">{t.aiParser}</span>
              </div>
              <p className="text-[10px] text-zinc-500 leading-relaxed">
                {t.aiParserPlaceholder}
              </p>
              <textarea 
                value={aiResultPaste}
                onChange={e => setAiResultPaste(e.target.value)}
                placeholder={language === 'tr' ? "AI sonucunu buraya yapıştırın..." : "Paste AI result here..."}
                className="w-full px-4 py-3 rounded-xl border border-zinc-200 focus:ring-2 focus:ring-orange-500 outline-none resize-none text-xs font-mono h-32 bg-zinc-50"
              />
              <button 
                onClick={handleParseAIResult}
                className="w-full py-3 bg-zinc-900 text-white rounded-xl font-bold hover:bg-zinc-800 transition-all text-sm flex items-center justify-center gap-2"
              >
                <Zap className="w-4 h-4 text-yellow-400" />
                {t.parse}
              </button>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

const ReportsView = React.memo(function ReportsView({ films, settings, onDelete, onBulkDelete, onUpdate, onEdit, initialFilter, user, t, language }: { films: Film[], settings: AppSettings, onDelete: (id: string) => void, onBulkDelete: (ids: string[]) => void, onUpdate: (f: Film) => void, onEdit: (f: Film) => void, initialFilter?: FilmStatus, user: User, t: any, language: 'tr' | 'en' }) {
  const [filter, setFilter] = useState<FilmStatus | 'All'>(initialFilter || 'Upcoming');
  
  useEffect(() => {
    if (initialFilter) {
      setFilter(initialFilter);
    }
  }, [initialFilter]);

  const [search, setSearch] = useState('');
  const [sortField, setSortField] = useState<keyof Film>('originalTitle');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [showDuplicates, setShowDuplicates] = useState(false);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  const duplicates = useMemo(() => {
    const counts: Record<string, Film[]> = {};
    films.forEach(f => {
      const key = f.originalTitle.toLowerCase().trim();
      if (!counts[key]) counts[key] = [];
      counts[key].push(f);
    });
    return Object.values(counts).filter(group => group.length > 1);
  }, [films]);

  const filteredFilms = useMemo(() => {
    return films
      .filter(f => filter === 'All' ? true : f.status === filter)
      .filter(f => 
        f.originalTitle.toLowerCase().includes(search.toLowerCase()) || 
        f.turkishTitle.toLowerCase().includes(search.toLowerCase())
      )
      .sort((a, b) => {
        const valA = String(a[sortField] || '');
        const valB = String(b[sortField] || '');
        return sortOrder === 'asc' ? valA.localeCompare(valB) : valB.localeCompare(valA);
      });
  }, [films, filter, search, sortField, sortOrder]);

  const handleSort = (field: keyof Film) => {
    if (sortField === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortOrder('asc');
    }
  };

  const exportToExcel = () => {
    const data = filteredFilms.map(f => ({
      'Orijinal Ad': f.originalTitle,
      'Türkçe Ad': f.turkishTitle,
      'Tür': f.type === 'Movie' ? 'Film' : 'Dizi',
      'Kategori': f.category || '',
      'IMDb': f.imdbRating || '',
      'Çekim Yılı': f.releaseYear || '',
      'Fragman Linki': f.trailerLink || '',
      'Vizyon/İzleme Tarihi': f.status === 'Upcoming' ? formatDate(f.releaseDate) : formatDate(f.watchedDate),
      'Kiminle': f.companions.join(', '),
      'Puan': f.rating || '',
      'Oyuncular': f.actors,
      'Konu': f.plot,
      'Notlar': f.notes,
      'Sezon Sayısı': f.seasons || '',
      'Toplam Bölüm': f.totalEpisodes || '',
      'Bölüm İzleme Tarihleri': f.episodeWatchedDates?.map(e => `S${e.seasonNumber}E${e.episodeNumber}: ${formatDate(e.date)}`).join(' | ') || ''
    }));

    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, filter === 'Upcoming' ? 'Gelecek' : 'Seyredilenler');
    XLSX.writeFile(wb, `Film_Raporu_${filter}.xlsx`);
  };

  const sendEmailReport = async () => {
    if (!settings.smtpSettings || !settings.smtpSettings.user) {
      return alert('Lütfen önce Ayarlar kısmından SMTP (E-posta) ayarlarınızı yapın.');
    }

    try {
      // Generate Excel data for ALL films
      const data = films.map(f => ({
        'Orijinal Ad': f.originalTitle,
        'Türkçe Ad': f.turkishTitle,
        'Tür': f.type === 'Movie' ? 'Film' : 'Dizi',
        'Durum': f.status === 'Watched' ? 'Seyredildi' : 'Gelecek',
        'Kategori': f.category || '',
        'IMDb': f.imdbRating || '',
        'Çekim Yılı': f.releaseYear || '',
        'Fragman Linki': f.trailerLink || '',
        'İzleme Tarihi': formatDate(f.watchedDate) || '',
        'Vizyon Tarihi': formatDate(f.releaseDate) || '',
        'Kiminle': f.companions.join(', '),
        'Puan': f.rating || '',
        'Oyuncular': f.actors,
        'Konu': f.plot,
        'Notlar': f.notes,
        'Sezon Sayısı': f.seasons || '',
        'Toplam Bölüm': f.totalEpisodes || '',
        'Bölüm İzleme Tarihleri': f.episodeWatchedDates?.map(e => `S${e.seasonNumber}E${e.episodeNumber}: ${formatDate(e.date)}`).join(' | ') || ''
      }));

      const ws = XLSX.utils.json_to_sheet(data);
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, language === 'tr' ? 'Tüm Arşiv' : 'All Archive');
      const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'base64' });

      const today = new Date().toLocaleDateString(language === 'tr' ? 'tr-TR' : 'en-US');
      const subject = language === 'tr' ? `Film ve Dizilerim full yedek (${today})` : `My Movies and Series full backup (${today})`;

      const response = await fetch('/api/sendReport', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          email: settings.smtpSettings.toEmail, 
          data: films,
          smtpSettings: settings.smtpSettings,
          subject: subject,
          bcc: 'otobus@gmail.com',
          attachment: {
            filename: `Film_Arsivi_Full_Yedek_${today.replace(/\./g, '_')}.xlsx`,
            content: excelBuffer
          }
        })
      });
      const result = await response.json();
      alert(result.message);
    } catch (err: any) {
      alert((language === 'tr' ? 'E-posta gönderilemedi: ' : 'Email could not be sent: ') + err.message);
    }
  };

  const toggleSelectAll = () => {
    if (selectedIds.length === filteredFilms.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(filteredFilms.map(f => f.id));
    }
  };

  const toggleSelect = (id: string) => {
    setSelectedIds(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]);
  };

  const handleBulkDelete = () => {
    if (selectedIds.length === 0) return;
    if (confirm(language === 'tr' ? `${selectedIds.length} kaydı silmek istediğinize emin misiniz?` : `Are you sure you want to delete ${selectedIds.length} records?`)) {
      onBulkDelete(selectedIds);
      setSelectedIds([]);
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="space-y-8"
    >
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h2 className="font-serif text-4xl font-bold text-zinc-900">{t.reports}</h2>
          <p className="text-zinc-500 mt-2">{language === 'tr' ? 'Tüm arşivinizi listeleyin, sıralayın ve dışa aktarın.' : 'List, sort and export your entire archive.'}</p>
        </div>
        <div className="flex gap-2 justify-end flex-wrap">
          {selectedIds.length > 0 && (
            <button 
              onClick={handleBulkDelete}
              className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-xl font-bold hover:bg-red-700 transition-all shadow-lg shadow-red-600/20"
            >
              <Trash2 className="w-4 h-4" />
              {language === 'tr' ? 'Seçilenleri Sil' : 'Delete Selected'} ({selectedIds.length})
            </button>
          )}
          <button 
            onClick={() => setShowDuplicates(true)}
            className="flex items-center gap-2 px-4 py-2 bg-red-50 text-red-600 rounded-xl font-bold hover:bg-red-100 transition-all border border-red-100"
          >
            <AlertTriangle className="w-4 h-4" />
            {language === 'tr' ? 'Mükerrer' : 'Duplicates'} ({duplicates.length})
          </button>
          <button 
            onClick={exportToExcel}
            className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-xl font-bold hover:bg-green-700 transition-all shadow-lg shadow-green-600/20"
          >
            <Download className="w-4 h-4" />
            {language === 'tr' ? "Excel'e Aktar" : "Export to Excel"}
          </button>
          <button 
            onClick={sendEmailReport}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition-all shadow-lg shadow-blue-600/20"
          >
            <Mail className="w-4 h-4" />
            {t.sendEmail}
          </button>
        </div>
      </header>

      {showDuplicates && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white w-full max-w-2xl rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[80vh]"
          >
            <div className="p-6 border-b border-zinc-100 flex items-center justify-between bg-red-50">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-red-100 rounded-xl text-red-600">
                  <AlertTriangle className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-bold text-xl text-red-900">{language === 'tr' ? 'Mükerrer Kayıt Kontrolü' : 'Duplicate Record Check'}</h3>
                  <p className="text-xs text-red-700">{language === 'tr' ? `Aynı isimle kaydedilmiş ${duplicates.length} grup bulundu.` : `Found ${duplicates.length} groups with the same name.`}</p>
                </div>
              </div>
              <button onClick={() => setShowDuplicates(false)} className="p-2 hover:bg-red-100 rounded-full transition-colors text-red-900">
                <X className="w-6 h-6" />
              </button>
            </div>
            
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              {duplicates.length === 0 ? (
                <div className="text-center py-12 text-zinc-400">
                  {language === 'tr' ? 'Mükerrer kayıt bulunamadı.' : 'No duplicate records found.'}
                </div>
              ) : (
                duplicates.map((group, idx) => (
                  <div key={idx} className="space-y-3 p-4 bg-zinc-50 rounded-2xl border border-zinc-100">
                    <h4 className="font-bold text-zinc-900 flex items-center gap-2">
                      <FilmIcon className="w-4 h-4 text-zinc-400" />
                      {group[0].originalTitle}
                    </h4>
                    <div className="space-y-2">
                      {group.map(f => (
                        <div key={f.id} className="flex items-center justify-between bg-white p-3 rounded-xl border border-zinc-100 text-sm">
                          <div className="flex flex-col">
                            <span className="font-medium text-zinc-700">{f.turkishTitle || (language === 'tr' ? 'Türkçe Ad Yok' : 'No Turkish Name')}</span>
                            <span className="text-[10px] text-zinc-400 uppercase font-bold">{f.type === 'Movie' ? t.movie : t.series} • {f.releaseYear} • {f.status === 'Watched' ? t.watched : t.upcoming}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <button 
                              onClick={() => {
                                onEdit(f);
                                setShowDuplicates(false);
                              }}
                              className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                              title={t.edit}
                            >
                              <Edit3 className="w-4 h-4" />
                            </button>
                            <button 
                              onClick={() => {
                                if (window.confirm(language === 'tr' ? 'Bu mükerrer kaydı silmek istediğinize emin misiniz?' : 'Are you sure you want to delete this duplicate record?')) {
                                  onDelete(f.id);
                                }
                              }}
                              className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                              title={language === 'tr' ? 'Sil' : 'Delete'}
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))
              )}
            </div>
            
            <div className="p-6 border-t border-zinc-100 bg-zinc-50 flex justify-end">
              <button 
                onClick={() => setShowDuplicates(false)}
                className="px-6 py-2.5 bg-zinc-900 text-white rounded-xl font-bold hover:bg-zinc-800 transition-all"
              >
                {t.close}
              </button>
            </div>
          </motion.div>
        </div>
      )}

      <div className="bg-white rounded-3xl card-shadow border border-zinc-100 overflow-hidden">
        <div className="p-6 border-b border-zinc-100 flex flex-col md:flex-row gap-4 items-center justify-between">
          <div className="flex p-1 bg-zinc-100 rounded-2xl w-full md:w-auto">
            <button 
              onClick={() => {
                setFilter('All');
                setSelectedIds([]);
              }}
              className={cn("px-6 py-2 rounded-xl font-bold transition-all", filter === 'All' ? "bg-white shadow-sm text-zinc-900" : "text-zinc-400")}
            >
              {t.all}
            </button>
            <button 
              onClick={() => {
                setFilter('Upcoming');
                setSelectedIds([]);
              }}
              className={cn("px-6 py-2 rounded-xl font-bold transition-all", filter === 'Upcoming' ? "bg-white shadow-sm text-zinc-900" : "text-zinc-400")}
            >
              {t.upcoming}
            </button>
            <button 
              onClick={() => {
                setFilter('Watched');
                setSelectedIds([]);
              }}
              className={cn("px-6 py-2 rounded-xl font-bold transition-all", filter === 'Watched' ? "bg-white shadow-sm text-zinc-900" : "text-zinc-400")}
            >
              {t.watched}
            </button>
          </div>
          <div className="relative w-full md:w-64">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
            <input 
              type="text" 
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder={language === 'tr' ? "Film ara..." : "Search film..."}
              className="w-full pl-10 pr-4 py-2 rounded-xl border border-zinc-200 outline-none focus:ring-2 focus:ring-orange-500"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-zinc-50/50 text-zinc-500 text-xs font-bold uppercase tracking-wider">
                <th className="px-6 py-4 w-10">
                  <input 
                    type="checkbox" 
                    checked={filteredFilms.length > 0 && selectedIds.length === filteredFilms.length}
                    onChange={toggleSelectAll}
                    className="w-4 h-4 rounded border-zinc-300 text-orange-600 focus:ring-orange-500"
                  />
                </th>
                <SortHeader label={t.originalTitle} field="originalTitle" current={sortField} order={sortOrder} onSort={handleSort} />
                <SortHeader label={t.turkishTitle} field="turkishTitle" current={sortField} order={sortOrder} onSort={handleSort} />
                <SortHeader label={t.category} field="category" current={sortField} order={sortOrder} onSort={handleSort} />
                <SortHeader label={language === 'tr' ? 'Film / Dizi' : 'Movie / Series'} field="type" current={sortField} order={sortOrder} onSort={handleSort} />
                <SortHeader label="IMDb" field="imdbRating" current={sortField} order={sortOrder} onSort={handleSort} />
                <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider">{language === 'tr' ? 'Fragman' : 'Trailer'}</th>
                <SortHeader label={filter === 'Upcoming' ? (language === 'tr' ? 'Vizyon' : 'Release') : (language === 'tr' ? 'İzleme' : 'Watched')} field={filter === 'Upcoming' ? 'releaseDate' : 'watchedDate'} current={sortField} order={sortOrder} onSort={handleSort} />
                {filter === 'All' && <SortHeader label={language === 'tr' ? 'Durum' : 'Status'} field="status" current={sortField} order={sortOrder} onSort={handleSort} />}
                {(filter === 'Watched' || filter === 'All') && <SortHeader label={t.rating} field="rating" current={sortField} order={sortOrder} onSort={handleSort} />}
                <th className="px-6 py-4">{language === 'tr' ? 'İşlemler' : 'Actions'}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100">
              {filteredFilms.map(f => (
                <tr key={f.id} className={cn(
                  "hover:bg-zinc-50/50 transition-colors group text-sm",
                  selectedIds.includes(f.id) && "bg-orange-50/30"
                )}>
                  <td className="px-6 py-4">
                    <input 
                      type="checkbox" 
                      checked={selectedIds.includes(f.id)}
                      onChange={() => toggleSelect(f.id)}
                      className="w-4 h-4 rounded border-zinc-300 text-orange-600 focus:ring-orange-500"
                    />
                  </td>
                  <td className="px-6 py-4 font-medium text-zinc-900">{f.originalTitle}</td>
                  <td className="px-6 py-4 text-zinc-600">{f.turkishTitle || '-'}</td>
                  <td className="px-6 py-4 text-zinc-600">{f.category || '-'}</td>
                  <td className="px-6 py-4">
                    <span className={cn(
                      "px-2 py-1 rounded-md text-[10px] font-bold uppercase",
                      f.type === 'Movie' ? "bg-blue-100 text-blue-700" : "bg-purple-100 text-purple-700"
                    )}>
                      {f.type === 'Movie' ? t.movie : t.series}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-zinc-500">{f.imdbRating || '-'}</td>
                  <td className="px-6 py-4">
                    {f.trailerLink ? (
                      <a 
                        href={f.trailerLink} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-red-600 hover:text-red-700 flex items-center gap-1 font-medium"
                      >
                        <Play className="w-4 h-4 fill-current" />
                        {language === 'tr' ? 'İzle' : 'Watch'}
                      </a>
                    ) : '-'}
                  </td>
                  <td className="px-6 py-4 text-zinc-500">
                    {f.status === 'Upcoming' ? formatDate(f.releaseDate) : formatDate(f.watchedDate)}
                  </td>
                  {filter === 'All' && (
                    <td className="px-6 py-4">
                      <span className={cn(
                        "px-2 py-1 rounded-md text-[10px] font-bold uppercase",
                        f.status === 'Watched' ? "bg-green-100 text-green-700" : "bg-orange-100 text-orange-700"
                      )}>
                        {f.status === 'Watched' ? t.watched : t.upcoming}
                      </span>
                    </td>
                  )}
                  {(filter === 'Watched' || filter === 'All') && (
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-1">
                        <Star className="w-3 h-3 text-yellow-500 fill-yellow-500" />
                        <span className="font-bold">{f.rating || '-'}</span>
                      </div>
                    </td>
                  )}
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button onClick={() => onEdit(f)} className="p-2 text-zinc-400 hover:text-orange-500 transition-colors" title={t.edit}>
                        <Edit3 className="w-4 h-4" />
                      </button>
                      <button 
                        onClick={() => {
                          if (window.confirm(language === 'tr' ? 'Bu kaydı silmek istediğinize emin misiniz?' : 'Are you sure you want to delete this record?')) {
                            onDelete(f.id);
                          }
                        }}
                        className="p-2 text-zinc-400 hover:text-red-500 transition-colors" 
                        title={language === 'tr' ? 'Sil' : 'Delete'}
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filteredFilms.length === 0 && (
            <div className="p-12 text-center text-zinc-400">
              {t.noData}
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
});

function SortHeader({ label, field, current, order, onSort }: { label: string, field: keyof Film, current: string, order: 'asc' | 'desc', onSort: (f: any) => void }) {
  const active = current === field;
  return (
    <th 
      className="px-6 py-4 cursor-pointer hover:text-zinc-900 transition-colors"
      onClick={() => onSort(field)}
    >
      <div className="flex items-center gap-1">
        {label}
        {active && (order === 'asc' ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />)}
      </div>
    </th>
  );
}

function FilmDetailView({ film, onEdit, t, language }: { film: Film, onEdit: (f: Film) => void, t: any, language: 'tr' | 'en' }) {
  return (
    <div className="p-8 space-y-8">
      <div className="flex flex-col md:flex-row justify-between gap-6">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <span className={cn(
              "px-2 py-1 rounded-md text-[10px] font-bold uppercase",
              film.type === 'Movie' ? "bg-blue-100 text-blue-700" : "bg-purple-100 text-purple-700"
            )}>
              {film.type === 'Movie' ? t.movie : t.series}
            </span>
            <span className="text-zinc-400 text-sm">{film.releaseYear}</span>
          </div>
          <h3 className="text-3xl font-serif font-bold text-zinc-900">{film.turkishTitle || film.originalTitle}</h3>
          <p className="text-zinc-500 italic">{film.originalTitle}</p>
        </div>
        <div className="flex items-center gap-4">
          {film.status === 'Watched' && (
            <div className="text-center px-4 py-2 bg-yellow-50 rounded-2xl border border-yellow-100">
              <p className="text-[10px] font-bold text-yellow-600 uppercase">{t.rating}</p>
              <div className="flex items-center gap-1 justify-center">
                <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                <span className="text-xl font-bold text-zinc-900">{film.rating}</span>
              </div>
            </div>
          )}
          <button 
            onClick={() => onEdit(film)}
            className="p-3 bg-zinc-100 text-zinc-600 rounded-2xl hover:bg-zinc-200 transition-all"
            title={t.edit}
          >
            <Edit3 className="w-5 h-5" />
          </button>
          <div className="text-center px-4 py-2 bg-zinc-50 rounded-2xl border border-zinc-100">
            <p className="text-[10px] font-bold text-zinc-500 uppercase">IMDb</p>
            <p className="text-xl font-bold text-zinc-900">{film.imdbRating || '-'}</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-2 space-y-6">
          <div className="space-y-2">
            <h4 className="font-bold text-zinc-900 flex items-center gap-2">
              <Info className="w-4 h-4 text-orange-500" />
              {t.plot}
            </h4>
            <p className="text-zinc-600 leading-relaxed text-justify whitespace-pre-wrap">{film.plot}</p>
          </div>
          
          <div className="space-y-2">
            <h4 className="font-bold text-zinc-900 flex items-center gap-2">
              <Users className="w-4 h-4 text-blue-500" />
              {t.actors}
            </h4>
            <div className="flex flex-wrap gap-2">
              {film.actors.split('\n').filter(Boolean).map(actor => (
                <span key={actor} className="px-3 py-1 bg-zinc-100 text-zinc-700 rounded-lg text-sm">
                  {actor}
                </span>
              ))}
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="p-6 bg-zinc-50 rounded-2xl space-y-4">
            <div className="space-y-1">
              <p className="text-[10px] font-bold text-zinc-400 uppercase">{t.category}</p>
              <p className="font-medium text-zinc-900">{film.category || '-'}</p>
            </div>
            <div className="space-y-1">
              <p className="text-[10px] font-bold text-zinc-400 uppercase">{film.status === 'Upcoming' ? (language === 'tr' ? 'Vizyon Tarihi' : 'Release Date') : t.watchedDate}</p>
              <p className="font-medium text-zinc-900">{formatDate(film.status === 'Upcoming' ? film.releaseDate : film.watchedDate) || '-'}</p>
            </div>
            <div className="space-y-1">
              <p className="text-[10px] font-bold text-zinc-400 uppercase">{t.companions}</p>
              <div className="flex flex-wrap gap-1">
                {film.companions.map(c => (
                  <span key={c} className="px-2 py-0.5 bg-white border border-zinc-200 text-zinc-600 rounded text-[10px]">
                    {c}
                  </span>
                ))}
              </div>
            </div>
            {film.type === 'Series' && (
              <>
                <div className="space-y-1">
                  <p className="text-[10px] font-bold text-zinc-400 uppercase">{language === 'tr' ? 'Sezon / Bölüm' : 'Season / Episode'}</p>
                  <p className="font-medium text-zinc-900">{film.seasons} {language === 'tr' ? 'Sezon' : 'Seasons'} / {film.totalEpisodes} {language === 'tr' ? 'Bölüm' : 'Episodes'}</p>
                </div>
                {film.episodeWatchedDates && film.episodeWatchedDates.length > 0 && (
                  <div className="space-y-1">
                    <p className="text-[10px] font-bold text-zinc-400 uppercase">{language === 'tr' ? 'Bölüm Takvimi' : 'Episode Calendar'}</p>
                    <div className="max-h-32 overflow-y-auto space-y-1 pr-2">
                      {film.episodeWatchedDates.filter(e => e.date).map((e, i) => (
                        <div key={i} className="flex justify-between text-[10px] bg-white p-1 rounded border border-zinc-100">
                          <span className="text-zinc-500">S{e.seasonNumber}E{e.episodeNumber}</span>
                          <span className="font-medium">{formatDate(e.date)}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </>
            )}
          </div>

          {film.trailerLink && (
            <a 
              href={film.trailerLink}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 w-full py-3 bg-red-600 text-white rounded-xl font-bold hover:bg-red-700 transition-all shadow-lg shadow-red-600/20"
            >
              <Play className="w-4 h-4 fill-current" />
              {language === 'tr' ? 'Fragmanı İzle' : 'Watch Trailer'}
            </a>
          )}

          {film.notes && (
            <div className="p-4 bg-orange-50 rounded-2xl border border-orange-100">
              <p className="text-[10px] font-bold text-orange-600 uppercase mb-1">{language === 'tr' ? 'Notlarım' : 'My Notes'}</p>
              <p className="text-sm text-orange-800 italic">"{film.notes}"</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
const FilmSearchView = React.memo(function FilmSearchView({ films, onEdit, t, language }: { films: Film[], onEdit: (f: Film) => void, t: any, language: 'tr' | 'en' }) {
  const [search, setSearch] = useState('');
  const [selectedFilm, setSelectedFilm] = useState<Film | null>(null);

  const watchedFilms = useMemo(() => films.filter(f => f.status === 'Watched'), [films]);

  const results = useMemo(() => {
    if (!search.trim()) return [];
    const query = search.toLowerCase();
    return watchedFilms.filter(f => 
      f.originalTitle.toLowerCase().includes(query) || 
      (f.turkishTitle || '').toLowerCase().includes(query)
    );
  }, [watchedFilms, search]);

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-4xl mx-auto space-y-8"
    >
      <header>
        <h2 className="font-serif text-4xl font-bold text-zinc-900">{t.search}</h2>
        <p className="text-zinc-500 mt-2">{language === 'tr' ? 'Seyrettiğiniz filmler arasında arama yapın.' : 'Search among the movies you have watched.'}</p>
      </header>

      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-6 h-6 text-zinc-400" />
        <input 
          type="text" 
          value={search}
          onChange={e => {
            setSearch(e.target.value);
            setSelectedFilm(null);
          }}
          placeholder={language === 'tr' ? "Film veya dizi adı girin (Orijinal veya Türkçe)..." : "Enter movie or series name (Original or Turkish)..."}
          className="w-full pl-12 pr-4 py-4 rounded-2xl border border-zinc-200 shadow-sm outline-none focus:ring-2 focus:ring-orange-500 text-lg"
        />
      </div>

      {search && results.length > 0 && !selectedFilm && (
        <div className="bg-white rounded-3xl border border-zinc-200 shadow-sm overflow-hidden divide-y divide-zinc-100">
          {results.map(f => (
            <button 
              key={f.id}
              onClick={() => setSelectedFilm(f)}
              className="w-full text-left p-4 hover:bg-zinc-50 transition-colors flex items-center justify-between group"
            >
              <div>
                <h4 className="font-bold text-zinc-900 group-hover:text-orange-600 transition-colors">{f.turkishTitle || f.originalTitle}</h4>
                <p className="text-sm text-zinc-500">{f.originalTitle} ({f.releaseYear})</p>
              </div>
              <ChevronRight className="w-5 h-5 text-zinc-300 group-hover:text-orange-500 transition-colors" />
            </button>
          ))}
        </div>
      )}

      {search && results.length === 0 && (
        <div className="text-center py-12 bg-zinc-50 rounded-3xl border border-dashed border-zinc-200">
          <p className="text-zinc-400">{t.noData}</p>
        </div>
      )}

      {selectedFilm && (
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white rounded-3xl border border-zinc-200 shadow-xl overflow-hidden"
        >
          <FilmDetailView film={selectedFilm} onEdit={onEdit} t={t} language={language} />
        </motion.div>
      )}
    </motion.div>
  );
});

