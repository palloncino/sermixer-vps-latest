"use strict";(self.webpackChunkquotation_app_02=self.webpackChunkquotation_app_02||[]).push([[516],{4341:(e,t,i)=>{i.d(t,{A:()=>p});i(5043);var r=i(5795),s=i(3193),n=i(8356),a=i(9285),l=i(1449),c=i(6446),o=i(5865),d=i(9720),h=i(4117),x=i(579);const p=e=>{let{filters:t,filtersConfig:i,onFilterChange:p}=e;const{t:A}=(0,h.Bd)(),u=(e,t)=>{p(e,t)},m=e=>{var i;switch(e.type){case"text":return(0,x.jsx)(r.A,{fullWidth:!0,label:A(e.label),value:t[e.id]||"",onChange:t=>u(e.id,t.target.value)});case"select":return(0,x.jsxs)(s.A,{fullWidth:!0,children:[(0,x.jsx)(n.A,{children:A(e.label)}),(0,x.jsx)(a.A,{value:t[e.id]||"",onChange:t=>u(e.id,t.target.value),children:null===(i=e.options)||void 0===i?void 0:i.map((e=>(0,x.jsx)(l.A,{value:e.value,children:A(e.label)},e.value)))})]});case"range":return(0,x.jsxs)(c.A,{children:[(0,x.jsx)(o.A,{gutterBottom:!0,children:A(e.label)}),(0,x.jsx)(d.Ay,{value:t[e.id]||e.defaultValue,onChange:(t,i)=>u(e.id,i),valueLabelDisplay:"auto",min:e.min,max:e.max,step:e.step},e.id)]});default:return null}};return(0,x.jsx)(c.A,{sx:{display:"grid",gridTemplateColumns:`repeat(${i.length}, 1fr)`,gap:2,mb:2},children:i.map((e=>(0,x.jsx)(c.A,{children:m(e)},e.id)))})}},8751:(e,t,i)=>{i.d(t,{A:()=>l});var r=i(6446),s=i(4194),n=i(8911),a=i(579);const l=function(e){let{message:t,type:i}=e;return(0,a.jsx)(a.Fragment,{children:(0,a.jsx)(r.A,{py:2,children:(0,a.jsx)(n.A,{sx:{width:"100%"},spacing:2,children:(0,a.jsx)(s.A,{severity:i,children:t})})})})}},2673:(e,t,i)=>{i.d(t,{A:()=>s});i(5043);var r=i(579);const s=e=>{let{text:t,search:i}=e;if(!t)return null;if(!i)return(0,r.jsx)(r.Fragment,{children:t});const s=t.split(new RegExp(`(${i})`,"gi"));return(0,r.jsx)("span",{children:s.map(((e,t)=>e.toLowerCase()===i.toLowerCase()?(0,r.jsx)("mark",{children:e},t):e))})}},1786:(e,t,i)=>{i.d(t,{A:()=>x});var r=i(4535),s=i(5865),n=(i(5043),i(927)),a=i(690),l=i(579);const c=(0,r.Ay)(s.A)`
  width: 100%;
`,o=n.Ay.div`
  margin: ${e=>{let{margin:t}=e;return t||"4rem 0 0rem 0"}};
  padding: 24px 0 24px 0;
`,d=n.Ay.div`
  width: 100%;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  justify-items: flex-start;
  padding: 0 1rem;
`,h=(0,r.Ay)(s.A)`
  line-height: 2rem;
  transition: opacity 0.5s ease-in-out; /* Smooth transition effect */
  opacity: 1;

  &:not(:hover) {
    opacity: 0.7;
  }
`,x=e=>{let{title:t,description:i="",margin:r}=e;return(0,l.jsx)(o,{margin:r,children:(0,l.jsxs)(d,{children:[(0,l.jsx)(c,{variant:"h4",align:"left",children:t}),i?(0,l.jsx)(h,{variant:"body1",paragraph:!0,align:"left",children:i}):null]})})};(0,r.Ay)(s.A)`
  width: 100%;
`,(0,n.Ay)("div")`
  background: #F5F5F5;
  border-radius: .4rem;
  color: ${a.Ab.Black3};
  align-text: center;
  margin: ${e=>{let{margin:t}=e;return t||"4rem 0 0rem 0"}};
  padding: 24px 0 24px 0;
`,n.Ay.div`
width: 100%;
margin: 0 auto;
  display: flex;
  flex-direction: column;
  justify-items: flex-start;
  padding: 0 1rem;
`,(0,r.Ay)(s.A)`
  line-height: 2rem;
  margin: 0;
  transition: opacity 0.5s ease-in-out; /* Smooth transition effect */
  opacity: 1;

  &:not(:hover) {
    opacity: 0.7;
  }
`},3516:(e,t,i)=>{i.r(t),i.d(t,{default:()=>ae});var r=i(529),s=i(9345),n=i(9252),a=i(6446),l=i(8903),c=i(2083),o=i(4511),d=i(1906),h=i(5043),x=i(4117),p=i(5475),A=i(4588),u=i(4341),m=i(8751),g=i(7206),j=i(1786),y=i(3691),w=i(2110),f=i(5865),v=i(7600),b=i(1806),C=i(3460),P=i(8076),k=i(2420),S=i(6591),D=i(6494),F=i(9336),R=i(4535),L=i(3216),z=i(7996),$=i(5693),B=i(579);const U=(0,R.Ay)(w.A)`
  max-width: 400px;
  margin: auto;
  display: flex;
  flex-direction: column;
  transition: box-shadow 0.3s;
  height: 500px;
  overflow: hidden;
  position: relative;
  &:hover {
    box-shadow: 0 0 11px rgba(33, 33, 33, 0.2);
  }
`,N=(0,R.Ay)(d.A)`
  margin-right: 8px;
`,W=(0,R.Ay)(f.A)`
  display: -webkit-box;
  -webkit-line-clamp: 3; /* Limit to 3 lines */
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
`,M=(0,R.Ay)(a.A)`
  margin-top: 16px;
  padding: 16px;
  background-color: #f9f9f9;
  border-radius: 8px;
`,T=(0,R.Ay)(v.A)`
  position: absolute;
  bottom: 0;
  width: 100%;
  background: white;
  display: flex;
  justify-content: space-between;
`,q=(0,R.Ay)(a.A)`
  margin-top: 16px;
`,E=e=>{let{product:t,handleDeleteProducts:i}=e;const{t:r}=(0,x.Bd)(),s=(0,L.Zp)(),n=Array.isArray(t.components)?t.components:[];return(0,B.jsxs)(U,{children:[(0,B.jsx)(S.A,{component:"img",height:"200",image:"string"===typeof t.imgUrl?t.imgUrl:z,alt:t.name}),(0,B.jsxs)(D.A,{sx:{flexGrow:1,overflow:"hidden"},children:[(0,B.jsx)(f.A,{gutterBottom:!0,variant:"h5",component:"div",children:t.name}),(0,B.jsx)(W,{variant:"body2",color:"text.secondary",children:t.description}),(0,B.jsxs)(f.A,{variant:"body2",color:"text.secondary",sx:{mt:1},children:["Category: ",t.category]}),(0,B.jsx)(f.A,{variant:"h6",color:"primary",sx:{mt:1},children:(0,B.jsxs)("strong",{children:[r("EUR")," ",(0,$.$)(t.price)]})}),(0,B.jsx)(F.A,{sx:{my:2}}),(e=>e&&0!==e.length?(0,B.jsxs)(q,{children:[(0,B.jsx)(f.A,{variant:"h6",sx:{fontWeight:"bold",mb:1},children:r("Components")}),e.map(((e,t)=>(0,B.jsxs)(M,{children:[(0,B.jsx)(f.A,{variant:"subtitle1",sx:{fontWeight:"bold"},children:e.name}),(0,B.jsx)(b.A,{size:"small",children:(0,B.jsxs)(C.A,{children:[(0,B.jsxs)(P.A,{children:[(0,B.jsx)(k.A,{component:"th",scope:"row",children:"Description"}),(0,B.jsx)(k.A,{children:e.description})]}),(0,B.jsxs)(P.A,{children:[(0,B.jsx)(k.A,{component:"th",scope:"row",children:"Price"}),(0,B.jsxs)(k.A,{children:["\u20ac",e.price]})]})]})})]},t)))]}):(0,B.jsx)(f.A,{variant:"body2",children:r("NoComponentsAvailable")}))(n),(0,B.jsx)(F.A,{sx:{my:2}})]}),(0,B.jsxs)(T,{children:[(0,B.jsx)(N,{size:"small",color:"primary",onClick:()=>s(`/product/${t.id}`),children:r("ViewMore")}),(0,B.jsx)(N,{size:"small",color:"secondary",onClick:()=>i(t.id),children:r("Delete")})]})]})},_=e=>{let{products:t,handleDeleteProducts:i}=e;const[r,s]=(0,h.useState)(1),n=t.slice(6*(r-1),6*r);return(0,B.jsxs)(a.A,{children:[(0,B.jsx)(l.Ay,{container:!0,spacing:2,children:n.map((e=>(0,B.jsx)(l.Ay,{item:!0,xs:12,sm:6,md:3,children:(0,B.jsx)(E,{product:e,handleDeleteProducts:i})},e.id)))}),(0,B.jsx)(a.A,{sx:{display:"flex",justifyContent:"center",mt:4},children:(0,B.jsx)(y.A,{count:Math.ceil(t.length/6),page:r,onChange:(e,t)=>{s(t)},color:"primary"})})]})};var I=i(3471),O=i(3159),V=i(7260),Z=i(3336),G=i(9650),H=i(4882),J=i(8093),K=i(2167),Q=i(7392),X=i(1159),Y=i(690),ee=i(1748),te=i(3140),ie=i(8434),re=i(2673);const se=e=>{let{products:t,handleDeleteProducts:i,search:r,priceRange:s}=e;const{t:n}=(0,x.Bd)(),{user:l}=(0,ee.A)(),[c,o]=(0,h.useState)("asc"),[d,p]=(0,h.useState)("name"),A=(0,L.Zp)(),[u,m]=(0,h.useState)(0),[g,j]=(0,h.useState)(10),y=e=>{o(d===e&&"asc"===c?"desc":"asc"),p(e)},w=t.filter((e=>{const t=parseFloat(e.price);return!s||(1e5===s[1]||t>=s[0]&&t<=s[1])})),v=[...w].sort(((e,t)=>"price"===d?"asc"===c?parseFloat(e.price)-parseFloat(t.price):parseFloat(t.price)-parseFloat(e.price):"updatedAt"===d?"asc"===c?new Date(e.updatedAt).getTime()-new Date(t.updatedAt).getTime():new Date(t.updatedAt).getTime()-new Date(e.updatedAt).getTime():"asc"===c?e[d].localeCompare(t[d]):t[d].localeCompare(e[d]))),S=e=>{A((0,Y.bw)(e).productPage)},D=(e,t)=>e.length>t?`${e.substring(0,t)}...`:e;return(0,B.jsxs)(Z.A,{elevation:0,sx:{backgroundColor:"white",borderRadius:1,boxShadow:"0px 1px 3px rgba(0, 0, 0, 0.12)"},children:[(0,B.jsx)(G.A,{children:(0,B.jsxs)(b.A,{size:"small","aria-label":"product table",children:[(0,B.jsx)(H.A,{children:(0,B.jsxs)(P.A,{children:[(0,B.jsx)(k.A,{width:"5%",children:n("ID")}),(0,B.jsx)(k.A,{width:"10%",align:"center",children:n("Image")}),(0,B.jsx)(k.A,{width:"35%",children:(0,B.jsx)(J.A,{active:"name"===d,direction:"name"===d?c:"asc",onClick:()=>y("name"),children:n("Name")})}),(0,B.jsx)(k.A,{width:"10%",align:"right",children:n("Category")}),(0,B.jsx)(k.A,{width:"10%",align:"right",children:(0,B.jsx)(J.A,{active:"price"===d,direction:"price"===d?c:"asc",onClick:()=>y("price"),children:n("Price")})}),(0,B.jsx)(k.A,{width:"15%",align:"right",children:(0,B.jsx)(J.A,{active:"updatedAt"===d,direction:"updatedAt"===d?c:"asc",onClick:()=>y("updatedAt"),children:n("LastUpdate")})}),(0,B.jsx)(k.A,{width:"15%",align:"center",children:n("Actions")})]})}),(0,B.jsx)(C.A,{children:v.slice(u*g,u*g+g).map((e=>(0,B.jsxs)(P.A,{sx:{"&:hover":{backgroundColor:"rgba(0, 0, 0, 0.04)"}},children:[(0,B.jsx)(k.A,{children:e.id}),(0,B.jsx)(k.A,{align:"center",children:e.imgUrl?(0,B.jsx)(K.A,{title:(0,B.jsx)("img",{src:e.imgUrl,alt:e.name,style:{width:"200px",height:"auto",objectFit:"contain",borderRadius:"4px"}}),placement:"top",componentsProps:{tooltip:{sx:{maxWidth:"none"}}},children:(0,B.jsx)("img",{src:e.imgUrl,alt:e.name,style:{width:"40px",height:"40px",objectFit:"cover",cursor:"pointer",borderRadius:"4px"}})}):"N/A"}),(0,B.jsx)(k.A,{children:(0,B.jsx)(K.A,{title:e.name,children:(0,B.jsx)(f.A,{component:"span",sx:{cursor:"pointer","&:hover":{textDecoration:"underline"},whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis",display:"block"},onClick:()=>S(e.id),children:(0,B.jsx)(re.A,{text:D(e.name,50),search:r})})})}),(0,B.jsx)(k.A,{align:"right",children:(0,B.jsx)(K.A,{title:e.category,children:(0,B.jsx)(f.A,{sx:{whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis"},children:(0,B.jsx)(re.A,{text:D(e.category,15),search:r})})})}),(0,B.jsxs)(k.A,{align:"right",children:[n("EUR")," ",(0,$.$)(e.price)]}),(0,B.jsx)(k.A,{align:"right",children:(0,B.jsx)(K.A,{title:e.updatedAt?new Date(e.updatedAt).toLocaleString():"",children:(0,B.jsx)(f.A,{sx:{whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis"},children:e.updatedAt?(0,te.M)(e.updatedAt):""})})}),(0,B.jsx)(k.A,{align:"center",children:(0,B.jsxs)(a.A,{display:"flex",justifyContent:"center",children:[(0,B.jsx)(K.A,{title:n("View"),children:(0,B.jsx)(Q.A,{size:"small",onClick:()=>S(e.id),children:(0,B.jsx)(V.A,{fontSize:"small"})})}),(0,B.jsx)(K.A,{title:n("Edit"),children:(0,B.jsx)("span",{children:(0,B.jsx)(Q.A,{size:"small",disabled:!(0,ie.q)(l),onClick:t=>{return i=e.id,t.stopPropagation(),void A((0,Y.bw)(i).editProduct);var i},children:(0,B.jsx)(O.A,{fontSize:"small"})})})}),(0,B.jsx)(K.A,{title:n("Delete"),children:(0,B.jsx)("span",{children:(0,B.jsx)(Q.A,{size:"small",disabled:!(0,ie.q)(l),onClick:t=>{return r=e.id,t.stopPropagation(),void i(r);var r},children:(0,B.jsx)(I.A,{fontSize:"small"})})})})]})})]},e.id)))})]})}),(0,B.jsx)(X.A,{rowsPerPageOptions:[5,10,25],component:"div",count:w.length,rowsPerPage:g,page:u,onPageChange:(e,t)=>{m(t)},onRowsPerPageChange:e=>{j(parseInt(e.target.value,10)),m(0)}})]})};var ne=i(3505);const ae=function(){const{t:e}=(0,x.Bd)(),{showMessage:t}=(0,A.J)(),{user:i,products:y,deleteProducts:w,getProducts:f,loadingProducts:v}=(0,ee.A)(),[b,C]=(0,h.useState)({search:"",category:"all",priceRange:[0,1e6],company:"all"}),[P,k]=(0,h.useState)(""),[S,D]=(0,h.useState)("list");(0,h.useEffect)((()=>{f()}),[f]);const F=async i=>{try{if(window.confirm(e("ConfirmDeletionProductAlertMessage"))){const e=await w([i]),{message:r}=e;k(r),t(r,"success"),f()}}catch(r){console.error(r)}},R=(0,h.useMemo)((()=>y.filter((e=>{const t=Number(e.price),i=!b.search||e.name.toLowerCase().includes(b.search.toLowerCase())||e.description.toLowerCase().includes(b.search.toLowerCase()),r="all"===b.category||e.category===b.category,s=t>=b.priceRange[0]&&t<=b.priceRange[1],n="all"===b.company||e.company===b.company;return i&&r&&s&&n}))),[y,b]);return(0,B.jsx)(ne.Rl,{children:(0,B.jsxs)(n.A,{maxWidth:"lg",sx:{mt:4,mb:4},children:[P&&(0,B.jsx)(a.A,{sx:{pt:2,mb:2},children:(0,B.jsx)(m.A,{message:P,type:"success"})}),(0,B.jsxs)(l.Ay,{container:!0,spacing:2,alignItems:"center",justifyContent:"space-between",sx:{mb:0},children:[(0,B.jsx)(l.Ay,{item:!0,children:(0,B.jsxs)(c.A,{value:S,exclusive:!0,onChange:(e,t)=>{null!==t&&D(t)},"aria-label":"View mode",children:[(0,B.jsx)(o.A,{value:"list","aria-label":"list",children:(0,B.jsx)(r.A,{})}),(0,B.jsx)(o.A,{value:"grid","aria-label":"grid",children:(0,B.jsx)(s.A,{})})]})}),(0,B.jsx)(j.A,{title:e("ProductListPageHeadTitle"),margin:"0"}),(0,B.jsx)(l.Ay,{item:!0,children:(0,B.jsx)(d.A,{disabled:!(0,ie.q)(i),variant:"contained",color:"primary",component:p.N_,to:(0,Y.bw)().createProduct,sx:{mr:2},children:e("CreateNewProduct")})})]}),(0,B.jsxs)(l.Ay,{container:!0,spacing:3,sx:{mt:2},children:[(0,B.jsx)(l.Ay,{item:!0,xs:12,children:(0,B.jsx)(u.A,{filters:b,filtersConfig:(0,Y.WC)(),caseSensitive:!1,onFilterChange:(e,t)=>{C((i=>({...i,[e]:t})))}})}),(0,B.jsx)(l.Ay,{item:!0,xs:12,children:v?(0,B.jsx)(g.A,{}):"list"===S?(0,B.jsx)(se,{search:b.search,products:R,handleDeleteProducts:F}):(0,B.jsx)(_,{products:R,handleDeleteProducts:F})})]})]})})}},5693:(e,t,i)=>{i.d(t,{$:()=>r});const r=e=>Number(e).toFixed(2).replace(".",",").replace(/\B(?=(\d{3})+(?!\d))/g,".")},7996:(e,t,i)=>{e.exports=i.p+"static/media/fallbackProduct.d869ab9fc469a3d71e51.png"}}]);
//# sourceMappingURL=516.f40fc654.chunk.js.map