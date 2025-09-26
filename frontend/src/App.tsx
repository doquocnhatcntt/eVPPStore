import React, { useState } from 'react'
import Pos from './components/Pos'
import ProductList from './components/ProductList'

export default function App(){
  const [tab, setTab] = useState<'pos'|'products'>('pos')
  return (
    <div>
      <div style={{display:'flex', gap:8, padding:12, borderBottom:'1px solid #eee'}}>
        <button onClick={()=>setTab('pos')} disabled={tab==='pos'}>POS</button>
        <button onClick={()=>setTab('products')} disabled={tab==='products'}>Sản phẩm</button>
      </div>
      {tab === 'pos' ? <Pos /> : <ProductList />}
    </div>
  )
}