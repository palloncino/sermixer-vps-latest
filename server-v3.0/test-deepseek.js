import dotenv from 'dotenv';
import axios from 'axios';

// Load environment variables
dotenv.config();

const DEEPSEEK_API_KEY = process.env.DEEPSEEK_API_KEY;
const DEEPSEEK_API_URL = 'https://api.deepseek.com/v1/chat/completions';

async function testDeepSeekAPI() {
  console.log('🧪 Testing DeepSeek API Integration...\n');

  if (!DEEPSEEK_API_KEY) {
    console.log('❌ No DeepSeek API key found in environment variables');
    console.log('Please add DEEPSEEK_API_KEY=your_key_here to your .env file');
    return;
  }

  console.log('✅ DeepSeek API key found');
  console.log(`🔑 Key: ${DEEPSEEK_API_KEY.substring(0, 10)}...`);
  console.log(`🌐 API URL: ${DEEPSEEK_API_URL}\n`);

  try {
    console.log('📤 Sending test request...');
    
    const response = await axios.post(
      DEEPSEEK_API_URL,
      {
        model: 'deepseek-chat',
        messages: [
          {
            role: 'user',
            content: 'Rispondi solo con "OK"'
          }
        ],
        max_tokens: 10,
        temperature: 0
      },
      {
        headers: {
          'Authorization': `Bearer ${DEEPSEEK_API_KEY}`,
          'Content-Type': 'application/json'
        },
        timeout: 10000
      }
    );

    console.log('✅ API request successful!');
    console.log(`📊 Status: ${response.status}`);
    console.log(`🤖 Response: ${response.data.choices[0]?.message?.content}`);
    console.log('\n🎉 DeepSeek API integration is working correctly!');
    
  } catch (error) {
    console.log('❌ API request failed');
    
    if (error.response) {
      console.log(`📊 Status: ${error.response.status}`);
      console.log(`📝 Error: ${error.response.data?.error?.message || error.response.data}`);
    } else if (error.request) {
      console.log('📡 Network error - no response received');
    } else {
      console.log(`💥 Error: ${error.message}`);
    }
    
    console.log('\n🔧 Troubleshooting tips:');
    console.log('1. Check if your API key is correct');
    console.log('2. Verify your internet connection');
    console.log('3. Check if DeepSeek service is available');
    console.log('4. Ensure your account has sufficient credits');
  }
}

// Run the test
testDeepSeekAPI();
