// Settings page JavaScript for managing domain mappings

class DomainMappingManager {
  constructor() {
    this.mappings = new Map();
    this.init();
  }

  async init() {
    await this.loadMappings();
    this.setupEventListeners();
    this.renderMappings();
  }

  async loadMappings() {
    try {
      const result = await chrome.storage.sync.get(['domainMappings']);
      if (result.domainMappings) {
        this.mappings = new Map(Object.entries(result.domainMappings));
      }
    } catch (error) {
      console.error('Error loading mappings:', error);
    }
  }



  async saveMappings() {
    try {
      const mappingsObj = Object.fromEntries(this.mappings);
      await chrome.storage.sync.set({ domainMappings: mappingsObj });
      this.showStatus('✅ Saved! Your website connections are ready to use.', 'success');
    } catch (error) {
      console.error('Error saving mappings:', error);
      this.showStatus('❌ Sorry, we couldn\'t save your settings. Please try again.', 'error');
    }
  }

  setupEventListeners() {
    // Auto-configure button (main quick setup)
    document.getElementById('extractAndAdd').addEventListener('click', () => {
      this.autoConfigureMapping();
    });

    // Add More Mode toggle handler
    document.getElementById('addMoreMode').addEventListener('change', (e) => {
      this.toggleAddMoreMode(e.target.checked);
    });





    // Export mappings
    document.getElementById('exportMappings').addEventListener('click', () => {
      this.exportMappings();
    });

    // Import mappings
    document.getElementById('importMappings').addEventListener('click', () => {
      document.getElementById('fileInput').click();
    });

    document.getElementById('fileInput').addEventListener('change', (e) => {
      this.importMappings(e.target.files[0]);
    });

    // Clear all
    document.getElementById('clearAll').addEventListener('click', () => {
      this.clearAllMappings();
    });

    // Enter key support for Quick Setup
    ['sampleOriginalUrl', 'sampleEdsUrl'].forEach(id => {
      document.getElementById(id).addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
          this.autoConfigureMapping();
        }
      });
    });
  }

  async autoConfigureMapping() {
    const originalUrl = document.getElementById('sampleOriginalUrl').value.trim();
    const edsUrl = document.getElementById('sampleEdsUrl').value.trim();

    if (!originalUrl || !edsUrl) {
      this.showStatus('⚠️ Please fill in both website URLs above before clicking the button', 'error');
      return;
    }

    try {
      const originalUrlObj = new URL(originalUrl);
      const edsUrlObj = new URL(edsUrl);
      const originalDomain = originalUrlObj.hostname;
      const edsDomain = edsUrlObj.hostname;

      // Validate domains
      if (!this.isValidDomain(originalDomain) || !this.isValidDomain(edsDomain)) {
        this.showStatus('❌ The URLs you entered don\'t look right. Please check and try again.', 'error');
        return;
      }

      // Auto-detect file extension from the original URL
      const originalPath = originalUrlObj.pathname;
      const detectedExtension = this.detectFileExtension(originalPath);

      // Add bidirectional mapping with auto .page/.live domains
      const edsTargets = [edsDomain.toLowerCase()];
      
      // Auto-add complementary domain
      if (edsDomain.includes('.aem.page')) {
        const liveDomain = edsDomain.replace('.aem.page', '.aem.live');
        edsTargets.push(liveDomain.toLowerCase());
      } else if (edsDomain.includes('.aem.live')) {
        const pageDomain = edsDomain.replace('.aem.live', '.aem.page');
        edsTargets.push(pageDomain.toLowerCase());
      }
      
      // Store all EDS targets for the original domain
      for (const target of edsTargets) {
        this.mappings.set(target, originalDomain.toLowerCase());
        
        // Store extension preference for each EDS domain (including 'no extension')
        const extensionKey = `${target}->${originalDomain.toLowerCase()}-extension`;
        const extensionValue = detectedExtension || ''; // Empty string means no extension
        try {
          await chrome.storage.sync.set({ [extensionKey]: extensionValue });
        } catch (error) {
          console.error('Error saving extension preference:', error);
        }
      }
      
      // Store all EDS targets as a comma-separated string for the original domain
      this.mappings.set(originalDomain.toLowerCase(), edsTargets.join(','));

      await this.saveMappings();
      this.renderMappings();

      // Check if "Add More Mode" is enabled
      const addMoreMode = document.getElementById('addMoreMode').checked;

      // Clear inputs only if NOT in "Add More Mode"
      if (!addMoreMode) {
        document.getElementById('sampleOriginalUrl').value = '';
        document.getElementById('sampleEdsUrl').value = '';
      } else {
        // In add more mode, just clear the inputs for convenience but keep focus
        document.getElementById('sampleOriginalUrl').value = '';
        document.getElementById('sampleEdsUrl').value = '';
        document.getElementById('sampleOriginalUrl').focus();
      }

      let statusMessage = `🎉 Success! Your websites are now connected!\n\n`;
      statusMessage += `📍 Old website: ${originalDomain}\n`;
      statusMessage += `🆕 New website: ${edsTargets.join(', ')}\n`;

      if (edsTargets.length > 1) {
        statusMessage += `\n✨ Bonus: We automatically added both .page and .live versions for you!`;
      }

      statusMessage += `\n\n💡 Now you can switch between these websites instantly by clicking the extension icon when visiting either site.`;

      if (addMoreMode) {
        statusMessage += `\n\n➕ Ready to add another website pair? Just fill in the fields above!`;
      }
      this.showStatus(statusMessage, 'success');
    } catch (error) {
      this.showStatus('❌ Oops! Something went wrong with the URLs you entered. Make sure they start with "https://" and look like: https://www.example.com/page', 'error');
    }
  }

  // Helper method to detect file extension from URL path
  detectFileExtension(path) {
    const commonExtensions = ['.html', '.htm', '.php', '.aspx', '.jsp'];

    for (const ext of commonExtensions) {
      if (path.toLowerCase().endsWith(ext)) {
        return ext;
      }
    }

    // Check for any file extension pattern
    const extensionMatch = path.match(/(\.[a-zA-Z0-9]+)$/);
    if (extensionMatch) {
      return extensionMatch[1];
    }

    return null; // No extension detected
  }

  // Toggle visual feedback for Add More Mode
  toggleAddMoreMode(isActive) {
    const quickSetupForm = document.getElementById('quickSetupForm');
    const indicator = document.getElementById('addMoreIndicator');

    if (isActive) {
      quickSetupForm.classList.add('add-more-active');
      indicator.classList.add('active');
    } else {
      quickSetupForm.classList.remove('add-more-active');
      indicator.classList.remove('active');
    }
  }







  cleanDomain(domain) {
    return domain.replace(/^https?:\/\//, '').replace(/\/.*$/, '').toLowerCase();
  }

  isValidDomain(domain) {
    const domainRegex = /^[a-zA-Z0-9][a-zA-Z0-9-_.]*[a-zA-Z0-9]$/;
    return domainRegex.test(domain) && domain.includes('.');
  }

  renderMappings() {
    const container = document.getElementById('mappingsList');
    
    // Get unique pairs (avoid showing both directions)
    const uniquePairs = new Map();
    for (const [domain1, domain2] of this.mappings) {
      const isEDS1 = domain1.includes('.aem.');
      const isEDS2 = domain2.includes('.aem.');
      
      if (!isEDS1 && isEDS2) {
        // domain1 is original, domain2 is EDS
        uniquePairs.set(domain1, domain2);
      }
    }

    if (uniquePairs.size === 0) {
      container.innerHTML = '<div class="empty-state">No domain mappings configured yet. Add your first mapping above.</div>';
      return;
    }

    const html = Array.from(uniquePairs.entries()).map(([original, eds]) => `
      <div class="mapping-item">
        <div class="mapping-info">
          <div class="mapping-original">📍 ${original}</div>
          <div class="mapping-eds">🔄 ↔ 🆕 ${eds}</div>
        </div>
        <div class="mapping-actions">
          <button class="button small danger" data-original="${original}" data-eds="${eds}">Remove</button>
        </div>
      </div>
    `).join('');

    container.innerHTML = html;

    // Add event listeners for delete buttons
    container.querySelectorAll('.button.danger').forEach(button => {
      button.addEventListener('click', (e) => {
        const original = e.target.getAttribute('data-original');
        const eds = e.target.getAttribute('data-eds');
        if (confirm(`Are you sure you want to remove this connection?\n\n📍 ${original}\n🆕 ${eds}\n\nYou can always add it back later.`)) {
          this.deleteMapping(original, eds);
        }
      });
    });
  }

  deleteMapping(original, eds) {
    this.mappings.delete(original);
    this.mappings.delete(eds);
    this.saveMappings();
    this.renderMappings();
  }

  exportMappings() {
    const data = {
      version: '1.0',
      timestamp: new Date().toISOString(),
      mappings: Object.fromEntries(this.mappings)
    };

    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'my-website-connections.json';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    this.showStatus('💾 Downloaded! Your website connections have been saved to a file on your computer.', 'success');
  }

  async importMappings(file) {
    if (!file) return;

    try {
      const text = await file.text();
      const data = JSON.parse(text);

      if (data.mappings) {
        const importedMappings = new Map(Object.entries(data.mappings));

        // Merge with existing mappings
        for (const [key, value] of importedMappings) {
          this.mappings.set(key, value);
        }

        await this.saveMappings();
        this.renderMappings();
        this.showStatus(`🎉 Success! Loaded ${importedMappings.size} website connections from your file.`, 'success');
      } else {
        this.showStatus('❌ This file doesn\'t look right. Please make sure you\'re loading a file that was saved from this extension.', 'error');
      }
    } catch (error) {
      this.showStatus('❌ We couldn\'t read this file. Please make sure it\'s the correct file.', 'error');
    }

    // Reset file input
    document.getElementById('fileInput').value = '';
  }

  clearAllMappings() {
    if (confirm('⚠️ Are you sure you want to remove ALL your website connections?\n\nThis will delete everything and you\'ll need to set them up again.\n\nTip: You can use "Save to File" first to keep a backup!')) {
      this.mappings.clear();
      this.saveMappings();
      this.renderMappings();
      this.showStatus('🗑️ All website connections have been removed.', 'success');
    }
  }

  showStatus(message, type) {
    const statusEl = document.getElementById('statusMessage');
    statusEl.textContent = message;
    statusEl.className = `status-message ${type}`;
    statusEl.style.display = 'block';
    statusEl.style.whiteSpace = 'pre-line'; // Preserve line breaks

    // Scroll to show the status message
    statusEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });

    // Auto-hide after 8 seconds (longer for success messages with more info)
    setTimeout(() => {
      statusEl.style.display = 'none';
    }, type === 'success' ? 8000 : 6000);
  }
}

// Initialize the manager when page loads
let mappingManager;
document.addEventListener('DOMContentLoaded', () => {
  mappingManager = new DomainMappingManager();
});
