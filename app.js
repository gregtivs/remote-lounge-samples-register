let allSamples=[], filtered=[];
const $=s=>document.querySelector(s);
const esc=s=>String(s??"").replace(/[&<>"']/g,m=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#039;"}[m]));

async function init(){
  const res=await fetch("data/samples.json");
  allSamples=await res.json();
  fillSelect("#discipline",[...new Set(allSamples.map(x=>x.discipline))]);
  fillSelect("#package",[...new Set(allSamples.map(x=>x.package))]);
  ["#search","#discipline","#package","#status","#priority"].forEach(id=>$(id).addEventListener(id==="#search"?"input":"change",render));
  $("#closeDialog").onclick=()=>$("#sampleDialog").close();
  $("#exportBtn").onclick=exportCSV;
  render();
}
function fillSelect(id,vals){vals.sort().forEach(v=>{let o=document.createElement("option");o.value=o.textContent=v;$(id).appendChild(o)})}
function statusClass(s){if(s.startsWith("Approved"))return"status-Approved";if(s==="Submitted to PAPL")return"status-Submitted";if(s==="Revise & Resubmit")return"status-Revise";return""}
function render(){
  const q=$("#search").value.toLowerCase().trim(),d=$("#discipline").value,p=$("#package").value,s=$("#status").value,pr=$("#priority").value;
  filtered=allSamples.filter(x=>{
    const hay=[x.id,x.item,x.package,x.discipline,x.document,x.clause,x.sourceRequirement,x.responsibleSubcontractor].join(" ").toLowerCase();
    return (!q||hay.includes(q))&&(!d||x.discipline===d)&&(!p||x.package===p)&&(!s||x.status===s)&&(!pr||x.priority===pr)
  });
  const approved=allSamples.filter(x=>x.status.startsWith("Approved")).length;
  const submitted=allSamples.filter(x=>x.status==="Submitted to PAPL").length;
  const high=allSamples.filter(x=>["High","Critical"].includes(x.priority)).length;
  const photos=allSamples.reduce((n,x)=>n+(x.photos?.length||0),0);
  $("#stats").innerHTML=[
    ["Total samples",allSamples.length],["High / critical",high],["Submitted",submitted],["Approved",approved],["Photos linked",photos]
  ].map(([l,n])=>`<div class="stat"><div class="n">${n}</div><div class="label">${l}</div></div>`).join("");
  $("#resultCount").textContent=`${filtered.length} sample${filtered.length===1?"":"s"}`;
  $("#rows").innerHTML=filtered.map(x=>`<tr data-id="${x.id}">
    <td class="id">${x.id}</td><td><strong>${esc(x.item)}</strong><div class="note">${esc(x.requirementType)}</div></td>
    <td>${esc(x.package)}</td><td>${esc(x.discipline)}</td><td><span class="badge ${x.priority}">${esc(x.priority)}</span></td>
    <td><span class="badge ${statusClass(x.status)}">${esc(x.status)}</span></td><td>${esc(x.responsibleSubcontractor||"—")}</td>
    <td><div class="photo-dot">${x.photos?.length||0} 📷</div></td></tr>`).join("");
  document.querySelectorAll("tbody tr").forEach(tr=>tr.onclick=()=>openSample(tr.dataset.id));
}
function openSample(id){
  const x=allSamples.find(a=>a.id===id); if(!x)return;
  $("#modalId").textContent=`${x.id} · ${x.discipline} · ${x.package}`; $("#modalTitle").textContent=x.item;
  const photoHTML=(x.photos?.length?x.photos.map(p=>`<div class="photo-card"><img src="${esc(p)}" alt="${esc(x.item)}"></div>`).join(""):`<div class="photo-card">No photo uploaded yet<br><span class="note">Add image to images/samples/<br>${x.id}/</span></div>`);
  $("#modalBody").innerHTML=`<div class="detail-grid">
    <div class="card"><div class="label-sm">Requirement</div>${esc(x.requirement)}</div>
    <div class="card"><div class="label-sm">Status</div><span class="badge ${statusClass(x.status)}">${esc(x.status)}</span><p><b>Priority:</b> ${esc(x.priority)}<br><b>Responsible:</b> ${esc(x.responsibleSubcontractor||"Not assigned")}<br><b>Aconex:</b> ${esc(x.aconexRef||"—")}</p></div>
    <div class="card full source"><div class="label-sm">Specification reference</div><b>${esc(x.document)}</b><br>${esc(x.clause)}${x.pdfPage?` · PDF p.${esc(x.pdfPage)}`:""}<p>${esc(x.sourceRequirement)}</p><div class="mono">${esc(x.sourceReference)}</div></div>
    <div class="card full"><div class="label-sm">Sample photos</div><div class="photos">${photoHTML}</div>
      <div class="note">GitHub-only mode: place the photo in <b>images/samples/${x.id}/</b>, then add its relative path to this sample's <b>photos</b> array in <b>data/samples.json</b>. A live browser upload button can be added later with a storage backend.</div></div>
    ${x.coordinationNote?`<div class="card full"><div class="label-sm">Coordination note</div>${esc(x.coordinationNote)}</div>`:""}
    <div class="card full"><div class="label-sm">Comments</div>${esc(x.comments||"No comments recorded.")}</div>
  </div>`;
  $("#sampleDialog").showModal();
}
function exportCSV(){
  const cols=["id","discipline","package","item","requirement","requirementType","priority","responsibleSubcontractor","targetSubmissionDate","actualSubmissionDate","aconexRef","status","approvedDate","document","clause","pdfPage","sourceReference","comments"];
  const q=v=>`"${String(v??"").replaceAll('"','""')}"`;
  const csv=[cols.join(","),...filtered.map(x=>cols.map(c=>q(x[c])).join(","))].join("\n");
  const a=document.createElement("a");a.href=URL.createObjectURL(new Blob([csv],{type:"text/csv"}));a.download="remote-lounge-samples-filtered.csv";a.click();URL.revokeObjectURL(a.href);
}
init();