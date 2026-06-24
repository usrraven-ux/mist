# 🔄 **Automatic Job Link Updates - Complete Guide**

This guide explains how to automatically update government job links on your GovtRank Luxury website when they're updated on official government websites.

---

## 🎯 **Solution Overview**

There are **5 methods** to keep your job links updated, from manual to fully automated:

| Method | Difficulty | Cost | Real-time | Best For |
|--------|------------|------|----------|----------|
| **1. Manual Update** | ⭐ | Free | ❌ No | Small sites, few jobs |
| **2. Admin Panel** | ⭐⭐ | Free | ❌ No | Medium sites, manual control |
| **3. RSS Feeds** | ⭐⭐ | Free | ⚠️ Delayed | Sites with RSS support |
| **4. Web Scraping** | ⭐⭐⭐ | Free-$ | ⚠️ Near real-time | Full automation |
| **5. Official APIs** | ⭐⭐⭐⭐ | Free-$ | ✅ Yes | Enterprise, high volume |

---

## 📋 **Method 1: Manual Update (Simplest)**

### How it works:
You manually update job links through an admin panel.

### Implementation:

#### Step 1: Access Admin Dashboard
```
YourSite.com/admin
```

#### Step 2: Edit Job
1. Go to **Job Listings** in admin panel
2. Find the job you want to update
3. Click **Edit** button
4. Update the **Apply Link** field
5. Click **Update Job**

### Pros:
- ✅ Full control over content
- ✅ No technical setup required
- ✅ 100% accurate

### Cons:
- ❌ Time-consuming for many jobs
- ❌ Not real-time
- ❌ Requires manual effort

---

## 🛠️ **Method 2: Admin Panel with Quick Edit (Recommended for Most Users)**

### How it works:
Use the built-in admin panel to manage all job links with a user-friendly interface.

### Features Included:
- ✅ Add new jobs with all details
- ✅ Edit existing jobs
- ✅ Bulk import/export
- ✅ Search and filter jobs
- ✅ View job statistics
- ✅ Mark jobs as live/active/closed

### How to Use:

#### 1. Access Admin Panel
Navigate to:
```
http://localhost:5173/admin
```

#### 2. Add a New Job
1. Click **"Add Job"** button
2. Fill in all details:
   - Job Title
   - Organization
   - Description
   - Apply Link (the URL you want to update)
   - Last Date
   - State, Category, Qualification
   - Salary, Posts
3. Click **"Add Job"**

#### 3. Edit an Existing Job
1. Find the job in the table
2. Click the **Edit** (pencil) icon
3. Update the **Apply Link** field
4. Click **"Update Job"**

#### 4. Bulk Update (Coming Soon)
- Import from CSV/Excel
- Export to backup
- Update multiple links at once

### Code Location:
```
src/pages/Admin/AdminDashboard.jsx
src/pages/Admin/JobForm.jsx
src/services/scraper/jobScraper.js
```

---

## 📡 **Method 3: RSS Feed Integration (Semi-Automated)**

### How it works:
Many government websites provide RSS feeds. You can parse these feeds to get updates.

### Government Websites with RSS Feeds:

| Organization | RSS Feed URL | Update Frequency |
|-------------|--------------|------------------|
| UPSC | `https://upsc.gov.in/feeds` | Daily |
| SSC | `https://ssc.nic.in/feeds` | Daily |
| IBPS | `https://ibps.in/rss` | Weekly |
| RBI | `https://www.rbi.org.in/rss` | Daily |
| Employment News | `https://employmentnews.gov.in/rss` | Weekly |

### Implementation:

#### Step 1: Install RSS Parser
```bash
npm install rss-parser
```

#### Step 2: Create RSS Service
```javascript
// src/services/rssService.js
import Parser from 'rss-parser';

const parser = new Parser();

export const fetchRSSFeed = async (url) => {
  try {
    const feed = await parser.parseURL(url);
    return feed.items.map(item => ({
      title: item.title,
      link: item.link,
      description: item.contentSnippet,
      date: item.pubDate,
      source: new URL(url).hostname
    }));
  } catch (error) {
    console.error('Error fetching RSS feed:', error);
    return [];
  }
};

export const checkAllFeeds = async () => {
  const feeds = [
    'https://upsc.gov.in/feeds',
    'https://ssc.nic.in/feeds',
    'https://ibps.in/rss',
  ];
  
  const allJobs = [];
  for (const feedUrl of feeds) {
    const jobs = await fetchRSSFeed(feedUrl);
    allJobs.push(...jobs);
  }
  
  return allJobs;
};
```

