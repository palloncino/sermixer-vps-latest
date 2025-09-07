"use strict";(self.webpackChunkquotation_app_02=self.webpackChunkquotation_app_02||[]).push([[136],{8751:(e,t,a)=>{a.d(t,{A:()=>l});var i=a(6446),n=a(4194),s=a(8911),r=a(579);const l=function(e){let{message:t,type:a}=e;return(0,r.jsx)(r.Fragment,{children:(0,r.jsx)(i.A,{py:2,children:(0,r.jsx)(s.A,{sx:{width:"100%"},spacing:2,children:(0,r.jsx)(n.A,{severity:a,children:t})})})})}},1786:(e,t,a)=>{a.d(t,{A:()=>u});var i=a(4535),n=a(5865),s=(a(5043),a(927)),r=a(690),l=a(579);const o=(0,i.Ay)(n.A)`
  width: 100%;
`,c=s.Ay.div`
  margin: ${e=>{let{margin:t}=e;return t||"4rem 0 0rem 0"}};
  padding: 24px 0 24px 0;
`,m=s.Ay.div`
  width: 100%;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  justify-items: flex-start;
  padding: 0 1rem;
`,d=(0,i.Ay)(n.A)`
  line-height: 2rem;
  transition: opacity 0.5s ease-in-out; /* Smooth transition effect */
  opacity: 1;

  &:not(:hover) {
    opacity: 0.7;
  }
`,u=e=>{let{title:t,description:a="",margin:i}=e;return(0,l.jsx)(c,{margin:i,children:(0,l.jsxs)(m,{children:[(0,l.jsx)(o,{variant:"h4",align:"left",children:t}),a?(0,l.jsx)(d,{variant:"body1",paragraph:!0,align:"left",children:a}):null]})})};(0,i.Ay)(n.A)`
  width: 100%;
`,(0,s.Ay)("div")`
  background: #F5F5F5;
  border-radius: .4rem;
  color: ${r.Ab.Black3};
  align-text: center;
  margin: ${e=>{let{margin:t}=e;return t||"4rem 0 0rem 0"}};
  padding: 24px 0 24px 0;
`,s.Ay.div`
width: 100%;
margin: 0 auto;
  display: flex;
  flex-direction: column;
  justify-items: flex-start;
  padding: 0 1rem;
`,(0,i.Ay)(n.A)`
  line-height: 2rem;
  margin: 0;
  transition: opacity 0.5s ease-in-out; /* Smooth transition effect */
  opacity: 1;

  &:not(:hover) {
    opacity: 0.7;
  }
`},9136:(e,t,a)=>{a.r(t),a.d(t,{default:()=>j});var i=a(6446),n=a(8903),s=a(5795),r=a(3193),l=a(8356),o=a(9285),c=a(1449),m=a(8446),d=a(9252),u=a(1906),p=a(5043),h=a(4117),x=a(927),y=a(8751),g=a(1786),A=a(1748),f=a(3505),v=a(579);const j=()=>{const{t:e}=(0,h.Bd)(),{signup:t,signupError:a,signupSuccessMessage:d}=(0,A.A)(),[u,x]=(0,p.useState)({username:"",firstName:"",lastName:"",companyName:"sermixer",email:"",role:"user",password:""}),[j,N]=(0,p.useState)(""),C=e=>{const{name:t,value:a}=e.target;x({...u,[t]:a})};return(0,v.jsx)(f.Rl,{children:(0,v.jsxs)(w,{maxWidth:"lg",children:[a&&(0,v.jsx)(y.A,{message:a,type:"error"}),d&&(0,v.jsx)(y.A,{message:d,type:"success"}),(0,v.jsxs)(i.A,{children:[(0,v.jsx)(g.A,{title:e("Register"),margin:"0"}),(0,v.jsxs)(b,{onSubmit:async e=>{e.preventDefault(),u.password===j?t(u):alert("Passwords do not match!")},noValidate:!0,children:[(0,v.jsxs)(n.Ay,{container:!0,spacing:2,children:[(0,v.jsx)(n.Ay,{item:!0,xs:12,children:(0,v.jsx)(s.A,{required:!0,fullWidth:!0,id:"username",label:e("Username"),name:"username",autoComplete:"username",value:u.username,onChange:C,size:"small"})}),(0,v.jsx)(n.Ay,{item:!0,xs:6,children:(0,v.jsx)(s.A,{required:!0,fullWidth:!0,id:"firstName",label:e("FirstName"),name:"firstName",autoComplete:"given-name",value:u.firstName,onChange:C,size:"small"})}),(0,v.jsx)(n.Ay,{item:!0,xs:6,children:(0,v.jsx)(s.A,{required:!0,fullWidth:!0,id:"lastName",label:e("LastName"),name:"lastName",autoComplete:"family-name",value:u.lastName,onChange:C,size:"small"})}),(0,v.jsx)(n.Ay,{item:!0,xs:12,children:(0,v.jsxs)(r.A,{fullWidth:!0,size:"small",children:[(0,v.jsx)(l.A,{id:"companyName-label",children:e("Company")}),(0,v.jsxs)(o.A,{labelId:"companyName-label",id:"companyName",name:"companyName",value:u.companyName,onChange:e=>{x({...u,companyName:e.target.value})},children:[(0,v.jsx)(c.A,{value:"sermixer",children:"Sermixer"}),(0,v.jsx)(c.A,{value:"s2_truck_service",children:"S2 Truck Service"})]})]})}),(0,v.jsx)(n.Ay,{item:!0,xs:12,children:(0,v.jsx)(s.A,{required:!0,fullWidth:!0,id:"email",label:e("Email"),name:"email",autoComplete:"email",value:u.email,onChange:C,size:"small"})}),(0,v.jsx)(n.Ay,{item:!0,xs:6,children:(0,v.jsx)(s.A,{required:!0,fullWidth:!0,id:"password",label:e("Password"),name:"password",type:"password",autoComplete:"new-password",value:u.password,onChange:C,size:"small"})}),(0,v.jsx)(n.Ay,{item:!0,xs:6,children:(0,v.jsx)(s.A,{required:!0,fullWidth:!0,id:"confirmPassword",label:e("ConfirmPassword"),name:"confirmPassword",type:"password",autoComplete:"new-password",value:j,onChange:e=>N(e.target.value),size:"small"})})]}),(0,v.jsx)(i.A,{my:2,width:"100%",children:(0,v.jsx)(k,{type:"submit",fullWidth:!0,variant:"contained",children:e("Register")})}),(0,v.jsx)(n.Ay,{container:!0,justifyContent:"flex-end",children:(0,v.jsx)(n.Ay,{item:!0,children:(0,v.jsx)(m.A,{href:"/login",variant:"body2",children:e("ChangeToLogin")})})})]})]})]})})},w=(0,x.Ay)(d.A)`
  max-width: 500px;
  margin-top: 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`,b=x.Ay.form`
  margin-top: 16px;
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 12px;
`,k=(0,x.Ay)(u.A)`
  margin-top: 12px;
  height: 48px;
  font-size: 0.9rem;
`},8911:(e,t,a)=>{a.d(t,{A:()=>C});var i=a(8587),n=a(8168),s=a(5043),r=a(8387),l=a(835),o=a(2400),c=a(8606),m=a(6060),d=a(2900),u=a(8698),p=a(8280),h=a(9751),x=a(8604),y=a(579);const g=["component","direction","spacing","divider","children","className","useFlexGap"],A=(0,p.A)(),f=(0,m.A)("div",{name:"MuiStack",slot:"Root",overridesResolver:(e,t)=>t.root});function v(e){return(0,d.A)({props:e,name:"MuiStack",defaultTheme:A})}function j(e,t){const a=s.Children.toArray(e).filter(Boolean);return a.reduce(((e,i,n)=>(e.push(i),n<a.length-1&&e.push(s.cloneElement(t,{key:`separator-${n}`})),e)),[])}const w=e=>{let{ownerState:t,theme:a}=e,i=(0,n.A)({display:"flex",flexDirection:"column"},(0,h.NI)({theme:a},(0,h.kW)({values:t.direction,breakpoints:a.breakpoints.values}),(e=>({flexDirection:e}))));if(t.spacing){const e=(0,x.LX)(a),n=Object.keys(a.breakpoints.values).reduce(((e,a)=>(("object"===typeof t.spacing&&null!=t.spacing[a]||"object"===typeof t.direction&&null!=t.direction[a])&&(e[a]=!0),e)),{}),s=(0,h.kW)({values:t.direction,base:n}),r=(0,h.kW)({values:t.spacing,base:n});"object"===typeof s&&Object.keys(s).forEach(((e,t,a)=>{if(!s[e]){const i=t>0?s[a[t-1]]:"column";s[e]=i}}));const o=(a,i)=>{return t.useFlexGap?{gap:(0,x._W)(e,a)}:{"& > :not(style):not(style)":{margin:0},"& > :not(style) ~ :not(style)":{[`margin${n=i?s[i]:t.direction,{row:"Left","row-reverse":"Right",column:"Top","column-reverse":"Bottom"}[n]}`]:(0,x._W)(e,a)}};var n};i=(0,l.A)(i,(0,h.NI)({theme:a},r,o))}return i=(0,h.iZ)(a.breakpoints,i),i};var b=a(4535),k=a(2876);const N=function(){let e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:{};const{createStyledComponent:t=f,useThemeProps:a=v,componentName:l="MuiStack"}=e,m=t(w),d=s.forwardRef((function(e,t){const s=a(e),d=(0,u.A)(s),{component:p="div",direction:h="column",spacing:x=0,divider:A,children:f,className:v,useFlexGap:w=!1}=d,b=(0,i.A)(d,g),k={direction:h,spacing:x,useFlexGap:w},N=(0,c.A)({root:["root"]},(e=>(0,o.Ay)(l,e)),{});return(0,y.jsx)(m,(0,n.A)({as:p,ownerState:k,ref:t,className:(0,r.A)(N.root,v)},b,{children:A?j(f,A):f}))}));return d}({createStyledComponent:(0,b.Ay)("div",{name:"MuiStack",slot:"Root",overridesResolver:(e,t)=>t.root}),useThemeProps:e=>(0,k.A)({props:e,name:"MuiStack"})}),C=N}}]);
//# sourceMappingURL=136.cc927b4d.chunk.js.map