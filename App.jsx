import { useState, useEffect } from 'react'
import './App.css'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Home from './page/Home'
import AcercaDe from './page/AcercaDe'
import GaleriaDeProductos from './page/GaleriaDeProductos'
import Contacto from './page/Contacto'
import NotFound from './page/NotFound'
import Products from './components/Products'

function App() {
  
  const [cart, setCart] = useState([])
  const [productos, setProductos] = useState([])
  const [cargando, setCargando] = useState(true)
  const [error, setError] = useState(false)

  useEffect(()=>{ 
    fetch('/data/data.json')
    .then(respuesta => respuesta.json())
    .then(datos => {
      setTimeout(()=>{
        setProductos(datos)
        setCargando(false)
      },2000)
    })
    .catch(error => {console.log('Error',error)
      setCargando(false)
      setError(true)
    })

  },[])


  const handlerAddToCart = (product) => {
    const productInCart = cart.find((item)=> item.id === product.id);
    if(productInCart){
      setCart(cart.map((item => item.id === product.id ? {... item, quantity:item.quantity+1} : item)))
    }else{
      setCart([...cart, {...product,quantity:1}]);
    }
  }

  const handlerDeleteFromCart = (product) => {
    setCart(prevCart => {
      return prevCart.map(item => {
        if(item.id === product.id) {
          if(item.quantity > 1) {
            return {...item, quantity : item.quantity -1};
          }else {
            return null;
          }
        }else{
          return item;
        }
      }).filter(item => item !== null);
    });
  };


  return (
    
    <Router>
      <Routes>

        <Route path='/' element={<Home borrarProducto={handlerDeleteFromCart} agregarCarrito={handlerAddToCart} cart={cart} productos={productos} cargando={cargando}/>}/>

        <Route path='/acercade' element={<AcercaDe borrarProducto={handlerDeleteFromCart} cart={cart}/>} />

        <Route path='/productos' element={<GaleriaDeProductos borrarProducto={handlerDeleteFromCart} agregarCarrito={handlerAddToCart} cart={cart} productos={productos} cargando={cargando}/>} />

        <Route path='/contacto' element={<Contacto borrarProducto={handlerDeleteFromCart} cart={cart}/>} />

        <Route path='*' element={<NotFound />} />
        
      </Routes>  
    </Router>    
  
  )
}

export default App
