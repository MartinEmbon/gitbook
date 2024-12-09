const fs = require('fs');
const path = require('path');
const createCsvWriter = require('csv-writer').createObjectCsvWriter;

// Store the filename in a variable
const gitbookEN = 'gitbookSpaceEN.json';  // You can also replace this with any dynamic filename if needed
const gitbookPT = 'gitbookSpacePT.json';  // Another example if you want to read a different file later

// Read the gitbook.json file asynchronously (using the variable)
fs.readFile(gitbookEN, 'utf8', (err, data) => {
  if (err) {
    console.error('Error reading the file:', err);
    return;
  }

  // Parse the JSON data
  const jsonData = JSON.parse(data);

  // Extract the relevant data: title, pages, and pageViews
  const extractedData = jsonData.pages.map(page => {
    // Safely access the properties
    const pageTitle = page.page ? page.page.title : 'No Title';
    const pages = page.page && page.page.pages ? page.page.pages.map(subPage => subPage.title).join(', ') : 'No SubPages';
    const pageViews = page.pageViews || 'No Page Views';

    return {
      pageTitle,
      pages,
      pageViews
    };
  });

  const timestamp = new Date().toISOString().replace(/[:.-]/g, "_");  // Replace special characters for safe filenames

  // Define the CSV file path with the timestamp
  const csvFilePath = path.join(__dirname, `output_${timestamp}.csv`);

  // Define the CSV writer configuration
  const csvWriter = createCsvWriter({
    path: csvFilePath,
    header: [
      { id: 'pageTitle', title: 'Page Title' },
      { id: 'pages', title: 'Pages' },
      { id: 'pageViews', title: 'Page Views' }
    ]
  });

  // Write data to the CSV file
  csvWriter.writeRecords(extractedData)
    .then(() => {
      console.log(`CSV file has been written to ${csvFilePath}`);
    })
    .catch((err) => {
      console.error('Error writing CSV file:', err);
    });
});
