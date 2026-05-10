import { useState, useEffect, useCallback } from "react";
import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = "https://hoqnvkjdvihczssmcymh.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhvcW52a2pkdmloY3pzc21jeW1oIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzgzNTY4NTksImV4cCI6MjA5MzkzMjg1OX0.cdOpIQPe6YBwzE3IrKA3hSKwvyh9ofi3ph7mLB10nYE";
const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

const C = { bg:"#08090d",surface:"#0f1117",card:"#141720",border:"#1e2330",accent:"#4f8ef7",accentGlow:"#4f8ef720",green:"#34d399",yellow:"#fbbf24",red:"#f87171",text:"#eef0f6",muted:"#4a5568",soft:"#94a3b8" };
const priorityConfig = { high:{color:C.red,label:"High",dot:"●"}, medium:{color:C.yellow,label:"Medium",dot:"●"}, low:{color:C.green,label:"Low",dot:"●"} };
const statusConfig = { "open":{color:C.accent,label:"Open",bg:"#4f8ef715"}, "in-progress":{color:C.yellow,label:"In Progress",bg:"#fbbf2415"}, "resolved":{color:C.green,label:"Resolved",bg:"#34d39915"}, "closed":{color:C.muted,label:"Closed",bg:"#4a556815"} };
const categories = ["Network","Hardware","Software","Account","Email","Other","General"];

function timeAgo(d){const diff=Date.now()-new Date(d).getTime();const m=Math.floor(diff/60000);if(m<60)return `${m}m ago`;const h=Math.floor(m/60);if(h<24)return `${h}h ago`;return `${Math.floor(h/24)}d ago`;}
function Badge({status}){const cfg=statusConfig[status]||statusConfig["open"];return(<span style={{background:cfg.bg,color:cfg.color,border:`1px solid ${cfg.color}40`,borderRadius:20,padding:"2px 10px",fontSize:11,fontWeight:700,letterSpacing:"0.06em",textTransform:"uppercase",fontFamily:"monospace"}}>{cfg.label}</span>);}
function Spinner(){return(<div style={{width:18,height:18,border:`2px solid ${C.border}`,borderTop:`2px solid ${C.accent}`,borderRadius:"50%",animation:"spin 0.7s linear infinite",display:"inline-block"}}/>);}
function Toast({msg,type}){if(!msg)return null;return(<div style={{position:"fixed",bottom:24,left:"50%",transform:"translateX(-50%)",background:type==="error"?C.red:C.green,color:"#fff",borderRadius:10,padding:"10px 20px",fontSize:13,fontWeight:600,zIndex:9999}}>{msg}</div>);}
