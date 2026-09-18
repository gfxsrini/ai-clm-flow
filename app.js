const appView=document.querySelector('#appView');
const sidebar=document.querySelector('#sidebar');
const toast=document.querySelector('#toast');
let toastTimer;
const state={screen:'dashboard',overview:false,prompt:'',documents:['Travel_Policy.pdf','Approval_Email.pdf']};

const fields=[['Service','Travel management services'],['Location','France'],['Number of employees','~500 employees'],['Target start date','1 January 2027'],['Employee personal data','Yes'],['Supplier','Not selected yet']];

function showToast(message){toast.textContent=message;toast.classList.add('show');clearTimeout(toastTimer);toastTimer=setTimeout(()=>toast.classList.remove('show'),2200)}
function icon(name,cls=''){return `<img class="${cls}" src="assets/${name}.png" alt="">`}
function docGlyph(){return `<span class="doc-glyph">${icon('contracts')}</span>`}
function statusChip(type,text){return `<span class="status-chip ${type}">${text}</span>`}
function routeForState(){if(state.screen==='dashboard-typed')return'dashboard-entered';if(state.screen==='review'&&state.overview)return'overview';return state.screen}
function applyRoute(route){
 const routes={dashboard:['dashboard',false],'dashboard-entered':['dashboard-typed',false],review:['review',false],overview:['review',true],documents:['documents',true],confirm:['confirm',true],sent:['sent',true],edit:['edit',true]};
 const selected=routes[route]||routes.dashboard;state.screen=selected[0];state.overview=selected[1];if(state.screen==='dashboard-typed'&&!state.prompt)state.prompt='Review supplier request REQ-2026-0187';render();
}
function go(screen,options={}){state.screen=screen;if('overview'in options)state.overview=options.overview;const route=routeForState();if(location.hash!==`#${route}`)history.pushState({route},'',`#${route}`);render();window.scrollTo({top:0,behavior:'smooth'})}

function dashboardTemplate(){
 const typed=state.screen==='dashboard-typed';
 return `<section class="dashboard" aria-labelledby="pageTitle">
  <div class="welcome"><span class="brand-accent"></span><p>Good morning, Catherine</p><h1 id="pageTitle">What would you like to do today?</h1></div>
  <form class="composer ${typed?'focused':''}" id="dashboardComposer">
   <label class="sr-only" for="promptInput">Ask the contract assistant</label>
   <textarea id="promptInput" rows="3" placeholder='Tell me what you need, e.g. "Review supplier request REQ-2026-0187"'>${typed?(state.prompt||'Review supplier request REQ-2026-0187'):''}</textarea>
   <div class="composer-actions"><button type="button" class="round-button" data-action="attach" aria-label="Attach documents">${icon('attachment')}</button><button type="submit" class="send-button" aria-label="Send question" ${typed?'':'disabled'}>${icon('send')}</button></div>
  </form>
  <section class="suggestions"><h2>Suggested starts</h2><div class="suggestion-grid">
   ${suggestion('review','Review supplier requests','Review supplier request REQ-2026-0187')}
   ${suggestion('followup-card','Follow up on information','Follow up on missing contract information',true)}
   ${suggestion('renew-card','Renew or extend a contract','Renew or extend a contract',true)}
   ${suggestion('amend-card','Amend an existing contract','Amend an existing contract',true)}
  </div></section>
  <section class="activity"><h2>My activity</h2><div class="metrics">
   ${metric('2','My review tasks',true)}${metric('1','Approvals to review')}${metric('2','Waiting for my input')}${metric('2','Upcoming renewals')}${metric('1','Waiting on others')}
  </div></section>
 </section>`;
}
function suggestion(asset,label,prompt,cropped=false){return `<button class="suggestion-card" data-action="suggest" data-prompt="${prompt}"><span class="suggestion-icon ${cropped?'card-icon':''}">${icon(asset)}</span><b>${label}</b><span class="arrow">›</span></button>`}
function metric(count,label,active=false){return `<button class="metric ${active?'active':''}" data-action="metric" data-label="${label}"><strong>${count}</strong><span>${label}</span></button>`}

