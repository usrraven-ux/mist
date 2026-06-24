/**
 * Job Scraper Service
 * Fetches and updates job data from government websites
 */

import axios from 'axios';
import cheerio from 'cheerio';

// List of government websites to monitor
const GOVERNMENT_SITES = {
  'UPSC': 'https://upsc.gov.in',
  'SSC': 'https://ssc.nic.in',
  'SBI': 'https://sbi.co.in/careers',
  'RBI': 'https://www.rbi.org.in',
  'IBPS': 'https://ibps.in',
  'Railway': 'https://indianrailways.gov.in',
  'NTA': 'https://nta.ac.in',
  'State Govt': 'https://www.india.gov.in',
};

// Mock database of jobs (in production, use a real database)
let jobsDatabase = [];

/**
 * Initialize with existing jobs
 */
export const initializeJobs = (initialJobs) => {
  jobsDatabase = [...initialJobs];
};

/**
 * Scrape a specific government website for new jobs
 */
export const scrapeWebsite = async (websiteKey) => {
  try {
    const url = GOVERNMENT_SITES[websiteKey];
    if (!url) return { success: false, error: 'Website not found' };
    
    console.log(`Scraping ${websiteKey} from ${url}...`);
    
    // In production, use a proper scraping service or API
    // This is a mock implementation
    const response = await axios.get(url, {
      headers: {
        'User-Agent': 'GovtRank Bot/1.0'
      }
    });
    
    const $ = cheerio.load(response.data);
    const newJobs = [];
    
    // Example: Scrape job listings (customize per website)
    $('a, .job-item, .notification').each((i, el) => {
      const text = $(el).text().trim();
      const href = $(el).attr('href');
      
      // Simple job detection (improve with better patterns)
      if (text.toLowerCase().includes('recruitment') || 
          text.toLowerCase().includes('notification') ||
          text.toLowerCase().includes('vacancy')) {
        
        const fullUrl = href.startsWith('http') ? href : new URL(href, url).href;
        
        newJobs.push({
          id: `scraped-${websiteKey}-${Date.now()}-${i}`,
          title: text.substring(0, 100),
          url: fullUrl,
          source: websiteKey,
          scrapedAt: new Date().toISOString(),
          status: 'new'
        });
      }
    });
    
    return { 
      success: true, 
      website: websiteKey,
      newJobs,
      count: newJobs.length 
    };
    
  } catch (error) {
    console.error(`Error scraping ${websiteKey}:`, error.message);
    return { 
      success: false, 
      website: websiteKey,
      error: error.message 
    };
  }
};

/**
 * Scrape all government websites
 */
export const scrapeAllWebsites = async () => {
  const results = [];
  
  for (const [key, url] of Object.entries(GOVERNMENT_SITES)) {
    const result = await scrapeWebsite(key);
    results.push(result);
    
    // Add delay between requests to avoid rate limiting
    await new Promise(resolve => setTimeout(resolve, 2000));
  }
  
  return results;
};

/**
 * Add a new job manually
 */
export const addJob = (jobData) => {
  const newJob = {
    ...jobData,
    id: `job-${Date.now()}`,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    source: jobData.source || 'manual'
  };
  
  jobsDatabase.push(newJob);
  return newJob;
};

/**
 * Update an existing job
 */
export const updateJob = (jobId, updates) => {
  const index = jobsDatabase.findIndex(job => job.id === jobId);
  
  if (index === -1) {
    throw new Error('Job not found');
  }
  
  jobsDatabase[index] = {
    ...jobsDatabase[index],
    ...updates,
    updatedAt: new Date().toISOString()
  };
  
  return jobsDatabase[index];
};

/**
 * Delete a job
 */
export const deleteJob = (jobId) => {
  jobsDatabase = jobsDatabase.filter(job => job.id !== jobId);
  return true;
};

/**
 * Get all jobs
 */
export const getAllJobs = () => {
  return [...jobsDatabase];
};

/**
 * Get jobs by source
 */
export const getJobsBySource = (source) => {
  return jobsDatabase.filter(job => job.source === source);
};

/**
 * Search jobs
 */
export const searchJobs = (query) => {
  const lowerQuery = query.toLowerCase();
  return jobsDatabase.filter(job => 
    job.title.toLowerCase().includes(lowerQuery) ||
    job.description?.toLowerCase().includes(lowerQuery) ||
    job.organization?.toLowerCase().includes(lowerQuery)
  );
};

/**
 * Monitor a specific URL for changes
 */
export const monitorUrl = async (url, interval = 86400000) => { // 24 hours
  let lastContent = '';
  
  const checkForChanges = async () => {
    try {
      const response = await axios.get(url);
      const currentContent = response.data;
      
      if (currentContent !== lastContent) {
        console.log(`Change detected at ${url}`);
        lastContent = currentContent;
        return { changed: true, url };
      }
      
      return { changed: false, url };
    } catch (error) {
      console.error(`Error monitoring ${url}:`, error.message);
      return { changed: false, url, error: error.message };
    }
  };
  
  // Initial check
  await checkForChanges();
  
  // Set up interval
  return setInterval(checkForChanges, interval);
};

/**
 * Start monitoring all government websites
 */
export const startMonitoring = () => {
  const monitors = [];
  
  for (const [key, url] of Object.entries(GOVERNMENT_SITES)) {
    const monitor = monitorUrl(url);
    monitors.push(monitor);
    console.log(`Started monitoring ${key} at ${url}`);
  }
  
  return monitors;
};

/**
 * Stop all monitoring
 */
export const stopMonitoring = (monitors) => {
  monitors.forEach(monitor => clearInterval(monitor));
};

export default {
  initializeJobs,
  scrapeWebsite,
  scrapeAllWebsites,
  addJob,
  updateJob,
  deleteJob,
  getAllJobs,
  getJobsBySource,
  searchJobs,
  monitorUrl,
  startMonitoring,
  stopMonitoring
};
