"use strict";(self.webpackChunkquotation_app_02=self.webpackChunkquotation_app_02||[]).push([[897],{1786:(e,r,i)=>{i.d(r,{A:()=>c});var l=i(4535),s=i(5865),t=(i(5043),i(927)),a=i(690),n=i(579);const d=(0,l.Ay)(s.A)`
  width: 100%;
`,o=t.Ay.div`
  margin: ${e=>{let{margin:r}=e;return r||"4rem 0 0rem 0"}};
  padding: 24px 0 24px 0;
`,m=t.Ay.div`
  width: 100%;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  justify-items: flex-start;
  padding: 0 1rem;
`,u=(0,l.Ay)(s.A)`
  line-height: 2rem;
  transition: opacity 0.5s ease-in-out; /* Smooth transition effect */
  opacity: 1;

  &:not(:hover) {
    opacity: 0.7;
  }
`,c=e=>{let{title:r,description:i="",margin:l}=e;return(0,n.jsx)(o,{margin:l,children:(0,n.jsxs)(m,{children:[(0,n.jsx)(d,{variant:"h4",align:"left",children:r}),i?(0,n.jsx)(u,{variant:"body1",paragraph:!0,align:"left",children:i}):null]})})};(0,l.Ay)(s.A)`
  width: 100%;
`,(0,t.Ay)("div")`
  background: #F5F5F5;
  border-radius: .4rem;
  color: ${a.Ab.Black3};
  align-text: center;
  margin: ${e=>{let{margin:r}=e;return r||"4rem 0 0rem 0"}};
  padding: 24px 0 24px 0;
`,t.Ay.div`
width: 100%;
margin: 0 auto;
  display: flex;
  flex-direction: column;
  justify-items: flex-start;
  padding: 0 1rem;
`,(0,l.Ay)(s.A)`
  line-height: 2rem;
  margin: 0;
  transition: opacity 0.5s ease-in-out; /* Smooth transition effect */
  opacity: 1;

  &:not(:hover) {
    opacity: 0.7;
  }
`},6897:(e,r,i)=>{i.r(r),i.d(r,{default:()=>N});var l=i(9252),s=i(5043),t=i(8403),a=i(6446),n=i(8903),d=i(5795),o=i(1906),m=i(5397),u=i(4194),c=i(4858),x=i(4117),h=i(3216),v=i(4588),p=i(899),y=i(690),j=i(1748),f=i(579);const A=p.Ik().shape({fiscalCode:p.Yj().test("is-valid-fiscal-code","Invalid Italian Fiscal Code",(e=>!e||/^[A-Z]{6}\d{2}[A-Z]\d{2}[A-Z]\d{3}[A-Z]$/i.test(e))).nullable(),vatNumber:p.Yj().required("VAT number is required").max(14,"VAT number must be at most 14 characters"),firstName:p.Yj().nullable(),lastName:p.Yj().nullable(),companyName:p.Yj().required("Company name is required"),address:p.Ik().shape({street:p.Yj().required("Street is required"),city:p.Yj().required("City is required"),zipCode:p.Yj().required("Zip code is required"),country:p.Yj().required("Country is required").oneOf(["IT"],"Country must be IT")}),email:p.Yj().email("Invalid email").required("Email is required"),mobileNumber:p.Yj()}),g=()=>{const{t:e}=(0,x.Bd)(),r=(0,h.Zp)(),{showMessage:i}=(0,v.J)(),{addClient:l}=(0,j.A)(),[p,g]=(0,s.useState)({open:!1,message:"",severity:"success"}),{control:b,handleSubmit:C,formState:{errors:N}}=(0,c.mN)({resolver:(0,t.t)(A),defaultValues:{address:{country:"IT"}}});return(0,f.jsxs)(f.Fragment,{children:[(0,f.jsx)(a.A,{p:2,children:(0,f.jsx)("form",{onSubmit:C((async e=>{try{const t=await l(e);var s;if(null!==t&&void 0!==t&&t.success)g({open:!0,message:"Client created successfully",severity:"success"}),r(`${(0,y.bw)(null===t||void 0===t||null===(s=t.client)||void 0===s?void 0:s.id).clientPage}?created=true`);else null!==t&&void 0!==t&&t.message&&(g({open:!0,message:null===t||void 0===t?void 0:t.message,severity:"error"}),i(null===t||void 0===t?void 0:t.message,"error"))}catch(t){g({open:!0,message:"string"===typeof t.message?t.message:"Error",severity:"error"})}})),children:(0,f.jsxs)(n.Ay,{container:!0,spacing:3,children:[(0,f.jsx)(n.Ay,{item:!0,xs:12,sm:6,children:(0,f.jsx)(c.xI,{name:"fiscalCode",control:b,render:r=>{var i;let{field:l}=r;return(0,f.jsx)(d.A,{...l,label:e("FiscalCode"),fullWidth:!0,error:!!N.fiscalCode,helperText:null===(i=N.fiscalCode)||void 0===i?void 0:i.message})}})}),(0,f.jsx)(n.Ay,{item:!0,xs:12,sm:6,children:(0,f.jsx)(c.xI,{name:"vatNumber",control:b,render:r=>{var i;let{field:l}=r;return(0,f.jsx)(d.A,{...l,label:e("VATNumber"),fullWidth:!0,error:!!N.vatNumber,helperText:null===(i=N.vatNumber)||void 0===i?void 0:i.message})}})}),(0,f.jsx)(n.Ay,{item:!0,xs:12,sm:6,children:(0,f.jsx)(c.xI,{name:"firstName",control:b,render:r=>{var i;let{field:l}=r;return(0,f.jsx)(d.A,{...l,label:e("FirstName"),fullWidth:!0,error:!!N.firstName,helperText:null===(i=N.firstName)||void 0===i?void 0:i.message})}})}),(0,f.jsx)(n.Ay,{item:!0,xs:12,sm:6,children:(0,f.jsx)(c.xI,{name:"lastName",control:b,render:r=>{var i;let{field:l}=r;return(0,f.jsx)(d.A,{...l,label:e("LastName"),fullWidth:!0,error:!!N.lastName,helperText:null===(i=N.lastName)||void 0===i?void 0:i.message})}})}),(0,f.jsx)(n.Ay,{item:!0,xs:12,children:(0,f.jsx)(c.xI,{name:"companyName",control:b,render:r=>{var i;let{field:l}=r;return(0,f.jsx)(d.A,{...l,label:e("CompanyName"),fullWidth:!0,error:!!N.companyName,helperText:null===(i=N.companyName)||void 0===i?void 0:i.message})}})}),(0,f.jsx)(n.Ay,{item:!0,xs:12,children:(0,f.jsx)(c.xI,{name:"address.street",control:b,render:r=>{var i,l,s;let{field:t}=r;return(0,f.jsx)(d.A,{...t,label:e("Street"),fullWidth:!0,error:!(null===(i=N.address)||void 0===i||!i.street),helperText:null===(l=N.address)||void 0===l||null===(s=l.street)||void 0===s?void 0:s.message})}})}),(0,f.jsx)(n.Ay,{item:!0,xs:12,sm:6,children:(0,f.jsx)(c.xI,{name:"address.city",control:b,render:r=>{var i,l,s;let{field:t}=r;return(0,f.jsx)(d.A,{...t,label:e("City"),fullWidth:!0,error:!(null===(i=N.address)||void 0===i||!i.city),helperText:null===(l=N.address)||void 0===l||null===(s=l.city)||void 0===s?void 0:s.message})}})}),(0,f.jsx)(n.Ay,{item:!0,xs:12,sm:6,children:(0,f.jsx)(c.xI,{name:"address.zipCode",control:b,render:r=>{var i,l,s;let{field:t}=r;return(0,f.jsx)(d.A,{...t,label:e("ZipCode"),fullWidth:!0,error:!(null===(i=N.address)||void 0===i||!i.zipCode),helperText:null===(l=N.address)||void 0===l||null===(s=l.zipCode)||void 0===s?void 0:s.message})}})}),(0,f.jsx)(n.Ay,{item:!0,xs:12,children:(0,f.jsx)(c.xI,{name:"address.country",control:b,render:r=>{let{field:i}=r;return(0,f.jsx)(d.A,{...i,label:e("Country"),fullWidth:!0,InputProps:{readOnly:!0},value:"IT"})}})}),(0,f.jsx)(n.Ay,{item:!0,xs:12,sm:6,children:(0,f.jsx)(c.xI,{name:"email",control:b,render:r=>{var i;let{field:l}=r;return(0,f.jsx)(d.A,{...l,label:e("Email"),fullWidth:!0,error:!!N.email,helperText:null===(i=N.email)||void 0===i?void 0:i.message})}})}),(0,f.jsx)(n.Ay,{item:!0,xs:12,sm:6,children:(0,f.jsx)(c.xI,{name:"mobileNumber",control:b,render:r=>{var i;let{field:l}=r;return(0,f.jsx)(d.A,{...l,label:e("MobileNumber"),fullWidth:!0,error:!!N.mobileNumber,helperText:null===(i=N.mobileNumber)||void 0===i?void 0:i.message})}})}),(0,f.jsx)(n.Ay,{item:!0,xs:12,children:(0,f.jsxs)(a.A,{display:"flex",justifyContent:"flex-end",children:[(0,f.jsx)(o.A,{type:"button",onClick:()=>r((0,y.bw)().clients),sx:{mr:2},children:e("Cancel")}),(0,f.jsx)(o.A,{type:"submit",variant:"contained",color:"primary",children:e("CreateClient")})]})})]})})}),(0,f.jsx)(m.A,{open:p.open,autoHideDuration:6e3,onClose:()=>g({...p,open:!1}),anchorOrigin:{vertical:"bottom",horizontal:"center"},children:(0,f.jsx)(u.A,{onClose:()=>g({...p,open:!1}),severity:p.severity,children:p.message})})]})};var b=i(1786),C=i(3505);const N=()=>(0,f.jsx)(C.Rl,{children:(0,f.jsxs)(l.A,{maxWidth:"md",children:[(0,f.jsx)(b.A,{title:"Create New Client",margin:"0"}),(0,f.jsx)(g,{})]})})}}]);
//# sourceMappingURL=897.87e8c330.chunk.js.map