function requestOverview(status='pending'){
 const chip=status==='pending'?statusChip('pending','Pending review'):statusChip('progress','In procurement');
 const timeline=status!=='pending';
 return `<aside class="overview-panel" aria-label="Request overview"><button class="close-panel" data-action="close-overview" aria-label="Close overview">×</button><h2>Overview</h2>
  <div class="overview-id"><span><b>REQ-2026-0187</b><small>New supplier request</small></span>${chip}</div>
  <div class="overview-fields">${fields.map(([a,b])=>`<div class="field"><b>${a}</b><span>${b}</span></div>`).join('')}</div>
  <section class="overview-section"><h3>${timeline?'Request status':'Review checklist'}<button data-action="status-info">View all</button></h3>
  ${timeline?timelineTemplate(status):checklistTemplate()}</section>
  <div class="next-step"><span>${timeline?'✎':'♙'}</span><div><b>${timeline?'Need to make a change?':'Next step'}</b><small>${timeline?'You can add a note or request a change while it is with Procurement.':'Send to Procurement'}</small></div><button data-action="${timeline?'edit':'documents'}">→</button></div>
 </aside>`;
}
function checklistTemplate(){return `<div class="checklist">
 ${checkItem('Request information','Complete','done')}${checkItem('Supporting documents','Complete (3/3)','done')}${checkItem('Ownership and contract type','Confirmed','current')}${checkItem('Existing supplier or contract checked','Needs review','')}${checkItem('Risk, privacy and security identified','Needs review','')}
 </div>`}
function checkItem(title,sub,status){return `<div class="check-item"><span class="step-dot ${status}">${status==='done'?'✓':''}</span><span><b>${title}</b><small>${sub}</small></span></div>`}
function timelineTemplate(){return `<div class="timeline">
 ${timelineItem('Submitted by Business User','13 Sep 2026, 10:22 AM · John Dupont','done')}${timelineItem('Reviewed and approved by Contract Manager','13 Sep 2026, 11:44 AM · Catherine Moreau','done')}${timelineItem('With Procurement','13 Sep 2026, 11:47 AM · Procurement team will determine the sourcing route.','red')}${timelineItem('Sourcing','Not started','')}${timelineItem('Supplier selection','Not started','')}
 </div>`}
function timelineItem(title,sub,status){return `<div class="timeline-item"><span class="step-dot ${status}">${status==='done'?'✓':''}</span><span><b>${title}</b><small>${sub}</small></span></div>`}

function requestDetailsCard(status='pending'){
 return `<section class="request-card"><div class="card-header">${docGlyph()}<div class="card-title"><b>REQ-2026-0187</b><small>New supplier request</small></div>${status==='pending'?statusChip('pending','Pending review'):statusChip('progress','In procurement')}</div>
 <div class="detail-grid"><div class="detail-column">${fieldList(fields.slice(0,4))}</div><div class="detail-column"><div class="field"><b>Requestor</b><span>🔵 John Dupont<br>Business User</span></div>${fieldList(fields.slice(4))}<div class="field"><b>Additional notes</b><span>Include 24/7 support</span></div></div></div>
 <div class="support-row">${docGlyph()}<div class="support-text"><b>Supporting documents (3)</b><small>Request form, Business case, Service requirements</small></div><span>→</span></div></section>`;
}
function fieldList(items){return items.map(([a,b])=>`<div class="field"><b>${a}</b><span>${b}</span></div>`).join('')}
function bottomComposer(value=''){return `<form class="bottom-composer" id="bottomComposer"><button type="button" class="round-button" data-action="attach">${icon('attachment')}</button><input id="bottomInput" value="${value}" placeholder="Type your answer or say what you want to change..."><button class="send-button" aria-label="Send">${icon('send')}</button></form>`}

