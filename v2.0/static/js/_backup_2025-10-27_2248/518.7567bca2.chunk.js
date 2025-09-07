"use strict";(self.webpackChunkquotation_app_02=self.webpackChunkquotation_app_02||[]).push([[518],{8751:(e,t,n)=>{n.d(t,{A:()=>o});var r=n(6446),s=n(4194),a=n(8911),i=n(579);const o=function(e){let{message:t,type:n}=e;return(0,i.jsx)(i.Fragment,{children:(0,i.jsx)(r.A,{py:2,children:(0,i.jsx)(a.A,{sx:{width:"100%"},spacing:2,children:(0,i.jsx)(s.A,{severity:n,children:t})})})})}},1786:(e,t,n)=>{n.d(t,{A:()=>u});var r=n(4535),s=n(5865),a=(n(5043),n(927)),i=n(690),o=n(579);const l=(0,r.Ay)(s.A)`
  width: 100%;
`,c=a.Ay.div`
  margin: ${e=>{let{margin:t}=e;return t||"4rem 0 0rem 0"}};
  padding: 24px 0 24px 0;
`,d=a.Ay.div`
  width: 100%;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  justify-items: flex-start;
  padding: 0 1rem;
`,m=(0,r.Ay)(s.A)`
  line-height: 2rem;
  transition: opacity 0.5s ease-in-out; /* Smooth transition effect */
  opacity: 1;

  &:not(:hover) {
    opacity: 0.7;
  }
`,u=e=>{let{title:t,description:n="",margin:r}=e;return(0,o.jsx)(c,{margin:r,children:(0,o.jsxs)(d,{children:[(0,o.jsx)(l,{variant:"h4",align:"left",children:t}),n?(0,o.jsx)(m,{variant:"body1",paragraph:!0,align:"left",children:n}):null]})})};(0,r.Ay)(s.A)`
  width: 100%;
`,(0,a.Ay)("div")`
  background: #F5F5F5;
  border-radius: .4rem;
  color: ${i.Ab.Black3};
  align-text: center;
  margin: ${e=>{let{margin:t}=e;return t||"4rem 0 0rem 0"}};
  padding: 24px 0 24px 0;
`,a.Ay.div`
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
`},3518:(e,t,n)=>{n.r(t),n.d(t,{default:()=>R});var r=n(6446),s=n(1906),a=n(5865),i=n(9252),o=n(5043),l=n(4117),c=n(3216),d=n(5475),m=n(927),u=n(8751),p=n(7206),A=n(2110),h=n(6494),x=n(8903),y=n(5795),v=n(3193),f=n(8356),g=n(9285),j=n(1449),b=n(579);const C=e=>{let{user:t,onSave:n,onCancel:r}=e;const{t:a}=(0,l.Bd)(),[i,c]=(0,o.useState)({...t}),d=e=>{const{name:t,value:n}=e.target;c((e=>({...e,[t]:n})))},m=e=>{const{name:t,value:n}=e.target;c((e=>({...e,[t]:n})))};return(0,b.jsx)(A.A,{children:(0,b.jsxs)(h.A,{children:[(0,b.jsxs)(x.Ay,{container:!0,spacing:2,children:[(0,b.jsx)(x.Ay,{item:!0,xs:12,sm:6,children:(0,b.jsx)(y.A,{fullWidth:!0,label:a("FirstName"),name:"firstName",value:i.firstName,onChange:d})}),(0,b.jsx)(x.Ay,{item:!0,xs:12,sm:6,children:(0,b.jsx)(y.A,{fullWidth:!0,label:a("LastName"),name:"lastName",value:i.lastName,onChange:d})}),(0,b.jsx)(x.Ay,{item:!0,xs:12,sm:6,children:(0,b.jsx)(y.A,{fullWidth:!0,label:a("Username"),name:"username",value:i.username,onChange:d})}),(0,b.jsx)(x.Ay,{item:!0,xs:12,sm:6,children:(0,b.jsx)(y.A,{fullWidth:!0,label:a("Email"),name:"email",value:i.email,onChange:d})}),(0,b.jsx)(x.Ay,{item:!0,xs:12,sm:6,children:(0,b.jsxs)(v.A,{fullWidth:!0,children:[(0,b.jsx)(f.A,{id:"company-select-label",children:a("Company")}),(0,b.jsxs)(g.A,{labelId:"company-select-label",id:"company-select",name:"companyName",value:i.companyName,onChange:m,children:[(0,b.jsx)(j.A,{value:"sermixer",children:a("Sermixer")}),(0,b.jsx)(j.A,{value:"s2_truck_service",children:a("S2TruckService")})]})]})}),(0,b.jsx)(x.Ay,{item:!0,xs:12,children:(0,b.jsxs)(v.A,{fullWidth:!0,children:[(0,b.jsx)(f.A,{id:"role-select-label",children:a("Role")}),(0,b.jsxs)(g.A,{labelId:"role-select-label",id:"role-select",name:"role",value:i.role,onChange:m,children:[(0,b.jsx)(j.A,{value:"user",children:a("User")}),(0,b.jsx)(j.A,{value:"admin",children:a("Admin")})]})]})})]}),(0,b.jsxs)(N,{children:[(0,b.jsx)(s.A,{variant:"contained",onClick:()=>n(i),sx:{mr:2},children:a("SaveChanges")}),(0,b.jsx)(s.A,{variant:"outlined",onClick:r,children:a("Cancel")})]})]})})},N=(0,m.Ay)(r.A)`
  margin-top: 16px;
  display: flex;
  justify-content: flex-end;
`;var k=n(690),S=n(1748),w=n(1786),M=n(3505);const R=()=>{const{t:e}=(0,l.Bd)(),{userId:t}=(0,c.g)(),n=(0,c.Zp)(),{users:i,editUser:m,editUserIsLoading:A,getUsersIsLoading:h,getUsers:x}=(0,S.A)(),[y,v]=(0,o.useState)(void 0),[f,g]=(0,o.useState)(""),[j,N]=(0,o.useState)("");(0,o.useEffect)((()=>{i.length||x()}),[x,i.length]),(0,o.useEffect)((()=>{const e=i.find((e=>{let{id:n}=e;return n.toString()===t}));v(e)}),[t,i]);return h||A||void 0===y?(0,b.jsx)(p.A,{}):y?(0,b.jsxs)(M.Rl,{children:[(0,b.jsx)(w.A,{title:e("EditUser"),description:`${y.firstName} ${y.lastName}`,margin:"0"}),(0,b.jsxs)(k.hk,{children:[j&&(0,b.jsx)(r.A,{my:2,children:(0,b.jsx)(u.A,{message:j,type:"error"})}),f&&(0,b.jsx)(r.A,{my:2,children:(0,b.jsx)(u.A,{message:f,type:"success"})}),(0,b.jsxs)(a.A,{component:"p",gutterBottom:!0,children:[e("ID"),": ",y.id,"."," ",(0,b.jsxs)(d.N_,{to:(0,k.bw)(y.id).userPage,style:{textDecoration:"none"},children:[e("ViewDetails"),"."]})]}),(0,b.jsx)(C,{user:y,onSave:async e=>{try{const t=await m(e);g(`User updated successfully. ID: ${t.id}, Name: ${t.firstName} ${t.lastName}`)}catch(t){console.error({error:t}),N(`Failed to edit user: ${t.message}`)}},onCancel:()=>n(-1)})]})]}):(0,b.jsxs)(F,{children:[(0,b.jsx)(r.A,{my:2,children:(0,b.jsx)(u.A,{message:e("404UserNotFoundErrorMessage",{id:t}),type:"error"})}),(0,b.jsx)(s.A,{component:d.N_,to:(0,k.bw)().userList,variant:"contained",children:e("BackToUsersList")})]})},F=(0,m.Ay)(i.A)`
  margin-top: 32px;
  margin-bottom: 32px;
`},2110:(e,t,n)=>{n.d(t,{A:()=>y});var r=n(8168),s=n(8587),a=n(5043),i=n(8387),o=n(8606),l=n(4535),c=n(2876),d=n(3336),m=n(7056),u=n(2400);function p(e){return(0,u.Ay)("MuiCard",e)}(0,m.A)("MuiCard",["root"]);var A=n(579);const h=["className","raised"],x=(0,l.Ay)(d.A,{name:"MuiCard",slot:"Root",overridesResolver:(e,t)=>t.root})((()=>({overflow:"hidden"}))),y=a.forwardRef((function(e,t){const n=(0,c.A)({props:e,name:"MuiCard"}),{className:a,raised:l=!1}=n,d=(0,s.A)(n,h),m=(0,r.A)({},n,{raised:l}),u=(e=>{const{classes:t}=e;return(0,o.A)({root:["root"]},p,t)})(m);return(0,A.jsx)(x,(0,r.A)({className:(0,i.A)(u.root,a),elevation:l?8:void 0,ref:t,ownerState:m},d))}))},6494:(e,t,n)=>{n.d(t,{A:()=>x});var r=n(8168),s=n(8587),a=n(5043),i=n(8387),o=n(8606),l=n(4535),c=n(2876),d=n(7056),m=n(2400);function u(e){return(0,m.Ay)("MuiCardContent",e)}(0,d.A)("MuiCardContent",["root"]);var p=n(579);const A=["className","component"],h=(0,l.Ay)("div",{name:"MuiCardContent",slot:"Root",overridesResolver:(e,t)=>t.root})((()=>({padding:16,"&:last-child":{paddingBottom:24}}))),x=a.forwardRef((function(e,t){const n=(0,c.A)({props:e,name:"MuiCardContent"}),{className:a,component:l="div"}=n,d=(0,s.A)(n,A),m=(0,r.A)({},n,{component:l}),x=(e=>{const{classes:t}=e;return(0,o.A)({root:["root"]},u,t)})(m);return(0,p.jsx)(h,(0,r.A)({as:l,className:(0,i.A)(x.root,a),ownerState:m,ref:t},d))}))},8911:(e,t,n)=>{n.d(t,{A:()=>S});var r=n(8587),s=n(8168),a=n(5043),i=n(8387),o=n(835),l=n(2400),c=n(8606),d=n(6060),m=n(2900),u=n(8698),p=n(8280),A=n(9751),h=n(8604),x=n(579);const y=["component","direction","spacing","divider","children","className","useFlexGap"],v=(0,p.A)(),f=(0,d.A)("div",{name:"MuiStack",slot:"Root",overridesResolver:(e,t)=>t.root});function g(e){return(0,m.A)({props:e,name:"MuiStack",defaultTheme:v})}function j(e,t){const n=a.Children.toArray(e).filter(Boolean);return n.reduce(((e,r,s)=>(e.push(r),s<n.length-1&&e.push(a.cloneElement(t,{key:`separator-${s}`})),e)),[])}const b=e=>{let{ownerState:t,theme:n}=e,r=(0,s.A)({display:"flex",flexDirection:"column"},(0,A.NI)({theme:n},(0,A.kW)({values:t.direction,breakpoints:n.breakpoints.values}),(e=>({flexDirection:e}))));if(t.spacing){const e=(0,h.LX)(n),s=Object.keys(n.breakpoints.values).reduce(((e,n)=>(("object"===typeof t.spacing&&null!=t.spacing[n]||"object"===typeof t.direction&&null!=t.direction[n])&&(e[n]=!0),e)),{}),a=(0,A.kW)({values:t.direction,base:s}),i=(0,A.kW)({values:t.spacing,base:s});"object"===typeof a&&Object.keys(a).forEach(((e,t,n)=>{if(!a[e]){const r=t>0?a[n[t-1]]:"column";a[e]=r}}));const l=(n,r)=>{return t.useFlexGap?{gap:(0,h._W)(e,n)}:{"& > :not(style):not(style)":{margin:0},"& > :not(style) ~ :not(style)":{[`margin${s=r?a[r]:t.direction,{row:"Left","row-reverse":"Right",column:"Top","column-reverse":"Bottom"}[s]}`]:(0,h._W)(e,n)}};var s};r=(0,o.A)(r,(0,A.NI)({theme:n},i,l))}return r=(0,A.iZ)(n.breakpoints,r),r};var C=n(4535),N=n(2876);const k=function(){let e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:{};const{createStyledComponent:t=f,useThemeProps:n=g,componentName:o="MuiStack"}=e,d=t(b),m=a.forwardRef((function(e,t){const a=n(e),m=(0,u.A)(a),{component:p="div",direction:A="column",spacing:h=0,divider:v,children:f,className:g,useFlexGap:b=!1}=m,C=(0,r.A)(m,y),N={direction:A,spacing:h,useFlexGap:b},k=(0,c.A)({root:["root"]},(e=>(0,l.Ay)(o,e)),{});return(0,x.jsx)(d,(0,s.A)({as:p,ownerState:N,ref:t,className:(0,i.A)(k.root,g)},C,{children:v?j(f,v):f}))}));return m}({createStyledComponent:(0,C.Ay)("div",{name:"MuiStack",slot:"Root",overridesResolver:(e,t)=>t.root}),useThemeProps:e=>(0,N.A)({props:e,name:"MuiStack"})}),S=k}}]);
//# sourceMappingURL=518.7567bca2.chunk.js.map