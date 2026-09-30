const { randomUUID } = require('crypto');
const SUPABASE_URL = 'https://faunfjguuupgwoleyuye.supabase.co';
const SUPABASE_PUBLISHABLE_KEY = 'sb_publishable_mWJK65OzhMn72ESsOwrbYA_F-TqovBO';
function cors(res){res.setHeader('Access-Control-Allow-Origin','*');res.setHeader('Access-Control-Allow-Methods','POST,OPTIONS');res.setHeader('Access-Control-Allow-Headers','Content-Type');res.setHeader('Cache-Control','no-store')}
function bodyOf(req){if(!req.body)return{};if(typeof req.body==='object')return req.body;try{return JSON.parse(req.body)}catch{return{}}}
module.exports=async function handler(req,res){
  cors(res); if(req.method==='OPTIONS')return res.status(204).end(); if(req.method!=='POST')return res.status(405).json({error:'Método não permitido.'});
  const b=bodyOf(req); const amount=Number(b.amount); const giftName=String(b.gift_name||'').trim();
  if(!Number.isFinite(amount)||amount<=0||!giftName)return res.status(400).json({error:'Dados do cartão inválidos.'});
  const payload={
    client_id:String(b.client_id||randomUUID()).slice(0,100),
    name:b.name?String(b.name).trim().slice(0,80):null,
    message:b.message?String(b.message).trim().slice(0,500):null,
    gift_id:Number.isInteger(Number(b.gift_id))?Number(b.gift_id):null,
    gift_name:giftName.slice(0,200),
    amount,
    payment_status:'nao_verificado'
  };
  try{
    const upstream=await fetch(`${SUPABASE_URL}/rest/v1/cartoes?on_conflict=client_id`,{method:'POST',headers:{apikey:SUPABASE_PUBLISHABLE_KEY,'Content-Type':'application/json',Prefer:'resolution=ignore-duplicates,return=minimal'},body:JSON.stringify(payload)});
    const text=await upstream.text();
    if(!upstream.ok){let data={};try{data=text?JSON.parse(text):{}}catch{data={message:text}};return res.status(upstream.status).json({error:data.message||data.details||'Não foi possível salvar a mensagem.'})}
    return res.status(201).json({ok:true});
  }catch{return res.status(502).json({error:'Falha ao salvar a mensagem.'})}
};