function reviewTemplate(){
 return `<div class="request-layout ${state.overview?'with-overview':''}"><section class="request-main"><div class="request-content">
  <div class="request-topline"><h1>Review request</h1><button class="outline-button" data-action="overview">▦ &nbsp; View overview</button></div>
  <p class="intro">John Dupont has submitted a new supplier request for travel management services.<br>I've reviewed the information available. Before this can be sent to Procurement, please check the key details below and let me know if you would like to approve, request more information, or escalate.</p>
  ${requestDetailsCard()}
  <section class="review-points"><h2>✨ &nbsp; Key points for your review</h2><div class="point"><span class="number-dot">1</span><span>This is a new supplier request. No supplier has been selected yet.</span></div><div class="point"><span class="number-dot">2</span><span>Employee personal data is involved, so <b>Privacy and Security reviews will be required.</b></span></div><div class="point"><span class="number-dot">3</span><span>Please confirm the request is complete and correctly routed to Procurement.</span></div></section>
  <div class="feedback-icons">▱ &nbsp; ♧ &nbsp; ♡</div><p class="label-question">What would you like to do?</p><div class="action-row"><button class="pill-button red" data-action="documents">Send to Procurement</button><button class="pill-button" data-action="more-info">Request more information</button><button class="pill-button" data-action="escalate">Escalate</button><button class="pill-button" data-action="more">More options</button></div>
 </div>${bottomComposer()}</section>${state.overview?requestOverview('pending'):''}</div>`;
}

function documentsTemplate(){return requestShell(`<div class="request-topline"><h1>Review request</h1></div><p class="intro">The request has been approved and is ready to be sent to Procurement. Would you like to add any documents, notes or changes before I hand it over?</p>
 <div class="action-tiles">${actionTile('▧','Add documents','Attach files or links','attach')}${actionTile('✎','Add a note','Add context for Procurement','note')}${actionTile('⟳','Update details','Change scope, dates...','edit')}${actionTile('♧','Add reviewers','Include stakeholders','reviewers')}</div>
 <div class="chat-bubble">I want to add the travel policy and internal approval email as supporting documents.</div><p class="intro">Here are the documents I've added. Let me know if you want to add anything else.</p>${documentsBox()}
 <p class="label-question">The documents have been added. Do you want to make any other changes before I send this to Procurement?</p><div class="action-row"><button class="pill-button red" data-action="confirm">Send to Procurement</button><button class="pill-button" data-action="more">Make another change</button><button class="pill-button" data-action="more">More options</button></div>`,'ready','Send it to Procurement.');}
function actionTile(symbol,title,sub,action){return `<button class="action-tile" data-action="${action}"><span>${symbol}</span><b>${title}</b><small>${sub}</small></button>`}
function documentsBox(){return `<section class="documents-box"><h2>Supporting documents (${state.documents.length})</h2>${state.documents.map((name,i)=>`<div class="document-row">${icon('contracts')}<div><b>${name}</b><small>${i?'1.3 MB · Internal document':'2.4 MB · Internal document'}</small></div><button data-action="remove-doc" data-index="${i}">•••</button></div>`).join('')}<button class="add-document" data-action="attach">⌕ &nbsp; Add another document</button><span class="file-formats">PDF, DOC, XLS, PNG (Max 25 MB)</span></section>`}

function requestShell(content,status='progress',composerValue=''){return `<div class="request-layout with-overview"><section class="request-main"><div class="request-content">${content}</div>${bottomComposer(composerValue)}</section>${requestOverview(status)}</div>`}

function confirmTemplate(){return requestShell(`<div class="request-topline"><h1>Review request</h1></div><p class="intro">You've added the travel policy and internal approval email. The request now looks complete and is ready to be sent to Procurement for sourcing. Please confirm that you want to send this request now.</p>
 <section class="request-card summary-card"><div class="card-header">${docGlyph()}<div class="card-title"><b>Ready to send to Procurement</b><small>The request is complete and meets the required information for sourcing.</small></div></div><div class="summary-grid">${fieldList(fields.slice(0,6))}<div class="field"><b>Additional notes</b><span>Traveler names, contact details, booking information</span></div></div><div class="support-row">${icon('attachment')}<div class="support-text"><b>Included documents (2):</b><small>Travel_Policy.pdf, Approval_Email.pdf</small></div><span>›</span></div><div class="info-banner"><span class="number-dot">i</span><div><b>What happens next?</b><p>The request will be sent to the Procurement team for sourcing. You'll be notified when there is an update. You can still add a note or withdraw the request if needed.</p></div></div><div class="summary-actions"><button class="quiet-button" data-action="more">Make another change</button><button class="primary-button" data-action="sent">➤ &nbsp; Send to Procurement</button></div></section>
 <div class="chat-bubble">Send it to Procurement.</div><div class="success-message"><span class="check-dot">✓</span>The request has been sent to Procurement.</div><p class="success-copy">I'll let you know when there is an update.</p><button class="outline-button" data-action="sent">View request status</button>`,'progress');}

