"use strict";(self.webpackChunk_N_E=self.webpackChunk_N_E||[]).push([[794],{2440:function(e,t,i){i.d(t,{BR:function(){return x},iT:function(){return u},ko:function(){return b},s5:function(){return v},t3:function(){return w}});var s=i(5893),a=i(7294),r=i(964);let n="#4fa94d",l={"aria-busy":!0,role:"progressbar"},o=(0,r.ZP).div`
  display: ${e=>e.$visible?"flex":"none"};
`,c="http://www.w3.org/2000/svg",d=(0,r.F4)`
12.5% {
  stroke-dasharray: ${33.98873199462888}px, ${242.776657104492}px;
  stroke-dashoffset: -${26.70543228149412}px;
}
43.75% {
  stroke-dasharray: ${84.97182998657219}px, ${242.776657104492}px;
  stroke-dashoffset: -${84.97182998657219}px;
}
100% {
  stroke-dasharray: ${2.42776657104492}px, ${242.776657104492}px;
  stroke-dashoffset: -${240.34889053344708}px;
}
`;(0,r.ZP).path`
  stroke-dasharray: ${2.42776657104492}px, ${242.776657104492};
  stroke-dashoffset: 0;
  animation: ${d} ${1.6}s linear infinite;
`;let h=e=>["M"+e+" 0c0-9.94-8.06",e,e,e].join("-"),p=(e,t,i)=>{let s=Math.max(e,t),a=-i-s/2+1,r=2*i+s;return[a,a,r,r].join(" ")},u=({height:e=80,width:t=80,color:i=n,secondaryColor:a=n,ariaLabel:r="oval-loading",wrapperStyle:c,wrapperClass:d,visible:u=!0,strokeWidth:x=2,strokeWidthSecondary:k})=>(0,s.jsx)(o,{style:c,$visible:u,className:d,"data-testid":"oval-loading","aria-label":r,...l,children:(0,s.jsx)("svg",{width:t,height:e,viewBox:p(Number(x),Number(k||x),20),xmlns:"http://www.w3.org/2000/svg",stroke:i,"data-testid":"oval-svg",children:(0,s.jsx)("g",{fill:"none",fillRule:"evenodd",children:(0,s.jsxs)("g",{transform:"translate(1 1)",strokeWidth:Number(k||x),"data-testid":"oval-secondary-group",children:[(0,s.jsx)("circle",{strokeOpacity:".5",cx:"0",cy:"0",r:20,stroke:a,strokeWidth:x}),(0,s.jsx)("path",{d:h(20),children:(0,s.jsx)("animateTransform",{attributeName:"transform",type:"rotate",from:"0 0 0",to:"360 0 0",dur:"1s",repeatCount:"indefinite"})})]})})})}),x=({height:e=80,width:t=80,radius:i=1,color:a=n,ariaLabel:r="puff-loading",wrapperStyle:d,wrapperClass:h,visible:p=!0})=>(0,s.jsx)(o,{style:d,$visible:p,className:h,"data-testid":"puff-loading","aria-label":r,...l,children:(0,s.jsx)("svg",{width:t,height:e,viewBox:"0 0 44 44",xmlns:c,stroke:a,"data-testid":"puff-svg",children:(0,s.jsxs)("g",{fill:"none",fillRule:"evenodd",strokeWidth:"2",children:[(0,s.jsxs)("circle",{cx:"22",cy:"22",r:i,children:[(0,s.jsx)("animate",{attributeName:"r",begin:"0s",dur:"1.8s",values:"1; 20",calcMode:"spline",keyTimes:"0; 1",keySplines:"0.165, 0.84, 0.44, 1",repeatCount:"indefinite"}),(0,s.jsx)("animate",{attributeName:"strokeOpacity",begin:"0s",dur:"1.8s",values:"1; 0",calcMode:"spline",keyTimes:"0; 1",keySplines:"0.3, 0.61, 0.355, 1",repeatCount:"indefinite"})]}),(0,s.jsxs)("circle",{cx:"22",cy:"22",r:i,children:[(0,s.jsx)("animate",{attributeName:"r",begin:"-0.9s",dur:"1.8s",values:"1; 20",calcMode:"spline",keyTimes:"0; 1",keySplines:"0.165, 0.84, 0.44, 1",repeatCount:"indefinite"}),(0,s.jsx)("animate",{attributeName:"strokeOpacity",begin:"-0.9s",dur:"1.8s",values:"1; 0",calcMode:"spline",keyTimes:"0; 1",keySplines:"0.3, 0.61, 0.355, 1",repeatCount:"indefinite"})]})]})})}),k=[0,30,60,90,120,150,180,210,240,270,300,330],g=(0,r.F4)`
to {
   transform: rotate(360deg);
 }
`,f=(0,r.ZP).svg`
  animation: ${g} 0.75s steps(12, end) infinite;
  animation-duration: 0.75s;
`,m=(0,r.ZP).polyline`
  stroke-width: ${e=>e.width}px;
  stroke-linecap: round;

  &:nth-child(12n + 0) {
    stroke-opacity: 0.08;
  }

  &:nth-child(12n + 1) {
    stroke-opacity: 0.17;
  }

  &:nth-child(12n + 2) {
    stroke-opacity: 0.25;
  }

  &:nth-child(12n + 3) {
    stroke-opacity: 0.33;
  }

  &:nth-child(12n + 4) {
    stroke-opacity: 0.42;
  }

  &:nth-child(12n + 5) {
    stroke-opacity: 0.5;
  }

  &:nth-child(12n + 6) {
    stroke-opacity: 0.58;
  }

  &:nth-child(12n + 7) {
    stroke-opacity: 0.66;
  }

  &:nth-child(12n + 8) {
    stroke-opacity: 0.75;
  }

  &:nth-child(12n + 9) {
    stroke-opacity: 0.83;
  }

  &:nth-child(12n + 11) {
    stroke-opacity: 0.92;
  }
`,v=({strokeColor:e=n,strokeWidth:t="5",animationDuration:i="0.75",width:r="96",visible:o=!0,ariaLabel:d="rotating-lines-loading"})=>{let h=(0,a.useCallback)(()=>k.map(e=>(0,s.jsx)(m,{points:"24,12 24,4",width:t,transform:`rotate(${e}, 24, 24)`},e)),[t]);return o?(0,s.jsx)(f,{xmlns:c,viewBox:"0 0 48 48",width:r,stroke:e,speed:i,"data-testid":"rotating-lines-svg","aria-label":d,...l,children:h()}):null},y=(0,r.F4)`
to {
   stroke-dashoffset: 136;
 }
`;(0,r.ZP).polygon`
  stroke-dasharray: 17;
  animation: ${y} 2.5s cubic-bezier(0.35, 0.04, 0.63, 0.95) infinite;
`,(0,r.ZP).svg`
  transform-origin: 50% 65%;
`;let b=({visible:e=!0,height:t="80",width:i="80",wrapperClass:a="",wrapperStyle:r={},ariaLabel:n="progress-bar-loading",borderColor:o="#F4442E",barColor:d="#51E5FF"})=>e?(0,s.jsxs)("svg",{width:i,height:t,xmlns:c,viewBox:"0 0 100 100",preserveAspectRatio:"xMidYMid",className:a,style:r,"aria-label":n,"data-testid":"progress-bar-svg",...l,children:[(0,s.jsx)("defs",{children:(0,s.jsx)("clipPath",{x:"0",y:"0",width:"100",height:"100",id:"lds-progress-cpid-5009611b8a418",children:(0,s.jsxs)("rect",{x:"0",y:"0",width:"66.6667",height:"100",children:[(0,s.jsx)("animate",{attributeName:"width",calcMode:"linear",values:"0;100;100",keyTimes:"0;0.5;1",dur:"1",begin:"0s",repeatCount:"indefinite"}),(0,s.jsx)("animate",{attributeName:"x",calcMode:"linear",values:"0;0;100",keyTimes:"0;0.5;1",dur:"1",begin:"0s",repeatCount:"indefinite"})]})})}),(0,s.jsx)("path",{fill:"none",strokeWidth:"2.7928",d:"M82,63H18c-7.2,0-13-5.8-13-13v0c0-7.2,5.8-13,13-13h64c7.2,0,13,5.8,13,13v0C95,57.2,89.2,63,82,63z",stroke:o}),(0,s.jsx)("path",{d:"M81.3,58.7H18.7c-4.8,0-8.7-3.9-8.7-8.7v0c0-4.8,3.9-8.7,8.7-8.7h62.7c4.8,0,8.7,3.9,8.7,8.7v0C90,54.8,86.1,58.7,81.3,58.7z",fill:d,clipPath:"url(#lds-progress-cpid-5009611b8a418)"})]}):null,w=({visible:e=!0,width:t="80",height:i="80",wrapperClass:a="",wrapperStyle:r={},ariaLabel:n="hourglass-loading",colors:o=["#306cce","#72a1ed"]})=>e?(0,s.jsxs)("svg",{width:t,height:i,xmlns:"http://www.w3.org/2000/svg",viewBox:"0 0 350 350",preserveAspectRatio:"xMidYMid",className:a,style:r,"aria-label":n,"data-testid":"hourglass-svg",...l,children:[(0,s.jsx)("animateTransform",{attributeName:"transform",type:"rotate",values:"0; 0; -30; 360; 360",keyTimes:"0; 0.40; 0.55; 0.65; 1",dur:"3s",begin:"0s",calcMode:"linear",repeatCount:"indefinite"}),(0,s.jsxs)("g",{children:[(0,s.jsx)("path",{fill:o[0],stroke:o[0],d:"M324.658,20.572v-2.938C324.658,7.935,316.724,0,307.025,0H40.313c-9.699,0-17.635,7.935-17.635,17.634v2.938     c0,9.699,7.935,17.634,17.635,17.634h6.814c3.5,0,3.223,3.267,3.223,4.937c0,19.588,8.031,42.231,14.186,56.698     c12.344,29.012,40.447,52.813,63.516,69.619c4.211,3.068,3.201,5.916,0.756,7.875c-22.375,17.924-51.793,40.832-64.271,70.16     c-6.059,14.239-13.934,36.4-14.18,55.772c-0.025,1.987,0.771,5.862-3.979,5.862h-6.064c-9.699,0-17.635,7.936-17.635,17.634v2.94     c0,9.698,7.935,17.634,17.635,17.634h266.713c9.699,0,17.633-7.936,17.633-17.634v-2.94c0-9.698-7.934-17.634-17.633-17.634     h-3.816c-7,0-6.326-5.241-6.254-7.958c0.488-18.094-4.832-38.673-12.617-54.135c-17.318-34.389-44.629-56.261-61.449-68.915     c-3.65-2.745-4.018-6.143,0-8.906c17.342-11.929,44.131-34.526,61.449-68.916c8.289-16.464,13.785-38.732,12.447-57.621     c-0.105-1.514-0.211-4.472,3.758-4.472h6.482C316.725,38.206,324.658,30.272,324.658,20.572z M270.271,93.216     c-16.113,31.998-41.967,54.881-64.455,68.67c-1.354,0.831-3.936,2.881-3.936,8.602v6.838c0,6.066,2.752,7.397,4.199,8.286     c22.486,13.806,48.143,36.636,64.191,68.508c7.414,14.727,11.266,32.532,10.885,46.702c-0.078,2.947,1.053,8.308-6.613,8.308     H72.627c-6.75,0-6.475-3.37-6.459-5.213c0.117-12.895,4.563-30.757,12.859-50.255c14.404-33.854,44.629-54.988,64.75-67.577     c0.896-0.561,2.629-1.567,2.629-6.922v-10.236c0-5.534-2.656-7.688-4.057-8.57c-20.098-12.688-49.256-33.618-63.322-66.681     c-8.383-19.702-12.834-37.732-12.861-50.657c-0.002-1.694,0.211-4.812,3.961-4.812h206.582c4.168,0,4.127,3.15,4.264,4.829     C282.156,57.681,278.307,77.257,270.271,93.216z"}),(0,s.jsxs)("g",{children:[(0,s.jsx)("path",{fill:o[1],stroke:o[1],d:"M169.541,196.2l-68.748,86.03c-2.27,2.842-1.152,5.166,2.484,5.166h140.781c3.637,0,4.756-2.324,2.484-5.166     l-68.746-86.03C175.525,193.358,171.811,193.358,169.541,196.2z"}),(0,s.jsx)("animate",{attributeName:"opacity",values:"0; 0; 1; 1; 0; 0",keyTimes:"0; 0.1; 0.4; 0.6; 0.61; 1",dur:"3s",repeatCount:"indefinite"})]}),(0,s.jsxs)("g",{children:[(0,s.jsx)("path",{fill:o[1],stroke:o[1],d:"M168.986,156.219c2.576,2.568,6.789,2.568,9.363,0l34.576-34.489c2.574-2.568,1.707-4.67-1.932-4.67H136.34     c-3.637,0-4.506,2.102-1.932,4.67L168.986,156.219z"}),(0,s.jsx)("animate",{attributeName:"opacity",values:"1; 1; 0; 0; 1; 1",keyTimes:"0; 0.1; 0.4; 0.65; 0.66; 1",dur:"3s",repeatCount:"indefinite"})]})]})]}):null}}]);