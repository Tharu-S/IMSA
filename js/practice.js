/* IMSA Practice Game: 5 topics x 300 questions (30 rounds of 10). Easy R1-10, Medium R11-20, Hard R21-30 */
(()=>{
const rng=s=>()=>(s=(s*1664525+1013904223)>>>0)/4294967296;
const gcd=(a,b)=>b?gcd(b,a%b):Math.abs(a);
const fr=(n,d)=>{const g=gcd(n,d)||1;n/=g;d/=g;if(d<0){n=-n;d=-d}return d===1?`${n}`:`${n}/${d}`};
const sg=n=>n<0?`− ${-n}`:`+ ${n}`;
const Q=(q,a,w,s)=>{a=String(a);w=[...new Set(w.map(String))].filter(x=>x!==a);for(let k=3;w.length<3&&!isNaN(a);k+=2)if(!w.includes(String(+a+k)))w.push(String(+a+k));return{q,a,w:w.slice(0,3),s}};
const I=(r,a,b)=>a+Math.floor(r()*(b-a+1)),N=r=>r()<.5?-1:1,nz=(r,a,b)=>I(r,a,b)*N(r);
const dev=(r,k)=>{const d=[];for(let j=1;j<k;j++)d.push(I(r,-5,5));d.push(-d.reduce((x,y)=>x+y,0));return d};
const pick=(r,a)=>a[Math.floor(r()*a.length)];
const det3=(u,v,w)=>u[0]*(v[1]*w[2]-v[2]*w[1])-u[1]*(v[0]*w[2]-v[2]*w[0])+u[2]*(v[0]*w[1]-v[1]*w[0]);
const T={
algebra:{
easy:[
(r,i)=>{const x=nz(r,2,9),a=i(2,9),b=nz(r,1,9),c=a*x+b;return Q(`Solve for x: ${a}x ${sg(b)} = ${c}`,x,[x+1,x-1,-x,x+a],[`Move ${b}: ${a}x = ${c-b}`,`Divide by ${a}: x = ${x}`])},
(r,i)=>{const a=i(1,4),b=nz(r,1,6),c=nz(r,1,9),t=i(-3,3),v=a*t*t+b*t+c;return Q(`If f(x) = ${a}x² ${sg(b)}x ${sg(c)}, find f(${t}).`,v,[a*t+b*t+c,v+2,v-2*c,-v],[`Substitute x = ${t}`,`${a}(${t*t}) ${sg(b*t)} ${sg(c)} = ${v}`])},
(r,i)=>{const p=nz(r,1,6),q=nz(r,1,6);if(p===q)return T.algebra.easy[2](r,i);return Q(`Find the largest root of (x ${sg(-p)})(x ${sg(-q)}) = 0`,Math.max(p,q),[Math.min(p,q),p+q,p*q],[`Set each factor to zero: x = ${p} or x = ${q}`,`The larger is ${Math.max(p,q)}`])}],
medium:[
(r,i)=>{const x=nz(r,1,9),y=nz(r,1,9);return Q(`If x + y = ${x+y} and x − y = ${x-y}, find x·y.`,x*y,[x+y,x-y,2*x*y,x*y+x],[`Add the equations: 2x = ${2*x}, so x = ${x}`,`Then y = ${y}`,`x·y = ${x*y}`])},
(r,i)=>{const a=i(1,9),d=i(2,6),n=i(8,20),s=n*(2*a+(n-1)*d)/2;return Q(`Sum of the first ${n} terms of an arithmetic series with a = ${a}, d = ${d}?`,s,[n*(a+(n-1)*d),s+d,a+(n-1)*d,n*(2*a+n*d)/2],[`Sₙ = n/2 · (2a + (n−1)d)`,`= ${n}/2 · (${2*a} + ${(n-1)*d}) = ${s}`])},
(r,i)=>{const m=i(2,9),p=m*m;return Q(`Find the positive k for which x² + kx + ${p} = 0 has a repeated root.`,2*m,[m,p,4*m],[`Repeated root: discriminant k² − 4·${p} = 0`,`k² = ${4*p}, so k = ${2*m}`])}],
hard:[
(r,i)=>{const a=i(1,3),x=i(4,9),c=x*(x-a);return Q(`Solve (x > ${a}): log₂x + log₂(x − ${a}) = log₂${c}`,x,[a-x,x-a,c/a,x+a],[`Combine: x(x − ${a}) = ${c}`,`x² − ${a}x − ${c} = 0 → x = ${x} or x = ${a-x}`,`Only x = ${x} gives positive logs`])},
(r,i)=>{const s=i(3,9),p=nz(r,1,10);return Q(`If x + y = ${s} and xy = ${p}, find x² + y².`,s*s-2*p,[s*s+2*p,s*s-p,s*s,s*s-4*p],[`x² + y² = (x+y)² − 2xy`,`= ${s*s} − ${2*p} = ${s*s-2*p}`])},
(r,i)=>{const a=nz(r,1,4),b=nz(r,1,5),c=nz(r,1,6),t=nz(r,1,3),v=t**3+a*t*t+b*t+c;return Q(`Remainder when x³ ${sg(a)}x² ${sg(b)}x ${sg(c)} is divided by (x ${sg(-t)})?`,v,[t**3+a*t*t-b*t+c,c,v+t,-v],[`Remainder theorem: evaluate p(${t})`,`${t**3} ${sg(a*t*t)} ${sg(b*t)} ${sg(c)} = ${v}`])},
(r,i)=>{const a=i(1,5),n=i(5,8),k=pick(r,[2,3]),s=a*(k**n-1)/(k-1);return Q(`Sum of the first ${n} terms of the geometric series ${a}, ${a*k}, ${a*k*k}, …`,s,[a*k**n,s+a,a*(k**n-1),a*k**(n-1)],[`Sₙ = a(rⁿ − 1)/(r − 1), r = ${k}`,`= ${a}(${k**n} − 1)/${k-1} = ${s}`])}]},
calculus:{
easy:[
(r,i)=>{const a=i(2,9),n=i(2,6),t=i(1,4);return Q(`Find f′(${t}) for f(x) = ${a}x^${n}`,a*n*t**(n-1),[a*t**n,a*n*t**n,n*t**(n-1),a*(n-1)*t**(n-1)],[`f′(x) = ${a*n}x^${n-1}`,`f′(${t}) = ${a*n*t**(n-1)}`])},
(r,i)=>{const a=2*i(1,6),k=i(2,9);return Q(`Evaluate ∫₀^${k} ${a}x dx`,a*k*k/2,[a*k*k,a*k,a*k*k/2+a,a*k*k/4],[`Antiderivative: ${a/2}x²`,`${a/2}·${k*k} − 0 = ${a*k*k/2}`])},
(r,i)=>{const k=i(2,19);return Q(`Evaluate lim (x→${k}) (x² − ${k*k})/(x − ${k})`,2*k,[k,k*k,0,k+1],[`Factor: (x−${k})(x+${k})/(x−${k}) = x + ${k}`,`Limit = ${2*k}`])},
(r,i)=>{const a=i(2,19);return Q(`Find d/dx sin(${a}x) at x = 0`,a,[1,-a,0,a*a],[`Chain rule: ${a}cos(${a}x)`,`At x = 0, cos 0 = 1 → ${a}`])}],
medium:[
(r,i)=>{const b=2*i(1,6),c=i(5,20);return Q(`Minimum value of f(x) = x² − ${b}x + ${c}?`,c-b*b/4,[c,c-b,c-b*b/2,c+b*b/4],[`f′(x) = 2x − ${b} = 0 → x = ${b/2}`,`f(${b/2}) = ${c-b*b/4}`])},
(r,i)=>{const a=i(1,5),b=2*i(1,4);return Q(`Evaluate ∫₀³ (${a}x² + ${b}x) dx`,9*a+4.5*b,[9*a+9*b,3*a+3*b,9*a+3*b,27*a+9*b],[`Antiderivative: ${a}x³/3 + ${b/2}x²`,`At 3: ${9*a} + ${4.5*b} = ${9*a+4.5*b}`])},
(r,i)=>{const a=i(2,4),b=i(1,4),n=i(3,5),t=i(1,2),u=a*t+b;return Q(`Find d/dx (${a}x + ${b})^${n} at x = ${t}`,n*a*u**(n-1),[n*u**(n-1),n*a*u**n,a*u**(n-1),n*a*t**(n-1)],[`Chain rule: ${n}·${a}·(${a}x+${b})^${n-1}`,`At x = ${t}: u = ${u} → ${n*a*u**(n-1)}`])},
(r,i)=>{const a=i(2,5);return Q(`x-coordinate of the local minimum of f(x) = x³ − ${3*a*a}x`,a,[-a,0,3*a,a*a],[`f′(x) = 3x² − ${3*a*a} = 0 → x = ±${a}`,`f″(x) = 6x > 0 only at x = ${a}, so minimum`])}],
hard:[
(r,i)=>{const k=i(2,19);return Q(`Area between y = x² and y = ${k}x?`,fr(k**3,6),[fr(k**3,3),fr(k**2,2),fr(k**3,2),fr(k**3,12)],[`Intersect at x = 0 and x = ${k}`,`∫₀^${k} (${k}x − x²)dx = ${k}·${k*k}/2 − ${k**3}/3`,`= ${fr(k**3,6)}`])},
(r,i)=>{const a=i(1,3),b=i(1,5),t=i(1,2);return Q(`Find f‴(${t}) for f(x) = ${a}x⁵ + ${b}x³`,60*a*t*t+6*b,[60*a*t*t,20*a*t*t+6*b,60*a*t*t+b,5*a*t**4+3*b*t*t],[`f′ = ${5*a}x⁴ + ${3*b}x², f″ = ${20*a}x³ + ${6*b}x`,`f‴ = ${60*a}x² + ${6*b}`,`At ${t}: ${60*a*t*t+6*b}`])},
(r,i)=>{const a=i(2,9),b=i(2,9);return Q(`Evaluate lim (x→0) sin(${a}x)/(${b}x)`,fr(a,b),[fr(b,a),a*b,0,1],[`sin(u)/u → 1, so sin(${a}x)/(${b}x) = (${a}/${b})·sin(${a}x)/(${a}x)`,`Limit = ${fr(a,b)}`])},
(r,i)=>{const a=i(2,19);return Q(`Evaluate ∫₀¹ ${a}x·eˣ dx`,a,[`${a}e`,`${a}(e − 1)`,`${a}/e`],[`By parts: ∫x eˣ dx = x eˣ − eˣ`,`From 0 to 1: (e − e) − (0 − 1) = 1`,`Multiply by ${a} → ${a}`])}]},
statistics:{
easy:[
(r,i)=>{const m=i(5,20),d=dev(r,5);return Q(`Mean of ${d.map(x=>m+x).join(', ')}?`,m,[m+1,m-1,m+2,m*2],[`Sum = ${5*m}`,`${5*m} ÷ 5 = ${m}`])},
(r,i)=>{const s=new Set();while(s.size<5)s.add(i(1,30));const a=[...s],o=[...a].sort((x,y)=>x-y);return Q(`Median of ${a.join(', ')}?`,o[2],[o[1],o[3],(a.reduce((x,y)=>x+y)/5).toFixed(1)],[`Order: ${o.join(', ')}`,`Middle value = ${o[2]}`])},
(r,i)=>{const a=i(2,7),b=i(2,7);return Q(`A bag has ${a} red and ${b} blue balls. P(red)?`,fr(a,a+b),[fr(b,a+b),fr(a,b),fr(1,a+b),fr(a+1,a+b)],[`P = favourable / total`,`= ${a}/${a+b} = ${fr(a,a+b)}`])}],
medium:[
(r,i)=>{const m=i(10,40),d=dev(r,4),s=d.reduce((x,y)=>x+y*y,0);return Q(`Population variance of ${d.map(x=>m+x).join(', ')}?`,fr(s,4),[fr(s,3),fr(s,2),fr(s,8),Math.sqrt(s/4).toFixed(2)],[`Mean = ${m}`,`Σ(x − μ)² = ${s}`,`σ² = ${s}/4 = ${fr(s,4)}`])},
(r,i)=>{const n=i(4,6),k=i(1,n-1),c=[1,1].reduce(x=>x),C=(a,b)=>b?C(a-1,b-1)*a/b:1,v=C(n,k);return Q(`Fair coin tossed ${n} times: P(exactly ${k} heads)?`,fr(v,2**n),[fr(v,2**(n-1)),fr(k,n),fr(1,2**n),fr(v+1,2**n)],[`P = C(${n},${k}) / 2^${n}`,`= ${v}/${2**n} = ${fr(v,2**n)}`])},
(r,i)=>{const mu=i(50,80),sd=i(2,10),z=nz(r,1,3),x=mu+z*sd;return Q(`X has mean ${mu}, SD ${sd}. z-score of X = ${x}?`,z,[-z,x-mu,(x-mu)*sd,z+2],[`z = (x − μ)/σ`,`= (${x} − ${mu})/${sd} = ${z}`])}],
hard:[
(r,i)=>{const p=pick(r,[1,2,5]),se=pick(r,[90,95]),fp=pick(r,[5,10]),a=p*se,b=(100-p)*fp,v=(a/(a+b)*100).toFixed(1);return Q(`A disease affects ${p}% of people. The test detects it ${se}% of the time and gives ${fp}% false positives. P(disease | positive)?`,v+'%',[se+'%',(a/100).toFixed(1)+'%',(100-fp)+'%',(a/(a+p*fp)*100).toFixed(1)+'%'],[`Bayes: P = (${p}%·${se}%) / (${p}%·${se}% + ${100-p}%·${fp}%)`,`= ${a} / (${a} + ${b})`,`≈ ${v}%`])},
(r,i)=>{const n=pick(r,[16,25,36,49,64,100]),sd=i(5,20),sq=Math.sqrt(n),v=(1.96*sd/sq).toFixed(2);return Q(`95% CI margin of error: σ = ${sd}, n = ${n}?`,v,[(1.96*sd/n).toFixed(2),(1.645*sd/sq).toFixed(2),(sd/sq).toFixed(2),(1.96*sd).toFixed(2)],[`E = z·σ/√n with z = 1.96`,`= 1.96 · ${sd}/${sq} = ${v}`])},
(r,i)=>{const w1=i(1,4),w2=i(1,4),w3=10-w1-w2;if(w3<1)return T.statistics.hard[2](r,i);const e=w1+2*w2+3*w3;return Q(`P(X=1)=${w1/10}, P(X=2)=${w2/10}, P(X=3)=${w3/10}. Find E[X].`,fr(e,10),['2',fr(e,3),fr(e,100),fr(3*w1+2*w2+w3,10)],[`E[X] = Σ x·P(x)`,`= (${w1} + ${2*w2} + ${3*w3})/10 = ${fr(e,10)}`])},
(r,i)=>{const n=i(10,40),q=i(1,9),v=(n*q*(10-q)/100).toFixed(2);return Q(`Variance of Binomial(n = ${n}, p = ${q/10})?`,v,[(n*q/10).toFixed(2),Math.sqrt(n*q*(10-q)/100).toFixed(2),(n*(10-q)/10).toFixed(2)],[`Var = n·p·(1 − p)`,`= ${n}·${q/10}·${(10-q)/10} = ${v}`])}]},
geometry:{
easy:[
(r,i)=>{const m=i(1,3),x=i(-5,5),y=i(-5,5);return Q(`Distance between (${x}, ${y}) and (${x+3*m}, ${y+4*m})?`,5*m,[7*m,25*m*m,12*m,5*m+1],[`d = √(Δx² + Δy²) = √(${9*m*m} + ${16*m*m})`,`= ${5*m}`])},
(r,i)=>{const a=nz(r,1,5),b=nz(r,1,5),c=nz(r,1,5),d=nz(r,1,5);return Q(`Dot product of (${a}, ${b}) and (${c}, ${d})?`,a*c+b*d,[a*d+b*c,a*c-b*d,a*c,(a+c)*(b+d)],[`u·v = ac + bd`,`= ${a*c} ${sg(b*d)} = ${a*c+b*d}`])},
(r,i)=>{const a=i(-5,5),b=i(-5,5),c=i(-5,5),d=i(-5,5);return Q(`Midpoint of (${2*a}, ${2*b}) and (${2*c}, ${2*d})?`,`(${a+c}, ${b+d})`,[`(${2*a+2*c}, ${2*b+2*d})`,`(${a+c}, ${b-d})`,`(${a-c}, ${b+d})`,`(${a+c+1}, ${b+d})`,`(${a+c}, ${b+d+2})`,`(${a+c+3}, ${b+d})`],[`Average the coordinates`,`((${2*a}+${2*c})/2, (${2*b}+${2*d})/2) = (${a+c}, ${b+d})`])}],
medium:[
(r,i)=>{const a=i(1,6),b=i(1,6),c=i(1,6);let d=i(1,6);if(a*d===b*c)d++;const v=Math.abs(a*d-b*c);return Q(`Area of triangle with vertices (0,0), (${a},${b}), (${c},${d})?`,fr(v,2),[fr(a*d+b*c,2),v,fr(v,4),fr(a*b+c*d,2)],[`Area = ½|x₁y₂ − x₂y₁|`,`= ½|${a}·${d} − ${c}·${b}| = ${fr(v,2)}`])},
(r,i)=>{const b=i(2,4),m=i(1,3),a=b*m,c=i(1,5);return Q(`Find k so that (k, ${a}) ⟂ (${b}, ${c}).`,-m*c,[m*c,-b*c,-m*b,c/m],[`Perpendicular → dot product = 0`,`${b}k + ${a*c} = 0 → k = ${-m*c}`])},
(r,i)=>{const u=[nz(r,1,4),nz(r,1,4),nz(r,1,4)],v=[nz(r,1,4),nz(r,1,4),nz(r,1,4)],x=u[1]*v[2]-u[2]*v[1];return Q(`i-component of u × v for u = (${u}), v = (${v})?`,x,[-x,u[1]*v[2]+u[2]*v[1],u[0]*v[0],x+u[0]],[`i-component = u₂v₃ − u₃v₂`,`= ${u[1]*v[2]} − ${u[2]*v[1]} = ${x}`])}],
hard:[
(r,i)=>{let u,v,w,d;do{u=[0,0,0].map(()=>i(-3,3));v=[0,0,0].map(()=>i(-3,3));w=[0,0,0].map(()=>i(-3,3));d=det3(u,v,w)}while(!d);const a=Math.abs(d);return Q(`Volume of the parallelepiped spanned by (${u}), (${v}), (${w})?`,a,[a+2,2*a,Math.abs(u[0]*v[1]*w[2]+u[1]*v[2]*w[0]+u[2]*v[0]*w[1]),a+1],[`Volume = |u · (v × w)| = |det|`,`Determinant = ${d}`,`Volume = ${a}`])},
(r,i)=>{let x,y,c,a;do{x=i(-5,5);y=i(-5,5);c=i(-10,10);a=Math.abs(3*x+4*y+c)}while(!a);return Q(`Distance from (${x}, ${y}) to the line 3x + 4y ${sg(c)} = 0?`,fr(a,5),[fr(a,25),a,fr(Math.abs(3*x+4*y),5),fr(a,7)],[`d = |ax₀ + by₀ + c| / √(a² + b²)`,`= |${3*x+4*y+c}| / 5 = ${fr(a,5)}`])},
(r,i)=>{const a=i(-6,6),b=i(1,6),v=3*a+4*b;return Q(`Scalar projection of (${a}, ${b}) onto (3, 4)?`,fr(v,5),[v,fr(v,25),fr(4*a+3*b,5),fr(3*a-4*b,5)],[`proj = u·v / |v|`,`= ${v} / 5 = ${fr(v,5)}`])}]},
arithmetic:{
easy:[
(r,i)=>{const a=i(100,999),m=i(5,13),v=a%m;return Q(`${a} mod ${m} = ?`,v,[v+1,m-v,Math.floor(a/m),(v+2)%m],[`${a} = ${m}·${Math.floor(a/m)} + ${v}`,`Remainder = ${v}`])},
(r,i)=>{let p,q;do{p=i(2,9);q=i(2,9)}while(gcd(p,q)!==1);const g=i(2,9);return Q(`gcd(${g*p}, ${g*q}) = ?`,g,[g*p*q,g*p,g*q,p*q],[`${g*p} = ${g}·${p}, ${g*q} = ${g}·${q}`,`${p} and ${q} are coprime → gcd = ${g}`])},
(r,i)=>{const P=[3,5,7,11,13,17],p=pick(r,P),q=pick(r,P);return Q(`Smallest prime factor of ${p*q}?`,Math.min(p,q),[Math.max(p,q),p+q,1,p*q],[`${p*q} = ${p} × ${q}`,`Smallest prime factor = ${Math.min(p,q)}`])}],
medium:[
(r,i)=>{const a=i(4,20),b=i(4,20),g=gcd(a,b),l=a*b/g;return Q(`lcm(${a}, ${b}) = ?`,l,[a*b,g,l*2,l+g],[`gcd = ${g}`,`lcm = ab/gcd = ${a*b}/${g} = ${l}`])},
(r,i)=>{const a=i(1,5),b=i(1,4);return Q(`How many positive divisors does 2^${a} · 3^${b} have?`,(a+1)*(b+1),[a*b,a+b,(a+1)*b,a*(b+1)],[`τ(n) = (a+1)(b+1)`,`= ${a+1} · ${b+1} = ${(a+1)*(b+1)}`])},
(r,i)=>{const a=i(2,9),k=i(5,12),m=i(7,13);let v=1;for(let j=0;j<k;j++)v=v*a%m;return Q(`${a}^${k} mod ${m} = ?`,v,[(a*k)%m,(a+k)%m,(v+1)%m,(v+2)%m],[`Multiply repeatedly, reducing mod ${m} each time`,`${a}^${k} ≡ ${v} (mod ${m})`])}],
hard:[
(r,i)=>{const p=pick(r,[11,13,17,19,23]),a=i(2,p-2);let v=1;while(a*v%p!==1)v++;return Q(`Inverse of ${a} modulo ${p}?`,v,[p-a,a,v%p+1,(v+2)%p],[`Find x with ${a}x ≡ 1 (mod ${p})`,`${a}·${v} = ${a*v} = ${(a*v-1)/p}·${p} + 1`,`Inverse = ${v}`])},
(r,i)=>{const P=[3,5,7,11,13],p=pick(r,P),q=pick(r,P);if(p===q)return T.arithmetic.hard[1](r,i);return Q(`Euler's totient φ(${p*q}) = ?`,(p-1)*(q-1),[p*q-1,p+q-2,p*q-p-q,(p+1)*(q+1)],[`φ(pq) = (p−1)(q−1)`,`= ${p-1} · ${q-1} = ${(p-1)*(q-1)}`])},
(r,i)=>{const [m,n]=pick(r,[[3,5],[5,7],[4,7]]),M=m*n,x=i(1,M-1);return Q(`Smallest x ≥ 0 with x ≡ ${x%m} (mod ${m}) and x ≡ ${x%n} (mod ${n})?`,x,[(x+m)%M,(x+n)%M,x%m+x%n,(x+1)%M],[`Chinese Remainder Theorem: unique solution mod ${M}`,`Check: ${x} mod ${m} = ${x%m}, ${x} mod ${n} = ${x%n}`,`x = ${x}`])}]}
};
const rg=(a,b)=>Array.from({length:b-a+1},(_,k)=>a+k),LV={easy:rg(1,10),medium:rg(11,20),hard:rg(21,30)},lvOf=n=>n<11?'easy':n<21?'medium':'hard';
const hash=(t,n,k)=>[...t].reduce((h,c)=>(h*31+c.charCodeAt(0))|0,n*7919+k*104729);
const mkRound=(t,n)=>{const l=lvOf(n),tp=T[t][l],seen=new Set();let out;for(let m=LV[l][0];m<=n;m++){out=[];for(let k=0,x=0;out.length<10&&k<3000;k++){const r=rng(hash(t,m,k)),q=tp[(out.length+m+k)%tp.length](r,(a,b)=>I(r,a,b));if(!seen.has(q.q)||k>=2500){seen.add(q.q);out.push(q)}}}return out};
globalThis.MS_mkRound=mkRound;
globalThis.MS_T=T;
if(typeof document==="undefined")return;
/* ---------- UI ---------- */
const TOP={algebra:'🔢 Algebra',geometry:'📐 Geometry',calculus:'∫ Calculus',statistics:'📊 Statistics',arithmetic:'➕ Arithmetic'},ICO={easy:'🟢',medium:'🟡',hard:'🔴'};
let P={};try{P=JSON.parse(localStorage.ms_prac2||'{}')}catch(e){}
const best=(t,n)=>P[t+n]??-1,stars=s=>s>=9?3:s>=7?2:s>=5?1:0,star=s=>'★'.repeat(stars(s))+'☆'.repeat(3-stars(s));
const shuf=a=>a.map(x=>[Math.random(),x]).sort((x,y)=>x[0]-y[0]).map(x=>x[1]);
const css=document.createElement('style');css.textContent=`#game{max-width:860px;margin:0 auto;padding:0 12px}
.g-bar{display:flex;justify-content:space-between;align-items:center;gap:10px;margin:0 0 14px;flex-wrap:wrap}
.g-tabs{display:flex;gap:8px;flex-wrap:wrap;justify-content:center;margin-bottom:10px}
.g-tabs button,.g-btns button,.g-n,.g-x{border:2px solid #00a2ff;background:transparent;color:inherit;border-radius:30px;padding:8px 18px;font-weight:700;cursor:pointer}
.g-tabs .on,.g-btns button:first-child,.g-n{background:#00a2ff;color:#fff}
.g-l{margin:18px 0 8px}.g-l small{opacity:.6;font-weight:400}
.g-tiles{display:flex;gap:10px;flex-wrap:wrap}
.g-t{width:120px;padding:12px;border-radius:14px;border:2px solid rgba(0,162,255,.45);background:rgba(0,162,255,.08);color:inherit;cursor:pointer;text-align:center;transition:.2s}
.g-t:hover{transform:translateY(-3px);border-color:#00a2ff}.g-t b{display:block;font-size:1.1rem}.g-t.done{border-color:#4caf50;background:rgba(76,175,80,.12)}.g-t span{font-size:.85rem}
.g-prog{height:8px;border-radius:8px;background:rgba(127,127,127,.25);overflow:hidden;margin-bottom:16px}.g-prog i{display:block;height:100%;background:#00a2ff;transition:.3s}
.g-q h3{margin:6px 0 14px}.g-o{display:block;width:100%;text-align:left;margin:8px 0;padding:12px 16px;border-radius:12px;border:2px solid rgba(127,127,127,.4);background:rgba(127,127,127,.08);color:inherit;font-size:1rem;cursor:pointer}
.g-o:not(:disabled):hover{border-color:#00a2ff}.g-o.ok{border-color:#4caf50;background:rgba(76,175,80,.25)}.g-o.no{border-color:#e53935;background:rgba(229,57,53,.25)}
.g-fb{margin-top:12px;padding:12px 16px;border-radius:12px;border-left:5px solid}.g-fb.ok{border-color:#4caf50;background:rgba(76,175,80,.12)}.g-fb.no{border-color:#e53935;background:rgba(229,57,53,.12)}
.g-res{text-align:center}.g-res h2{font-size:2.4rem;color:#ffc107}.g-sc{font-size:3rem;font-weight:800}.g-btns{display:flex;gap:10px;flex-wrap:wrap;justify-content:center;margin:14px 0}
.g-rv{text-align:left;margin:10px 0;padding:12px 16px;border-radius:12px;background:rgba(127,127,127,.1)}`;document.head.appendChild(css);
let S={t:'algebra'},el,TM;
const tick=()=>{const g=document.getElementById('gt'),l=Math.max(0,Math.ceil((S.end-Date.now())/1000));if(g){g.textContent='⏱ '+Math.floor(l/60)+':'+String(l%60).padStart(2,'0');g.style.color=l<60?'#e53935':''}if(!l){clearInterval(TM);for(let j=S.done?S.i+1:S.i;j<10;j++)S.bad.push(S.qs[j]);S.to=1;result()}};
const map=()=>{clearInterval(TM);const t=S.t;el.innerHTML=`<div class="g-bar"><b>⭐ ${Object.values(P).reduce((a,b)=>a+Math.max(b,0)*10,0)} XP</b><span>${Object.values(P).filter(v=>v>=0).length} / 150 rounds completed</span></div><div class="g-tabs">${Object.keys(TOP).map(k=>`<button class="${k==t?'on':''}" onclick="G.topic('${k}')">${TOP[k]}</button>`).join('')}</div><p style="text-align:center;opacity:.8">300 questions · 10 rounds per level · ⏱ 10 minutes per round. Pick any round, finish it, then choose what to play next.</p>`+Object.keys(LV).map(l=>`<h4 class="g-l">${ICO[l]} ${l[0].toUpperCase()+l.slice(1)} <small>${LV[l].length*10} questions</small></h4><div class="g-tiles">${LV[l].map(n=>{const b=best(t,n);return`<button class="g-t ${b>=0?'done':''}" onclick="G.start(${n})"><b>Round ${n-(LV[l][0]-1)}</b><span>${b<0?'New':star(b)+' '+b+'/10'}</span></button>`}).join('')}</div>`).join('')};
const quiz=()=>{const q=S.qs[S.i];S.done=0;el.innerHTML=`<div class="g-bar"><button class="g-x" onclick="G.map()">✕</button><b>${TOP[S.t]} · ${ICO[lvOf(S.n)]} Round ${S.n-(LV[lvOf(S.n)][0]-1)}</b><span><b id="gt"></b> · 🔥 ${S.st} · ⭐ ${S.pts}</span></div><div class="g-prog"><i style="width:${S.i*10}%"></i></div><div class="g-q"><small>Question ${S.i+1} / 10</small><h3>${q.q}</h3>${q.o.map((o,k)=>`<button class="g-o" onclick="G.pick(${k})">${o}</button>`).join('')}<div id="gx"></div></div>`;tick()};
const result=()=>{clearInterval(TM);const{t,n,sc}=S,l=lvOf(n),s=stars(sc),nx=LV[l].includes(n+1)?n+1:0,jump=L=>LV[L].find(x=>best(t,x)<0)||LV[L][0];if(sc>best(t,n)){P[t+n]=sc;try{localStorage.ms_prac2=JSON.stringify(P)}catch(e){}}
el.innerHTML=`<div class="g-res"><h2>${star(sc)}</h2><div class="g-sc">${sc} / 10</div><p>${S.to?"⏰ Time's up! ":''}${sc==10?'Perfect round! 🎉':sc>=7?'Great work!':sc>=5?'Good start. Review the steps below.':'Keep going. Study the steps and try again.'} · ⭐ ${S.pts} pts</p><div class="g-btns">${nx?`<button onclick="G.start(${nx})">➡ Next 10 ${l} (Round ${nx-(LV[l][0]-1)})</button>`:''}${Object.keys(LV).filter(L=>L!=l).map(L=>`<button onclick="G.start(${jump(L)})">${ICO[L]} Try ${L}</button>`).join('')}<button onclick="G.start(${n})">🔄 Retry</button><button onclick="G.map()">🗺 Map</button></div>${S.bad.length?'<h4>Review your mistakes</h4>'+S.bad.map(q=>`<div class="g-rv"><b>${q.q}</b><br>✔ ${q.a}<ol>${q.s.map(x=>`<li>${x}</li>`).join('')}</ol></div>`).join(''):''}</div>`;scrollTo(0,0)};
window.G={map,topic:t=>{S.t=t;map()},
start:n=>{clearInterval(TM);S={...S,n,end:Date.now()+600000,to:0,qs:mkRound(S.t,n).map(q=>({...q,o:shuf([q.a,...q.w])})),i:0,sc:0,st:0,pts:0,bad:[]};quiz();TM=setInterval(tick,500);scrollTo(0,0)},
pick:k=>{if(S.done)return;S.done=1;const q=S.qs[S.i],ok=q.o[k]===q.a;document.querySelectorAll('.g-o').forEach((b,j)=>{b.disabled=true;if(q.o[j]===q.a)b.classList.add('ok');else if(j===k)b.classList.add('no')});
if(ok){S.sc++;S.st++;S.pts+=10+2*Math.min(S.st-1,5)}else{S.st=0;S.bad.push(q)}
document.getElementById('gx').innerHTML=`<div class="g-fb ${ok?'ok':'no'}">${ok?'✔ Correct!'+(S.st>2?` 🔥 ${S.st} in a row`:''):'✘ Not quite. Answer: <b>'+q.a+'</b>'}<ol>${q.s.map(s=>`<li>${s}</li>`).join('')}</ol><button class="g-n" onclick="G.next()">${S.i<9?'Next ➜':'See result 🏁'}</button></div>`},
next:()=>{S.i++;S.i<10?quiz():result()}};
el=document.getElementById('game');map();
})();
