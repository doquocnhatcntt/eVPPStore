import React, { useEffect, useState } from 'react'
import { listProducts, createProduct, updateProduct, deleteProduct } from '../api'
import ProductForm from './ProductForm'

type Product = { id:string; sku:string; barcode?:string; name:string; price:number; stock_qty:number }

export default function ProductList(){
  const [items, setItems] = useState<Product[]>([])
  const [q, setQ] = useState('')
  const [loading, setLoading] = useState(false)
  const [editing, setEditing] = useState<Product | null>(null)
  const [creating, setCreating] = useState(false)
  const [err, setErr] = useState('')

  async function load(){
    setLoading(true); setErr('')
    try{
      const data = await listProducts(q)
      setItems(data)
    }catch(e:any){
      setErr(e?.message || 'Error')
    }finally{
      setLoading(false)
    }
  }

  useEffect(() => { load() }, [])

  async function onCreate(p:any){
    await createProduct(p)
    setCreating(false)
    await load()
  }
  async function onUpdate(p:any){
    if(!editing) return
    await updateProduct(editing.id, p)
    setEditing(null)
    await load()
  }
  async function onDelete(id:string){
    if(!confirm('Xóa sản phẩm này?')) return
    await deleteProduct(id)
    await load()
  }

  return (
    <div style={{maxWidth: 960, margin: '20px auto'}}>
      <div style={{display:'flex', gap:8, marginBottom:12}}>
        <input placeholder="Tìm theo tên/SKU" value={q} onChange={e=>setQ(e.target.value)} />
        <button onClick={load}>Tìm</button>
        <button onClick={()=>{ setCreating(true); setEditing(null); }}>+ Thêm sản phẩm</button>
      </div>

      {err && <div style={{color:'crimson', marginBottom:12}}>{err}</div>}
      {creating && <ProductForm onSubmit={onCreate} onCancel={()=>setCreating(false)} />}
      {editing && <ProductForm initial={editing} onSubmit={onUpdate} onCancel={()=>setEditing(null)} />}

      {loading ? <div>Đang tải…</div> : (
        <table width="100%" cellPadding={8} style={{borderCollapse:'collapse', marginTop:16}}>
          <thead>
            <tr style={{textAlign:'left', borderBottom:'1px solid #ddd'}}>
              <th>SKU</th><th>Barcode</th><th>Tên</th><th>Giá</th><th>Tồn</th><th></th>
            </tr>
          </thead>
          <tbody>
            {items.map(p=>(
              <tr key={p.id} style={{borderBottom:'1px solid #f0f0f0'}}>
                <td>{p.sku}</td>
                <td>{p.barcode || '-'}</td>
                <td>{p.name}</td>
                <td>{Number(p.price).toFixed(2)}</td>
                <td>{p.stock_qty}</td>
                <td style={{whiteSpace:'nowrap'}}>
                  <button onClick={()=>{ setEditing(p); setCreating(false); }}>Sửa</button>{' '}
                  <button onClick={()=>onDelete(p.id)}>Xóa</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  )
}