const SUPABASE_URL = 'https://faunfjguuupgwoleyuye.supabase.co';
const SUPABASE_PUBLISHABLE_KEY = 'sb_publishable_mWJK65OzhMn72ESsOwrbYA_F-TqovBO';
function cors(res){res.setHeader('Access-Control-Allow-Origin','*');res.setHeader('Access-Control-Allow-Methods','POST,OPTIONS');res.setHeader('Access-Control-Allow-Headers','Content-Type, Authorization');res.setHeader('Cache-Control','no-store')}
function bodyOf(req){if(!req.body)return{};if(typeof req.body==='object')return req.body;try{return JSON.parse(req.body)}catch{return{}}}
module.exports=async function handler(req,res){
  cors(res); if(req.method==='OPTIONS')return res.status(204).end(); if(req.method!=='POST')return res.status(405).json({error:'Método não permitido.'});
  const {refresh_token}=bodyOf(req); if(!refresh_token)return res.status(400).json({error:'Sessão inválida.'});
  try{
    const upstream=await fetch(`${SUPABASE_URL}/auth/v1/token?grant_type=refresh_token`,{method:'POST',headers:{apikey:SUPABASE_PUBLISHABLE_KEY,'Content-Type':'application/json'},body:JSON.stringify({refresh_token})});
    const text=await upstream.text();let data={};try{data=text?JSON.parse(text):{}}catch{data={message:text}};
    if(!upstream.ok||!data.access_token)return res.status(upstream.status||401).json({error:data.msg||data.message||data.error||'Sessão expirada.'});
    return res.status(200).json({access_token:data.access_token,refresh_token:data.refresh_token,expires_in:data.expires_in});
  }catch{return res.status(502).json({error:'Falha ao renovar a sessão.'})}
};
