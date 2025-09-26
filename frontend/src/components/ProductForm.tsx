import React, { useState } from 'react'

type Product = { id?: string; sku: string; barcode?: string; name: string; price: number; stock_qty: number }
type Props = {
  initial?: Product
  onSubmit: (p: Product) => Promise<void>
  onCancel: () => void
}

export default function ProductForm({ initial, onSubmit, onCancel }: Props){
  const [form, setForm] = useState<Product>(initial ?? { sku:'', barcode:'', name:'', price:0, stock_qty:0 })
  const [busy, setBusy] = useState(false)
  const [err, setErr] = useState<string>('')

  const set = (k: keyof Product) => (e: React.ChangeEvent<HTMLInputElement>) => {
    const v = (k === 'price' || k === 'stock_qty') ? Number(e.target.value) : e.target.value
    setForm(prev => ({ ...prev, [k]: v }))
  }

  async function submit(e: React.FormEvent){
    e.preventDefault()
    setBusy(true); setErr('')
    try {
      await onSubmit(form)
    } catch (e:any) {
      setErr(e?.message || 'Error')
    } finally {
      setBusy(false)
    }
  }

  return (
    <form onSubmit={submit} style={{display:'grid', gap:12, maxWidth:520, margin:'12px 0'}}>
      {err && <div style={{color:'crimson'}}>{err}</div>}
      <input placeholder="SKU *" value={form.sku} onChange={set('sku')} required />
      <input placeholder="Barcode" value={form.barcode||''} onChange={set('barcode')} />
      <input placeholder="Tên sản phẩm *" value={form.name} onChange={set('name')} required />
      <input placeholder="Giá *" type="number" step="0.01" value={form.price} onChange={set('price')} required />
      <input placeholder="Tồn kho *" type="number" value={form.stock_qty} onChange={set('stock_qty')} required />
      <div style={{display:'flex', gap:8}}>
        <button disabled={busy} type="submit">{initial ? 'Cập nhật' : 'Tạo mới'}</button>
        <button type="button" onClick={onCancel}>Hủy</button>
      </div>
    </form>
  )
}