require('dotenv').config();
const uri = process.env.MONGO_URI;
if (!uri) {
  console.error('No MONGO_URI found in .env');
  process.exit(2);
}

console.log('Original MONGO_URI (redacted password):');
const redacted = uri.replace(/:(.*?)@/, ':<password>@');
console.log(redacted);

function parseAndSuggest(u) {
  // Very simple parsing to extract user, hosts, db, and options
  const m = u.match(/^(mongodb(?:\+srv)?:\/\/)(.*?@)?([^\/]+)\/(\w+)(\?.*)?$/);
  if (!m) return { error: 'Could not parse the URI. It may contain unexpected formatting.' };
  const scheme = m[1];
  const auth = m[2] || '';
  const hosts = m[3];
  const db = m[4];
  const opts = m[5] || '';

  const username = auth ? auth.slice(0, -1) : null; // includes trailing @ removed

  const hostList = hosts.split(',');

  // Detect placeholder tokens
  const placeholders = hosts.match(/xxxxx|<cluster>|your-cluster/g);

  // Attempt to derive srv host from the first host if it looks like an Atlas shard host
  const firstHost = hostList[0];
  let suggestedSrvHost = null;
  if (firstHost) {
    // e.g. cluster0-shard-00-00.xxxxx.mongodb.net -> cluster0.xxxxx.mongodb.net
    const parts = firstHost.split('.');
    const firstLabel = parts[0] || '';
    const shardStrip = firstLabel.replace(/-shard-\d{2}-\d{2}$/, '');
    if (shardStrip !== firstLabel) {
      suggestedSrvHost = `${shardStrip}.${parts.slice(1).join('.')}`;
    } else {
      // fallback: if firstLabel starts with cluster0- then try cluster0
      const clusterMatch = firstLabel.match(/^(cluster\d+)/);
      if (clusterMatch) {
        suggestedSrvHost = `${clusterMatch[1]}.${parts.slice(1).join('.')}`;
      }
    }
  }

  const suggestion = {};
  suggestion.db = db;
  suggestion.options = opts || '';
  suggestion.placeholders = !!placeholders;
  suggestion.suggestedSrv = null;
  if (suggestedSrvHost) {
    // build suggestion with placeholder password
    const userPart = username ? username.replace(/:.*$/, '') : '<username>';
    suggestion.suggestedSrv = `mongodb+srv://${userPart}:<password>@${suggestedSrvHost}/${db}${opts}`;
  }

  suggestion.hosts = hostList;
  return suggestion;
}

const out = parseAndSuggest(uri);
if (out.error) {
  console.error('Error parsing URI:', out.error);
  process.exit(1);
}

console.log('\nAnalysis:');
console.log('- Database name:', out.db);
console.log('- Hosts found:', out.hosts.join(', '));
if (out.placeholders) console.log('- Warning: hostnames contain placeholder tokens (like "xxxxx"). Replace them with real Atlas hostnames.');
if (out.suggestedSrv) {
  console.log('\nSuggested SRV-style URI (replace <password>):');
  console.log(out.suggestedSrv);
} else {
  console.log('\nCould not derive a safe SRV suggestion automatically.');
  console.log('If your URI is the standard Atlas multi-host form you can switch to the mongodb+srv format from the Atlas UI for a simpler connection string.');
}

console.log('\nNext steps:');
console.log('- Replace any placeholders (xxxxx) with the real cluster hostnames from Atlas.');
console.log('- Ensure the password is URL-encoded if it contains special characters.');
console.log('- Add your IP address to Atlas Network Access (or 0.0.0.0/0 for testing).');

process.exit(0);
