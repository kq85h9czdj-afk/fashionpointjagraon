// Fashion Point admin panel scaffold. Configure Supabase and apply supabase/schema.sql before use.
import { createClient } from "https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/+esm";
const SUPABASE_URL = ""; // Add Supabase Project URL
const SUPABASE_ANON_KEY = ""; // Add public anon/publishable key only; NEVER use service_role here
const $ = (id) => document.getElementById(id);
let db = null, rows = [], user = null;
const say = (id, text) => { $(id).textContent = text; };
const split = (s) => s.split(",").map(x=>x.trim()).filter(Boolean);
const esc = (s="") => String(s).replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
const money = n => new Intl.NumberFormat("en-IN",{style:"currency",currency:"INR",maximumFractionDigits:2}).format(Number(n||0));
function signedIn(on){$("loginPanel").hidden=on;$("dashboard").hidden=!on;}
function reset(){ $("productForm").reset();$("productId").value="";$("stock").value="0";$("active").checked=true;$("formTitle").textContent="Add product"; }
async function load(){
 const {data,error}=await db.from("products").select("*").order("created_at",{ascending:false});
 if(error){say("formMessage","Could not load products. Check schema, admin role and RLS: "+error.message);return;}
 rows=data||[];render();
}
function render(){
 const term=$("search").value.toLowerCase().trim();
 const list=rows.filter(p=>(p.name+" "+(p.sku||"")+" "+p.category).toLowerCase().includes(term));
 $("productList").innerHTML=list.length?list.map(p=>'<article class="product-row"><img src="'+esc(p.image_url||"https://placehold.co/100x120?text=FP")+'" alt=""><div><strong>'+esc(p.name)+'</strong><small>'+esc(p.category)+' · '+money(p.sale_price??p.price)+' · Stock '+Number(p.stock_qty||0)+'</small><small>'+(p.is_active?"Visible":"Hidden")+' · '+esc(p.sku||"No SKU")+'</small></div><div class="row-buttons"><button class="secondary" data-edit="'+esc(p.id)+'">Edit</button><button class="secondary" data-delete="'+esc(p.id)+'">Delete</button></div></article>').join(""):'<p class="muted">No products found.</p>';
}
$("loginForm").addEventListener("submit",async e=>{e.preventDefault();if(!db)return;say("loginMessage","Signing in…");const {data,error}=await db.auth.signInWithPassword({email:$("email").value.trim(),password:$("password").value});if(error){say("loginMessage",error.message);return;}user=data.user;signedIn(true);await load();});
$("signOut").addEventListener("click",async()=>{await db?.auth.signOut();user=null;signedIn(false);});
$("productList").addEventListener("click",async e=>{
 const edit=e.target.closest("[data-edit]")?.dataset.edit, del=e.target.closest("[data-delete]")?.dataset.delete;
 if(edit){const p=rows.find(x=>x.id===edit);if(!p)return;$("productId").value=p.id;$("name").value=p.name;$("category").value=p.category;$("sku").value=p.sku||"";$("description").value=p.description||"";$("price").value=p.price;$("salePrice").value=p.sale_price??"";$("sizes").value=(p.sizes||[]).join(", ");$("colors").value=(p.colors||[]).join(", ");$("stock").value=p.stock_qty||0;$("imageUrl").value=p.image_url||"";$("active").checked=!!p.is_active;$("formTitle").textContent="Edit product";window.scrollTo({top:0,behavior:"smooth"});}
 if(del&&confirm("Permanently delete this product?")){const {error}=await db.from("products").delete().eq("id",del);if(error){say("formMessage",error.message);return;}await load();say("formMessage","Product deleted.");}
});
$("productForm").addEventListener("submit",async e=>{
 e.preventDefault();if(!db||!user)return;
 let imageUrl=$("imageUrl").value.trim();const file=$("image").files[0];
 if(file){if(!["image/jpeg","image/png","image/webp"].includes(file.type)||file.size>5*1024*1024){say("formMessage","Use JPG, PNG or WebP up to 5 MB.");return;}const ext=file.type==="image/png"?"png":file.type==="image/webp"?"webp":"jpg";const path=user.id+"/"+crypto.randomUUID()+"."+ext;const {error}=await db.storage.from("product-images").upload(path,file,{contentType:file.type});if(error){say("formMessage",error.message);return;}imageUrl=db.storage.from("product-images").getPublicUrl(path).data.publicUrl;}
 const price=Number($("price").value), sale=$("salePrice").value===""?null:Number($("salePrice").value);
 if(sale!==null&&(sale<0||sale>price)){say("formMessage","Sale price must be between zero and regular price.");return;}
 const item={name:$("name").value.trim(),category:$("category").value,sku:$("sku").value.trim()||null,description:$("description").value.trim()||null,price,sale_price:sale,sizes:split($("sizes").value),colors:split($("colors").value),stock_qty:Number($("stock").value),image_url:imageUrl||null,is_active:$("active").checked};
 const id=$("productId").value;const result=id?await db.from("products").update(item).eq("id",id):await db.from("products").insert(item);
 if(result.error){say("formMessage",result.error.message);return;}reset();await load();say("formMessage","Product saved.");
});
$("clear").addEventListener("click",reset);$("refresh").addEventListener("click",load);$("search").addEventListener("input",render);
if(!SUPABASE_URL||!SUPABASE_ANON_KEY){say("loginMessage","Setup required: configure Supabase URL/key in admin.js and apply the SQL schema.");$("loginForm").querySelector("button").disabled=true;}
else{db=createClient(SUPABASE_URL,SUPABASE_ANON_KEY);db.auth.getSession().then(async({data})=>{if(data.session){user=data.session.user;signedIn(true);await load();}});}