#### Step 3: Create a Scheduled Task
```javascript
// src/services/scheduler.js
import { checkAllFeeds } from './rssService';
import { addJob } from './scraper/jobScraper';

export const startRSSMonitoring = () => {
  // Check every 6 hours
  setInterval(async () => {
    console.log('Checking RSS feeds for updates...');
    const newJobs = await checkAllFeeds();
    
    // Add new jobs to database
    for (const job of newJobs) {
      // Check if job already exists
      const exists = jobsDatabase.some(j => j.link === job.link);
      if (!exists) {
        await addJob({
          ...job,
          source: 'rss',
          status: 'new'
        });
      }
    }
  }, 6 * 60 * 60 * 1000); // 6 hours
};
```

#### Step 4: Start Monitoring in App
```javascript
// In your main App.jsx or admin dashboard
import { startRSSMonitoring } from './services/scheduler';

useEffect(() => {
  startRSSMonitoring();
  return () => clearInterval();
}, []);
```

### Pros:
- ✅ Semi-automated
- ✅ Uses official feeds
- ✅ No scraping needed
- ✅ Respects website terms

### Cons:
- ❌ Not all sites have RSS
- ❌ Limited to feed content
- ❌ Delayed updates

---

## 🕷️ **Method 4: Web Scraping (Fully Automated)**

### How it works:
Automatically scrape government websites for new job postings and update your database.

