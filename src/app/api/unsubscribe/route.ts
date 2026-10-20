import { NextRequest, NextResponse } from 'next/server';
import { google } from 'googleapis';

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json();

    if (!email || !email.includes('@')) {
      return NextResponse.json(
        { error: 'Invalid email address' },
        { status: 400 }
      );
    }

    // Set up Google Sheets API
    const auth = new google.auth.GoogleAuth({
      credentials: {
        client_email: process.env.GOOGLE_CLIENT_EMAIL,
        private_key: process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
      },
      scopes: ['https://www.googleapis.com/auth/spreadsheets'],
    });

    const sheets = google.sheets({ version: 'v4', auth });
    const spreadsheetId = process.env.GOOGLE_SHEET_ID;

    // First, get all values from the Newsletter sheet
    const getResponse = await sheets.spreadsheets.values.get({
      spreadsheetId,
      range: 'Newsletter!B:B',
    });

    const rows = getResponse.data.values || [];
    
    // Find the row index with matching email (case-insensitive)
    const emailLower = email.toLowerCase();
    let rowIndex = -1;
    
    for (let i = 0; i < rows.length; i++) {
      if (rows[i][0] && rows[i][0].toLowerCase() === emailLower) {
        rowIndex = i;
        break;
      }
    }

    // If email not found
    if (rowIndex === -1) {
      return NextResponse.json(
        { error: 'Email address not found in our subscriber list.' },
        { status: 404 }
      );
    }

    // Delete the row (add 1 because sheets are 1-indexed)
    await sheets.spreadsheets.batchUpdate({
      spreadsheetId,
      requestBody: {
        requests: [
          {
            deleteDimension: {
              range: {
                sheetId: 0, // Assuming Newsletter is the first sheet. Adjust if needed.
                dimension: 'ROWS',
                startIndex: rowIndex,
                endIndex: rowIndex + 1,
              },
            },
          },
        ],
      },
    });

    // Optional: Log unsubscribe to a separate sheet
    const timestamp = new Date().toISOString();
    try {
      await sheets.spreadsheets.values.append({
        spreadsheetId,
        range: 'Unsubscribed!A:B', // Optional: track unsubscribes separately
        valueInputOption: 'USER_ENTERED',
        requestBody: {
          values: [[email, timestamp]],
        },
      });
    } catch (error) {
      // If Unsubscribed sheet doesn't exist, that's okay
      console.log('Unsubscribed sheet not found, skipping logging');
    }

    return NextResponse.json(
      { message: 'Successfully unsubscribed' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error unsubscribing:', error);
    return NextResponse.json(
      { error: 'Failed to unsubscribe. Please try again later.' },
      { status: 500 }
    );
  }
}