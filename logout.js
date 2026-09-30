const SUPABASE_URL = 'https://faunfjguuupgwoleyuye.supabase.co';
const SUPABASE_PUBLISHABLE_KEY = 'sb_publishable_mWJK65OzhMn72ESsOwrbYA_F-TqovBO';
function cors(res){res.setHeader('Access-Control-Allow-Origin','*');res.setHeader('Access-Control-Allow-Methods','POST,OPTIONS');res.setHeader('Access-Control-Allow-Headers','Content-Type, Authorization');res.setHeader('Cache-Control','no-store')}
module.exports=async function handler(req,res){
  cors(res); if(req.method==='OPTIONS')return res.status(204).end(); if(req.method!=='POST')return res.status(405).json({error:'Método não permitido.'});
  const auth=req.headers.authorization||''; if(!auth.startsWith('Bearer '))return res.status(204).end();
  try{await fetch(`${SUPABASE_URL}/auth/v1/logout`,{method:'POST',headers:{apikey:SUPABASE_PUBLISHABLE_KEY,Authorization:auth}})}catch{}
  return res.status(204).end();
};
