"use strict";(self.webpackChunkquotation_app_02=self.webpackChunkquotation_app_02||[]).push([[393],{1786:(e,t,r)=>{r.d(t,{A:()=>A});var n=r(4535),a=r(5865),i=(r(5043),r(927)),o=r(690),s=r(579);const d=(0,n.Ay)(a.A)`
  width: 100%;
`,c=i.Ay.div`
  margin: ${e=>{let{margin:t}=e;return t||"4rem 0 0rem 0"}};
  padding: 24px 0 24px 0;
`,l=i.Ay.div`
  width: 100%;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  justify-items: flex-start;
  padding: 0 1rem;
`,m=(0,n.Ay)(a.A)`
  line-height: 2rem;
  transition: opacity 0.5s ease-in-out; /* Smooth transition effect */
  opacity: 1;

  &:not(:hover) {
    opacity: 0.7;
  }
`,A=e=>{let{title:t,description:r="",margin:n}=e;return(0,s.jsx)(c,{margin:n,children:(0,s.jsxs)(l,{children:[(0,s.jsx)(d,{variant:"h4",align:"left",children:t}),r?(0,s.jsx)(m,{variant:"body1",paragraph:!0,align:"left",children:r}):null]})})};(0,n.Ay)(a.A)`
  width: 100%;
`,(0,i.Ay)("div")`
  background: #F5F5F5;
  border-radius: .4rem;
  color: ${o.Ab.Black3};
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
`,(0,n.Ay)(a.A)`
  line-height: 2rem;
  margin: 0;
  transition: opacity 0.5s ease-in-out; /* Smooth transition effect */
  opacity: 1;

  &:not(:hover) {
    opacity: 0.7;
  }
`},8393:(e,t,r)=>{r.r(t),r.d(t,{default:()=>w});var n=r(9252),a=r(5865),i=r(1906),o=r(2110),s=r(6494),d=r(7600),c=r(1806),l=r(3460),m=r(8076),A=r(2420),p=(r(5043),r(4117)),u=r(5475),g=r(927),h=r(1786),x=r(690),f=r(1748),y=r(3505),v=r(579);const j=g.Ay.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
`,w=()=>{const{t:e}=(0,p.Bd)(),{user:t}=(0,f.A)();return t?(0,v.jsx)(y.Rl,{children:(0,v.jsxs)(n.A,{children:[(0,v.jsx)(h.A,{title:e("ProfilePageTitle"),description:e("ProfilePageDescription"),margin:"0"}),(0,v.jsx)(x.hk,{children:(0,v.jsx)(o.A,{sx:{width:"100%"},children:(0,v.jsxs)(s.A,{children:[(0,v.jsx)(j,{children:(0,v.jsx)(d.A,{children:(0,v.jsx)(i.A,{variant:"contained",color:"primary",component:u.N_,to:(0,x.bw)(t.id).editUser,children:e("EditUser")})})}),(0,v.jsx)(c.A,{children:(0,v.jsx)(l.A,{children:Object.entries({FirstName:t.firstName,LastName:t.lastName,Username:t.username,Email:t.email,Company:t.companyName,Role:t.role,Registered:new Date(t.createdAt).toLocaleDateString(),LastUpdated:new Date(t.updatedAt).toLocaleDateString()}).map((t=>{let[r,n]=t;return(0,v.jsxs)(m.A,{children:[(0,v.jsx)(A.A,{children:e(r)}),(0,v.jsx)(A.A,{children:(0,v.jsx)("strong",{children:n})})]},r)}))})})]})})})]})}):(0,v.jsxs)(n.A,{maxWidth:"sm",sx:{mt:4},children:[(0,v.jsx)(a.A,{variant:"h4",gutterBottom:!0,color:"error",children:e("UserDataNA")}),(0,v.jsx)(i.A,{variant:"contained",color:"primary",component:u.N_,to:(0,x.bw)().userList,children:e("BackToUsersList")})]})}},2110:(e,t,r)=>{r.d(t,{A:()=>x});var n=r(8168),a=r(8587),i=r(5043),o=r(8387),s=r(8606),d=r(4535),c=r(2876),l=r(3336),m=r(7056),A=r(2400);function p(e){return(0,A.Ay)("MuiCard",e)}(0,m.A)("MuiCard",["root"]);var u=r(579);const g=["className","raised"],h=(0,d.Ay)(l.A,{name:"MuiCard",slot:"Root",overridesResolver:(e,t)=>t.root})((()=>({overflow:"hidden"}))),x=i.forwardRef((function(e,t){const r=(0,c.A)({props:e,name:"MuiCard"}),{className:i,raised:d=!1}=r,l=(0,a.A)(r,g),m=(0,n.A)({},r,{raised:d}),A=(e=>{const{classes:t}=e;return(0,s.A)({root:["root"]},p,t)})(m);return(0,u.jsx)(h,(0,n.A)({className:(0,o.A)(A.root,i),elevation:d?8:void 0,ref:t,ownerState:m},l))}))},7600:(e,t,r)=>{r.d(t,{A:()=>h});var n=r(8587),a=r(8168),i=r(5043),o=r(8387),s=r(8606),d=r(4535),c=r(2876),l=r(7056),m=r(2400);function A(e){return(0,m.Ay)("MuiCardActions",e)}(0,l.A)("MuiCardActions",["root","spacing"]);var p=r(579);const u=["disableSpacing","className"],g=(0,d.Ay)("div",{name:"MuiCardActions",slot:"Root",overridesResolver:(e,t)=>{const{ownerState:r}=e;return[t.root,!r.disableSpacing&&t.spacing]}})((e=>{let{ownerState:t}=e;return(0,a.A)({display:"flex",alignItems:"center",padding:8},!t.disableSpacing&&{"& > :not(style) ~ :not(style)":{marginLeft:8}})})),h=i.forwardRef((function(e,t){const r=(0,c.A)({props:e,name:"MuiCardActions"}),{disableSpacing:i=!1,className:d}=r,l=(0,n.A)(r,u),m=(0,a.A)({},r,{disableSpacing:i}),h=(e=>{const{classes:t,disableSpacing:r}=e,n={root:["root",!r&&"spacing"]};return(0,s.A)(n,A,t)})(m);return(0,p.jsx)(g,(0,a.A)({className:(0,o.A)(h.root,d),ownerState:m,ref:t},l))}))},6494:(e,t,r)=>{r.d(t,{A:()=>h});var n=r(8168),a=r(8587),i=r(5043),o=r(8387),s=r(8606),d=r(4535),c=r(2876),l=r(7056),m=r(2400);function A(e){return(0,m.Ay)("MuiCardContent",e)}(0,l.A)("MuiCardContent",["root"]);var p=r(579);const u=["className","component"],g=(0,d.Ay)("div",{name:"MuiCardContent",slot:"Root",overridesResolver:(e,t)=>t.root})((()=>({padding:16,"&:last-child":{paddingBottom:24}}))),h=i.forwardRef((function(e,t){const r=(0,c.A)({props:e,name:"MuiCardContent"}),{className:i,component:d="div"}=r,l=(0,a.A)(r,u),m=(0,n.A)({},r,{component:d}),h=(e=>{const{classes:t}=e;return(0,s.A)({root:["root"]},A,t)})(m);return(0,p.jsx)(g,(0,n.A)({as:d,className:(0,o.A)(h.root,i),ownerState:m,ref:t},l))}))}}]);
//# sourceMappingURL=393.ebbe8f9d.chunk.js.map