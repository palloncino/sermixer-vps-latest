"use strict";(self.webpackChunkquotation_app_02=self.webpackChunkquotation_app_02||[]).push([[549],{1786:(e,t,a)=>{a.d(t,{A:()=>m});var i=a(4535),r=a(5865),n=(a(5043),a(927)),o=a(690),l=a(579);const s=(0,i.Ay)(r.A)`
  width: 100%;
`,d=n.Ay.div`
  margin: ${e=>{let{margin:t}=e;return t||"4rem 0 0rem 0"}};
  padding: 24px 0 24px 0;
`,c=n.Ay.div`
  width: 100%;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  justify-items: flex-start;
  padding: 0 1rem;
`,u=(0,i.Ay)(r.A)`
  line-height: 2rem;
  transition: opacity 0.5s ease-in-out; /* Smooth transition effect */
  opacity: 1;

  &:not(:hover) {
    opacity: 0.7;
  }
`,m=e=>{let{title:t,description:a="",margin:i}=e;return(0,l.jsx)(d,{margin:i,children:(0,l.jsxs)(c,{children:[(0,l.jsx)(s,{variant:"h4",align:"left",children:t}),a?(0,l.jsx)(u,{variant:"body1",paragraph:!0,align:"left",children:a}):null]})})};(0,i.Ay)(r.A)`
  width: 100%;
`,(0,n.Ay)("div")`
  background: #F5F5F5;
  border-radius: .4rem;
  color: ${o.Ab.Black3};
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
`,(0,i.Ay)(r.A)`
  line-height: 2rem;
  margin: 0;
  transition: opacity 0.5s ease-in-out; /* Smooth transition effect */
  opacity: 1;

  &:not(:hover) {
    opacity: 0.7;
  }
`},2549:(e,t,a)=>{a.r(t),a.d(t,{default:()=>S});var i=a(9252),r=a(5865),n=a(1906),o=a(8903),l=a(2110),s=a(6494),d=a(1806),c=a(3460),u=a(8076),m=a(2420),p=a(2167),A=a(6446),x=a(5043),h=a(4117),v=a(3216),f=a(5475),g=a(4588),y=a(1786),b=a(690),j=a(1748),C=a(3505),w=a(7206),N=a(579);const S=()=>{var e,t,a,S;const{t:M}=(0,h.Bd)(),{clientId:R}=(0,v.g)(),{clients:$,getClients:k}=(0,j.A)(),[E,F]=(0,x.useState)(null),[L,D]=(0,x.useState)(!0),_=(0,v.zy)(),{showMessage:B}=(0,g.J)(),I=async()=>{D(!0),await k(),D(!1)};return(0,x.useEffect)((()=>{I()}),[k,$.length]),(0,x.useEffect)((()=>{const e=$.find((e=>{let{id:t}=e;return`${t}`===`${R}`}));F(e||null)}),[R,$]),(0,x.useEffect)((()=>{"true"===new URLSearchParams(_.search).get("created")&&(B(M("ClientCreatedSuccesfully"),"success"),I())}),[_,B,M]),L?(0,N.jsx)(w.A,{}):E?(0,N.jsx)(C.Rl,{children:(0,N.jsxs)(i.A,{maxWidth:"lg",children:[(0,N.jsx)(y.A,{title:E.companyName||M("Client"),description:M("ClientPageTitle"),margin:"0"}),(0,N.jsx)(o.Ay,{container:!0,spacing:3,alignItems:"center",sx:{mb:3},children:(0,N.jsx)(o.Ay,{item:!0,xs:12,md:12,container:!0,justifyContent:"flex-end",children:(0,N.jsx)(n.A,{variant:"contained",color:"primary",component:f.N_,to:(0,b.bw)(R).editClient,children:M("EditClient")})})}),(0,N.jsx)(l.A,{sx:{width:"100%",borderRadius:1,boxShadow:"0px 1px 3px rgba(0, 0, 0, 0.12)"},children:(0,N.jsx)(s.A,{sx:{padding:"16px 24px"},children:(0,N.jsx)(d.A,{size:"small",children:(0,N.jsx)(c.A,{children:[{label:M("ID"),value:E.id},{label:M("FiscalCode"),value:E.fiscalCode},{label:M("VAT Number"),value:E.vatNumber},{label:M("First Name"),value:E.firstName},{label:M("Last Name"),value:E.lastName},{label:M("Company Name"),value:E.companyName},{label:M("Email"),value:E.email},{label:M("Mobile Number"),value:E.mobileNumber},{label:M("Address"),value:`${null===(e=E.address)||void 0===e?void 0:e.street}, ${null===(t=E.address)||void 0===t?void 0:t.city}, ${null===(a=E.address)||void 0===a?void 0:a.zipCode}, ${null===(S=E.address)||void 0===S?void 0:S.country}`},{label:M("Registered"),value:new Date(E.createdAt).toLocaleDateString()},{label:M("Last Updated"),value:new Date(E.updatedAt).toLocaleDateString()}].map((e=>{let{label:t,value:a}=e;return(0,N.jsxs)(u.A,{children:[(0,N.jsx)(m.A,{sx:{fontWeight:"bold",whiteSpace:"nowrap",padding:"8px"},children:t}),(0,N.jsx)(m.A,{sx:{whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis",padding:"8px"},children:(0,N.jsx)(p.A,{title:a,arrow:!0,children:(0,N.jsx)(A.A,{children:a})})})]},t)}))})})})})]})}):(console.log("404 Error: No client found"),(0,N.jsxs)(i.A,{maxWidth:"sm",sx:{mt:4,display:"flex",flexDirection:"column",alignItems:"center"},children:[(0,N.jsx)(r.A,{variant:"h4",gutterBottom:!0,color:"error",children:M("404ClientNotFound")}),(0,N.jsx)(r.A,{variant:"subtitle1",children:M("404ClientNotFoundErrorMessage",{id:R})}),(0,N.jsx)(n.A,{variant:"contained",color:"primary",component:f.N_,to:(0,b.bw)().clientList,children:M("BackToClientsList")})]}))}},2110:(e,t,a)=>{a.d(t,{A:()=>v});var i=a(8168),r=a(8587),n=a(5043),o=a(8387),l=a(8606),s=a(4535),d=a(2876),c=a(3336),u=a(7056),m=a(2400);function p(e){return(0,m.Ay)("MuiCard",e)}(0,u.A)("MuiCard",["root"]);var A=a(579);const x=["className","raised"],h=(0,s.Ay)(c.A,{name:"MuiCard",slot:"Root",overridesResolver:(e,t)=>t.root})((()=>({overflow:"hidden"}))),v=n.forwardRef((function(e,t){const a=(0,d.A)({props:e,name:"MuiCard"}),{className:n,raised:s=!1}=a,c=(0,r.A)(a,x),u=(0,i.A)({},a,{raised:s}),m=(e=>{const{classes:t}=e;return(0,l.A)({root:["root"]},p,t)})(u);return(0,A.jsx)(h,(0,i.A)({className:(0,o.A)(m.root,n),elevation:s?8:void 0,ref:t,ownerState:u},c))}))},6494:(e,t,a)=>{a.d(t,{A:()=>h});var i=a(8168),r=a(8587),n=a(5043),o=a(8387),l=a(8606),s=a(4535),d=a(2876),c=a(7056),u=a(2400);function m(e){return(0,u.Ay)("MuiCardContent",e)}(0,c.A)("MuiCardContent",["root"]);var p=a(579);const A=["className","component"],x=(0,s.Ay)("div",{name:"MuiCardContent",slot:"Root",overridesResolver:(e,t)=>t.root})((()=>({padding:16,"&:last-child":{paddingBottom:24}}))),h=n.forwardRef((function(e,t){const a=(0,d.A)({props:e,name:"MuiCardContent"}),{className:n,component:s="div"}=a,c=(0,r.A)(a,A),u=(0,i.A)({},a,{component:s}),h=(e=>{const{classes:t}=e;return(0,l.A)({root:["root"]},m,t)})(u);return(0,p.jsx)(x,(0,i.A)({as:s,className:(0,o.A)(h.root,n),ownerState:u,ref:t},c))}))}}]);
//# sourceMappingURL=549.c374ba21.chunk.js.map