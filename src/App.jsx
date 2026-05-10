import{useState,useEffect}from"react";
import{createClient}from"@supabase/supabase-js";
const SUPABASE_URL="https://hoqnvkjdvihczssmcymh.supabase.co";
const SUPABASE_ANON_KEY="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhvcW52a2pkdmloY3pzc21jeW1oIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzgzNTY4NTksImV4cCI6MjA5MzkzMjg1OX0.cdOpIQPe6YBwzE3IrKA3hSKwvyh9ofi3ph7mLB10nYE";
const sb=createClient(SUPABASE_URL,SUPABASE_ANON_KEY);
const C={bg:"#08090d",surface:"#0f1117",card:"#141720",border:"#1e2330",accent:"#4f8ef7",green:"#34d399",yellow:"#fbbf24",red:"#f87171",text:"#eef0f6",muted:"#4a5568",soft:"#94a3b8"};
const PC={high:{color:"#f87171",label:"High"},medium:{color:"#fbbf24",label:"Medium"},low:{color:"#34d399",label:"Low"}};
const SC={"open":{color:"#4f8ef7",label:"Open",bg:"#4f8ef715"},"in-progress":{color:"#fbbf24",label:"In Progress",bg:"#fbbf2415"},resolved:{color:"#34d399",label:"Resolved",bg:"#34d39915"}};
const cats=["Network","Hardware","Software","Account","Email","Other","General"];
function ago(d){const m=Math.floor((Date.now()-new Date(d))/60000);return m<60?m+"m ago":m<1440?Math.floor(m/60)+"h ago":Math.floor(m/1440)+"d ago";}
function Spin(){return<div style={{width:16,height:16,border:"2px solid #333",borderTop:"2px solid #4f8ef7",borderRadius:"50%",animation:"spin .7s linear infinite",display:"inline-block"}}/>;}
function Badge({s}){const c=SC[s]||SC.open;return<span style={{background:c.bg,color:c.color,border:"1px solid "+c.color+"40",borderRadius:20,padding:"2px 8px",fontSize:10,fontWeight:700,textTransform:"uppercase"}}>{c.label}</span>;}
function Toast({msg,type}){return msg?<div style={{position:"fixed",bottom:20,left:"50%",transform:"translateX(-50%)",background:type==="error"?"#f87171":"#34d399",color:"#fff",borderRadius:8,padding:"8px 16px",fontSize:13,fontWeight:600,zIndex:9999}}>{msg}</div>:null;}

