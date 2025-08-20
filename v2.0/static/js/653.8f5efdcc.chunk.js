"use strict";(self.webpackChunkquotation_app_02=self.webpackChunkquotation_app_02||[]).push([[653],{1786:(t,r,e)=>{e.d(r,{A:()=>p});var i=e(4535),a=e(5865),n=(e(5043),e(927)),o=e(690),s=e(579);const c=(0,i.Ay)(a.A)`
  width: 100%;
`,d=n.Ay.div`
  margin: ${t=>{let{margin:r}=t;return r||"4rem 0 0rem 0"}};
  padding: 24px 0 24px 0;
`,l=n.Ay.div`
  width: 100%;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  justify-items: flex-start;
  padding: 0 1rem;
`,u=(0,i.Ay)(a.A)`
  line-height: 2rem;
  transition: opacity 0.5s ease-in-out; /* Smooth transition effect */
  opacity: 1;

  &:not(:hover) {
    opacity: 0.7;
  }
`,p=t=>{let{title:r,description:e="",margin:i}=t;return(0,s.jsx)(d,{margin:i,children:(0,s.jsxs)(l,{children:[(0,s.jsx)(c,{variant:"h4",align:"left",children:r}),e?(0,s.jsx)(u,{variant:"body1",paragraph:!0,align:"left",children:e}):null]})})};(0,i.Ay)(a.A)`
  width: 100%;
`,(0,n.Ay)("div")`
  background: #F5F5F5;
  border-radius: .4rem;
  color: ${o.Ab.Black3};
  align-text: center;
  margin: ${t=>{let{margin:r}=t;return r||"4rem 0 0rem 0"}};
  padding: 24px 0 24px 0;
`,n.Ay.div`
width: 100%;
margin: 0 auto;
  display: flex;
  flex-direction: column;
  justify-items: flex-start;
  padding: 0 1rem;
`,(0,i.Ay)(a.A)`
  line-height: 2rem;
  margin: 0;
  transition: opacity 0.5s ease-in-out; /* Smooth transition effect */
  opacity: 1;

  &:not(:hover) {
    opacity: 0.7;
  }
`},2653:(t,r,e)=>{e.r(r),e.d(r,{default:()=>h});var i=e(9252),a=e(5043),n=e(4117),o=e(3216),s=e(7206),c=e(1786),d=e(1280),l=e(1748),u=e(3505),p=e(4588),g=e(579);const h=()=>{const{t:t}=(0,n.Bd)(),{productId:r}=(0,o.g)(),{showMessage:e}=(0,p.J)(),{handleSaveProduct:h,getProductById:y}=(0,l.A)(),[f,m]=(0,a.useState)(!0),[x,A]=(0,a.useState)(void 0),[v,j]=(0,a.useState)(void 0),[P,S]=(0,a.useState)(null);(0,a.useEffect)((()=>{(async()=>{if(r)try{const t=await y(parseInt(r,10));t.product&&S(t.product)}catch(e){console.error("EditProductPage: error fetching product",e),A(t("ErrorFetchingProduct"))}finally{m(!1)}})()}),[r,y,t]);(0,a.useCallback)((t=>{S((r=>{if(r){const e={...r,...t};if(JSON.stringify(r)!==JSON.stringify(e))return e}return r}))}),[]);return f?(0,g.jsx)(s.A,{}):P?(0,g.jsx)(u.Rl,{children:(0,g.jsxs)(i.A,{children:[(0,g.jsx)(c.A,{title:t("EditProduct"),margin:"0"}),(0,g.jsx)(d.A,{initialProduct:P,onSave:async r=>{m(!0),A(void 0),j(void 0);try{const i=await h(r,!0);i&&i.product&&(S(i.product),j(t("ProductUpdatedSuccessfully")),e(t("ProductUpdatedSuccessfully"),"success"))}catch(i){console.error("EditProductPage: error saving product",i),A(t("ErrorUpdatingProduct"))}finally{m(!1)}},loading:f,errorMessage:x,successMessage:v})]})}):(0,g.jsx)(u.Rl,{children:(0,g.jsx)(i.A,{children:t("ProductNotFound")})})}}}]);
//# sourceMappingURL=653.8f5efdcc.chunk.js.map