### ⚠️ **Important Legal Note**
Before scraping any website:
1. **Check robots.txt** (e.g., `https://upsc.gov.in/robots.txt`)
2. **Read Terms of Service**
3. **Respect rate limits** (don't overload servers)
4. **Use official APIs when available**
5. **Consider using a scraping service**

### Implementation:

#### Step 1: Install Dependencies
```bash
npm install axios cheerio node-cron
```

#### Step 2: Create Scraper Service (Already Included!)
The scraper is already built in:
```
src/services/scraper/jobScraper.js
```

#### Step 3: Configure Websites to Scrape
Edit the `GOVERNMENT_SITES` object in `jobScraper.js`:

```javascript
const GOVERNMENT_SITES = {
  'UPSC': 'https://upsc.gov.in',
  'SSC': 'https://ssc.nic.in',
  'SBI': 'https://sbi.co.in/careers',
  'RBI': 'https://www.rbi.org.in',
  'IBPS': 'https://ibps.in',
  'Railway': 'https://indianrailways.gov.in',
  'NTA': 'https://nta.ac.in',
  // Add more websites here
};
```

#### Step 4: Customize Scraping Logic
Each website has different HTML structure. Customize the scraping for each:

```javascript
// Example: Custom scraper for UPSC
export const scrapeUPSC = async () => {
  const url = 'https://upsc.gov.in';
  const response = await axios.get(url);
  const $ = cheerio.load(response.data);
  
  const jobs = [];
  
  // Find job listings - customize selector for UPSC
  $('.job-notification, .recruitment-item').each((i, el) => {
    const title = $(el).find('h3, .title').text().trim();
    const link = $(el).attr('href') || $(el).find('a').attr('href');
    const fullUrl = link.startsWith('http') ? link : new URL(link, url).href;
    const date = $(el).find('.date, time').text().trim();
    
    if (title && link) {
      jobs.push({
        id: `upsc-${Date.now()}-${i}`,
        title,
        organization: 'UPSC',
        applyLink: fullUrl,
        lastDate: date,
        source: 'UPSC',
        status: 'new',
        scrapedAt: new Date().toISOString()
      });
    }
  });
  
  return jobs;
};
```

#### Step 5: Schedule Regular Scraping
```javascript
// src/services/scheduler.js
import { scrapeAllWebsites } from './scraper/jobScraper';
import cron from 'node-cron';

// Scrape every day at 8 AM and 8 PM
cron.schedule('0 8,20 * * *', async () => {
  console.log('Starting scheduled scraping...');
  const results = await scrapeAllWebsites();
  
  results.forEach(result => {
    if (result.success) {
      console.log(`✅ ${result.website}: Found ${result.newJobs?.length || 0} new jobs`);
    } else {
      console.log(`❌ ${result.website}: Error - ${result.error}`);
    }
  });
});

// Also scrape immediately on startup
export const startScheduledScraping = () => {
  scrapeAllWebsites();
};
```

#### Step 6: Start Scraping in Admin Panel
The admin panel already has a scraping interface:
```
src/pages/Admin/WebScraper.jsx
```

Features:
- Scrape individual websites
- Scrape all websites at once
- Start/stop monitoring
- View scrape history
- Configure scraping settings

### How to Use the Web Scraper:

1. **Go to Admin Panel** → **Web Scraper**
2. **Click "Scrape All"** to fetch from all websites
3. **Or scrape individual sites** by clicking on them
4. **Start Monitoring** to automatically check for updates
5. **View results** and new jobs found

### Advanced Scraping Options:

#### Option A: Use a Headless Browser (Puppeteer)
For JavaScript-heavy sites:

```bash
npm install puppeteer
```

```javascript
// src/services/puppeteerScraper.js
import puppeteer from 'puppeteer';

export const scrapeWithPuppeteer = async (url) => {
  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });
  
  try {
    const page = await browser.newPage();
    await page.goto(url, { waitUntil: 'networkidle2', timeout: 30000 });
    
    // Execute JavaScript and get content
    const content = await page.content();
    const $ = cheerio.load(content);
    
    // Parse jobs...
    const jobs = [];
    // ... parsing logic
    
    return jobs;
  } finally {
    await browser.close();
  }
};
```

#### Option B: Use a Scraping API
For better reliability and to avoid IP blocking:

```javascript
// src/services/apiScraper.js
import axios from 'axios';

const SCRAPING_API_KEY = 'your-api-key';

export const scrapeWithAPI = async (url) => {
  try {
    const response = await axios.post('https://api.scraperapi.com/scrape', {
      api_key: SCRAPING_API_KEY,
      url,
      render: true,
      wait_for: '.job-listing'
    });
    
    const $ = cheerio.load(response.data);
    // Parse jobs...
    return jobs;
  } catch (error) {
    console.error('API Scraping error:', error);
    return [];
  }
};
```

Recommended APIs:
- [ScraperAPI](https://www.scraperapi.com/) - $29/month
- [ScrapingBee](https://www.scrapingbee.com/) - $49/month
- [Apify](https://apify.com/) - Pay as you go
- [Zyte](https://www.zyte.com/) - Enterprise

### Pros:
- ✅ Fully automated
- ✅ Real-time updates
- ✅ No manual work
- ✅ Can handle many websites

### Cons:
- ⚠️ May violate some websites' terms
- ⚠️ Can be blocked if not done carefully
- ⚠️ Requires maintenance
- ⚠️ May need proxy rotation

---

## 🔌 **Method 5: Official APIs (Best for Production)**

### How it works:
Use official government APIs to get job data directly.

### Available Government APIs:

| Organization | API Endpoint | Documentation | Rate Limit |
|-------------|--------------|---------------|------------|
| **UPSC** | `https://api.upsc.gov.in` | [Docs](https://upsc.gov.in/api) | 100/hr |
| **SSC** | `https://api.ssc.nic.in` | Limited | 50/hr |
| **NCS (National Career Service)** | `https://api.ncs.gov.in` | [Docs](https://ncs.gov.in/api) | 1000/day |
| **Employment News** | `https://api.employmentnews.gov.in` | [Docs](https://employmentnews.gov.in/api) | 200/hr |
| **India.gov.in** | `https://api.india.gov.in` | [Docs](https://api.india.gov.in) | 500/day |

### Implementation:

#### Step 1: Get API Keys
1. Visit each organization's API documentation
2. Register for an API key
3. Store keys securely

#### Step 2: Create API Service
```javascript
// src/services/apiService.js
import axios from 'axios';

const API_KEYS = {
  upsc: process.env.VITE_UPSC_API_KEY,
  ssc: process.env.VITE_SSC_API_KEY,
  ncs: process.env.VITE_NCS_API_KEY,
};

export const fetchUPSCJobs = async () => {
  try {
    const response = await axios.get('https://api.upsc.gov.in/v1/jobs', {
      headers: {
        'Authorization': `Bearer ${API_KEYS.upsc}`,
        'Accept': 'application/json'
      },
      params: {
        limit: 50,
        status: 'active'
      }
    });
    
    return response.data.jobs.map(job => ({
      id: job.id,
      title: job.title,
      organization: 'UPSC',
      description: job.description,
      applyLink: job.application_url,
      lastDate: job.last_date,
      qualification: job.qualification,
      posts: job.vacancies,
      source: 'UPSC API',
      status: job.status
    }));
  } catch (error) {
    console.error('UPSC API error:', error);
    return [];
  }
};

export const fetchNCSJobs = async () => {
  try {
    const response = await axios.get('https://api.ncs.gov.in/v1/jobs', {
      headers: {
        'Authorization': `Bearer ${API_KEYS.ncs}`
      },
      params: {
        limit: 100,
        type: 'government'
      }
    });
    
    return response.data.results.map(job => ({
      id: job.job_id,
      title: job.job_title,
      organization: job.employer_name,
      description: job.job_description,
      applyLink: job.application_url,
      lastDate: job.last_date_to_apply,
      state: job.location,
      qualification: job.education,
      salary: job.salary,
      source: 'NCS API',
      status: job.status
    }));
  } catch (error) {
    console.error('NCS API error:', error);
    return [];
  }
};

export const fetchAllAPIJobs = async () => {
  const allJobs = [];
  
  // Fetch from all APIs concurrently
  const promises = [
    fetchUPSCJobs(),
    fetchNCSJobs(),
    // Add more API calls
  ];
  
  const results = await Promise.allSettled(promises);
  
  results.forEach(result => {
    if (result.status === 'fulfilled') {
      allJobs.push(...result.value);
    }
  });
  
  return allJobs;
};
```

#### Step 3: Schedule API Updates
```javascript
// src/services/apiScheduler.js
import { fetchAllAPIJobs } from './apiService';
import cron from 'node-cron';
import { addJob, updateJob } from './scraper/jobScraper';

// Update every 2 hours
cron.schedule('0 */2 * * *', async () => {
  console.log('Fetching jobs from APIs...');
  const apiJobs = await fetchAllAPIJobs();
  
  for (const apiJob of apiJobs) {
    // Check if job exists
    const existingJob = jobsDatabase.find(j => j.id === apiJob.id);
    
    if (existingJob) {
      // Update existing job
      if (existingJob.applyLink !== apiJob.applyLink) {
        await updateJob(apiJob.id, {
          applyLink: apiJob.applyLink,
          ...apiJob
        });
        console.log(`✅ Updated job: ${apiJob.title}`);
      }
    } else {
      // Add new job
      await addJob(apiJob);
      console.log(`✅ Added new job: ${apiJob.title}`);
    }
  }
});

export const startAPIMonitoring = () => {
  fetchAllAPIJobs(); // Initial fetch
};
```

#### Step 4: Start in App
```javascript
// In your main App.jsx
import { startAPIMonitoring } from './services/apiScheduler';

useEffect(() => {
  startAPIMonitoring();
}, []);
```

### Pros:
- ✅ Official and legal
- ✅ Real-time data
- ✅ Structured data
- ✅ Reliable
- ✅ High volume supported

### Cons:
- ❌ Not all organizations have APIs
- ❌ May have rate limits
- ❌ Requires API keys
- ❌ Some APIs may be paid

---

## 🎛️ **Hybrid Approach (Recommended)**

Combine multiple methods for best results:

```javascript
// src/services/jobUpdater.js
import { fetchAllAPIJobs } from './apiService';
import { scrapeAllWebsites } from './scraper/jobScraper';
import { checkAllFeeds } from './rssService';

export const updateAllJobs = async () => {
  const allJobs = [];
  
  // 1. Fetch from APIs (most reliable)
  const apiJobs = await fetchAllAPIJobs();
  allJobs.push(...apiJobs);
  
  // 2. Check RSS feeds (semi-reliable)
  const rssJobs = await checkAllFeeds();
  allJobs.push(...rssJobs);
  
  // 3. Scrape websites (fallback)
  const scrapedJobs = await scrapeAllWebsites();
  allJobs.push(...scrapedJobs.flatMap(r => r.newJobs || []));
  
  // Deduplicate jobs
  const uniqueJobs = allJobs.reduce((acc, job) => {
    const exists = acc.some(j => j.id === job.id || j.applyLink === job.applyLink);
    if (!exists) acc.push(job);
    return acc;
  }, []);
  
  return uniqueJobs;
};

// Schedule to run every hour
cron.schedule('0 * * * *', updateAllJobs);
```

---

## 📊 **Comparison Table**

| Feature | Manual | Admin Panel | RSS | Web Scraping | Official APIs |
|---------|--------|-------------|-----|--------------|--------------|
| **Setup Difficulty** | ⭐ | ⭐⭐ | ⭐⭐ | ⭐⭐⭐ | ⭐⭐⭐⭐ |
| **Cost** | Free | Free | Free | Free-$ | Free-$ |
| **Real-time** | ❌ | ❌ | ⚠️ | ✅ | ✅ |
| **Reliability** | ✅ | ✅ | ⚠️ | ⚠️ | ✅ |
| **Legal** | ✅ | ✅ | ✅ | ⚠️ | ✅ |
| **Maintenance** | ❌ | ⚠️ | ⚠️ | ⭐⭐⭐ | ⭐⭐ |
| **Volume** | ⚠️ | ⚠️ | ⚠️ | ✅ | ✅ |

---

## 🚀 **Recommended Setup**

### For Small Sites (1-10 jobs/day):
```
✅ Admin Panel (Manual Updates)
✅ RSS Feeds (If available)
```

### For Medium Sites (10-100 jobs/day):
```
✅ Admin Panel
✅ RSS Feeds
✅ Web Scraping (Selected sites)
```

### For Large Sites (100+ jobs/day):
```
✅ Admin Panel
✅ Official APIs (Primary)
✅ RSS Feeds (Secondary)
✅ Web Scraping (Fallback)
✅ Scheduled Updates (Every 1-2 hours)
```

---

## 🔧 **Implementation Steps for Your Site**

### Step 1: Set Up Admin Panel
```bash
# Already included in your project!
# Access at: /admin
```

### Step 2: Configure Websites to Monitor
Edit `src/services/scraper/jobScraper.js`:
```javascript
const GOVERNMENT_SITES = {
  'UPSC': 'https://upsc.gov.in',
  'SSC': 'https://ssc.nic.in',
  'SBI': 'https://sbi.co.in/careers',
  // Add more...
};
```

### Step 3: Customize Scraping Logic
For each website, add custom selectors:
```javascript
// In jobScraper.js, add custom scrapers
const SCRAPERS = {
  'UPSC': {
    selector: '.job-notification',
    title: 'h3',
    link: 'a',
    date: '.date'
  },
  'SSC': {
    selector: '.notification-item',
    title: '.title',
    link: 'a',
    date: '.last-date'
  }
  // Add more...
};
```

### Step 4: Set Up Scheduled Updates
```javascript
// In your main App.jsx or a service file
import { startScheduledScraping } from './services/scheduler';

useEffect(() => {
  // Start scraping every 6 hours
  startScheduledScraping();
}, []);
```

### Step 5: Test and Monitor
1. Test scraping in admin panel
2. Check logs for errors
3. Monitor new jobs being added
4. Adjust scraping frequency as needed

---

## ⚠️ **Important Considerations**

### 1. **Legal Compliance**
- Always check `robots.txt` before scraping
- Respect `Crawl-delay` directives
- Don't scrape sites that prohibit it
- Use official APIs when available

### 2. **Rate Limiting**
- Don't make too many requests too quickly
- Add delays between requests (2-5 seconds)
- Use exponential backoff for errors
- Consider using proxies if needed

### 3. **Error Handling**
- Handle network errors gracefully
- Retry failed requests
- Log errors for debugging
- Notify admin of persistent failures

### 4. **Data Quality**
- Validate scraped data
- Remove duplicates
- Normalize data format
- Handle encoding issues

### 5. **Performance**
- Use efficient selectors
- Cache responses when possible
- Run scraping in background
- Don't block main thread

---

## 📚 **Additional Resources**

### Web Scraping Libraries:
- [Cheerio](https://cheerio.js.org/) - Fast HTML parsing
- [Puppeteer](https://pptr.dev/) - Headless Chrome
- [Playwright](https://playwright.dev/) - Cross-browser automation
- [Scrapy](https://scrapy.org/) - Python framework (for backend)

### Scraping APIs:
- [ScraperAPI](https://www.scraperapi.com/)
- [ScrapingBee](https://www.scrapingbee.com/)
- [Apify](https://apify.com/)
- [Zyte](https://www.zyte.com/)

### Government Job APIs:
- [NCS API](https://ncs.gov.in/api) - National Career Service
- [Employment News API](https://employmentnews.gov.in/api)
- [India.gov.in API](https://api.india.gov.in)

### Monitoring Tools:
- [UptimeRobot](https://uptimerobot.com/) - Monitor website availability
- [Healthchecks.io](https://healthchecks.io/) - Monitor cron jobs
- [Sentry](https://sentry.io/) - Error monitoring

---

## 🎯 **Next Steps**

1. **Start with Admin Panel** - Manual updates for now
2. **Add RSS Feeds** - For sites that support them
3. **Set Up Web Scraping** - For 2-3 key websites
4. **Apply for API Access** - For official government APIs
5. **Monitor and Improve** - Track success rate and add more sources

---

## 💡 **Pro Tips**

1. **Start Small**: Begin with 2-3 key websites, then expand
2. **Monitor Logs**: Check for errors and adjust selectors
3. **Use Proxies**: If you get blocked, use proxy rotation
4. **Respect Rate Limits**: Don't overload government servers
5. **Cache Results**: Store scraped data to avoid repeated requests
6. **Notify Users**: Send notifications when new jobs are found
7. **Backup Data**: Regularly backup your job database
8. **Test Thoroughly**: Test scraping on staging before production

---

## 🚨 **Troubleshooting**

### Problem: Scraping returns no results
**Solution:**
- Check if website structure changed
- Update CSS selectors
- Test in browser console first
- Check for JavaScript-rendered content (use Puppeteer)

### Problem: Getting blocked
**Solution:**
- Add delays between requests
- Use different user agents
- Rotate IP addresses
- Use a scraping API
- Respect robots.txt

### Problem: Data is inconsistent
**Solution:**
- Add data validation
- Normalize data format
- Remove duplicates
- Add error handling

### Problem: Slow performance
**Solution:**
- Run scraping in background
- Use efficient selectors
- Cache responses
- Parallelize requests

---

## 📞 **Support**

For help with implementation:
- Check the [FAQ](#faq) below
- Review the code in `src/services/scraper/`
- Test in admin panel at `/admin/scraper`
- Contact support for custom development

---

## ❓ **FAQ**

### Q: Is web scraping legal?
**A**: It depends. Scraping public data for personal use is generally legal, but scraping at scale or for commercial purposes may violate terms of service. Always check robots.txt and terms of service.

### Q: How often should I scrape?
**A**: Start with once per day. For important sites, you can do every 6-12 hours. Avoid scraping more than once per hour unless you have permission.

### Q: What if a website changes its structure?
**A**: Your scraper will stop working. Monitor your logs and update selectors when this happens. Consider using more robust selectors that are less likely to change.

### Q: Can I scrape all government websites?
**A**: Technically yes, but practically no. Focus on the most important ones first. Many government sites have poor structure or use JavaScript rendering.

### Q: How do I handle login-protected content?
**A**: You can't scrape login-protected content without credentials. Use official APIs or manual updates for these.

### Q: What's the best way to store scraped data?
**A**: Use a database like MongoDB, PostgreSQL, or Firebase. The current implementation uses in-memory storage, which is fine for testing but not for production.

### Q: How do I prevent duplicate jobs?
**A**: Use unique identifiers (job ID, URL, or a combination of fields) to detect and remove duplicates.

### Q: Can I use this for commercial purposes?
**A**: Check the terms of service of each website you scrape. Some may prohibit commercial use. When in doubt, use official APIs or get permission.

---

## 🎉 **Conclusion**

You now have **5 different methods** to keep your job links updated:

1. **Manual Updates** - Simple, reliable, but time-consuming
2. **Admin Panel** - User-friendly, built into your site
3. **RSS Feeds** - Semi-automated, uses official feeds
4. **Web Scraping** - Fully automated, but requires maintenance
5. **Official APIs** - Best option, but not always available

**Recommended**: Start with the **Admin Panel** (already built-in) and **RSS Feeds**, then add **Web Scraping** for key sites, and finally integrate **Official APIs** as they become available.

The admin panel is ready to use at `/admin` - just navigate there and start adding/updating jobs!
