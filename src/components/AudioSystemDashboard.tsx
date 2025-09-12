import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Volume2, 
  Mic, 
  Settings, 
  BarChart3, 
  AlertTriangle, 
  CheckCircle, 
  XCircle,
  RefreshCw,
  Download,
  Trash2
} from 'lucide-react';
import { AudioCompatibilityManager } from '../utils/audioCompatibility';
import { AudioQualityDetector } from '../utils/audioQualityDetector';
import { AudioCacheManager } from '../utils/audioCacheManager';
import { SpeechRecognitionManager } from '../utils/speechRecognition';
import { MobileOptimizer } from '../utils/mobileOptimizer';
import { AudioAnalyzer } from '../utils/audioAnalyzer';
import { AudioLogger, AudioErrorHandler } from '../utils/audioLogger';

const AudioSystemDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [compatibility, setCompatibility] = useState<any>(null);
  const [quality, setQuality] = useState<any>(null);
  const [cacheStats, setCacheStats] = useState<any>(null);
  const [recognitionSupported, setRecognitionSupported] = useState(false);
  const [mobileInfo, setMobileInfo] = useState<any>(null);
  const [analyzerStats, setAnalyzerStats] = useState<any>(null);
  const [loggerStats, setLoggerStats] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadSystemInfo();
  }, []);

  const loadSystemInfo = async () => {
    setIsLoading(true);
    
    try {
      // 加载兼容性信息
      const compatManager = AudioCompatibilityManager.getInstance();
      setCompatibility(compatManager.getCompatibilityInfo());

      // 加载质量检测信息
      const qualityDetector = AudioQualityDetector.getInstance();
      setQuality(qualityDetector.getDeviceInfo());

      // 加载缓存统计
      const cacheManager = AudioCacheManager.getInstance();
      setCacheStats(cacheManager.getCacheStats());

      // 加载语音识别支持
      const recognitionManager = SpeechRecognitionManager.getInstance();
      setRecognitionSupported(recognitionManager.isRecognitionSupported());

      // 加载移动端信息
      const mobileOptimizer = MobileOptimizer.getInstance();
      setMobileInfo(mobileOptimizer.getDeviceInfo());

      // 加载分析器统计
      const analyzer = AudioAnalyzer.getInstance();
      setAnalyzerStats(analyzer.getAudioStats());

      // 加载日志统计
      const logger = AudioLogger.getInstance();
      setLoggerStats(logger.getStats());

    } catch (error) {
      console.error('Failed to load system info:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const refreshData = () => {
    loadSystemInfo();
  };

  const clearCache = () => {
    const cacheManager = AudioCacheManager.getInstance();
    cacheManager.clearCache();
    setCacheStats(cacheManager.getCacheStats());
  };

  const exportLogs = () => {
    const logger = AudioLogger.getInstance();
    const logs = logger.exportLogs();
    const blob = new Blob([logs], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `audio-logs-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const clearLogs = () => {
    const logger = AudioLogger.getInstance();
    logger.clearLogs();
    setLoggerStats(logger.getStats());
  };

  const tabs = [
    { id: 'overview', name: '概览', icon: BarChart3 },
    { id: 'compatibility', name: '兼容性', icon: CheckCircle },
    { id: 'quality', name: '质量', icon: Settings },
    { id: 'cache', name: '缓存', icon: Volume2 },
    { id: 'recognition', name: '识别', icon: Mic },
    { id: 'mobile', name: '移动端', icon: Settings },
    { id: 'logs', name: '日志', icon: AlertTriangle }
  ];

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full"
        />
        <span className="ml-2">加载中...</span>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="bg-white rounded-lg shadow-lg">
        {/* 头部 */}
        <div className="p-6 border-b">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold text-gray-800">
              🎵 音频系统仪表板
            </h1>
            <button
              onClick={refreshData}
              className="flex items-center space-x-2 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors"
            >
              <RefreshCw className="w-4 h-4" />
              <span>刷新</span>
            </button>
          </div>
        </div>

        {/* 标签页 */}
        <div className="flex border-b">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-2 px-6 py-4 font-medium transition-colors ${
                  activeTab === tab.id
                    ? 'text-blue-600 border-b-2 border-blue-600'
                    : 'text-gray-600 hover:text-gray-800'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{tab.name}</span>
              </button>
            );
          })}
        </div>

        {/* 内容区域 */}
        <div className="p-6">
          {activeTab === 'overview' && (
            <OverviewTab
              compatibility={compatibility}
              quality={quality}
              cacheStats={cacheStats}
              recognitionSupported={recognitionSupported}
              mobileInfo={mobileInfo}
              loggerStats={loggerStats}
            />
          )}

          {activeTab === 'compatibility' && (
            <CompatibilityTab compatibility={compatibility} />
          )}

          {activeTab === 'quality' && (
            <QualityTab quality={quality} />
          )}

          {activeTab === 'cache' && (
            <CacheTab cacheStats={cacheStats} onClearCache={clearCache} />
          )}

          {activeTab === 'recognition' && (
            <RecognitionTab recognitionSupported={recognitionSupported} />
          )}

          {activeTab === 'mobile' && (
            <MobileTab mobileInfo={mobileInfo} />
          )}

          {activeTab === 'logs' && (
            <LogsTab 
              loggerStats={loggerStats} 
              onExportLogs={exportLogs}
              onClearLogs={clearLogs}
            />
          )}
        </div>
      </div>
    </div>
  );
};

// 概览标签页
const OverviewTab: React.FC<{
  compatibility: any;
  quality: any;
  cacheStats: any;
  recognitionSupported: boolean;
  mobileInfo: any;
  loggerStats: any;
}> = ({ compatibility, quality, cacheStats, recognitionSupported, mobileInfo, loggerStats }) => {
  const getStatusIcon = (status: boolean) => {
    return status ? (
      <CheckCircle className="w-5 h-5 text-green-500" />
    ) : (
      <XCircle className="w-5 h-5 text-red-500" />
    );
  };

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-bold">系统概览</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* 兼容性状态 */}
        <div className="bg-gray-50 p-4 rounded-lg">
          <h3 className="font-semibold mb-3">兼容性状态</h3>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span>语音合成</span>
              {getStatusIcon(compatibility?.speechSynthesis)}
            </div>
            <div className="flex items-center justify-between">
              <span>Web Audio</span>
              {getStatusIcon(compatibility?.webAudio)}
            </div>
            <div className="flex items-center justify-between">
              <span>音频元素</span>
              {getStatusIcon(compatibility?.audioElement)}
            </div>
          </div>
        </div>

        {/* 质量评分 */}
        <div className="bg-gray-50 p-4 rounded-lg">
          <h3 className="font-semibold mb-3">质量评分</h3>
          <div className="text-3xl font-bold text-blue-600 mb-2">
            {quality?.qualityScore || 0}
          </div>
          <div className="text-sm text-gray-600">
            推荐质量: {quality?.recommendedQuality || 'unknown'}
          </div>
        </div>

        {/* 缓存统计 */}
        <div className="bg-gray-50 p-4 rounded-lg">
          <h3 className="font-semibold mb-3">缓存统计</h3>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span>缓存大小</span>
              <span>{cacheStats?.size || 0}</span>
            </div>
            <div className="flex justify-between">
              <span>命中率</span>
              <span>{(cacheStats?.hitRate * 100 || 0).toFixed(1)}%</span>
            </div>
          </div>
        </div>

        {/* 设备信息 */}
        <div className="bg-gray-50 p-4 rounded-lg">
          <h3 className="font-semibold mb-3">设备信息</h3>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span>设备类型</span>
              <span>{mobileInfo?.isMobile ? '移动端' : '桌面端'}</span>
            </div>
            <div className="flex justify-between">
              <span>平台</span>
              <span>{mobileInfo?.isIOS ? 'iOS' : mobileInfo?.isAndroid ? 'Android' : '其他'}</span>
            </div>
          </div>
        </div>

        {/* 语音识别 */}
        <div className="bg-gray-50 p-4 rounded-lg">
          <h3 className="font-semibold mb-3">语音识别</h3>
          <div className="flex items-center justify-between">
            <span>支持状态</span>
            {getStatusIcon(recognitionSupported)}
          </div>
        </div>

        {/* 日志统计 */}
        <div className="bg-gray-50 p-4 rounded-lg">
          <h3 className="font-semibold mb-3">日志统计</h3>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span>总日志</span>
              <span>{loggerStats?.totalLogs || 0}</span>
            </div>
            <div className="flex justify-between">
              <span>错误数</span>
              <span className="text-red-600">{loggerStats?.errorCount || 0}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// 兼容性标签页
const CompatibilityTab: React.FC<{ compatibility: any }> = ({ compatibility }) => {
  return (
    <div className="space-y-6">
      <h2 className="text-xl font-bold">兼容性详情</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-gray-50 p-4 rounded-lg">
          <h3 className="font-semibold mb-3">浏览器支持</h3>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span>语音合成</span>
              <span className={compatibility?.speechSynthesis ? 'text-green-600' : 'text-red-600'}>
                {compatibility?.speechSynthesis ? '支持' : '不支持'}
              </span>
            </div>
            <div className="flex justify-between">
              <span>Web Audio</span>
              <span className={compatibility?.webAudio ? 'text-green-600' : 'text-red-600'}>
                {compatibility?.webAudio ? '支持' : '不支持'}
              </span>
            </div>
            <div className="flex justify-between">
              <span>音频元素</span>
              <span className={compatibility?.audioElement ? 'text-green-600' : 'text-red-600'}>
                {compatibility?.audioElement ? '支持' : '不支持'}
              </span>
            </div>
          </div>
        </div>

        <div className="bg-gray-50 p-4 rounded-lg">
          <h3 className="font-semibold mb-3">设备信息</h3>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span>移动端</span>
              <span>{compatibility?.isMobile ? '是' : '否'}</span>
            </div>
            <div className="flex justify-between">
              <span>iOS</span>
              <span>{compatibility?.isIOS ? '是' : '否'}</span>
            </div>
            <div className="flex justify-between">
              <span>Android</span>
              <span>{compatibility?.isAndroid ? '是' : '否'}</span>
            </div>
            <div className="flex justify-between">
              <span>平台</span>
              <span>{compatibility?.platform || '未知'}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// 质量标签页
const QualityTab: React.FC<{ quality: any }> = ({ quality }) => {
  return (
    <div className="space-y-6">
      <h2 className="text-xl font-bold">质量检测</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-gray-50 p-4 rounded-lg">
          <h3 className="font-semibold mb-3">设备能力</h3>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span>Web Audio</span>
              <span>{quality?.hasWebAudio ? '支持' : '不支持'}</span>
            </div>
            <div className="flex justify-between">
              <span>语音合成</span>
              <span>{quality?.hasSpeechSynthesis ? '支持' : '不支持'}</span>
            </div>
            <div className="flex justify-between">
              <span>音频元素</span>
              <span>{quality?.hasAudioElement ? '支持' : '不支持'}</span>
            </div>
            <div className="flex justify-between">
              <span>低端设备</span>
              <span>{quality?.isLowEnd ? '是' : '否'}</span>
            </div>
          </div>
        </div>

        <div className="bg-gray-50 p-4 rounded-lg">
          <h3 className="font-semibold mb-3">推荐配置</h3>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span>质量等级</span>
              <span className="font-semibold">{quality?.recommendedQuality || 'unknown'}</span>
            </div>
            <div className="flex justify-between">
              <span>音频格式</span>
              <span>{quality?.recommendedFormat || 'unknown'}</span>
            </div>
            <div className="flex justify-between">
              <span>预加载策略</span>
              <span>{quality?.recommendedPreload || 'unknown'}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// 缓存标签页
const CacheTab: React.FC<{ cacheStats: any; onClearCache: () => void }> = ({ 
  cacheStats, 
  onClearCache 
}) => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold">缓存管理</h2>
        <button
          onClick={onClearCache}
          className="flex items-center space-x-2 px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors"
        >
          <Trash2 className="w-4 h-4" />
          <span>清空缓存</span>
        </button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-gray-50 p-4 rounded-lg">
          <h3 className="font-semibold mb-3">缓存统计</h3>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span>缓存大小</span>
              <span>{cacheStats?.size || 0}</span>
            </div>
            <div className="flex justify-between">
              <span>最大大小</span>
              <span>{cacheStats?.maxSize || 0}</span>
            </div>
            <div className="flex justify-between">
              <span>命中次数</span>
              <span>{cacheStats?.hits || 0}</span>
            </div>
            <div className="flex justify-between">
              <span>未命中次数</span>
              <span>{cacheStats?.misses || 0}</span>
            </div>
            <div className="flex justify-between">
              <span>淘汰次数</span>
              <span>{cacheStats?.evictions || 0}</span>
            </div>
          </div>
        </div>

        <div className="bg-gray-50 p-4 rounded-lg">
          <h3 className="font-semibold mb-3">性能指标</h3>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span>命中率</span>
              <span className="font-semibold">
                {((cacheStats?.hitRate || 0) * 100).toFixed(1)}%
              </span>
            </div>
            <div className="flex justify-between">
              <span>总大小</span>
              <span>{cacheStats?.totalSize || 0} KB</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// 识别标签页
const RecognitionTab: React.FC<{ recognitionSupported: boolean }> = ({ recognitionSupported }) => {
  return (
    <div className="space-y-6">
      <h2 className="text-xl font-bold">语音识别</h2>
      
      <div className="bg-gray-50 p-4 rounded-lg">
        <h3 className="font-semibold mb-3">支持状态</h3>
        <div className="flex items-center space-x-2">
          {recognitionSupported ? (
            <CheckCircle className="w-5 h-5 text-green-500" />
          ) : (
            <XCircle className="w-5 h-5 text-red-500" />
          )}
          <span>
            {recognitionSupported ? '支持语音识别' : '不支持语音识别'}
          </span>
        </div>
      </div>
    </div>
  );
};

// 移动端标签页
const MobileTab: React.FC<{ mobileInfo: any }> = ({ mobileInfo }) => {
  return (
    <div className="space-y-6">
      <h2 className="text-xl font-bold">移动端优化</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-gray-50 p-4 rounded-lg">
          <h3 className="font-semibold mb-3">设备信息</h3>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span>移动端</span>
              <span>{mobileInfo?.isMobile ? '是' : '否'}</span>
            </div>
            <div className="flex justify-between">
              <span>iOS</span>
              <span>{mobileInfo?.isIOS ? '是' : '否'}</span>
            </div>
            <div className="flex justify-between">
              <span>Android</span>
              <span>{mobileInfo?.isAndroid ? '是' : '否'}</span>
            </div>
            <div className="flex justify-between">
              <span>平板</span>
              <span>{mobileInfo?.isTablet ? '是' : '否'}</span>
            </div>
          </div>
        </div>

        <div className="bg-gray-50 p-4 rounded-lg">
          <h3 className="font-semibold mb-3">屏幕信息</h3>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span>宽度</span>
              <span>{mobileInfo?.screenWidth || 0}px</span>
            </div>
            <div className="flex justify-between">
              <span>高度</span>
              <span>{mobileInfo?.screenHeight || 0}px</span>
            </div>
            <div className="flex justify-between">
              <span>方向</span>
              <span>{mobileInfo?.orientation || 'unknown'}</span>
            </div>
            <div className="flex justify-between">
              <span>像素比</span>
              <span>{mobileInfo?.devicePixelRatio || 1}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// 日志标签页
const LogsTab: React.FC<{ 
  loggerStats: any; 
  onExportLogs: () => void;
  onClearLogs: () => void;
}> = ({ loggerStats, onExportLogs, onClearLogs }) => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold">日志管理</h2>
        <div className="flex space-x-2">
          <button
            onClick={onExportLogs}
            className="flex items-center space-x-2 px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg transition-colors"
          >
            <Download className="w-4 h-4" />
            <span>导出日志</span>
          </button>
          <button
            onClick={onClearLogs}
            className="flex items-center space-x-2 px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors"
          >
            <Trash2 className="w-4 h-4" />
            <span>清空日志</span>
          </button>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-gray-50 p-4 rounded-lg">
          <h3 className="font-semibold mb-3">日志统计</h3>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span>总日志数</span>
              <span>{loggerStats?.totalLogs || 0}</span>
            </div>
            <div className="flex justify-between">
              <span>错误数</span>
              <span className="text-red-600">{loggerStats?.errorCount || 0}</span>
            </div>
            <div className="flex justify-between">
              <span>警告数</span>
              <span className="text-yellow-600">{loggerStats?.warningCount || 0}</span>
            </div>
            <div className="flex justify-between">
              <span>信息数</span>
              <span className="text-blue-600">{loggerStats?.infoCount || 0}</span>
            </div>
          </div>
        </div>

        <div className="bg-gray-50 p-4 rounded-lg">
          <h3 className="font-semibold mb-3">错误率</h3>
          <div className="text-3xl font-bold text-red-600 mb-2">
            {((loggerStats?.errorRate || 0) * 100).toFixed(1)}%
          </div>
          <div className="text-sm text-gray-600">
            错误率 = 错误数 / 总日志数
          </div>
        </div>
      </div>
    </div>
  );
};

export default AudioSystemDashboard;