function sentTemplate(){return requestShell(`<div class="request-topline"><h1>Review request</h1></div><p class="intro">The request has been sent to the Procurement team for sourcing. You can track the status below. I'll let you know when there is an update or if they need more information.</p>
 <section class="request-card summary-card"><div class="card-header"><span class="check-dot">✓</span><div class="card-title"><b>Request sent to Procurement</b><small>The request has been successfully transferred to the Procurement team.</small></div></div><div class="summary-grid">${fieldList(fields.slice(0,6))}<div class="field"><b>Additional notes</b><span>Traveler names, contact details, booking information</span></div></div><div class="support-row">${icon('attachment')}<div class="support-text"><b>Included documents (2):</b><small>Travel_Policy.pdf, Approval_Email.pdf</small></div><span>›</span></div><div class="info-banner"><span class="number-dot">i</span><div><b>What happens next?</b><p>The Procurement team will review the request, determine the sourcing route and create an RFX. You'll be notified when there is an update or if they need more information.</p></div></div><div class="summary-actions"><button class="quiet-button" data-action="status-info">View request status</button><button class="outline-button" data-action="note">Add a note</button></div></section>
 <div class="chat-bubble">Great, thank you.</div><p class="intro">You're welcome. I'll notify you when there is an update.</p><button class="outline-button" data-action="status-info">View request status</button>`,'progress');}

function editTemplate(){return requestShell(`<div class="request-topline"><h1>Review request</h1></div><p class="intro">What do you want edit?</p><section class="request-card"><div class="card-header">${docGlyph()}<div class="card-title"><b>Edit Information</b><small>Modify the details of REQ-2026-0187.</small></div></div><form class="edit-form" id="editForm"><div class="form-grid">
 ${formField('Request type','New supplier','select')}${formField('Service','Travel management services','select')}${formField('Location','France','select')}${formField('Number of employees','~500 employees')}${formField('Target start date','1 January 2027')}${formField('Employee onboard date','15 January 2027')}${formField('Additional notes','Traveler names, contact details, booking information','textarea','full')}
 </div></form><div class="support-row">${icon('attachment')}<div class="support-text"><b>Included documents (2):</b><small>Travel_Policy.pdf, Approval_Email.pdf</small></div><span>›</span></div><div class="info-banner"><span class="number-dot">i</span><div><b>What happens next?</b><p>The Procurement team will review the request, determine the sourcing route and create an RFX. You'll be notified when there is an update or if they need more information.</p></div></div><div class="form-actions"><button class="outline-button" data-action="sent">Ignore</button><button class="primary-button" data-action="save-edit">Save</button></div></section><div class="chat-bubble">Great, thank you.</div>`,'progress');}
function formField(label,value,type='input',extra=''){const control=type==='textarea'?`<textarea>${value}</textarea>`:type==='select'?`<select><option>${value}</option></select>`:`<input value="${value}">`;return `<div class="form-field ${extra}"><label>${label}</label>${control}</div>`}

function render(){
 document.querySelectorAll('.recent-item').forEach(x=>x.classList.toggle('selected',state.screen!=='dashboard'&&x.dataset.request==='REQ-2026-0187'));
 if(state.screen==='dashboard'||state.screen==='dashboard-typed')appView.innerHTML=dashboardTemplate();
 if(state.screen==='review')appView.innerHTML=reviewTemplate();
 if(state.screen==='documents')appView.innerHTML=documentsTemplate();
 if(state.screen==='confirm')appView.innerHTML=confirmTemplate();
 if(state.screen==='sent')appView.innerHTML=sentTemplate();
 if(state.screen==='edit')appView.innerHTML=editTemplate();
 document.querySelectorAll('#prototypeMenu [data-route]').forEach(button=>button.classList.toggle('active',button.dataset.route===routeForState()));
}

