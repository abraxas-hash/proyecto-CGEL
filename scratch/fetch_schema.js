const https = require('https');

const url = 'https://nqouocmxfvcpyemxvobm.supabase.co/rest/v1/';
const key = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5xb3VvY214ZnZjcHllbXh2b2JtIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1MTg0MDU4NiwiZXhwIjoyMDY3NDE2NTg2fQ.WYzE45zlmtNeuMUCk9WPw4H89GI67ooFmsSam0NDOmc';

const options = {
  headers: {
    'apikey': key,
    'Authorization': `Bearer ${key}`
  }
};

https.get(url, options, (res) => {
  let data = '';
  res.on('data', (chunk) => { data += chunk; });
  res.on('end', () => {
    try {
      const schema = JSON.parse(data);
      const paths = Object.keys(schema.paths || {});
      const rpcPaths = paths.filter(p => p.startsWith('/rpc/'));
      console.log('RPC paths:', rpcPaths);
    } catch (e) {
      console.error('Error parsing JSON:', e);
    }
  });
}).on('error', (err) => {
  console.error('Error fetching schema:', err);
});
