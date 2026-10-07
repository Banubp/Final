// Interactive enhancements for the locally stored Lumos reference layout.
const activation = (element, action) => {
  element.addEventListener('click', action);
  element.addEventListener('keydown', event => {
    if (event.key === 'Enter' || event.key === ' ') { event.preventDefault(); action(); }
  });
};
// FAQ: each source card expands independently, including keyboard activation.
document.querySelectorAll('.framer-RRwlG').forEach((card, index) => {
  card.setAttribute('role', 'button'); card.tabIndex = 0;
  card.setAttribute('aria-expanded', 'false');
  const answer = card.querySelector('.framer-1qwsnpy');
  if (answer) { answer.id = `faq-answer-${index}`; card.setAttribute('aria-controls', answer.id); }
  activation(card, () => {
    const open = card.dataset.open !== 'true'; card.dataset.open = String(open);
    card.setAttribute('aria-expanded', String(open));
  });
});
// Service tabs update both responsive source variants with the captured plan content.
const pricing = document.getElementById('Pricing');
const planSets = {
  'Framer Dev': [
    ['Landing Page','Solo entrepreneurs who need a single, high‑converting page.','$1,500 / page',['1 responsive landing page','Framer component setup','Basic animations & hover states','SEO & page settings','1 round of revisions']],
    ['Full Website','Founders and small teams launching a multi‑page brand presence.','$5,000 / project',['Up to 5 pages + blog CMS','Custom component library','Advanced interactions (scroll, parallax)','Responsive design (mobile‑first)','SEO & analytics integration','2 rounds of revisions']]
  ],
  'App Design': [
    ['MVP Sprint','Founders who need a quick app prototype to validate.','$4,500 / sprint',['Up to 8 key screens (iOS or Android)','Interactive prototype with gestures','App icon & splash screen','Basic component set','1 round of revisions']],
    ['Full Product Design','Teams building a complete app experience for launch.','$10,000 / month',['End‑to‑end app design (all screens)','iOS & Android adaptations','Design system & component library','User research & usability testing','Micro‑interactions & animations','Developer handoff with specs']]
  ]
};
const layouts=Array.from(pricing?.querySelectorAll('.framer-Z9Rva')||[]).map(layout=>{
  const paragraphs=Array.from(layout.querySelectorAll('p'));
  return {layout,baseline:paragraphs.map(p=>p.innerHTML),paragraphs};
});
function renderPlans(name){
  layouts.forEach(({layout,paragraphs,baseline})=>{
    layout.querySelectorAll('[data-extra-feature]').forEach(e=>e.remove());
    paragraphs.forEach((p,i)=>p.innerHTML=baseline[i]);
    const plans=planSets[name]; if(!plans)return;
    plans.forEach((plan,index)=>{
      const start=index===0?3:12;
      paragraphs[start].textContent=plan[0];paragraphs[start+1].textContent=plan[1];paragraphs[start+2].textContent=plan[2];
      for(let i=0;i<5;i++)paragraphs[start+3+i].textContent='• '+plan[3][i];
      if(plan[3][5]){const extra=paragraphs[start+7].parentElement.cloneNode(true);extra.dataset.extraFeature='true';extra.querySelector('p').textContent='• '+plan[3][5];paragraphs[start+7].parentElement.after(extra);}
    });
  });
}
pricing?.querySelectorAll('[data-framer-name]').forEach(element=>{
  const name=element.dataset.framerName;
  if(!['UX/UI Design','Framer Dev','App Design'].includes(name))return;
  const tab=element.parentElement;
  tab.dataset.serviceTab=name;tab.setAttribute('role','tab');tab.tabIndex=0;
  tab.parentElement.setAttribute('role','tablist');
  activation(tab,()=>{pricing.querySelectorAll('[data-service-tab]').forEach(peer=>peer.setAttribute('aria-selected',String(peer.dataset.serviceTab===name)));renderPlans(name);});
  tab.setAttribute('aria-selected',String(name==='UX/UI Design'));
});
// Source testimonial slides are retained rather than replaced with fabricated quotes.
document.querySelectorAll('#Testimonial ul').forEach(list => {
  const slides = Array.from(list.children); let current = 0;
  const parent = list.parentElement.parentElement;
  const previous = parent.querySelector('button[aria-label="Previous"]');
  const next = parent.querySelector('button[aria-label="Next"]');
  const render = () => {
    list.style.transform = `translateX(calc(-${current * 100}% - ${current * 10}px))`;
    if (previous) previous.disabled = current === 0;
    if (next) next.disabled = current === slides.length - 1;
    slides.forEach((slide, i) => slide.setAttribute('aria-hidden', String(i !== current)));
  };
  if (previous) previous.addEventListener('click', () => { current = Math.max(0,current-1); render(); });
  if (next) next.addEventListener('click', () => { current = Math.min(slides.length-1,current+1); render(); });
  let start = null;
  list.addEventListener('pointerdown', e => { start = e.clientX; });
  list.addEventListener('pointerup', e => { if(start !== null && Math.abs(e.clientX-start)>40) {current=Math.max(0,Math.min(slides.length-1,current+(e.clientX<start?1:-1)));render();}start=null; });
  render();
});
// Process labels move to the corresponding card, preserving the scroll-based flow.
const headings = document.querySelectorAll('#Process .framer-82jxbt h2');
headings.forEach((heading,index) => {
  const label = heading.parentElement.parentElement;
  label.setAttribute('role','button'); label.tabIndex=0;
  activation(label, () => document.getElementById(`card-${index+1}`)?.scrollIntoView({behavior:matchMedia('(prefers-reduced-motion:reduce)').matches?'auto':'smooth',block:'center'}));
});
const cards = document.querySelectorAll('#Process [id^="card-"]');
if ('IntersectionObserver' in window) {
  const observer=new IntersectionObserver(entries => entries.forEach(entry => {
    if(entry.isIntersecting) {const index=Number(entry.target.id.split('-')[1])-1;headings.forEach((heading,i)=>{heading.parentElement.parentElement.style.opacity=i===index?'1':'.3';});}
  }), {rootMargin:'-30% 0px -30% 0px',threshold:.2});
  cards.forEach(card=>observer.observe(card));
}
// The reference's case-study/contact links open the original template pages for now.
// Personal portfolio pages and real project data will replace them in the content pass.
document.querySelectorAll('a[href^="./case-study"],a[href="./contact"],a[href^="/case-study"],a[href="/contact"]').forEach(link => {
  link.href = new URL(link.getAttribute('href'), 'https://lumoss.framer.website/').href;
});
// Repeat the captured logo strip to keep the local ticker seamless.
document.querySelectorAll('#Badge ul').forEach(list => {
  Array.from(list.children).forEach(item => { const copy=item.cloneNode(true);copy.setAttribute('aria-hidden','true');list.append(copy); });
});
