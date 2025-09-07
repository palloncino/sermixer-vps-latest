"use strict";(self.webpackChunkquotation_app_02=self.webpackChunkquotation_app_02||[]).push([[543],{8751:(e,t,n)=>{n.d(t,{A:()=>s});var i=n(6446),r=n(4194),a=n(8911),o=n(579);const s=function(e){let{message:t,type:n}=e;return(0,o.jsx)(o.Fragment,{children:(0,o.jsx)(i.A,{py:2,children:(0,o.jsx)(a.A,{sx:{width:"100%"},spacing:2,children:(0,o.jsx)(r.A,{severity:n,children:t})})})})}},1786:(e,t,n)=>{n.d(t,{A:()=>p});var i=n(4535),r=n(5865),a=(n(5043),n(927)),o=n(690),s=n(579);const l=(0,i.Ay)(r.A)`
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
`,m=(0,i.Ay)(r.A)`
  line-height: 2rem;
  transition: opacity 0.5s ease-in-out; /* Smooth transition effect */
  opacity: 1;

  &:not(:hover) {
    opacity: 0.7;
  }
`,p=e=>{let{title:t,description:n="",margin:i}=e;return(0,s.jsx)(c,{margin:i,children:(0,s.jsxs)(d,{children:[(0,s.jsx)(l,{variant:"h4",align:"left",children:t}),n?(0,s.jsx)(m,{variant:"body1",paragraph:!0,align:"left",children:n}):null]})})};(0,i.Ay)(r.A)`
  width: 100%;
`,(0,a.Ay)("div")`
  background: #F5F5F5;
  border-radius: .4rem;
  color: ${o.Ab.Black3};
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
`,(0,i.Ay)(r.A)`
  line-height: 2rem;
  margin: 0;
  transition: opacity 0.5s ease-in-out; /* Smooth transition effect */
  opacity: 1;

  &:not(:hover) {
    opacity: 0.7;
  }
`},6543:(e,t,n)=>{n.r(t),n.d(t,{default:()=>f});var i=n(9252),r=n(6446),a=n(5795),o=n(1906),s=n(8903),l=n(8446),c=n(5043),d=n(4117),m=n(8751),p=n(1786),u=n(1748),h=n(3505),g=n(579);const f=function(){const{t:e}=(0,d.Bd)(),[t,n]=(0,c.useState)({email:"",password:""}),{login:f,loginIsLoading:y,loginError:x}=(0,u.A)(),A=e=>{const{name:i,value:r,checked:a,type:o}=e.target;n({...t,[i]:"checkbox"===o?a:r})};return(0,g.jsx)(h.Rl,{children:(0,g.jsx)(i.A,{children:(0,g.jsxs)(r.A,{sx:{display:"flex",flexDirection:"column",alignItems:"center"},children:[(0,g.jsx)(p.A,{title:e("Login"),margin:"0"}),(0,g.jsxs)(r.A,{component:"form",noValidate:!0,onSubmit:async e=>{if(e.preventDefault(),t.email&&t.password)try{await f({email:t.email,password:t.password})}catch(n){alert("Login Failed: "+n.message)}else alert("Please fill in all required fields.")},sx:{mt:1},children:[(0,g.jsx)(a.A,{margin:"normal",required:!0,fullWidth:!0,id:"email",label:"email",name:"email",autoComplete:"email",autoFocus:!0,value:t.email,onChange:A}),(0,g.jsx)(a.A,{margin:"normal",required:!0,fullWidth:!0,name:"password",label:"Password",type:"password",id:"password",autoComplete:"current-password",value:t.password,onChange:A}),(0,g.jsx)(o.A,{type:"submit",fullWidth:!0,variant:"contained",sx:{mt:3,mb:2},disabled:y,children:e("Login")}),x&&(0,g.jsx)(m.A,{message:x,type:"error"}),(0,g.jsx)(s.Ay,{container:!0,children:(0,g.jsx)(s.Ay,{item:!0,children:(0,g.jsx)(l.A,{href:"/signup",variant:"body2",children:e("ChangeToSignup")})})})]})]})})})}},8911:(e,t,n)=>{n.d(t,{A:()=>C});var i=n(8587),r=n(8168),a=n(5043),o=n(8387),s=n(835),l=n(2400),c=n(8606),d=n(6060),m=n(2900),p=n(8698),u=n(8280),h=n(9751),g=n(8604),f=n(579);const y=["component","direction","spacing","divider","children","className","useFlexGap"],x=(0,u.A)(),A=(0,d.A)("div",{name:"MuiStack",slot:"Root",overridesResolver:(e,t)=>t.root});function v(e){return(0,m.A)({props:e,name:"MuiStack",defaultTheme:x})}function j(e,t){const n=a.Children.toArray(e).filter(Boolean);return n.reduce(((e,i,r)=>(e.push(i),r<n.length-1&&e.push(a.cloneElement(t,{key:`separator-${r}`})),e)),[])}const b=e=>{let{ownerState:t,theme:n}=e,i=(0,r.A)({display:"flex",flexDirection:"column"},(0,h.NI)({theme:n},(0,h.kW)({values:t.direction,breakpoints:n.breakpoints.values}),(e=>({flexDirection:e}))));if(t.spacing){const e=(0,g.LX)(n),r=Object.keys(n.breakpoints.values).reduce(((e,n)=>(("object"===typeof t.spacing&&null!=t.spacing[n]||"object"===typeof t.direction&&null!=t.direction[n])&&(e[n]=!0),e)),{}),a=(0,h.kW)({values:t.direction,base:r}),o=(0,h.kW)({values:t.spacing,base:r});"object"===typeof a&&Object.keys(a).forEach(((e,t,n)=>{if(!a[e]){const i=t>0?a[n[t-1]]:"column";a[e]=i}}));const l=(n,i)=>{return t.useFlexGap?{gap:(0,g._W)(e,n)}:{"& > :not(style):not(style)":{margin:0},"& > :not(style) ~ :not(style)":{[`margin${r=i?a[i]:t.direction,{row:"Left","row-reverse":"Right",column:"Top","column-reverse":"Bottom"}[r]}`]:(0,g._W)(e,n)}};var r};i=(0,s.A)(i,(0,h.NI)({theme:n},o,l))}return i=(0,h.iZ)(n.breakpoints,i),i};var k=n(4535),w=n(2876);const S=function(){let e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:{};const{createStyledComponent:t=A,useThemeProps:n=v,componentName:s="MuiStack"}=e,d=t(b),m=a.forwardRef((function(e,t){const a=n(e),m=(0,p.A)(a),{component:u="div",direction:h="column",spacing:g=0,divider:x,children:A,className:v,useFlexGap:b=!1}=m,k=(0,i.A)(m,y),w={direction:h,spacing:g,useFlexGap:b},S=(0,c.A)({root:["root"]},(e=>(0,l.Ay)(s,e)),{});return(0,f.jsx)(d,(0,r.A)({as:u,ownerState:w,ref:t,className:(0,o.A)(S.root,v)},k,{children:x?j(A,x):A}))}));return m}({createStyledComponent:(0,k.Ay)("div",{name:"MuiStack",slot:"Root",overridesResolver:(e,t)=>t.root}),useThemeProps:e=>(0,w.A)({props:e,name:"MuiStack"})}),C=S}}]);
//# sourceMappingURL=543.d1169438.chunk.js.map