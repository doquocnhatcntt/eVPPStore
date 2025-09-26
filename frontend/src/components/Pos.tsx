import React, { useEffect, useState } from 'react'
import { searchByBarcode } from '../api'

type Item = { id:string; name:string; price:number; stock_qty:number; sku:string; barcode?:string }
type CartLine = { id:string; name:string; qty:number; price:number; subtotal:number }

export default function Pos(){
  const [cart, setCart] = useState<CartLine[]>([])
  const [lastCode, setLastCode] = useState<string>('')

  useEffect(() => {
    let buf = ''; let t: any = null;
    const onKey = (e: KeyboardEvent) => {
      if (t) clearTimeout(t);
      if (e.key === 'Enter') {
        const code = buf.trim(); buf='';
        if (code) onScan(code);
        return;
      }
      if (e.key.length === 1) buf += e.key;
      t = setTimeout(()=> buf='', 300);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [])

  async function onScan(code: string){
    setLastCode(code)
    try {
      const items: Item[] = await searchByBarcode(code)
      if(items.length){
        const p = items[0]
        setCart(prev => {
          const idx = prev.findIndex(x => x.id === p.id)
          if(idx >= 0){
            const next = [...prev]
            const line = {...next[idx]}
            line.qty += 1
            line.subtotal = +(line.qty * line.price).toFixed(2)
            next[idx] = line
            return next
          } else {
            return [...prev, { id:p.id, name:p.name, qty:1, price:Number(p.price), subtotal:Number(p.price) }]
          }
        })
      } else {
        alert('Không tìm thấy: ' + code)
      }
    } catch (e){
      console.error(e)
      alert('Lỗi API')
    }
  }

  const total = cart.reduce((s, l) => s + l.subtotal, 0)

  return (
    <div style={{maxWidth: 820, margin: '40px auto', fontFamily: 'system-ui, sans-serif'}}>
      <h2>POS demo</h2>
      <p>Mã vừa quét: <b>{lastCode}</b></p>
      <table width="100%" cellPadding={8} style={{borderCollapse:'collapse'}}>
        <thead>
          <tr style={{textAlign:'left', borderBottom:'1px solid #ddd'}}>
            <th>Tên</th><th>SL</th><th>Đơn giá</th><th>Thành tiền</th>
          </tr>
        </thead>
        <tbody>
          {cart.map(line => (
            <tr key={line.id} style={{borderBottom:'1px solid #f0f0f0'}}>
              <td>{line.name}</td>
              <td>{line.qty}</td>
              <td>{line.price.toFixed(2)}</td>
              <td>{line.subtotal.toFixed(2)}</td>
            </tr>
          ))}
        </tbody>
        <tfoot>
          <tr>
            <td colSpan={3} style={{textAlign:'right', fontWeight:700}}>Tổng</td>
            <td style={{fontWeight:700}}>{total.toFixed(2)}</td>
          </tr>
        </tfoot>
      </table>
      <p style={{color:'#666'}}>Gợi ý: thử thêm sản phẩm ở màn hình quản trị (chưa làm), hoặc gọi POST /api/products để tạo.</p>
    </div>
  )
}