appView.addEventListener('input',event=>{if(event.target.id==='promptInput'){state.prompt=event.target.value;const button=appView.querySelector('.composer .send-button');button.disabled=!state.prompt.trim();appView.querySelector('.composer').classList.add('focused')}});
appView.addEventListener('submit',event=>{event.preventDefault();if(event.target.id==='dashboardComposer'){if(document.querySelector('#promptInput').value.trim())go('review')}else if(event.target.id==='bottomComposer'){showToast('Message added to the request')}});
appView.addEventListener('click',event=>{const target=event.target.closest('[data-action]');if(!target)return;const action=target.dataset.action;
 if(action==='suggest'){state.prompt=target.dataset.prompt;go('dashboard-typed');setTimeout(()=>document.querySelector('#promptInput')?.focus(),0)}
 if(action==='metric')showToast(`${target.dataset.label} selected`);
 if(action==='overview'){state.overview=true;render()}
 if(action==='close-overview'){state.overview=false;render()}
 if(action==='documents')go('documents',{overview:true});
 if(action==='confirm')go('confirm',{overview:true});
 if(action==='sent')go('sent',{overview:true});
 if(action==='edit')go('edit',{overview:true});
 if(action==='save-edit'){showToast('Request changes saved');go('sent',{overview:true})}
 if(action==='attach'){state.documents.push(`Supporting_Document_${state.documents.length+1}.pdf`);showToast('Document attached');if(state.screen==='documents')render()}
 if(action==='remove-doc'){state.documents.splice(Number(target.dataset.index),1);render();showToast('Document removed')}
 if(action==='more-info')showToast('Information request prepared for John Dupont');
 if(action==='escalate')showToast('Escalation options opened');
 if(action==='more'||action==='note'||action==='reviewers'||action==='status-info')showToast('Prototype action selected');
});

document.querySelector('#collapseButton').addEventListener('click',()=>sidebar.classList.toggle('collapsed'));
document.querySelector('#mobileMenu').addEventListener('click',()=>sidebar.classList.toggle('mobile-open'));
document.querySelector('#newChatButton').addEventListener('click',()=>{state.prompt='';state.overview=false;go('dashboard');showToast('New conversation started')});
document.querySelector('#brandHome').addEventListener('click',()=>{state.overview=false;go('dashboard')});
document.querySelector('#prototypeMenu').addEventListener('click',event=>{const button=event.target.closest('[data-route]');if(!button)return;applyRoute(button.dataset.route);history.pushState({route:button.dataset.route},'',`#${button.dataset.route}`);document.querySelector('#prototypeMenu').removeAttribute('open');window.scrollTo({top:0,behavior:'smooth'})});
document.querySelector('#searchButton').addEventListener('click',()=>{const box=document.querySelector('#searchBox');box.hidden=!box.hidden;if(!box.hidden)document.querySelector('#recentSearch').focus()});
document.querySelector('#recentsToggle').addEventListener('click',event=>{const expanded=event.currentTarget.getAttribute('aria-expanded')==='true';event.currentTarget.setAttribute('aria-expanded',String(!expanded));document.querySelector('#recentList').hidden=expanded});
document.querySelector('#recentSearch').addEventListener('input',event=>{const value=event.target.value.toLowerCase();document.querySelectorAll('.recent-item').forEach(item=>item.hidden=!item.dataset.request.toLowerCase().includes(value))});
document.querySelectorAll('.recent-item').forEach(item=>item.addEventListener('click',()=>{document.querySelectorAll('.recent-item').forEach(x=>x.classList.remove('selected'));item.classList.add('selected');if(item.dataset.request==='REQ-2026-0187')go('review');else{state.prompt=`Show me the latest status for ${item.dataset.request}`;go('dashboard-typed')}sidebar.classList.remove('mobile-open')}));
const sidebarRoutes={Approvals:'review',Contracts:'documents','My requests':'sent',Supplier:'confirm',Insights:'edit'};
document.querySelectorAll('.nav-item').forEach(item=>item.addEventListener('click',()=>{document.querySelectorAll('.nav-item').forEach(x=>x.classList.remove('active'));item.classList.add('active');applyRoute(sidebarRoutes[item.dataset.section]);history.pushState({route:sidebarRoutes[item.dataset.section]},'',`#${sidebarRoutes[item.dataset.section]}`);sidebar.classList.remove('mobile-open')}));
document.addEventListener('click',event=>{if(innerWidth<=760&&sidebar.classList.contains('mobile-open')&&!sidebar.contains(event.target)&&!event.target.closest('#mobileMenu'))sidebar.classList.remove('mobile-open')});

window.addEventListener('popstate',()=>applyRoute(location.hash.slice(1)||'dashboard'));
applyRoute(location.hash.slice(1)||'dashboard');
