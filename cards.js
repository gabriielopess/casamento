const SUPABASE_URL = 'https://faunfjguuupgwoleyuye.supabase.co';
const SUPABASE_PUBLISHABLE_KEY = 'sb_publishable_mWJK65OzhMn72ESsOwrbYA_F-TqovBO';
function cors(res){res.setHeader('Access-Control-Allow-Origin','*');res.setHeader('Access-Control-Allow-Methods','GET,DELETE,OPTIONS');res.setHeader('Access-Control-Allow-Headers','Content-Type, Authorization');res.setHeader('Cache-Control','no-store')}
module.exports=async function handler(req,res){
  cors(res); if(req.method==='OPTIONS')return res.status(204).end();
  const auth=req.headers.authorization||''; if(!auth.startsWith('Bearer '))return res.status(401).json({error:'Sessão ausente.'});
  if(!['GET','DELETE'].includes(req.method))return res.status(405).json({error:'Método não permitido.'});
  let path='/rest/v1/cartoes';
  const headers={apikey:SUPABASE_PUBLISHABLE_KEY,Authorization:auth};
  if(req.method==='GET'){
    path+='?select=id,created_at,name,message,gift_name,amount,payment_status&order=created_at.desc';
    headers.Accept='application/json';
  }else{
    const id=String(req.query?.id||''); if(!id)return res.status(400).json({error:'Cartão inválido.'});
    path+='?id=eq.'+encodeURIComponent(id); headers.Prefer='return=minimal';
  }
  try{
    const upstream=await fetch(SUPABASE_URL+path,{method:req.method,headers});
    const text=await upstream.text();
    res.status(upstream.status);
    if(!text)return res.end();
    try{return res.json(JSON.parse(text))}catch{return res.send(text)}
  }catch{return res.status(502).json({error:'Falha ao acessar os cartões.'})}
};
