"use strict";(self.webpackChunkquotation_app_02=self.webpackChunkquotation_app_02||[]).push([[489],{8751:(e,t,n)=>{n.d(t,{A:()=>o});var s=n(6446),a=n(4194),i=n(8911),r=n(579);const o=function(e){let{message:t,type:n}=e;return(0,r.jsx)(r.Fragment,{children:(0,r.jsx)(s.A,{py:2,children:(0,r.jsx)(i.A,{sx:{width:"100%"},spacing:2,children:(0,r.jsx)(a.A,{severity:n,children:t})})})})}},1786:(e,t,n)=>{n.d(t,{A:()=>u});var s=n(4535),a=n(5865),i=(n(5043),n(927)),r=n(690),o=n(579);const l=(0,s.Ay)(a.A)`
  width: 100%;
`,c=i.Ay.div`
  margin: ${e=>{let{margin:t}=e;return t||"4rem 0 0rem 0"}};
  padding: 24px 0 24px 0;
`,d=i.Ay.div`
  width: 100%;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  justify-items: flex-start;
  padding: 0 1rem;
`,m=(0,s.Ay)(a.A)`
  line-height: 2rem;
  transition: opacity 0.5s ease-in-out; /* Smooth transition effect */
  opacity: 1;

  &:not(:hover) {
    opacity: 0.7;
  }
`,u=e=>{let{title:t,description:n="",margin:s}=e;return(0,o.jsx)(c,{margin:s,children:(0,o.jsxs)(d,{children:[(0,o.jsx)(l,{variant:"h4",align:"left",children:t}),n?(0,o.jsx)(m,{variant:"body1",paragraph:!0,align:"left",children:n}):null]})})};(0,s.Ay)(a.A)`
  width: 100%;
`,(0,i.Ay)("div")`
  background: #F5F5F5;
  border-radius: .4rem;
  color: ${r.Ab.Black3};
  align-text: center;
  margin: ${e=>{let{margin:t}=e;return t||"4rem 0 0rem 0"}};
  padding: 24px 0 24px 0;
`,i.Ay.div`
width: 100%;
margin: 0 auto;
  display: flex;
  flex-direction: column;
  justify-items: flex-start;
  padding: 0 1rem;
`,(0,s.Ay)(a.A)`
  line-height: 2rem;
  margin: 0;
  transition: opacity 0.5s ease-in-out; /* Smooth transition effect */
  opacity: 1;

  &:not(:hover) {
    opacity: 0.7;
  }
`},489:(e,t,n)=>{n.r(t),n.d(t,{default:()=>k});var s=n(6446),a=n(1906),i=n(9252),r=n(5865),o=n(5043),l=n(4117),c=n(3216),d=n(5475),m=n(2110),u=n(6494),h=n(8903),A=n(5795),p=n(927),x=n(579);const f=e=>{let{client:t,onSave:n,onCancel:s}=e;const{t:i}=(0,l.Bd)(),[r,c]=(0,o.useState)({...t}),d=e=>{const{name:t,value:n}=e.target;if(t.includes("address.")){const e=t.split(".")[1];c((t=>({...t,address:{...t.address,[e]:n}})))}else c((e=>({...e,[t]:n})))};return(0,x.jsx)(m.A,{children:(0,x.jsxs)(u.A,{children:[(0,x.jsxs)(h.Ay,{container:!0,spacing:2,children:[(0,x.jsx)(h.Ay,{item:!0,xs:12,sm:6,children:(0,x.jsx)(A.A,{fullWidth:!0,label:i("FirstName"),name:"firstName",value:r.firstName,onChange:d})}),(0,x.jsx)(h.Ay,{item:!0,xs:12,sm:6,children:(0,x.jsx)(A.A,{fullWidth:!0,label:i("LastName"),name:"lastName",value:r.lastName,onChange:d})}),(0,x.jsx)(h.Ay,{item:!0,xs:12,sm:6,children:(0,x.jsx)(A.A,{fullWidth:!0,label:i("FiscalCode"),name:"fiscalCode",value:r.fiscalCode,onChange:d})}),(0,x.jsx)(h.Ay,{item:!0,xs:12,sm:6,children:(0,x.jsx)(A.A,{fullWidth:!0,label:i("VATNumber"),name:"vatNumber",value:r.vatNumber,onChange:d})}),(0,x.jsx)(h.Ay,{item:!0,xs:12,sm:6,children:(0,x.jsx)(A.A,{fullWidth:!0,label:i("CompanyName"),name:"companyName",value:r.companyName,onChange:d})}),(0,x.jsx)(h.Ay,{item:!0,xs:12,sm:6,children:(0,x.jsx)(A.A,{fullWidth:!0,label:i("Email"),name:"email",value:r.email,onChange:d})}),(0,x.jsx)(h.Ay,{item:!0,xs:12,sm:6,children:(0,x.jsx)(A.A,{fullWidth:!0,label:i("MobileNumber"),name:"mobileNumber",value:r.mobileNumber,onChange:d})}),(0,x.jsx)(h.Ay,{item:!0,xs:12,sm:6,children:(0,x.jsx)(A.A,{fullWidth:!0,label:i("Street"),name:"address.street",value:r.address.street,onChange:d})}),(0,x.jsx)(h.Ay,{item:!0,xs:6,sm:6,children:(0,x.jsx)(A.A,{fullWidth:!0,label:i("City"),name:"address.city",value:r.address.city,onChange:d})}),(0,x.jsx)(h.Ay,{item:!0,xs:6,sm:6,children:(0,x.jsx)(A.A,{fullWidth:!0,label:i("ZipCode"),name:"address.zipCode",value:r.address.zipCode,onChange:d})}),(0,x.jsx)(h.Ay,{item:!0,xs:6,sm:6,children:(0,x.jsx)(A.A,{fullWidth:!0,label:i("Country"),name:"address.country",value:r.address.country,onChange:d})})]}),(0,x.jsxs)(y,{children:[(0,x.jsx)(a.A,{variant:"contained",onClick:()=>n(r),sx:{mr:2},children:i("SaveChanges")}),(0,x.jsx)(a.A,{variant:"outlined",onClick:s,children:i("Cancel")})]})]})})},y=(0,p.Ay)(s.A)`
  margin-top: 16px;
  display: flex;
  justify-content: flex-end;
`;var g=n(8751),v=n(7206),j=n(1786),C=n(690),b=n(1748),N=n(3505);const k=()=>{const{t:e}=(0,l.Bd)(),{clientId:t}=(0,c.g)(),n=(0,c.Zp)(),{clients:m,editClient:u,editClientIsLoading:h,getClientsIsLoading:A,getClients:p}=(0,b.A)(),[y,k]=(0,o.useState)(void 0),[S,w]=(0,o.useState)(""),[W,M]=(0,o.useState)("");(0,o.useEffect)((()=>{m.length||p()}),[p,m.length]),(0,o.useEffect)((()=>{const e=m.find((e=>{let{id:n}=e;return n.toString()===t}));k(e)}),[t,m]);return A||h||void 0===y?(0,x.jsx)(v.A,{}):y?(0,x.jsx)(N.Rl,{children:(0,x.jsxs)(i.A,{maxWidth:"lg",children:[(0,x.jsx)(j.A,{title:e("EditingClient"),description:`${y.firstName} ${y.lastName}`,margin:"0"}),(0,x.jsxs)(s.A,{my:4,children:[W&&(0,x.jsx)(g.A,{message:W,type:"error"}),S&&(0,x.jsx)(g.A,{message:S,type:"success"}),(0,x.jsxs)(r.A,{component:"p",gutterBottom:!0,children:[e("ID"),": ",y.id,"."," ",(0,x.jsxs)(d.N_,{to:(0,C.bw)(y.id).clientPage,style:{textDecoration:"none"},children:[e("ViewDetails"),"."]})]}),(0,x.jsx)(f,{client:y,onSave:async e=>{try{const t=await u(e);w(`Client updated successfully. ID: ${t.id}, Name: ${t.firstName} ${t.lastName}`)}catch(t){console.error({error:t}),M(`Failed to edit client: ${t.message}`)}},onCancel:()=>n(-1)})]})]})}):(0,x.jsxs)(x.Fragment,{children:[(0,x.jsx)(s.A,{my:2,children:(0,x.jsx)(g.A,{message:e("404ClientNotFoundErrorMessage",{id:t}),type:"error"})}),(0,x.jsx)(a.A,{component:d.N_,to:(0,C.bw)().clientList,variant:"contained",children:e("BackToClientsList")})]})}},2110:(e,t,n)=>{n.d(t,{A:()=>f});var s=n(8168),a=n(8587),i=n(5043),r=n(8387),o=n(8606),l=n(4535),c=n(2876),d=n(3336),m=n(7056),u=n(2400);function h(e){return(0,u.Ay)("MuiCard",e)}(0,m.A)("MuiCard",["root"]);var A=n(579);const p=["className","raised"],x=(0,l.Ay)(d.A,{name:"MuiCard",slot:"Root",overridesResolver:(e,t)=>t.root})((()=>({overflow:"hidden"}))),f=i.forwardRef((function(e,t){const n=(0,c.A)({props:e,name:"MuiCard"}),{className:i,raised:l=!1}=n,d=(0,a.A)(n,p),m=(0,s.A)({},n,{raised:l}),u=(e=>{const{classes:t}=e;return(0,o.A)({root:["root"]},h,t)})(m);return(0,A.jsx)(x,(0,s.A)({className:(0,r.A)(u.root,i),elevation:l?8:void 0,ref:t,ownerState:m},d))}))},6494:(e,t,n)=>{n.d(t,{A:()=>x});var s=n(8168),a=n(8587),i=n(5043),r=n(8387),o=n(8606),l=n(4535),c=n(2876),d=n(7056),m=n(2400);function u(e){return(0,m.Ay)("MuiCardContent",e)}(0,d.A)("MuiCardContent",["root"]);var h=n(579);const A=["className","component"],p=(0,l.Ay)("div",{name:"MuiCardContent",slot:"Root",overridesResolver:(e,t)=>t.root})((()=>({padding:16,"&:last-child":{paddingBottom:24}}))),x=i.forwardRef((function(e,t){const n=(0,c.A)({props:e,name:"MuiCardContent"}),{className:i,component:l="div"}=n,d=(0,a.A)(n,A),m=(0,s.A)({},n,{component:l}),x=(e=>{const{classes:t}=e;return(0,o.A)({root:["root"]},u,t)})(m);return(0,h.jsx)(p,(0,s.A)({as:l,className:(0,r.A)(x.root,i),ownerState:m,ref:t},d))}))},8911:(e,t,n)=>{n.d(t,{A:()=>S});var s=n(8587),a=n(8168),i=n(5043),r=n(8387),o=n(835),l=n(2400),c=n(8606),d=n(6060),m=n(2900),u=n(8698),h=n(8280),A=n(9751),p=n(8604),x=n(579);const f=["component","direction","spacing","divider","children","className","useFlexGap"],y=(0,h.A)(),g=(0,d.A)("div",{name:"MuiStack",slot:"Root",overridesResolver:(e,t)=>t.root});function v(e){return(0,m.A)({props:e,name:"MuiStack",defaultTheme:y})}function j(e,t){const n=i.Children.toArray(e).filter(Boolean);return n.reduce(((e,s,a)=>(e.push(s),a<n.length-1&&e.push(i.cloneElement(t,{key:`separator-${a}`})),e)),[])}const C=e=>{let{ownerState:t,theme:n}=e,s=(0,a.A)({display:"flex",flexDirection:"column"},(0,A.NI)({theme:n},(0,A.kW)({values:t.direction,breakpoints:n.breakpoints.values}),(e=>({flexDirection:e}))));if(t.spacing){const e=(0,p.LX)(n),a=Object.keys(n.breakpoints.values).reduce(((e,n)=>(("object"===typeof t.spacing&&null!=t.spacing[n]||"object"===typeof t.direction&&null!=t.direction[n])&&(e[n]=!0),e)),{}),i=(0,A.kW)({values:t.direction,base:a}),r=(0,A.kW)({values:t.spacing,base:a});"object"===typeof i&&Object.keys(i).forEach(((e,t,n)=>{if(!i[e]){const s=t>0?i[n[t-1]]:"column";i[e]=s}}));const l=(n,s)=>{return t.useFlexGap?{gap:(0,p._W)(e,n)}:{"& > :not(style):not(style)":{margin:0},"& > :not(style) ~ :not(style)":{[`margin${a=s?i[s]:t.direction,{row:"Left","row-reverse":"Right",column:"Top","column-reverse":"Bottom"}[a]}`]:(0,p._W)(e,n)}};var a};s=(0,o.A)(s,(0,A.NI)({theme:n},r,l))}return s=(0,A.iZ)(n.breakpoints,s),s};var b=n(4535),N=n(2876);const k=function(){let e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:{};const{createStyledComponent:t=g,useThemeProps:n=v,componentName:o="MuiStack"}=e,d=t(C),m=i.forwardRef((function(e,t){const i=n(e),m=(0,u.A)(i),{component:h="div",direction:A="column",spacing:p=0,divider:y,children:g,className:v,useFlexGap:C=!1}=m,b=(0,s.A)(m,f),N={direction:A,spacing:p,useFlexGap:C},k=(0,c.A)({root:["root"]},(e=>(0,l.Ay)(o,e)),{});return(0,x.jsx)(d,(0,a.A)({as:h,ownerState:N,ref:t,className:(0,r.A)(k.root,v)},b,{children:y?j(g,y):g}))}));return m}({createStyledComponent:(0,b.Ay)("div",{name:"MuiStack",slot:"Root",overridesResolver:(e,t)=>t.root}),useThemeProps:e=>(0,N.A)({props:e,name:"MuiStack"})}),S=k}}]);
//# sourceMappingURL=489.f9385a72.chunk.js.map