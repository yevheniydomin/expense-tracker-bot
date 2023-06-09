const { google } = require('googleapis');
const moment = require('moment');
const { getCategoryTitleById } = require('../db');

const auth = new google.auth.GoogleAuth({
  keyFile: '../google.credentials.json',
  scopes: 'https://www.googleapis.com/auth/spreadsheets',
});

const client = async () => await auth.getClient();

const googleSheets = google.sheets({ version: 'v4', auth: client });

const addExpenseToSpreadsheet = async function (transactionObj) {
  const { categoryId, description, price, date, tabTitle } = transactionObj;
  const category = await getCategoryTitleById(categoryId);
  const spreadsheetId = process.env.SPREADSHEET_ID;
  const month = await moment(date, 'MMMM-MM-DD').format('MMM');
  reversedDateFormat = await moment(date).format('DD/MM/YYYY');

  try {
    await googleSheets.spreadsheets.values.append({
      auth,
      spreadsheetId,
      range: `${tabTitle}!A:H`,
      valueInputOption: 'RAW',
      resource: {
        values: [
          [month, '', '', '', category, description, price, reversedDateFormat]
        ],
      },
    });
  } catch (err) {
    console.log('Err on writing to a the spreadsheet\n', err);
  }
  
};

module.exports = addExpenseToSpreadsheet;
