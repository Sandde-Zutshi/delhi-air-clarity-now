interface RequestStats {
  totalRequests: number;
  manualRefreshCount: number;
  lastResetDate: string;
  dailyLimit: number;
  manualRefreshLimit: number;
}

class RequestManager {
  private static instance: RequestManager;
  private stats: RequestStats;

  private constructor() {
    this.stats = this.loadStats();
    this.checkDailyReset();
  }

  static getInstance(): RequestManager {
    if (!RequestManager.instance) {
      RequestManager.instance = new RequestManager();
    }
    return RequestManager.instance;
  }

  private loadStats(): RequestStats {
    const stored = localStorage.getItem('waqi_request_stats');
    if (stored) {
      return JSON.parse(stored);
    }
    
    return {
      totalRequests: 0,
      manualRefreshCount: 0,
      lastResetDate: new Date().toDateString(),
      dailyLimit: 1000,
      manualRefreshLimit: 436
    };
  }

  private saveStats(): void {
    localStorage.setItem('waqi_request_stats', JSON.stringify(this.stats));
  }

  private checkDailyReset(): void {
    const today = new Date().toDateString();
    if (this.stats.lastResetDate !== today) {
      this.stats.totalRequests = 0;
      this.stats.manualRefreshCount = 0;
      this.stats.lastResetDate = today;
      this.saveStats();
    }
  }

  private getCurrentTimeInterval(): number {
    const now = new Date();
    const hour = now.getHours();
    
    // 6 AM to 12 AM (18 hours) - High activity period
    if (hour >= 6 && hour < 24) {
      return 2 * 60 * 1000; // 2 minutes
    }
    
    // 12 AM to 6 AM (6 hours) - Low activity period
    return 15 * 60 * 1000; // 15 minutes
  }

  canMakeRequest(isManualRefresh: boolean = false): boolean {
    this.checkDailyReset();
    
    // Check if we've hit the daily limit
    if (this.stats.totalRequests >= this.stats.dailyLimit) {
      return false;
    }
    
    // Check manual refresh limit
    if (isManualRefresh && this.stats.manualRefreshCount >= this.stats.manualRefreshLimit) {
      return false;
    }
    
    return true;
  }

  recordRequest(isManualRefresh: boolean = false): void {
    this.checkDailyReset();
    
    this.stats.totalRequests++;
    if (isManualRefresh) {
      this.stats.manualRefreshCount++;
    }
    
    this.saveStats();
  }

  getRequestInterval(): number {
    return this.getCurrentTimeInterval();
  }

  getStats(): RequestStats {
    this.checkDailyReset();
    return { ...this.stats };
  }

  getRemainingRequests(): number {
    this.checkDailyReset();
    return Math.max(0, this.stats.dailyLimit - this.stats.totalRequests);
  }

  getRemainingManualRefreshes(): number {
    this.checkDailyReset();
    return Math.max(0, this.stats.manualRefreshLimit - this.stats.manualRefreshCount);
  }

  isManualRefreshAllowed(): boolean {
    return this.getRemainingManualRefreshes() > 0;
  }

  getNextResetTime(): Date {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(0, 0, 0, 0);
    return tomorrow;
  }

  getTimeUntilReset(): string {
    const now = new Date();
    const resetTime = this.getNextResetTime();
    const diff = resetTime.getTime() - now.getTime();
    
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    
    return `${hours}h ${minutes}m`;
  }
}

export default RequestManager; 