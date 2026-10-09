// Interactive enhancements for the locally stored Lumos reference layout.
const activation = (element, action) => {
  element.addEventListener('click', action);
  element.addEventListener('keydown', event => {
    if (event.key === 'Enter' || event.key === ' ') { event.preventDefault(); action(); }
  });
};
// The static source omitted answers from its mobile variants; share the same content.
const faqAnswers=new Map();
document.querySelectorAll('.framer-RRwlG').forEach(card=>{
  const question=card.querySelector('.framer-ri3mir')?.textContent.trim();
  const answer=card.querySelector('.framer-1qwsnpy');if(question&&answer)faqAnswers.set(question,answer);
});
// FAQ: each source card expands independently, including keyboard activation.
document.querySelectorAll('.framer-RRwlG').forEach((card, index) => {
  card.setAttribute('role', 'button'); card.tabIndex = 0;
  card.setAttribute('aria-expanded', 'false');
  const question=card.querySelector('.framer-ri3mir')?.textContent.trim();
  if(question)card.setAttribute('aria-label',question);
  let answer = card.querySelector('.framer-1qwsnpy');
  if(!answer&&faqAnswers.has(question)){answer=faqAnswers.get(question).cloneNode(true);card.append(answer);}
  card.querySelectorAll('[tabindex]').forEach(child=>child.removeAttribute('tabindex'));
  if (answer) {
    answer.id = `faq-answer-${index}`; card.setAttribute('aria-controls', answer.id);
    const wrapper=document.createElement('div'); wrapper.className='faq-answer-wrap';
    answer.before(wrapper); wrapper.append(answer); wrapper.setAttribute('aria-hidden','true'); wrapper.inert=true;
    card.querySelectorAll('[tabindex]').forEach(child=>child.removeAttribute('tabindex'));
  }
  activation(card, () => {
    const open = card.dataset.open !== 'true'; card.dataset.open = String(open);
    card.setAttribute('aria-expanded', String(open));
    const wrapper=card.querySelector('.faq-answer-wrap'); if(wrapper){wrapper.setAttribute('aria-hidden',String(!open));wrapper.inert=!open;}
  });
});
// Process labels move to the corresponding card, preserving the scroll-based flow.
const headings = document.querySelectorAll('#Process .framer-82jxbt :is(h2,h3)');
headings.forEach((heading,index) => {
  const label = heading.parentElement.parentElement;
  label.setAttribute('role','button'); label.tabIndex=0;
  activation(label, () => {
    const target=document.getElementById(`card-${index+1}`); if(!target)return;
    const parent=target.parentElement, siblings=[...parent.children];
    const gap=parseFloat(getComputedStyle(parent).rowGap)||0;
    const preceding=siblings.slice(0,siblings.indexOf(target)).reduce((sum,card)=>sum+card.offsetHeight+gap,0);
    const stickyTop=parseFloat(getComputedStyle(target).top)||120;
    window.scrollTo({top:window.scrollY+parent.getBoundingClientRect().top+preceding-stickyTop,behavior:matchMedia('(prefers-reduced-motion:reduce)').matches?'auto':'smooth'});
  });
});
// Repeat the captured logo strip to keep the local ticker seamless.
document.querySelectorAll('#Badge ul').forEach(list => {
  Array.from(list.children).forEach(item => { const copy=item.cloneNode(true);copy.setAttribute('aria-hidden','true');list.append(copy); });
});