function Login(){
const[m,sm]=useState("login");
const[e,se]=useState("");const[p,sp]=useState("");const[n,sn]=useState("");
const[load,sl]=useState(false);const[err,ser]=useState("");const[msg,smg]=useState("");
const inp={width:"100%",background:C.surface,border:"1px solid "+C.border,borderRadius:8,color:C.text,fontSize:14,padding:"11px 13px",boxSizing:"border-box",fontFamily:"inherit",outline:"none"};
async function go(){ser("");sl(true);
try{if(m==="login"){const{error}=await sb.auth.signInWithPassword({email:e,password:p});if(error)throw error;}
else{const{data,error}=await sb.auth.signUp({email:e,password:p});if(error)throw error;
if(data.user){const r=await sb.from("organizations").select("id").limit(1).single();
if(r.data?.id)await sb.from("agents").insert({user_id:data.user.id,organization_id:r.data.id,full_name:n||e.split("@")[0],email:e,role:"admin"});
smg("Done! Check email then sign in.");sm("login");}}}
catch(x){ser(x.message);}sl(false);}
return<div style={{minHeight:"100vh",background:C.bg,display:"flex",alignItems:"center",justifyContent:"center",padding:20,fontFamily:"sans-serif"}}>
<style>{"@keyframes spin{to{transform:rotate(360deg)}}"}</style>
<div style={{width:"100%",maxWidth:380,background:C.card,border:"1px solid "+C.border,borderRadius:16,padding:32}}>
<div style={{textAlign:"center",marginBottom:28}}><div style={{fontSize:26,fontWeight:800,color:C.text}}><span style={{color:C.accent}}>⬡</span> DeskFlow</div>
<div style={{fontSize:13,color:C.muted,marginTop:4}}>{m==="login"?"Sign in":"Create account"}</div></div>
{msg&&<div style={{background:"#34d39915",color:C.green,borderRadius:6,padding:"8px 12px",fontSize:13,marginBottom:12}}>{msg}</div>}
{err&&<div style={{background:"#f8717115",color:C.red,borderRadius:6,padding:"8px 12px",fontSize:13,marginBottom:12}}>{err}</div>}
<div style={{display:"flex",flexDirection:"column",gap:12}}>
{m==="signup"&&<input style={inp} placeholder="Full name" value={n} onChange={x=>sn(x.target.value)}/>}
<input style={inp} type="email" placeholder="Email" value={e} onChange={x=>se(x.target.value)}/>
<input style={inp} type="password" placeholder="Password" value={p} onChange={x=>sp(x.target.value)} onKeyDown={x=>x.key==="Enter"&&go()}/>
<button onClick={go} disabled={load} style={{background:C.accent,border:"none",borderRadius:8,color:"#fff",fontWeight:700,fontSize:14,padding:"12px",cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",gap:8}}>
{load&&<Spin/>}{m==="login"?"Sign In":"Create Account"}</button>
<div style={{textAlign:"center",fontSize:13,color:C.muted}}>{m==="login"?"No account? ":"Have one? "}
<span onClick={()=>{sm(m==="login"?"signup":"login");ser("");smg("");}} style={{color:C.accent,cursor:"pointer",fontWeight:600}}>{m==="login"?"Sign up":"Sign in"}</span></div>
</div></div></div>;}

export default function App(){
const[sess,ss]=useState(null);const[agent,sa]=useState(null);const[org,so]=useState(null);
const[tix,st]=useState([]);const[sel,ssel]=useState(null);const[load,sl]=useState(true);
const[showNew,sn]=useState(false);const[filt,sf]=useState("all");const[q,sq]=useState("");
const[view,sv]=useState("dash");const[toast,stx]=useState({msg:"",type:"success"});
const toast2=(msg,type="success")=>{stx({msg,type});setTimeout(()=>stx({msg:"",type:"success"}),3000);};
useEffect(()=>{sb.auth.getSession().then(({data})=>{ss(data.session);if(data.session)load2(data.session.user.id);else sl(false);});
const{data:{subscription:sub}}=sb.auth.onAuthStateChange((_,s)=>{ss(s);if(s)load2(s.user.id);else{sa(null);so(null);sl(false);}});
return()=>sub.unsubscribe();},[]);
async function load2(uid){const{data}=await sb.from("agents").select("*,organizations(*)").eq("user_id",uid).single();
if(data){sa(data);so(data.organizations);const{data:t}=await sb.from("tickets_full").select("*").eq("organization_id",data.organizations.id).order("created_at",{ascending:false});st(t||[]);}sl(false);}
const rows=tix.filter(t=>(filt==="all"||t.status===filt||t.priority===filt)&&(!q||t.title?.toLowerCase().includes(q.toLowerCase())||t.customer_name?.toLowerCase().includes(q.toLowerCase())));
const stats={tot:tix.length,open:tix.filter(t=>t.status==="open").length,ip:tix.filter(t=>t.status==="in-progress").length,res:tix.filter(t=>t.status==="resolved").length,urg:tix.filter(t=>t.priority==="high"&&t.status!=="resolved").length};
if(load)return<div style={{minHeight:"100vh",background:C.bg,display:"flex",alignItems:"center",justifyContent:"center",color:C.text,fontFamily:"sans-serif"}}><Spin/></div>;
if(!sess)return<Login/>;
if(!agent)return<div style={{minHeight:"100vh",background:C.bg,display:"flex",alignItems:"center",justifyContent:"center",flexDirection:"column",gap:12,color:C.text,fontFamily:"sans-serif"}}><div>Setting up...</div><button onClick={()=>sb.auth.signOut()} style={{background:C.surface,border:"1px solid "+C.border,color:C.soft,borderRadius:6,padding:"6px 14px",cursor:"pointer"}}>Sign out</button></div>;
return<div style={{background:C.bg,minHeight:"100vh",color:C.text,fontFamily:"sans-serif",display:"flex",flexDirection:"column"}}>
<style>{"@keyframes spin{to{transform:rotate(360deg)}}*{box-sizing:border-box}"}</style>
<div style={{height:52,background:C.surface,borderBottom:"1px solid "+C.border,display:"flex",alignItems:"center",justifyContent:"space-between",padding:"0 20px",flexShrink:0}}>
<div style={{display:"flex",alignItems:"center",gap:12}}>
<div style={{fontWeight:800,fontSize:16,color:C.text}}><span style={{color:C.accent}}>⬡</span> DeskFlow</div>
{["dash","tickets"].map(v=><button key={v} onClick={()=>sv(v)} style={{background:view===v?"#4f8ef720":"transparent",border:view===v?"1px solid #4f8ef740":"1px solid transparent",color:view===v?C.accent:C.muted,borderRadius:6,padding:"6px 12px",fontWeight:700,fontSize:12,cursor:"pointer"}}>{v==="dash"?"Dashboard":"Tickets"}</button>)}
</div>
<div style={{display:"flex",gap:8,alignItems:"center"}}>
{stats.urg>0&&<span style={{background:"#f8717118",color:C.red,borderRadius:20,padding:"2px 8px",fontSize:11,fontWeight:700}}>⚠ {stats.urg}</span>}
<button onClick={()=>sn(true)} style={{background:C.accent,border:"none",borderRadius:6,color:"#fff",fontWeight:700,fontSize:12,padding:"6px 12px",cursor:"pointer"}}>+ New</button>
<div onClick={()=>sb.auth.signOut()} style={{width:28,height:28,borderRadius:"50%",background:"#4f8ef720",display:"flex",alignItems:"center",justifyContent:"center",fontSize:12,fontWeight:700,color:C.accent,cursor:"pointer"}}>{agent.full_name?.[0]?.toUpperCase()||"A"}</div>
</div></div>
<div style={{flex:1,overflow:"hidden"}}>
{view==="dash"&&<div style={{padding:24,maxWidth:900,margin:"0 auto",overflowY:"auto"}}>
<div style={{marginBottom:20}}><div style={{fontSize:18,fontWeight:800,color:C.text}}>Hi {agent.full_name?.split(" ")[0]} 👋</div><div style={{color:C.muted,fontSize:12,marginTop:2}}>{org?.name}</div></div>
<div style={{display:"flex",gap:10,flexWrap:"wrap",marginBottom:24}}>
{[["Total",stats.tot,"🎫"],[" Open",stats.open,"📬"],["In Progress",stats.ip,"⚙️"],["Resolved",stats.res,"✅"]].map(([l,v,i])=>(
<div key={l} style={{background:C.card,border:"1px solid "+C.border,borderRadius:10,padding:"14px 18px",display:"flex",alignItems:"center",gap:12,flex:1,minWidth:120}}>
<span style={{fontSize:20}}>{i}</span><div><div style={{fontSize:22,fontWeight:800,color:C.text}}>{v}</div><div style={{fontSize:11,color:C.muted,fontWeight:600}}>{l}</div></div></div>))}
</div>
<div style={{background:C.card,border:"1px solid "+C.border,borderRadius:10,overflow:"hidden"}}>
<div style={{padding:"12px 16px",borderBottom:"1px solid "+C.border,fontWeight:800,fontSize:13,display:"flex",justifyContent:"space-between",color:C.text}}>Open Tickets<button onClick={()=>sv("tickets")} style={{background:"none",border:"none",color:C.accent,fontSize:12,cursor:"pointer",fontWeight:700}}>All →</button></div>
{tix.filter(t=>t.status!=="resolved").slice(0,5).map(t=>(
<div key={t.id} onClick={()=>{ssel(t);sv("tickets");}} style={{padding:"10px 16px",borderBottom:"1px solid "+C.border,cursor:"pointer",display:"flex",justifyContent:"space-between",alignItems:"center"}} onMouseEnter={x=>x.currentTarget.style.background=C.surface} onMouseLeave={x=>x.currentTarget.style.background="transparent"}>
<div><div style={{fontWeight:600,fontSize:13,color:C.text}}>{t.title}</div><div style={{fontSize:11,color:C.muted}}>{t.customer_name}</div></div>
<div style={{display:"flex",gap:8,alignItems:"center"}}><Badge s={t.status}/><span style={{fontSize:11,color:PC[t.priority]?.color,fontWeight:600}}>{PC[t.priority]?.label}</span></div>
</div>))}
{tix.filter(t=>t.status!=="resolved").length===0&&<div style={{padding:24,textAlign:"center",color:C.muted}}>No open tickets!</div>}
</div></div>}
{view==="tickets"&&<div style={{display:"flex",height:"calc(100vh - 52px)",overflow:"hidden"}}>
<div style={{flex:1,display:"flex",flexDirection:"column",overflow:"hidden"}}>
<div style={{padding:"10px 16px",borderBottom:"1px solid "+C.border,display:"flex",gap:8,flexWrap:"wrap",alignItems:"center",background:C.surface}}>
<input value={q} onChange={x=>sq(x.target.value)} placeholder="Search..." style={{background:C.card,border:"1px solid "+C.border,borderRadius:6,color:C.text,fontSize:12,padding:"6px 10px",width:160,outline:"none"}}/>
{[["all","All"],["open","Open"],["in-progress","Active"],["resolved","Done"],["high","Urgent"]].map(([v,l])=>(
<button key={v} onClick={()=>sf(v)} style={{background:filt===v?C.accent:"transparent",border:"1px solid "+(filt===v?C.accent:C.border),color:filt===v?"#fff":C.muted,borderRadius:5,padding:"4px 10px",fontSize:11,fontWeight:700,cursor:"pointer"}}>{l}</button>))}
<span style={{marginLeft:"auto",fontSize:11,color:C.muted}}>{rows.length} tickets</span>
</div>
<div style={{flex:1,overflowY:"auto"}}>
{rows.map(t=>(
<div key={t.id} onClick={()=>ssel(t)} style={{padding:"12px 16px",borderBottom:"1px solid "+C.border,cursor:"pointer",display:"grid",gridTemplateColumns:"1fr auto",gap:12,borderLeft:sel?.id===t.id?"3px solid "+C.accent:"3px solid transparent",background:sel?.id===t.id?C.accent+"08":"transparent"}} onMouseEnter={x=>{if(sel?.id!==t.id)x.currentTarget.style.background=C.surface;}} onMouseLeave={x=>{if(sel?.id!==t.id)x.currentTarget.style.background="transparent";}}>
<div><div style={{fontWeight:600,fontSize:13,color:C.text}}>{t.title}</div>
<div style={{fontSize:11,color:C.muted,marginTop:2}}>{t.customer_name} · TKT-{String(t.ticket_number).padStart(4,"0")} · {ago(t.created_at)}</div></div>
<div style={{display:"flex",gap:6,alignItems:"center"}}><Badge s={t.status}/><span style={{fontSize:11,color:PC[t.priority]?.color,fontWeight:600}}>{PC[t.priority]?.label}</span></div>
</div>))}
</div></div>
{sel&&<div style={{width:320,background:C.card,borderLeft:"1px solid "+C.border,overflowY:"auto",padding:16}}>
<div style={{display:"flex",justifyContent:"space-between",marginBottom:12}}>
<div style={{fontWeight:700,fontSize:14,color:C.text,maxWidth:250}}>{sel.title}</div>
<button onClick={()=>ssel(null)} style={{background:"none",border:"none",color:C.muted,fontSize:18,cursor:"pointer"}}>×</button></div>
<div style={{fontSize:11,color:C.muted,marginBottom:4}}>TKT-{String(sel.ticket_number).padStart(4,"0")} · {sel.customer_name}</div>
<div style={{marginBottom:12}}><Badge s={sel.status}/></div>
<div style={{marginBottom:12}}>
<div style={{fontSize:10,color:C.muted,fontWeight:700,textTransform:"uppercase",marginBottom:6}}>Update Status</div>
<div style={{display:"flex",gap:6}}>
{["open","in-progress","resolved"].map(s=><button key={s} onClick={async()=>{const{data}=await sb.from("tickets").update({status:s}).eq("id",sel.id).select().single();if(data){st(p=>p.map(t=>t.id===data.id?{...t,...data}:t));ssel(p=>({...p,...data}));toast2("Updated!");}}} style={{flex:1,padding:"5px 2px",borderRadius:6,border:"1px solid "+(sel.status===s?SC[s]?.color:C.border),background:sel.status===s?SC[s]?.bg:"transparent",color:sel.status===s?SC[s]?.color:C.muted,fontSize:10,fontWeight:700,cursor:"pointer"}}>{SC[s]?.label}</button>)}
</div></div>
{sel.description&&<div style={{background:C.surface,borderRadius:8,padding:10,fontSize:12,color:C.soft,marginBottom:12}}>{sel.description}</div>}
</div>}
</div>}
</div>
{showNew&&org&&<NewTicket orgId={org.id} agentId={agent.id} onClose={()=>sn(false)} onDone={t=>{st(p=>[t,...p]);sn(false);toast2("Created!");}}/>}
<Toast msg={toast.msg} type={toast.type}/>
</div>;}

function NewTicket({orgId,agentId,onClose,onDone}){
const[f,sf]=useState({title:"",cn:"",ce:"",pri:"medium",cat:"General",desc:""});
const[load,sl]=useState(false);const[err,se]=useState("");
const set=(k,v)=>sf(p=>({...p,[k]:v}));
const inp={width:"100%",background:C.surface,border:"1px solid "+C.border,borderRadius:6,color:C.text,fontSize:12,padding:"8px 10px",boxSizing:"border-box",fontFamily:"inherit",outline:"none"};
async function go(){if(!f.title||!f.cn||!f.ce){se("Fill all required fields.");return;}sl(true);se("");
try{const{data:c,error:ce}=await sb.from("customers").upsert({organization_id:orgId,full_name:f.cn,email:f.ce},{onConflict:"organization_id,email"}).select("id").single();if(ce)throw ce;
const{data:t,error:te}=await sb.from("tickets").insert({organization_id:orgId,customer_id:c.id,assigned_to:agentId,title:f.title,description:f.desc,category:f.cat,priority:f.pri,status:"open"}).select().single();if(te)throw te;
onDone(t);}catch(x){se(x.message);}sl(false);}
return<div style={{position:"fixed",inset:0,background:"#00000090",display:"flex",alignItems:"center",justifyContent:"center",zIndex:1000,padding:16}}>
<div style={{background:C.card,border:"1px solid "+C.border,borderRadius:14,width:"100%",maxWidth:460,maxHeight:"90vh",overflow:"auto",padding:24}}>
<div style={{display:"flex",justifyContent:"space-between",marginBottom:20}}><div style={{fontWeight:800,fontSize:16,color:C.text}}>New Ticket</div><button onClick={onClose} style={{background:"none",border:"none",color:C.muted,fontSize:20,cursor:"pointer"}}>×</button></div>
{err&&<div style={{background:"#f8717115",color:C.red,borderRadius:6,padding:"7px 10px",fontSize:12,marginBottom:12}}>{err}</div>}
<div style={{display:"flex",flexDirection:"column",gap:12}}>
<input style={inp} placeholder="Issue title *" value={f.title} onChange={x=>set("title",x.target.value)}/>
<div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10}}>
<input style={inp} placeholder="Customer name *" value={f.cn} onChange={x=>set("cn",x.target.value)}/>
<input style={inp} placeholder="Email *" value={f.ce} onChange={x=>set("ce",x.target.value)}/>
</div>
<div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10}}>
<select style={inp} value={f.cat} onChange={x=>set("cat",x.target.value)}>{cats.map(c=><option key={c}>{c}</option>)}</select>
<select style={inp} value={f.pri} onChange={x=>set("pri",x.target.value)}><option value="low">Low</option><option value="medium">Medium</option><option value="high">High</option></select>
</div>
<textarea style={{...inp,resize:"vertical"}} rows={3} placeholder="Description" value={f.desc} onChange={x=>set("desc",x.target.value)}/>
<div style={{display:"flex",gap:8}}>
<button onClick={onClose} style={{flex:1,padding:"10px",background:"transparent",border:"1px solid "+C.border,borderRadius:6,color:C.muted,fontWeight:600,cursor:"pointer",fontSize:12}}>Cancel</button>
<button onClick={go} disabled={load} style={{flex:2,padding:"10px",background:C.accent,border:"none",borderRadius:6,color:"#fff",fontWeight:700,cursor:"pointer",fontSize:12,display:"flex",alignItems:"center",justifyContent:"center",gap:6}}>{load&&<Spin/>}Submit</button>
</div></div></div></div>;}
