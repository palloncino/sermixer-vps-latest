"use strict";(self.webpackChunkquotation_app_02=self.webpackChunkquotation_app_02||[]).push([[406],{7166:(e,t,n)=>{n.r(t),n.d(t,{default:()=>N});var i=n(5043),r=n(4117),o=n(2698),a=n(5865),d=n(2167),l=n(8446),s=n(5475),c=n(927),g=n(690),p=n(579);const h=c.Ay.div`
  padding: 1.5rem;
  border: 1px solid ${g.Ab.LightGray};
  border-radius: 8px;
  background-color: white;
  height: 100%;
  overflow-y: auto;
`,m=c.Ay.div`
  margin-bottom: 1rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid ${g.Ab.LightGray};

  &:last-child {
    margin-bottom: 0;
    padding-bottom: 0;
    border-bottom: none;
  }
`,u=(0,c.Ay)(a.A)`
  color: ${g.Ab.DarkGray};
  font-weight: bold;
  margin-bottom: 0.5rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
`,x=c.Ay.span`
  font-size: 1.1rem;
  color: ${g.Ab.Blue};
`,A=c.Ay.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
`,y=(0,c.Ay)(l.A)`
  color: ${g.Ab.Blue};
  text-decoration: none;
  font-size: 0.8rem;
  &:hover {
    text-decoration: underline;
  }
`,b=e=>{let{documents:t}=e;const{t:n}=(0,r.Bd)(),o=t.reduce(((e,t)=>(Object.entries(t.status).forEach((n=>{let[i,r]=n;!0===r&&(e[i]||(e[i]=[]),e[i].push(t.id))})),e)),{});return(0,p.jsxs)(h,{children:[(0,p.jsx)(a.A,{variant:"h6",gutterBottom:!0,children:n("Status Summary")}),Object.entries(o).map((e=>{let[t,r]=e;return(0,p.jsxs)(m,{children:[(0,p.jsxs)(u,{children:[n(t),": ",(0,p.jsx)(x,{children:r.length})]}),(0,p.jsx)(A,{children:r.map(((e,t)=>(0,p.jsxs)(i.Fragment,{children:[(0,p.jsx)(d.A,{title:`Open document ${e}`,children:(0,p.jsx)(y,{component:s.N_,to:(0,g.bw)(e).editDocument,children:e})}),t<r.length-1&&", "]},e)))})]},t)}))]})},v=c.Ay.div`
  padding: 1.5rem;
  border: 1px solid ${g.Ab.LightGray};
  border-radius: 8px;
  text-align: center;
`,f=e=>{let{count:t}=e;const{t:n}=(0,r.Bd)();return(0,p.jsxs)(v,{children:[(0,p.jsx)(a.A,{variant:"h6",children:n("Total Documents")}),(0,p.jsx)(a.A,{variant:"h3",children:t})]})},j=c.Ay.div`
  padding: 1.5rem;
  border: 1px solid ${g.Ab.LightGray};
  border-radius: 8px;
  background-color: white;
  height: 100%;
`,z=c.Ay.ul`
  list-style-type: none;
  padding: 0;
  margin: 0;
`,$=c.Ay.li`
  margin-bottom: 1rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid ${g.Ab.LightGray};

  &:last-child {
    margin-bottom: 0;
    padding-bottom: 0;
    border-bottom: none;
  }
`,k=c.Ay.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.5rem;
`,w=(0,c.Ay)(s.N_)`
  color: ${g.Ab.Blue};
  font-size: 0.9rem;
  text-decoration: none;
  &:hover {
    text-decoration: underline;
  }
`,C=(0,c.Ay)(a.A)`
  font-weight: bold;
  color: ${g.Ab.DarkGray};
  font-size: 0.9rem;
`,D=(0,c.Ay)(a.A)`
  color: ${g.Ab.Gray};
  font-size: 0.8rem;
`,H=(0,c.Ay)(a.A)`
  font-size: 0.9rem;
  color: ${g.Ab.Gray};
`,L=e=>{let{documents:t}=e;const{t:n}=(0,r.Bd)();return(0,p.jsxs)(j,{children:[(0,p.jsx)(a.A,{variant:"h6",gutterBottom:!0,children:n("Recent Activity")}),(0,p.jsx)(z,{children:t.map((e=>{var t,i,r,o;return(0,p.jsxs)($,{children:[(0,p.jsxs)(k,{children:[(0,p.jsxs)(w,{component:s.N_,to:`/client-preventive/${e.hash}`,children:[n("ID"),": ",e.id]}),(0,p.jsx)(C,{children:null===(t=e.data.quoteHeadDetails)||void 0===t?void 0:t.company}),(0,p.jsx)(D,{children:(o=e.updatedAt,new Date(o).toLocaleString("en-US",{year:"numeric",month:"short",day:"numeric",hour:"2-digit",minute:"2-digit"}))})]}),(0,p.jsx)(H,{children:(null===(i=e.data.quoteHeadDetails)||void 0===i?void 0:i.object)||(null===(r=e.data.quoteHeadDetails)||void 0===r?void 0:r.description)})]},e.id)}))})]})};var B=n(7206),S=n(8903),M=n(6446),G=n(1159);const R=(0,c.Ay)(M.A)`
  padding: 2rem;
  background-color: #f9f9f9;
`,T=c.Ay.div`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`,N=()=>{const{t:e}=(0,r.Bd)(),{allDocumentsData:t,getAllDocuments:n}=(0,o.u)(),[d,l]=(0,i.useState)(0),[s,c]=(0,i.useState)(10);if((0,i.useEffect)((()=>{!t&&n&&n()}),[n,t]),!t)return(0,p.jsx)(B.A,{});return(0,p.jsxs)(R,{children:[(0,p.jsx)(a.A,{variant:"h4",gutterBottom:!0,children:e("Dashboard")}),(0,p.jsxs)(S.Ay,{container:!0,spacing:3,children:[(0,p.jsxs)(S.Ay,{item:!0,xs:12,md:6,children:[(0,p.jsx)(L,{documents:t.slice(d*s,d*s+s)}),(0,p.jsx)(G.A,{component:"div",count:t.length,page:d,onPageChange:(e,t)=>{l(t)},rowsPerPage:s,onRowsPerPageChange:e=>{c(parseInt(e.target.value,10)),l(0)}})]}),(0,p.jsx)(S.Ay,{item:!0,xs:12,md:6,children:(0,p.jsxs)(T,{children:[(0,p.jsx)(f,{count:(null===t||void 0===t?void 0:t.length)||0}),(0,p.jsx)(b,{documents:t||[]})]})})]})]})}},1009:(e,t,n)=>{n.d(t,{A:()=>i});const i=n(5043).createContext()},1573:(e,t,n)=>{n.d(t,{A:()=>i});const i=n(5043).createContext()},2420:(e,t,n)=>{n.d(t,{A:()=>f});var i=n(8587),r=n(8168),o=n(5043),a=n(8387),d=n(8606),l=n(7266),s=n(6803),c=n(1009),g=n(1573),p=n(2876),h=n(4535),m=n(7056),u=n(2400);function x(e){return(0,u.Ay)("MuiTableCell",e)}const A=(0,m.A)("MuiTableCell",["root","head","body","footer","sizeSmall","sizeMedium","paddingCheckbox","paddingNone","alignLeft","alignCenter","alignRight","alignJustify","stickyHeader"]);var y=n(579);const b=["align","className","component","padding","scope","size","sortDirection","variant"],v=(0,h.Ay)("td",{name:"MuiTableCell",slot:"Root",overridesResolver:(e,t)=>{const{ownerState:n}=e;return[t.root,t[n.variant],t[`size${(0,s.A)(n.size)}`],"normal"!==n.padding&&t[`padding${(0,s.A)(n.padding)}`],"inherit"!==n.align&&t[`align${(0,s.A)(n.align)}`],n.stickyHeader&&t.stickyHeader]}})((e=>{let{theme:t,ownerState:n}=e;return(0,r.A)({},t.typography.body2,{display:"table-cell",verticalAlign:"inherit",borderBottom:t.vars?`1px solid ${t.vars.palette.TableCell.border}`:`1px solid\n    ${"light"===t.palette.mode?(0,l.a)((0,l.X4)(t.palette.divider,1),.88):(0,l.e$)((0,l.X4)(t.palette.divider,1),.68)}`,textAlign:"left",padding:16},"head"===n.variant&&{color:(t.vars||t).palette.text.primary,lineHeight:t.typography.pxToRem(24),fontWeight:t.typography.fontWeightMedium},"body"===n.variant&&{color:(t.vars||t).palette.text.primary},"footer"===n.variant&&{color:(t.vars||t).palette.text.secondary,lineHeight:t.typography.pxToRem(21),fontSize:t.typography.pxToRem(12)},"small"===n.size&&{padding:"6px 16px",[`&.${A.paddingCheckbox}`]:{width:24,padding:"0 12px 0 16px","& > *":{padding:0}}},"checkbox"===n.padding&&{width:48,padding:"0 0 0 4px"},"none"===n.padding&&{padding:0},"left"===n.align&&{textAlign:"left"},"center"===n.align&&{textAlign:"center"},"right"===n.align&&{textAlign:"right",flexDirection:"row-reverse"},"justify"===n.align&&{textAlign:"justify"},n.stickyHeader&&{position:"sticky",top:0,zIndex:2,backgroundColor:(t.vars||t).palette.background.default})})),f=o.forwardRef((function(e,t){const n=(0,p.A)({props:e,name:"MuiTableCell"}),{align:l="inherit",className:h,component:m,padding:u,scope:A,size:f,sortDirection:j,variant:z}=n,$=(0,i.A)(n,b),k=o.useContext(c.A),w=o.useContext(g.A),C=w&&"head"===w.variant;let D;D=m||(C?"th":"td");let H=A;"td"===D?H=void 0:!H&&C&&(H="col");const L=z||w&&w.variant,B=(0,r.A)({},n,{align:l,component:D,padding:u||(k&&k.padding?k.padding:"normal"),size:f||(k&&k.size?k.size:"medium"),sortDirection:j,stickyHeader:"head"===L&&k&&k.stickyHeader,variant:L}),S=(e=>{const{classes:t,variant:n,align:i,padding:r,size:o,stickyHeader:a}=e,l={root:["root",n,a&&"stickyHeader","inherit"!==i&&`align${(0,s.A)(i)}`,"normal"!==r&&`padding${(0,s.A)(r)}`,`size${(0,s.A)(o)}`]};return(0,d.A)(l,x,t)})(B);let M=null;return j&&(M="asc"===j?"ascending":"descending"),(0,y.jsx)(v,(0,r.A)({as:D,ref:t,className:(0,a.A)(S.root,h),"aria-sort":M,scope:H,ownerState:B},$))}))},8354:(e,t,n)=>{n.d(t,{A:()=>o});n(5043);var i=n(9662),r=n(579);const o=(0,i.A)((0,r.jsx)("path",{d:"M18.41 16.59L13.82 12l4.59-4.59L17 6l-6 6 6 6zM6 6h2v12H6z"}),"FirstPage")},7884:(e,t,n)=>{n.d(t,{A:()=>o});n(5043);var i=n(9662),r=n(579);const o=(0,i.A)((0,r.jsx)("path",{d:"M5.59 7.41L10.18 12l-4.59 4.59L7 18l6-6-6-6zM16 6h2v12h-2z"}),"LastPage")}}]);
//# sourceMappingURL=406.c64fa709.chunk.js.map