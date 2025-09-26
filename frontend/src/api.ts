const base = '/api';

export async function listProducts(q = '', page = 0){
  const res = await fetch(`${base}/products?q=${encodeURIComponent(q)}&page=${page}`);
  if(!res.ok){
    const txt = await res.text().catch(()=> '');
    throw new Error(`API ${res.status}: ${txt}`);
  }
  return res.json();
}

export async function searchByBarcode(code: string){
  const res = await fetch(`${base}/products?barcode=${encodeURIComponent(code)}`);
  if(!res.ok){
    const txt = await res.text().catch(()=> '');
    throw new Error(`API ${res.status}: ${txt}`);
  }
  return res.json();
}

export async function createProduct(p: any){
  const res = await fetch(`${base}/products`, {
    method: 'POST',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify(p),
  });
  if(!res.ok){
    const txt = await res.text().catch(()=> '');
    throw new Error(`API ${res.status}: ${txt}`);
  }
  return res.json();
}

export async function updateProduct(id: string, p: any){
  const res = await fetch(`${base}/products/${id}`, {
    method: 'PUT',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify(p),
  });
  if(!res.ok){
    const txt = await res.text().catch(()=> '');
    throw new Error(`API ${res.status}: ${txt}`);
  }
  return res.json();
}

export async function deleteProduct(id: string){
  const res = await fetch(`${base}/products/${id}`, { method: 'DELETE' });
  if(!res.ok){
    const txt = await res.text().catch(()=> '');
    throw new Error(`API ${res.status}: ${txt}`);
  }
}
