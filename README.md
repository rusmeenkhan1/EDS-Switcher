# 🔄 Website Switcher - Chrome Extension

A Chrome extension that helps you **instantly jump between your old and new website versions**. Perfect for comparing your original website with your new Adobe Edge Delivery Services (EDS) website!

## ✨ What It Does

Switch between two versions of the same website with just one click:
- 📍 **Your old website** (the original one)
- 🆕 **Your new Adobe website** (the .aem.page or .aem.live version)

## 🎯 Features

- **Simple Setup**: Just paste two sample URLs and you're done!
- **One-Click Switching**: Click the extension icon to jump between website versions
- **Works Everywhere**: Once set up, works on all pages of your websites
- **Multiple Sites**: Add as many website pairs as you need
- **Saves Automatically**: Your settings sync across all your Chrome browsers
- **Beginner-Friendly**: No technical knowledge required!

## 💡 Example - How It Works

Let's say you have these two websites:

**📍 Old website:**
```
https://www.mysite.com/products/item.html
```

**🆕 New Adobe website:**
```
https://main--mysite--company.aem.page/products/item
```

After setting up (takes 1 minute), you can:
- Be on your old website → Click extension → Opens new website
- Be on your new website → Click extension → Opens old website
- Works on **any page**, not just the one you set up!

## 📥 Installation (Takes 2 Minutes)

### Step 1: Download
1. Click the green **"Code"** button at the top of this page
2. Click **"Download ZIP"**
3. Find the downloaded file and **extract/unzip** it

### Step 2: Install in Chrome
1. Open Chrome and type `chrome://extensions/` in the address bar
2. Turn on **"Developer mode"** (toggle switch in top-right corner)
3. Click **"Load unpacked"** button
4. Select the folder you just extracted
5. **Done!** ✅ You'll see the extension appear in your toolbar

### Step 3: Pin It (Optional but Recommended)
- Click the puzzle piece icon (🧩) in your Chrome toolbar
- Find "Website Switcher" 
- Click the pin icon (📌) to keep it visible

📖 **Need more help?** See [INSTALL_GUIDE.md](INSTALL_GUIDE.md) for detailed instructions.

## 🚀 How to Use

### First Time Setup (Takes 1 Minute!)

1. **Open both versions of your website:**
   - Open any page from your **old website** in one tab
   - Open the **same page** from your new Adobe website in another tab

2. **Set up the connection:**
   - Click the extension icon in your Chrome toolbar
   - Click **"⚙️ Setup Instructions"** button
   - Copy the URL from your old website and paste it in the first box
   - Copy the URL from your new website and paste it in the second box
   - Click **"✨ Connect These Websites"**
   - **Done!** You'll see a success message 🎉

3. **Want to add more websites?**
   - Check the box "I want to add multiple websites one after another"
   - Keep adding more pairs!

### Daily Usage (Super Easy!)

1. Visit any page on your old or new website
2. Click the extension icon in your toolbar
3. A new tab opens with the other version - that's it!

**Note:** If you see a message saying "Website Not Set Up Yet", just click the link to set it up first.

## 🎨 Smart Features

The extension automatically handles:

✅ **File extensions** - Removes .html, .php, .aspx etc. when going to new site, adds them back when returning  
✅ **Both .page and .live** - When you add one, we add both Adobe versions automatically  
✅ **All pages** - Set up once using any page, works on all pages of both sites  
✅ **Multiple sites** - Add as many website pairs as you need  

## 📂 What's Included

```
website-switcher/
├── manifest.json       # Extension settings
├── popup.html         # The popup you see when clicking the icon
├── popup.js           # Makes the switching work
├── settings.html      # Setup page
├── settings.js        # Setup page logic
├── content.js         # Detects which page you're on
└── icons/             # Extension icons
```

## 🔧 Troubleshooting

### "Website Not Set Up Yet" message?
**Solution:** Click the link in the message to set up your websites. Takes 1 minute!

### Extension icon doesn't appear?
1. Look for the puzzle piece icon (🧩) in your Chrome toolbar
2. Click it and pin the "Website Switcher" extension
3. The icon should now be visible

### Extension not loading?
1. Go to `chrome://extensions/`
2. Make sure **"Developer mode"** is turned ON (top-right toggle)
3. Click the refresh icon ↻ on the extension card
4. If still not working, try restarting Chrome

### Switch not working?
1. Make sure you've set up both website URLs in the settings
2. The websites need to have the same page on both versions
3. Try refreshing the current page

### Lost your settings?
- Your settings are saved automatically in Chrome
- If you clear Chrome data, you'll need to set up again
- **Tip:** Use "💾 Save to File" to backup your settings!

## ❓ Need More Help?

- Check the [detailed installation guide](INSTALL_GUIDE.md)
- Open an issue on GitHub if something's not working
- The extension only works on `http://` and `https://` websites

## 🤝 Contributing

Found a bug? Have an idea? We'd love to hear from you!
- Submit issues for bugs or feature requests
- Pull requests are welcome!

## 📄 License

This project is open source and available under the MIT License. Free to use and modify!
